// Run with: npx deno test --allow-env --no-config --no-lock --node-modules-dir=none tests/supabase-edge.test.ts
import assert from "node:assert/strict";

Deno.test("Edge Function validates public input and protects staff actions", async (t) => {
  const originalServe = Deno.serve;
  const originalFetch = globalThis.fetch;
  const environment = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "APP_ORIGINS", "RATE_LIMIT_SALT", "CRON_SECRET", "GOOGLE_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_JSON"];
  const previous = new Map(environment.map((key) => [key, Deno.env.get(key)]));
  let handler: (request: Request) => Promise<Response>;
  let allowRate = true;
  const stored = new Map<string, Record<string, unknown>>();
  const background: Promise<unknown>[] = [];
  const runtime = globalThis as typeof globalThis & { EdgeRuntime?: { waitUntil: (promise: Promise<unknown>) => void } };
  const previousRuntime = runtime.EdgeRuntime;
  try {
    Deno.env.set("SUPABASE_URL", "https://test.supabase.co");
    Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "fake-service-key");
    Deno.env.set("APP_ORIGINS", "https://website.example");
    Deno.env.set("RATE_LIMIT_SALT", "test-salt");
    Deno.env.set("CRON_SECRET", "private-cron-token");
    Deno.env.delete("GOOGLE_SHEET_ID");
    Deno.env.delete("GOOGLE_SERVICE_ACCOUNT_JSON");
    runtime.EdgeRuntime = { waitUntil: (promise) => background.push(promise) };
    Object.defineProperty(Deno, "serve", { configurable: true, value: (callback: typeof handler) => { handler = callback; } });
    globalThis.fetch = async (input, options) => {
      const url = new URL(String(input));
      if (url.pathname === "/auth/v1/user") {
        const token = new Headers(options?.headers).get("Authorization");
        if (token === "Bearer staff-token") return Response.json({ id: "6e82755f-6036-40a6-b257-354c3530c8af", email: "staff@example.com" });
        if (token === "Bearer other-user") return Response.json({ id: "00000000-0000-0000-0000-000000000002" });
        return Response.json({ message: "Invalid token" }, { status: 401 });
      }
      if (url.pathname.endsWith("/rpc/consume_enquiry_limit")) return Response.json(allowRate);
      if (url.pathname.endsWith("/enquiries")) {
        if (options?.method === "POST") {
          const row = JSON.parse(String(options.body));
          if (!stored.has(row.id)) stored.set(row.id, row.data);
          return new Response(null, { status: 201 });
        }
        return Response.json({ data: stored.get(url.searchParams.get("id")!.replace("eq.", "")) });
      }
      if (url.pathname.endsWith("/enquiry_sync_state")) return Response.json({ locked_until: "-infinity", last_error: null, last_success_at: null });
      throw new Error("Unexpected external request: " + url.pathname);
    };
    await import("../supabase/functions/enquiries/index.ts");
    Object.defineProperty(Deno, "serve", { configurable: true, value: originalServe });
    const call = (body: unknown, extra: Record<string, string> = {}) => handler(new Request("https://test.supabase.co/functions/v1/enquiries", {
      method: "POST", headers: { Origin: "https://website.example", "Content-Type": "application/json", ...extra }, body: JSON.stringify(body),
    }));
    const payload = {
      id: "00000000-0000-4000-8000-000000000001", student: "Test student",
      parent: "", phone: "0123456789", email: "test@example.com", city: "",
      stage: "Graduate", service: "", help: [], message: "Test", website: "",
    };
    await t.step("invalid input, honeypot, foreign origin and oversized requests are rejected", async () => {
      assert.equal((await call({ action: "submit", payload: { ...payload, email: "invalid" } })).status, 400);
      assert.equal((await call({ action: "submit", payload: { ...payload, website: "spam" } })).status, 400);
      assert.equal((await call({ action: "submit", payload }, { Origin: "https://other.example" })).status, 403);
      assert.equal((await call({ action: "submit", payload: { ...payload, message: "x".repeat(25000) } })).status, 400);
      assert.equal(stored.size, 0);
    });
    await t.step("JWT verification rejects anonymous, invalid and non-staff callers", async () => {
      assert.equal((await call({ action: "state" })).status, 401);
      assert.equal((await call({ action: "state" }, { Authorization: "Bearer invalid" })).status, 401);
      assert.equal((await call({ action: "state" }, { Authorization: "Bearer other-user" })).status, 403);
      assert.equal((await call({ action: "state" }, { Authorization: "Bearer staff-token" })).status, 200);
    });
    await t.step("submissions are saved once and changed retries cannot overwrite", async () => {
      assert.equal((await call({ action: "submit", payload })).status, 201);
      assert.equal((await call({ action: "submit", payload })).status, 201);
      assert.equal((await call({ action: "submit", payload: { ...payload, student: "Changed" } })).status, 409);
      assert.equal(stored.size, 1);
      assert.equal(stored.get(payload.id)?.student, "Test student");
      await Promise.all(background);
    });
    await t.step("home widget saves four fields without inventing a current level", async () => {
      const quick = { id: "00000000-0000-4000-8000-000000000003", source: "home-widget", student: "Quick enquiry", email: "quick@example.com", phone: "+918169055389", service: "planning", website: "" };
      assert.equal((await call({ action: "submit", payload: quick })).status, 201);
      assert.equal(stored.get(quick.id)?.stage, "");
      assert.equal(stored.get(quick.id)?.source, "home-widget");
      assert.equal(stored.get(quick.id)?.service, "planning");
      assert.deepEqual(stored.get(quick.id)?.help, []);
      assert.equal((await call({ action: "submit", payload: { ...quick, service: "invalid" } })).status, 400);
      await Promise.all(background);
    });
    await t.step("career assessment bookings retain their source and career context", async () => {
      const booking = { ...payload, id: "00000000-0000-4000-8000-000000000004", source: "career-assessment", service: "discovery", message: "Career of interest: Engineering" };
      assert.equal((await call({ action: "submit", payload: booking })).status, 201);
      assert.equal(stored.get(booking.id)?.source, "career-assessment");
      assert.equal(stored.get(booking.id)?.message, booking.message);
      await Promise.all(background);
    });
    await t.step("rate limits stop writes and cron token cannot read state", async () => {
      allowRate = false;
      assert.equal((await call({ action: "submit", payload })).status, 429);
      assert.equal((await call({ action: "state" }, { "x-cron-secret": "private-cron-token" })).status, 401);
      assert.equal((await call({ action: "sync" }, { "x-cron-secret": "wrong" })).status, 401);
      assert.equal((await call({ action: "sync" }, { "x-cron-secret": "private-cron-token" })).status, 200);
    });
  } finally {
    Object.defineProperty(Deno, "serve", { configurable: true, value: originalServe });
    globalThis.fetch = originalFetch;
    runtime.EdgeRuntime = previousRuntime;
    for (const [key, value] of previous) {
      if (value === undefined) Deno.env.delete(key); else Deno.env.set(key, value);
    }
  }
});
