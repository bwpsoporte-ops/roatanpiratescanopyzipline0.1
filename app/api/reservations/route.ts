import { randomInt, randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { audit, db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { apiError } from '@/lib/api-response';
import type { Reservation } from '@/lib/types';

export const runtime = 'nodejs';

type ReservationRow = { payload: Reservation };

function cleanBooking(value: unknown): Omit<Reservation, 'id' | 'code' | 'createdAt'> | null {
  if (!value || typeof value !== 'object') return null;
  const body = value as Record<string, unknown>;
  const customerName = String(body.customerName ?? '').trim().slice(0, 120);
  const phone = String(body.phone ?? '').trim().slice(0, 50);
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 160);
  const date = String(body.date ?? '');
  if (customerName.length < 2 || phone.length < 6 || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { ...body, customerName, phone, email, date } as Omit<Reservation, 'id' | 'code' | 'createdAt'>;
}

export async function GET() {
  try {
    await requireUser();
    const result = await db.query<ReservationRow>('SELECT payload FROM reservations ORDER BY created_at DESC');
    return NextResponse.json(result.rows.map((row) => row.payload));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const booking = cleanBooking(await request.json());
    if (!booking) return NextResponse.json({ error: 'Invalid reservation information' }, { status: 400 });
    const id = `res-${randomUUID()}`;
    const code = `POTC-${new Date().getUTCFullYear().toString().slice(-2)}${randomInt(100000, 999999)}`;
    const createdAt = new Date().toISOString();
    const reservation: Reservation = { ...booking, id, code, createdAt };
    await db.query(
      `INSERT INTO reservations
       (id, code, customer_name, customer_email, customer_phone, tour_date, status, total_amount, paid_amount, payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb)`,
      [id, code, reservation.customerName, reservation.email, reservation.phone, reservation.date, reservation.status, reservation.totalAmount, reservation.paidAmount, JSON.stringify(reservation)]
    );
    await audit(null, 'created', 'reservation', id, { code });
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    const reservation = await request.json() as Reservation;
    if (!reservation?.id || !reservation.code) return NextResponse.json({ error: 'Invalid reservation' }, { status: 400 });
    const result = await db.query(
      `UPDATE reservations SET
         customer_name=$2, customer_email=$3, customer_phone=$4, tour_date=$5, status=$6,
         total_amount=$7, paid_amount=$8, payload=$9::jsonb, updated_at=now()
       WHERE id=$1`,
      [reservation.id, reservation.customerName, reservation.email, reservation.phone, reservation.date, reservation.status, reservation.totalAmount, reservation.paidAmount, JSON.stringify(reservation)]
    );
    if (!result.rowCount) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    await audit(user.id, 'updated', 'reservation', reservation.id, { code: reservation.code, status: reservation.status });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const id = String(body.id ?? '');
    const username = String(body.username ?? '').trim();
    const password = String(body.password ?? '');
    const verification = await db.query<{ password_hash: string }>(
      'SELECT password_hash FROM admin_users WHERE id=$1 AND lower(username)=lower($2) AND active=true',
      [user.id, username]
    );
    if (!verification.rows[0] || !await verifyPassword(password, verification.rows[0].password_hash)) {
      return NextResponse.json({ error: 'Credentials do not match the current session' }, { status: 403 });
    }
    const result = await db.query<{ code: string }>('DELETE FROM reservations WHERE id=$1 RETURNING code', [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    await audit(user.id, 'deleted', 'reservation', id, { code: result.rows[0].code });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
