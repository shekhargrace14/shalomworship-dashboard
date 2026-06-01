// app/song/[slug]/page.tsx

import Image from "next/image"
import Link from "next/link"

// import prisma from "@/lib/prisma"

import { notFound } from "next/navigation"

import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import {
  Calendar,
  Clock3,
  Eye,
  Heart,
  Languages,
  Music2,
  PlayCircle,
} from "lucide-react"
import { prisma } from "@/lib/prisma"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  console.log(id, "[id]...")

  const song = await prisma.song.findFirst({
    where: {
      id,
    },

    include: {
      artist: {
        include: {
          artist: true,
        },
      },

      category: {
        include: {
          category: true,
        },
      },

      genre: {
        include: {
          genre: true,
        },
      },

      scripture: {
        include: {
          scripture: true,
        },
      },

      album: {
        include: {
          album: true,
        },
      },

      creator: true,
    },
  })

  if (!song) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* HERO */}
      <div
        className="
          relative overflow-hidden
          rounded-3xl border
        "
      >
        {/* BG IMAGE */}
        {song.image && (
          <Image
            src={song?.image}
            alt={song.title}
            fill
            className="
              absolute inset-0
              object-cover object-top
            "
          />
        )}

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-black/90
            via-black/70
            via-black/70
            to-black/20
          "
        />

        {/* CONTENT */}
        <div
          className="
            relative z-10
            grid grid-cols-1
            lg:grid-cols-[320px_1fr]
            gap-6
            p-6 md:p-10
          "
        >
          {/* LEFT */}
          <div className="space-y-4">
            {/* COVER */}
            {song.image && (
              <div
                className="
                  relative aspect-square
                  overflow-hidden
                  rounded-2xl border
                "
              >
                <Image
                  src={song.image}
                  alt={song.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-2">
              {song.video && (
                <Button asChild>
                  <Link
                    href={song.video}
                    target="_blank"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              )}

              {song.audio && (
                <Button
                  variant="secondary"
                  asChild
                >
                  <Link
                    href={song.audio}
                    target="_blank"
                  >
                    <Music2 className="mr-2 h-4 w-4" />
                    Audio
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 text-white">
            {/* TITLE */}
            <div className="space-y-3">
              <h1
                className="
                  text-4xl font-bold
                  tracking-tight
                  md:text-5xl
                "
              >
                {song.title}
              </h1>

              {/* EXCERPT */}
              {song.excerpt && (
                <p
                  className="
                    max-w-3xl
                    text-white/80
                  "
                >
                  {song.excerpt}
                </p>
              )}
            </div>

            {/* BADGES */}
            <div className="flex flex-wrap gap-2">
              {song.language && (
                <Badge variant="secondary">
                  <Languages className="mr-1 h-3 w-3" />
                  {song.language}
                </Badge>
              )}

              {song.version && (
                <Badge variant="secondary">
                  {song.version}
                </Badge>
              )}

              {song.status && (
                <Badge>
                  {song.status}
                </Badge>
              )}

              {song.isTranslation && (
                <Badge variant="outline">
                  Translation
                </Badge>
              )}

              {song.isChords && (
                <Badge variant="outline">
                  Chords
                </Badge>
              )}
            </div>

            {/* META */}
            <div
              className="
                grid grid-cols-2
                md:grid-cols-4
                gap-4
              "
            >
              {/* BPM */}
              {song.bpm && (
                <Card className="bg-white/10 backdrop-blur">
                  <CardContent className="p-4">
                    <p className="text-xs text-white/70">
                      BPM
                    </p>

                    <p className="font-semibold">
                      {song.bpm}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* SCALE */}
              {song.key && (
                <Card className="bg-white/10 backdrop-blur">
                  <CardContent className="p-4">
                    <p className="text-xs text-white/70">
                      Scale
                    </p>

                    <p className="font-semibold">
                      {song.key}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* TIME */}
              {song.time && (
                <Card className="bg-white/10 backdrop-blur">
                  <CardContent className="p-4">
                    <p className="text-xs text-white/70">
                      Time
                    </p>

                    <p className="font-semibold">
                      {song.time}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* TEMPO */}
              {song.tempo && (
                <Card className="bg-white/10 backdrop-blur">
                  <CardContent className="p-4">
                    <p className="text-xs text-white/70">
                      Tempo
                    </p>

                    <p className="font-semibold">
                      {song.tempo}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {song.view} Views
              </div>

              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {song.like} Likes
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(
                  new Date(song.createdAt),
                  "PPP"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        className="
          mt-8
          grid grid-cols-1
          lg:grid-cols-[1fr_350px]
          gap-6
        "
      >
        {/* LEFT */}
        <div className="space-y-6">
          {/* LYRICS */}
          <Card>
            <CardHeader>
              <CardTitle>
                Lyrics
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div
                className="
                  whitespace-pre-wrap
                  leading-8
                "
              >
                {song.content}
              </div>
            </CardContent>
          </Card>

          {/* ABOUT */}
          {song.about && (
            <Card>
              <CardHeader>
                <CardTitle>
                  About Songg
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="leading-7 text-muted-foreground">
                  {song.about}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* ARTISTS */}
          {song.artist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Artists
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {song.artist.map(
                  (artistItem) => (
                    <Badge
                      key={
                        artistItem.artist.id
                      }
                    >
                      {
                        artistItem.artist
                          .title
                      }
                    </Badge>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* GENRES */}
          {song.genre.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Genres
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {song.genre.map((g) => (
                  <Badge
                    key={g.genre.id}
                    variant="secondary"
                  >
                    {g.genre.title}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* CATEGORIES */}
          {song.category.length >
            0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Categories
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {song.category.map(
                  (c) => (
                    <Badge
                      key={
                        c.category.id
                      }
                      variant="outline"
                    >
                      {
                        c.category
                          .title
                      }
                    </Badge>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* SEARCH VARIANTS */}
          {song.searchVariant
            .length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Search Variants
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {song.searchVariant.map(
                  (v, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                    >
                      {v}
                    </Badge>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* KEYWORDS */}
          {song.keyword.length >
            0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Keywords
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {song.keyword.map(
                  (k, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                    >
                      {k}
                    </Badge>
                  )
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}