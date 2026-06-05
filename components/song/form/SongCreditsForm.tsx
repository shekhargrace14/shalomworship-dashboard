"use client"
import { PATCH } from '@/app/api/event/[id]/route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Credit } from '@/types/song'
import { Table, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"


const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const SongCreditsForm = ({ initialData, handleBack, handleNext }: any) => {
    // console.log(initialData, "initialData")

    const [credits, setCredits] = useState<Credit[]>(initialData.credits)
    const [artists, setArtists] = useState()
    const [formData, setFormData] = useState((initialData))

    useEffect(() => {
        async function getArtist() {
            // const res = await fetch(`/api/artist`)
            const res = await fetch(`/api/artist/${credits[0].artistId}`)

            if (!res.ok) {
                console.log("API Error", res.status)
                const text = await res.text()
                console.error(text)
                return
            }
            const data = await res.json()
            setArtists(data.data)

        }
        getArtist()

        // ALL ARTIST
        async function getArtists() {
            // const res = await fetch(`/api/artist`)
            const res = await fetch(`/api/artist`)

            if (!res.ok) {
                console.log("API Error", res.status)
                const text = await res.text()
                console.error(text)
                return
            }
            const data = await res.json()
            setArtists(data.data)

        }
        getArtists()

    }, [])

    // console.log(artist, "artist")
    const removeCredit = ({ index }: any) => {
        toast.message("Credits Remove")
        // console.log(index, "Credits Remove")
    }
    const updateField = ({ key, value }: any) => {
        setFormData((prev: any) => ({
            ...prev,

        }))
    }
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()
        const payload = {}
        try {
            const res = await fetch(`api/artist`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            )
            toast.success("Save Sucessfully")
        }
        catch (error) {
            console.error(error)
            toast.error("Fail")
        }
    }

    return (
        <div>

            {/* <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.invoice}>
                            <TableCell className="font-medium">{invoice.invoice}</TableCell>
                            <TableCell>{invoice.paymentStatus}</TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table> */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Credits</CardTitle>
                    <CardDescription>Attribute the creators behind this piece.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Producer Name"
                            // value={credits}
                        // onChange={(e) => updateField("producer", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            placeholder="Songwriter Name"
                            value={formData.songwriter}
                        // onChange={(e) => updateField("songwriter", e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                        Back
                    </Button>
                    <Button onClick={handleNext}>Next: Manage Lyrics</Button>
                </CardFooter>
            </Card>


        </div>
    )
}

export default SongCreditsForm