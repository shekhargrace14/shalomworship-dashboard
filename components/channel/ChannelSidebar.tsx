"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Music4,
  Users,
  Calendar,
  Disc3,
  Mic2,
  BookOpen,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  channelId: string;
}

const sections = [
  {
    title: "Overview",
    items: [
      {
        icon: Home,
        label: "Dashboard",
        href: "",
      },
    ],
  },

  {
    title: "Content",
    items: [
      {
        icon: Music4,
        label: "Songs",
        href: "/songs",
      },
      {
        icon: Mic2,
        label: "Artists",
        href: "/artists",
      },
      {
        icon: Disc3,
        label: "Albums",
        href: "/albums",
      },
      {
        icon: Calendar,
        label: "Events",
        href: "/events",
      },
      {
        icon: BookOpen,
        label: "Playlists",
        href: "/playlists",
      },
    ],
  },

  {
    title: "Community",
    items: [
      {
        icon: Users,
        label: "Members",
        href: "/members",
      },
      {
        icon: FileText,
        label: "Submissions",
        href: "/submissions",
      },
    ],
  },

  {
    title: "Workspace",
    items: [
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/analytics",
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/settings",
      },
    ],
  },
];

export default function ChannelSidebar({
  channelId,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r bg-card">
      <div className="p-5">
        <h2 className="font-semibold">
          Channel Workspace
        </h2>
      </div>

      <nav className="space-y-6 px-3">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const href = `/channels/${channelId}${item.href}`;

                const active =
                  pathname === href;

                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />

                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}