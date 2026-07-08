import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        channels: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: true,
        message: 'User fetched successfully',
        data: user,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error('GET USER ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user',
      },
      {
        status: 500,
      },
    );
  }
}
