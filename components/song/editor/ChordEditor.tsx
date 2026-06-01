"use client"

import { useState } from "react"

import { ArrowDown, ArrowUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Chord = {
  root: string
  number: string
  quality: string
  space: string
}

const ROOTS = [
  "C",
  "D",
  "E",
  "F",
  "G",
  "A",
  "B",
  "Bb",
  "Ab",
]

const QUALITIES = [
  "major",
  "minor",
  "m",
  "m7",
  "sus4",
  "maj7",
]
type Props = {
  line: any,
  sectionId: any,
  onAddChord: (

    sectionId: number,
    lineId: number
  ) => void
  onUpdateChord: any,
  onMoveChordLeft: any,
  onMoveChordRight: any,
}

export default function ChordsEditor({
  line,
  sectionId,
  onAddChord,
  onUpdateChord,
  onMoveChordLeft,
  onMoveChordRight,

}: Props) {

  // console.log(
  //   "CHORDS LENGTH",
  //   line.chords.length,
  //   line.chords
  // )

  const [showChordEditor, setShowChordEditor] = useState(false);



  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-foreground">
          Chords
        </h2>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // console.log("BUTTON CLICKED")
            setShowChordEditor(true)
            onAddChord(
              sectionId,
              line.id
            )

          }}
        >
          + Add chord
        </Button>
      </div>

      {line.chords.length > 0 ?

        <div className="space-y-5">
          <p>
            Total chords:
            {line.chords.length}
          </p>
          {line.chords.map(
            (chord: any, index: any) => (
              <div
                key={index}
                className="
              flex
              justify-between
              gap-4
              group
              "
              >
                <div className="w-[15%] space-y-2 ">
                  <label>
                    Root {chord.root}
                  </label>

                  <Select
                    value={chord.root}

                    onValueChange={(value) =>
                      onUpdateChord(
                        sectionId,
                        line.id,
                        index,
                        "root",
                        value
                      )
                    }
                  >
                    <SelectTrigger
                      className="w-20"
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {ROOTS.map(
                        (root) => (
                          <SelectItem
                            key={root}
                            value={root}
                          >
                            {root}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* NUMBER */}
                <div className="w-[15%] space-y-2 ">
                  <label>
                    Number
                  </label>

                  <Input
                    className=""
                    value={
                      chord.number
                    }
                    onChange={(e) =>
                      onUpdateChord(
                        sectionId,
                        line.id,
                        index,
                        "number",
                        Number(e.target.value)

                      )
                    }

                  />
                </div>

                {/* QUALITY */}
                <div className="w-[15%] space-y-2 ">
                  <label>
                    Quality
                  </label>

                  <Select

                    value={
                      chord.quality
                    }
                    onValueChange={(
                      value
                    ) =>
                      onUpdateChord(
                        sectionId,
                        line.id,
                        index,
                        "quality",
                        value
                      )
                    }
                  >
                    <SelectTrigger
                      className="w-24"

                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {QUALITIES.map(
                        (
                          quality
                        ) => (
                          <SelectItem
                            key={
                              quality
                            }
                            value={
                              quality
                            }
                          >
                            {
                              quality
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* POSITION */}
                <div className="w-[15%] space-y-2 ">
                  <label>
                    Position
                  </label>

                  <Input
                    value={
                      chord.space
                    }
                    onChange={(e) =>
                      onUpdateChord(
                        sectionId,
                        line.id,
                        index,
                        "position",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                {/* FUNCTIONS */}
                <div className="w-[15%]">
                  <div className={`h-full hidden transition group-hover:flex items-center justify-between`}>
                    <Button size="icon" variant="outline" onClick={() => onMoveChordLeft(sectionId, line.id, chord.id)}>
                      <ArrowUp />
                    </Button>

                    <Button size="icon" variant="outline" onClick={() => onMoveChordRight(sectionId, line.id, chord.id)}>
                      <ArrowDown />
                    </Button>
                    {/* DELETE */}

                    <Button
                      size="icon"
                      variant="outline"
                      className="text-red-500"
                    // onClick={() => onDeleteLine(section.id, line.id)}
                    >
                      <X />
                    </Button>
                  </div>
                </div>

                {/* PREVIEW */}
                <div className="w-[10%] flex items-end justify-center">
                  <div
                    className="
                    flex items-end gap-1

                    rounded-2xl

                    bg-slate-900

                    px-4 py-3

                    text-white
                  "
                  >
                    <span
                      className="
                      text-lg
                      font-semibold
                    "
                    >
                      {chord.root}
                    </span>



                    <span
                      className="
                      text-sm
                      opacity-80
                    "
                    >
                      {chord.quality}
                    </span>
                    /
                    <span
                      className="
                      text-base
                      opacity-80
                    "
                    >
                      {chord.number}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        : "Click on Add Chord"
      }
    </div>
  )
}