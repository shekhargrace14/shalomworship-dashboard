"use client"

import slugify from "slugify"

import { ArtistType } from "@prisma/client"

import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Textarea } from "@/components/ui/textarea"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DeleteItemButton } from "../shared/DeleteItemButton"

type Artist = {
  id: string
  title: string
  type?: ArtistType | null
  link?: string | null
  image?: string | null
  about?: string | null
  isVerified?: boolean | null
  slug?: string | null
  color?: string | null
  email?: string | null

  instagram?: string | null
  youtube?: string | null

  spotify?: string | null
  appleMusic?: string | null
  amazonMusic?: string | null
  youTubeMusic?: string | null
  tidal?: string | null
  deezer?: string | null
  soundCloud?: string | null
  pandora?: string | null
}

type ArtistFormProps = {
  initialData?: Artist
  isEdit?: boolean
}

function formatEnumLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function ArtistForm({ initialData, isEdit}: ArtistFormProps) {

    const route = useRouter()
  const [slugEdited, setSlugEdited] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",

    type: initialData?.type || "",

    link: initialData?.link || "",

    image: initialData?.image || "",

    about: initialData?.about || "",

    slug: initialData?.slug || "",

    color: initialData?.color || "#000000",

    email: initialData?.email || "",

    instagram:
      initialData?.instagram || "",

    youtube: initialData?.youtube || "",

    spotify: initialData?.spotify || "",

    appleMusic:
      initialData?.appleMusic || "",

    amazonMusic:
      initialData?.amazonMusic || "",

    youTubeMusic:
      initialData?.youTubeMusic || "",

    tidal: initialData?.tidal || "",

    deezer: initialData?.deezer || "",

    soundCloud:
      initialData?.soundCloud || "",

    pandora: initialData?.pandora || "",

    isVerified:
      initialData?.isVerified || false,
  })

  useEffect(() => {

  if (initialData) {

    setFormData({
      title: initialData.title || "",

      type: initialData.type || "",

      link: initialData.link || "",

      image: initialData.image || "",

      about: initialData.about || "",

      slug: initialData.slug || "",

      color: initialData.color || "#000000",

      email: initialData.email || "",

      instagram: initialData.instagram || "",

      youtube: initialData.youtube || "",

      spotify: initialData.spotify || "",

      appleMusic: initialData.appleMusic || "",

      amazonMusic: initialData.amazonMusic || "",

      youTubeMusic: initialData.youTubeMusic || "",

      tidal: initialData.tidal || "",

      deezer: initialData.deezer || "",

      soundCloud: initialData.soundCloud || "",

      pandora: initialData.pandora || "",

      isVerified: initialData.isVerified || false,
    })

  }

}, [initialData])


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target

    const updates: Record<string, any> = {
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement)
              .checked
          : value,
    }

    // auto-generate slug from title
    if (name === "title" && !slugEdited) {
      updates.slug = slugify(value, {
        lower: true,
        strict: true,
        trim: true,
      })
    }

    setFormData((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    const endpoint = isEdit
      ? `/api/artist/${initialData?.id}`
      : "/api/artist"

    const method = isEdit
      ? "PATCH"
      : "POST"

    try {
      const res = await fetch(endpoint, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error(
          "Failed to save artist"
        )
      }

      toast.success("Artist Created")

      console.log("Artist saved")
      route.push("/artist")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle>
          {isEdit
            ? "Edit Artist"
            : "Create Artist"}
        </CardTitle>

        <CardDescription>
          Manage artist profile and
          streaming platforms.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* BASIC INFO */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                Basic Information
              </h2>

              <p className="text-sm text-muted-foreground">
                Main artist details and
                identity.
              </p>
            </div>

            {/* TITLE + TYPE */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Artist Name
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </label>

                <Input
                  name="title"
                  placeholder="Artist Name"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TYPE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Artist Type
                </label>

                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.values(
                      ArtistType
                    ).map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                      >
                        {formatEnumLabel(
                          type
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SLUG + EMAIL */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* SLUG */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Slug
                </label>

                <Input
                  name="slug"
                  placeholder="artist-name"
                  value={formData.slug}
                  onChange={(e) => {
                    setSlugEdited(true)

                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }}
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email
                </label>

                <Input
                  type="email"
                  name="email"
                  placeholder="artist@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* IMAGE + WEBSITE */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* IMAGE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Artist Image
                </label>

                <Input
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              {/* WEBSITE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Website
                </label>

                <Input
                  name="link"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* COLOR */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Theme Color
              </label>

              <Input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-12 p-1"
              />
            </div>

            {/* VERIFIED */}
            <div className="flex items-center gap-3">
              <input
                id="verified"
                type="checkbox"
                name="isVerified"
                checked={
                  formData.isVerified
                }
                onChange={handleChange}
                className="h-4 w-4"
              />

              <label
                htmlFor="verified"
                className="text-sm font-medium"
              >
                Verified Artist
              </label>
            </div>

            {/* ABOUT */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                About Artist
              </label>

              <Textarea
                name="about"
                placeholder="Write artist biography..."
                rows={6}
                value={formData.about}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* SOCIAL LINKS */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                Social Media
              </h2>

              <p className="text-sm text-muted-foreground">
                Artist social profiles.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="instagram"
                placeholder="Instagram URL"
                value={formData.instagram}
                onChange={handleChange}
              />

              <Input
                name="youtube"
                placeholder="YouTube URL"
                value={formData.youtube}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* STREAMING */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                Streaming Platforms
              </h2>

              <p className="text-sm text-muted-foreground">
                Music platform links.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="spotify"
                placeholder="Spotify URL"
                value={formData.spotify}
                onChange={handleChange}
              />

              <Input
                name="appleMusic"
                placeholder="Apple Music URL"
                value={formData.appleMusic}
                onChange={handleChange}
              />

              <Input
                name="amazonMusic"
                placeholder="Amazon Music URL"
                value={formData.amazonMusic}
                onChange={handleChange}
              />

              <Input
                name="youTubeMusic"
                placeholder="YouTube Music URL"
                value={formData.youTubeMusic}
                onChange={handleChange}
              />

              <Input
                name="tidal"
                placeholder="Tidal URL"
                value={formData.tidal}
                onChange={handleChange}
              />

              <Input
                name="deezer"
                placeholder="Deezer URL"
                value={formData.deezer}
                onChange={handleChange}
              />

              <Input
                name="soundCloud"
                placeholder="SoundCloud URL"
                value={formData.soundCloud}
                onChange={handleChange}
              />

              <Input
                name="pandora"
                placeholder="Pandora URL"
                value={formData.pandora}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full"
          >
            {isEdit
              ? "Update Artist"
              : "Create Artist"}
          </Button>
        </form>
      </CardContent>
        {isEdit && <DeleteItemButton id={initialData?.id} type="artist" />}
    </Card>
  )
}