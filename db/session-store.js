// db/session-store.js
// A minimal SQLite-backed express-session store, written in-house
// rather than pulling in a low-adoption third-party package for
// something this small. Sessions survive server restarts (unlike the
// default MemoryStore) and expired rows are swept on an interval.

const session = require("express-session");
const db = require("./database");

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
`);

class SqliteSessionStore extends session.Store {
  constructor(options = {}) {
    super(options);
    this.ttlMs = options.ttlMs || 24 * 60 * 60 * 1000; // 24h default
    this._sweep();
    this._sweepTimer = setInterval(() => this._sweep(), 60 * 60 * 1000); // hourly
    this._sweepTimer.unref?.();
  }

  _sweep() {
    try {
      db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
    } catch (e) {
      console.error("Session sweep failed:", e.message);
    }
  }

  get(sid, cb) {
    try {
      const row = db.prepare("SELECT data, expires_at FROM sessions WHERE sid = ?").get(sid);
      if (!row || row.expires_at < Date.now()) return cb(null, null);
      cb(null, JSON.parse(row.data));
    } catch (e) {
      cb(e);
    }
  }

  set(sid, sessionData, cb) {
    try {
      const maxAge = sessionData.cookie && sessionData.cookie.maxAge ? sessionData.cookie.maxAge : this.ttlMs;
      const expiresAt = Date.now() + maxAge;
      db.prepare(
        "INSERT INTO sessions (sid, data, expires_at) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at"
      ).run(sid, JSON.stringify(sessionData), expiresAt);
      cb && cb();
    } catch (e) {
      cb && cb(e);
    }
  }

  destroy(sid, cb) {
    try {
      db.prepare("DELETE FROM sessions WHERE sid = ?").run(sid);
      cb && cb();
    } catch (e) {
      cb && cb(e);
    }
  }

  touch(sid, sessionData, cb) {
    // Refresh expiry without rewriting the full payload.
    try {
      const maxAge = sessionData.cookie && sessionData.cookie.maxAge ? sessionData.cookie.maxAge : this.ttlMs;
      db.prepare("UPDATE sessions SET expires_at = ? WHERE sid = ?").run(Date.now() + maxAge, sid);
      cb && cb();
    } catch (e) {
      cb && cb(e);
    }
  }
}

module.exports = SqliteSessionStore;
