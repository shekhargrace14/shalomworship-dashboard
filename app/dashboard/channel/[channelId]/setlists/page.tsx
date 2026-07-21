'use client';
import CreateSetlistModal from '@/components/setlist/setlist-create';
import DataTable from '@/components/table/DataTable';
import { Button } from '@/components/ui/button';
import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';
import { useUserStore } from '@/store/useUserStore';
import { setlist } from '@prisma/client';
import { LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const page = () => {
  const [channelSetlists, setChannelSetlists] = useState<setlist[]>([]);
  const currentChannel = useCurrentChannelStore((state) => state.channel);

  useEffect(() => {
    if (!currentChannel?.id) return;
    async function loadChannelSetlists() {
      const res = await fetch(`/api/channel/${currentChannel?.id}/setlists`);
      const data = await res.json();
      setChannelSetlists(data.data);
    }
    loadChannelSetlists();
  }, [currentChannel]);

  if (!currentChannel) {
    return <LoaderCircleIcon />;
  }

  // Safe here
  const channelId = currentChannel.id;

  return (
    <>
      <div>
        setlist of {currentChannel.title} {currentChannel?.id}{' '}
      </div>
      <CreateSetlistModal channelId={channelId} />
      <DataTable data={channelSetlists} type="setlists" />
    </>
  );
};

export default page;
