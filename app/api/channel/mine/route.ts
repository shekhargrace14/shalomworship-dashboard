// app/api/channels/mine/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserService } from '@/lib/services/auth.service';
// import { getCurrentUserService } from "@/lib/auth";

export async function GET() {
  try {
    // const user = await getCurrentUserService();
    const user = await getCurrentUserService();

    const channels = await prisma.channel.findMany({
      where: {
        OR: [
          //   {
          //     createdById: user.id,
          //   },
          {
            ownerId: user.id,
          },
          //   {
          //     team: {
          //       some: {
          //         userId: user.id,
          //       },
          //     },
          //   },
        ],
      },
      include: {
        team: {
          where: {
            userId: user.id,
          },
          select: {
            role: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: channels,
      message: 'Channels retrieved successfully',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      { status: 401 },
    );
  }
}
