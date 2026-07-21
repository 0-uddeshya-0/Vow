import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ANIM_OFF } from "../../animations/motionSafe";

type Pos = { top: number; left: number; minWidth: number };

/**
 * A click-driven popover that closes ONLY on outside pointer-down or Escape —
 * never on mouse-leave (the old menus closed on hover-off, which dismissed
 * them the moment you tried to select text or nudged the cursor out).
 *
 * The panel is PORTALLED to <body> with position:fixed and positioned from the
 * trigger's rect, so it can never be clipped by an ancestor's overflow:hidden
 * (schedule/hotel cards clip their banner image) or by a backdrop-filter
 * stacking context. Repositions on scroll/resize.
 */
export function Popover({
  trigger,
  children,
  align = "left",
}: {
  trigger: (open: boolean) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const minWidth = Math.max(r.width, 192);
    setPos({
      top: r.bottom + 8,
      left: align === "right" ? r.right - minWidth : r.left,
      minWidth,
    });
  }, [align]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const reflow = () => place();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", reflow, true);
      window.removeEventListener("resize", reflow);
    };
  }, [open, place]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="contents"
      >
        {trigger(open)}
      </button>
      {createPortal(
        <AnimatePresence>
          {open && pos ? (
            <motion.div
              ref={panelRef}
              id={id}
              role="menu"
              style={{ position: "fixed", top: pos.top, left: pos.left, minWidth: pos.minWidth, zIndex: 60 }}
              initial={ANIM_OFF ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="glass rounded-2xl p-1.5"
            >
              {children(() => setOpen(false))}
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export const popoverItem =
  "flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm text-ink " +
  "transition-colors hover:bg-surface cursor-pointer";
