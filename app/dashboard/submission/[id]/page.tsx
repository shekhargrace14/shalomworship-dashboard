'use client';

import Reply from '@/components/submission/reply';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { submission } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function page() {
  const params = useParams();

  const id = params.id as string;

  const [submission, setSubmission] = useState<submission | null>(null);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/submission/${id}`);

      if (!res.ok) {
        console.error('API Error', res.status);
        const text = await res.text();
        console.error(text);
        return;
      }
      const data = await res.json();
      setSubmission(data.data);
    }
    if (id) {
      load();
    }
  }, [id]);

  function InfoItem({ label, value }: { label: string; value: any }) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>

        <p className="font-medium">{value || '-'}</p>
      </div>
    );
  }

  return (
    <>
      <Card className="max-w-4xl m-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{submission?.title || 'Submission'}</CardTitle>

            <Badge>{submission?.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem label="Name" value={submission?.name} />

            <InfoItem label="Email" value={submission?.email} />

            <InfoItem label="Type" value={submission?.type} />

            <InfoItem label="Subject" value={submission?.subject} />

            <InfoItem
              label="Created"
              value={new Date(
                //   submission?.createdAt
              ).toLocaleString()}
            />
          </div>

          {/* Message */}
          {submission?.message && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Message</h3>

              <div className="rounded-lg border p-4 whitespace-pre-wrap">{submission.message}</div>
            </div>
          )}

          {/* Payload */}
          {submission?.payload && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Payload</h3>

              <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs">{JSON.stringify(submission.payload, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button onClick={() => setShowReply((prev) => !prev)}>{showReply ? 'Hide Reply' : 'Reply'}</Button>

        {showReply && <Reply id={submission?.id || ''} email={submission?.email || ''} name={submission?.name || ''} subject={submission?.subject || ''} />}
      </div>
    </>
  );
}
