import { redirect } from 'next/navigation';

import { getAuthenticatedUserFromCookies } from '@/lib/auth';

export default async function HomePage() {
  const session = await getAuthenticatedUserFromCookies();
  redirect(session ? '/dashboard' : '/login');
}
