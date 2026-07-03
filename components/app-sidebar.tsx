'use client';

import {
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

import { LayoutDashboard, Music4, Mic2, Disc3, Calendar, Users, BarChart3, Settings, Frame, PieChart, Map } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { useUserStore } from '@/store/useUserStore';
import { useEffect, useState } from 'react';
import { channel, Role } from '@prisma/client';
import { getChannelSidebar } from '@/config/navigation/channel';
import { SidebarItem } from '@/types/sidebar';
// import { channel } from "diagnostics_channel"
import { NavChannel } from './nav-channel';
import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';
import { useChannelsStore } from '@/store/useChannelsStore';

interface SidebarProps {
  items: SidebarItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore<any>((state) => state.user);

  const channels = useChannelsStore((state) => state.channels);
  // console.log(channels, "channels")

  const currentChannel = useCurrentChannelStore<channel | null>((state) => state.channel);
  const channelId = currentChannel?.id;
  console.log(channelId, 'channelId');

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
        title: 'Channel',
        url: '/dashboard/channel',
        icon: IconChartBar,
        isActive: false,
        id: '02',
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
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavProjects projects={data.projects}/> */}
        {currentChannel && <NavChannel items={data.channel} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
