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

    const setlist = await prisma.setlist.findFirst({
      where: {
        id: setlistId,
        channelId,
      },
      include: {
        // items: {
        //   include: {
        //     song: true,
        //   },
        //   orderBy: {
        //     order: "asc",
        //   },
        // },
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

    // Validate Title
    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title is required',
        },
        { status: 400 },
      );
    }

    // Ensure setlist belongs to this channel
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

    const updatedSetlist = await prisma.setlist.update({
      where: {
        id: setlistId,
      },
      data: {
        title: title.trim(),
        theme,
        description,
        scripture,
        eventAt,
        visibility,
        notes,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Setlist updated successfully',
        data: updatedSetlist,
      },
      { status: 200 },
    );
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

    // Verify the setlist belongs to the channel
    const setlist = await prisma.setlist.findFirst({
      where: {
        id: setlistId,
        channelId,
      },
      select: {
        id: true,
      },
    });

    if (!setlist) {
      return NextResponse.json(
        {
          success: false,
          message: 'Setlist not found.',
        },
        {
          status: 404,
        },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.setlistItem.deleteMany({
        where: {
          section: {
            setlistId,
          },
        },
      });

      await tx.setlistSection.deleteMany({
        where: {
          setlistId,
        },
      });

      await tx.setlist.delete({
        where: {
          id: setlistId,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Setlist deleted successfully.',
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
        message: 'Failed to delete setlist.',
      },
      {
        status: 500,
      },
    );
  }
}
