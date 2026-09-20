import { NextResponse } from 'next/server';
import { mockBooks } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const book = mockBooks.find((b) => b.id === params.id || b.slug === params.id);

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  // Related products logic: same category or author
  const relatedBooks = mockBooks
    .filter((b) => b.id !== book.id && (b.categoryId === book.categoryId || b.brandId === book.brandId))
    .slice(0, 4);

  return NextResponse.json({ book, relatedBooks });
}
