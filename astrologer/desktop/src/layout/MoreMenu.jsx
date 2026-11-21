import { useState } from 'react';
import Icon from '@shared/components/Icon.jsx';
import { Dialog, PendingTag } from '@shared/components/ui.jsx';
import { secondaryNav } from '@shared/data/mockHome.js';

// Phone header "All sections" menu (reference: ☰ → All sections). The sidebar
// is hidden on phones, so this is how the "More" pages are reached there.
export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  return (
    <span className="tq ac-more">
      <button type="button" className="ac-iconbtn" aria-label="All sections" onClick={() => setOpen(true)}>
        <Icon name="menu" size={24} />
      </button>
      <Dialog open={open} title="All sections" onClose={() => setOpen(false)} sheet>
        <div className="stack">
          {secondaryNav.map((n) => (
            <a key={n.key} className="lnk" href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
        </div>
        <span className="sm"><PendingTag id="AP-GL-02 placement within tabs" /></span>
      </Dialog>
    </span>
  );
}
