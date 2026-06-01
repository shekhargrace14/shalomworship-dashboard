import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { song } from "@prisma/client"
import { headers } from "next/headers"
import Link from "next/link"

export async function SongTable() {
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"

  const res = await fetch(`${protocol}://${host}/api/song`)
  const data = await res.json()
  const songs = await data.songs
  // console.log(songs)

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className=""></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song: song) => (
          <TableRow key={song.id}>
            <TableCell>{song.id}</TableCell>
            <TableCell className="font-medium cursor-pointer"> <Link href={`/song/${song.id}`}>{song.title}</Link></TableCell>
            <TableCell>{song.slug}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}