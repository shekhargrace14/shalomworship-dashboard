// import { BarChart3, Calendar, Disc3, LayoutDashboard, Mic2, Music4, Settings, Users } from "lucide-react";

// export const getChannelSidebar = (id: string) => [
//   {
//     title: "Workspace",
//     items: [
//       {
//         title: "Overview",
//         href: `/channel/${id}`,
//         icon: LayoutDashboard,
//       },
//     ],
//   },

//   {
//     title: "Content",
//     items: [
//       {
//         title: "Songs",
//         href: `/channel/${id}/songs`,
//         icon: Music4,
//       },
//       {
//         title: "Artists",
//         href: `/channel/${id}/artists`,
//         icon: Mic2,
//       },
//       {
//         title: "Albums",
//         href: `/channel/${id}/albums`,
//         icon: Disc3,
//       },
//       {
//         title: "Events",
//         href: `/channel/${id}/events`,
//         icon: Calendar,
//       },
//     ],
//   },

//   {
//     title: "Community",
//     items: [
//       {
//         title: "Members",
//         href: `/channel/${id}/members`,
//         icon: Users,
//       },
//     ],
//   },

//   {
//     title: "Administration",
//     items: [
//       {
//         title: "Analytics",
//         href: `/channel/${id}/analytics`,
//         icon: BarChart3,
//       },
//       {
//         title: "Settings",
//         href: `/channel/${id}/settings`,
//         icon: Settings,
//       },
//     ],
//   },
// ];

// config/channel-sidebar.ts

import { LayoutDashboard, Music4, Mic2, Disc3, Calendar, Users, BarChart3, Settings } from 'lucide-react';

export const getChannelSidebar = (channelId: string) => [
  {
    title: 'Overview',
    href: `/channel/${channelId}`,
    icon: LayoutDashboard,
  },
  {
    title: 'Songs',
    href: `/channel/${channelId}/songs`,
    icon: Music4,
  },
  {
    title: 'Artists',
    href: `/channel/${channelId}/artists`,
    icon: Mic2,
  },
  {
    title: 'Albums',
    href: `/channel/${channelId}/albums`,
    icon: Disc3,
  },
  {
    title: 'Events',
    href: `/channel/${channelId}/events`,
    icon: Calendar,
  },
  {
    title: 'Members',
    href: `/channel/${channelId}/members`,
    icon: Users,
  },
  {
    title: 'Analytics',
    href: `/channel/${channelId}/analytics`,
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: `/channel/${channelId}/settings`,
    icon: Settings,
  },
];
