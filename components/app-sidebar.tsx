'use client';

import {
  IconArrowAutofitRight,
  IconCalendar,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDashboardOff,
  IconDatabase,
  IconDisc,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconForms,
  IconHelp,
  IconInnerShadowTop,
  IconLayoutDashboard,
  IconList,
  IconListDetails,
  IconMicrophone,
  IconMusic,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { LayoutDashboard, Music4, Mic2, Disc3, Calendar, Users, BarChart3, Settings, Frame, PieChart, Map, ArrowBigRight } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { useUserStore } from '@/store/useUserStore';
import { useEffect, useState } from 'react';
import { channel, Role, song } from '@prisma/client';
import { getChannelSidebar } from '@/config/navigation/channel';
import { SidebarItem } from '@/types/sidebar';
// import { channel } from "diagnostics_channel"
import { NavChannel } from './nav-channel';
import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';
import { useChannelsStore } from '@/store/useChannelsStore';
import NashvilleHelpPopup from './NashvilleHelpPopup';
import { prisma } from '@/lib/prisma';

interface SidebarProps {
  items: SidebarItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore<any>((state) => state.user);

  const channels = useChannelsStore((state) => state.channels);

  const currentChannel = useCurrentChannelStore<channel | null>((state) => state.channel);
  const channelId = currentChannel?.id;
  const [songs, setSongs] = useState<song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch('/api/song');
      const data = await res.json();
      setSongs(data.data);
    };
    fetchSongs();
  }, []);

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: IconDashboard,
        isActive: false,
        id: '01',
      },
      {
        title: 'Song',
        url: '/dashboard/song',
        icon: IconChartBar,
        roles: [Role.SUPER_ADMIN],
        isActive: false,
        id: '04',
        items: [
          {
            title: 'Go To All Songs',
            url: `/dashboard/song`,
            // icon: IconArrowAutofitRight,
            id: '',
          },
          ...songs?.map((c) => {
            return {
              title: c.title,
              url: `/dashboard/song/${c.id}`,
              id: c.id,
            };
          }),
        ],
      },
      {
        title: 'Submission',
        url: '/submission',
        icon: IconDashboard,
        isActive: false,
        id: '02',
        roles: [Role.SUPER_ADMIN],
        items: [
          {
            title: 'All Submission',
            url: `/dashboard/submission`,
            id: 'all-submissions',
          },
        ],
      },
      {
        title: 'Channel',
        url: '/dashboard/channel',
        icon: IconChartBar,
        isActive: false,
        id: '03',
        items: [
          {
            title: 'All Channels',
            url: `/dashboard/channel`,
            id: '',
          },
          ...channels?.map((c) => {
            return {
              title: c.title,
              url: `/dashboard/channel/${c.id}`,
              id: c.id,
            };
          }),
        ],
      },
    ],
    navClouds: [
      {
        title: 'Capture',
        icon: IconCamera,
        isActive: true,
        url: '#',
        items: [
          {
            title: 'Active Proposals',
            url: '#',
          },
          {
            title: 'Archived',
            url: '#',
          },
        ],
      },
      {
        title: 'Proposal',
        icon: IconFileDescription,
        url: '#',
        items: [
          {
            title: 'Active Proposals',
            url: '#',
          },
          {
            title: 'Archived',
            url: '#',
          },
        ],
      },
      {
        title: 'Prompts',
        icon: IconFileAi,
        url: '#',
        items: [
          {
            title: 'Active Proposals',
            url: '#',
          },
          {
            title: 'Archived',
            url: '#',
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: 'Settings',
        url: '#',
        icon: IconSettings,
      },
      {
        title: 'Get Help',
        url: '#',
        icon: IconHelp,
      },
      {
        title: 'Search',
        url: '#',
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: 'Data Library',
        url: '#',
        icon: IconDatabase,
      },
      {
        name: 'Reports',
        url: '#',
        icon: IconReport,
      },
      {
        name: 'Word Assistant',
        url: '#',
        icon: IconFileWord,
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map,
      },
    ],
    channel: [
      {
        name: 'Overview',
        url: `/dashboard/channel/${channelId}`,
        icon: IconLayoutDashboard,
      },
      {
        name: 'Songs',
        url: `/dashboard/channel/${channelId}/songs`,
        icon: IconMusic,
      },
      {
        name: 'Setlists',
        url: `/dashboard/channel/${channelId}/setlists`,
        icon: IconList,
      },
      // {
      //   name: "Artists",
      //   url: `/dashboard/channel/${channelId}/artists`,
      //   icon: IconMicrophone,
      // },
      // {
      //   name: "Albums",
      //   url: `/dashboard/channel/${channelId}/albums`,
      //   icon: IconDisc,
      // },
      // {
      //   name: "Events",
      //   url: `/dashboard/channel/${channelId}/events`,
      //   icon: IconCalendar,
      // },
      // {
      //   name: "Members",
      //   url: `/dashboard/channel/${channelId}/members`,
      //   icon: IconUsers,
      // },
      // {
      //   name: "Analytics",
      //   url: `/dashboard/channel/${channelId}/analytics`,
      //   icon: IconChartBar,
      // },
      // {
      //   name: "Settings",
      //   url: `/dashboard/channel/${channelId}/settings`,
      //   icon: IconSettings,
      // },
    ],
  };
  // const items = data.navMain.filter((item) => {
  //   if (!item.roles) return true;
  //   return user && item.roles.includes(user.role);
  // });

  const visibleNavMain = data.navMain.filter((item) => {
    if (!item.roles) {
      return true;
    }
    return user ? item.roles.includes(user.role) : false;
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard">
                {/* <IconInnerShadowTop className="size-5!" /> */}
                <img src="./logo.png" alt="" className="size-5!" />
                <span className="text-base font-semibold">Shalom Worship</span>
              </a>
              {/* <ModeToggle/> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleNavMain} />
        {currentChannel && <NavChannel items={data.channel} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NashvilleHelpPopup />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
