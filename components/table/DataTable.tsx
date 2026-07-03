'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import Link from 'next/link';
import { Badge } from '../ui/badge';

import { Archive, Ellipsis, Trash2, X } from 'lucide-react';

import { IconCircleCheckFilled, IconDotsVertical, IconLoader } from '@tabler/icons-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCurrentChannelStore } from '@/store/useCurrentChannelStore';

type Props = {
  data: any[];
  type: string;
};

const statusIcons = {
  PUBLISH: <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />,
  DRAFT: <IconLoader />,
  TRASH: <Trash2 className="text-red-500" />,
  ARCHIVE: <Archive className="text-yellow-500" />,
  CANCELLED: <X className="text-red-500" />,
  PENDING: <Ellipsis />,
  REVIEWING: <IconLoader />,
  APPROVED: <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />,
  REJECTED: <X className="text-red-500" />,
  COMPLETED: <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />,
};

export default function DataTable({ data = [], type }: Props) {
  const currentChannel = useCurrentChannelStore((state) => state.channel);
  const router = useRouter();
  console.log(type, 'DataTable');

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      toast.success(` ${type} deleted successfully`);
      if (type === 'channel') {
        router.push(`/dashboard/channel`);
        router.refresh();
      }
      if (type === 'song') {
        router.push(`/dashboard/channel/${currentChannel?.id}`);
        router.refresh();
      }
      router.refresh();
      
    } catch (error) {
      console.error(`Failed to delete ${type}`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };
  return (
    <div className="mx-4 my-6">
      <Table className="overflow-hidden rounded-lg border border-amber-400 mx-4 m-auto">
        <TableHeader className="sticky top-0 z-10 bg-muted">
          <TableRow>
            <TableHead>Title</TableHead>

            {(type === 'song' || type === 'submission') && <TableHead>Status</TableHead>}

            {type === 'user' && <TableHead>Role</TableHead>}

            {type === 'submission' && <TableHead>Type</TableHead>}

            {type === 'user' || (type === 'submission' && <TableHead>Email</TableHead>)}

            {type === 'song' && <TableHead>Slug</TableHead>}

            {type === 'song' && <TableHead>Key</TableHead>}

            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((item: any) => (
            <TableRow key={item.id}>
              {/* TITLE */}

              <TableCell>
                <Link href={`/dashboard/${type}/${item.id}`}>{item.title || item.name || '-'}</Link>
              </TableCell>

              {/* STATUS */}

              {(type === 'song' || type === 'submission') && (
                <TableCell>
                  <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {statusIcons[item.status as keyof typeof statusIcons] ?? <IconLoader />}

                    <span className="ml-2">{item.status}</span>
                  </Badge>
                </TableCell>
              )}

              {/* ROLE */}

              {type === 'user' && (
                <TableCell>
                  <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {item.role}
                  </Badge>
                </TableCell>
              )}

              {/* SUBMISSION TYPE */}

              {type === 'submission' && (
                <TableCell>
                  <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {item.type}
                  </Badge>
                </TableCell>
              )}

              {/* EMAIL */}

              {type === 'user' || (type === 'submission' && <TableCell>{item.email}</TableCell>)}

              {/* SONG SLUG */}

              {type === 'song' && <TableCell>{item.slug || '-'}</TableCell>}

              {/* SONG KEY */}

              {type === 'song' && <TableCell>{item.key || '-'}</TableCell>}

              {/* CREATED */}

              <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</TableCell>

              {/* UPDATED */}

              <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
                      <IconDotsVertical />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                    <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem disabled>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => handleDelete(item.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
