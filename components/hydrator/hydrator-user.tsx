'use client';

import { useUserStore } from '@/store/useUserStore';
import { User } from '@/types/user';
// import { user } from '@prisma/client';
import { useEffect } from 'react';

export default function UserHydrator({ user, children }: { user: User; children: React.ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}
