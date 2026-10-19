/* =========================================================
   Ali Iqrash — portfolio interactions
   Progressive enhancement: everything works without JS,
   these only add polish.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Theme ---------- */
  var themeBtn = $('#themeBtn');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
    }
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#fbfcfe' : '#070b12');
    if (themeBtn) {
      var next = theme === 'light' ? 'dark' : 'light';
      themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
    });
  }

  /* ---------- Mobile navigation ---------- */
  var menuBtn = $('#menuBtn');
  var nav = $('#nav');

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeMenu(); else openMenu();
    });

    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        menuBtn.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) closeMenu();
    });
  }

  /* ---------- Header state ---------- */
  var header = $('#siteHeader');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Experience accordions ---------- */
  var jobs = $$('.job');
  var desktopQuery = window.matchMedia('(min-width: 900px)');

  if (jobs.length && desktopQuery.matches) {
    jobs.forEach(function (job) { job.open = true; });
  }

  var handleDesktop = function (e) {
    if (e.matches) {
      jobs.forEach(function (job) { job.open = true; });
    } else {
      jobs.forEach(function (job, i) { job.open = i === 0; });
    }
  };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', handleDesktop);

  /* ---------- Scroll reveal ---------- */
  var revealEls = $$('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    /* Safety net: never leave content permanently hidden. */
    window.setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }, 4000);
  }

  /* ---------- Active section in navigation ---------- */
  var sectionIds = ['about', 'skills', 'experience', 'projects', 'education', 'faq', 'contact'];
  var navLinks = $$('.nav > a');
  var spySections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setCurrent(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-current', match);
      if (match) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && spySections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    spySections.forEach(function (section) { spy.observe(section); });

    window.addEventListener('scroll', function () {
      if (window.scrollY < 120) setCurrent('');
    }, { passive: true });
  }

  /* ---------- Sticky mobile bar ---------- */
  var mobileBar = $('.mobile-bar');
  var contact = $('#contact');
  var nearContact = false;

  function syncBar() {
    if (!mobileBar) return;
    var pastHero = window.scrollY > 320;
    mobileBar.classList.toggle('is-visible', pastHero && !nearContact);
  }

  if (mobileBar && contact && 'IntersectionObserver' in window) {
    var contactObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        nearContact = entry.isIntersecting;
        syncBar();
      });
    }, { threshold: 0.2 });
    contactObserver.observe(contact);
  }

  window.addEventListener('scroll', syncBar, { passive: true });
  syncBar();

  /* ---------- Print buttons ---------- */
  $$('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });

  /* ---------- Copy email ---------- */
  var copyBtn = $('#copyEmail');
  if (copyBtn) {
    var email = copyBtn.getAttribute('data-email') || 'Aliiqrash01@gmail.com';
    var originalLabel = copyBtn.textContent;

    var legacyCopy = function () {
      var input = document.createElement('textarea');
      input.value = email;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(input);
      return ok;
    };

    copyBtn.addEventListener('click', function () {
      var done = function (ok) {
        copyBtn.textContent = ok ? 'Copied ✓' : 'Copy failed';
        window.setTimeout(function () { copyBtn.textContent = originalLabel; }, 1900);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(legacyCopy()); });
      } else {
        done(legacyCopy());
      }
    });
  }

  /* ---------- Year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
