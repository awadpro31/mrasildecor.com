# MRASIL — WordPress Build Roadmap

This maps every section of the "WEBSITE UPDATE INSTRUCTIONS" brief to a
concrete WordPress implementation. It exists because **the admin panel in
this folder (`admin/index.html`) is a click-through UI prototype only** —
browser-only, no server, no database, a hardcoded demo password. It is
useful for agreeing on screens and workflow. It is not, and cannot become,
the real system. WordPress is a PHP application that needs a real server,
a real MySQL database, and real hosting — none of which exist inside an AI
chat sandbox. This document is the bridge: what a WordPress developer (or
you, with a managed host) would actually build.

The good news: WordPress already *is* a "professional admin panel/CMS"
(wp-admin) with authentication, roles, and a media library built in — most
of the brief is configuration and well-established free/low-cost plugins,
not custom-coded infrastructure.

---

## 1. Logo size
Theme-level CSS change (increase `.site-logo` / `.footer-logo` height a few
px in the theme's `style.css`, using the exact same logo file). Trivial;
no plugin needed.

## 2–3. Admin Panel / CMS + Dashboard structure
**This is wp-admin itself.** No custom dashboard needs to be built.
- **Custom Post Types** (via code in the theme's `functions.php`, or the
  free **Custom Post Type UI** plugin): `mrasil_service`, `mrasil_project`,
  `mrasil_review`.
- **Advanced Custom Fields (ACF)**, free tier is enough to start, ACF Pro
  ($) if you want repeater fields for image galleries and an Options Page:
  - `mrasil_service`: `title_ar`, `title_en`, `desc_ar`, `desc_en`,
    `gallery` (ACF Gallery field), `sort_order`, `visible` (true/false).
  - `mrasil_project`: same shape + `category` (Post Object field linking
    to a `mrasil_service`), `location`, `year`.
  - `mrasil_review`: `customer_name`, `project_name`, `rating` (1–5),
    `review_text`. **Status is native WordPress**: `pending` review =
    post status `draft`/`pending`, "Approve" = publish, "Reject" = a
    custom status or trash. This maps almost perfectly to WP's existing
    moderation model — no custom approval system needs to be coded.
  - **ACF Options Page** ("Website Settings"): logo, WhatsApp number,
    phone, email, office address (AR/EN), Google Maps URL, social links,
    default language. This is section 15's "Website Settings" entity,
    built with zero custom database tables.
- Sidebar nav in the brief (Dashboard, Services, Projects, Media, Reviews,
  Contact Info, Location, WhatsApp, Arabic/English Content, Settings) =
  the normal wp-admin left menu once these CPTs + the options page exist;
  nothing separate to build.

## 4. Office location
ACF Options Page field for the Google Maps share/embed URL + address
text (AR/EN). Theme template renders a "View Location on Google Maps"
`<a>` styled with the site's existing `.btn` class — same visual system,
just wired to a real editable field instead of hardcoded HTML.

## 5. Arabic as primary language, AR/EN switcher
- **Polylang** (free) or **WPML** (paid, more turnkey for agencies) —
  both are the standard, well-maintained way to run a bilingual WP site.
- Set Arabic as the default language; WordPress core has shipped full
  RTL support for over a decade, so `dir="rtl"` and the RTL stylesheet
  are automatic once the site language is Arabic — the existing MRASIL
  CSS (this project's `assets/css/style.css`) should be audited for any
  hardcoded `left`/`right`/`margin-left` etc. and converted to logical
  properties (`margin-inline-start`, etc.) or given an `[dir="rtl"]`
  override block, so it flips correctly instead of just relying on
  browser default text direction.
- The switcher itself is a small template snippet (`Polylang`'s
  `pll_the_languages()`) styled with the site's existing nav-link CSS —
  no new visual design needed, exactly as the brief requires.

## 6. Customer reviews + moderation
Front-end submission form → **WordPress REST API** custom endpoint or
`admin-ajax.php`, protected by a nonce, writing a new `mrasil_review`
post with status `pending`. Admin sees it in the normal Posts list for
that CPT, with Approve/Reject mapped to WordPress's native Publish/Trash
(or a custom "rejected" status via `register_post_status`). No bespoke
approval workflow engine required — this is what WordPress's post
statuses are for.

## 7. WhatsApp floating button
A small template partial reading the WhatsApp number from the ACF
Options Page, rendering a fixed-position `<a href="https://wa.me/...">`
using the official WhatsApp icon. A few well-maintained free plugins
(e.g. "WP Social Chat", "Click to Chat") do this out of the box too, if
you'd rather not hand-code it — either is a small amount of work either
way, editable number, no hardcoding.

## 8. Service-category smooth scroll
Pure front-end: same anchor + `scrollIntoView({behavior:"smooth"})`
pattern already used in the current static demo's `projects.js` — ports
directly into the WP theme's JS with no architecture change.

## 9. About/intro copy
Content edit only — a WYSIWYG field (native WP editor or an ACF
WYSIWYG field) on a "Homepage" options page or page template, no code
change needed once the CMS exists.

## 10. Remove duplicate/meaningless content
A manual content-audit pass once the real site content is loaded — not
something to pre-build, just a QA step before launch.

## 11–12. Services & Image management
Already covered by the `mrasil_service` CPT + ACF Gallery field above.
Upload/replace/delete/reorder is the **WordPress Media Library and ACF
Gallery field's native UI** — this is arguably the single biggest reason
to use WordPress here instead of a custom Node/Next build: image
management is already a solved, polished, non-technical-user-friendly
problem in WP core.

## 13. Responsive design
Port the existing design system (`assets/css/style.css` from this
project — same color tokens, type scale, breakpoints) into the theme's
stylesheet unchanged. No new responsive work; carry over what's already
built and tested.

## 14 & 18.A. Admin security / authentication
- WordPress core already has hashed passwords, sessions, and
  role-based access (`Administrator`, `Editor`, etc.) — section 14's
  core requirements are met by using WP's built-in user system correctly
  (don't share the Administrator account; create named accounts).
- **Limit Login Attempts Reloaded** (free) — brute-force lockout, rate
  limiting on login.
- **WordPress core 2FA** (via the official **Two-Factor** plugin, or
  Wordfence's built-in 2FA) for section 18.A's two-factor requirement.
- **WP Mail SMTP** + core's password-reset flow for secure, expiring
  reset tokens (already built into WP core; just needs real transactional
  email configured, e.g. via SendGrid/Mailgun, so reset emails reliably
  arrive).

## 18.B. Database security
Native to WordPress's `$wpdb` API (prepared statements by default when
used correctly) + never editing the DB directly from custom unescaped
SQL. Standard practice for any competent WP build; nothing extra to
architect.

## 18.C. File/image upload security
WordPress core already validates MIME type (not just extension) on
upload and blocks PHP/executable uploads by default. Add **Wordfence**
(free tier) for an extra malware/file-integrity layer on top.

## 18.D–F. XSS/CSRF/clickjacking/HTTPS/security headers
- WordPress core includes nonces (CSRF protection) and output escaping
  functions (`esc_html`, `esc_attr`, etc.) — must be used consistently
  in any custom theme/plugin code, which is a code-review item, not a
  new system to build.
- **Wordfence** or **Sucuri** (free tiers) add a web application
  firewall, security headers (CSP, X-Frame-Options, etc.), and HTTPS
  enforcement helpers.
- HTTPS itself is a **hosting-level** requirement: any reasonable host
  (SiteGround, Cloudways, WP Engine, Kinsta, or a VPS + Let's Encrypt)
  provides free auto-renewing SSL — this cannot be "built," only
  configured at the hosting layer once you choose a host.

## 18.G. Admin privacy (noindex)
WordPress's own **Settings → Reading → "Discourage search engines"**
plus `X-Robots-Tag: noindex` on `/wp-admin/` — a two-minute setting, not
custom code.

## 18.H–I. Review/contact spam protection
**Akismet** (free, made by WordPress's own creators) for spam filtering
on the review-submission and contact forms, plus honeypot fields and
rate limiting on the custom submission endpoint.

## 18.K. Backups & disaster recovery
**UpdraftPlus** (free tier is enough to start) — automatic, scheduled
database + file backups stored off-server (Google Drive/Dropbox/S3).
This single plugin covers nearly all of section K without custom
infrastructure.

## 18.L. Failure protection / caching / CDN
**WP Super Cache** or **W3 Total Cache** for page caching, plus
Cloudflare (free tier) in front of the host for CDN + an extra security
layer. WordPress core already shows a friendly error, not a raw stack
trace, when `WP_DEBUG` is off (make sure it's off in production).

## 18.M. Monitoring / logs
**WP Activity Log** (free tier) or Wordfence's activity log — records
admin logins, content changes, failed logins, etc., which covers section
M without custom logging code.

## 18.N. Secrets / environment variables
`wp-config.php` holds the DB credentials — standard WP practice. Any
managed WP host keeps this outside the public web root by default; on a
self-managed VPS, this needs explicit file-permission hardening (a
one-time server setup task, not an app-level build item).

## 18.O. Dependency security
Keep WP core, theme, and plugins updated (most hosts offer
auto-update for minor/security releases) and avoid installing anything
outside the well-known plugins named above.

---

## What this means practically

Almost the entire 18-section security brief is satisfied by **choosing a
good WordPress host + 4–5 well-known free plugins** (Wordfence or Sucuri,
Limit Login Attempts Reloaded, UpdraftPlus, Akismet, WP Activity Log)
rather than by custom-coding a security layer from scratch. That's the
main advantage of the WordPress route you picked over a bespoke
Node/database build: most of this brief is *configuration*, not
*engineering*.

## Suggested next steps
1. Pick a managed WordPress host with free SSL and staging (SiteGround,
   Cloudways, or Kinsta are common, reliable choices — this isn't an
   endorsement of one over another, just naming real, well-known options).
2. A developer converts this project's existing `assets/css/style.css` +
   page markup into a proper WP theme (or a child theme of a
   well-supported starter theme), so the visual design carries over
   exactly, per the brief's "do not redesign" rule.
3. Register the three Custom Post Types + ACF field groups above.
4. Install Polylang, set Arabic as default + RTL.
5. Install the security/backup plugin set named above.
6. Migrate the real content (services, projects, reviews, contact info)
   from this prototype's seed data into the real WP database.

This is genuinely a multi-week build for a developer, not something to
rush — but every piece of it maps to proven, off-the-shelf WordPress
tooling rather than custom infrastructure, which keeps both the cost and
the long-term maintenance burden much lower than a fully bespoke system.
