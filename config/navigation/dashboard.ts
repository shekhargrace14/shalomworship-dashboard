// config/dashboard-sidebar.ts

import { LayoutDashboard, User, FolderKanban } from 'lucide-react';

export const dashboardSidebar = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Channels',
    href: '/dashboard/channels',
    icon: FolderKanban,
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
];
