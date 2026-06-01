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