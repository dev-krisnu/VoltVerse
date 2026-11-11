/* V-NODE shared 3D engine (three.js r128). Mobile-first: DPR cap, pause when off-screen,
   procedural studio lighting, camera tweening, part picking, optional labels, merged geometry helpers. */
(function () {
  'use strict';
  var T = window.THREE, V = window.VK = window.VK || {};
  V.coarse = matchMedia('(pointer:coarse)').matches || innerWidth < 768;
  V.reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  V.ease = ease;

  /* ---------- procedural studio environment (gives metal and porcelain real reflections) ---------- */
  function makeEnv(renderer, warm) {
    var pm = new T.PMREMGenerator(renderer), sc = new T.Scene();
    var g = new T.SphereGeometry(40, 32, 20), cols = [], p = g.attributes.position, c = new T.Color();
    for (var i = 0; i < p.count; i++) {
      var y = p.getY(i) / 40;
      if (y > 0) c.setRGB(.10 + .45 * y, .16 + .5 * y, .26 + .62 * y); else c.setRGB(.05 + .1 * (1 + y), .055 + .1 * (1 + y), .07 + .1 * (1 + y));
      cols.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new T.Float32BufferAttribute(cols, 3));
    sc.add(new T.Mesh(g, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide })));
    function panel(w, h, x, y, z, col, k) {
      var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(col).multiplyScalar(k), side: T.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m);
    }
    panel(26, 14, -18, 22, 14, warm ? 0xfff1d6 : 0xffffff, 3.2);
    panel(10, 24, 30, 8, -6, 0xbfe3ff, 2.2);
    panel(30, 4, 0, 34, -10, 0xffffff, 2.6);
    panel(18, 6, 0, 3, -32, 0xffd9a8, 1.4);
    var t = pm.fromScene(sc, .03).texture; pm.dispose(); g.dispose();
    return t;
  }

  /* flat, fog-friendly ground with a soft radial pool of light (not affected by the env map) */
  function groundMat(o) {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 8, 128, 128, 128);
    g.addColorStop(0, '#16283d'); g.addColorStop(.55, '#0f1c2d'); g.addColorStop(1, '#0a1220'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return new T.MeshBasicMaterial({ map: t });
  }
  V.groundMat = groundMat;
  /* ---------- viewer ---------- */
  V.viewer = function (box, o) {
    o = Object.assign({ bg: 0x0a1018, fog: 0, grid: true, ground: true, target: [0, 1, 0], pos: [5, 3, 7], fov: 38, min: 1, max: 80,
      auto: true, autoSpeed: .6, maxPolar: Math.PI / 2 - .015, exposure: 1.05, warm: false, groundColor: 0x0d1520, gridA: 0x1d4560, gridB: 0x14222f, size: 60 }, o || {});
    var scene = new T.Scene(); scene.background = new T.Color(o.bg);
    if (o.fog) scene.fog = new T.FogExp2(o.bg, o.fog);
    var cam = new T.PerspectiveCamera(o.fov, 1, .1, 800); cam.position.fromArray(o.pos);
    var r = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.outputEncoding = T.sRGBEncoding; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = o.exposure;
    var dprMax = V.coarse ? 1.6 : 2, dpr = Math.min(window.devicePixelRatio || 1, dprMax);
    r.setPixelRatio(dpr);
    r.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none';
    r.domElement.setAttribute('tabindex', '0');
    box.appendChild(r.domElement);
    scene.environment = makeEnv(r, o.warm);
    var key = new T.DirectionalLight(0xffffff, .9); key.position.set(8, 14, 9); scene.add(key);
    if (o.shadows) { r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap; key.castShadow = true; key.shadow.mapSize.set(V.coarse ? 1024 : 2048, V.coarse ? 1024 : 2048); var sc = key.shadow.camera, sz = o.shadowSize || 2.4; sc.left = -sz; sc.right = sz; sc.top = sz; sc.bottom = -sz; sc.near = .5; sc.far = 40; key.shadow.bias = -.0004; key.shadow.normalBias = .01; }
    scene.add(new T.HemisphereLight(0xbcd8ff, 0x1a1f2a, .35));
    if (o.ground) {
      var gm = new T.Mesh(new T.CircleGeometry(o.size, 64), groundMat(o));
      gm.rotation.x = -Math.PI / 2; scene.add(gm); var groundRef = gm;
    }
    if (o.grid) { var gr = new T.GridHelper(o.size * 1.6, Math.round(o.size / 5), o.gridA, o.gridB); gr.position.y = .01; gr.material.transparent = true; gr.material.opacity = .4; scene.add(gr); }
    var ctl = new T.OrbitControls(cam, r.domElement);
    ctl.enableDamping = true; ctl.dampingFactor = .07; ctl.minDistance = o.min; ctl.maxDistance = o.max; ctl.maxPolarAngle = o.maxPolar;
    ctl.target.fromArray(o.target); ctl.rotateSpeed = V.coarse ? .8 : 1; ctl.zoomSpeed = .9; ctl.screenSpacePanning = true;
    ctl.autoRotate = !!o.auto && !V.reduced; ctl.autoRotateSpeed = o.autoSpeed;
    ctl.touches = { ONE: T.TOUCH.ROTATE, TWO: T.TOUCH.DOLLY_PAN };
    var api = { key: key, ground: null, scene: scene, camera: cam, renderer: r, controls: ctl, root: new T.Group(), hooks: [], labelsOn: false, parts: {}, sel: null }, vis = true, alive = true, tween = null, last = performance.now(), slow = 0, clock = new T.Clock();
    scene.add(api.root); api.ground = typeof groundRef !== 'undefined' ? groundRef : null;
    var home = { pos: cam.position.clone(), tgt: ctl.target.clone() };
    api.home = home;

    function resize() {
      var w = box.clientWidth || 300, h = box.clientHeight || 300; r.setSize(w, h, false); cam.aspect = w / h;
      /* keep tall models in frame on narrow screens */
      cam.fov = w / h < .85 ? o.fov * (1 + (.85 - w / h) * .55) : o.fov; if (o.shiftY) cam.setViewOffset(w, h, 0, Math.round(h * o.shiftY), w, h); cam.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(box); resize();
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }, { threshold: 0 }).observe(box);
    var interacting = false, idle;
    ctl.addEventListener('start', function () { interacting = true; ctl.autoRotate = false; tween = null; clearTimeout(idle); });
    ctl.addEventListener('end', function () { interacting = false; clearTimeout(idle); if (api.autoWanted && !V.reduced) idle = setTimeout(function () { ctl.autoRotate = true; }, 3500); });
    api.autoWanted = !!o.auto;
    api.setAuto = function (on) { api.autoWanted = on; ctl.autoRotate = on && !V.reduced; };

    api.flyTo = function (pos, tgt, ms) {
      if (V.reduced) ms = 0;
      var p0 = cam.position.clone(), t0 = ctl.target.clone(), p1 = new T.Vector3().fromArray(pos), t1 = new T.Vector3().fromArray(tgt);
      if (!ms) { cam.position.copy(p1); ctl.target.copy(t1); return; }
      tween = { t: 0, ms: ms, p0: p0, t0: t0, p1: p1, t1: t1 };
    };
    api.reset = function (ms) { api.flyTo(home.pos.toArray(), home.tgt.toArray(), ms == null ? 900 : ms); };
    api.frame = function (obj, mult, dir) { /* fit camera on an object's bounding sphere */
      var b = obj.isBox3 ? obj : new T.Box3().setFromObject(obj), s = b.getBoundingSphere(new T.Sphere()), d = s.radius / Math.sin(T.MathUtils.degToRad(cam.fov / 2)) * (mult || 1.15);
      var v = (dir || new T.Vector3(.55, .3, 1)).clone().normalize().multiplyScalar(d).add(s.center);
      return { pos: v.toArray(), tgt: s.center.toArray() };
    };
    api.setHome = function (obj, mult, dir) { var f = api.frame(obj, mult, dir); home.pos.fromArray(f.pos); home.tgt.fromArray(f.tgt); ctl.minDistance = Math.max(o.min, 0); return f; };

    /* parts: { id: { obj, label } } click-pick + highlight */
    var ray = new T.Raycaster(), hl = null, hlBox = null;
    api.registerParts = function (map) { api.parts = map; };
    api.select = function (id, fly) {
      api.sel = id; if (hl) { api.root.remove(hl); hl = null; }
      var p = api.parts[id]; if (!p) { api.onSelect && api.onSelect(null); return; }
      var b = new T.Box3().setFromObject(p.obj); hl = new T.Box3Helper(b, 0x22d3ee); hl.material.transparent = true; hl.material.depthTest = false; hl.renderOrder = 9; scene.add(hl); hl.userData.b = b;
      if (fly !== false) { var f = api.frame(p.obj, p.zoom || 1.9); api.flyTo(f.pos, f.tgt, 850); }
      api.onSelect && api.onSelect(id);
    };
    var down = null;
    r.domElement.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY, performance.now()]; });
    r.domElement.addEventListener('pointerup', function (e) {
      if (!down || Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) > 8 || performance.now() - down[2] > 450) return;
      var rc = r.domElement.getBoundingClientRect();
      ray.setFromCamera(new T.Vector2(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1), cam);
      var best = null, bd = 1e9, ids = Object.keys(api.parts);
      ids.forEach(function (id) { var h = ray.intersectObject(api.parts[id].obj, true); if (h.length && h[0].distance < bd) { bd = h[0].distance; best = id; } });
      if (best) api.select(best, true);
    });

    /* labels (HTML overlay). Selected part label is always on; the rest follow the toggle. */
    var lab = document.createElement('div'); lab.className = 'vk-labels'; box.appendChild(lab);
    var labEls = {};
    api.buildLabels = function () {
      lab.innerHTML = ''; labEls = {};
      Object.keys(api.parts).forEach(function (id) {
        var p = api.parts[id]; if (!p.label) return;
        var el = document.createElement('button'); el.type = 'button'; el.className = 'vk-tag'; el.innerHTML = '<i></i><span>' + p.label + '</span>';
        el.addEventListener('click', function () { api.select(id, true); }); lab.appendChild(el); labEls[id] = el;
      });
    };
    api.setLabels = function (on) { api.labelsOn = on; lab.classList.toggle('on', on); };
    var tv = new T.Vector3(), bb = new T.Box3();
    function placeLabels() {
      var w = box.clientWidth, h = box.clientHeight;
      Object.keys(labEls).forEach(function (id) {
        var el = labEls[id], p = api.parts[id], show = api.labelsOn || api.sel === id;
        if (!show) { el.style.display = 'none'; return; }
        bb.setFromObject(p.obj); bb.getCenter(tv); if (p.anchor) tv.fromArray(p.anchor); tv.project(cam);
        if (tv.z > 1 || tv.z < -1) { el.style.display = 'none'; return; }
        el.style.display = ''; el.classList.toggle('sel', api.sel === id);
        el.style.transform = 'translate(' + Math.round((tv.x * .5 + .5) * w) + 'px,' + Math.round((-tv.y * .5 + .5) * h) + 'px) translate(-8px,-50%)';
      });
    }

    function loop() {
      if (!alive) return; requestAnimationFrame(loop);
      if (!vis || document.hidden) return;
      var now = performance.now(), dt = Math.min(.05, (now - last) / 1000); last = now;
      /* adaptive resolution: drop pixel ratio when frames are slow, recover when fast */
      if (dt > .034) { if (++slow > 20 && dpr > 1) { dpr = Math.max(1, dpr - .25); r.setPixelRatio(dpr); slow = 0; } } else if (slow > 0) slow--;
      if (tween) {
        tween.t += dt * 1000 / tween.ms; var k = ease(Math.min(1, tween.t));
        cam.position.lerpVectors(tween.p0, tween.p1, k); ctl.target.lerpVectors(tween.t0, tween.t1, k); if (tween.t >= 1) tween = null;
      }
      ctl.update();
      api.time = (api.time || 0) + dt;
      for (var i = 0; i < api.hooks.length; i++) api.hooks[i](dt, api.time);
      if (hl) { hl.material.opacity = .55 + .35 * Math.sin(api.time * 5); }
      placeLabels();
      r.render(scene, cam);
      if (!api.ready) { api.ready = true; box.classList.add('vk-ready'); window.dispatchEvent(new Event('vk:ready')); }
    }
    loop();
    api.dispose = function () { alive = false; r.dispose(); };
    return api;
  };

  /* ---------- materials ---------- */
  var M = V.mat = {};
  M.std = function (c, m, r, x) { return new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m, roughness: r }, x || {})); };
  M.steel = function (c) { return M.std(c || 0x9aa6b2, .9, .32); };
  M.galv = function () { return M.std(0xa9b3bd, .85, .42); };
  M.alu = function () { return M.std(0xd7dde4, .95, .22); };
  M.copper = function () { return M.std(0xb87333, .95, .28); };
  M.rubber = function () { return M.std(0x15181c, 0, .85); };
  M.porcelain = function (c) { return new T.MeshPhysicalMaterial({ color: c || 0x8a4b2a, roughness: .16, metalness: 0, clearcoat: 1, clearcoatRoughness: .08 }); };
  M.glassy = function (c) { return new T.MeshPhysicalMaterial({ color: c || 0x7dd3fc, roughness: .05, metalness: 0, transmission: 0, transparent: true, opacity: .55, clearcoat: 1 }); };

  function noiseTex(w, h, fn) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); fn(x, w, h);
    var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; t.encoding = T.sRGBEncoding; return t;
  }
  V.noiseTex = noiseTex;
  M.wood = function (base) {
    var tx = noiseTex(256, 512, function (x, w, h) {
      x.fillStyle = base || '#7b5230'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 260; i++) { var px = Math.random() * w, a = Math.random() * .22; x.strokeStyle = 'rgba(' + (Math.random() < .5 ? '40,22,8' : '170,120,70') + ',' + a + ')'; x.lineWidth = .6 + Math.random() * 2.2; x.beginPath(); x.moveTo(px, 0); x.bezierCurveTo(px + 8 * Math.random(), h * .3, px - 8 * Math.random(), h * .6, px + 4 * Math.random(), h); x.stroke(); }
      for (var k = 0; k < 7; k++) { var kx = Math.random() * w, ky = Math.random() * h; x.fillStyle = 'rgba(30,16,6,.45)'; x.beginPath(); x.ellipse(kx, ky, 3 + Math.random() * 5, 8 + Math.random() * 9, 0, 0, 7); x.fill(); }
    });
    return new T.MeshStandardMaterial({ map: tx, roughness: .86, metalness: 0, bumpMap: tx, bumpScale: .6 });
  };
  M.concrete = function (base) {
    var tx = noiseTex(256, 256, function (x, w, h) {
      x.fillStyle = base || '#9aa0a6'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 2600; i++) { var v = 90 + Math.random() * 110 | 0; x.fillStyle = 'rgba(' + v + ',' + v + ',' + (v + 4) + ',' + (Math.random() * .35) + ')'; x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2.4, 1 + Math.random() * 2.4); }
    });
    return new T.MeshStandardMaterial({ map: tx, roughness: .95, metalness: 0, bumpMap: tx, bumpScale: 1.2 });
  };
  M.soil = function () {
    var tx = noiseTex(128, 128, function (x, w, h) { x.fillStyle = '#4a3a2a'; x.fillRect(0, 0, w, h); for (var i = 0; i < 900; i++) { var v = 40 + Math.random() * 60 | 0; x.fillStyle = 'rgba(' + (v + 20) + ',' + v + ',' + (v - 15) + ',.5)'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); } });
    return new T.MeshStandardMaterial({ map: tx, roughness: 1 });
  };

  /* ---------- merged geometry builder: thousands of struts, one draw call ---------- */
  V.Merge = function (material) { this.material = material; this.pos = []; this.nor = []; this.idx = []; this.n = 0; };
  V.Merge.prototype.add = function (geo, matrix) {
    var g = geo.index ? geo : geo, p = g.attributes.position, nm = g.attributes.normal, v = new T.Vector3(), nmat = new T.Matrix3().getNormalMatrix(matrix || new T.Matrix4());
    for (var i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); if (matrix) v.applyMatrix4(matrix); this.pos.push(v.x, v.y, v.z); v.fromBufferAttribute(nm, i).applyMatrix3(nmat).normalize(); this.nor.push(v.x, v.y, v.z); }
    if (g.index) for (i = 0; i < g.index.count; i++) this.idx.push(g.index.getX(i) + this.n); else for (i = 0; i < p.count; i++) this.idx.push(i + this.n);
    this.n += p.count; return this;
  };
  var _box = new T.BoxGeometry(1, 1, 1), _cyl = new T.CylinderGeometry(.5, .5, 1, 10, 1), _up = new T.Vector3(0, 1, 0), _z = new T.Vector3(0, 0, 1);
  var _m = new T.Matrix4(), _q = new T.Quaternion(), _s = new T.Vector3(), _d = new T.Vector3(), _c = new T.Vector3();
  V.Merge.prototype.strut = function (a, b, t, t2) { /* square member from a to b */
    _d.subVectors(b, a); var L = _d.length(); if (L < 1e-5) return this; _q.setFromUnitVectors(_z, _d.normalize());
    _c.addVectors(a, b).multiplyScalar(.5); _s.set(t, t2 || t, L); _m.compose(_c, _q, _s); return this.add(_box, _m.clone());
  };
  V.Merge.prototype.rod = function (a, b, d) { /* round member from a to b */
    _d.subVectors(b, a); var L = _d.length(); if (L < 1e-5) return this; _q.setFromUnitVectors(_up, _d.normalize());
    _c.addVectors(a, b).multiplyScalar(.5); _s.set(d, L, d); _m.compose(_c, _q, _s); return this.add(_cyl, _m.clone());
  };
  V.Merge.prototype.box = function (x, y, z, w, h, d, ry) { _q.setFromAxisAngle(_up, ry || 0); _m.compose(_c.set(x, y, z), _q, _s.set(w, h, d)); return this.add(_box, _m.clone()); };
  V.Merge.prototype.geo = function (g, x, y, z, rx, ry, rz, sx, sy, sz) {
    var m = new T.Matrix4().compose(new T.Vector3(x || 0, y || 0, z || 0), new T.Quaternion().setFromEuler(new T.Euler(rx || 0, ry || 0, rz || 0)), new T.Vector3(sx || 1, sy == null ? (sx || 1) : sy, sz == null ? (sx || 1) : sz)); return this.add(g, m);
  };
  V.Merge.prototype.mesh = function () {
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(this.pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(this.nor, 3));
    g.setIndex(this.n > 65000 ? new T.Uint32BufferAttribute(this.idx, 1) : new T.Uint16BufferAttribute(this.idx, 1)); g.computeBoundingSphere();
    var m = new T.Mesh(g, this.material); return m;
  };

  V.v3 = function (x, y, z) { return new T.Vector3(x, y, z); };
  /* sagging conductor between two points */
  V.wire = function (a, b, sag, rad, mat, seg) {
    seg = seg || 24; var pts = [];
    for (var i = 0; i <= seg; i++) { var t = i / seg; pts.push(new T.Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t - 4 * sag * t * (1 - t), a.z + (b.z - a.z) * t)); }
    return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), seg * 2, rad || .03, 6, false), mat || M.alu());
  };
  /* lathe-turned part from [r,y] pairs */
  V.lathe = function (prof, mat, seg) { return new T.Mesh(new T.LatheGeometry(prof.map(function (p) { return new T.Vector2(p[0], p[1]); }), seg || 40), mat); };
  /* ribbed porcelain post/pin insulator along +Y from y0; returns Group */
  V.postInsulator = function (h, rBase, sheds, mat) {
    var pr = [[0, 0], [rBase * .8, 0], [rBase * .8, h * .03]], n = sheds || 6, k;
    for (k = 0; k < n; k++) {
      var y = h * (.06 + .9 * k / n), step = h * .9 / n, rr = rBase * (1.25 + .25 * (k % 2)), core = rBase * .8;
      pr.push([core, y], [rr, y + step * .12], [rr * .96, y + step * .2], [core * 1.08, y + step * .4], [core, y + step * .55]);
    }
    pr.push([rBase * .8, h * .97], [rBase * .7, h], [0, h]);
    return V.lathe(pr, mat || M.porcelain(), 36);
  };
  V.disc = function (r, mat) { return V.lathe([[0, .05], [r * .22, .05], [r * .3, .02], [r * .75, -.02], [r, -.03], [r * 1.0, -.07], [r * .88, -.09], [r * .55, -.07], [r * .32, -.05], [r * .2, -.09], [0, -.09]], mat, 32); };
  /* disc suspension string hanging down from origin. Returns { group, len } */
  V.string = function (n, r, mat, metal) {
    var g = new T.Group(), mg = new V.Merge(metal || M.galv()), step = r * .5, y = 0;
    mg.geo(new T.CylinderGeometry(.05, .05, .16, 10), 0, -.08, 0); y = -.16;
    for (var i = 0; i < n; i++) { var d = V.disc(r, mat); d.position.y = y - .06; g.add(d); mg.geo(new T.CylinderGeometry(.03, .035, step, 8), 0, y - step * .5, 0); y -= step; }
    mg.geo(new T.SphereGeometry(.08, 12, 8), 0, y - .04, 0); mg.geo(new T.BoxGeometry(.1, .16, .06), 0, y - .14, 0);
    g.add(mg.mesh()); g.userData.len = -y + .22; return g;
  };
  V.loaderDone = function () { var l = document.querySelector('.vk-load'); if (l) { l.classList.add('done'); setTimeout(function () { l.remove(); }, 600); } };
  V.setProgress = function (p, txt) { var b = document.querySelector('.vk-load .bar i'); if (b) b.style.width = Math.round(p * 100) + '%'; var t = document.querySelector('.vk-load small'); if (t && txt) t.textContent = txt; };
  V.nextFrame = function () { return new Promise(function (r) { requestAnimationFrame(function () { setTimeout(r, 0); }); }); };
})();
