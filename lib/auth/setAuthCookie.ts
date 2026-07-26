// lib/auth/setAuthCookie.ts

import { NextResponse } from 'next/server';

export function setAuthCookie(response: NextResponse, token: string) {
  const isProd = process.env.NODE_ENV === 'production';

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
