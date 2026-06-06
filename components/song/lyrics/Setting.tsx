"use client"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
// import { getSongLyricsdata, SongLyricsdata } from "@/lib/forms/song"

import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getSongLyricsFormData, getSongLyricsSettingFormData, SongLyricsFormData, SongLyricsSettingFormData } from "@/lib/forms/song"
import {
    TempoType,
} from "@prisma/client"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSongStore } from "@/store/useSongStore"


const key = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
]
const Tempo = Object.values(TempoType)

const Setting = ({
    initialData,
    onSetSetting
}: any) => {
    // console.log(initialData, "initialData settings")
    const [show, setShow] = useState(true)
    const [setting, setSetting] = useState<SongLyricsSettingFormData>(getSongLyricsSettingFormData(initialData))
    console.log(setting, "setting ")

    useEffect(() => {
        if (!initialData) return
        setSetting(getSongLyricsSettingFormData(initialData))
    }, [initialData])

    const handleOpen = () => {
        setShow((prev) => !prev);
    };

    useEffect(() => {
        onSetSetting?.(setting);
    }, [setting, onSetSetting]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const {
            name,
            value,
            type,
        } = e.target

        setSetting(prev => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement)
                        .checked
                    : value,
        }))
    }

    // SAVE DATA
    // const handleSubmit = async () => {
    //     if (!initialData?.id) return
    //     // console.log(payload, "lyircs after payload")
    //     try {
    //         const payload = { ...setting }
    //         const res = await fetch(`/api/song/${initialData.id}`,
    //             {
    //                 method: "PATCH",
    //                 headers: { "Content-Type": "application/json", },
    //                 body: JSON.stringify(payload)
    //             }
    //         )
    //         const result = await res.json()
    //         if (!res.ok) {
    //             throw new Error(result.message || "Failed to Create Song")
    //         }
    //         toast.success("Lyrics Updated Sucessfully")
    //     }
    //     catch (error) {
    //         console.error(error)
    //         toast.error("Fail To Update Lyrics")
    //     }
    // }

  const setKey = useSongStore((state) => state.setKey);
    return (
        <div className="my-8">
            <Card >
                <CardHeader onClick={handleOpen} className="cursor-pointer">
                    <CardTitle>Setting</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                    <CardAction className="hover:bg-accent">
                        {show ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                    </CardAction>
                </CardHeader>
                {show &&
                    <CardContent>
                        {/* <form action="" method="post"> */}
                        {/* LYRICS  */}

                        {/* CHORDS */}
                        <FieldSet>
                            <div className="flex h-full items-center gap-3">
                                <Checkbox
                                    checked={
                                        setting.isChords
                                    }
                                    onCheckedChange={(
                                        checked
                                    ) =>
                                        setSetting(
                                            (prev) => ({
                                                ...prev,
                                                isChords:
                                                    Boolean(
                                                        checked
                                                    ),
                                            })
                                        )
                                    }
                                />
                                <FieldLegend className="mb-0">
                                    Chords
                                </FieldLegend>
                            </div>
                            {setting.isChords && (
                                <div className="w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                        {/* KEY */}
                                        <Field>
                                            <FieldLabel>
                                                Key
                                            </FieldLabel>
                                            <Select
                                                value={setting.key || ""}
                                                onValueChange={(
                                                    value
                                                ) =>{

                                                    setSetting(
                                                        (prev) => ({
                                                            ...prev,
                                                            key: value,
                                                        })
                                                    ),
                                                    setKey(value)
                                                }

                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select scale" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {key.map((item) => (
                                                        <SelectItem
                                                            key={item}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        {/* BPM */}
                                        <Field>
                                            <FieldLabel>
                                                BPM
                                            </FieldLabel>
                                            <Input
                                                name="bpm"
                                                placeholder="120"
                                                value={setting.bpm}
                                                onChange={
                                                    handleChange
                                                }
                                            />
                                        </Field>
                                        {/* TIME */}
                                        <Field>
                                            <FieldLabel>
                                                Time
                                            </FieldLabel>
                                            <Input
                                                name="time"
                                                placeholder="4/4"
                                                value={setting.time}
                                                onChange={
                                                    handleChange
                                                }
                                            />
                                        </Field>
                                        {/* TEMPO */}
                                        <Field>
                                            <FieldLabel>
                                                Tempo
                                            </FieldLabel>
                                            <Select
                                                value={
                                                    setting.tempo ?? ""
                                                }
                                                onValueChange={(
                                                    value
                                                ) =>
                                                    setSetting(
                                                        (prev) => ({
                                                            ...prev,
                                                            tempo: value as TempoType,
                                                        })
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select tempo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Tempo.map((t) => (
                                                        <SelectItem
                                                            key={t}
                                                            value={t}
                                                        >
                                                            {t}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>

                                    </div>
                                    {/* ACTIONS */}
                                    {/* <div className="w-full flex justify-end mt-6">
                                        <Button className="cursor-pointer" 
                                        onClick={handleSubmit}
                                        >
                                            Save
                                        </Button>
                                    </div> */}
                                </div>
                            )}
                        </FieldSet>


                        {/* </form> */}
                    </CardContent>
                }
            </Card>

        </div>
    )
}

export default Setting