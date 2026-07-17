import type { RuntimeContent } from "../config/wedding";

/**
 * Loads the values that must never live in the public repo/bundle:
 * booking code, emergency phone, menu text.
 *
 * Today: fetches `content.local.json` (gitignored; copy the example file).
 * Later: replaced by a Supabase RPC that requires a valid guest token —
 * see supabase/schema.sql (`content_get`).
 */
export async function loadRuntimeContent(): Promise<RuntimeContent> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}content.local.json`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as Partial<RuntimeContent>;
    return {
      bookingCode: data.bookingCode ?? null,
      emergencyPhone: data.emergencyPhone ?? null,
      menu: data.menu ?? null,
    };
  } catch {
    // Graceful degradation: the UI shows "shared with your invitation".
    return { bookingCode: null, emergencyPhone: null, menu: null };
  }
}
