/* ==========================================================================
   MRASIL — live data layer.
   Replaces the old static build's hardcoded PROJECTS/GALLERY/TESTIMONIALS
   arrays with real fetches against this server's own API — the exact
   same data an admin edits in /admin/ appears here, because it's the
   same database, not a separate copy. Dispatches "mrasil:dataready"
   once everything has loaded; page scripts (home.js, projects.js,
   interiors.js) render on that event instead of assuming data exists
   synchronously at parse time.
   ========================================================================== */

let SERVICES = [];
let PROJECTS = [];
let GALLERY = [];
let TESTIMONIALS = [];
let SETTINGS = {};

function currentLang() {
  return (window.mrasilI18n && window.mrasilI18n.getLang()) || "ar";
}

/** Pick obj[field + "_ar"] or obj[field + "_en"] based on current language. */
function pick(obj, field) {
  if (!obj) return "";
  const en = obj[field + "_en"];
  const ar = obj[field + "_ar"];
  const lang = currentLang();
  if (lang === "ar") return ar || en || "";
  return en || ar || "";
}

/** Display label for a project's related service, in the current language. */
function categoryLabel(project) {
  if (project && project.service) return pick(project.service, "title");
  if (project && project.category) return project.category; // legacy fallback
  return "";
}

function normalizeProject(p) {
  const images = (p.media || []).filter((m) => m.type === "image").map((m) => m.url);
  const video = (p.media || []).find((m) => m.type === "video");
  return {
    ...p,
    id: p.id != null ? String(p.id) : "",
    coverImage: images[0] || "",
    images,
    video: video ? video.url : "",
  };
}

function normalizeService(s) {
  const images = (s.media || []).filter((m) => m.type === "image").map((m) => m.url);
  const video = (s.media || []).find((m) => m.type === "video");
  return { ...s, images, video: video ? video.url : "" };
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function loadPublicData() {
  try {
    const [services, projects, gallery, reviews, settings] = await Promise.all([
      fetchJSON("/api/public/services"),
      fetchJSON("/api/public/projects"),
      fetchJSON("/api/public/gallery"),
      fetchJSON("/api/public/reviews"),
      fetchJSON("/api/public/settings"),
    ]);
    SERVICES = services.map(normalizeService);
    PROJECTS = projects.map(normalizeProject);
    GALLERY = gallery;
    TESTIMONIALS = reviews.map((r) => ({
      name: r.customer_name,
      project: r.project_name,
      rating: r.rating,
      quote: r.review_text,
    }));
    SETTINGS = settings;
  } catch (e) {
    console.error("MRASIL: failed to load live data from the API.", e);
  }
  document.dispatchEvent(new CustomEvent("mrasil:dataready"));
}

loadPublicData();
