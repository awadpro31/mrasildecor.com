// routes/reviews.js — admin moderation (approve/reject/edit/delete).
// Public submission lives in routes/public.js, not here — this whole
// router requires an authenticated admin session.
const express = require("express");
const db = require("../db/database");
const { requireAuth, logActivity } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  const status = ["pending", "approved", "rejected"].includes(req.query.status) ? req.query.status : null;
  const rows = status
    ? db.prepare("SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC").all(status)
    : db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all();
  res.json(rows);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Review not found." });
  const b = req.body || {};
  db.prepare(
    "UPDATE reviews SET customer_name = ?, project_name = ?, rating = ?, review_text = ? WHERE id = ?"
  ).run(
    b.customer_name ?? existing.customer_name,
    b.project_name ?? existing.project_name,
    b.rating !== undefined ? Number(b.rating) : existing.rating,
    b.review_text ?? existing.review_text,
    id
  );
  logActivity("review_edited", `#${id}`, req);
  res.json(db.prepare("SELECT * FROM reviews WHERE id = ?").get(id));
});

router.put("/:id/status", (req, res) => {
  const { status } = req.body || {};
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "status must be pending, approved, or rejected." });
  }
  const id = Number(req.params.id);
  const result = db.prepare("UPDATE reviews SET status = ? WHERE id = ?").run(status, id);
  if (result.changes === 0) return res.status(404).json({ error: "Review not found." });
  logActivity("review_status_changed", `#${id} -> ${status}`, req);
  res.json(db.prepare("SELECT * FROM reviews WHERE id = ?").get(id));
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
  logActivity("review_deleted", `#${id}`, req);
  res.json({ ok: true });
});

module.exports = router;
