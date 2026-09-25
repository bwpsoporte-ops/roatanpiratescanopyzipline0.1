import { NextResponse } from 'next/server';
import { audit, db } from '@/lib/db';
import { createSession, destroySession, getSessionUser, publicUser } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { apiError } from '@/lib/api-response';

export const runtime = 'nodejs';

type LoginRow = {
  id: string;
  name: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'reader';
  active: boolean;
  is_root: boolean;
  created_at: Date | string;
  failed_login_attempts: number;
  locked_until: Date | string | null;
};

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ authenticated: Boolean(user), user });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? '').trim().slice(0, 80);
    const password = String(body.password ?? '').slice(0, 256);
    if (!username || !password) return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });

    const result = await db.query<LoginRow>(
      `SELECT id, name, username, password_hash, role, active, is_root, created_at, failed_login_attempts, locked_until
         FROM admin_users WHERE lower(username) = lower($1) LIMIT 1`,
      [username]
    );
    const row = result.rows[0];
    if (row?.locked_until && new Date(row.locked_until).getTime() > Date.now()) {
      return NextResponse.json({ error: 'Account temporarily locked. Try again later.' }, { status: 429 });
    }
    const valid = row && row.active && await verifyPassword(password, row.password_hash);
    if (!valid) {
      if (row) {
        await db.query(
          `UPDATE admin_users SET
             failed_login_attempts = failed_login_attempts + 1,
             locked_until = CASE WHEN failed_login_attempts + 1 >= 5 THEN now() + interval '15 minutes' ELSE NULL END
           WHERE id = $1`,
          [row.id]
        );
      }
      await audit(row?.id ?? null, 'login_failed', 'session', undefined, { username });
      return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });
    }

    await createSession(row.id, request);
    await db.query('UPDATE admin_users SET last_login_at = now(), failed_login_attempts = 0, locked_until = NULL WHERE id = $1', [row.id]);
    await audit(row.id, 'login_succeeded', 'session');
    return NextResponse.json({ authenticated: true, user: publicUser(row) });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    await destroySession();
    if (user) await audit(user.id, 'logout', 'session');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
