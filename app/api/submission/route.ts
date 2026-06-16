import { prisma } from "@/lib/prisma"
import { ca } from "date-fns/locale"
import { NextResponse } from "next/server"

export async function GET() {

  try {

    const submissions =
      await prisma.submission.findMany({
        orderBy: {
          createdAt: "desc"
        }
      })

    return NextResponse.json(
      {
        success: true,
        data: submissions,
        message:
          "Submissions fetched successfully",
      },
      {
        status: 200,
      }
    )

  } catch (error: any) {

    console.error(
      "GET SUBMISSIONS ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to fetch submissions",
      },
      {
        status: 500,
      }
    )

  }

}


export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json()

    const submission =
      await prisma.submission.create({
        data: {
          type: body.type,
          name: body.name,
          email: body.email,
          title: body.title,
          message: body.message,
        },
      })

    return NextResponse.json(
      {
        success: true,
        message:
          "Submission created",
        data: submission,
      },
      {
        status: 201,
      }
    )

  } catch (error: any) {

    console.error(
      "CREATE SUBMISSION ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to create submission",
      },
      {
        status: 500,
      }
    )

  }

}