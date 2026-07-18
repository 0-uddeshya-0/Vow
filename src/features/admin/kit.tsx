import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import type { LocalizedText } from "../../types";
import { ANIM_OFF } from "../../animations/motionSafe";

/* The CMS is a tool, not a poster: denser, quieter, information-first.
   It reuses the design tokens but spends far less glass than the guest site. */

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-hairline-soft bg-surface-solid/70 p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

const btnBase =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm " +
  "font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export function AdminButton({
  variant = "solid",
  className = "",
  children,
  ...rest
}: {
  variant?: "solid" | "quiet" | "danger";
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    solid: "bg-[var(--btn-primary)] text-on-accent",
    quiet: "border border-hairline-soft text-ink hover:border-hairline",
    danger: "border border-err/40 text-err hover:bg-err/10",
  } as const;
  return (
    <button className={`${btnBase} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

const inputCls =
  "w-full rounded-xl border border-hairline-soft bg-bg px-3 py-2 text-ink min-h-10 " +
  "placeholder:text-ink-soft/70 focus:border-gold focus:outline-none transition-colors";

export function Labeled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-ink-soft">{label}</span>
      {children}
      {hint ? <span className="text-xs text-ink-soft/80">{hint}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-20 resize-y ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

/** Both languages side by side — content must never be single-language. */
export function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedText;
  onChange: (v: LocalizedText) => void;
  multiline?: boolean;
}) {
  const Field = multiline ? Textarea : Input;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Labeled label={`${label} · EN`}>
        <Field value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} />
      </Labeled>
      <Labeled label={`${label} · DE`}>
        <Field value={value.de} onChange={(e) => onChange({ ...value, de: e.target.value })} />
      </Labeled>
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[oklch(0.15_0.02_120/0.6)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={ANIM_OFF ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-xl rounded-[var(--radius-card)] border border-hairline bg-bg p-6 shadow-2xl"
      >
        <header className="mb-5 flex items-center justify-between gap-4">
          <h3 className="font-display text-2xl text-ink">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-ink">
            <X size={18} />
          </button>
        </header>
        <div className="flex flex-col gap-4">{children}</div>
        {footer ? <footer className="mt-6 flex justify-end gap-2">{footer}</footer> : null}
      </motion.div>
    </div>
  );
}

/** Reorder controls: drag on desktop, buttons everywhere (touch + keyboard). */
export function ReorderControls({
  onUp,
  onDown,
  onDelete,
  disableUp,
  disableDown,
}: {
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  disableUp: boolean;
  disableDown: boolean;
}) {
  const icon =
    "flex size-9 items-center justify-center rounded-lg border border-hairline-soft text-ink-soft " +
    "hover:border-hairline hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";
  return (
    <div className="flex items-center gap-1.5">
      <button className={icon} onClick={onUp} disabled={disableUp} aria-label="Move up">
        <ChevronUp size={15} />
      </button>
      <button className={icon} onClick={onDown} disabled={disableDown} aria-label="Move down">
        <ChevronDown size={15} />
      </button>
      <button
        className={`${icon} border-err/30 text-err hover:border-err/60`}
        onClick={onDelete}
        aria-label="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "ok" | "warn" | "muted" }) {
  const toneCls =
    tone === "ok" ? "text-sage-deep" : tone === "warn" ? "text-gold-ink" : "text-ink";
  return (
    <div className="rounded-[var(--radius-card)] border border-hairline-soft bg-surface-solid/60 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-ink-soft">{label}</p>
      {/* Body face, not the display serif: Cormorant's zero reads as "()" at
          this size. Numbers in a data tool must be unambiguous. */}
      <p className={`tnum mt-1 font-body text-3xl font-medium ${toneCls}`}>{value}</p>
    </div>
  );
}

/**
 * Guest ids double as the capability to read that guest (rules allow `get`,
 * never `list`), so they must be long enough not to be guessable — hence 20
 * hex chars for guests rather than the 8 that suffice for content items.
 */
export const newId = (length = 8) =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "").slice(0, length)
    : Math.random().toString(36).slice(2, 2 + length);

export const emptyText = (): LocalizedText => ({ en: "", de: "" });
