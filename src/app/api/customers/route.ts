import { NextResponse } from 'next/server';

import { getAuthenticatedUserFromCookies } from '@/lib/auth';
import { getCustomers } from '@/lib/store';

export async function GET() {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ customers: getCustomers() });
}