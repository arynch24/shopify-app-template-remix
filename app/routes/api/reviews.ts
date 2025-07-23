// app/routes/api/reviews.ts
import { json } from '@remix-run/node';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import prisma from '../../db.server';

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get("product");
    const shop = url.searchParams.get("shop");

    if (!productId || !shop) {
        return json({ success: false, message: "Product ID and shop are required." }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
        where: { productId, shop },
        orderBy: { createdAt: "desc" },
    });

    return json({ reviews });
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const { productId, shop, author, content } = body;

  const review = await prisma.review.create({
    data: { productId, shop, author, content },
  });

  return json({ success: true, review });
};
