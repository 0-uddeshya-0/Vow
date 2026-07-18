import { Check, X } from "lucide-react";
import { Panel, Stat, AdminButton, newId } from "./kit";
import { useAdminGuests, useAdminPlusOnes, useAdminRsvps, useSaveGuest, useSavePlusOne } from "../../hooks/adminQueries";
import { useGallery } from "../../hooks/queries";
import { countdownTo, eventStartMs } from "../../lib/datetime";
import type { EventDoc, Guest, PlusOneRequest, Rsvp } from "../../types";

const DIET = ["vegetarian", "vegan", "gluten_free", "lactose_free"] as const;
const DIET_LABEL: Record<(typeof DIET)[number], string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  gluten_free: "Gluten-free",
  lactose_free: "Lactose-free",
};

export function DashboardPanel({ event }: { event: EventDoc }) {
  const guests = useAdminGuests(event.id).data ?? [];
  const rsvps = useAdminRsvps(event.id).data ?? [];
  const plusOnes = useAdminPlusOnes(event.id).data ?? [];
  const gallery = useGallery(event.id).data ?? [];

  const by = (a: Rsvp["attending"]) => rsvps.filter((r) => r.attending === a).length;
  const pending = guests.length - rsvps.length;
  const days = countdownTo(eventStartMs(event)).days;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Accepted" value={by("yes")} tone="ok" />
        <Stat label="Declined" value={by("no")} />
        <Stat label="No reply" value={Math.max(pending, 0)} tone="warn" />
        <Stat label="Guests" value={guests.length} />
        <Stat label="Photos" value={gallery.length} />
        <Stat label="Plus-one requests" value={plusOnes.filter((p) => p.status === "pending").length} />
        <Stat label="Days to go" value={days} />
      </div>

      <DietaryPanel rsvps={rsvps} />
      <PlusOnePanel event={event} requests={plusOnes} guests={guests} />
    </div>
  );
}

function DietaryPanel({ rsvps }: { rsvps: Rsvp[] }) {
  const attending = rsvps.filter((r) => r.attending !== "no");
  const counts = DIET.map((d) => ({
    key: d,
    n: attending.filter((r) => r.dietary.includes(d)).length,
  }));
  const allergies = attending.filter((r) => r.allergies.trim());

  return (
    <Panel title="Catering">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((c) => (
          <Stat key={c.key} label={DIET_LABEL[c.key]} value={c.n} />
        ))}
      </div>
      <h3 className="mt-5 mb-2 text-xs uppercase tracking-[0.12em] text-ink-soft">
        Allergies &amp; notes ({allergies.length})
      </h3>
      {allergies.length === 0 ? (
        <p className="text-sm text-ink-soft">None reported yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {allergies.map((r) => (
            <li key={r.guestId} className="rounded-xl border border-hairline-soft px-4 py-2.5 text-sm">
              <span className="text-ink-soft">{r.guestId}: </span>
              <span className="text-ink">{r.allergies}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/**
 * Approving a plus-one creates a real guest record, so the new person gets
 * their own identify login, personalized schedule and RSVP — exactly like
 * any invited guest.
 */
function PlusOnePanel({
  event,
  requests,
  guests,
}: {
  event: EventDoc;
  requests: PlusOneRequest[];
  guests: Guest[];
}) {
  const savePlusOne = useSavePlusOne();
  const saveGuest = useSaveGuest();

  const nameOf = (id: string) => guests.find((g) => g.id === id)?.fullName ?? id;

  const approve = (req: PlusOneRequest) => {
    const guest: Guest = {
      id: `g-${newId(20)}`,
      eventId: event.id,
      fullName: req.fullName,
      email: req.email,
      phone: req.phone,
      roles: ["Guest"],
      language: guests.find((g) => g.id === req.guestId)?.language ?? "en",
      invitationStatus: "invited",
      reminderCount: 0,
      lastReminderAt: "",
      createdVia: "plus_one",
    };
    saveGuest.mutate(guest);
    savePlusOne.mutate({ ...req, status: "approved" });
  };

  return (
    <Panel title={`Plus-one requests (${requests.filter((r) => r.status === "pending").length} pending)`}>
      {requests.length === 0 ? (
        <p className="text-sm text-ink-soft">No requests yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {requests.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-ink">
                  {r.fullName}{" "}
                  <span className="text-sm text-ink-soft">
                    · requested by {nameOf(r.guestId)}
                  </span>
                </p>
                <p className="text-sm text-ink-soft">{r.email || r.phone || "no contact given"}</p>
              </div>
              {r.status === "pending" ? (
                <div className="flex gap-2">
                  <AdminButton onClick={() => approve(r)}>
                    <Check size={14} /> Approve
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    onClick={() => savePlusOne.mutate({ ...r, status: "rejected" })}
                  >
                    <X size={14} /> Reject
                  </AdminButton>
                </div>
              ) : (
                <span
                  className={`text-sm ${r.status === "approved" ? "text-sage-deep" : "text-ink-soft"}`}
                >
                  {r.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
