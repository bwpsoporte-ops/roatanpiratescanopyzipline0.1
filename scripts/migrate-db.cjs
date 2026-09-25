const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const { Client } = require('pg');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
  });
  module._compile(compiled.outputText, filename);
};

function loadEnv(file) {
  const values = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values[key] = value;
  }
  return values;
}

async function passwordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await promisify(crypto.scrypt)(password, salt, 64);
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const env = loadEnv(path.join(root, '.env.local'));
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is missing from .env.local');
  if (!env.ADMIN_ROOT_USERNAME || !env.ADMIN_ROOT_PASSWORD) throw new Error('Root credentials are missing from .env.local');

  const client = new Client({ connectionString: env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(fs.readFileSync(path.join(root, 'database', 'schema.sql'), 'utf8'));
    const hash = await passwordHash(env.ADMIN_ROOT_PASSWORD);
    const rootUser = await client.query(
      `INSERT INTO admin_users (name, username, password_hash, role, active, is_root)
       VALUES ($1, $2, $3, 'admin', true, true)
       ON CONFLICT (lower(username)) DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         role = 'admin',
         active = true,
         is_root = true,
         updated_at = now()
       RETURNING id`,
      ['BWP Root Administrator', env.ADMIN_ROOT_USERNAME, hash]
    );
    const productionContent = require(path.join(root, 'lib', 'data.ts'));
    const contentEntries = [
      ['siteConfig', productionContent.initialSiteConfig],
      ['tours', productionContent.initialTours],
      ['prices', productionContent.initialPrices],
      ['gallery', productionContent.initialGallery],
      ['faqs', productionContent.initialFaqs]
    ];
    for (const [key, value] of contentEntries) {
      await client.query(
        `INSERT INTO site_content (key, value, updated_by)
         VALUES ($1, $2::jsonb, $3)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value), rootUser.rows[0].id]
      );
    }
    await client.query('COMMIT');
    console.log('Database schema created and root administrator initialized.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
});
