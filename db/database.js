// db/database.js
// SQLite connection (better-sqlite3 — synchronous, fast, no separate
// DB server to run/manage). WAL mode for safer concurrent read/write
// under real traffic. Foreign keys enforced so cascading deletes
// (e.g. deleting a project cleans up its media rows) actually happen.

const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "mrasil.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initSchema() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  db.exec(schema);

  // Ensure the single settings row exists.
  const row = db.prepare("SELECT id FROM settings WHERE id = 1").get();
  if (!row) {
    db.prepare("INSERT INTO settings (id) VALUES (1)").run();
  }
}

initSchema();

module.exports = db;
