import { NextResponse } from 'next/server';
import { getMoviesByGenre } from '@/lib/tmdb';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const genreId = Number(url.searchParams.get('genreId') ?? '0');
  const page = Number(url.searchParams.get('page') ?? '1');

  if (!Number.isFinite(genreId) || genreId <= 0) {
    return NextResponse.json({ error: 'genreId is required.' }, { status: 400 });
  }

  try {
    const data = await getMoviesByGenre(genreId, Number.isFinite(page) && page > 0 ? page : 1);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load genre movies.' },
      { status: 500 },
    );
  }
}
