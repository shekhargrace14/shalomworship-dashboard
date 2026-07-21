'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { category, song } from '@prisma/client';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SongWithDetails } from '@/types';

type SongCategoryItem = {
  id: string;
  categoryId: string;
  category: category;
};

type Props = {
  initialData: SongWithDetails | null;
  isEdit: boolean;
};

export default function FormSongCategory({ initialData, isEdit }: Props) {
  const [search, setSearch] = useState('');

  const [categories, setCategories] = useState<category[]>([]);

  const [results, setResults] = useState<category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<category | null>(null);

  const [songCategories, setSongCategories] = useState<SongCategoryItem[]>(initialData?.category ?? []);

  const [showResults, setShowResults] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);

        const response = await fetch('/api/category');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch categories');
        }

        setCategories(data.data ?? []);
        setResults(data.data ?? []);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    setSelectedCategory(null);
    setShowResults(true);

    const query = value.trim().toLowerCase();

    if (!query) {
      setResults(categories);
      return;
    }

    setResults(
      categories.filter(
        (category) => category.title.toLowerCase().includes(query),
        //     ||
        //   category.slug
        //     .toLowerCase()
        //     .includes(query)
      ),
    );
  }

  function selectCategory(category: category) {
    setSelectedCategory(category);
    setSearch(category.title);
    setShowResults(false);
  }

  function addCategory() {
    if (!selectedCategory) {
      toast.error('Select a category first.');
      return;
    }

    const alreadyAdded = songCategories.some((item) => item.categoryId === selectedCategory.id);

    if (alreadyAdded) {
      toast.error('This category is already added.');
      return;
    }

    setSongCategories((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        categoryId: selectedCategory.id,
        category: selectedCategory,
      },
    ]);

    setSearch('');
    setSelectedCategory(null);
    setResults(categories);
  }

  function removeCategory(categoryId: string) {
    setSongCategories((previous) => previous.filter((item) => item.categoryId !== categoryId));
  }

  async function saveCategories() {
    try {
      setIsSaving(true);

      const response = await fetch(`/api/song/${initialData?.id}/category`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        //   body: JSON.stringify({
        //     categoryIds: songCategories.map(
        //       (item) => item.categoryId
        //     ),
        //   }),
        body: JSON.stringify({
          categories: songCategories.map((item) => ({
            categoryId: item.categoryId,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save categories');
      }

      setSongCategories(data.data);
      toast.success('Categories saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save categories');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Song Categories</CardTitle>

        <Badge variant="secondary">{songCategories.length} Categories</Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid items-end gap-4 lg:grid-cols-12">
          <div className="relative lg:col-span-10">
            <label className="mb-2 block text-sm font-medium">Category</label>

            <Input
              placeholder="Search category..."
              value={search}
              onFocus={() => {
                setResults(categories);
                setShowResults(true);
              }}
              onChange={(event) => handleSearch(event.target.value)}
            />

            {showResults && (
              <div className="absolute top-[72px] z-50 w-full overflow-hidden rounded-md border bg-background shadow-lg">
                {isLoadingCategories && <p className="p-4 text-sm text-muted-foreground">Loading categories...</p>}

                {!isLoadingCategories && results.length === 0 && <p className="p-4 text-sm text-muted-foreground">No category found.</p>}

                {!isLoadingCategories && results.length > 0 && (
                  <div className="flex max-h-72 flex-col gap-1 overflow-y-auto p-2">
                    {results.map((category) => (
                      <button type="button" key={category.id} onClick={() => selectCategory(category)} className="w-full rounded-md p-2 text-left hover:bg-accent">
                        <p className="font-medium">{category.title}</p>
                        {/* 
                          <p className="text-sm text-muted-foreground">
                            {category.slug}
                          </p> */}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <Button type="button" onClick={addCategory} disabled={!selectedCategory} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {songCategories.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No categories added yet.</div>}

          {songCategories.map((item) => (
            <div key={item.categoryId} className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-medium">{item.category.title}</p>

                <p className="text-sm text-muted-foreground">{item.category.slug}</p>
              </div>

              <Button type="button" size="icon" variant="ghost" onClick={() => removeCategory(item.categoryId)} disabled={isSaving}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t pt-6">
          <Button type="button" onClick={saveCategories} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Categories'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
