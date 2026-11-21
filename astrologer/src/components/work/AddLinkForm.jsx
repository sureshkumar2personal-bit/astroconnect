import { useState } from 'react';

// Replaces the reference prototype's browser prompt() with an in-app dialog.
export default function AddLinkForm({ onCancel, onAdd }) {
  const [url, setUrl] = useState('https://');
  const [err, setErr] = useState('');
  const add = () => {
    const v = url.trim();
    if (!/^https?:\/\/\S+\.\S+/.test(v)) return setErr('Enter a full link starting with https://');
    onAdd(v);
  };
  return (
    <>
      <div className="form">
        <label>Paste a link<input type="url" autoFocus value={url} onChange={(e) => { setUrl(e.target.value); setErr(''); }} onKeyDown={(e) => e.key === 'Enter' && add()} /></label>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={add}>Add Link</button>
      </div>
    </>
  );
}
