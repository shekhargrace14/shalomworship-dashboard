"use client"

import ArtistForm from "@/components/artist/ArtistForm"
import { useParams } from "next/navigation"
import { title } from "process"
import { useEffect, useState } from "react"

type PageProps = {
  params: {
    id: string
  }
}

export default function Page() {
const params = useParams()
  const id = params.id
  console.log(id)

  const [artist, setArtist] = useState<any>(null)

  useEffect(() => {
    fetchCategory()
  }, [])

  async function fetchCategory() {
    try {
      const res = await fetch(`/api/artist/${id}`)

      if (!res.ok) {
        throw new Error("Failed to fetch atitst")
      }

      const data = await res.json()

      setArtist(data.artist)

    } catch (error) {
      console.error(error)
    }
  }
  console.log(artist)

  return (
    <div>
      <ArtistForm initialData={artist} isEdit />
    </div>
  )
}