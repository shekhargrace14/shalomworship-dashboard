import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Resend } from "resend"
const resend = new Resend(
  process.env.RESEND_API_KEY
);


export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {

  try {

    const { id } =
      await params

    const body =
      await req.json()

    const {
      subject,
      message,
    } = body

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
          message:
            "Submission not found",
        },
        {
          status: 404,
        }
      )
    }

    await resend.emails.send({
      from:
        "Shalom Worship <connect@shalomworship.com>",

      to:
        submission.email!,

      subject,

      html: `
        <div>
          ${message}
        </div>
      `,
    })

    await prisma.submission.update({
      where: {
        id,
      },
      data: {
        status:
          "COMPLETED",
      },
    })

    return NextResponse.json(
      {
        success: true,
        message:
          "Reply sent successfully",
      },
      {
        status: 200,
      }
    )

  } catch (error: any) {

    console.error(
      "SEND REPLY ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          error.message,
      },
      {
        status: 500,
      }
    )

  }

}