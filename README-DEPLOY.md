# MRASIL Server — Deployment Guide

## The one thing that has to change: where this lives

Everything before this point in the project was a static site, which is
why GitHub Pages worked. **This is no longer a static site.** It's a
real Node.js application with a real database and real file uploads —
and GitHub Pages only serves static files. It cannot run Node, so it
cannot run this. Your domain (currently pointed at GitHub Pages via
GoDaddy DNS) needs to point at wherever you host this instead.

This isn't a step backward — it's what actually lets the admin panel
work for real, with real photo/video uploads and a real database,
exactly what was asked for. It just means one extra piece: a Node
hosting provider instead of GitHub Pages.

## What you actually need in a host

Three things, non-negotiable for this app to work correctly in
production:

1. **Runs Node.js 18+** (the app is plain Express — no special
   framework requirements beyond that).
2. **Persistent disk storage.** This is the part people miss. The
   SQLite database file and every uploaded photo/video live on disk
   (in `./data` and `./uploads`). Many budget/free hosting tiers use
   *ephemeral* storage — anything written to disk is wiped every time
   the app restarts or redeploys. If you pick a host, confirm this
   explicitly before trusting it with real client data.
3. **Supports environment variables** (for `SESSION_SECRET`, at
   minimum) and, ideally, a way to run one-off commands (to create the
   admin account the first time).

## Recommended: Render.com

Verified as of this writing: Render supports Node.js natively, and
persistent disks are available and attachable — but **only on paid
service tiers, starting around $7/month** for an always-on instance;
the free tier cannot attach a persistent disk, which makes it unsuitable
here (your data would be wiped on every restart). This isn't a specific
endorsement over every alternative — Railway, Fly.io, and a plain VPS
(DigitalOcean, Hetzner, etc.) are all reasonable alternatives with
similar setup shapes — but Render's flow is a good concrete illustration:

1. Push this project to a GitHub repository (a fresh one — don't mix it
   into the old static-site repo).
2. On Render: **New → Web Service**, connect that repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add a **persistent disk** to the service (Render's dashboard has this
   as an explicit option under the service's settings) — mount it at,
   say, `/data`.
5. Environment variables to set:
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = a real random value — generate one locally with
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     and paste the output in. Never reuse the placeholder from
     `.env.example`.
   - `DATA_DIR` = `/data` (or wherever you mounted the disk)
   - `UPLOAD_DIR` = `/data/uploads`
6. Deploy. Then, from Render's shell/console for the service (or a
   one-off job), run:
   ```
   npm run seed
   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-real-strong-password' npm run create-admin
   ```
7. Add your custom domain in Render's dashboard (Settings → Custom
   Domains). Render will show you the exact DNS record it needs.

## Pointing your GoDaddy domain at the new host

1. In your new host's dashboard, add your domain (e.g.
   `mrasildecor.com`) as a custom domain for the service. The host will
   show you what DNS record to create — this is the authoritative
   source at the moment you do it, more reliable than any exact value
   written here.
2. Log into GoDaddy → **My Products → DNS** for the domain.
3. Remove whatever record currently points to GitHub Pages (this was
   likely a `CNAME` or a set of `A` records pointing at GitHub's IPs).
4. Add the record your host told you to add in step 1 (usually a
   `CNAME` for `www`, and either an `A`/`ALIAS`/`ANAME` record — naming
   varies by registrar — for the bare/apex domain).
5. DNS changes can take anywhere from a few minutes to 24–48 hours to
   fully propagate. Your host will typically show a "verified" /
   "pending" status for the domain once it can see the DNS change.

## Contact form email

Right now, submissions from the Contact page's enquiry form are saved
to the `activity_log` table (so nothing is silently lost) but **not
emailed anywhere yet** — `routes/public.js` has a comment marking
exactly where to wire this in. The straightforward path: install
`nodemailer`, sign up for a transactional email provider (SendGrid,
Mailgun, Amazon SES, or even Gmail's SMTP for low volume), and send in
that same route handler. This wasn't wired to a specific provider
because that requires an account and API key only you can create.

## Before you consider this "live"

- [ ] Real `SESSION_SECRET` set (not the placeholder)
- [ ] Real admin password set via `create-admin` (not `TestPassword123!`
      — that was only ever used for testing in this delivery, and only
      exists if you happen to run the exact seed script; there is no
      default password shipped in the code)
- [ ] Persistent disk confirmed working — restart the service once
      after deploying and confirm your test data survives
- [ ] HTTPS active (every host named above provides this automatically
      once a custom domain is verified)
- [ ] Contact form emails wired up (see above) or you're checking
      `activity_log` regularly
- [ ] A real backup plan for `data/mrasil.db` and `uploads/` — this
      wasn't built in (see "What's not included" in the main README)

## What's deliberately not included

Per the original brief's own enterprise-security section, and to be
honest about scope: this delivery has real authentication, real
input validation, real file-type verification, and rate limiting —
but it does not include automated off-server backups, a Web Application
Firewall, 2FA, or intrusion monitoring. Those are legitimate next steps
for a business depending on this system, not things a first production
version needs to ship with day one — but don't skip them indefinitely
either.
