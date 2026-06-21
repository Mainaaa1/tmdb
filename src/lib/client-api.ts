import type { MovieDetails, PagedMovies, SessionUser } from '@/lib/types';

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed.' }));
    throw new Error(error.error || 'Request failed.');
  }

  return response.json() as Promise<T>;
}

export async function getSession() {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
  });
  if (response.status === 401) return null;
  return parseJson<{ user: SessionUser }>(response);
}

export async function login(username: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier: username, password }),
    credentials: 'include',
  });
  return parseJson<{ user: SessionUser }>(response);
}

export async function register(args: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    credentials: 'include',
  });
  return parseJson<{ user: SessionUser }>(response);
}

export async function changePassword(args: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    credentials: 'include',
  });
  return parseJson<{ ok: true }>(response);
}

export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  return parseJson<{ ok: true }>(response);
}

export async function fetchTrendingMovies(page: number) {
  const response = await fetch(`/api/movies/trending?page=${page}`, {
    credentials: 'include',
  });
  return parseJson<PagedMovies>(response);
}

export async function fetchSearchMovies(query: string, page: number) {
  const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`, {
    credentials: 'include',
  });
  return parseJson<PagedMovies>(response);
}

export async function fetchMovieDetails(id: string) {
  const response = await fetch(`/api/movies/${id}`, {
    credentials: 'include',
  });
  return parseJson<MovieDetails>(response);
}

export async function fetchSimilarMovies(id: string) {
  const response = await fetch(`/api/movies/${id}/similar`, {
    credentials: 'include',
  });
  return parseJson<PagedMovies>(response);
}
