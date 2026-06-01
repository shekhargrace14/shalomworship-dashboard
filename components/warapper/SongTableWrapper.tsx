"use client";

import { useEffect, useState } from "react";
import SongTableClient from "../SongTableClient";
import PaginationComponent from "../PaginationComponent";
import { PaginationIconsOnly } from "../PaginationIconsOnly";
import { DataTable } from "../data-table";

export default function SongTableWrapper() {

  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState("1")

  const [limit, setLimit] = useState(10);


  useEffect(() => {
    fetchSongs();
  }, [page,limit]);

  async function fetchSongs() {

    const res = await fetch(
      `/api/song?page=${page}&limit=${limit}`
    );

    const data = await res.json();

    setSongs(data.data);
    setTotalPages(data.totalPages);
  }
  // console.log(songs)
  

  return (
    <>
        <>Page {page}/{totalPages}</>
        <SongTableClient songs={songs} />
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


      {/* <DataTable data={songs} /> */}

    </>
  );
}

