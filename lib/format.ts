import { format } from 'date-fns';

export const formatTime = (ts: number): string => {
  return format(new Date(ts), 'HH:mm:ss.SSS');
};

export const formatRelativeTime = (ts: number): string => {
  const now = Date.now();
  const diff = now - ts;

  if (diff < 1000) return 'just now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
};

export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

export const formatLatency = (latency: number | undefined): string => {
  if (!latency) return '-';
  return `${latency}ms`;
};

export const formatSessionId = (sessionId: string): string => {
  if (sessionId.length <= 8) return sessionId;
  return `${sessionId.substring(0, 8)}...`;
};
