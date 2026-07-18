/** Table exports for the guest list. No dependencies — everything is text. */

export type Column<T> = { header: string; value: (row: T) => string };

function download(filename: string, mime: string, text: string): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export function exportCsv<T>(rows: T[], cols: Column<T>[], filename: string): void {
  const lines = [
    cols.map((c) => csvCell(c.header)).join(","),
    ...rows.map((r) => cols.map((c) => csvCell(c.value(r))).join(",")),
  ];
  // BOM so Excel opens UTF-8 (umlauts) correctly on double-click.
  download(filename, "text/csv", "﻿" + lines.join("\r\n"));
}

const xmlEscape = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * SpreadsheetML 2003 — a real .xls Excel opens natively, with no library.
 * Chosen over .xlsx (which needs a zip/OOXML dependency) deliberately.
 */
export function exportExcel<T>(rows: T[], cols: Column<T>[], filename: string): void {
  const row = (cells: string[]) =>
    `<Row>${cells.map((c) => `<Cell><Data ss:Type="String">${xmlEscape(c)}</Data></Cell>`).join("")}</Row>`;
  const xml =
    '<?xml version="1.0"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
    'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Guests"><Table>' +
    row(cols.map((c) => c.header)) +
    rows.map((r) => row(cols.map((c) => c.value(r)))).join("") +
    "</Table></Worksheet></Workbook>";
  download(filename, "application/vnd.ms-excel", xml);
}

/** Opens a clean print sheet in a new window — no app chrome, no theme. */
export function printTable<T>(rows: T[], cols: Column<T>[], title: string): void {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;
  const head = cols.map((c) => `<th>${xmlEscape(c.header)}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${cols.map((c) => `<td>${xmlEscape(c.value(r))}</td>`).join("")}</tr>`)
    .join("");
  w.document.write(
    `<!doctype html><meta charset="utf-8"><title>${xmlEscape(title)}</title>` +
      "<style>body{font:14px/1.5 system-ui;padding:32px;color:#222}" +
      "h1{font:600 20px system-ui;margin:0 0 16px}table{border-collapse:collapse;width:100%}" +
      "th,td{border:1px solid #ddd;padding:8px 10px;text-align:left}th{background:#f5f2ea}" +
      "@media print{body{padding:0}}</style>" +
      `<h1>${xmlEscape(title)}</h1><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`,
  );
  w.document.close();
  w.focus();
  w.print();
}
