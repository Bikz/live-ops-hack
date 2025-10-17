export const theme = {
  colors: {
    risk: {
      ok: process.env.NEXT_PUBLIC_BRAND_GREEN || '#2BC275',
      guide: process.env.NEXT_PUBLIC_BRAND_AMBER || '#FFB020',
      escalate: process.env.NEXT_PUBLIC_BRAND_RED || '#E5484D',
    },
    accent: process.env.NEXT_PUBLIC_BRAND_ACCENT || '#6B7CFF',
  },
  latency: {
    fast: '#2BC275',
    medium: '#FFB020',
    slow: '#E5484D',
    thresholds: {
      medium: 300,
      slow: 800,
    },
  },
  sponsors: {
    SAI: {
      name: 'StackAI',
      color: '#6B7CFF',
      icon: '🧠',
    },
    INT: {
      name: 'Intercom',
      color: '#1F8CEB',
      icon: '💬',
    },
    TTS: {
      name: 'ElevenLabs',
      color: '#7C3AED',
      icon: '🎙️',
    },
    SEN: {
      name: 'Sentry',
      color: '#E5484D',
      icon: '🪪',
    },
  },
} as const;

export const getLatencyColor = (latency: number | undefined): string => {
  if (!latency) return theme.latency.fast;
  if (latency < theme.latency.thresholds.medium) return theme.latency.fast;
  if (latency < theme.latency.thresholds.slow) return theme.latency.medium;
  return theme.latency.slow;
};

export const getRiskColor = (state: 'OK' | 'Guide' | 'Escalate'): string => {
  switch (state) {
    case 'OK':
      return theme.colors.risk.ok;
    case 'Guide':
      return theme.colors.risk.guide;
    case 'Escalate':
      return theme.colors.risk.escalate;
  }
};
