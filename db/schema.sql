-- MRASIL production schema (SQLite).
-- Real relational tables — services, projects, and gallery items each
-- get proper child tables for their media (images/videos), so a
-- gallery/upload/delete/reorder operation is a real row operation, not
-- a JSON blob mutation.

CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  title_en        TEXT NOT NULL,
  title_ar        TEXT NOT NULL,
  description_en  TEXT DEFAULT '',
  description_ar  TEXT DEFAULT '',
  visible         INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS service_media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id  INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK(type IN ('image','video')),
  url         TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id      INTEGER REFERENCES services(id) ON DELETE SET NULL,
  title_en        TEXT NOT NULL,
  title_ar        TEXT NOT NULL,
  description_en  TEXT DEFAULT '',
  description_ar  TEXT DEFAULT '',
  location_en     TEXT DEFAULT 'Private Residence',
  location_ar     TEXT DEFAULT 'مسكن خاص',
  year            TEXT DEFAULT '20XX',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK(type IN ('image','video')),
  url         TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  title_en       TEXT NOT NULL,
  title_ar       TEXT NOT NULL,
  space_type_en  TEXT NOT NULL,
  space_type_ar  TEXT NOT NULL,
  image          TEXT NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  project_name  TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  review_text   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  id             INTEGER PRIMARY KEY CHECK (id = 1),
  whatsapp       TEXT DEFAULT '971545448945',
  phone          TEXT DEFAULT '+971 56 399 5623',
  email          TEXT DEFAULT 'eng.mohamed@mrasildecor.com',
  address_en     TEXT DEFAULT '',
  address_ar     TEXT DEFAULT '',
  maps_url       TEXT DEFAULT 'https://maps.app.goo.gl/bERqyzkfWQLWrmcX6',
  maps_lat       TEXT DEFAULT '25.578957',
  maps_lng       TEXT DEFAULT '56.2606205',
  working_hours  TEXT DEFAULT 'Sun – Thu, 9:00 – 18:00',
  default_lang   TEXT DEFAULT 'ar',
  instagram      TEXT DEFAULT '',
  linkedin       TEXT DEFAULT ''
);

-- Security/audit log — brief §18.M. Never log passwords or session tokens.
CREATE TABLE IF NOT EXISTS activity_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  event      TEXT NOT NULL,
  detail     TEXT DEFAULT '',
  ip         TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_service_media_service ON service_media(service_id);
CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_service ON projects(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
