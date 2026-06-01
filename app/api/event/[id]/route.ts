import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id }
  })

  if (!event) {
    return NextResponse.json(
      { error: "Song not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ event })
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    await prisma.event.delete({
      where: {
        id,
      },
    })

    return Response.json({
      success: true,
      message: "Event deleted successfully",
    })

  } catch (error: any) {

    console.log(error)

    return Response.json(
      {
        success: false,
        message: error.message || "Failed to delete event",
      },
      {
        status: 500,
      }
    )

  }

}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    // unwrap params
    const { id } = await params

    // request body

    const body = await req.json()

    const {
      artistIds,
      ...rest
    } = body

    // update event
    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        ...rest
      },
    })

    return Response.json({
      success: true,
      data: updatedEvent,
      message: "Event Upadated Successfully",

    })

  } catch (error) {

    console.log(error)

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    )

  }

}