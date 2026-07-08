import { LanguageType, StatusType, VersionType, TempoType } from '@prisma/client';

export type SongBasicFormData = {
  title: string;
  language: LanguageType;
  slug: string;
  status: StatusType;
  searchVariant: string[];
  searchVariantInTitle: boolean;
  isTranslation: boolean;
  channelId: string;
  version: VersionType;
};

export type SongLyricsSettingFormData = {
  isChords: boolean;
  key: string;
  bpm: string;
  time: string;
  tempo?: TempoType;
};

export type SongLyricsFormData = {
  content: string;
  lyrics: string;
  lines: any;
};

export type SongSeoFormData = {
  about: string;
  excerpt: string;
  keyword: string[];
  metaDescription: string;
};

export type SongMediaFormData = {
  image: string;
  video: string;
  videoId: string;
  audio: string;
  color: string;
};

export type SongCategoryFormData = {
  category: string[];

}

export type SongDefaultData = {
  title: string;
  language: LanguageType;
  slug: string;
  status: StatusType;

  version: VersionType;
  content: string;
  lyrics: string;
  lines: any;
  isChords: boolean;
  isTranslation: boolean;
  key: string;
  bpm: string;
  time: string;
  tempo?: TempoType;

  about: string;
  excerpt: string;
  keyword: string[];
  metaDescription: string;

  image: string;
  video: string;
  videoId: string;
  audio: string;
  color: string;

  searchVariant: string[];
  searchVariantInTitle: boolean;

  view: number;
  like: number;
};

export const getDefaultSongData = () => ({
  title: '',
  language: LanguageType.en,
  slug: '',
  status: StatusType.DRAFT,

  version: VersionType.version_4,
  content: '',
  lyrics: '',
  lines: '',
  isChords: false,
  isTranslation: false,
  key: '',
  bpm: '',
  time: '',
  tempo: undefined,

  about: '',
  excerpt: '',
  keyword: [],
  metaDescription: '',

  image: '',
  video: '',
  videoId: '',
  audio: '',
  color: '#000000',

  searchVariant: [],
  searchVariantInTitle: false,

  view: 0,
  like: 0,
});
export const getSongBasicFormData = (initialData?: any) => ({
  title: initialData?.title || '',
  language: initialData?.language || LanguageType.en,
  isTranslation: initialData?.isTranslation || false,
  slug: initialData?.slug || '',
  status: initialData?.status || StatusType.DRAFT,
  searchVariant: initialData?.searchVariant || [],
  searchVariantInTitle: initialData?.searchVariantInTitle || false,
  channelId: initialData?.channelId || '',
  version: initialData?.version || VersionType.version_4,
});
export const getSongLyricsSettingFormData = (initialData?: any) => ({
  version: initialData?.version || VersionType.version_4,
  isChords: initialData?.isChords || false,
  key: initialData?.key || '',
  bpm: initialData?.bpm || '',
  time: initialData?.time || '',
  tempo: initialData?.tempo,
});
export const getSongLyricsFormData = (initialData?: any) => ({
  version: initialData?.version || VersionType.version_4,
  content: initialData?.content || '',
  lyrics: initialData?.lyrics || '',
  lines: initialData?.lines || '',
});
export const getSongSeoFormData = (initialData?: any) => ({
  about: initialData?.about || '',
  excerpt: initialData?.excerpt || '',
  keyword: initialData?.keyword || [],
  metaDescription: initialData?.metaDescription || '',
});

export const getSongMediaFormData = (initialData?: any) => ({
  image: initialData?.image || '',
  video: initialData?.video || '',
  videoId: initialData?.videoId || '',
  audio: initialData?.audio || '',
  color: initialData?.color || '#000000',
});

export const getSongCategoryFormData = (initialData?:any) => ({

  category: initialData?.category || [],

})
