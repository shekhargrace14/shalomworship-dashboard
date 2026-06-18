"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Section from './Section'
import { Badge } from '@/components/ui/badge'
import { toast } from "sonner"
import Setting from './Setting'
import { getSongLyricsSettingFormData, SongLyricsSettingFormData } from '@/lib/forms/song'

// import Section from './Section'


type Lyrics = {
    arrangement: Section[]
}
type Section = {
    id: number
    type: string
    label: string
    repeat: number
    lines: Line[]
}
type Line = {
    id: number

    lyrics: {
        english: string
        native: string
        translation: string
    }
    chords: Chord[]

    indent: number

    sectionBreak: boolean
}

type Chord = {
    id: number
    root: string
    nashville: number
    quality: string
    position: number
    bass:string
}

export default function Lyrics({ initialData, isEdit }: any) {

    // console.log(initialData.lyrics, "initialData")

    const [lyrics, setLyrics] = useState<Lyrics>({ arrangement: [] })
    const generateId = () => Date.now() + Math.random()

    // console.log(lyrics, "lyrics")

    useEffect(() => {
        if (!initialData?.lyrics) return
        setLyrics(initialData.lyrics)
    }, [initialData])

    // section
    const addArrangement = () => {
        setLyrics((prev) => ({
            ...prev,
            arrangement: [
                ...prev.arrangement,
                {
                    id: Date.now(),
                    type: "verse",
                    label: "Verse",
                    repeat: 1,
                    lines: [],
                },
            ],
        }))
    }
    const removeArrangment = (id: number) => {
        setLyrics((prev) => ({
            ...prev,
            arrangement: prev.arrangement.filter(
                (section) => section.id !== id
            ),
        }))
    }
    const updateArrangement = (
        id: number,
        field: string,
        value: any
    ) => {

        setLyrics((prev) => ({
            ...prev,
            arrangement: prev.arrangement.map(
                (section) =>
                    section.id === id
                        ? {
                            ...section,
                            [field]: value,
                        }
                        : section
            ),

        }))
    }
    const duplicateSection = (sectionId: number) => {
        setLyrics(prev => ({
            ...prev,

            arrangement: prev.arrangement.flatMap(section => {
                if (section.id !== sectionId) {
                    return [section]
                }

                const duplicatedSection = {
                    ...section,

                    id: Date.now(),

                    lines: section.lines.map(line => ({
                        ...line,

                        id: Date.now() + Math.random(),

                        chords: line.chords.map(chord => ({
                            ...chord,
                            id: Date.now() + Math.random(),
                        })),
                    })),
                }

                return [
                    section,
                    duplicatedSection,
                ]
            }),
        }))
    }
    // Line

    const addLine = (sectionId: number) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) =>

                section.id === sectionId

                    ? {
                        ...section,

                        lines: [

                            ...section.lines,

                            {
                                id: Date.now(),

                                lyrics: {
                                    english: "",
                                    native: "",
                                    translation: "",
                                },

                                chords: [],

                                indent: 0,

                                sectionBreak: false,
                            },

                        ],
                    }

                    : section
            ),

        }))
    }

    const updateLine = (
        sectionId: number,
        lineId: number,
        field: "english" | "native" | "translation",
        value: string
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) =>

                section.id === sectionId

                    ? {
                        ...section,

                        lines: section.lines.map((line) =>

                            line.id === lineId

                                ? {
                                    ...line,

                                    lyrics: {
                                        ...line.lyrics,

                                        [field]: value,
                                    },
                                }

                                : line
                        ),
                    }

                    : section
            ),
        }))
    }

    const deleteLine = (
        sectionId: number,
        lineId: number
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) =>

                section.id === sectionId

                    ? {
                        ...section,

                        lines: section.lines.filter(
                            (line) =>
                                line.id !== lineId
                        ),
                    }

                    : section
            ),

        }))
    }

    const updateLineField = (
        sectionId: number,
        lineId: number,
        field: "indent" | "sectionBreak",
        value: number | boolean
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) =>

                section.id === sectionId

                    ? {
                        ...section,

                        lines: section.lines.map((line) =>

                            line.id === lineId

                                ? {
                                    ...line,

                                    [field]: value,
                                }

                                : line
                        ),
                    }

                    : section
            ),
        }))
    }

    const duplicateLine = (
        sectionId: number,
        lineId: number
    ) => {
        setLyrics(prev => ({
            ...prev,

            arrangement: prev.arrangement.map(section =>
                section.id === sectionId
                    ? {
                        ...section,

                        lines: section.lines.flatMap(line => {
                            if (line.id !== lineId) {
                                return [line]
                            }

                            const duplicatedLine = {
                                ...line,

                                id: generateId(),

                                chords: line.chords.map(chord => ({
                                    ...chord,
                                    id: generateId(),
                                })),
                            }

                            return [
                                line,
                                duplicatedLine,
                            ]
                        }),
                    }
                    : section
            ),
        }))
    }

    // Chords

    const addChord = (
        sectionId: number,
        lineId: number
    ) => {
        //   console.log("ADD CHORD", sectionId, lineId)

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) =>

                section.id === sectionId

                    ? {
                        ...section,

                        lines: section.lines.map((line) =>

                            line.id === lineId

                                ? {
                                    ...line,

                                    chords: [

                                        ...line.chords,

                                        {
                                            id: Date.now(),
                                            root: "",
                                            nashville:0,
                                            quality: "",
                                            position: 0,
                                            bass:"",
                                        },

                                    ],
                                }

                                : line
                        ),
                    }

                    : section
            ),

        }))
    }
    const addGeneratedChord = (
        sectionId: number,
        lineId: number,
        chordData: any
    ) => {
        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) =>

                section.id === sectionId

                    ? {
                        ...section,

                        lines: section.lines.map((line) =>

                            line.id === lineId

                                ? {
                                    ...line,

                                    chords: [

                                        ...line.chords,

                                        {
                                            id: Date.now(),
                                            root: chordData.root,
                                            nashville: chordData.nashville,
                                            quality: chordData.quality,
                                            bass:chordData.bass,
                                            position: 0,
                                        }

                                    ],
                                }

                                : line
                        ),
                    }

                    : section
            ),

        }))
    }
    const updateChord = (
        sectionId: number,
        lineId: number,
        chordIndex: number,
        field: "root" | "number" | "quality" | "space",
        value: string
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) =>

                section.id === sectionId

                    ? {
                        ...section,

                        lines: section.lines.map((line) =>

                            line.id === lineId

                                ? {
                                    ...line,

                                    chords: line.chords.map((chord, index) =>

                                        index === chordIndex

                                            ? {
                                                ...chord,
                                                [field]: value,
                                            }

                                            : chord
                                    ),
                                }

                                : line
                        ),
                    }

                    : section
            ),

        }))
    }
    const deleteChord = (
        sectionId: number,
        lineId: number,
        chordId: number,
    ) => {
        setLyrics((prev) => ({
            ...prev,

            arrangement: prev.arrangement.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,

                        lines: section.lines.map((line) =>
                            line.id === lineId
                                ? {
                                    ...line,

                                    chords: line.chords.filter(
                                        (chord) => chord.id !== chordId
                                    ),
                                }
                                : line
                        ),
                    }
                    : section
            ),
        }))
    }


    // Move Chords
    const moveChordLeft = (
        sectionId: number,
        lineId: number,
        chordId: number
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) => {

                if (section.id !== sectionId)
                    return section

                return {

                    ...section,

                    lines: section.lines.map((line) => {

                        if (line.id !== lineId)
                            return line

                        const chords = [...line.chords]

                        const index = chords.findIndex(
                            (chord) => chord.id === chordId
                        )

                        if (index <= 0)
                            return line

                                ;[
                                    chords[index - 1],
                                    chords[index]
                                ] = [
                                        chords[index],
                                        chords[index - 1]
                                    ]

                        return {
                            ...line,
                            chords,
                        }
                    }),
                }
            }),
        }))
    }
    const moveChordRight = (
        sectionId: number,
        lineId: number,
        chordId: number
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) => {

                if (section.id !== sectionId)
                    return section

                return {

                    ...section,

                    lines: section.lines.map((line) => {

                        if (line.id !== lineId)
                            return line

                        const chords = [...line.chords]

                        const index = chords.findIndex(
                            (chord) => chord.id === chordId
                        )

                        if (
                            index === -1 ||
                            index === chords.length - 1
                        )
                            return line

                                ;[
                                    chords[index],
                                    chords[index + 1]
                                ] = [
                                        chords[index + 1],
                                        chords[index]
                                    ]

                        return {
                            ...line,
                            chords,
                        }
                    }),
                }
            }),
        }))
    }

    // Move sections 
    const moveSectionUp = (
        sectionId: number
    ) => {

        setLyrics((prev) => {

            const arrangement = [
                ...prev.arrangement
            ]

            const index =
                arrangement.findIndex(
                    (section) =>
                        section.id === sectionId
                )

            if (index <= 0)
                return prev

                    ;[
                        arrangement[index - 1],
                        arrangement[index]
                    ] = [
                            arrangement[index],
                            arrangement[index - 1]
                        ]

            return {
                ...prev,
                arrangement,
            }
        })
    }

    const moveSectionDown = (
        sectionId: number
    ) => {

        setLyrics((prev) => {

            const arrangement = [
                ...prev.arrangement
            ]

            const index =
                arrangement.findIndex(
                    (section) =>
                        section.id === sectionId
                )

            if (
                index === -1 ||
                index === arrangement.length - 1
            )
                return prev

                    ;[
                        arrangement[index],
                        arrangement[index + 1]
                    ] = [
                            arrangement[index + 1],
                            arrangement[index]
                        ]

            return {
                ...prev,
                arrangement,
            }
        })
    }

    // Move lines 

    const moveLineUp = (
        sectionId: number,
        lineId: number
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) => {

                if (section.id !== sectionId)
                    return section

                const lines = [...section.lines]

                const index = lines.findIndex(
                    (line) => line.id === lineId
                )

                console.log("LINE INDEX", index)

                if (index <= 0)
                    return section

                        ;[
                            lines[index - 1],
                            lines[index]
                        ] = [
                                lines[index],
                                lines[index - 1]
                            ]

                return {
                    ...section,
                    lines,
                }
            }),
        }))
    }

    const moveLineDown = (
        sectionId: number,
        lineId: number
    ) => {

        setLyrics((prev) => ({

            ...prev,

            arrangement: prev.arrangement.map((section) => {

                if (section.id !== sectionId)
                    return section

                const lines = [...section.lines]

                const index = lines.findIndex(
                    (line) => line.id === lineId
                )

                if (
                    index === -1 ||
                    index === lines.length - 1
                )
                    return section

                        ;[
                            lines[index],
                            lines[index + 1]
                        ] = [
                                lines[index + 1],
                                lines[index]
                            ]

                return {
                    ...section,
                    lines,
                }
            }),
        }))
    }





    // SAVE DATA
    const handleSubmit = async () => {
        const payload = { lyrics: lyrics }
        // console.log(payload, "lyircs after payload")
        try {
            const res = await fetch(`/api/song/${initialData.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(payload)
                }
            )
            if (!res.ok) {
                throw new Error("Failed to Create Song")
            }
            toast.success("Lyrics Updated Sucessfully")
        }
        catch (error) {
            console.error(error)
            toast.error("Fail To Update Lyrics")
        }
    }


    return (
        <div className='p-4 rounded-3xl'>


            <div className="flex gap-4 mb-4">
                {lyrics.arrangement.map((a) => (
                    <Badge key={a.id}>
                        {/* {a.type} */}
                        {a.label}
                    </Badge>
                ))}
            </div>
            {
                lyrics.arrangement.map((section) => (
                    <Section
                        key={section.id}
                        label={section.label}
                        lyrics={lyrics}
                        section={section}
                        initialData={initialData}

                        onRemoveArrangment={removeArrangment}
                        onUpdate={updateArrangement}
                        onUpdateSectionField={updateArrangement}
                        onDuplicateSection={duplicateSection}

                        onUpdateLine={updateLine}
                        onAddLine={addLine}
                        onUpdateLineField={updateLineField}
                        onDeleteLine={deleteLine}
                        onDuplicateLine={duplicateLine}

                        onAddChord={addChord}
                        onAddGeneratedChord={addGeneratedChord}
                        onDeleteChord={deleteChord}
                        onUpdateChord={updateChord}

                        onMoveUp={moveSectionUp}
                        onMoveDown={moveSectionDown}

                        onMoveLineUp={moveLineUp}
                        onMoveLineDown={moveLineDown}

                        onMoveChordLeft={moveChordLeft}
                        onMoveChordRight={moveChordRight}

                    />
                ))
            }
            <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={addArrangement}
            >
                +   Add Section
            </Button>

            <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleSubmit}
            >
                Save
            </Button>
        </div>
    )
}
