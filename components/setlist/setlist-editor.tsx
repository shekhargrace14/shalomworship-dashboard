'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SectionList from './section/section-list';
import SetlistMetadata from './setlist-metadata';
import { FormItem, FormSection, ItemType, Metadata, Visibility } from '@/types/setlist';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { SetlistDelete } from './setlist-delete';

// import type {
//   Metadata,
//   FormSection,
//   FormItem,
// } from "@/types/setlist-editor";

type Props = {
  metadata: Metadata;
  setMetadata: React.Dispatch<React.SetStateAction<Metadata>>;
  loading: boolean;
  canSave: boolean;
  channelId: string;
  handleSubmit: () => void;
};

function createItem(type: ItemType = 'SONG'): FormItem {
  return {
    id: crypto.randomUUID(),
    type,
    songId: '',
    song: null,
    notes: '',
    order: 0,
  };
}

function createSection(): FormSection {
  return {
    id: crypto.randomUUID(),
    title: '',
    notes: '',
    order: 0,
    items: [createItem()],
  };
}

const SetlistEditor = ({ data }: { data: Metadata }) => {
  const router = useRouter();
  const params = useParams<{
    channelId: string;
    setlistId: string;
  }>();
  // const params = useParams();
  const channelId = params.channelId;
  const setlistId = params.setlistId;

  type Metadata = {
    title: string;
    theme: string;
    description: string;
    scripture: string;
    notes: string;
    eventAt: Date | undefined;
    visibility: Visibility;
  };

  const [metadata, setMetadata] = useState<Metadata>({
    title: data.title ?? '',
    theme: data.theme ?? '',
    description: data.description ?? '',
    scripture: data.scripture ?? '',
    notes: data.notes ?? '',
    eventAt: data.eventAt ? new Date(data.eventAt) : undefined,
    visibility: (data.visibility as Visibility) ?? 'PRIVATE',
  });

  const [loading, setLoading] = useState(false);

  const [sections, setSections] = useState<FormSection[]>([createSection()]);

  useEffect(() => {
    async function loadSetlist() {
      try {
        const res = await fetch(`/api/channel/${channelId}/setlists/${setlistId}`);
        const json = await res.json();
        const currentSetlist = json.data;

        if (currentSetlist) {
          // setInitialData(currentSetlist);

          // Populate master details fields
          setMetadata({
            title: currentSetlist.title ?? '',
            theme: currentSetlist.theme ?? '',
            description: currentSetlist.description ?? '',
            scripture: currentSetlist.scripture ?? '',
            notes: currentSetlist.notes ?? '',
            eventAt: currentSetlist.eventAt ? new Date(currentSetlist.eventAt) : undefined,
            visibility: (currentSetlist.visibility as Visibility) ?? 'PRIVATE',
          });

          // Populate nested sections and items if they exist in the incoming database record
          if (currentSetlist.sections && currentSetlist.sections.length > 0) {
            const mappedSections = currentSetlist.sections.map((sec: any) => ({
              id: sec.id || crypto.randomUUID(),
              title: sec.title || '',
              notes: sec.notes || '',
              items:
                sec.items && sec.items.length > 0
                  ? sec.items.map((item: any) => ({
                      id: item.id || crypto.randomUUID(),
                      type: (item.type as ItemType) || 'SONG',
                      songId: item.songId || '',
                      notes: item.notes || '',
                    }))
                  : [createItem()],
            }));
            setSections(mappedSections);
          }
        }
      } catch (err) {
        console.error('Failed to load initial setlist data:', err);
      }
    }
    loadSetlist();
  }, [channelId, params.setlistId]);

  const canSave = useMemo(() => {
    return metadata.title.trim().length > 0 && sections.length > 0;
  }, [metadata.title, sections]);

  function addSection() {
    setSections((prev) => [...prev, createSection()]);
  }

  function removeSection(sectionId: string) {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  }

  function updateSectionField(sectionId: string, key: keyof Pick<FormSection, 'title' | 'notes'>, value: string) {
    setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, [key]: value } : section)));
  }

  function addItem(sectionId: string, type: ItemType = 'SONG') {
    setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, items: [...section.items, createItem(type)] } : section)));
  }

  function removeItem(sectionId: string, itemId: string) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section,
      ),
    );
  }

  function updateItemField(sectionId: string, itemId: string, key: 'type' | 'songId' | 'song' | 'notes', value: FormItem['type'] | FormItem['songId'] | FormItem['song'] | FormItem['notes']) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      [key]: value,
                    }
                  : item,
              ),
            }
          : section,
      ),
    );
  }

  async function handleSubmit() {
    if (!canSave) return;

    setLoading(true);

    try {
      const payload = {
        title: metadata.title.trim(),
        theme: metadata.theme.trim() || null,
        description: metadata.description.trim() || null,
        scripture: metadata.scripture.trim() || null,
        eventAt: metadata.eventAt ? metadata.eventAt.toISOString() : null,
        visibility: metadata.visibility,
        notes: metadata.notes.trim() || null,

        sections: sections.map((section, sectionIndex) => ({
          title: section.title.trim(),
          order: sectionIndex + 1,
          notes: section.notes.trim() || null,

          items: section.items.map((item, itemIndex) => ({
            type: item.type,
            order: itemIndex + 1,
            songId: item.type === 'SONG' && item.songId.trim() ? item.songId.trim() : null,
            notes: item.notes.trim() || null,
          })),
        })),
      };

      const res = await fetch(`/api/channel/${channelId}/setlists/${setlistId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to update setlist');
      }

      router.push(`/dashboard/channel/${channelId}/setlists/${setlistId}`);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* <SetlistEdit channelId={channelId} data={data}/> */}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Channel</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Edit Setlist</h1>

          <p className="text-muted-foreground">Build a worship setlist with sections, songs, notes, and scripture references.</p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button type="button" onClick={handleSubmit} disabled={!canSave || loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Setlist'}
          </Button>
        </div>
      </div>

      <SetlistMetadata metadata={metadata} setMetadata={setMetadata} loading={loading} canSave={canSave} handleSubmit={handleSubmit} channelId={channelId} />

      <SectionList sections={sections} addSection={addSection} removeSection={removeSection} updateSectionField={updateSectionField} addItem={addItem} updateItemField={updateItemField} removeItem={removeItem} />

      <SetlistDelete channelId={channelId} setlistId={setlistId} setlistTitle={metadata.title} />
    </div>
  );
};

export default SetlistEditor;
