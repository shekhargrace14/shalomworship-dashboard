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
import { song, StatusType } from "@prisma/client"
import { Archive, ArrowDownUp, Trash2, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"

type Props = {
  data: song[]
  type: string
}

const statusIcons = {
  PUBLISH: (<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />),
  DRAFT: <IconLoader />,
  TRASH: <Trash2 className="text-red-500" />,
  ARCHIVE: <Archive className="text-yellow-500" />,
  CANCELLED: <X className="text-red-500" />,
}

export default function DataTable({ data = [], type }: Props) {

  const {
    sortedData,
    sortField,
    handleSort
  } = useSort(data, "createdAt")

  const capitalCase = (s: any) =>
    s
      .toLowerCase()
      .split(" ")
      .map(
        (word: any) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ")


  return (
    <div className="mx-4 my-6">

    <Table className="overflow-hidden rounded-lg border border-amber-400  mx-4 m-auto" >

      <TableHeader className="sticky top-0 z-10 bg-muted">
        <TableRow>

          {/* 1. ID */}
          {/* <TableHead onClick={() => handleSort("id")}>
            id {sortField === "id" && <ArrowDownUp size={16} />}
          </TableHead> */}

          {/* 2. TITLE */}
          <TableHead onClick={() => handleSort("title")} >
            <div className="flex items-center gap-2">
              Title {sortField === "title" && <ArrowDownUp size={16} />}
            </div>
          </TableHead>

          {/*3. STATUS */}
          <TableHead onClick={() => handleSort("status")}>
            <div className="flex items-center gap-2">
              Status {sortField === "status" && <ArrowDownUp size={16} />}
            </div>

          </TableHead>

          {/* 4. SLUG */}
          <TableHead onClick={() => handleSort("slug")}>
            <div className="flex items-center gap-2">
              Slug {sortField === "slug" && <ArrowDownUp size={16} />}
            </div>
          </TableHead>

          {/* 5. KEY */}
          <TableHead onClick={() => handleSort("key")}>
            <div className="flex items-center gap-2">
              Key {sortField === "key" && <ArrowDownUp size={16} />}
            </div>
          </TableHead>

          {/* 6. CREATEDAT  */}
          <TableHead onClick={() => handleSort("createdAt")}>
            <div className="flex items-center gap-2">
              Created {sortField === "createdAt" && <ArrowDownUp size={16} />}
            </div>
          </TableHead>

          {/* 7. UPDATEDAT  */}
          <TableHead onClick={() => handleSort("updatedAt")}>
            <div className="flex items-center gap-2">
              Updated {sortField === "updatedAt" && <ArrowDownUp size={16} />}
            </div>
          </TableHead>

        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.id}>

            {/* 1. ID */}

            {/* <TableCell>{item.id}</TableCell> */}

            {/* 2. TITLE */}
            <TableCell>
              <Link href={`/${type}/${item.id}`}>
                {item.title}
              </Link>
            </TableCell>

            {/*3. STATUS */}
            <TableCell>

              <Badge
                variant="outline"
                className="px-1.5 text-muted-foreground"
              >
                {statusIcons[item.status as keyof typeof statusIcons] ?? <IconLoader />}
                {capitalCase(item.status)}
              </Badge>
            </TableCell>

            {/* 4. SLUG */}
            <TableCell>
              {item.slug}
            </TableCell>

            {/* 5. KEY */}
            <TableCell>

              {item.key
                ? item.key
                : "-"
              }
            </TableCell>

            {/* 6. CREATEDAT  */}
            <TableCell>
              {new Date(item.createdAt).toLocaleDateString()}
            </TableCell>

            {/* 7. UPDATEDAT  */}
            <TableCell>
              {new Date(item.updatedAt).toLocaleDateString()}
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>

  )
}