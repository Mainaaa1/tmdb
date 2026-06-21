export type MovieSummary = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genreIds: number[];
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
};

export type MovieDetails = MovieSummary & {
  runtime: number | null;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  status: string;
  cast: CastMember[];
};

export type PagedMovies = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: MovieSummary[];
};

export type SessionUser = {
  id: string;
  username: string;
  name: string;
  email: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt: string;
};

export type AuthSession = {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
};

export type AuthDb = {
  users: AuthUser[];
  sessions: AuthSession[];
};
