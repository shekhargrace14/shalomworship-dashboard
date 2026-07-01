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
import { Balloon } from "lucide-react";
import { useChannelsStore } from "@/store/useChannelsStore";


export function ChannelCards() {
  const data = useChannelsStore((state)=>state.channels)
  // console.log(data, "lksfljdskfjs")

  return (
    <div className="grid grid-cols-1  gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      {data?.map((d: any, index) => {
        return (
          <Link href={`/dashboard/channel/${d.id}`} key={d.index}>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>{d.type}</CardDescription>
                <CardTitle className="text-base font-semibold tabular-nums @[250px]/card:text-2xl line-clamp-1">
                  {d.title}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <Balloon fill="accent" />
                    active
                  </Badge>
                </CardAction>
              </CardHeader>
              {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Trending up this month <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Visitors for the last 6 months
                </div>
              </CardFooter> */}
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
