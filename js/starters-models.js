/* Motor starter models. 1 unit = 10 mm. update(u 0..1 = 12 s of starting). */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI, seg = K.seg, SC = window.SCURVE;
  function plate(w, h, g) { box(w, h, .4, M(0xd9dde2, .2, .6), 0, h / 2, -.5, g); }
  function ctr(g, x, y, lab, col) { var c = G(), led = K.glowM(col || 0x22c55e, 0), arm = box(1.0, .5, .9, k.iron, 0, .95, 0, c); box(1.7, 2.3, 1.4, k.dark, 0, 1.15, 0, c); box(1.4, .45, .1, k.white, 0, 1.75, .72, c); K.txt(lab, 1.0, .4, null, 0, 1.75, .78, c, '#111827', 56); box(.3, .15, .12, led, .5, 2.2, .72, c); c.position.set(x, y, 0); for (var i = -1; i <= 1; i++) { box(.3, .2, .5, k.brass, i * .5, 2.4, 0, c); box(.3, .2, .5, k.brass, i * .5, -.1, 0, c); } g.add(c); c.userData = { led: led, arm: arm }; return c; }
  function setC(c, on) { c.userData.led.emissiveIntensity = on ? 2 : 0; c.userData.arm.position.y = on ? .75 : .95; }
  function motor(g, x, y, z, rings) { var m = G(), body = K.cylX(1.3, 3.2, M(0x2f5bd1, .4, .4), 0, 0, 0, m, 36); for (var i = -3; i <= 3; i++) box(.06, 2.5, 2.5, M(0x2b52c0, .4, .5), i * .38, 0, 0, m); var tb = box(1.3, .5, 1.1, k.dark, 0, 1.5, 0, m); var fan = G(); fan.position.x = 2.0; for (var j = 0; j < 6; j++) { var b = box(.08, 1.0, .3, k.steel, 0, .6, 0, null), q = G(); q.rotation.x = j * PI / 3; q.add(b); fan.add(q); } m.add(fan); cyl(.18, 1.6, k.steel, -2.3, 0, 0, m, 12).rotation.z = PI / 2; m.position.set(x, y, z); g.add(m); var sr = null; if (rings) { sr = G(); [0, .5].forEach(function (d) { var r = cyl(.5, .3, k.brass, 0, 0, 0, sr, 24); r.rotation.z = PI / 2; r.position.x = 2.0 + 1.0 + d; }); sr.position.set(0, 0, 0); m.add(sr); } return { g: m, fan: fan, tb: tb, sr: sr, body: body }; }
  function spin(m, n, dt) { m.fan.rotation.x += n * 14 * dt; }
  var lastT = {}; function dtOf(id, time) { var d = lastT[id] == null ? 0 : Math.min(.1, Math.max(0, time - lastT[id])); lastT[id] = time; return d; }
  function wires(g, list, col) { list.forEach(function (l) { K.tube(l, .07, col || k.black, g, 20); }); }
  function tblock(g, x, y, star) { var tb = G(); box(3.4, 1.8, .5, k.dark, 0, 0, 0, tb); var nm = ['U1', 'V1', 'W1', 'W2', 'U2', 'V2']; nm.forEach(function (n, i) { var tx = (i % 3 - 1) * 1.0, ty = i < 3 ? .55 : -.55; cyl(.18, .2, k.brass, tx, ty, .3, tb, 14).rotation.x = PI / 2; K.txt(n, .5, .25, null, tx, ty + (i < 3 ? .38 : -.38), .26, tb, '#e5e7eb', 44); });
    var starL = G(), deltaL = G(); box(2.4, .12, .12, k.cu, 0, -.55, .5, starL); [0, 1, 2].forEach(function (i) { box(.12, .12, .12, k.cu, (i - 1) * 1.0, -.55, .5, starL); });
    [[-1, 1], [0, 0], [1, -1]].forEach(function (p, i) { }); var pairs = [[0, 3 + 1], [1, 3 + 2], [2, 3 + 0]]; pairs.forEach(function (p) { var x1 = (p[0] - 1) * 1.0, x2 = (p[1] - 3 - 1) * 1.0; var lk = K.tube([[x1, .55, .5], [x1 + (x2 - x1) * .5, 0, .62], [x2, -.55, .5]], .07, k.cu, deltaL, 12); }); tb.add(starL, deltaL); tb.position.set(x, y, 0); g.add(tb); tb.userData = { star: starL, delta: deltaL }; return tb; }
  function bars(g, x, y, n) { var bg = G(), ms = []; for (var i = 0; i < n; i++) { var m = K.glowM(0x22d3ee, .8); var b = box(.35, 1, .35, m, i * .6, .5, 0, bg); ms.push(b); } bg.position.set(x, y, 0); g.add(bg); bg.userData = { bars: ms }; return bg; }

  /* ---------- star-delta ---------- */
  B.sd = function () {
    var root = G(); plate(11, 8.5, root); var k1 = ctr(root, -4, 4.8, 'K1'), k2 = ctr(root, -1.6, 4.8, 'K2 Y', 0xf59e0b), k3 = ctr(root, .8, 4.8, 'K3 Δ', 0x60a5fa);
    var ov = box(1.7, 1.9, 1.4, k.grey, -4, 1.5, 0, root); K.txt('OLR', 1.2, .4, null, -4, 1.6, .78, root, '#fff', 50); var timer = box(1.7, 1.5, 1.1, k.yellow, -1.6, 1.6, 0, root); K.txt('TIMER', 1.4, .35, null, -1.6, 1.7, .6, root, '#111', 46); var tdial = cyl(.35, .15, k.dark, -1.6, 1.3, .62, root, 16); tdial.rotation.x = PI / 2;
    var mt = motor(root, 6.2, 1.6, 1.4, false); var tb = tblock(root, 6.0, 4.6, true); var vb = bars(root, 3.1, 1.2, 3); var vcol = vb.userData.bars;
    var wr = G(); wires(wr, [[[-4, 7.3, .5], [-4, 7.9, .5], [-.4, 7.9, .5]], [[-4, 0.9, .6], [-4, -.3, 1], [4.6, -.3, 1.4]]]); root.add(wr);
    var cur = K.flow([[-4.8, 8.6, .8], [-4, 7.6, .6], [-4, 2.4, .6], [-4, 0.8, .8], [-4, -.3, 1.1], [4.6, -.3, 1.4], [6.2, 0.4, 1.4]], 0xfde047, 14, .1); root.add(cur.group);
    root.position.y = 0; root.rotation.y = -.15;
    return { group: root, tick: true, parts: { k1: PART(k1, 'K1 main contactor', 4), k2: PART(k2, 'K2 star contactor', 4), k3: PART(k3, 'K3 delta contactor', 4), tb: PART(tb, 'Motor terminals and links', 3.5), volt: PART(vb, 'Winding voltage', 3), timer: PART(timer, 'Changeover timer', 4), motor: PART(mt.g, 'Motor', 3) },
      update: function (u, time) { var t = u * SC.TT, n = SC.N.sd(t), on = u > .01, st = on && u < .49, de = u > .54, gap = u >= .49 && u <= .54; setC(k1, on); setC(k2, st); setC(k3, de); tb.userData.star.visible = st || (!on); tb.userData.delta.visible = de; vcol.forEach(function (b, i) { var v = de ? 1 : (on ? .577 : 0); b.scale.y = Math.max(.02, v * 2); b.position.y = Math.max(.02, v * 2) / 2; b.material.emissiveIntensity = .4 + v; b.material.color.setHex(de ? 0x60a5fa : 0xf59e0b); b.material.emissive.setHex(de ? 0x60a5fa : 0xf59e0b); }); spin(mt, n, dtOf('sd', time)); cur.update(time, .3 + n * .2, on && !gap ? 1 : 0); tdial.rotation.y = u * 6; } };
  };

  /* ---------- auto-transformer ---------- */
  B.at = function () {
    var root = G(); plate(11, 8.5, root); var k1 = ctr(root, -4.2, 4.8, 'START', 0xf59e0b), k2 = ctr(root, -1.8, 4.8, 'RUN', 0x22c55e);
    var tr = G(); box(3.6, .4, 1.6, k.iron, 0, 0, 0, tr); box(3.6, .4, 1.6, k.iron, 0, 3.2, 0, tr); [-1.4, 0, 1.4].forEach(function (x) { box(.4, 3.2, 1.6, k.iron, x, 1.6, 0, tr); var cw = K.helixY(.62, 2.6, 14, .06, k.cu); cw.position.set(x, 1.6, 0); tr.add(cw); }); tr.position.set(1.8, .6, .2); root.add(tr);
    var tap = G(); [[.5, '50'], [.65, '65'], [.8, '80']].forEach(function (p, i) { var s = sph(.12, k.brass, 1.8 + (i - 1) * .55, .6 + 3.5, 1.1, tap); K.txt(p[1] + '%', .6, .3, null, 1.8 + (i - 1) * .55, .6 + 4.0, 1.1, tap, '#fde68a', 44); K.tube([[1.8 - 1.4, 1.2 + p[0] * 2.4, .9], [1.8 + (i - 1) * .55, 4.1, 1.1]], .03, k.red, tap, 10); }); root.add(tap);
    function sph(r, m, x, y, z, p) { var o = new T.Mesh(new T.SphereGeometry(r, 12, 10), m); o.position.set(x, y, z); p.add(o); return o; }
    var mt = motor(root, 6.4, 1.6, 1.2, false); var vb = bars(root, 3.2, 6.8, 1); var vbar = vb.userData.bars[0]; vbar.scale.set(1, 1, 1);
    var cur = K.flow([[-4.8, 8.4, .8], [-4.2, 7.5, .6], [-4.2, 2.4, .6], [-3, 0, 1.2], [1.8, -.4, 1.2], [4.8, .6, 1.4], [6.4, 1.2, 1.2]], 0xfde047, 14, .1); root.add(cur.group); var glow = new T.PointLight(0xf59e0b, 0, 8); glow.position.set(1.8, 2.5, 2); root.add(glow);
    return { group: root, tick: true, parts: { tr: PART(tr, 'Autotransformer', 3.5), taps: PART(tap, 'Taps: 50, 65, 80 %', 4), k1: PART(k1, 'START contactor', 4), k2: PART(k2, 'RUN contactor', 4), motor: PART(mt.g, 'Motor', 3) },
      update: function (u, time) { var t = u * SC.TT, n = SC.N.at(t), on = u > .01, st = on && u < .41, run = u > .45; setC(k1, st); setC(k2, run); glow.intensity = st ? 2.2 : 0; vbar.scale.set(1, Math.max(.02, (run ? 3 : st ? 1.95 : 0)), 1); vbar.position.y = vbar.scale.y / 2; vbar.material.color.setHex(run ? 0x60a5fa : 0xf59e0b); vbar.material.emissive.setHex(run ? 0x60a5fa : 0xf59e0b); spin(mt, n, dtOf('at', time)); cur.update(time, .3 + n * .2, on && (st || run) ? 1 : 0); } };
  };

  /* ---------- rotor-resistance ---------- */
  B.rr = function () {
    var root = G(); plate(12, 8.5, root); var mt = motor(root, 2.2, 1.6, 1.2, true), banks = [], cs = [];
    [0, 1, 2].forEach(function (i) { var bk = G(); for (var j = 0; j < 4; j++) { var rm = M(0x6b7280, .5, .4, { emissive: 0xff6a00, emissiveIntensity: 0 }); box(1.9, .24, .6, rm, 0, j * .5, 0, bk); } bk.position.set(5.6 + i * 2.0 - 1.9, 1.0, .5); bk.scale.set(.6, 1, 1); bk.rotation.y = 0; banks.push(bk); root.add(bk); box(.1, 2.2, .7, k.dark, 5.6 + i * 2.0 - 1.9 + .55, 1.1, .5, root); cs.push(ctr(root, 4.0 + i * 1.9, 5.2, 'R' + (i + 1), 0xf59e0b)); cs[i].scale.setScalar(.75); });
    K.txt('RESISTOR BANKS', 5, .45, null, 6.3, .0, 1.2, root, '#fbbf24', 40);
    var wr = K.tube([[3.2, .4, 1.4], [4.3, -.4, 1.6], [4.0, .0, .8]], .06, k.cu, root, 12); var stp = ctr(root, -3.2, 5.2, 'STATOR', 0x22c55e); var cur = K.flow([[-4.8, 8.2, .8], [-3.2, 7.5, .6], [-3.2, 2.4, .6], [-3.2, 0, 1.0], [.4, 0, 1.4]], 0xfde047, 12, .1); root.add(cur.group);
    var rcur = K.flow([[3.4, 1.4, 1.5], [4.6, -.4, 1.6], [5.6, -.5, 1.0], [11, -.5, 1.0]], 0xfb923c, 10, .09); root.add(rcur.group);
    return { group: root, tick: true, parts: { motor: PART(mt.g, 'Slip-ring motor', 3), rings: PART(mt.sr, 'Slip rings', 4), r1: PART(banks[0], 'Resistor bank 1', 4), r2: PART(banks[1], 'Resistor bank 2', 4), r3: PART(banks[2], 'Resistor bank 3', 4), cont: PART(cs[1], 'Short-circuit contactors', 4) },
      update: function (u, time) { var t = u * SC.TT, n = SC.N.rr(t), on = u > .01, steps = [0, 2.5, 5, 7.5]; setC(stp, on); cs.forEach(function (c, i) { setC(c, t >= steps[i + 1]); }); banks.forEach(function (b, i) { var cut = t >= steps[i + 1]; b.scale.x = cut ? .2 : .6; b.children.forEach(function (r) { r.material.emissiveIntensity = on && !cut ? Math.min(1.5, SC.I.rr(t) * .7) : 0; }); }); spin(mt, n, dtOf('rr', time)); cur.update(time, .3 + n * .15, on ? 1 : 0); rcur.update(time, .35, on && t < 7.5 ? 1 : 0); } };
  };

  /* ---------- soft starter ---------- */
  B.ss = function () {
    var root = G(); plate(11, 8.5, root); var body = box(5.2, 6.4, 2.2, k.dark, -1.6, 4.1, 0, root); var sink = G(); for (var i = 0; i < 10; i++) box(.12, 3.0, 2.4, k.alu, -3.9 + i * .5, 1.0, .1, sink); root.add(sink);
    var scr = G(); [0, 1, 2].forEach(function (i) { var m = box(1.2, 1.5, .8, K.ghost(0x1f2937, 1), -3.0 + i * 1.7, 5.0, 1.15, scr); box(.35, .7, .3, k.steel, -3.0 + i * 1.7 - .25, 5.2, 1.6, scr); box(.35, .7, .3, k.steel, -3.0 + i * 1.7 + .25, 5.2, 1.6, scr); K.txt('SCR', .9, .3, null, -3.0 + i * 1.7, 4.4, 1.56, scr, '#fde68a', 46); }); root.add(scr);
    var lcdM = K.glowM(0x22d3ee, .5); var ctrl = G(); box(2.2, 1.6, .3, k.black, -1.6, 6.8, 1.2, ctrl); box(1.7, .6, .1, lcdM, -1.6, 7.1, 1.4, ctrl); [0, 1, 2].forEach(function (i) { cyl(.14, .12, k.grey, -2.2 + i * .6, 6.4, 1.4, ctrl, 12).rotation.x = PI / 2; }); root.add(ctrl);
    var byp = ctr(root, 2.7, 4.6, 'BYPASS', 0x22c55e); var mt = motor(root, 7.3, 1.6, 1.0, false); var vb = bars(root, 2.1, 1.2, 1); var vbar = vb.userData.bars[0];
    var cur = K.flow([[-4.8, 8.5, .8], [-3.0, 7.9, 1.0], [-3.0, 5.0, 1.3], [-3.0, 3.0, 1.4], [3.6, -.3, 1.4], [6.0, .6, 1.2]], 0xfde047, 12, .1); root.add(cur.group); var wave = null;
    return { group: root, tick: true, parts: { scr: PART(scr, 'Thyristors (SCR pairs)', 4), sink: PART(sink, 'Heat sink', 4), byp: PART(byp, 'Bypass contactor', 4), ctrl: PART(ctrl, 'Control board', 4), volt: PART(vb, 'Output voltage', 3), motor: PART(mt.g, 'Motor', 3) },
      update: function (u, time) { var t = u * SC.TT, n = SC.N.ss(t), on = u > .01, vv = t < 7 ? .3 + .7 * Math.min(1, t / 6.5) : 1; setC(byp, t >= 7); vbar.scale.set(1, Math.max(.02, on ? vv * 3 : 0), 1); vbar.position.y = vbar.scale.y / 2; vbar.material.emissiveIntensity = .5 + vv; lcdM.emissiveIntensity = .4 + (on ? .8 + .3 * Math.sin(time * 4) : 0); scr.children.forEach(function (c) { if (c.material && c.material.opacity != null) c.material.emissive && c.material.emissive.setHex(0x000000); }); spin(mt, n, dtOf('ss', time)); cur.update(time, .3 + n * .2, on ? 1 : 0); } };
  };
})();
