import { useState, type FormEvent } from "react";
import { useI18n } from "../i18n";

/**
 * The invitation gate. Hero stays public; everything below it requires a
 * guest token — normally carried by the personal link (?g=TOKEN) from the
 * couple's WhatsApp/mail invitation.
 *
 * MOCK VALIDATION for the scaffold: only the code "DEMO" (or any ?g= link
 * param) unlocks, documented in README. Real validation is the Supabase RPC
 * `gate_check(token)` in supabase/schema.sql.
 */
export function Gate({ onUnlock }: { onUnlock: (token: string) => void }) {
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed.toUpperCase() === "DEMO") {
      onUnlock(trimmed);
    } else {
      setWrong(true);
    }
  };

  return (
    <section className="section gate-section" aria-labelledby="gate-title">
      <div className="col">
        <div className="gate glass">
          <p className="script gate-mark" aria-hidden="true">
            M &amp; D
          </p>
          <h2 id="gate-title">{t.gate.title}</h2>
          <p className="lead">{t.gate.lead}</p>
          <form className="gate-form" onSubmit={submit}>
            <input
              type="text"
              aria-label={t.gate.placeholder}
              placeholder={t.gate.placeholder}
              autoCapitalize="characters"
              autoCorrect="off"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setWrong(false);
              }}
            />
            <button className="btn btn--primary" type="submit">
              {t.gate.enter}
            </button>
          </form>
          {wrong ? (
            <p className="gate-wrong" role="alert">
              {t.gate.wrong}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
