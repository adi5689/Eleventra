import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseApi } from "../src/lib/supabase-transport.js";

const user = {
  id: "6e82755f-6036-40a6-b257-354c3530c8af",
  email: "admin@example.com",
};

test("Supabase adapter rejects unauthenticated and non-staff users before data access", async () => {
  for (const account of [null, { id: "someone-else" }]) {
    let signedOut = false;
    const api = createSupabaseApi({
      auth: {
        getUser: async () => ({ data: { user: account } }),
        signOut: async () => {
          signedOut = true;
          return {};
        },
      },
      from: () => assert.fail("Must not query private data"),
    });
    await assert.rejects(
      api("/api/admin/enquiries"),
      (e) => e.status === (account ? 403 : 401),
    );
    assert.equal(signedOut, Boolean(account));
  }
});

test("Supabase adapter forwards public submissions without requiring a staff session", async () => {
  const payload = { id: "enquiry-id", student: "Test student" };
  const api = createSupabaseApi({
    functions: {
      invoke: async (name, options) => {
        assert.equal(name, "enquiries");
        assert.deepEqual(options.body, { action: "submit", payload });
        return { data: { saved: true } };
      },
    },
  });
  assert.deepEqual(
    await api("/api/enquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    { saved: true },
  );
});

test("Supabase function rate-limit errors retain their message and HTTP status", async () => {
  const api = createSupabaseApi({
    functions: {
      invoke: async () => ({
        error: {
          context: Response.json(
            { error: "Try again later." },
            { status: 429 },
          ),
        },
      }),
    },
  });
  await assert.rejects(
    api("/api/enquiries", { method: "POST", body: "{}" }),
    (e) => e.status === 429 && e.message === "Try again later.",
  );
});

test("Supabase listing preserves pagination, summary, row shape and quoted search syntax", async () => {
  const calls = [];
  const client = createClient("https://test.supabase.co", "test-key", {
    auth: { persistSession: false },
    global: {
      fetch: async (input, options) => {
        const url = new URL(input);
        calls.push({ url, options });
        if (url.pathname.includes("/functions/"))
          return Response.json({ configured: false });
        if (options.method === "HEAD")
          return new Response(null, { headers: { "Content-Range": "0-0/7" } });
        return Response.json(
          [
            {
              id: "record-id",
              data: { student: "Student", help: [] },
              status: "new",
              created_at: "2026-10-28T00:00:00Z",
              sheet_synced_at: null,
            },
          ],
          { headers: { "Content-Range": "20-20/21" } },
        );
      },
    },
  });
  client.auth.getUser = async () => ({ data: { user }, error: null });
  const search = 'Mumbai),status.eq.closed,"_%';
  const api = createSupabaseApi(client);
  const result = await api(
    "/api/admin/enquiries?" +
      new URLSearchParams({ search, status: "new", page: "2" }),
  );
  const listing = calls.find((call) => call.options.method === "GET");
  assert.equal(listing.url.searchParams.get("offset"), "20");
  assert.equal(listing.url.searchParams.get("limit"), "20");
  assert.equal(listing.url.searchParams.get("status"), "eq.new");
  const pattern = JSON.stringify("%" + search.replace(/[\\%_]/g, "\\$&") + "%");
  assert.equal(
    listing.url.searchParams.get("or"),
    "(" +
      ["student", "email", "phone", "city"]
        .map((key) => `data->>${key}.ilike.${pattern}`)
        .join(",") +
      ")",
  );
  assert.equal(result.total, 21);
  assert.equal(result.page, 2);
  assert.equal(result.summary.pending, 7);
  assert.equal(result.rows[0].student, "Student");
  assert.equal(result.rows[0].createdAt, "2026-10-28T00:00:00Z");
});

test("Supabase status updates reject unsupported values before sending a write", async () => {
  const api = createSupabaseApi({
    auth: { getUser: async () => ({ data: { user } }) },
    from: () => assert.fail("Must not send invalid update"),
  });
  await assert.rejects(
    api("/api/admin/enquiries/6e82755f-6036-40a6-b257-354c3530c8af", {
      method: "PATCH",
      body: JSON.stringify({ status: "deleted" }),
    }),
    (e) => e.status === 400,
  );
});

for (const source of ["home-widget", "career-assessment"]) test(`${source} tab filters database rows and all summary counts by source`, async () => {
  const queries = [];
  const client = createClient("https://test.supabase.co", "test-key", {
    auth: { persistSession: false },
    global: { fetch: async (input, options) => {
      const url = new URL(input);
      if (url.pathname.includes("/functions/")) return Response.json({ configured: false });
      queries.push(url);
      return options.method === "HEAD"
        ? new Response(null, { headers: { "Content-Range": "0-0/2" } })
        : Response.json([], { headers: { "Content-Range": "*/0" } });
    } },
  });
  client.auth.getUser = async () => ({ data: { user }, error: null });
  await createSupabaseApi(client)(`/api/admin/enquiries?source=${source}&status=new&page=2`);
  assert.equal(queries.length, 5);
  for (const url of queries) assert.equal(url.searchParams.get("data->>source"), `eq.${source}`);
  assert.equal(queries[0].searchParams.get("status"), "eq.new");
  assert.equal(queries[0].searchParams.get("offset"), "20");
});

test("contact enquiries include legacy records and apply source filtering to summary counts", async () => {
  const queries = [];
  const client = createClient("https://test.supabase.co", "test-key", {
    auth: { persistSession: false },
    global: { fetch: async (input, options) => {
      const url = new URL(input);
      if (url.pathname.includes("/functions/")) return Response.json({ configured: false });
      queries.push(url);
      return options.method === "HEAD"
        ? new Response(null, { headers: { "Content-Range": "0-0/2" } })
        : Response.json([], { headers: { "Content-Range": "*/0" } });
    } },
  });
  client.auth.getUser = async () => ({ data: { user }, error: null });
  await createSupabaseApi(client)("/api/admin/enquiries?source=contact-form&search=Alice");
  assert.equal(queries.length, 5);
  for (const url of queries) assert.ok(url.searchParams.getAll("or").includes("(data->>source.eq.contact-form,data->>source.is.null)"));
  assert.equal(queries[0].searchParams.getAll("or").length, 2);
});
