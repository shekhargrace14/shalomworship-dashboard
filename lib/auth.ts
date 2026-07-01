// lib/auth.ts

import { Role } from "@prisma/client";
// import { getCurrentUser } from "@/lib/services/auth.service";
import { ApiError } from "./api-error";
import { getCurrentUserService } from "./services/auth.service";

export async function requireRole(...roles: Role[]) {
  const user = await getCurrentUserService();

  if (!roles.includes(user.role)) {
   
    throw new ApiError(403, "Forbidden");
  }

  return user;
}