/* Switchyard equipment and a substation bay walkthrough. 1 unit = 10 cm. update(e, time, mode). */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI, seg = K.seg, lerp = K.lerp;
  var porc = M(0xb7794a, .1, .35), porcG = M(0xcdb89c, .1, .4), grey = M(0xa7b0b8, .3, .5);
  var last = {}; function dt(id, time) { var d = last[id] == null ? 0 : Math.min(.1, Math.max(0, time - last[id])); last[id] = time; return d; }
  /* shed column: stack of discs with a core */
  function shedCol(g, x, y0, z, h, r, m) { var c = G(), n = Math.max(3, Math.round(h / .22)); cyl(r * .55, h, m, 0, h / 2, 0, c, 20); for (var i = 0; i < n; i++) cyl(r, .07, m, 0, .15 + i * (h - .3) / (n - 1), 0, c, 24, r * .8); c.position.set(x, y0, z); g.add(c); return c; }
  function cap(g, x, y, z, r, h, m) { return cyl(r, h, m || k.alu, x, y, z, g, 24); }
  function ground(g, w, d) { box(w, .2, d, M(0x2a2f36, .1, .9), 0, -.1, 0, g); }
  function pad(g, x, y, z, w, h, d) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, depthWrite: false })); m.position.set(x, y, z); m.renderOrder = 5; g.add(m); return m; }

  /* ---------- busbar ---------- */
  B.bus = function () {
    var root = G(), cols = [0xdc2626, 0xeab308, 0x2563eb], bars = [], heat = [];
    ground(root, 18, 10); function row(z0, op, grp) { [-2, 0, 2].forEach(function (zz, i) { var m = M(0xc87b3e, .95, .3, { emissive: 0xff5a00, emissiveIntensity: 0, transparent: op < 1, opacity: op }); var b = box(16, .55, .22, m, 0, z0, zz, grp); box(16.02, .16, .24, M(cols[i], 0, .6, { transparent: op < 1, opacity: op }), 0, z0 + .36, zz, grp); heat.push(m); bars.push(b); [-6, -2, 2, 6].forEach(function (x) { var pc = shedCol(grp, x, 0, zz, z0 - .3, .5, op < 1 ? K.ghost(0xb7794a, .5) : porc); }); }); }
    var main = G(); row(3.4, 1, main); root.add(main); var sec = G(); row(5.8, .9, sec); sec.position.y = 0; root.add(sec); var tap = G(); [-2, 0, 2].forEach(function (zz) { [-4.5, 4.5].forEach(function (x) { cyl(.18, 2.2, k.alu, x, 2.2, zz, tap, 14); box(.4, .2, .4, k.alu, x, 3.2, zz, tap); }); }); root.add(tap);
    var coup = G(); box(1.4, 1.6, 4.4, k.dark, 0, 4.3, 3.1, coup); K.txt('BUS COUPLER', 3.2, .5, null, 0, 4.3, 5.4, coup, '#fde68a', 40); coup.position.set(0, 0, 0); root.add(coup); var fl = K.flow([[-8, 3.4, 0], [8, 3.4, 0]], 0xfde047, 20, .09); root.add(fl.group);
    var labelY = K.txt('BUS 1', 1.6, .5, null, -7.6, 4.5, 0, root, '#fde68a', 44), labelB = K.txt('BUS 2', 1.6, .5, null, -7.6, 6.9, 0, root, '#93c5fd', 44);
    root.rotation.y = -.5; root.position.y = 0;
    return { group: root, tick: true, parts: { bars: PART(main, 'Main busbars (flat copper or aluminium)', 10), ins: PART(main.children[3], 'Post insulators', 8), tap: PART(tap, 'Tap-offs to the feeders', 8), coupler: PART(coup, 'Bus coupler (links the two buses)', 8), sec: PART(sec, 'Second (reserve) busbar', 10) },
      update: function (e, time, mode) { var dbl = mode === 'double'; sec.visible = dbl; coup.visible = dbl; labelB.visible = dbl; heat.forEach(function (m, i) { if (i < 3) m.emissiveIntensity = e * .5; }); fl.update(time, .4, e > .03 ? e : 0); } };
  };
  /* ---------- current transformer ---------- */
  B.ct = function () {
    var root = G(); ground(root, 10, 10); var hous = box(5.2, 3.4, 5.2, K.ghost(0x6b7280, .25), 0, 4.6, 0, root); var core = new T.Mesh(new T.TorusGeometry(1.9, .5, 18, 48), M(0x8a929c, .9, .35, { emissive: 0x22d3ee, emissiveIntensity: 0 })); core.rotation.x = PI / 2; core.position.y = 4.6; root.add(core);
    var sec = G(); for (var i = 0; i < 44; i++) { var a = i / 44 * PI * 2, w = new T.Mesh(new T.TorusGeometry(.62, .05, 6, 14), k.cu); w.position.set(Math.cos(a) * 1.9, 4.6, Math.sin(a) * 1.9); w.rotation.y = -a; sec.add(w); } root.add(sec);
    var prim = G(); cyl(.38, 12, k.alu, 0, 5.0, 0, prim, 20); var pt = cyl(.55, .6, k.alu, 0, 11.1, 0, prim, 20); K.txt('P1', .8, .4, null, 1.3, 10.6, 0, root, '#fde68a', 56); K.txt('P2', .8, .4, null, 1.3, -.2 + 1.4, 0, root, '#fde68a', 56); root.add(prim); cyl(1.4, 1.0, k.grey, 0, .5, 0, root, 30); shedCol(root, 0, 1, 0, 1.4, 1.2, porc);
    var tb = box(1.6, 1.1, 1.2, k.dark, 3.4, 3.6, 0, root); K.txt('S1  S2', 1.4, .4, null, 3.4, 3.65, .64, root, '#fde68a', 40); var burden = G(); box(1.6, 1.6, .5, k.black, 6.2, 3.6, 0, burden); var ndl = box(.06, .9, .04, M(0xdc2626, 0, .4), 6.2, 3.8, .3, burden); root.add(burden); K.txt('A', .6, .6, null, 6.2, 3.1, .3, burden, '#fff', 60);
    K.tube([[3.4, 3.6, .6], [4.6, 3.0, .8], [5.6, 3.1, .5]], .06, k.red, root, 14); K.tube([[3.4, 3.4, -.6], [4.6, 2.6, -.8], [5.6, 3.0, -.4]], .06, k.black, root, 14);
    var fl = K.flow([[0, 12, 0], [0, 4.6, 0], [0, -.2, 0]], 0xfde047, 14, .13); root.add(fl.group); var sf = K.flow([[3.4, 3.6, .6], [5.6, 3.2, .5], [6.8, 3.6, .3], [5.6, 3.0, -.4], [3.4, 3.4, -.6]], 0x34d399, 8, .08); root.add(sf.group);
    var flux = G(); for (var q = 0; q < 3; q++) { var r = new T.Mesh(new T.TorusGeometry(1.9 + (q - 1) * .25, .035, 6, 48), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 })); r.rotation.x = PI / 2; r.position.y = 4.6; flux.add(r); } root.add(flux);
    root.rotation.y = -.5; root.position.y = 0;
    return { group: root, tick: true, parts: { core: PART(core, 'Toroidal iron core', 7), sec: PART(sec, 'Secondary winding (5 A or 1 A)', 7), prim: PART(prim, 'Primary conductor (one turn)', 8), hous: PART(hous, 'Housing', 8), tb: PART(tb, 'Secondary terminals S1, S2', 5), burden: PART(burden, 'Burden: meter or relay', 5) },
      update: function (v, time) { var n = v * 30, secA = Math.min(n, n < 20 ? n : 20 + (n - 20) * .12) * 5; core.material.emissiveIntensity = Math.min(1, n / 25) * .8; flux.children.forEach(function (r, i) { r.material.opacity = Math.min(.9, n / 22) * (.5 + .5 * Math.sin(time * 6 + i)); }); fl.update(time, .3 + v * .6, v > .01 ? 1 : 0); sf.update(time, .3 + Math.min(n, 20) / 20 * .6, v > .01 ? 1 : 0); ndl && (burden.children[1].rotation.z = -(Math.min(secA, 100) / 100 - .5) * 1.4); } };
  };
  /* ---------- potential transformer ---------- */
  B.pt = function () {
    var root = G(); ground(root, 10, 10); cyl(1.6, 1.0, k.grey, 0, .5, 0, root, 30); var tank = box(3.4, 3.0, 3.4, k.grey, 0, 2.5, 0, root); var col = shedCol(root, 0, 4, 0, 5.6, 1.1, porcG); var topcap = cap(root, 0, 9.9, 0, .9, .5); cyl(.2, .8, k.alu, 0, 10.4, 0, root, 12); K.txt('A  (11 kV)', 1.8, .5, null, 0, 11.2, 0, root, '#fde68a', 44);
    var inner = G(); var coreG = G(); box(2.4, .4, 1.2, k.iron, 0, 2.1, 0, coreG); box(2.4, .4, 1.2, k.iron, 0, 3.7, 0, coreG); box(.4, 1.6, 1.2, k.iron, -1.0, 2.9, 0, coreG); box(.4, 1.6, 1.2, k.iron, 1.0, 2.9, 0, coreG); var hv = K.helixY(.55, 1.2, 30, .028, M(0xb45309, .6, .35)); hv.position.set(-1.0, 2.9, 0); var lv = K.helixY(.8, 1.0, 6, .08, k.cu); lv.position.set(-1.0, 2.9, 0); inner.add(coreG, hv, lv); root.add(inner); tank.material = K.ghost(0x9ca3af, .3);
    var fuse = box(.3, 1.4, .3, K.ghost(0xe5e7eb, .6), 0, 6.5, 0, root); var tb = G(); box(1.8, 1.0, .8, k.dark, 2.3, 1.7, 2.0, tb); K.txt('a  n', 1.4, .4, null, 2.3, 1.75, 2.45, tb, '#fde68a', 44); root.add(tb); var vm = G(); box(1.8, 1.6, .5, k.black, 5.2, 2.2, 2.0, vm); var nd = box(.06, .9, .04, M(0xdc2626, 0, .4), 5.2, 2.4, 2.3, vm); root.add(vm); K.txt('V', .6, .6, null, 5.2, 1.7, 2.3, vm, '#fff', 60);
    var fl = K.flow([[0, 10.4, 0], [0, 8.0, 0], [0, 6.6, 0], [-1.0, 4.4, 0], [-1.0, 1.6, 0], [0, 0, 0]], 0xfde047, 12, .08); root.add(fl.group); var sf = K.flow([[2.3, 1.9, 2.0], [4.4, 2.2, 2.2], [5.2, 2.7, 2.2], [4.4, 1.7, 2.0]], 0x34d399, 6, .07); root.add(sf.group);
    root.rotation.y = -.5; root.position.y = 0;
    return { group: root, tick: true, parts: { hv: PART(hv, 'Primary winding (many turns)', 6), lv: PART(lv, 'Secondary winding (few turns, 110 V)', 6), core: PART(coreG, 'Iron core', 6), bush: PART(col, 'Porcelain insulator with sheds', 9), tb: PART(tb, 'Secondary terminals', 6), fuse: PART(fuse, 'Primary fuse', 6) },
      update: function (v, time) { vm.children[1].rotation.z = -(v - .5) * 1.4; fl.update(time, .3, v > .02 ? 1 : 0); sf.update(time, .3, v > .02 ? 1 : 0); hv.material.emissive = hv.material.emissive; } };
  };
  /* ---------- surge arrester ---------- */
  B.arrester = function () {
    var root = G(); ground(root, 10, 10); box(2.4, .6, 2.4, k.grey, 0, .3, 0, root); var col = shedCol(root, 0, .6, 0, 8.4, 1.15, porcG); var discs = G(), dm = []; for (var i = 0; i < 12; i++) { var m = M(0x3a3f47, .2, .6, { emissive: 0x7dd3fc, emissiveIntensity: 0 }); cyl(.6, .45, m, 0, 1.0 + i * .6, 0, discs, 24); dm.push(m); } root.add(discs); cap(root, 0, 9.2, 0, 1.0, .5); var ring = K.tor(1.6, .14, k.alu, 0, 8.8, 0, root, PI / 2); cyl(.2, .8, k.alu, 0, 9.8, 0, root, 12); K.txt('LINE', 1.4, .45, null, 0, 10.6, 0, root, '#fde68a', 44);
    var cnt = G(); box(1.8, 1.5, 1.4, k.dark, 3.2, 1.2, 0, cnt); var lcd = K.lcd(1.5, .9, cnt, 3.2, 1.3, .72, '#0a0a0a'); root.add(cnt); K.txt('EARTH', 1.4, .45, null, 0, -.9, 0, root, '#86efac', 44).rotation.x = -PI / 2; box(1.4, .15, 1.4, k.green, 0, .0, 0, root); K.tube([[0, .4, 1.0], [2.4, 0, 1.4], [3.2, .7, .6]], .08, k.black, root, 14);
    var fl = K.flow([[0, 10, 0], [0, 6, 0], [0, 1, 0], [0, .1, 1.0], [2.4, 0, 1.4], [4.2, -.5, 1.4]], 0xfde047, 18, .14); root.add(fl.group); var arc = new T.PointLight(0x7dd3fc, 0, 14); arc.position.set(0, 5, 2); root.add(arc); var count = 0, prev = 0;
    root.rotation.y = -.5; root.position.y = 0;
    return { group: root, tick: true, parts: { col: PART(col, 'Porcelain housing with sheds', 10), discs: PART(discs, 'Zinc-oxide (ZnO) discs', 9), ring: PART(ring, 'Grading ring', 9), cnt: PART(cnt, 'Surge counter', 6), line: PART(root.children[3], 'Line terminal', 6) },
      update: function (v, time) { var on = Math.sin(Math.min(1, v * 1.1) * PI) * (v > .02 && v < .98 ? 1 : 0), pk = on; dm.forEach(function (m, i) { m.emissiveIntensity = pk * (1.1 + .4 * Math.sin(time * 40 + i)); }); fl.update(time, .6 + pk, pk > .05 ? 1 : 0); arc.intensity = pk * 3; if (v > .9 && prev <= .9) count++; prev = v; if (v < .05) prev = 0; lcd.set(['SURGES', String(count + (v > .9 ? 0 : 0))], '#fca5a5'); } };
  };
  /* ---------- Buchholz relay ---------- */
  B.buchholz = function () {
    var root = G(), oil = M(0xd9a441, 0, .2, { transparent: true, opacity: .55 }), pipeM = K.ghost(0x6b7280, .5);
    var tankP = cyl(1.0, 5, k.grey, -6, 0, 0, root, 24); tankP.rotation.z = PI / 2; var consP = cyl(1.0, 5, k.grey, 6, 0, 0, root, 24); consP.rotation.z = PI / 2; var tank = box(3, 5, 5, k.dark, -8.8, -.2, 0, root); var cons = cyl(1.7, 5.5, k.grey, 8.8, 2.0, 0, root, 30); cons.rotation.x = PI / 2; K.txt('TRANSFORMER', 3.6, .55, null, -8.8, 3.0, 2.6, root, '#e5e7eb', 36); K.txt('CONSERVATOR', 3.6, .55, null, 8.8, 4.3, 2.8, root, '#e5e7eb', 36);
    var rel = box(5.2, 4.6, 4.6, K.ghost(0x6b7280, .35), 0, 0, 0, root); var oilBody = box(5.0, 4.4, 4.4, oil, 0, 0, 0, root); var oilTop = box(5.0, 1, 4.4, oil, 0, 1.7, 0, root); var gas = box(5.0, .02, 4.4, new T.MeshBasicMaterial({ color: 0xe5e7eb, transparent: true, opacity: .35, depthWrite: false }), 0, 2.2, 0, root); gas.scale.y = 1;
    var fl1 = G(); fl1.position.set(-1.4, 1.2, 0); cyl(.55, 1.0, k.orange, .7, 0, 0, fl1, 20).rotation.x = PI / 2; box(1.4, .08, .08, k.steel, .0, 0, 0, fl1); root.add(fl1); var fl2 = G(); fl2.position.set(-1.0, -1.0, 0); box(.12, 1.6, 3.2, k.steel, 0, 0, 0, fl2); box(1.6, .08, .08, k.steel, .8, .0, 0, fl2); root.add(fl2); var bub = []; for (var i = 0; i < 20; i++) { var b = new T.Mesh(new T.SphereGeometry(.09, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 })); b.userData.o = Math.random(); b.userData.x = (Math.random() - .5) * 3; root.add(b); bub.push(b); }
    var al = box(.8, .8, .8, K.glowM(0xfacc15, 0), 1.7, 3.2, 0, root), tr = box(.8, .8, .8, K.glowM(0xef4444, 0), 3.0, 3.2, 0, root); K.txt('ALARM', 1.0, .35, null, 1.7, 2.6, 2.4, root, '#fde68a', 40); K.txt('TRIP', 1.0, .35, null, 3.0, 2.6, 2.4, root, '#fca5a5', 40); box(.18, 1.2, .18, k.alu, 0, 2.8, 0, root); var cock = cyl(.2, .8, k.brass, -2.0, 2.9, 0, root, 12);
    var sr = K.flow([[-5.5, 0, 0], [-2.6, 0, 0], [2.6, 0, 0], [5.5, 0, 0]], 0xfb923c, 12, .12); root.add(sr.group);
    root.rotation.y = -.45; root.position.y = 4;
    return { group: root, tick: true, parts: { relay: PART(rel, 'Relay housing with glass windows', 8), f1: PART(fl1, 'Upper float: gas alarm', 6), f2: PART(fl2, 'Lower flap: oil-surge trip', 6), gas: PART(gas, 'Collected gas', 6), pipe: PART(tankP, 'Pipe from the tank', 8), cons: PART(cons, 'Conservator tank', 8), cock: PART(cock, 'Gas test cock', 6) },
      update: function (e, time, mode) { var gasM = mode === 'gas', lvl = gasM ? e : 0, srg = mode === 'surge' ? e : 0; var top = 2.2 - lvl * 2.0; oilTop.scale.y = Math.max(.02, (top - .7) / 1); oilTop.position.y = .7 + (top - .7) / 2 + .0; gas.position.y = top; gas.scale.y = 1; gas.visible = lvl > .02;
        fl1.rotation.z = -lvl * .9 * (fl1.position.y > 0 ? 1 : 1); fl1.position.y = 1.2 - lvl * 1.4; bub.forEach(function (b) { b.visible = gasM && e > .03; var u = ((time * .5 + b.userData.o) % 1); b.position.set(-5.6 * 0 + b.userData.x * .6 - 2.0 * 0 + (-1.0), -2 + u * (top + 2), b.userData.x * .4); b.material.opacity = (1 - u) * .8; });
        fl2.rotation.z = srg * 1.2; sr.update(time, .9, srg > .03 && srg < .98 ? 1 : 0); al.material.emissiveIntensity = lvl > .6 ? 2 : 0; tr.material.emissiveIntensity = srg > .6 ? 2 : 0; } };
  };
  /* ---------- bay walkthrough ---------- */
  B.bay = function () {
    var root = G(), ids = ['line', 'la', 'pt', 'iso1', 'ct', 'cb', 'iso2', 'bus']; ground(root, 38, 9);
    var X = { line: -15.5, la: -12, pt: -8.2, iso1: -4.4, ct: -.6, cb: 3.2, iso2: 7.2, bus: 11.5 }, pads = {};
    var g1 = G(); [-1, 1].forEach(function (z) { cyl(.3, 11, grey, X.line, 5.5, z * 3.2, g1, 12); }); box(.3, .3, 7.4, grey, X.line, 11, 0, g1); box(.12, .12, 7, M(0x111827, 0, .6), X.line, 10, 0, g1); K.tube([[X.line - 2, 10, 0], [X.line, 10.4, 0], [X.line + 1.6, 7.6, 0]], .06, k.alu, g1, 20); root.add(g1); pads.line = pad(root, X.line, 5.5, 0, 3.4, 12, 8);
    var g2 = G(); shedCol(g2, X.la, .6, 0, 4.6, .55, porcG); cap(g2, X.la, 5.4, 0, .5, .3); K.tor(.9, .06, k.alu, X.la, 5.1, 0, g2, PI / 2); box(.8, .8, .8, k.dark, X.la, .4, 0, g2); root.add(g2); pads.la = pad(root, X.la, 3, 0, 2.2, 6.4, 2.2);
    var g3 = G(); shedCol(g3, X.pt, .6, 0, 4.4, .6, porcG); box(1.4, 1.0, 1.4, k.grey, X.pt, 5.4, 0, g3); box(1.0, .9, 1.0, k.grey, X.pt, .4, 0, g3); root.add(g3); pads.pt = pad(root, X.pt, 3, 0, 2.2, 6.4, 2.2);
    var g4 = G(); [-1, 1].forEach(function (s) { shedCol(g4, X.iso1 + s * 1.3, 0, 0, 3.4, .5, porc); }); var blade = box(2.6, .22, .3, k.alu, X.iso1, 3.5, 0, g4); box(.3, .3, 1.0, k.dark, X.iso1, 3.6, .7, g4); root.add(g4); pads.iso1 = pad(root, X.iso1, 2.2, 0, 3.8, 4.6, 2.2);
    var g5 = G(); shedCol(g5, X.ct, .6, 0, 3.4, .5, porc); box(1.5, 1.7, 1.5, k.grey, X.ct, 4.8, 0, g5); K.tor(.55, .12, k.cu, X.ct, 4.8, 0, g5, 0); root.add(g5); pads.ct = pad(root, X.ct, 3, 0, 2.2, 6, 2.2);
    var g6 = G(); [-1, 1].forEach(function (s) { shedCol(g6, X.cb + s * 1.1, 1.8, 0, 3.6, .5, porc); }); box(3.4, .9, 1.4, k.dark, X.cb, 1.3, 0, g6); box(3.0, 1.0, 1.0, k.steel, X.cb, 5.7, 0, g6); box(1.6, 1.8, 1.6, k.grey, X.cb, .9, 0, g6); root.add(g6); pads.cb = pad(root, X.cb, 3.4, 0, 4.2, 6.6, 2.4);
    var g7 = G(); [-1, 1].forEach(function (s) { shedCol(g7, X.iso2 + s * 1.3, 0, 0, 3.4, .5, porc); }); var blade2 = box(2.6, .22, .3, k.alu, X.iso2, 3.5, 0, g7); root.add(g7); pads.iso2 = pad(root, X.iso2, 2.2, 0, 3.8, 4.6, 2.2);
    var g8 = G(); cyl(.3, 6.5, k.alu, X.bus, 5.2, 0, g8, 14).rotation.x = PI / 2; [-3, 0, 3].forEach(function (z) { shedCol(g8, X.bus, 0, z, 4.6, .45, porc); cyl(.3, 2.0, k.alu, X.bus, 5.2, z, g8, 14).rotation.z = PI / 2; }); root.add(g8); pads.bus = pad(root, X.bus, 4.4, 0, 3.4, 9, 8);
    var path = K.flow([[X.line + 1.6, 7.6, 0], [X.la + 0, 7.0, 0], [X.pt, 6.9, 0], [X.iso1 - 1.3, 3.7, 0], [X.iso1 + 1.3, 3.7, 0], [X.ct, 5.2, 0], [X.cb - 1.1, 5.8, 0], [X.cb + 1.1, 5.8, 0], [X.iso2 - 1.3, 3.7, 0], [X.iso2 + 1.3, 3.7, 0], [X.bus, 5.2, 0]], 0xfde047, 36, .1); root.add(path.group);
    root.rotation.y = -.35; root.position.y = 0;
    var parts = { line: PART(g1, 'Incoming line gantry', 14), la: PART(g2, 'Lightning arrester', 7), pt: PART(g3, 'Potential transformer (CVT)', 7), iso1: PART(g4, 'Line isolator', 7), ct: PART(g5, 'Current transformer', 7), cb: PART(g6, 'Circuit breaker', 7), iso2: PART(g7, 'Bus isolator', 7), bus: PART(g8, 'Busbar', 9) };
    return { group: root, tick: true, parts: parts, update: function (e, time, mode) { ids.forEach(function (id) { pads[id].material.opacity = id === mode ? .16 + .1 * Math.sin(time * 4) : 0; }); path.update(time, .12, e > .03 ? 1 : 0); blade.rotation.z = (1 - Math.min(1, e * 3)) * 1.0 * 0; } };
  };
})();
