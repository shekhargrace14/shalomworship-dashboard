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
import { artist } from "@prisma/client"
import { ArrowDownUp } from "lucide-react"
import Link from "next/link"

export function ArtistTable({ data }: { data: artist[] }) {

  const {
    sortedData,
    sortField,
    handleSort
  } = useSort(data, "title") // default sort

  return (
    <Table>
      <TableCaption>Artist list</TableCaption>

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
        {sortedData.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.id}</TableCell>

            <TableCell>
              <Link href={`/artist/${data.id}`}>
                {data.title}
              </Link>
            </TableCell>

            <TableCell>{data.slug}</TableCell>

            <TableCell>
              {new Date(data.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell>
              {new Date(data.updatedAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}