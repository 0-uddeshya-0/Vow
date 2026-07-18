/**
 * Contact normalization + hashing, shared by every data source so a guest
 * hashes identically whether they type "0151 123 456" or "+49151123456".
 */
export function normalizeContact(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (t.includes("@")) return t;
  return t.replace(/[^\d+]/g, "").replace(/^00/, "+").replace(/^0/, "+49");
}

/**
 * SHA-256 hex of a normalized contact — used as the *document id* of a
 * guest-lookup record.
 *
 * Why: the site is a static SPA with no server, so guests identify without
 * accounts. Firestore rules cannot filter an unauthenticated query by its
 * where-clause, so a readable `guests` collection would be publicly
 * enumerable. Instead nothing is listable: you can only `get` the lookup
 * document whose id you can compute, which requires already knowing the
 * exact email or phone number. Same security model as a magic link.
 */
export async function contactHash(raw: string): Promise<string> {
  const data = new TextEncoder().encode(`vow:${normalizeContact(raw)}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
