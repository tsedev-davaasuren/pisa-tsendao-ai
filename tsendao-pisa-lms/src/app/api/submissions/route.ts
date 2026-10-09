import { NextResponse } from 'next/server';

declare global {
  var submissionsStore: any[];
}

if (!globalThis.submissionsStore) {
  globalThis.submissionsStore = [];
}

export async function GET() {
  return NextResponse.json(globalThis.submissionsStore || [], {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (data) {
      globalThis.submissionsStore.unshift(data);
    }
    return NextResponse.json({ success: true, count: globalThis.submissionsStore.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  globalThis.submissionsStore = [];
  return NextResponse.json({ success: true, message: 'Түүх цэвэрлэгдлээ.' });
}