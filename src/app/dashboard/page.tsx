import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { getSessionFromCookieHeader } from '@/lib/auth';

type DashboardPageProps = {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
  const session = await getSessionFromCookieHeader(cookieHeader);

  if (!session) {
    redirect('/login');
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const initialQuery = resolvedSearchParams.q ?? '';
  const initialPage = Number(resolvedSearchParams.page ?? '1');

  return (
    <AppShell userName={session.user.name}>
      <DashboardClient
        initialQuery={initialQuery}
        initialPage={Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1}
      />
    </AppShell>
  );
}
