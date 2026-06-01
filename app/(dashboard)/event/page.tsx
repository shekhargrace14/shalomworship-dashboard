"use client"
import { CategoryTable } from "@/components/tables/category-table"
import PaginationComponent from "@/components/PaginationComponent"
import { PaginationIconsOnly } from "@/components/PaginationIconsOnly"
import { SongTable } from "@/components/song-table"
import { Button } from "@/components/ui/button"
import { song } from "@prisma/client"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArtistTable } from "@/components/tables/artist-table"
import { EventTable } from "@/components/tables/event-table"


export default function Page() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState("1")
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchEvents();
  }, [page, limit]);

  async function fetchEvents() {
    const res = await fetch(`/api/event?page=${page}&limit=${limit}`)
    const data = await res.json()
    setData(data.data);
    setTotalPages(data.totalPages)
  }

  return (
    <div className="">
      <div className="flex justify-end">
        <Link href={`/event/create`}>
          <Button variant="outline"> <Plus />  Add Event</Button>
        </Link>
      </div>
      <PaginationIconsOnly
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
      />
      <EventTable data={data} />
      <PaginationComponent
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        totalPages={totalPages}
      />
    </div>
  )
}