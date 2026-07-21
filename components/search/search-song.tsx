'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { useSongSearch } from '@/lib/search/useSongSearch';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import type { SongSearchItem } from '@/lib/search/types';

type Props = {
  value?: string;
  onSelect: (song: SongSearchItem) => void;
};

const SearchSong = ({ onSelect }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { search, ready } = useSongSearch();

  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 500);

  const [results, setResults] = useState<SongSearchItem[]>([]);
  const [open, setOpen] = useState(false);

  // 🔹 Build suggestions (debounced)
  useEffect(() => {
    if (!ready || debounced.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const res = search(debounced);

    setResults(res);
    setOpen(res.length > 0);
  }, [debounced, ready, search]);

  return (
    <div className="relative w-full">
      <div
        className="
              flex items-center
              rounded-md border border-input
              bg-background
              transition-all
              focus-within:border-primary
              focus-within:ring-2
              focus-within:ring-primary/40
              focus-within:shadow-md
            "
      >
        <Search size={20} className={`ml-2 text-muted-foreground  ${query ? 'cursor-pointer' : ''} `} />

        <Input
          type="search"
          ref={inputRef}
          placeholder="Search songs, artist, scriptures..."
          className=" border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-2 bg-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        {query && (
          <X
            size={20}
            className=" mr-2 text-2xl text-foreground cursor-pointer"
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
          />
        )}
      </div>
      {/* 🔹 Suggestions dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-md border bg-background shadow-lg">
          {results.map((song, i) => {
            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelect(song);
                  setQuery(song.title);
                  setOpen(false);
                }}
                className={`group flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent`}
              >
                <div className="flex gap-2 ">
                  <Image src={song.image} alt={song.title} className="w-20 object-cover rounded-md" width={40} height={40} />
                  <div className="flex flex-col ">
                    <div className="font-medium">{song.title}</div>
                    <div className="text-xs text-gray-500 group-hover:text-foreground">
                      {/* {song?.channel} */}
                      {song.status === 'upcoming' && ' • Coming Soon'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchSong;
