'use client';

import { Activity, Brain, AlertCircle, Mic } from 'lucide-react';
import { useLiveOpsStore } from '@/lib/store';
import { Badge } from './ui/badge';

export function TopNav() {
  const sseConnected = useLiveOpsStore((state) => state.sseConnected);

  return (
    <nav className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">LiveOps Agent</h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={sseConnected ? 'default' : 'secondary'}
            className="gap-1.5 px-3 py-1"
          >
            <Activity className="h-3 w-3" />
            Redpanda {sseConnected ? 'Live' : 'Offline'}
          </Badge>

          <Badge variant="outline" className="gap-1.5 px-3 py-1">
            <Brain className="h-3 w-3" style={{ color: '#6B7CFF' }} />
            StackAI
          </Badge>

          <Badge variant="outline" className="gap-1.5 px-3 py-1">
            <AlertCircle className="h-3 w-3" style={{ color: '#E5484D' }} />
            Sentry
          </Badge>

          <Badge variant="outline" className="gap-1.5 px-3 py-1">
            <Mic className="h-3 w-3" style={{ color: '#7C3AED' }} />
            TTS
          </Badge>
        </div>
      </div>
    </nav>
  );
}
