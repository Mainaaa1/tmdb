import type { CastMember, MovieDetails, MovieSummary, PagedMovies } from '@/lib/types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error('TMDB_API_KEY is not configured.');
  }
  return key;
}

async function tmdbFetch<T>(path: string, searchParams?: Record<string, string | number | undefined>) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', getApiKey());
  url.searchParams.set('language', 'en-US');

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`TMDB request failed (${response.status}): ${message}`);
  }

  return response.json() as Promise<T>;
}

function normalizeMovie(movie: Record<string, unknown>): MovieSummary {
  return {
    id: Number(movie.id),
    title: String(movie.title || movie.name || 'Untitled'),
    overview: String(movie.overview || 'No overview available.'),
    posterPath: (movie.poster_path as string | null) ?? null,
    backdropPath: (movie.backdrop_path as string | null) ?? null,
    releaseDate: String(movie.release_date || movie.first_air_date || ''),
    voteAverage: Number(movie.vote_average || 0),
    genreIds: Array.isArray(movie.genre_ids) ? movie.genre_ids.map((genreId) => Number(genreId)) : [],
  };
}

export async function getTrendingMovies(page = 1): Promise<PagedMovies> {
  const data = await tmdbFetch<{
    page: number;
    total_pages: number;
    total_results: number;
    results: Array<Record<string, unknown>>;
  }>('/trending/movie/day', { page });

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(normalizeMovie),
  };
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<PagedMovies> {
  const data = await tmdbFetch<{
    page: number;
    total_pages: number;
    total_results: number;
    results: Array<Record<string, unknown>>;
  }>('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    include_adult: 'true',
    page,
  });

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(normalizeMovie),
  };
}

export async function searchMovies(query: string, page = 1): Promise<PagedMovies> {
  const data = await tmdbFetch<{
    page: number;
    total_pages: number;
    total_results: number;
    results: Array<Record<string, unknown>>;
  }>('/search/movie', { query, page, include_adult: 'true' });

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(normalizeMovie),
  };
}

export async function getMovieDetails(movieId: string): Promise<MovieDetails> {
  const data = await tmdbFetch<{
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    runtime: number | null;
    genres: Array<{ id: number; name: string }>;
    tagline: string;
    status: string;
    credits: { cast: Array<Record<string, unknown>> };
  }>(`/movie/${movieId}`, { append_to_response: 'credits' });

  return {
    ...normalizeMovie(data),
    runtime: data.runtime ?? null,
    genres: data.genres ?? [],
    tagline: data.tagline || 'A cinematic story worth watching.',
    status: data.status || 'Unknown',
    cast: (data.credits?.cast || []).slice(0, 8).map((member) => ({
      id: Number(member.id),
      name: String(member.name || 'Unknown'),
      character: String(member.character || 'Unknown'),
      profilePath: (member.profile_path as string | null) ?? null,
    })) as CastMember[],
  };
}

export async function getSimilarMovies(movieId: string, page = 1): Promise<PagedMovies> {
  const data = await tmdbFetch<{
    page: number;
    total_pages: number;
    total_results: number;
    results: Array<Record<string, unknown>>;
  }>(`/movie/${movieId}/recommendations`, { page });

  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(normalizeMovie),
  };
}
