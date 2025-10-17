'use client';

import { useLiveOpsStore } from '@/lib/store';
import { formatTime, formatLatency } from '@/lib/format';
import { getLatencyColor } from '@/lib/theme';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { EventType } from '@/lib/types';

const eventTypeColors: Record<EventType, string> = {
  click: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  api_ok: 'bg-green-500/20 text-green-700 dark:text-green-300',
  api_error: 'bg-red-500/20 text-red-700 dark:text-red-300',
  upload_failed: 'bg-red-500/20 text-red-700 dark:text-red-300',
  rage_click: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
  navigation: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
  retry: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
};

export function LiveEventFeed() {
  const events = useLiveOpsStore((state) => state.events);
  const activeSession = useLiveOpsStore((state) => state.activeSession);

  const filteredEvents = activeSession
    ? events.filter((e) => e.session_id === activeSession)
    : events;

  const recentEvents = filteredEvents.slice(-50).reverse();

  return (
    <div className="relative flex h-full flex-col rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">Live Event Feed</h2>
        <span className="text-xs text-muted-foreground">{recentEvents.length} events</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {recentEvents.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Waiting for events...
            </div>
          ) : (
            recentEvents.map((event, idx) => (
              <div
                key={`${event.ts}-${idx}`}
                className="animate-slideUpFade flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted/50"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {formatTime(event.ts)}
                </span>

                <span className="text-xs text-muted-foreground">{event.user_id}</span>

                <Badge variant="outline" className={eventTypeColors[event.event_type]}>
                  {event.event_type}
                </Badge>

                {event.route && (
                  <span className="text-xs text-muted-foreground">{event.route}</span>
                )}

                {event.latency_ms !== undefined && (
                  <div
                    className="ml-auto h-2 w-2 rounded-full"
                    style={{ backgroundColor: getLatencyColor(event.latency_ms) }}
                    title={formatLatency(event.latency_ms)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/30">
        Redpanda
      </div>
    </div>
  );
}
