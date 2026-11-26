import { useState } from 'react';
import { Badge, Field, Sec } from '@/components/ui/sectionKit.jsx';
import { campTotal, fmtDate, fmtDateTime, TODAY } from '@/lib/textQuestions.js';
import Discount from './Discount.jsx';
import { PriceText } from './bits.jsx';

// Create / Edit Campaign (reference TQSUB.campaign + cfSave). One editor for Regular and Special
// Campaigns; a Special Campaign needs a label (AD-26). General only, Personal only or both (AD-26);
// independent prices (AD-55) and optional discounts (AD-56); slots split per type and capped by the
// shared monthly quota; reducing below sold is allowed (AD-57).
const BLANK = {
  id: '', name: '', special: false, label: '', G: true, P: true, start: '2026-12-01', end: '2026-12-31',
  gSlots: 0, pSlots: 0, gSold: 0, pSold: 0, pg: 0, pp: 0, gDisc: { on: false, pct: 0 }, pDisc: { on: false, pct: 0 }, status: 'Active',
};

const pad = (n) => String(n).padStart(2, '0');
const TODAY_ISO = `${TODAY.getFullYear()}-${pad(TODAY.getMonth() + 1)}-${pad(TODAY.getDate())}`;
/** A campaign whose start date is in the future is shown as Scheduled until that date (no separate publish time). */
export const isScheduledStart = (start) => !!start && start > TODAY_ISO;

export function validateCampaign(cf, max) {
  if (!cf.name.trim()) return 'Enter a campaign theme or name.';
  if (cf.special && !cf.label.trim()) return 'A Special Campaign needs a label.';
  if (!cf.G && !cf.P) return 'Choose at least one question type.';
  if (cf.end < cf.start) return 'Expiry date must be after the start date.';
  if (!(campTotal(cf) > 0)) return 'Allocate slots for the selected types.';
  if (campTotal(cf) > max) return `Only ${max} slots are available in your monthly quota.`;
  if ((cf.G && !(cf.pg > 0)) || (cf.P && !(cf.pp > 0))) return 'Set a price for each selected type.';
  if ([cf.G && cf.gDisc, cf.P && cf.pDisc].some((d) => d && d.on && !d.pct)) return 'Choose a discount percentage (1–99%) or turn the discount off.';
  return '';
}

function TypePrice({ kind, cf, set }) {
  const pk = kind === 'G' ? 'pg' : 'pp';
  const dk = kind === 'G' ? 'gDisc' : 'pDisc';
  return (
    <div className="cm-pp type-price">
      <div className="cm-pp-h">{kind === 'G' ? 'General' : 'Personal'}</div>
      <Field label="Original price (₹)" req>
        <input type="number" min="1" value={cf[pk] || ''} onChange={(e) => set({ [pk]: +e.target.value || 0 })} placeholder="e.g. 199" />
      </Field>
      <Discount kind={kind} disc={cf[dk]} price={cf[pk]} onChange={(d) => set({ [dk]: { ...cf[dk], ...d } })} />
    </div>
  );
}

/** `dialog`: rendered inside the shared Dialog (popup) instead of as a page: no side preview, sticky footer. */
export default function CampaignEditor({ campaign, free, onCancel, onSave, dialog = false, statusLabel = '' }) {
  const [cf, setCf] = useState(() => (campaign ? JSON.parse(JSON.stringify(campaign)) : { ...BLANK }));
  const [err, setErr] = useState('');
  const set = (patch) => { setCf((c) => ({ ...c, ...patch })); setErr(''); };
  const max = free + (campaign ? campTotal(campaign) : 0);

  const isDraft = cf.status === 'Draft';
  const [schedOpen, setSchedOpen] = useState(false);
  const [schedAt, setSchedAt] = useState(cf.publishAt || `${cf.start > TODAY_ISO ? cf.start : TODAY_ISO}T10:00`);
  const save = () => {
    const e = validateCampaign(cf, max);
    if (e) return setErr(e);
    // A stored publish time only stays valid while the start date is still that day.
    const publishAt = cf.publishAt && cf.publishAt.slice(0, 10) === cf.start ? cf.publishAt : '';
    onSave({ ...cf, status: 'Active', publishAt }); // creating (or publishing a draft) makes it a live campaign
  };
  // Schedule publish: the chosen date and time become the start; the campaign stays Scheduled until then.
  const setSchedule = () => {
    if (!schedAt || new Date(schedAt) <= TODAY) return setErr('Choose a future date and time to schedule.');
    const v = { ...cf, start: schedAt.slice(0, 10), publishAt: schedAt };
    const e = validateCampaign(v, max);
    if (e) return setErr(e);
    onSave({ ...v, status: 'Active' });
  };
  // A draft only needs a name; nothing is reserved from the quota until it is created.
  const saveDraft = () => {
    if (!cf.name.trim()) return setErr('Enter a campaign theme or name to save a draft.');
    onSave({ ...cf, status: 'Draft' });
  };

  const total = campTotal(cf);
  const rem = max - total;
  const Wrap = dialog ? 'div' : Sec;
  const wrapProps = dialog ? { className: 'form ce-form' } : { className: 'form' };
  return (
    <div className={dialog ? 'cm-editor ce-dlg' : 'split2 cm-editor'}>
      {dialog && <p className="cm-sub">{campaign ? `${campaign.name}${statusLabel ? `, ${statusLabel.toLowerCase()}` : ''}` : 'Fill in the details below. Slots come from your shared monthly quota.'}</p>}
      <Wrap {...wrapProps}>
        <section className="cm-fsec">
          <h3>Campaign type and name</h3>
          <div className="cm-opts" role="radiogroup" aria-label="Campaign type">
            <label className="cm-opt"><input type="radio" name="ctype" checked={!cf.special} onChange={() => set({ special: false })} /><span><b>Regular campaign</b><small>An ongoing topic such as marriage or career</small></span></label>
            <label className="cm-opt"><input type="radio" name="ctype" checked={cf.special} onChange={() => set({ special: true })} /><span><b>Special campaign</b><small>Limited-time or occasion-based. A label is mandatory.</small></span></label>
          </div>
          <Field label="Campaign theme / name" req>
            <input value={cf.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Marriage, Career, Education" />
          </Field>
          {cf.special && (
            <Field label="Special Campaign label" req>
              <input value={cf.label} onChange={(e) => set({ label: e.target.value })} placeholder="e.g. Navaratri Special" />
            </Field>
          )}
        </section>
        <section className="cm-fsec">
          <h3>Question types <small>General only, Personal only, or both</small></h3>
          <div className="cm-opts">
            <label className="cm-opt"><input type="checkbox" checked={cf.G} onChange={(e) => set({ G: e.target.checked })} /><span><b>General</b><small>Separate slots and price</small></span></label>
            <label className="cm-opt"><input type="checkbox" checked={cf.P} onChange={(e) => set({ P: e.target.checked })} /><span><b>Personal</b><small>Separate slots and price</small></span></label>
          </div>
        </section>
        <section className="cm-fsec">
          <h3>Campaign duration</h3>
          <div className="grid2">
            <Field label="Start date" req>
              <input type="date" value={cf.start} onChange={(e) => set({ start: e.target.value })} />
              {isScheduledStart(cf.start) && (
                <span className="ce-sched" aria-live="polite"><span className="cm-pill s-scheduled">Scheduled</span> {cf.publishAt && cf.publishAt.slice(0, 10) === cf.start ? `Publishes on ${fmtDateTime(cf.publishAt)}.` : `Starts on ${fmtDate(cf.start)}.`} It stays Scheduled, not Active, until then.</span>
              )}
            </Field>
            <Field label="Expiry date" req><input type="date" value={cf.end} onChange={(e) => set({ end: e.target.value })} /></Field>
          </div>
        </section>
        <section className="cm-fsec">
          <h3>Slot allocation <small>From your shared monthly quota</small></h3>
          <div className="grid2">
            {cf.G && <Field label="General slots" req><input type="number" min="0" value={cf.gSlots || ''} onChange={(e) => set({ gSlots: +e.target.value || 0 })} placeholder="e.g. 150" />{dialog && cf.gSold > 0 && <span className="ce-hint">{cf.gSold} sold</span>}</Field>}
            {cf.P && <Field label="Personal slots" req><input type="number" min="0" value={cf.pSlots || ''} onChange={(e) => set({ pSlots: +e.target.value || 0 })} placeholder="e.g. 50" />{dialog && cf.pSold > 0 && <span className="ce-hint">{cf.pSold} sold</span>}</Field>}
          </div>
          <div className="cm-alloc" aria-live="polite">
            <div><div className="l">Available quota</div><div className="v">{max}</div></div>
            <div><div className="l">This campaign</div><div className="v">{total}</div></div>
            <div><div className="l">Remaining after</div><div className={`v ${rem < 0 ? 'neg' : total ? 'pos' : ''}`}>{rem}</div></div>
          </div>
          {rem < 0 && <p className="cm-form-err show">This campaign needs {total} slots but only {max} are available. Reduce General or Personal slots.</p>}
          <p className="muted sm">You may reduce below slots already sold; purchased questions still must be answered.</p>
        </section>
        {(cf.G || cf.P) && (
          <section className="cm-fsec">
            <h3>Pricing and offers <small>Optional discount per type</small></h3>
            <div className="cm-price-grid">
              {cf.G && <TypePrice kind="G" cf={cf} set={set} />}
              {cf.P && <TypePrice kind="P" cf={cf} set={set} />}
            </div>
          </section>
        )}
        <p className="warn-t sm cm-form-err" role="alert">{err}</p>
        <div className="ce-foot">
          <div className="actions">
            {dialog && <span className="ce-note">{total} slots, {rem} left in quota</span>}
            <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
            {(!cf.id || isDraft) && <button type="button" className="btn btn-o" onClick={saveDraft}>Save as draft</button>}
            {dialog && (!cf.id || isDraft) && <button type="button" className="btn btn-o" aria-expanded={schedOpen} onClick={() => { setSchedOpen((o) => !o); setErr(''); }}>Schedule</button>}
            <button type="button" className="btn btn-p" onClick={save}>{cf.id && !isDraft ? 'Save Changes' : 'Create Campaign'}</button>
          </div>
          {dialog && schedOpen && (
            <div className="ce-schedrow">
              <Field label="Schedule publish">
                <input type="datetime-local" value={schedAt} min={`${TODAY_ISO}T00:00`} onChange={(e) => { setSchedAt(e.target.value); setErr(''); }} />
              </Field>
              <div className="ce-schedbtns">
                <button type="button" className="btn btn-p" onClick={setSchedule}>Set Schedule</button>
                <button type="button" className="btn btn-o" onClick={() => { setSchedOpen(false); setErr(''); }}>Discard</button>
              </div>
            </div>
          )}
        </div>
      </Wrap>
      {!dialog && <Sec title="How users will see it">
        <div className="preview">
          <div className="row wrap"><b className="lg grow">{cf.name || 'Campaign name'}</b>{cf.special && <Badge kind="accent">{cf.label || 'Special Campaign'}</Badge>}</div>
          <span className="muted sm">{fmtDate(cf.start)} – {fmtDate(cf.end)}</span>
          {cf.G && <div className="row"><span className="grow">General question</span><PriceText price={cf.pg || 0} disc={cf.gDisc} /></div>}
          {cf.P && <div className="row"><span className="grow">Personal question</span><PriceText price={cf.pp || 0} disc={cf.pDisc} /></div>}
        </div>
      </Sec>}
    </div>
  );
}
