import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { success } from "zod"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log("ID:", id)

    const song = await prisma.song.findUnique({
      where: {
        id,
      },
      include: {
        genre: true,
        category: true,
        scripture: true,
        album: true,
        credits: true,
        artist: true,
      }

    })

    console.log("SONG:", song)

    return NextResponse.json({
      song,
      success: true
    })
  } catch (error) {
    console.error("FULL ERROR:", error)
    throw error
  }
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
      credits,

      id: _id,
      createdAt,
      updatedAt,
      view,
      like,

      ...allowedData
    } = body

    // Update normal song fields
    const song = await prisma.song.update({
      where: {
        id,
      },
      data: allowedData,
    })

    // Update credits relation
    if (credits) {
      await prisma.songCredit.deleteMany({
        where: {
          songId: id,
        },
      })

      if (credits.length > 0) {
        await prisma.songCredit.createMany({
          data: credits.map((credit: any) => ({
            songId: id,
            artistId: credit.artistId,
            department: credit.department,
            role: credit.role,
          })),
        })
      }
    }

    // Return updated song with credits
    const updatedSong = await prisma.song.findUnique({
      where: {
        id,
      },
      include: {
        credits: {
          include: {
            artist: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Changes Saved",
        song: updatedSong,
      },
      {
        status: 200,
      }
    )
  } catch (error: any) {
    console.error("PATCH SONG ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to Save Changes",
      },
      {
        status: 500,
      }
    )
  }
}