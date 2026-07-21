// import React from 'react'

// const SectionEdit = () => {
//   return (
//     <div>
//         jaksjfkasjfk
//     </div>
//   )
// }

// export default SectionEdit

'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, GripVertical, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setlist } from '@prisma/client';

type ItemType = 'SONG' | 'NOTE' | 'SCRIPTURE';
type Visibility = 'PRIVATE' | 'PUBLIC' | 'UNLISTED';

type FormItem = {
  id: string;
  type: ItemType;
  songId: string;
  notes: string;
};

type FormSection = {
  id: string;
  title: string;
  notes: string;
  items: FormItem[];
};

function createItem(type: ItemType = 'SONG'): FormItem {
  return {
    id: crypto.randomUUID(),
    type,
    songId: '',
    notes: '',
  };
}

function createSection(): FormSection {
  return {
    id: crypto.randomUUID(),
    title: '',
    notes: '',
    items: [createItem()],
  };
}

export default function SectionEdit({ channelId, data }: { channelId: string; data: setlist }) {
  const router = useRouter();
  const params = useParams();

  const [initialData, setInitialData] = useState<setlist>(data);

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [sections, setSections] = useState<FormSection[]>([createSection()]);

  useEffect(() => {
    async function loadSetlist() {
      try {
        const res = await fetch(`/api/channel/${channelId}/setlists/${params.setlistId}`);
        const json = await res.json();
        const currentSetlist = json.data;

        if (currentSetlist) {
          setInitialData(currentSetlist);

          // Populate master details fields

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
    return title.trim().length > 0 && sections.length > 0;
  }, [title, sections]);

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

  function updateItemField(sectionId: string, itemId: string, key: keyof Pick<FormItem, 'type' | 'songId' | 'notes'>, value: string) {
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

      const res = await fetch('/api/setlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to create setlist');
      }

      router.push(`/channel/${channelId}/setlists`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Sections</h2>
            <p className="text-sm text-muted-foreground">Add verses, choruses, notes, and scripture blocks.</p>
          </div>

          <Button type="button" variant="outline" onClick={addSection}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">Section {sectionIndex + 1}</CardTitle>
                      <Badge variant="secondary">Order {sectionIndex + 1}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Organize songs or notes in this section.</p>
                  </div>
                </div>

                <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(section.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input placeholder="Verse 1" value={section.title} onChange={(e) => updateSectionField(section.id, 'title', e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Section Notes</Label>
                    <Input placeholder="Optional notes for this section" value={section.notes} onChange={(e) => updateSectionField(section.id, 'notes', e.target.value)} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Items</h3>
                      <p className="text-sm text-muted-foreground">Add songs, notes, or scripture references.</p>
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => addItem(section.id, 'SONG')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={item.id} className="rounded-xl border bg-muted/20 p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Item {itemIndex + 1}</Badge>
                          </div>

                          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(section.id, item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="space-y-2 md:col-span-1">
                            <Label>Type</Label>
                            <Select value={item.type} onValueChange={(value) => updateItemField(section.id, item.id, 'type', value as ItemType)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SONG">Song</SelectItem>
                                <SelectItem value="NOTE">Note</SelectItem>
                                <SelectItem value="SCRIPTURE">Scripture</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {item.type === 'SONG' ? (
                            <div className="space-y-2 md:col-span-2">
                              <Label>Song ID</Label>
                              <Input placeholder="Paste song id here" value={item.songId} onChange={(e) => updateItemField(section.id, item.id, 'songId', e.target.value)} />
                            </div>
                          ) : (
                            <div className="space-y-2 md:col-span-2">
                              <Label>{item.type === 'NOTE' ? 'Note' : 'Scripture'}</Label>
                              <Input placeholder={item.type === 'NOTE' ? 'Short note for this item' : 'Bible reference or scripture text'} value={item.notes} onChange={(e) => updateItemField(section.id, item.id, 'notes', e.target.value)} />
                            </div>
                          )}

                          <div className="space-y-2 md:col-span-1">
                            <Label>Order</Label>
                            <Input value={itemIndex + 1} disabled />
                          </div>
                        </div>

                        {item.type === 'SONG' && (
                          <div className="mt-4 space-y-2">
                            <Label>Item Notes</Label>
                            <Textarea placeholder="Optional notes for the song..." value={item.notes} onChange={(e) => updateItemField(section.id, item.id, 'notes', e.target.value)} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
