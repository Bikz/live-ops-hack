'use client';

import { useLiveOpsStore } from '@/lib/store';
import { theme } from '@/lib/theme';
import { formatTime } from '@/lib/format';
import { ActionPin } from '@/lib/types';

const pinIcons: Record<ActionPin, string> = {
  SAI: '🧠',
  INT: '💬',
  TTS: '🎙️',
  SEN: '🪪',
};

const pinColors: Record<ActionPin, string> = {
  SAI: theme.sponsors.SAI.color,
  INT: theme.sponsors.INT.color,
  TTS: theme.sponsors.TTS.color,
  SEN: theme.sponsors.SEN.color,
};

export function RiskTimeline() {
  const riskSeries = useLiveOpsStore((state) => state.riskSeries);

  const last90 = riskSeries.slice(-90);

  const maxRisk = Math.max(...last90.map((r) => r.value), 50);
  const width = 600;
  const height = 100;
  const padding = 10;

  const getRiskColor = (value: number) => {
    if (value < 30) return theme.colors.risk.ok;
    if (value < 60) return theme.colors.risk.guide;
    return theme.colors.risk.escalate;
  };

  const points = last90.map((point, idx) => {
    const x = padding + (idx / (last90.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - (point.value / maxRisk) * (height - 2 * padding);
    return { x, y, ...point };
  });

  const pathD =
    points.length > 0
      ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
      : '';

  return (
    <div className="relative flex h-full flex-col rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Risk Timeline</h2>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.colors.risk.ok }} />
            OK
          </span>
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.colors.risk.guide }} />
            Guide
          </span>
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.colors.risk.escalate }} />
            Escalate
          </span>
        </div>
      </div>

      <div className="flex-1">
        {last90.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Collecting risk data...
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-full w-full"
            style={{ minHeight: '150px' }}
          >
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.colors.risk.escalate} stopOpacity="0.3" />
                <stop offset="50%" stopColor={theme.colors.risk.guide} stopOpacity="0.2" />
                <stop offset="100%" stopColor={theme.colors.risk.ok} stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <path
              d={`${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
              fill="url(#riskGradient)"
              opacity="0.3"
            />

            <path
              d={pathD}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, idx) =>
              point.pin ? (
                <g key={`pin-${idx}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill={pinColors[point.pin]}
                    className="animate-pin-glow"
                  />
                  <title>
                    {theme.sponsors[point.pin].name} at {formatTime(point.ts)}
                  </title>
                </g>
              ) : null
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
