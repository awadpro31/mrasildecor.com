# MRASIL — Fully Self-Contained Website (Zero Folder Dependencies)

This is a rebuilt version of the site made to eliminate every possible
"broken CSS / missing design" cause from file structure or upload
mistakes. Each of the 5 pages below is **one complete HTML file** — its
CSS, JavaScript, logo, and loading icon are all embedded directly inside
it. There is no `assets/` folder to keep alongside them, no relative
path that can break, and no upload step that can scramble a folder tree.

```
index.html        Home
about.html         About Us
interiors.html     Interior Designs
projects.html      Projects
contact.html       Contact + Client Reviews
admin/              Optional — the admin-panel prototype (see below)
```

## How to use it

**Just keep these 5 `.html` files together in the same folder** — that's
the only requirement. Nothing else needs to exist alongside them for the
design, layout, animations, bilingual switcher, project filtering, or
forms to work. This applies whether you:

- Open `index.html` directly by double-clicking it, or
- Upload all 5 files to the root of a GitHub repository, or
- Drop them into any static host (Netlify, Vercel, S3, cPanel, etc.)

Each page links to the others by plain filename (`href="about.html"`,
etc.), so as long as they're in the same folder, every nav link, footer
link, and button works.

## What's still loaded from the internet (by design, not a bug)

A handful of things are *meant* to load live from the web when the page
is viewed — these aren't bundled because they either can't be (fonts,
maps) or shouldn't be (huge photo files would make each page enormous):

- **Google Fonts** (Playfair Display, Jost, Cairo) — one small request
  per page load.
- **Project and gallery photography** — real, verified Unsplash URLs
  (see the main README's "What to edit before this goes live" for how
  to replace these with your own photos).
- **The Google Maps embed** on the Home and Contact pages.
- **`assets/audio/ambient.mp3`** — intentionally not included (see the
  main README); the music button handles its absence gracefully with no
  error, it just won't play until you add a real file.

None of these depend on your folder structure — they'll work identically
whether the 5 HTML files are nested three folders deep or sitting loose
on your desktop.

## The `admin/` folder (optional)

The admin-panel prototype is a separate tool with its own CSS/JS files
(not embedded, since it's a large, independent piece — see
`admin/README-ADMIN-PROTOTYPE.md`). The small lock icon in every page's
footer links to `admin/index.html`. If you keep the `admin` folder
sitting next to the 5 pages, that link works; if you leave it out, the
5 main pages still work perfectly — the icon just won't lead anywhere.

## Verified before delivery

- Every page's embedded JavaScript passes a Node.js syntax check
- Every page's HTML tags are balanced (no unclosed elements)
- Every embedded image decodes as a valid PNG
- Zero absolute paths, zero leftover `assets/` references (besides the
  intentional audio placeholder above)
- Every cross-page link resolves to one of these exact 5 filenames
