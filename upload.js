// middleware/upload.js
// Brief §18.C — file upload security. What this actually enforces:
//   - Only approved image/video MIME types (checked via the browser-sent
//     mimetype AND the file extension both agreeing — not extension alone)
//   - A hard size ceiling per file type
//   - Every stored filename is a random generated ID, never the
//     original filename — the original name is never trusted or used
//     to build a server path (prevents path traversal entirely)
//   - Files are written to disk under uploads/images or uploads/videos
//     only — there is no way for a client-supplied path to escape that

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
const IMAGE_DIR = path.join(UPLOAD_ROOT, "images");
const VIDEO_DIR = path.join(UPLOAD_ROOT, "videos");
[IMAGE_DIR, VIDEO_DIR].forEach((d) => fs.existsSync(d) || fs.mkdirSync(d, { recursive: true }));

const ALLOWED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ALLOWED_VIDEO_MIME = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const ALLOWED_VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB

function safeExt(originalName, allowedExt) {
  const ext = path.extname(originalName || "").toLowerCase();
  return allowedExt.has(ext) ? ext : null;
}

function storageFor(dir) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const isVideo = dir === VIDEO_DIR;
      const ext = safeExt(file.originalname, isVideo ? ALLOWED_VIDEO_EXT : ALLOWED_IMAGE_EXT);
      // fileFilter below already rejects anything without a safe
      // extension, so ext should never be null here — but never trust
      // that assumption blindly in code that writes to disk.
      const randomName = crypto.randomBytes(16).toString("hex");
      cb(null, `${randomName}${ext || ""}`);
    },
  });
}

function fileFilter(kind) {
  return (req, file, cb) => {
    const mimeOk =
      kind === "image" ? ALLOWED_IMAGE_MIME.has(file.mimetype) : ALLOWED_VIDEO_MIME.has(file.mimetype);
    const extOk = !!safeExt(file.originalname, kind === "image" ? ALLOWED_IMAGE_EXT : ALLOWED_VIDEO_EXT);
    if (mimeOk && extOk) return cb(null, true);
    cb(new Error(`Unsupported ${kind} file type.`));
  };
}

/**
 * The fileFilter above only checks the *claimed* mimetype and filename
 * extension — both are attacker-controlled request metadata, not the
 * actual file content (curl -F "file=@evil.txt;type=image/png" sails
 * straight through a mimetype-only check). This reads the real magic
 * bytes off disk after multer has written the file, and deletes it if
 * they don't match a genuine file of the claimed kind. Brief §18.C:
 * "Validate actual file type, not only file extension" — this is the
 * part of that requirement a mimetype check alone does not satisfy.
 */
const MAGIC_CHECKS = {
  image: (buf) => {
    if (buf.length >= 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return true; // PNG
    if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true; // JPEG
    if (buf.length >= 6 && buf.slice(0, 6).toString("ascii") === "GIF87a") return true;
    if (buf.length >= 6 && buf.slice(0, 6).toString("ascii") === "GIF89a") return true;
    if (buf.length >= 12 && buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") return true;
    return false;
  },
  video: (buf) => {
    if (buf.length >= 4 && buf.slice(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return true; // WEBM/MKV (EBML)
    if (buf.length >= 8 && buf.slice(4, 8).toString("ascii") === "ftyp") return true; // MP4 / MOV (ISO base media)
    return false;
  },
};

function verifyRealFileType(kind) {
  return (req, res, next) => {
    if (!req.file) return next();
    fs.readFile(req.file.path, (err, buf) => {
      if (err) return res.status(500).json({ error: "Could not verify the uploaded file." });
      const genuine = MAGIC_CHECKS[kind](buf.slice(0, 32));
      if (!genuine) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({
          error: `That file's content doesn't match a real ${kind} — it was rejected. Renaming a file's extension doesn't change what it actually is.`,
        });
      }
      next();
    });
  };
}

const uploadImage = multer({
  storage: storageFor(IMAGE_DIR),
  fileFilter: fileFilter("image"),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
});

const uploadVideo = multer({
  storage: storageFor(VIDEO_DIR),
  fileFilter: fileFilter("video"),
  limits: { fileSize: MAX_VIDEO_BYTES, files: 1 },
});

/** Public URL for a file saved under uploads/images or uploads/videos. */
function publicUrlFor(kind, filename) {
  return `/uploads/${kind === "video" ? "videos" : "images"}/${filename}`;
}

/** Delete an uploaded file given its public URL, ignoring "already gone". */
function deleteUploadedFile(publicUrl) {
  if (!publicUrl || !publicUrl.startsWith("/uploads/")) return;
  const abs = path.join(UPLOAD_ROOT, publicUrl.replace("/uploads/", ""));
  // Guard against path traversal even though publicUrl is normally
  // server-generated, never client-supplied, for this exact call.
  if (!abs.startsWith(UPLOAD_ROOT)) return;
  fs.unlink(abs, () => {});
}

module.exports = { uploadImage, uploadVideo, publicUrlFor, deleteUploadedFile, verifyRealFileType, UPLOAD_ROOT };
