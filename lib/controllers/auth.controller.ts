import { connectDB } from '../db';
// import { getCurrentUser, loginService, signupService } from "../services/auth.service"
import { NextResponse } from 'next/server';
import { getCurrentUserService, loginService, signupService } from '../services/auth.service';

export async function loginController(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    const result = await loginService(body);

    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
    });

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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
        status: 400,
      },
    );
  }
}

export async function signupController(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const user = await signupService(body);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }
}

export async function meController() {
  try {
    const user = await getCurrentUserService();

    return NextResponse.json(
      {
        success: true,
        user,
        message: 'User fetched Successful',
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error('GET USER ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 401,
      },
    );
  }
}
