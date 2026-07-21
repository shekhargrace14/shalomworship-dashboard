'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchSong from '@/components/search/search-song';
import { FormItem, FormSection, ItemType } from '@/types/setlist';
import { Trash2 } from 'lucide-react';

type Props = {
  section: FormSection;
  updateItemField: (sectionId: string, itemId: string, key: keyof Pick<FormItem, 'type' | 'songId' | 'notes'>, value: string) => void;
  removeItem: (sectionId: string, itemId: string) => void;
};

const ItemCard = ({ section, updateItemField, removeItem }: Props) => {
  return (
    <div>
      <div className="space-y-3">
        {section.items.map((item, itemIndex) => (
          <div key={item.id} className="rounded-xl border bg-muted/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Item
                  {itemIndex + 1}
                </Badge>
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
                  <Label>Search Song</Label>
                  {/* <HeaderSearch /> */}
                  <SearchSong
                    // value={item.song}
                    onSelect={(song) => {
                      // updateItemField(section.id, item.id, "song", song);
                      updateItemField(section.id, item.id, 'songId', song.id);
                    }}
                  />

                  {/* <Input placeholder="Paste song id here" value={item.songId} onChange={(e) => updateItemField(section.id, item.id, 'songId', e.target.value)} /> */}
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
  );
};

export default ItemCard;
