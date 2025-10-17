import { create } from 'zustand';
import {
  RawEvent,
  Decision,
  RiskPoint,
  AgentMessage,
  SponsorToast,
  SimulatorState,
  Settings,
} from './types';

const MAX_EVENTS = 200;
const MAX_DECISIONS = 100;
const TOAST_DURATION = 2000;

const calculateRiskValue = (events: RawEvent[], session_id: string): number => {
  const recentEvents = events
    .filter((e) => e.session_id === session_id)
    .slice(-10);

  if (recentEvents.length === 0) return 0;

  const errorCount = recentEvents.filter(
    (e) => e.event_type === 'api_error' || e.event_type === 'upload_failed'
  ).length;
  const rageClickCount = recentEvents.filter((e) => e.event_type === 'rage_click').length;
  const highLatencyCount = recentEvents.filter((e) => (e.latency_ms || 0) > 800).length;

  const riskScore = (errorCount * 30 + rageClickCount * 40 + highLatencyCount * 20) / recentEvents.length;

  return Math.min(100, Math.max(0, riskScore));
};

interface LiveOpsStore {
  events: RawEvent[];
  decisions: Decision[];
  riskSeries: RiskPoint[];
  agentMessages: AgentMessage[];
  sponsorToasts: SponsorToast[];
  simulator: SimulatorState;
  settings: Settings;
  sseConnected: boolean;
  activeSession: string | null;

  appendEvent: (event: RawEvent) => void;
  appendDecision: (decision: Decision) => void;
  pushToast: (toast: Omit<SponsorToast, 'id' | 'at'>) => void;
  setSimulatorState: (state: Partial<SimulatorState>) => void;
  setSseConnected: (connected: boolean) => void;
  setActiveSession: (sessionId: string | null) => void;
  setSettings: (settings: Partial<Settings>) => void;
  clearToast: (id: string) => void;
}

export const useLiveOpsStore = create<LiveOpsStore>((set, get) => ({
  events: [],
  decisions: [],
  riskSeries: [],
  agentMessages: [],
  sponsorToasts: [],
  simulator: {
    sessionId: '',
    running: false,
    speed: 1,
    bypassKafka: false,
  },
  settings: {
    mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  },
  sseConnected: false,
  activeSession: null,

  appendEvent: (event) => {
    set((state) => {
      const newEvents = [...state.events, event].slice(-MAX_EVENTS);

      const riskValue = calculateRiskValue(newEvents, event.session_id);
      const newRiskPoint: RiskPoint = {
        ts: event.ts,
        value: riskValue,
      };

      return {
        events: newEvents,
        riskSeries: [...state.riskSeries, newRiskPoint].slice(-90),
        activeSession: state.activeSession || event.session_id,
      };
    });
  },

  appendDecision: (decision) => {
    const at = decision.at || Date.now();

    set((state) => {
      const newDecisions = [...state.decisions, { ...decision, at }].slice(-MAX_DECISIONS);

      const newRiskPoint: RiskPoint = {
        ts: at,
        value: state.riskSeries[state.riskSeries.length - 1]?.value || 0,
        pin: 'SAI',
      };

      const newAgentMessage: AgentMessage = {
        session_id: decision.session_id,
        text: decision.helper_message,
        voiceUrl: decision.voice_text ? '/tts/guide.mp3' : undefined,
        state: decision.state as 'Guide' | 'Escalate',
        at,
      };

      return {
        decisions: newDecisions,
        riskSeries: [...state.riskSeries, newRiskPoint].slice(-90),
        agentMessages:
          decision.state !== 'OK'
            ? [...state.agentMessages, newAgentMessage]
            : state.agentMessages,
      };
    });

    get().pushToast({
      text: `🧠 StackAI reasoned (${Math.round(decision.confidence * 100)}%)`,
      icon: 'SAI',
    });

    if (decision.state === 'Guide' || decision.state === 'Escalate') {
      setTimeout(() => {
        get().pushToast({
          text: '💬 Intercom post sent',
          icon: 'INT',
        });

        const at = Date.now();
        set((state) => {
          const newPin: RiskPoint = {
            ts: at,
            value: state.riskSeries[state.riskSeries.length - 1]?.value || 0,
            pin: 'INT' as const
          };
          return {
            riskSeries: [...state.riskSeries, newPin].slice(-90),
          };
        });
      }, 500);

      if (decision.voice_text) {
        setTimeout(() => {
          get().pushToast({
            text: '🎙️ ElevenLabs voice ready',
            icon: 'TTS',
          });

          const at = Date.now();
          set((state) => {
            const newPin: RiskPoint = {
              ts: at,
              value: state.riskSeries[state.riskSeries.length - 1]?.value || 0,
              pin: 'TTS' as const
            };
            return {
              riskSeries: [...state.riskSeries, newPin].slice(-90),
            };
          });
        }, 800);
      }

      if (decision.sentry?.traceUrl) {
        setTimeout(() => {
          get().pushToast({
            text: '🪪 Sentry trace logged',
            icon: 'SEN',
          });

          const at = Date.now();
          set((state) => {
            const newPin: RiskPoint = {
              ts: at,
              value: state.riskSeries[state.riskSeries.length - 1]?.value || 0,
              pin: 'SEN' as const
            };
            return {
              riskSeries: [...state.riskSeries, newPin].slice(-90),
            };
          });
        }, 1200);
      }
    }
  },

  pushToast: (toast) => {
    const id = `${Date.now()}-${Math.random()}`;
    const at = Date.now();
    const newToast: SponsorToast = { ...toast, id, at };

    set((state) => ({
      sponsorToasts: [...state.sponsorToasts, newToast],
    }));

    setTimeout(() => {
      get().clearToast(id);
    }, TOAST_DURATION);
  },

  setSimulatorState: (state) => {
    set((prev) => ({
      simulator: { ...prev.simulator, ...state },
    }));
  },

  setSseConnected: (connected) => {
    set({ sseConnected: connected });
  },

  setActiveSession: (sessionId) => {
    set({ activeSession: sessionId });
  },

  setSettings: (settings) => {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },

  clearToast: (id) => {
    set((state) => ({
      sponsorToasts: state.sponsorToasts.filter((t) => t.id !== id),
    }));
  },
}));
