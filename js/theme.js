/* ============================================================
   theme.js — dark/light mode toggle with localStorage persistence
   ============================================================ */

(function () {
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  if (!themeToggle) return;

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  }

  // Initialize from stored preference (dark-first default)
  const stored = localStorage.getItem('theme');
  applyTheme(stored === 'light' ? 'light' : 'dark');

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
  });
})();
