'use client';

import { FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getSongMediaFormData, SongMediaFormData } from '@/lib/forms/song';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const FormSongMedia = ({ initialData, isEdit }: any) => {
  const [formData, setFormData] = useState<SongMediaFormData>(getSongMediaFormData(initialData));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/song/${initialData.id}`, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save media');
      }

      toast.success('Media details saved successfully');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to save media');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <FieldLegend>Media</FieldLegend>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-base font-semibold text-foreground">Video Id</label>
                  <Input name="videoId" placeholder="YouTube Video ID" value={formData.videoId} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-semibold text-foreground">Video</label>
                  <Input name="video" placeholder="Video URL" value={formData.video} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-semibold text-foreground">Audio</label>
                  <Input name="audio" placeholder="Audio URL" value={formData.audio} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-semibold text-foreground">Image</label>
                  <Input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-semibold text-foreground">Color</label>
                  <Input type="color" name="color" value={formData.color} onChange={handleChange} />
                </div>
              </div>
              <Button type="submit" className="mt-4">
                Save Media
              </Button>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSongMedia;
