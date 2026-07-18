import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ImagePlus, TriangleAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useI18n } from "../../i18n";
import { data } from "../../services/data";
import { compressImage } from "../../lib/image";
import { GlassCard } from "../../components/ui/GlassCard";
import { entrance } from "../../animations/variants";
import { useMyPhotos } from "../../hooks/queries";
import type { EventDoc, Guest } from "../../types";

type UploadItem = {
  key: string;
  name: string;
  progress: number;
  status: "compressing" | "uploading" | "done" | "error";
};

const MAX_FILES_PER_BATCH = 20;

/** Drag & drop / picker → compress → upload with per-file progress bars. */
export function PhotoUpload({ event, guest }: { event: EventDoc; guest: Guest }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const mine = useMyPhotos(event.id, guest.id).data ?? [];

  const patch = (key: string, p: Partial<UploadItem>) =>
    setItems((list) => list.map((i) => (i.key === key ? { ...i, ...p } : i)));

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const batch = [...files].slice(0, MAX_FILES_PER_BATCH);
      for (const file of batch) {
        const key = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setItems((l) => [...l, { key, name: file.name, progress: 0, status: "compressing" }]);
        try {
          const blob = await compressImage(file);
          patch(key, { status: "uploading" });
          await data.uploadPhoto(event.id, guest, blob, (f) => patch(key, { progress: f }));
          patch(key, { status: "done", progress: 1 });
        } catch {
          patch(key, { status: "error" });
        }
      }
      void qc.invalidateQueries({ queryKey: ["myPhotos", event.id, guest.id] });
    },
    [event.id, guest, qc],
  );

  return (
    <GlassCard className="p-6" {...entrance()}>
      <div
        role="button"
        tabIndex={0}
        aria-label={t.photos.upload}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-gold bg-gold/10" : "border-hairline-soft hover:border-hairline"
        }`}
      >
        <ImagePlus size={26} className="text-gold-ink" aria-hidden />
        <p className="font-medium text-ink">{t.photos.upload}</p>
        <p className="max-w-[38ch] text-sm text-ink-soft">{t.photos.uploadHint}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          data-testid="photo-input"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length ? (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((i) => (
            <li key={i.key} className="rounded-xl border border-hairline-soft px-4 py-2.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-ink">{i.name}</span>
                {i.status === "done" ? (
                  <CheckCircle2 size={15} className="shrink-0 text-sage-deep" aria-hidden />
                ) : i.status === "error" ? (
                  <TriangleAlert size={15} className="shrink-0 text-err" aria-hidden />
                ) : (
                  <span className="tnum shrink-0 text-ink-soft">
                    {i.status === "compressing" ? "…" : `${Math.round(i.progress * 100)}%`}
                  </span>
                )}
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-hairline-soft">
                <motion.div
                  className={`h-full ${i.status === "error" ? "bg-err" : "bg-gold"}`}
                  animate={{ width: `${Math.round(i.progress * 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {mine.length ? (
        <>
          <p className="mt-5 text-sm text-ink-soft">
            {t.photos.yours} ({mine.length}) — {t.photos.reviewNote}
          </p>
          <ul className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {mine.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-lg border border-hairline-soft">
                <img src={p.url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </GlassCard>
  );
}
