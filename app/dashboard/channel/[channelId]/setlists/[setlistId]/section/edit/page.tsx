'use client';
// import SectionEdit from '@/components/setlist/section/section-edit'
import SectionEdit from '@/components/setlist/section/section-edit';
import { useParams } from 'next/navigation';
import React from 'react';

const page = () => {
  const params = useParams<{
    channelId: string;
    setlistId: string;
  }>();
  const channelId = params.channelId;

  return <div>{/* <SectionEdit channelId={channelId} data={} /> */}</div>;
};

export default page;
