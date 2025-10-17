'use client';

import { useEffect, useState } from 'react';
import { useLiveOpsStore } from '@/lib/store';
import { Brain } from 'lucide-react';

export function BrainPulse() {
  const decisions = useLiveOpsStore((state) => state.decisions);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (decisions.length > 0) {
      setPulsing(true);
      const timeout = setTimeout(() => setPulsing(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [decisions.length]);

  return (
    <div className="absolute right-8 top-8 z-10">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-8 w-8 text-primary" />
        </div>

        {pulsing && (
          <div
            className="animate-pulse-ring absolute inset-0 rounded-full bg-primary"
            style={{ opacity: 0.5 }}
          />
        )}
      </div>
    </div>
  );
}
