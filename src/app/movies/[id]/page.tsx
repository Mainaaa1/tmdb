import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { MovieDetailClient } from '@/components/movie/movie-detail-client';
import { getSessionFromCookieHeader } from '@/lib/auth';
import { getMovieDetails } from '@/lib/tmdb';

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
  const session = await getSessionFromCookieHeader(cookieHeader);

  if (!session) {
    redirect('/login');
  }

  const { id } = await params;
  let initialMovie = null;

  try {
    initialMovie = await getMovieDetails(id);
  } catch {
    initialMovie = null;
  }

  return (
    <AppShell userName={session.user.name}>
      <MovieDetailClient movieId={id} initialMovie={initialMovie} />
    </AppShell>
  );
}
