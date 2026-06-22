import { prisma } from "@/lib/prisma"
import { ca } from "date-fns/locale"
import { NextResponse } from "next/server"


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization",
}

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

    const requiredFields = [
      "subject",
      "title",
      "name",
      "email",
      "message",
    ]

    const missingField =
      requiredFields.find(
        (field) =>
          !body[field]?.trim()
      )

    if (missingField) {

      return NextResponse.json(
        {
          success: false,
          message: `${missingField} is required`,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      )

    }

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
        message: "Submission created",
        data: submission,
      },
      {
        status: 201,
        headers: corsHeaders,
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
        headers:corsHeaders,
      }
    )

  }

}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin":
        "*",

      "Access-Control-Allow-Methods":
        "GET, POST, PATCH, DELETE, OPTIONS",

      "Access-Control-Allow-Headers":
        "Content-Type, Authorization",
    },
  })
}