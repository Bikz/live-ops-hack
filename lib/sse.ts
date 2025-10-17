type SSECallback = (data: any) => void;
type ErrorCallback = () => void;

interface SSEConnection {
  close: () => void;
}

const MAX_BACKOFF = 30000;
const INITIAL_BACKOFF = 1000;

export const openSSE = (
  url: string,
  onMessage: SSECallback,
  onError?: ErrorCallback
): SSEConnection => {
  let eventSource: EventSource | null = null;
  let backoff = INITIAL_BACKOFF;
  let reconnectTimeout: NodeJS.Timeout | null = null;
  let closed = false;

  const connect = () => {
    if (closed) return;

    try {
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        backoff = INITIAL_BACKOFF;

        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();

        if (closed) return;

        if (onError) {
          onError();
        }

        reconnectTimeout = setTimeout(() => {
          backoff = Math.min(backoff * 2, MAX_BACKOFF);
          connect();
        }, backoff);
      };

      eventSource.onopen = () => {
        backoff = INITIAL_BACKOFF;
      };
    } catch (error) {
      console.error('Failed to create EventSource:', error);

      if (!closed) {
        reconnectTimeout = setTimeout(() => {
          backoff = Math.min(backoff * 2, MAX_BACKOFF);
          connect();
        }, backoff);
      }
    }
  };

  connect();

  return {
    close: () => {
      closed = true;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      eventSource?.close();
    },
  };
};

export const connectSSE = (
  eventsUrl: string,
  decisionsUrl: string,
  onEvent: SSECallback,
  onDecision: SSECallback,
  onError?: ErrorCallback
): (() => void) => {
  const eventsConnection = openSSE(eventsUrl, onEvent, onError);
  const decisionsConnection = openSSE(decisionsUrl, onDecision, onError);

  return () => {
    eventsConnection.close();
    decisionsConnection.close();
  };
};
