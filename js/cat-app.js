/* Generic catalogue page: tabs of 3D models with part picking, spec tables and an optional animation toggle.
   Page config lives in window.CAT (see holders-data.js). Each builder returns { group, parts:{id:{obj,label,zoom}}, update(t 0..1, time) }. */
(function () {
  'use strict';
  var C = window.CAT, V = VK, T = THREE, $ = function (i) { return document.getElementById(i); };
  var view = V.viewer($('cv'), Object.assign({ pos: [4, 3, 5], target: [0, 1, 0], min: .6, max: 40, size: 40, fog: .02, auto: false, exposure: 1.1, warm: true, shiftY: .05, shadows: false }, C.viewer || {}));
  window.__view = view;
  var cache = {}, cur = null, curId = null, tT = 0, aT = 0, tab = 0, mode = null, chartDirty = true, cdpr = 1;
  function curMode() { var d = C.models[curId]; return mode || (d && d.modes ? d.modes[0][0] : null); }
  function drawChart() {
    var d = C.models[curId], cv = $('cat-chart'); if (!d || !d.chart || !cv) return;
    var w = cv.parentNode.clientWidth - 2; if (w < 40) return; cdpr = Math.min(window.devicePixelRatio || 1, 2); var h = d.chart.h || 190;
    if (cv.width !== Math.round(w * cdpr) || cv.height !== Math.round(h * cdpr)) { cv.width = Math.round(w * cdpr); cv.height = Math.round(h * cdpr); cv.style.width = w + 'px'; cv.style.height = h + 'px'; }
    var x = cv.getContext('2d'); x.setTransform(cdpr, 0, 0, cdpr, 0, 0); x.clearRect(0, 0, w, h);
    d.chart.draw(x, w, h, aT, tT, curMode());
  }
  window.CATCHART = { grid: function (x, w, h, o) { o = o || {}; var l = o.l == null ? 36 : o.l, b = o.b == null ? 24 : o.b, t = o.t == null ? 10 : o.t, r = o.r == null ? 10 : o.r; x.strokeStyle = 'rgba(148,163,184,.14)'; x.lineWidth = 1; x.fillStyle = '#7d90a8'; x.font = '10.5px Inter,Arial,sans-serif'; x.textAlign = 'right'; x.textBaseline = 'middle'; var ny = o.ny || 4, nx = o.nx || 5, i; for (i = 0; i <= ny; i++) { var yy = t + (h - t - b) * i / ny; x.beginPath(); x.moveTo(l, yy); x.lineTo(w - r, yy); x.stroke(); if (o.yl) x.fillText(o.yl(1 - i / ny), l - 5, yy); } x.textAlign = 'center'; x.textBaseline = 'top'; for (i = 0; i <= nx; i++) { var xx = l + (w - l - r) * i / nx; x.beginPath(); x.moveTo(xx, t); x.lineTo(xx, h - b); x.stroke(); if (o.xl) x.fillText(o.xl(i / nx), xx, h - b + 5); } x.strokeStyle = 'rgba(148,163,184,.45)'; x.beginPath(); x.moveTo(l, t); x.lineTo(l, h - b); x.lineTo(w - r, h - b); x.stroke(); if (o.xt) { x.fillStyle = '#93a4b8'; x.textAlign = 'right'; x.textBaseline = 'bottom'; x.fillText(o.xt, w - r, h - 1); } return { l: l, t: t, r: w - r, b: h - b, w: w - l - r, h: h - t - b }; },
    line: function (x, pts, col, wd, dash) { if (!pts.length) return; x.save(); x.strokeStyle = col; x.lineWidth = wd || 2; x.lineJoin = 'round'; x.setLineDash(dash || []); x.beginPath(); pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.stroke(); x.restore(); },
    dot: function (x, px, py, col) { x.save(); x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 10; x.beginPath(); x.arc(px, py, 4.5, 0, 7); x.fill(); x.restore(); } };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build(id) { if (cache[id]) return cache[id]; var m = C.build[id](); m.group.visible = false; view.root.add(m.group); cache[id] = m; return m; }
  function box() { cur.group.updateMatrixWorld(true); var b = new T.Box3(); Object.keys(cur.parts).forEach(function (k) { b.union(new T.Box3().setFromObject(cur.parts[k].obj)); }); return b; }
  function dirFor(v) { return v === 'top' ? new T.Vector3(.001, 1, .1) : v === 'front' ? new T.Vector3(0, .12, 1) : new T.Vector3().fromArray(C.dir || [.6, .35, 1]); }
  function frameView(v, ms) { var f = view.frame(box(), v === 'iso' ? 1.0 : 1.05, dirFor(v)); view.flyTo(f.pos, f.tgt, ms); }
  function setView(v, quiet) { document.querySelectorAll('[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === v); }); if (!quiet) { view.select(null, false); frameView(v, 850); } }
  function show(id, instant) {
    if (!C.models[id]) return; if (cur) cur.group.visible = false;
    cur = build(id); curId = id; cur.group.visible = true; view.select(null, false); tT = 0; aT = 0;
    mode = null; cur.update && cur.update(0, 0, curMode()); view.registerParts(cur.parts); view.buildLabels();
    var f = view.setHome(box(), innerWidth < 700 ? (C.fit || 1.3) : (C.fit ? C.fit * .96 : 1.25), dirFor('iso')); view.flyTo(f.pos, f.tgt, instant ? 0 : 900);
    view.controls.minDistance = .5; view.controls.maxDistance = 60; setView('iso', true);
    cur.update && cur.update(0, 0, curMode()); tab = 0; render(id); status(true); chartDirty = true; history.replaceState(null, '', '#' + id); $('sub').textContent = C.models[id].title;
  }
  function render(id) {
    var d = C.models[id], plist = Object.keys(cur.parts);
    $('cats').innerHTML = C.order.map(function (k) { return '<button type="button" role="tab" aria-selected="' + (k === id) + '" data-m="' + k + '">' + esc(C.models[k].short || C.models[k].title) + '</button>'; }).join('');
    var act = $('cats').querySelector('[aria-selected=true]'); if (act && act.scrollIntoView) act.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    $('info').className = 'vk-card'; void $('info').offsetWidth; $('info').className = 'vk-card vk-fade';
    var h = '<h2>' + esc(d.title) + '</h2><p style="font-size:11px;letter-spacing:.08em;color:#7d90a8;margin:2px 0 8px">' + esc(d.std || '') + '</p><p>' + d.desc + '</p>';
    if (d.rating) h += '<div class="cat-rate">' + d.rating.map(function (r) { return '<div><small>' + esc(r[0]) + '</small><b>' + esc(r[1]) + '</b></div>'; }).join('') + '</div>';
    if (d.principle) h += '<h3>' + esc(C.principleTitle || 'How it works') + '</h3><p>' + d.principle + '</p>';
    if (d.modes) h += '<h3>' + esc(d.modesTitle || 'Choose a fault') + '</h3><div class="cat-seg" role="group">' + d.modes.map(function (m, i) { return '<button type="button" data-mode="' + m[0] + '" aria-pressed="' + (i === 0) + '">' + esc(m[1]) + '</button>'; }).join('') + '</div>';
    if (d.modeInfo) h += '<p class="cat-note cat-minfo" id="mode-info">' + esc(d.modeInfo[d.modes[0][0]] || '') + '</p>';
    if (d.slider) h += '<h3>' + esc(d.slider.title || 'Try it') + '</h3><div class="cat-slide"><div><span>' + esc(d.slider.label) + '</span><b id="sl-v">' + esc(d.slider.fmt ? d.slider.fmt(0) : '0') + '</b></div><input id="sl" type="range" min="0" max="1000" value="0" aria-label="' + esc(d.slider.label) + '"></div>';
    if (d.chart) h += '<h3>' + esc(d.chart.title) + '</h3><div class="cat-chart"><canvas id="cat-chart" height="' + (d.chart.h || 190) + '"></canvas>' + (d.chart.note ? '<p class="cat-note">' + esc(d.chart.note) + '</p>' : '') + '</div>';
    h += '<h3>Tap a part</h3><div class="vk-parts">' + plist.map(function (k) { return '<button type="button" data-p="' + k + '" aria-pressed="false">' + esc(cur.parts[k].label) + '</button>'; }).join('') + '</div>' +
      '<div id="pinfo" class="vk-fade" style="display:none;margin-top:12px;padding:12px 14px;border-radius:14px;background:#0b111c;border:1px solid #1e2a3b"></div>';
    if (d.pros) h += '<h3>' + esc(C.prosTitle || 'Where it is used') + '</h3><ul>' + d.pros.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (d.rows) h += '<h3>' + esc(C.rowsTitle || 'Specifications') + '</h3><div class="vk-xwrap"><table class="cat-tbl">' + d.rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table></div>';
    if (d.table) h += '<h3>' + esc(d.table.title) + '</h3><div class="vk-xwrap"><table class="cat-grid"><thead><tr>' + d.table.head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' + d.table.body.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    if (d.html) h += d.html;
    if (d.facts) h += '<h3>Good to know</h3><ul>' + d.facts.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (C.extra) h += C.extra(d, id) || '';
    $('info').innerHTML = h; if (C.afterRender) C.afterRender(id, $('info'));
  }
  view.onSelect = function (id) {
    var pi = $('pinfo'); if (!pi) return; document.querySelectorAll('.vk-parts button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.p === id); });
    if (!id) { pi.style.display = 'none'; return; }
    var own = (C.models[curId].parts || {})[id], g = (C.generic || {})[id];
    pi.style.display = 'block'; pi.className = 'vk-fade';
    pi.innerHTML = '<b style="color:#67e8f9;font-size:14px">' + esc(cur.parts[id].label) + '</b>' + (own ? '<p style="margin:6px 0 0;font-size:13.5px;line-height:1.6;color:#b8c4d4">' + esc(own) + '</p>' : '') + (g ? '<p style="margin:8px 0 0;font-size:13px;line-height:1.55;color:#93a4b8">' + esc(g) + '</p>' : '');
  };
  var lastS = '';
  function status(force) {
    var d = C.models[curId], a = d.act || C.act; if (typeof a === 'function') a = a(curMode()); var bb = $('b-act'); if (bb) bb.style.display = a ? '' : 'none'; if (!a) { var sx = d.statusFn ? d.statusFn(aT, curMode()) : (d.idle || 'Ready'); if (sx !== lastS || force) { lastS = sx; $('st-t').textContent = sx; var sd = $('status').firstChild; if (sd) sd.style.background = aT > .97 ? '#22d3ee' : aT < .03 ? '#22c55e' : '#facc15'; } return; }
    var s = aT > .97 ? a.doneText : aT < .03 ? a.idleText : (tT > aT ? a.onText : a.offText);
    if (s !== lastS || force) { lastS = s; $('st-t').textContent = s; $('status').firstChild.style.background = aT > .97 ? '#22d3ee' : aT < .03 ? '#22c55e' : '#facc15'; }
    $('b-act').querySelector('span').textContent = tT > .5 ? a.off : a.on;
  }
  view.hooks.push(function (dt, time) {
    var changed = false;
    var d0 = C.models[curId], sp = (d0 && d0.speed ? d0.speed(curMode(), tT) : (C.speed || .45)) * dt;
    if (Math.abs(aT - tT) > .0005) { aT += Math.max(-sp, Math.min(sp, tT - aT)); if (Math.abs(aT - tT) < .004) aT = tT; changed = true; }
    if (cur && cur.update && (changed || cur.tick)) { var e = d0 && d0.linear ? aT : aT * aT * (3 - 2 * aT); cur.update(e, time, curMode()); if (changed) status(); }
    if (changed || chartDirty || (d0 && d0.chart && d0.chart.live)) { chartDirty = false; drawChart(); }
  });
  $('b-act').addEventListener('click', function () { tT = tT > .5 ? 0 : 1; status(true); });
  $('info').addEventListener('click', function (e) { var b = e.target.closest('[data-mode]'); if (!b) return; mode = b.dataset.mode; var mi = $('mode-info'), dd = C.models[curId]; if (mi && dd.modeInfo) mi.textContent = dd.modeInfo[mode] || ''; $('info').querySelectorAll('[data-mode]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); tT = 0; aT = 0; cur.update && cur.update(0, 0, mode); status(true); chartDirty = true; });
  $('info').addEventListener('input', function (e) { if (e.target.id !== 'sl') return; var d = C.models[curId], v = e.target.value / 1000; tT = aT = v; e.target.style.setProperty('--p', (v * 100) + '%'); var o = $('sl-v'); if (o && d.slider && d.slider.fmt) o.textContent = d.slider.fmt(v); cur.update && cur.update(d.linear ? v : v * v * (3 - 2 * v), 0, curMode()); status(true); chartDirty = true; });
  window.addEventListener('resize', function () { chartDirty = true; });
  $('cats').addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b && b.dataset.m !== curId) show(b.dataset.m); });
  $('info').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) { if (view.sel === b.dataset.p) view.select(null, false); else view.select(b.dataset.p, true); } if (C.onClick) C.onClick(e); });
  $('b-labels').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); view.setLabels(on); });
  $('b-reset').addEventListener('click', function () { view.select(null, false); setView('iso', true); view.reset(900); });
  $('b-spin').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); view.setAuto(on); });
  document.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.v); }); });
  var start = (location.hash || '').slice(1); if (C.order.indexOf(start) < 0) start = C.order[0];
  V.setProgress(.3);
  V.nextFrame().then(function () { show(start, true); V.setProgress(1, 'Ready'); V.nextFrame().then(V.nextFrame).then(function () { setTimeout(V.loaderDone, 250); }); });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (C.models[h] && h !== curId) show(h); });
  window.CATAPI = { view: view, show: show, cur: function () { return cur; }, mode: curMode, t: function () { return aT; } };
})();
