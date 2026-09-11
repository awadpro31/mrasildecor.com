// server.js — MRASIL production server.
// One Express app serves everything: the public bilingual site
// (static HTML/CSS/JS in /public), uploaded media (/uploads), and the
// JSON API the admin panel and the public site's forms/data both use.

require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const SqliteSessionStore = require("./db/session-store");
const { apiLimiter } = require("./middleware/auth");
const { UPLOAD_ROOT } = require("./middleware/upload");

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === "production";

if (IS_PROD && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === "change-me")) {
  console.error(
    "\nFATAL: SESSION_SECRET is not set (or still the placeholder) in production.\n" +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"\n" +
      "and put it in your .env file before starting the server.\n"
  );
  process.exit(1);
}

// Trust the first proxy hop (needed on Render/Railway/etc. behind a
// load balancer) so req.ip and the "secure" cookie flag behave correctly.
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // the site loads Google Fonts/Maps/Unsplash; a real CSP is a deliberate follow-up tuning pass, not a default that would just break those.
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use(
  session({
    name: "mrasil.sid",
    secret: process.env.SESSION_SECRET || "change-me",
    store: new SqliteSessionStore({ ttlMs: 24 * 60 * 60 * 1000 }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PROD, // requires HTTPS in production — every host in README-DEPLOY.md provides this
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/api/", apiLimiter);

// Uploaded media — served as plain static files. Filenames are always
// server-generated random IDs (see middleware/upload.js), never the
// client-supplied original name, so there's nothing path-traversal-able
// to request here even though the folder is public.
app.use("/uploads", express.static(UPLOAD_ROOT, { maxAge: "7d" }));

// API routes.
app.use("/api/admin/auth", require("./routes/auth"));
app.use("/api/admin/services", require("./routes/services"));
app.use("/api/admin/projects", require("./routes/projects"));
app.use("/api/admin/gallery", require("./routes/gallery"));
app.use("/api/admin/reviews", require("./routes/reviews"));
app.use("/api/admin/settings", require("./routes/settings"));
app.use("/api/public", require("./routes/public"));

// The public site + admin panel front-end (static files).
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

// Multer errors (bad file type, too large) arrive here rather than as a
// generic 500 — surfaced as a clean 400 with a real message.
app.use((err, req, res, next) => {
  if (err && err.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong on our end." });
  }
  next();
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"), (err) => {
    if (err) res.status(404).json({ error: "Not found." });
  });
});

app.listen(PORT, () => {
  console.log(`MRASIL server running on http://localhost:${PORT} (${IS_PROD ? "production" : "development"})`);
});
