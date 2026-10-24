'use client';

import { Button } from '@/components/ui/button';
import { SongWithDetails } from '@/types';
import { useState } from 'react';

type LyricsConversionResponse = {
  arrangement: unknown[];
  metadata?: {
    providerUsed?: string;
    modelUsed?: string;
    hasUncertainties?: boolean;
  };
};

type Props = {
  initialData?: SongWithDetails;
};

export function LyricsUploadForm({ initialData }: Props) {
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState<LyricsConversionResponse | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const lyricsText = lyrics.trim();

    if (!lyricsText || loading || saving) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setResult(null);

    try {
      const response = await fetch('/api/ai/convert-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lyricsText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || 'Lyrics conversion failed.');
      }

      setResult(data as LyricsConversionResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result || saving || loading) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const isEdit = Boolean(initialData?.id);

      const endpoint = isEdit ? `/api/song/${initialData!.id}` : '/api/song';

      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Confirm that your song API expects this field.
          lyrics: result,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || 'Failed to save song.');
      }

      setSuccess(isEdit ? 'Song updated successfully.' : 'Song created successfully.');

      console.log('Saved song:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save song. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-7xl space-y-4 rounded-xl border bg-background p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">AI Lyrics Converter</h2>

        <p className="text-sm text-muted-foreground">Paste song lyrics to generate native-script lyrics and an English translation.</p>
      </div>

      <div className="space-y-2">
        <textarea
          id="lyrics"
          value={lyrics}
          onChange={(event) => setLyrics(event.target.value)}
          placeholder={'Paste lyrics here...\n\n## Verse 1\n...\n\n## Chorus\n...'}
          rows={10}
          required
          disabled={loading || saving}
          className="w-full resize-y rounded-md border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />

        <p className="text-right text-xs text-muted-foreground">{lyrics.length} characters</p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-600">
          {success}
        </p>
      )}

      <Button type="submit" disabled={!lyrics.trim() || loading || saving} className="w-full">
        {loading ? 'Converting...' : 'Convert Lyrics'}
      </Button>

      {result && (
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold">Review Converted Lyrics</h3>

            {result.metadata && (
              <p className="text-xs text-muted-foreground">
                Provider: {result.metadata.providerUsed ?? 'Unknown'}
                {' · '}
                Model: {result.metadata.modelUsed ?? 'Unknown'}
                {result.metadata.hasUncertainties ? ' · Review uncertain lines carefully' : ''}
              </p>
            )}
          </div>

          <pre className="max-h-[500px] overflow-auto rounded-md border bg-muted p-4 text-xs">{JSON.stringify(result, null, 2)}</pre>

          <Button type="button" onClick={handleSave} disabled={saving || loading} className="w-full">
            {saving ? 'Saving...' : initialData?.id ? 'Update Song' : 'Save Song'}
          </Button>
        </div>
      )}
    </form>
  );
}
