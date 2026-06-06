"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import Lyrics from "@/components/song/lyrics"
import SongBasicForm from "@/components/song/form/SongBasicForm"
import { useParams } from "next/navigation"

import SongCreditsForm from "@/components/song/form/SongCreditsForm"

// Define the form state interface
interface FormState {
  title: string
  genre: string
  producer: string
  songwriter: string
  lyrics: string
  metaTitle: string
  metaDescription: string
}

const initialFormState: FormState = {
  title: "",
  genre: "",
  producer: "",
  songwriter: "",
  lyrics: "",
  metaTitle: "",
  metaDescription: "",
}

export default function Page() {
  const isEdit = true
  const params = useParams()

  const id = params.id as string


  const [song, setSong] = useState()
  console.log(song, "song at page")

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/song/${id}`)

      if (!res.ok) {
        console.error("API Error", res.status)
        const text = await res.text()
        console.error(text)
        return
      }

      const data = await res.json()

      setSong(data.song)
    }

    if (id) {
      load()
    }

  }, [id, setSong])

  // console.log(song)


  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormState>(initialFormState)

  const updateField = (key: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (step < 4) setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1)
  }
  const handleSaveDraft = () => {
    alert("Draft saved successfully!")
  }

  const handlePublish = () => {
    // console.log("Publishing final data...", formData)
    alert("Song published successfully!")
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Step Progress Bar */}
      <div className="flex items-center justify-between mb-8 px-2">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-colors ${step === num
                ? "bg-primary text-primary-foreground border-primary"
                : step > num
                  ? "bg-muted text-muted-foreground border-muted"
                  : "bg-background text-muted-foreground border-input"
                }`}
            >
              {num}
            </div>
            {num < 4 && (
              <div
                className={`h-[2px] flex-1 mx-2 transition-colors ${step > num ? "bg-muted" : "bg-input"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
      {/* Form Wizard Card */}
      {step === 1 && (
        <>
          <SongBasicForm onHandleNext={handleNext} onHandleSaveDraft={handleSaveDraft} initialData={song} isEdit />
        </>
      )}

      {step === 2 && (
        <>
          {/* <SongCreditsForm
            initialData={song}
            updateField={updateField}
            handleBack={handleBack}
            handleNext={handleNext}
          /> */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Next: Manage Lyrics</Button>
          </div>
        </>

      )}

      {step === 3 && (
        <>
          <Lyrics initialData={song} />
          <div className="flex justify-between">

            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Next: Manage SEO</Button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <CardHeader>
            <CardTitle>Manage SEO</CardTitle>
            <CardDescription>Optimize your song page visibility for search engines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Meta Title"
                value={formData.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Meta Description"
                className="min-h-[100px]"
                value={formData.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button onClick={handlePublish}>
                Publish Song
              </Button>
            </div>
          </CardFooter>
        </>
      )}


    </div>
  )
}