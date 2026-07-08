'use client';

import DataTable from '@/components/table/DataTable';
import { use, useEffect, useState } from 'react';

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/user');

        const data = await res.json();

        setUsers(data.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
      <DataTable data={users} type="user" />
    </div>
  );
}
