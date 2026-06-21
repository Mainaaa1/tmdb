import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1');
  const query = url.searchParams.get('query') ?? '';

  if (!query.trim()) {
    return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
  }

  try {
    const data = await searchMovies(query.trim(), Number.isFinite(page) && page > 0 ? page : 1);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to search movies.' },
      { status: 500 },
    );
  }
}
