'use client';

import Link from 'next/link';
import { Bell, ChevronDown, Plus, Search, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChannelsStore } from '@/store/useChannelsStore';
import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { SidebarHeader } from '../ui/sidebar';

interface ChannelHeaderProps {
  channelId: string;
}

export default function ChannelHeader({ channelId }: ChannelHeaderProps) {
  const currentChannel = useCurrentChannelStore((state) => state.channel);

  const channels = useChannelsStore((state) => state.channels);
  const router = useRouter();
  // console.log(channels, "channel,,,,")
  useEffect(() => {
    // console.log("Store channels:", channels);
  }, [channels]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`${currentChannel?.avatar}`} />
          <AvatarFallback>SW</AvatarFallback>
        </Avatar>
        {/* <SidebarHeader>
          <TeamSwitcher
            teams={channels}
            currentChannel={currentChannel}
          />
        </SidebarHeader> */}
        kkjkj
        <div className="">
          <h1 className="text-lg font-semibold">
            {currentChannel?.title}
            {/* Shalom Worship Delhi */}
          </h1>
          <div className="flex gap-2">
            {/* <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"> */}
            Switch Channel
            {/* <ChevronDown className="h-4 w-4" /> */}
            <Select
              onValueChange={(value) => {
                router.push(`/dashboard/channel/${value}`);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={currentChannel?.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {channels?.map((c) => (
                    <SelectItem value={c.id} key={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* </button> */}
          </div>
        </div>
      </div>

      <div className="hidden w-full max-w-md px-10 lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input placeholder="Search songs, artists, events..." className="pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>

        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>

        <Link href={`/channels/${channelId}/settings`}>
          <Button size="icon" variant="ghost">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
