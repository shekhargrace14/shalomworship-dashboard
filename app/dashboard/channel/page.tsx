"use client"
import PaginationComponent from "@/components/PaginationComponent"
import { PaginationIconsOnly } from "@/components/PaginationIconsOnly"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import DataTable from "@/components/table/DataTable"
import { useUserStore } from "@/store/useUserStore"
import { useChannelsStore } from "@/store/useChannelsStore"


export default function Page() {

  const user = useUserStore<any>((state) => state.user)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10);

  const channels = useChannelsStore((state) => state.channels);


  return (
    <div className="">
      <div className="flex justify-end">
        <Link href={`/dashboard/channel/create`}>
          <Button variant="outline"> <Plus />Add Channel</Button>
        </Link>
      </div>
      <PaginationIconsOnly
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
      />
      {/* <ArtistTable data={data} /> */}
      {/* <Table data={data} /> */}
      <DataTable data={channels} type="channel" />
      <PaginationComponent
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        totalPages={totalPages}
      />
    </div>
  )
}