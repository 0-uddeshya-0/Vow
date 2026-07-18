import { useRef, useState } from "react";
import { ImageUp, Link2, X } from "lucide-react";
import { AdminButton, Input, Labeled } from "./kit";
import { compressImage } from "../../lib/image";
import { data } from "../../services/data";
import type { EventDoc, Guest } from "../../types";

/**
 * Image input that accepts BOTH a public URL and a file from the device.
 * Browsing uploads through the same photo pipeline as guests (compressed,
 * then Storage in Firebase mode / data-URL in demo mode) and writes the
 * resulting URL back, so admins never need to find hosting for an image.
 */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  event,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  event: EventDoc;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const pick = async (file: File) => {
    setBusy(true);
    setError("");
    setProgress(0);
    try {
      const blob = await compressImage(file, 1600, 0.82);
      // Admin uploads are attributed to a synthetic "admin" guest so the
      // photo pipeline contract (guestId/guestName) stays satisfied.
      const asGuest = {
        id: "admin",
        fullName: "Admin upload",
      } as Guest;
      const photo = await data.uploadPhoto(event.id, asGuest, blob, setProgress);
      onChange(photo.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Labeled label={label} hint={hint}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              aria-hidden
            />
            <Input
              value={value}
              placeholder="https://… (paste a public image link)"
              onChange={(e) => onChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <AdminButton
            type="button"
            variant="quiet"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <ImageUp size={14} /> {busy ? `${Math.round(progress * 100)}%` : "Browse"}
          </AdminButton>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            data-testid="admin-image-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void pick(f);
              e.target.value = "";
            }}
          />
        </div>

        {error ? (
          <p role="alert" className="text-sm text-err">
            {error}
          </p>
        ) : null}

        {value ? (
          <div className="relative w-fit">
            <img
              src={value}
              alt=""
              className="h-24 rounded-xl border border-hairline-soft object-cover"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border border-hairline bg-bg text-ink-soft hover:text-err"
            >
              <X size={12} />
            </button>
          </div>
        ) : null}
      </div>
    </Labeled>
  );
}
