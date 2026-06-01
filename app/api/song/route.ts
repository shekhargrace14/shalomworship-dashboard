import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const skip = (page - 1) * limit;

  const songs = await prisma.song.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.song.count();

  return NextResponse.json({
    success: true,
    data: songs,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
}




export async function POST(req: Request) {
  try {
    const body = await req.json()

    const song = await prisma.song.create({
      data: {
        title: body.title,
        content: body.content,
        lyrics:body.lyrics,
        slug: body.slug,

        metaDescription: body.metaDescription || "",
        keyword: body.keyword || [],

        searchVariant: body.searchVariant || [],

        view: 0,
        like: 0,

        isChords: body.isChords,
        isTranslation: body.isTranslation || false,

        language: body.language,
        version: body.version,

        key: body.key,
        bpm: body.bpm,
        tempo: body.tempo,
        time: body.time,

        image: body.image,
        video: body.video,
        videoId: body.videoId,
        audio: body.audio,
        color: body.color,

        status: body.status,
        about: body.about,
        excerpt: body.excerpt,

        searchVariantInTitle: body.searchVariantInTitle || false
      }
    })
    return NextResponse.json({
      success: true,
      song
    })

  } catch (error) {
    console.error("CREATE SONG ERROR:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to create song"
    }, {
      status: 500
    })

  }
}