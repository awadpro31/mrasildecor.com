/* MRASIL — About page: renders the "Expertise" two-column list from
   live Services data (assets/js/data.js). */
(function () {
  "use strict";
  let firstRenderDone = false;

  function render() {
    const grid = document.getElementById("expertise-grid");
    if (!grid) return;
    const half = Math.ceil(SERVICES.length / 2);
    const cols = [SERVICES.slice(0, half), SERVICES.slice(half)];
    grid.innerHTML = cols
      .map(
        (col) =>
          `<ul style="display:flex; flex-direction:column;">` +
          col
            .map(
              (s, i) => `
        <li class="reveal${firstRenderDone ? " in" : ""}" style="--i:${i}; padding:22px 0; ${i < col.length - 1 ? "border-bottom:1px solid var(--line-soft);" : ""} display:flex; justify-content:space-between; align-items:baseline; gap:20px;">
          <span style="font-family:var(--font-display); font-size:1.3rem;">${pick(s, "title")}</span>
          <span class="text-muted" style="font-size:.86rem; text-align:right; max-width:32ch;">${pick(s, "description")}</span>
        </li>`
            )
            .join("") +
          `</ul>`
      )
      .join("");

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.14 });
      grid.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    } else {
      grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }
    firstRenderDone = true;
  }

  document.addEventListener("mrasil:dataready", render);
  document.addEventListener("mrasil:langchange", () => { if (firstRenderDone) render(); });
})();
