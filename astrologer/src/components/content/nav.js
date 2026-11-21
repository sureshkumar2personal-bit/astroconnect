import { navigate } from '@/lib/router.js';
import { contentActions } from '@/hooks/useContent.js';

// Navigation helpers shared by the Benefits & Content screens.
/** Open a blank editor of the given kind (General Post, a prediction, a special template or Custom). */
export const create = (kind) => { contentActions.startNew(kind); navigate('/content/edit/new'); };
/** Open an existing post in the editor (AD-139 Edit). */
export const edit = (id) => { contentActions.startEdit(id); navigate(`/content/edit/${id}`); };
