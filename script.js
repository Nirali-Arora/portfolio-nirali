/* ================================
   Nirali Arora — Portfolio JS
   ================================ */

(function () {
  'use strict';

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav background ---------- */
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('visible', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- To-top button ---------- */
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Active nav link highlight on scroll ---------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');
  const setActive = () => {
    const scrollPos = window.scrollY + 120;
    let active = '';
    sections.forEach((s) => {
      if (scrollPos >= s.offsetTop) active = s.id;
    });
    navAnchors.forEach((a) => {
      const href = a.getAttribute('href').slice(1);
      a.style.color = href === active && !a.classList.contains('nav-cta')
        ? 'var(--accent-deep)'
        : '';
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  // Preview/screenshot mode: show everything immediately + remove min-height
  if (location.search.includes('preview=1')) {
    revealEls.forEach((el) => el.classList.add('visible'));
    const style = document.createElement('style');
    style.textContent = '.hero{min-height:auto !important;padding-bottom:120px !important}.scroll-cue{display:none !important}';
    document.head.appendChild(style);
    return;
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Stat number count-up ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.floor(eased * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => countIO.observe(c));
  }

  /* ---------- Typing effect in hero ---------- */
  const typingEl = document.getElementById('typing');
  if (typingEl) {
    const phrases = [
      'Data Engineer',
      'Microsoft Fabric Specialist',
      'Power BI Storyteller',
      'PySpark Pipeline Builder',
      'Cloud Data Architect',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseUntil = 0;

    const tick = () => {
      const now = Date.now();
      if (now < pauseUntil) {
        requestAnimationFrame(tick);
        return;
      }
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          pauseUntil = now + 1800;
        }
      } else {
        charIdx--;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          pauseUntil = now + 300;
        }
      }
      setTimeout(() => requestAnimationFrame(tick), deleting ? 50 : 90);
    };
    setTimeout(tick, 600);
  }

  /* ---------- Smooth scroll for in-page anchors (fallback for older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = anchor.getAttribute('href');
      if (target === '#') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Parallax tilt on hero visual ---------- */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.matchMedia('(hover: hover)').matches) {
    const orbit = heroVisual.querySelector('.orbit');
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orbit.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      orbit.style.transform = '';
    });
  }

  /* ---------- Subtle parallax on blobs ---------- */
  const blobs = document.querySelectorAll('.blob');
  if (window.matchMedia('(hover: hover)').matches && blobs.length) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });
    const animate = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;
      blobs.forEach((blob, i) => {
        const depth = (i + 1) * 8;
        blob.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }
})();
