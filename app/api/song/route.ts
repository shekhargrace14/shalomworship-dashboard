import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1")
    )

    const limitParam = searchParams.get("limit")

    const limit = limitParam
      ? Math.max(1, parseInt(limitParam))
      : undefined

    const songs = await prisma.song.findMany({
      skip: limit
        ? (page - 1) * limit
        : undefined,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    })

    const total = await prisma.song.count()

    return NextResponse.json(
      {
        success: true,
        data: songs,
        page,
        totalPages: limit
          ? Math.ceil(total / limit)
          : 1,

        total,
      },
      {
        status: 200,
      }
    )

  } catch (error: any) {

    console.error(
      "GET SONG ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to fetch songs",
      },
      {
        status: 500,
      }
    )

  }

}


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      view,
      like,
      createdAt,
      updatedAt,
      ...songData
    } = body

    const song = await prisma.song.create({
      data: {
        ...songData,
        status: songData.status || "DRAFT",
        view: 0,
        like: 0,
      }
    })
    return NextResponse.json(
      {
        message: "Song Created",
        success: true,
        song
      },
      {
        status: 201
      }
    )

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create song"
      },
      {
        status: 500
      })

  }
}