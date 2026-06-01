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

export function EventTable({ data }: { data: artist[] }) {

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
        {sortedData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>

            <TableCell>
              <Link href={`/event/${item.id}`}>
                {item.title}
              </Link>
            </TableCell>

            <TableCell>{item.slug}</TableCell>

            <TableCell>
              {new Date(item.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell>
              {new Date(item.updatedAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}