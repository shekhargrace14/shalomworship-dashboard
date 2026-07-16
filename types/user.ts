import { Role } from '@prisma/client';

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  verified?: boolean;
};
