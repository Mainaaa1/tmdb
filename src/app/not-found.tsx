import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-[32px] border border-white/10 bg-white/6 p-8 text-center">
        <h1 className="font-display text-4xl text-white">Page not found</h1>
        <p className="mt-3 text-white/65">
          The movie, route, or search state you requested does not exist.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-300 px-4 py-2 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-gold-200"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
