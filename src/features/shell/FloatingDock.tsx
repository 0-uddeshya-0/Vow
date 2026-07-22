import { NavLink, useLocation } from "react-router-dom";
import { CalendarHeart, HeartHandshake, House, Images, Info } from "lucide-react";
import { motion } from "motion/react";
import { useI18n } from "../../i18n";
import { ANIM_OFF } from "../../animations/motionSafe";

/**
 * Floating bottom dock (the IG-style bar from the user's reference): the
 * page navigation lives here so the top chrome stays uncluttered. Hidden on
 * /admin, which has its own tab nav. Pages pad their bottom by --dock-space.
 */
export function FloatingDock() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  const items = [
    { to: "/", label: t.nav.home, icon: House, end: true },
    { to: "/event", label: t.nav.event, icon: CalendarHeart, end: false },
    { to: "/info", label: t.nav.info, icon: Info, end: false },
    { to: "/rsvp", label: t.nav.rsvp, icon: HeartHandshake, end: false },
    { to: "/gallery", label: t.nav.gallery, icon: Images, end: false },
  ];

  return (
    <motion.nav
      aria-label="Main"
      initial={ANIM_OFF ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="fixed inset-x-0 bottom-[max(0.8rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
    >
      {/* A tighter shadow than the default glass-strong drop: the dock sits at
          the very bottom, so a long shadow bleeds under the browser's URL bar
          and reads as a hard edge. Keep it short and close. */}
      <div
        className="glass-strong flex items-center gap-0.5 rounded-full px-1.5 py-1.5"
        style={{ boxShadow: "inset 0 1.5px 0 0 oklch(1 0 0 / 0.4), 0 5px 16px -12px oklch(0.3 0.03 110 / 0.4)" }}
      >
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              "flex min-w-[3.25rem] flex-col items-center gap-0.5 rounded-full px-2 py-1.5 transition-colors " +
              (isActive ? "text-gold-ink" : "text-ink-soft hover:text-ink")
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={
                    "flex size-9 items-center justify-center rounded-full transition-colors " +
                    (isActive ? "bg-gold/15" : "")
                  }
                >
                  <Icon size={19} aria-hidden strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.06em]">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
