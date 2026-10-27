'use client';
import { CardProfile } from '@/components/card/card-profile';
import DataTable from '@/components/table/DataTable';
import { Button } from '@/components/ui/button';
import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page() {
  const params = useParams();
  const channelId = params.channelId;

  const currentChannel = useCurrentChannelStore((state) => state.channel);
  const songs = currentChannel?.songs;
  const songCredits = currentChannel?.songCredits;

  const data = songCredits?.map((credit: any) => credit.song);
  if (!currentChannel) {
    return;
  }
  return (
    <div className="flex gap-4 flex-col">
      {/* <ChannelForm initialData={currentChannel} isEdit/> */}
      <CardProfile data={currentChannel} />
      {/* <ChannelDelete channelId={currentChannel?.id} channelTitle={currentChannel?.title} /> */}
      <div className="flex justify-end">
        <Link href={`/dashboard/channel/${currentChannel?.id}/songs/create`}>
          <Button variant="default">
            {' '}
            <Plus />
            Add Song
          </Button>
        </Link>
      </div>
      <h3>Songs You Posted</h3>
      <DataTable data={songs ?? []} type="song" />
      Song You have worked in
      <DataTable data={data ?? []} type="song" />
    </div>
  );
}
