/* ==========================================================================
   MRASIL Admin — production panel.
   Talks to this same server's real API (/api/admin/*, session-cookie
   auth, bcrypt on the server side). No localStorage, no client-side
   password, nothing fake — every action here is a real database write.
   ========================================================================== */
(function () {
  "use strict";

  const API = "/api/admin";
  let SERVICES = [];
  let PROJECTS = [];
  let SETTINGS = {};

  /* ---------------------------------------------------------------- */
  /* Fetch helper — throws with the server's real error message         */
  /* ---------------------------------------------------------------- */
  async function api(path, options = {}) {
    const res = await fetch(API + path, {
      credentials: "same-origin",
      headers: options.body instanceof FormData ? {} : { "Content-Type": "application/json" },
      ...options,
    });
    let data = null;
    try { data = await res.json(); } catch (e) { /* no body */ }
    if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
    return data;
  }

  /* ---------------------------------------------------------------- */
  /* Toast                                                              */
  /* ---------------------------------------------------------------- */
  let toastTimer = null;
  function toast(msg, isError) {
    let el = document.querySelector(".a-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "a-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.borderColor = isError ? "#c57165" : "var(--champagne)";
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3600);
  }

  /* ---------------------------------------------------------------- */
  /* Auth                                                               */
  /* ---------------------------------------------------------------- */
  const loginScreen = document.getElementById("login-screen");
  const app = document.getElementById("admin-app");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  async function checkSession() {
    try {
      await api("/auth/me");
      showApp();
    } catch (e) {
      loginScreen.style.display = "";
      app.classList.remove("is-active");
    }
  }

  async function showApp() {
    loginScreen.style.display = "none";
    app.classList.add("is-active");
    await loadAll();
    renderAll();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    loginError.classList.remove("is-visible");
    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      showApp();
    } catch (err) {
      loginError.textContent = err.message;
      loginError.classList.add("is-visible");
    }
  });

  document.querySelectorAll("[data-logout]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      try { await api("/auth/logout", { method: "POST" }); } catch (e) {}
      location.reload();
    })
  );

  checkSession();

  /* ---------------------------------------------------------------- */
  /* Navigation                                                         */
  /* ---------------------------------------------------------------- */
  const navButtons = document.querySelectorAll(".admin-nav button[data-view]");
  const views = document.querySelectorAll(".admin-view");
  function goTo(view) {
    navButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    views.forEach((v) => v.classList.toggle("is-active", v.id === "view-" + view));
    window.scrollTo({ top: 0 });
  }
  navButtons.forEach((b) => b.addEventListener("click", () => goTo(b.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach((el) => el.addEventListener("click", () => goTo(el.dataset.goto)));

  /* ---------------------------------------------------------------- */
  /* Icons                                                              */
  /* ---------------------------------------------------------------- */
  const ICON = {
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7-5.4-4.7 7.1-.6z"/></svg>',
  };
  function stars(n, max = 5) {
    let out = "";
    for (let i = 1; i <= max; i++) out += `<span style="opacity:${i <= n ? 1 : 0.25}">${ICON.star}</span>`;
    return out;
  }
  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------------------------------------------------------------- */
  /* Load everything once, after login                                  */
  /* ---------------------------------------------------------------- */
  async function loadAll() {
    [SERVICES, PROJECTS, SETTINGS] = await Promise.all([
      api("/services"),
      api("/projects"),
      api("/settings"),
    ]);
  }

  function renderAll() {
    renderDashboard();
    renderServices();
    renderProjects();
    renderReviews();
    renderSettings();
  }

  /* ---------------------------------------------------------------- */
  /* Dashboard                                                          */
  /* ---------------------------------------------------------------- */
  async function renderDashboard() {
    let pendingCount = 0;
    let approvedCount = 0;
    try { pendingCount = (await api("/reviews?status=pending")).length; } catch (e) {}
    try { approvedCount = (await api("/reviews?status=approved")).length; } catch (e) {}

    document.getElementById("stat-services").textContent = SERVICES.length;
    document.getElementById("stat-projects").textContent = PROJECTS.length;
    document.getElementById("stat-pending").textContent = pendingCount;
    document.getElementById("stat-approved").textContent = approvedCount;

    document.querySelectorAll("[data-badge-pending]").forEach((b) => {
      b.textContent = pendingCount;
      b.style.display = pendingCount > 0 ? "" : "none";
    });

    try {
      const log = await api("/settings/activity");
      const el = document.getElementById("activity-log");
      el.innerHTML = log.length
        ? log.map((a) => `<div class="a-log-item"><time>${new Date(a.created_at).toLocaleString()}</time><span>${escapeHtml(a.event)}${a.detail ? " — " + escapeHtml(a.detail) : ""}</span></div>`).join("")
        : `<div class="a-empty">No activity yet.</div>`;
    } catch (e) {}
  }

  /* ---------------------------------------------------------------- */
  /* Services                                                           */
  /* ---------------------------------------------------------------- */
  function imgThumb(kind, id, src) {
    const isVideo = /\.(mp4|webm|mov)$/i.test(src);
    return `<div class="a-img-thumb">${
      isVideo ? `<video src="${src}" muted style="width:100%;height:100%;object-fit:cover;"></video>` : `<img src="${src}" alt="">`
    }<button type="button" data-remove-media="${id}" data-kind="${kind}" aria-label="Remove">${ICON.trash}</button></div>`;
  }

  function renderServices() {
    const wrap = document.getElementById("services-list");
    wrap.innerHTML = SERVICES.map(
      (s) => `
      <div class="admin-card" data-service="${s.id}">
        <div class="admin-card-head">
          <h3>${String(s.sort_order || 0).padStart(2, "0")} — ${escapeHtml(s.title_en)}</h3>
          <div style="display:flex; align-items:center; gap:14px;">
            <label class="a-toggle">
              <input type="checkbox" data-field="visible" ${s.visible ? "checked" : ""}>
              <span class="track"></span>
              <span class="lbl">${s.visible ? "Visible on site" : "Hidden"}</span>
            </label>
            <button type="button" class="a-btn a-btn-danger a-btn-sm" data-delete-service="${s.id}">${ICON.trash}</button>
          </div>
        </div>
        <div class="a-row-2">
          <div class="a-field" dir="rtl"><label>العنوان (عربي)</label><input type="text" data-field="title_ar" value="${escapeHtml(s.title_ar)}"></div>
          <div class="a-field"><label>Title (English)</label><input type="text" data-field="title_en" value="${escapeHtml(s.title_en)}"></div>
        </div>
        <div class="a-row-2">
          <div class="a-field" dir="rtl"><label>الوصف (عربي)</label><textarea data-field="description_ar">${escapeHtml(s.description_ar)}</textarea></div>
          <div class="a-field"><label>Description (English)</label><textarea data-field="description_en">${escapeHtml(s.description_en)}</textarea></div>
        </div>
        <label style="font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; color:var(--label-muted); display:block; margin-bottom:8px;">Images &amp; Video</label>
        <div class="a-images" data-images>
          ${s.images.map((src) => imgThumb("service", s.id, src)).join("")}
          ${s.video ? imgThumb("service", s.id, s.video) : ""}
        </div>
        <div class="a-img-add">
          <label class="a-btn a-btn-ghost a-btn-sm" style="cursor:pointer;">Upload Image<input type="file" accept="image/*" data-upload="image" style="display:none;"></label>
          <label class="a-btn a-btn-ghost a-btn-sm" style="cursor:pointer;">Upload Video<input type="file" accept="video/*" data-upload="video" style="display:none;"></label>
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:16px;">
          <button type="button" class="a-btn a-btn-primary a-btn-sm" data-save-service>Save Changes</button>
        </div>
      </div>`
    ).join("") + `
      <div style="display:flex; justify-content:center; margin-top:8px;">
        <button type="button" class="a-btn a-btn-ghost" id="add-service-btn">+ Add New Service</button>
      </div>`;

    wrap.querySelectorAll("[data-service]").forEach(wireServiceCard);
    const addBtn = document.getElementById("add-service-btn");
    if (addBtn) addBtn.addEventListener("click", async () => {
      const title_en = prompt("New service title (English):");
      if (!title_en) return;
      const title_ar = prompt("New service title (Arabic):") || title_en;
      try {
        await api("/services", { method: "POST", body: JSON.stringify({ title_en, title_ar, sort_order: SERVICES.length + 1 }) });
        SERVICES = await api("/services");
        renderServices();
        toast("Service added.");
      } catch (err) { toast(err.message, true); }
    });
  }

  function wireServiceCard(card) {
    const id = card.dataset.service;

    card.querySelectorAll("[data-remove-media]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        if (!confirm("Remove this file? This can't be undone.")) return;
        try {
          await api(`/services/${id}/media/${btn.dataset.removeMedia}`, { method: "DELETE" });
          SERVICES = await api("/services");
          renderServices();
          toast("Removed.");
        } catch (err) { toast(err.message, true); }
      })
    );

    card.querySelectorAll("[data-upload]").forEach((input) =>
      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const kind = input.dataset.upload;
        const fd = new FormData();
        fd.append("file", file);
        toast(`Uploading ${kind}…`);
        try {
          await api(`/services/${id}/media/${kind}`, { method: "POST", body: fd });
          SERVICES = await api("/services");
          renderServices();
          toast("Uploaded.");
        } catch (err) { toast(err.message, true); }
        e.target.value = "";
      })
    );

    card.querySelector("[data-save-service]").addEventListener("click", async () => {
      const body = {
        title_en: card.querySelector('[data-field="title_en"]').value.trim(),
        title_ar: card.querySelector('[data-field="title_ar"]').value.trim(),
        description_en: card.querySelector('[data-field="description_en"]').value.trim(),
        description_ar: card.querySelector('[data-field="description_ar"]').value.trim(),
      };
      try {
        await api(`/services/${id}`, { method: "PUT", body: JSON.stringify(body) });
        SERVICES = await api("/services");
        toast("Saved.");
        renderServices();
      } catch (err) { toast(err.message, true); }
    });

    card.querySelector('[data-field="visible"]').addEventListener("change", async (e) => {
      try {
        await api(`/services/${id}`, { method: "PUT", body: JSON.stringify({ visible: e.target.checked }) });
        SERVICES = await api("/services");
        renderServices();
      } catch (err) { toast(err.message, true); }
    });

    const deleteBtn = card.querySelector("[data-delete-service]");
    if (deleteBtn) deleteBtn.addEventListener("click", async () => {
      if (!confirm("Delete this service? Its projects will keep their other data but lose this category link.")) return;
      try {
        await api(`/services/${id}`, { method: "DELETE" });
        SERVICES = await api("/services");
        renderServices();
        toast("Service deleted.");
      } catch (err) { toast(err.message, true); }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Projects                                                           */
  /* ---------------------------------------------------------------- */
  function renderProjects() {
    const tbody = document.getElementById("projects-tbody");
    if (!PROJECTS.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="a-empty">No projects yet — click "Add New Project" to create one.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = PROJECTS.map((p) => {
      const svc = SERVICES.find((s) => s.id === p.service_id);
      const cover = (p.media.find((m) => m.type === "image") || {}).url || "";
      return `
        <tr data-project-row="${p.id}">
          <td>${cover ? `<img class="thumb" src="${cover}" alt="">` : ""}</td>
          <td><b>${escapeHtml(p.title_en)}</b><br><span style="color:var(--label-muted); font-size:.78rem;">${escapeHtml(p.title_ar)}</span></td>
          <td>${svc ? escapeHtml(svc.title_en) : "—"}</td>
          <td>${escapeHtml(p.location_en)} · ${escapeHtml(p.year)}</td>
          <td>
            <div class="actions">
              <button type="button" class="a-btn a-btn-ghost a-btn-sm" data-edit-project="${p.id}">Edit</button>
              <button type="button" class="a-btn a-btn-danger a-btn-sm" data-delete-project="${p.id}">${ICON.trash}</button>
            </div>
          </td>
        </tr>`;
    }).join("");

    tbody.querySelectorAll("[data-edit-project]").forEach((b) => b.addEventListener("click", () => openProjectModal(b.dataset.editProject)));
    tbody.querySelectorAll("[data-delete-project]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm("Delete this project? This can't be undone.")) return;
        try {
          await api(`/projects/${b.dataset.deleteProject}`, { method: "DELETE" });
          PROJECTS = await api("/projects");
          renderProjects();
          renderDashboard();
          toast("Project deleted.");
        } catch (err) { toast(err.message, true); }
      })
    );
  }

  const projectModal = document.getElementById("project-modal");
  const projectForm = document.getElementById("project-form");
  let editingProjectId = null;

  function fillCategorySelect() {
    const sel = document.getElementById("pf-category");
    sel.innerHTML = SERVICES.map((s) => `<option value="${s.id}">${escapeHtml(s.title_en)}</option>`).join("");
  }

  function openProjectModal(id) {
    fillCategorySelect();
    editingProjectId = id || null;
    const p = id ? PROJECTS.find((x) => String(x.id) === String(id)) : null;
    document.getElementById("project-modal-title").textContent = p ? "Edit Project" : "Add New Project";
    document.getElementById("pf-ar").value = p ? p.title_ar : "";
    document.getElementById("pf-en").value = p ? p.title_en : "";
    document.getElementById("pf-ar-desc").value = p ? p.description_ar : "";
    document.getElementById("pf-en-desc").value = p ? p.description_en : "";
    document.getElementById("pf-location").value = p ? p.location_en : "Private Residence";
    document.getElementById("pf-year").value = p ? p.year : "20XX";
    document.getElementById("pf-category").value = p ? p.service_id : (SERVICES[0] && SERVICES[0].id);
    renderModalImages(p);
    projectModal.classList.add("is-open");
  }
  function closeProjectModal() {
    projectModal.classList.remove("is-open");
    editingProjectId = null;
  }
  function renderModalImages(p) {
    const wrap = document.getElementById("pf-images");
    if (!p) { wrap.innerHTML = `<p class="a-note">Save the project first, then upload images/video.</p>`; return; }
    wrap.innerHTML = p.media.map((m) => imgThumb("project", p.id, m.url)).join("") || `<p class="a-note">No media yet.</p>`;
    wrap.querySelectorAll("[data-remove-media]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        try {
          await api(`/projects/${p.id}/media/${btn.dataset.removeMedia}`, { method: "DELETE" });
          PROJECTS = await api("/projects");
          renderModalImages(PROJECTS.find((x) => String(x.id) === String(p.id)));
          renderProjects();
        } catch (err) { toast(err.message, true); }
      })
    );
  }

  document.getElementById("add-project-btn").addEventListener("click", () => openProjectModal(null));
  document.querySelectorAll("[data-close-project-modal]").forEach((b) => b.addEventListener("click", closeProjectModal));
  projectModal.addEventListener("click", (e) => { if (e.target === projectModal) closeProjectModal(); });

  document.getElementById("pf-upload-image").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file || !editingProjectId) { if (!editingProjectId) toast("Save the project first, then upload images.", true); return; }
    const fd = new FormData();
    fd.append("file", file);
    try {
      await api(`/projects/${editingProjectId}/media/image`, { method: "POST", body: fd });
      PROJECTS = await api("/projects");
      renderModalImages(PROJECTS.find((x) => String(x.id) === String(editingProjectId)));
      renderProjects();
      toast("Image uploaded.");
    } catch (err) { toast(err.message, true); }
  });
  document.getElementById("pf-upload-video").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file || !editingProjectId) { if (!editingProjectId) toast("Save the project first, then upload a video.", true); return; }
    const fd = new FormData();
    fd.append("file", file);
    try {
      await api(`/projects/${editingProjectId}/media/video`, { method: "POST", body: fd });
      PROJECTS = await api("/projects");
      renderModalImages(PROJECTS.find((x) => String(x.id) === String(editingProjectId)));
      renderProjects();
      toast("Video uploaded.");
    } catch (err) { toast(err.message, true); }
  });

  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      title_en: document.getElementById("pf-en").value.trim(),
      title_ar: document.getElementById("pf-ar").value.trim(),
      description_en: document.getElementById("pf-en-desc").value.trim(),
      description_ar: document.getElementById("pf-ar-desc").value.trim(),
      location_en: document.getElementById("pf-location").value.trim(),
      year: document.getElementById("pf-year").value.trim(),
      service_id: document.getElementById("pf-category").value,
    };
    if (!payload.title_en || !payload.title_ar) { toast("Please add both an Arabic and English title.", true); return; }
    try {
      if (editingProjectId) {
        await api(`/projects/${editingProjectId}`, { method: "PUT", body: JSON.stringify(payload) });
        toast("Project updated.");
      } else {
        const created = await api("/projects", { method: "POST", body: JSON.stringify(payload) });
        editingProjectId = created.id;
        toast("Project created — now upload images below.");
      }
      PROJECTS = await api("/projects");
      renderProjects();
      renderDashboard();
      renderModalImages(PROJECTS.find((x) => String(x.id) === String(editingProjectId)));
      document.getElementById("project-modal-title").textContent = "Edit Project";
    } catch (err) { toast(err.message, true); }
  });

  /* ---------------------------------------------------------------- */
  /* Reviews                                                            */
  /* ---------------------------------------------------------------- */
  let activeReviewTab = "pending";
  document.querySelectorAll(".a-tab[data-tab]").forEach((tab) =>
    tab.addEventListener("click", () => {
      activeReviewTab = tab.dataset.tab;
      document.querySelectorAll(".a-tab[data-tab]").forEach((t) => t.classList.toggle("is-active", t === tab));
      renderReviews();
    })
  );

  async function renderReviews() {
    const list = document.getElementById("reviews-list");
    let rows = [];
    try { rows = await api(`/reviews?status=${activeReviewTab}`); } catch (e) { list.innerHTML = `<div class="a-empty">Could not load reviews.</div>`; return; }

    for (const tabName of ["pending", "approved", "rejected"]) {
      const badgeEl = document.querySelector(`.a-tab[data-tab="${tabName}"] .badge`);
      if (badgeEl) {
        try { badgeEl.textContent = (await api(`/reviews?status=${tabName}`)).length; } catch (e) {}
      }
    }

    if (!rows.length) { list.innerHTML = `<div class="a-empty">No ${activeReviewTab} reviews.</div>`; return; }
    list.innerHTML = rows.map((r) => `
      <div class="a-review" data-review="${r.id}">
        <div class="a-review-head">
          <div class="who"><b>${escapeHtml(r.customer_name)}</b><span>${escapeHtml(r.project_name)} · ${new Date(r.created_at).toLocaleDateString()}</span></div>
          <div class="a-review-stars">${stars(r.rating)}</div>
        </div>
        <p class="txt">${escapeHtml(r.review_text)}</p>
        <div class="a-review-foot">
          <span class="a-status-pill ${r.status}">${r.status}</span>
          ${r.status !== "approved" ? `<button type="button" class="a-btn a-btn-primary a-btn-sm" data-approve="${r.id}">Approve</button>` : ""}
          ${r.status !== "rejected" ? `<button type="button" class="a-btn a-btn-ghost a-btn-sm" data-reject="${r.id}">Reject</button>` : ""}
          ${r.status !== "pending" ? `<button type="button" class="a-btn a-btn-ghost a-btn-sm" data-pending="${r.id}">Move to Pending</button>` : ""}
          <button type="button" class="a-btn a-btn-danger a-btn-sm" data-delete-review="${r.id}">${ICON.trash}</button>
        </div>
      </div>`).join("");

    list.querySelectorAll("[data-approve]").forEach((b) => b.addEventListener("click", () => setReviewStatus(b.dataset.approve, "approved")));
    list.querySelectorAll("[data-reject]").forEach((b) => b.addEventListener("click", () => setReviewStatus(b.dataset.reject, "rejected")));
    list.querySelectorAll("[data-pending]").forEach((b) => b.addEventListener("click", () => setReviewStatus(b.dataset.pending, "pending")));
    list.querySelectorAll("[data-delete-review]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm("Delete this review permanently?")) return;
        try {
          await api(`/reviews/${b.dataset.deleteReview}`, { method: "DELETE" });
          renderReviews();
          renderDashboard();
        } catch (err) { toast(err.message, true); }
      })
    );
  }
  async function setReviewStatus(id, status) {
    try {
      await api(`/reviews/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
      renderReviews();
      renderDashboard();
      toast(`Review ${status}.`);
    } catch (err) { toast(err.message, true); }
  }

  /* ---------------------------------------------------------------- */
  /* Settings                                                           */
  /* ---------------------------------------------------------------- */
  function renderSettings() {
    const s = SETTINGS;
    document.getElementById("set-whatsapp").value = s.whatsapp || "";
    document.getElementById("set-phone").value = s.phone || "";
    document.getElementById("set-email").value = s.email || "";
    document.getElementById("set-address-ar").value = s.address_ar || "";
    document.getElementById("set-address-en").value = s.address_en || "";
    document.getElementById("set-maps").value = s.maps_url || "";
    document.getElementById("set-lat").value = s.maps_lat || "";
    document.getElementById("set-lng").value = s.maps_lng || "";
    document.getElementById("set-hours").value = s.working_hours || "";
    document.getElementById("set-lang").value = s.default_lang || "ar";
    document.getElementById("set-instagram").value = s.instagram || "";
    document.getElementById("set-linkedin").value = s.linkedin || "";
    updateMapsPreview();
    updateWhatsappPreview();
  }
  function updateMapsPreview() {
    const url = document.getElementById("set-maps").value.trim();
    const btn = document.getElementById("maps-preview-btn");
    if (url) { btn.href = url; btn.classList.remove("a-btn-ghost"); btn.classList.add("a-btn-primary"); }
    else { btn.href = "#"; btn.classList.add("a-btn-ghost"); btn.classList.remove("a-btn-primary"); }
  }
  function updateWhatsappPreview() {
    const num = document.getElementById("set-whatsapp").value.trim().replace(/[^\d]/g, "");
    document.getElementById("whatsapp-preview").textContent = num ? `wa.me/${num}` : "—";
  }
  document.getElementById("set-maps").addEventListener("input", updateMapsPreview);
  document.getElementById("set-whatsapp").addEventListener("input", updateWhatsappPreview);

  document.getElementById("settings-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      whatsapp: document.getElementById("set-whatsapp").value.trim(),
      phone: document.getElementById("set-phone").value.trim(),
      email: document.getElementById("set-email").value.trim(),
      address_ar: document.getElementById("set-address-ar").value.trim(),
      address_en: document.getElementById("set-address-en").value.trim(),
      maps_url: document.getElementById("set-maps").value.trim(),
      maps_lat: document.getElementById("set-lat").value.trim(),
      maps_lng: document.getElementById("set-lng").value.trim(),
      working_hours: document.getElementById("set-hours").value.trim(),
      default_lang: document.getElementById("set-lang").value,
      instagram: document.getElementById("set-instagram").value.trim(),
      linkedin: document.getElementById("set-linkedin").value.trim(),
    };
    try {
      SETTINGS = await api("/settings", { method: "PUT", body: JSON.stringify(body) });
      toast("Settings saved.");
    } catch (err) { toast(err.message, true); }
  });
})();
