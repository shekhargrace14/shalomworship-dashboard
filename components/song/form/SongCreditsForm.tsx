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




const SongCreditsForm = ({ initialData, handleBack, handleNext }: any) => {


    return (


                <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                        Back
                    </Button>
                    <Button onClick={handleNext}>Next: Manage Lyrics</Button>
                </div>

    )
}

export default SongCreditsForm