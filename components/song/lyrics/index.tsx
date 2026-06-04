"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Section from './Section'
import { Badge } from '@/components/ui/badge'
// import Section from './Section'


type Song = {
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

// type Chord = {
//     root: string
//     number: string
//     quality: string
//     space: string
// }

type Chord = {
    id: number

    root: string
    number: number
    quality: string

    position: number
}
type Props = {
    onSongChange: (song: Song) => void
}
export default function Lyrics(){

    const [song, setSong] = useState<Song>({ arrangement: [] })

    // console.log(song, "song")
    useEffect(() => {

        // onSongChange(song)

    }, [song])

    const addArrangement = () => {
        setSong((prev) => ({

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

        setSong((prev) => ({

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

        setSong((prev) => ({

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

    // Line

    const addLine = (sectionId: number) => {

        setSong((prev) => ({

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

        setSong((prev) => ({

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

        setSong((prev) => ({

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

        setSong((prev) => ({

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

    // Chords

    const addChord = (
        sectionId: number,
        lineId: number
    ) => {
        //   console.log("ADD CHORD", sectionId, lineId)

        setSong((prev) => ({

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
                                            number: 0,
                                            quality: "",
                                            position: 0,
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

    const updateChord = (
        sectionId: number,
        lineId: number,
        chordIndex: number,
        field: "root" | "number" | "quality" | "space",
        value: string
    ) => {

        setSong((prev) => ({

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

    // Move sections 

    const moveSectionUp = (
        sectionId: number
    ) => {

        setSong((prev) => {

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

        setSong((prev) => {

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

        setSong((prev) => ({

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

        setSong((prev) => ({

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


    // Move Chords
    const moveChordLeft = (
        sectionId: number,
        lineId: number,
        chordId: number
    ) => {

        setSong((prev) => ({

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

        setSong((prev) => ({

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


    return (
        <div className='p-4 rounded-3xl'>
            <div className="flex gap-4 mb-4">
                {song.arrangement.map((a) => (
                    <Badge key={a.id}>
                        {a.type}-
                        {a.label}
                    </Badge>
                ))}
            </div>
            {
                song.arrangement.map((section) => (
                    <Section
                        key={section.id}
                        lang="default"
                        label={section.label}

                        section={section}

                        onRemoveArrangment={removeArrangment}
                        onUpdate={updateArrangement}

                        onUpdateLine={updateLine}
                        onAddLine={addLine}
                        onUpdateLineField={updateLineField}
                        onDeleteLine={deleteLine}

                        onAddChord={addChord}
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
        </div>
    )
}
