(() => {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const clamp = (v,min,max) => Math.max(min, Math.min(max, v));

  const body = document.body;
  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const safeAttr = () => (body.getAttribute('data-safe') || 'on').toLowerCase();
  const fxAttr = () => (body.getAttribute('data-particles') || 'auto').toLowerCase();
  const isSafe = () => safeAttr() === 'on';
  const fxOn = () => fxAttr() !== 'off';

  // Year
  document.addEventListener('DOMContentLoaded', () => {
    const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());
  });

  // Drawer
  const hamburger = $('#hamburger');
  const drawer = $('#drawer');

  function toggleDrawer(force) {
    if (!drawer || !hamburger) return;
    const open = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => toggleDrawer());
    document.addEventListener('click', (e) => {
      if (!drawer.classList.contains('open')) return;
      if (!drawer.contains(e.target) && !hamburger.contains(e.target)) toggleDrawer(false);
    });
    $$('.drawer-nav a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
  }

  // Smooth anchors (with offset)
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const off = 62;
      const y = el.getBoundingClientRect().top + window.scrollY - off;
      window.scrollTo({ top: y, behavior: prefersReduce.matches ? 'auto' : 'smooth' });
    });
  });

  // SAFE toggle
  function setSafe(next) {
    body.setAttribute('data-safe', next);
    const label = next === 'on' ? '🛡️ SAFE: ON' : '⚡ SAFE: OFF';
    const btn = $('#toggleSafe'); if (btn) { btn.textContent = label; btn.setAttribute('aria-pressed', next === 'on' ? 'true' : 'false'); }
    const btnM = $('#toggleSafeM'); if (btnM) { btnM.textContent = label; btnM.setAttribute('aria-pressed', next === 'on' ? 'true' : 'false'); }
  }
  const toggleSafeBtn = $('#toggleSafe');
  if (toggleSafeBtn) toggleSafeBtn.addEventListener('click', () => setSafe(isSafe() ? 'off' : 'on'));
  const toggleSafeBtnM = $('#toggleSafeM');
  if (toggleSafeBtnM) toggleSafeBtnM.addEventListener('click', () => setSafe(isSafe() ? 'off' : 'on'));

  // FX toggle (particles/fog/tilt)
  function setFx(next) {
    body.setAttribute('data-particles', next);
    const label = next === 'off' ? '✨ FX: OFF' : '✨ FX: ON';
    const btn = $('#toggleFx'); if (btn) { btn.textContent = label; btn.setAttribute('aria-pressed', next === 'off' ? 'false' : 'true'); }
    const btnM = $('#toggleFxM'); if (btnM) { btnM.textContent = label; btnM.setAttribute('aria-pressed', next === 'off' ? 'false' : 'true'); }
  }
  const toggleFxBtn = $('#toggleFx');
  if (toggleFxBtn) toggleFxBtn.addEventListener('click', () => setFx(fxOn() ? 'off' : 'auto'));
  const toggleFxBtnM = $('#toggleFxM');
  if (toggleFxBtnM) toggleFxBtnM.addEventListener('click', () => setFx(fxOn() ? 'off' : 'auto'));

  // Terminal copy
  const copyBtn = $('#copyCmd');
  const term = $('#term');
  if (copyBtn && term) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(term.textContent.trim());
        copyBtn.textContent = 'Skopiowano ✓';
        setTimeout(() => copyBtn.textContent = 'Kopiuj', 1200);
      } catch {
        copyBtn.textContent = 'Brak uprawnień';
        setTimeout(() => copyBtn.textContent = 'Kopiuj', 1200);
      }
    });
  }

  // Reveal on viewport
  const revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !prefersReduce.matches) {
      const io = new IntersectionObserver((entries, obs) => {
        for (const ent of entries) {
          if (ent.isIntersecting) { ent.target.classList.add('in'); obs.unobserve(ent.target); }
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in'));
    }
  }

  // Hologram tilt (SAFE reduced)
  const dome = $('#holoDome');
  let rx = 0, ry = 0, targetRx = 0, targetRy = 0;

  if (dome) {
    window.addEventListener('mousemove', (e) => {
      if (prefersReduce.matches || !fxOn()) return;
      const cx = innerWidth / 2, cy = innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;

      const maxY = isSafe() ? 7 : 12;
      const maxX = isSafe() ? 6 : 10;

      targetRy = clamp(dx * maxY, -maxY, maxY);
      targetRx = clamp(-dy * maxX, -maxX, maxX);
    }, { passive: true });

    const loop = () => {
      const damp = isSafe() ? 0.08 : 0.10;
      rx += (targetRx - rx) * damp;
      ry += (targetRy - ry) * damp;
      dome.style.transform = `translateZ(38px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  // Fog parallax (light)
  const fog = $('.fog');
  if (fog) {
    window.addEventListener('scroll', () => {
      if (prefersReduce.matches || !fxOn()) return;
      const m = (scrollY / innerHeight) * 2.2;
      fog.style.transform = `translate3d(${m}%, ${m*0.7}%, 0)`;
      fog.style.opacity = String(0.86 + Math.min(0.12, scrollY / (innerHeight * 2)));
    }, { passive: true });
  }

  // Contact handler (no backend): mailto fallback
  window.InsignisContact = {
    submit(e){
      e.preventDefault();
      const form = e.target;
      const name = (form.elements.namedItem('name')?.value || '').trim();
      const email = (form.elements.namedItem('email')?.value || '').trim();
      const msg = (form.elements.namedItem('message')?.value || '').trim();
      const subject = encodeURIComponent(`INSIGNIS TECH — kontakt (${name || 'bez nazwy'})`);
      const body = encodeURIComponent(`Imię i nazwisko: ${name}\nE-mail: ${email}\n\nWiadomość:\n${msg}\n`);
      window.location.href = `mailto:contact@insignis.tech?subject=${subject}&body=${body}`;
      return false;
    }
  };

  // Particles Engine (SAFE + auto-throttle + hero visibility)
  const canvas = $('#particles');
  if (!canvas) return;

  if (!fxOn() || prefersReduce.matches) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const DPR = Math.min(devicePixelRatio || 1, 1.25);
  const mem = navigator.deviceMemory || 4;

  let W = 0, H = 0, count = 0, density = 22000;
  let particles = [];
  let running = false;
  let last = 0;

  const targetFPS = 24;
  const frameMS = 1000 / targetFPS;

  function pickDensity() {
    // auto
    if (DPR > 1.1 && mem >= 6 && !isSafe()) return 18000;
    if (mem <= 4) return 26000;
    return 22000;
  }

  function resize() {
    W = Math.max(1, innerWidth);
    H = Math.max(1, innerHeight);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    density = pickDensity();
    count = Math.max(10, Math.floor((W * H) / density));
    init();
  }

  function rnd(a, b) { return Math.random() * (b - a) + a; }

  function init() {
    particles = [];
    const maxShadow = isSafe() ? 5 : 7;
    const maxRadius = isSafe() ? 1.25 : 1.8;

    for (let i = 0; i < count; i++) {
      const speed = rnd(0.015, 0.07);
      particles.push({
        x: rnd(0, W), y: rnd(0, H),
        r: rnd(0.5, maxRadius),
        vx: rnd(-1, 1) * speed,
        vy: rnd(-1, 1) * speed,
        a: rnd(0.24, 0.62),
        shadow: maxShadow
      });
    }
  }

  function step(dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = 'rgba(120,230,255,0.40)';
    ctx.shadowBlur = isSafe() ? 5 : 7;

    const mul = dt / (1000 / 60);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * mul;
      p.y += p.vy * mul;
      if (p.x < -2) p.x = W + 2;
      if (p.x > W + 2) p.x = -2;
      if (p.y < -2) p.y = H + 2;
      if (p.y > H + 2) p.y = -2;

      ctx.beginPath();
      ctx.fillStyle = `rgba(120,230,255,${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // Auto-throttle
  let slowCounter = 0;
  function loop(ts) {
    if (!running) return;
    if (!last) last = ts;
    const dt = ts - last;

    if (dt >= frameMS) {
      step(dt);

      if (dt > frameMS * 1.8) {
        slowCounter++;
        if (slowCounter > 20) {
          density = Math.min(density * 1.25, 50000);
          count = Math.max(8, Math.floor((W * H) / density));
          particles.length = Math.min(particles.length, count);
          slowCounter = 0;
        }
      } else if (slowCounter > 0) {
        slowCounter--;
      }
      last = ts;
    }
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    last = 0;
    requestAnimationFrame(loop);
  }
  function stop() { running = false; }

  const hero = $('#hero');
  if (hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const ent of entries) ent.isIntersecting ? start() : stop();
    }, { threshold: 0.06 });
    io.observe(hero);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', () => {
    document.visibilityState === 'visible' ? start() : stop();
  });

  addEventListener('resize', resize, { passive: true });
  resize();
})();