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


export default function Page() {

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState("1")
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  async function fetchCategories() {
    const res = await fetch(`/api/category?page=${page}&limit=${limit}`)
    const data = await res.json()
    setCategories(data.data);
    setTotalPages(data.totalPages)
  }

  return (
    <div className="">
      <div className="flex justify-end">
        <Link href={`/category/create`}>
          <Button variant="outline"> <Plus />  Add Category</Button>
        </Link>
      </div>
      <PaginationIconsOnly
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
      />
      <CategoryTable category={categories} />
      <PaginationComponent
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        totalPages={totalPages}
      />
    </div>
  )
}