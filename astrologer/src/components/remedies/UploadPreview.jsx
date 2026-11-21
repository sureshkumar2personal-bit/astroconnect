// "User upload" dialog body (spec 17 / AD-22: the astrologer sees the User's uploaded file).
// Prototype: no real file is stored or opened.
export default function UploadPreview({ file, onClose }) {
  return (
    <>
      <div className="preview rm-preview">
        <b>{file}</b>
        <span className="muted sm">Prototype preview — no real file is opened.</span>
      </div>
      <div className="actions"><button type="button" className="btn btn-p" onClick={onClose}>Close</button></div>
    </>
  );
}
