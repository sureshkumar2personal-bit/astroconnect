import { useState } from 'react';
import Icon from '../../../components/icons.jsx';

/** PDF / Excel export of the rows currently shown in a tab. */
export default function ExportButtons({ title, astrologer, columns, rows, fileBase, notify, label = 'records' }) {
  const [busy, setBusy] = useState(null);
  async function run(kind) {
    setBusy(kind);
    try {
      const { exportTable } = await import('../../../data/exporters.js');
      await exportTable(kind, {
        title: `AstroConnect - ${title}`,
        lines: [`${astrologer.name} (${astrologer.id})`, `Records: ${rows.length}`],
        columns,
        rows,
        fileBase: `${fileBase}_${astrologer.id}`,
        sheet: title.slice(0, 30),
      });
      notify('success', `Exported ${rows.length} ${label} to ${kind === 'pdf' ? 'PDF' : 'Excel'}.`);
    } catch (err) {
      console.warn(err);
      notify('error', 'The export could not be created. Please try again.');
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className="p-actions">
      <button type="button" className="u-btn" onClick={() => run('pdf')} disabled={!rows.length || Boolean(busy)}>
        <Icon name="download" size={16} />
        {busy === 'pdf' ? 'Preparing…' : 'Export PDF'}
      </button>
      <button type="button" className="u-btn" onClick={() => run('excel')} disabled={!rows.length || Boolean(busy)}>
        <Icon name="download" size={16} />
        {busy === 'excel' ? 'Preparing…' : 'Export Excel'}
      </button>
    </div>
  );
}
