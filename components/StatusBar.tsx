'use client';

import { useLiveOpsStore } from '@/lib/store';
import { formatSessionId } from '@/lib/format';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function StatusBar() {
  const activeSession = useLiveOpsStore((state) => state.activeSession);
  const events = useLiveOpsStore((state) => state.events);

  const sessions = Array.from(new Set(events.map((e) => e.session_id)));

  return (
    <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Time Window:</span>
        <Select defaultValue="60">
          <SelectTrigger className="h-8 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30s</SelectItem>
            <SelectItem value="60">Last 60s</SelectItem>
            <SelectItem value="90">Last 90s</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Session:</span>
        <Select value={activeSession || undefined}>
          <SelectTrigger className="h-8 w-48">
            <SelectValue placeholder="Select session">
              {activeSession ? formatSessionId(activeSession) : 'All Sessions'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sessions.map((session) => (
              <SelectItem key={session} value={session}>
                {formatSessionId(session)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
