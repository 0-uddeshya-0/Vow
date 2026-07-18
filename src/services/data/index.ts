import { hasFirebase } from "../firebase/app";
import { seedDataSource } from "./seed";
import type { DataSource } from "./types";

/** The active event — later selectable; for now the platform's first event. */
export const ACTIVE_EVENT_SLUG = "michael-dina";

export const data: DataSource = hasFirebase
  ? // Lazy import keeps firebase out of the demo bundle path entirely?
    // No — static import is fine: tree-shaken firebase/firestore is only
    // initialized when hasFirebase, and code-splitting this seam would
    // complicate the DataSource contract. Bundle cost is accepted and
    // measured in the P1 gate report.
    (await import("./firebase")).firebaseDataSource
  : seedDataSource;
