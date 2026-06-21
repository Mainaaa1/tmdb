import { AppShell } from '@/components/layout/app-shell';

export default function Loading() {
  return (
    <AppShell>
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 text-white/65">
        Loading movie details...
      </div>
    </AppShell>
  );
}
