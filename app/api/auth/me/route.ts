import { meController } from '@/lib/controllers/auth.controller';

export function GET(req: Request) {
  return meController();
}
