// components/ChordTable.tsx

'use client';
import { getKeyByShift, transposeChord } from '@/utils/transposeOne';
import { Minus, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
// import { transposeChord, getKeyByShift } from '../utils/nashville';
// import { transposeChord, getKeyByShift } from '../utils/transpose';
// import { fetchSongById  } from '@/app/reactQuery/query';

type ChordLyric = { chord: string; lyrics: string };
type Song = { title?: string; key: string; lines: ChordLyric[][] };

type ChordTableProps = {
  id: string;
  isChord: boolean;
  songData?: Song | null; // Optional song prop for initial data
};

const ChordTableVersion2: React.FC<ChordTableProps> = ({ id, isChord, songData }) => {
  const [song, setSong] = useState<Song | null>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    async function fetchSong() {
      // const singleSong = await fetchSongById(id);
      const singleSong = await songData;

      if (singleSong) {
        const formattedSong: Song = {
          title: singleSong.title,
          key: singleSong.key || 'C', // provide a default key if missing
          lines: (singleSong.lines as ChordLyric[][]) || [],
        };
        setSong(formattedSong);
      }
    }
    fetchSong();
  }, [id]);

  // useEffect(() => {
  //   fetch('/song.json').then(res => res.json()).then(setSong);
  // }, []);

  if (!song) return <p>Loading...</p>;

  const fromKey = song.key;
  const toKey = getKeyByShift(fromKey, shift);

  return (
    <div className="">
      {isChord && (
        <div className="mb-8 flex gap-4 items-center">
          <button onClick={() => setShift(shift - 1)} className="px-3 py-1 text-base bg-gray-200 text-black rounded cursor-pointer">
            <Plus size={14} />
          </button>
          <span className="text-foreground">
            Transpose: {fromKey} → {toKey}
          </span>
          <button onClick={() => setShift(shift + 1)} className="px-3 py-1 text-base bg-gray-200 text-black rounded cursor-pointer">
            <Minus size={14} />
          </button>
        </div>
      )}
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
        {song.title}
        {isChord ? ' Chords' : ' Lyrics'}
      </h2>

      <table className="table-auto border-collapse ">
        <tbody className="text-foreground">
          {song.lines.map((line, idx) => {
            const originalChords = line.map((item) => item.chord);
            const transposedChords = transposeChord(originalChords, fromKey, toKey);

            return (
              <React.Fragment key={idx}>
                <div className={` ${isChord} ? mb-1 : "" `}>
                  {isChord && (
                    <tr className="">
                      {transposedChords.map((chord: string, i: number) => (
                        <td key={i} className="font-bold text-left text-accent">
                          {chord}
                        </td>
                      ))}
                    </tr>
                  )}

                  <tr>
                    {line.map((item, i) => (
                      <td key={i} className="text-left text-foreground">
                        {item.lyrics}&nbsp;
                      </td>
                    ))}
                  </tr>
                </div>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default ChordTableVersion2;
