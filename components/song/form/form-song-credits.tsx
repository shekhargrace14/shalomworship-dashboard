'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { channel, CreditRole } from '@prisma/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Credit = {
  id: string;
  channelId: string;
  role: CreditRole;
  channel: channel;
};

type SongCreditsFormProps = {
  initialData: {
    id: string;
    credits?: Credit[];
  };
};

const roles = Object.values(CreditRole);

export default function FormSongCredits({ initialData }: SongCreditsFormProps) {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<CreditRole | ''>('');

  const [channels, setChannels] = useState<channel[]>([]);
  const [results, setResults] = useState<channel[]>([]);

  const [selectedChannel, setSelectedChannel] = useState<channel | null>(null);

  const [credits, setCredits] = useState<Credit[]>(initialData?.credits ?? []);

  const [showResults, setShowResults] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchChannels() {
      try {
        setIsLoadingChannels(true);

        const response = await fetch('/api/channel');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch channels');
        }

        setChannels(data.data ?? []);
        setResults(data.data ?? []);
      } catch (error) {
        console.error('FETCH CHANNELS ERROR:', error);
      } finally {
        setIsLoadingChannels(false);
      }
    }

    fetchChannels();
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    setSelectedChannel(null);
    setShowResults(true);

    const query = value.trim().toLowerCase();

    if (!query) {
      setResults(channels);
      return;
    }

    const filteredChannels = channels.filter((channel) => {
      return channel.title.toLowerCase().includes(query) || channel.slug.toLowerCase().includes(query);
    });

    setResults(filteredChannels);
  }

  function selectChannel(channel: channel) {
    setSelectedChannel(channel);
    setSearch(channel.title);
    setShowResults(false);
  }

  function addCredit() {
    if (!selectedChannel || !role) {
      return;
    }

    const alreadyAdded = credits.some((credit) => credit.channelId === selectedChannel.id && credit.role === role);

    if (alreadyAdded) {
      alert('This channel already has this credit role.');
      return;
    }

    const newCredit: Credit = {
      id: crypto.randomUUID(),
      channelId: selectedChannel.id,
      role,
      channel: selectedChannel,
    };

    setCredits((previousCredits) => [...previousCredits, newCredit]);

    setSearch('');
    setRole('');
    setSelectedChannel(null);
    setResults(channels);
  }

  function removeCredit(id: string) {
    setCredits((previousCredits) => previousCredits.filter((credit) => credit.id !== id));
  }
  //// saveCredits
  async function saveCredits() {
    if (!initialData?.id) {
      console.error('SongCreditsForm needs initialData.id', initialData);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        credits: credits.map((credit) => ({
          channelId: credit.channelId,
          role: credit.role,
        })),
      };

      const response = await fetch(`/api/song/${initialData.id}/credits`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save credits');
      }

      setCredits(data.data);
    } catch (error) {
      console.error('SAVE CREDITS ERROR:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-2xl">Credits Management</span>
        </CardTitle>

        <Badge variant="secondary">{credits.length} Credits</Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid items-end gap-4 lg:grid-cols-12">
          <div className="relative lg:col-span-6">
            <label className="mb-2 block text-sm font-medium">Channel or Artist</label>

            <Input
              placeholder="Search channel or artist..."
              value={search}
              onFocus={() => {
                setResults(channels);
                setShowResults(true);
              }}
              onChange={(event) => handleSearch(event.target.value)}
            />

            {showResults && (
              <div className="absolute top-[72px] z-50 w-full overflow-hidden rounded-md border border-border bg-background shadow-lg">
                {isLoadingChannels && <p className="p-4 text-sm text-muted-foreground">Loading channels...</p>}

                {!isLoadingChannels && results.length === 0 && <p className="p-4 text-sm text-muted-foreground">No channels found.</p>}

                {!isLoadingChannels && results.length > 0 && (
                  <div className="flex max-h-72 flex-col gap-1 overflow-y-auto p-2">
                    {results.map((result) => (
                      <button type="button" key={result.id} onClick={() => selectChannel(result)} className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent">
                        <Avatar>
                          <AvatarImage src={result.avatar ?? undefined} />
                          <AvatarFallback>
                            {result.title
                              .split(' ')
                              .map((word) => word[0])
                              .join('')
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate font-medium">{result.title}</p>
                          <p className="truncate text-sm text-muted-foreground">{result.slug}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <label className="mb-2 block text-sm font-medium">Role</label>

            <Select value={role} onValueChange={(value) => setRole(value as CreditRole)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                {roles.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <Button type="button" onClick={addCredit} disabled={!selectedChannel || !role} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {credits.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No credits added yet.</div>}

          {credits.map((credit) => (
            <div key={credit.id} className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-accent/40">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={credit.channel.avatar ?? undefined} />
                  <AvatarFallback>
                    {credit.channel.title
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{credit.channel.title}</p>

                  <p className="text-sm text-muted-foreground">Artist / Channel</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge>{credit.role}</Badge>

                <Button type="button" size="icon" variant="ghost" onClick={() => removeCredit(credit.id)} disabled={isSaving}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">Credits will appear on the song page after saving.</p>

          <Button type="button" onClick={saveCredits} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Credits'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
