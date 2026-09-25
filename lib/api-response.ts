import { NextResponse } from 'next/server';

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : 'UNKNOWN';
  if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
  console.error('API error', error);
  return NextResponse.json({ error: 'Server request failed' }, { status: 500 });
}
