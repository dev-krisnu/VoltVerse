/* V-NODE living night sky: twinkling parallax stars, a slow aurora, a soft moon and shooting stars.
   One fixed canvas behind every page. Cheap on phones (capped fps and pixel ratio), paused when hidden, static with reduced motion. */
(function () {
  'use strict';
  if (window.__vnSky) return; window.__vnSky = 1;
  var D = document, coarse = matchMedia('(pointer:coarse)').matches, still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var cv, cx, W = 0, H = 0, dpr = 1, stars = [], shoots = [], aur, moon, mx = 0, my = 0, tx = 0, ty = 0, scroll = 0, nextShoot = 2.5, last = 0, t = 0, heavy = false, fpsGap = coarse ? 1000 / 30 : 1000 / 40;
  var PAL = ['#ffffff', '#dff6ff', '#bfe8ff', '#fff1d6', '#c9d4ff'];
  function mk() { var c = D.createElement('canvas'); return c; }
  function buildAurora() {
    var w = 320, h = 140; aur = mk(); aur.width = w; aur.height = h; var g = aur.getContext('2d'); g.globalCompositeOperation = 'lighter';
    [[.30, '0,242,254', 26, 2, 0, .9], [.42, '90,255,170', 22, 3, 1.7, .6], [.34, '150,110,255', 30, 1, 3.1, .7]].forEach(function (r) {
      for (var x = 0; x < w; x++) {
        var u = x / w * Math.PI * 2, y = h * r[0] + Math.sin(u * r[3] + r[4]) * r[2] + Math.sin(u * (r[3] * 2 + 1) + r[4] * 2) * r[2] * .35, len = 38 + 20 * Math.sin(u * 2 + r[4]);
        var gr = g.createLinearGradient(0, y - len, 0, y + 6); gr.addColorStop(0, 'rgba(' + r[1] + ',0)'); gr.addColorStop(.75, 'rgba(' + r[1] + ',' + (.1 * r[5]) + ')'); gr.addColorStop(1, 'rgba(' + r[1] + ',0)');
        g.fillStyle = gr; g.fillRect(x, y - len, 1, len + 6);
      }
    });
  }
  function buildMoon() {
    moon = mk(); moon.width = moon.height = 220; var g = moon.getContext('2d'), c = 110;
    var h = g.createRadialGradient(c, c, 8, c, c, 108); h.addColorStop(0, 'rgba(190,225,255,.5)'); h.addColorStop(.25, 'rgba(120,170,255,.16)'); h.addColorStop(1, 'rgba(60,90,200,0)'); g.fillStyle = h; g.fillRect(0, 0, 220, 220);
    g.fillStyle = '#eef6ff'; g.beginPath(); g.arc(c, c, 17, 0, 7); g.fill();
    g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(c + 8, c - 5, 15, 0, 7); g.fill();
    g.globalCompositeOperation = 'source-over';
  }
  function seed() {
    var n = Math.round(Math.min(220, W * H / (coarse ? 5200 : 6500)) * (heavy ? .55 : 1)); stars = [];
    for (var i = 0; i < n; i++) { var z = Math.pow(Math.random(), 1.6) * .85 + .15; stars.push({ x: Math.random() * W, y: Math.random() * H, z: z, r: (Math.random() * .9 + .35) * (.5 + z), tw: Math.random() * 1.8 + .5, ph: Math.random() * 6.28, c: PAL[Math.random() * PAL.length | 0] }); }
  }
  function size() { dpr = Math.min(coarse ? 1 : 1.25, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cx.setTransform(dpr, 0, 0, dpr, 0, 0); seed(); if (still) frame(0); }
  function frame(dt) {
    t += dt; mx += (tx - mx) * .04; my += (ty - my) * .04;
    var g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#02030a'); g.addColorStop(.5, '#050a1b'); g.addColorStop(.85, '#0b1530'); g.addColorStop(1, '#13183a'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    /* aurora: pre-drawn ribbons, slid and breathed */
    cx.globalCompositeOperation = 'lighter'; var ah = H * .62, aw = W * 1.4, off = -((t * 5 + mx * 30) % aw);
    cx.globalAlpha = .5 + .22 * Math.sin(t * .22); cx.drawImage(aur, off, H * .02 - scroll * .03, aw, ah); cx.drawImage(aur, off + aw, H * .02 - scroll * .03, aw, ah);
    cx.globalAlpha = .22 + .12 * Math.sin(t * .31 + 2); cx.drawImage(aur, off * .6 - aw * .3, H * .1, aw * 1.2, ah * .9);
    cx.globalAlpha = 1;
    /* moon */
    cx.drawImage(moon, W * (innerWidth < 700 ? .74 : .86) - 110 - mx * 8, H * .1 - 110 - my * 5 - scroll * .02, 220, 220);
    cx.globalCompositeOperation = 'source-over';
    /* stars */
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i], a = .45 + .55 * Math.sin(t * s.tw + s.ph), x = s.x - mx * 14 * s.z, y = s.y - scroll * .12 * s.z - my * 8 * s.z;
      y = ((y % H) + H) % H; x = ((x % W) + W) % W; cx.globalAlpha = Math.max(.08, a) * (.35 + .65 * s.z); cx.fillStyle = s.c;
      if (s.r > 1.1) { cx.fillRect(x - s.r * 2.2, y - .3, s.r * 4.4, .6); cx.fillRect(x - .3, y - s.r * 2.2, .6, s.r * 4.4); }
      cx.beginPath(); cx.arc(x, y, s.r, 0, 6.2832); cx.fill();
    }
    cx.globalAlpha = 1;
    /* shooting stars */
    nextShoot -= dt; if (nextShoot <= 0 && !still) { var sp = 650 + Math.random() * 500, ang = .45 + Math.random() * .35; shoots.push({ x: Math.random() * W * .8, y: Math.random() * H * .35, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, l: 0, life: .8 + Math.random() * .5, len: 110 + Math.random() * 90 }); nextShoot = 3.5 + Math.random() * 6; }
    for (var k = shoots.length - 1; k >= 0; k--) {
      var o = shoots[k]; o.l += dt; o.x += o.vx * dt; o.y += o.vy * dt; if (o.l > o.life) { shoots.splice(k, 1); continue; }
      var f = 1 - o.l / o.life, n = Math.hypot(o.vx, o.vy), ex = o.x - o.vx / n * o.len * f, ey = o.y - o.vy / n * o.len * f, lg = cx.createLinearGradient(o.x, o.y, ex, ey);
      lg.addColorStop(0, 'rgba(255,255,255,' + f + ')'); lg.addColorStop(.3, 'rgba(120,230,255,' + .5 * f + ')'); lg.addColorStop(1, 'rgba(120,230,255,0)'); cx.strokeStyle = lg; cx.lineWidth = 1.6; cx.beginPath(); cx.moveTo(o.x, o.y); cx.lineTo(ex, ey); cx.stroke();
    }
  }
  function loop(now) { requestAnimationFrame(loop); if (D.hidden) { last = now; return; } if (now - last < fpsGap) return; var dt = Math.min(.08, (now - last) / 1000); last = now; frame(dt); }
  function start() {
    cv = mk(); cv.id = 'vn-sky'; cv.setAttribute('aria-hidden', 'true'); cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block';
    D.body.insertBefore(cv, D.body.firstChild); cx = cv.getContext('2d'); heavy = !!D.querySelector('canvas:not(#vn-sky):not(.vn-cv)') && coarse; buildAurora(); buildMoon(); size();
    addEventListener('resize', size); addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    addEventListener('scroll', function () { scroll = scrollY; }, { passive: true });
    if (!still) requestAnimationFrame(function (n) { last = n; loop(n); }); else frame(0);
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', start); else start();
})();
