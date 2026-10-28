import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { enquirySchema } from "./validation.ts";
import { flushSheets, syncState } from "./sheets.ts";

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };

const adminId = "6e82755f-6036-40a6-b257-354c3530c8af";
const allowedOrigins = (
  Deno.env.get("APP_ORIGINS") || "http://127.0.0.1:5173,http://localhost:5173"
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
const stable = (value: Record<string, unknown>) =>
  JSON.stringify(value, Object.keys(value).sort());

async function digest(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

// Read incrementally so oversized/chunked requests cannot bypass the size limit.
async function readBody(req: Request) {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 24576) {
      await reader.cancel();
      throw new Error("Body too large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, apikey, content-type, x-client-info, x-cron-secret",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
  if (origin && allowedOrigins.includes(origin))
    cors["Access-Control-Allow-Origin"] = origin;
  const reply = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: cors });
  if (origin && !allowedOrigins.includes(origin))
    return reply({ error: "This website is not allowed." }, 403);
  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST")
    return reply({ error: "Method not allowed." }, 405);
  if (!req.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Expected JSON." }, 415);
  let body;
  try {
    body = await readBody(req);
  } catch {
    return reply({ error: "Invalid or oversized request." }, 400);
  }
  if (!body || typeof body !== "object")
    return reply({ error: "Invalid request." }, 400);

  try {
    if (body.action === "submit") {
      if (!origin) return reply({ error: "Submit from the website." }, 403);
      const parsed = enquirySchema.safeParse(body.payload);
      if (!parsed.success || parsed.data.website)
        return reply(
          { error: "Please check your details and try again." },
          400,
        );
      const salt = Deno.env.get("RATE_LIMIT_SALT");
      if (!salt)
        return reply(
          { error: "The enquiry service is not configured yet." },
          503,
        );
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const buckets: [string, number][] = [
        ["ip:" + (await digest(salt + ip)), 10],
        ["email:" + (await digest(salt + parsed.data.email)), 3],
        ["global", 500],
      ];
      for (const [bucket_key, max_hits] of buckets) {
        const limit = await db.rpc("consume_enquiry_limit", {
          bucket_key,
          max_hits,
        });
        if (limit.error) throw limit.error;
        if (!limit.data)
          return reply(
            { error: "Too many requests. Please try again in 15 minutes." },
            429,
          );
      }
      const { id, website: _website, ...data } = parsed.data;
      const saved = await db
        .from("enquiries")
        .upsert({ id, data }, { onConflict: "id", ignoreDuplicates: true });
      if (saved.error) throw saved.error;
      const existing = await db
        .from("enquiries")
        .select("data")
        .eq("id", id)
        .single();
      if (existing.error) throw existing.error;
      if (stable(existing.data.data) !== stable(data)) {
        return reply(
          {
            error:
              "This request was already used. Refresh before submitting different details.",
          },
          409,
        );
      }
      EdgeRuntime.waitUntil(flushSheets(db).catch(() => undefined));
      return reply({ id, saved: true }, 201);
    }

    // A private cron token can only trigger sync. It cannot read enquiries/state.
    const cronSecret = Deno.env.get("CRON_SECRET");
    const supplied = req.headers.get("x-cron-secret");
    const cron =
      body.action === "sync" &&
      Boolean(
        cronSecret &&
        supplied &&
        (await digest(supplied)) === (await digest(cronSecret)),
      );
    if (!cron) {
      const token = req.headers
        .get("authorization")
        ?.match(/^Bearer (.+)$/i)?.[1];
      if (!token) return reply({ error: "Please sign in to continue." }, 401);
      const { data, error } = await db.auth.getUser(token);
      if (error || !data.user)
        return reply({ error: "Please sign in to continue." }, 401);
      if (data.user.id !== adminId)
        return reply({ error: "Staff access only." }, 403);
    }
    if (body.action === "state") return reply(await syncState(db));
    if (body.action === "sync") return reply(await flushSheets(db));
    return reply({ error: "Unknown action." }, 400);
  } catch {
    return reply(
      {
        error:
          "Unable to complete the request. Your saved enquiries are safe. Please try again.",
      },
      500,
    );
  }
});
