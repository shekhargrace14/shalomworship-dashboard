'use client';

import { Plus, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
// import { useDebounce } from '@/hooks/useDebounce';
import { useSongSearch } from '@/lib/search/useSongSearch';
import Image from 'next/image';
// import BookmarkSong from '../setlist/Bookmark';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';

interface HeaderSearchProps {
  redirectCheck?: boolean;
  setlistId?: string;
}

export function HeaderSearch({ redirectCheck }: HeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { search, ready } = useSongSearch();

  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 500);

  const [results, setResults] = useState<any[]>([]);
  const [active, setActive] = useState(-1);
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
    setActive(-1);
    setOpen(res.length > 0);
  }, [debounced, ready]);

  // 🔹 Reset input when leaving search page
  useEffect(() => {
    if (pathname !== '/search') {
      setQuery('');
      setOpen(false);
    }
  }, [pathname]);

  // Auto-focus on page load / return
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]); // ✅ correct

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (active >= 0 && results[active]) {
        router.push(`/song/${results[active].slug}`);
        setOpen(false);
        return;
      }

      // Offline: stay on current page and use dropdown results
      if (!navigator.onLine) {
        setOpen(true);
        return;
      }

      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }

      setOpen(false);
      return;
    }

    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    }
  }

  return (
    <div className=" w-full max-w-l">
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
        <Search
          size={20}
          className={`ml-2 text-muted-foreground  ${query ? 'cursor-pointer' : ''} `}
          onMouseDown={() => {
            if (query.trim()) {
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }
          }}
        />

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
          onFocus={() => query && setOpen(true)}
          onKeyDown={onKeyDown}
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
        <div className={` absolute max-h-[80vh] w-screen md:w-lg left-2 md:left-auto overflow-y-auto custom-scrollbar  z-50 mt-2 p-1 rounded-md bg-card shadow`}>
          {results.map((song, i) => {
            return (
              <div
                key={song.id}
                className={`group px-1 py-1 hover:bg-ring rounded-md flex gap-2 justify-between items-center 
                  ${i === active ? 'bg-ring' : ''}
                  ${redirectCheck ? 'cursor-pointer' : ''}
                  `}
              >
                {/* <Link
                  href={`/song/${song.slug}`}
                  className="w-full"
                  onClick={(e) => {
                    // e.stopPropagation();
                    // router.push(`/song/${song.slug}`);
                    setOpen(false);
                  }}
                > */}
                <div className="flex gap-2 ">
                  <Image src={song.image} alt={song.title} className="w-20 object-cover rounded-md" width={40} height={40} />
                  <div className="flex flex-col ">
                    <div className="font-medium">{song.title}</div>
                    <div className="text-xs text-gray-500 group-hover:text-foreground">
                      {song?.channel}
                      {song.status === 'upcoming' && ' • Coming Soon'}
                    </div>
                  </div>
                </div>
                {/* </Link> */}
                {/* {setlistId && <BookmarkSong setlistId={setlistId} song={song} />} */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
