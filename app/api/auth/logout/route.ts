import { getCorsHeaders } from '@/lib/cors';
import { NextResponse } from 'next/server';

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
export async function POST(req: Request) {
  const origin = req.headers.get('origin');

  const response = NextResponse.json(
    {
      success: true,
      message: 'Logged out',
    },
    {
      headers: getCorsHeaders(origin),
    },
  );

  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  return response;
}
