import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['https://staging.shalomworship.pages.dev','https://staging.shalomworship.com', 'https://www.shalomworship.com', 'https://dashboard.shalomworship.com', 'http://localhost:3000', 'http://localhost:3001'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //
  // CORS for API routes
  //
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');

    const response = request.method === 'OPTIONS' ? new NextResponse(null, { status: 204 }) : NextResponse.next();

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  }

  //
  // Auth protection
  //
  const token = request.cookies.get('token')?.value;

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/auth/login'],
};






// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(req: NextRequest) {
//   const token = req.cookies.get('token')?.value;
//   const { pathname } = req.nextUrl;

//   if (!token && pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/auth/login', req.url));
//   }

//   if (token && pathname.startsWith('/auth/login')) {
//     return NextResponse.redirect(new URL('/dashboard', req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/auth/login'],
// };
