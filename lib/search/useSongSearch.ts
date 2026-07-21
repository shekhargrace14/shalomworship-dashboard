'use client';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useState } from 'react';
import { SongSearchItem } from './types';

export function useSongSearch() {
  const [fuse, setFuse] = useState<Fuse<SongSearchItem> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadSongs() {
      try {
        const res = await fetch('/api/song/search');

        if (!res.ok) {
          throw new Error('Failed to load songs');
        }

        const songs: SongSearchItem[] = await res.json();

        setFuse(
          new Fuse(songs, {
            includeScore: true,
            threshold: 0.3,
            ignoreLocation: true,
            keys: [
              { name: 'title', weight: 0.7 },
              { name: 'channel', weight: 0.2 },
              { name: 'searchVariant', weight: 0.1 },
            ],
          }),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setReady(true);
      }
    }

    loadSongs();
  }, []);

  const search = useCallback(
    (query: string, limit = 20): SongSearchItem[] => {
      query = query.trim();

      if (!ready || !fuse || query.length < 2) {
        return [];
      }

      return fuse
        .search(query)
        .slice(0, limit)
        .map((r) => r.item);
    },
    [fuse, ready],
  );
  return { search, ready };
}
