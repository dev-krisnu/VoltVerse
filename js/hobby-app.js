(function () {
  'use strict';
  var D = window.HOBBY, HM = window.HobbyModels, $ = function (i) { return document.getElementById(i); };
  var labelsOn = true, mode = 'parts', cur = null, scene, camera, renderer, controls, holder, clock = new THREE.Clock(), model = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function init() {
    var box = $('hobby-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    box.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x1a2236, 0.55));
    var k = new THREE.DirectionalLight(0xffffff, 0.75); k.position.set(6, 12, 8); scene.add(k);
    var r = new THREE.DirectionalLight(0x38bdf8, 0.5); r.position.set(-8, 5, -6); scene.add(r);
    var grid = new THREE.GridHelper(60, 60, 0x1e3a5f, 0x12203a); grid.position.y = -0.02; scene.add(grid);
    holder = new THREE.Group(); scene.add(holder);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 1.2; controls.maxPolarAngle = Math.PI * 0.49;
    renderer.domElement.addEventListener('pointerdown', function () { controls.autoRotate = false; });
    window.addEventListener('resize', resize); resize();
    (function loop() { requestAnimationFrame(loop); var t = clock.getElapsedTime(); if (model && model.userData.update) model.userData.update(t); controls.update(); renderer.render(scene, camera); })();
  }
  function resize() { var b = $('hobby-canvas'), w = b.clientWidth || 300, h = b.clientHeight || 300; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); if (model) fit(); }
  function fit() {
    var bb = new THREE.Box3().setFromObject(model), s = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3());
    var r = Math.max(s.x, s.y * 1.2, s.z) * 0.5, d = r / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2) * Math.min(1, camera.aspect)) * 1.18;
    controls.target.copy(c); camera.position.set(c.x + d * 0.55, c.y + d * 0.6, c.z + d * 0.75); controls.update();
  }
  function applyLabels() { var any = false; if (model) model.traverse(function (o) { if (o.userData && o.userData.labels && o.userData.labels.isGroup) { o.userData.labels.visible = labelsOn; any = true; } }); var b = $('hobby-labels'); if (b) { b.style.display = any ? '' : 'none'; b.setAttribute('aria-pressed', labelsOn); } }
  function show(item) {
    cur = item; if (model) holder.remove(model);
    var src = mode === 'parts' ? HM.parts : HM.projects;
    model = src[item.model](); holder.add(model); controls.autoRotate = true; applyLabels(); fit();
    document.querySelectorAll('[data-item]').forEach(function (b) { b.setAttribute('aria-current', b.dataset.item === item.id ? 'true' : 'false'); });
    $('hobby-title').textContent = item.name;
    $('hobby-tag').textContent = mode === 'parts' ? item.tag : item.level + ' | ' + item.time;
    $('hobby-details').innerHTML = mode === 'parts' ? partHtml(item) : projectHtml(item);
    var cp = $('copy-code'); if (cp) cp.onclick = function () { navigator.clipboard && navigator.clipboard.writeText(item.code).then(function () { cp.textContent = 'Copied'; setTimeout(function () { cp.textContent = 'Copy'; }, 1500); }); };
    history.replaceState(null, '', '#' + (mode === 'parts' ? '' : 'p-') + item.id);
  }
  function table(rows, a, b) { return '<table class="w-full text-sm"><thead><tr class="text-left text-slate-400 text-xs uppercase tracking-wider"><th class="py-1 pr-3 font-semibold">' + a + '</th><th class="py-1 font-semibold">' + b + '</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr class="border-t border-slate-800 align-top"><td class="py-1.5 pr-3 font-mono text-cyan-300 whitespace-nowrap">' + esc(r[0]) + '</td><td class="py-1.5 text-slate-300">' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table>'; }
  function card(h, body, c) { return '<section class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><h3 class="text-xs font-bold uppercase tracking-widest ' + (c || 'text-cyan-300') + ' mb-2">' + h + '</h3>' + body + '</section>'; }
  function list(a) { return '<ul class="space-y-1 text-sm text-slate-300 list-disc pl-5">' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
  function partHtml(p) {
    return '<p class="text-slate-200 leading-relaxed mb-4">' + esc(p.summary) + '</p><div class="grid gap-3 md:grid-cols-2">' +
      card('Key specs', table(p.specs, 'Spec', 'Value')) + card('Anatomy', table(p.anatomy, 'Part', 'What it does'), 'text-amber-300') +
      card('Pins and connections', table(p.pins, 'Pin', 'Function'), 'text-emerald-300') + card('Good for', list(p.uses), 'text-violet-300') + '</div>' +
      '<p class="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200"><i class="fa-solid fa-triangle-exclamation mr-2"></i>' + esc(p.tip) + '</p>';
  }
  function projectHtml(p) {
    return '<p class="text-slate-200 leading-relaxed mb-4">' + esc(p.summary) + '</p><div class="grid gap-3 md:grid-cols-2">' +
      card('Parts you need', list(p.parts)) + card('Wiring', table(p.wiring, 'From', 'To'), 'text-emerald-300') +
      (p.circuit && window.Circuit ? '<section class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:col-span-2"><h3 class="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">Circuit diagram</h3><div class="cx-wrap">' + Circuit.svg(p.circuit) + '</div><div class="cx-leg"><span><i style="background:#f87171"></i>Power</span><span><i style="background:#94a3b8"></i>Ground</span><span><i style="background:#22d3ee"></i>Signals</span><span>Moving dashes show the direction of current</span></div></section>' : '') +
      card('Build steps', '<ol class="space-y-1 text-sm text-slate-300 list-decimal pl-5">' + p.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>', 'text-amber-300') +
      card('Extend it', list(p.extend), 'text-violet-300') + '</div>' +
      '<section class="mt-3 rounded-2xl border border-slate-800 bg-black/40 p-4"><div class="flex items-center justify-between mb-2"><h3 class="text-xs font-bold uppercase tracking-widest text-cyan-300">Sketch</h3><button id="copy-code" type="button" class="text-xs px-2 py-1 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800">Copy</button></div><pre class="overflow-x-auto text-xs leading-relaxed text-slate-200 font-mono"><code>' + esc(p.code) + '</code></pre></section>' +
      '<p class="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200"><i class="fa-solid fa-triangle-exclamation mr-2"></i>' + esc(p.note) + '</p>';
  }
  function renderList() {
    var items = mode === 'parts' ? D.parts : D.projects;
    $('hobby-list').innerHTML = items.map(function (i) { return '<button type="button" data-item="' + i.id + '" class="hobby-item"><i class="fa-solid ' + i.icon + '"></i><span><strong>' + esc(i.name) + '</strong><small>' + esc(mode === 'parts' ? i.tag : i.level + ' | ' + i.time) + '</small></span></button>'; }).join('');
    document.querySelectorAll('[data-item]').forEach(function (b) { b.addEventListener('click', function () { show(items.filter(function (x) { return x.id === b.dataset.item; })[0]); window.scrollTo({ top: 0, behavior: 'smooth' }); }); });
    document.querySelectorAll('[data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.mode === mode); });
  }
  function setMode(m, id) { mode = m; renderList(); var items = m === 'parts' ? D.parts : D.projects; show(items.filter(function (x) { return x.id === id; })[0] || items[0]); }
  document.addEventListener('DOMContentLoaded', function () {
    init();
    document.querySelectorAll('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode); }); });
    var lb = $('hobby-labels'); if (lb) lb.addEventListener('click', function () { labelsOn = !labelsOn; applyLabels(); });
    var h = location.hash.slice(1); if (h.indexOf('p-') === 0) setMode('projects', h.slice(2)); else setMode('parts', h);
  });
})();
