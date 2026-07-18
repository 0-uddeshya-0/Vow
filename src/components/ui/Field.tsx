import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const base =
  "w-full rounded-2xl border border-hairline-soft bg-surface-solid px-4 py-3 text-ink " +
  "placeholder:text-ink-soft/80 focus:border-gold focus:outline-none min-h-12 transition-colors";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-err">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} min-h-24 resize-y ${props.className ?? ""}`} />;
}
