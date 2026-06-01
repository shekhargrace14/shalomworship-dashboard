import {
  LanguageType,
  StatusType,
  TempoType,
  VersionType,
} from "@prisma/client"




export type SongFormData = {
  title: string
  content: string

  lyrics: any

  lines?: any

  isChords: boolean
  isTranslation: boolean

  language: LanguageType
  version: VersionType

  key?: string
  bpm?: string
  time?: string

  tempo?: TempoType

  image?: string
  video?: string
  videoId?: string
  audio?: string
  color?: string

  slug: string

  status: StatusType

  about?: string
  excerpt?: string

  searchVariant: string[]
  searchVariantInTitle: boolean

  keyword: string[]

  metaDescription: string

  view: number
  like: number
}