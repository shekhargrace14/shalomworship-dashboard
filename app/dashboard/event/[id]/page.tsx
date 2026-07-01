import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page

// // app/(dashboard)/event/[id]/page.tsx

// import Link from "next/link"
// import Image from "next/image"

// import { notFound } from "next/navigation"

// import { format } from "date-fns"


// import { Button } from "@/components/ui/button"

// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card"

// import {
//   CalendarDays,
//   ExternalLink,
//   MapPin,
//   Pencil,
//   Ticket,
//   Trash2,
//   Video,
// } from "lucide-react"
// import { prisma } from "@/lib/prisma"
// import DeleteEventButton from "@/components/event/DeleteEventButton"

// type PageProps = {
//   params: Promise<{
//     id: string
//   }>
// }



// export default async function Page({params,}: PageProps) {
//   const { id } = await params

//   const event = await prisma.event.findUnique({
//     where: {
//       id,
//     },

//     include: {
//       artist: {
//         include: {
//           artist: true,
//         },
//       },
//     },
//   })

//   if (!event) {
//     notFound()
//   }
//   console.log(event, "event")



//   return (
//     <div className="mx-auto max-w-5xl space-y-8 p-6">
//       {/* HERO */}
//       <Card className="overflow-hidden">
//         {/* IMAGE */}
//         {event.image && (
//           <div className="relative h-4 w-40">
//             {/* <Image
//               src={event.image}
//               alt={event.title}
//               fill
//               className="object-cover"
//             /> */}
//             <img src={event.image} alt="" />
//           </div>
//         )}

//         <CardContent className="space-y-6 p-6">
//           {/* TOP */}
//           <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tight">
//                 {event.title}
//               </h1>

//               {event.about && (
//                 <p className="max-w-2xl text-muted-foreground">
//                   {event.about}
//                 </p>
//               )}
//             </div>

//             {/* EDIT BUTTON */}
//             <Button asChild>
//               <Link href={`/event/${event.id}/edit`}>
//                 <Pencil className="mr-2 h-4 w-4" />
//                 Edit Event
//               </Link>
//             </Button>
//           </div>

//           {/* EVENT INFO */}
//           <div className="grid gap-4 md:grid-cols-2">
//             {/* DATE */}
//             {event.date && (
//               <div className="flex items-center gap-3 rounded-lg border p-4">
//                 <CalendarDays className="h-5 w-5 text-muted-foreground" />

//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     Event Date
//                   </p>

//                   <p className="font-medium">
//                     {format(
//                       new Date(event.date),
//                       "PPP"
//                     )}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* VENUE */}
//             {event.venue && (
//               <div className="flex items-center gap-3 rounded-lg border p-4">
//                 <MapPin className="h-5 w-5 text-muted-foreground" />

//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     Venue
//                   </p>

//                   <p className="font-medium">
//                     {event.venue}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ARTISTS */}
//           {event.artist.length > 0 && (
//             <div className="space-y-3">
//               <h2 className="text-lg font-semibold">
//                 Artists
//               </h2>

//               <div className="flex flex-wrap gap-2">
//                 {event.artist.map((artistEvent) => (
//                   <Link
//                     key={artistEvent.artist.id}
//                     href={`/artist/${artistEvent.artist.slug}`}
//                     className="
//                       rounded-md border
//                       px-3 py-1 text-sm
//                       transition-colors
//                       hover:bg-muted
//                     "
//                   >
//                     {artistEvent.artist.title}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* DETAILS */}
//           {event.details && (
//             <div className="space-y-3">
//               <h2 className="text-lg font-semibold">
//                 Event Details
//               </h2>

//               <div className="rounded-lg border p-4">
//                 <p className="whitespace-pre-line text-muted-foreground">
//                   {/* {event.details} */}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* LINKS */}
//           <div className="flex flex-wrap gap-3">
//             {/* REGISTRATION */}
//             {event.registration && (
//               <Button asChild>
//                 <Link
//                   href={event.registration}
//                   target="_blank"
//                 >
//                   <Ticket className="mr-2 h-4 w-4" />
//                   Register
//                 </Link>
//               </Button>
//             )}

//             {/* EXTERNAL LINK */}
//             {event.link && (
//               <Button variant="outline" asChild>
//                 <Link
//                   href={event.link}
//                   target="_blank"
//                 >
//                   <ExternalLink className="mr-2 h-4 w-4" />
//                   Visit Link
//                 </Link>
//               </Button>
//             )}

//             {/* VIDEO */}
//             {event.video && (
//               <Button variant="secondary" asChild>
//                 <Link
//                   href={event.video}
//                   target="_blank"
//                 >
//                   <Video className="mr-2 h-4 w-4" />
//                   Watch Video
//                 </Link>
//               </Button>
//             )}
//           </div>

//           {/* META */}
//           <div className="border-t pt-4 text-sm text-muted-foreground">
//             <p>
//               Created:{" "}
//               {format(
//                 new Date(event.createdAt),
//                 "PPP"
//               )}
//             </p>

//             <p>
//               Updated:{" "}
//               {format(
//                 new Date(event.updatedAt),
//                 "PPP"
//               )}
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//       <DeleteEventButton id={event.id}/>

//     </div>
//   )
// }