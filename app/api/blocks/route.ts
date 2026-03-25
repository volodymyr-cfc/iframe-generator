import { NextResponse } from 'next/server';
import { saveBlock } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Code content is required' },
        { status: 400 }
      );
    }

    const id = await saveBlock(code);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error saving block:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
