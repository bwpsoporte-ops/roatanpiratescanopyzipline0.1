const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

function loadEnv(file) {
  const values = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values[trimmed.slice(0, separator).trim()] = value;
  }
  return values;
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const env = loadEnv(path.join(root, '.env.local'));
  const client = new Client({ connectionString: env.DATABASE_URL });
  await client.connect();
  try {
    const tables = await client.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema='public' AND table_name IN
       ('admin_users','user_sessions','staff_invitations','reservations','payments','customer_reviews','site_content','media_assets','audit_log')
       ORDER BY table_name`
    );
    const counts = await client.query(
      `SELECT
         (SELECT count(*)::int FROM admin_users) AS users,
         (SELECT count(*)::int FROM reservations) AS reservations,
         (SELECT count(*)::int FROM customer_reviews) AS reviews,
         (SELECT count(*)::int FROM site_content) AS content_sections,
         (SELECT count(*)::int FROM media_assets) AS uploaded_media,
         (SELECT count(*)::int FROM admin_users WHERE is_root=true AND active=true) AS active_roots`
    );
    console.log(JSON.stringify({ tables: tables.rows.map((row) => row.table_name), counts: counts.rows[0] }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Verification failed:', error.message);
  process.exitCode = 1;
});
