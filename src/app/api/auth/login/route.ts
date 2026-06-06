import { NextResponse } from 'next/server';

import { attachSessionCookie, createSessionToken, getMatchmakerByEmail, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = (await request.json().catch(() => ({}))) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = getMatchmakerByEmail(email);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);

  if (!passwordOk) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSessionToken(user);
  const response = NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
  attachSessionCookie(response, token);
  return response;
}