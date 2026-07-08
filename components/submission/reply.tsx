'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import TextEditor from './editor';

interface ReplyProps {
  id: string;
  email: string;
  name?: string;
  subject?: string;
}

export default function Reply({ id, email, name, subject }: ReplyProps) {
  const [message, setMessage] = useState('');
  const [newSubject, setNewSubject] = useState(subject);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/submission/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error('Failed to send reply');
        return;
      }

      toast.success('Reply sent');
      setMessage('');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-lg border p-4">
      <label htmlFor="name">Name</label>
      <Input value={name} disabled />
      <label htmlFor="email">email</label>
      <Input value={email} disabled />

      <label htmlFor="subject">subject</label>
      <Input
        value={newSubject}
        placeholder={newSubject}

        // disabled
        onChange={(e) => setNewSubject(e.target.value)}
      />
      <label htmlFor="message">message</label>
      {/* <Textarea
                rows={6}
                placeholder="Write your reply..."
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
            /> */}
      <TextEditor value={message} onChange={setMessage} />

      <Button type="submit">Send Reply</Button>
    </form>
  );
}
