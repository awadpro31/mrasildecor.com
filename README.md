# MRASIL — Decor & Interior Design — Production Website + Admin

A real, working full-stack application: the bilingual (Arabic default /
English) public website plus a genuine database-backed admin panel —
real login, real file uploads (images and video), real review
moderation. Not a prototype, not a static-site demo with localStorage.

## What this replaces

Earlier in this project's life there were two other versions:

1. A static HTML/CSS/JS site (worked fine, but any admin "editing" was
   fake — browser-only localStorage, never touched the live site).
2. A WordPress theme (real, but needs PHP + MySQL hosting and was never
   able to be executed/tested in the environment that built it).

This version is a small, real Node.js + Express + SQLite backend.
Every piece of content the admin edits — service descriptions, project
photos and videos, customer reviews, contact settings — is the *same*
data the public site reads. Edit it in the admin panel, it changes on
the live site. That's the whole point of this rebuild.

## Quick start (local)

```bash
npm install
cp .env.example .env
# edit .env: set a real SESSION_SECRET

npm run seed                                    # creates the 8 real service categories
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-real-password' npm run create-admin

npm start
# → http://localhost:3000            the public site
# → http://localhost:3000/admin/     the admin panel
```

**For production deployment — including why GitHub Pages won't work
anymore, and specifically how to move your GoDaddy domain over — see
[`README-DEPLOY.md`](./README-DEPLOY.md).** That's the file to read
before this touches a real domain.

## What the admin panel actually controls

| Section | Real, working |
|---|---|
| **Services** (the 8 categories) | Bilingual title/description, upload/delete images, upload/delete a video, show/hide on the public site, add new services |
| **Projects** | Bilingual title/description/location, category (linked to a Service), upload/delete gallery images, upload/delete a project video |
| **Reviews** | Real moderation queue — public submissions land as "pending"; approve/reject/edit/delete; only approved reviews are ever public |
| **Settings** | WhatsApp number, phone, email, address (bilingual), Google Maps coordinates + link, working hours, default language, social links |

All of it is one login away at `/admin/`, protected by a real,
bcrypt-hashed password — there is no default or hardcoded password
anywhere in this codebase. You create the first one with
`npm run create-admin` (see Quick Start above).

## Security, honestly

What's actually implemented, not just claimed:
- Passwords hashed with bcrypt (cost factor 12) — never stored or
  logged in plain text
- Session cookies: `httpOnly`, `sameSite`, `secure` in production
  (requires HTTPS, which your host provides)
- Rate limiting on the login endpoint (brute-force protection) and on
  the two public write endpoints (contact form, review submission)
- **Real file-type verification** — uploaded files are checked by their
  actual binary signature after upload, not just the filename extension
  or the browser-reported MIME type (both of which are trivially
  fakeable). I found and fixed this exact gap myself while building it —
  see the code comments in `middleware/upload.js` for the full story.
- Randomly generated filenames for every upload — the original filename
  is never trusted or used to build a server path
- Parameterized SQL everywhere (via `better-sqlite3`'s prepared
  statements) — no string-concatenated queries
- `helmet` security headers, server-side validation on every write
  endpoint (client-side validation is never trusted alone)
- `npm audit`: **zero known vulnerabilities** in the dependency tree at
  time of delivery

What's **not** included (see `README-DEPLOY.md`'s checklist): 2FA,
automated backups, a WAF, and email delivery for the contact form
(logged to the database instead, pending you wiring up an email
provider — this needs an account only you can create).

## Project structure

```
server.js                Entry point — security middleware, sessions, routes
db/
  schema.sql               Table definitions
  database.js               SQLite connection + init
  session-store.js          Small in-house session store (see comments — chose
                             this over a third-party package deliberately)
middleware/
  auth.js                    Session auth guard + rate limiters + activity logging
  upload.js                   Secure file upload handling + real magic-byte verification
routes/
  auth.js, services.js, projects.js, gallery.js, reviews.js, settings.js   (admin, all require login)
  public.js                                                                (no login — what the site itself calls)
scripts/
  seed.js                    Seeds the 8 real service categories
  create-admin.js            Creates/resets the admin login — the ONLY way a real password is ever set
public/                     The actual website + admin panel front-end
  index.html, about.html, interiors.html, projects.html, contact.html
  admin/                      The admin panel (index.html + admin.js + admin.css)
  assets/                     Shared CSS/JS/images
data/                       SQLite database file lives here (gitignored)
uploads/                    Uploaded images/videos live here (gitignored)
```

## What was verified before delivery

Every claim above was actually tested against the running server with
real HTTP requests (not just read for syntax), including: login with
wrong/correct passwords, session-protected routes, real file upload
with a real image (accepted) and a fake image — a text file renamed to
`.png` (correctly rejected after I found and fixed the gap), the full
review lifecycle from public submission through admin approval to
public visibility, cascading deletes, and settings updates reflecting
immediately on the public API. `npm audit` reports zero vulnerabilities.

What I could **not** do: watch it run in an actual browser, or test it
against your real production hosting environment. Everything here is
server-side and API-level verified; a short walkthrough on your end
after deploying (create a project, upload a photo, submit a test
review) is still worth doing before handing this to a client.
