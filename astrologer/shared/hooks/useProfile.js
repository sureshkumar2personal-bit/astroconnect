import { createStore, useStore } from '../lib/store.js';
import { APPROVAL_FIELDS, profileSeed } from '../data/mockProfile.js';

// Profile & Verification state (spec 04_PROFILE_AND_VERIFICATION.md, AD-79 – AD-87).
// Prototype only: nothing is uploaded or sent for approval; state resets on reload.

export const profileStore = createStore(structuredClone(profileSeed));

const EMPTY = '—';
const filled = (v) => !!v && v.trim() !== '' && v !== EMPTY;

/** Profile completion indicator (AD-86): share of filled fields across the information sections. */
export function completion(s) {
  const all = Object.values(s.sections).flatMap((sec) => sec.fields);
  return Math.round((all.filter((x) => filled(x.value)).length / all.length) * 100);
}

/** The value the User App shows: the previously verified value while a change awaits approval (AD-87). */
export const publicValue = (s, field) => (field.label in s.pending ? s.pending[field.label] : field.value);

/** Look up a field by section key and label (for the preview). */
export const fieldOf = (s, key, label) => s.sections[key].fields.find((x) => x.label === label);

export const profileActions = {
  /**
   * Save one section (AD-79). values: { [label]: newValue }. Changed "important" fields are
   * kept as pending with their previously verified value (AD-87; which fields: AP-04-02).
   */
  saveSection(key, values) {
    profileStore.patch((s) => {
      const pending = { ...s.pending };
      const fields = s.sections[key].fields.map((x) => {
        if (x.kind === 'locked' || !(x.label in values)) return x;
        const v = values[x.label];
        if (v === x.value) return x;
        if (APPROVAL_FIELDS.includes(x.label) && !(x.label in pending)) pending[x.label] = x.value;
        return { ...x, value: v };
      });
      return { sections: { ...s.sections, [key]: { ...s.sections[key], fields } }, pending };
    });
  },
  /** Re-upload documents (AD-85): certificate verification goes back to review (prototype). */
  reupload() {
    profileStore.patch((s) => ({
      verification: s.verification.map((v) => (v.label === 'Certificate verification' ? { ...v, status: 'Under review' } : v)),
    }));
  },
};

export default function useProfile() {
  return useStore(profileStore);
}
