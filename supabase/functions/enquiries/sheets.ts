import { GoogleAuth } from "npm:google-auth-library@10.9.1";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.118.0";

export function sheetsConfig() {
  return {
    sheetId: Deno.env.get("GOOGLE_SHEET_ID"),
    sheetTab: Deno.env.get("GOOGLE_SHEET_TAB") || "Eleventra enquiries",
    credentials: Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON"),
  };
}

export async function syncState(db: SupabaseClient) {
  const config = sheetsConfig();
  const { data, error } = await db
    .from("enquiry_sync_state")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return {
    configured: Boolean(config.sheetId && config.credentials),
    running: new Date(data.locked_until).getTime() > Date.now(),
    lastError: data.last_error,
    lastSuccessAt: data.last_success_at,
    tab: config.sheetTab,
    url: config.sheetId
      ? `https://docs.google.com/spreadsheets/d/${encodeURIComponent(config.sheetId)}/edit`
      : null,
  };
}

const headers = [
  "Enquiry ID",
  "Submitted at (UTC)",
  "Student / candidate",
  "Parent",
  "Phone / WhatsApp",
  "Email",
  "City",
  "Current stage",
  "Service",
  "Help needed",
  "Message",
];

export async function flushSheets(db: SupabaseClient) {
  const config = sheetsConfig();
  if (!config.sheetId || !config.credentials) return syncState(db);
  const lease = await db.rpc("acquire_enquiry_sync");
  if (lease.error) throw lease.error;
  if (!lease.data) return syncState(db);
  try {
    const pending = await db
      .from("enquiries")
      .select("*")
      .is("sheet_synced_at", null)
      .order("created_at")
      .limit(50);
    if (pending.error) throw pending.error;
    if (pending.data.length) {
      const auth = new GoogleAuth({
        credentials: JSON.parse(config.credentials),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const token = await auth.getAccessToken();
      const root = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.sheetId)}`;
      async function request(path: string, method = "GET", body?: unknown) {
        const response = await fetch(root + path, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error("Sheets request failed");
        return response.json();
      }
      const range = (suffix: string) =>
        encodeURIComponent(
          `'${config.sheetTab.replaceAll("'", "''")}'!${suffix}`,
        );
      const metadata = await request("?fields=sheets.properties.title");
      if (
        !metadata.sheets.some(
          (s: { properties: { title: string } }) =>
            s.properties.title === config.sheetTab,
        )
      ) {
        await request(":batchUpdate", "POST", {
          requests: [{ addSheet: { properties: { title: config.sheetTab } } }],
        });
      }
      const existingHeader = (await request("/values/" + range("A1:K1")))
        .values?.[0];
      if (!existingHeader?.length) {
        if ((await request("/values/" + range("A2:K2"))).values?.length) {
          throw new Error("Worksheet must be empty");
        }
        await request(
          "/values/" + range("A1:K1") + "?valueInputOption=RAW",
          "PUT",
          { values: [headers] },
        );
      } else if (JSON.stringify(existingHeader) !== JSON.stringify(headers)) {
        throw new Error("Worksheet headers do not match");
      }
      const ids = new Set(
        ((await request("/values/" + range("A2:A"))).values || []).map(
          (row: string[]) => row[0],
        ),
      );
      const missing = pending.data.filter((row) => !ids.has(row.id));
      if (missing.length) {
        await request(
          "/values/" +
            range("A:K") +
            ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
          "POST",
          {
            values: missing.map((row) => {
              const d = row.data;
              return [
                row.id,
                row.created_at,
                d.student,
                d.parent,
                d.phone,
                d.email,
                d.city,
                d.stage,
                d.service,
                d.help.join(", "),
                d.message,
              ];
            }),
          },
        );
      }
      // IDs reconcile ambiguous append failures; RAW prevents formula injection.
      const marked = await db
        .from("enquiries")
        .update({ sheet_synced_at: new Date().toISOString() })
        .in(
          "id",
          pending.data.map((row) => row.id),
        );
      if (marked.error) throw marked.error;
    }
    const updated = await db
      .from("enquiry_sync_state")
      .update({
        last_success_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", 1);
    if (updated.error) throw updated.error;
  } catch {
    const updated = await db
      .from("enquiry_sync_state")
      .update({
        last_error:
          "Google Sheets could not be synced. Check credentials, sharing and worksheet headers. Enquiries remain saved for retry.",
      })
      .eq("id", 1);
    if (updated.error) throw updated.error;
  } finally {
    const released = await db
      .from("enquiry_sync_state")
      .update({ locked_until: "-infinity" })
      .eq("id", 1);
    if (released.error) throw released.error;
  }
  return syncState(db);
}
