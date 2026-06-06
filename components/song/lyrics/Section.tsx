'use client';
import { ChevronUp, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ChevronDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ChordEditor from './ChordEditor';
import { SONG_SECTION_OPTIONS } from "@/lib/constants/song-sections"
import { getLanguageName } from '@/utils/getLanguageName';

const sectionOptions = SONG_SECTION_OPTIONS

type LyricsSection = {
  id: number;

  type: string;

  label: string;

  repeat: number;
};
type LyricsField = 'english' | 'native' | 'translation';

type Props = {
  onUpdate: any;
  section: any;
  onRemoveArrangment: (id: number) => void;

  label: string;
  onAddLine: (id: number) => void;
  onUpdateLine: (sectionId: number, lineId: number, field: LyricsField, value: string) => void;
  onUpdateLineField: (sectionId: number, lineId: number, field: 'indent' | 'sectionBreak', value: number | boolean) => void;
  onDeleteLine: (sectionId: number, lineId: number) => void;

  onAddChord: (sectionId: number, lineId: number) => void;
  onDeleteChord: any;
  onUpdateChord: any;
  
  onMoveUp: any;
  onMoveDown: any;
  onMoveLineUp: (sectionId: number, lineId: number) => void;
  onMoveLineDown: any;
  onMoveChordLeft: any;
  onMoveChordRight: any;
  initialData:any;
  lyrics:any
};

export default function Section({
  initialData,
  lyrics,
  section,
  onRemoveArrangment,
  onUpdate,

  label,
  onAddLine,
  onDeleteLine,
  onUpdateLine,
  onUpdateLineField,
  
  onAddChord,
  onDeleteChord,
  onUpdateChord,

  onMoveUp,
  onMoveDown,

  onMoveLineUp,
  onMoveLineDown,

  onMoveChordLeft,
  onMoveChordRight,
}: Props) {
  // const [language, setLanguage] = useState(lang);
  // console.log(initialData, "initialData section")


  const nativeLanguage = getLanguageName( initialData.language)
  const [lable, setLable] = useState('New Section');
  const [openLines, setOpenLines] = useState<number[]>([]);
  const [sectionOpen, setSectionOpen] = useState(false);


  const handleOpen = () => {
    setSectionOpen((prev) => !prev);
  };
  const toggleLine = (id: number) => {
    setOpenLines((prev) => (prev.includes(id) ? prev.filter((lineId) => lineId !== id) : [...prev, id]));
  };

  const handleOnChange = (e: any) => {
    setLable(e);
  };


  return (
    <>
      <Card
        className="
        overflow-hidden
        border border-accent-foreground border-l-4
        rounded-xl
        mb-4
       p-0
       hover:bg-background
      "
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between border-b border-border  px-4 py-4  cursor-pointer"
          onClick={() => handleOpen()}
        >
          
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* <ChevronDown size={16} /> */}

            {sectionOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
            <Badge>{section.type}</Badge>
            <h2 className="text-base font-semibold text-foreground">
              {section.label}
            </h2>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <Button
            type="button"
              size="icon"
              variant="outline"
              onClick={(e) => {
                (e.stopPropagation(), onMoveUp(section.id));
              }}
            >
              <ArrowUp />
            </Button>

            <Button
            type="button"
              size="icon"
              variant="outline"
              onClick={(e) => {
                (e.stopPropagation(), onMoveDown(section.id));
              }}
            >
              <ArrowDown />
            </Button>

            <Button
            type="button"
              size="icon"
              variant="outline"
              className="

              text-red-500
            "
              onClick={() => onRemoveArrangment(section.id)}
            >
              <X />
            </Button>
          </div>
        </div>

        {/* CONTENT */}
        {sectionOpen && (
          <CardContent className="space-y-8 px-4 pt-0 pb-8">
            {/* TOP GRID */}
            <div
              className="
            grid
            grid-cols-1
            gap-6

            md:grid-cols-4
          "
            >
              {/* TYPE */}
              <div className="space-y-2">
                <label
                  className="
                text-base
                font-semibold
                text-foreground
              "
                >
                  Type
                </label>

                <Select value={section.type} onValueChange={(value) => onUpdate(section.id, 'type', value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select a fruit"/>
                  </SelectTrigger>
                  <SelectContent>
                    {sectionOptions.map((item,index) => (
                      
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ENGLISH */}
              <div className="space-y-2">
                <label
                  className="
                text-base
                font-semibold
                text-foreground
              "
                >
                  English label
                </label>

                <Input
                  defaultValue={section.label}
                  onChange={(e) => {
                    handleOnChange(e.target.value);
                    onUpdate(section.id, 'label', e.target.value);
                  }}
                />
              </div>

              {/* Default / HINDI */}
              <div className="space-y-2">
                <label
                  className="
                text-base
                font-semibold
                text-foreground
              "
                >
                  {nativeLanguage} label <span className='text-xs'> (Optional) </span> 
                </label>

                <Input />
              </div>

              {/* REPEAT */}
              <div className="space-y-2">
                <label
                  className="
                text-base
                font-semibold
                text-foreground
              "
                >
                  Repeat
                </label>

                <Input
                  type="number"
                  defaultValue={1}
                  onChange={(e) => {
                    handleOnChange(e.target.value);
                    onUpdate(section.id, 'repeat', e.target.value);
                  }}
                />
              </div>
            </div>

            {/* LINE CARD */}
            {section.lines.map((line: any, index: any) => (
              <div
                className="overflow-hidden rounded-xl border"
                key={line.id}
              >
                {/* LINE HEADER */}
                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2"
                  onClick={() => toggleLine(line.id)}
                >
                  <div className="flex items-center gap-3">
                    {openLines[0] === line.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}

                    <span className="text-base font-semibold text-foreground">
                      Line {index + 1}
                      {line.lyrics.english}
                    </span>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    <Button type="button" size="icon" variant="outline" onClick={() => onMoveLineUp(section.id, line.id)}>
                      <ArrowUp />
                    </Button>

                    <Button type="button" size="icon" variant="outline" onClick={() => onMoveLineDown(section.id, line.id)}>
                      <ArrowDown />
                    </Button>

                    <Button type="button" size="icon" variant="outline" className="text-red-500" onClick={() => onDeleteLine(section.id, line.id)}>
                      <X />
                    </Button>
                  </div>
                </div>

                {/* LINE BODY */}
                {openLines.includes(line.id) && (
                  <div className="space-y-10 p-4">
                    {/* CHORDS */}
                    <div className="space-y-4">
                      <ChordEditor
                        line={line}
                        initialData={initialData}
                        sectionId={section.id}
                        onAddChord={onAddChord}
                        onDeleteChord={onDeleteChord}
                        onUpdateChord={onUpdateChord}
                        onMoveChordLeft={onMoveChordLeft}
                        onMoveChordRight={onMoveChordRight}
                      />
                    </div>

                    {/* LYRICS */}
                    <div className="space-y-6">
                      <h3 className="text-base font-bold uppercase tracking-widest text-foreground">Lyrics</h3>
                      <div className="flex flex-col gap-4 ">
                        {/* ENGLISH */}
                        <div className="space-y-3 flex justify-between">
                          <label className="text-base text-slate-400">
                            English (Roman)
                          </label>

                          {/* <Input /> */}
                          <Input
                            className="w-[80%]"
                            value={line.lyrics.english}
                            onChange={(e) => onUpdateLine(section.id, line.id, 'english', e.target.value)}
                          />
                        </div>

                        {/* NATIVE */}
                        <div className="space-y-3 flex gap-4 justify-between">
                          <label className="text-base text-slate-400">
                            {nativeLanguage}
                          </label>
                          <Input
                            className="w-[80%]"
                            value={line.lyrics.native}
                            onChange={(e) => onUpdateLine(section.id, line.id, 'native', e.target.value)}
                          />
                        </div>

                        {/* TRANSLATION */}
                        <div className="space-y-3 flex gap-4 justify-between">
                          <label
                            className="
                        w-fit
                      text-base
                      text-slate-400
                    "
                          >
                            Translation
                          </label>

                          <Input
                            className="w-[80%]"
                            value={line.lyrics.translation}
                            onChange={(e) => onUpdateLine(section.id, line.id, 'translation', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex gap-6 items-center justify-between">
                      {/* INDENT */}
                      <div className="space-y-2 flex gap-4 items-center">
                        <label className="text-base text-slate-400">Indent</label>

                        {/* <Input type="number" defaultValue={0} /> */}
                        <Input
                          type="number"
                          value={line.indent}
                          onChange={(e) => onUpdateLineField(section.id, line.id, 'indent', Number(e.target.value))}
                        />
                      </div>

                      {/* BREAK */}
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={line.sectionBreak}
                          onCheckedChange={(checked) => onUpdateLineField(section.id, line.id, 'sectionBreak', !!checked)}
                        />
                        <span className="text-base text-foreground">
                          Section break after this line
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* ADD LINE */}
            <Button
            type="button"
              variant="outline"
              className="w-full"
              // onClick={addLine}
              onClick={() => onAddLine(section.id)}
            >
              + Add line
            </Button>
          </CardContent>
        )}
      </Card>
    </>
  );
}
