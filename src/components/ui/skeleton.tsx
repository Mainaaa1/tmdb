import { cn } from '@/lib/utils';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white/8',
        'before:absolute before:inset-y-0 before:left-0 before:w-1/2 before:bg-gradient-to-r before:from-transparent before:via-white/14 before:to-transparent before:content-[""] before:animate-shimmer',
        className,
      )}
    />
  );
}
