CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  username text NOT NULL CHECK (char_length(username) BETWEEN 3 AND 80),
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'reader' CHECK (role IN ('admin', 'reader')),
  active boolean NOT NULL DEFAULT true,
  is_root boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz,
  failed_login_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz
);
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS failed_login_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS locked_until timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_username_lower_idx ON admin_users (lower(username));
CREATE UNIQUE INDEX IF NOT EXISTS one_root_user_idx ON admin_users (is_root) WHERE is_root = true;

CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  ip_address text,
  user_agent text
);
CREATE INDEX IF NOT EXISTS user_sessions_active_idx ON user_sessions (token_hash, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS staff_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invited_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  username text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'reader')),
  status text NOT NULL DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);

CREATE TABLE IF NOT EXISTS reservations (
  id text PRIMARY KEY,
  code text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  tour_date date NOT NULL,
  status text NOT NULL,
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  paid_amount numeric(12,2) NOT NULL DEFAULT 0,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reservations_date_idx ON reservations (tour_date);
CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations (status);
CREATE INDEX IF NOT EXISTS reservations_customer_idx ON reservations (lower(customer_name), lower(customer_email));

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id text REFERENCES reservations(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'BAC',
  provider_reference text,
  amount numeric(12,2) NOT NULL,
  currency char(3) NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_reference_idx ON payments(provider, provider_reference) WHERE provider_reference IS NOT NULL;

CREATE TABLE IF NOT EXISTS customer_reviews (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  country text NOT NULL,
  country_code char(2) NOT NULL,
  location text NOT NULL,
  tour text NOT NULL DEFAULT '',
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment_es text NOT NULL,
  comment_en text NOT NULL,
  avatar_url text,
  verified boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS customer_reviews_public_idx ON customer_reviews (active, rating DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('image', 'video')),
  storage_provider text NOT NULL DEFAULT 'local',
  storage_key text NOT NULL,
  public_url text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  width integer,
  height integer,
  duration_seconds numeric(10,2),
  uploaded_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS media_assets_visible_idx ON media_assets(created_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  actor_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_created_idx ON audit_log(created_at DESC);

INSERT INTO schema_migrations(version) VALUES ('001_initial_platform') ON CONFLICT (version) DO NOTHING;
