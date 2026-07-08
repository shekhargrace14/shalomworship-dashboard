import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type CategoryInput = {
  categoryId: string;
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: songId } = await params;

    const body = await request.json();

    const categories = body.categories as CategoryInput[];

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Categories must be an array',
        },
        { status: 400 },
      );
    }

    const song = await prisma.song.findUnique({
      where: { id: songId },
      select: { id: true },
    });

    if (!song) {
      return NextResponse.json(
        {
          success: false,
          message: 'Song not found',
        },
        { status: 404 },
      );
    }

    await prisma.songCategory.deleteMany({
      where: { songId },
    });

    if (categories.length > 0) {
      await prisma.songCategory.createMany({
        data: categories.map((item) => ({
          songId,
          categoryId: item.categoryId,
        })),
      });
    }

    const savedCategories = await prisma.songCategory.findMany({
      where: { songId },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: savedCategories,
        message: 'Categories saved successfully',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('SAVE SONG CATEGORIES ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to save categories',
      },
      { status: 500 },
    );
  }
}
