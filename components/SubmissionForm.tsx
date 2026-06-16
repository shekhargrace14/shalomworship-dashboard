"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SubmissionForm() {
  const [formData, setFormData] = useState({
    type: "CONTACT",
    name: "",
    email: "",
    title: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    console.log(formData)

    // POST /api/submission
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          Submit Request
        </CardTitle>

        <CardDescription>
          Send us your feedback,
          request, suggestion, or report.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* TYPE */}
          <div className="space-y-2">
            <Label>
              Submission Type
            </Label>

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
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="CONTACT">
                  Contact
                </SelectItem>

                <SelectItem value="SONG_REQUEST">
                  Song Request
                </SelectItem>

                <SelectItem value="ARTIST_REQUEST">
                  Artist Suggestion
                </SelectItem>

                <SelectItem value="EVENT_REQUEST">
                  Event Submission
                </SelectItem>

                <SelectItem value="BUG_REPORT">
                  Bug Report
                </SelectItem>

                <SelectItem value="TESTIMONY">
                  Testimony
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NAME + EMAIL */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>

              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* TITLE */}
          <div className="space-y-2">
            <Label>Title</Label>

            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <Label>Message</Label>

            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Describe your request..."
            />
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}