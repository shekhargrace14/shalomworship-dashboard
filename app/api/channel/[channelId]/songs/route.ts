import { createChannelSongController, getChannelSongsController } from './controller';

export async function GET(req: Request, context: { params: Promise<{ channelId: string }> }) {
  return getChannelSongsController(context);
}

export async function POST(req: Request) {
  return await createChannelSongController(req);
}
