import { NextResponse } from 'next/server';
import getSingleChannelService from './service';

export default async function getSingleChannelController(req: Request, { params }: { params: Promise<{ channelId: string }> }) {
  try {
    const { channelId } = await params;

    const result = await getSingleChannelService(channelId);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Channel not found',
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Channel found',
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'server issue',
      },
      {
        status: 500,
      },
    );
  }
}
