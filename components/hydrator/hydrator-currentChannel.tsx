'use client';

import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';
import { ChannelWithDetails, ChannelWithSongs } from '@/types';
import { useEffect } from 'react';

export default function CurrentChannelHydrator({ channel, children }: { channel: ChannelWithDetails | null; children: React.ReactNode }) {
  const setCurrentChannel = useCurrentChannelStore((u) => u.setCurrentChannel);

  useEffect(() => {
    setCurrentChannel(channel);
  }, [channel, setCurrentChannel]);

  return <>{children}</>;
}
