import { AppShell } from '@/components/layout/app-shell';
import { MovieSkeletonGrid } from '@/components/movie/movie-skeleton';

export default function Loading() {
  return (
    <AppShell>
      <div className="space-y-5">
        <MovieSkeletonGrid withLabel count={6} />
      </div>
    </AppShell>
  );
}
