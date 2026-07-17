import { useState, type FormEvent } from "react";
import { useI18n } from "../i18n";
import { wedding, type DietaryOption } from "../config/wedding";

type RsvpDraft = {
  name: string;
  attending: "yes" | "no" | null;
  plusOne: boolean;
  plusOneName: string;
  dietary: DietaryOption[];
  allergies: string;
  message: string;
};

const empty: RsvpDraft = {
  name: "",
  attending: null,
  plusOne: false,
  plusOneName: "",
  dietary: [],
  allergies: "",
  message: "",
};

function loadDraft(): RsvpDraft {
  try {
    const raw = localStorage.getItem("vow.rsvp.draft");
    if (raw) return { ...empty, ...(JSON.parse(raw) as Partial<RsvpDraft>) };
  } catch {
    /* ok */
  }
  return empty;
}

/**
 * PREVIEW MODE: persists to localStorage only and says so in the UI.
 * The real submit goes through the Supabase RPC `rsvp_upsert(token, payload)`
 * (see supabase/schema.sql) once the project is connected.
 */
export function Rsvp() {
  const { t } = useI18n();
  const [draft, setDraft] = useState<RsvpDraft>(loadDraft);
  const [sent, setSent] = useState<null | "yes" | "no">(null);

  const patch = (p: Partial<RsvpDraft>) => setDraft((d) => ({ ...d, ...p }));

  const toggleDiet = (opt: DietaryOption) =>
    patch({
      dietary: draft.dietary.includes(opt)
        ? draft.dietary.filter((o) => o !== opt)
        : [...draft.dietary, opt],
    });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.attending) return;
    try {
      localStorage.setItem("vow.rsvp.draft", JSON.stringify(draft));
    } catch {
      /* ok */
    }
    setSent(draft.attending);
  };

  return (
    <section className="section" id="rsvp" aria-labelledby="rsvp-title">
      <div className="col">
        <div className="rsvp-panel glass">
          <p className="preview-badge smallcaps">{t.rsvp.previewBadge}</p>
          <h2 id="rsvp-title">{t.rsvp.title}</h2>
          <p className="lead">{t.rsvp.lead}</p>

          {sent ? (
            <div className="rsvp-thanks" role="status">
              <p className="script rsvp-thanks-script">
                {wedding.couple.one[0]} &amp; {wedding.couple.two[0]}
              </p>
              <p className="rsvp-thanks-line">{sent === "yes" ? t.rsvp.thanksYes : t.rsvp.thanksNo}</p>
              <p className="rsvp-edit-hint">{t.rsvp.editHint}</p>
              <button className="btn btn--quiet" onClick={() => setSent(null)}>
                ✎
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="rsvp-form">
              <div className="field">
                <label htmlFor="rsvp-name">{t.rsvp.name}</label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={t.rsvp.namePlaceholder}
                  value={draft.name}
                  onChange={(e) => patch({ name: e.target.value })}
                />
              </div>

              <fieldset className="field field--group">
                <legend className="smallcaps">{t.rsvp.attending}</legend>
                <div className="chip-row">
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={draft.attending === "yes"}
                    onClick={() => patch({ attending: "yes" })}
                  >
                    {t.rsvp.yes}
                  </button>
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={draft.attending === "no"}
                    onClick={() => patch({ attending: "no" })}
                  >
                    {t.rsvp.no}
                  </button>
                </div>
              </fieldset>

              {draft.attending === "yes" ? (
                <>
                  <fieldset className="field field--group">
                    <legend className="smallcaps">{t.rsvp.plusOne}</legend>
                    <div className="chip-row">
                      <button
                        type="button"
                        className="chip"
                        aria-pressed={draft.plusOne}
                        onClick={() => patch({ plusOne: !draft.plusOne })}
                      >
                        {t.rsvp.plusOneToggle}
                      </button>
                    </div>
                    {draft.plusOne ? (
                      <input
                        type="text"
                        aria-label={t.rsvp.plusOneName}
                        placeholder={t.rsvp.plusOneName}
                        value={draft.plusOneName}
                        onChange={(e) => patch({ plusOneName: e.target.value })}
                      />
                    ) : null}
                  </fieldset>

                  <fieldset className="field field--group">
                    <legend className="smallcaps">{t.rsvp.dietTitle}</legend>
                    <p className="field-hint">{t.rsvp.dietLead}</p>
                    <div className="chip-row">
                      {wedding.dietaryOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className="chip"
                          aria-pressed={draft.dietary.includes(opt)}
                          onClick={() => toggleDiet(opt)}
                        >
                          {t.rsvp.diet[opt]}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="field">
                    <label htmlFor="rsvp-allergies">{t.rsvp.allergies}</label>
                    <textarea
                      id="rsvp-allergies"
                      placeholder={t.rsvp.allergiesPlaceholder}
                      value={draft.allergies}
                      onChange={(e) => patch({ allergies: e.target.value })}
                    />
                  </div>
                </>
              ) : null}

              <div className="field">
                <label htmlFor="rsvp-message">{t.rsvp.message}</label>
                <textarea
                  id="rsvp-message"
                  placeholder={t.rsvp.messagePlaceholder}
                  value={draft.message}
                  onChange={(e) => patch({ message: e.target.value })}
                />
              </div>

              <button className="btn btn--primary rsvp-send" type="submit">
                {t.rsvp.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
