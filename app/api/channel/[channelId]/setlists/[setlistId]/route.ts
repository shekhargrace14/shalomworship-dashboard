import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{
    channelId: string;
    setlistId: string;
  }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { channelId, setlistId } = await params;

    const setlist = await prisma.setlist.findUnique({
      where: {
        id: setlistId,
        channelId,
      },
    });

    if (!setlist) {
      return NextResponse.json(
        {
          success: false,
          message: 'Setlist not found',
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Setlist fetched successfully',
        data: setlist,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch setlist',
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { channelId, setlistId } = await params;
    const body = await req.json();

    const { title, theme, description, scripture, eventAt, visibility, notes, sections } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title is required',
        },
        { status: 400 },
      );
    }

    const existingSetlist = await prisma.setlist.findFirst({
      where: {
        id: setlistId,
        channelId,
      },
    });

    if (!existingSetlist) {
      return NextResponse.json(
        {
          success: false,
          message: 'Setlist not found',
        },
        { status: 404 },
      );
    }

    await prisma.setlist.update({
      where: {
        id: setlistId,
      },
      data: {
        title: title.trim(),
        theme,
        description,
        scripture,
        eventAt: eventAt ? new Date(eventAt) : null,
        visibility,
        notes,
        sections,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Setlist updated successfully',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update setlist',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const { channelId, setlistId } = await params;

    const existingSetlist = await prisma.setlist.findFirst({
      where: {
        id: setlistId,
        channelId,
      },
    });

    if (!existingSetlist) {
      return NextResponse.json(
        {
          success: false,
          message: 'Setlist not found',
        },
        { status: 404 },
      );
    }

    await prisma.setlist.delete({
      where: {
        id: setlistId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Setlist deleted successfully',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete setlist',
      },
      { status: 500 },
    );
  }
}
