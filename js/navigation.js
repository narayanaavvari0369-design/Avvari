/* ============================================================
   navigation.js — header scroll state, mobile menu, scroll-spy
   ============================================================ */

(function () {
  /* ---- Header scroll state (floating pill nav) ---- */
  const header = document.getElementById('siteHeader');
  if (header) {
    let scrollTicking = false;
    const applyScrollState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
      scrollTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(applyScrollState);
        scrollTicking = true;
      }
    }, { passive: true });
    applyScrollState();
  }

  /* ---- Mobile menu ---- */
  const navtoggle = document.getElementById('navtoggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const siteMain = document.querySelector('main');
  const siteFooter = document.querySelector('footer');

  if (navtoggle && mobileMenu) {
    function openMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.removeAttribute('aria-hidden');
      mobileMenu.removeAttribute('inert');
      navtoggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      header && header.setAttribute('inert', '');
      siteMain && siteMain.setAttribute('inert', '');
      siteFooter && siteFooter.setAttribute('inert', '');
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    function closeMenu(returnFocus) {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.setAttribute('inert', '');
      navtoggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      header && header.removeAttribute('inert');
      siteMain && siteMain.removeAttribute('inert');
      siteFooter && siteFooter.removeAttribute('inert');
      if (returnFocus) navtoggle.focus();
    }

    navtoggle.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu(true) : openMenu();
    });

    if (mobileClose) mobileClose.addEventListener('click', () => closeMenu(true));

    mobileMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => closeMenu(false))
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu(true);
    });
  }

  /* ---- Scroll-spy for active nav link ---- */
  const sectionIds = ['about', 'experience', 'projects', 'skills', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = document.querySelectorAll('#navlinks a');

  if (sections.length && navAnchors.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`#navlinks a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
          });
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => spyObserver.observe(s));
  }

  /* ---- Placeholder links — stop "#" from scrolling to top ---- */
  document.querySelectorAll('a.placeholder-link').forEach(link => {
    link.addEventListener('click', (e) => e.preventDefault());
  });
})();
