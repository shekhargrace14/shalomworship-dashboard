'use client';
import DataTable from '@/components/table/DataTable';
import React, { useEffect, useState } from 'react';

const page = () => {
  const [submission, setSubmission] = useState<any>();

  useEffect(() => {
    const fetchSubmission = async () => {
      const res = await fetch('/api/submission');
      const data = await res.json();
      setSubmission(data.data);
    };
    fetchSubmission();
  }, []);
  return (
    <div>
      <DataTable data={submission} type="submission" />
    </div>
  );
};

export default page;
