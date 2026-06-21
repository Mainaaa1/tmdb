import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionFromCookieHeader } from '@/lib/auth';

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
  const session = await getSessionFromCookieHeader(cookieHeader);
  redirect(session ? '/dashboard' : '/login');
}
