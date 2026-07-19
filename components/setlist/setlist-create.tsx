'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  channelId: string;
};

export default function CreateSetlistModal({ channelId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [eventAt, setEventAt] = useState<Date>();
  // const [visibility, setVisibility] = useState("PRIVATE");

  async function handleCreate() {
    if (!title.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/channel/${channelId}/setlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          eventAt: eventAt ?? null,
          channelId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      router.push(`/dashboard/channel/${channelId}/setlists/${data.data.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create setlist');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Setlist
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Setlist</DialogTitle>

          <DialogDescription>Create a new worship setlist. You can add songs, sections and notes afterwards.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Title</Label>

            <Input placeholder="Sunday Morning Worship" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Event Date</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {eventAt ? format(eventAt, 'EEEE, MMMM d, yyyy') : <span className="text-muted-foreground">Pick a date</span>}

                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventAt}
                  onSelect={setEventAt}
                  //   initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* <div className="space-y-2">
            <Label>Visibility</Label>

            <Select
              value={visibility}
              onValueChange={setVisibility}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PRIVATE">
                  Private
                </SelectItem>

                <SelectItem value="UNLISTED">
                  Unlisted
                </SelectItem>

                <SelectItem value="PUBLIC">
                  Public
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <Button className="w-full" onClick={handleCreate} disabled={!title || loading}>
            {loading ? 'Creating...' : 'Create Setlist'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
