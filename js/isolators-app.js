(function () {
  'use strict';
  var I = VKI, V = VK, T = THREE, $ = function (i) { return document.getElementById(i); };
  var view = V.viewer($('cv'), { pos: [12, 8, 14], target: [0, 3, 0], min: 3, max: 60, size: 70, fog: .01, auto: false, exposure: 1.1, warm: true, shiftY: .07 });
  window.__view = view;
  var cache = {}, cur = null, curId = null, tOpen = 0, tEarth = 0, aOpen = 0, aEarth = 0, col = 0;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build(id) { if (cache[id]) return cache[id]; var m = I.build[id](); m.group.visible = false; view.root.add(m.group); cache[id] = m; return m; }
  function box() { var b = new T.Box3(); Object.keys(cur.parts).forEach(function (k) { b.union(new T.Box3().setFromObject(cur.parts[k].obj)); }); return b; }
  function dirFor(v) { return v === 'top' ? new T.Vector3(.001, 1, .12) : v === 'front' ? new T.Vector3(0, .12, 1) : new T.Vector3(.7, .38, 1); }
  function frameView(v, ms) { var f = view.frame(box(), v === 'iso' ? 1.05 : 1.1, dirFor(v)); view.flyTo(f.pos, f.tgt, ms); return f; }
  function show(id, instant) {
    if (!I.models[id]) return; if (cur) cur.group.visible = false;
    cur = build(id); curId = id; cur.group.visible = true; view.select(null, false);
    view.registerParts(cur.parts); view.buildLabels();
    var f = view.setHome(box(), innerWidth < 700 ? .82 : .9, dirFor('iso')); view.flyTo(f.pos, f.tgt, instant ? 0 : 1000);
    view.controls.minDistance = 3; view.controls.maxDistance = 45; setView('iso', true);
    cur.update(aOpen, aEarth); render(id); history.replaceState(null, '', '#' + id); $('sub').textContent = I.models[id].title;
  }
  function setView(v, quiet) { document.querySelectorAll('[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === v); }); if (!quiet) { view.select(null, false); var f = frameView(v, 900); } }
  function render(id, keepCol) {
    var d = I.models[id]; if (!keepCol) col = Math.min(col, d.cols.length - 1);
    $('cats').innerHTML = I.order.map(function (k) { return '<button type="button" role="tab" aria-selected="' + (k === id) + '" data-m="' + k + '">' + esc(I.models[k].title.replace(/ \(.*\)/, '')) + '</button>'; }).join('');
    var act = $('cats').querySelector('[aria-selected=true]'); if (act && act.scrollIntoView) act.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    var plist = Object.keys(cur.parts);
    $('info').className = 'vk-card'; void $('info').offsetWidth; $('info').className = 'vk-card vk-fade';
    $('info').innerHTML = '<h2>' + esc(d.title) + ' isolator</h2><p style="font-size:11px;letter-spacing:.08em;color:#7d90a8;margin:2px 0 8px">' + esc(d.std) + '</p><p>' + esc(d.desc) + '</p>' +
      '<h3>Working principle</h3><p>' + esc(d.principle) + '</p>' +
      '<h3>Tap a part</h3><div class="vk-parts">' + plist.map(function (k) { return '<button type="button" data-p="' + k + '" aria-pressed="false">' + esc(cur.parts[k].label) + '</button>'; }).join('') + '</div>' +
      '<div id="pinfo" class="vk-fade" style="display:none;margin-top:12px;padding:12px 14px;border-radius:14px;background:#0b111c;border:1px solid #1e2a3b"></div>' +
      '<h3>Why this design</h3><ul>' + d.pros.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<h3>Ratings</h3><div class="vk-scrollx" style="margin-bottom:8px">' + d.cols.map(function (c, i) { return '<button type="button" data-c="' + i + '" class="vk-pill" aria-pressed="' + (i === col) + '" style="background:#0b111c">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="vk-xwrap"><table style="width:100%;border-collapse:collapse;font-size:13px">' + d.rows.map(function (r) { return '<tr style="border-top:1px solid #1e2a3b"><td style="padding:9px 6px 9px 0;color:#8aa0b8">' + esc(r[0]) + '</td><td style="padding:9px 0;text-align:right;font-family:\'JetBrains Mono\',monospace;color:#67e8f9;white-space:nowrap">' + esc(r[col + 1] || r[1]) + '</td></tr>'; }).join('') + '</table></div>' +
      '<h3>Safe operating sequence</h3><ol id="steps" style="list-style:none;margin:0;padding:0;display:grid;gap:8px">' + I.steps.map(function (s, i) { return '<li data-s="' + i + '" style="display:flex;gap:12px;padding:10px 12px;border-radius:14px;background:#0b111c;border:1px solid #1e2a3b;transition:all .3s"><b style="font:700 12px \'JetBrains Mono\',monospace;color:#22d3ee;padding-top:2px">0' + (i + 1) + '</b><span style="font-size:13.5px;line-height:1.45;color:#c3cedd"><b style="color:#fff;display:block">' + esc(s[0]) + '</b>' + esc(s[1]) + '</span></li>'; }).join('') + '</ol>';
    status(true);
  }
  view.onSelect = function (id) {
    var pi = $('pinfo'); if (!pi) return; document.querySelectorAll('.vk-parts button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.p === id); });
    if (!id) { pi.style.display = 'none'; return; }
    var g = I.generic[id] || [cur.parts[id].label, ''], own = I.models[curId].parts[id];
    pi.style.display = 'block'; pi.className = 'vk-fade'; pi.innerHTML = '<b style="color:#67e8f9;font-size:14px">' + esc(cur.parts[id].label) + '</b><p style="margin:6px 0 0;font-size:13.5px;line-height:1.6;color:#b8c4d4">' + esc(own || '') + '</p><p style="margin:8px 0 0;font-size:13px;line-height:1.55;color:#93a4b8">' + esc(g[1]) + '</p>';
  };

  var lastSt = '';
  function status(force) {
    var s, c, step;
    if (aEarth > .96) { s = 'Earthed · safe to work'; c = '#22d3ee'; step = 3; }
    else if (aOpen < .02 && aEarth < .02) { s = 'Closed · live'; c = '#22c55e'; step = 0; }
    else if (aOpen > .98) { s = 'Open · isolated'; c = '#f59e0b'; step = 2; }
    else { s = aEarth > .02 ? 'Earthing…' : (tOpen > aOpen ? 'Opening…' : 'Closing…'); c = '#facc15'; step = aEarth > .02 ? 3 : 1; }
    if (s === lastSt && !force) return; lastSt = s; $('st-t').textContent = s; $('status').firstChild.style.background = c;
    document.querySelectorAll('#steps li').forEach(function (li, i) { var on = i === step; li.style.borderColor = on ? '#22d3ee' : '#1e2a3b'; li.style.background = on ? 'rgba(8,145,178,.16)' : '#0b111c'; });
    var bo = $('b-open'), be = $('b-earth'), isOpen = tOpen > .5;
    bo.querySelector('span').textContent = isOpen ? 'Close isolator' : 'Open isolator'; bo.disabled = tEarth > .5; bo.style.opacity = bo.disabled ? .45 : 1;
    be.querySelector('span').textContent = tEarth > .5 ? 'Open earth' : 'Close earth'; be.disabled = !(aOpen > .98 || tEarth > .5); be.style.opacity = be.disabled ? .45 : 1;
    be.title = be.disabled ? 'Open the isolator first' : '';
  }
  view.hooks.push(function (dt) {
    var k = 1 - Math.exp(-dt * 3.2), changed = false;
    if (Math.abs(aOpen - tOpen) > .0005) { aOpen += Math.max(-dt * .55, Math.min(dt * .55, (tOpen - aOpen) * 1)) * (Math.abs(tOpen - aOpen) < .12 ? .6 : 1); changed = true; if (Math.abs(aOpen - tOpen) < .004) aOpen = tOpen; }
    if (Math.abs(aEarth - tEarth) > .0005) { aEarth += Math.max(-dt * .7, Math.min(dt * .7, tEarth - aEarth)); changed = true; if (Math.abs(aEarth - tEarth) < .004) aEarth = tEarth; }
    if (cur && (changed || cur._first !== true)) { cur._first = true; var e = aOpen * aOpen * (3 - 2 * aOpen), ee = aEarth * aEarth * (3 - 2 * aEarth); cur.update(e, ee); cur.live(aOpen < .02 && aEarth < .02); status(); }
  });
  $('b-open').addEventListener('click', function () { if (tEarth > .5) return; tOpen = tOpen > .5 ? 0 : 1; status(true); });
  $('b-earth').addEventListener('click', function () { if (this.disabled) return; tEarth = tEarth > .5 ? 0 : 1; status(true); });
  $('cats').addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b && b.dataset.m !== curId) show(b.dataset.m); });
  $('info').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'), c = e.target.closest('[data-c]'); if (c) { col = +c.dataset.c; render(curId, true); return; } if (b) { if (view.sel === b.dataset.p) view.select(null, false); else view.select(b.dataset.p, true); } });
  $('b-labels').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); view.setLabels(on); });
  $('b-reset').addEventListener('click', function () { view.select(null, false); setView('iso', true); view.reset(900); });
  $('b-spin').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); view.setAuto(on); });
  document.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.v); }); });
  var start = (location.hash || '').slice(1); if (I.order.indexOf(start) < 0) start = 'single';
  V.setProgress(.3);
  V.nextFrame().then(function () { show(start, true); V.setProgress(1, 'Ready'); V.nextFrame().then(V.nextFrame).then(function () { setTimeout(V.loaderDone, 250); }); });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (I.models[h] && h !== curId) show(h); });
})();
