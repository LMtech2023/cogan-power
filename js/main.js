(function () {
  "use strict";

  var NAV_BREAKPOINT = 1200;

  var burger = document.querySelector(".header__burger");
  var mobileNav = document.querySelector(".mobile-nav");
  var overlay = document.querySelector(".nav-overlay");
  var closeBtn = document.querySelector(".mobile-nav__close");
  var navLinks = document.querySelectorAll(".mobile-nav__link, .mobile-nav__cta");
  var chromeEls = document.querySelectorAll("[data-site-chrome]");

  function isDesktop() {
    return window.matchMedia("(min-width: " + (NAV_BREAKPOINT + 1) + "px)").matches;
  }

  function setMenuOpen(open) {
    if (!burger || !mobileNav || !overlay) return;

    burger.classList.toggle("is-active", open);
    mobileNav.classList.toggle("is-open", open);
    overlay.classList.toggle("is-visible", open);
    document.body.classList.toggle("is-nav-open", open);

    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function toggleMenu() {
    var isOpen = mobileNav && mobileNav.classList.contains("is-open");
    setMenuOpen(!isOpen);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (isDesktop()) {
      closeMenu();
    }
  });

  function updateChromeHeight() {
    var total = 0;

    chromeEls.forEach(function (el) {
      if (!el || !(el instanceof HTMLElement)) return;
      var style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return;
      total += el.getBoundingClientRect().height;
    });

    document.documentElement.style.setProperty(
      "--site-chrome-height",
      Math.ceil(total) + "px"
    );
  }

  function observeChrome() {
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateChromeHeight);
      updateChromeHeight();
      return;
    }

    var observer = new ResizeObserver(function () {
      updateChromeHeight();
    });

    chromeEls.forEach(function (el) {
      observer.observe(el);
    });

    window.addEventListener("resize", updateChromeHeight);
    updateChromeHeight();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeChrome);
  } else {
    observeChrome();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateChromeHeight);
  }
})();
