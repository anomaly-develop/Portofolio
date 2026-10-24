/* ==========================================================================
   MAIN.JS — Vanilla JS, no modules, works on file://
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================================================
  // REDUCED MOTION CHECK
  // ==========================================================================
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prefersFinePointer = window.matchMedia('(pointer: fine)').matches;

  // ==========================================================================
  // INTRO OVERLAY
  // ==========================================================================
  var intro = document.querySelector('.intro');
  if (intro) {
    var skipIntro = prefersReducedMotion || navigator.webdriver;
    try {
      skipIntro = skipIntro || sessionStorage.getItem('introSeen') === '1';
      if (new URLSearchParams(window.location.search).get('nointro') === '1') { skipIntro = true; }
    } catch (e) {}
    if (skipIntro) {
      intro.remove();
    } else {
      document.body.classList.add('intro-active');
      window.setTimeout(function() {
        intro.classList.add('is-done');
        document.body.classList.remove('intro-active');
        try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
      }, 1500);
      window.setTimeout(function() { intro.remove(); }, 2600);
    }
  }

  // ==========================================================================
  // SCROLL PROGRESS
  // ==========================================================================
  var scrollProgress = document.querySelector('.scroll-progress span');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    scrollProgress.style.transform = 'scaleX(' + p + ')';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();

  // ==========================================================================
  // DYNAMIC COPYRIGHT YEAR
  // ==========================================================================
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ==========================================================================
  // NAV SCROLL STATE
  // ==========================================================================
  var header = document.querySelector('.site-header');
  var scrollThreshold = 80;
  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==========================================================================
  // MOBILE MENU WITH FOCUS TRAP + ESC
  // ==========================================================================
  var navToggle = document.querySelector('.nav-toggle');
  var navPanel = document.querySelector('.nav-panel');
  var navLinks = navPanel ? navPanel.querySelectorAll('a') : [];
  var lastFocusedElement = null;
  var focusableElements = [];

  function openMenu() {
    if (!navPanel) return;
    lastFocusedElement = document.activeElement;
    navToggle.setAttribute('aria-expanded', 'true');
    navPanel.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateFocusableElements();
    if (focusableElements.length) { focusableElements[0].focus(); }
    document.addEventListener('keydown', onKeyDown);
  }

  function closeMenu() {
    if (!navPanel) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navPanel.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocusedElement) { lastFocusedElement.focus(); }
  }

  function updateFocusableElements() {
    focusableElements = Array.from(navPanel.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )).filter(function(el) { return el.offsetParent !== null; });
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    if (!focusableElements.length) return;
    var first = focusableElements[0];
    var last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function() {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
    navLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // ==========================================================================
  // INTERSECTION OBSERVER REVEALS
  // ==========================================================================
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length && !prefersReducedMotion) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, index * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(function(el) { observer.observe(el); });
  } else {
    revealElements.forEach(function(el) { el.classList.add('visible'); });
  }

  // ==========================================================================
  // HERO PARALLAX (rAF)
  // ==========================================================================
  var heroOrnament = document.querySelector('.hero::before');
  var heroPortrait = document.querySelector('.hero-portrait');
  var parallaxElements = [];
  if (heroPortrait) parallaxElements.push({ el: heroPortrait, speed: 0.04 });
  if (!prefersReducedMotion && parallaxElements.length) {
    var ticking = false;
    function onParallaxScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrollY = window.scrollY;
          parallaxElements.forEach(function(item) {
            item.el.style.transform = 'translate3d(0, ' + (scrollY * item.speed) + 'px, 0)';
          });
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
  }

  // ==========================================================================
  // PROJECT CAROUSEL
  // ==========================================================================
  var track = document.querySelector('.projects-track');
  var cards = track ? track.querySelectorAll('.project-card') : [];
  var prevBtn = document.querySelector('.project-btn--prev');
  var nextBtn = document.querySelector('.project-btn--next');
  var progressBar = document.querySelector('.project-progress-bar');
  var progressEl = document.querySelector('.project-progress');
  var controls = document.querySelector('.project-controls');
  var currentIndex = 0;

  function cardLeft(index) {
    return cards[index].getBoundingClientRect().left
      - track.getBoundingClientRect().left
      + track.scrollLeft;
  }

  function nearestIndex() {
    var pos = track.scrollLeft;
    var best = 0;
    var bestDist = Infinity;
    for (var i = 0; i < cards.length; i++) {
      var d = Math.abs(cardLeft(i) - pos);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  function updateCarousel() {
    if (!track || !cards.length) return;
    var maxScroll = track.scrollWidth - track.clientWidth;
    var progress = maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0;
    if (progressBar) { progressBar.style.width = progress + '%'; }
    if (progressEl) { progressEl.setAttribute('aria-valuenow', String(Math.round(progress))); }
    currentIndex = nearestIndex();
    if (prevBtn) { prevBtn.disabled = track.scrollLeft <= 4; }
    if (nextBtn) { nextBtn.disabled = track.scrollLeft >= maxScroll - 4; }
    if (controls) { controls.classList.toggle('visible', maxScroll > 4); }
  }

  function scrollToCard(index) {
    if (!track || !cards[index]) return;
    track.scrollTo({
      left: cardLeft(index),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  if (track && cards.length) {
    // Initial measure after layout
    setTimeout(updateCarousel, 0);
    window.addEventListener('resize', updateCarousel);
    track.addEventListener('scroll', updateCarousel, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) { scrollToCard(currentIndex - 1); }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (currentIndex < cards.length - 1) { scrollToCard(currentIndex + 1); }
      });
    }
    // Keyboard navigation
    track.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault(); scrollToCard(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
        e.preventDefault(); scrollToCard(currentIndex + 1);
      }
    });
    updateCarousel();
  }

  // ==========================================================================
  // CURSOR DOT (pointer:fine only)
  // ==========================================================================
  var cursorDot = null;
  var cursorRing = null;
  var cursorTargetX = 0;
  var cursorTargetY = 0;
  var cursorCurrentX = 0;
  var cursorCurrentY = 0;
  var cursorAnimationId = null;

  if (prefersFinePointer && !prefersReducedMotion) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    document.addEventListener('mousemove', function(e) {
      cursorTargetX = e.clientX;
      cursorTargetY = e.clientY;
      cursorDot.classList.add('visible');
      cursorRing.classList.add('visible');
    });

    document.addEventListener('mouseleave', function() {
      cursorDot.classList.remove('visible');
      cursorRing.classList.remove('visible');
    });

    var linkElements = document.querySelectorAll('[data-cursor="link"], a, button, .btn, .project-btn, .nav-toggle, .project-card');
    linkElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursorDot.classList.add('enlarged');
        cursorRing.classList.add('enlarged');
      });
      el.addEventListener('mouseleave', function() {
        cursorDot.classList.remove('enlarged');
        cursorRing.classList.remove('enlarged');
      });
    });

    function animateCursor() {
      cursorCurrentX += (cursorTargetX - cursorCurrentX) * 0.2;
      cursorCurrentY += (cursorTargetY - cursorCurrentY) * 0.2;
      cursorDot.style.transform = 'translate(' + (cursorCurrentX - 3) + 'px, ' + (cursorCurrentY - 3) + 'px)';
      cursorRing.style.transform = 'translate(' + (cursorCurrentX - 14) + 'px, ' + (cursorCurrentY - 14) + 'px)';
      cursorAnimationId = requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ==========================================================================
  // MARQUEE PAUSE ON HOVER (already in CSS, but ensure track exists)
  // ==========================================================================
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', function() {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', function() {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  // ==========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS (fallback for browsers without scroll-behavior)
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 72;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        if (!target.hasAttribute('tabindex')) { target.setAttribute('tabindex', '-1'); }
        target.focus({ preventScroll: true });
      }
    });
  });

})();