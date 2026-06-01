
import EventForm from "@/components/event/EventForm"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"


type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditEventPage({
  params,
}: PageProps) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },

    include: {
      artist: {
        include: {
          artist: true,
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const artists = await prisma.artist.findMany()

  console.log(artists)

  return (
    <EventForm
      artists={artists}
      initialData={{
        ...event,

        artists: event.artist.map(
          (a) => a.artist
        ),
      }}
      isEdit
    />
  )
}