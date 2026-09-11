/* ==========================================================================
   MRASIL — Projects page. Renders from live data (PROJECTS/SERVICES in
   assets/js/data.js) once "mrasil:dataready" fires, and re-renders (no
   refetch) on "mrasil:langchange" since every record carries both
   languages already.
   ========================================================================== */
(function () {
  "use strict";
  const grid = document.getElementById("project-grid");
  const tabsBar = document.getElementById("project-tabs");
  if (!grid || !tabsBar) return;

  const isRtl = document.documentElement.dir === "rtl";
  const ALL_LABEL = isRtl ? "الكل" : "All";
  let activeCat = "all";
  let firstRenderDone = false;

  const highlight = document.createElement("span");
  highlight.className = "tab-highlight";

  function categories() {
    const seen = new Set();
    const cats = [{ key: "all", label: ALL_LABEL }];
    PROJECTS.forEach((p) => {
      const sid = p.service_id;
      if (sid && !seen.has(sid)) {
        seen.add(sid);
        cats.push({ key: String(sid), label: categoryLabel(p) });
      }
    });
    return cats;
  }

  function renderTabs() {
    tabsBar.innerHTML = "";
    tabsBar.appendChild(highlight);
    categories().forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "tab-btn" + (cat.key === activeCat ? " is-active" : "");
      btn.type = "button";
      btn.textContent = cat.label;
      btn.dataset.cat = cat.key;
      tabsBar.appendChild(btn);
    });
    requestAnimationFrame(() => {
      const active = tabsBar.querySelector(".tab-btn.is-active") || tabsBar.querySelector(".tab-btn");
      if (active) moveHighlight(active);
    });
  }

  function moveHighlight(target) {
    const barRect = tabsBar.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    highlight.style.width = r.width + "px";
    highlight.style.transform = `translateX(${r.left - barRect.left - 6}px)`;
  }

  function cardHTML(p, index) {
    const hidden = activeCat !== "all" && String(p.service_id) !== activeCat;
    return `
      <article class="project-tile reveal${firstRenderDone ? " in" : ""}${hidden ? " is-hidden" : ""}" style="--i:${index % 6}" data-cat="${p.service_id || ""}" data-id="${p.id}">
        <div class="proj-card tilt-card" tabindex="0" role="button" aria-label="${pick(p, "title")}">
          <div class="thumb"><img src="${p.coverImage}" alt="${pick(p, "title")} — ${categoryLabel(p)}" loading="lazy"></div>
          <span class="view" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
          <div class="info">
            <span class="cat">${categoryLabel(p)}</span>
            <h3>${pick(p, "title")}</h3>
            <div class="meta">${pick(p, "location")}${p.year ? " · " + p.year : ""}</div>
          </div>
        </div>
      </article>`;
  }

  function renderCards() {
    grid.innerHTML = PROJECTS.map(cardHTML).join("");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.14 });
      grid.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    } else {
      grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }
  }

  function applyFilter(cat) {
    activeCat = cat;
    grid.querySelectorAll(".project-tile").forEach((tile) => {
      const show = cat === "all" || tile.dataset.cat === cat;
      tile.classList.toggle("is-hidden", !show);
    });
  }

  tabsBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    tabsBar.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    moveHighlight(btn);
    applyFilter(btn.dataset.cat);
  });
  window.addEventListener("resize", () => {
    const active = tabsBar.querySelector(".tab-btn.is-active");
    if (active) moveHighlight(active);
  });

  /* ---- Lightbox (with optional project video) ---- */
  const lb = document.getElementById("project-lightbox");
  const lbImg = lb ? lb.querySelector(".lightbox-media img") : null;
  const lbCat = lb ? lb.querySelector(".lb-cat") : null;
  const lbTitle = lb ? lb.querySelector(".lb-title") : null;
  const lbLoc = lb ? lb.querySelector(".lb-loc") : null;
  const lbYear = lb ? lb.querySelector(".lb-year") : null;
  const lbDesc = lb ? lb.querySelector(".lb-desc") : null;
  const lbThumbs = lb ? lb.querySelector(".lightbox-thumbs") : null;
  const lbVideoWrap = document.getElementById("lb-video-wrap");
  const lbVideoEl = lbVideoWrap ? lbVideoWrap.querySelector("video") : null;

  let activeProject = null;
  let activeImgIndex = 0;

  function openProject(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p || !lb) return;
    activeProject = p;
    activeImgIndex = 0;
    renderLightbox();
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lbVideoEl) lbVideoEl.pause();
  }
  function renderLightbox() {
    const p = activeProject;
    const images = p.images && p.images.length ? p.images : [p.coverImage];
    lbImg.src = images[activeImgIndex];
    lbImg.alt = `${pick(p, "title")} — ${activeImgIndex + 1}/${images.length}`;
    lbCat.textContent = categoryLabel(p);
    lbTitle.textContent = pick(p, "title");
    lbLoc.textContent = pick(p, "location");
    lbYear.textContent = p.year || "";
    lbDesc.textContent = pick(p, "description");
    lbThumbs.innerHTML = images
      .map((src, i) => `<button type="button" data-i="${i}" class="${i === activeImgIndex ? "is-active" : ""}"><img src="${src}" alt="" loading="lazy"></button>`)
      .join("");
    if (lbVideoWrap && lbVideoEl) {
      if (p.video) {
        lbVideoEl.src = p.video;
        lbVideoWrap.style.display = "";
      } else {
        lbVideoEl.removeAttribute("src");
        lbVideoWrap.style.display = "none";
      }
    }
  }

  grid.addEventListener("click", (e) => {
    const tile = e.target.closest(".project-tile");
    if (tile) openProject(tile.dataset.id);
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tile = e.target.closest(".project-tile");
    if (tile) { e.preventDefault(); openProject(tile.dataset.id); }
  });

  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target.matches("[data-lb-close]") || e.target === lb) closeLightbox();
      const thumb = e.target.closest("[data-i]");
      if (thumb) { activeImgIndex = Number(thumb.dataset.i); renderLightbox(); }
      const images = activeProject ? (activeProject.images.length ? activeProject.images : [activeProject.coverImage]) : [];
      if (e.target.closest("[data-lb-prev-img]") && images.length) {
        activeImgIndex = (activeImgIndex - 1 + images.length) % images.length;
        renderLightbox();
      }
      if (e.target.closest("[data-lb-next-img]") && images.length) {
        activeImgIndex = (activeImgIndex + 1) % images.length;
        renderLightbox();
      }
      if (e.target.closest("[data-lb-prev-project]") || e.target.closest("[data-lb-next-project]")) {
        const dir = e.target.closest("[data-lb-prev-project]") ? -1 : 1;
        const idx = PROJECTS.findIndex((p) => p.id === activeProject.id);
        const next = PROJECTS[(idx + dir + PROJECTS.length) % PROJECTS.length];
        openProject(next.id);
      }
    });
    window.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
    });
  }

  function renderAll() {
    renderTabs();
    renderCards();
    if (lb && lb.classList.contains("is-open")) renderLightbox();
    firstRenderDone = true;
  }

  document.addEventListener("mrasil:dataready", () => {
    renderAll();
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("category");
    if (wanted) {
      const btn = tabsBar.querySelector(`.tab-btn[data-cat="${wanted}"]`);
      if (btn) {
        tabsBar.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        applyFilter(wanted);
        requestAnimationFrame(() => moveHighlight(btn));
      }
    }
  });
  document.addEventListener("mrasil:langchange", () => { if (firstRenderDone) renderAll(); });
})();
