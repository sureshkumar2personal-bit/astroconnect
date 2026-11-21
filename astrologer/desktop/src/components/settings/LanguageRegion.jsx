import { Field, PendingTag, Sec } from '../section/kit.jsx';
import { DATE_FORMATS, LANGUAGES, TIME_ZONES } from '@shared/data/mockSettings.js';
import { settingsActions } from '@shared/hooks/useSettings.js';

// Language & Region (AD-154): app language, date format, time zone (IST by default, SET-03).
// The effect of changing the time zone is not decided: AP-15-01 (business rules use IST, AD-71).
// Prototype: the choice is remembered on this page only; the app's text and dates do not change.
export default function LanguageRegion({ s, ui }) {
  const change = (key) => (e) => { settingsActions.setValue(key, e.target.value); ui.toast('Saved'); };
  const select = (key, options) => (
    <select value={s[key]} onChange={change(key)}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  return (
    <Sec title="Language & Region">
      <div className="form">
        <Field label="App language">{select('lang', LANGUAGES)}</Field>
        <Field label="Date format">{select('fmt', DATE_FORMATS)}</Field>
        <Field label="Time zone">{select('tz', TIME_ZONES)}</Field>
        <span className="muted sm">IST by default. Business rules always use IST days. Effect of changing it: <PendingTag id="AP-15-01" /></span>
      </div>
    </Sec>
  );
}
