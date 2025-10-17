'use client';

import { useLiveOpsStore } from '@/lib/store';
import { theme } from '@/lib/theme';

export function MemoryMiniMap() {
  const decisions = useLiveOpsStore((state) => state.decisions);

  const hasGuideDecision = decisions.some((d) => d.state === 'Guide');
  const hasEscalateDecision = decisions.some((d) => d.state === 'Escalate');

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card p-4">
      <h2 className="mb-4 font-semibold">Memory Map</h2>

      <div className="relative flex-1">
        <svg viewBox="0 0 200 150" className="h-full w-full">
          <circle cx="40" cy="75" r="20" fill={theme.colors.accent} opacity="0.3" />
          <text
            x="40"
            y="78"
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            className="font-medium"
          >
            Session
          </text>

          <line
            x1="60"
            y1="75"
            x2="90"
            y2="75"
            stroke={theme.colors.accent}
            strokeWidth="2"
            opacity="0.5"
          />

          <circle
            cx="110"
            cy="75"
            r="20"
            fill={hasGuideDecision || hasEscalateDecision ? theme.colors.risk.guide : theme.colors.accent}
            opacity={hasGuideDecision || hasEscalateDecision ? 0.6 : 0.3}
            className={hasGuideDecision || hasEscalateDecision ? 'animate-pulse' : ''}
          />
          <text
            x="110"
            y="78"
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            className="font-medium"
          >
            Feature
          </text>

          <line
            x1="130"
            y1="75"
            x2="160"
            y2="75"
            stroke={hasGuideDecision || hasEscalateDecision ? theme.colors.risk.guide : theme.colors.accent}
            strokeWidth="2"
            opacity={hasGuideDecision || hasEscalateDecision ? 0.8 : 0.5}
          />

          <circle
            cx="180"
            cy="75"
            r="20"
            fill={hasGuideDecision || hasEscalateDecision ? theme.colors.risk.ok : theme.colors.accent}
            opacity={hasGuideDecision || hasEscalateDecision ? 0.8 : 0.3}
            className={hasGuideDecision || hasEscalateDecision ? 'animate-pin-glow' : ''}
          />
          <text
            x="180"
            y="78"
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            className="font-medium"
          >
            Fix
          </text>
        </svg>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Pattern detection for repeated issues</p>
        </div>
      </div>
    </div>
  );
}
