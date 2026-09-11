// routes/settings.js — the one-row site settings table.
const express = require("express");
const db = require("../db/database");
const { requireAuth, logActivity } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM settings WHERE id = 1").get());
});

router.get("/activity", (req, res) => {
  const rows = db.prepare("SELECT * FROM activity_log ORDER BY id DESC LIMIT 30").all();
  res.json(rows);
});

router.put("/", (req, res) => {
  const existing = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  const b = req.body || {};
  const fields = [
    "whatsapp", "phone", "email", "address_en", "address_ar",
    "maps_url", "maps_lat", "maps_lng", "working_hours", "default_lang",
    "instagram", "linkedin",
  ];
  const merged = {};
  fields.forEach((f) => { merged[f] = b[f] !== undefined ? String(b[f]) : existing[f]; });

  db.prepare(
    `UPDATE settings SET
       whatsapp=@whatsapp, phone=@phone, email=@email, address_en=@address_en, address_ar=@address_ar,
       maps_url=@maps_url, maps_lat=@maps_lat, maps_lng=@maps_lng, working_hours=@working_hours,
       default_lang=@default_lang, instagram=@instagram, linkedin=@linkedin
     WHERE id = 1`
  ).run(merged);

  logActivity("settings_updated", "", req);
  res.json(db.prepare("SELECT * FROM settings WHERE id = 1").get());
});

module.exports = router;
