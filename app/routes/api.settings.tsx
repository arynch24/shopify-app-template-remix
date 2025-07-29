// app/routes/api/public/shop-settings.ts
import type { LoaderFunction } from '@remix-run/node';
import prisma from '../db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return new Response(JSON.stringify({ error: 'Missing shop' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const settings = await prisma.shopSetting.findUnique({ where: { shop } });

  return new Response(
    JSON.stringify({
      primaryColor: settings?.primaryColor || '#000000',
      fontSize: settings?.fontSize || 16,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
