'use client';
import slugify from 'slugify';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SongFormData } from '@/types/song';
import { LanguageType, StatusType, VersionType } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { ArrowBigRight, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { getSongBasicFormData, getSongLyricsSettingFormData, SongBasicFormData, SongLyricsSettingFormData } from '@/lib/forms/song';
import StatusButton from '@/components/shared/StatusButton';
import { getLanguageOptions } from '@/utils/getLanguageName';
import Setting from '../lyrics/Setting';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';
import { SongWithDetails } from '@/types';

const Status = Object.values(StatusType);
const Version = Object.values(VersionType);
const Language = Object.values(LanguageType);
type Props = {
  initialData?: SongWithDetails;
  isEdit?: boolean;
};

const FormSongBasic = ({ initialData, isEdit }: Props) => {
  console.log(initialData);
  if (isEdit) {
    var id = initialData?.id;
  }
  const router = useRouter();
  const [slugEdited, setSlugEdited] = useState(false);
  const [variantInput, setVariantInput] = useState('');
  const [language, setLanguage] = useState();
  const [formData, setFormData] = useState<SongBasicFormData>(getSongBasicFormData(initialData));

  useEffect(() => {
    if (!initialData) return;
    setFormData(getSongBasicFormData(initialData));
  }, [initialData]);

  // SETTING
  const [setting, setSetting] = useState<SongLyricsSettingFormData>(getSongLyricsSettingFormData(initialData));

  // VARIENT
  const addVariant = () => {
    if (!variantInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      searchVariant: [...prev.searchVariant, variantInput.trim()],
    }));

    setVariantInput('');
  };
  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      searchVariant: prev.searchVariant.filter((_, i) => i !== index),
    }));
  };

  // Channel Info
  const currentChannel = useCurrentChannelStore((state) => state.channel);

  useEffect(() => {
    if (!currentChannel) return;

    setFormData((prev) => ({
      ...prev,
      channelId: currentChannel.id,
    }));
  }, [currentChannel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      ...setting,
    };

    const endpoint = isEdit ? `/api/song/${initialData?.id}` : '/api/song';

    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method: method,

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Failed to create song');
      }

      {
        isEdit ? toast.success('Basic Detials Save Sucessfully') : toast.success('Song Created');
      }
      router.push(`/dashboard/song/${initialData?.id}/`);
    } catch (error) {
      console.error(error);
      {
        isEdit ? toast.error('Fail') : toast.success('Fail Song Creation');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <form action="" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Add New Song</CardTitle>
            <CardDescription>Please fill all required fields.</CardDescription>

            <CardAction>{formData.version}</CardAction>
          </CardHeader>
          <CardContent>
            <FieldSet>
              {/* <FieldLegend>Basic Information</FieldLegend> */}
              {/* <FieldDescription>Description</FieldDescription> */}
              <FieldGroup>
                {/* TITLE + SLUG */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {/* TITLE */}
                  <Field>
                    <FieldLabel>
                      Title
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Input name="title" placeholder="Amazing Grace" value={formData.title} onChange={handleChange} required />

                    <FieldDescription>Original song title.</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel>
                      Channel Info
                      {/* <span className="text-destructive">
                        *
                      </span> */}
                    </FieldLabel>

                    <Input value={currentChannel?.title ?? ''} disabled />

                    <FieldDescription>channel id - {currentChannel?.id}</FieldDescription>
                  </Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* SLUG */}
                  <Field>
                    <FieldLabel>Slug</FieldLabel>

                    <Input
                      name="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                    />
                    <>
                      <Button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: slugify(`${prev.title}-${currentChannel?.title ?? ''}`, {
                              lower: true,
                              strict: true,
                            }),
                          }))
                        }
                      >
                        Auto Slug
                      </Button>
                    </>

                    <FieldDescription>SEO friendly URL slug.</FieldDescription>
                  </Field>

                  {/* SEARCH VARIANTS */}
                  <Field>
                    <FieldLabel>Search Variants</FieldLabel>

                    <Input placeholder="Add search variant" value={variantInput} onChange={(e) => setVariantInput(e.target.value)} />

                    <Button type="button" onClick={addVariant}>
                      Add Variant
                    </Button>
                    <div className="flex flex-nowrap gap-2">
                      {formData.searchVariant.map((v, i) => (
                        <Badge key={i} variant="outline" className="flex h-fit items-center gap-1">
                          {v}

                          <button type="button" onClick={() => removeVariant(i)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* LANGUAGE */}
                  <Field>
                    <FieldLabel>Language</FieldLabel>

                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          language: value as LanguageType,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {getLanguageOptions().map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* STATUS */}
                  <Field>
                    <FieldLabel>Status</FieldLabel>

                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: value as StatusType,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {Status.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {/* TRANSLATION  */}

                <FieldSet>
                  <div className="flex h-full items-center gap-3">
                    <Checkbox
                      checked={formData.isTranslation}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isTranslation: Boolean(checked),
                        }))
                      }
                    />
                    <FieldLegend className="mb-0">Translation</FieldLegend>
                  </div>
                </FieldSet>
              </FieldGroup>
            </FieldSet>

            {isEdit && <Setting initialData={initialData} onSetSetting={setSetting} />}
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center  w-full">{isEdit && <StatusButton id={initialData?.id} type="song" status={StatusType.TRASH} />} </div>
            <Button
              className="cursor-pointer"
              type="submit" // onClick={onHandleSaveDraft}
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FormSongBasic;
