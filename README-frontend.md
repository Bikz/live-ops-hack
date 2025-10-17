# LiveOps Agent Frontend

Real-time event monitoring dashboard with AI-powered decision making.

## Quick Start

```bash
# Development mode (uses Mock Mode by default)
npm run dev
```

Visit `http://localhost:3000` to see the dashboard in action.

## Features

### 🎯 Dashboard Components

- **Live Event Feed**: Real-time stream of user events from Redpanda
- **Risk Timeline**: Visual sparkline showing risk levels with action pins
- **Brain Pulse**: Animated indicator when StackAI makes a decision
- **Decision Cards**: AI recommendations with confidence scores
- **Agent Panel**: Intercom-style messaging for user guidance
- **Memory Mini-Map**: Pattern detection visualization
- **Sponsor Toasts**: Real-time notifications for service actions

### 🎭 Mock Mode

The app runs in Mock Mode by default, providing simulated data without needing backend services.

Mock Mode generates:
- Regular events (clicks, API calls, navigation)
- Rate-limiting scenarios every ~20s
- Rage click patterns every ~30s
- AI decisions triggered by error patterns

### 🛠️ Configuration

Environment variables in `.env`:

```env
# Mock Mode (true = use mock data, false = connect to real backends)
NEXT_PUBLIC_MOCK_MODE=true

# SSE Endpoints (used when MOCK_MODE=false)
NEXT_PUBLIC_SSE_EVENTS=/api/mock/events
NEXT_PUBLIC_SSE_DECISIONS=/api/mock/decisions

# Backend URLs (used when MOCK_MODE=false)
NEXT_PUBLIC_ACTIONS_BASE=/api/mock
NEXT_PUBLIC_INGESTOR_BASE=/api/mock

# Brand Colors
NEXT_PUBLIC_BRAND_RED=#E5484D
NEXT_PUBLIC_BRAND_AMBER=#FFB020
NEXT_PUBLIC_BRAND_GREEN=#2BC275
NEXT_PUBLIC_BRAND_ACCENT=#6B7CFF
```

### 🔌 Connect to Real Backends

To switch from Mock Mode to real backends:

1. Update `.env`:
```env
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_SSE_EVENTS=http://localhost:4002/sse/events
NEXT_PUBLIC_SSE_DECISIONS=http://localhost:4002/sse/decisions
NEXT_PUBLIC_ACTIONS_BASE=http://localhost:4002
NEXT_PUBLIC_INGESTOR_BASE=http://localhost:4001
```

2. Restart the dev server

### 🎮 Simulator

Navigate to `/simulator` to trigger different user scenarios:

- **Normal**: Standard user flow
- **Slow API**: High latency responses
- **Rate Limited**: 429 error patterns
- **Rage Clicks**: Frustrated user behavior
- **Bad Upload**: Upload failure scenarios

Settings:
- **Speed Multiplier**: 1x or 5x event speed
- **Bypass Kafka**: Direct event generation
- **Chaos Mode**: Random scenario mixing

## Demo Script

Perfect for a 3-minute demo:

**00:00-00:30** - Dashboard Overview
- Show live event feed populating
- Point out Redpanda, StackAI, Sentry, TTS badges
- Explain color-coded event types and latency dots

**00:30-01:00** - AI Decision Making
- Wait for rate-limit scenario (appears around 00:20)
- Watch Brain Pulse animation fire
- Decision card slides in with recommendation
- Sponsor toasts appear (StackAI → Intercom → TTS → Sentry)
- Risk timeline shows action pins

**01:00-01:30** - Agent Panel & Voice
- Show agent message with state indicator
- Click "Play Voice" or "Read Aloud" button
- Expand "Why" dropdown to see evidence (Saw/Think/Did)
- Click "View in Sentry" to open trace

**01:30-02:00** - Risk Timeline & Memory
- Explain color-ramped risk levels (green/amber/red)
- Point out action pins on timeline (🧠 💬 🎙️ 🪪)
- Show Memory Mini-Map pattern detection

**02:00-02:30** - Simulator Controls
- Navigate to `/simulator`
- Trigger "Rage Clicks" scenario
- Watch events flow and AI respond
- Show speed multiplier and settings

**02:30-03:00** - Technical Architecture
- Mention SSE for real-time streaming
- Explain Zustand state management
- Highlight auto-reconnection on failure
- Note accessibility features (keyboard nav, ARIA, reduced motion)

## Architecture

### State Management (Zustand)

```typescript
{
  events: RawEvent[];           // Last 200 events
  decisions: Decision[];        // Last 100 decisions
  riskSeries: RiskPoint[];      // Last 90 risk samples
  agentMessages: AgentMessage[]; // All agent interventions
  sponsorToasts: SponsorToast[]; // Ephemeral (2s auto-expire)
  simulator: SimulatorState;
  settings: Settings;
}
```

### SSE Streams

- `/api/mock/events` - Event stream (1.5s interval)
- `/api/mock/decisions` - Decision stream (5s interval)

### Component Hierarchy

```
DashboardPage
├── TopNav (status badges)
├── StatusBar (time window, session filter)
├── LiveEventFeed (virtualized list)
├── RiskTimeline + BrainPulse (overlay)
├── DecisionCard (expandable)
├── AgentPanel + VoiceButton
├── MemoryMiniMap
└── SponsorToasts (fixed position)
```

## Accessibility

✅ Full keyboard navigation (Tab, Space, Enter)
✅ ARIA live regions for decision updates
✅ Screen reader support for toasts
✅ Reduced motion mode (respects prefers-reduced-motion)
✅ High contrast colors for readability
✅ Focus indicators on all interactive elements

## Technology Stack

- **Next.js 13** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type checking
npm run typecheck

# Lint
npm run lint

# Build for production
npm run build
```

## Troubleshooting

**Events not appearing?**
- Check that NEXT_PUBLIC_MOCK_MODE=true in `.env`
- Verify SSE connection status in TopNav (Redpanda badge)
- Check browser console for errors

**SSE connection fails?**
- EventSource connections may be blocked by browser extensions
- CORS issues if connecting to external backends
- Network connectivity problems (check browser dev tools)

**Build hangs?**
- This is normal for static exports with SSE routes
- Use `npm run dev` for development
- For production, deploy to Vercel or similar platform

## Next Steps

1. Connect to real Redpanda event stream
2. Integrate actual StackAI reasoning API
3. Wire up Intercom post creation
4. Add ElevenLabs voice synthesis
5. Link Sentry trace URLs to real projects
6. Implement session replay integration
7. Add historical data persistence (Supabase)
8. Build analytics dashboard for decision effectiveness
