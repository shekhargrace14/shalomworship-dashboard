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

const data = [
  {
    title: "Song",
    count: "123",
    description: "it gonna be fine",
    text: "do it as much as you can, she will be back soon"
  },
  {
    title: "Song",
    count: "123",
    description: "it gonna be fine",
    text: "do it as much as you can, she will be back soon"
  },
  {
    title: "Song",
    count: "123",
    description: "it gonna be fine",
    text: "do it as much as you can, she will be back soon"
  },
]
export function SectionCards() {
  const [totalSongs, setTotalSongs] = useState(1);
  const [totalCategories, setTotalCategories] = useState(1);
  const [totalArtist, setTotalArtist] = useState(1);

  useEffect(() => {
    fetchSongs();
    fetchCategories();
    fetchArtists();
  }, [totalSongs, totalCategories, totalArtist]);

  async function fetchSongs() {
    const res = await fetch(`/api/song`);
    const data = await res.json();
    setTotalSongs(data.total);
  }
  async function fetchArtists() {
    const res = await fetch(`/api/artist`);
    const data = await res.json();
    setTotalArtist(data.total);
  }
  async function fetchCategories() {
    const res = await fetch(`/api/category`);
    const data = await res.json();
    setTotalCategories(data.total);
  }
  const data = [
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
      text: "do it as much as you can, she will be back soon"
    },
    {
      title: "Artists",
      link: "/artist",
      count: totalArtist,
      description: "it gonna be fine",
      text: "do it as much as you can, she will be back soon"
    },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {data.map((d: any) => {
        return (
          <Link href={d.link}>
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
