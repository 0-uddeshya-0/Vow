import { useState } from "react";
import { Plus } from "lucide-react";
import {
  AdminButton,
  Input,
  Labeled,
  LocalizedInput,
  Modal,
  Panel,
  ReorderControls,
  Select,
  Textarea,
  emptyText,
  newId,
} from "./kit";
import {
  useDeleteFaq,
  useDeleteGalleryImage,
  useDeleteGift,
  useDeleteHotel,
  useDeleteMessage,
  useDeletePromo,
  useDeleteScheduleItem,
  useSaveFaq,
  useSaveGalleryImage,
  useSaveGift,
  useSaveHotel,
  useSaveMessage,
  useSavePromo,
  useSaveScheduleItem,
} from "../../hooks/adminQueries";
import { useAdminGuests } from "../../hooks/adminQueries";
import { useFaq, useGallery, useGifts, useHotels, useMessages, usePromos, useSchedule } from "../../hooks/queries";
import { ImageField } from "./ImageField";
import { IconField } from "./IconField";
import type {
  EventDoc,
  FaqItem,
  GalleryImage,
  Gift,
  Hotel,
  Location,
  Message,
  Promo,
  ScheduleItem,
  Visibility,
} from "../../types";

const EMPTY_LOCATION: Location = {
  name: "",
  address: "",
  lat: null,
  lng: null,
  googleMapsUrl: "",
  appleMapsUrl: "",
  osmUrl: "",
};

/** Swap `order` with the neighbour and persist both — reorder without a library. */
function useReorder<T extends { id: string; order: number }>(save: (item: T) => void) {
  return (list: T[], index: number, dir: -1 | 1) => {
    const target = list[index + dir];
    const item = list[index];
    if (!target || !item) return;
    save({ ...item, order: target.order });
    save({ ...target, order: item.order });
  };
}

function VisibilityEditor({
  value,
  onChange,
  eventId,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
  eventId: string;
}) {
  const guests = useAdminGuests(eventId).data ?? [];
  const allRoles = [...new Set(guests.flatMap((g) => g.roles))].sort();

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const chip = (on: boolean) =>
    `min-h-9 rounded-full border px-3 text-sm cursor-pointer transition-colors ${
      on ? "border-sage-deep bg-sage-deep text-on-accent" : "border-hairline-soft text-ink hover:border-hairline"
    }`;

  return (
    <div className="rounded-xl border border-hairline-soft p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-ink-soft">Visibility</p>
      <p className="mt-1 text-sm text-ink-soft">
        Nothing selected = visible to everyone. Selecting roles or guests restricts it to them.
      </p>
      {allRoles.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {allRoles.map((r) => (
            <button
              key={r}
              type="button"
              className={chip(value.allowedRoles.includes(r))}
              onClick={() => onChange({ ...value, allowedRoles: toggle(value.allowedRoles, r) })}
            >
              {r}
            </button>
          ))}
        </div>
      ) : null}
      {guests.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {guests.map((g) => (
            <button
              key={g.id}
              type="button"
              className={chip(value.allowedGuests.includes(g.id))}
              onClick={() => onChange({ ...value, allowedGuests: toggle(value.allowedGuests, g.id) })}
            >
              {g.fullName || g.id}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function LocationEditor({
  value,
  onChange,
}: {
  value: Location;
  onChange: (v: Location) => void;
}) {
  return (
    <div className="rounded-xl border border-hairline-soft p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.12em] text-ink-soft">Location</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Labeled label="Name">
          <Input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        </Labeled>
        <Labeled label="Address">
          <Input value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} />
        </Labeled>
      </div>
      <Labeled label="Google Maps URL">
        <Input
          value={value.googleMapsUrl}
          onChange={(e) => onChange({ ...value, googleMapsUrl: e.target.value })}
        />
      </Labeled>
      <p className="mt-2 text-xs text-ink-soft">
        Apple &amp; OpenStreetMap links are generated from the address automatically.
      </p>
    </div>
  );
}

/* ——— Schedule ——— */

export function SchedulePanel({ event }: { event: EventDoc }) {
  const items = useSchedule(event.id).data ?? [];
  const save = useSaveScheduleItem();
  const del = useDeleteScheduleItem();
  const move = useReorder<ScheduleItem>((i) => save.mutate(i));
  const [editing, setEditing] = useState<ScheduleItem | null>(null);

  const blank = (): ScheduleItem => ({
    id: `s-${newId()}`,
    eventId: event.id,
    order: (items.at(-1)?.order ?? 0) + 1,
    title: emptyText(),
    description: emptyText(),
    imageUrl: "",
    date: event.date,
    start: "12:00",
    end: null,
    location: { ...EMPTY_LOCATION },
    notes: null,
    icon: "",
    parkingNote: null,
    parkingLocation: null,
    visibility: { allowedRoles: [], allowedGuests: [] },
  });

  return (
    <Panel
      title={`Schedule (${items.length})`}
      action={
        <AdminButton onClick={() => setEditing(blank())}>
          <Plus size={14} /> Add item
        </AdminButton>
      }
    >
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
          >
            <div className="min-w-0">
              <p className="tnum text-sm text-gold-ink">
                {item.start}
                {item.end ? ` – ${item.end}` : ""} · {item.date}
              </p>
              <p className="text-ink">{item.title.en || "(untitled)"}</p>
              <p className="truncate text-sm text-ink-soft">
                {item.location.name}
                {item.visibility.allowedRoles.length || item.visibility.allowedGuests.length
                  ? "  ·  restricted"
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton variant="quiet" onClick={() => setEditing(item)}>
                Edit
              </AdminButton>
              <ReorderControls
                onUp={() => move(items, i, -1)}
                onDown={() => move(items, i, 1)}
                onDelete={() =>
                  confirm("Delete this schedule item?") &&
                  del.mutate({ eventId: event.id, id: item.id })
                }
                disableUp={i === 0}
                disableDown={i === items.length - 1}
              />
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <ScheduleModal
          item={editing}
          event={event}
          onClose={() => setEditing(null)}
          onSave={(i) => {
            save.mutate(i);
            setEditing(null);
          }}
        />
      ) : null}
    </Panel>
  );
}

function ScheduleModal({
  item,
  event,
  onClose,
  onSave,
}: {
  item: ScheduleItem;
  event: EventDoc;
  onClose: () => void;
  onSave: (i: ScheduleItem) => void;
}) {
  const [d, setD] = useState<ScheduleItem>(item);
  const set = (p: Partial<ScheduleItem>) => setD((x) => ({ ...x, ...p }));

  return (
    <Modal
      title="Schedule item"
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="quiet" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton onClick={() => onSave(d)}>Save</AdminButton>
        </>
      }
    >
      <LocalizedInput label="Title" value={d.title} onChange={(v) => set({ title: v })} />
      <LocalizedInput
        label="Description"
        value={d.description}
        onChange={(v) => set({ description: v })}
        multiline
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Labeled label="Date">
          <Input type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} />
        </Labeled>
        <Labeled label="Start">
          <Input type="time" value={d.start} onChange={(e) => set({ start: e.target.value })} />
        </Labeled>
        <Labeled label="End" hint="optional">
          <Input
            type="time"
            value={d.end ?? ""}
            onChange={(e) => set({ end: e.target.value || null })}
          />
        </Labeled>
      </div>
      <div className="flex flex-col gap-3">
        <IconField value={d.icon} onChange={(v) => set({ icon: v })} event={event} />
        <ImageField
          label="Banner image"
          hint="optional — shown across the top of the card"
          value={d.imageUrl}
          onChange={(url) => set({ imageUrl: url })}
          event={event}
        />
      </div>
      <LocationEditor value={d.location} onChange={(v) => set({ location: v })} />
      <LocalizedInput
        label="Notes"
        value={d.notes ?? emptyText()}
        onChange={(v) => set({ notes: v.en || v.de ? v : null })}
      />
      <div className="rounded-xl border border-hairline-soft p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.12em] text-ink-soft">Parking (optional)</p>
        <LocalizedInput
          label="Parking note"
          value={d.parkingNote ?? emptyText()}
          onChange={(v) => set({ parkingNote: v.en || v.de ? v : null })}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Labeled label="Parking place name">
            <Input
              value={d.parkingLocation?.name ?? ""}
              onChange={(e) =>
                set({
                  parkingLocation: { ...(d.parkingLocation ?? { ...EMPTY_LOCATION }), name: e.target.value },
                })
              }
            />
          </Labeled>
          <Labeled label="Parking Google Maps URL">
            <Input
              value={d.parkingLocation?.googleMapsUrl ?? ""}
              onChange={(e) =>
                set({
                  parkingLocation: {
                    ...(d.parkingLocation ?? { ...EMPTY_LOCATION }),
                    googleMapsUrl: e.target.value,
                  },
                })
              }
            />
          </Labeled>
        </div>
      </div>
      <VisibilityEditor
        eventId={d.eventId}
        value={d.visibility}
        onChange={(v) => set({ visibility: v })}
      />
    </Modal>
  );
}

/* ——— Hotels ——— */

export function HotelsPanel({ event }: { event: EventDoc }) {
  const items = useHotels(event.id).data ?? [];
  const save = useSaveHotel();
  const del = useDeleteHotel();
  const move = useReorder<Hotel>((h) => save.mutate(h));
  const [editing, setEditing] = useState<Hotel | null>(null);

  const blank = (): Hotel => ({
    id: `h-${newId()}`,
    eventId: event.id,
    order: (items.at(-1)?.order ?? 0) + 1,
    name: "",
    description: emptyText(),
    images: [],
    recommended: false,
    websiteUrl: "",
    bookingUrl: "",
    phone: "",
    priceCategory: "€€",
    walkingMinutes: null,
    drivingMinutes: null,
    location: { ...EMPTY_LOCATION },
  });

  return (
    <Panel
      title={`Hotels (${items.length})`}
      action={
        <AdminButton onClick={() => setEditing(blank())}>
          <Plus size={14} /> Add hotel
        </AdminButton>
      }
    >
      <ul className="flex flex-col gap-2">
        {items.map((h, i) => (
          <li
            key={h.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-ink">
                {h.name || "(unnamed)"}{" "}
                {h.recommended ? <span className="text-sm text-gold-ink">· recommended</span> : null}
              </p>
              <p className="truncate text-sm text-ink-soft">
                {h.priceCategory}
                {h.phone ? ` · ${h.phone}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton variant="quiet" onClick={() => setEditing(h)}>
                Edit
              </AdminButton>
              <ReorderControls
                onUp={() => move(items, i, -1)}
                onDown={() => move(items, i, 1)}
                onDelete={() => confirm("Delete this hotel?") && del.mutate({ eventId: event.id, id: h.id })}
                disableUp={i === 0}
                disableDown={i === items.length - 1}
              />
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <HotelModal
          hotel={editing}
          event={event}
          onClose={() => setEditing(null)}
          onSave={(h) => {
            save.mutate(h);
            setEditing(null);
          }}
        />
      ) : null}
    </Panel>
  );
}

function HotelModal({
  hotel,
  event,
  onClose,
  onSave,
}: {
  hotel: Hotel;
  event: EventDoc;
  onClose: () => void;
  onSave: (h: Hotel) => void;
}) {
  const [d, setD] = useState<Hotel>(hotel);
  const set = (p: Partial<Hotel>) => setD((x) => ({ ...x, ...p }));
  const num = (v: string) => (v.trim() === "" ? null : Number(v));

  return (
    <Modal
      title="Hotel"
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="quiet" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton onClick={() => onSave(d)} disabled={!d.name.trim()}>
            Save
          </AdminButton>
        </>
      }
    >
      <Labeled label="Name">
        <Input autoFocus value={d.name} onChange={(e) => set({ name: e.target.value })} />
      </Labeled>
      <LocalizedInput label="Description" value={d.description} onChange={(v) => set({ description: v })} multiline />
      <div className="grid gap-3 sm:grid-cols-2">
        <Labeled label="Website URL">
          <Input value={d.websiteUrl} onChange={(e) => set({ websiteUrl: e.target.value })} />
        </Labeled>
        <Labeled label="Booking URL">
          <Input value={d.bookingUrl} onChange={(e) => set({ bookingUrl: e.target.value })} />
        </Labeled>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Labeled label="Phone">
          <Input value={d.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Labeled>
        <Labeled label="Price">
          <Select
            value={d.priceCategory}
            onChange={(e) => set({ priceCategory: e.target.value as Hotel["priceCategory"] })}
          >
            <option>€</option>
            <option>€€</option>
            <option>€€€</option>
          </Select>
        </Labeled>
        <Labeled label="Walk (min)">
          <Input
            type="number"
            value={d.walkingMinutes ?? ""}
            onChange={(e) => set({ walkingMinutes: num(e.target.value) })}
          />
        </Labeled>
        <Labeled label="Drive (min)">
          <Input
            type="number"
            value={d.drivingMinutes ?? ""}
            onChange={(e) => set({ drivingMinutes: num(e.target.value) })}
          />
        </Labeled>
      </div>
      <ImageField
        label="Add image"
        hint="browse from this device or paste a link — adds to the list below"
        value=""
        onChange={(url) => url && set({ images: [...d.images, url] })}
        event={event}
      />
      <Labeled label="Image URLs" hint="One per line">
        <Textarea
          value={d.images.join("\n")}
          onChange={(e) => set({ images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
        />
      </Labeled>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={d.recommended}
          onChange={(e) => set({ recommended: e.target.checked })}
        />
        Show “recommended” badge
      </label>
      <LocationEditor value={d.location} onChange={(v) => set({ location: v })} />
    </Modal>
  );
}

/* ——— FAQ ——— */

export function FaqPanel({ event }: { event: EventDoc }) {
  const items = useFaq(event.id).data ?? [];
  const save = useSaveFaq();
  const del = useDeleteFaq();
  const move = useReorder<FaqItem>((f) => save.mutate(f));
  const [editing, setEditing] = useState<FaqItem | null>(null);

  const blank = (): FaqItem => ({
    id: `f-${newId()}`,
    eventId: event.id,
    order: (items.at(-1)?.order ?? 0) + 1,
    question: emptyText(),
    answer: emptyText(),
  });

  return (
    <Panel
      title={`FAQ (${items.length})`}
      action={
        <AdminButton onClick={() => setEditing(blank())}>
          <Plus size={14} /> Add question
        </AdminButton>
      }
    >
      <ul className="flex flex-col gap-2">
        {items.map((f, i) => (
          <li
            key={f.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
          >
            <p className="min-w-0 truncate text-ink">{f.question.en || "(empty)"}</p>
            <div className="flex items-center gap-2">
              <AdminButton variant="quiet" onClick={() => setEditing(f)}>
                Edit
              </AdminButton>
              <ReorderControls
                onUp={() => move(items, i, -1)}
                onDown={() => move(items, i, 1)}
                onDelete={() => confirm("Delete this question?") && del.mutate({ eventId: event.id, id: f.id })}
                disableUp={i === 0}
                disableDown={i === items.length - 1}
              />
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal
          title="FAQ item"
          onClose={() => setEditing(null)}
          footer={
            <>
              <AdminButton variant="quiet" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
              <AdminButton
                onClick={() => {
                  save.mutate(editing);
                  setEditing(null);
                }}
              >
                Save
              </AdminButton>
            </>
          }
        >
          <LocalizedInput
            label="Question"
            value={editing.question}
            onChange={(v) => setEditing({ ...editing, question: v })}
          />
          <LocalizedInput
            label="Answer"
            value={editing.answer}
            onChange={(v) => setEditing({ ...editing, answer: v })}
            multiline
          />
        </Modal>
      ) : null}
    </Panel>
  );
}

/* ——— Gifts / registry links ——— */

export function GiftsPanel({ event }: { event: EventDoc }) {
  const items = useGifts(event.id).data ?? [];
  const save = useSaveGift();
  const del = useDeleteGift();
  const move = useReorder<Gift>((g) => save.mutate(g));
  const [editing, setEditing] = useState<Gift | null>(null);

  const blank = (): Gift => ({
    id: `g-${newId()}`,
    eventId: event.id,
    order: (items.at(-1)?.order ?? 0) + 1,
    title: emptyText(),
    description: emptyText(),
    url: "",
    imageUrl: "",
  });

  return (
    <Panel
      title={`Gifts (${items.length})`}
      action={
        <AdminButton onClick={() => setEditing(blank())}>
          <Plus size={14} /> Add gift
        </AdminButton>
      }
    >
      <p className="mb-3 text-sm text-ink-soft">
        Plain registry or fund links shown to guests — no affiliate tags. Leave empty to hide the
        section entirely.
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((g, i) => (
          <li
            key={g.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
          >
            <p className="min-w-0 truncate text-ink">{g.title.en || g.title.de || "(untitled)"}</p>
            <div className="flex items-center gap-2">
              <AdminButton variant="quiet" onClick={() => setEditing(g)}>
                Edit
              </AdminButton>
              <ReorderControls
                onUp={() => move(items, i, -1)}
                onDown={() => move(items, i, 1)}
                onDelete={() => confirm("Delete this gift link?") && del.mutate({ eventId: event.id, id: g.id })}
                disableUp={i === 0}
                disableDown={i === items.length - 1}
              />
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal
          title="Gift link"
          onClose={() => setEditing(null)}
          footer={
            <>
              <AdminButton variant="quiet" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
              <AdminButton
                onClick={() => {
                  save.mutate(editing);
                  setEditing(null);
                }}
              >
                Save
              </AdminButton>
            </>
          }
        >
          <LocalizedInput
            label="Title"
            value={editing.title}
            onChange={(v) => setEditing({ ...editing, title: v })}
          />
          <LocalizedInput
            label="Description"
            value={editing.description ?? emptyText()}
            onChange={(v) => setEditing({ ...editing, description: v })}
            multiline
          />
          <Labeled label="Link URL" hint="The registry or fund page. Paste it exactly — no affiliate tags.">
            <Input
              value={editing.url}
              inputMode="url"
              placeholder="https://…"
              onChange={(e) => setEditing({ ...editing, url: e.target.value })}
            />
          </Labeled>
          <Labeled label="Image URL (optional)" hint="A public image link, or leave blank for the gift icon.">
            <Input
              value={editing.imageUrl}
              inputMode="url"
              placeholder="https://…"
              onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
            />
          </Labeled>
        </Modal>
      ) : null}
    </Panel>
  );
}

/* ——— Recommendations / promos ——— */

export function PromosPanel({ event }: { event: EventDoc }) {
  const items = usePromos(event.id).data ?? [];
  const save = useSavePromo();
  const del = useDeletePromo();
  const move = useReorder<Promo>((p) => save.mutate(p));
  const [editing, setEditing] = useState<Promo | null>(null);

  const blank = (): Promo => ({
    id: `pr-${newId()}`,
    eventId: event.id,
    order: (items.at(-1)?.order ?? 0) + 1,
    label: emptyText(),
    title: emptyText(),
    body: emptyText(),
    url: "",
    imageUrl: "",
  });

  return (
    <Panel
      title={`Recommendations (${items.length})`}
      action={
        <AdminButton onClick={() => setEditing(blank())}>
          <Plus size={14} /> Add recommendation
        </AdminButton>
      }
    >
      <p className="mb-3 text-sm text-ink-soft">
        Places and people you recommend to guests — a photographer, a taxi firm, a favourite café.
        Shown to guests as your recommendations.
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((p, i) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
          >
            <p className="min-w-0 truncate text-ink">{p.title.en || p.title.de || "(untitled)"}</p>
            <div className="flex items-center gap-2">
              <AdminButton variant="quiet" onClick={() => setEditing(p)}>
                Edit
              </AdminButton>
              <ReorderControls
                onUp={() => move(items, i, -1)}
                onDown={() => move(items, i, 1)}
                onDelete={() => confirm("Delete this recommendation?") && del.mutate({ eventId: event.id, id: p.id })}
                disableUp={i === 0}
                disableDown={i === items.length - 1}
              />
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal
          title="Recommendation"
          onClose={() => setEditing(null)}
          footer={
            <>
              <AdminButton variant="quiet" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
              <AdminButton
                onClick={() => {
                  save.mutate(editing);
                  setEditing(null);
                }}
              >
                Save
              </AdminButton>
            </>
          }
        >
          <LocalizedInput
            label="Category chip (optional)"
            value={editing.label ?? emptyText()}
            onChange={(v) => setEditing({ ...editing, label: v })}
          />
          <LocalizedInput
            label="Name"
            value={editing.title}
            onChange={(v) => setEditing({ ...editing, title: v })}
          />
          <LocalizedInput
            label="Description"
            value={editing.body ?? emptyText()}
            onChange={(v) => setEditing({ ...editing, body: v })}
            multiline
          />
          <Labeled label="Link URL" hint="Their website or booking page.">
            <Input
              value={editing.url}
              inputMode="url"
              placeholder="https://…"
              onChange={(e) => setEditing({ ...editing, url: e.target.value })}
            />
          </Labeled>
          <Labeled label="Image URL (optional)" hint="A public image link, or leave blank.">
            <Input
              value={editing.imageUrl}
              inputMode="url"
              placeholder="https://…"
              onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
            />
          </Labeled>
        </Modal>
      ) : null}
    </Panel>
  );
}

/* ——— Gallery ——— */

export function GalleryPanel({ event }: { event: EventDoc }) {
  const items = useGallery(event.id).data ?? [];
  const save = useSaveGalleryImage();
  const del = useDeleteGalleryImage();
  const move = useReorder<GalleryImage>((g) => save.mutate(g));
  const [url, setUrl] = useState("");

  const add = () => {
    if (!url.trim()) return;
    save.mutate({
      id: `img-${newId()}`,
      eventId: event.id,
      order: (items.at(-1)?.order ?? 0) + 1,
      url: url.trim(),
      caption: null,
    });
    setUrl("");
  };

  return (
    <Panel title={`Gallery (${items.length})`}>
      <div className="mb-4 flex flex-col gap-3">
        <ImageField
          label="Add image"
          hint="browse from this device or paste a public link"
          value={url}
          onChange={setUrl}
          event={event}
        />
        <AdminButton className="w-fit" onClick={add} disabled={!url.trim()}>
          <Plus size={14} /> Add to gallery
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-soft">No images yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((img, i) => (
            <li key={img.id} className="overflow-hidden rounded-xl border border-hairline-soft">
              <img src={img.url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              <div className="flex justify-center p-2">
                <ReorderControls
                  onUp={() => move(items, i, -1)}
                  onDown={() => move(items, i, 1)}
                  onDelete={() => del.mutate({ eventId: event.id, id: img.id })}
                  disableUp={i === 0}
                  disableDown={i === items.length - 1}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ——— Messages ——— */

export function MessagesPanel({ event }: { event: EventDoc }) {
  const items = useMessages(event.id).data ?? [];
  const save = useSaveMessage();
  const del = useDeleteMessage();
  const [editing, setEditing] = useState<Message | null>(null);

  const blank = (): Message => ({
    id: `m-${newId()}`,
    eventId: event.id,
    createdAt: new Date().toISOString(),
    title: emptyText(),
    body: emptyText(),
    visibility: { allowedRoles: [], allowedGuests: [] },
  });

  return (
    <Panel
      title={`Messages (${items.length})`}
      action={
        <AdminButton onClick={() => setEditing(blank())}>
          <Plus size={14} /> New message
        </AdminButton>
      }
    >
      <ul className="flex flex-col gap-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-soft px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-ink">{m.title.en || "(untitled)"}</p>
              <p className="truncate text-sm text-ink-soft">
                {m.visibility.allowedRoles.length || m.visibility.allowedGuests.length
                  ? `restricted · ${m.visibility.allowedRoles.join(", ")}`
                  : "everyone"}
              </p>
            </div>
            <div className="flex gap-2">
              <AdminButton variant="quiet" onClick={() => setEditing(m)}>
                Edit
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={() => confirm("Delete this message?") && del.mutate({ eventId: event.id, id: m.id })}
              >
                Delete
              </AdminButton>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal
          title="Message"
          onClose={() => setEditing(null)}
          footer={
            <>
              <AdminButton variant="quiet" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
              <AdminButton
                onClick={() => {
                  save.mutate(editing);
                  setEditing(null);
                }}
              >
                Save
              </AdminButton>
            </>
          }
        >
          <LocalizedInput
            label="Title"
            value={editing.title}
            onChange={(v) => setEditing({ ...editing, title: v })}
          />
          <LocalizedInput
            label="Body"
            value={editing.body}
            onChange={(v) => setEditing({ ...editing, body: v })}
            multiline
          />
          <VisibilityEditor
            eventId={event.id}
            value={editing.visibility}
            onChange={(v) => setEditing({ ...editing, visibility: v })}
          />
        </Modal>
      ) : null}
    </Panel>
  );
}
