'use client';

import { useState } from 'react';
import { useLiveOpsStore } from '@/lib/store';
import { formatConfidence, formatRelativeTime } from '@/lib/format';
import { getRiskColor } from '@/lib/theme';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export function DecisionCard() {
  const decisions = useLiveOpsStore((state) => state.decisions);
  const [expanded, setExpanded] = useState(false);

  const latestDecision = decisions[decisions.length - 1];

  if (!latestDecision || latestDecision.state === 'OK') {
    return null;
  }

  return (
    <Card className="animate-slideInRight" role="region" aria-live="polite">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI Decision</CardTitle>
          <Badge
            style={{
              backgroundColor: getRiskColor(latestDecision.state),
              color: 'white',
            }}
          >
            {latestDecision.state} · {formatConfidence(latestDecision.confidence)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm">{latestDecision.helper_message}</p>

        {latestDecision.at && (
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(latestDecision.at)}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-1"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Why
          </Button>

          {latestDecision.sentry?.traceUrl && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => window.open(latestDecision.sentry?.traceUrl, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
              View in Sentry
            </Button>
          )}
        </div>

        {expanded && (
          <div className="space-y-2 rounded-md border bg-muted/30 p-3">
            {latestDecision.evidence && latestDecision.evidence.length > 0 ? (
              latestDecision.evidence.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <Badge variant="secondary" className="mr-2">
                    {item.startsWith('Saw:')
                      ? 'Saw'
                      : item.startsWith('Think:')
                        ? 'Think'
                        : 'Did'}
                  </Badge>
                  <span>{item.replace(/^(Saw|Think|Did):\s*/, '')}</span>
                </div>
              ))
            ) : (
              <div className="space-y-1 text-xs">
                <div>
                  <Badge variant="secondary" className="mr-2">Saw</Badge>
                  <span>Multiple error events detected</span>
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">Think</Badge>
                  <span>User experiencing friction</span>
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">Did</Badge>
                  <span>Recommended intervention</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
