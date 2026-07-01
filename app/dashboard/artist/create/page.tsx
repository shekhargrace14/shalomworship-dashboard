"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
// import ArtistForm from "@/components/artist/ArtistForm"
import { date } from "zod"


export default function page() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        try {

            console.log("Form Submitted")

            const res = await fetch("/api/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    slug: slug,
                })
            })
            if (!res.ok) {
                throw new Error("Request failed")
            }
            const data = await res.json()

            console.log(data)
            toast.success("Category added")

            router.push("/category")

        } catch (err) {
            console.error("Submit Error", err)
        }
    }
    return (
        // <ArtistForm />
        <p></p>
    )
}