import { DeleteItemButton } from '@/components/shared/DeleteItemButton';
import { headers } from 'next/headers';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  const res = await fetch(`${protocol}://${host}/api/category/${id}`);
  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error('API error');
  }
  const data = await res.json();
  const category = await data.category;

  return (
    <div>
      category ID:
      {category.id},{category.title}
      <DeleteItemButton id={category.id} type="category" />
    </div>
  );
}
