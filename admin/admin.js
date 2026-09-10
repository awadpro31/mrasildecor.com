/* ==========================================================================
   MRASIL Admin — prototype logic.

   IMPORTANT — READ BEFORE REUSING ANY OF THIS CODE IN PRODUCTION:
   This is a UI/UX prototype only. There is no server, no database, and
   no real authentication. Everything lives in the browser's localStorage
   for THIS device only — nothing here is shared between users, nothing
   is backed up, and the "login" is a hardcoded demo password anyone can
   read in this file. It exists purely to validate screens and workflow
   before real development (see WORDPRESS-ROADMAP.md for the real build).
   ========================================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "mrasil_admin_demo_v1";
  const SESSION_KEY = "mrasil_admin_demo_session";
  const DEMO_EMAIL = "admin@mrasildecor.com";
  const DEMO_PASSWORD = "demo1234";

  /* ---------------------------------------------------------------- */
  /* Seed data — the 8 real service categories from the client brief   */
  /* ---------------------------------------------------------------- */
  const DEFAULT_DATA = {
    services: [
      { id: "svc-1", order: 1, visible: true, ar: "تصميم داخلي وتنفيذ", en: "Interior Design & Execution", arDesc: "من الفكرة الأولى وحتى التسليم النهائي — تصميم كامل وتنفيذ على أرض الواقع.", enDesc: "From first concept to final handover — full design and on-site execution.", images: ["https://images.unsplash.com/photo-1541194577687-8c63bf9e7ee3?auto=format&fit=crop&w=800&q=80"] },
      { id: "svc-2", order: 2, visible: true, ar: "جبسنبورد واصباغ", en: "Gypsum Board & Painting", arDesc: "تشطيبات أسقف وحوائط الجبسنبورد، مع أعمال الدهانات والديكورات.", enDesc: "Gypsum board ceiling and wall finishing, plus painting and decorative work.", images: [] },
      { id: "svc-3", order: 3, visible: true, ar: "منجرة", en: "Carpentry", arDesc: "تصنيع وتركيب أعمال الخشب والمنجرة حسب الطلب.", enDesc: "Custom carpentry and joinery, manufactured and installed to order.", images: ["https://images.unsplash.com/photo-1615147342761-9238e15d8b96?auto=format&fit=crop&w=800&q=80"] },
      { id: "svc-4", order: 4, visible: true, ar: "السيراميك والرخام", en: "Ceramic & Marble", arDesc: "توريد وتركيب السيراميك والرخام للأرضيات والحوائط.", enDesc: "Ceramic and marble supply and installation for floors and walls.", images: ["https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9?auto=format&fit=crop&w=800&q=80"] },
      { id: "svc-5", order: 5, visible: true, ar: "مطابخ الالمونيوم", en: "Aluminum Kitchens", arDesc: "تصميم وتصنيع مطابخ الالمونيوم بمقاسات مخصصة.", enDesc: "Aluminum kitchens designed and manufactured to custom sizes.", images: [] },
      { id: "svc-6", order: 6, visible: true, ar: "الزجاج السيكوريت", en: "Tempered / Security Glass", arDesc: "توريد وتركيب الزجاج السيكوريت لكافة الاستخدامات.", enDesc: "Tempered / security glass supply and installation for all applications.", images: [] },
      { id: "svc-7", order: 7, visible: true, ar: "الحجر الخارجي (GRC, GRV، فايبرقلاس، حجر طبيعي)", en: "Exterior Stone (GRC, GRV, Fiberglass, Natural Stone)", arDesc: "واجهات وأعمال الحجر الخارجي بجميع أنواعه.", enDesc: "Exterior facades and stonework across all material types.", images: [] },
      { id: "svc-8", order: 8, visible: true, ar: "الكهرباء والصحي", en: "Electrical & Plumbing", arDesc: "أعمال التمديدات الكهربائية والصحية الكاملة.", enDesc: "Complete electrical and plumbing installation works.", images: [] },
    ],
    projects: [
      { id: "prj-1", ar: "فيلا خاصة — الرياض", en: "Private Villa", category: "svc-1", arDesc: "تصميم داخلي كامل وتنفيذ لفيلا سكنية خاصة.", enDesc: "Full interior design and execution for a private residential villa.", location: "Private Residence", year: "20XX", images: ["https://images.unsplash.com/photo-1541194577687-8c63bf9e7ee3?auto=format&fit=crop&w=800&q=80"] },
      { id: "prj-2", ar: "مطبخ الومنيوم مخصص", en: "Custom Aluminum Kitchen", category: "svc-5", arDesc: "مطبخ الومنيوم بتصميم مخصص لمساحة سكنية.", enDesc: "Custom-designed aluminum kitchen for a residential space.", location: "Private Residence", year: "20XX", images: ["https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9?auto=format&fit=crop&w=800&q=80"] },
    ],
    reviews: [
      { id: "rev-1", name: "— اسم العميل —", project: "— اسم المشروع —", rating: 5, text: "— بانتظار مراجعة حقيقية من عميل. لا تُنشر تقييمات وهمية كحقيقية. —", status: "pending", date: new Date().toISOString() },
      { id: "rev-2", name: "— اسم العميل —", project: "— اسم المشروع —", rating: 5, text: "— نموذج تقييم موافَق عليه، جاهز ليتم استبداله بتقييم حقيقي. —", status: "approved", date: new Date().toISOString() },
    ],
    settings: {
      whatsapp: "971545448945",
      phone: "+971 56 399 5623",
      email: "eng.mohamed@mrasildecor.com",
      addressAr: "DBR Residence",
      addressEn: "DBR Residence",
      mapsUrl: "https://maps.app.goo.gl/bERqyzkfWQLWrmcX6",
      defaultLang: "ar",
      instagram: "",
      linkedin: "",
    },
    activity: [
      { id: "log-1", text: "تم إنشاء نسخة تجريبية من لوحة التحكم — Admin prototype created.", date: new Date().toISOString() },
    ],
  };

  /* ---------------------------------------------------------------- */
  /* Storage                                                            */
  /* ---------------------------------------------------------------- */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredCloneSafe(DEFAULT_DATA);
      const parsed = JSON.parse(raw);
      // shallow-merge with defaults so new fields introduced later don't break old saved demos
      return Object.assign(structuredCloneSafe(DEFAULT_DATA), parsed);
    } catch (e) {
      console.warn("Admin demo: could not read saved data, using defaults.", e);
      return structuredCloneSafe(DEFAULT_DATA);
    }
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast("Storage is full — try removing an uploaded image (large images use a lot of space in this browser-only demo).");
    }
  }
  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  let state = load();

  function logActivity(text) {
    state.activity.unshift({ id: "log-" + Date.now(), text, date: new Date().toISOString() });
    state.activity = state.activity.slice(0, 40);
    save();
  }

  /* ---------------------------------------------------------------- */
  /* Toast                                                              */
  /* ---------------------------------------------------------------- */
  let toastTimer = null;
  function toast(msg) {
    let el = document.querySelector(".a-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "a-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
  }

  /* ---------------------------------------------------------------- */
  /* Auth gate (demo only — see file header)                           */
  /* ---------------------------------------------------------------- */
  const loginScreen = document.getElementById("login-screen");
  const app = document.getElementById("admin-app");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  function showApp() {
    loginScreen.style.display = "none";
    app.classList.add("is-active");
    renderAll();
  }

  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    showApp();
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;
    if (email === DEMO_EMAIL && pass === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      loginError.classList.remove("is-visible");
      showApp();
    } else {
      loginError.textContent = "Incorrect demo credentials — use the ones shown below the form.";
      loginError.classList.add("is-visible");
    }
  });

  document.querySelectorAll("[data-logout]").forEach((btn) =>
    btn.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.reload();
    })
  );

  /* ---------------------------------------------------------------- */
  /* Navigation                                                         */
  /* ---------------------------------------------------------------- */
  const navButtons = document.querySelectorAll(".admin-nav button[data-view]");
  const views = document.querySelectorAll(".admin-view");
  function goTo(view) {
    navButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    views.forEach((v) => v.classList.toggle("is-active", v.id === "view-" + view));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }
  navButtons.forEach((b) => b.addEventListener("click", () => goTo(b.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach((el) =>
    el.addEventListener("click", () => goTo(el.dataset.goto))
  );

  /* ---------------------------------------------------------------- */
  /* Icons (tiny inline helper)                                        */
  /* ---------------------------------------------------------------- */
  const ICON = {
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7-5.4-4.7 7.1-.6z"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
  };
  function stars(n, max = 5) {
    let out = "";
    for (let i = 1; i <= max; i++) out += `<span style="opacity:${i <= n ? 1 : 0.25}">${ICON.star}</span>`;
    return out;
  }

  /* ---------------------------------------------------------------- */
  /* Dashboard                                                          */
  /* ---------------------------------------------------------------- */
  function renderDashboard() {
    const pending = state.reviews.filter((r) => r.status === "pending").length;
    document.getElementById("stat-services").textContent = state.services.length;
    document.getElementById("stat-projects").textContent = state.projects.length;
    document.getElementById("stat-pending").textContent = pending;
    document.getElementById("stat-approved").textContent = state.reviews.filter((r) => r.status === "approved").length;
    document.querySelectorAll("[data-badge-pending]").forEach((b) => {
      b.textContent = pending;
      b.style.display = pending > 0 ? "" : "none";
    });

    const log = document.getElementById("activity-log");
    log.innerHTML = state.activity
      .slice(0, 12)
      .map(
        (a) => `<div class="a-log-item"><time>${new Date(a.date).toLocaleString()}</time><span>${escapeHtml(a.text)}</span></div>`
      )
      .join("") || `<div class="a-empty">No activity yet.</div>`;
  }

  /* ---------------------------------------------------------------- */
  /* Services                                                           */
  /* ---------------------------------------------------------------- */
  function renderServices() {
    const wrap = document.getElementById("services-list");
    wrap.innerHTML = state.services
      .sort((a, b) => a.order - b.order)
      .map(
        (s) => `
      <div class="admin-card" data-service="${s.id}">
        <div class="admin-card-head">
          <h3>${String(s.order).padStart(2, "0")} — ${escapeHtml(s.en)}</h3>
          <label class="a-toggle">
            <input type="checkbox" data-field="visible" ${s.visible ? "checked" : ""}>
            <span class="track"></span>
            <span class="lbl">${s.visible ? "Visible on site" : "Hidden"}</span>
          </label>
        </div>
        <div class="a-row-2">
          <div class="a-field" dir="rtl"><label>العنوان (عربي)</label><input type="text" data-field="ar" value="${attr(s.ar)}"></div>
          <div class="a-field"><label>Title (English)</label><input type="text" data-field="en" value="${attr(s.en)}"></div>
        </div>
        <div class="a-row-2">
          <div class="a-field" dir="rtl"><label>الوصف (عربي)</label><textarea data-field="arDesc">${escapeHtml(s.arDesc)}</textarea></div>
          <div class="a-field"><label>Description (English)</label><textarea data-field="enDesc">${escapeHtml(s.enDesc)}</textarea></div>
        </div>
        <label style="font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; color:var(--label-muted); display:block; margin-bottom:8px;">Images</label>
        <div class="a-images" data-images>
          ${s.images.map((src, i) => imgThumb(src, i)).join("")}
        </div>
        <div class="a-img-add">
          <input type="text" placeholder="Paste an image URL…" data-add-url>
          <button type="button" class="a-btn a-btn-ghost a-btn-sm" data-add-url-btn>Add URL</button>
          <label class="a-btn a-btn-ghost a-btn-sm" style="cursor:pointer;">Upload File<input type="file" accept="image/*" data-add-file style="display:none;"></label>
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:16px;">
          <button type="button" class="a-btn a-btn-primary a-btn-sm" data-save-service>Save Changes</button>
        </div>
      </div>`
      )
      .join("");

    wrap.querySelectorAll("[data-service]").forEach(wireServiceCard);
  }

  function imgThumb(src, index) {
    return `<div class="a-img-thumb"><img src="${attr(src)}" alt="" loading="lazy"><button type="button" data-remove-img="${index}" aria-label="Remove image">${ICON.trash}</button></div>`;
  }

  function wireServiceCard(card) {
    const id = card.dataset.service;
    const svc = state.services.find((s) => s.id === id);

    card.querySelectorAll("[data-remove-img]").forEach((btn) =>
      btn.addEventListener("click", () => {
        svc.images.splice(Number(btn.dataset.removeImg), 1);
        save();
        renderServices();
        toast("Image removed (remember to click Save Changes to keep it removed after refresh — it's already saved instantly in this demo, this button is just for clarity).");
      })
    );

    const urlInput = card.querySelector("[data-add-url]");
    card.querySelector("[data-add-url-btn]").addEventListener("click", () => {
      const val = urlInput.value.trim();
      if (!val) return;
      svc.images.push(val);
      urlInput.value = "";
      save();
      renderServices();
      toast("Image added.");
    });

    card.querySelector("[data-add-file]").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1.2 * 1024 * 1024) {
        toast("That file is a bit large for this browser-only demo (localStorage has limited space) — try an image under ~1MB, or use the image URL field instead.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        svc.images.push(reader.result);
        save();
        renderServices();
        toast("Image uploaded (stored locally in this browser for the demo).");
      };
      reader.readAsDataURL(file);
    });

    card.querySelector("[data-save-service]").addEventListener("click", () => {
      svc.ar = card.querySelector('[data-field="ar"]').value.trim();
      svc.en = card.querySelector('[data-field="en"]').value.trim();
      svc.arDesc = card.querySelector('[data-field="arDesc"]').value.trim();
      svc.enDesc = card.querySelector('[data-field="enDesc"]').value.trim();
      save();
      logActivity(`Updated service "${svc.en}".`);
      renderServices();
      toast(`Saved "${svc.en}".`);
    });

    card.querySelector('[data-field="visible"]').addEventListener("change", (e) => {
      svc.visible = e.target.checked;
      save();
      logActivity(`${svc.visible ? "Showed" : "Hid"} service "${svc.en}" on the public site.`);
      renderServices();
    });
  }

  /* ---------------------------------------------------------------- */
  /* Projects                                                           */
  /* ---------------------------------------------------------------- */
  function renderProjects() {
    const tbody = document.getElementById("projects-tbody");
    if (!state.projects.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="a-empty">No projects yet — click "Add New Project" to create one.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = state.projects
      .map((p, i) => {
        const svc = state.services.find((s) => s.id === p.category);
        return `
        <tr data-project-row="${p.id}">
          <td><img class="thumb" src="${attr(p.images[0] || "")}" alt="" onerror="this.style.visibility='hidden'"></td>
          <td><b>${escapeHtml(p.en)}</b><br><span style="color:var(--label-muted); font-size:.78rem;">${escapeHtml(p.ar)}</span></td>
          <td>${escapeHtml(svc ? svc.en : "—")}</td>
          <td>${escapeHtml(p.location)} · ${escapeHtml(p.year)}</td>
          <td>
            <div class="actions">
              <button type="button" class="a-btn a-btn-ghost a-btn-sm" data-move-up="${i}" title="Move up">${ICON.up}</button>
              <button type="button" class="a-btn a-btn-ghost a-btn-sm" data-move-down="${i}" title="Move down">${ICON.down}</button>
              <button type="button" class="a-btn a-btn-ghost a-btn-sm" data-edit-project="${p.id}">Edit</button>
              <button type="button" class="a-btn a-btn-danger a-btn-sm" data-delete-project="${p.id}">${ICON.trash}</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll("[data-edit-project]").forEach((b) => b.addEventListener("click", () => openProjectModal(b.dataset.editProject)));
    tbody.querySelectorAll("[data-delete-project]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = state.projects.find((x) => x.id === b.dataset.deleteProject);
        if (!confirm(`Delete "${p.en}"? This can't be undone in this demo.`)) return;
        state.projects = state.projects.filter((x) => x.id !== b.dataset.deleteProject);
        save();
        logActivity(`Deleted project "${p.en}".`);
        renderProjects();
        renderDashboard();
        toast("Project deleted.");
      })
    );
    tbody.querySelectorAll("[data-move-up]").forEach((b) =>
      b.addEventListener("click", () => {
        const i = Number(b.dataset.moveUp);
        if (i === 0) return;
        [state.projects[i - 1], state.projects[i]] = [state.projects[i], state.projects[i - 1]];
        save();
        renderProjects();
      })
    );
    tbody.querySelectorAll("[data-move-down]").forEach((b) =>
      b.addEventListener("click", () => {
        const i = Number(b.dataset.moveDown);
        if (i === state.projects.length - 1) return;
        [state.projects[i + 1], state.projects[i]] = [state.projects[i], state.projects[i + 1]];
        save();
        renderProjects();
      })
    );
  }

  const projectModal = document.getElementById("project-modal");
  const projectForm = document.getElementById("project-form");
  let editingProjectId = null;
  let modalImages = [];

  function fillCategorySelect() {
    const sel = document.getElementById("pf-category");
    sel.innerHTML = state.services.map((s) => `<option value="${s.id}">${escapeHtml(s.en)}</option>`).join("");
  }

  function openProjectModal(id) {
    fillCategorySelect();
    editingProjectId = id || null;
    const p = id ? state.projects.find((x) => x.id === id) : null;
    document.getElementById("project-modal-title").textContent = p ? "Edit Project" : "Add New Project";
    document.getElementById("pf-ar").value = p ? p.ar : "";
    document.getElementById("pf-en").value = p ? p.en : "";
    document.getElementById("pf-ar-desc").value = p ? p.arDesc : "";
    document.getElementById("pf-en-desc").value = p ? p.enDesc : "";
    document.getElementById("pf-location").value = p ? p.location : "Private Residence";
    document.getElementById("pf-year").value = p ? p.year : "20XX";
    document.getElementById("pf-category").value = p ? p.category : state.services[0].id;
    modalImages = p ? [...p.images] : [];
    renderModalImages();
    projectModal.classList.add("is-open");
  }
  function closeProjectModal() {
    projectModal.classList.remove("is-open");
  }
  function renderModalImages() {
    document.getElementById("pf-images").innerHTML = modalImages.map((src, i) => imgThumb(src, i)).join("");
    document.getElementById("pf-images").querySelectorAll("[data-remove-img]").forEach((btn) =>
      btn.addEventListener("click", () => {
        modalImages.splice(Number(btn.dataset.removeImg), 1);
        renderModalImages();
      })
    );
  }
  document.getElementById("pf-add-url-btn").addEventListener("click", () => {
    const input = document.getElementById("pf-add-url");
    if (!input.value.trim()) return;
    modalImages.push(input.value.trim());
    input.value = "";
    renderModalImages();
  });
  document.getElementById("pf-add-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1.2 * 1024 * 1024) {
      toast("File too large for this browser-only demo — try under ~1MB or use an image URL.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      modalImages.push(reader.result);
      renderModalImages();
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("add-project-btn").addEventListener("click", () => openProjectModal(null));
  document.querySelectorAll("[data-close-project-modal]").forEach((b) => b.addEventListener("click", closeProjectModal));
  projectModal.addEventListener("click", (e) => { if (e.target === projectModal) closeProjectModal(); });

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      ar: document.getElementById("pf-ar").value.trim(),
      en: document.getElementById("pf-en").value.trim(),
      arDesc: document.getElementById("pf-ar-desc").value.trim(),
      enDesc: document.getElementById("pf-en-desc").value.trim(),
      location: document.getElementById("pf-location").value.trim(),
      year: document.getElementById("pf-year").value.trim(),
      category: document.getElementById("pf-category").value,
      images: modalImages,
    };
    if (!payload.en || !payload.ar) {
      toast("Please add both an Arabic and English title.");
      return;
    }
    if (editingProjectId) {
      Object.assign(state.projects.find((p) => p.id === editingProjectId), payload);
      logActivity(`Edited project "${payload.en}".`);
      toast("Project updated.");
    } else {
      state.projects.push({ id: "prj-" + Date.now(), ...payload });
      logActivity(`Added new project "${payload.en}".`);
      toast("Project added.");
    }
    save();
    closeProjectModal();
    renderProjects();
    renderDashboard();
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

  function renderReviews() {
    document.querySelectorAll(".a-tab[data-tab]").forEach((t) => {
      const count = state.reviews.filter((r) => r.status === t.dataset.tab).length;
      const badge = t.querySelector(".badge");
      if (badge) badge.textContent = count;
    });

    const list = document.getElementById("reviews-list");
    const filtered = state.reviews.filter((r) => r.status === activeReviewTab);
    if (!filtered.length) {
      list.innerHTML = `<div class="a-empty">No ${activeReviewTab} reviews.</div>`;
      return;
    }
    list.innerHTML = filtered
      .map(
        (r) => `
      <div class="a-review" data-review="${r.id}">
        <div class="a-review-head">
          <div class="who"><b>${escapeHtml(r.name)}</b><span>${escapeHtml(r.project)} · ${new Date(r.date).toLocaleDateString()}</span></div>
          <div class="a-review-stars">${stars(r.rating)}</div>
        </div>
        <p class="txt">${escapeHtml(r.text)}</p>
        <div class="a-review-foot">
          <span class="a-status-pill ${r.status}">${r.status}</span>
          ${r.status !== "approved" ? `<button type="button" class="a-btn a-btn-primary a-btn-sm" data-approve="${r.id}">Approve</button>` : ""}
          ${r.status !== "rejected" ? `<button type="button" class="a-btn a-btn-ghost a-btn-sm" data-reject="${r.id}">Reject</button>` : ""}
          ${r.status !== "pending" ? `<button type="button" class="a-btn a-btn-ghost a-btn-sm" data-pending="${r.id}">Move to Pending</button>` : ""}
          <button type="button" class="a-btn a-btn-danger a-btn-sm" data-delete-review="${r.id}">${ICON.trash}</button>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll("[data-approve]").forEach((b) => b.addEventListener("click", () => setReviewStatus(b.dataset.approve, "approved")));
    list.querySelectorAll("[data-reject]").forEach((b) => b.addEventListener("click", () => setReviewStatus(b.dataset.reject, "rejected")));
    list.querySelectorAll("[data-pending]").forEach((b) => b.addEventListener("click", () => setReviewStatus(b.dataset.pending, "pending")));
    list.querySelectorAll("[data-delete-review]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("Delete this review permanently?")) return;
        state.reviews = state.reviews.filter((r) => r.id !== b.dataset.deleteReview);
        save();
        logActivity("Deleted a review.");
        renderReviews();
        renderDashboard();
      })
    );
  }
  function setReviewStatus(id, status) {
    const r = state.reviews.find((x) => x.id === id);
    r.status = status;
    save();
    logActivity(`Marked review by "${r.name}" as ${status}.`);
    renderReviews();
    renderDashboard();
    toast(`Review ${status}.`);
  }

  // Simulated public submission form (mirrors what a real front-end form would send)
  let simRating = 5;
  const simStars = document.getElementById("sim-stars");
  simStars.innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<button type="button" data-star="${n}" style="opacity:${n <= simRating ? 1 : .3}">${ICON.star}</button>`)
    .join("");
  simStars.querySelectorAll("[data-star]").forEach((b) =>
    b.addEventListener("click", () => {
      simRating = Number(b.dataset.star);
      simStars.querySelectorAll("[data-star]").forEach((x) => (x.style.opacity = Number(x.dataset.star) <= simRating ? 1 : 0.3));
    })
  );
  document.getElementById("simulate-review-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("sim-name").value.trim();
    const project = document.getElementById("sim-project").value.trim();
    const text = document.getElementById("sim-text").value.trim();
    if (!name || !project || !text) { toast("Fill in all three fields to simulate a submission."); return; }
    state.reviews.push({ id: "rev-" + Date.now(), name, project, text, rating: simRating, status: "pending", date: new Date().toISOString() });
    save();
    logActivity(`Simulated a new public review submission from "${name}" (now pending).`);
    e.target.reset();
    simRating = 5;
    simStars.querySelectorAll("[data-star]").forEach((x) => (x.style.opacity = 1));
    activeReviewTab = "pending";
    document.querySelectorAll(".a-tab[data-tab]").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === "pending"));
    renderReviews();
    renderDashboard();
    toast("Simulated review submitted — see it in the Pending tab.");
  });

  /* ---------------------------------------------------------------- */
  /* Settings                                                           */
  /* ---------------------------------------------------------------- */
  function renderSettings() {
    const s = state.settings;
    document.getElementById("set-whatsapp").value = s.whatsapp;
    document.getElementById("set-phone").value = s.phone;
    document.getElementById("set-email").value = s.email;
    document.getElementById("set-address-ar").value = s.addressAr;
    document.getElementById("set-address-en").value = s.addressEn;
    document.getElementById("set-maps").value = s.mapsUrl;
    document.getElementById("set-lang").value = s.defaultLang;
    document.getElementById("set-instagram").value = s.instagram;
    document.getElementById("set-linkedin").value = s.linkedin;
    updateMapsPreview();
    updateWhatsappPreview();
  }
  function updateMapsPreview() {
    const url = document.getElementById("set-maps").value.trim();
    const btn = document.getElementById("maps-preview-btn");
    if (url) { btn.href = url; btn.removeAttribute("aria-disabled"); btn.classList.remove("a-btn-ghost"); btn.classList.add("a-btn-primary"); }
    else { btn.href = "#"; btn.setAttribute("aria-disabled", "true"); btn.classList.add("a-btn-ghost"); btn.classList.remove("a-btn-primary"); }
  }
  function updateWhatsappPreview() {
    const num = document.getElementById("set-whatsapp").value.trim().replace(/[^\d]/g, "");
    document.getElementById("whatsapp-preview").textContent = num ? `wa.me/${num}` : "—";
  }
  document.getElementById("set-maps").addEventListener("input", updateMapsPreview);
  document.getElementById("set-whatsapp").addEventListener("input", updateWhatsappPreview);

  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    state.settings = {
      whatsapp: document.getElementById("set-whatsapp").value.trim(),
      phone: document.getElementById("set-phone").value.trim(),
      email: document.getElementById("set-email").value.trim(),
      addressAr: document.getElementById("set-address-ar").value.trim(),
      addressEn: document.getElementById("set-address-en").value.trim(),
      mapsUrl: document.getElementById("set-maps").value.trim(),
      defaultLang: document.getElementById("set-lang").value,
      instagram: document.getElementById("set-instagram").value.trim(),
      linkedin: document.getElementById("set-linkedin").value.trim(),
    };
    save();
    logActivity("Updated website settings.");
    toast("Settings saved.");
  });

  document.getElementById("reset-demo-btn").addEventListener("click", () => {
    if (!confirm("Reset ALL demo data back to the original seed content? This cannot be undone.")) return;
    state = structuredCloneSafe(DEFAULT_DATA);
    save();
    renderAll();
    toast("Demo data reset.");
  });

  /* ---------------------------------------------------------------- */
  /* Helpers                                                            */
  /* ---------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function attr(str) {
    return escapeHtml(str);
  }

  function renderAll() {
    renderDashboard();
    renderServices();
    renderProjects();
    renderReviews();
    renderSettings();
  }
})();
