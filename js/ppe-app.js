(function () {
  'use strict';
  var T = THREE, V = VK, P = VKP, $ = function (i) { return document.getElementById(i); };
  var RATING = { 1: 4, 2: 8, 3: 25, 4: 40 }, COL = { 1: '#b9b7c0', 2: '#f5a623', 3: '#ee7a0b', 4: '#e8590c' };
  var view = V.viewer($('cv'), { pos: [0, 1.5, 4.6], target: [0, .92, 0], fov: 32, min: .7, max: 7, grid: false, ground: false, auto: false, shadows: true, shadowSize: 2.6, bg: 0x0a1018, exposure: .85, warm: true, shiftY: .02, maxPolar: Math.PI / 2 + .1 });
  window.__view = view;
  view.key.position.set(3.5, 6, 4.5); view.key.intensity = .8; view.key.target.position.set(0, .9, 0); view.scene.add(view.key.target);
  var rim = new T.DirectionalLight(0x22d3ee, .7); rim.position.set(-4, 3, -4); view.scene.add(rim);
  var warm = new T.PointLight(0xffb36b, .2, 12); warm.position.set(2.5, 1.5, 2.5); view.scene.add(warm);
  /* stage: glossy dais, glow ring, soft contact shadow */
  var dais = new T.Mesh(new T.CylinderGeometry(1.9, 2.0, .06, 80), new T.MeshBasicMaterial({ color: 0x0d1826 })); dais.position.y = -.03; view.scene.add(dais);
  var catcher = new T.Mesh(new T.CircleGeometry(1.9, 64), new T.ShadowMaterial({ opacity: .55 })); catcher.rotation.x = -Math.PI / 2; catcher.position.y = .003; catcher.receiveShadow = true; view.scene.add(catcher);
  var ring = new T.Mesh(new T.RingGeometry(1.86, 1.92, 96), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: .8, side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = .004; view.scene.add(ring);
  var floor = new T.Mesh(new T.CircleGeometry(30, 48), V.groundMat({})); floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; view.scene.add(floor);
  var cat = 1, person = null, cache = {}, selPart = null, pulse = 0, E = 12;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function getPerson(c) { if (!cache[c]) { cache[c] = P.buildPerson(c); cache[c].root.visible = false; view.root.add(cache[c].root); } return cache[c]; }
  var POSE = 'stand';
  function setCat(c, instant) {
    cat = c; if (person) person.root.visible = false; person = getPerson(c); person.root.visible = true; person.setPose(POSE); person.setHeat(0);
    document.documentElement.style.setProperty('--c', COL[c]); $('stage').style.setProperty('--c', COL[c]); $('badge').textContent = 'CAT ' + c + ' · ' + RATING[c] + ' cal/cm²'; $('badge').style.borderColor = COL[c];
    $('sub').textContent = P.data[c].all.title; selPart = null; focus('all', instant); render(); history.replaceState(null, '', '#cat' + c);
  }
  var FOC = { all: [[0, .92, 0], 3.35], head: [[0, 1.66, 0], 1.25], hood: [[0, 1.55, 0], 1.7], shirt: [[0, 1.2, 0], 2.5], coverall: [[0, 1.1, 0], 3], jacket: [[0, 1.05, 0], 3], suit: [[0, 1.05, 0], 3], pants: [[0, .55, 0], 3], gloves: [[.28, .88, 0], 1.3], cuffs: [[.27, .98, 0], 1.3], boots: [[0, .12, 0], 1.8] };
  function focus(k, instant) { var f = FOC[k] || FOC.all, t = new T.Vector3().fromArray(f[0]), d = new T.Vector3(.35, k === 'all' ? .12 : .08, 1).normalize().multiplyScalar(f[1] * (k === 'all' ? (innerWidth >= 1024 ? 1.2 : innerWidth < 700 ? 1.12 : 1.05) : 1)).add(t); if (k === 'all') { view.home.pos.copy(d); view.home.tgt.copy(t); } view.flyTo(d.toArray(), t.toArray(), instant ? 0 : 900); }
  function render() {
    var D = P.data[cat], keys = Object.keys(D).filter(function (k) { return k !== 'all'; }), a = D.all;
    $('tabs').innerHTML = [1, 2, 3, 4].map(function (c) { return '<button type="button" role="tab" aria-selected="' + (c === cat) + '" data-c="' + c + '" style="--c:' + COL[c] + '"><small>Category</small><b>' + c + '</b></button>'; }).join('');
    $('info').className = 'vk-card'; void $('info').offsetWidth; $('info').className = 'vk-card vk-fade';
    $('info').innerHTML = '<h2>' + esc(a.title) + '</h2><p>' + esc(a.desc) + '</p>' +
      '<div class="vk-stats"><div class="vk-stat"><span>Min. arc rating</span><b>' + esc(a.arc) + '</b></div><div class="vk-stat"><span>Voltage range</span><b>' + esc(a.volt) + '</b></div><div class="vk-stat"><span>Standard</span><b>' + esc(a.code) + '</b></div><div class="vk-stat"><span>Layers</span><b style="font-size:12px">' + esc(a.layer) + '</b></div></div>' +
      '<h3>What this worker wears</h3><ul>' + a.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
      '<h3>Tap to inspect</h3><div class="vk-parts" id="plist">' + keys.map(function (k) { return '<button type="button" data-p="' + k + '" aria-pressed="false">' + esc(D[k].title) + '</button>'; }).join('') + '</div><div id="pinfo" style="display:none;margin-top:12px;padding:12px 14px;border-radius:14px;background:#0b111c;border:1px solid #1e2a3b"></div>' +
      '<h3>Arc-flash test</h3><p>Pick how much energy the arc releases at the worker, then run it. NFPA 70E rates each category by the energy it can absorb before the wearer would suffer a second-degree burn.</p>' +
      '<div class="vk-slide"><label for="en">Incident energy</label><input id="en" type="range" min="1" max="60" value="' + E + '"><output id="eno">' + E + ' cal/cm²</output></div>' +
      '<div class="res" id="res"><b style="color:#cbd5e1">Ready.</b> <span style="color:#8aa0b8;font-size:13px">Press Arc flash on the stage to run the test.</span></div>';
  }
  view.onSelect = null;
  function selectPart(k) {
    var D = P.data[cat]; document.querySelectorAll('#plist button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.p === k); });
    var pi = $('pinfo'); if (selPart === k) { selPart = null; pi.style.display = 'none'; focus('all'); document.querySelectorAll('#plist button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); return; }
    selPart = k; var d = D[k]; pi.style.display = 'block'; pi.className = 'vk-fade';
    pi.innerHTML = '<b style="color:#67e8f9;font-size:14px">' + esc(d.title) + '</b><div style="font-size:11px;color:#7d90a8;margin:2px 0 6px">' + esc(d.sub || '') + '</div><p style="margin:0;font-size:13.5px;line-height:1.6;color:#b8c4d4">' + esc(d.desc) + '</p>' + (d.items ? '<ul style="margin-top:8px">' + d.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' : '') + (d.arc ? '<p style="margin-top:8px;font:600 12px \'JetBrains Mono\',monospace;color:#67e8f9">' + esc(d.arc) + ' · ' + esc(d.code || '') + '</p>' : '');
    focus(FOC[k] ? k : 'all');
  }
  /* highlight pulse on the selected garment */
  view.hooks.push(function (dt, t) {
    if (!person) return; person.update(dt, t); pulse = t;
    person.mats.forEach(function (m) { if (!m.emissive || heat > .01) return; m.emissive.setRGB(0, 0, 0); m.emissiveIntensity = 0; });
    if (selPart && person.parts[selPart] && heat < .01) { var a = .35 + .25 * Math.sin(t * 5); person.parts[selPart].forEach(function (o) { o.traverse(function (m) { if (m.isMesh && m.material.emissive && !m.material.transparent) { m.material.emissive.setRGB(0, .45 * a, .55 * a); m.material.emissiveIntensity = 1; } }); }); }
    view.camera.getWorldPosition(person.state.look);
    fxUpdate(dt);
  });
  /* ---------- arc flash effect ---------- */
  var fx = null, heat = 0, flashL = new T.PointLight(0xffe0a0, 0, 14, 1.6); flashL.position.set(0, 1.35, 1.1); view.scene.add(flashL);
  function glowTex() { return V.noiseTex(128, 128, function (x, w, h) { var g = x.createRadialGradient(64, 64, 2, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,220,140,.9)'); g.addColorStop(.6, 'rgba(255,120,30,.35)'); g.addColorStop(1, 'rgba(255,80,0,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }); }
  var ball = new T.Sprite(new T.SpriteMaterial({ map: glowTex(), blending: T.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })); ball.position.set(0, 1.3, 1.1); view.scene.add(ball);
  var shock = new T.Mesh(new T.RingGeometry(.9, 1, 64), new T.MeshBasicMaterial({ color: 0xfff1c0, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false })); shock.rotation.x = -Math.PI / 2; shock.position.y = .02; view.scene.add(shock);
  var N = 90, sp = new T.BufferGeometry(), spPos = new Float32Array(N * 3), spVel = []; sp.setAttribute('position', new T.BufferAttribute(spPos, 3)); var sparks = new T.Points(sp, new T.PointsMaterial({ color: 0xffd27a, size: .035, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false })); sparks.frustumCulled = false; view.scene.add(sparks);
  function runFlash() {
    if (fx) return; var R = RATING[cat]; heat = 0; person.setHeat(0); fx = { t: 0, R: R, E: E, peak: E / R };
    person.setPose('stand'); document.querySelectorAll('#poses [data-pose]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.pose === 'stand'); }); POSE = 'stand'; person.flinch();
    for (var i = 0; i < N; i++) { var a = Math.random() * 6.28, u = Math.random() * 2.2 + .6; spPos[i * 3] = 0; spPos[i * 3 + 1] = 1.3; spPos[i * 3 + 2] = 1.1; spVel[i] = [Math.cos(a) * u * .9, Math.random() * 2.2 + .3, Math.abs(Math.sin(a)) * u * .5 + .3]; }
    var fl = $('flash'); fl.style.transition = 'none'; fl.style.opacity = Math.min(1, .35 + E / 60); requestAnimationFrame(function () { fl.style.transition = 'opacity .9s ease-out'; fl.style.opacity = 0; });
    $('b-flash').disabled = true; $('res').className = 'res'; $('res').innerHTML = '<b style="color:#fdba74">Arc event…</b>';
  }
  function fxUpdate(dt) {
    if (!fx) { if (heat > 0 && fx === null) { /* slow cool: glow fades, char stays */ var g = Math.max(heat > 1 ? 1 : 0, heat - dt * .35); if (heat <= 1) { heat = g; person.setHeat(heat); } } return; }
    fx.t += dt; var t = fx.t, k = Math.min(1, t / .18), dec = Math.exp(-Math.max(0, t - .12) * 3.2);
    flashL.intensity = (3 + fx.E * .3) * dec * (t < .08 ? t / .08 : 1); ball.material.opacity = dec * Math.min(1, .5 + fx.E / 40); ball.scale.setScalar(.6 + 2.2 * k * (.6 + fx.E / 90)); ball.position.y = 1.3 + t * .25;
    shock.material.opacity = Math.max(0, .7 - t * 1.3); shock.scale.setScalar(.3 + t * 2.4);
    sparks.material.opacity = Math.max(0, 1 - t * .8); for (var i = 0; i < N; i++) { spVel[i][1] -= 5 * dt; spPos[i * 3] += spVel[i][0] * dt; spPos[i * 3 + 1] = Math.max(.02, spPos[i * 3 + 1] + spVel[i][1] * dt); spPos[i * 3 + 2] += spVel[i][2] * dt; } sp.attributes.position.needsUpdate = true;
    heat = Math.min(2, fx.peak * smoothStep(0, .4, t)); person.setHeat(heat);
    if (t > 2.2) { flashL.intensity = 0; ball.material.opacity = 0; shock.material.opacity = 0; sparks.material.opacity = 0; finish(); fx = null; $('b-flash').disabled = false; }
  }
  function smoothStep(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function finish() {
    var R = RATING[cat], r = E / R, pct = Math.min(100, Math.round(r * 100)), ok = E <= R, res = $('res');
    res.className = 'res ' + (ok ? 'ok' : 'bad');
    res.innerHTML = '<b style="font-size:15px;color:' + (ok ? '#86efac' : '#fca5a5') + '">' + (ok ? 'Protected' : 'Rating exceeded') + '</b>' +
      '<div class="meter"><i id="mt"></i></div><div style="display:flex;justify-content:space-between;font:600 12px \'JetBrains Mono\',monospace;color:#cbd5e1"><span>Arc: ' + E + ' cal/cm²</span><span>Suit: ' + R + ' cal/cm²</span></div>' +
      '<p style="font-size:13.5px;line-height:1.6;color:#c3cedd;margin:10px 0 0">' + (ok ? 'The suit absorbed about ' + pct + '% of its rated energy. Heat reaching the skin stays under 1.2 cal/cm², the level where a second-degree burn begins, so the worker walks away unhurt.' : 'The arc delivered ' + (E - R).toFixed(0) + ' cal/cm² more than this category can take. The fabric would break open and the worker would suffer serious burns. Use category ' + (cat < 4 ? (cat + 1) + ' or higher, or de-energize the equipment.' : '4 with a lower-energy task, or de-energize the equipment.')) + '</p>' +
      (ok ? '' : '<button type="button" id="rs" class="vk-pill" style="margin-top:10px;height:40px">Reset suit</button>');
    requestAnimationFrame(function () { var mt = $('mt'); if (mt) mt.style.width = Math.min(100, r * 100) + '%'; });
  }
  /* events */
  $('tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (b && +b.dataset.c !== cat) setCat(+b.dataset.c); });
  $('info').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) selectPart(b.dataset.p); if (e.target.id === 'rs') { heat = 0; person.setHeat(0); $('res').className = 'res'; $('res').innerHTML = '<b style="color:#cbd5e1">Suit replaced.</b>'; } });
  $('info').addEventListener('input', function (e) { if (e.target.id === 'en') { E = +e.target.value; $('eno').textContent = E + ' cal/cm²'; } });
  $('poses').addEventListener('click', function (e) { var b = e.target.closest('[data-pose]'); if (!b) return; POSE = b.dataset.pose; person.setPose(POSE); document.querySelectorAll('#poses [data-pose]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); if (POSE === 'walk') { view.flyTo([0, 1.9, 5.2], [0, .85, -.7], 800); } else if (!selPart) view.reset(700); });
  $('b-flash').addEventListener('click', runFlash);
  $('b-reset').addEventListener('click', function () { selPart = null; document.querySelectorAll('#plist button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); var pi = $('pinfo'); if (pi) pi.style.display = 'none'; view.reset(900); });
  $('b-spin').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); view.setAuto(on); });
  var start = /cat([1-4])/.exec(location.hash); V.setProgress(.3);
  V.nextFrame().then(function () { setCat(start ? +start[1] : 1, true); V.setProgress(.7, 'Dressing the worker…'); return V.nextFrame(); }).then(function () { V.setProgress(1, 'Ready'); return V.nextFrame(); }).then(V.nextFrame).then(function () { setTimeout(V.loaderDone, 300); });
  window.addEventListener('hashchange', function () { var m = /cat([1-4])/.exec(location.hash); if (m && +m[1] !== cat) setCat(+m[1]); });
})();
