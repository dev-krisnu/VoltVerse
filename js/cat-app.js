/* Generic catalogue page: tabs of 3D models with part picking, spec tables and an optional animation toggle.
   Page config lives in window.CAT (see holders-data.js). Each builder returns { group, parts:{id:{obj,label,zoom}}, update(t 0..1, time) }. */
(function () {
  'use strict';
  var C = window.CAT, V = VK, T = THREE, $ = function (i) { return document.getElementById(i); };
  var view = V.viewer($('cv'), Object.assign({ pos: [4, 3, 5], target: [0, 1, 0], min: .6, max: 40, size: 40, fog: .02, auto: false, exposure: 1.1, warm: true, shiftY: .05, shadows: false }, C.viewer || {}));
  window.__view = view;
  var cache = {}, cur = null, curId = null, tT = 0, aT = 0, tab = 0;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build(id) { if (cache[id]) return cache[id]; var m = C.build[id](); m.group.visible = false; view.root.add(m.group); cache[id] = m; return m; }
  function box() { cur.group.updateMatrixWorld(true); var b = new T.Box3(); Object.keys(cur.parts).forEach(function (k) { b.union(new T.Box3().setFromObject(cur.parts[k].obj)); }); return b; }
  function dirFor(v) { return v === 'top' ? new T.Vector3(.001, 1, .1) : v === 'front' ? new T.Vector3(0, .12, 1) : new T.Vector3().fromArray(C.dir || [.6, .35, 1]); }
  function frameView(v, ms) { var f = view.frame(box(), v === 'iso' ? 1.0 : 1.05, dirFor(v)); view.flyTo(f.pos, f.tgt, ms); }
  function setView(v, quiet) { document.querySelectorAll('[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === v); }); if (!quiet) { view.select(null, false); frameView(v, 850); } }
  function show(id, instant) {
    if (!C.models[id]) return; if (cur) cur.group.visible = false;
    cur = build(id); curId = id; cur.group.visible = true; view.select(null, false); tT = 0; aT = 0;
    cur.update && cur.update(0, 0); view.registerParts(cur.parts); view.buildLabels();
    var f = view.setHome(box(), innerWidth < 700 ? (C.fit || 1.3) : (C.fit ? C.fit * .96 : 1.25), dirFor('iso')); view.flyTo(f.pos, f.tgt, instant ? 0 : 900);
    view.controls.minDistance = .5; view.controls.maxDistance = 60; setView('iso', true);
    cur.update && cur.update(0, 0); tab = 0; render(id); status(true); history.replaceState(null, '', '#' + id); $('sub').textContent = C.models[id].title;
  }
  function render(id) {
    var d = C.models[id], plist = Object.keys(cur.parts);
    $('cats').innerHTML = C.order.map(function (k) { return '<button type="button" role="tab" aria-selected="' + (k === id) + '" data-m="' + k + '">' + esc(C.models[k].short || C.models[k].title) + '</button>'; }).join('');
    var act = $('cats').querySelector('[aria-selected=true]'); if (act && act.scrollIntoView) act.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    $('info').className = 'vk-card'; void $('info').offsetWidth; $('info').className = 'vk-card vk-fade';
    var h = '<h2>' + esc(d.title) + '</h2><p style="font-size:11px;letter-spacing:.08em;color:#7d90a8;margin:2px 0 8px">' + esc(d.std || '') + '</p><p>' + d.desc + '</p>';
    if (d.rating) h += '<div class="cat-rate">' + d.rating.map(function (r) { return '<div><small>' + esc(r[0]) + '</small><b>' + esc(r[1]) + '</b></div>'; }).join('') + '</div>';
    if (d.principle) h += '<h3>' + esc(C.principleTitle || 'How it works') + '</h3><p>' + d.principle + '</p>';
    h += '<h3>Tap a part</h3><div class="vk-parts">' + plist.map(function (k) { return '<button type="button" data-p="' + k + '" aria-pressed="false">' + esc(cur.parts[k].label) + '</button>'; }).join('') + '</div>' +
      '<div id="pinfo" class="vk-fade" style="display:none;margin-top:12px;padding:12px 14px;border-radius:14px;background:#0b111c;border:1px solid #1e2a3b"></div>';
    if (d.pros) h += '<h3>' + esc(C.prosTitle || 'Where it is used') + '</h3><ul>' + d.pros.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (d.rows) h += '<h3>' + esc(C.rowsTitle || 'Specifications') + '</h3><div class="vk-xwrap"><table class="cat-tbl">' + d.rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table></div>';
    if (d.table) h += '<h3>' + esc(d.table.title) + '</h3><div class="vk-xwrap"><table class="cat-grid"><thead><tr>' + d.table.head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' + d.table.body.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
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
    var d = C.models[curId], a = d.act || C.act; var bb = $('b-act'); if (bb) bb.style.display = a ? '' : 'none'; if (!a) { $('st-t').textContent = d.idle || 'Ready'; return; }
    var s = aT > .97 ? a.doneText : aT < .03 ? a.idleText : (tT > aT ? a.onText : a.offText);
    if (s !== lastS || force) { lastS = s; $('st-t').textContent = s; $('status').firstChild.style.background = aT > .97 ? '#22d3ee' : aT < .03 ? '#22c55e' : '#facc15'; }
    $('b-act').querySelector('span').textContent = tT > .5 ? a.off : a.on;
  }
  view.hooks.push(function (dt, time) {
    var changed = false;
    if (Math.abs(aT - tT) > .0005) { aT += Math.max(-dt * .45, Math.min(dt * .45, tT - aT)); if (Math.abs(aT - tT) < .004) aT = tT; changed = true; }
    if (cur && cur.update && (changed || cur.tick)) { var e = aT * aT * (3 - 2 * aT); cur.update(e, time); if (changed) status(); }
  });
  $('b-act').addEventListener('click', function () { tT = tT > .5 ? 0 : 1; status(true); });
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
  window.CATAPI = { view: view, show: show, cur: function () { return cur; } };
})();
