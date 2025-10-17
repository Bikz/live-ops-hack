export type EventType =
  | 'click'
  | 'api_ok'
  | 'api_error'
  | 'upload_failed'
  | 'rage_click'
  | 'navigation'
  | 'retry';

export type RawEvent = {
  ts: number;
  session_id: string;
  user_id: string;
  route?: string;
  event_type: EventType;
  latency_ms?: number;
  meta?: Record<string, any>;
};

export type DecisionState = 'OK' | 'Guide' | 'Escalate';

export type Decision = {
  session_id: string;
  state: DecisionState;
  confidence: number;
  helper_message: string;
  voice_text?: string;
  evidence?: string[];
  sentry?: { traceUrl?: string };
  at?: number;
};

export type ActionPin = 'SAI' | 'INT' | 'TTS' | 'SEN';

export type RiskPoint = {
  ts: number;
  value: number;
  pin?: ActionPin;
};

export type AgentMessage = {
  session_id: string;
  text: string;
  voiceUrl?: string;
  state: 'Guide' | 'Escalate';
  at: number;
};

export type SponsorIcon = 'SAI' | 'INT' | 'TTS' | 'SEN';

export type SponsorToast = {
  id: string;
  text: string;
  icon: SponsorIcon;
  at: number;
};

export type SimulatorState = {
  sessionId: string;
  running: boolean;
  scenario?: string;
  speed: number;
  bypassKafka: boolean;
};

export type Settings = {
  mockMode: boolean;
};
