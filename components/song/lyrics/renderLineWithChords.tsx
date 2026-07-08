type ChordItem = {
  id: number;
  root: string;
  number: number | string;
  quality: string;
  position: number;
  nashville: number;
  bass: string;
};

type LineItem = {
  id: number;
  indent: number;
  sectionBreak: boolean;
  lyrics: { english: string; native: string; translation: string };
  chords: ChordItem[];
};

export const RenderLineWithChords = ({ line }: { line: LineItem }) => {
  const lyrics = line.lyrics?.english || '';
  const chars = lyrics.split('');

  return (
    <div className="mt-4">
      <div
        className="flex flex-wrap font-mono relative"
        style={{
          marginLeft: `${line.indent || 0}px`,
          // Height buffer ensures absolute chords don't clip into the row above
          lineHeight: '2.5rem',
        }}
      >
        {chars.map((char, index) => {
          // Scan array indices to match exact chord assignment position
          const chord = line.chords.find((c: any) => c.position === index);

          return (
            <div key={index} className="relative inline-flex flex-col items-center min-w-[0.6em]">
              {/* Chord Layer: Extracted and floating above the core letter cell */}
              {chord && (
                <div className="absolute bottom-[1.4rem] left-0 text-accent font-semibold text-sm whitespace-nowrap select-none pointer-events-none z-10 bg-card/40 px-0.5 rounded" style={{ transform: 'translateX(0%)' }}>
                  {chord.root}
                  {chord.quality !== 'major' && chord.quality}
                  {chord.bass ? `/${chord.bass}` : ''}
                </div>
              )}

              {/* Character Layer: Native character text track cells */}
              <div className="whitespace-pre text-foreground font-sans text-base">{char === ' ' ? '_' : char}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
