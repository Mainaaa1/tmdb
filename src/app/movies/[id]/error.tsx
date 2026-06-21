'use client';

import { Button } from '@/components/ui/button';

export default function MovieError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4">
      <div className="w-full rounded-[32px] border border-red-400/20 bg-red-400/10 p-8 text-red-50">
        <h1 className="font-display text-3xl">Movie details could not load.</h1>
        <p className="mt-2 text-sm leading-6 text-red-50/80">
          This route will recover as soon as the upstream movie data is available again.
        </p>
        <Button variant="secondary" className="mt-5" onClick={reset}>
          Retry
        </Button>
      </div>
    </div>
  );
}
