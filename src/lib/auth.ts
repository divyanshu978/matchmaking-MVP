import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getUsers } from './store';
import type { User } from './types';

export const SESSION_COOKIE = 'matchmaker_session';

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');

export async function verifyPassword(candidate: string, hashed: string) {
  const { compare } = await import('bcryptjs');
  return compare(candidate, hashed);
}

export async function createSessionToken(user: User) {
  return new SignJWT({ role: user.role, name: user.name, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function readSessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  return {
    userId: payload.sub ?? '',
    role: String(payload.role ?? ''),
    name: String(payload.name ?? ''),
    email: String(payload.email ?? '')
  };
}

export async function getAuthenticatedUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await readSessionToken(token);
    return session.userId ? session : null;
  } catch {
    return null;
  }
}

export function getMatchmakerByEmail(email: string) {
  return getUsers().find((user) => user.email === email) ?? null;
}

export function attachSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export async function getAuthenticatedUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await readSessionToken(token);
    return session.userId ? session : null;
  } catch {
    return null;
  }
}