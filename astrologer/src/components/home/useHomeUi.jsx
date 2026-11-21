import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, Toast } from '@/components/ui/primitives.jsx';

// Dialog + toast for Home (same components and styles as the other pages; the
// .tq wrapper is display:contents so it adds no box to the Home layout).
export default function useHomeUi(mobile) {
  const [dialog, setDialog] = useState(null); // { title, body: (close) => node }
  const [msg, setMsg] = useState('');
  const timer = useRef();
  const toast = useCallback((m) => {
    clearTimeout(timer.current);
    setMsg(m);
    timer.current = setTimeout(() => setMsg(''), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const close = useCallback(() => setDialog(null), []);
  const node = (
    <div className="tq ac-home-ui">
      <Dialog open={!!dialog} title={dialog?.title || ''} onClose={close} sheet={mobile}>
        {dialog ? dialog.body(close) : null}
      </Dialog>
      {msg && <Toast message={msg} />}
    </div>
  );
  return { ui: { dialog: setDialog, toast, close }, node };
}
