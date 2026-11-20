import { useState } from 'react';
import { MAX_CHARS } from '@shared/lib/textQuestions.js';

export default function AnswerTemplates({ templates, onAction }) {
  return (
    <>
      <div className="row">
        <span className="grow" />
        <button type="button" className="btn btn-p" onClick={() => onAction('newTpl')}>+ Create Template</button>
      </div>
      {templates.length ? (
        templates.map((t) => (
          <section key={t.id} className="card row">
            <div className="grow"><b>{t.name}</b><div className="muted sm clip">{t.text}</div></div>
            <button type="button" className="btn btn-o sm" onClick={() => onAction('editTpl', t.id)}>Edit</button>
            <button type="button" className="btn btn-o sm danger" onClick={() => onAction('delTpl', t.id)}>Delete</button>
          </section>
        ))
      ) : (
        <div className="empty"><b>No templates yet</b></div>
      )}
    </>
  );
}

export function TemplateForm({ template, onCancel, onSave }) {
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
        <label>Template name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Template text<textarea maxLength={MAX_CHARS} value={text} onChange={(e) => setText(e.target.value)} /></label>
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

// Replaces the reference prototype's browser confirm() with an in-app dialog.
export function DeleteTemplate({ template, onCancel, onConfirm }) {
  return (
    <>
      <p>Delete <b>{template.name}</b>? This can't be undone.</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Keep Template</button>
        <button type="button" className="btn btn-p danger-f" onClick={onConfirm}>Delete Template</button>
      </div>
    </>
  );
}
