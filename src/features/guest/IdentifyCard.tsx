import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { UserRound } from "lucide-react";
import { data } from "../../services/data";
import { useI18n } from "../../i18n";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/Button";
import { TextInput } from "../../components/ui/Field";
import { entrance } from "../../animations/variants";
import { useGuestSession } from "./useGuestSession";

/** Email-or-phone guest identification → local session (spec workflow). */
export function IdentifyCard({ eventId }: { eventId: string }) {
  const { t } = useI18n();
  const { signIn } = useGuestSession();
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || busy) return;
    setBusy(true);
    setNotFound(false);
    const guest = await data.findGuest(eventId, contact);
    setBusy(false);
    if (guest) {
      signIn({ eventId, guestId: guest.id });
    } else {
      setNotFound(true);
    }
  };

  return (
    <GlassCard className="mx-auto max-w-md p-7 text-center" {...entrance()}>
      <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-hairline bg-surface/60">
        <UserRound size={20} className="text-gold-ink" aria-hidden />
      </div>
      <h2 className="mt-4 font-display text-2xl text-ink">{t.identify.title}</h2>
      <p className="mt-1.5 text-sm text-ink-soft">{t.identify.lead}</p>
      <form onSubmit={(e) => void submit(e)} className="mt-5 flex flex-col gap-3">
        <TextInput
          aria-label={t.identify.placeholder}
          placeholder={t.identify.placeholder}
          autoComplete="email"
          inputMode="email"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            setNotFound(false);
          }}
          className="text-center"
        />
        <Button type="submit" disabled={busy || !contact.trim()}>
          {busy ? t.common.loading + "…" : t.identify.cta}
        </Button>
      </form>
      {notFound ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="mt-3 text-sm text-err"
        >
          {t.identify.notFound}
        </motion.p>
      ) : null}
      {data.kind === "seed" ? (
        <p className="mt-4 text-xs tracking-wide text-ink-soft/80">{t.identify.demoHint}</p>
      ) : null}
    </GlassCard>
  );
}
