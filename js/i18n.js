/* ============================================================
   i18n.js — EN/DE language switcher, applies translations,
   syncs the desktop and mobile switcher instances, persists
   the choice to localStorage, and honors ?lang= URL param.
   ============================================================ */

(function () {
  const STORAGE_KEY = 'lang';
  const dict = window.translations;
  if (!dict) return;

  let currentLang = 'en';

  function applyTranslations(lang) {
    const t = dict[lang] || dict.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] != null) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (t[key] != null) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (t[key] != null) el.setAttribute('aria-label', t[key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (t[key] != null) el.setAttribute('title', t[key]);
    });

    // Keep expanded project-detail toggles in sync with the new language
    document.querySelectorAll('.project-toggle').forEach(btn => {
      const span = btn.querySelector('span');
      if (!span) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      span.textContent = isOpen ? t['project.hideDetails'] : t['project.viewDetails'];
    });

    if (t['meta.title']) document.title = t['meta.title'];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t['meta.description']) metaDesc.setAttribute('content', t['meta.description']);
    document.documentElement.setAttribute('lang', lang);
    currentLang = lang;
  }

  function setLang(lang, persist) {
    const isEN = lang === 'en';
    enBtns.forEach(b => {
      b.classList.toggle('active', isEN);
      b.setAttribute('aria-pressed', String(isEN));
    });
    deBtns.forEach(b => {
      b.classList.toggle('active', !isEN);
      b.setAttribute('aria-pressed', String(!isEN));
    });
    applyTranslations(lang);
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage unavailable */ }
    }
  }

  const enBtns = [document.getElementById('langEN'), document.getElementById('langEN-mobile')].filter(Boolean);
  const deBtns = [document.getElementById('langDE'), document.getElementById('langDE-mobile')].filter(Boolean);

  enBtns.forEach(b => b.addEventListener('click', () => setLang('en')));
  deBtns.forEach(b => b.addEventListener('click', () => setLang('de')));

  // Determine initial language:
  //   URL ?lang=  >  localStorage  >  English default
  let initialLang = 'en';
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang === 'en' || urlLang === 'de') {
    initialLang = urlLang;
    setLang(initialLang);
  } else {
    let storedLang = null;
    try { storedLang = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
    if (storedLang === 'en' || storedLang === 'de') {
      initialLang = storedLang;
    }
    setLang(initialLang, false);
  }

  // Expose currentLang for the form / project-toggle handlers
  window.__getCurrentLang = () => currentLang;
})();
