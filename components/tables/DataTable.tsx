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

export function DataTable({ data }: { data: artist[] }) {

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
        {sortedData.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>

            <TableCell>
              <Link href={`/artist/${category.id}`}>
                {category.title}
              </Link>
            </TableCell>

            <TableCell>{category.slug}</TableCell>

            <TableCell>
              {new Date(category.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell>
              {new Date(category.updatedAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}