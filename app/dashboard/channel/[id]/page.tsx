"use client"

import { CardDemo } from "@/components/card/card"
import { ChannelCards } from "@/components/channel-cards"
import ChannelForm from "@/components/channel/ChannelForm"
import DataTable from "@/components/table/DataTable"
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
  const songs = currentChannel?.songs

  return (
    <div>
      {/* <ChannelForm initialData={currentChannel} isEdit/> */}
      <CardDemo data={currentChannel}/>
      <DataTable data={songs ?? []} type="song"/>
      {/* <ChannelCards/> */}
    </div>
  )
}