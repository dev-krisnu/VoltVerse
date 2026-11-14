/* AC to DC converters. 1 unit = 10 mm. update(e, time, mode): e = power on (0..1), mode = stage id that is highlighted. */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI;
  var hotM = new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: .0, depthWrite: false });
  function hot(g, regs) { return regs.map(function (r) { var m = new T.Mesh(new T.BoxGeometry(r[3], r[4], r[5]), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, depthWrite: false })); m.position.set(r[0], r[1], r[2]); m.renderOrder = 5; g.add(m); return m; }); }
  function diode(g, x, y, z, rot, len) { var d = G(), body = cyl(.22, len || .9, M(0x15171c, .1, .6), 0, 0, 0, d, 14); cyl(.23, .12, k.white, len ? len * .3 : .3, 0, 0, d, 14); body.rotation.z = PI / 2; d.children[1].rotation.z = PI / 2; d.children[1].position.x = (len || .9) * .35; cyl(.04, 1.6, k.steel, 0, 0, 0, d, 6).rotation.z = PI / 2; d.rotation.y = rot || 0; d.position.set(x, y, z); g.add(d); return d; }
  function ecap(g, x, y, z, r, h, col) { var c = G(); cyl(r, h, M(col || 0x1d4ed8, .3, .5), 0, h / 2, 0, c, 28); cyl(r * .98, .02, k.alu, 0, h + .01, 0, c, 28); box(r * .3, h * .95, .04, k.white, r * .96, h / 2, 0, c); c.position.set(x, y, z); g.add(c); return c; }
  function pcb(g, w, d, col) { var b = box(w, .22, d, col || k.pcb, 0, 0, 0, g); box(w - .2, .02, d - .2, M(0x1f6b3a, .2, .5), 0, .12, 0, g); return b; }
  function ic(g, x, y, z, w, d, n) { var c = G(); box(w, .22, d, k.black, 0, .11, 0, c); for (var i = 0; i < n; i++) { box(.07, .05, .2, k.steel, -w / 2 + .3 + i * ((w - .6) / (n - 1)), .06, d / 2 + .08, c); box(.07, .05, .2, k.steel, -w / 2 + .3 + i * ((w - .6) / (n - 1)), .06, -d / 2 - .08, c); } c.position.set(x, y, z); g.add(c); return c; }
  function xfmrFerrite(g, x, y, z, s) { var t = G(); box(2.2 * s, .35 * s, 1.5 * s, M(0x3a3a40, .5, .45), 0, 0, 0, t); box(.5 * s, 1.5 * s, 1.5 * s, M(0x3a3a40, .5, .45), -.85 * s, .8 * s, 0, t); box(.5 * s, 1.5 * s, 1.5 * s, M(0x3a3a40, .5, .45), .85 * s, .8 * s, 0, t); box(2.2 * s, .35 * s, 1.5 * s, M(0x3a3a40, .5, .45), 0, 1.6 * s, 0, t); var w1 = cyl(.55 * s, 1.1 * s, M(0xb45309, .6, .35), 0, .8 * s, 0, t, 20), w2 = cyl(.5 * s, 1.15 * s, M(0x3f6212, .3, .5), 0, .8 * s, 0, t, 20); w1.scale.x = 1.5; w2.scale.x = 1.5; t.position.set(x, y, z); g.add(t); return t; }
  function setStage(regs, ids, mode, time, on) { var i = ids.indexOf(mode); regs.forEach(function (r, j) { r.material.opacity = (j === i ? .22 + .12 * Math.sin(time * 4) : 0) * Math.min(1, on * 3 + .5); }); }
  function wireUp(pts, g) { return K.tube(pts, .07, k.cu, g, 24); }

  /* ---------- linear adaptor ---------- */
  B.adaptor = function () {
    var root = G(), base = G(); pcb(base, 15, 8); root.add(base); var plug = G(); [-.55, .55].forEach(function (z) { box(1.6, .2, .3, k.brass, -8.4, .6, z, plug); }); box(.8, 1.2, 1.9, k.white, -7.4, .7, 0, plug); root.add(plug);
    var tr = G(); box(3.4, .4, 2.6, k.iron, 0, 0, 0, tr); box(3.4, .4, 2.6, k.iron, 0, 2.4, 0, tr); [-1.4, 1.4].forEach(function (x) { box(.4, 2.4, 2.6, k.iron, x, 1.2, 0, tr); }); [-.5, .5].forEach(function (x, i) { var c = cyl(.8, 2.0, i ? k.cu : M(0xb45309, .8, .3), x * 1.0, 1.2, 0, tr, 24); c.scale.z = 1.35; c.rotation.set(0, 0, 0); }); tr.position.set(-3.8, .2, 0); root.add(tr);
    var br = G(); br.position.set(.2, .35, 0); diode(br, -.55, .15, -.8, .8, 1.0); diode(br, .55, .15, -.8, -.8, 1.0); diode(br, -.55, .15, .8, -.8, 1.0); diode(br, .55, .15, .8, .8, 1.0); [[-.55, -.8], [.55, -.8]].forEach(function () { }); box(2.6, .05, 2.4, M(0x14532d, 0, .6), 0, .02, 0, br); root.add(br);
    var cap = ecap(root, 3.0, .1, 0, 1.0, 2.6); var reg = G(); box(1.3, 1.8, .45, k.black, 0, 1.0, 0, reg); box(1.3, 1.0, .1, k.alu, 0, 1.45, -.3, reg); [-.4, 0, .4].forEach(function (x) { box(.08, .8, .04, k.steel, x, -.1, .1, reg); }); var hs = G(); for (var i = 0; i < 6; i++) box(.06, 2.2, 1.6, k.alu, -.6 + i * .24, 1.4, -.5, hs); reg.add(hs); reg.position.set(5.4, .2, -.4); root.add(reg); K.txt('7812', .8, .3, null, 5.4, 1.4, -.05, root, '#e5e7eb', 46);
    var jack = G(); box(1.5, 1.4, 1.5, k.dark, 0, .7, 0, jack); cyl(.4, .2, k.steel, 0, .7, .8, jack, 14).rotation.x = PI / 2; jack.position.set(6.9, .1, 2.4); root.add(jack);
    var fl = K.flow([[-8.4, .7, -.55], [-6.6, .9, -.55], [-5.2, 1.0, -.8], [-2.6, 1.0, -.8], [-1.8, .6, -1.2], [-.5, .6, -1.3], [.9, .6, -1.3], [1.8, .6, 0], [3.0, 1.1, 1.0], [4.4, .6, 1.3], [5.4, 1.0, .4], [6.9, .8, 2.0]], 0xfde047, 22, .1); root.add(fl.group);
    var regs = hot(root, [[-7.4, .8, 0, 2.6, 1.6, 2.6], [-3.8, 1.5, 0, 4.2, 3.4, 3.4], [.2, .6, 0, 3.0, 1.2, 3.0], [3.0, 1.6, 0, 2.6, 3.4, 2.6], [5.8, 1.2, -.2, 2.4, 3.4, 2.4]]), ids = ['mains', 'xfmr', 'bridge', 'filter', 'reg'];
    root.position.y = 0; root.rotation.y = -.2;
    return { group: root, tick: true, parts: { plug: PART(plug, 'Mains plug', 4), tr: PART(tr, 'Step-down transformer', 5), bridge: PART(br, 'Bridge rectifier (4 diodes)', 4), cap: PART(cap, 'Smoothing capacitor', 5), reg: PART(reg, '7812 regulator', 4), out: PART(jack, 'DC output', 4), pcb: PART(base, 'Board', 12) },
      update: function (e, time, mode) { setStage(regs, ids, mode, time, e); fl.update(time, .3, e > .05 ? e : 0); } };
  };

  /* ---------- SMPS ---------- */
  B.smps = function () {
    var root = G(), base = G(); pcb(base, 17, 10); root.add(base);
    var filter = G(); box(1.4, 1.6, .7, M(0xe9c46a, .1, .5), 0, .8, 0, filter); K.tor(.7, .25, M(0xc2410c, .6, .4), 1.9, .9, 0, filter, PI / 2); box(.8, .8, 1.4, M(0x2563eb, .1, .5), 3.2, .4, 0, filter); filter.position.set(-6.4, .1, -2.8); root.add(filter);
    var plug = G(); [-.5, .5].forEach(function (z) { box(1.2, .25, .3, k.brass, -8.9, .8, z - 2.8, plug); }); root.add(plug);
    var br = G(); box(2.0, 2.6, .8, k.black, 0, 1.4, 0, br); [-.7, -.2, .3, .8].forEach(function (x) { box(.1, .5, .06, k.steel, x, -.1, .1, br); }); K.txt('GBU', .9, .3, null, 0, 1.7, .42, br, '#e5e7eb', 46); br.position.set(-3.2, .1, -3.0); root.add(br);
    var bulk = ecap(root, -1.0, .1, -2.0, 1.5, 3.4, 0x111827); var ctrl = ic(root, -.6, .1, 2.6, 1.8, 1.0, 4); K.txt('PWM', .8, .3, null, -.6, .35, 2.6, root, '#e5e7eb', 40).rotation.x = -PI / 2;
    var fet = G(); box(1.2, 1.6, .5, k.black, 0, 1.0, 0, fet); box(1.2, 1.0, .1, k.alu, 0, 1.5, -.3, fet); [-.4, 0, .4].forEach(function (x) { box(.08, .8, .04, k.steel, x, -.1, .1, fet); }); for (var i = 0; i < 7; i++) box(.06, 2.4, 1.8, k.alu, -.6 + i * .2, 1.3, -.7, fet); fet.position.set(1.8, .1, -3.0); root.add(fet);
    var tr = xfmrFerrite(root, 3.8, .2, 0, 1.2); var diode2 = G(); box(1.2, 1.6, .5, k.black, 0, 1.0, 0, diode2); for (var j = 0; j < 6; j++) box(.06, 2.0, 1.6, k.alu, -.5 + j * .2, 1.2, -.6, diode2); diode2.position.set(6.4, .1, -2.4); root.add(diode2);
    var ocap = G(); ecap(ocap, 6.6, .1, 1.4, .85, 2.0, 0x1d4ed8); ecap(ocap, 7.9, .1, 1.4, .85, 2.0, 0x1d4ed8); root.add(ocap);
    var opto = G(); ic(opto, 3.6, .1, 3.2, 1.2, .8, 4); box(.6, .6, .5, k.black, 1.8, .4, 3.4, opto); root.add(opto);
    var term = G(); box(2.4, 1.4, 1.2, k.green, 8.9, .8, -.4, term); [-.6, .6].forEach(function (z) { cyl(.22, .1, k.steel, 8.9, 1.55, z - .4, term, 14); }); root.add(term);
    var cover = box(17.4, 5.2, 10.4, K.ghost(0xdfe3e8, .14), 0, 3.0, 0, root);
    var fl = K.flow([[-8.9, .8, -3.3], [-6.4, 1.0, -2.8], [-4.2, 1.0, -3.0], [-2.4, .8, -2.2], [-1.0, 3.4, -2.0], [1.4, 1.0, -3.0], [3.4, 1.2, -.4], [6.0, 1.0, -2.4], [7.2, 1.5, 1.2], [8.9, 1.2, -.4]], 0xfde047, 28, .1); root.add(fl.group);
    var regs = hot(root, [[-6.4, .9, -2.8, 6.4, 2.0, 3.0], [-3.2, 1.2, -3.0, 2.6, 2.6, 1.8], [-1.0, 1.9, -2.0, 3.0, 4.0, 3.0], [2.8, 1.2, -1.2, 5.6, 2.8, 5.6], [6.4, 1.3, -2.0, 2.4, 2.8, 2.2], [7.3, 1.0, 1.4, 3.6, 2.4, 2.0]]), ids = ['ac', 'rect', 'bulk', 'switch', 'sec', 'out'];
    root.rotation.y = -.25; root.position.y = 0;
    return { group: root, tick: true, parts: { filter: PART(filter, 'EMI filter', 5), bridge: PART(br, 'Bridge rectifier', 4), bulk: PART(bulk, 'Bulk capacitor', 5), ctrl: PART(ctrl, 'PWM controller', 4), fet: PART(fet, 'Power MOSFET', 4), tr: PART(tr, 'HF ferrite transformer', 4), diode: PART(diode2, 'Output rectifier', 4), ocap: PART(ocap, 'Output capacitors', 5), opto: PART(opto, 'Opto-coupler feedback', 4), case: PART(cover, 'Case (see-through)', 14) },
      update: function (e, time, mode) { setStage(regs, ids, mode, time, e); fl.update(time, .3, e > .05 ? e : 0); cover.material.opacity = .14 - .09 * e; } };
  };

  /* ---------- phone charger ---------- */
  B.charger = function () {
    var root = G(), base = G(); pcb(base, 4.4, 2.6); root.add(base);
    var pins = G(); [-.55, .55].forEach(function (z) { box(1.2, .3, .15, k.steel, -3.4, .9, z, pins); }); root.add(pins);
    var br = ic(root, -1.5, .1, -.9, 1.1, .5, 4); var cap = ecap(root, -1.7, .1, .35, .4, .9, 0x111827); var tr = xfmrFerrite(root, .3, .1, 0, .5); var ctrl = ic(root, -.6, .1, 1.0, .8, .5, 4); var diodeS = ic(root, 1.6, .1, -.8, .6, .4, 2); var ocap = ecap(root, 1.3, .1, .6, .32, .8, 0x1d4ed8); var opto = ic(root, .3, .1, -1.0, .7, .4, 4);
    var usb = G(); box(1.5, .75, 1.7, k.steel, 0, .5, 0, usb); box(1.1, .12, 1.5, k.white, 0, .5, .1, usb); usb.position.set(2.7, .15, 0); root.add(usb);
    var cover = box(5.4, 3.0, 3.4, K.ghost(0xf1f2ee, .2), 0, 1.4, 0, root);
    var fl = K.flow([[-3.4, .9, -.55], [-2.4, .6, -.9], [-1.5, .4, -.9], [-1.7, .8, .35], [-.2, .6, .2], [.8, .4, -.6], [1.4, .6, .5], [2.2, .6, 0], [3.2, .6, 0]], 0xfde047, 20, .06); root.add(fl.group);
    var regs = hot(root, [[-2.5, .8, -.4, 2.0, 1.4, 1.8], [-1.6, .6, .0, 1.8, 1.4, 2.0], [.3, .7, -.1, 2.4, 1.6, 2.4], [1.4, .6, -.1, 1.2, 1.2, 2.0], [2.6, .6, 0, 1.8, 1.2, 2.0]]), ids = ['ac', 'dc', 'sw', 'sec', 'out'];
    root.rotation.y = -.35; root.scale.setScalar(1.7); root.position.y = 0;
    return { group: root, tick: true, parts: { pins: PART(pins, 'Plug pins', 3), bridge: PART(br, 'Bridge rectifier', 2.5), cap: PART(cap, 'Bulk capacitor', 2.5), ctrl: PART(ctrl, 'Flyback controller', 2.5), tr: PART(tr, 'Flyback transformer', 3), diode: PART(diodeS, 'Output diode', 2.5), ocap: PART(ocap, 'Output capacitor', 2.5), opto: PART(opto, 'Opto-coupler', 2.5), usb: PART(usb, 'USB port', 3), case: PART(cover, 'Case', 7) },
      update: function (e, time, mode) { setStage(regs, ids, mode, time, e); fl.update(time, .3, e > .05 ? e : 0); cover.material.opacity = .2 - .1 * e; } };
  };
})();
