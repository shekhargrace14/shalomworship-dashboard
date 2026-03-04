import { connectDB } from "../db"
import { loginService, signupService } from "../services/auth.service"
import { NextResponse } from "next/server"

export async function loginController(req: Request) {

  await connectDB()

  const body = await req.json()

  const token = await loginService(body)

  const response = NextResponse.json({
    success: true
  })

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24
  })

  return response
}

export async function signupController(req: Request) {

  try {

    await connectDB()

    const body = await req.json()

    const user = await signupService(body)

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error:any) {

    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 400 })

  }

}