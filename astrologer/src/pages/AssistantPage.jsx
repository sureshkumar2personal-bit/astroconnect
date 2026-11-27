import AssistantList from '@/components/assistant/AssistantList.jsx';
import AssistantAdd from '@/components/assistant/AssistantAdd.jsx';
import AssistantAdded from '@/components/assistant/AssistantAdded.jsx';
import AssistantDetail from '@/components/assistant/AssistantDetail.jsx';
import { assistantStore } from '@/hooks/useAssistants.js';

// My Assistants (reference "My Assistants (Prototype)"). Routes:
//   #/assistants                      list
//   #/assistants/add                  Add Assistant
//   #/assistants/added/<id>           invitation sent
//   #/assistants/<id>[/<tab>]         details: profile | permissions | tasks | activity | wallet | account
export function meta(route) {
  const [a, b] = route.parts;
  if (a === 'add') return { title: 'Add Assistant', parent: '/assistants' };
  if (a === 'added') return { title: 'My Assistants', subtitle: 'Invitation sent', parent: '/assistants' };
  if (a) {
    const x = assistantStore.get().assistants.find((s) => s.id === a);
    return { title: 'My Assistants', parent: '/assistants', tab: b };
  }
  return { title: 'My Assistants', parent: '/' };
}

export default function AssistantPage({ route, ui }) {
  const [a, b] = route.parts;
  if (a === 'add') return <AssistantAdd />;
  if (a === 'added') return <AssistantAdded id={b} />;
  if (a) return <AssistantDetail key={a} id={a} tab={b} ui={ui} />;
  return <AssistantList />;
}
