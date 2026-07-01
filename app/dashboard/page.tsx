import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { ChannelCards } from "@/components/channel-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// import data from "./dashboard/data.json"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Page() {




  return (
    <>
      <div className="space-y-4 space-x-4 py-4">
        <h2 className="text-3xl px-4">Channels</h2>
        {/* <SectionCards /> */}

        <div className="flex justify-end gap-4">
          <Link href={`/dashboard/channel/create`}>
            <Button variant="outline" className="cursor-pointer"> <Plus />Create Channel</Button>
          </Link>
          <Link href={`/dashboard/channel/create`}>
            <Button variant="outline" className="cursor-pointer"> <Plus />Claim Channel</Button>
          </Link>
        </div>

        <ChannelCards />

        {/* <ChartAreaInteractive /> */}
        {/* <DataTable data={data} /> */}
      </div>
    </>

  )
}
