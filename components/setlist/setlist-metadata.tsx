'use client';
import { Button } from '../ui/button';
import { CalendarIcon, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

type Visibility = 'PRIVATE' | 'PUBLIC' | 'UNLISTED';

type Metadata = {
  title: string;
  theme: string;
  description: string;
  scripture: string;
  notes: string;
  eventAt: Date | undefined;
  visibility: Visibility;
};

type Props = {
  metadata: Metadata;
  setMetadata: React.Dispatch<React.SetStateAction<Metadata>>;
  loading: boolean;
  canSave: boolean;
  channelId: string;
  handleSubmit: () => void;
};
const SetlistMetadata = ({ handleSubmit, loading, metadata, setMetadata, canSave }: Props) => {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Setlist Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Sunday Service" value={metadata?.title} onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  placeholder="Holy Spirit / Thanksgiving"
                  value={metadata.theme}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      theme: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for the service..."
                value={metadata.description}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scripture">Scripture</Label>
                <Input
                  id="scripture"
                  placeholder="Psalm 23 / John 3:16"
                  value={metadata.scripture}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      scripture: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {metadata.eventAt ? format(metadata.eventAt, 'EEEE, PPP') : <span className="text-muted-foreground">Pick a date</span>}

                      <CalendarIcon className="h-4 w-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={metadata.eventAt}
                      onSelect={(date) =>
                        setMetadata((prev) => ({
                          ...prev,
                          eventAt: date,
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Footer Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any notes to show at the bottom..."
                value={metadata.notes}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              {/* <Select value={visibility} onValueChange={(value) => setVisibility(value as Visibility)}> */}
              <Select
                value={metadata.visibility}
                onValueChange={(value) =>
                  setMetadata((prev) => ({
                    ...prev,
                    visibility: value as Visibility,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="UNLISTED">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Private: only you and your team can see it.</p>
              <p>Public: shareable by link and visible if published.</p>
              <p>Unlisted: accessible with the direct link only.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetlistMetadata;
