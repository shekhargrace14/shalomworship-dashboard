import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit"));

  const skip = (page - 1) * limit;

  const artists = await prisma.artist.findMany({
    skip: skip,
    take: limit || undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.artist.count();

  return NextResponse.json({
    success: true,
    data: artists,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
}

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      title,
      type,
      link,
      image,
      about,
      isVerified,
      slug,
      color,
      email,
      instagram,
      youtube,
      spotify,
      appleMusic,
      amazonMusic,
      youTubeMusic,
      tidal,
      deezer,
      soundCloud,
      pandora,
    } = body

    // validation
    if (!title || !slug) {

      return NextResponse.json(
        {
          success: false,
          message: "Title and slug are required"
        },
        {
          status: 400
        }
      )

    }

    // check slug
    const existingArtist = await prisma.artist.findUnique({
      where: {
        slug
      }
    })

    if (existingArtist) {

      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists"
        },
        {
          status: 409
        }
      )

    }

    // create artist
    const artist = await prisma.artist.create({
      data: {
        title,
        type,
        link,
        image,
        about,
        isVerified,
        slug,
        color,
        email,
        instagram,
        youtube,
        spotify,
        appleMusic,
        amazonMusic,
        youTubeMusic,
        tidal,
        deezer,
        soundCloud,
        pandora,
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: "Artist created successfully",
        artist
      },
      {
        status: 201
      }
    )

  } catch (error: any) {

    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create artist"
      },
      {
        status: 500
      }
    )

  }

}