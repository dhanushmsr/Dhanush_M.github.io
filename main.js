document.addEventListener("DOMContentLoaded", () => {

  // 1. Mobile Navigation Toggle
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

  // 2. Header Scroll Effect
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("header--scroll", window.scrollY > 40);
    });
  }

  // 3. Project Slider Logic
  const slider   = document.querySelector(".project-slider");
  const leftBtn  = document.querySelector(".slider-btn.left");
  const rightBtn = document.querySelector(".slider-btn.right");
  const dots     = document.querySelectorAll(".dot");

  function cardsInView() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  }

  function setCardWidth() {
    if (!slider) return;
    const containerW = slider.parentElement.clientWidth - 100; // Account for padding
    const gap        = parseFloat(getComputedStyle(slider).gap) || 20;
    const n          = cardsInView();
    const cardW      = Math.floor((containerW - gap * (n - 1)) / n);
    slider.style.setProperty('--card-w', cardW + 'px');
  }

  function getCardWidth() {
    if (!slider) return 320;
    const card = slider.querySelector(".project__content");
    if (!card) return 320;
    const gap = parseFloat(getComputedStyle(slider).gap) || 20;
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
      if (p < 1) {
          requestAnimationFrame(step);
      } else {
          updateDots();
      }
    }
    requestAnimationFrame(step);
  }

  function updateDots() {
    if(!slider || !dots.length) return;
    const idx = Math.round(slider.scrollLeft / getCardWidth());
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  let autoTimer;

  function startAuto() {
    autoTimer = setInterval(() => {
      if(!slider) return;
      const atEnd = slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10;
      smoothScrollTo(atEnd ? 0 : slider.scrollLeft + getCardWidth(), 500);
    }, 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (slider && leftBtn && rightBtn) {
    setCardWidth();
    window.addEventListener('resize', setCardWidth);

    rightBtn.addEventListener("click", () => { 
        smoothScrollTo(slider.scrollLeft + getCardWidth(), 400); 
        resetAuto(); 
    });
    
    leftBtn.addEventListener("click",  () => { 
        smoothScrollTo(slider.scrollLeft - getCardWidth(), 400); 
        resetAuto(); 
    });

    dots.forEach((d, i) => {
        d.addEventListener("click", () => { 
            smoothScrollTo(getCardWidth() * i, 400); 
            resetAuto(); 
        });
    });

    slider.addEventListener("mouseenter",  () => clearInterval(autoTimer));
    slider.addEventListener("mouseleave", resetAuto);
    slider.addEventListener("touchstart", () => clearInterval(autoTimer), { passive: true });
    slider.addEventListener("touchend",   resetAuto);
    slider.addEventListener("scroll",     updateDots, { passive: true });

    startAuto();
  }

  // 4. ScrollReveal Animation (ensure script is loaded in HTML)
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      origin: "top",
      distance: "40px",
      duration: 1500,
      delay: 200,
      reset: false, // Set to false so it doesn't repeatedly animate on scroll up/down
    });

    sr.reveal(".hero__content, .section__header");
    sr.reveal(".hero__img",              { origin: "bottom", delay: 400 });
    sr.reveal(".about__content",         { origin: "left" });
    sr.reveal(".qualification__item",    { interval: 150 });
    sr.reveal(".skills__content",        { interval: 100 });
    sr.reveal(".contact__wrapper",       { origin: "bottom" });
  }

});
