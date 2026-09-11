// routes/services.js — admin CRUD for the 8 service categories.
const express = require("express");
const db = require("../db/database");
const { requireAuth, logActivity } = require("../middleware/auth");
const { uploadImage, uploadVideo, publicUrlFor, deleteUploadedFile, verifyRealFileType } = require("../middleware/upload");

const router = express.Router();
router.use(requireAuth);

function withMedia(service) {
  const media = db
    .prepare("SELECT id, type, url, sort_order FROM service_media WHERE service_id = ? ORDER BY sort_order ASC, id ASC")
    .all(service.id);
  return { ...service, visible: !!service.visible, media };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM services ORDER BY sort_order ASC, id ASC").all();
  res.json(rows.map(withMedia));
});

router.post("/", (req, res) => {
  const { title_en, title_ar, description_en, description_ar, sort_order } = req.body || {};
  if (!title_en || !title_ar) {
    return res.status(400).json({ error: "English and Arabic titles are required." });
  }
  const info = db
    .prepare(
      "INSERT INTO services (title_en, title_ar, description_en, description_ar, sort_order) VALUES (?, ?, ?, ?, ?)"
    )
    .run(title_en.trim(), title_ar.trim(), description_en || "", description_ar || "", Number(sort_order) || 0);
  logActivity("service_created", title_en, req);
  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(withMedia(row));
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM services WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Service not found." });

  const { title_en, title_ar, description_en, description_ar, visible, sort_order } = req.body || {};
  db.prepare(
    `UPDATE services SET
       title_en = ?, title_ar = ?, description_en = ?, description_ar = ?,
       visible = ?, sort_order = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title_en ?? existing.title_en,
    title_ar ?? existing.title_ar,
    description_en ?? existing.description_en,
    description_ar ?? existing.description_ar,
    visible === undefined ? existing.visible : visible ? 1 : 0,
    sort_order === undefined ? existing.sort_order : Number(sort_order),
    id
  );
  logActivity("service_updated", `#${id}`, req);
  res.json(withMedia(db.prepare("SELECT * FROM services WHERE id = ?").get(id)));
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const media = db.prepare("SELECT url FROM service_media WHERE service_id = ?").all(id);
  db.prepare("DELETE FROM services WHERE id = ?").run(id); // ON DELETE CASCADE removes service_media rows
  media.forEach((m) => deleteUploadedFile(m.url));
  logActivity("service_deleted", `#${id}`, req);
  res.json({ ok: true });
});

/** Upload an image to a service's gallery. */
router.post("/:id/media/image", uploadImage.single("file"), verifyRealFileType("image"), (req, res) => {
  const id = Number(req.params.id);
  if (!db.prepare("SELECT id FROM services WHERE id = ?").get(id)) {
    return res.status(404).json({ error: "Service not found." });
  }
  if (!req.file) return res.status(400).json({ error: "No valid image file received." });
  const url = publicUrlFor("image", req.file.filename);
  const info = db
    .prepare("INSERT INTO service_media (service_id, type, url) VALUES (?, 'image', ?)")
    .run(id, url);
  logActivity("service_image_uploaded", `service #${id}`, req);
  res.status(201).json({ id: info.lastInsertRowid, type: "image", url });
});

/** Upload a video to a service (optional, single process clip). */
router.post("/:id/media/video", uploadVideo.single("file"), verifyRealFileType("video"), (req, res) => {
  const id = Number(req.params.id);
  if (!db.prepare("SELECT id FROM services WHERE id = ?").get(id)) {
    return res.status(404).json({ error: "Service not found." });
  }
  if (!req.file) return res.status(400).json({ error: "No valid video file received." });
  const url = publicUrlFor("video", req.file.filename);
  const info = db
    .prepare("INSERT INTO service_media (service_id, type, url) VALUES (?, 'video', ?)")
    .run(id, url);
  logActivity("service_video_uploaded", `service #${id}`, req);
  res.status(201).json({ id: info.lastInsertRowid, type: "video", url });
});

router.delete("/:id/media/:mediaId", (req, res) => {
  const mediaId = Number(req.params.mediaId);
  const row = db.prepare("SELECT * FROM service_media WHERE id = ? AND service_id = ?").get(mediaId, Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Media not found." });
  db.prepare("DELETE FROM service_media WHERE id = ?").run(mediaId);
  deleteUploadedFile(row.url);
  logActivity("service_media_deleted", `#${mediaId}`, req);
  res.json({ ok: true });
});

module.exports = router;
