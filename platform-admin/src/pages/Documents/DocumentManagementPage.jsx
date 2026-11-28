import { useMemo, useState } from 'react';
import { loadAstroFinanceIndex } from '../../data/astroFinanceIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, ViewButton, dt, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, PageHead, UnavailableAction, useToast } from '../Services/components/ServiceBits.jsx';
import { inRange, iso, useLoaded } from '../Finance/components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const OWNER_TYPES = ['Astrologer', 'Assistant'];
const SORTS = [
  ['desc', 'Newest first'],
  ['asc', 'Oldest first'],
];
const EMPTY = { query: '', owner: 'all', type: 'all', status: 'all', from: '', to: '' };
const FILES_NOTE = 'Files are not stored in the local data; preview and download need an approved file storage.';

// Document Management (13-document-management.md): uploaded documents with
// related ID, type, upload date / time and uploader. Documents are secondary
// and not a prerequisite for providing services; no required list and no
// verification approval workflow are defined (PP-07, PP-08). The same records
// as the Astrologer Profile → Documents & Verification tab.
export default function DocumentManagementPage() {
  const state = useLoaded(loadAstroFinanceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.documents ?? [];
  const types = useMemo(() => [...new Set(all.map((x) => x.type))].sort(), [all]);
  const statuses = useMemo(() => [...new Set(all.map((x) => x.status).filter((s) => s !== '—'))].sort(), [all]);

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (x) =>
        (f.owner === 'all' || x.ownerType === f.owner) &&
        (f.type === 'all' || x.type === f.type) &&
        (f.status === 'all' || x.status === f.status) &&
        inRange(x.uploadedAt, f.from, f.to) &&
        (!q || [x.id, x.ownerId, x.ownerName, x.name].some((v) => v.toLowerCase().includes(q)))
    );
    return list.sort((a, b) => (sort === 'asc' ? a.uploadedAt - b.uploadedAt : b.uploadedAt - a.uploadedAt) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const byType = useMemo(() => types.map((t) => [t, rows.filter((x) => x.type === t).length]).filter(([, n]) => n), [types, rows]);

  const columns = [
    { header: 'Document ID', value: (x) => x.id, width: 14 },
    { header: 'File Name', value: (x) => x.name, width: 28 },
    { header: 'Document Type', value: (x) => x.type, width: 24 },
    { header: 'Related To', value: (x) => `${x.ownerType} · ${x.ownerName} (${x.ownerId})`, width: 34 },
    { header: 'Related Verification', value: (x) => x.related, width: 14 },
    { header: 'Recorded Status', value: (x) => x.status, width: 14 },
    { header: 'Uploaded', value: (x) => dt(iso(x.uploadedAt)), width: 20 },
    { header: 'Uploaded By', value: (x) => x.uploadedBy, width: 12 },
    { header: 'Size', value: (x) => x.size, width: 10 },
  ];

  return (
    <div className="users services">
      <PageHead section={null} title="Document Management" subtitle="Documents uploaded by astrologers and other permitted accounts. Documents are optional and are not required to provide services." />
      {state.status === 'loading' && <LoadingState label="Loading documents" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="dm-list"
          title="Uploaded Documents"
          description={`${formatNumber(rows.length)} documents · ${byType.map(([t, n]) => `${t} ${formatNumber(n)}`).join(' · ')}. No assistant documents are recorded.`}
          actions={<ExportPair title="Document Management" columns={columns} rows={rows} fileBase="astroconnect-documents" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Document ID, file name, Astrologer name or ID" />
            <SelectFilter label="Related To" value={f.owner} onChange={(v) => set({ owner: v })} options={[['all', 'All accounts'], ...OWNER_TYPES]} />
            <SelectFilter label="Document Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All types'], ...types]} />
            <SelectFilter label="Recorded Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...statuses]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} documents match.</p>
          <DataTable
            caption="Uploaded documents"
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty icon="document" title="No matching documents" text={f.owner === 'Assistant' ? 'No assistant documents are recorded.' : 'Change or clear the filters.'} />}
            columns={[
              { key: 'n', header: 'Document', primary: true, render: (x) => <span className="p-desc"><span className="p-file">{x.name}</span><span className="p-small p-mono">{x.id}</span></span> },
              { key: 't', header: 'Type', render: (x) => x.type },
              { key: 'o', header: 'Related To', render: (x) => <span className="p-desc"><AstroLink id={x.ownerId} name={x.ownerName} tab="documents" /><span className="p-small">{x.ownerType}</span></span> },
              { key: 's', header: 'Recorded Status', render: (x) => (x.status === '—' ? '—' : <Pill value={x.status} />) },
              { key: 'u', header: 'Uploaded', render: (x) => <span className="p-desc"><span>{dt(iso(x.uploadedAt))}</span><span className="p-small">by {x.uploadedBy}</span></span> },
              { key: 'v', header: 'Details', render: (x) => <ViewButton onClick={() => setOpen(x)} /> },
            ]}
          />
          {paged.pager('documents')}
        </Section>
      )}
      {open && (
        <DetailPanel title={open.name} subtitle={`${open.id} · ${open.type}`} onClose={() => setOpen(null)}>
          <Fields
            columns={2}
            items={[
              ['Document ID', open.id],
              ['Document Type', open.type],
              ['Related To', <AstroLink key="a" id={open.ownerId} name={open.ownerName} tab="documents" />],
              ['Account Type', open.ownerType],
              ['Related Verification', open.related],
              ['Recorded Status', open.status === '—' ? '—' : <Pill key="s" value={open.status} />],
              ['Uploaded', dt(iso(open.uploadedAt))],
              ['Uploaded By', open.uploadedBy],
              ['File Size', open.size],
            ]}
          />
          <p className="p-small p-muted">Recorded statuses come from the Astrologer App. Documents are not a prerequisite for providing services.</p>
          <UnavailableAction label="Preview" reason={FILES_NOTE} />
          <UnavailableAction label="Download" reason={FILES_NOTE} />
          <UnavailableAction label="Approve / Reject Document" reason={`${NOT_FINALISED}: no verification workflow or required document list is defined (PP-07, PP-08).`} />
        </DetailPanel>
      )}
      {toastNode}
    </div>
  );
}
