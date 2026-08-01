import { NextResponse } from 'next/server';

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 204,
  });
}
export async function POST(req: Request) {
  const response = NextResponse.json(
    {
      success: true,
      message: 'Logged out',
    },
    {},
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
