/* Diodes and transistors: junction cutaways. 1 unit = 1 mm (scaled up, schematic). update(v 0..1, time, mode). */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI, seg = K.seg;
  var cP = M(0xdc4a4a, .1, .5), cN = M(0x3b6fe0, .1, .5), cPp = M(0xb83232, .1, .5), cNp = M(0x2550b8, .1, .5), cNm = M(0x6a95ee, .1, .5, { transparent: true, opacity: .8 });
  var eM = M(0x60a5fa, 0, .3, { emissive: 0x60a5fa, emissiveIntensity: 1.4 }), hM = M(0xfb7185, 0, .3, { emissive: 0xfb7185, emissiveIntensity: 1.4 });
  function dots(g, n, m, r) { var a = []; for (var i = 0; i < n; i++) { var d = new T.Mesh(new T.SphereGeometry(r || .09, 8, 6), m); d.userData.o = Math.random(); d.userData.j = Math.random() * 6.28; g.add(d); a.push(d); } return a; }
  function run(a, vis, time, p0, p1, spd) { var n = Math.round(a.length * vis); a.forEach(function (d, i) { d.visible = i < n; if (!d.visible) return; var u = ((time * spd + d.userData.o) % 1 + 1) % 1; d.position.set(p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u + Math.sin(d.userData.j + time * 3) * .12 * 0 + (d.userData.o - .5) * (p1[3] || 1.6), p0[2] + (p1[2] - p0[2]) * u + (d.userData.j / 6.28 - .5) * 1.6); }); }
  function lab(g, s, x, y, z, col, w) { var t = K.txt(s, w || 1.2, .5, null, x, y, z, g, col || '#fff', 56); return t; }
  function lead(g, x, dir) { var l = cyl(.12, 2.2, k.steel, x + dir * 1.1, 0, 0, g, 10); l.rotation.z = PI / 2; return l; }

  /* ---------- PN diode family ---------- */
  function pn(opt) {
    var root = G(); var p = box(2.6, 2.6, 2.8, cP, -1.3, 0, 0, root), n = box(2.6, 2.6, 2.8, cN, 1.3, 0, 0, root); box(.25, 2.6, 2.8, k.steel, -2.7, 0, 0, root); box(.25, 2.6, 2.8, k.steel, 2.7, 0, 0, root); lead(root, -2.8, -1); lead(root, 2.8, 1);
    lab(root, 'P', -1.3, 0, 1.45); lab(root, 'N', 1.3, 0, 1.45); lab(root, 'Anode +', -3.6, 1.0, 0, '#fca5a5', 1.8); lab(root, 'Cathode −', 3.6, 1.0, 0, '#93c5fd', 1.8);
    var dep = box(1, 2.62, 2.82, new T.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: .4, depthWrite: false }), 0, 0, 0, root); var ee = dots(root, 22, eM), hh = dots(root, 22, hM);
    var photons = null, glow = null, dome = null;
    if (opt.led) { dome = new T.Mesh(new T.SphereGeometry(2.1, 24, 14, 0, PI * 2, 0, PI / 2), K.ghost(0xf87171, .35)); dome.position.set(0, 1.3, 0); root.add(dome); glow = new T.PointLight(0xff3b3b, 0, 12); glow.position.set(0, 3, 0); root.add(glow); photons = []; var pm = new T.MeshBasicMaterial({ color: 0xffd0d0, transparent: true }); for (var i = 0; i < 16; i++) { var s = new T.Mesh(new T.SphereGeometry(.07, 6, 5), pm); s.userData.a = i; root.add(s); photons.push(s); } }
    root.position.y = 1.6; root.rotation.y = -.35;
    var parts = { p: PART(p, 'P-type region (holes)', 5), n: PART(n, 'N-type region (electrons)', 5), dep: PART(dep, 'Depletion region', 5) };
    return { group: root, tick: true, parts: parts, update: function (v, time, mode) {
      var fw = mode !== 'rev', th = opt.th, cur, w;
      if (fw) { cur = seg(v, th, th + .3); w = 1.5 * (1 - Math.min(1, v / th) * .85); } else { var bd = opt.bd; cur = bd ? seg(v, bd, bd + .12) : 0; w = 1.5 * (1 + Math.min(v, bd || 1) * (bd ? 2.2 : 1.6)); }
      dep.scale.x = Math.max(.08, w); dep.material.opacity = .15 + .3 * (w / 3.2);
      var dirE = fw ? [[2.5, 0, 0], [-2.5, 0, 0]] : [[2.5, 0, 0], [-2.5, 0, 0]]; run(ee, cur, time, [2.5, 0, 0], [-2.5, 0, 0], .35 + cur * .5); run(hh, cur, time, [-2.5, 0, 0], [2.5, 0, 0], .35 + cur * .5); if (!fw && !opt.bd) { ee.concat(hh).forEach(function (d) { d.visible = false; }); }
      if (photons) { photons.forEach(function (s, i) { var u = ((time * .8 + i / 16) % 1), a = i / 16 * PI * 2; s.visible = fw && cur > .03; s.position.set(Math.cos(a) * u * 2.6 * .8, .2 + u * 3.6, Math.sin(a) * u * 2.6 * .8); s.material.opacity = (1 - u) * cur; }); glow.intensity = fw ? cur * 6 : 0; dome.material.opacity = .25 + .3 * (fw ? cur : 0); dome.material.color.setHex(fw && cur > .1 ? 0xff6b6b : 0xf87171); }
    } };
  }
  B.rect = function () { return pn({ th: .55 }); };
  B.zener = function () { return pn({ th: .55, bd: .5 }); };
  B.led = function () { return pn({ th: .62, led: true }); };

  /* ---------- BJT (NPN) ---------- */
  B.bjt = function () {
    var root = G(), e = box(2.8, 2.6, 2.8, cNp, -2.3, 0, 0, root), b = box(.7, 2.6, 2.8, cP, -.55, 0, 0, root), c = box(3.2, 2.6, 2.8, cN, 1.65, 0, 0, root);
    box(.2, 2.6, 2.8, k.steel, -3.8, 0, 0, root); box(.2, 2.6, 2.8, k.steel, 3.3, 0, 0, root); var bc = box(.5, .3, 1.2, k.steel, -.55, 1.45, 0, root); lead(root, -3.9, -1); lead(root, 3.4, 1); var bl = cyl(.12, 1.8, k.steel, -.55, 2.4, 0, root, 10);
    lab(root, 'E  N+', -2.3, 0, 1.45); lab(root, 'B', -.55, 0, 1.45, '#fecaca', .8); lab(root, 'C  N', 1.65, 0, 1.45); lab(root, 'Emitter', -4.9, 1, 0, '#93c5fd', 1.8); lab(root, 'Collector', 4.6, 1, 0, '#93c5fd', 2); lab(root, 'Base', -.55, 3.7, 0, '#fecaca', 1.4);
    var dep = box(.6, 2.62, 2.82, new T.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: .3, depthWrite: false }), .6, 0, 0, root); var ee = dots(root, 26, eM), bb = dots(root, 8, hM);
    root.position.y = 1.6; root.rotation.y = -.35;
    return { group: root, tick: true, parts: { e: PART(e, 'Emitter: heavily doped N+', 5), b: PART(b, 'Base: thin P layer', 5), c: PART(c, 'Collector: wide N region', 5), dep: PART(dep, 'Collector-base depletion region', 5) }, update: function (v, time) {
      var ic = v < .4 ? 0 : Math.min(1, Math.pow((v - .4) / .4, 1.6)), ib = seg(v, .4, 1) * .8; dep.scale.x = Math.max(.3, 1.2 - ic * .6); run(ee, ic, time, [-3.6, 0, 0], [3.2, 0, 0], .4 + ic * .5); run(bb, ib, time, [-.55, 3.2, 0], [-.55, .2, 0], .5);
    } };
  };

  /* ---------- MOSFET (N-channel enhancement) ---------- */
  B.mosfet = function () {
    var root = G(), sub = box(8, 1.8, 3.0, cP, 0, -.9, 0, root), s = box(2.0, .9, 3.0, cNp, -3, .45, 0, root), d = box(2.0, .9, 3.0, cNp, 3, .45, 0, root);
    var ox = box(4, .22, 3.0, K.ghost(0xe5e7eb, .55), 0, .11 + .0, 0, root); ox.position.y = 1.0; var gate = box(3.8, .5, 3.0, k.alu, 0, 1.36, 0, root); box(1.6, .3, 3.0, k.steel, -3, 1.05, 0, root); box(1.6, .3, 3.0, k.steel, 3, 1.05, 0, root); box(8, .3, 3.0, k.steel, 0, -2.05, 0, root);
    var ch = box(4, .35, 2.9, new T.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0, depthWrite: false }), 0, .78, 0, root); var dep = box(4.3, .9, 2.9, new T.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: .2, depthWrite: false }), 0, .2, 0, root);
    lab(root, 'n+', -3, .45, 1.55, '#bfdbfe', .9); lab(root, 'n+', 3, .45, 1.55, '#bfdbfe', .9); lab(root, 'p-substrate', 0, -.9, 1.55, '#fecaca', 2.4); lab(root, 'Source', -3, 2.7, 0, '#93c5fd', 1.8); lab(root, 'Gate', 0, 2.7, 0, '#fde68a', 1.4); lab(root, 'Drain', 3, 2.7, 0, '#93c5fd', 1.8); lab(root, 'SiO₂ insulator', 0, 1.0, 1.55, '#e5e7eb', 2.4);
    [-3, 0, 3].forEach(function (x) { cyl(.1, 1.0, k.steel, x, 2.1, 0, root, 8); }); var ee = dots(root, 24, eM), gp = dots(root, 8, hM, .07);
    root.position.y = 2.3; root.rotation.y = -.35;
    return { group: root, tick: true, parts: { s: PART(s, 'Source (n+)', 5), d: PART(d, 'Drain (n+)', 5), gate: PART(gate, 'Gate: metal over insulator', 5), ch: PART(ch, 'Induced N-channel', 5), sub: PART(sub, 'P-type substrate', 6) }, update: function (v, time) {
      var on = v < .4 ? 0 : Math.pow((v - .4) / .6, 1.0); ch.material.opacity = seg(v, .35, .6) * .75; ch.scale.y = .4 + on * 1.4; dep.material.opacity = .2 + .15 * seg(v, .1, .4); gate.material.emissive = gate.material.emissive || new T.Color(0); run(ee, on, time, [-3.2, .78, 0], [3.2, .78, 0], .4 + on * .6); run(gp, seg(v, .05, .4) * .6, time, [0, 1.9, 0], [0, 1.35, 0], .6);
    } };
  };

  /* ---------- IGBT ---------- */
  B.igbt = function () {
    var root = G(); var col = box(6.4, .8, 3, cPp, 0, -3.1, 0, root), drift = box(6.4, 3.4, 3, cNm, 0, -1.0, 0, root), buf = box(6.4, .5, 3, cNp, 0, -2.6, 0, root);
    [-2.1, 2.1].forEach(function (x) { box(1.7, 1.1, 3, cP, x, 1.25, 0, root); box(.9, .6, 3, cNp, x - .1 * Math.sign(x), 1.4, 0, root); }); box(6.4, .3, 3, k.steel, 0, -3.65, 0, root); var ox = box(1.6, .5, 3, K.ghost(0xe5e7eb, .6), 0, 1.0, 0, root), gate = box(1.4, .45, 3, k.alu, 0, 1.45, 0, root); box(1.0, .3, 3, k.steel, -2.1, 1.95, 0, root); box(1.0, .3, 3, k.steel, 2.1, 1.95, 0, root);
    var ch = [-1, 1].map(function (s) { return box(.18, 1.0, 2.9, new T.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0, depthWrite: false }), s * .7, 1.0, 0, root); });
    lab(root, 'p+ collector', 0, -3.1, 1.55, '#fecaca', 2.6); lab(root, 'n− drift', 0, -.6, 1.55, '#bfdbfe', 2.2); lab(root, 'p body', -2.1, 1.25, 1.55, '#fecaca', 1.4); lab(root, 'p body', 2.1, 1.25, 1.55, '#fecaca', 1.4); lab(root, 'Emitter', -2.1, 3.2, 0, '#93c5fd', 1.8); lab(root, 'Gate', 0, 3.0, 0, '#fde68a', 1.4); lab(root, 'Collector', 0, -4.7, 0, '#93c5fd', 2);
    var ee = dots(root, 22, eM), hh = dots(root, 22, hM);
    root.position.y = 4.8; root.rotation.y = -.35;
    return { group: root, tick: true, parts: { col: PART(col, 'P+ collector: injects holes', 6), drift: PART(drift, 'N− drift region', 6), body: PART(root.children[3], 'P body with N+ emitter', 6), gate: PART(gate, 'Insulated gate', 6) }, update: function (v, time) {
      var on = v < .4 ? 0 : Math.pow((v - .4) / .6, 1.2); ch.forEach(function (c) { c.material.opacity = seg(v, .35, .6) * .8; }); drift.material.opacity = .8 - .4 * on; drift.material.emissive && drift.material.emissive.setRGB(.08 * on, .35 * on, .6 * on); run(ee, on, time, [-.9, 1.4, 0], [-.9, -3.4, 0], .4 + on * .5); run(hh, on * .9, time, [0, -3.4, 0], [0, 1.0, 0], .35 + on * .4);
    } };
  };
})();
