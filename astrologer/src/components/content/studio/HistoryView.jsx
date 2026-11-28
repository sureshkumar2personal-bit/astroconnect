import { AUD, AUDM, STATUS } from '@/data/mockStudio.js';
import * as C from '@/hooks/useStudio.js';
import { Pill } from './csShared.jsx';

/** Delivery history (AD-140): every post sent to the audience with delivery details; failed or missed sends can be retried. */
export default function HistoryView({ s }) {
  return (
    <div className="cs-stack">
      <div className="cs-card cs-table-wrap" data-noswipe>
        <div className="cs-table">
          <div className="cs-tr cs-tr--head cs-hist"><span>Post</span><span>Type</span><span>Audience</span><span>Status</span><span>Date &amp; time</span><span>Delivery details</span></div>
          {s.history.map((h) => {
            const a = AUDM[h.aud] || AUD[0]; const st = STATUS[h.status] || STATUS.pending;
            return (
              <div className="cs-tr cs-hist" key={h.id}>
                <span className="cs-td cs-td--strong" data-label="Post">{h.title}</span>
                <span className="cs-td" data-label="Type">{h.type}</span>
                <span className="cs-td" data-label="Audience"><Pill cls={`a-${h.aud}`}>{a.label}</Pill></span>
                <span className="cs-td" data-label="Status"><Pill cls={`s-${h.status}`}>{st.label}</Pill></span>
                <span className="cs-td" data-label="Date & time">{h.when}</span>
                <span className="cs-td cs-td--detail" data-label="Delivery details">{h.detail}
                  {(h.status === 'failed' || h.status === 'missed') && <button type="button" className="cs-btn cs-btn--sm" onClick={() => C.retryDelivery(h)}>Retry</button>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
