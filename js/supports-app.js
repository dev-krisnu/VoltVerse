(function () {
  'use strict';
  var S = VKS, V = VK, $ = function (i) { return document.getElementById(i); }, T = THREE;
  var view = V.viewer($('cv'), { pos: [18, 12, 30], target: [0, 8, 0], min: 3, max: 140, size: 120, fog: .006, bg: 0x0a1018, autoSpeed: .55 });
  var cache = {}, cur = null, curId = null, wind = true, tt = 0, gh = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function build(id) {
    if (cache[id]) return cache[id];
    var m = S.build[id](); m.group.visible = false; view.root.add(m.group);
    if (m.ground) { gh = S.holeGround(m.ground.w, m.ground.d, 120); m.group.add(gh); m.hole = gh; }
    cache[id] = m; return m;
  }
  function show(id, noFly) {
    var d = S.models[id]; if (!d) return;
    if (cur) cur.group.visible = false;
    var m = build(id); cur = m; curId = id; m.group.visible = true;
    view.ground.visible = !m.ground; view.select(null, false);
    var parts = {}; Object.keys(m.parts).forEach(function (k) { parts[k] = m.parts[k]; }); view.registerParts(parts); view.buildLabels();
    var tall = m.tall || 14, b = new T.Box3().setFromObject(m.group), s = b.getSize(new T.Vector3());
    var sb = new T.Box3(); Object.keys(m.parts).forEach(function (k) { sb.union(new T.Box3().setFromObject(m.parts[k].obj)); });
    var f = view.setHome(sb, innerWidth < 700 ? 1.0 : .95, new T.Vector3(.62, .24, 1));
    view.controls.minDistance = Math.max(2.5, tall * .12); view.controls.maxDistance = tall * 6;
    var dim = Math.max(tall * .55, s.x * .5); view.scene.fog.density = .35 / (dim * 14 + 60);
    if (noFly) { view.flyTo(f.pos, f.tgt, 0); } else { view.flyTo(f.pos, f.tgt, 1100); }
    var xb = $('b-xray'); xb.hidden = !m.xray; xb.setAttribute('aria-pressed', 'false'); if (m.xray) m.xray(false);
    render(id); history.replaceState(null, '', '#' + id);
    $('sub').textContent = d.title;
  }
  function render(id) {
    var d = S.models[id], m = cur, cat = S.cats.filter(function (c) { return c.id === d.cat; })[0];
    $('cats').innerHTML = S.cats.map(function (c) { return '<button type="button" role="tab" aria-selected="' + (c.id === d.cat) + '" data-cat="' + c.id + '"><i class="fa-solid ' + c.icon + '"></i>' + c.title + '</button>'; }).join('');
    $('subs').innerHTML = cat.models.map(function (k) { var x = S.models[k]; return '<button type="button" role="tab" aria-selected="' + (k === id) + '" data-m="' + k + '">' + esc(x.title) + '<small>' + esc(x.sub) + '</small></button>'; }).join('');
    var plist = Object.keys(m.parts).filter(function (k) { return k !== 'joint' || id === 'steel_tubular'; });
    $('info').className = 'vk-card'; void $('info').offsetWidth; $('info').className = 'vk-card vk-fade';
    $('info').innerHTML = '<h2>' + esc(d.title) + '</h2><p>' + esc(d.desc) + '</p>' +
      '<div class="vk-stats">' + d.stats.map(function (s) { return '<div class="vk-stat"><span>' + s[0] + '</span><b>' + esc(s[1]) + '</b></div>'; }).join('') + '</div>' +
      '<h3>Tap a part to inspect it</h3><div class="vk-parts" id="plist">' + plist.map(function (k) { return '<button type="button" data-p="' + k + '" aria-pressed="false">' + esc(m.parts[k].label) + '</button>'; }).join('') + '</div>' +
      '<div id="pinfo" class="vk-fade" style="display:none;margin-top:12px;padding:12px 14px;border-radius:14px;background:#0b111c;border:1px solid #1e2a3b"></div>' +
      '<h3>Key features</h3><ul>' + d.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
      '<h3>Advantages</h3><ul>' + d.pros.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
      '<h3>Limits</h3><ul>' + d.cons.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>';
  }
  view.onSelect = function (id) {
    var pi = $('pinfo'); if (!pi) return;
    document.querySelectorAll('#plist button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.p === id); });
    if (!id) { pi.style.display = 'none'; return; }
    var p = S.parts[id] || [cur.parts[id].label, ''], lbl = cur.parts[id].label;
    pi.style.display = 'block'; pi.className = 'vk-fade'; pi.innerHTML = '<b style="color:#67e8f9;font-size:14px">' + esc(lbl) + '</b><p style="margin:6px 0 0;font-size:13.5px;line-height:1.6;color:#b8c4d4">' + esc(p[1]) + '</p>';
    if (innerWidth < 1024) { var st = $('stage').getBoundingClientRect(); }
  };

  $('cats').addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (!b) return; var c = S.cats.filter(function (x) { return x.id === b.dataset.cat; })[0]; show(c.models[0]); });
  $('subs').addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) show(b.dataset.m); });
  $('info').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) { if (view.sel === b.dataset.p) view.select(null, false); else view.select(b.dataset.p, true); } });
  $('b-labels').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); view.setLabels(on); });
  $('b-wind').addEventListener('click', function () { wind = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', wind); });
  $('b-xray').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); if (cur && cur.xray) cur.xray(on); });
  $('b-reset').addEventListener('click', function () { view.select(null, false); view.reset(900); });
  $('b-spin').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); view.setAuto(on); });
  view.hooks.push(function (dt, t) {
    if (!cur || !cur.sway) return;
    for (var i = 0; i < cur.sway.length; i++) { var s = cur.sway[i], a = wind ? .045 : 0; s.rotation.x = a * Math.sin(t * 1.25 + i * 1.7); s.rotation.z = a * .6 * Math.sin(t * .9 + i); }
  });
  view.setLabels(false);
  setTimeout(function () { var h = $('hint'); if (h) h.remove(); }, 6000);

  var start = (location.hash || '').slice(1); if (!S.models[start]) start = 'lat_delta';
  V.setProgress(.3, 'Building structure…');
  V.nextFrame().then(function () { show(start, true); V.setProgress(1, 'Ready'); V.nextFrame().then(V.nextFrame).then(function () { setTimeout(V.loaderDone, 250); }); });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (S.models[h] && h !== curId) show(h); });
})();
