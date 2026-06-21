'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/client-api';
import { cn } from '@/lib/utils';

type AppShellProps = {
  userName?: string;
  children: React.ReactNode;
};

export function AppShell({ userName, children }: AppShellProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await logout();
      router.replace('/login');
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-filamu-noise text-white">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-ink-950/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E50914] text-white shadow-glow transition group-hover:-rotate-6">
              <Image src="/favicon.svg" alt="Filamu logo" width={28} height={28} className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-lg tracking-[0.16em] text-white">
                FILAMU
              </span>
              <span className="block text-xs uppercase tracking-[0.28em] text-white/45">
                Stream-ready movie explorer
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="hidden rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Account
            </Link>
            {userName ? (
              <span className="hidden rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/80 sm:inline-flex">
                Hi, {userName}
              </span>
            ) : null}
            <Button variant="secondary" onClick={handleLogout} disabled={pending}>
              <LogOut className="h-4 w-4" />
              {pending ? 'Signing out' : 'Sign out'}
            </Button>
          </div>
        </div>
      </header>

      <main className={cn('mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8')}>{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-sm text-white/40 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-white/80">
              FILAMU — fast movie discovery with TMDB metadata, watchlist support, and rich detail pages.
            </p>
          </div>
          <div className="text-white/50">
            Data powered by TMDB
          </div>
        </div>
      </footer>
    </div>
  );
}
