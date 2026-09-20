import { NextResponse } from 'next/server';
import { mockBrands } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockBrands);
}
