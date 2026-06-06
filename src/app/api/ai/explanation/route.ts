import { NextResponse } from 'next/server';

import { generateAiCopy } from '@/lib/ai';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt, fallback } = (await request.json().catch(() => ({}))) as { prompt?: string; fallback?: string };

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const text = await generateAiCopy(prompt, fallback ?? 'Compatibility summary unavailable.');
  return NextResponse.json({ text });
}