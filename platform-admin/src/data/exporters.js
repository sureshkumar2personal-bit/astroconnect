// PDF and Excel export of the CURRENTLY FILTERED users list.
// The libraries are loaded only when an export is requested.
// Photo and Actions are interface-only columns and are not exported.

import { formatDate, formatDateTime } from './usersStore.js';

const COLUMNS = [
  { header: 'Name', value: (u) => u.name, width: 24 },
  { header: 'User ID', value: (u) => u.id, width: 13 },
  { header: 'Mobile', value: (u) => u.mobile, width: 17 },
  { header: 'Email', value: (u) => u.email, width: 34 },
  { header: 'Account Type', value: (u) => u.accountType, width: 14 },
  { header: 'Account Status', value: (u) => u.status, width: 15 },
  { header: 'Registration Date', value: (u) => formatDate(u.registeredAt), width: 17 },
  { header: 'Last Active', value: (u) => formatDateTime(u.lastActiveAt), width: 20 },
];

function stamp(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}_${p(now.getHours())}${p(now.getMinutes())}`;
}

export function exportFileName(ext, now = new Date()) {
  return `astroconnect-users_${stamp(now)}.${ext}`;
}

/**
 * @param rows        filtered + sorted users
 * @param filterText  human-readable summary of the active filters
 */
export async function exportUsersPdf(rows, filterText) {
  const [{ jsPDF }, autotable] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const autoTable = autotable.autoTable ?? autotable.default;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const generated = formatDateTime(new Date().toISOString());

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(43, 33, 24);
  doc.text('AstroConnect - Users', 40, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(93, 79, 64);
  doc.text(`Generated ${generated}.`, 40, 60);
  doc.text(`Filters: ${filterText}. Records: ${rows.length.toLocaleString('en-IN')}.`, 40, 74);

  autoTable(doc, {
    startY: 88,
    head: [COLUMNS.map((c) => c.header)],
    body: rows.map((u) => COLUMNS.map((c) => c.value(u))),
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 4, textColor: [43, 33, 24], lineColor: [231, 220, 198], lineWidth: 0.4 },
    headStyles: { fillColor: [246, 234, 208], textColor: [43, 33, 24], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [251, 246, 236] },
    margin: { left: 40, right: 40, bottom: 36 },
    didDrawPage: () => {
      const pageSize = doc.internal.pageSize;
      doc.setFontSize(8);
      doc.setTextColor(122, 106, 87);
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        pageSize.getWidth() - 40,
        pageSize.getHeight() - 18,
        { align: 'right' }
      );
    },
  });

  doc.save(exportFileName('pdf'));
}

export async function exportUsersExcel(rows) {
  const { default: writeXlsxFile } = await import('write-excel-file/browser');
  const header = COLUMNS.map((c) => ({ value: c.header, fontWeight: 'bold', backgroundColor: '#F6EAD0' }));
  const body = rows.map((u) => COLUMNS.map((c) => ({ value: c.value(u), type: String })));
  await writeXlsxFile([header, ...body], {
    columns: COLUMNS.map((c) => ({ width: c.width })),
    sheet: 'Users',
    stickyRowsCount: 1,
  }).toFile(exportFileName('xlsx'));
}

// ---------- Shared table export helpers (User Profile) ----------

// The built-in PDF fonts cannot draw some symbols; replace them.
const pdfSafe = (text) =>
  text.replace(/₹\s?/g, 'Rs. ').replace(/[—–]/g, '-').replace(/[‘’]/g, "'").replace(/→/g, '->');

async function pdfTable({ title, lines, columns, rows, fileName }) {
  const [{ jsPDF }, autotable] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const autoTable = autotable.autoTable ?? autotable.default;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(43, 33, 24);
  doc.text(title, 40, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(93, 79, 64);
  lines.forEach((line, i) => doc.text(pdfSafe(line), 40, 60 + i * 14));
  autoTable(doc, {
    startY: 66 + lines.length * 14,
    head: [columns.map((c) => c.header)],
    body: rows.map((r) => columns.map((c) => pdfSafe(c.pdf ? c.pdf(r) : String(c.value(r) ?? '')))),
    styles: { font: 'helvetica', fontSize: 7.5, cellPadding: 3.5, textColor: [43, 33, 24], lineColor: [231, 220, 198], lineWidth: 0.4 },
    headStyles: { fillColor: [246, 234, 208], textColor: [43, 33, 24], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [251, 246, 236] },
    margin: { left: 40, right: 40, bottom: 36 },
    didDrawPage: () => {
      const size = doc.internal.pageSize;
      doc.setFontSize(8);
      doc.setTextColor(122, 106, 87);
      doc.text(`Page ${doc.getNumberOfPages()}`, size.getWidth() - 40, size.getHeight() - 18, { align: 'right' });
    },
  });
  doc.save(fileName);
}

async function excelTable({ sheet, preamble, columns, rows, fileName }) {
  const { default: writeXlsxFile } = await import('write-excel-file/browser');
  const head = columns.map((c) => ({ value: c.header, fontWeight: 'bold', backgroundColor: '#F6EAD0' }));
  const body = rows.map((r) =>
    columns.map((c) => {
      const v = c.value(r);
      if (v === null || v === undefined || v === '') return null;
      return typeof v === 'number' ? { value: v, type: Number } : { value: String(v), type: String };
    })
  );
  const pre = preamble.map(([label, value]) => [
    { value: label, fontWeight: 'bold' },
    typeof value === 'number' ? { value, type: Number } : { value: String(value), type: String },
  ]);
  await writeXlsxFile([...pre, ...(pre.length ? [[]] : []), head, ...body], {
    columns: columns.map((c) => ({ width: c.width ?? 16 })),
    sheet,
  }).toFile(fileName);
}

// PDF fonts cannot draw the rupee sign, so PDFs use "Rs.".
const rs = (v) => (v === null || v === undefined ? '' : `Rs. ${Number(v).toLocaleString('en-IN')}`);

const STATEMENT_COLUMNS = [
  { header: 'Transaction ID', value: (t) => t.id, width: 18 },
  { header: 'Date / Time', value: (t) => formatDateTime(t.at), width: 20 },
  { header: 'Description', value: (t) => t.description, width: 34 },
  { header: 'Credit', value: (t) => t.credit, pdf: (t) => rs(t.credit), width: 11 },
  { header: 'Debit', value: (t) => t.debit, pdf: (t) => rs(t.debit), width: 11 },
  { header: 'Balance After', value: (t) => t.balanceAfter, pdf: (t) => rs(t.balanceAfter), width: 14 },
  { header: 'Payment Method', value: (t) => t.method, width: 15 },
  { header: 'Gateway Reference', value: (t) => t.gatewayRef ?? '', width: 18 },
  { header: 'Related Service', value: (t) => t.serviceId ?? '', width: 16 },
  { header: 'Status', value: (t) => t.status, width: 11 },
];

function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export async function exportStatement(kind, user, statement) {
  const label = monthLabel(statement.month);
  const file = `wallet-statement_${user.id}_${statement.month}.${kind === 'pdf' ? 'pdf' : 'xlsx'}`;
  if (kind === 'pdf') {
    await pdfTable({
      title: `AstroConnect - Wallet Statement, ${label}`,
      lines: [
        `${user.name} (${user.id})`,
        `Opening Balance ${rs(statement.opening)}   Total Credit ${rs(statement.totalCredit)}   Total Debit ${rs(statement.totalDebit)}   Closing Balance ${rs(statement.closing)}`,
        'Pending, Failed and Reversed transactions are listed but do not change the balance.',
      ],
      columns: STATEMENT_COLUMNS,
      rows: statement.rows,
      fileName: file,
    });
  } else {
    await excelTable({
      sheet: 'Statement',
      preamble: [
        ['Wallet Statement', label],
        ['User', `${user.name} (${user.id})`],
        ['Opening Balance', statement.opening],
        ['Total Credit', statement.totalCredit],
        ['Total Debit', statement.totalDebit],
        ['Closing Balance', statement.closing],
      ],
      columns: STATEMENT_COLUMNS,
      rows: statement.rows,
      fileName: file,
    });
  }
}

const ACTIVITY_COLUMNS = [
  { header: 'Date / Time', value: (a) => formatDateTime(a.at), width: 20 },
  { header: 'Category', value: (a) => a.category, width: 20 },
  { header: 'Activity', value: (a) => a.title, width: 48 },
  { header: 'Reference', value: (a) => a.ref, width: 18 },
  { header: 'Details', value: (a) => a.details.map(([k, v]) => `${k}: ${v}`).join('; '), width: 40 },
];

export async function exportActivity(kind, user, rows, filterText) {
  const file = `user-activity_${user.id}.${kind === 'pdf' ? 'pdf' : 'xlsx'}`;
  if (kind === 'pdf') {
    await pdfTable({
      title: 'AstroConnect - User Activity',
      lines: [`${user.name} (${user.id})`, `Filters: ${filterText}. Records: ${rows.length}.`],
      columns: ACTIVITY_COLUMNS,
      rows,
      fileName: file,
    });
  } else {
    await excelTable({
      sheet: 'Activity',
      preamble: [
        ['User Activity', `${user.name} (${user.id})`],
        ['Filters', filterText],
      ],
      columns: ACTIVITY_COLUMNS,
      rows,
      fileName: file,
    });
  }
}

// ---------- Generic table export (Astrologer screens) ----------

/** kind: 'pdf' | 'excel'. columns: [{ header, value(row), pdf?(row), width }] */
export async function exportTable(kind, { title, lines = [], columns, rows, fileBase, sheet = 'Sheet1' }) {
  if (kind === 'pdf') {
    await pdfTable({ title, lines, columns, rows, fileName: `${fileBase}.pdf` });
  } else {
    await excelTable({
      sheet,
      preamble: [[title, lines.join(' · ')]],
      columns,
      rows,
      fileName: `${fileBase}.xlsx`,
    });
  }
}

const ASTROLOGER_COLUMNS = [
  { header: 'Name', value: (a) => a.name, width: 26 },
  { header: 'Astrologer ID', value: (a) => a.id, width: 13 },
  { header: 'Mobile', value: (a) => a.mobile, width: 17 },
  { header: 'Email', value: (a) => a.email, width: 32 },
  { header: 'Specialization', value: (a) => a.specializations.join(', '), width: 30 },
  { header: 'Experience (years)', value: (a) => a.experience, width: 12 },
  { header: 'Services', value: (a) => ['text', 'appointment', 'call', 'chat'].filter((k) => a.offers[k]).map((k) => ({ text: 'Text', appointment: 'Appointment', call: 'Call', chat: 'Chat' })[k]).join(', '), width: 30 },
  { header: 'Availability', value: (a) => a.availability, width: 12 },
  { header: 'Account Status', value: (a) => a.status, width: 13 },
  { header: 'Verification (KYC)', value: (a) => a.verification.kyc, width: 15 },
  { header: 'Rating', value: (a) => a.rating ?? '', width: 8 },
  { header: 'Total Services', value: (a) => a.totalServices, width: 12 },
  { header: 'Joined Date', value: (a) => formatDate(a.joinedAt), width: 14 },
];

export async function exportAstrologers(kind, rows, filterText) {
  const stamp = exportFileName('x').replace('astroconnect-users_', '').replace('.x', '');
  await exportTable(kind, {
    title: 'AstroConnect - Astrologers',
    lines: [`Generated ${formatDateTime(new Date().toISOString())}.`, `Filters: ${filterText}. Records: ${rows.length}.`],
    columns: ASTROLOGER_COLUMNS,
    rows,
    fileBase: `astroconnect-astrologers_${stamp}`,
    sheet: 'Astrologers',
  });
}
