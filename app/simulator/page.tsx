'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimulatorControls } from '@/components/SimulatorControls';

export default function SimulatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Event Simulator</h1>
          <p className="text-muted-foreground">
            Trigger different user scenarios to test the LiveOps Agent system
          </p>
        </div>

        <SimulatorControls />
      </div>
    </div>
  );
}
