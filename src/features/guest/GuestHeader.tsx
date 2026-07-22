import { useI18n } from "../../i18n";
import type { Guest } from "../../types";

/** Welcome line + "switch guest" — shared by the login-gated guest pages. */
export function GuestHeader({ guest, onSwitch }: { guest: Guest; onSwitch: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <p className="font-display text-2xl text-ink">
        {t.identify.welcome}, <span className="text-gold-ink">{guest.fullName}</span>
      </p>
      <button
        onClick={onSwitch}
        className="cursor-pointer text-sm text-ink-soft underline decoration-hairline underline-offset-4 hover:text-gold-ink"
      >
        {t.identify.switch}
      </button>
    </div>
  );
}
