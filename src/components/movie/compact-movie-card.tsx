'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MovieSummary } from '@/lib/types';
import { posterSrc } from '@/lib/format';
import { cn } from '@/lib/utils';

type CompactMovieCardProps = {
  movie: MovieSummary;
  returnTo: string;
  className?: string;
};

export function CompactMovieCard({ movie, returnTo, className }: CompactMovieCardProps) {
  const poster = posterSrc(movie.posterPath);

  return (
    <Link
      href={`/movies/${movie.id}?returnTo=${encodeURIComponent(returnTo)}`}
      className={cn(
        'overflow-hidden rounded-lg border border-white/10 bg-black/40 transition hover:-translate-y-0.5 hover:border-white/20',
        className,
      )}
    >
      <div className="h-[90px] bg-gradient-to-br from-[#E50914]/30 via-black to-black">
        {poster ? (
          <div className="relative h-full w-full">
            <Image src={poster} alt={movie.title} fill className="object-cover opacity-90" sizes="180px" />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-2xl text-white/40">🎬</span>
          </div>
        )}
      </div>
      <div className="px-2 py-1.5">
        <p className="truncate text-[12px] text-white">{movie.title}</p>
      </div>
    </Link>
  );
}
