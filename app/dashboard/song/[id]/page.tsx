'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import Lyrics from '@/components/song/lyrics';
import { SongWithDetails } from '@/types';
import { useParams } from 'next/navigation';

// Use your real component paths
import FormSongMedia from '@/components/song/form/form-song-media';
import FormSongCategory from '@/components/song/form/form-song-category';
import FormSongBasic from '@/components/song/form/form-song-basic';
import FromSongSeo from '@/components/song/form/from-song-seo';
import FormSongCredits from '@/components/song/form/form-song-credits';
import Link from 'next/link';

type Props = {
  song: any;
};

const steps = [
  {
    title: 'Basic Information',
    description: 'Add the main song details.',
  },
  {
    title: 'Credits',
    description: 'Add singers, writers, composers, and channels.',
  },
  {
    title: 'Lyrics & Chords',
    description: 'Add lyrics, chords, and translations.',
  },
  {
    title: 'Media',
    description: 'Add video, audio, image, and color.',
  },
  {
    title: 'Categories & Genres',
    description: 'Organize the song for discovery.',
  },
  {
    title: 'Manage SEO',
    description: 'Optimize the song page for search engines.',
  },
];

export default function page() {
  const isEdit = true;
  const params = useParams();
  const id = params.id as string;
  const [song, setSong] = useState<SongWithDetails | null>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    async function fetchSong() {
      try {
        const res = await fetch(`/api/song/${id}`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch song');
        }

        setSong(data.data);
      } catch (error: any) {
        console.error(error);
      }
    }

    if (id) {
      fetchSong();
    }
  }, [id]);

  const currentStep = steps[step - 1];

  function handleNext() {
    setStep((current) => Math.min(current + 1, 6));
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  // It only changes the status to DRAFT
  // async function handleSaveDraft() {
  //   try {
  //     const res = await fetch(`/api/song/${id}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         status: 'DRAFT',
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || 'Failed to save draft');
  //     }

  //     toast.success('Draft saved successfully');
  //   } catch (error: any) {
  //     toast.error(error.message || 'Failed to save draft');
  //   }
  // }

  // It only changes the status from DRAFT -> PUBLISH
  async function handlePublish() {
    try {
      const res = await fetch(`/api/song/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'PUBLISH',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to publish song');
      }

      toast.success('Song published successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish song');
    }
  }

  function renderCurrentStep() {
    if (!song) {
      return <div>Loading song...</div>;
    }
    switch (step) {
      case 1:
        return <FormSongBasic initialData={song} isEdit />;

      case 2:
        return <FormSongCredits initialData={song} />;

      case 3:
        return <Lyrics initialData={song} isEdit />;

      case 4:
        return <FormSongMedia initialData={song} isEdit />;

      case 5:
        return <FormSongCategory initialData={song} isEdit />;

      case 6:
        return <FromSongSeo initialData={song} isEdit />;

      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      <div className="sticky top-0 z-20 border-b bg-background px-4 py-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">
                Step {step} of {steps.length}
              </p>

              <h1 className="text-xl font-semibold">{currentStep.title}</h1>

              <p className="mt-1 text-sm text-muted-foreground">{currentStep.description}</p>
            </div>
            <Link href={`/dashboard/song/${id}/preview`}>
              <Button>Preview Song</Button>
            </Link>
          </div>

          <div className="mt-4 flex gap-2">
            {steps.map((item, index) => (
              <div key={item.title} className={`h-1 flex-1 rounded-full ${index + 1 <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl">{renderCurrentStep()}</div>
      </main>

      <div className="sticky bottom-0 z-20 border-t bg-background px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>

          <div className="flex gap-2">
            {/* <Button type="button" variant="secondary" onClick={handleSaveDraft}>
              Save Draft
            </Button> */}

            {step < 6 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handlePublish}>
                Publish Song
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
