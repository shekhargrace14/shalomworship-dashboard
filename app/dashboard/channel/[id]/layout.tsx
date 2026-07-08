import { ReactNode } from 'react';

import ChannelHeader from '@/components/channel/ChannelHeader';
import getSingleChannelService from '@/app/api/channel/[id]/service';
import CurrentChannelHydrator from '@/components/hydrator/hydrator-currentChannel';

interface Props {
  children: ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export default async function ChannelLayout({ children, params }: Props) {
  const { id } = await params;
  const currentChannel = await getSingleChannelService(id);

  return (
    <div className="flex h-full">
      {/* Content */}
      <section className="flex min-w-0 flex-1 flex-col">
        <ChannelHeader channelId={id} />

        <div className="flex-1 overflow-y-auto p-6">
          <CurrentChannelHydrator channel={currentChannel}>{children}</CurrentChannelHydrator>
        </div>
      </section>
    </div>
  );
}
