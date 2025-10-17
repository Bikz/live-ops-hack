'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { connectSSE } from '@/lib/sse';
import { useLiveOpsStore } from '@/lib/store';
import { TopNav } from '@/components/TopNav';
import { StatusBar } from '@/components/StatusBar';
import { LiveEventFeed } from '@/components/LiveEventFeed';
import { RiskTimeline } from '@/components/RiskTimeline';
import { BrainPulse } from '@/components/BrainPulse';
import { DecisionCard } from '@/components/DecisionCard';
import { AgentPanel } from '@/components/AgentPanel';
import { MemoryMiniMap } from '@/components/MemoryMiniMap';
import { SponsorToasts } from '@/components/SponsorToasts';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const appendEvent = useLiveOpsStore((state) => state.appendEvent);
  const appendDecision = useLiveOpsStore((state) => state.appendDecision);
  const setSseConnected = useLiveOpsStore((state) => state.setSseConnected);
  const settings = useLiveOpsStore((state) => state.settings);

  useEffect(() => {
    const eventsUrl = process.env.NEXT_PUBLIC_SSE_EVENTS || '/api/mock/events';
    const decisionsUrl = process.env.NEXT_PUBLIC_SSE_DECISIONS || '/api/mock/decisions';

    setSseConnected(true);

    const disconnect = connectSSE(
      eventsUrl,
      decisionsUrl,
      (event) => {
        appendEvent(event);
      },
      (decision) => {
        appendDecision(decision);
      },
      () => {
        setSseConnected(false);
      }
    );

    return () => {
      disconnect();
      setSseConnected(false);
    };
  }, [appendEvent, appendDecision, setSseConnected]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <StatusBar />

      <main className="flex-1 p-6">
        <div className="relative mx-auto grid max-w-[1800px] gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="min-h-[400px]">
              <LiveEventFeed />
            </div>

            <div className="space-y-4">
              <DecisionCard />
              <div className="min-h-[300px]">
                <AgentPanel />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative min-h-[400px]">
              <RiskTimeline />
              <BrainPulse />
            </div>

            <div className="min-h-[300px]">
              <MemoryMiniMap />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1800px]">
          <div className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div>
              <h3 className="font-semibold">Event Simulator</h3>
              <p className="text-sm text-muted-foreground">
                Test different scenarios and see how the system responds
              </p>
            </div>

            <Link href="/simulator">
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Open Simulator
              </Button>
            </Link>
          </div>
        </div>

        {settings.mockMode && (
          <div className="mx-auto mt-4 max-w-[1800px]">
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-center">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                🧪 Running in Mock Mode - Using simulated data
              </p>
            </div>
          </div>
        )}
      </main>

      <SponsorToasts />
    </div>
  );
}
