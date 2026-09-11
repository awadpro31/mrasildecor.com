/* MRASIL — Interior Designs look-book. Renders from live GALLERY data
   (assets/js/data.js) once "mrasil:dataready" fires. */
(function () {
  "use strict";
  const wall = document.getElementById("gallery-wall");
  const pillsBar = document.getElementById("gallery-pills");
  if (!wall) return;

  const isRtl = document.documentElement.dir === "rtl";
  const ALL_LABEL = isRtl ? "الكل" : "All";
  let activeCat = ALL_LABEL;
  let firstRenderDone = false;

  function spaceLabel(item) {
    return isRtl ? item.space_type_ar || item.space_type_en : item.space_type_en;
  }

  function renderPills() {
    if (!pillsBar) return;
    const cats = [ALL_LABEL, ...Array.from(new Set(GALLERY.map(spaceLabel).filter(Boolean)))];
    pillsBar.innerHTML = cats
      .map((c, i) => `<button type="button" data-cat="${c}" class="${c === activeCat ? "is-active" : ""}">${c}</button>`)
      .join("");
  }

  function renderWall() {
    wall.innerHTML = GALLERY.map(
      (g, i) => `
    <figure class="reveal-mask${firstRenderDone ? " in" : ""}" data-cat="${spaceLabel(g)}" style="--i:${i % 8}${activeCat !== ALL_LABEL && spaceLabel(g) !== activeCat ? "; display:none" : ""}">
      <img src="${g.image}" alt="${isRtl ? g.title_ar : g.title_en} — ${spaceLabel(g)}" loading="lazy">
      <figcaption>
        <div class="cat">${spaceLabel(g)}</div>
        <div class="ttl">${isRtl ? g.title_ar : g.title_en}</div>
      </figcaption>
    </figure>`
    ).join("");

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.08 });
      wall.querySelectorAll(".reveal-mask:not(.in)").forEach((el) => io.observe(el));
    } else {
      wall.querySelectorAll(".reveal-mask").forEach((el) => el.classList.add("in"));
    }
  }

  if (pillsBar) {
    pillsBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      pillsBar.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeCat = btn.dataset.cat;
      wall.querySelectorAll("figure").forEach((f) => {
        f.style.display = activeCat === ALL_LABEL || f.dataset.cat === activeCat ? "" : "none";
      });
    });
  }

  function renderAll() {
    renderPills();
    renderWall();
    firstRenderDone = true;
  }

  document.addEventListener("mrasil:dataready", renderAll);
  document.addEventListener("mrasil:langchange", () => { if (firstRenderDone) renderAll(); });
})();
