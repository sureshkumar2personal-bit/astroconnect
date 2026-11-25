import { useEffect, useRef } from 'react';
import { availableFor, callsActions, callsStore } from '@/hooks/useCalls.js';

// Incoming Instant Call / Instant Chat request source.
//
// PLACEHOLDER: there is no backend yet. While a service is available (Online, not DND, its switch ON)
// this sends a request from an existing customer every few seconds, so the Dashboard receives requests
// on its own — no Simulate button needed. When the real API / socket exists, replace only
// `connect()` below: call `onRequest(service)` for each real incoming request (with its real data
// passed through callsActions.receive) and return a function that disconnects.
const FIRST_MS = [5000, 9000]; // first request after a service is switched ON
const NEXT_MS = [18000, 30000]; // then one every 18–30 s
const MAX_WAITING = 5; // stop adding while this many are already waiting in that queue
const between = ([a, b]) => a + Math.floor(Math.random() * (b - a));

// Testing: localStorage 'ac-request-feed' = 'off' pauses this placeholder source (the test buttons still work).
const paused = () => { try { return localStorage.getItem('ac-request-feed') === 'off'; } catch { return false; } };

function connect(service, onRequest) {
  if (paused()) return undefined;
  let timer = setTimeout(function next() {
    onRequest(service);
    timer = setTimeout(next, between(NEXT_MS));
  }, between(FIRST_MS));
  return () => clearTimeout(timer);
}

/** Listen for incoming requests while the app is open (used once, in App). Each service is connected
 *  only while it is available, and disconnected as soon as it is switched OFF, Offline or DND. */
export function useIncomingRequests(availability) {
  const av = useRef(availability);
  av.current = availability;
  const callOn = availableFor(availability, 'call');
  const chatOn = availableFor(availability, 'chat');
  const receive = (s) => {
    if (callsStore.get().queue[s].length >= MAX_WAITING) return;
    callsActions.receive(s, av.current);
  };
  useEffect(() => (callOn ? connect('call', receive) : undefined), [callOn]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => (chatOn ? connect('chat', receive) : undefined), [chatOn]); // eslint-disable-line react-hooks/exhaustive-deps
}
