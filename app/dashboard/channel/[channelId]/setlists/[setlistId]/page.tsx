'use client';
import SetlistEditor from '@/components/setlist/setlist-editor';
import { Metadata } from '@/types/setlist';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {
  const params = useParams<{
    channelId: string;
    setlistId: string;
  }>();

  const channelId = params.channelId;
  const setlistId = params.setlistId;
  const [currentSetlist, setCurrentSetlist] = useState<Metadata>();

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
      <SetlistEditor data={currentSetlist} />
    </div>
  );
};

export default page;
