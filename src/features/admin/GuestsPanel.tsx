import { useMemo, useState } from "react";
import { Download, Mail, MessageCircle, Plus, Printer, Search, Upload, UserPen } from "lucide-react";
import {
  AdminButton,
  Input,
  Labeled,
  Modal,
  Panel,
  Select,
  newId,
} from "./kit";
import { useAdminGuests, useAdminRsvps, useDeleteGuest, useSaveGuest } from "../../hooks/adminQueries";
import { ImportGuestsModal } from "./ImportGuestsModal";
import { exportCsv, exportExcel, printTable, type Column } from "../../lib/export";
import { mailtoUrl, whatsappUrl } from "../../lib/reminders";
import type { EventDoc, Guest, Rsvp } from "../../types";

const STATUSES: Guest["invitationStatus"][] = [
  "not_invited",
  "invited",
  "reminder_sent",
  "accepted",
  "declined",
  "cancelled",
];

const statusTone: Record<Guest["invitationStatus"], string> = {
  not_invited: "text-ink-soft",
  invited: "text-ink",
  reminder_sent: "text-gold-ink",
  accepted: "text-sage-deep",
  declined: "text-ink-soft",
  cancelled: "text-err",
};

function blankGuest(eventId: string): Guest {
  return {
    id: `g-${newId(20)}`,
    eventId,
    fullName: "",
    email: "",
    phone: "",
    roles: ["Guest"],
    language: "en",
    invitationStatus: "not_invited",
    reminderCount: 0,
    lastReminderAt: "",
    createdVia: "admin",
  };
}

export function GuestsPanel({ event }: { event: EventDoc }) {
  const guests = useAdminGuests(event.id).data ?? [];
  const rsvps = useAdminRsvps(event.id).data ?? [];
  const saveGuest = useSaveGuest();
  const deleteGuest = useDeleteGuest();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Guest["invitationStatus"]>("all");
  const [sort, setSort] = useState<"name" | "status" | "role">("name");
  const [editing, setEditing] = useState<Guest | null>(null);
  const [importing, setImporting] = useState(false);

  const rsvpOf = (id: string) => rsvps.find((r) => r.guestId === id) ?? null;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return guests
      .filter((g) => (status === "all" ? true : g.invitationStatus === status))
      .filter(
        (g) =>
          !needle ||
          [g.fullName, g.email, g.phone, g.roles.join(" ")].join(" ").toLowerCase().includes(needle),
      )
      .sort((a, b) =>
        sort === "name"
          ? a.fullName.localeCompare(b.fullName)
          : sort === "status"
            ? a.invitationStatus.localeCompare(b.invitationStatus)
            : (a.roles[0] ?? "").localeCompare(b.roles[0] ?? ""),
      );
  }, [guests, q, status, sort]);

  const columns: Column<Guest>[] = [
    { header: "Name", value: (g) => g.fullName },
    { header: "Email", value: (g) => g.email },
    { header: "Phone", value: (g) => g.phone },
    { header: "Roles", value: (g) => g.roles.join(", ") },
    { header: "Language", value: (g) => g.language },
    { header: "Invitation", value: (g) => g.invitationStatus },
    { header: "RSVP", value: (g) => rsvpOf(g.id)?.attending ?? "—" },
    { header: "Dietary", value: (g) => (rsvpOf(g.id)?.dietary ?? []).join(", ") },
    { header: "Allergies", value: (g) => rsvpOf(g.id)?.allergies ?? "" },
    { header: "Reminders", value: (g) => String(g.reminderCount) },
  ];

  /** Opening the pre-composed message counts as a reminder; admin still presses send. */
  const trackReminder = (g: Guest) =>
    saveGuest.mutate({
      ...g,
      reminderCount: g.reminderCount + 1,
      lastReminderAt: new Date().toISOString(),
      invitationStatus: g.invitationStatus === "invited" ? "reminder_sent" : g.invitationStatus,
    });

  return (
    <Panel
      title={`Guests (${guests.length})`}
      action={
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="quiet" onClick={() => exportCsv(rows, columns, "guests.csv")}>
            <Download size={14} /> CSV
          </AdminButton>
          <AdminButton variant="quiet" onClick={() => exportExcel(rows, columns, "guests.xls")}>
            <Download size={14} /> Excel
          </AdminButton>
          <AdminButton variant="quiet" onClick={() => printTable(rows, columns, "Guest list")}>
            <Printer size={14} /> Print
          </AdminButton>
          <AdminButton variant="quiet" onClick={() => setImporting(true)}>
            <Upload size={14} /> Import
          </AdminButton>
          <AdminButton onClick={() => setEditing(blankGuest(event.id))}>
            <Plus size={14} /> Add guest
          </AdminButton>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone, role"
            aria-label="Search guests"
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          aria-label="Filter by invitation status"
          className="max-w-44"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          aria-label="Sort guests"
          className="max-w-36"
        >
          <option value="name">Sort: name</option>
          <option value="status">Sort: status</option>
          <option value="role">Sort: role</option>
        </Select>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-soft">No guests match.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((g) => {
            const r = rsvpOf(g.id);
            const wa = whatsappUrl(g, event);
            const mail = mailtoUrl(g, event);
            return (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-ink">
                    {g.fullName || <span className="text-ink-soft">(no name)</span>}
                    <span className={`text-xs uppercase tracking-wide ${statusTone[g.invitationStatus]}`}>
                      {g.invitationStatus.replace("_", " ")}
                    </span>
                    {r ? (
                      <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-gold-ink">
                        RSVP {r.attending}
                      </span>
                    ) : null}
                    {g.createdVia === "plus_one" ? (
                      <span className="text-[11px] text-ink-soft">via plus-one</span>
                    ) : null}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {[g.email, g.phone, g.roles.join(" · "), g.language.toUpperCase()]
                      .filter(Boolean)
                      .join("  ·  ")}
                    {g.reminderCount ? `  ·  ${g.reminderCount} reminder(s)` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {wa ? (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={() => trackReminder(g)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-hairline-soft px-3.5 text-sm text-ink-soft hover:border-hairline hover:text-ink"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  ) : null}
                  {mail ? (
                    <a
                      href={mail}
                      onClick={() => trackReminder(g)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-hairline-soft px-3.5 text-sm text-ink-soft hover:border-hairline hover:text-ink"
                    >
                      <Mail size={14} /> Email
                    </a>
                  ) : null}
                  <AdminButton variant="quiet" onClick={() => setEditing(g)}>
                    <UserPen size={14} /> Edit
                  </AdminButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {importing ? (
        <ImportGuestsModal
          eventId={event.id}
          existing={guests.map((g) => ({ email: g.email, phone: g.phone }))}
          onClose={() => setImporting(false)}
        />
      ) : null}

      {editing ? (
        <GuestModal
          guest={editing}
          rsvp={rsvpOf(editing.id)}
          onClose={() => setEditing(null)}
          onSave={(g) => {
            saveGuest.mutate(g);
            setEditing(null);
          }}
          onDelete={(g) => {
            if (confirm(`Delete ${g.fullName || "this guest"}? Their RSVP is removed too.`)) {
              deleteGuest.mutate({ eventId: g.eventId, id: g.id });
              setEditing(null);
            }
          }}
        />
      ) : null}
    </Panel>
  );
}

function GuestModal({
  guest,
  rsvp,
  onClose,
  onSave,
  onDelete,
}: {
  guest: Guest;
  rsvp: Rsvp | null;
  onClose: () => void;
  onSave: (g: Guest) => void;
  onDelete: (g: Guest) => void;
}) {
  const [draft, setDraft] = useState<Guest>(guest);
  const set = (p: Partial<Guest>) => setDraft((d) => ({ ...d, ...p }));

  return (
    <Modal
      title={guest.fullName ? `Edit ${guest.fullName}` : "New guest"}
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="danger" onClick={() => onDelete(draft)}>
            Delete
          </AdminButton>
          <AdminButton variant="quiet" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton onClick={() => onSave(draft)} disabled={!draft.fullName.trim()}>
            Save
          </AdminButton>
        </>
      }
    >
      <Labeled label="Full name">
        <Input autoFocus value={draft.fullName} onChange={(e) => set({ fullName: e.target.value })} />
      </Labeled>
      <div className="grid gap-3 sm:grid-cols-2">
        <Labeled label="Email">
          <Input type="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} />
        </Labeled>
        <Labeled label="Phone" hint="International format, e.g. +49…">
          <Input type="tel" value={draft.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Labeled>
      </div>
      <Labeled label="Roles" hint="Comma separated — drives schedule and message visibility">
        <Input
          value={draft.roles.join(", ")}
          onChange={(e) =>
            set({ roles: e.target.value.split(",").map((r) => r.trim()).filter(Boolean) })
          }
        />
      </Labeled>
      <div className="grid gap-3 sm:grid-cols-2">
        <Labeled label="Language" hint="Used for reminder messages">
          <Select value={draft.language} onChange={(e) => set({ language: e.target.value as "en" | "de" })}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </Select>
        </Labeled>
        <Labeled label="Invitation status">
          <Select
            value={draft.invitationStatus}
            onChange={(e) => set({ invitationStatus: e.target.value as Guest["invitationStatus"] })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </Select>
        </Labeled>
      </div>

      {rsvp ? (
        <div className="rounded-xl border border-hairline-soft p-4 text-sm">
          <p className="mb-1 text-xs uppercase tracking-[0.12em] text-ink-soft">Their RSVP</p>
          <p className="text-ink">
            {rsvp.attending}
            {rsvp.dietary.length ? ` · ${rsvp.dietary.join(", ")}` : ""}
          </p>
          {rsvp.allergies ? <p className="mt-1 text-ink-soft">Allergies: {rsvp.allergies}</p> : null}
          {rsvp.message ? <p className="mt-1 text-ink-soft">“{rsvp.message}”</p> : null}
        </div>
      ) : null}
    </Modal>
  );
}
