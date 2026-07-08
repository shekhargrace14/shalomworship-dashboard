'use client';
import React, { useState } from 'react';
import ChordTableVersion3 from './song-preview-chord-version3';
// import ChordTableVersion3 from './ChordTableVersion3';

type LinesProps = {
  id: string;
  song: any;
  isChords: boolean;
  isTranslations: boolean;
  language: any;
};

const LinesVersion3 = ({ id, song, isChords, isTranslations, language }: LinesProps) => {
  const [activeTab, setActiveTab] = useState<'chords' | 'nashville' | 'lyrics' | 'translation'>('chords');

  // Single toggle function for all tabs
  const toggleTab = (tab: 'chords' | 'nashville' | 'lyrics' | 'translation') => {
    setActiveTab(activeTab === tab ? 'lyrics' : tab);
  };

  // Helper function to determine if a tab is active
  const isTabActive = (tab: string) => activeTab === tab;

  return (
    <>
      <div className="w-full inline-flex gap-4 mb-4 overflow-x-auto ">
        {isChords && (
          <div className="inline-flex gap-4">
            {/* Lyrics */}
            <button onClick={() => toggleTab('lyrics')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('lyrics') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Lyrics
              {/* {isTabActive("lyrics") ? "On" : "Off"} */}
            </button>

            {/* Chords */}
            <button onClick={() => toggleTab('chords')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('chords') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Chords
              {/* {isTabActive("chords") ? "On" : "Off"} */}
            </button>

            {/* Nashville */}
            <button onClick={() => toggleTab('nashville')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('nashville') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
              Nashville
              {/* {isTabActive("nashville") ? "On" : "Off"} */}
            </button>
          </div>
        )}

        {/* Translation */}
        {isTranslations && (
          <button onClick={() => toggleTab('translation')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-border cursor-pointer ${isTabActive('translation') ? 'bg-white text-black' : 'bg-background text-foreground hover:bg-white hover:text-black'}`}>
            Translation
            {/* {isTabActive("translation") ? "On" : "Off"} */}
          </button>
        )}
      </div>

      {/* Pass flags to ChordTable */}
      <ChordTableVersion3 id={id} songData={song} isChord={isTabActive('chords') && isChords} isNashville={isTabActive('nashville') && isChords} isTranslation={isTabActive('translation') && isTranslations} Songlanguage={language} />
    </>
  );
};

export default LinesVersion3;
