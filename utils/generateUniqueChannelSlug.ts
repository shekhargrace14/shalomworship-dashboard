import { Prisma } from '@prisma/client';
import slugify from 'slugify';

export async function generateUniqueChannelSlug(tx: Prisma.TransactionClient, title: string) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await tx.channel.findUnique({
      where: {
        slug,
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
