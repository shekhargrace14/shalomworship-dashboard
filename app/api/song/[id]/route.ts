import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const song = await prisma.song.findUnique({
    where: { id }
  })

  if (!song) {
    return NextResponse.json(
      { error: "Song not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ song })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.song.delete({
    where: { id }
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    const body = await req.json()
    const {
      id: _id,
      createdAt,
      updatedAt,
      view,
      like,
      ...allowedData
    } = body

    const song = await prisma.song.update({
      where: {
        id,
      },
      data: allowedData,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Changes Saved",
        song,
      },
      {
        status: 200,
      }
    )

  } catch (error: any) {

    console.error("Error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to Save Changes",
      },
      {
        status: 500,
      }
    )

  }

}