import { NextResponse } from 'next/server';
import { audit, db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api-response';

export const runtime = 'nodejs';

const allowedKeys = new Set(['siteConfig', 'tours', 'prices', 'gallery', 'faqs']);

export async function GET() {
  try {
    const result = await db.query<{ key: string; value: unknown }>('SELECT key, value FROM site_content');
    return NextResponse.json(Object.fromEntries(result.rows.map((row) => [row.key, row.value])));
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const key = String(body.key ?? '');
    if (!allowedKeys.has(key) || body.value === undefined) return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 });
    await db.query(
      `INSERT INTO site_content (key, value, updated_by)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()`,
      [key, JSON.stringify(body.value), user.id]
    );
    await audit(user.id, 'updated', 'site_content', key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
