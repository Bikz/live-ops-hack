'use client';

import { useLiveOpsStore } from '@/lib/store';
import { theme } from '@/lib/theme';

export function SponsorToasts() {
  const toasts = useLiveOpsStore((state) => state.sponsorToasts);

  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slideInFromTop flex items-center gap-2 rounded-lg border bg-card px-4 py-2 shadow-lg"
        >
          <span
            className="text-lg"
            style={{ color: theme.sponsors[toast.icon].color }}
          >
            {theme.sponsors[toast.icon].icon}
          </span>
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
