/* ============================================================
   hero-interaction.js — cursor-reactive dash field (hero only)
   Isolated module. Only runs on fine-pointer, non-reduced-motion
   devices. Touch support included.
   ============================================================ */

(function () {
  const field = document.querySelector('.hero .dash-field');
  if (!field) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Coarser grid for touch devices — fewer DOM nodes
  const CELL_W = finePointer ? 30 : 46;
  const CELL_H = finePointer ? 34 : 50;
  const RADIUS = 170;
  const RADIUS_SQ = RADIUS * RADIUS;
  const MAX_PUSH = 16;
  const EASE_IN = 0.2;
  const EASE_OUT = 0.09;

  let dashes = [];
  let fieldRect = { left: 0, top: 0, width: 0, height: 0 };
  let mouse = { x: -9999, y: -9999 };
  let active = false;
  let rafId = null;
  let plusEl = null;

  function updateRect() {
    fieldRect = field.getBoundingClientRect();
  }

  function buildField() {
    field.innerHTML = '';
    dashes = [];
    updateRect();
    const cols = Math.ceil(fieldRect.width / CELL_W) + 1;
    const rowsCount = Math.ceil(fieldRect.height / CELL_H) + 1;
    const frag = document.createDocumentFragment();

    for (let r = 0; r < rowsCount; r++) {
      const rowOffset = (r % 2) ? CELL_W / 2 : 0;
      for (let c = 0; c < cols; c++) {
        const baseX = c * CELL_W + rowOffset;
        const baseY = r * CELL_H;
        const baseOpacity = 0.5 + Math.random() * 0.5;
        const responseMul = 0.75 + Math.random() * 0.5;
        const easeMul = 0.8 + Math.random() * 0.4;

        const el = document.createElement('span');
        el.className = 'dash';
        el.style.left = baseX + 'px';
        el.style.top = baseY + 'px';
        el.style.opacity = baseOpacity;
        frag.appendChild(el);

        dashes.push({
          el, baseX, baseY, baseOpacity, responseMul, easeMul,
          curX: 0, curY: 0, tX: 0, tY: 0,
          curScale: 1, tScale: 1,
          curOpacity: baseOpacity, tOpacity: baseOpacity
        });
      }
    }
    field.appendChild(frag);
  }

  function ensureLoop() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(tick);
  }

  function tick() {
    let stillMoving = false;

    if (plusEl && active) {
      plusEl.style.transform = `translate3d(${mouse.x.toFixed(1)}px,${mouse.y.toFixed(1)}px,0)`;
    }

    for (let i = 0; i < dashes.length; i++) {
      const d = dashes[i];
      let influenced = false;

      if (active) {
        const dx = d.baseX - mouse.x;
        const dy = d.baseY - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < RADIUS_SQ && distSq > 0.000001) {
          const dist = Math.sqrt(distSq);
          influenced = true;
          const t = 1 - dist / RADIUS;
          const force = (t * t * (3 - 2 * t)) * d.responseMul;
          d.tX = (dx / dist) * MAX_PUSH * force;
          d.tY = (dy / dist) * MAX_PUSH * force;
          d.tScale = 1 + force * 0.25;
          d.tOpacity = d.baseOpacity + (1 - d.baseOpacity) * force * 1.0;
        }
      }
      if (!influenced) {
        d.tX = 0; d.tY = 0; d.tScale = 1; d.tOpacity = d.baseOpacity;
      }

      const ease = (influenced ? EASE_IN : EASE_OUT) * d.easeMul;
      d.curX += (d.tX - d.curX) * ease;
      d.curY += (d.tY - d.curY) * ease;
      d.curScale += (d.tScale - d.curScale) * ease;
      d.curOpacity += (d.tOpacity - d.curOpacity) * ease;

      const settled =
        Math.abs(d.tX - d.curX) < 0.05 &&
        Math.abs(d.tY - d.curY) < 0.05 &&
        Math.abs(d.curX) < 0.05 &&
        Math.abs(d.curY) < 0.05 &&
        Math.abs(d.curScale - 1) < 0.001 &&
        Math.abs(d.curOpacity - d.baseOpacity) < 0.005;

      if (!settled) {
        stillMoving = true;
        d.el.style.transform = `translate3d(${d.curX.toFixed(2)}px,${d.curY.toFixed(2)}px,0) scale(${d.curScale.toFixed(3)})`;
        d.el.style.opacity = d.curOpacity.toFixed(3);
      }
    }

    if (stillMoving || active) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  buildField();

  const heroEl = document.querySelector('.hero');

  if (!reduceMotion && finePointer) {
    field.classList.add('is-interactive');
    heroEl.classList.add('cursor-plus-active');
    plusEl = document.querySelector('.hero-bg .cursor-plus');

    heroEl.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX - fieldRect.left;
      mouse.y = e.clientY - fieldRect.top;
      active = true;
      if (plusEl) plusEl.classList.add('is-visible');
      ensureLoop();
    }, { passive: true });

    heroEl.addEventListener('mouseleave', () => {
      active = false;
      if (plusEl) plusEl.classList.remove('is-visible');
      ensureLoop();
    }, { passive: true });

    let scrollRectTicking = false;
    window.addEventListener('scroll', () => {
      if (scrollRectTicking) return;
      scrollRectTicking = true;
      requestAnimationFrame(() => {
        updateRect();
        scrollRectTicking = false;
      });
    }, { passive: true });
  }

  if (!reduceMotion) {
    field.classList.add('is-interactive');

    function touchXY(e) {
      const t = e.touches ? e.touches[0] : e;
      mouse.x = t.clientX - fieldRect.left;
      mouse.y = t.clientY - fieldRect.top;
    }

    heroEl.addEventListener('touchstart', (e) => {
      touchXY(e);
      active = true;
      ensureLoop();
    }, { passive: true });

    heroEl.addEventListener('touchmove', (e) => {
      touchXY(e);
      active = true;
      ensureLoop();
    }, { passive: true });

    heroEl.addEventListener('touchend', () => {
      active = false;
      ensureLoop();
    }, { passive: true });

    heroEl.addEventListener('touchcancel', () => {
      active = false;
      ensureLoop();
    }, { passive: true });
  }

  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(window.__heroResizeTimer);
    window.__heroResizeTimer = setTimeout(buildField, 200);
  }, { passive: true });
})();
