import { useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { AvailCard, Card, Chip, PageHead, SaveBar, Sw, clone, useDraft, validPrice } from './svShared.jsx';

const INITIAL = {
  platform: [
    { id: 'career', name: 'Career', on: true }, { id: 'marriage', name: 'Marriage & Relationships', on: true },
    { id: 'finance', name: 'Finance', on: true }, { id: 'education', name: 'Education', on: true },
    { id: 'family', name: 'Family', on: true }, { id: 'health', name: 'Health & Wellbeing', on: true },
    { id: 'property', name: 'Property', on: false }, { id: 'travel', name: 'Travel & Relocation', on: false },
  ],
  custom: [{ id: 'c1', name: 'Gemstone Guidance', on: true }, { id: 'c2', name: 'Vastu for Home', on: false }],
  prices: {
    career: { general: '199', personal: '399' }, marriage: { general: '199', personal: '449' }, finance: { general: '199', personal: '399' },
    education: { general: '149', personal: '299' }, family: { general: '149', personal: '349' }, health: { general: '149', personal: '349' },
    property: { general: '199', personal: '399' }, travel: { general: '149', personal: '299' },
    c1: { general: '249', personal: '499' }, c2: { general: '199', personal: '399' },
  },
  guidelines: 'Please include your exact time and place of birth for personal questions. I answer within the response time shown on my profile.',
};

/** Service Management → Text-Based Questions: categories, pricing, answer limits, guidelines, quota. */
export default function TextService({ ui }) {
  const f = useDraft(INITIAL);
  const d = f.draft;
  const [seq, setSeq] = useState(3);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newErr, setNewErr] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editErr, setEditErr] = useState('');

  const taken = (name, except) => { const n = name.trim().toLowerCase(); return [...d.platform, ...d.custom].some((c) => c.id !== except && c.name.toLowerCase() === n); };
  const enabled = [...d.platform.filter((c) => c.on).map((c) => ({ c, kind: 'Platform' })), ...d.custom.filter((c) => c.on).map((c) => ({ c, kind: 'Custom' }))];

  const addCat = () => {
    const n = newName.trim();
    if (!n) return setNewErr('Enter a category name.');
    if (taken(n, null)) return setNewErr('A category with this name already exists.');
    const id = `c${seq}`;
    f.upd((x) => { x.custom.push({ id, name: n, on: true }); x.prices[id] = { general: '', personal: '' }; });
    setSeq(seq + 1); setAdding(false); setNewName('');
  };
  const saveEdit = () => {
    const n = editName.trim();
    if (!n) return setEditErr('Enter a category name.');
    if (taken(n, editId)) return setEditErr('A category with this name already exists.');
    f.upd((x) => { x.custom.forEach((c) => { if (c.id === editId) c.name = n; }); });
    setEditId(null);
  };
  const askDelete = (c) => ui.dialog({
    title: `Delete “${c.name}”?`,
    body: (close) => (
      <>
        <p>This removes the category and its prices from your settings. You can still press Cancel at the bottom of the page to undo before saving.</p>
        <div className="actions">
          <button type="button" className="btn btn-o" onClick={close}>Keep category</button>
          <button type="button" className="btn danger-f" onClick={() => { f.upd((x) => { x.custom = x.custom.filter((k) => k.id !== c.id); delete x.prices[c.id]; }); if (editId === c.id) setEditId(null); close(); }}>Delete category</button>
        </div>
      </>
    ),
  });
  const setPrice = (id, k, v) => f.upd((x) => { x.prices[id] = x.prices[id] || { general: '', personal: '' }; x.prices[id][k] = v; });
  const save = () => {
    if (editId || adding) return f.fail('Finish or cancel the category you are editing first.');
    if (enabled.some(({ c }) => { const p = d.prices[c.id] || {}; return !validPrice(p.general) || !validPrice(p.personal); })) {
      return f.fail('Enter a price above ₹0 for both question types in every category that is on.');
    }
    f.commit();
  };

  return (
    <div className="sv">
      <PageHead icon="chatQuestion" title="Text-Based Questions" />

      <Card title="Question categories" id="sv-cat">
        <div className="sv-sub"><h3>Platform categories</h3><span>{d.platform.filter((c) => c.on).length} of {d.platform.length} on</span></div>
        <ul className="sv-list">
          {d.platform.map((c, i) => (
            <li key={c.id} className="sv-li"><span className="sv-li__n">{c.name}</span><Chip tone="navy">Platform</Chip><span className="sv-li__st">{c.on ? 'On' : 'Off'}</span>
              <Sw on={c.on} label={`Offer ${c.name}`} onClick={() => f.upd((x) => { x.platform[i].on = !x.platform[i].on; })} /></li>
          ))}
        </ul>
        <div className="sv-sub"><h3>My categories</h3><span>Created by you</span>
          {!adding && <button type="button" className="btn btn-o sm sv-sub__act" onClick={() => { setAdding(true); setNewName(''); setNewErr(''); }}>+ Add category</button>}
        </div>
        <ul className="sv-list">
          {d.custom.map((c, i) => (editId === c.id ? (
            <li key={c.id} className="sv-li sv-li--edit">
              <label className="sv-f">Category name<input type="text" value={editName} aria-invalid={!!editErr} onChange={(e) => { setEditName(e.target.value); setEditErr(''); }} /></label>
              {editErr && <span className="sv-err" role="alert">{editErr}</span>}
              <div className="sv-li__acts"><button type="button" className="btn btn-o sm" onClick={() => { setEditId(null); setEditErr(''); }}>Cancel</button><button type="button" className="btn sv-btn sm" onClick={saveEdit}>Update</button></div>
            </li>
          ) : (
            <li key={c.id} className="sv-li"><span className="sv-li__n">{c.name}</span><Chip tone="gold">Custom</Chip><span className="sv-li__st">{c.on ? 'On' : 'Off'}</span>
              <Sw on={c.on} label={`Offer ${c.name}`} onClick={() => f.upd((x) => { x.custom[i].on = !x.custom[i].on; })} />
              <button type="button" className="sv-ib" aria-label={`Rename ${c.name}`} onClick={() => { setEditId(c.id); setEditName(c.name); setEditErr(''); }}><Icon name="edit" size={16} /></button>
              <button type="button" className="sv-ib sv-ib--bad" aria-label={`Delete ${c.name}`} onClick={() => askDelete(c)}><Icon name="close" size={16} /></button></li>
          )))}
        </ul>
        {d.custom.length === 0 && !adding && <p className="sv-empty">You haven't added any categories yet.</p>}
        {adding && (
          <div className="sv-add">
            <label className="sv-f">New category name<input type="text" value={newName} placeholder="e.g. Gemstone guidance" aria-invalid={!!newErr} onChange={(e) => { setNewName(e.target.value); setNewErr(''); }} /></label>
            {newErr && <span className="sv-err" role="alert">{newErr}</span>}
            <div className="sv-li__acts"><button type="button" className="btn btn-o sm" onClick={() => { setAdding(false); setNewName(''); setNewErr(''); }}>Cancel</button><button type="button" className="btn sv-btn sm" onClick={addCat}>Add category</button></div>
          </div>
        )}
      </Card>

      <Card title="Question types" id="sv-types">
        <div className="sv-two">
          <div className="sv-type"><b>General Questions</b><p>Broad questions on a topic, not tied to the user's own chart.</p></div>
          <div className="sv-type"><b>Personal Questions</b><p>Questions about the user's own life, read from their birth details.</p></div>
        </div>
      </Card>

      <Card title="Pricing" id="sv-price">
        {enabled.length === 0 ? <p className="sv-empty">Turn on at least one category to set prices.</p> : (
          <div className="sv-ptable" role="table" aria-label="Pricing">
            <div className="sv-prow sv-prow--h" role="row"><span role="columnheader">Category</span><span role="columnheader">General question</span><span role="columnheader">Personal question</span></div>
            {enabled.map(({ c, kind }) => {
              const p = d.prices[c.id] || { general: '', personal: '' };
              const bg = f.tried && !validPrice(p.general); const bp = f.tried && !validPrice(p.personal);
              return (
                <div key={c.id} className="sv-prow" role="row">
                  <span className="sv-prow__n">{c.name} <Chip tone={kind === 'Platform' ? 'navy' : 'gold'}>{kind}</Chip></span>
                  <label className={`sv-money${bg ? ' bad' : ''}`}><span className="sv-prow__lbl">General</span><i>₹</i><input type="text" inputMode="decimal" value={p.general} aria-invalid={bg} aria-label={`General question price for ${c.name}, in rupees`} onChange={(e) => setPrice(c.id, 'general', e.target.value)} /></label>
                  <label className={`sv-money${bp ? ' bad' : ''}`}><span className="sv-prow__lbl">Personal</span><i>₹</i><input type="text" inputMode="decimal" value={p.personal} aria-invalid={bp} aria-label={`Personal question price for ${c.name}, in rupees`} onChange={(e) => setPrice(c.id, 'personal', e.target.value)} /></label>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Purchased slots & campaigns" id="sv-slots">
        <p>Manage your purchased question slots and campaigns, and see what users have bought, in Purchased Slots &amp; Campaigns.</p>
        <a className="btn btn-o sv-link" href="#/work/campaigns">Open Purchased Slots &amp; Campaigns</a>
      </Card>

      <Card title="Answer settings" id="sv-ans">
        <dl className="sv-kv">
          <div><dt>User question limit</dt><dd>1,000 characters <Chip tone="navy">Platform rule</Chip></dd></div>
          <div><dt>Your answer limit</dt><dd>1,500 characters <Chip tone="navy">Platform rule</Chip></dd></div>
        </dl>
      </Card>

      <Card title="Question guidelines" id="sv-guide">
        <div className="sv-guide">
          <h3>AstroConnect guidelines</h3><span className="sv-hint">Sample wording, provided by the platform</span>
          <ul><li>Ask one clear question at a time.</li><li>Share accurate birth details for personal questions.</li><li>Keep questions respectful. Medical, legal and financial decisions need a qualified professional.</li></ul>
        </div>
        <label className="sv-f">My guidelines<textarea rows={4} value={d.guidelines} onChange={(e) => f.upd((x) => { x.guidelines = e.target.value; })} /></label>
      </Card>

      <Card title="Availability & monthly quota" id="sv-quota">
        <div className="sv-note"><Icon name="info" size={16} /><span>Text-Based Questions availability is controlled from the Home Dashboard. There is no separate on/off switch here.</span></div>
        <a className="btn btn-o sv-link" href="#/">Go to Home Dashboard</a>
        <dl className="sv-kv">
          <div><dt>Shared monthly quota</dt><dd>1,000 questions, shared by Campaign Questions and Open Questions</dd></div>
          <div><dt>Quota resets</dt><dd>1st of every month, 12:00 AM IST</dd></div>
        </dl>
      </Card>

      <SaveBar status={f.status} dirty={f.dirty} onCancel={() => { f.discard(); setEditId(null); setAdding(false); }} onSave={save} />
    </div>
  );
}
