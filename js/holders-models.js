/* Lamp holder 3D models. 1 unit = 100 mm. Opening of every holder sits at local y = 0, the body extends toward -y, the bulb leaves toward +y. */
(function () {
  'use strict';
  var T = THREE, V = VK, M = V.mat, v3 = V.v3, C = window.CAT, PI = Math.PI, B = C.build = {};
  var _c = {}; function c(k, f) { return _c[k] || (_c[k] = f()); }
  var X = {
    ivory: function () { return c('iv', function () { var m = new T.MeshPhysicalMaterial({ color: 0xf1e7cf, roughness: .38, clearcoat: .35, clearcoatRoughness: .3, side: T.DoubleSide }); return m; }); },
    white: function () { return c('wh', function () { return new T.MeshPhysicalMaterial({ color: 0xf6f6f0, roughness: .16, clearcoat: 1, clearcoatRoughness: .08, side: T.DoubleSide }); }); },
    black: function () { return c('bk', function () { return new T.MeshStandardMaterial({ color: 0x1b1d22, roughness: .55, metalness: .1, side: T.DoubleSide }); }); },
    brass: function () { return c('br', function () { return new T.MeshStandardMaterial({ color: 0xdcae3c, metalness: .95, roughness: .26, side: T.DoubleSide }); }); },
    steel: function () { return c('st', function () { return new T.MeshStandardMaterial({ color: 0xb4bcc6, metalness: .9, roughness: .3, side: T.DoubleSide }); }); },
    alu: function () { return c('al', function () { return new T.MeshStandardMaterial({ color: 0xdde3ea, metalness: .95, roughness: .22, side: T.DoubleSide }); }); },
    cu: function () { return c('cu', function () { return new T.MeshStandardMaterial({ color: 0xc0743a, metalness: .95, roughness: .28 }); }); },
    rubber: function () { return c('rb', function () { return new T.MeshStandardMaterial({ color: 0x15171b, roughness: .85 }); }); },
    red: function () { return c('rd', function () { return new T.MeshStandardMaterial({ color: 0xc62828, roughness: .5 }); }); },
    blue: function () { return c('bl', function () { return new T.MeshStandardMaterial({ color: 0x1e5fd0, roughness: .5 }); }); },
    wall: function () { return c('wl', function () { return new T.MeshStandardMaterial({ color: 0x232c3a, roughness: .92, metalness: .05 }); }); },
    glass: function () { return c('gl', function () { return new T.MeshPhysicalMaterial({ color: 0xdfeaf6, roughness: .05, metalness: 0, transparent: true, opacity: .34, depthWrite: false, side: T.DoubleSide }); }); },
    frost: function () { return c('fr', function () { return new T.MeshPhysicalMaterial({ color: 0xf2f4f7, roughness: .5, transparent: true, opacity: .55, depthWrite: false, side: T.DoubleSide }); }); }
  };
  function G() { return new T.Group(); }
  function mesh(g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; }
  function lat(p, m, seg, phi) { return new T.Mesh(new T.LatheGeometry(p.map(function (a) { return new T.Vector2(a[0], a[1]); }), seg || 40, 0, phi || PI * 2), m); }
  function half(p, m, seg) { var o = lat(p, m, seg || 44, PI); o.rotation.y = PI / 2; return o; }  /* open side faces +z */
  function cyl(r, h, m, x, y, z, seg) { return mesh(new T.CylinderGeometry(r, r, h, seg || 20), m, x, y, z); }
  function tube(pts, r, m, seg) { return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), seg || 40, r, 8, false), m); }
  /* sawtooth profile = thread ridges (rings) */
  function thread(r, y0, y1, depth, pitch) { var p = [], n = Math.max(2, Math.round(Math.abs(y1 - y0) / pitch)), i; for (i = 0; i <= n; i++) { var y = y0 + (y1 - y0) * i / n; p.push([r + (i % 2 ? 0 : depth), y]); } return p; }
  function screwHead(m, x, y, z) { var g = G(); g.add(cyl(.028, .02, m || X.brass(), 0, 0, 0, 14)); var sl = mesh(new T.BoxGeometry(.05, .008, .008), X.black(), 0, .011, 0); g.add(sl); g.position.set(x, y, z); return g; }
  function wire(pts, col) { return tube(pts.map(function (a) { return v3(a[0], a[1], a[2]); }), .013, col); }
  var FIL = []; /* emissive materials updated for lit state */
  function filMat() { var m = new T.MeshStandardMaterial({ color: 0x887766, emissive: 0xffb347, emissiveIntensity: 0, roughness: .4 }); return m; }

  /* ---- lamps ---- */
  function glassProf(kind, s) {
    var p = kind === 'candle' ? [[.07, 0], [.1, .06], [.16, .2], [.175, .36], [.14, .52], [.08, .64], [0, .72]]
      : kind === 'hid' ? [[.2, 0], [.25, .2], [.4, .55], [.45, .95], [.42, 1.35], [.3, 1.75], [.12, 2.0], [0, 2.05]]
        : [[.135, 0], [.15, .08], [.2, .17], [.27, .28], [.3, .4], [.285, .52], [.22, .64], [.12, .72], [0, .75]];
    return p.map(function (a) { return [a[0] * (s || 1), a[1] * (s || 1)]; });
  }
  /* screw-base lamp. R = cap radius. origin = contact tip, +y = away from the holder. Returns {g, lamp, lit(on)} */
  function esLamp(R, kind) {
    var g = G(), capH = R * 2.1; var gm = X.glass(); if (kind === 'hid') gm = X.frost();
    var cap = lat(thread(R * .97, .02, capH, R * .05, R * .26), X.alu(), 36); g.add(cap);
    var tip = lat([[0, 0], [R * .3, 0], [R * .34, .02], [R * .3, R * .22], [0, R * .24]], X.brass(), 20); g.add(tip);
    var ins = lat([[R * .35, R * .3], [R * .97, R * .3], [R * .97, R * .5], [R * .35, R * .5]], X.black(), 24); g.add(ins);
    var gl = lat(glassProf(kind, kind === 'gls' ? R / .135 : 1), gm, 36); gl.position.y = capH; g.add(gl);
    var fm = filMat(); FIL.push(fm); var f = G(); f.position.y = capH + (kind === 'hid' ? 1.0 : kind === 'candle' ? .32 : .45);
    if (kind === 'hid') { f.add(lat([[0, -.5 * R], [R * .32, -.5 * R], [R * .32, R * 1.9], [0, R * 1.9]], X.alu(), 12)); var arc = cyl(R * .2, R * 1.6, fm, 0, R * .5, 0, 14); f.add(arc); f.add(cyl(R * .02, R * 3, X.steel(), R * .55, R * .6, 0, 6)); }
    else { var coil = mesh(new T.TorusKnotGeometry(R * .15, R * .018, 60, 6, 2, 9), fm); coil.rotation.x = PI / 2; coil.scale.set(1, 1, 1.6); f.add(coil); f.add(cyl(R * .012, R * 1.4, X.steel(), -R * .2, -R * .6, 0, 6)); f.add(cyl(R * .012, R * 1.4, X.steel(), R * .2, -R * .6, 0, 6)); }
    g.add(f);
    return { g: g, capH: capH, lit: function (on) { fm.emissiveIntensity = on ? 2.2 : 0; fm.color.setHex(on ? 0xfff0c8 : 0x887766); gm.opacity = on ? (kind === 'hid' ? .7 : .5) : (kind === 'hid' ? .55 : .34); } };
  }
  /* holder core. opening at y=0. Returns parts */
  function esCore(R, H, big) {
    var Ro = R + .08 * (big ? 1.6 : 1), P = {};
    var body = G(); body.add(half([[R * 1.04, .0], [Ro * 1.3, 0], [Ro * 1.3, -.05], [Ro * 1.1, -.09], [Ro * 1.0, -H * .45], [Ro * .96, -H * .92], [Ro * .6, -H], [R * .5, -H], [R * .5, -H + .02], [R * 1.04, -H + .02]], X.ivory(), 48)); P.body = body;
    var sh = G(); sh.add(half(thread(R * 1.0, -.02, -H * .84, R * .06, R * .26), X.brass(), 40)); P.shell = sh;
    var ct = G(); ct.add(cyl(R * .3, .04, X.brass(), 0, -H * .86, 0, 20)); ct.add(mesh(new T.BoxGeometry(R * .9, .012, R * .26), X.brass(), 0, -H * .78, 0)); P.contact = ct;
    var tm = G(); [-1, 1].forEach(function (sg) { tm.add(mesh(new T.BoxGeometry(.13, .12, .1), X.brass(), sg * (Ro * .84 + .02), -H * .45, 0)); tm.add(screwHead(X.steel(), sg * (Ro * .84 + .02), -H * .45 + .065, 0)); });
    P.terms = tm; var wr = G(); wr.add(wire([[-(Ro * .84 + .02), -H * .45, 0], [-(Ro * .84), -H * .8, .02], [-R * .2, -H * .88, 0]], X.red())); wr.add(wire([[(Ro * .84 + .02), -H * .45, 0], [(Ro * .84 + .02), -H * .98, .01], [Ro * .84, -H * 1.12, .01]], X.blue())); P.wires = wr;
    return P;
  }
  /* animation: lamp threads in. gap = travel, turns = rotations */
  function fit(lampObj, seatY, gap, turns, kindLit) { return function (t) { var e = t; lampObj.g.position.y = seatY + (1 - e) * gap; lampObj.g.rotation.y = (1 - e) * turns * PI * 2; lampObj.lit(e > .97); }; }
  function finish(root, parts, upd, extra) { var o = { group: root, parts: parts, update: function (t, time) { upd(t, time); } }; return o; }
  function PART(obj, label, zoom) { return { obj: obj, label: label, zoom: zoom || 1.5 }; }
  function slab(w, h, d, x, y, z) { var s = mesh(new T.BoxGeometry(w, h, d), X.wall(), x, y, z); return s; }

  /* ---------- 1 pendant ---------- */
  B.pendant = function () {
    var root = G(), ax = G(); ax.position.y = 2.2; ax.rotation.x = PI; root.add(ax);
    var P = esCore(.135, .95), lamp = esLamp(.135, 'gls'); ax.add(P.body, P.shell, P.contact, P.terms, P.wires); lamp.g.position.y = 1.6; ax.add(lamp.g);
    var shade = G(); shade.add(lat([[.165, .02], [.2, .02], [.2, -.02], [.165, -.02]], X.ivory(), 36), lat([[.165, .0], [.19, -.1], [.2, -.14]], X.ivory(), 36)); /* shade ring */
    var ring = lat([[.19, .01], [.26, .01], [.26, -.06], [.19, -.06]], X.ivory(), 40); ring.position.y = .0; shade = ring;
    var grip = G(); grip.add(half([[.11, -.95], [.15, -1.0], [.15, -1.18], [.09, -1.3], [.035, -1.35], [.035, -1.55], [.045, -1.55], [.045, -1.3]], X.ivory(), 36)); grip.add(mesh(new T.BoxGeometry(.2, .05, .06), X.brass(), 0, -1.08, 0)); grip.add(screwHead(X.steel(), .07, -1.04, .0));
    var cord = G(); cord.add(tube([v3(0, -1.0, 0), v3(0, -1.5, 0), v3(0, -1.9, 0)], .045, X.white(), 20)); [[-.012], [.012]].forEach(function (a) { cord.add(cyl(.012, .5, a[0] < 0 ? X.red() : X.blue(), a[0] * 1.5, -1.08, 0, 8)); });
    ax.add(shade, grip, cord);
    /* ceiling rose */
    var rose = G(); rose.add(lat([[0, 0], [.34, 0], [.38, -.02], [.3, -.14], [.1, -.2], [.055, -.22]], X.white(), 36)); var ceil = slab(3.6, .16, 3.6, 0, 4.26, 0); root.add(rose, ceil); rose.position.y = 4.18;
    var parts = { body: PART(ax.children[0], 'Body shell', 1.6), shell: PART(P.shell, 'Threaded brass shell', 2), contact: PART(P.contact, 'Centre contact', 2.4), terms: PART(P.terms, 'Terminals', 2.2), grip: PART(grip, 'Cord-grip cap', 2), cord: PART(cord, 'Flexible cord', 1.4), ring: PART(shade, 'Shade ring', 2.2), lamp: PART(lamp.g, 'Lamp', 1.8), rose: PART(rose, 'Ceiling rose', 2) };
    return finish(root, parts, fit(lamp, -.95 * .84, 1.1, 5));
  };

  /* ---------- 2 batten (bayonet) ---------- */
  function bcLamp(R) {
    var g = G(), capH = R * 2.4; g.add(lat([[R, .02], [R, capH], [R * .98, capH + .02], [R * .96, .02]], X.brass(), 36));
    [-1, 1].forEach(function (sg) { var pn = cyl(.026, .12, X.steel(), sg * R, capH * .42, 0, 10); pn.rotation.z = PI / 2; pn.position.x = sg * (R + .04); g.add(pn); });
    g.add(lat([[0, 0], [R * .32, 0], [R * .34, .02], [R * .3, R * .24], [0, R * .26]], X.brass(), 20));
    var gm = X.glass(), gl = lat(glassProf('gls', R / .135), gm, 36); gl.position.y = capH; g.add(gl);
    var fm = filMat(); FIL.push(fm); var coil = mesh(new T.TorusKnotGeometry(R * .15, R * .018, 60, 6, 2, 9), fm); coil.rotation.x = PI / 2; coil.position.y = capH + .45; g.add(coil);
    return { g: g, capH: capH, lit: function (on) { fm.emissiveIntensity = on ? 2.2 : 0; fm.color.setHex(on ? 0xfff0c8 : 0x887766); gm.opacity = on ? .5 : .34; } };
  }
  function bcCore(R, H) {
    var Ro = R + .1, P = {}, body = G(); body.add(half([[R * 1.05, 0], [Ro * 1.25, 0], [Ro * 1.25, -.05], [Ro * 1.1, -.1], [Ro, -H * .5], [Ro * .96, -H], [R * .5, -H], [R * 1.05, -H + .02]], X.ivory(), 48)); P.body = body;
    var sl = G(); [-1, 1].forEach(function (sg) { /* L-shaped bayonet slot */ sl.add(mesh(new T.BoxGeometry(.1, .1, .02), X.black(), sg * (R * 1.06), -.12, 0)); sl.add(mesh(new T.BoxGeometry(.05, .14, .02), X.black(), sg * (R * 1.06), -.19, 0)); }); P.slots = sl;
    var ct = G(); [-.3, .3].forEach(function (k) { ct.add(cyl(.045, .13, X.brass(), k * R, -H * .85, 0, 14)); ct.add(cyl(.02, .2, X.steel(), k * R, -H * .75, 0, 8)); var sp = tube([v3(k * R, -H * .8, 0), v3(k * R + .03, -H * .87, 0), v3(k * R - .03, -H * .93, 0), v3(k * R, -H * 1.0, 0)], .008, X.steel(), 14); ct.add(sp); }); P.contact = ct;
    var tm = G(); [-1, 1].forEach(function (sg) { tm.add(mesh(new T.BoxGeometry(.13, .12, .1), X.brass(), sg * (Ro * .9), -H * .55, 0)); tm.add(screwHead(X.steel(), sg * (Ro * .9), -H * .55 + .065, 0)); }); P.terms = tm;
    P.wires = G(); return P;
  }
  B.batten = function () {
    var root = G(), ax = G(); ax.position.y = 2.4; ax.rotation.x = PI; root.add(ax); var R = .11, P = bcCore(R, .9), lamp = bcLamp(R);
    ax.add(P.body, P.slots, P.contact, P.terms); lamp.g.position.y = 1.4; ax.add(lamp.g);
    var base = G(); base.add(cyl(.5, .1, X.ivory(), 0, -.9 - .05, 0, 48)); [-1, 1].forEach(function (sg) { base.add(screwHead(X.steel(), sg * .4, -.9 - .1, 0)); base.add(cyl(.045, .02, X.black(), sg * .4, -.9 - .1, 0)); }); base.add(mesh(new T.CylinderGeometry(.5, .5, .12, 48, 1, true), X.ivory())); base.position.y = 0; ax.add(base);
    var ceil = slab(4, .3, 4, 0, 2.4 + .9 + .15, 0); root.add(ceil);
    var screws = G(); [-1, 1].forEach(function (sg) { var s = cyl(.04, .3, X.steel(), sg * .4, 2.4 + .9 - .05, 0); screws.add(s); }); root.add(screws);
    var parts = { body: PART(P.body, 'Body', 1.8), slots: PART(P.slots, 'Bayonet slots', 2.4), contact: PART(P.contact, 'Spring plunger contacts', 2.3), terms: PART(P.terms, 'Terminals', 2.2), base: PART(base, 'Base plate', 1.8), screws: PART(screws, 'Fixing screws', 2.2), lamp: PART(lamp.g, 'Bayonet lamp (B22)', 1.8) };
    return finish(root, parts, function (t) { var push = Math.min(1, t / .55), tw = Math.max(0, (t - .55) / .45); lamp.g.position.y = -.28 + (1 - push) * 1.1; lamp.g.rotation.y = (1 - tw) * -PI / 3 * (push > .99 ? 1 : 0); lamp.lit(t > .97); });
  };

  /* ---------- 3 angle ---------- */
  B.angle = function () {
    var root = G(), wall = slab(4, 3.4, .3, 0, 1.7, -.4); root.add(wall);
    var ax = G(); ax.position.set(0, 1.4, 0); ax.rotation.x = -PI / 2 + PI / 4 * 0; var R = .135, P = esCore(R, .9), lamp = esLamp(R, 'gls');
    /* axis points out of the wall and 45 degrees upward */
    ax.rotation.set(PI / 2 - PI / 4, 0, 0); ax.add(P.body, P.shell, P.contact, P.terms, P.wires); ax.add(lamp.g);
    var plate = G(); plate.add(mesh(new T.BoxGeometry(.9, 1.0, .08), X.ivory(), 0, 1.4, -.22)); [[-.32, .4], [.32, .4], [-.32, -.4], [.32, -.4]].forEach(function (a) { plate.add(screwHead(X.steel(), a[0], 1.4 + a[1], -.17)); });
    var elbow = G(); elbow.add(lat([[.0, -.05], [.2, -.05], [.2, -.4], [.17, -.7], [.0, -.8]], X.ivory(), 36)); elbow.position.set(0, 1.4, -.15); elbow.rotation.x = PI / 2 - PI / 4; /* stem toward wall */
    var neck = mesh(new T.CylinderGeometry(.18, .22, .42, 28), X.ivory(), 0, 1.4, -.05); neck.rotation.x = PI / 2; ax.position.set(0, 1.4, .12);
    root.add(plate, neck, elbow);
    var parts = { plate: PART(plate, 'Wall plate', 1.8), neck: PART(neck, 'Angled neck', 2), body: PART(P.body, 'Socket body', 1.8), shell: PART(P.shell, 'Threaded shell', 2.2), contact: PART(P.contact, 'Centre contact', 2.4), terms: PART(P.terms, 'Terminals', 2.2), lamp: PART(lamp.g, 'Lamp', 1.8) };
    return finish(root, parts, fit(lamp, -.95 * .84, 1.1, 5));
  };

  /* ---------- 4 bracket ---------- */
  B.bracket = function () {
    var root = G(), wall = slab(4, 3.6, .3, 0, 1.8, -.4); root.add(wall);
    var plate = G(); plate.add(lat([[0, 0], [.34, 0], [.36, .04], [.3, .16], [.1, .22], [.07, .22]], X.brass(), 40)); plate.rotation.x = PI / 2; plate.position.set(0, 1.5, -.25); root.add(plate);
    var arm = tube([v3(0, 1.5, -.1), v3(0, 1.5, .5), v3(0, 1.85, 1.0), v3(0, 2.3, 1.15), v3(0, 2.55, 1.15)], .06, X.brass(), 50); root.add(arm);
    var ax = G(); ax.position.set(0, 2.55, 1.15); var R = .135, P = esCore(R, .95), lamp = esLamp(R, 'gls'); ax.add(P.body, P.shell, P.contact, P.terms, P.wires, lamp.g); root.add(ax);
    var cup = lat([[.0, -.95], [.2, -.95], [.2, -1.05], [.07, -1.1], [.0, -1.1]], X.brass(), 28); ax.add(cup);
    var tb = G(); tb.add(mesh(new T.BoxGeometry(.5, .2, .24), X.ivory(), 0, 1.5, -.05)); [-1, 0, 1].forEach(function (k) { tb.add(screwHead(X.steel(), k * .15, 1.61, -.05)); }); root.add(tb);
    var parts = { plate: PART(plate, 'Wall rose', 1.8), tb: PART(tb, 'Terminal block', 2.2), arm: PART(arm, 'Bracket arm', 1.4), body: PART(P.body, 'Holder body', 1.8), shell: PART(P.shell, 'Threaded shell', 2.2), contact: PART(P.contact, 'Centre contact', 2.4), lamp: PART(lamp.g, 'Lamp', 1.8) };
    return finish(root, parts, fit(lamp, -.95 * .84, 1.1, 5));
  };

  /* ---------- 5 Edison screw E27 / E14 ---------- */
  B.es = function () {
    var root = G(), a = G(), b = G(); a.position.set(-.55, 1.3, 0); b.position.set(.7, 1.3, 0); root.add(a, b);
    var Pa = esCore(.135, .95), la = esLamp(.135, 'gls'); a.add(Pa.body, Pa.shell, Pa.contact, Pa.terms, Pa.wires, la.g);
    var Pb = esCore(.07, .6), lb = esLamp(.07, 'candle'); b.add(Pb.body, Pb.shell, Pb.contact, Pb.terms, Pb.wires, lb.g);
    var pad = mesh(new T.CylinderGeometry(1.6, 1.6, .1, 64), X.wall(), 0, .0, 0); root.add(pad);
    var stand = G(); stand.add(cyl(.05, 1.3, X.steel(), -.55, .65, -.0, 12)); stand.add(cyl(.05, 1.3, X.steel(), .7, .65, 0, 12)); stand.add(cyl(.3, .06, X.steel(), -.55, .03, 0, 24), cyl(.3, .06, X.steel(), .7, .03, 0, 24)); root.add(stand);
    var parts = { body: PART(Pa.body, 'Body (E27)', 2), shell: PART(Pa.shell, 'Threaded shell', 2.4), contact: PART(Pa.contact, 'Centre contact', 2.6), terms: PART(Pa.terms, 'Terminals', 2.4), lampA: PART(la.g, 'E27 lamp', 2), bodyB: PART(Pb.body, 'Body (E14)', 2.4), lampB: PART(lb.g, 'E14 candle lamp', 2.4) };
    return finish(root, parts, function (t) { fit(la, -.95 * .84, 1.1, 5)(t); fit(lb, -.6 * .84, .9, 5)(t); });
  };

  /* ---------- 6 Goliath Edison screw E40 ---------- */
  B.ges = function () {
    var root = G(), ax = G(); ax.position.set(0, 2.9, 0); root.add(ax); var R = .2, H = 1.35, P = esCore(R, H, true), lamp = esLamp(R, 'hid');
    ax.add(P.body, P.shell, P.contact, P.terms, P.wires, lamp.g);
    var por = G(); por.add(half([[R * 1.1, 0], [R * 2.0, 0], [R * 2.0, -.1], [R * 1.55, -.2], [R * 1.35, -H * .5], [R * 1.25, -H]], X.white(), 48)); /* porcelain skirt + base */
    por.add(mesh(new T.CylinderGeometry(.55, .6, .12, 6), X.steel(), 0, -H - .06, 0)); [0, 1, 2, 3, 4, 5].forEach(function (i) { var a = i / 6 * PI * 2; por.add(cyl(.035, .15, X.black(), Math.cos(a) * .5, -H - .05, Math.sin(a) * .5, 6)); });
    ax.add(por);
    var pole = mesh(new T.CylinderGeometry(.12, .16, 1.43, 24), X.steel(), 0, .715, 0); root.add(pole);
    var parts = { body: PART(P.body, 'Porcelain body', 1.7), shell: PART(P.shell, 'E40 threaded shell', 2), contact: PART(P.contact, 'Centre contact', 2.4), terms: PART(P.terms, 'Heavy terminals', 2), por: PART(por, 'Porcelain skirt & base', 1.5), lamp: PART(lamp.g, 'Metal halide / HPS lamp', 1.6), pole: PART(pole, 'Mast arm', 1.2) };
    return finish(root, parts, fit(lamp, -H * .84, 1.6, 7));
  };

  /* ---------- 7 tube-light holder (G13) ---------- */
  function tombstone(sign, spring) {
    var g = G(), body = G();
    body.add(mesh(new T.BoxGeometry(.5, .7, .36), X.white(), 0, 0, 0)); var top = cyl(.25, .36, X.white(), 0, .35, 0, 28); top.rotation.x = PI / 2; body.add(top);
    var slot = mesh(new T.BoxGeometry(.06, .5, .1), X.black(), sign * -.251, .1, 0); body.add(slot);
    var rotor = G(); var disc = cyl(.2, .12, X.brass(), sign * -.17, .08, 0, 28); disc.rotation.z = PI / 2; rotor.add(disc); [-1, 1].forEach(function (k) { rotor.add(mesh(new T.BoxGeometry(.035, .14, .1), X.black(), sign * -.235, .08 + k * .0, 0)); });
    var tm = G(); tm.add(mesh(new T.BoxGeometry(.14, .12, .1), X.brass(), 0, -.2, .2)); tm.add(screwHead(X.steel(), 0, -.14, .2)); tm.add(mesh(new T.BoxGeometry(.14, .12, .1), X.brass(), 0, -.2, -.2)); tm.add(screwHead(X.steel(), 0, -.14, -.2));
    var sp = G(); if (spring) { sp.add(tube([v3(sign * .1, 0, 0), v3(sign * .15, .04, 0), v3(sign * .2, -.04, 0), v3(sign * .25, .04, 0), v3(sign * .3, -.04, 0), v3(sign * .35, 0, 0)], .012, X.steel(), 30)); }
    g.add(body); return { g: g, rotor: rotor, tm: tm, sp: sp, body: body };
  }
  B.tube = function () {
    var root = G(), W = 1.9, A = tombstone(1, false), Bm = tombstone(-1, true);
    A.g.position.set(-W, 1.0, 0); Bm.g.position.set(W, 1.0, 0); A.g.rotation.y = 0; Bm.g.rotation.y = PI; /* both slots face the tube */
    A.g.add(A.tm); Bm.g.add(Bm.tm);
    var bar = mesh(new T.BoxGeometry(W * 2 + .9, .1, .5), X.steel(), 0, .62, 0); root.add(bar);
    var fm = new T.MeshStandardMaterial({ color: 0xe8eef5, emissive: 0xcfe6ff, emissiveIntensity: 0, roughness: .3, transparent: true, opacity: .55, depthWrite: false });
    var tb = G(); tb.position.y = 1.0; var tl = (W - .25) * 2 - .05; var glass = cyl(.13, tl, fm, 0, 0, 0, 36); glass.rotation.z = PI / 2; tb.add(glass);
    var pins = G(); [-1, 1].forEach(function (s) { var cap = cyl(.145, .12, X.alu(), s * (tl / 2 + .02), 0, 0, 24); cap.rotation.z = PI / 2; tb.add(cap); [-.0635, .0635].forEach(function (k) { var pn = cyl(.022, .14, X.brass(), s * (tl / 2 + .12), k, 0, 10); pn.rotation.z = PI / 2; pins.add(pn); }); });
    tb.add(pins); [-1, 1].forEach(function (s) { var f = mesh(new T.TorusGeometry(.05, .008, 6, 20), new T.MeshStandardMaterial({ color: 0x888888, emissive: 0xffb050, emissiveIntensity: 0 }), s * (tl / 2 - .06), 0, 0); f.rotation.y = PI / 2; tb.add(f); f.userData.fil = true; });
    root.add(A.g, Bm.g, tb); var parts = { fixed: PART(A.body, 'Fixed holder', 2.6), spring: PART(Bm.body, 'Spring-loaded holder', 2.6), tube: PART(tb, 'T8 tube (shortened)', 1.2), pins: PART(pins, 'Bi-pin contacts (G13)', 3), term: PART(A.tm, 'Terminals', 3), bar: PART(bar, 'Channel', 1.2) };
    var travel = .9;
    return finish(root, parts, function (t) { var k = Math.min(1, t / .6), r = Math.max(0, (t - .55) / .45); tb.position.z = (1 - k) * 1.3; tb.position.y = 1.0 + (1 - k) * .9; tb.rotation.x = (1 - r) * PI / 2; var lit = t > .97; fm.emissiveIntensity = lit ? 3 : 0; fm.opacity = lit ? .9 : .55; tb.children.forEach(function (o) { if (o.userData.fil) o.material.emissiveIntensity = lit ? 3 : 0; }); });
  };

  /* ---------- 8 weatherproof bulkhead ---------- */
  B.weather = function () {
    var root = G(), wall = slab(4.2, 3.6, .3, 0, 1.8, -.4); root.add(wall);
    var ax = G(); ax.position.set(0, 1.8, -.2); ax.rotation.x = PI / 2; root.add(ax); var R = .135, P = esCore(R, .6), lamp = esLamp(R, 'gls');
    var base = G(); base.add(lat([[0, -.6], [.9, -.6], [.92, -.58], [.92, -.3], [.8, -.1], [.62, 0], [.5, 0]], X.white(), 56)); /* cast housing */
    ax.add(P.body, P.shell, P.contact, P.terms, P.wires, base);
    var gasket = mesh(new T.TorusGeometry(.62, .05, 12, 56), X.rubber()); gasket.rotation.x = PI / 2; gasket.position.y = .02; ax.add(gasket);
    var dome = G(); var dm = lat([[.66, 0], [.66, .2], [.6, .55], [.45, .85], [.22, 1.02], [0, 1.06]], X.glass(), 56); dome.add(dm); ax.add(dome);
    var cage = G(); for (var i = 0; i < 8; i++) { var a = i / 8 * PI * 2, pts = [[.66, 0], [.66, .2], [.6, .55], [.45, .85], [.22, 1.02], [0, 1.08]].map(function (q) { return v3(Math.cos(a) * q[0] * 1.03, q[1] * 1.03, Math.sin(a) * q[0] * 1.03); }); cage.add(tube(pts, .016, X.steel(), 16)); }
    [.3, .65].forEach(function (y, j) { var r = j ? .52 : .67; var rr = mesh(new T.TorusGeometry(r * 1.03, .016, 6, 40), X.steel()); rr.rotation.x = PI / 2; rr.position.y = y; cage.add(rr); }); ax.add(cage);
    var bolts = G(); for (var k = 0; k < 4; k++) { var b2 = k / 4 * PI * 2 + PI / 4; bolts.add(cyl(.045, .08, X.steel(), Math.cos(b2) * .78, .1, Math.sin(b2) * .78, 12)); } ax.add(bolts);
    var gland = G(); gland.add(cyl(.12, .3, X.black(), 0, -.45, .95, 20)); gland.children[0].rotation.x = PI / 2; gland.add(cyl(.17, .1, X.black(), 0, -.45, .8, 20)); gland.children[1].rotation.x = PI / 2; gland.add(cyl(.05, .6, X.black(), 0, -.45, 1.3, 12)); gland.children[2].rotation.x = PI / 2; ax.add(gland); gland.position.set(0, 0, 0); gland.rotation.set(0, 0, 0);
    lamp.g.position.y = .0 + .0; ax.add(lamp.g);
    var parts = { housing: PART(base, 'Sealed housing', 1.5), gasket: PART(gasket, 'Rubber gasket', 2.2), dome: PART(dome, 'Glass dome', 1.6), cage: PART(cage, 'Guard cage', 1.6), bolts: PART(bolts, 'Cover screws', 2), gland: PART(gland, 'Cable gland', 2.6), shell: PART(P.shell, 'ES shell', 2.2), lamp: PART(lamp.g, 'Lamp', 1.8) };
    return finish(root, parts, function (t) { lamp.g.position.y = -.5 + (1 - t) * .3 * 0 + 0; lamp.g.rotation.y = 0; lamp.lit(t > .5); dome.children[0].material.opacity = t > .5 ? .42 : .34; });
  };

  /* ---------- 9 bayonet B22 ---------- */
  B.bayonet = function () {
    var root = G(), ax = G(); ax.position.y = 1.25; root.add(ax); var R = .11, P = bcCore(R, .9), lamp = bcLamp(R); ax.add(P.body, P.slots, P.contact, P.terms); ax.add(lamp.g);
    var cutPlane = mesh(new T.BoxGeometry(1.8, .06, 1.8), X.wall(), 0, .0, 0); root.add(cutPlane); var stand = cyl(.09, 1.2, X.steel(), 0, .6, -.0, 16); stand.position.set(0, -.0, 0); stand.visible = false; root.add(stand);
    var legs = G(); legs.add(cyl(.12, 1.05, X.steel(), 0, .525, 0, 20)); root.add(legs); ax.position.y = 1.05 + .9;
    var parts = { body: PART(P.body, 'Body', 2), slots: PART(P.slots, 'L-shaped slots', 3), contact: PART(P.contact, 'Spring plungers', 2.6), terms: PART(P.terms, 'Terminals', 2.4), lamp: PART(lamp.g, 'B22 lamp (two pins)', 1.8) };
    return finish(root, parts, function (t) { var push = Math.min(1, t / .55), tw = Math.max(0, (t - .55) / .45); lamp.g.position.y = -.28 + (1 - push) * 1.1; lamp.g.rotation.y = (1 - tw) * -PI / 3 * (push > .99 ? 1 : 0); lamp.lit(t > .97); });
  };
})();
