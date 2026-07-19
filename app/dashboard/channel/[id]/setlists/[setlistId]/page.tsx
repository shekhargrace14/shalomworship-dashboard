'use client';
import { SetlistDelete } from '@/components/setlist/setlist-delete';
import ViewSetlistComponent from '@/components/setlist/setlist-view';
import { setlist } from '@prisma/client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {
  const params = useParams<{
    id: string;
    setlistId: string;
  }>();
  console.log(params, 'params');

  const channelId = params.id;
  const setlistId = params.setlistId;
  const [currentSetlist, setCurrentSetlist] = useState<setlist>();

  useEffect(() => {
    async function loadCurrentSetlist() {
      const res = await fetch(`/api/channel/${channelId}/setlists/${setlistId}`);

      const result = await res.json();

      if (result.success) {
        setCurrentSetlist(result.data);
      }
    }

    loadCurrentSetlist();
  }, [channelId, setlistId]);

  if (!currentSetlist) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ViewSetlistComponent channelId={channelId} setlistId={setlistId} data={currentSetlist} />
      <SetlistDelete channelId={channelId} setlistId={currentSetlist.id} setlistTitle={currentSetlist.title} />
    </div>
  );
};

export default page;
