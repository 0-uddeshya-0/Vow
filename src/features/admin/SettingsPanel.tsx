import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminButton, Input, Labeled, LocalizedInput, Panel, Select, emptyText } from "./kit";
import { useSaveEvent, useSaveSettings, useSaveWeatherSettings } from "../../hooks/adminQueries";
import { useSettings, useWeatherSettings } from "../../hooks/queries";
import { EDITABLE_SECTIONS } from "../../hooks/useSectionLabels";
import type { EventDoc, LocalizedText, Settings, WeatherSettings } from "../../types";

const SECTION_NAMES: Record<(typeof EDITABLE_SECTIONS)[number], string> = {
  schedule: "Schedule / Programm",
  weather: "Weather",
  stay: "Where to stay",
  parking: "Parking",
  faq: "FAQ / Good to know",
  recommendations: "Recommendations",
  gifts: "Gifts",
  contact: "Contact",
  emergency: "Emergency",
  gallery: "Gallery",
  photos: "Photo upload",
};

/** Rename any guest-page section heading + tagline (blank = built-in text). */
export function LabelsPanel({ event }: { event: EventDoc }) {
  const saved = useSettings(event.id).data;
  const save = useSaveSettings();
  const [d, setD] = useDraft<Settings>(saved);
  if (!d) return null;

  const labelFor = (id: string): { id: string; title: LocalizedText; lead: LocalizedText } =>
    d.labels.find((l) => l.id === id) ?? { id, title: emptyText(), lead: emptyText() };
  const setLabel = (id: string, patch: Partial<{ title: LocalizedText; lead: LocalizedText }>) => {
    const merged = { ...labelFor(id), ...patch };
    setD({ ...d, labels: [...d.labels.filter((l) => l.id !== id), merged] });
  };

  return (
    <Panel
      title="Section headings"
      action={<AdminButton onClick={() => save.mutate(d)}>Save</AdminButton>}
    >
      <p className="mb-4 text-sm text-ink-soft">
        Rename any section's heading and tagline. Leave a field blank to keep the built-in text.
      </p>
      <div className="flex flex-col gap-4">
        {EDITABLE_SECTIONS.map((id) => {
          const l = labelFor(id);
          return (
            <div key={id} className="rounded-xl border border-hairline-soft p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-ink-soft">
                {SECTION_NAMES[id]}
              </p>
              <div className="flex flex-col gap-3">
                <LocalizedInput label="Heading" value={l.title} onChange={(v) => setLabel(id, { title: v })} />
                <LocalizedInput label="Tagline" value={l.lead} onChange={(v) => setLabel(id, { lead: v })} />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/** Small helper: local draft that resyncs whenever the saved value changes. */
function useDraft<T>(value: T | null | undefined): [T | null, (v: T) => void] {
  const [draft, setDraft] = useState<T | null>(value ?? null);
  useEffect(() => setDraft(value ?? null), [value]);
  return [draft, setDraft];
}

export function EventSettingsPanel({ event }: { event: EventDoc }) {
  const save = useSaveEvent();
  const [d, setD] = useDraft<EventDoc>(event);
  if (!d) return null;
  const set = (p: Partial<EventDoc>) => setD({ ...d, ...p });

  return (
    <Panel
      title="Event & content"
      action={<AdminButton onClick={() => save.mutate(d)}>Save</AdminButton>}
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Labeled label="Couple / event name">
            <Input value={d.coupleNames} onChange={(e) => set({ coupleNames: e.target.value })} />
          </Labeled>
          <Labeled label="Script mark" hint="Shown above the names; stays in its own language">
            <Input value={d.mark} onChange={(e) => set({ mark: e.target.value })} />
          </Labeled>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Labeled label="Date">
            <Input type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} />
          </Labeled>
          <Labeled label="RSVP deadline">
            <Input
              type="date"
              value={d.rsvpDeadline}
              onChange={(e) => set({ rsvpDeadline: e.target.value })}
            />
          </Labeled>
          <Labeled label="Timezone">
            <Input value={d.timezone} onChange={(e) => set({ timezone: e.target.value })} />
          </Labeled>
        </div>

        <LocalizedInput label="Welcome" value={d.welcome} onChange={(v) => set({ welcome: v })} multiline />
        <LocalizedInput label="Intro" value={d.intro} onChange={(v) => set({ intro: v })} multiline />

        <Labeled label="Hero illustration URL" hint="The couple's artwork shown on the landing page">
          <Input
            value={d.heroIllustrationUrl}
            onChange={(e) => set({ heroIllustrationUrl: e.target.value })}
          />
        </Labeled>

        <div className="rounded-xl border border-hairline-soft p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.12em] text-ink-soft">Theme</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Default mode">
              <Select
                value={d.theme.defaultMode}
                onChange={(e) =>
                  set({ theme: { ...d.theme, defaultMode: e.target.value as "light" | "dark" } })
                }
              >
                <option value="light">Light — Morning Garden</option>
                <option value="dark">Dark — Candlelit Evening</option>
              </Select>
            </Labeled>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            {(["sage", "gold", "bgLight", "bgDark"] as const).map((k) => (
              <Labeled key={k} label={k} hint="blank = default">
                <Input
                  value={d.theme[k]}
                  placeholder="#RRGGBB"
                  onChange={(e) => set({ theme: { ...d.theme, [k]: e.target.value } })}
                />
              </Labeled>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Only four knobs on purpose — enough to rebrand a new event, too few to break contrast.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={d.placeholder}
            onChange={(e) => set({ placeholder: e.target.checked })}
          />
          Show “demo content” ribbon (turn off once the real details are in)
        </label>
      </div>
    </Panel>
  );
}

export function ContactSettingsPanel({ event }: { event: EventDoc }) {
  const saved = useSettings(event.id).data;
  const save = useSaveSettings();
  const [d, setD] = useDraft<Settings>(saved);
  if (!d) return null;
  const set = (p: Partial<Settings>) => setD({ ...d, ...p });

  return (
    <Panel
      title="Contact, parking & emergency"
      action={<AdminButton onClick={() => save.mutate(d)}>Save</AdminButton>}
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-ink-soft">Contacts</p>
          <div className="flex flex-col gap-2">
            {d.contact.map((c, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-hairline-soft p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                <Input
                  value={c.label}
                  placeholder="Label"
                  aria-label="Label"
                  onChange={(e) => {
                    const next = [...d.contact];
                    next[i] = { ...c, label: e.target.value };
                    set({ contact: next });
                  }}
                />
                <Input
                  value={c.name}
                  placeholder="Name"
                  aria-label="Name"
                  onChange={(e) => {
                    const next = [...d.contact];
                    next[i] = { ...c, name: e.target.value };
                    set({ contact: next });
                  }}
                />
                <Input
                  value={c.phone}
                  placeholder="+49…"
                  aria-label="Phone"
                  onChange={(e) => {
                    const next = [...d.contact];
                    next[i] = { ...c, phone: e.target.value };
                    set({ contact: next });
                  }}
                />
                <Input
                  value={c.email}
                  placeholder="Email"
                  aria-label="Email"
                  onChange={(e) => {
                    const next = [...d.contact];
                    next[i] = { ...c, email: e.target.value };
                    set({ contact: next });
                  }}
                />
                <button
                  aria-label="Remove contact"
                  className="flex size-10 items-center justify-center rounded-lg border border-err/30 text-err"
                  onClick={() => set({ contact: d.contact.filter((_, x) => x !== i) })}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <AdminButton
            variant="quiet"
            className="mt-2"
            onClick={() => set({ contact: [...d.contact, { label: "", name: "", phone: "", email: "" }] })}
          >
            <Plus size={14} /> Add contact
          </AdminButton>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-ink-soft">Emergency numbers</p>
          <div className="flex flex-col gap-2">
            {d.emergency.map((e2, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-hairline-soft p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Input
                  value={e2.label.en}
                  placeholder="Label EN"
                  aria-label="Label EN"
                  onChange={(e) => {
                    const next = [...d.emergency];
                    next[i] = { ...e2, label: { ...e2.label, en: e.target.value } };
                    set({ emergency: next });
                  }}
                />
                <Input
                  value={e2.label.de}
                  placeholder="Label DE"
                  aria-label="Label DE"
                  onChange={(e) => {
                    const next = [...d.emergency];
                    next[i] = { ...e2, label: { ...e2.label, de: e.target.value } };
                    set({ emergency: next });
                  }}
                />
                <Input
                  value={e2.phone}
                  placeholder="Phone"
                  aria-label="Phone"
                  onChange={(e) => {
                    const next = [...d.emergency];
                    next[i] = { ...e2, phone: e.target.value };
                    set({ emergency: next });
                  }}
                />
                <button
                  aria-label="Remove number"
                  className="flex size-10 items-center justify-center rounded-lg border border-err/30 text-err"
                  onClick={() => set({ emergency: d.emergency.filter((_, x) => x !== i) })}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <AdminButton
            variant="quiet"
            className="mt-2"
            onClick={() => set({ emergency: [...d.emergency, { label: emptyText(), phone: "" }] })}
          >
            <Plus size={14} /> Add number
          </AdminButton>
        </div>

        <div className="rounded-xl border border-hairline-soft p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.12em] text-ink-soft">Parking</p>
          <LocalizedInput
            label="Info"
            value={d.parking?.text ?? emptyText()}
            onChange={(v) =>
              set({
                parking: {
                  text: v,
                  location: d.parking?.location ?? {
                    name: "",
                    address: "",
                    lat: null,
                    lng: null,
                    googleMapsUrl: "",
                    appleMapsUrl: "",
                    osmUrl: "",
                  },
                },
              })
            }
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Labeled label="Place name">
              <Input
                value={d.parking?.location.name ?? ""}
                onChange={(e) =>
                  d.parking &&
                  set({ parking: { ...d.parking, location: { ...d.parking.location, name: e.target.value } } })
                }
              />
            </Labeled>
            <Labeled label="Address">
              <Input
                value={d.parking?.location.address ?? ""}
                onChange={(e) =>
                  d.parking &&
                  set({
                    parking: { ...d.parking, location: { ...d.parking.location, address: e.target.value } },
                  })
                }
              />
            </Labeled>
          </div>
        </div>

        <LocalizedInput
          label="Footer text"
          value={d.footerText ?? emptyText()}
          onChange={(v) => set({ footerText: v })}
        />
      </div>
    </Panel>
  );
}

export function WeatherSettingsPanel({ event }: { event: EventDoc }) {
  const saved = useWeatherSettings(event.id).data;
  const save = useSaveWeatherSettings();
  const [d, setD] = useDraft<WeatherSettings>(saved);
  if (!d) return null;
  const set = (p: Partial<WeatherSettings>) => setD({ ...d, ...p });
  const num = (v: string) => (v.trim() === "" ? null : Number(v));

  return (
    <Panel title="Weather" action={<AdminButton onClick={() => save.mutate(d)}>Save</AdminButton>}>
      <div className="grid gap-3 sm:grid-cols-4">
        <Labeled label="Show weather">
          <Select
            value={d.enabled ? "yes" : "no"}
            onChange={(e) => set({ enabled: e.target.value === "yes" })}
          >
            <option value="yes">Enabled</option>
            <option value="no">Disabled</option>
          </Select>
        </Labeled>
        <Labeled label="Days before" hint="Visible window">
          <Input
            type="number"
            value={d.daysBefore}
            onChange={(e) => set({ daysBefore: Number(e.target.value) || 0 })}
          />
        </Labeled>
        <Labeled label="Latitude">
          <Input value={d.lat ?? ""} onChange={(e) => set({ lat: num(e.target.value) })} />
        </Labeled>
        <Labeled label="Longitude">
          <Input value={d.lng ?? ""} onChange={(e) => set({ lng: num(e.target.value) })} />
        </Labeled>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        Forecast comes from Open-Meteo — no API key, no account, and only the venue coordinates
        leave the browser.
      </p>
    </Panel>
  );
}
