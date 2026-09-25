import 'server-only';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var piratesDbPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured.');
  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
  });
}

export const db = globalThis.piratesDbPool ?? createPool();

if (process.env.NODE_ENV !== 'production') globalThis.piratesDbPool = db;

export async function audit(actorId: string | null, action: string, entity: string, entityId?: string, details: Record<string, unknown> = {}) {
  await db.query(
    `INSERT INTO audit_log (actor_id, action, entity_type, entity_id, details)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [actorId, action, entity, entityId ?? null, JSON.stringify(details)]
  );
}
