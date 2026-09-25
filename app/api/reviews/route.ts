import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { audit, db } from '@/lib/db';
import { getSessionUser, requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api-response';
import type { ReviewItem } from '@/lib/types';

export const runtime = 'nodejs';

type ReviewRow = {
  id: string;
  name: string;
  email: string;
  country: string;
  country_code: string;
  location: string;
  tour: string;
  rating: number;
  comment_es: string;
  comment_en: string;
  avatar_url: string | null;
  verified: boolean;
  active: boolean;
  created_at: Date | string;
};

function serialize(row: ReviewRow, includePrivate: boolean): ReviewItem {
  return {
    id: row.id,
    name: row.name,
    ...(includePrivate ? { email: row.email } : {}),
    country: row.country,
    countryCode: row.country_code,
    location: row.location,
    tour: row.tour,
    rating: row.rating,
    date: new Date(row.created_at).toISOString(),
    comment: { es: row.comment_es, en: row.comment_en },
    ...(row.avatar_url ? { avatarUrl: row.avatar_url } : {}),
    isVerified: row.verified,
    isActive: row.active
  };
}

const columns = 'id,name,email,country,country_code,location,tour,rating,comment_es,comment_en,avatar_url,verified,active,created_at';

export async function GET(request: Request) {
  try {
    const adminRequested = new URL(request.url).searchParams.get('scope') === 'admin';
    const session = adminRequested ? await getSessionUser() : null;
    if (adminRequested && !session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    const result = await db.query<ReviewRow>(
      `SELECT ${columns} FROM customer_reviews ${session ? '' : 'WHERE active=true'} ORDER BY rating DESC, created_at DESC`
    );
    return NextResponse.json(result.rows.map((row) => serialize(row, Boolean(session))));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim().slice(0, 80);
    const email = String(body.email ?? '').trim().toLowerCase().slice(0, 120);
    const country = String(body.country ?? '').trim().slice(0, 80);
    const countryCode = String(body.countryCode ?? '').trim().toLowerCase().slice(0, 2);
    const location = country || String(body.location ?? '').trim().slice(0, 100);
    const tour = String(body.tour ?? '').trim().slice(0, 100);
    const comment = String(body.comment ?? '').trim().slice(0, 1000);
    const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !country || !/^[a-z]{2}$/.test(countryCode) || comment.length < 10) {
      return NextResponse.json({ error: 'Invalid review' }, { status: 400 });
    }
    const id = `review-${randomUUID()}`;
    await db.query(
      `INSERT INTO customer_reviews
       (id,name,email,country,country_code,location,tour,rating,comment_es,comment_en)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)`,
      [id, name, email, country, countryCode, location, tour, rating, comment]
    );
    await audit(null, 'submitted', 'review', id, { rating, countryCode });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    const reviews = await request.json() as ReviewItem[];
    if (!Array.isArray(reviews)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const existing = await db.query<{ id: string }>('SELECT id FROM customer_reviews');
    const nextIds = new Set(reviews.map((review) => review.id));
    for (const review of reviews) {
      await db.query(
        `UPDATE customer_reviews SET
           name=$2, email=COALESCE($3,email), country=$4, country_code=$5, location=$6, tour=$7,
           rating=$8, comment_es=$9, comment_en=$10, avatar_url=$11, verified=$12, active=$13, updated_at=now()
         WHERE id=$1`,
        [review.id, review.name, review.email ?? null, review.country ?? review.location, review.countryCode ?? 'hn', review.location, review.tour, review.rating, review.comment.es, review.comment.en, review.avatarUrl ?? null, review.isVerified, review.isActive]
      );
    }
    const removedIds = existing.rows.map((row) => row.id).filter((id) => !nextIds.has(id));
    if (removedIds.length) await db.query('DELETE FROM customer_reviews WHERE id = ANY($1::text[])', [removedIds]);
    await audit(user.id, 'moderated', 'reviews', undefined, { updated: reviews.length, deleted: removedIds.length });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
