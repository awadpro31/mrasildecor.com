# MRASIL — Decor & Interior Design — Website Demo

A five-page, static HTML/CSS/JS demo built around the MRASIL logo and the
long-form brand brief you supplied. No build step, no Node, no server
required — open `index.html` in any modern browser (desktop, tablet, or
phone) and it runs.

## What's here

```
index.html          Home — cinematic hero, services, featured projects, stats, testimonials
about.html           About Us — philosophy, 4-step process, expertise, craftsmanship
interiors.html       Interior Designs — editorial masonry look-book, filterable by space type
projects.html        Projects — animated tab filter + full case-study lightbox gallery
contact.html         Contact + Client Reviews — info, enquiry form, testimonials
assets/
  css/style.css       Single shared stylesheet — every color/type token in one place
  js/data.js          Project + gallery + testimonial content (edit this to update content)
  js/main.js          Shared behaviour: loader, nav, cursor, tilt, reveals, music, form
  js/home.js          Renders featured projects + testimonial preview on the home page
  js/projects.js      Renders the animated tab filter + lightbox on the Projects page
  js/interiors.js     Renders the masonry gallery + category pills
  img/mrasil-logo-web.png       Your logo, resized for on-page use (nav/footer) — not redrawn or recolored
  img/mrasil-logo-original.png  Your logo at full original resolution, kept for print/other uses
  img/mrasil-icon.png           A cropped, icon-only version used in the loading screen
  img/favicon-*.png             Generated favicons from the icon crop
  audio/                         Empty — see "Ambient audio" below
admin/                Admin-panel UI prototype — see admin/README-ADMIN-PROTOTYPE.md
  index.html                    Open this directly to try the dashboard (demo login on screen)
  admin.css / admin.js          Prototype-only code — localStorage, no server, no real security
  WORDPRESS-ROADMAP.md          How every feature here maps to a real WordPress build
  README-ADMIN-PROTOTYPE.md     What works, what doesn't, and why it's built this way
```

## How to use it

Unzip the folder anywhere and double-click `index.html`. Every page links
to the others with plain relative paths, so it works equally well opened
directly from disk (`file://`) or uploaded as-is to any static host
(Netlify, Vercel, S3, cPanel, GitHub Pages).

## What to edit before this goes live

1. **Placeholder photography.** Every interior photo on the site is a
   real, verified, free-to-use Unsplash photo (not fabricated links),
   chosen to match the mood in your brief — but none of them are MRASIL's
   own projects. Replace the URLs in `assets/js/data.js` (`PROJECTS` and
   `GALLERY`) and the `<img src>` attributes in the HTML files with your
   own project photography.
2. **Placeholder numbers.** "Projects Completed," "Years of Experience,"
   and "Satisfied Clients" show as "—" on purpose — the brief was explicit
   that real figures should never be invented. Search each HTML file for
   `data-counter` and fill in `data-target="123"` with the real number;
   the count-up animation will activate automatically once the number is
   real.
3. **Placeholder testimonials.** `TESTIMONIALS` in `data.js` are
   structural placeholders, clearly labelled as such in the UI. Replace
   with real, collected client quotes before publishing — the brief was
   explicit that fabricated reviews must never be presented as real.
4. **Placeholder contact details.** Phone, email, and address are
   marked "(placeholder)" in the UI. Search for `+971 00 000 0000`,
   `hello@mrasil.example`, and `Add company address` and replace them.
5. **Contact form.** The form validates and shows a success state, but
   is not wired to send anywhere. Point the `<form>` at your email
   provider (Formspree, a serverless function, your CRM's API, etc.) or
   hand it to a backend developer — the validation logic in
   `assets/js/main.js` can stay as-is.
6. **Ambient audio.** The music control in the nav is fully wired up —
   volume capped at 12%, remembers play/pause state, never forces
   autoplay with sound. It just has no audio file yet, because one
   cannot be sourced or fabricated on your behalf. Drop a royalty-free
   ambient/lounge track at `assets/audio/ambient.mp3` and it will work
   immediately; until then, the control shows the correct paused state
   and no console error breaks the page.

## Assumptions made (flagged per your brief's own "no invented facts" rule)

- **Tech stack:** your original brief specified React/TypeScript/Tailwind/
  shadcn/Framer Motion. Your final message asked for an "HTML demo...
  client-controlled... on phone, tablet or computer," which is a
  different, lighter deliverable — a static site anyone can open with no
  dev environment. I built this version to match that request. The design
  system (colors, type, layout, motion direction) is fully compatible
  with a React/Next rebuild later; ask if you'd like that version too.
- **The "AnimatedTabs React component"** referenced in the long brief
  was not present in the `mindloop-template.zip` you attached (that file
  is an unrelated open-source newsletter-landing template). The animated,
  sliding-pill tab filter on the Projects page was built from scratch in
  vanilla JS to match the interaction your brief described.
- **Contact details, address, phone, and working hours** are UAE-formatted
  placeholders (per your account's regional context) — not real MRASIL
  information, since none was supplied.
- **Project names, locations ("Private Residence," "Corporate Office"),
  and descriptions** on the Projects page are original placeholder case
  studies written to match the brief's service list — not real MRASIL
  projects, since none were supplied. Locations were deliberately kept
  generic (no invented city/district names) rather than implying specific
  real engagements.

## Performance note

Your uploaded logo file was a 980KB print-resolution PNG. It's used at
roughly 46px tall in the nav and footer, so shipping the full file to
every visitor on every page load would be wasted bandwidth — especially
on mobile. `mrasil-logo-web.png` is the same image resized to on-page
scale (~206KB); `mrasil-logo-original.png` is kept untouched alongside
it for anything that needs the full-resolution master (print, large
signage, etc.). Neither file has been redrawn, recolored, or altered —
only resized.

## Arabic / English (i18n)

Arabic is the default language, with English selectable via the "AR |
EN" switcher in the nav and mobile menu — matching the brief's
"Arabic as primary" requirement. How it works:

- `assets/js/i18n.js` holds the full translation dictionary (~180 keys)
  and applies it to any element carrying `data-i18n` / `data-i18n-html`
  / `data-i18n-placeholder` / `data-i18n-aria`. Switching language also
  flips `<html dir>` between `rtl` and `ltr`, and the choice is
  remembered (`localStorage`) across pages and future visits.
- Dynamic content — project titles/descriptions, the look-book gallery,
  testimonials — lives in `assets/js/data.js` with parallel `xxxAr`
  fields, picked at render time by the current language. Category
  names (used as filter keys internally) are translated for display
  only via `CATEGORY_LABELS` in the same file, so filtering logic
  itself never changes language.
- Arabic type uses **Cairo** (Google Fonts) throughout, since Playfair
  Display and Jost have no Arabic glyphs; a handful of RTL-specific CSS
  rules (nav underline direction, skip-link position, stat alignment)
  live at the bottom of `assets/css/style.css`.
- **Known limitation:** because there's no server-side rendering here,
  translations apply via JavaScript after the page paints — on a slow
  connection this can show a brief flash of the English fallback text
  before switching to Arabic. A real WordPress build (see
  `admin/WORDPRESS-ROADMAP.md`) with Polylang renders the correct
  language server-side with no flash — one more concrete reason that
  roadmap exists.
- The Admin prototype (`admin/`) is intentionally **not** translated —
  it's an internal tool, and the brief's own admin nav items were
  specified in English.

## Design notes

- **Color system:** every hex value from your brief is defined once as a
  CSS variable in `assets/css/style.css` and used nowhere else verbatim —
  change a brand color in one place and the whole site updates.
- **Accessibility adjustment:** a couple of very small (≈11px) uppercase
  labels that would have used Architectural Gray `#777675` directly came
  in under WCAG AA contrast against the dark backgrounds (~3.4:1, needs
  4.5:1). They now use a slightly lighter warm gray (`--label-muted:
  #8c8a87`, ~4.6:1) instead — same family, same intent, just legible.
  `#777675` itself is unchanged everywhere else (borders, large text).
- **"3D" effects:** implemented as lightweight, dependency-free CSS/JS —
  mouse-driven card tilt, a parallax hero image, and scroll-reveal
  masks — rather than a Three.js/WebGL layer, so the site stays fast and
  battery-friendly on phones. All of it is skipped automatically on touch
  devices and for visitors with "reduce motion" enabled.
