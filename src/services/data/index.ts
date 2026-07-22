import { hasFirebase } from "../firebase/app";
import { seedDataSource } from "./seed";
import { firebaseDataSource } from "./firebase";
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
/**
 * Hard ceiling on any single backend call. Uploads legitimately take longer,
 * so they get a generous window; everything else must answer within 15s or
 * reject — turning a silent hang into a visible error that TanStack Query can
 * retry, and letting the seed fallback trigger. Belt to the long-polling
 * suspenders in firebase/app.ts.
 */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout: ${label} (${ms}ms)`)), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

function withSeedFallback(primary: DataSource): DataSource {
  let broken = false;
  const active = () => (broken ? seedDataSource : primary);

  return new Proxy(primary, {
    get(_target, prop: keyof DataSource) {
      if (prop === "kind") return active().kind;
      return async (...args: unknown[]) => {
        const fn = active()[prop] as (...a: unknown[]) => Promise<unknown>;
        const budget = prop === "uploadPhoto" ? 120_000 : 15_000;
        try {
          const result = await withTimeout(
            fn.apply(active(), args) as Promise<unknown>,
            budget,
            String(prop),
          );
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

// NOTE: firebaseDataSource is imported statically (not `await import()`).
// A top-level await here deadlocked the Rollup production build — the entry
// chunk awaited the firebase chunk while that chunk was still initializing,
// so module evaluation never finished and React never mounted (blank page for
// any fresh visitor; masked only by the service-worker cache). Dev's native
// ESM tolerated it, the bundle did not. Keep this synchronous.
export const data: DataSource = hasFirebase
  ? withSeedFallback(firebaseDataSource)
  : seedDataSource;
