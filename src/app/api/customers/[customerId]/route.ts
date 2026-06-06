import { NextResponse } from 'next/server';

import { getAuthenticatedUserFromCookies } from '@/lib/auth';
import { getCustomerById } from '@/lib/store';

type Params = { params: Promise<{ customerId: string }> };

export async function GET(_: Request, { params }: Params) {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { customerId } = await params;
  const customer = getCustomerById(customerId);

  if (!customer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ customer });
}