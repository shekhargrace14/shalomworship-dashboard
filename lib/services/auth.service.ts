import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function loginService(data: {
  email: string
  password: string
}) {

  const { email, password } = data

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  )

  if (!isMatch) {
    throw new Error("Invalid credentials")
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  )

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message:"User fetched successful"
  }

}

export async function signupService(data: {
  name: string
  email: string
  password: string
}) {

  const {
    name,
    email,
    password,
  } = data

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    })

  if (existingUser) {
    throw new Error(
      "User already exists"
    )
  }

  const hashedPassword =
    await bcrypt.hash(password, 10)

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

}

export async function getCurrentUserService() {
  // verify JWT
  // return user

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value
  if (!token) {
    throw new Error("Unauthorized")

  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as {
    id: string
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  })

  if (!user) {
    throw new Error(
      "User not found"
    )
  }

  return user

}