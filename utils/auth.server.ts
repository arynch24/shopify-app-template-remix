// app/utils/auth.server.ts
import { authenticate } from '../app/shopify.server';

export async function getSessionShop(request: Request): Promise<string> {
  const { session } = await authenticate.admin(request);
  return session.shop;
}
