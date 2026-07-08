'use client';

import { useUserStore } from '@/store/useUserStore';
import { user } from '@prisma/client';
import { useEffect } from 'react';

export default function UserHydrator({ user, children }: { user: user; children: React.ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}
