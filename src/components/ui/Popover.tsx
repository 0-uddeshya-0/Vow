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
const GAP = 8;
const MARGIN = 8;
// Clearance for the floating dock so a menu near the bottom flips above it
// instead of opening into (or behind) the dock.
const DOCK_SAFE = 104;

/**
 * A click-driven popover that closes ONLY on outside pointer-down or Escape —
 * never on mouse-leave (the old menus closed on hover-off, dismissing them the
 * moment you tried to select text or nudged the cursor out).
 *
 * The panel is PORTALLED to <body> with position:fixed, positioned from the
 * trigger's rect, so it can't be clipped by an ancestor's overflow:hidden
 * (schedule/hotel cards clip their banner image) or a backdrop-filter stacking
 * context. It is clamped to the viewport and flips above the trigger when
 * there isn't room below. Repositions on scroll/resize.
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
    // The trigger MUST have a real box — display:contents would give an
    // all-zero rect and pin the menu to the top-left corner.
    const panelH = panelRef.current?.offsetHeight ?? 0;
    const minWidth = Math.max(r.width, 192);

    let left = align === "right" ? r.right - minWidth : r.left;
    left = Math.max(MARGIN, Math.min(left, window.innerWidth - minWidth - MARGIN));

    // Open below by default; flip ABOVE when the menu wouldn't fit below the
    // trigger (keeping clear of the floating dock) and there is room above —
    // so a Navigate button near the bottom opens upward, not off-screen.
    const fitsBelow = r.bottom + GAP + panelH <= window.innerHeight - DOCK_SAFE;
    const roomAbove = r.top - GAP - panelH >= MARGIN;
    let top = fitsBelow || !roomAbove ? r.bottom + GAP : r.top - GAP - panelH;
    top = Math.max(MARGIN, Math.min(top, window.innerHeight - panelH - MARGIN));

    setPos({ top, left, minWidth });
  }, [align]);

  // Two-pass: place once on open (panelH unknown → 0), then again after the
  // panel has measured so the flip/clamp uses its real height.
  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);
  useLayoutEffect(() => {
    if (open && pos && panelRef.current) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, panelRef.current?.offsetHeight]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Close when leaving the tab (e.g. opening the maps app) so the menu is not
    // still sitting there on return.
    const onHide = () => document.visibilityState === "hidden" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
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
        className="inline-flex"
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
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                minWidth: pos.minWidth,
                zIndex: 60,
              }}
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
