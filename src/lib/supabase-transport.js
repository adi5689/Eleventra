const adminId = "6e82755f-6036-40a6-b257-354c3530c8af";
const failure = (message, status = 500) =>
  Object.assign(new Error(message), { status });

function checked(result) {
  if (result.error) {
    if (result.error.name === "AbortError") throw result.error;
    throw failure("Unable to load or save enquiries. Please try again.");
  }
  return result;
}

export function createSupabaseApi(client) {
  async function session() {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) throw failure("Please sign in to continue.", 401);
    if (data.user.id !== adminId) {
      await client.auth.signOut({ scope: "local" });
      throw failure("This account does not have staff access.", 403);
    }
    return { username: data.user.email };
  }

  async function invoke(action, payload, signal) {
    const { data, error } = await client.functions.invoke("enquiries", {
      body: { action, payload },
      signal,
    });
    if (error) {
      const response = error.context;
      const body = await response?.json?.().catch(() => null);
      throw failure(
        body?.error || "Unable to reach the enquiry service. Please try again.",
        response?.status || 503,
      );
    }
    return data;
  }

  return async function supabaseApi(path, options = {}) {
    const url = new URL(path, "https://eleventra.invalid");
    const method = options.method || "GET";
    const payload = options.body ? JSON.parse(options.body) : undefined;

    if (url.pathname === "/api/enquiries" && method === "POST") {
      return invoke("submit", payload, options.signal);
    }
    if (url.pathname === "/api/admin/login" && method === "POST") {
      const { error } = await client.auth.signInWithPassword({
        email: payload.username.trim(),
        password: payload.password,
      });
      if (error) throw failure("The email or password is incorrect.", 401);
      return session();
    }
    if (url.pathname === "/api/admin/logout" && method === "POST") {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw failure("Unable to sign out. Please try again.");
      return null;
    }
    if (url.pathname === "/api/admin/session") return session();

    await session();
    if (url.pathname === "/api/admin/sync" && method === "POST") {
      return invoke("sync", undefined, options.signal);
    }
    const id = url.pathname.match(
      /^\/api\/admin\/enquiries\/([\da-f-]{36})$/i,
    )?.[1];
    if (id && method === "PATCH") {
      if (!["new", "contacted", "closed"].includes(payload.status)) {
        throw failure("Choose a valid status.", 400);
      }
      const { data } = checked(
        await client
          .from("enquiries")
          .update({ status: payload.status })
          .eq("id", id)
          .select("id")
          .single(),
      );
      if (!data) throw failure("Enquiry not found.", 404);
      return { saved: true };
    }
    if (url.pathname !== "/api/admin/enquiries" || method !== "GET") {
      throw failure("API endpoint not found.", 404);
    }

    const page = Math.max(
      1,
      Math.min(100000, Number.parseInt(url.searchParams.get("page"), 10) || 1),
    );
    const status = url.searchParams.get("status");
    const source = url.searchParams.get("source");
    const filteredSource = ["home-widget", "career-assessment"].includes(source)
      ? source
      : null;
    const search = (url.searchParams.get("search") || "").trim().slice(0, 200);
    let query = client.from("enquiries").select("*", { count: "exact" });
    if (filteredSource) query = query.eq("data->>source", filteredSource);
    if (["new", "contacted", "closed"].includes(status))
      query = query.eq("status", status);
    if (search) {
      // Quoted PostgREST values keep commas/parentheses out of filter syntax.
      const literal = search.replace(/[\\%_]/g, "\\$&");
      const pattern = JSON.stringify(`%${literal}%`);
      query = query.or(
        ["student", "email", "phone", "city"]
          .map((key) => `data->>${key}.ilike.${pattern}`)
          .join(","),
      );
    }
    query = query
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range((page - 1) * 20, page * 20 - 1);
    if (options.signal) query = query.abortSignal(options.signal);

    const countQuery = (column, value) => {
      let q = client
        .from("enquiries")
        .select("id", { count: "exact", head: true });
      if (filteredSource) q = q.eq("data->>source", filteredSource);
      if (column) q = value === null ? q.is(column, null) : q.eq(column, value);
      return options.signal ? q.abortSignal(options.signal) : q;
    };
    const [rows, total, fresh, contacted, pending, sheets] = await Promise.all([
      query,
      countQuery(),
      countQuery("status", "new"),
      countQuery("status", "contacted"),
      countQuery("sheet_synced_at", null),
      invoke("state", undefined, options.signal),
    ]);
    [rows, total, fresh, contacted, pending].forEach(checked);
    return {
      rows: rows.data.map((row) => ({
        ...row.data,
        id: row.id,
        status: row.status,
        createdAt: row.created_at,
        sheetSyncedAt: row.sheet_synced_at,
      })),
      total: rows.count,
      page,
      pageSize: 20,
      summary: {
        total: total.count,
        new: fresh.count,
        contacted: contacted.count,
        pending: pending.count,
      },
      sheets,
    };
  };
}
