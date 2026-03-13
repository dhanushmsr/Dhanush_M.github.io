document.addEventListener("DOMContentLoaded", () => {

  // ── Nav toggle ──────────────────────────────────────────────
  const navMenu   = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navItems  = document.querySelectorAll(".nav__item");
  const header    = document.getElementById("header");

  function closeMenu() {
    navMenu.classList.remove("nav__menu--open");
    navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("nav__menu--open");
      navToggle.classList.replace(
        isOpen ? "ri-menu-3-line" : "ri-close-line",
        isOpen ? "ri-close-line" : "ri-menu-3-line"
      );
    });
  }

  navItems.forEach(item => item.addEventListener("click", closeMenu));

  // ── Header scroll shadow ─────────────────────────────────────
  window.addEventListener("scroll", () => {
    header.classList.toggle("header--scroll", window.scrollY > 40);
  });

  // ── Project slider ───────────────────────────────────────────
  const slider   = document.querySelector(".project-slider");
  const leftBtn  = document.querySelector(".slider-btn.left");
  const rightBtn = document.querySelector(".slider-btn.right");
  const dots     = document.querySelectorAll(".dot");

  function getCardWidth() {
    const card = slider && slider.querySelector(".project__content");
    if (!card) return 345;
    const gap = parseFloat(getComputedStyle(slider).gap) || 25;
    return card.offsetWidth + gap;
  }

  // Pure JS smooth scroll — no dependency on CSS scroll-behavior
  function smoothScrollTo(targetLeft, duration) {
    const start     = slider.scrollLeft;
    const distance  = targetLeft - start;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-in-out
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      slider.scrollLeft = start + distance * ease;
      if (progress < 1) requestAnimationFrame(step);
      else updateDots();
    }
    requestAnimationFrame(step);
  }

  function updateDots() {
    const index = Math.round(slider.scrollLeft / getCardWidth());
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  // Auto-scroll every 4s
  let autoTimer;

  function startAuto() {
    autoTimer = setInterval(() => {
      const atEnd = slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10;
      smoothScrollTo(atEnd ? 0 : slider.scrollLeft + getCardWidth(), 500);
    }, 4000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (slider && leftBtn && rightBtn) {
    rightBtn.addEventListener("click", () => {
      smoothScrollTo(slider.scrollLeft + getCardWidth(), 400);
      resetAuto();
    });

    leftBtn.addEventListener("click", () => {
      smoothScrollTo(slider.scrollLeft - getCardWidth(), 400);
      resetAuto();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        smoothScrollTo(getCardWidth() * i, 400);
        resetAuto();
      });
    });

    slider.addEventListener("mousedown", () => clearInterval(autoTimer));
    slider.addEventListener("touchstart", () => clearInterval(autoTimer));
    slider.addEventListener("mouseup",    resetAuto);
    slider.addEventListener("touchend",   resetAuto);

    slider.addEventListener("scroll", updateDots);

    startAuto();
  }

  // ── ScrollReveal (no project cards — they're inside overflow container) ──
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      origin: "top",
      distance: "60px",
      duration: 2000,
      delay: 300,
      reset: false,
    });

    sr.reveal(".hero__content, .section__header");
    sr.reveal(".hero__img",              { origin: "bottom", delay: 600 });
    sr.reveal(".about__content",         { origin: "left" });
    sr.reveal(".qualification__wrapper", { origin: "left", interval: 100 });
    sr.reveal(".skills__content",        { interval: 100 });
    sr.reveal(".service__card",          { interval: 100 });
    sr.reveal(".contact__content",       { origin: "bottom" });
    sr.reveal(".contact__btn",           { origin: "right" });
    // NOTE: .project__content is intentionally excluded — SR breaks overflow sliders
  }

});