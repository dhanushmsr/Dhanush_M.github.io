document.addEventListener("DOMContentLoaded", () => {

  // ── Nav toggle ───────────────────────────────────────────────
  const navMenu   = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const header    = document.getElementById("header");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("nav__menu--open");
      navToggle.classList.replace(
        isOpen ? "ri-menu-3-line" : "ri-close-line",
        isOpen ? "ri-close-line"  : "ri-menu-3-line"
      );
    });

    document.querySelectorAll(".nav__item").forEach(item => {
      item.addEventListener("click", () => {
        navMenu.classList.remove("nav__menu--open");
        navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
      });
    });
  }

  // ── Header scroll shadow ─────────────────────────────────────
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("header--scroll", window.scrollY > 40);
    });
  }

  // ── Project slider ───────────────────────────────────────────
  const slider   = document.querySelector(".project-slider");
  const leftBtn  = document.querySelector(".slider-btn.left");
  const rightBtn = document.querySelector(".slider-btn.right");
  const dots     = document.querySelectorAll(".dot");

  // How many cards should be visible at once per breakpoint
  function cardsInView() {
    const w = window.innerWidth;
    if (w >= 969) return 3;
    if (w >= 769) return 2;
    return 1;
  }

  // Set --card-w CSS variable so cards always fill the visible slot exactly
  function setCardWidth() {
    const containerW = slider.parentElement.clientWidth; // .slider-container width
    const gap        = parseFloat(getComputedStyle(slider).gap) || 16;
    const n          = cardsInView();
    const cardW      = Math.floor((containerW - gap * (n - 1)) / n);
    slider.parentElement.style.setProperty('--card-w', cardW + 'px');
  }

  function getCardWidth() {
    const card = slider && slider.querySelector(".project__content");
    if (!card) return 280;
    const gap = parseFloat(getComputedStyle(slider).gap) || 16;
    return card.getBoundingClientRect().width + gap;
  }

  function smoothScrollTo(targetLeft, duration) {
    const start    = slider.scrollLeft;
    const distance = targetLeft - start;
    const t0       = performance.now();

    function step(now) {
      const p    = Math.min((now - t0) / duration, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      slider.scrollLeft = start + distance * ease;
      if (p < 1) requestAnimationFrame(step);
      else updateDots();
    }
    requestAnimationFrame(step);
  }

  function updateDots() {
    const idx = Math.round(slider.scrollLeft / getCardWidth());
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  let autoTimer;

  function startAuto() {
    autoTimer = setInterval(() => {
      const atEnd = slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 5;
      smoothScrollTo(atEnd ? 0 : slider.scrollLeft + getCardWidth(), 500);
    }, 4000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    setCardWidth();
    window.addEventListener('resize', () => {
      setCardWidth();
      updateDots();
    });

    startAuto();
  }

  if (slider && leftBtn && rightBtn) {
    rightBtn.addEventListener("click", () => { smoothScrollTo(slider.scrollLeft + getCardWidth(), 400); resetAuto(); });
    leftBtn.addEventListener("click",  () => { smoothScrollTo(slider.scrollLeft - getCardWidth(), 400); resetAuto(); });

    dots.forEach((d, i) => d.addEventListener("click", () => { smoothScrollTo(getCardWidth() * i, 400); resetAuto(); }));

    slider.addEventListener("mousedown",  () => clearInterval(autoTimer));
    slider.addEventListener("touchstart", () => clearInterval(autoTimer), { passive: true });
    slider.addEventListener("mouseup",    resetAuto);
    slider.addEventListener("touchend",   resetAuto);
    slider.addEventListener("scroll",     updateDots);

    startAuto();
  }

  // ── ScrollReveal ─────────────────────────────────────────────
  // .project__content intentionally excluded — SR hides cards inside overflow sliders
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
  }

});