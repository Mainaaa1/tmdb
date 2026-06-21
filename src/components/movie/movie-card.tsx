'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { MovieSummary } from '@/lib/types';
import { formatRating, formatReleaseDate, posterSrc } from '@/lib/format';
import { cn } from '@/lib/utils';

type MovieCardProps = {
  movie: MovieSummary;
  returnTo: string;
  className?: string;
};

export function MovieCard({ movie, returnTo, className }: MovieCardProps) {
  const poster = posterSrc(movie.posterPath);

  return (
    <Link
      href={`/movies/${movie.id}?returnTo=${encodeURIComponent(returnTo)}`}
      className={cn(
        'overflow-hidden rounded-lg border border-white/10 bg-black/35 transition hover:-translate-y-0.5 hover:border-white/20',
        className,
      )}
    >
      <div className="relative h-[140px] overflow-hidden bg-gradient-to-br from-[#E50914]/25 via-black to-black">
        {poster ? (
          <Image
            src={poster}
            alt={`${movie.title} poster`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/45">
            <span className="text-xs uppercase tracking-[0.24em]">Movie</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      </div>

      <div className="space-y-1 px-3 py-2">
        <p className="truncate text-[13px] font-medium text-white">{movie.title}</p>
        <div className="flex items-center justify-between text-[12px] text-white/55">
          <span>{formatReleaseDate(movie.releaseDate)}</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-[#E50914]" />
            {formatRating(movie.voteAverage)}
          </span>
        </div>
      </div>
    </Link>
  );
}
