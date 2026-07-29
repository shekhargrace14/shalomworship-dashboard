import { prisma } from '@/lib/prisma';
import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';
import { googleLoginService } from './service';
import { setAuthCookie } from '@/lib/auth/setAuthCookie';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid Google token',
        },
        {
          status: 401,
        },
      );
    }

    const result = await googleLoginService({
      sub: payload.sub!,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      email_verified: payload.email_verified,
    });
    const response = NextResponse.json({
      success: true,
      data: result.user,
      message: result.message,
    });

    setAuthCookie(response, result.token);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, message: 'Invalid Google token' }, { status: 401 });
  }
}
