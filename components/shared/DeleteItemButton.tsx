'use client';
import React from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
type Props = {
  id: string;
  type: string;
};

export const DeleteItemButton = ({ id, type }: Props) => {
  const router = useRouter();
  const handleDelete = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete this ${type}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      router.push(`/${type}`);
    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <div>
      {' '}
      <Button variant="destructive" onClick={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {type}
      </Button>
    </div>
  );
};
