"use client"

import * as React from "react"

import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Artist = {
  id: string
  title: string
}

type ArtistSelectProps = {
  artists: Artist[]
  selectedArtists: Artist[]
  setSelectedArtists: React.Dispatch<
    React.SetStateAction<Artist[]>
  >
}

export function SelectEventArtist({
  artists,
  selectedArtists,
  setSelectedArtists,
}: ArtistSelectProps) {
  const [open, setOpen] = React.useState(false)

  const addArtist = (artist: Artist) => {
    const exists = selectedArtists.some(
      (a) => a.id === artist.id
    )

    if (exists) return

    setSelectedArtists((prev) => [...prev, artist])

    setOpen(false)
  }

  const removeArtist = (id: string) => {
    setSelectedArtists((prev) =>
      prev.filter((artist) => artist.id !== id)
    )
  }

  const availableArtists = artists.filter(
    (artist) =>
      !selectedArtists.some(
        (selected) => selected.id === artist.id
      )
  )

  return (
    <div className="space-y-3">
      {/* SEARCHABLE INPUT */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedArtists.length > 0
              ? `${selectedArtists.length} artist selected`
              : "Search `artist..."}
 
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-100 p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Type artist name..." />

            <CommandList>
              <CommandEmpty>
                No artist found.
              </CommandEmpty>

              <CommandGroup>
                {availableArtists.map((artist) => {
                  const isSelected =
                    selectedArtists.some(
                      (a) => a.id === artist.id
                    )

                  return (
                    <CommandItem
                      key={artist.id}
                      value={artist.title}
                      onSelect={() => addArtist(artist)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />

                      {artist.title}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* SELECTED ARTISTS */}
      {selectedArtists.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedArtists.map((artist) => (
            <div
              key={artist.id}
              className="
                flex items-center gap-1
                rounded-md border
                bg-muted/40
                px-2 py-1 text-sm
              "
            >
              {artist.title}

              <button
                type="button"
                aria-label={`Remove ${artist.title}`}
                onClick={() => removeArtist(artist.id)}
                className="
                  rounded-sm p-0.5
                  hover:bg-muted
                "
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}