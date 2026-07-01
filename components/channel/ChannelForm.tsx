'use client';

import slugify from 'slugify';

import { channel, ChannelType, user } from '@prisma/client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DeleteItemButton } from '../shared/DeleteItemButton';
import { useUserStore } from '@/store/useUserStore';

type FormProps = {
  initialData?: channel | null;
  isEdit?: boolean;
};


function formatEnumLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ChannelForm({ initialData, isEdit }: FormProps) {
  const router = useRouter();
  const [slugEdited, setSlugEdited] = useState(false);
  const user = useUserStore((state) => state.user);

  // console.log(user)

  function getInitialFormData(
    channel: FormProps["initialData"],
    user?: user | null
  ) {
    return {
      createdById: channel?.createdById || user?.id,
      title: channel?.title || '',
      type: channel?.type ?? undefined,
      website: channel?.website || '',
      avatar: channel?.avatar || '',
      description: channel?.description || '',
      slug: channel?.slug || '',
      color: channel?.color || '#000000',
      email: channel?.email || '',
      instagram: channel?.instagram || '',
      youtube: channel?.youtube || '',
      spotify: channel?.spotify || '',
      appleMusic: channel?.appleMusic || '',
      amazonMusic: channel?.amazonMusic || '',
      youtubeMusic: channel?.youtubeMusic || '',
      tidal: channel?.tidal || '',
      deezer: channel?.deezer || '',
      soundCloud: channel?.soundCloud || '',
      pandora: channel?.pandora || '',
      verified: channel?.verified ?? false,
    };
  }

  const [formData, setFormData] = useState(getInitialFormData(initialData, user));
  // console.log(formData)

  useEffect(() => {
    // if (initialData) {
    setFormData(getInitialFormData(initialData, user));
    // }
  }, [initialData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    const updates: Record<string, any> = {
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    };

    // auto-generate slug from title
    if (name === 'title' && !slugEdited) {
      updates.slug = slugify(value, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const endpoint = isEdit ? `/api/channel/${initialData?.id}` : '/api/channel';

    const method = isEdit ? 'PATCH' : 'POST';

    const payload = { ...formData };
    // console.log("payload", payload)

    try {
      const res = await fetch(endpoint, {
        method,

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save channel');
      }

      toast.success(isEdit ? 'Channel updated successfully' : 'Channel created successfully');

      // console.log("Channel saved")
      router.push('/dashboard/channel');
    } catch (error: any) {
      toast.error(isEdit ? `${error} Channel updated failed` : `${error} Channel created failed`);
      console.error(error.message);
    }
  };

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Channel' : 'Create Channel'}</CardTitle>

        <CardDescription>Manage Channel profile and streaming platforms.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <section className="space-y-6">
            {/* Creator */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Creator Name
                  <span className="ml-1 text-destructive">*</span>
                </label>
                <p>{user?.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Creator Id
                  <span className="ml-1 text-destructive">*</span>
                </label>

                <Input name="title" placeholder="Creator Name" value={formData.createdById} onChange={handleChange} required disabled />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <p className="text-sm text-muted-foreground">Main Channel details and identity.</p>
            </div>
            {/* TITLE + TYPE */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Channel Name
                  <span className="ml-1 text-destructive">*</span>
                </label>

                <Input name="title" placeholder="Channel Name" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Channel Type</label>

                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.values(ChannelType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatEnumLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SLUG + EMAIL */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* SLUG */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>

                <Input
                  name="slug"
                  placeholder="Channel-name"
                  value={formData.slug}
                  onChange={(e) => {
                    setSlugEdited(true);

                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }));
                  }}
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>

                <Input type="email" name="email" placeholder="Channel@email.com" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            {/* IMAGE + WEBSITE */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* IMAGE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Channel Image</label>

                <Input name="image" placeholder="https://..." value={formData.avatar} onChange={handleChange} />
              </div>

              {/* WEBSITE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>

                <Input name="link" placeholder="https://..." value={formData.website} onChange={handleChange} />
              </div>
            </div>

            {/* COLOR */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme Color</label>

              <Input type="color" name="color" value={formData.color} onChange={handleChange} className="h-12 p-1" />
            </div>

            {/* VERIFIED */}
            <div className="flex items-center gap-3">
              <input id="verified" type="checkbox" name="isVerified" checked={formData.verified} onChange={handleChange} className="h-4 w-4" />

              <label htmlFor="verified" className="text-sm font-medium">
                Verified Channel
              </label>
            </div>

            {/* ABOUT */}
            <div className="space-y-2">
              <label className="text-sm font-medium">About Channel</label>

              <Textarea name="about" placeholder="Write Channel biography..." rows={6} value={formData.description} onChange={handleChange} />
            </div>
          </section>

          {/* SOCIAL LINKS */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Social Media</h2>

              <p className="text-sm text-muted-foreground">Channel social profiles.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input name="instagram" placeholder="Instagram URL" value={formData.instagram} onChange={handleChange} />

              <Input name="youtube" placeholder="YouTube URL" value={formData.youtube} onChange={handleChange} />
            </div>
          </section>

          {/* STREAMING */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Streaming Platforms</h2>

              <p className="text-sm text-muted-foreground">Music platform links.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input name="spotify" placeholder="Spotify URL" value={formData.spotify} onChange={handleChange} />

              <Input name="appleMusic" placeholder="Apple Music URL" value={formData.appleMusic} onChange={handleChange} />

              <Input name="amazonMusic" placeholder="Amazon Music URL" value={formData.amazonMusic} onChange={handleChange} />

              <Input name="youTubeMusic" placeholder="YouTube Music URL" value={formData.youtubeMusic} onChange={handleChange} />

              <Input name="tidal" placeholder="Tidal URL" value={formData.tidal} onChange={handleChange} />

              <Input name="deezer" placeholder="Deezer URL" value={formData.deezer} onChange={handleChange} />

              <Input name="soundCloud" placeholder="SoundCloud URL" value={formData.soundCloud} onChange={handleChange} />

              <Input name="pandora" placeholder="Pandora URL" value={formData.pandora} onChange={handleChange} />
            </div>
          </section>

          {/* SUBMIT */}
          <Button type="submit" className="w-full">
            {isEdit ? 'Update Channel' : 'Create Channel'}
          </Button>
        </form>
      </CardContent>
      {isEdit && <DeleteItemButton id={initialData?.id} type="channel" />}
    </Card>
  );
}
