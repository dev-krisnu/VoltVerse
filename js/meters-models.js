/* Meters and instruments. 1 unit = 10 mm. update(v 0..1 slider, time, mode). */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI, lerp = K.lerp;
  var last = {}; function dt(id, time) { var d = last[id] == null ? 0 : Math.min(.1, Math.max(0, time - last[id])); last[id] = time; return d; }
  /* flat dial on the xz plane: arc from a0 to a1 (rad, 0 = -z direction), radius R, ticks at angles list */
  function dial(g, R, a0, a1, angs, major) { var plate = cyl(R + .6, .12, K.ghost(0xf1f0e8, .62), 0, 0, 0, g, 48); (angs || []).forEach(function (a, i) { var len = (major && major.indexOf(i) >= 0) ? .8 : .45; var t = box(.07, .05, len, M(0x111827, 0, .6), 0, .09, 0, null); var q = G(); q.rotation.y = -a; t.position.z = -(R - len / 2); q.add(t); g.add(q); }); return plate; }
  function pointer(g, len, y) { var p = G(); box(.1, .08, len, M(0xdc2626, 0, .4), 0, y, -len / 2, p); box(.3, .1, .6, M(0xdc2626, 0, .4), 0, y, .3, p); g.add(p); return p; }
  function span(a0, a1, n, f) { var a = []; for (var i = 0; i <= n; i++) a.push(lerp(a0, a1, f(i / n))); return a; }
  var A0 = -.85, A1 = .85;

  B.coil = function () {
    var root = G(); var base = box(9, .5, 9, k.dark, 0, -1.2, 0, root); var dg = G(); dg.position.y = 2.9; dial(dg, 3.9, A0, A1, span(A0, A1, 10, function (u) { return u; }), [0, 5, 10]); root.add(dg);
    var mg = G(); var pN = box(1.2, 2.6, 2.6, M(0xdc4a4a, .3, .5), -2.3, .9, 0, mg), pS = box(1.2, 2.6, 2.6, M(0x3b6fe0, .3, .5), 2.3, .9, 0, mg); box(6, .9, 1.6, k.steel, 0, 2.5, 0, mg); box(1.2, 2.6, 1.0, k.steel, -2.3, 1.2, -1.6, mg); K.txt('N', .8, .6, null, -2.3, .9, 1.35, mg, '#fff', 60); K.txt('S', .8, .6, null, 2.3, .9, 1.35, mg, '#fff', 60); root.add(mg); mg.position.y = .3;
    var core = cyl(1.0, 2.6, k.iron, 0, .9, 0, root, 24); core.position.y = 1.2 + .0; var movement = G(); movement.position.y = 1.2; var coilw = G(); [-1.6, 1.6].forEach(function (x) { box(.25, 2.6, 1.9, k.cu, x * .8, 0, 0, coilw); }); box(2.6, 2.6, .25, k.cu, 0, 0, 1.0, coilw); box(2.6, 2.6, .25, k.cu, 0, 0, -1.0, coilw); movement.add(coilw); var pt = pointer(movement, 4.0, 2.1); cyl(.12, 2.4, k.steel, 0, 1.2, 0, movement, 8); root.add(movement); var sp = K.tube([[.2, 1.55, 0], [.9, 1.55, .3], [1.2, 1.55, 1.0], [.2, 1.55, 1.3]], .03, k.steel, root, 20);
    K.txt('0–1 mA', 2, .5, null, 0, 3.0, 2.6, root, '#111827', 44).rotation.x = -PI / 2;
    root.rotation.y = -.5; root.position.y = 1.2; root.scale.setScalar(1.05);
    return { group: root, parts: { magnet: PART(mg, 'Permanent magnet with pole pieces', 4), core: PART(core, 'Soft-iron core', 4), coil: PART(coilw, 'Moving coil', 4), pointer: PART(pt, 'Pointer', 4), spring: PART(sp, 'Hairspring', 4) },
      update: function (v) { movement.rotation.y = -lerp(A0, A1, v); } };
  };
  B.iron = function () {
    var root = G(); box(9, .5, 9, k.dark, 0, -1.2, 0, root); var dg = G(); dg.position.y = 2.9; dial(dg, 3.9, A0, A1, span(A0, A1, 10, function (u) { return u * u; }), [0, 5, 10]); root.add(dg);
    var cw = K.helixY(1.5, 3.4, 16, .1, k.cu); cw.position.y = .6; root.add(cw); var fixedV = box(.14, 2.4, 1.4, k.iron, -.6, .6, 0, root); var mv = G(); mv.position.y = .6; var vane = box(.14, 2.4, 1.4, k.iron, .6, 0, 0, mv); vane.position.x = .6; var mov = G(); mov.add(mv); root.add(mov); var pt = pointer(mov, 4.0, 3.1); cyl(.1, 3.2, k.steel, 0, 1.6, 0, mov, 8); var chamber = box(1.6, .9, 1.6, K.ghost(0xc7d2fe, .4), -3.3, -.3, 2.4, root); var dv = box(.1, .7, 1.3, k.alu, -3.3, -.3, 2.4, root);
    K.txt('MI 0–5 A', 2, .5, null, 0, 3.0, 2.6, root, '#111827', 44).rotation.x = -PI / 2;
    root.rotation.y = -.5; root.position.y = 1.2;
    return { group: root, parts: { coil: PART(cw, 'Fixed coil', 4), fixed: PART(fixedV, 'Fixed iron vane', 4), moving: PART(mv, 'Moving iron vane', 4), pointer: PART(pt, 'Pointer', 4), damp: PART(chamber, 'Air-friction damping chamber', 4) },
      update: function (v) { var th = v * v; mov.rotation.y = -lerp(A0, A1, th); fixedV.rotation.y = 0; } };
  };
  B.clamp = function () {
    var root = G(), YC = 6.05; var body = box(3.2, 9.5, 2.2, M(0xe7b21c, 0, .55), 0, -1.4, 0, root); box(3.0, 1.1, 2.3, k.dark, 0, -5.3, 0, root); var screen = box(2.4, 1.7, .12, k.black, 0, .6, 1.12, root); var lcd = K.lcd(2.2, 1.4, root, 0, .6, 1.19, '#0f2a1d'); var dialM = cyl(.9, .3, k.dark, 0, -2.0, 1.15, root, 24); dialM.rotation.x = PI / 2; box(1.4, 1.2, 1.0, k.dark, -1.9, -3.8, 0, root);
    var jaws = G(); jaws.position.set(0, YC - 2.7, 0); root.add(jaws); var jawL = G(), jawR = G(); jaws.add(jawL, jawR);
    [[jawL, 1], [jawR, -1]].forEach(function (q) { var sh = new T.Mesh(new T.TorusGeometry(2.7, .55, 14, 40, PI), k.dark), co = new T.Mesh(new T.TorusGeometry(2.7, .3, 10, 40, PI), k.iron); sh.position.y = 2.7; co.position.y = 2.7; sh.rotation.z = q[1] > 0 ? PI / 2 : -PI / 2; co.rotation.z = sh.rotation.z; q[0].add(sh, co); q[0].userData.core = co; });
    var hall = box(.5, .5, .5, k.green, 0, YC - 2.7, 0, root);
    var wire = G(); var w1 = cyl(.25, 12, k.cu, 0, 0, 0, wire, 12), w2 = cyl(.42, 10, M(0x1d6bd8, 0, .6), 0, 0, 0, wire, 16); w1.rotation.x = PI / 2; w2.rotation.x = PI / 2; wire.position.set(0, YC, 0); root.add(wire);
    var flds = G(); for (var i = 0; i < 3; i++) flds.add(new T.Mesh(new T.TorusGeometry(.9 + i * .55, .035, 6, 40), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 }))); flds.position.set(0, YC, 0); root.add(flds);
    var fl = K.flow([[0, YC, -6], [0, YC, 6]], 0xfde047, 12, .12); root.add(fl.group);
    root.rotation.y = -.7; root.position.y = 6.3; root.scale.setScalar(.88); var jaw = 0;
    return { group: root, tick: true, parts: { jaws: PART(jaws, 'Split-core jaws', 4), core: PART(jawL.userData.core, 'Iron core', 4), hall: PART(hall, 'Hall-effect sensor', 4), lcd: PART(screen, 'Display', 5), wire: PART(wire, 'Conductor under test', 4), dial: PART(dialM, 'Range selector', 5) },
      update: function (v, time, mode) { var open = mode === 'open'; jaw += ((open ? 1 : 0) - jaw) * .15; jawL.rotation.z = jaw * .5; jawR.rotation.z = -jaw * .5; var A = open ? 0 : v * 600; lcd.set([A.toFixed(1) + ' A', 'AC ' + (open ? 'jaws open' : '50 Hz')]); flds.children.forEach(function (r, i) { r.material.opacity = (open ? .05 : v * .9) * (.7 + .3 * Math.sin(time * 5 + i)); }); fl.update(time, .3 + v, v > .02 ? 1 : 0); } };
  };
  B.megger = function () {
    var root = G(), body = box(8, 5.4, 4.6, M(0x1f6f3d, 0, .6), 0, 0, 0, root); box(8.2, .5, 4.8, k.dark, 0, -2.6, 0, root); var win = box(6.0, 2.6, .1, M(0xf1f0e8, 0, .6), 0, .6, 2.32, root); var d = G(); d.position.set(0, -.6, 2.4); d.rotation.x = PI / 2; d.rotation.x = 0; root.add(d);
    var scaleG = G(); scaleG.position.set(0, -.7, 2.4); for (var i = 0; i <= 12; i++) { var a = lerp(-1.0, 1.0, i / 12), t = box(.05, i % 3 === 0 ? .5 : .3, .04, M(0x111827, 0, .6), Math.sin(a) * 2.5, Math.cos(a) * 2.5 + .0, 0, scaleG); t.rotation.z = -a; } root.add(scaleG); var lbs = ['∞', '100', '10', '1', '0.1', '0']; lbs.forEach(function (s, i) { var a = lerp(-1.0, 1.0, i / 5); K.txt(s, .8, .4, null, Math.sin(a) * 2.0, Math.cos(a) * 2.0 - .7, 2.43, root, '#111827', 50); }); K.txt('MΩ', 1, .45, null, 0, -.95, 2.44, root, '#111827', 56);
    var needle = G(); needle.position.set(0, -.7 - 0.0, 2.45); box(.06, 2.6, .04, M(0xdc2626, 0, .4), 0, 1.3, 0, needle); root.add(needle); var crank = G(); crank.position.set(4.3, 0, 0); cyl(.35, .5, k.steel, 0, 0, 0, crank, 14).rotation.z = PI / 2; var arm = box(.15, 2.2, .15, k.steel, .5, 1.1, 0, crank), kn = cyl(.28, .9, k.red, .5, 2.3, 0, crank, 14); kn.rotation.z = PI / 2; root.add(crank);
    var terms = G(); ['LINE', 'EARTH', 'GUARD'].forEach(function (n, i) { var x = -2.2 + i * 2.2; cyl(.4, .5, i === 1 ? k.green : i === 0 ? k.red : k.brass, x, -2.0, 2.6, terms, 20).rotation.x = PI / 2; K.txt(n, 1.5, .4, null, x, -3.1, 2.4, terms, '#fde68a', 44); }); root.add(terms);
    var cable = box(5, 1.1, 1.1, k.black, -.2, -4.6, 6.2, root); K.tube([[-2.2, -2.0, 3.0], [-2.6, -3.0, 4.4], [-2.6, -4.6, 5.6]], .08, k.red, root, 16); K.tube([[0, -2.0, 3.0], [1.2, -3.2, 4.0], [2.3, -4.6, 5.6]], .08, k.green, root, 16); K.txt('500 V', 1.6, .5, null, -2.6, 2.2, 2.4, root, '#fde68a', 50); var gen = cyl(.35, .1, K.glowM(0xfacc15, 0), 3.1, 2.2, 2.42, root, 14);
    root.rotation.y = -.5; root.position.y = 3.2;
    var cr = 0;
    return { group: root, tick: true, parts: { body: PART(body, 'Case with the generator and movement', 8), dial: PART(win, 'Analogue dial in MΩ', 6), crank: PART(crank, 'Hand crank: the generator makes the test voltage', 5), terms: PART(terms, 'LINE, EARTH and GUARD terminals', 5), cable: PART(cable, 'Cable under test', 6) },
      update: function (v, time) { cr += dt('m', time) * (v > .01 ? 6 : 1.5); crank.rotation.x = cr; var a = lerp(-1.0, 1.0, 1 - v); needle.rotation.z = -a; gen.material.emissiveIntensity = 1.2; } };
  };
  B.energy = function () {
    var root = G(), counter = { revs: 0 }; var base = box(8.5, .5, 8.5, k.dark, 0, -1.4, 0, root); var cover = box(8.7, 4.6, 8.7, K.ghost(0xe5e7eb, .1), 0, .9, 0, root); var disc = G(); cyl(2.6, .1, k.alu, 0, 0, 0, disc, 48); box(.4, .12, .9, k.black, 1.9, .05, 0, disc); root.add(disc); disc.position.y = 0; var sh = cyl(.12, 3.6, k.steel, 0, 0, 0, root, 8);
    var pot = G(); box(2.6, .4, 1.6, k.iron, 0, 1.1, -3.0, pot); box(.5, 1.2, 1.6, k.iron, -1.1, .65, -3.0, pot); box(.5, 1.2, 1.6, k.iron, 1.1, .65, -3.0, pot); var pc = K.helixY(.55, 1.2, 14, .035, M(0x3f6212, .3, .5)); pc.position.set(0, .65, -3.0); pot.add(pc); root.add(pot); pot.position.z = 1.6; pot.position.y = 0;
    var cur = G(); box(2.6, .4, 1.6, k.iron, 0, -1.1, -3.0, cur); box(.5, 1.2, 1.6, k.iron, -1.1, -.65, -3.0, cur); box(.5, 1.2, 1.6, k.iron, 1.1, -.65, -3.0, cur); var cc = K.helixY(.55, 1.0, 5, .13, k.cu); cc.position.set(0, -.65, -3.0); cur.add(cc); root.add(cur); cur.position.z = 1.6;
    var brake = G(); box(.7, 1.9, 1.2, M(0x3b6fe0, .3, .5), 0, 0, 0, brake); box(.7, .5, 1.2, M(0xdc4a4a, .3, .5), 0, .85, 0, brake); brake.position.set(2.9, 0, 0); root.add(brake); var worm = cyl(.35, 1.2, k.steel, -3.0, .0, 0, root, 12); worm.rotation.x = PI / 2;
    var reg = box(5.6, 1.6, .5, k.black, 0, 2.9, 2.9, root); var lcd = K.lcd(5.2, 1.3, root, 0, 2.9, 3.16, '#0a0a0a'); K.txt('1200 rev/kWh', 3.2, .5, null, 0, 1.6, 3.3, root, '#e5e7eb', 44);
    var vt = K.flow([[-5, -1.0, 2.6], [-1.6, -1.0, 2.6], [-1.1, .65, 1.6], [1.1, .65, 1.6], [4, .65, 2.6]], 0x34d399, 10, .08); root.add(vt.group);
    root.rotation.y = -.55; root.position.y = 2.2; root.scale.setScalar(.95);
    return { group: root, tick: true, parts: { disc: PART(disc, 'Aluminium disc', 4), pot: PART(pot, 'Voltage (shunt) electromagnet', 4), cur: PART(cur, 'Current (series) electromagnet', 4), brake: PART(brake, 'Braking magnet', 4), reg: PART(reg, 'Register', 5), worm: PART(worm, 'Worm gear to the register', 4) },
      update: function (v, time) { var w = v * 7, d = dt('e', time); disc.rotation.y += w * d; counter.revs += w * d / (2 * PI); var kwh = counter.revs / 1200; lcd.set(['revs ' + counter.revs.toFixed(1), (kwh * 1000).toFixed(2) + ' Wh'], '#fde68a'); worm.rotation.y += w * d * 6; vt.update(time, .35, v > .02 ? 1 : 0); } };
  };
})();
