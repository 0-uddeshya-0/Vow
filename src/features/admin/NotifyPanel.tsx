import { BellRing } from "lucide-react";
import { Panel, Stat } from "./kit";
import { useAdminPushTokens } from "../../hooks/adminQueries";
import { pushConfigured } from "../../services/firebase/messaging";
import type { EventDoc } from "../../types";

/**
 * Push is send-from-your-machine (free): guests opt in here, you broadcast with
 * scripts/send-push.mjs. This panel just shows who's subscribed and how to send.
 */
export function NotifyPanel({ event }: { event: EventDoc }) {
  const tokens = useAdminPushTokens(event.id).data ?? [];

  return (
    <Panel title="Notifications">
      {!pushConfigured ? (
        <p className="mb-4 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
          <BellRing size={16} className="mt-0.5 shrink-0 text-gold-ink" aria-hidden />
          <span>
            Push isn’t configured yet. Add your Web Push <strong>VAPID key</strong> as{" "}
            <code className="font-mono text-xs">VITE_FIREBASE_VAPID_KEY</code> (env + deploy
            workflow), then guests will see the opt-in on their event page.
          </span>
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Subscribers" value={tokens.length} tone={tokens.length ? "ok" : "muted"} />
      </div>

      <div className="mt-5 rounded-[var(--radius-card)] border border-hairline-soft bg-surface-solid/60 p-4 text-sm text-ink-soft">
        <p className="font-medium text-ink">How to send a broadcast (free — no Cloud Functions)</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          <li>
            One-time: Firebase Console → Project settings → Service accounts → “Generate new private
            key”. Save it as{" "}
            <code className="font-mono text-xs">scripts/service-account.json</code> (git-ignored).
          </li>
          <li>
            One-time: <code className="font-mono text-xs">npm install firebase-admin</code>.
          </li>
          <li>
            To broadcast:{" "}
            <code className="font-mono text-xs">
              node scripts/send-push.mjs "Ceremony starting" "Please take your seats 💍"
            </code>
          </li>
        </ol>
        <p className="mt-3">
          The script reads the {tokens.length} registered device{tokens.length === 1 ? "" : "s"} and
          delivers to every guest who opted in. See{" "}
          <code className="font-mono text-xs">docs/PUSH.md</code>.
        </p>
      </div>
    </Panel>
  );
}
