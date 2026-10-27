'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SongWithDetails } from '@/types';
import { AI_MODEL_OPTIONS } from '@/lib/ai/model-options';

type LyricsConversionResponse = {
  arrangement: unknown[];
  metadata?: {
    providerUsed?: string;
    modelUsed?: string;
    hasUncertainties?: boolean;
  };
};

type AIProviderMode = 'cloud' | 'local';

type Props = {
  initialData?: SongWithDetails;
};

type AIModel = {
  value: string;
  label: string;
};

export function LyricsUploadForm({ initialData }: Props) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [model, setModel] = useState('');
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState('');

  const [lyrics, setLyrics] = useState('');
  const [aiMode, setAiMode] = useState<AIProviderMode>('cloud');
  const availableModels = AI_MODEL_OPTIONS[aiMode];

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState<LyricsConversionResponse | null>(null);

  const fetchModels = async (provider: 'cloud' | 'local') => {
    setModelsLoading(true);
    setModelsError('');
    setModels([]);
    setModel('');

    try {
      const response = await fetch(`/api/ai/models?provider=${provider}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch models.');
      }
      const availableModels: AIModel[] = data.models ?? [];

      setModels(availableModels);
      setModel(availableModels[0]?.value ?? '');
    } catch (error) {
      setModelsError(error instanceof Error ? error.message : 'Failed to fetch models.');
    } finally {
      setModelsLoading(false);
    }
  };

  useEffect(() => {
    void fetchModels(aiMode);
  }, [aiMode]);

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
        body: JSON.stringify({
          lyricsText,
          provider: aiMode,
          model,
        }),
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

      const response = await fetch(endpoint, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: result,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || 'Failed to save song.');
      }

      setSuccess(isEdit ? 'Song updated successfully.' : 'Song created successfully.');
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

        <p className="text-sm text-muted-foreground">Paste song lyrics to generate romanized lyrics, native-script lyrics, and an English translation.</p>

        {initialData?.language && <p className="text-sm text-muted-foreground">Song language: {initialData.language}</p>}
      </div>
      <div className="flex justify-between gap-4 sm:flex-row sm:items-start">
        <div className="w-full space-y-2 sm:w-56">
          <Label htmlFor="ai-mode">AI Provider</Label>

          <Select
            value={aiMode}
            onValueChange={(value) => {
              const provider = value as AIProviderMode;
              setAiMode(provider);

              const firstModel = AI_MODEL_OPTIONS[provider][0];
              setModel(firstModel?.value ?? '');
            }}
            disabled={loading || saving}
          >
            <SelectTrigger id="ai-mode" className="w-full">
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="cloud">Cloud AI (Gemini)</SelectItem>
              <SelectItem value="local">Local AI (Ollama)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ai-model">AI Model</Label>

          <Select value={model} onValueChange={setModel} disabled={modelsLoading || models.length === 0}>
            <SelectTrigger id="ai-model" className="w-full">
              <SelectValue placeholder={modelsLoading ? 'Loading models...' : 'Select a model'} />
            </SelectTrigger>

            <SelectContent>
              {models.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {modelsError && <p className="text-sm text-destructive">{modelsError}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lyrics">Lyrics</Label>

        <textarea
          id="lyrics"
          value={lyrics}
          onChange={(event) => setLyrics(event.target.value)}
          placeholder={'Paste lyrics here...\n\nVerse 1\n...\n\nChorus\n...'}
          rows={10}
          maxLength={10000}
          required
          disabled={loading || saving}
          className="w-full resize-y rounded-md border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />

        <p className="text-right text-xs text-muted-foreground">{lyrics.length} / 10000 characters</p>
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

      <Button type="submit" disabled={!lyrics.trim() || modelsLoading || !model || loading || saving} className="w-full">
        {loading ? 'Converting...' : 'Convert Lyrics'}
      </Button>

      {/* Lyrics */}

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
