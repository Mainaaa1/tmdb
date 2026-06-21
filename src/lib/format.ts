export function formatReleaseDate(value: string) {
  if (!value) return 'Release date unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRuntime(minutes: number | null) {
  if (!minutes) return 'Runtime unavailable';

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${remainder}m`;
}

export function formatRating(value: number) {
  return value ? value.toFixed(1) : '0.0';
}

export function posterSrc(path: string | null, size: 'w342' | 'w780' = 'w342') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export function backdropSrc(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w1280${path}` : null;
}
