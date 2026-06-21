import { Skeleton } from '@/components/ui/skeleton';

type MovieSkeletonGridProps = {
  withLabel?: boolean;
  count?: number;
};

export function MovieSkeletonGrid({ withLabel = true, count = 6 }: MovieSkeletonGridProps) {
  return (
    <div className="space-y-4">
      {withLabel ? (
        <div className="flex items-center gap-2 text-sm text-white/55">
          <Skeleton className="h-4 w-4 rounded-full" />
          <span>Loading movies...</span>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`movie-skeleton-${index}`}
            className="overflow-hidden rounded-lg border border-white/10 bg-black/35"
          >
            <Skeleton className="h-[140px] rounded-none" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
