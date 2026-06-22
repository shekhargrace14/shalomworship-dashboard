"use client"

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
import NashvilleHelpPopup from "@/components/NashvilleHelpPopup"
import { generateChordFamily } from "../chord/generateChordFamily"

const QUALITIES = [
  // Major
  "major",

  // Minor
  "m",

  // Power
  "5",

  // Sixth
  "6",
  "m6",

  // Seventh
  "7",
  "m7",
  "maj7",

  // Ninth
  "add9",
  "9",
  "m9",
  "maj9",

  // Eleventh
  "11",

  // Thirteenth
  "13",

  // Suspended
  "sus2",
  "sus4",
  "7sus4",

  // Added tones
  "add2",
  "add4",

  // Diminished
  "dim",
  "dim7",

  // Augmented
  "aug",

  // Altered
  "7b5",
  "7#5",
  "7b9",
  "7#9",
];

type Props = {
  line: any,
  sectionId: any,
  onAddChord: (sectionId: number, lineId: number) => void
  onUpdateChord: any,
  onMoveChordLeft: any,
  onMoveChordRight: any,
  initialData: any,
  onDeleteChord: any,
  onAddGeneratedChord: any;
}

export default function ChordsEditor({
  line,
  sectionId,
  onAddChord,
  onDeleteChord,
  onUpdateChord,
  onMoveChordLeft,
  onMoveChordRight,
  initialData,
  onAddGeneratedChord,
}: Props) {

  console.log(line, "line")
  const key = initialData?.key
  const chords = generateChordFamily(key || "C");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 justify-center items-center">

          <h2 className="text-foreground font-semibold">
            Chords (Key: {key ? key : "-"})
          </h2>
          {/* <NashvilleHelpPopup key={"C"} /> */}
        </div>
        <div className="flex flex-wrap gap-2">
          {chords.map((chord) => (
            <Button
              key={chord.nashville}
              variant="outline"
              onClick={() => {
                onAddGeneratedChord(
                  sectionId,
                  line.id,
                  {
                    root: chord.root,
                    quality: chord.quality,
                    nashville: chord.nashville,
                  }
                )
                // console.log(chord)
              }
            }
            >
              {chord.root}
              {chord.quality !== "major" && chord.quality}
              {" "}-
              {chord.nashville}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => onAddChord(sectionId, line.id)}
        >
          + Add chord
        </Button>
      </div>

      {line.chords.length > 0 ? (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Total chords: {line.chords.length}
          </p>

          {line.chords.map((chord: any, index: any) => {
            // Evaluates instantly regardless of whether the user typed 'bb', 'F#', 'g', etc.
            // const currentNashville = getNashville(key, chord.root, chord.bass) ?? ""

            return (
              <div
                key={chord.id || index}
                className="flex items-end justify-between gap-4 group border-b pb-4 last:border-0 last:pb-0"
              >
                {/* ROOT */}
                <div className="w-[12%] space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Root
                  </label>
                  <Input
                    value={chord.root ?? ""}
                    placeholder="e.g. F#, Bb"
                    onChange={(e) => {

                      const val = e.target.value;
                      // 1. Force the first character to be Uppercase, and subsequent characters to be Lowercase
                      const formattedVal = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                      // Allows letters and the symbols # or b
                      if (formattedVal === "" || /^[a-gA-G#b]+$/.test(formattedVal)) {
                        onUpdateChord(
                          sectionId,
                          line.id,
                          index,
                          "root",
                          formattedVal
                        )
                      }
                    }

                    }
                  />
                </div>

                {/* QUALITY */}
                <div className="w-[12%] space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Quality
                  </label>
                  <Select
                    value={chord.quality || "major"}
                    onValueChange={(value) =>
                      onUpdateChord(
                        sectionId,
                        line.id,
                        index,
                        "quality",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALITIES.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* NASHVILLE */}
                <div className="w-[12%] space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Nashville
                  </label>
                  <Input
                    value={chord.nashville || 0}
                    placeholder="e.g. 1, 6, 4, 5"
                    onChange={(e) =>
                      onUpdateChord(
                        sectionId,
                        line.id,
                        index,
                        "nashville",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                {/* BASS */}
                <div className="w-[12%] space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Bass <span className="text-[10px] opacity-60">(Optional)</span>
                  </label>
                  <Input
                    value={chord.bass ?? ""}
                    placeholder="e.g. F#, Bb"
                    onChange={(e) => {

                      const val = e.target.value;
                      // 1. Force the first character to be Uppercase, and subsequent characters to be Lowercase
                      const formattedVal = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                      // Allows letters and the symbols # or b
                      if (formattedVal === "" || /^[a-gA-G#b]+$/.test(formattedVal)) {
                        onUpdateChord(
                          sectionId,
                          line.id,
                          index,
                          "bass",
                          formattedVal
                        )
                      }
                    }

                    }
                  />
                </div>
                {/* POSITION */}
                <div className="w-[12%] space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Position
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={chord.position ?? 0}
                    placeholder="e.g. 5, 18..."
                    onChange={(e) => {
                      const value = Number(e.target.value)

                      onUpdateChord(
                        sectionId,
                        line.id,
                        index,
                        "position",
                        Math.max(0, value)
                      )
                    }}
                  />
                </div>

                {/* FUNCTIONS */}
                <div className="w-[12%] flex items-center justify-end gap-1 h-10">
                  <div className="hidden transition group-hover:flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => onMoveChordLeft(sectionId, line.id, chord.id)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => onMoveChordRight(sectionId, line.id, chord.id)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteChord(sectionId, line.id, chord.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* PREVIEW */}
                <div className="w-[10%] flex justify-end">
                  <div className="grid items-center gap-1 rounded-xl bg-slate-900 px-2 py-2 text-white w-fit justify-center shadow-sm">
                    <div className="flex items-center justify-center">

                      <span className="text-sm font-bold">
                        {chord.root || "?"}
                      </span>

                      {chord.quality && chord.quality !== "major" && (
                        <span className="text-xs font-medium text-slate-300">
                          {chord.quality === "major" ? "" : chord.quality}
                        </span>
                      )}

                      {chord.bass && (
                        <>
                          /
                          <span className="text-sm font-semibold text-slate-400">
                            {chord.bass}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="">
                      <span className="text-xs ml-0 px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono font-bold">
                        {chord.nashville}
                        {chord.quality !== "major" && (
                          chord.quality
                        )}
                      </span>
                    </div>

                    {/* {currentNashville ? (
                      <span className="text-xs ml-1.5 px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono font-bold">
                        {currentNashville}
                      </span>
                    ) : (
                      <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-slate-800 text-amber-500 font-mono">
                        -
                      </span>
                    )} */}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground border-2 border-dashed rounded-lg p-6 text-center">
          Click on Add Chord to begin styling this section.
        </div>
      )}
    </div>
  )
}