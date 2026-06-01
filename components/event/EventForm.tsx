"use client"

import slugify from "slugify"
import { useState } from "react"

import { format } from "date-fns"

import { CalendarIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"
import { useRouter } from "next/navigation"
import TiptapEditor from "../editor/TiptapEditor"
import { SelectEventArtist } from "./SelectEventArtist"

type Artist = {
    id: string
    title: string
}



type EventFormProps = {
    artists: Artist[]
    initialData?: any
    isEdit?: boolean
}

export default function EventForm({
    artists, initialData, isEdit,
}: EventFormProps) {

    const router = useRouter()
    const [slugEdited, setSlugEdited] = useState(false)
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()
    const [details, setDetails] = useState<any>(null)

    const [selectedArtists, setSelectedArtists] =
        useState<Artist[]>(initialData?.artists || [])

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        image: initialData?.image || "",
        video: initialData?.video || "",
        venue: initialData?.venue || "",
        details: initialData?.details || "",
        registration: initialData?.registration || "",
        link: initialData?.link || "",
        slug: initialData?.slug || "",
        color: initialData?.color || "#000000",
        about: initialData?.about || "",
        status: initialData?.status || "",
    })

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const { name, value } = e.target

        const updates: Record<string, any> = {
            [name]: value,
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

        const payload = {
            ...formData,
            startDate,
            endDate,
            artistIds: selectedArtists.map(
                (artist) => artist.id
            ),
        }

        console.log(payload)

        const endpoint = isEdit
            ? `/api/event/${initialData?.id}`
            : "/api/event"

        const method = isEdit
            ? "PATCH"
            : "POST"

        try {
            const res = await fetch(endpoint, {
                method: method,

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(payload),
            })
            const data = await res.json()

            toast.success(data.message || "Task Successful")

            router.push("/event")

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong")
            }

            console.log("Event created")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Create Event</CardTitle>

                <CardDescription>
                    Fill event information carefully.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* TITLE */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Title
                            <span className="ml-1 text-destructive">
                                *
                            </span>
                        </label>

                        <Input
                            name="title"
                            placeholder="Revival Night"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* SLUG */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Slug
                            <span className="ml-1 text-destructive">
                                *
                            </span>
                        </label>

                        <Input
                            name="slug"
                            placeholder="revival-night"
                            value={formData.slug}
                            onChange={handleChange}

                        />
                    </div>

                    {/* IMAGE + VIDEO */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Image URL
                            </label>

                            <Input
                                name="image"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Video URL
                            </label>

                            <Input
                                name="video"
                                placeholder="https://youtube.com/..."
                                value={formData.video}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* DATE + VENUE */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* DATE */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Event Date
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="
                                          w-full justify-start
                                          text-left font-normal
                                        "
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />

                                        {startDate
                                            ? format(startDate, "PPP")
                                            : "Pick the Start date"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                    />
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="
                                          w-full justify-start
                                          text-left font-normal
                                        "
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />

                                        {endDate
                                            ? format(endDate, "PPP")
                                            : "Pick the end date"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                    />
                                </PopoverContent>
                            </Popover>

                        </div>

                        {/* VENUE */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Venue
                            </label>

                            <Input
                                name="venue"
                                placeholder="Delhi Worship Arena"
                                value={formData.venue}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* REGISTRATION + LINK */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Registration Link
                            </label>

                            <Input
                                name="registration"
                                placeholder="https://register.com"
                                value={formData.registration}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                External Link
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

                    {/* ABOUT */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            About Event
                        </label>

                        <Textarea
                            name="about"
                            placeholder="Write about the event..."
                            value={formData.about}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Event Details
                        </label>

                        {/* <Textarea
                            name="details"
                            placeholder="Additional event details..."
                            value={formData.details}
                            onChange={handleChange}
                            rows={5}
                        /> */}

                        <TiptapEditor
                            value={formData.details}
                            onChange={(json) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    details: json,
                                }))
                            }
                        />
                    </div>


                    {/* ARTISTS */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            Artists
                        </label>

                        <SelectEventArtist
                            artists={artists}
                            selectedArtists={selectedArtists}
                            setSelectedArtists={
                                setSelectedArtists
                            }
                        />
                    </div>

                    {/* SUBMIT */}
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Create Event
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}