import { meController } from '@/lib/controllers/auth.controller';
import { getCorsHeaders } from '@/lib/cors';
import { NextResponse } from 'next/server';

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
export function GET(req: Request) {
  return meController(req);
}
