'use client';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { Role } from '@prisma/client';
import { Balloon } from 'lucide-react';
import { useChannelsStore } from '@/store/useChannelsStore';
import { CardDemo } from './card/card';

export function ChannelCards() {
  const data = useChannelsStore((state) => state.channels);

  return (
    <div className="grid grid-cols-1  gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      {data?.map((d: any, index) => {
        return (
          <Link href={`/dashboard/channel/${d.id}`} key={index}>
            <CardDemo data={d} />
          </Link>
        );
      })}
    </div>
  );
}
