import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import type { AdminRole, AdminUser } from '@/lib/types';

export const SESSION_COOKIE = 'pirates_admin_session';
const SESSION_DAYS = 7;

type SessionRow = {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'reader';
  active: boolean;
  is_root: boolean;
  created_at: Date | string;
};

export function roleFromDb(role: SessionRow['role']): AdminRole {
  return role === 'admin' ? 'Administrador general' : 'Solo lectura';
}

export function roleToDb(role: AdminRole): 'admin' | 'reader' {
  return role === 'Administrador general' ? 'admin' : 'reader';
}

export function publicUser(row: SessionRow): AdminUser {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    role: roleFromDb(row.role),
    isActive: row.active,
    isRoot: row.is_root,
    createdAt: new Date(row.created_at).toISOString()
  };
}

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string, request: Request) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.query(
    `INSERT INTO user_sessions (user_id, token_hash, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, tokenHash(token), expiresAt, request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null, request.headers.get('user-agent')?.slice(0, 500) ?? null]
  );
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await db.query('UPDATE user_sessions SET revoked_at = now() WHERE token_hash = $1', [tokenHash(token)]);
  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
}

export async function getSessionUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const result = await db.query<SessionRow>(
    `SELECT u.id, u.name, u.username, u.role, u.active, u.is_root, u.created_at
       FROM user_sessions s
       JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now() AND u.active = true
      LIMIT 1`,
    [tokenHash(token)]
  );
  const user = result.rows[0];
  if (!user) return null;
  void db.query('UPDATE user_sessions SET last_seen_at = now() WHERE token_hash = $1', [tokenHash(token)]).catch(() => undefined);
  return publicUser(user);
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdministrator() {
  const user = await requireUser();
  if (user.role !== 'Administrador general') throw new Error('FORBIDDEN');
  return user;
}
