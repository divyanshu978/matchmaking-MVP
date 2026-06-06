import { NextResponse } from 'next/server';

import { getAuthenticatedUserFromCookies } from '@/lib/auth';
import { updateNote } from '@/lib/store';

type Params = { params: Promise<{ noteId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { noteId } = await params;
  const { note } = (await request.json().catch(() => ({}))) as { note?: string };

  if (!note?.trim()) {
    return NextResponse.json({ error: 'Note is required' }, { status: 400 });
  }

  const updatedNote = updateNote(noteId, note.trim());

  if (!updatedNote) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ note: updatedNote });
}