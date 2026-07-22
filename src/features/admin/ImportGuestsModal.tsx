import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, FileUp } from "lucide-react";
import { AdminButton, Labeled, Modal, Textarea, newId } from "./kit";
import { data } from "../../services/data";
import { parseGuestList, GUEST_CSV_TEMPLATE, type ImportRow } from "../../lib/importGuests";
import type { Guest } from "../../types";

function toGuest(eventId: string, row: ImportRow["data"]): Guest {
  return {
    id: `g-${newId(20)}`,
    eventId,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    roles: row.roles.length ? row.roles : ["Guest"],
    language: row.language,
    invitationStatus: "invited",
    reminderCount: 0,
    lastReminderAt: "",
    createdVia: "admin",
  };
}

export function ImportGuestsModal({
  eventId,
  existing,
  onClose,
}: {
  eventId: string;
  existing: { email: string; phone: string }[];
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => parseGuestList(text, existing), [text, existing]);
  const importable = rows.filter((r) => !r.issues.length && !r.duplicate);
  const dupes = rows.filter((r) => r.duplicate).length;
  const bad = rows.filter((r) => r.issues.length).length;

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([GUEST_CSV_TEMPLATE], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "guest-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    setBusy({ done: 0, total: importable.length });
    for (let i = 0; i < importable.length; i++) {
      await data.adminSaveGuest(toGuest(eventId, importable[i].data));
      setBusy({ done: i + 1, total: importable.length });
    }
    await qc.invalidateQueries({ queryKey: ["admin", "guests", eventId] });
    onClose();
  };

  return (
    <Modal
      title="Import guests"
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="quiet" onClick={onClose} disabled={!!busy}>
            Cancel
          </AdminButton>
          <AdminButton onClick={runImport} disabled={!importable.length || !!busy}>
            {busy
              ? `Importing ${busy.done}/${busy.total}…`
              : `Import ${importable.length} guest${importable.length === 1 ? "" : "s"}`}
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <AdminButton variant="quiet" onClick={() => fileRef.current?.click()}>
          <FileUp size={14} /> Choose CSV file
        </AdminButton>
        <AdminButton variant="quiet" onClick={downloadTemplate}>
          <Download size={14} /> Template
        </AdminButton>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setText(await f.text());
            e.target.value = "";
          }}
        />
      </div>

      <Labeled
        label="…or paste rows"
        hint="One guest per line: name, email, phone, role, language. A header row is optional."
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={"Anna Beispiel, anna@example.com, +49 170 1234567, Guest, de\nJohn Example, john@example.com, +49 171 7654321, Witness, en"}
          className="font-mono text-sm"
        />
      </Labeled>

      {rows.length ? (
        <div className="rounded-xl border border-hairline-soft">
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-hairline-soft px-4 py-2 text-sm">
            <span className="text-sage-deep">{importable.length} to import</span>
            {dupes ? <span className="text-ink-soft">{dupes} duplicate (skipped)</span> : null}
            {bad ? <span className="text-err">{bad} with problems (skipped)</span> : null}
          </div>
          <ul className="max-h-60 divide-y divide-hairline-soft overflow-y-auto">
            {rows.slice(0, 100).map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                <span className="min-w-0 truncate">
                  <span className="text-ink">{r.data.fullName || "(no name)"}</span>
                  <span className="text-ink-soft">
                    {[r.data.email, r.data.phone, r.data.roles.join("/"), r.data.language.toUpperCase()]
                      .filter(Boolean)
                      .join("  ·  ")
                      ? `  —  ${[r.data.email, r.data.phone, r.data.roles.join("/"), r.data.language.toUpperCase()].filter(Boolean).join("  ·  ")}`
                      : ""}
                  </span>
                </span>
                {r.issues.length ? (
                  <span className="shrink-0 text-xs text-err">{r.issues.join(", ")}</span>
                ) : r.duplicate ? (
                  <span className="shrink-0 text-xs text-ink-soft">duplicate</span>
                ) : (
                  <span className="shrink-0 text-xs text-sage-deep">ok</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Modal>
  );
}
