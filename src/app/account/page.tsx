import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { getSessionFromCookieHeader } from '@/lib/auth';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
  const session = await getSessionFromCookieHeader(cookieHeader);

  if (!session) {
    redirect('/login');
  }

  return (
    <AppShell userName={session.user.username}>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="space-y-4">
          <div className="rounded-[18px] border border-white/10 bg-black/35 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Account</p>
            <h1 className="mt-2 font-display text-3xl text-white">Manage your profile</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              This demo uses a shared guest account. Password updates are disabled so the preset credentials remain valid.
            </p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/6 p-6 text-sm text-white/70">
            <p>
              Signed in as <span className="text-white">{session.user.username}</span> · {session.user.email}
            </p>
          </div>
        </section>

        <div className="rounded-[18px] border border-white/10 bg-black/35 p-6 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Demo lock</p>
          <h2 className="mt-2 text-xl text-white">Password changes disabled</h2>
          <p className="mt-3 leading-7 text-white/65">
            Password editing is blocked in this demo to preserve the shared guest account credentials.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
