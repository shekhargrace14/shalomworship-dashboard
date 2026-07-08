'use client';
import { getLanguageName } from '@/utils/getLanguageName';
import { getKeyByShift, transposeChord } from '@/utils/transposeOne';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type ChordItem = { root: string; number: number | string; quality: string; space: number };

type chordLyric = {
  label: string;
  chords: ChordItem[];
  indent: number;
  lyrics: { en: string; hi?: string };
  translation: { en: string; hi?: string };
  break?: string;
};

type Song = { title?: string; language?: string; key: string; lines: chordLyric[][] };

type ChordTableProps = {
  id: string;
  isChord: boolean;
  isTranslation: boolean;
  isNashville: boolean;
  songData?: Song | null;
  Songlanguage?: any;
};

const ChordTableVersion3: React.FC<ChordTableProps> = ({ id, isChord, isTranslation, isNashville, songData, Songlanguage }) => {
  const [song, setSong] = useState<Song | null>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    async function fetchSong() {
      const singleSong = await songData;

      if (singleSong) {
        const formattedSong: Song = {
          title: singleSong.title,
          language: singleSong.language,
          key: singleSong.key || 'C',
          lines: singleSong.lines || [],
        };
        setSong(formattedSong);
      }
    }

    fetchSong();
  }, [id]);

  if (!song) return <p>Loading...</p>;

  const fromKey = song.key;
  const toKey = getKeyByShift(fromKey, shift);

  // helper to create spaces
  const addSpaces = (count: number) => '\u00A0'.repeat(count);

  const language = song.language;
  const romanLanguages = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ro', 'nl'];

  const isRoman = romanLanguages.includes(song.language || 'en');

  const langName = getLanguageName(Songlanguage);

  const getLyrics = (line: chordLyric, lang: string) => line.lyrics?.[lang as keyof typeof line.lyrics] || '';
  return (
    <div>
      {isChord && (
        <div className="mb-8 flex gap-4 items-center">
          Transpose:
          <button onClick={() => setShift(shift - 1)} className="px-3 py-1 bg-background text-foreground rounded border border-border cursor-pointer">
            <Minus size={14} />
          </button>
          <span className="text-foreground flex items-center ">
            {' '}
            {fromKey} <ChevronRight size={18} /> {toKey}
          </span>
          <button onClick={() => setShift(shift + 1)} className="px-3 py-1 bg-background text-foreground rounded border border-border cursor-pointer">
            <Plus size={14} />
          </button>
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
        {song.title} {isChord ? 'Chords' : isNashville ? 'Number Chart' : 'Lyrics'}
      </h2>
      <div className={`space-y-6 font-sans ${isRoman ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} grid items-start gap-4`}>
        {song.lines.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            {section.map((line, lineIdx) => (
              <div key={lineIdx} className="flex flex-col items-start">
                {line.label && <h4 className="font-semibold mt-4">{line.label}</h4>}
                {/* Nashville row */}
                {isNashville && Array.isArray(line.chords) && line.chords.length > 0 && (
                  <div className="whitespace-pre flex flex-wrap mt-2">
                    {line.chords.map((c, i) => (
                      <span key={i} className="flex">
                        {addSpaces(c.space)}

                        {/* <div className="min-w-8 flex items-start">
                          <div className="w-fit text-foreground font-medium ">
                            {c.number}
                          </div>

                          <p className="text-foreground text-xs font-medium ">
                            {c.quality}
                          </p>
                        </div> */}
                        <div className="min-w-8 text-sm">
                          <div className=" bg-card text-foreground font-medium inline-flex items-start p-0.5 px-1 rounded">
                            <div className="w-fit text-accent">{c.number}</div>
                            <p className="text-xs text-accent">{c.quality}</p>
                          </div>
                        </div>
                      </span>
                    ))}
                  </div>
                )}
                {/* Chords row */}

                {isChord && Array.isArray(line.chords) && line.chords.length > 0 && (
                  <div className="whitespace-pre flex flex-wrap mt-2">
                    {line.chords.map((c, i) => (
                      <span key={i} className="flex">
                        {addSpaces(c.space)}

                        <div className="min-w-8 text-sm">
                          <div className=" bg-card text-foreground font-medium inline-flex items-start p-0.5 px-1 rounded">
                            <div className="w-fit text-accent">{transposeChord([c.root], fromKey, toKey)[0]}</div>
                            <p className="text-xs text-accent">{c.quality}</p>
                          </div>
                        </div>
                      </span>
                    ))}
                  </div>
                )}
                {/* Lyrics row */}
                <span className="leading-relaxed">
                  <>
                    {isChord || isNashville ? addSpaces(line.indent) : ''}
                    {isRoman ? getLyrics(line, song.language || 'en') : getLyrics(line, 'en')}
                    {/* {line.lyrics[language as keyof typeof line.lyrics]} */}
                  </>
                </span>
                {/* Translation */}
                {isTranslation && line.translation?.en && <span className="text-sm text-muted-foreground">{line.translation.en}</span>}

                {line.break && <span className="font-semibold mb-4"></span>}
              </div>
            ))}
          </div>
        ))}
        {/* second section */}
        {!isChord && !isNashville ? (
          <>
            <h2 className="block lg:hidden text-xl md:text-2xl font-semibold mb-0 text-foreground">
              {song.title} {langName} Lyrics
            </h2>

            {!isRoman &&
              song.lines.map((section, sectionIdx) => (
                <div key={sectionIdx} className="">
                  {section.map((line, lineIdx) => (
                    <div key={lineIdx} className="flex flex-col items-start ">
                      {line.label && <h4 className="font-semibold mt-4">{line.label}</h4>}

                      {/* lyrics row  */}
                      {/* <p>{line.lyrics[language as keyof typeof line.lyrics]}</p> */}

                      {/* {getLyrics(line, song.language || "hi")} */}

                      {Object.entries(line.lyrics || {})
                        .filter(([lang]) =>
                          // Include only non-Roman languages (you can expand this list)
                          ['hi', 'ta', 'te', 'ml', 'bn', 'gu', 'kn', 'pa', 'ur', 'sa', 'mr'].includes(lang),
                        )
                        .map(([lang, lyric]) => (
                          <p key={lang} className="text-foreground leading-relaxed">
                            {lyric}
                          </p>
                        ))}

                      {/* Translation */}
                      {isTranslation && line.translation?.en && <span className="text-sm text-muted-foreground">{line.translation.en}</span>}
                      {line.break && <span className="font-semibold mb-4"></span>}
                    </div>
                  ))}
                </div>
              ))}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ChordTableVersion3;
