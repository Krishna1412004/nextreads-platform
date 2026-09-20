import { NextResponse } from 'next/server';
import { mockBooks } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const brandSlug = searchParams.get('brand');
  const query = searchParams.get('q')?.toLowerCase();
  const featured = searchParams.get('featured');

  let filtered = [...mockBooks];

  if (categorySlug) {
    filtered = filtered.filter((b) => b.categoryId === categorySlug || b.slug.includes(categorySlug));
  }

  if (brandSlug) {
    filtered = filtered.filter((b) => b.brandId === brandSlug || b.slug.includes(brandSlug));
  }

  if (query) {
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
    );
  }

  if (featured === 'true') {
    filtered = filtered.filter((b) => b.featured);
  }

  return NextResponse.json(filtered);
}
