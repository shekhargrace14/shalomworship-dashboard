import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface Props {
  params: Promise<{
    setlistId: string;
  }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { setlistId } = await params;

    const setlist = await prisma.setlist.findUnique({
      where: {
        id: setlistId,
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
