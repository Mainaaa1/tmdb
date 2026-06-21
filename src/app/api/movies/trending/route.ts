import { NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1');

  try {
    const data = await getTrendingMovies(Number.isFinite(page) && page > 0 ? page : 1);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load trending movies.' },
      { status: 500 },
    );
  }
}
