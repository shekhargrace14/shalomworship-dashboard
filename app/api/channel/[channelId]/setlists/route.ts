import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { success } from 'zod';
interface Props {
  params: Promise<{
    channelId: string;
    // setlistId: string;
  }>;
}
export async function GET(req: Request, { params }: Props) {
  try {
    const { channelId } = await params;
    const setlist = await prisma.setlist.findMany({
      where: {
        channelId: channelId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: setlist,
        message: 'Setlist featched Sucessfuly ',
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.log(error, 'Error to fetch setlist');
    return NextResponse.json(
      {
        success: false,
        message: 'fail to fetch setlist',
      },
      {
        status: 400,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, eventAt, channelId } = body;

    // Validate Title
    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title is required',
        },
        {
          status: 400,
        },
      );
    }

    const setlist = await prisma.setlist.create({
      data: {
        title,
        eventAt,
        channelId,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Setlist created Successfuly ',
        data: setlist,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.log(error, 'Error to fetch setlist');
    return NextResponse.json(
      {
        success: false,
        message: 'failed to Create setlist',
      },
      {
        status: 400,
      },
    );
  }
}
