import { NextRequest } from 'next/server';

const SESSION_ID = 'sess_demo_001';
const USER_ID = 'user_alice';

const eventTypes = ['click', 'api_ok', 'navigation', 'click', 'api_ok'];
const routes = ['/dashboard', '/profile', '/settings', '/analytics'];

let eventCounter = 0;
let rateLimitPhase = false;

function generateEvent() {
  eventCounter++;
  const ts = Date.now();

  if (eventCounter % 15 === 0) {
    rateLimitPhase = true;
    return {
      ts,
      session_id: SESSION_ID,
      user_id: USER_ID,
      route: '/api/data',
      event_type: 'api_error',
      latency_ms: 850,
      meta: { status: 429, message: 'Rate limit exceeded' },
    };
  }

  if (rateLimitPhase && eventCounter % 3 === 0) {
    return {
      ts,
      session_id: SESSION_ID,
      user_id: USER_ID,
      event_type: 'retry',
      latency_ms: 920,
    };
  }

  if (eventCounter % 20 === 0) {
    rateLimitPhase = false;
    return {
      ts,
      session_id: SESSION_ID,
      user_id: USER_ID,
      event_type: 'rage_click',
      route: '/submit',
      meta: { clicks: 7, duration: 2100 },
    };
  }

  const event_type = eventTypes[eventCounter % eventTypes.length];
  const route = routes[eventCounter % routes.length];
  const latency_ms = event_type === 'api_ok' ? Math.floor(Math.random() * 600) + 100 : undefined;

  return {
    ts,
    session_id: SESSION_ID,
    user_id: USER_ID,
    route,
    event_type,
    latency_ms,
  };
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const event = generateEvent();
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }, 1500);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
