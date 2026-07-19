import { connectDB } from '../db';
// import { getCurrentUser, loginService, signupService } from "../services/auth.service"
import { NextResponse } from 'next/server';
import { getCurrentUserService, loginService, signupService } from '../services/auth.service';
import { getCorsHeaders } from '../cors';

export async function loginController(req: Request) {
  const origin = req.headers.get('origin');
  await connectDB();
  try {
    const body = await req.json();

    const result = await loginService(body);

    const response = NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.user,
      },
      {
        status: 200,
        headers: getCorsHeaders(origin),
      },
    );

    // response.cookies.set('token', result.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'none',
    //   path: '/',
    //   maxAge: 60 * 60 * 24,
    // });

    const isProd = process.env.NODE_ENV === 'production';

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: isProd ? '.shalomworship.com' : undefined,
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,

        message: error.message || 'Something went wrong',
      },
      {
        status: 401,
        headers: getCorsHeaders(origin), // ✅ add this
      },
    );
  }
}

export async function signupController(req: Request) {
  const origin = req.headers.get('origin');

  try {
    await connectDB();

    const body = await req.json();

    // const user = await signupService(body);
    const result = await signupService(body);

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        message: result.message,
      },
      {
        status: 200,
        headers: getCorsHeaders(origin),
      },
    );

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
        headers: getCorsHeaders(origin), // ✅ add this
      },
    );
  }
}

export async function meController(req: Request) {
  const origin = req.headers.get('origin');

  try {
    const user = await getCurrentUserService();

    return NextResponse.json(
      {
        success: true,
        user,
        message: 'User retrieved successfully',
      },
      {
        headers: getCorsHeaders(origin),
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 401,
        headers: getCorsHeaders(origin), // ✅ add this
      },
    );
  }
}
