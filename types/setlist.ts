import { Prisma } from '@prisma/client';

import type { SongSearchItem } from '@/lib/search/types';

export type Visibility = 'PRIVATE' | 'PUBLIC' | 'UNLISTED';

export type ItemType = 'SONG' | 'NOTE' | 'SCRIPTURE';

export type Metadata = {
  title: string;
  theme: string;
  description: string;
  scripture: string;
  eventAt: Date | undefined;
  visibility: Visibility;
  notes: string;
};

export type FormItem = {
  id: string;

  type: ItemType;

  songId: string;
  song: SongSearchItem | null; // UI only

  notes: string;

  order: number;
};

export type FormSection = {
  id: string;

  title: string;
  notes: string;

  order: number;

  items: FormItem[];
};

export type SetlistContent = {
  sections: FormSection[];
};

export type SetlistForm = {
  metadata: Metadata;
  sections: FormSection[];
};

export type UpdateSectionField = (sectionId: string, key: keyof Pick<FormSection, 'title' | 'notes'>, value: string) => void;

export type AddItem = (sectionId: string, type?: ItemType) => void;

type EditableItemField = Pick<FormItem, 'type' | 'songId' | 'song' | 'notes'>;

export type UpdateItemField = (sectionId: string, itemId: string, key: keyof EditableItemField, value: EditableItemField[keyof EditableItemField]) => void;

export type RemoveItem = (sectionId: string, itemId: string) => void;
