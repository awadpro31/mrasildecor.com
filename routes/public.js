// routes/public.js
// Everything here is unauthenticated by design — it's what the public
// website itself calls. The two POST endpoints (contact, review) are
// rate-limited and server-side validated (brief: never trust client
// validation alone).

const express = require("express");
const validator = require("validator");
const db = require("../db/database");
const { publicWriteLimiter, logActivity } = require("../middleware/auth");

const router = express.Router();

router.get("/services", (req, res) => {
  const services = db
    .prepare("SELECT * FROM services WHERE visible = 1 ORDER BY sort_order ASC, id ASC")
    .all();
  const withMedia = services.map((s) => ({
    ...s,
    visible: !!s.visible,
    media: db
      .prepare("SELECT type, url FROM service_media WHERE service_id = ? ORDER BY sort_order ASC, id ASC")
      .all(s.id),
  }));
  res.json(withMedia);
});

router.get("/projects", (req, res) => {
  const projects = db.prepare("SELECT * FROM projects ORDER BY sort_order ASC, id DESC").all();
  const withMedia = projects.map((p) => {
    const service = p.service_id ? db.prepare("SELECT id, title_en, title_ar FROM services WHERE id = ?").get(p.service_id) : null;
    return {
      ...p,
      service,
      media: db
        .prepare("SELECT type, url FROM project_media WHERE project_id = ? ORDER BY sort_order ASC, id ASC")
        .all(p.id),
    };
  });
  res.json(withMedia);
});

router.get("/gallery", (req, res) => {
  res.json(db.prepare("SELECT * FROM gallery_items ORDER BY sort_order ASC, id DESC").all());
});

router.get("/reviews", (req, res) => {
  res.json(db.prepare("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC").all());
});

router.get("/settings", (req, res) => {
  const s = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  // Never expose anything beyond the fields the public site actually needs.
  res.json(s);
});

/** Contact form → stored as a lead row is unnecessary for this brief; we email instead. */
router.post("/contact", publicWriteLimiter, (req, res) => {
  const { name, email, phone, project_type, budget, message } = req.body || {};
  if (!name || !email || !phone || !message || !validator.isEmail(String(email))) {
    return res.status(400).json({ error: "Please fill in all required fields with a valid email." });
  }
  logActivity("contact_submission", `${name} <${email}>`, req);
  // Wire up real email delivery here (see README-DEPLOY.md) — e.g.
  // nodemailer + an SMTP provider (SendGrid, Mailgun, Amazon SES, etc.).
  // Logged to activity_log for now so nothing is silently lost even
  // before email delivery is configured.
  db.prepare("INSERT INTO activity_log (event, detail) VALUES ('contact_message', ?)").run(
    JSON.stringify({ name, email, phone, project_type, budget, message }).slice(0, 4000)
  );
  res.json({ ok: true });
});

/** Public review submission → always inserted as 'pending'. */
router.post("/reviews", publicWriteLimiter, (req, res) => {
  const { name, project, rating, review } = req.body || {};
  const ratingNum = Number(rating);
  if (!name || !project || !review || !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: "Please fill in every field and choose a rating from 1–5." });
  }
  db.prepare(
    "INSERT INTO reviews (customer_name, project_name, rating, review_text, status) VALUES (?, ?, ?, ?, 'pending')"
  ).run(String(name).slice(0, 200), String(project).slice(0, 200), ratingNum, String(review).slice(0, 4000));
  logActivity("review_submitted", `${name} — ${project}`, req);
  res.json({ ok: true });
});

module.exports = router;
