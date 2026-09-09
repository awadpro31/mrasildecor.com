# MRASIL WordPress Theme — Install & Setup

## What this actually is, honestly

This is real, complete WordPress theme code — not a mockup, and not the
browser-only admin demo from earlier. It gives you **genuine full
control**: upload/replace/delete/reorder photos and videos through
WordPress's own Media Library, edit every piece of text (English and
Arabic) through normal admin screens, and moderate reviews through
WordPress's native Pending/Publish workflow.

**What I could not do:** run it. I don't have a PHP + MySQL + WordPress
environment available to actually install and click through this theme
myself. Every file has been checked for syntax errors (`php -l`), every
ACF field group JSON validated, every custom function call cross-checked
against its definition, and every internal path/slug/template reference
cross-checked for consistency — but "no syntax errors and everything
lines up" is not the same guarantee as "installed and confirmed working
in a browser." Please test on a staging site before pointing your real
domain at it.

## Requirements

- WordPress 6.0 or newer
- PHP 7.4 or newer (8.x recommended)
- The free **[Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/)**
  plugin, installed and activated **before** activating this theme.
  (The theme runs without it, but Services/Projects/Reviews/Settings
  will be missing their fields — you'll see an admin notice reminding
  you if it's not active.)

## Install steps

1. Install and activate **Advanced Custom Fields** (Plugins → Add New).
2. Upload this theme folder to `/wp-content/themes/mrasil/` (or zip it
   and use Appearance → Themes → Add New → Upload Theme).
3. Activate the theme. On activation it automatically:
   - Creates the 4 required pages (About Us, Interior Designs, Projects,
     Contact) with the correct template already assigned to each.
   - Sets your homepage to a static page (front-page.php handles Home
     automatically either way).
   - Seeds the 8 real service categories from your brief (title +
     description, English and Arabic) — text only; no images/videos
     are bundled, since there's nothing real to bundle. Add photos and
     an optional video to each from **Services → [service name]**.
4. Go to **Settings → General** and set a Site Icon (used as favicon)
   and, optionally, **Appearance → Customize → Site Identity** for a
   custom logo (falls back to the MRASIL logo bundled in
   `assets/img/mrasil-logo-web.png` if you don't set one).
5. Go to **Website Settings** (new item in the left admin menu) and
   fill in the real WhatsApp number, phone, email, address, and Google
   Maps coordinates — pre-filled with the values from our conversation
   as a starting point.
6. Add your real content:
   - **Projects** → Add New — title (EN), Arabic title, category
     (linked to one of the 8 Services), description, location, year,
     a gallery of images, and an optional video file.
   - **Interior Designs** → Add New — one photo + a Space Type term
     per look-book entry.
   - Reviews arrive automatically from the public submission form on
     the Contact page, sitting in **Reviews** with status "Pending" —
     open one and click Publish to approve it, or Trash to reject it.
7. Test the contact form: it emails whatever address is set in Website
   Settings → Contact → Email via WordPress's built-in `wp_mail()`. If
   emails don't arrive, your host likely needs a real SMTP plugin (e.g.
   **WP Mail SMTP**) — many hosts silently drop PHP's default `mail()`.

## What's intentionally NOT included

- **No ambient audio file** (`assets/audio/ambient.mp3` is empty) —
  same reasoning as the static build: nothing real to bundle. The music
  button fails silently until you add a file there.
- **No spam protection on the two forms beyond a nonce.** Before this
  goes live, add Akismet (free) or a honeypot field — see
  `inc/forms.php`, which has a comment marking exactly where.
- **No security hardening plugins pre-installed** — see the original
  `admin/WORDPRESS-ROADMAP.md` from the static build's package for the
  specific, named plugins (Wordfence, UpdraftPlus, Limit Login Attempts
  Reloaded, etc.) that cover the brief's full security section.
- **Polylang/WPML are not used.** Language is handled by a small custom
  system (`inc/i18n.php`) — a `?lang=en` link, remembered in a cookie.
  This is deliberately dependency-light, but it does mean menus, widget
  titles, and any other plugin's own strings won't be auto-translated
  the way they would under Polylang. If you'd rather have that, install
  Polylang and I can help wire the theme to defer to it instead.

## File map

```
style.css              Theme header + the full ported design system CSS
functions.php           Loads everything below
header.php / footer.php Site chrome, nav, WhatsApp button
front-page.php          Home
page.php / index.php     Fallback templates (required by WordPress)
page-templates/         About Us, Interior Designs, Projects, Contact
inc/
  i18n.php               Bilingual helpers (mrasil_t, mrasil_current_lang, ...)
  cpt-services.php       "Services" custom post type
  cpt-projects.php       "Projects" custom post type + JS data serializer
  cpt-gallery.php        "Interior Designs" custom post type + taxonomy
  cpt-reviews.php        "Reviews" custom post type
  acf-json.php           Points ACF at /acf-json for auto-imported fields
  options-page.php       Registers the "Website Settings" admin screen
  enqueue.php             Loads CSS/JS, hands real data to projects.js/interiors.js
  forms.php               Contact + review submission handlers (admin-post.php)
  theme-setup.php         Theme supports, nav menu, image sizes
  activation.php          Auto-creates required pages + seeds the 8 services
acf-json/                Field group definitions (auto-imported by ACF)
assets/
  js/main.js               Shared UI (loader, nav, forms, tilt, cursor, reveals)
  js/projects.js           Projects page: tab filter + lightbox (+ video)
  js/interiors.js          Interior Designs: masonry gallery + category pills
  img/                      Logo files (same as the static build)
  audio/                    Empty — see above
```
