'use client';
import React, { useState } from 'react';
import ChordTableVersion2 from './song-preview-chord-version2';
// import ChordTableVersion2 from './ChordTableVersion2';

type LinesProps = {
  id: string;
  song: any; // Replace 'any' with the correct type if you have it
  isChords: boolean;
  // version: string;
  // isTranslations: boolean;
};

const LinesVersion2 = ({ id, song, isChords }: LinesProps) => {
  const [activeTab, setActiveTab] = useState<'chords' | 'lyrics'>('chords');
  // console.log("song", song)
  return (
    <>
      <div className="inline-flex gap-4 mb-4">
        {isChords && (
          <div className="inline-flex gap-4">
            {/* Lyrics */}
            <button onClick={() => setActiveTab('lyrics')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${activeTab === 'lyrics' ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Lyrics
            </button>
            {/* Chords */}
            <button onClick={() => setActiveTab('chords')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${activeTab === 'chords' ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Chords
            </button>
          </div>
        )}
      </div>

      {/* Pass flags to ChordTable */}

      <ChordTableVersion2 id={id} isChord={activeTab === 'chords' && isChords === true} songData={song} />
    </>
  );
};

export default LinesVersion2;
