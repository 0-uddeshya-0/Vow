import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BellRing, Check, TriangleAlert } from "lucide-react";
import { useI18n } from "../../i18n";
import { entrance } from "../../animations/variants";
import { enablePush, pushSupported, type PushResult } from "../../services/firebase/messaging";
import { AdminButton } from "../admin/kit";
import type { EventDoc, Guest } from "../../types";

type UiState = PushResult | "idle" | "working";

/**
 * Guest opt-in for day-of push. Renders nothing unless push is configured and
 * supported by the browser, so it never shows a dead button.
 */
export function PushOptIn({ event, guest }: { event: EventDoc; guest: Guest | null }) {
  const { t } = useI18n();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [state, setState] = useState<UiState>(() =>
    typeof Notification !== "undefined" && Notification.permission === "granted" ? "enabled" : "idle",
  );

  useEffect(() => {
    pushSupported().then(setSupported);
  }, []);

  if (supported !== true) return null;

  const onEnable = async () => {
    setState("working");
    setState(await enablePush(event.id, guest));
  };

  return (
    <motion.div className="glass rounded-[var(--radius-card)] p-6" {...entrance()}>
      <div className="flex items-start gap-3">
        <BellRing size={20} className="mt-1 shrink-0 text-gold-ink" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-2xl text-ink">{t.push.title}</h3>
          <p className="mt-1.5 max-w-[52ch] text-ink-soft">{t.push.lead}</p>

          <div className="mt-4">
            {state === "enabled" ? (
              <p className="inline-flex items-center gap-2 text-sm text-sage-deep">
                <Check size={15} aria-hidden /> {t.push.enabled}
              </p>
            ) : state === "denied" ? (
              <p className="inline-flex items-start gap-2 text-sm text-err">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden /> {t.push.denied}
              </p>
            ) : state === "error" ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-err">{t.push.error}</p>
                <AdminButton onClick={onEnable}>{t.push.enable}</AdminButton>
              </div>
            ) : (
              <AdminButton onClick={onEnable} disabled={state === "working"}>
                <BellRing size={14} /> {state === "working" ? t.push.working : t.push.enable}
              </AdminButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
