import { NextRequest, NextResponse } from 'next/server';
import { getBlock } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const block = await getBlock(id);

    if (!block) {
      return new NextResponse('Block not found', { status: 404 });
    }

    // Return the raw code as an HTML document
    return new NextResponse(block.code, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'ALLOWALL', // Important for iframe embedding
      },
    });
  } catch (error) {
    console.error('Error fetching block:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
