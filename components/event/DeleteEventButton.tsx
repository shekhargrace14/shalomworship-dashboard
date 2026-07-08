'use client';
import React from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DeleteEventButton = ({ id }: any) => {
  const router = useRouter();
  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/event/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      router.push('/event');
    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <div>
      {' '}
      <Button variant="destructive" onClick={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Event
      </Button>
    </div>
  );
};

export default DeleteEventButton;
