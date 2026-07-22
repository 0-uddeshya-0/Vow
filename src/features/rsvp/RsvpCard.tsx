import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, UserPlus } from "lucide-react";
import { useI18n } from "../../i18n";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/Button";
import { Chip } from "../../components/ui/Chip";
import { Field, TextArea, TextInput } from "../../components/ui/Field";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { celebrateRsvp } from "../../animations/confetti";
import { entrance } from "../../animations/variants";
import { beforeDeadline, formatEventDate } from "../../lib/datetime";
import { useCreatePlusOne, usePlusOneRequests, useRsvp, useSaveRsvp } from "../../hooks/queries";
import type { EventDoc, Guest, Rsvp } from "../../types";

const DIET = ["vegetarian", "vegan", "gluten_free", "lactose_free"] as const;

const zForm = z.object({
  attending: z.enum(["yes", "no"]),
  dietary: z.array(z.enum(DIET)),
  allergies: z.string().max(600),
  message: z.string().max(1200),
  email: z.string().email().or(z.literal("")),
  phone: z.string().max(30),
});
type FormValues = z.infer<typeof zForm>;

const zPlusOne = z
  .object({ fullName: z.string().min(2), contact: z.string().min(3) })
  .refine((v) => v.contact.includes("@") || /\d{4,}/.test(v.contact), { path: ["contact"] });

function PlusOneBlock({ event, guest }: { event: EventDoc; guest: Guest }) {
  const { t, lt } = useI18n();
  const { data: requests } = usePlusOneRequests(event.id, guest.id);
  const create = useCreatePlusOne();
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [invalid, setInvalid] = useState(false);

  const statusLabel = { pending: t.rsvp.plusOnePending, approved: t.rsvp.plusOneApproved, rejected: t.rsvp.plusOneRejected } as const;

  const submit = () => {
    const parsed = zPlusOne.safeParse({ fullName, contact });
    if (!parsed.success) {
      setInvalid(true);
      return;
    }
    const isEmail = contact.includes("@");
    create.mutate({
      id: `po-${Date.now()}`,
      eventId: event.id,
      guestId: guest.id,
      fullName: fullName.trim(),
      email: isEmail ? contact.trim() : "",
      phone: isEmail ? "" : contact.trim(),
      status: "pending",
      response: null,
      createdAt: new Date().toISOString(),
    });
    setFullName("");
    setContact("");
    setInvalid(false);
  };

  return (
    <div className="mt-8 border-t border-hairline-soft pt-6">
      <h3 className="inline-flex items-center gap-2 font-display text-xl text-ink">
        <UserPlus size={17} className="text-gold-ink" aria-hidden /> {t.rsvp.plusOneTitle}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{t.rsvp.plusOneLead}</p>

      {requests?.length ? (
        <ul className="mt-3 flex flex-col gap-2">
          {requests.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 rounded-2xl border border-hairline-soft px-4 py-2.5 text-sm">
              <span className="text-ink">{r.fullName}</span>
              <span className="text-right text-ink-soft">
                {r.response && (r.response.en || r.response.de)
                  ? lt(r.response)
                  : statusLabel[r.status]}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TextInput
          aria-label={t.rsvp.plusOneName}
          placeholder={t.rsvp.plusOneName}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextInput
          aria-label={t.rsvp.plusOneContact}
          placeholder={t.rsvp.plusOneContact}
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            setInvalid(false);
          }}
        />
      </div>
      {invalid ? (
        <p role="alert" className="mt-2 text-sm text-err">
          {t.rsvp.plusOneName} + {t.rsvp.plusOneContact}
        </p>
      ) : null}
      <Button variant="quiet" className="mt-3" disabled={create.isPending} onClick={submit}>
        {t.rsvp.plusOneCta}
      </Button>
    </div>
  );
}

export function RsvpCard({ event, guest }: { event: EventDoc; guest: Guest }) {
  const { t, lang } = useI18n();
  const rsvpQuery = useRsvp(event.id, guest.id);
  const save = useSaveRsvp();
  const [justSaved, setJustSaved] = useState<Rsvp["attending"] | null>(null);
  const [editing, setEditing] = useState(false);
  const saveBtn = useRef<HTMLDivElement>(null);

  const open = beforeDeadline(event);
  const existing = rsvpQuery.data ?? null;

  const form = useForm<FormValues>({
    resolver: zodResolver(zForm),
    values: {
      attending: existing?.attending ?? "yes",
      dietary: existing?.dietary ?? [],
      allergies: existing?.allergies ?? "",
      message: existing?.message ?? "",
      email: existing?.email || guest.email,
      phone: existing?.phone || guest.phone,
    },
  });

  if (rsvpQuery.isLoading) return <CardSkeleton />;

  const showForm = open && (editing || !existing);

  const submit = form.handleSubmit((v) => {
    save.mutate(
      {
        ...v,
        guestId: guest.id,
        eventId: event.id,
        updatedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setEditing(false);
          setJustSaved(v.attending);
          if (v.attending !== "no") celebrateRsvp(saveBtn.current);
        },
      },
    );
  });

  const attending = form.watch("attending");
  const dietary = form.watch("dietary");
  const savedCopy = { yes: t.rsvp.savedYes, no: t.rsvp.savedNo } as const;

  return (
    <GlassCard className="p-7" {...entrance()}>
      <h2 className="font-display text-3xl text-ink">{t.rsvp.title}</h2>
      <p className="mt-1.5 text-ink-soft">{t.rsvp.lead}</p>

      {!open ? <p className="mt-5 text-ink-soft">{t.rsvp.closed}</p> : null}

      <AnimatePresence mode="wait" initial={false}>
        {showForm ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => void submit(e)}
            className="mt-6 flex flex-col gap-6"
          >
            <fieldset>
              <legend className="mb-2.5 text-sm font-medium tracking-wide text-ink-soft">
                {t.rsvp.attending}
              </legend>
              <div className="flex flex-wrap gap-2">
                {(["yes", "no"] as const).map((v) => (
                  <Chip key={v} pressed={attending === v} onClick={() => form.setValue("attending", v)}>
                    {t.rsvp[v]}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <AnimatePresence initial={false}>
              {attending !== "no" ? (
                <motion.div
                  key="diet"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-6 overflow-hidden"
                >
                  <fieldset>
                    <legend className="mb-2.5 text-sm font-medium tracking-wide text-ink-soft">
                      {t.rsvp.dietTitle}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {DIET.map((d) => (
                        <Chip
                          key={d}
                          pressed={dietary.includes(d)}
                          onClick={() =>
                            form.setValue(
                              "dietary",
                              dietary.includes(d) ? dietary.filter((x) => x !== d) : [...dietary, d],
                            )
                          }
                        >
                          {t.rsvp.diet[d]}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  <Field label={t.rsvp.allergies} htmlFor="allergies">
                    <TextArea id="allergies" placeholder={t.rsvp.allergiesPh} {...form.register("allergies")} />
                  </Field>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Field label={t.rsvp.message} htmlFor="message">
              <TextArea id="message" placeholder={t.rsvp.messagePh} {...form.register("message")} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.rsvp.email} htmlFor="email" error={form.formState.errors.email ? "✕" : undefined}>
                <TextInput id="email" type="email" autoComplete="email" {...form.register("email")} />
              </Field>
              <Field label={t.rsvp.phone} htmlFor="phone">
                <TextInput id="phone" type="tel" autoComplete="tel" {...form.register("phone")} />
              </Field>
            </div>

            <div ref={saveBtn} className="flex items-center gap-4">
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? t.rsvp.saving : t.rsvp.save}
              </Button>
              <span className="text-sm text-ink-soft">
                {t.rsvp.deadlineNote}{" "}
                {formatEventDate({ ...event, date: event.rsvpDeadline }, lang)}
              </span>
            </div>
          </motion.form>
        ) : existing || justSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6"
            role="status"
          >
            <p className="font-display text-2xl text-ink">
              {savedCopy[justSaved ?? existing!.attending]}
            </p>
            {open ? (
              <Button variant="quiet" className="mt-4" onClick={() => setEditing(true)}>
                <Pencil size={14} aria-hidden /> {t.rsvp.edit}
              </Button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {open ? <PlusOneBlock event={event} guest={guest} /> : null}
    </GlassCard>
  );
}
