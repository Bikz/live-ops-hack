'use client';

import { useLiveOpsStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/format';
import { ScrollArea } from './ui/scroll-area';
import { VoiceButton } from './VoiceButton';
import { getRiskColor } from '@/lib/theme';

export function AgentPanel() {
  const agentMessages = useLiveOpsStore((state) => state.agentMessages);

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="font-semibold">Agent Messages</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        {agentMessages.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            No agent interventions yet
          </div>
        ) : (
          <div className="space-y-4">
            {agentMessages.map((message, idx) => (
              <div key={`${message.at}-${idx}`} className="animate-slideUpFade space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <div
                      className="rounded-lg border p-3"
                      style={{
                        borderLeftWidth: '3px',
                        borderLeftColor: getRiskColor(message.state),
                      }}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatRelativeTime(message.at)}</span>
                      <span>·</span>
                      <span
                        className="font-medium"
                        style={{ color: getRiskColor(message.state) }}
                      >
                        {message.state}
                      </span>
                    </div>
                  </div>
                </div>

                {message.voiceUrl && (
                  <div className="ml-12">
                    <VoiceButton voiceUrl={message.voiceUrl} fallbackText={message.text} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
