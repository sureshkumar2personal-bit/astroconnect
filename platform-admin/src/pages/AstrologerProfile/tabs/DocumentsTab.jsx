import { useState } from 'react';
import { VerificationBadge } from '../../Astrologers/components/AstroBits.jsx';
import { DataTable, DetailPanel, Empty, Fields, Section, ViewButton, dt } from '../../UserProfile/components/ui.jsx';

// Tab 2 — Documents & Verification (§5). View only: required documents and
// the verification workflow are not finalised (PP-07, PP-08); documents are
// not a prerequisite for providing services.
export default function DocumentsTab({ profile }) {
  const a = profile.astrologer;
  const [preview, setPreview] = useState(null);
  return (
    <div className="p-stack">
      <Section id="ad-verify" title="Verification Status" description="Recorded statuses from the Astrologer App. Documents are not a prerequisite for providing services.">
        <div className="a-verify-row">
          <div>
            <span className="p-small">KYC</span>
            <VerificationBadge value={a.verification.kyc} />
          </div>
          <div>
            <span className="p-small">Identity</span>
            <VerificationBadge value={a.verification.identity} />
          </div>
          <div>
            <span className="p-small">Certificate</span>
            <VerificationBadge value={a.verification.certificate} />
          </div>
        </div>
      </Section>
      <Section id="ad-docs" title="Submitted Documents">
        <DataTable
          caption="Submitted documents"
          rows={profile.documents}
          empty={<Empty icon="document" title="No documents submitted" />}
          columns={[
            { key: 'name', header: 'Document', primary: true, render: (x) => <span className="p-file">{x.name}</span> },
            { key: 'type', header: 'Document Type', render: (x) => x.type },
            { key: 'related', header: 'Related Verification', render: (x) => x.related },
            { key: 'status', header: 'Recorded Status', render: (x) => (x.status === '—' ? '—' : <VerificationBadge value={x.status} />) },
            { key: 'at', header: 'Uploaded Date / Time', render: (x) => dt(x.uploadedAt) },
            { key: 'by', header: 'Uploaded By', render: (x) => x.uploadedBy },
            { key: 'actions', header: 'Preview', render: (x) => <ViewButton label="Preview" onClick={() => setPreview(x)} /> },
          ]}
        />
      </Section>
      {preview && (
        <DetailPanel title={preview.name} subtitle={`${preview.type} · ${preview.size}`} onClose={() => setPreview(null)}>
          <div className="p-preview">
            <span className="p-preview__icon">{preview.name.split('.').pop().toUpperCase()}</span>
            <p className="p-muted">A preview is not available for this file.</p>
          </div>
          <Fields
            columns={2}
            items={[
              ['Document ID', preview.id],
              ['Related Astrologer', `${a.name} (${a.id})`],
              ['Uploaded', dt(preview.uploadedAt)],
              ['Uploaded By', preview.uploadedBy],
              ['Related Verification', preview.related],
              ['Recorded Status', preview.status],
            ]}
          />
        </DetailPanel>
      )}
    </div>
  );
}
