import React from 'react';
import ItemList from './item/item-list';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  section: any;
  updateSectionField: any;
  addItem: any;
  updateItemField: any;
  removeItem: any;
};

const SectionCard = ({ section, updateSectionField, addItem, updateItemField, removeItem }: Props) => {
  return (
    <div>
      {/* Section Card ////////////// */}
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
        <ItemList section={section} addItem={addItem} updateItemField={updateItemField} removeItem={removeItem} />
      </CardContent>
    </div>
  );
};

export default SectionCard;
