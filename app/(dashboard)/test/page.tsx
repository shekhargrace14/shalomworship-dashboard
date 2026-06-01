"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export default function SimpleForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    console.log(formData)

    alert(
      `Name: ${formData.name}\nAge: ${formData.age}`
    )
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>
          User Form
        </CardTitle>

        <CardDescription>
          Enter your details below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Name
            </label>

            <Input
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* AGE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Age
            </label>

            <Input
              type="number"
              name="age"
              placeholder="18"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* SUBMIT */}
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