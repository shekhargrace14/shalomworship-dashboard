'use client';
import React, { useState } from 'react';
import ChordTableVersion4 from './song-preview-chord-version4';
// import ChordTableVersion4 from './ChordTableVersion4';

type SectionItem = {
  id: number;
  type: string;
  label: string;
  repeat: number;
  lines: Array<{
    id: number;
    indent: number;
    sectionBreak: boolean;
    lyrics: {
      english: string;
      native: string;
      translation: string;
    };
    chords: Array<{
      id: number;
      root: string;
      number: number;
      quality: string;
      position: number;
    }>;
  }>;
};

type LinesProps = {
  id: string;
  song: any; // Using any here to accept the database model dynamically
  isChords: boolean;
  isTranslations: boolean;
  language: any;
};

const LinesVersion4 = ({ id, song, isChords, isTranslations, language }: LinesProps) => {
  const [activeTab, setActiveTab] = useState<'chords' | 'nashville' | 'lyrics' | 'translation'>('chords');

  const toggleTab = (tab: 'chords' | 'nashville' | 'lyrics' | 'translation') => {
    setActiveTab(activeTab === tab ? 'lyrics' : tab);
  };

  const isTabActive = (tab: string) => activeTab === tab;

  return (
    <>
      <div className="w-full inline-flex gap-4 mb-4 overflow-x-auto">
        {isChords && (
          <div className="inline-flex gap-4">
            <button onClick={() => toggleTab('lyrics')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('lyrics') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Lyrics
            </button>

            <button onClick={() => toggleTab('chords')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('chords') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Chords
            </button>

            <button onClick={() => toggleTab('nashville')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('nashville') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Nashville
            </button>
          </div>
        )}

        {isTranslations && (
          <button onClick={() => toggleTab('translation')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('translation') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
            Translation
          </button>
        )}
      </div>

      <ChordTableVersion4 isChord={isTabActive('chords') && isChords} isNashville={isTabActive('nashville') && isChords} isTranslation={isTabActive('translation') && isTranslations} songData={song} Songlanguage={language} />
    </>
  );
};

export default LinesVersion4;
