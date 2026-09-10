# MRASIL Admin — Prototype README

## What this is
A **click-through UI prototype** of the admin dashboard described in your
CMS brief — Dashboard, Services, Projects, Reviews (with pending/approve/
reject), and Settings (WhatsApp, contact, office location, language).
It's built to match MRASIL's existing visual design exactly (same colors,
type, buttons, cards) so you can review the *screens and workflow* before
any real development starts.

## How to open it
Unzip the project, then open `admin/index.html` directly in a browser —
same as the public site, no server needed.

**Demo login** (shown on the screen itself, pre-filled for convenience):
- Email: `admin@mrasildecor.com`
- Password: `demo1234`

## What actually works in this prototype
- Editing service titles/descriptions (Arabic + English) and saving them
- Adding/removing service and project images (by URL, or by uploading a
  small file — stored as a data URL in your browser only)
- Toggling a service's visibility
- Adding, editing, reordering and deleting projects
- The full review workflow: use the "Simulate a Public Submission" form
  at the bottom of the Reviews page to add a new review exactly the way
  a real visitor would, then approve/reject/delete it from the Pending
  tab — this demonstrates the moderation flow end-to-end
- Editing settings (WhatsApp number, phone, email, address, Google Maps
  link, default language, social links) with a live WhatsApp/Maps link
  preview
- A "Reset Demo Data" button on the Settings page if you want to start
  over

All of the above is saved to **your browser's localStorage only** — it
persists if you close and reopen the file on the *same device and
browser*, but it is not shared with anyone else, not backed up, and is
lost if you clear your browser data.

## What this prototype is **not**
- **Not secure.** The login is a hardcoded password visible in the page
  source — anyone who opens the file can read it. There is no real
  authentication, no encryption, no server.
- **Not connected to the public website.** Editing a service here does
  not change `index.html`/`about.html`/etc. — this is an isolated
  sandbox for reviewing the *concept*.
- **Not multi-user or backed up.** Nothing here is shared between
  devices, and nothing survives clearing browser storage.
- **Not the real build.** WordPress (which you asked to use for the real
  system) is a server application — it cannot run inside a static HTML
  file or an AI chat sandbox. See `WORDPRESS-ROADMAP.md` in this same
  folder for exactly how every feature here maps to a real WordPress
  implementation.

## Why build it this way, then?
Because the fastest, cheapest way to catch "actually, I want the reorder
buttons here instead" or "the review form needs one more field" is to
look at a working prototype — *before* paying for real development time
on a live WordPress + database + hosting setup. Treat this as a
clickable wireframe with real interactions, not a beta of the final
product.
