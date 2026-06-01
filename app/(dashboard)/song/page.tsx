import { SongTable } from "@/components/song-table"
import { Button } from "@/components/ui/button"
import SongTableWrapper from "@/components/warapper/SongTableWrapper"
import { song } from "@prisma/client"
import { Plus } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"


export default async function Page() {

  return (
    <div className="">
      <div className="flex justify-end"> 
        <Link href={`/song/create`}>
        <Button variant="default"> <Plus/>  Add Song</Button>
        </Link>
      </div>
      <SongTableWrapper />
    </div>
  )
}