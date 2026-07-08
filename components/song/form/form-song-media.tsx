'use client';

import { FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getSongMediaFormData, SongMediaFormData } from '@/lib/forms/song';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Media</FieldLegend>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input name="videoId" placeholder="YouTube Video ID" value={formData.videoId} onChange={handleChange} />

          <Input name="video" placeholder="Video URL" value={formData.video} onChange={handleChange} />

          <Input name="audio" placeholder="Audio URL" value={formData.audio} onChange={handleChange} />

          <Input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />

          <Input type="color" name="color" value={formData.color} onChange={handleChange} />
        </div>
        <Button type="submit" className="mt-4">
          Save Media
        </Button>
      </FieldSet>
    </form>
  );
};

export default FormSongMedia;
