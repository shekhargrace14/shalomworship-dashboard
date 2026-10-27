import { NextRequest, NextResponse } from 'next/server';

type Provider = 'cloud' | 'local';

export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get('provider');

  if (provider !== 'cloud' && provider !== 'local') {
    return NextResponse.json({ error: 'Invalid provider. Use cloud or local.' }, { status: 400 });
  }

  try {
    if (provider === 'cloud') {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Gemini API returned ${response.status}`);
      }

      const data = await response.json();

      const models = (data.models ?? [])
        .filter((model: { name: string; supportedGenerationMethods?: string[] }) => model.supportedGenerationMethods?.includes('generateContent'))
        .map((model: { name: string; displayName?: string }) => ({
          value: model.name.replace(/^models\//, ''),
          label: model.displayName ?? model.name.replace(/^models\//, ''),
        }));

      return NextResponse.json({ models });
    }

    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

    const response = await fetch(`${ollamaUrl}/api/tags`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Ollama API returned ${response.status}`);
    }

    const data = await response.json();

    const models = (data.models ?? []).map((model: { name: string }) => ({
      value: model.name,
      label: model.name,
    }));

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Failed to fetch AI models:', error);

    return NextResponse.json({ error: 'Unable to fetch models for this provider.' }, { status: 502 });
  }
}
