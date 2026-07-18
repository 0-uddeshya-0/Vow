/**
 * Global animation kill-switch, resolved once at startup.
 * `?noanim=1` (persisted for the tab session) renders every component in its
 * settled state with `initial: false` — needed because headless verification
 * panes never fire requestAnimationFrame, so any tween would freeze at its
 * first frame and screenshots would show hidden content. Real browsers are
 * unaffected; users with reduced-motion get their own path via
 * useReducedMotion in each component.
 */
function resolveAnimOff(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("noanim") === "1") {
      sessionStorage.setItem("vow.noanim", "1");
      return true;
    }
    return sessionStorage.getItem("vow.noanim") === "1";
  } catch {
    return false;
  }
}

export const ANIM_OFF: boolean = resolveAnimOff();
