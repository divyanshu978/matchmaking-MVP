import { NextResponse } from 'next/server';

import { getAuthenticatedUserFromCookies } from '@/lib/auth';
import { addNote, getCustomerById, getNotesByCustomerId } from '@/lib/store';

type Params = { params: Promise<{ customerId: string }> };

export async function GET(_: Request, { params }: Params) {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { customerId } = await params;
  return NextResponse.json({ notes: getNotesByCustomerId(customerId) });
}

export async function POST(request: Request, { params }: Params) {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { customerId } = await params;
  const customer = getCustomerById(customerId);

  if (!customer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { note } = (await request.json().catch(() => ({}))) as { note?: string };

  if (!note?.trim()) {
    return NextResponse.json({ error: 'Note is required' }, { status: 400 });
  }

  const createdNote = addNote(customerId, note.trim());
  return NextResponse.json({ note: createdNote }, { status: 201 });
}