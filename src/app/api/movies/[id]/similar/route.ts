import { NextResponse } from 'next/server';
import { getSimilarMovies } from '@/lib/tmdb';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? '1');

  try {
    const data = await getSimilarMovies(id, Number.isFinite(page) && page > 0 ? page : 1);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load similar movies.' },
      { status: 500 },
    );
  }
}
