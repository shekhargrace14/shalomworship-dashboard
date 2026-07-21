import SectionCard from './section-card';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddItem, RemoveItem, UpdateItemField, UpdateSectionField } from '@/types/setlist';

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

type Props = {
  sections: FormSection[];

  addSection: () => void;

  removeSection: (sectionId: string) => void;

  updateSectionField: UpdateSectionField;

  addItem: AddItem;
  updateItemField: UpdateItemField;

  removeItem: RemoveItem;
};
const SectionList = ({ sections, addSection, removeSection, updateSectionField, addItem, updateItemField, removeItem }: Props) => {
  return (
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
                    <CardTitle className="text-base">
                      Section
                      {sectionIndex + 1}
                    </CardTitle>
                    <Badge variant="secondary">
                      Order
                      {sectionIndex + 1}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Organize songs or notes in this section.</p>
                </div>
              </div>

              <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(section.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
            <SectionCard section={section} updateSectionField={updateSectionField} addItem={addItem} updateItemField={updateItemField} removeItem={removeItem} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectionList;
