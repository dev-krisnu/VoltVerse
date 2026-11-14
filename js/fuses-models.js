/* Fuses: element melting under overload / short-circuit. 1 unit = 10 mm. update(t, time, mode). */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI, seg = K.seg;
  function st(t, mode) { var ol = mode === 'ol', melt = ol ? seg(t, .72, .8) : seg(t, .1, .17); return { melt: melt, glow: (ol ? seg(t, 0, .75) : seg(t, 0, .1)) * (1 - melt * .6), arc: melt * (1 - seg(t, ol ? .86 : .3, ol ? .97 : .5)), done: seg(t, ol ? .86 : .3, ol ? .97 : .5), cur: 1 - melt }; }
  function arcMat() { return new T.MeshBasicMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0, depthWrite: false }); }
  /* element built along x between xa and xb at (y,z). returns {g, halves:[l,r], neck, setGap} */
  function element(xa, xb, y, z, w, th, hm, notches) {
    var g = G(), mid = (xa + xb) / 2, L = G(), R = G(); box(mid - xa - .2, th, w, hm, (xa + mid - .2) / 2, y, z, L); box(xb - mid - .2, th, w, hm, (xb + mid + .2) / 2, y, z, R);
    var neck = box(.5, th, w * .3, hm, mid, y, z, g); (notches || []).forEach(function (nx) { box(.25, th, w * .35, hm, nx, y, z, g); });
    g.add(L, R); return { g: g, L: L, R: R, neck: neck, set: function (melt) { var gap = melt * .5; L.position.x = -gap; R.position.x = gap; neck.visible = melt < .05; } };
  }
  function arcs(g, xs, y, z, am) { return xs.map(function (x) { var a = new T.Mesh(new T.SphereGeometry(.28, 12, 10), am); a.position.set(x, y, z); a.visible = false; g.add(a); return a; }); }
  function setArcs(list, s, time) { list.forEach(function (a) { a.visible = s.arc > .02; a.scale.setScalar(.5 + s.arc * (1 + .3 * Math.sin(time * 80))); a.material.opacity = s.arc * .9; }); }
  function leadFlow(pts, g) { var f = K.flow(pts, 0xfde047, 14, .09); g.add(f.group); return f; }

  B.hrc = function () {
    var root = G(), hm = M(0xe3e8ee, 1, .15, { emissive: 0xff5a00, emissiveIntensity: 0 }), am = arcMat();
    var body = cyl(1.6, 8.0, K.ghost(0xe7dccb, .3, { side: T.DoubleSide }), 0, 0, 0, root, 36); body.rotation.z = PI / 2;
    var sand = cyl(1.38, 7.8, M(0xd9c79a, 0, .95, { transparent: true, opacity: .55 }), 0, 0, 0, root, 24); sand.rotation.z = PI / 2;
    var caps = G(); [-4.1, 4.1].forEach(function (x) { var c = cyl(1.7, .5, k.brass, x, 0, 0, caps, 36); c.rotation.z = PI / 2; var b = cyl(1.0, .2, k.brass, x * 1.04, 0, 0, caps, 24); b.rotation.z = PI / 2; }); root.add(caps);
    var els = [], notchX = [-2.2, -1.1, 0, 1.1, 2.2]; [[.7, .7], [-.7, .7], [.7, -.7], [-.7, -.7]].forEach(function (p) { var e = element(-3.9, 3.9, p[0], p[1], .55, .06, hm, [-2.6, 2.6]); root.add(e.g); els.push(e); });
    var ar = []; els.forEach(function (e, i) { var y = i % 2 ? -.7 : .7, z = i < 2 ? .7 : -.7; ar = ar.concat(arcs(root, [0], y, z, am)); });
    var striker = G(); striker.position.set(4.3, 0, 0); cyl(.14, 1.0, k.red, .5, 0, 0, striker, 10).rotation.z = PI / 2; root.add(striker); var ind = box(.4, .4, .4, K.glowM(0xef4444, 0), 4.45, 1.4, 0, root);
    var fl = leadFlow([[-4.8, 0, 0], [-3.9, 0, 0], [3.9, 0, 0], [4.8, 0, 0]], root); K.txt('HRC 63 A  500 V  120 kA', 5.6, .8, null, 0, 0, 1.75, root, '#4b3b2a', 40);
    root.rotation.y = -.5; root.position.y = 2.2;
    return { group: root, tick: true, parts: { body: PART(body, 'Ceramic body', 7), sand: PART(sand, 'Quartz sand filling', 7), caps: PART(caps, 'End caps (brass)', 7), el: PART(els[0].g, 'Silver element with notches', 6), striker: PART(striker, 'Striker pin', 5) },
      update: function (t, time, mode) { var s = st(t, mode); hm.emissiveIntensity = s.glow * 2.4; els.forEach(function (e) { e.set(s.melt); }); setArcs(ar, s, time); sand.material.color.setHex(s.done > .3 ? 0x8a7a55 : 0xd9c79a); striker.position.x = 4.3 + s.melt * .8; ind.material.emissiveIntensity = s.melt > .5 ? 2 : 0; fl.update(time, .5 + (mode === 'sc' ? 1 : 0), s.cur); } };
  };
  B.rewire = function () {
    var root = G(), hm = M(0xd8dde3, .9, .3, { emissive: 0xff5a00, emissiveIntensity: 0 }), am = arcMat();
    var base = box(8, 1.2, 4.6, k.white, 0, -.6, 0, root); box(8.2, .2, 4.8, k.ceramic, 0, .0, 0, root); var carrier = G(); box(7, 2.6, 3.4, K.ghost(0xf4f1ea, .55), 0, 1.5, 0, carrier); box(2.2, 1.6, 3.4, k.white, 0, 3.4, 0, carrier); box(1.2, .8, 1.0, k.red, 0, 4.5, 0, carrier); root.add(carrier);
    var tms = G(); [-2.8, 2.8].forEach(function (x) { box(1.0, .9, 1.0, k.brass, x, 1.1, 0, tms); cyl(.28, .5, k.steel, x, 1.8, 0, tms, 14); }); root.add(tms);
    var e = element(-2.8, 2.8, 1.35, 0, .08, .08, hm); root.add(e.g); var ar = arcs(root, [0], 1.35, 0, am); var fl = leadFlow([[-4, 1.0, 0], [-2.8, 1.35, 0], [2.8, 1.35, 0], [4, 1.0, 0]], root);
    K.txt('15 A', 1.6, .6, null, 0, 3.4, 1.75, root, '#111827', 52); K.txt('REWIREABLE', 4, .5, null, 0, 1.4, 2.0, root, '#6b7280', 36);
    root.rotation.y = -.5; root.position.y = 1.4;
    return { group: root, tick: true, parts: { base: PART(base, 'Porcelain base', 7), carrier: PART(carrier, 'Removable carrier', 6), tms: PART(tms, 'Terminals with screws', 6), wire: PART(e.g, 'Tinned-copper fuse wire', 6) },
      update: function (t, time, mode) { var s = st(t, mode); hm.emissiveIntensity = s.glow * 2.4; e.set(s.melt); e.g.position.y = -s.glow * .05; setArcs(ar, s, time); fl.update(time, .4 + (mode === 'sc' ? 1 : 0), s.cur); } };
  };
  B.blade = function () {
    var root = G(), hm = M(0xcfd5db, .9, .3, { emissive: 0xff5a00, emissiveIntensity: 0 }), am = arcMat();
    var body = box(3.6, 3.4, .9, K.ghost(0xd62828, .78), 0, 0, 0, root); box(3.6, .5, 1.1, K.ghost(0xd62828, .9), 0, 1.45, 0, root); [-.7, .7].forEach(function (x) { box(.5, 1.8, .2, k.steel, x, -2.5, 0, root); });
    var e = G(); var hm2 = hm; var l = box(.3, 2.2, .16, hm, -.7, -.5, 0, e), r = box(.3, 2.2, .16, hm, .7, -.5, 0, e); var top = box(1.1, .3, .16, hm, 0, .8, 0, e); var neck = box(.3, .3, .16, hm, 0, .8, 0, e); e.rotation.x = 0; root.add(e);
    var ar = arcs(root, [0], .8, 0, am); var fl = leadFlow([[-.7, -3.4, 0], [-.7, .8, 0], [.7, .8, 0], [.7, -3.4, 0]], root); K.txt('10', 1.4, .9, null, 0, -.2, .5, root, '#fff', 90);
    root.rotation.set(0, -.5, 0); root.scale.setScalar(1.4); root.position.y = 4.4;
    return { group: root, tick: true, parts: { body: PART(body, 'Plastic body (colour = rating)', 6), blades: PART(root.children[2], 'Blade terminals', 6), el: PART(e, 'Zinc element seen through the window', 5) },
      update: function (t, time, mode) { var s = st(t, mode); hm.emissiveIntensity = s.glow * 2.4; top.position.x = 0; neck.visible = s.melt < .05; top.scale.x = 1 - s.melt * .0; top.visible = s.melt < .05; l.position.y = -.5 - s.melt * .15; r.position.y = -.5 - s.melt * .15; setArcs(ar, s, time); fl.update(time, .5 + (mode === 'sc' ? 1 : 0), s.cur); body.material.opacity = .78 - s.done * .12; } };
  };
  B.glass = function () {
    var root = G(), hm = M(0xd8dde3, .9, .3, { emissive: 0xff5a00, emissiveIntensity: 0 }), am = arcMat(); var tubeM = K.ghost(0xe7f1f5, .28, { side: T.DoubleSide });
    var tube = cyl(1.2, 8.6, tubeM, 0, 0, 0, root, 36); tube.rotation.z = PI / 2; var caps = G(); [-4.6, 4.6].forEach(function (x) { var c = cyl(1.3, 1.5, k.alu, x * .98, 0, 0, caps, 30); c.rotation.z = PI / 2; }); root.add(caps);
    var e = element(-3.9, 3.9, 0, 0, .06, .06, hm); root.add(e.g); var ar = arcs(root, [0], 0, 0, am); var soot = cyl(1.18, 7, M(0x0b0b0b, 0, 1, { transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide }), 0, 0, 0, root, 24); soot.rotation.z = PI / 2; var fl = leadFlow([[-5.2, 0, 0], [-3.9, 0, 0], [3.9, 0, 0], [5.2, 0, 0]], root);
    K.txt('F 2A L 250V', 4.6, .7, null, 0, 0, 1.45, root, '#111827', 40).visible = false; var spring = K.helixX(.5, 6, 12, .035, hm); spring.visible = false; root.add(spring);
    root.rotation.y = -.5; root.position.y = 1.6;
    return { group: root, tick: true, parts: { tube: PART(tube, 'Glass tube', 7), caps: PART(caps, 'Metal end caps', 7), el: PART(e.g, 'Thin fuse wire', 5) },
      update: function (t, time, mode) { var s = st(t, mode); hm.emissiveIntensity = s.glow * 2.4; e.set(s.melt); e.g.position.y = -s.glow * .08; setArcs(ar, s, time); soot.material.opacity = s.done * (mode === 'sc' ? .85 : .35); fl.update(time, .5 + (mode === 'sc' ? 1 : 0), s.cur); } };
  };
})();
