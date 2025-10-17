'use client';

import { useState } from 'react';
import { useLiveOpsStore } from '@/lib/store';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Play, Square, Zap, TrendingDown, AlertTriangle, Upload, MousePointer } from 'lucide-react';

const scenarios = [
  { id: 'normal', name: 'Normal', icon: Play, description: 'Standard user flow' },
  { id: 'slow_api', name: 'Slow API', icon: TrendingDown, description: 'High latency responses' },
  { id: 'rate_limit', name: 'Rate Limited', icon: AlertTriangle, description: '429 errors' },
  { id: 'rage_click', name: 'Rage Clicks', icon: MousePointer, description: 'Frustrated user' },
  { id: 'bad_upload', name: 'Bad Upload', icon: Upload, description: 'Upload failures' },
];

export function SimulatorControls() {
  const simulator = useLiveOpsStore((state) => state.simulator);
  const setSimulatorState = useLiveOpsStore((state) => state.setSimulatorState);
  const [loading, setLoading] = useState(false);

  const handleScenario = async (scenarioId: string) => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_INGESTOR_BASE;
      await fetch(`${baseUrl}/scenario/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioId }),
      });

      setSimulatorState({
        running: true,
        scenario: scenarioId,
        sessionId: `sess_${Date.now()}`,
      });
    } catch (error) {
      console.error('Failed to start scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_INGESTOR_BASE;
      await fetch(`${baseUrl}/scenario/stop`, {
        method: 'POST',
      });

      setSimulatorState({
        running: false,
        scenario: undefined,
      });
    } catch (error) {
      console.error('Failed to stop scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Scenario Controls</CardTitle>
            {simulator.running && (
              <Badge variant="default" className="gap-1">
                <Zap className="h-3 w-3" />
                Running: {simulator.scenario}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <Button
                  key={scenario.id}
                  variant={simulator.scenario === scenario.id ? 'default' : 'outline'}
                  className="h-auto flex-col items-start gap-2 p-4"
                  onClick={() => handleScenario(scenario.id)}
                  disabled={loading || simulator.running}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{scenario.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{scenario.description}</span>
                </Button>
              );
            })}
          </div>

          {simulator.running && (
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleStop}
              disabled={loading}
            >
              <Square className="h-4 w-4" />
              Stop Simulation
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Speed Multiplier</Label>
              <p className="text-xs text-muted-foreground">Current: {simulator.speed}x</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={simulator.speed === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSimulatorState({ speed: 1 })}
              >
                1x
              </Button>
              <Button
                variant={simulator.speed === 5 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSimulatorState({ speed: 5 })}
              >
                5x
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bypass Kafka</Label>
              <p className="text-xs text-muted-foreground">Direct event generation</p>
            </div>
            <Switch
              checked={simulator.bypassKafka}
              onCheckedChange={(checked) => setSimulatorState({ bypassKafka: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
