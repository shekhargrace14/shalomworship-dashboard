// "use client"

// import slugify from "slugify"

// import {
//     LanguageType,
//     song,
//     StatusType,
//     TempoType,
//     VersionType,
// } from "@prisma/client"

// import { useEffect, useState } from "react"

// import { Button } from "@/components/ui/button"

// import { Checkbox } from "@/components/ui/checkbox"

// import {
//     Field,
//     FieldDescription,
//     FieldGroup,
//     FieldLabel,
//     FieldLegend,
//     FieldSeparator,
//     FieldSet,
// } from "@/components/ui/field"

// import { Input } from "@/components/ui/input"

// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

// import { Textarea } from "@/components/ui/textarea"

// import { Badge } from "@/components/ui/badge"

// import { X } from "lucide-react"
// import { SongFormData } from "@/types/song"
// import Editor from "@/components/song/editor"
// import { SelectArtist } from "@/components/shared/SelectArtist"
// // import LyricsEditor from "@/components/song/LyricsEditor"

// // import Lyrics from "@/components/song/lyrics"

// const scale = [
//     "A",
//     "B",
//     "C",
//     "D",
//     "E",
//     "F",
//     "G",
// ]

// const Language =
//     Object.values(LanguageType)

// const Status =
//     Object.values(StatusType)

// const Tempo =
//     Object.values(TempoType)

// const Version =
//     Object.values(VersionType)

// type Props = {
//     initialData?: any
// }

// type Artist = {
//     id: string
//     title: string
// }

// export default function SongForm({
//     initialData,
// }: Props) {
//     const [slugEdited, setSlugEdited] =
//         useState(false)

//     const [variantInput, setVariantInput] =
//         useState("")

//     const [keywordInput, setKeywordInput] =
//         useState("")

//     const [lyrics, setLyrics] =
//         useState({
//             arrangement: [],
//             sections: [],
//         })

//     // GET ARTIST 
//     const [artists, setArtists] = useState<Artist[]>([])
//     // console.log(artists[0].title)
//     useEffect(() => {
//         async function getArtists() {
//             const res = await fetch("/api/artist")

//             const data = await res.json()

//             // console.log(data)
//             setArtists(data.data)
//         }
//         getArtists()
//     }, [])

//     const [creatorIds, setCreatorIds] =
//         useState<Artist[]>([])

//     const [artistIds, setArtistIds] =
//         useState<Artist[]>(initialData?.artists || [])

//     const [formData, setFormData] =
//         useState<SongFormData>({
//             title: initialData?.title || "",
//             content: initialData?.title || "",
//             lyrics: initialData?.title || "",
//             lines: initialData?.title || "",
//             isChords: initialData?.title || false,
//             isTranslation: initialData?.title || false,
//             language: initialData?.title || LanguageType.en,
//             version: initialData?.title || VersionType.version_3,
//             key: initialData?.title || "",
//             bpm: initialData?.title || "",
//             time: initialData?.title || "",
//             tempo: initialData?.title || undefined,
//             image: initialData?.title || "",
//             video: initialData?.title || "",
//             videoId: initialData?.title || "",
//             audio: initialData?.title || "",
//             color: initialData?.title || "#000000",
//             slug: initialData?.title || "",
//             status: initialData?.title || StatusType.DRAFT,
//             about: initialData?.title || "",
//             excerpt: initialData?.title || "",
//             searchVariant: initialData?.title || [],
//             searchVariantInTitle: initialData?.title || false,
//             keyword: initialData?.title || [],
//             metaDescription: initialData?.title || "",
//             view: initialData?.title || 0,
//             like: initialData?.title || 0,
//         })

//     // console.log(formData,"formData")
//     const generateSlug = (
//         title: string,
//         creator: string
//     ) => {
//         return slugify(
//             `${title} ${creator}`,
//             {
//                 lower: true,
//                 strict: true,
//                 trim: true,
//             }
//         )
//     }

//     useEffect(() => {

//         if (slugEdited) return

//         setFormData(prev => ({
//             ...prev,
//             slug: generateSlug(
//                 prev.title,
//                 creatorIds[0]?.title || ""
//             ),
//         }))

//     }, [creatorIds, formData.title, slugEdited])

// const handleChange = (
//   e: React.ChangeEvent<
//     HTMLInputElement | HTMLTextAreaElement
//   >
// ) => {

//   const {
//     name,
//     value,
//     type,
//   } = e.target

//   setFormData(prev => ({
//     ...prev,

//     [name]:
//       type === "checkbox"
//         ? (e.target as HTMLInputElement)
//             .checked
//         : value,
//   }))
// }

//     const addVariant = () => {
//         if (!variantInput.trim()) return

//         setFormData((prev) => ({
//             ...prev,
//             searchVariant: [
//                 ...prev.searchVariant,
//                 variantInput.trim(),
//             ],
//         }))

//         setVariantInput("")
//     }

//     const removeVariant = (
//         index: number
//     ) => {
//         setFormData((prev) => ({
//             ...prev,
//             searchVariant:
//                 prev.searchVariant.filter(
//                     (_, i) => i !== index
//                 ),
//         }))
//     }

//     const addKeyword = () => {
//         if (!keywordInput.trim()) return

//         setFormData((prev) => ({
//             ...prev,
//             keyword: [
//                 ...prev.keyword,
//                 keywordInput.trim(),
//             ],
//         }))

//         setKeywordInput("")
//     }

//     const removeKeyword = (
//         index: number
//     ) => {
//         setFormData((prev) => ({
//             ...prev,
//             keyword: prev.keyword.filter(
//                 (_, i) => i !== index
//             ),
//         }))
//     }

//     const handleSubmit = async (
//         e: React.FormEvent<HTMLFormElement>
//     ) => {
//         e.preventDefault()

//         console.log(formData)
//         const payload = {
//             ...formData,
//             artistIds: artistIds.map(
//                 (artist) => artist.id
//             ),
//             creatorIds: creatorIds.map(
//                 (artist) => artist.id
//             ),

//         }

//         try {
//             const res = await fetch(
//                 "/api/song",
//                 {
//                     method: "POST",

//                     headers: {
//                         "Content-Type":
//                             "application/json",
//                     },

//                     body: JSON.stringify(
//                         payload
//                     ),
//                 }
//             )

//             if (!res.ok) {
//                 throw new Error(
//                     "Failed to create song"
//                 )
//             }

//             console.log("Song created")
//         } catch (error) {
//             console.error(error)
//         }
//     }

//     return (
//         <div className="w-full max-w-6xl m-4">
//             <form onSubmit={handleSubmit}>
//                 <FieldGroup>
//                     {/* HEADER */}
//                     <div className="flex justify-between items-end">
//                         <FieldSet>
//                             <FieldLegend>
//                                 Add New Song
//                             </FieldLegend>

//                             <FieldDescription>
//                                 Please fill all required
//                                 fields.
//                             </FieldDescription>
//                         </FieldSet>

//                         {/* STATUS */}
//                         <Field className="w-full max-w-xs">
//                             <FieldLabel>
//                                 Status
//                             </FieldLabel>

//                             <Select
//                                 value={formData.status}
//                                 onValueChange={(value) =>
//                                     setFormData((prev) => ({
//                                         ...prev,
//                                         status: value as StatusType,
//                                     }))
//                                 }
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>

//                                 <SelectContent>
//                                     <SelectGroup>
//                                         {Status.map((s) => (
//                                             <SelectItem
//                                                 key={s}
//                                                 value={s}
//                                             >
//                                                 {s}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectGroup>
//                                 </SelectContent>
//                             </Select>
//                         </Field>
//                     </div>

//                     <FieldSeparator />

//                     {/* BASIC */}
//                     <FieldSet>
//                         <FieldLegend>
//                             Basic Information
//                         </FieldLegend>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* TITLE */}
//                             <Field>
//                                 <FieldLabel>
//                                     Title
//                                     <span className="text-destructive">
//                                         *
//                                     </span>
//                                 </FieldLabel>

//                                 <Input
//                                     name="title"
//                                     placeholder="Amazing Grace"
//                                     value={formData.title}
//                                     onChange={handleChange}
//                                     required
//                                 />

//                                 <FieldDescription>
//                                     Original song title.
//                                 </FieldDescription>
//                             </Field>

//                             {/* SLUG */}
//                             <Field>
//                                 <FieldLabel>
//                                     Slug
//                                 </FieldLabel>

//                                 <Input
//                                     name="slug"
//                                     placeholder="amazing-grace"
//                                     value={formData.slug}
//                                     onChange={(e) => {
//                                         setSlugEdited(true)

//                                         setFormData((prev) => ({
//                                             ...prev,
//                                             slug: slugify(
//                                                 e.target.value,
//                                                 {
//                                                     lower: true,
//                                                     strict: true,
//                                                 }
//                                             ),
//                                         }))
//                                     }}
//                                 />
//                                 <Button
//                                     type="button"
//                                     onClick={() =>
//                                         setFormData(prev => ({
//                                             ...prev,
//                                             slug: slugify(prev.title)
//                                         }))
//                                     }
//                                 >
//                                     Auto Slug (Regenerate)
//                                 </Button>

//                                 <FieldDescription>
//                                     SEO friendly URL slug.
//                                 </FieldDescription>
//                             </Field>
//                         </div>
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* SEARCH VARIANTS */}
//                     <FieldSet>
//                         <FieldLegend>
//                             Search Variants
//                         </FieldLegend>

//                         <div className="space-y-4 grid grid-cols-2 gap-4">
//                             <div className="space-y-4">
//                                 <Input
//                                     placeholder="Add search variant"
//                                     value={variantInput}
//                                     onChange={(e) =>
//                                         setVariantInput(
//                                             e.target.value
//                                         )
//                                     }

//                                 />
//                                 <Button
//                                     type="button"
//                                     onClick={addVariant}
//                                 >
//                                     Add Variant
//                                 </Button>
//                             </div>


//                             <div className="flex flex-nowrap gap-2">
//                                 {formData.searchVariant.map(
//                                     (v, i) => (
//                                         <Badge
//                                             key={i}
//                                             variant="outline"
//                                             className="flex h-fit items-center gap-1"
//                                         >
//                                             {v}

//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     removeVariant(i)
//                                                 }
//                                             >
//                                                 <X className="h-3 w-3" />
//                                             </button>
//                                         </Badge>
//                                     )
//                                 )}
//                             </div>


//                         </div>
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* Artist */}
//                     <FieldSet>
//                         <FieldLegend>
//                             Artist Information
//                         </FieldLegend>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Creator */}
//                             <Field>
//                                 <FieldLabel>
//                                     Creator
//                                     <span className="text-destructive">
//                                         *
//                                     </span>
//                                 </FieldLabel>

//                                 <SelectArtist
//                                     artists={artists}
//                                     selectedArtists={creatorIds}
//                                     setSelectedArtists={setCreatorIds}
//                                     type="creator"
//                                 />

//                                 <FieldDescription>
//                                     Select the creator/production/band/church of the song.
//                                 </FieldDescription>
//                             </Field>


//                             {/* Artist */}
//                             <Field>
//                                 <FieldLabel>
//                                     Artist
//                                     <span className="text-destructive">
//                                         *
//                                     </span>
//                                 </FieldLabel>

//                                 <SelectArtist
//                                     artists={artists}
//                                     selectedArtists={artistIds}
//                                     setSelectedArtists={setArtistIds}
//                                     type="artist"
//                                 />

//                                 <FieldDescription>
//                                     Select the artist(s) of the song
//                                 </FieldDescription>
//                             </Field>




//                         </div>
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* CONTENT */}
//                     <FieldSet>
//                         <FieldLegend>
//                             About Song
//                         </FieldLegend>

//                         <div className="space-y-4">


//                             <Field>
//                                 <FieldLabel>
//                                     About Song
//                                 </FieldLabel>

//                                 <Textarea
//                                     name="about"
//                                     rows={4}
//                                     placeholder="Write about song..."
//                                     value={formData.about}
//                                     onChange={handleChange}
//                                 />
//                             </Field>

//                             <Field>
//                                 <FieldLabel>
//                                     Excerpt
//                                 </FieldLabel>

//                                 <Textarea
//                                     name="excerpt"
//                                     rows={3}
//                                     placeholder="Short excerpt..."
//                                     value={formData.excerpt}
//                                     onChange={handleChange}
//                                 />
//                             </Field>
//                         </div>
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* LANGUAGE */}
//                     <FieldSet>
//                         <FieldLegend>
//                             Language & Version
//                         </FieldLegend>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* LANGUAGE */}
//                             <Field>
//                                 <FieldLabel>
//                                     Language
//                                 </FieldLabel>

//                                 <Select
//                                     value={
//                                         formData.language
//                                     }
//                                     onValueChange={(
//                                         value
//                                     ) =>
//                                         setFormData(
//                                             (prev) => ({
//                                                 ...prev,
//                                                 language:
//                                                     value as LanguageType,
//                                             })
//                                         )
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select language" />
//                                     </SelectTrigger>

//                                     <SelectContent>
//                                         {Language.map((l) => (
//                                             <SelectItem
//                                                 key={l}
//                                                 value={l}
//                                             >
//                                                 {l}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>

//                             {/* VERSION */}
//                             <Field>
//                                 <FieldLabel>
//                                     Version
//                                 </FieldLabel>

//                                 <Select
//                                     value={
//                                         formData.version
//                                     }
//                                     onValueChange={(
//                                         value
//                                     ) =>
//                                         setFormData(
//                                             (prev) => ({
//                                                 ...prev,
//                                                 version:
//                                                     value as VersionType,
//                                             })
//                                         )
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select version" />
//                                     </SelectTrigger>

//                                     <SelectContent>
//                                         {Version.map((v) => (
//                                             <SelectItem
//                                                 key={v}
//                                                 value={v}
//                                             >
//                                                 {v}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>
//                         </div>

//                         {/* TRANSLATION */}
//                         <div className="flex items-center gap-3 mt-4">
//                             <Checkbox
//                                 checked={
//                                     formData.isTranslation
//                                 }
//                                 onCheckedChange={(
//                                     checked
//                                 ) =>
//                                     setFormData(
//                                         (prev) => ({
//                                             ...prev,
//                                             isTranslation:
//                                                 Boolean(
//                                                     checked
//                                                 ),
//                                         })
//                                     )
//                                 }
//                             />

//                             <FieldLabel>
//                                 Translation
//                             </FieldLabel>
//                         </div>
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* CHORDS */}
//                     <FieldSet>
//                         <div className="flex items-center gap-3">
//                             <Checkbox
//                                 checked={
//                                     formData.isChords
//                                 }
//                                 onCheckedChange={(
//                                     checked
//                                 ) =>
//                                     setFormData(
//                                         (prev) => ({
//                                             ...prev,
//                                             isChords:
//                                                 Boolean(
//                                                     checked
//                                                 ),
//                                         })
//                                     )
//                                 }
//                             />

//                             <FieldLegend>
//                                 Chords
//                             </FieldLegend>
//                         </div>

//                         {formData.isChords && (
//                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//                                 {/* KEY */}
//                                 <Field>
//                                     <FieldLabel>
//                                         Scale
//                                     </FieldLabel>

//                                     <Select
//                                         value={formData.key}
//                                         onValueChange={(
//                                             value
//                                         ) =>
//                                             setFormData(
//                                                 (prev) => ({
//                                                     ...prev,
//                                                     key: value,
//                                                 })
//                                             )
//                                         }
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select scale" />
//                                         </SelectTrigger>

//                                         <SelectContent>
//                                             {scale.map((s) => (
//                                                 <SelectItem
//                                                     key={s}
//                                                     value={s}
//                                                 >
//                                                     {s}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </Field>

//                                 {/* BPM */}
//                                 <Field>
//                                     <FieldLabel>
//                                         BPM
//                                     </FieldLabel>

//                                     <Input
//                                         name="bpm"
//                                         placeholder="120"
//                                         value={formData.bpm}
//                                         onChange={
//                                             handleChange
//                                         }
//                                     />
//                                 </Field>

//                                 {/* TIME */}
//                                 <Field>
//                                     <FieldLabel>
//                                         Time
//                                     </FieldLabel>

//                                     <Input
//                                         name="time"
//                                         placeholder="4/4"
//                                         value={formData.time}
//                                         onChange={
//                                             handleChange
//                                         }
//                                     />
//                                 </Field>

//                                 {/* TEMPO */}
//                                 <Field>
//                                     <FieldLabel>
//                                         Tempo
//                                     </FieldLabel>

//                                     <Select
//                                         value={
//                                             formData.tempo
//                                         }
//                                         onValueChange={(
//                                             value
//                                         ) =>
//                                             setFormData(
//                                                 (prev) => ({
//                                                     ...prev,
//                                                     tempo: value as TempoType,
//                                                 })
//                                             )
//                                         }
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select tempo" />
//                                         </SelectTrigger>

//                                         <SelectContent>
//                                             {Tempo.map((t) => (
//                                                 <SelectItem
//                                                     key={t}
//                                                     value={t}
//                                                 >
//                                                     {t}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </Field>
//                             </div>
//                         )}
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* LYRICS  */}
//                     <FieldSet>
//                         <Field>
//                             <FieldLabel>
//                                 Lyrics
//                             </FieldLabel>

//                             {/* <Editor /> */}
//                             <Editor
//                                 onSongChange={(songData) => {

//                                     setFormData((prev) => ({
//                                         ...prev,

//                                         lyrics: songData,
//                                     }))
//                                 }}
//                             />
//                         </Field>
//                     </FieldSet>

//                     {/* MEDIA */}
//                     <FieldSet>
//                         <FieldLegend>
//                             Media
//                         </FieldLegend>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <Input
//                                 name="videoId"
//                                 placeholder="YouTube Video ID"
//                                 value={
//                                     formData.videoId
//                                 }
//                                 onChange={
//                                     handleChange
//                                 }
//                             />

//                             <Input
//                                 name="video"
//                                 placeholder="Video URL"
//                                 value={formData.video}
//                                 onChange={
//                                     handleChange
//                                 }
//                             />

//                             <Input
//                                 name="audio"
//                                 placeholder="Audio URL"
//                                 value={formData.audio}
//                                 onChange={
//                                     handleChange
//                                 }
//                             />

//                             <Input
//                                 name="image"
//                                 placeholder="Image URL"
//                                 value={formData.image}
//                                 onChange={
//                                     handleChange
//                                 }
//                             />

//                             <Input
//                                 type="color"
//                                 name="color"
//                                 value={formData.color}
//                                 onChange={
//                                     handleChange
//                                 }
//                             />
//                         </div>
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* SEO */}
//                     <FieldSet>
//                         <FieldLegend>
//                             SEO
//                         </FieldLegend>

//                         <div className="space-y-4">
//                             {/* META DESCRIPTION */}
//                             <Textarea
//                                 name="metaDescription"
//                                 rows={4}
//                                 placeholder="Meta description..."
//                                 value={
//                                     formData.metaDescription
//                                 }
//                                 onChange={handleChange}
//                             />

//                             {/* KEYWORDS */}
//                             <div className="space-y-3">
//                                 <Input
//                                     placeholder="Add keyword"
//                                     value={keywordInput}
//                                     onChange={(e) =>
//                                         setKeywordInput(
//                                             e.target.value
//                                         )
//                                     }
//                                 />

//                                 <div className="flex flex-wrap gap-2">
//                                     {formData.keyword.map(
//                                         (k, i) => (
//                                             <Badge
//                                                 key={i}
//                                                 variant="secondary"
//                                             >
//                                                 {k}

//                                                 <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         removeKeyword(
//                                                             i
//                                                         )
//                                                     }
//                                                 >
//                                                     <X className="ml-1 h-3 w-3" />
//                                                 </button>
//                                             </Badge>
//                                         )
//                                     )}
//                                 </div>

//                                 <Button
//                                     type="button"
//                                     onClick={addKeyword}
//                                 >
//                                     Add Keyword
//                                 </Button>
//                             </div>
//                         </div>
//                     </FieldSet>

//                     <FieldSeparator />

//                     {/* ACTIONS */}
//                     <div className="flex gap-2">
//                         <Button type="submit">
//                             Submit
//                         </Button>

//                         <Button
//                             variant="outline"
//                             type="button"
//                         >
//                             Cancel
//                         </Button>
//                     </div>
//                 </FieldGroup>
//             </form>
//         </div>
//     )
// }