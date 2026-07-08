import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

const FromSongSeo = ({ initialData }: any) => {
  return (
    <div>
      <>
        <CardHeader>
          <CardTitle>Manage SEO {initialData.id}</CardTitle>
          <CardDescription>Optimize your song page visibility for search engines.</CardDescription>
        </CardHeader>
      </>
    </div>
  );
};

export default FromSongSeo;
