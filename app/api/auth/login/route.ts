// router.post("/login", loginController)
import { loginController } from '@/lib/controllers/auth.controller';

export async function POST(req: Request) {
  return loginController(req);
}
