/* Cables: layered cutaways. Cable axis = z, length 14. update(e, time) peels the layers back. */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI;
  var L = 14, Z0 = -7;
  /* layer: wrapper scaled/positioned along z so that its right end is at z1 */
  function tubeLayer(g, ro, ri, m, label) { var w = G(), geo = new T.CylinderGeometry(ro, ro, L, 40, 1, true), o = new T.Mesh(geo, m); o.rotation.x = PI / 2; var inn = new T.Mesh(new T.CylinderGeometry(ri, ri, L, 40, 1, true), m); inn.rotation.x = PI / 2; var cap = new T.Mesh(new T.RingGeometry(ri, ro, 40), m); cap.position.z = L / 2; cap.userData.cap = 1; w.add(o, inn, cap); g.add(w); return w; }
  function fill(g, r, m) { var w = G(), o = new T.Mesh(new T.CylinderGeometry(r, r, L, 36), m); o.rotation.x = PI / 2; var cap = new T.Mesh(new T.CircleGeometry(r, 36), m); cap.position.z = L / 2; w.add(o, cap); g.add(w); return w; }
  function place(w, z1, hasCap) { var len = z1 - Z0; w.scale.z = Math.max(.001, len / L); w.position.z = Z0 + len / 2; }
  function strands(g, n, rc, rs, m, ring) { var w = G(); if (ring) { var c = cyl(rs, L, m, 0, 0, 0, w, 8); c.rotation.x = PI / 2; for (var i = 0; i < n; i++) { var a = i / n * PI * 2, s = cyl(rs, L, m, Math.cos(a) * rc, Math.sin(a) * rc, 0, w, 8); s.rotation.x = PI / 2; } } else { for (var j = 0; j < n; j++) { var a2 = j / n * PI * 2, s2 = cyl(rs, L, m, Math.cos(a2) * rc, Math.sin(a2) * rc, 0, w, 8); s2.rotation.x = PI / 2; } } g.add(w); return w; }
  function wrap(g, n, rr, rs, m) { return strands(g, n, rr, rs, m, false); }
  var pvc = function (c) { return M(c, 0, .6, { side: T.DoubleSide }); };
  var colors = { br: 0x8b4a1f, bl: 0x1d6bd8, gy: 0x2d8a3e, blk: 0x15171c, grey: 0x8a8f98 };
  function cond(g, r, n) { return strands(g, n || 7, r * .65, r * .3, k.cu, true); }
  /* each layer = { w, z1 (right end when peeled), label } ; update sets z positions between 7 and z1 */
  function mk(layers) { var hi = -1e9, lo = 1e9; layers.forEach(function (l) { hi = Math.max(hi, l.peel); lo = Math.min(lo, l.peel); }); return function (e) { layers.forEach(function (l) { place(l.w, 7 - e * 8.2 * (hi - l.peel) / (hi - lo)); }); }; }

  B.single = function () {
    var root = G(), ls = []; var c = cond(root, 1.0, 7); var ins = tubeLayer(root, 1.7, 1.02, pvc(colors.br)); var sh = tubeLayer(root, 2.0, 1.72, pvc(colors.blk));
    ls = [{ w: c, peel: 12.5 }, { w: ins, peel: 9 }, { w: sh, peel: 5 }]; var f = mk(ls); f(0);
    root.position.y = 2.1; root.rotation.y = -.75; root.rotation.x = .08;
    return { group: root, parts: { cond: PART(c, 'Stranded copper conductor', 7), ins: PART(ins, 'PVC insulation', 6), sh: PART(sh, 'Outer PVC sheath', 6) }, update: function (e) { f(e); } };
  };
  B.multi = function () {
    var root = G(), cs = [], ins = [], pos = [[0, 0.98], [.85, -.55], [-.85, -.55]], cc = [colors.br, colors.bl, colors.gy];
    var cores = G(); pos.forEach(function (p, i) { var one = G(); one.position.set(p[0], p[1], 0); var cw = strands(one, 18, .38, .06, k.cu, true), iw = tubeLayer(one, .72, .43, pvc(cc[i])); if (i === 2) { var st = tubeLayer(one, .72, .62, pvc(0xe8d21e)); cs.push({ w: st, peel: 8.6 + i * .6 }); } cores.add(one); cs.push({ w: cw, peel: 12.2 - i * .5 }); cs.push({ w: iw, peel: 8.6 + i * .6 }); }); root.add(cores);
    var fillr = fill(root, 1.3, M(0x3a3d44, 0, .9)); var sh = tubeLayer(root, 1.95, 1.7, pvc(0xe5e7eb)); cs.push({ w: fillr, peel: 6 }, { w: sh, peel: 4.4 }); var f = mk(cs); f(0);
    root.position.y = 2.1; root.rotation.y = -.75; root.rotation.x = .08; root.scale.setScalar(1.15);
    return { group: root, parts: { cores: PART(cores, 'Three insulated cores (L, N, E)', 7), fill: PART(fillr, 'Filler', 6), sh: PART(sh, 'Outer PVC sheath', 6) }, update: function (e) { f(e); } };
  };
  B.armoured = function () {
    var root = G(), cs = [], pos = [[0, .85], [.74, -.43], [-.74, -.43]], cc = [colors.br, colors.blk, colors.grey]; var cores = G();
    pos.forEach(function (p, i) { var one = G(); one.position.set(p[0], p[1], 0); var cw = strands(one, 7, .3, .13, k.cu, true), iw = tubeLayer(one, .62, .46, pvc(cc[i])); cores.add(one); cs.push({ w: cw, peel: 13 - i * .5 }, { w: iw, peel: 10.5 - i * .5 }); }); root.add(cores);
    var bed = tubeLayer(root, 1.52, 1.12, pvc(0x2b2f36)), fillr = fill(root, 1.2, M(0x2b2f36, 0, .9)); var arm = wrap(root, 24, 1.62, .13, k.steel), sh = tubeLayer(root, 2.0, 1.78, pvc(colors.blk)); cs.push({ w: fillr, peel: 9 }, { w: bed, peel: 8.2 }, { w: arm, peel: 6.6 }, { w: sh, peel: 4.4 }); var f = mk(cs); f(0);
    root.position.y = 2.1; root.rotation.y = -.75; root.rotation.x = .08; root.scale.setScalar(1.15);
    return { group: root, parts: { cores: PART(cores, 'Three insulated cores', 7), bed: PART(bed, 'Bedding', 6), arm: PART(arm, 'Steel wire armour', 6), sh: PART(sh, 'Outer sheath', 6) }, update: function (e) { f(e); } };
  };
  B.xlpe = function () {
    var root = G(), cs = []; var c = cond(root, 1.1, 19), cscr = tubeLayer(root, 1.3, 1.12, pvc(0x2b2f36)), ins = tubeLayer(root, 2.2, 1.32, M(0xe8e4d8, 0, .6, { side: T.DoubleSide })), iscr = tubeLayer(root, 2.4, 2.22, pvc(0x2b2f36)), tape = tubeLayer(root, 2.55, 2.42, M(0xc87b3e, .9, .3, { side: T.DoubleSide })), bed = tubeLayer(root, 2.7, 2.56, pvc(0x6b7280)), sh = tubeLayer(root, 3.0, 2.72, pvc(0xd62828));
    cs = [{ w: c, peel: 13 }, { w: cscr, peel: 12 }, { w: ins, peel: 10.6 }, { w: iscr, peel: 8.6 }, { w: tape, peel: 7.6 }, { w: bed, peel: 6.4 }, { w: sh, peel: 4.6 }]; var f = mk(cs); f(0);
    root.position.y = 2.3; root.rotation.y = -.75; root.rotation.x = .08; root.scale.setScalar(.95);
    return { group: root, parts: { cond: PART(c, 'Stranded conductor (copper or aluminium)', 8), cscr: PART(cscr, 'Conductor screen', 8), ins: PART(ins, 'XLPE insulation', 8), iscr: PART(iscr, 'Insulation screen', 8), tape: PART(tape, 'Copper tape screen', 8), sh: PART(sh, 'Outer sheath', 8) }, update: function (e) { f(e); } };
  };
})();
