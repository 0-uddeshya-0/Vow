import { ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n";
import { GlassCard } from "../components/ui/GlassCard";
import { entrance } from "../animations/variants";

/**
 * Honest stub. Phase 3 delivers the CMS (guest management, schedule/hotel/
 * FAQ/gallery editors, theme settings, RSVP dashboard, reminders, plus-one
 * approvals) behind Firebase Authentication — no fake login here.
 */
export default function AdminPage() {
  const { t } = useI18n();
  return (
    <div className="wash-garden flex min-h-svh items-center px-5 pt-20">
      <GlassCard className="mx-auto max-w-md p-8 text-center" {...entrance()}>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-hairline bg-surface/60">
          <ShieldCheck size={20} className="text-gold-ink" aria-hidden />
        </div>
        <h1 className="mt-4 font-display text-3xl text-ink">{t.admin.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.admin.stub}</p>
      </GlassCard>
    </div>
  );
}
