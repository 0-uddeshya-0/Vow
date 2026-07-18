import { hasFirebase } from "../firebase/app";
import { seedDataSource } from "./seed";
import type { DataSource } from "./types";

/** The active event — later selectable; for now the platform's first event. */
export const ACTIVE_EVENT_SLUG = "michael-dina";

/**
 * Resilience wrapper: if Firestore is unreachable or holds no event (fresh
 * project, outage, deleted content), the live site degrades to the built-in
 * demo instead of rendering an eternal skeleton. Guests always see *a*
 * working page. The flip is one-way per pageload and logged to the console
 * so it can never mask a misconfiguration silently during development.
 */
function withSeedFallback(primary: DataSource): DataSource {
  let broken = false;
  const active = () => (broken ? seedDataSource : primary);

  return new Proxy(primary, {
    get(_target, prop: keyof DataSource) {
      if (prop === "kind") return active().kind;
      return async (...args: unknown[]) => {
        const fn = active()[prop] as (...a: unknown[]) => Promise<unknown>;
        try {
          const result = await fn.apply(active(), args);
          if (prop === "getEventBySlug" && result == null && !broken) {
            console.warn("[vow] no event in backend — falling back to seed demo");
            broken = true;
            return (seedDataSource.getEventBySlug as (...a: unknown[]) => Promise<unknown>)(
              ...args,
            );
          }
          return result;
        } catch (err) {
          // Only the canary read flips the whole app to seed. A failing
          // write (e.g. Storage not yet enabled) must surface as ITS OWN
          // error, not silently degrade everything else.
          if (prop === "getEventBySlug" && !broken) {
            console.warn("[vow] backend unreachable — falling back to seed demo", err);
            broken = true;
            const fallback = seedDataSource[prop] as (...a: unknown[]) => Promise<unknown>;
            return fallback.apply(seedDataSource, args);
          }
          throw err;
        }
      };
    },
  }) as DataSource;
}

export const data: DataSource = hasFirebase
  ? withSeedFallback((await import("./firebase")).firebaseDataSource)
  : seedDataSource;
