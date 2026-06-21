'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { MovieCard } from '@/components/movie/movie-card';
import { MovieSkeletonGrid } from '@/components/movie/movie-skeleton';
import { Pagination } from '@/components/movie/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { fetchMovieDetails, fetchSearchMovies, fetchTrendingMovies } from '@/lib/client-api';
import type { MovieDetails } from '@/lib/types';
import { backdropSrc, formatRating, formatReleaseDate, posterSrc } from '@/lib/format';

type DashboardClientProps = {
  initialQuery: string;
  initialPage: number;
};


export function DashboardClient({ initialQuery, initialPage }: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [isPending] = useTransition();
  const debouncedQuery = useDebouncedValue(query, 300);

  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('watchlist');
    setWatchlistIds(stored ? (JSON.parse(stored) as number[]) : []);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (query.trim()) {
      searchParams.set('q', query.trim());
    }

    if (page > 1) {
      searchParams.set('page', String(page));
    }

    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ''}`;

    router.replace(url);
  }, [pathname, query, page, router]);

  const watchlistQueries = useQueries({
    queries: watchlistIds.map((movieId) => ({
      queryKey: ['watchlist-movie', movieId],
      queryFn: () => fetchMovieDetails(String(movieId)),
      staleTime: 1000 * 60 * 10,
      enabled: movieId > 0,
    })),
  });

  const watchlistMovies = useMemo(
    () => watchlistQueries.map((query) => query.data).filter(Boolean) as MovieDetails[],
    [watchlistQueries],
  );

  const removeFromWatchlist = (movieId: number) => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('watchlist');
    const watchlist = stored ? (JSON.parse(stored) as number[]) : [];
    const updated = watchlist.filter((id) => id !== movieId);

    localStorage.setItem('watchlist', JSON.stringify(updated));
    setWatchlistIds(updated);
  };

  const movieQuery = useQuery({
    queryKey: ['movies', debouncedQuery.trim() || 'trending', page],
    queryFn: () => {
      const queryValue = debouncedQuery.trim();
      if (queryValue) return fetchSearchMovies(queryValue, page);
      return fetchTrendingMovies(page);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: (previousData) => previousData,
  });

  const featuredMovie = movieQuery.data?.results[0];
  const featuredBackdrop = backdropSrc(featuredMovie?.backdropPath ?? null);

  const filteredResults = useMemo(() => {
    if (!movieQuery.data?.results) return [];
    return movieQuery.data.results;
  }, [movieQuery.data?.results]);

  const heading = useMemo(() => {
    if (debouncedQuery.trim()) return `Search results for "${debouncedQuery.trim()}"`;
    return 'Trending now';
  }, [debouncedQuery]);

  const subtitle = debouncedQuery.trim()
    ? 'Discover titles with a quick search and cached pagination.'
    : 'Browse trending movies, jump into details instantly, and preserve your view with URL state.';

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > (movieQuery.data?.totalPages ?? 1)) return;
    setPage(nextPage);
  };

  const handleClear = () => {
    setQuery('');
    setPage(1);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search movies..."
            aria-label="Search movies"
            className="h-11 rounded-full border-white/10 bg-black/35 pl-10 text-white placeholder:text-white/35"
          />
        </div>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="secondary" onClick={() => router.refresh()} disabled={isPending}>
          Refresh
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-black/40 shadow-glow">
        <div className="relative h-[200px]">
          {featuredBackdrop ? (
            <Image src={featuredBackdrop} alt="" fill className="object-cover opacity-80" sizes="100vw" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/35 via-black to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-5 sm:p-6">
              <div className="max-w-xl space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-white">
                  Featured
                </span>
                <p className="text-xl font-medium text-white sm:text-2xl">{featuredMovie?.title ?? heading}</p>
                <p className="text-sm text-white/75">{featuredMovie ? subtitle : 'Loading featured movie...'}</p>
                {featuredMovie ? (
                  <p className="text-xs text-white/70">
                    {formatReleaseDate(featuredMovie.releaseDate)} · {formatRating(featuredMovie.voteAverage)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4 rounded-[18px] border border-white/10 bg-black/35 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Your watchlist</p>
            <p className="text-sm text-white/60">Saved titles show up here for quick access and removal.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
            {watchlistIds.length} saved
          </span>
        </div>

        {watchlistIds.length === 0 ? (
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Add movies to your watchlist from their detail pages and they will appear here.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {watchlistMovies.map((movie) => (
              <div key={movie.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/40">
                <div className="relative">
                  <Link
                    href={`/movies/${movie.id}?returnTo=${encodeURIComponent(`${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)}`}
                    className="block"
                  >
                    <div className="h-[90px] bg-gradient-to-br from-[#E50914]/30 via-black to-black">
                      {movie.posterPath ? (
                        <div className="relative h-full w-full">
                          <Image src={posterSrc(movie.posterPath)} alt={movie.title} fill className="object-cover opacity-90" sizes="180px" />
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-2xl text-white/40">🎬</span>
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-3">
                      <p className="truncate text-sm font-medium text-white">{movie.title}</p>
                      <p className="mt-1 text-xs text-white/60">{movie.releaseDate?.slice(0, 4) ?? 'Unknown'}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-black/80 px-2 py-1 text-xs text-white/80 transition hover:bg-white/10"
                    onClick={() => removeFromWatchlist(movie.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {movieQuery.isLoading ? (
        <MovieSkeletonGrid withLabel count={6} />
      ) : movieQuery.isError ? (
        <div className="rounded-[18px] border border-red-400/20 bg-red-400/10 p-5 text-red-50">
          <p className="font-medium">We couldn&apos;t load movies right now.</p>
          <p className="mt-1 text-sm text-red-50/80">
            This usually means the TMDB API key is missing, invalid, or the API is temporarily unavailable.
          </p>
          <Button variant="secondary" className="mt-4" onClick={() => movieQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResults.length ? (
              filteredResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  returnTo={`${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                />
              ))
            ) : (
              <div className="col-span-full rounded-[18px] border border-white/10 bg-black/35 p-6 text-center text-white/70">
                No movies matched your search.
              </div>
            )}
          </div>

          <Pagination
            page={movieQuery.data?.page ?? page}
            totalPages={movieQuery.data?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
