import { useRef } from "react";
import { ImageUp } from "lucide-react";
import { AdminButton, Input, Labeled } from "./kit";
import { useImageUpload } from "./useImageUpload";
import { SCHEDULE_ICON_NAMES, ScheduleIcon, isIconUrl } from "../../lib/icons";
import type { EventDoc } from "../../types";

/**
 * One field, four ways to set an icon: a curated name, an emoji, a URL from
 * any online icon library, or a file browsed from this device. Live preview
 * renders exactly what the guest card will render.
 *
 * Note on privacy: a pasted third-party URL is fetched from that host by
 * every guest's browser. Browsing a file instead uploads it to the couple's
 * own storage, which keeps the page free of outside requests.
 */
export function IconField({
  value,
  onChange,
  event,
}: {
  value: string;
  onChange: (v: string) => void;
  event: EventDoc;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, busy, progress, error } = useImageUpload(event, 256);

  const pick = async (file: File) => {
    const url = await upload(file);
    if (url) onChange(url);
  };

  return (
    <Labeled
      label="Icon"
      hint="a name from the list, any emoji, an icon-library link, or a file from this device"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-hairline-soft bg-surface-solid text-gold-ink">
            <ScheduleIcon name={value} size={24} />
          </span>

          <Input
            list="vow-schedule-icons"
            value={value}
            placeholder="church · 🎉 · https://…"
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
          <datalist id="vow-schedule-icons">
            {SCHEDULE_ICON_NAMES.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>

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
            accept="image/*,.svg"
            className="hidden"
            data-testid="admin-icon-input"
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
        {isIconUrl(value) ? (
          <p className="text-xs text-ink-soft">
            Using an image icon. Uploaded files are served from your own storage; pasted links are
            loaded from that third-party host.
          </p>
        ) : null}
      </div>
    </Labeled>
  );
}
