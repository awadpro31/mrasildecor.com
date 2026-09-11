// routes/projects.js — admin CRUD for the portfolio.
const express = require("express");
const db = require("../db/database");
const { requireAuth, logActivity } = require("../middleware/auth");
const { uploadImage, uploadVideo, publicUrlFor, deleteUploadedFile, verifyRealFileType } = require("../middleware/upload");

const router = express.Router();
router.use(requireAuth);

function withMedia(project) {
  const media = db
    .prepare("SELECT id, type, url, sort_order FROM project_media WHERE project_id = ? ORDER BY sort_order ASC, id ASC")
    .all(project.id);
  return { ...project, media };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM projects ORDER BY sort_order ASC, id DESC").all();
  res.json(rows.map(withMedia));
});

router.post("/", (req, res) => {
  const { title_en, title_ar, service_id, description_en, description_ar, location_en, location_ar, year } =
    req.body || {};
  if (!title_en || !title_ar) {
    return res.status(400).json({ error: "English and Arabic titles are required." });
  }
  const info = db
    .prepare(
      `INSERT INTO projects
       (title_en, title_ar, service_id, description_en, description_ar, location_en, location_ar, year)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      title_en.trim(),
      title_ar.trim(),
      service_id ? Number(service_id) : null,
      description_en || "",
      description_ar || "",
      location_en || "Private Residence",
      location_ar || "مسكن خاص",
      year || "20XX"
    );
  logActivity("project_created", title_en, req);
  res.status(201).json(withMedia(db.prepare("SELECT * FROM projects WHERE id = ?").get(info.lastInsertRowid)));
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Project not found." });

  const b = req.body || {};
  db.prepare(
    `UPDATE projects SET
       title_en = ?, title_ar = ?, service_id = ?, description_en = ?, description_ar = ?,
       location_en = ?, location_ar = ?, year = ?, sort_order = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    b.title_en ?? existing.title_en,
    b.title_ar ?? existing.title_ar,
    b.service_id !== undefined ? (b.service_id ? Number(b.service_id) : null) : existing.service_id,
    b.description_en ?? existing.description_en,
    b.description_ar ?? existing.description_ar,
    b.location_en ?? existing.location_en,
    b.location_ar ?? existing.location_ar,
    b.year ?? existing.year,
    b.sort_order === undefined ? existing.sort_order : Number(b.sort_order),
    id
  );
  logActivity("project_updated", `#${id}`, req);
  res.json(withMedia(db.prepare("SELECT * FROM projects WHERE id = ?").get(id)));
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const media = db.prepare("SELECT url FROM project_media WHERE project_id = ?").all(id);
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  media.forEach((m) => deleteUploadedFile(m.url));
  logActivity("project_deleted", `#${id}`, req);
  res.json({ ok: true });
});

router.post("/:id/media/image", uploadImage.single("file"), verifyRealFileType("image"), (req, res) => {
  const id = Number(req.params.id);
  if (!db.prepare("SELECT id FROM projects WHERE id = ?").get(id)) {
    return res.status(404).json({ error: "Project not found." });
  }
  if (!req.file) return res.status(400).json({ error: "No valid image file received." });
  const url = publicUrlFor("image", req.file.filename);
  const info = db.prepare("INSERT INTO project_media (project_id, type, url) VALUES (?, 'image', ?)").run(id, url);
  logActivity("project_image_uploaded", `project #${id}`, req);
  res.status(201).json({ id: info.lastInsertRowid, type: "image", url });
});

router.post("/:id/media/video", uploadVideo.single("file"), verifyRealFileType("video"), (req, res) => {
  const id = Number(req.params.id);
  if (!db.prepare("SELECT id FROM projects WHERE id = ?").get(id)) {
    return res.status(404).json({ error: "Project not found." });
  }
  if (!req.file) return res.status(400).json({ error: "No valid video file received." });
  const url = publicUrlFor("video", req.file.filename);
  const info = db.prepare("INSERT INTO project_media (project_id, type, url) VALUES (?, 'video', ?)").run(id, url);
  logActivity("project_video_uploaded", `project #${id}`, req);
  res.status(201).json({ id: info.lastInsertRowid, type: "video", url });
});

router.delete("/:id/media/:mediaId", (req, res) => {
  const mediaId = Number(req.params.mediaId);
  const row = db.prepare("SELECT * FROM project_media WHERE id = ? AND project_id = ?").get(mediaId, Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Media not found." });
  db.prepare("DELETE FROM project_media WHERE id = ?").run(mediaId);
  deleteUploadedFile(row.url);
  logActivity("project_media_deleted", `#${mediaId}`, req);
  res.json({ ok: true });
});

/** Reorder: body = { mediaIds: [id, id, id, ...] } in the desired display order. */
router.put("/:id/media/reorder", (req, res) => {
  const { mediaIds } = req.body || {};
  if (!Array.isArray(mediaIds)) return res.status(400).json({ error: "mediaIds array required." });
  const stmt = db.prepare("UPDATE project_media SET sort_order = ? WHERE id = ? AND project_id = ?");
  const tx = db.transaction((ids) => {
    ids.forEach((mid, i) => stmt.run(i, Number(mid), Number(req.params.id)));
  });
  tx(mediaIds);
  res.json({ ok: true });
});

module.exports = router;
