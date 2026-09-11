// middleware/auth.js
// Real session-based auth. No hardcoded password anywhere in this file
// or any other — the only password that exists is the bcrypt hash
// stored in admin_users, created once via scripts/create-admin.js.

const rateLimit = require("express-rate-limit");
const db = require("../db/database");

/** Blocks any /api/admin/* route unless a valid session exists. */
function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ error: "Not authenticated." });
}

/**
 * Brute-force protection on the login endpoint specifically (brief
 * §18.A: "rate limiting for login attempts"). Keyed by IP; 8 attempts
 * per 10 minutes is generous for a real admin who mistypes, but hostile
 * to a credential-stuffing script.
 */
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please wait a few minutes and try again." },
});

/** General API rate limit — a sane ceiling for every route, admin or public. */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

/** Tighter limit specifically for the two public write endpoints (contact + review). */
const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions from this connection. Please try again later." },
});

function logActivity(event, detail, req) {
  try {
    db.prepare("INSERT INTO activity_log (event, detail, ip) VALUES (?, ?, ?)").run(
      event,
      detail || "",
      req && req.ip ? req.ip : ""
    );
  } catch (e) {
    // Logging must never crash a request.
    console.error("Failed to write activity log:", e.message);
  }
}

module.exports = { requireAuth, loginLimiter, apiLimiter, publicWriteLimiter, logActivity };
