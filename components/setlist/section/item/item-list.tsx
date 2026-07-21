import React from 'react';
import ItemCard from './item-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { AddItem, FormSection, RemoveItem, UpdateItemField } from '@/types/setlist';

type Props = {
  addItem: AddItem;
  section: FormSection;
  updateItemField: UpdateItemField;
  removeItem: RemoveItem;
};
const ItemList = ({ section, addItem, updateItemField, removeItem }: Props) => {
  return (
    <div>
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

        <ItemCard section={section} updateItemField={updateItemField} removeItem={removeItem} />
      </div>
    </div>
  );
};

export default ItemList;
