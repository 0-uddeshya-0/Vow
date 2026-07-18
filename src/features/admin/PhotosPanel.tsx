import { Check } from "lucide-react";
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
  const photos =
    useQuery({
      queryKey: ["admin", "photos", event.id],
      queryFn: () => data.adminListPhotos(event.id),
    }).data ?? [];
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

  return (
    <Panel title={`Guest photos (${photos.length} · ${pending} pending)`}>
      {photos.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-soft">No uploads yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
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
      <p className="mt-4 text-xs text-ink-soft">
        Approving adds the photo to the public gallery. OneDrive sync (Cloud Function, needs the
        Blaze plan + Azure setup — see docs/ONEDRIVE.md) marks items “synced”.
      </p>
    </Panel>
  );
}
