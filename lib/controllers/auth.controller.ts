import { connectDB } from '../db';
// import { getCurrentUser, loginService, signupService } from "../services/auth.service"
import { NextResponse } from 'next/server';
import { getCurrentUserService, loginService, signupService } from '../services/auth.service';
import { setAuthCookie } from '../auth/setAuthCookie';

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
      },
    );

    setAuthCookie(response, result.token); // one cookie setup for login signup.

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,

        message: error.message || 'Something went wrong',
      },
      {
        status: 401,
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
      },
    );

    setAuthCookie(response, result.token); // one cookie setup for login signup.

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
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
        data: user,
        message: 'User retrieved successfully',
      },
      {
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
      },
    );
  }
}
