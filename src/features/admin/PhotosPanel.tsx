import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminButton, Panel, newId } from "./kit";
import { useDeletePhoto, useSaveGalleryImage, useSavePhoto } from "../../hooks/adminQueries";
import { useGallery } from "../../hooks/queries";
import { data } from "../../services/data";
import type { EventDoc, Photo } from "../../types";

const statusTone: Record<Photo["status"], string> = {
  uploaded: "text-gold-ink",
  approved: "text-sage-deep",
  synced: "text-sage-deep",
};

/** Guest uploads → approve into the public gallery (and later OneDrive sync marks `synced`). */
export function PhotosPanel({ event }: { event: EventDoc }) {
  const photosQuery = useQuery({
    queryKey: ["admin", "photos", event.id],
    queryFn: () => data.adminListPhotos(event.id),
  });
  const photos = photosQuery.data ?? [];
  const gallery = useGallery(event.id).data ?? [];
  const savePhoto = useSavePhoto();
  const saveGallery = useSaveGalleryImage();
  const deletePhoto = useDeletePhoto();

  const approve = (p: Photo) => {
    savePhoto.mutate({ ...p, status: "approved" });
    saveGallery.mutate({
      id: `img-${newId()}`,
      eventId: event.id,
      order: (gallery.at(-1)?.order ?? 0) + 1,
      url: p.url,
      caption: null,
    });
  };

  const pending = photos.filter((p) => p.status === "uploaded").length;

  // Pending (needs-approval) first so the Approve buttons are never buried, then
  // paginate — a full wedding gallery is far too long to show all at once.
  const PAGE = 12;
  const [page, setPage] = useState(0);
  const sorted = useMemo(
    () => [...photos].sort((a, b) => (a.status === "uploaded" ? -1 : 0) - (b.status === "uploaded" ? -1 : 0)),
    [photos],
  );
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const shown = sorted.slice(safePage * PAGE, safePage * PAGE + PAGE);

  return (
    <Panel
      title={`Guest photos (${photos.length} · ${pending} pending)`}
      action={
        pending > 0 ? (
          <AdminButton onClick={() => photos.filter((p) => p.status === "uploaded").forEach(approve)}>
            <Check size={14} /> Approve all {pending}
          </AdminButton>
        ) : null
      }
    >
      {photosQuery.isError ? (
        <p role="alert" className="py-4 text-sm text-err">
          Could not load photos — check that Firestore rules are deployed and ADMIN_EMAIL in{" "}
          <code className="font-mono text-xs">firestore.rules</code> matches your admin account.
        </p>
      ) : null}
      {photos.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-soft">No uploads yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shown.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-xl border border-hairline-soft">
              <img src={p.url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              <div className="flex flex-col gap-1.5 p-2.5 text-xs">
                <p className="truncate text-ink-soft">
                  {p.guestName || p.guestId} ·{" "}
                  <span className={statusTone[p.status]}>{p.status}</span>
                </p>
                <div className="flex gap-1.5">
                  {p.status === "uploaded" ? (
                    <AdminButton className="min-h-8 flex-1 px-2 text-xs" onClick={() => approve(p)}>
                      <Check size={12} /> Approve
                    </AdminButton>
                  ) : null}
                  <AdminButton
                    variant="danger"
                    className="min-h-8 px-2 text-xs"
                    onClick={() =>
                      confirm("Delete this photo?") &&
                      deletePhoto.mutate({ eventId: event.id, id: p.id })
                    }
                  >
                    Delete
                  </AdminButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-ink-soft">
          <AdminButton
            variant="quiet"
            className="min-h-8 px-2"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft size={14} />
          </AdminButton>
          <span className="tnum">
            {safePage * PAGE + 1}–{Math.min(sorted.length, (safePage + 1) * PAGE)} of {sorted.length}
          </span>
          <AdminButton
            variant="quiet"
            className="min-h-8 px-2"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            <ChevronRight size={14} />
          </AdminButton>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-ink-soft">
        Approving adds the photo to the public gallery. Pending uploads are shown first.
      </p>
    </Panel>
  );
}
