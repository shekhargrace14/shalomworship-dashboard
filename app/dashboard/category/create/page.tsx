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
        <div className="w-full max-w-6xl m-4">
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    < div className="flex justify-between items-end">
                        <FieldSet>
                            <FieldLegend>Add New Catergory</FieldLegend>
                            <FieldDescription >
                                Please Fill all the <span className="text-destructive">*</span> Mark Fields
                            </FieldDescription>
                        </FieldSet>
                    </div>
                    <FieldSeparator />
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    Title<span className="text-muted-foreground text-xs">(required)</span>
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-name-43j"
                                    placeholder="Evil Rabbit"
                                    required
                                    aria-required="true"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <FieldDescription>
                                    Please fill only song's orignal name. eg: Sang Tere , Praise. This is mandatory field.
                                </FieldDescription>
                            </Field>
                            {/* Title Variant  */}

                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    Slug
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-name-43j"
                                    placeholder="Evil Rabbit"
                                    required
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                                <FieldDescription>
                                    /cateogry/slug-artistname-id. Please fill only song name and add aritst/production name.
                                </FieldDescription>
                            </Field>
                        </div>
                    </FieldGroup>
                    <FieldSeparator />
                </FieldGroup>
                <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}