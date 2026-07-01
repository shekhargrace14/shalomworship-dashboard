"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Role } from "@prisma/client";


export function SectionCards() {

  const user = useUserStore<any>((state) => state.user)

  // const channels = user?.channels?.length

  const [totalChannels, setTotalChannels] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvent, setTotalEvents] = useState(0);

  console.log(totalChannels, "ksjfkdsjkfj")

  useEffect(() => {
    fetchChannels();
    // fetchSongs();
    // fetchCategories();
    // fetchEvents();
    // fetchChannels();
  }, [totalSongs, totalCategories, totalUsers, totalEvent, totalChannels]);

  async function fetchChannels() {
    const res = await fetch(`/api/channel?mine=true`)
    const data = await res.json();
    setTotalChannels(data.length); 
  }
  // async function fetchSongs() {
  //   const res = await fetch(`/api/song`);
  //   const data = await res.json();
  //   setTotalSongs(data.total);
  // }
  // async function fetchUsers() {
  //   const res = await fetch(`/api/user`);
  //   const data = await res.json();
  //   setTotalUsers(data.total);
  // }
  // async function fetchCategories() {
  //   const res = await fetch(`/api/category`);
  //   const data = await res.json();
  //   setTotalCategories(data.total);
  // }
  // async function fetchEvents() {
  //   const res = await fetch(`/api/event`);
  //   const data = await res.json();
  //   setTotalEvents(data.total);
  // }


  const data = [
    {
      title: "Channels",
      link: "/channel",
      count: totalChannels,
      description: "it gonna be fine",
      text: "do it as much as you can, she will be back soon",
    },
    {
      title: "Songs",
      link: "/song",
      count: totalSongs,
      description: "it gonna be fine",
      text: "do it as much as you can, she will be back soon"
    },
    {
      title: "Categories",
      link: "/category",
      count: totalCategories,
      description: "it gonna be fine",
      text: "do it as much as you can, she will be back soon",
      roles: [Role.ADMIN, Role.SUPER_ADMIN],

    },
    {
      title: "Users",
      link: "/user",
      count: totalUsers,
      description: "it gonna be fine",
      text: "do it as much as you can, she will be back soon",
      roles: [Role.ADMIN, Role.SUPER_ADMIN],

    },
    {
      title: "Events",
      link: "/event",
      count: totalEvent,
      description: "it gonna be fine",
      text: "do it as much as you can, she will be back soon",
    },
  ]

  const items = data.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {items.map((d: any, index) => {
        return (
          <Link href={d.link} key={d.link}>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>{d.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {d.count}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +12.5%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Trending up this month <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
