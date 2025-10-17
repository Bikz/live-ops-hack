import { NextRequest } from 'next/server';

const SESSION_ID = 'sess_demo_001';

let decisionCounter = 0;

function generateDecision() {
  decisionCounter++;
  const ts = Date.now();

  if (decisionCounter % 3 === 0) {
    return {
      session_id: SESSION_ID,
      state: 'Guide',
      confidence: 0.87 + Math.random() * 0.1,
      helper_message: 'Rate limit detected. Cooling down for 30s. Try switching to cached data.',
      voice_text: 'Hey there, looks like you hit a rate limit. Let me help you switch to cached data.',
      evidence: [
        'Saw: 3 consecutive 429 errors',
        'Think: User experiencing rate limit frustration',
        'Did: Suggest cached data fallback',
      ],
      sentry: {
        traceUrl: 'https://sentry.io/traces/abc123',
      },
      at: ts,
    };
  }

  if (decisionCounter % 5 === 0) {
    return {
      session_id: SESSION_ID,
      state: 'Escalate',
      confidence: 0.92,
      helper_message: 'Rage clicks detected. User seems frustrated. Agent standing by.',
      voice_text: 'We noticed you might be stuck. An agent is ready to help if needed.',
      evidence: [
        'Saw: 7 rapid clicks on submit button',
        'Think: High friction, possible UX issue',
        'Did: Alert support team',
      ],
      sentry: {
        traceUrl: 'https://sentry.io/traces/xyz789',
      },
      at: ts,
    };
  }

  return {
    session_id: SESSION_ID,
    state: 'OK',
    confidence: 0.95,
    helper_message: 'Session healthy',
    at: ts,
  };
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const decision = generateDecision();
        const data = `data: ${JSON.stringify(decision)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }, 5000);

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
