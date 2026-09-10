/* ============================================================
   animations.js — scroll reveal, project filter & expand,
   contact form, scroll progress bar
   ============================================================ */

(function () {
  /* ---- Scroll progress indicator ---- */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---- Scroll-reveal animation ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-group');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---- Project — expandable technical details ---- */
  document.querySelectorAll('.project-toggle').forEach((btn, i) => {
    const detail = btn.nextElementSibling;
    if (!detail) return;
    detail.id = detail.id || `project-detail-${i}`;
    btn.setAttribute('aria-controls', detail.id);

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const t = (window.translations || {})[window.__getCurrentLang ? window.__getCurrentLang() : 'en'] || {};

      if (isOpen) {
        // Collapse
        detail.style.maxHeight = detail.scrollHeight + 'px';
        requestAnimationFrame(() => { detail.style.maxHeight = '0px'; });
        btn.setAttribute('aria-expanded', 'false');
        const span = btn.querySelector('span');
        if (span) span.textContent = t['project.viewDetails'] || 'View technical details';
      } else {
        // Expand
        detail.style.maxHeight = detail.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
        const span = btn.querySelector('span');
        if (span) span.textContent = t['project.hideDetails'] || 'Hide technical details';
      }
    });
  });

  // Keep open project-detail max-height accurate on resize
  let resizeTicking = false;
  window.addEventListener('resize', () => {
    if (resizeTicking) return;
    resizeTicking = true;
    requestAnimationFrame(() => {
      document.querySelectorAll('.project-toggle[aria-expanded="true"]').forEach(btn => {
        const detail = btn.nextElementSibling;
        if (detail) detail.style.maxHeight = detail.scrollHeight + 'px';
      });
      resizeTicking = false;
    });
  }, { passive: true });

  /* ---- Project — technology filter ---- */
  const filterChips = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.project[data-tags]');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');
      const filter = chip.getAttribute('data-filter');
      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags');
        const match = filter === 'all' || (tags && tags.includes(filter));
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---- Contact form — opens visitor's email client ---- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:avvarinarayana97@gmail.com?subject=${subject}&body=${body}`;
      const t = (window.translations || {})[window.__getCurrentLang ? window.__getCurrentLang() : 'en'] || {};
      if (status) status.textContent = t['form.statusMessage'] || 'Opening your email client…';
    });
  }
})();
