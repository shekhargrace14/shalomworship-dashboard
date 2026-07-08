'use client';

import * as React from 'react';
import { HelpCircle, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Full data matrix representation of your screenshot table
const NASHVILLE_ROWS = [
  { degree: '1', chords: { C: 'C', 'C#': 'C#', D: 'D', 'D#': 'D#', E: 'E', F: 'F', 'F#': 'F#', G: 'G', 'G#': 'G#', A: 'A', 'A#': 'A#', B: 'B' } },
  { degree: '2m', chords: { C: 'Dm', 'C#': 'D#m', D: 'Em', 'D#': 'Fm', E: 'F#m', F: 'Gm', 'F#': 'G#m', G: 'Am', 'G#': 'A#m', A: 'Bm', 'A#': 'Cm', B: 'C#m' } },
  { degree: '3m', chords: { C: 'Em', 'C#': 'Fm', D: 'F#m', 'D#': 'Gm', E: 'G#m', F: 'Am', 'F#': 'A#m', G: 'Bm', 'G#': 'Cm', A: 'C#m', 'A#': 'Dm', B: 'D#m' } },
  { degree: '4', chords: { C: 'F', 'C#': 'F#', D: 'G', 'D#': 'G#', E: 'A', F: 'A#', 'F#': 'B', G: 'C', 'G#': 'C#', A: 'D', 'A#': 'D#', B: 'E' } },
  { degree: '5', chords: { C: 'G', 'C#': 'G#', D: 'A', 'D#': 'A#', E: 'B', F: 'C', 'F#': 'C#', G: 'D', 'G#': 'D#', A: 'E', 'A#': 'F', B: 'F#' } },
  { degree: '6m', chords: { C: 'Am', 'C#': 'A#m', D: 'Bm', 'D#': 'Cm', E: 'C#m', F: 'Dm', 'F#': 'D#m', G: 'Em', 'G#': 'Fm', A: 'F#m', 'A#': 'Gm', B: 'G#m' } },
  { degree: '7dim', chords: { C: 'Bdim', 'C#': 'Cdim', D: 'C#dim', 'D#': 'Ddim', E: 'D#dim', F: 'Edim', 'F#': 'F#dim', G: 'Gdim', 'G#': 'G#dim', A: 'Adim', 'A#': 'A#dim', B: 'Bdim' } },
];

const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Helper to convert typed flat inputs into sharp lookups matching the data table keys
const flatToSharpMap: Record<string, string> = {
  DB: 'C#',
  EB: 'D#',
  GB: 'F#',
  AB: 'G#',
  BB: 'A#',
};
type NashvilleHelpPopupProps = {
  defaultKey?: string;
};
export default function NashvilleHelpPopup({ defaultKey = '' }: NashvilleHelpPopupProps) {
  const [searchKey, setSearchKey] = React.useState('');

  //     React.useEffect(() => {
  //     if (defaultKey) {
  //       setSearchKey(defaultKey)
  //     }
  //   }, [defaultKey])

  // Normalization block converts input string text like "bb" or "g#" into structured map pointers
  const normalizedSearch = React.useMemo(() => {
    let clean = searchKey.trim().toUpperCase();
    if (clean.length > 1 && clean.endsWith('B')) {
      clean = clean.charAt(0) + 'B';
    }
    return flatToSharpMap[clean] || clean;
  }, [searchKey]);

  // Filter keys matching row records
  const activeKeys = ALL_KEYS.filter((k) => (normalizedSearch === '' ? true : k.toUpperCase() === normalizedSearch));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 shadow-sm font-medium">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          Nashville Scale Guide
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-10 max-h-[90vh] overflow-y-auto rounded-xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold tracking-tight">Nashville Numbers Guide</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">A system where numbers replace absolute chord names, allowing clean transpositions into any key instantly.</DialogDescription>
        </DialogHeader>

        {/* INPUT SELECTOR RUNTIME */}
        <div className="flex flex-col items-start justify-between gap-4 py-4 border-b border-muted">
          <div className="relative w-full ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input value={searchKey} onChange={(e) => setSearchKey(e.target.value)} placeholder="Filter by key (e.g., C, F#, Bb)" className="pl-9 pr-8" />
            {searchKey && (
              <Button variant="ghost" size="icon" onClick={() => setSearchKey('')} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-muted">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            )}
          </div>

          {/* QUICK DIAL CLICKERS */}
          <div className="flex gap-1">
            {/* <span className="text-xs text-muted-foreground font-medium mr-1 hidden md:inline">Quick view:</span>  */}
            {ALL_KEYS.map((k) => (
              <Button key={k} variant={normalizedSearch === k.toUpperCase() ? 'default' : 'outline'} size="sm" className="h-7 px-2.5 text-xs font-semibold rounded-md hover:bg-accent cursor-pointer" onClick={() => setSearchKey(k)}>
                {k}
              </Button>
            ))}
          </div>
        </div>

        {/* DATA MATRIX TABLE VIEWPORT */}
        <div className="mt-4 border rounded-xl overflow-hidden bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-muted/60 border-b border-border font-medium text-muted-foreground">
                  <th className="py-3 px-4 font-bold text-foreground bg-muted/80 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-28 border-r">Nashville</th>
                  {activeKeys.map((k) => (
                    <th key={k} className="py-3 px-4 text-center font-bold text-foreground min-w-[70px]">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {NASHVILLE_ROWS.map((row) => (
                  <tr key={row.degree} className="hover:bg-muted/30 transition-colors">
                    {/* Degree label stays locked on left for clean look on mobile view */}
                    <td className="py-3 px-4 font-mono font-bold text-foreground bg-card sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r">{row.degree}</td>
                    {activeKeys.map((k) => {
                      const chord = row.chords[k as keyof typeof row.chords];
                      return (
                        <td key={k} className="py-3 px-4 text-center font-medium font-mono text-muted-foreground">
                          <span className={normalizedSearch !== '' ? 'text-base font-bold text-primary' : ''}>{chord}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {activeKeys.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl mt-4">No matching key scale found. Type a valid musical scale note (A-G).</div>}
      </DialogContent>
    </Dialog>
  );
}
