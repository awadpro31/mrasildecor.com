/* MRASIL — Home page. Renders from live data (assets/js/data.js) once
   "mrasil:dataready" fires, and re-renders (no refetch needed) on
   "mrasil:langchange" since every record already carries both languages. */
(function () {
  "use strict";

  // A small rotating set of icons for service cards — services are now
  // fully admin-managed (any number, any names), so a fixed icon can no
  // longer be tied to a specific service by name; cycling a curated set
  // keeps the grid visually rich without needing an icon-picker in the
  // admin UI for a first production version.
  const SERVICE_ICONS = [
    '<path d="M3 20v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M5 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 20h18"/>',
    '<path d="M3 21h18"/><path d="M5 21V9l7-6 7 6v12"/><path d="M9 21v-6h6v6"/>',
    '<path d="m14.5 3.5 6 6-8.5 8.5-6-6z"/><path d="m9 9-6 6 3 3 6-6"/><path d="m17.5 6.5 1-1"/>',
    '<path d="M4 18v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6"/><path d="M2 18h20"/><path d="M6 18v2"/><path d="M18 18v2"/>',
    '<path d="m14.7 6.3 1 1L4.3 18.7 3 21l2.3-1.3L16.7 8.3z"/><path d="m13 5 1.5-1.5a1.5 1.5 0 0 1 2 0l3 3a1.5 1.5 0 0 1 0 2L18 10"/>',
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="8.5" r="1"/><circle cx="15.5" cy="12" r="1"/><circle cx="8.5" cy="12" r="1"/><circle cx="12" cy="15.5" r="1"/>',
  ];

  let firstRenderDone = false;

  function renderMarquee() {
    const track = document.getElementById("marquee-track");
    if (!track || !SERVICES.length) return;
    const names = SERVICES.map((s) => pick(s, "title"));
    const loop = names.concat(names).concat(["Architectural Finishes"]);
    track.innerHTML = loop.map((n) => `<span>${n}</span>`).join("");
  }

  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;
    grid.innerHTML = SERVICES.map(
      (s, i) => `
      <div class="service-card tilt-card reveal${firstRenderDone ? " in" : ""}" style="--i:${i % 6}">
        <span class="service-num">${String(i + 1).padStart(2, "0")}</span>
        <svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${SERVICE_ICONS[i % SERVICE_ICONS.length]}</svg>
        <h3>${pick(s, "title")}</h3>
        <p>${pick(s, "description")}</p>
      </div>`
    ).join("");
  }

  function renderFeatured() {
    const featured = document.getElementById("featured-projects");
    if (!featured) return;
    const picks = PROJECTS.slice(0, 3);
    featured.innerHTML = picks
      .map(
        (p, i) => `
      <a href="projects.html" class="reveal${firstRenderDone ? " in" : ""}" style="--i:${i}">
        <div class="proj-card tilt-card">
          <div class="thumb"><img src="${p.coverImage}" alt="${pick(p, "title")} — ${categoryLabel(p)}" loading="lazy"></div>
          <span class="view" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
          <div class="info">
            <span class="cat">${categoryLabel(p)}</span>
            <h3>${pick(p, "title")}</h3>
            <div class="meta">${pick(p, "location")}</div>
          </div>
        </div>
      </a>`
      )
      .join("");
  }

  function renderTestimonials() {
    const wrap = document.getElementById("testimonial-preview");
    if (!wrap) return;
    const picks = TESTIMONIALS.slice(0, 2);
    if (!picks.length) {
      wrap.innerHTML = "";
      return;
    }
    wrap.innerHTML = picks
      .map(
        (t, i) => `
      <div class="testi-card reveal${firstRenderDone ? " in" : ""}" style="--i:${i}">
        <div class="testi-quote-mark">&ldquo;</div>
        <p class="quote">${t.quote}</p>
        <div class="testi-foot">
          <div class="testi-avatar">${(t.name || "?").charAt(0)}</div>
          <div><div class="name">${t.name}</div><div class="role">${t.project}</div></div>
        </div>
      </div>`
      )
      .join("");
  }

  function observeReveals() {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.14 });
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }
  }

  function renderAll() {
    renderMarquee();
    renderServices();
    renderFeatured();
    renderTestimonials();
    observeReveals();
    firstRenderDone = true;
  }

  document.addEventListener("mrasil:dataready", renderAll);
  document.addEventListener("mrasil:langchange", () => { if (firstRenderDone) renderAll(); });
})();
