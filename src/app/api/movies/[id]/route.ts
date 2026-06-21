import { NextResponse } from 'next/server';
import { getMovieDetails } from '@/lib/tmdb';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const data = await getMovieDetails(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load movie details.' },
      { status: 500 },
    );
  }
}
