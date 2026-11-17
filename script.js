(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- products (content and prices as listed on emadlight.ir/rha) ---------- */
  const IMG = 'https://www.emadlight.ir/rha/attach/kalaPic/';
  const URL = 'https://www.emadlight.ir/rha/shop/product/';
  const products = {
    464: { name: 'پریز برق ارت دار ویرا الکتریک مدل T2 مشکی', price: 554000, img: '464bbfc-320x320.png' },
    460: { name: 'کلید تبدیل تک پل ویرا الکتریک مدل T2 مشکی', price: 468000, img: '460eafa-320x320.png' },
    461: { name: 'کلید تک پل ویرا الکتریک مدل T2 مشکی', price: 452000, img: '461daba-320x320.png' },
    462: { name: 'کلید دو پل ویرا الکتریک مدل T2 مشکی', price: 483000, img: '462fbdf-320x320.png' },
    463: { name: 'کلید سه پل ویرا الکتریک مدل T2 مشکی', price: 578000, img: '463eefe-320x320.png' },
  };
  const fa = (n) => n.toLocaleString('fa-IR');

  const card = (id, i, tag) => {
    const p = products[id];
    return `<article class="p-card tilt reveal" style="--i:${i % 5}">
      <div class="p-img">
        ${tag ? `<span class="p-tag">${tag}</span>` : ''}
        <img loading="lazy" src="${IMG + p.img}" alt="${p.name}" width="320" height="320">
      </div>
      <h3><a href="${URL + id}">${p.name}</a></h3>
      <div class="p-price"><strong>${fa(p.price)}</strong><small>تومان</small></div>
    </article>`;
  };

  const newest = document.getElementById('newestGrid');
  if (newest) newest.innerHTML = [464, 460, 461, 462, 463].map((id, i) => card(id, i, 'جدید')).join('');
  const amazing = document.getElementById('amazingTrack');
  if (amazing) amazing.innerHTML = [463, 460, 461, 462].map((id, i) => card(id, i, 'شگفت انگیز')).join('');

  /* ---------- hero background video ---------- */
  const video = document.getElementById('heroVideo');
  const vToggle = document.getElementById('videoToggle');
  if (video && vToggle) {
    const small = window.matchMedia('(max-width: 760px)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    let loaded = false;
    // phones get the portrait walkthrough clip, larger screens the landscape one
    if (small) {
      video.poster = video.dataset.posterSm;
      const credit = document.getElementById('videoCredit');
      const [text, href] = video.dataset.creditSm.split('|');
      if (credit) { credit.textContent = text; credit.href = href; }
    }
    const load = () => {
      if (loaded) return;
      loaded = true;
      video.src = small ? video.dataset.srcSm : video.dataset.srcLg;
    };
    const setPaused = (paused) => {
      vToggle.setAttribute('aria-pressed', String(paused));
      vToggle.setAttribute('aria-label', paused ? 'پخش ویدیو' : 'توقف ویدیو');
    };
    const play = () => { load(); const p = video.play(); if (p) p.catch((e) => { if (e.name === 'NotAllowedError') setPaused(true); }); setPaused(false); };
    const pause = () => { video.pause(); setPaused(true); };

    // reduced motion or data saver: show the still poster and let the viewer start it
    if (reduceMotion || saveData) setPaused(true);
    else play();

    vToggle.addEventListener('click', () => (video.paused ? play() : pause()));
    video.addEventListener('playing', () => setPaused(false));

    // pause while the hero is off screen to save battery
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        if (vToggle.getAttribute('aria-pressed') === 'true') return;
        if (en.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }).observe(video.closest('.hero'));
    }
  }

  /* ---------- theme toggle ---------- */
  const toggle = document.getElementById('themeToggle');
  const isDark = () => {
    const t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const syncMeta = () => {
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', isDark() ? '#0b0a14' : '#f7f6fb');
  };
  syncMeta();
  toggle?.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('emad-theme', next); } catch (e) {}
    syncMeta();
  });

  /* ---------- mobile menu ---------- */
  const menu = document.getElementById('mobileMenu');
  const openBtn = document.getElementById('menuOpen');
  const closeBtn = document.getElementById('menuClose');
  const setMenu = (open) => {
    menu.hidden = !open;
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    (open ? closeBtn : openBtn).focus();
  };
  openBtn?.addEventListener('click', () => setMenu(true));
  closeBtn?.addEventListener('click', () => setMenu(false));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a') || e.target === menu) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  window.matchMedia('(min-width: 1021px)').addEventListener('change', (e) => { if (e.matches && !menu.hidden) setMenu(false); });

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const done = (el) => {
    // after the entrance finishes, hand control back to the element's own hover/tilt transitions
    const clean = (ev) => {
      if (ev.target !== el || ev.propertyName !== 'opacity') return;
      el.classList.remove('reveal', 'in');
      el.removeEventListener('transitionend', clean);
    };
    el.addEventListener('transitionend', clean);
  };
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        done(en.target);
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => {
      // anything already on screen at load shows straight away, even if the observer is slow to fire
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        done(el);
        el.classList.add('in');
      } else {
        io.observe(el);
      }
    });
  }

  /* ---------- tilt on hover (fine pointers only) ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest?.('.tilt');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const max = el.classList.contains('glow-frame') ? 6 : 9;
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
    });
    document.addEventListener('pointerout', (e) => {
      const el = e.target.closest?.('.tilt');
      if (el && !el.contains(e.relatedTarget)) {
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
      }
    });
  }
})();
