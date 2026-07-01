"use client"
import PaginationComponent from "@/components/PaginationComponent"
import { PaginationIconsOnly } from "@/components/PaginationIconsOnly"
import DataTable from "@/components/table/DataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"


export default function Page() {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState("1")

  const [limit, setLimit] = useState(10);


  useEffect(() => {
    fetchSongs();
  }, [page, limit]);

  async function fetchSongs() {

    const res = await fetch(
      `/api/song?page=${page}&limit=${limit}`
    );

    const data = await res.json();

    setSongs(data.data);
    setTotalPages(data.totalPages);
  }
  console.log(songs)

  return (
    <div className="">
      <div className="flex justify-end">
        <Link href={`/song/create`}>
          <Button variant="default"> <Plus />  Add Song</Button>
        </Link>
      </div>
      {/* <SongTableWrapper /> */}
      <>
        {/* <>Page {page}/{totalPages}</> */}
        <DataTable data={songs} type="song" />

        <div className="flex flex-wrap justify-center items-center ">

          <PaginationIconsOnly
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPages={totalPages}
          />
          <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
      </>
    </div>
  )
}