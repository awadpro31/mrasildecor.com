/* ==========================================================================
   MRASIL — shared front-end behaviour
   Vanilla JS, no build step. Every effect below checks for its own
   elements before running, and every motion effect respects
   prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------------------------------------------------------- */
  /* Loader                                                             */
  /* ---------------------------------------------------------------- */
  const loader = document.getElementById("loader");
  if (loader) {
    const heroImg = document.querySelector(".hero-media img, .page-hero .hero-media img");
    const finishLoad = () => {
      requestAnimationFrame(() => loader.classList.add("is-ready"));
      const hideAfter = reduceMotion ? 250 : 1150;
      setTimeout(() => {
        loader.classList.add("is-hidden");
        document.querySelectorAll(".hero, .page-hero").forEach((h) => h.classList.add("is-ready"));
      }, hideAfter);
    };
    if (heroImg && !heroImg.complete) {
      heroImg.addEventListener("load", finishLoad, { once: true });
      heroImg.addEventListener("error", finishLoad, { once: true });
      // safety net in case the image stalls
      setTimeout(finishLoad, 2200);
    } else {
      setTimeout(finishLoad, 120);
    }
  } else {
    document.querySelectorAll(".hero, .page-hero").forEach((h) => h.classList.add("is-ready"));
  }

  /* Fade the hero media in once its image has actually loaded */
  document.querySelectorAll(".hero-media img").forEach((im) => {
    const wrap = im.closest(".hero-media");
    const show = () => wrap && wrap.classList.add("is-loaded");
    if (im.complete) show();
    else im.addEventListener("load", show, { once: true });
  });

  /* ---------------------------------------------------------------- */
  /* Header: scrolled state + active link                               */
  /* ---------------------------------------------------------------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(`a[data-nav="${page}"]`).forEach((a) => a.classList.add("is-active"));
  }

  /* ---------------------------------------------------------------- */
  /* Mobile menu                                                        */
  /* ---------------------------------------------------------------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    menuToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------------------------------------------------------------- */
  /* Ambient music control                                              */
  /* Looks for #ambient-audio + [data-music-toggle]. If no audio file    */
  /* has been added yet at assets/audio/ambient.mp3, it fails silently   */
  /* and tells the visitor once via a small toast instead of throwing.   */
  /* ---------------------------------------------------------------- */
  const audio = document.getElementById("ambient-audio");
  const musicBtns = document.querySelectorAll("[data-music-toggle]");
  if (audio && musicBtns.length) {
    audio.volume = 0.12;
    let armed = false;
    let missingTrackWarned = false;

    const setUI = (playing) => {
      musicBtns.forEach((b) => {
        b.classList.toggle("is-muted", !playing);
        b.setAttribute("aria-pressed", String(playing));
        b.setAttribute("aria-label", playing ? "Pause ambient sound" : "Play ambient sound");
      });
    };
    setUI(false);

    audio.addEventListener("error", () => {
      if (missingTrackWarned) return;
      missingTrackWarned = true;
      showToast("Ambient track not added yet — drop a file at assets/audio/ambient.mp3");
      setUI(false);
    });

    musicBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        armed = true;
        if (audio.paused) {
          audio.play().then(() => setUI(true)).catch(() => setUI(false));
        } else {
          audio.pause();
          setUI(false);
        }
      });
    });

    // Try a gentle autoplay once, respecting browser policy; if blocked,
    // the user's first click on the control (above) starts it instead.
    const tryAutoplay = () => {
      if (armed) return;
      audio.play().then(() => setUI(true)).catch(() => setUI(false));
    };
    setTimeout(tryAutoplay, 1600);
  }

  /* Small toast helper, reused by a couple of features */
  let toastTimer = null;
  function showToast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3600);
  }
  window.mrasilToast = showToast;

  /* ---------------------------------------------------------------- */
  /* Scroll reveals                                                     */
  /* ---------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-mask");
  if (revealTargets.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
      );
      revealTargets.forEach((el) => io.observe(el));
    }
  }

  /* ---------------------------------------------------------------- */
  /* Animated counters (stat blocks)                                    */
  /* Only counts up if data-target is a real positive number — a "—"    */
  /* placeholder (no data-target, or 0) is left as static, honest text. */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-target") || "0");
    if (!target || target <= 0) return; // placeholder stat — leave as-is
    const suffix = el.getAttribute("data-suffix") || "";
    const run = () => {
      if (reduceMotion) { el.textContent = target + suffix; return; }
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.6 });
      io.observe(el);
    } else run();
  });

  /* ---------------------------------------------------------------- */
  /* Tilt cards (subtle pseudo-3D) — fine pointers only                 */
  /* ---------------------------------------------------------------- */
  if (isFinePointer && !reduceMotion) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      const strength = 6;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--rx", `${(0.5 - py) * strength}deg`);
        card.style.setProperty("--ry", `${(px - 0.5) * strength}deg`);
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--rx", `0deg`);
        card.style.setProperty("--ry", `0deg`);
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Hero parallax (mouse-driven depth) — fine pointers only            */
  /* ---------------------------------------------------------------- */
  const heroMedia = document.querySelector(".hero .hero-media img, .page-hero .hero-media img");
  if (heroMedia && isFinePointer && !reduceMotion) {
    const heroEl = heroMedia.closest(".hero, .page-hero");
    heroEl.addEventListener("mousemove", (e) => {
      const r = heroEl.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroMedia.style.translate = `${px * -14}px ${py * -10}px`;
    });
    heroEl.addEventListener("mouseleave", () => { heroMedia.style.translate = "0 0"; });
  }

  /* ---------------------------------------------------------------- */
  /* Custom cursor (decorative, desktop only)                           */
  /* ---------------------------------------------------------------- */
  if (isFinePointer && !reduceMotion) {
    document.documentElement.classList.add("has-fine-pointer");
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    let rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      tx = e.clientX; ty = e.clientY;
    });
    (function loop() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button, .tilt-card, .masonry figure").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* ---------------------------------------------------------------- */
  /* Footer year                                                        */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------------------------------------------------------------- */
  /* Contact form — REAL submission to the API (POST /api/public/contact). */
  /* ---------------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const success = document.getElementById("form-success");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const wrap = field.closest(".field");
        const ok = field.type === "email"
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
          : field.value.trim().length > 0;
        if (wrap) wrap.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      const lang = (window.mrasilI18n && window.mrasilI18n.getLang()) || "ar";
      const dict = (window.mrasilI18n && window.mrasilI18n.dict && window.mrasilI18n.dict[lang]) || {};
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch("/api/public/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            project_type: form.projectType.value,
            budget: form.budget.value,
            message: form.message.value.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send.");
        if (success) {
          success.classList.add("is-visible");
          success.textContent = dict["form.success"] || "Thank you — your message has been sent. We'll be in touch soon.";
        }
        form.reset();
      } catch (err) {
        if (success) {
          success.classList.add("is-visible");
          success.style.borderColor = "#c57165";
          success.style.color = "#d38a7f";
          success.textContent = err.message || "Something went wrong — please try again or contact us on WhatsApp.";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Public review-submission form — REAL submission to the API         */
  /* (POST /api/public/reviews). Always lands as "pending" server-side; */
  /* it only appears on the site once an admin approves it.             */
  /* ---------------------------------------------------------------- */
  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    const reviewSuccess = document.getElementById("review-form-success");
    const starWrap = document.getElementById("rf-stars");
    const ratingField = starWrap ? starWrap.closest(".field") : null;
    let rating = 0;

    if (starWrap) {
      starWrap.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          rating = Number(btn.dataset.star);
          starWrap.querySelectorAll("button").forEach((b) => {
            b.classList.toggle("is-filled", Number(b.dataset.star) <= rating);
          });
          if (ratingField) ratingField.classList.remove("has-error");
        });
      });
    }

    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      reviewForm.querySelectorAll("[required]").forEach((field) => {
        const wrap = field.closest(".field");
        const ok = field.value.trim().length > 0;
        if (wrap) wrap.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });
      if (rating === 0) {
        if (ratingField) ratingField.classList.add("has-error");
        valid = false;
      }
      if (!valid) return;

      const lang = (window.mrasilI18n && window.mrasilI18n.getLang()) || "ar";
      const dict = (window.mrasilI18n && window.mrasilI18n.dict && window.mrasilI18n.dict[lang]) || {};
      const submitBtn = reviewForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch("/api/public/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: reviewForm.name.value.trim(),
            project: reviewForm.project.value.trim(),
            rating,
            review: reviewForm.review.value.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to submit.");
        if (reviewSuccess) {
          reviewSuccess.classList.add("is-visible");
          reviewSuccess.textContent = dict["reviewForm.success"] || "Thank you — your review has been received and will be checked before publishing.";
        }
        reviewForm.reset();
        rating = 0;
        if (starWrap) starWrap.querySelectorAll("button").forEach((b) => b.classList.remove("is-filled"));
      } catch (err) {
        if (reviewSuccess) {
          reviewSuccess.classList.add("is-visible");
          reviewSuccess.style.borderColor = "#c57165";
          reviewSuccess.style.color = "#d38a7f";
          reviewSuccess.textContent = err.message || "Something went wrong — please try again.";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
