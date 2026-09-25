import { NextResponse } from 'next/server';
import { audit, db } from '@/lib/db';
import { publicUser, requireAdministrator, roleToDb } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { apiError } from '@/lib/api-response';
import type { AdminRole } from '@/lib/types';

export const runtime = 'nodejs';

type UserRow = {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'reader';
  active: boolean;
  is_root: boolean;
  created_at: Date | string;
};

const selection = 'id, name, username, role, active, is_root, created_at';

export async function GET() {
  try {
    await requireAdministrator();
    const result = await db.query<UserRow>(`SELECT ${selection} FROM admin_users ORDER BY is_root DESC, created_at ASC`);
    return NextResponse.json(result.rows.map(publicUser));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireAdministrator();
    const body = await request.json();
    const name = String(body.name ?? '').trim().slice(0, 120);
    const username = String(body.username ?? '').trim().slice(0, 80);
    const password = String(body.password ?? '');
    const role = body.role as AdminRole;
    if (name.length < 2 || username.length < 3 || password.length < 8 || !['Administrador general', 'Solo lectura'].includes(role)) {
      return NextResponse.json({ error: 'Invalid user information' }, { status: 400 });
    }
    const hash = await hashPassword(password);
    try {
      const result = await db.query<UserRow>(
        `INSERT INTO admin_users (name, username, password_hash, role)
         VALUES ($1, $2, $3, $4) RETURNING ${selection}`,
        [name, username, hash, roleToDb(role)]
      );
      const user = result.rows[0];
      await db.query(
        `INSERT INTO staff_invitations (invited_by, user_id, username, role, status, accepted_at)
         VALUES ($1, $2, $3, $4, 'accepted', now())`,
        [actor.id, user.id, user.username, user.role]
      );
      await audit(actor.id, 'created', 'admin_user', user.id, { username: user.username, role: user.role });
      return NextResponse.json(publicUser(user), { status: 201 });
    } catch (error) {
      if (error instanceof Error && /unique|duplicate/i.test(error.message)) return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
      throw error;
    }
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireAdministrator();
    const body = await request.json();
    const id = String(body.id ?? '');
    if (!id || id === actor.id) return NextResponse.json({ error: 'You cannot modify the current account here' }, { status: 400 });
    const active = typeof body.isActive === 'boolean' ? body.isActive : undefined;
    const role = body.role as AdminRole | undefined;
    if (role && !['Administrador general', 'Solo lectura'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    const result = await db.query<UserRow>(
      `UPDATE admin_users
          SET active = COALESCE($2, active), role = COALESCE($3, role), updated_at = now()
        WHERE id = $1 AND is_root = false
        RETURNING ${selection}`,
      [id, active ?? null, role ? roleToDb(role) : null]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'User not found or protected' }, { status: 404 });
    if (active === false) await db.query('UPDATE user_sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL', [id]);
    await audit(actor.id, 'updated', 'admin_user', id, { active, role });
    return NextResponse.json(publicUser(result.rows[0]));
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireAdministrator();
    const body = await request.json();
    const id = String(body.id ?? '');
    if (!id || id === actor.id) return NextResponse.json({ error: 'You cannot delete the current account' }, { status: 400 });
    const result = await db.query<UserRow>(`DELETE FROM admin_users WHERE id = $1 AND is_root = false RETURNING ${selection}`, [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'User not found or protected' }, { status: 404 });
    await audit(actor.id, 'deleted', 'admin_user', id, { username: result.rows[0].username });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
