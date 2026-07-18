import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { useI18n } from "../../i18n";
import { Skeleton } from "../../components/ui/Skeleton";
import { fadeIn, reveal } from "../../animations/variants";
import { ANIM_OFF } from "../../animations/motionSafe";
import type { GalleryImage } from "../../types";

/** Lightbox: keyboard (←/→/Esc), touch swipe, focus restored on close. */
function Lightbox({
  images,
  index,
  onClose,
  onMove,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const { t, lt } = useI18n();
  const touchX = useRef<number | null>(null);
  const image = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove((index + 1) % images.length);
      if (e.key === "ArrowLeft") onMove((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onMove]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.15_0.02_120/0.88)] p-4 backdrop-blur-sm"
      initial={ANIM_OFF ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) {
          onMove((index + (dx < 0 ? 1 : -1) + images.length) % images.length);
        }
        touchX.current = null;
      }}
    >
      <button
        onClick={onClose}
        aria-label={t.common.cancel}
        className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-white/25 text-white/90"
      >
        <X size={18} aria-hidden />
      </button>

      {images.length > 1 ? (
        <>
          <button
            aria-label="←"
            onClick={(e) => {
              e.stopPropagation();
              onMove((index - 1 + images.length) % images.length);
            }}
            className="absolute left-3 flex size-11 items-center justify-center rounded-full border border-white/25 text-white/90"
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button
            aria-label="→"
            onClick={(e) => {
              e.stopPropagation();
              onMove((index + 1) % images.length);
            }}
            className="absolute right-3 flex size-11 items-center justify-center rounded-full border border-white/25 text-white/90"
          >
            <ChevronRight size={20} aria-hidden />
          </button>
        </>
      ) : null}

      <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.url}
          alt={lt(image.caption) || ""}
          className="max-h-[80svh] w-auto rounded-2xl object-contain"
        />
        {image.caption ? (
          <figcaption className="mt-3 text-center text-sm text-white/80">
            {lt(image.caption)}
          </figcaption>
        ) : null}
      </figure>
    </motion.div>
  );
}

export function GallerySection({
  images,
  loading,
}: {
  images: GalleryImage[] | undefined;
  loading: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((n: number) => setOpen(n), []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-hairline-soft p-10 text-center">
        <ImageIcon size={22} className="mx-auto text-ink-soft/60" aria-hidden />
        <p className="mt-3 text-ink-soft">{t.gallery.empty}</p>
      </div>
    );
  }

  return (
    <>
      <motion.ul {...reveal(0.1)} className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
        {images.map((img, i) => (
          <motion.li key={img.id} variants={fadeIn}>
            <button
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-[var(--radius-card)] border border-hairline-soft"
            >
              <img
                src={img.url}
                alt=""
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <AnimatePresence>
        {open !== null ? (
          <Lightbox images={images} index={open} onClose={() => setOpen(null)} onMove={move} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
