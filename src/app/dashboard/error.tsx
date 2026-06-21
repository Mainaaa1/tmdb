'use client';

import { Button } from '@/components/ui/button';

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4">
      <div className="w-full rounded-[32px] border border-red-400/20 bg-red-400/10 p-8 text-red-50">
        <h1 className="font-display text-3xl">The dashboard hit an unexpected error.</h1>
        <p className="mt-2 text-sm leading-6 text-red-50/80">
          You can retry the current route without losing your session.
        </p>
        <Button variant="secondary" className="mt-5" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
