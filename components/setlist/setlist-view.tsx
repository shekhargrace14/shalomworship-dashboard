'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Edit, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { setlist } from '@prisma/client';
import Link from 'next/link';

type ItemType = 'SONG' | 'NOTE' | 'SCRIPTURE';
type Visibility = 'PRIVATE' | 'PUBLIC' | 'UNLISTED';

type DisplayItem = {
  id: string;
  type: ItemType;
  songId?: string | null;
  notes?: string | null;
  order: number;
};

type DisplaySection = {
  id: string;
  title: string;
  notes?: string | null;
  order: number;
  items: DisplayItem[];
};

type DisplaySetlistProps = {
  channelId: string;
  setlistId: string;
  data: setlist;
};

export default function ViewSetlistComponent({ channelId, setlistId, data }: DisplaySetlistProps) {
  const router = useRouter();

  const eventDate = data.eventAt ? new Date(data.eventAt) : null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Channel</span>
            <span className="font-mono text-xs">{channelId}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
          {data.theme && <p className="text-lg text-muted-foreground font-medium">Theme: {data.theme}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Link href={`/dashboard/channel/${channelId}/setlists/${setlistId}/edit`}>
            <Button
              type="button"
              // onClick={() => router.push(`/dashboard/channel/${channelId}/setlists/${setlistId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Setlist
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Details and Visibility */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Setlist Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            //
            {data.description && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</span>
                <p className="text-sm text-foreground whitespace-pre-wrap">{data.description}</p>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {data.scripture && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scripture Reference</span>
                  <p className="text-sm font-medium text-foreground">{data.scripture}</p>
                </div>
              )}

              {eventDate && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event Date</span>
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    {format(eventDate, 'EEEE, PPP')}
                  </div>
                </div>
              )}
            </div>
            {data.notes && (
              <div className="space-y-1 pt-2 border-t">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Footer Notes</span>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status/Visibility Card */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={data.visibility === 'PUBLIC' ? 'default' : 'secondary'}>{data.visibility}</Badge>
            </div>
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              {data.visibility === 'PRIVATE' && <p>Only you and your team can view this layout.</p>}
              {data.visibility === 'PUBLIC' && <p>This layout is discoverable and shareable by anyone via links.</p>}
              {data.visibility === 'UNLISTED' && <p>Accessible only to individuals with the direct URL configuration.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections Display */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Arrangement Sections</h2>
          <p className="text-sm text-muted-foreground">Flow breakdown for elements, lyrics blocks, and song links.</p>
        </div>

        {/* <div className="space-y-4">
          {data.sections?.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 flex flex-row items-center justify-between gap-4 border-b py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">
                      {section.title || `Untitled Section`}
                    </CardTitle>
                    <Badge variant="outline">Section Order {section.order}</Badge>
                  </div>
                  {section.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      Notes: {section.notes}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y">
                  {section.items && section.items.length > 0 ? (
                    section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between bg-card hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <Badge variant="secondary" className="text-[10px] tracking-wide uppercase px-1.5 py-0">
                              {item.type}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            {item.type === "SONG" ? (
                              <>
                                <p className="text-sm font-medium text-foreground">
                                  Song Token: <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{item.songId}</span>
                                </p>
                                {item.notes && (
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/30 p-2 rounded-md border border-dashed mt-1">
                                    {item.notes}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-foreground whitespace-pre-wrap font-medium">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right text-xs font-mono text-muted-foreground self-end sm:self-center">
                          Item Sequence #{item.order}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No tracked sequence entries found inside this structural boundary.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}
      </div>
    </div>
  );
}
