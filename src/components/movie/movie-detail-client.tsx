'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Clock3, Film, Play, Plus, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CastList } from '@/components/movie/cast-list';
import { CompactMovieCard } from '@/components/movie/compact-movie-card';
import { fetchMovieDetails, fetchSimilarMovies } from '@/lib/client-api';
import type { MovieDetails } from '@/lib/types';
import { backdropSrc, formatRating, formatReleaseDate, formatRuntime, posterSrc } from '@/lib/format';

type MovieDetailClientProps = {
  movieId: string;
  initialMovie?: MovieDetails | null;
};

export function MovieDetailClient({ movieId, initialMovie }: MovieDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  const movieQuery = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    initialData: initialMovie ?? undefined,
    initialDataUpdatedAt: initialMovie ? Date.now() : undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const similarQuery = useQuery({
    queryKey: ['movie-similar', movieId],
    queryFn: () => fetchSimilarMovies(movieId),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const movie = movieQuery.data;

  useEffect(() => {
    if (typeof window === 'undefined' || !movie) return;

    const stored = localStorage.getItem('watchlist');
    const watchlist = stored ? (JSON.parse(stored) as number[]) : [];
    setIsInWatchlist(watchlist.includes(movie.id));
  }, [movie]);

  const trailerUrl = useMemo(() => {
    if (!movie) return '';
    const query = encodeURIComponent(`${movie.title} official trailer`);
    return `https://www.youtube.com/results?search_query=${query}`;
  }, [movie]);

  const toggleWatchlist = () => {
    if (typeof window === 'undefined' || !movie) return;

    const stored = localStorage.getItem('watchlist');
    const watchlist = stored ? (JSON.parse(stored) as number[]) : [];
    const updated = isInWatchlist
      ? watchlist.filter((id) => id !== movie.id)
      : Array.from(new Set([...watchlist, movie.id]));

    localStorage.setItem('watchlist', JSON.stringify(updated));
    setIsInWatchlist(!isInWatchlist);
  };

  if (movieQuery.isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-4 w-40 rounded-full bg-white/8" />
        <div className="relative h-[500px] overflow-hidden rounded-[18px] bg-white/8" />
        <div className="grid gap-5 lg:grid-cols-[100px_1fr]">
          <div className="h-[140px] w-[100px] rounded-[12px] bg-white/8" />
          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded-full bg-white/8" />
            <div className="h-4 w-1/2 rounded-full bg-white/8" />
            <div className="h-20 w-full rounded-2xl bg-white/8" />
          </div>
        </div>
      </div>
    );
  }

  if (movieQuery.isError || !movieQuery.data) {
    return (
      <Alert className="border-red-400/20 bg-red-400/10 text-red-50">
        <AlertTitle className="text-lg">Movie details are unavailable.</AlertTitle>
        <AlertDescription className="text-red-50/80">
          We couldn&apos;t fetch the TMDB details for this title. Check your API key and try again.
        </AlertDescription>
        <Button variant="secondary" className="mt-5" onClick={() => movieQuery.refetch()}>
          Try again
        </Button>
      </Alert>
    );
  }

  const poster = posterSrc(movie.posterPath, 'w780');
  const backdrop = backdropSrc(movie.backdropPath);
  const similarMovies = similarQuery.data?.results ?? [];

  return (
    <div className="space-y-5">
      <Button variant="ghost" className="w-fit gap-2 px-0 text-white/65 hover:bg-transparent hover:text-white" onClick={() => router.push(returnTo)}>
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </Button>

      <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
        <div className="relative h-[500px]">
          {backdrop ? (
            <Image src={backdrop} alt="" fill className="object-cover opacity-80" sizes="100vw" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/30 via-black to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
        </div>
      </div>

      <div className="flex gap-4 px-4 sm:px-5">
        <div className="mt-[-60px] flex-shrink-0">
          <div className="h-[140px] w-[100px] overflow-hidden rounded-[12px] border-[3px] border-black bg-black/40">
            {poster ? (
              <div className="relative h-full w-full">
                <Image src={poster} alt={movie.title} fill className="object-cover" sizes="100px" />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E50914]/35 to-black text-white/45">
                <Film className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-6">
          <p className="mb-1 text-[19px] font-medium text-white">{movie.title}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/65">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-[#E50914]" />
              {formatRating(movie.voteAverage)}
            </span>
            <span>{movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'Unknown'}</span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span>{movie.genres[0]?.name ?? 'Movie'}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              className="gap-2 rounded-full bg-white text-black hover:bg-white/90"
              onClick={() => window.open(trailerUrl, '_blank')}
              type="button"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch trailer
            </Button>
            <Button
              variant="secondary"
              className="gap-2 rounded-full"
              onClick={toggleWatchlist}
              type="button"
            >
              {isInWatchlist ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            </Button>
          </div>
        </div>
      </div>

      <p className="px-4 text-sm leading-7 text-white/70 sm:px-5">
        {movie.overview}
      </p>

      <div className="px-4 sm:px-5">
        <p className="mb-2 text-sm font-medium text-white">Cast</p>
        <CastList cast={movie.cast} />
      </div>

      <div className="px-4 sm:px-5">
        <p className="mb-2 text-sm font-medium text-white">Similar movies</p>
        <Separator className="mb-4" />

        {similarQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg border border-white/10 bg-black/35">
                <div className="h-[90px] bg-white/8" />
                <div className="p-2">
                  <div className="h-3 w-4/5 rounded-full bg-white/8" />
                </div>
              </div>
            ))}
          </div>
        ) : similarMovies.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {similarMovies.slice(0, 6).map((similarMovie) => (
              <CompactMovieCard
                key={similarMovie.id}
                movie={similarMovie}
                returnTo={`${returnTo}`}
              />
            ))}
          </div>
        ) : (
          <Card className="border-white/10 bg-black/35">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">No similar titles available</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/60">
              TMDB did not return recommendations for this movie right now.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
