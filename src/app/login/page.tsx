import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { getSessionFromCookieHeader } from '@/lib/auth';

type LoginPageProps = {
  searchParams?: Promise<{
    from?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
  const session = await getSessionFromCookieHeader(cookieHeader);
  const resolvedSearchParams = await searchParams;

  if (session) {
    redirect(resolvedSearchParams?.from ?? '/dashboard');
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-filamu-noise" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
        <section className="flex items-center">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 backdrop-blur-sm">
              filamu
            </div>
            <div className="space-y-4">
              <h1 className="font-display text-5xl leading-tight text-white sm:text-7xl">
                Discover movies with a refined, cinematic workspace.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/65">
                A protected TMDB dashboard with fast search, responsive pagination, detailed movie
                views, and a dark premium interface built for browsing.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Protected access', 'Persistent session cookie and guarded routes.'],
                ['Real-time browse', 'Debounced search and genre-aware results.'],
                ['Movie deep dives', 'Synopsis, cast, and recommendations in one view.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[22px] border border-white/10 bg-black/35 p-5 backdrop-blur-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-[460px]">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
