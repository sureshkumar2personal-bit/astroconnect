import { useState } from 'react';
import { Field } from '@/components/ui/sectionKit.jsx';
import { MAX_CHARS } from '@/lib/textQuestions.js';

// Answer Templates (reference TQSUB.templates; AD-38): the astrologer's own templates —
// save, edit, delete, reuse in the answer editor. Delete asks for confirmation in a dialog
// (the reference used the browser confirm()).
export default function TemplatesPage({ templates, onEdit, onDelete }) {
  if (!templates.length) return <div className="empty"><b>No templates yet</b></div>;
  return (
    <div className="stack">
      {templates.map((t) => (
        <section key={t.id} className="card row tpl">
          <div className="grow"><b>{t.name}</b><div className="muted sm clip">{t.text}</div></div>
          <button type="button" className="btn btn-o sm" onClick={() => onEdit(t.id)}>Edit</button>
          <button type="button" className="btn btn-o sm danger" onClick={() => onDelete(t.id)}>Delete</button>
        </section>
      ))}
    </div>
  );
}

export function TemplateFormBody({ template, onCancel, onSave }) {
  const [name, setName] = useState(template?.name || '');
  const [text, setText] = useState(template?.text || '');
  const [err, setErr] = useState('');
  const save = () => {
    if (!name.trim() || !text.trim()) return setErr('Add a name and text.');
    onSave(name.trim(), text);
  };
  return (
    <>
      <div className="form">
        <Field label="Template name" req><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Template text" req><textarea maxLength={MAX_CHARS} value={text} onChange={(e) => setText(e.target.value)} /></Field>
        <div className="sm char-count">{text.length} / {MAX_CHARS}</div>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={save}>Save Template</button>
      </div>
    </>
  );
}

export function DeleteTemplateBody({ template, onCancel, onConfirm }) {
  return (
    <>
      <p>Delete this template? <b>{template.name}</b></p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p danger-f" onClick={onConfirm}>Delete Template</button>
      </div>
    </>
  );
}
