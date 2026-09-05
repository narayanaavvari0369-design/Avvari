/* ============================================================
   main.js — site initialization
   ============================================================ */

// Set dynamic year in footer
(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Preloader: animate percentage from 40 to 100, then reveal site
(function () {
  var preloader = document.getElementById('preloader');
  var fill = document.getElementById('preloaderFill');
  var percent = document.getElementById('preloaderPercent');
  var step = document.getElementById('preloaderStep');
  var status = document.getElementById('plStatus');
  var time = document.getElementById('plTime');
  if (!preloader || !fill || !percent) return;

  // Lock body until preloader finishes
  document.body.classList.add('loading');

  var current = 40;
  var target = 100;
  var speed = 28; // ms between updates
  var tick = 0;

  // Build messages that change as the bar progresses
  var messages = [
    'compiling assets',
    'bundling modules',
    'optimizing images',
    'loading skills matrix',
    'initializing projects',
    'warming up kubectl',
    'deploying clusters',
    'building pipelines',
    'verifying routes'
  ];

  // Increment the step counter on each tick for the [done] countdown
  var startedAt = Date.now();

  var timer = setInterval(function () {
    if (current >= target) {
      current = target;
      fill.style.width = '100%';
      percent.textContent = '100%';
      step.textContent = '2/2';
      if (status) status.textContent = 'portfolio ready';
      if (time) time.textContent = ((Date.now() - startedAt) / 1000).toFixed(1) + 's';
      clearInterval(timer);

      // Hide preloader and reveal site
      setTimeout(function () {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 350);

      return;
    }

    current += 1;
    tick += 1;
    fill.style.width = current + '%';
    percent.textContent = current + '%';
    step.textContent = '1/2';

    if (status && messages.length) {
      status.textContent = messages[tick % messages.length];
    }
  }, speed);
})();
