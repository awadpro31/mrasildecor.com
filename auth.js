// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/database");
const { loginLimiter, requireAuth, logActivity } = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email.trim().toLowerCase());
  if (!user) {
    logActivity("login_failed", `unknown email: ${email}`, req);
    // Same error for "no such user" and "wrong password" — never reveal which.
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    logActivity("login_failed", `wrong password for: ${email}`, req);
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "Could not start a session." });
    req.session.adminId = user.id;
    req.session.email = user.email;
    logActivity("login_success", user.email, req);
    res.json({ ok: true, email: user.email });
  });
});

router.post("/logout", requireAuth, (req, res) => {
  const email = req.session.email;
  req.session.destroy(() => {
    logActivity("logout", email, req);
    res.clearCookie("mrasil.sid");
    res.json({ ok: true });
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ email: req.session.email });
});

module.exports = router;
