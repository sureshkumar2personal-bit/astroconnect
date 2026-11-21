import { SPECIAL } from '@/data/mockContent.js';
import { Grid, Sec } from '@/components/ui/sectionKit.jsx';
import { create } from './nav.js';

// Templates: the 12-Rasi prediction template (AD-141), ten optional special templates (AD-142) and
// custom content without a template (AD-143).
export default function TemplatesTab() {
  return (
    <>
      <Sec title="12-Rasi prediction template">
        <p className="sm">Daily, Weekly and Monthly predictions use one template: the 12 Rasis on the left, your prediction for each on the right.</p>
        <button type="button" className="btn btn-o cm-start" onClick={() => create('Daily Prediction')}>Open template</button>
      </Sec>
      <Sec title="Special astrology templates (optional)">
        <Grid size="sm">
          {SPECIAL.map((t) => (
            <button key={t} type="button" className="kpi kpi--link cm-tpl" onClick={() => create(t)}>
              <b>{t}</b><span className="sm">Use template ›</span>
            </button>
          ))}
        </Grid>
        <span className="muted sm">Available to every astrologer; never forced annually.</span>
      </Sec>
      <Sec title="Custom content">
        <p className="sm">Write original content without a template.</p>
        <button type="button" className="btn btn-o cm-start" onClick={() => create('Custom')}>Create custom content</button>
      </Sec>
    </>
  );
}
