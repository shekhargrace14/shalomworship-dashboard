'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

type Props = {
  channelId: string;
  channelTitle: string;
};

export const ChannelDelete = ({ channelId, channelTitle }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    return value.trim().toLowerCase() === channelTitle.trim().toLowerCase();
  }, [value, channelTitle]);

  useEffect(() => {
    if (!open) {
      setValue('');
      setLoading(false);
    }
  }, [open]);

  const handleDelete = async () => {
    if (!isValid) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/channel/${channelId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete channel');
      }

      setOpen(false);
      toast.success(data.message);
      router.push(`/dashboard/channel`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete channel
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete <br />
            <br />
            Please type "<span className="text-white">{channelTitle}</span>" to confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Type "${channelTitle}"`} autoComplete="off" />
          <p className="text-sm text-muted-foreground">{isValid ? 'Title matched. You can delete now.' : 'Title must match exactly before deletion is enabled.'}</p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="cursor-pointer">
            Cancel
          </Button>

          <Button variant="destructive" onClick={handleDelete} disabled={!isValid || loading} className="cursor-pointer">
            {loading ? 'Deleting...' : 'Delete channel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
