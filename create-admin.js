#!/usr/bin/env node
// scripts/create-admin.js
// Creates (or resets the password for) the admin login. Run this once
// after first deploying, and again any time you need to change the
// password or recover access. There is no default/hardcoded admin
// password anywhere in this codebase — this script is the only way
// a real one gets set.
//
// Usage:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-real-strong-password' npm run create-admin
// or:
//   node scripts/create-admin.js you@example.com 'a-real-strong-password'

require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../db/database");

const email = (process.env.ADMIN_EMAIL || process.argv[2] || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || process.argv[3] || "";

if (!email || !email.includes("@")) {
  console.error("Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' npm run create-admin");
  console.error("(or: node scripts/create-admin.js you@example.com 'a-real-strong-password')");
  process.exit(1);
}
if (!password || password.length < 10) {
  console.error("Refusing to set a password shorter than 10 characters. Choose a real, unique password.");
  process.exit(1);
}

(async () => {
  const hash = await bcrypt.hash(password, 12);
  const existing = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(email);

  if (existing) {
    db.prepare("UPDATE admin_users SET password_hash = ? WHERE email = ?").run(hash, email);
    console.log(`Password updated for existing admin: ${email}`);
  } else {
    db.prepare("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)").run(email, hash);
    console.log(`Admin account created: ${email}`);
  }
  console.log("You can now log in at /admin/ with this email and the password you just set.");
})();
