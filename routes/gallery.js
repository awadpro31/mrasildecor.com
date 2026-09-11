// routes/gallery.js — admin CRUD for the Interior Designs look-book.
const express = require("express");
const db = require("../db/database");
const { requireAuth, logActivity } = require("../middleware/auth");
const { uploadImage, publicUrlFor, deleteUploadedFile, verifyRealFileType } = require("../middleware/upload");

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM gallery_items ORDER BY sort_order ASC, id DESC").all());
});

/** Create a gallery entry by uploading its photo directly (image is required, not optional, for this content type). */
router.post("/", uploadImage.single("file"), verifyRealFileType("image"), (req, res) => {
  const { title_en, title_ar, space_type_en, space_type_ar } = req.body || {};
  if (!title_en || !title_ar || !space_type_en) {
    if (req.file) deleteUploadedFile(publicUrlFor("image", req.file.filename));
    return res.status(400).json({ error: "Title (EN/AR) and space type are required." });
  }
  if (!req.file) return res.status(400).json({ error: "A photo is required for each look-book entry." });

  const url = publicUrlFor("image", req.file.filename);
  const info = db
    .prepare(
      "INSERT INTO gallery_items (title_en, title_ar, space_type_en, space_type_ar, image) VALUES (?, ?, ?, ?, ?)"
    )
    .run(title_en.trim(), title_ar.trim(), space_type_en.trim(), space_type_ar || space_type_en, url);
  logActivity("gallery_item_created", title_en, req);
  res.status(201).json(db.prepare("SELECT * FROM gallery_items WHERE id = ?").get(info.lastInsertRowid));
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM gallery_items WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Gallery item not found." });
  const b = req.body || {};
  db.prepare(
    `UPDATE gallery_items SET title_en = ?, title_ar = ?, space_type_en = ?, space_type_ar = ?, sort_order = ? WHERE id = ?`
  ).run(
    b.title_en ?? existing.title_en,
    b.title_ar ?? existing.title_ar,
    b.space_type_en ?? existing.space_type_en,
    b.space_type_ar ?? existing.space_type_ar,
    b.sort_order === undefined ? existing.sort_order : Number(b.sort_order),
    id
  );
  logActivity("gallery_item_updated", `#${id}`, req);
  res.json(db.prepare("SELECT * FROM gallery_items WHERE id = ?").get(id));
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT image FROM gallery_items WHERE id = ?").get(id);
  db.prepare("DELETE FROM gallery_items WHERE id = ?").run(id);
  if (row) deleteUploadedFile(row.image);
  logActivity("gallery_item_deleted", `#${id}`, req);
  res.json({ ok: true });
});

module.exports = router;
