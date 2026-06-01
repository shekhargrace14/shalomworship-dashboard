"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useSort } from "@/hooks/useSort"
import { song } from "@prisma/client"
import { ArrowDownUp } from "lucide-react"
import Link from "next/link"

export default function SongTableClient({ songs }: { songs: song[] }) {

  const {
    sortedData,
    sortField,
    handleSort
  } = useSort(songs, "title")

  return (
    <Table>
      {/* <TableCaption>Song list</TableCaption> */}

      <TableHeader>
        <TableRow>

          <TableHead onClick={() => handleSort("id")}>
            id {sortField === "id" && <ArrowDownUp size={16} />}
          </TableHead>

          <TableHead onClick={() => handleSort("title")}>
            Title {sortField === "title" && <ArrowDownUp size={16} />}
          </TableHead>

          <TableHead onClick={() => handleSort("slug")}>
            Slug {sortField === "slug" && <ArrowDownUp size={16} />}
          </TableHead>

          <TableHead onClick={() => handleSort("createdAt")}>
            createdAt {sortField === "createdAt" && <ArrowDownUp size={16} />}
          </TableHead>

          <TableHead onClick={() => handleSort("updatedAt")}>
            updatedAt {sortField === "updatedAt" && <ArrowDownUp size={16} />}
          </TableHead>

        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData.map((song) => (
          <TableRow key={song.id}>
            <TableCell>{song.id}</TableCell>

            <TableCell>
              <Link href={`/song/${song.id}`}>
                {song.title}
              </Link>
            </TableCell>

            <TableCell>{song.slug}</TableCell>

            <TableCell>
              {new Date(song.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell>
              {new Date(song.updatedAt).toLocaleDateString()}
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}