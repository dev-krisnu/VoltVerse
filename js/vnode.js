/* V-NODE brand runtime: cinematic visuals + neon-glass text.
   - First visit in a session: full intro (about 3s, tap to skip).
   - Every later page: a short branded loader. Internal links fade in a curtain first, so moving between pages feels continuous.
   Runs in <head>, so the overlay covers the page before first paint. */
(function () {
  'use strict';
  var D = document, R = D.documentElement, W = window, SS = null;
  try { SS = W.sessionStorage; } catch (e) {}
  var reduced = W.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches, coarse = W.matchMedia && matchMedia('(pointer:coarse)').matches;
  var seen = false; try { seen = SS && SS.getItem('vn:seen') === '1'; } catch (e) {}
  var mode = (reduced || seen) ? 'quick' : 'full', minMs = mode === 'full' ? 3100 : 420;
  var VN = W.VNode = { mode: mode };

  var LOGO = '<svg class="vn-logo" viewBox="0 0 400 400" fill="none" aria-hidden="true"><defs>' +
    '<linearGradient id="vnG" x1="60" y1="60" x2="340" y2="340" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#00f2fe"/><stop offset=".8" stop-color="#4facfe"/><stop offset="1" stop-color="#00c6ff"/></linearGradient>' +
    '<radialGradient id="vnC" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#00f2fe"/><stop offset=".75" stop-color="#4facfe"/><stop offset="1" stop-color="#030611"/></radialGradient>' +
    '<filter id="vnF" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="a"/><feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b"/><feGaussianBlur in="SourceGraphic" stdDeviation="22" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<g class="vn-ring" opacity=".4"><circle cx="200" cy="245" r="92" stroke="url(#vnG)" stroke-width="1.2" stroke-dasharray="8 24 4 12"/></g><g class="vn-ring r2" opacity=".25"><circle cx="200" cy="245" r="116" stroke="#00f2fe" stroke-width="1.2" stroke-dasharray="15 40"/></g>' +
    '<circle class="vn-shock" cx="200" cy="245" r="26" stroke="#00f2fe"/>' +
    '<path d="M105 80 174 235A30 30 0 0 0 226 235L295 80 255 80 200 202 145 80Z" stroke="rgba(0,242,254,.09)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path class="vn-trace" d="M105 80 174 235A30 30 0 0 0 226 235L295 80 255 80 200 202 145 80Z" stroke="url(#vnG)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" filter="url(#vnF)"/>' +
    '<path class="vn-acc" d="M125 90 185 225A18 18 0 0 0 215 225L275 90" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".95"/>' +
    '<path class="vn-pulse" d="M125 90 185 225A18 18 0 0 0 215 225L275 90" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>' +
    '<g class="vn-node"><circle cx="200" cy="245" r="26" fill="#030611" stroke="url(#vnG)" stroke-width="6" filter="url(#vnF)"/><circle cx="200" cy="245" r="14" fill="url(#vnC)"/><circle cx="200" cy="245" r="5" fill="#fff"/></g></svg>';

  /* static mark (sprite) used for the Home tab, headers and in-stage loaders */
  var SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="vmG" x1="95" y1="70" x2="305" y2="270" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a5f3fc"/><stop offset=".5" stop-color="#00f2fe"/><stop offset="1" stop-color="#4facfe"/></linearGradient>' +
    '<symbol id="vn-mark" viewBox="60 50 280 250"><path d="M105 80 174 235A30 30 0 0 0 226 235L295 80 255 80 200 202 145 80Z" fill="none" stroke="url(#vmG)" stroke-width="26" stroke-linejoin="round" stroke-linecap="round"/><circle cx="200" cy="248" r="17" fill="#030611" stroke="url(#vmG)" stroke-width="9"/><circle cx="200" cy="248" r="6" fill="#fff"/></symbol></defs></svg>';
  VN.mark = function (cls) { return '<svg class="vn-mark ' + (cls || '') + '" aria-hidden="true"><use href="#vn-mark"/></svg>'; };
  VN.sprite = SPRITE;

  var el = null, cv = null, ctx = null, raf = 0, parts = [], off = 0, t0 = 0, W0 = 0, H0 = 0, gone = false, hideAt = 0, pct = 0, lastDraw = 0, finishing = false;

  function build(curtain) {
    el = D.createElement('div'); el.id = 'vn'; el.setAttribute('aria-hidden', 'true'); el.className = (mode === 'quick' || curtain ? 'vn-quick' : '') + (curtain ? ' vn-curtain' : '');
    el.innerHTML = (curtain ? '' : '<canvas class="vn-cv"></canvas>') + '<div class="vn-vig"></div>' + (curtain ? '' : '<div class="vn-scan"></div><div class="vn-flare"></div>') + '<div class="vn-aura"></div>' +
      '<div class="vn-stage">' + LOGO + '<div class="vn-glass"><span class="b1">SYS.NODE // 01</span><span class="b2">ONLINE</span><h1 class="vn-title" id="vn-t"></h1><div class="vn-bar"><i id="vn-b"></i></div><p class="vn-sub">Electrical Visualizers</p></div>' +
      '<div class="vn-tele"><span class="dot"></span><span class="msg" id="vn-m">SYSTEM: INITIALIZING... 0%</span></div></div>' + (mode === 'full' && !curtain ? '<div class="vn-skip">TAP TO SKIP</div>' : '');
    R.appendChild(el);
  }
  function scramble(node, text, dur, delay) {
    var ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/', s = 0;
    setTimeout(function () { s = performance.now(); (function f(t) { var p = Math.min(1, (t - s) / dur), out = ''; for (var i = 0; i < text.length; i++) out += (i / text.length < p || text[i] === '-') ? text[i] : ch[Math.random() * ch.length | 0]; node.textContent = out; if (p < 1) requestAnimationFrame(f); else node.textContent = text; })(s); }, delay);
  }
  /* cinematic background: perspective grid horizon + drifting sparks */
  function spark(x, y, burst) { var a = Math.random() * 6.283, v = burst ? Math.random() * 7 + 3 : Math.random() * 1.1 + .3; return { x: x == null ? Math.random() * W0 : x, y: y == null ? Math.random() * H0 : y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: burst ? Math.random() * 2.6 + 1.2 : Math.random() * 1.6 + .5, c: Math.random() > .3 ? '#00f2fe' : (Math.random() > .5 ? '#fff' : '#4facfe'), a: 1, d: burst ? Math.random() * .02 + .012 : 0, b: burst }; }
  function sizeCv() { if (!cv) return; var dpr = 1; W0 = cv.width = Math.round(innerWidth * dpr); H0 = cv.height = Math.round(innerHeight * dpr); }
  function draw(t) {
    raf = requestAnimationFrame(draw);
    if (coarse && t - lastDraw < 33) return; lastDraw = t;
    ctx.clearRect(0, 0, W0, H0);
    var hy = H0 * .62, fy = H0 * .34, cx = W0 / 2; off = (off + .8) % 40;
    ctx.strokeStyle = 'rgba(0,242,254,.13)'; ctx.lineWidth = 1; ctx.beginPath();
    for (var y = hy; y < H0; y += (y - hy) * .15 + 8) { var dy = y + off * (y - hy) / 300; if (dy < H0) { ctx.moveTo(0, dy); ctx.lineTo(W0, dy); } }
    var n = coarse ? 14 : 28; for (var i = -n; i <= n; i++) { ctx.moveTo(cx + i * 5, fy); ctx.lineTo(cx + i * (coarse ? 90 : 70), H0); }
    ctx.stroke();
    for (var k = parts.length - 1; k >= 0; k--) {
      var p = parts[k]; p.x += p.vx; p.y += p.vy;
      if (p.b) { p.a -= p.d; if (p.a <= 0) { parts.splice(k, 1); continue; } } else { if (p.x < 0) p.x = W0; if (p.x > W0) p.x = 0; if (p.y < 0) p.y = H0; if (p.y > H0) p.y = 0; }
      ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function burst() { var lg = el && el.querySelector('.vn-logo'); if (!lg) return; var r = lg.getBoundingClientRect(), s = r.width / 400, x = r.left + 200 * s, y = r.top + 245 * s; for (var i = 0; i < (coarse ? 28 : 46); i++) parts.push(spark(x, y, true)); }

  function tele(p) {
    var m = p < 30 ? 'SYSTEM: INITIALIZING...' : p < 62 ? 'LOADING 3D CORE...' : p < 96 ? 'SYNCING MODELS...' : 'NODE ONLINE', n = D.getElementById('vn-m'), b = D.getElementById('vn-b');
    if (n) n.textContent = m + ' ' + Math.round(p) + '%'; if (b) b.style.width = p + '%';
  }
  function tick() {
    if (gone) return; var e = performance.now() - t0, target = finishing ? 100 : Math.min(92, e / minMs * 92);
    pct += (target - pct) * (finishing ? .25 : .12); if (finishing && pct > 99.2) pct = 100; tele(pct);
    if (pct < 100 || !finishing) requestAnimationFrame(tick);
  }
  function out() {
    if (gone) return; gone = true; finishing = true; tele(100);
    if (SS) try { SS.setItem('vn:seen', '1'); } catch (e) {}
    el.classList.add('vn-out'); setTimeout(function () { cancelAnimationFrame(raf); if (el) el.remove(); }, 750);
  }
  VN.hide = out;

  var loaded = D.readyState === 'complete', glNeeded = false, glOk = false, hidden = false;
  function maybeHide() {
    if (hidden || !loaded || (glNeeded && !glOk)) return; hidden = true; finishing = true; tick();
    setTimeout(out, Math.max(180, minMs - (performance.now() - t0)));
  }
  function start() {
    if (D.getElementById('vn')) return;
    build(false); t0 = performance.now();
    cv = el.querySelector('canvas'); if (cv) { ctx = cv.getContext('2d'); sizeCv(); W.addEventListener('resize', sizeCv); var c = Math.min(60, Math.round(W0 * H0 / (coarse ? 26000 : 18000))); for (var i = 0; i < c; i++) parts.push(spark()); raf = requestAnimationFrame(draw); }
    var T = D.getElementById('vn-t'); scramble(T, 'V-NODE', 700 * (mode === 'full' ? 1 : .35), 1500 * (mode === 'full' ? 1 : .3));
    if (mode === 'full') { setTimeout(burst, 1650); setTimeout(burst, 2250); }
    tick();
    el.addEventListener('pointerdown', function () { if (mode === 'full' && performance.now() - t0 > 700) { hidden = true; out(); } });
    setTimeout(function () { if (!hidden) { hidden = true; out(); } }, mode === 'full' ? 7500 : 4800);
  }
  if (!reduced || true) start();
  W.addEventListener('load', function () { loaded = true; glNeeded = !!D.querySelector('canvas:not(.vn-cv)'); if (glNeeded) { W.addEventListener('vk:ready', function () { glOk = true; maybeHide(); }, { once: true }); setTimeout(function () { glOk = true; maybeHide(); }, mode === 'full' ? 2600 : 1500); } maybeHide(); });
  W.addEventListener('pageshow', function (e) { if (e.persisted) { var o = D.getElementById('vn'); if (o) o.remove(); } });
  D.addEventListener('DOMContentLoaded', function () { var s = D.createElement('div'); s.innerHTML = SPRITE; D.body.insertBefore(s.firstChild, D.body.firstChild); });

  /* page curtain: internal links fade the brand screen in before navigating */
  D.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search) || !/\.html$|\/$/.test(u.pathname)) return;
    e.preventDefault(); var go = function () { location.href = a.href; };
    if (reduced) return go();
    var old = D.getElementById('vn'); if (old) old.remove();
    var m0 = mode; mode = 'quick'; build(true); mode = m0; el.classList.add('vn-quick');
    requestAnimationFrame(function () { el.classList.add('vn-on'); }); setTimeout(go, 200);
  }, true);
})();
