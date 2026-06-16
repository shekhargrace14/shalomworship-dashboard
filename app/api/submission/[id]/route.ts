import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    const submission =
      await prisma.submission.findUnique({
        where: {
          id,
        },
      })

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission not found",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Submission fetched successfully",
        data: submission,
      },
      {
        status: 200,
      }
    )

  } catch (error: any) {

    console.error(
      "GET SUBMISSION ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to fetch submission",
      },
      {
        status: 500,
      }
    )

  }

}