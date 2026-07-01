"use client"

import ChannelForm from "@/components/channel/ChannelForm"
import { useChannelsStore } from "@/store/useChannelsStore"
import { useCurrentChannelStore } from "@/store/useCurrentChannelStore"
import { useParams } from "next/navigation"
import { title } from "process"
import { useEffect, useState } from "react"

type PageProps = {
  params: {
    id: string
  }
}

export default function Page() {
const params = useParams()
  const id = params.id

  const currentChannel = useCurrentChannelStore((state)=>state.channel)
  console.log(currentChannel, "currentChannel")

  return (
    <div>
      <ChannelForm initialData={currentChannel} isEdit/>
    </div>
  )
}