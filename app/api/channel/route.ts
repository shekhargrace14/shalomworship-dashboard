import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getChannels } from './controller';

export async function GET(req: Request) {
  return getChannels(req);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { slug } = body;

    // validation
    if (!body.title || !body.slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title and slug are required',
        },
        {
          status: 400,
        },
      );
    }

    // check slug
    const existingChannel = await prisma.channel.findUnique({
      where: {
        slug,
      },
    });

    if (existingChannel) {
      return NextResponse.json(
        {
          success: false,
          message: 'Slug already exists',
        },
        {
          status: 409,
        },
      );
    }

    // create channel
    const channel = await prisma.channel.create({
      data: {
        createdById: body.createdById,
        title: body.title,
        type: body.type,
        website: body.link,
        avatar: body.image,
        description: body.about,
        verified: body.isVerified,
        slug: body.slug,
        color: body.color,
        email: body.email,
        instagram: body.instagram,
        youtube: body.youtube,
        spotify: body.spotify,
        appleMusic: body.appleMusic,
        amazonMusic: body.amazonMusic,
        youtubeMusic: body.youtubeMusic,
        tidal: body.tidal,
        deezer: body.deezer,
        soundCloud: body.soundCloud,
        pandora: body.pandora,
        team: {
          create: {
            userId: body.createdById,
            role: 'ADMIN',
            status: 'ACTIVE',
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Channel created successfully',
        channel,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create Channel',
      },
      {
        status: 500,
      },
    );
  }
}
