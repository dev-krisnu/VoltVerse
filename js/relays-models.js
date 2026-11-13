/* Relays, contactors and starters. 1 unit = 10 mm. update(t): 0 = de-energised, 1 = energised / tripped. */
(function () {
  'use strict';
  var T = THREE, V = VK, v3 = V.v3, C = window.CAT, PI = Math.PI, B = C.build = {};
  function M(c, m, r, x) { return new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m, roughness: r }, x || {})); }
  var K = { steel: M(0xc9d0d8, .95, .22), cu: M(0xc87b3e, .95, .25), brass: M(0xdcae3c, .95, .26), ag: M(0xe9edf2, 1, .15), black: M(0x17181c, .1, .6), dark: M(0x242830, .3, .5), grey: M(0x6b7380, .5, .45), white: M(0xf1f2ee, 0, .4), green: M(0x2e7d32, 0, .5), red: M(0xc62828, 0, .45), blue: M(0x1e5fd0, 0, .45), iron: M(0x8a929c, .9, .35), pcb: M(0x1d4ed8, .1, .55) };
  function G() { return new T.Group(); }
  function box(w, h, d, m, x, y, z, p) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); if (p) p.add(o); return o; }
  function cyl(r, h, m, x, y, z, p, seg) { var o = new T.Mesh(new T.CylinderGeometry(r, r, h, seg || 24), m); o.position.set(x || 0, y || 0, z || 0); if (p) p.add(o); return o; }
  function tube(pts, r, m) { return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(function (p) { return v3(p[0], p[1], p[2]); })), 40, r, 8, false), m); }
  function helixY(r, len, turns, wr, m) { var pts = [], n = turns * 14; for (var i = 0; i <= n; i++) { var u = i / n, a = u * turns * PI * 2; pts.push([Math.cos(a) * r, -len / 2 + u * len, Math.sin(a) * r]); } return tube(pts, wr, m); }
  function PART(o, l, z) { return { obj: o, label: l, zoom: z || 1.6 }; }
  function pad(r) { var p = cyl(r || 3, .06, M(0x141c28, .2, .9), 0, -.01, 0); return p; }
  function ghost(c, op) { var m = M(c, .1, .4, { transparent: true, opacity: op == null ? 1 : op }); return m; }
  function glow(on) { return on ? 1.6 : 0; }

  /* ---------- electromagnetic relay ---------- */
  B.relay = function () {
    var root = G(), cm = ghost(0x0d47a1, .45); var cover = box(3.4, 2.4, 2.9, cm, 0, 1.4, 0); root.add(cover);
    var base = box(3.6, .25, 3.1, K.white, 0, .12, 0); root.add(base);
    var coil = G(); var core = cyl(.3, 1.4, K.iron, -.8, .95, 0); coil.add(core); var wind = helixY(.55, 1.1, 10, .05, K.cu); wind.position.set(-.8, .95, 0); coil.add(wind); root.add(coil);
    var yoke = box(.2, 1.6, 1.5, K.iron, -1.5, 1.0, 0); yoke.position.y = 1.05; root.add(yoke); var yokeB = box(1.1, .2, 1.5, K.iron, -1.0, .35, 0); root.add(yokeB);
    var arm = G(); arm.position.set(-1.5, 1.85, 0); var plate = box(2.4, .12, 1.4, K.iron, 1.15, 0, 0); arm.add(plate); var spring = tube([[1.8, 0, .0], [1.9, .3, 0], [1.7, .6, 0], [1.9, .9, 0]], .03, K.steel); arm.add(spring); var movC = box(.34, .06, .34, K.ag, 2.4, 0, 0); arm.add(movC); root.add(arm);
    var com = box(.3, .9, .5, K.brass, -1.5, 1.4, 1.0); var no = box(.6, .1, .5, K.brass, .9, 1.4, 0); var nc = box(.6, .1, .5, K.brass, .9, 2.1, 0); [no, nc, com].forEach(function (o) { root.add(o); });
    var noC = box(.34, .06, .34, K.ag, .9, 1.46, 0), ncC = box(.34, .06, .34, K.ag, .9, 2.04, 0); root.add(noC, ncC);
    var pins = G(); [[-1.2, 1.2], [-1.2, -1.2], [1.4, 1.2], [1.4, -.6], [1.4, 0]].forEach(function (p) { pins.add(box(.12, .9, .3, K.steel, p[0], -.35, p[1])); }); root.add(pins);
    var lbl = box(1.9, .02, 1.0, K.white, 0, 2.62, 0); root.add(lbl); var fld = G(); for (var i = 0; i < 3; i++) { var r = new T.Mesh(new T.TorusGeometry(.8 + i * .35, .02, 6, 40), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 })); r.rotation.x = PI / 2; r.position.set(-.8, .95 + i * .15, 0); fld.add(r); } root.add(fld); root.add(pad(2.6));
    return { group: root, parts: { cover: PART(cover, 'Plastic cover', 1.6), coil: PART(coil, 'Coil and iron core', 1.8), yoke: PART(yoke, 'Iron yoke', 2), arm: PART(arm, 'Armature', 1.8), com: PART(com, 'COM terminal', 2.6), no: PART(no, 'NO contact', 2.6), nc: PART(nc, 'NC contact', 2.6), pins: PART(pins, 'Pins', 1.8) }, update: function (t) { cm.opacity = .45; arm.rotation.z = -t * .12; fld.children.forEach(function (r, i) { r.material.opacity = t * (.8 - i * .2); }); } };
  };

  /* ---------- contactor ---------- */
  B.contactor = function () {
    var root = G(), mats = []; var bm = M(0x2b303a, .2, .5, { transparent: true, opacity: .38 }); mats.push(bm); var body = box(3.6, 4.8, 3.2, bm, 0, 2.4, 0); root.add(body);
    var cap = box(3.7, .5, 3.3, K.dark, 0, 4.9, 0); root.add(cap);
    var term = G(); [-1.1, 0, 1.1].forEach(function (x, i) { term.add(box(.8, .45, .9, K.brass, x, 5.2, 0)); term.add(cyl(.18, .14, K.steel, x, 5.5, 0)); term.add(box(.8, .45, .9, K.brass, x, -.2, 0)); term.add(cyl(.18, .14, K.steel, x, .15, 0)); }); root.add(term);
    var labels = G(); ['L1', 'L2', 'L3'].forEach(function (n, i) { var c = document.createElement('canvas'); c.width = 128; c.height = 64; var x = c.getContext('2d'); x.fillStyle = '#fff'; x.font = '700 40px Inter,Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n, 64, 34); var s = new T.Mesh(new T.PlaneGeometry(.7, .35), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true })); s.position.set(-1.1 + i * 1.1, 5.0, 1.0); s.rotation.x = -PI / 2 + .2; labels.add(s); }); root.add(labels);
    var inner = G(); var fixed = G(); fixed.add(box(2.4, .35, 1.4, K.iron, 0, .9, 0)); [-.9, .9].forEach(function (x) { fixed.add(box(.35, 1.3, 1.4, K.iron, x, 1.4, 0)); }); fixed.add(box(.35, 1.3, 1.4, K.iron, 0, 1.4, 0)); var cl = helixY(.45, 1.1, 9, .05, K.cu); cl.position.set(0, 1.5, 0); fixed.add(cl); inner.add(fixed);
    var moving = G(); moving.add(box(2.4, .35, 1.4, K.iron, 0, 0, 0)); [-.9, .9].forEach(function (x) { moving.add(box(.35, .5, 1.4, K.iron, x, -.4, 0)); }); moving.position.y = 2.9; inner.add(moving);
    var bridges = G(); [-1.1, 0, 1.1].forEach(function (x) { var br = G(); br.add(box(.55, .15, .6, K.cu, x, 0, 0)); br.add(box(.3, .1, .3, K.ag, x - .0, -.1, 0)); br.position.y = 3.65; bridges.add(br); }); inner.add(bridges); [-1.1, 0, 1.1].forEach(function (x) { inner.add(box(.35, .12, .35, K.ag, x, 3.2, 0)); });
    var sp = G(); [-.9, .9].forEach(function (x) { sp.add(tube([[x, 1.1, .0], [x + .1, 1.5, 0], [x - .1, 2.0, 0], [x + .1, 2.4, 0], [x, 2.7, 0]], .03, K.steel)); }); inner.add(sp); root.add(inner);
    var aux = G(); aux.add(box(1.0, 1.0, .5, K.grey, 1.5, 3.4, 1.55)); aux.add(box(1.0, 1.0, .5, K.grey, -1.5, 3.4, 1.55)); root.add(aux);
    var coilT = G(); coilT.add(box(.7, .4, .5, K.brass, -1.4, 4.9, 1.45)); coilT.add(box(.7, .4, .5, K.brass, 1.4, 4.9, 1.45)); root.add(coilT);
    var led = box(.3, .12, .3, M(0x22c55e, 0, .4, { emissive: 0x22c55e, emissiveIntensity: 0 }), 0, 5.0, 1.55); root.add(led); root.add(pad(3.2));
    return { group: root, parts: { body: PART(body, 'Housing', 2.8), term: PART(term, 'Power terminals L1 to T3', 2.4), fixed: PART(fixed, 'Fixed magnet and coil', 2.6), moving: PART(moving, 'Moving armature', 2.6), bridges: PART(bridges, 'Main contact bridges', 2.6), sp: PART(sp, 'Return springs', 2.8), aux: PART(aux, 'Auxiliary contacts', 2.8), coilT: PART(coilT, 'Coil terminals A1, A2', 2.8) }, update: function (t) { moving.position.y = 2.9 - t * .55; bridges.position.y = -t * .55; led.material.emissiveIntensity = t > .95 ? 2 : 0; sp.scale.y = 1 - t * .1; } };
  };

  /* ---------- thermal overload relay ---------- */
  B.overload = function () {
    var root = G(), bm = M(0x3b4552, .2, .5, { transparent: true, opacity: .45 }); var body = box(3.8, 3.6, 2.6, bm, 0, 1.9, 0); root.add(body);
    var strips = [], bim = G(); [-1.2, 0, 1.2].forEach(function (x, i) { var s = G(); s.position.set(x, .6, 0); var b1 = box(.35, 2.4, .12, M(0xb87333, .8, .4), 0, 1.2, -.07), b2 = box(.35, 2.4, .12, M(0x8b95a1, .9, .35), 0, 1.2, .07); s.add(b1, b2); var hc = helixY(.28, 1.8, 8, .035, K.cu); hc.position.set(0, 1.2, 0); hc.scale.x = 1; s.add(hc); bim.add(s); strips.push(s); }); root.add(bim);
    var terms = G(); [-1.2, 0, 1.2].forEach(function (x) { terms.add(box(.8, .45, .9, K.brass, x, 4.0, 0)); terms.add(box(.8, .45, .9, K.brass, x, -.2, 0)); }); root.add(terms);
    var lever = G(); lever.position.set(0, 3.2, .9); var bar = box(3.2, .14, .14, K.steel, 0, 0, 0); lever.add(bar); root.add(lever);
    var nc = box(.6, .5, .5, K.green, -1.5, 3.55, 1.2), no = box(.6, .5, .5, K.red, 1.5, 3.55, 1.2); root.add(nc, no);
    var dial = G(); dial.add(cyl(.55, .25, K.dark, 0, 0, 0)); dial.add(box(.1, .06, .5, K.red, 0, .15, .2)); dial.rotation.x = PI / 2; dial.position.set(0, 2.0, 1.4); root.add(dial);
    var reset = cyl(.28, .3, K.blue, 1.4, 2.0, 1.4); reset.rotation.x = PI / 2; root.add(reset); root.add(pad(3.2));
    var heat = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ visible: false }));
    return { group: root, parts: { body: PART(body, 'Housing', 2.4), bim: PART(bim, 'Bimetal strips with heaters', 2.2), terms: PART(terms, 'Motor terminals', 2.4), lever: PART(lever, 'Trip bar', 2.6), nc: PART(nc, 'NC contact 95-96', 3), no: PART(no, 'NO contact 97-98', 3), dial: PART(dial, 'Current setting dial', 3), reset: PART(reset, 'Reset button', 3) }, update: function (t) { strips.forEach(function (s, i) { s.rotation.z = -t * .35; s.children[0].material.color.setHex(t > .5 ? 0xe2552b : 0xb87333); }); lever.rotation.z = t * .35 * 1; lever.position.y = 3.2 + t * .15; nc.position.y = 3.55 + t * .3; no.position.y = 3.55 - t * .15; } };
  };

  /* ---------- solid state relay ---------- */
  B.ssr = function () {
    var root = G(), bm = M(0x15171c, .2, .5, { transparent: true, opacity: 1 }); var body = box(4.4, 2.4, 3.0, bm, 0, 1.3, 0); root.add(body);
    var sink = G(); for (var i = 0; i < 10; i++) sink.add(box(.12, 1.8, 3.0, M(0x9aa3ae, .9, .3), -2.2 + i * .5 - .0, -.5, 0)); sink.position.y = 0; sink.scale.x = .9; root.add(sink);
    var top = box(4.4, .05, 3.0, M(0x1b1d22, .2, .5), 0, 2.52, 0); root.add(top);
    var ledM = M(0x22c55e, 0, .3, { emissive: 0x22c55e, emissiveIntensity: .0 }); var led = box(.5, .1, .5, ledM, -1.5, 2.58, 0); root.add(led);
    var inp = G(); [-.6, .6].forEach(function (z) { inp.add(box(.9, .5, .7, K.brass, -1.7, 2.8, z * 1.1)); inp.add(cyl(.16, .14, K.steel, -1.7, 3.1, z * 1.1)); }); root.add(inp);
    var out = G(); [-.6, .6].forEach(function (z) { out.add(box(.9, .5, .7, K.brass, 1.7, 2.8, z * 1.1)); out.add(cyl(.16, .14, K.steel, 1.7, 3.1, z * 1.1)); }); root.add(out);
    var inside = G(); var opto = box(.9, .5, .7, K.black, -.9, 1.5, 0); var tri = box(1.2, .5, .9, M(0x2a2d33, .4, .4), 1.0, 1.5, 0); var pcbx = box(4.0, .1, 2.6, K.green, 0, 1.0, 0); inside.add(pcbx, opto, tri); var arrows = G(); for (var k = 0; k < 2; k++) { arrows.add(box(.35, .03, .06, M(0xfde047, 0, .3, { emissive: 0xfde047, emissiveIntensity: 1.4 }), -.9 + .0, 1.85, -.15 + k * .3)); } inside.add(arrows); root.add(inside);
    var triM = tri.material; var lbl = box(2.0, .02, 1.0, K.white, 0, 2.55, 0); lbl.position.y = 2.545; lbl.scale.set(.8, 1, .6); root.add(lbl); root.add(pad(3.4));
    return { group: root, parts: { body: PART(body, 'Case', 2.6), sink: PART(sink, 'Heat sink', 2.2), inp: PART(inp, 'Input (3-32 V DC)', 2.6), out: PART(out, 'Output (AC load)', 2.6), opto: PART(opto, 'Opto-coupler', 3), tri: PART(tri, 'Triac / thyristors', 3), led: PART(led, 'Status LED', 3.2) }, update: function (t) { bm.opacity = 1 - .8 * t; ledM.emissiveIntensity = t > .5 ? 2.2 : 0; arrows.visible = t > .3; triM.emissive = new T.Color(t > .9 ? 0xff6a00 : 0x000000); triM.emissiveIntensity = t > .9 ? .9 : 0; } };
  };

  /* ---------- DOL starter ---------- */
  B.dol = function () {
    var root = G(), enc = box(8.2, 9.0, .5, M(0xd9dde2, .2, .6), 0, 4.5, -.4); root.add(enc);
    var ct = B.contactor(); ct.group.scale.setScalar(.85); ct.group.position.set(-1.7, 3.2, .2); root.add(ct.group);
    var ov = B.overload(); ov.group.scale.setScalar(.85); ov.group.position.set(-1.7, .1, .2); ov.group.visible = true; root.add(ov.group);
    ct.group.children.forEach(function (c) { if (c.geometry && c.geometry.type === 'CylinderGeometry' && c.geometry.parameters.radiusTop > 2.9) c.visible = false; }); ov.group.children.forEach(function (c) { if (c.geometry && c.geometry.type === 'CylinderGeometry' && c.geometry.parameters.radiusTop > 2.9) c.visible = false; });
    var st = G(); var gb = cyl(.45, .5, M(0x22c55e, 0, .4), 2.6, 7.4, .3); gb.rotation.x = PI / 2; var rb = cyl(.45, .5, M(0xdc2626, 0, .4), 2.6, 6.0, .3); rb.rotation.x = PI / 2; st.add(gb, rb); root.add(st);
    var motor = G(); motor.position.set(7.0, 1.2, 1.5); var mb = cyl(1.1, 2.6, M(0x2f5bd1, .4, .4), 0, 0, 0); mb.rotation.z = PI / 2; motor.add(mb); var fan = G(); fan.position.x = 1.5; for (var i = 0; i < 4; i++) { var bl = box(.06, .1, .9, K.steel, 0, 0, 0); var pv = G(); pv.rotation.x = i * PI / 2; bl.position.y = .55; pv.add(bl); fan.add(pv); } motor.add(fan); root.add(motor);
    var wires = G(); wires.add(tube([[-2.8, 5.8, .8], [-2.8, 7.8, 1.2], [-4.4, 8.2, 1.4]], .06, K.black)); wires.add(tube([[-1.7, -.9, .6], [1, -1.0, 1.4], [4.5, .6, 1.6], [5.8, 1.2, 1.5]], .09, K.blue)); root.add(wires); root.add(pad(5));
    var parts = { ct: PART(ct.group, 'Contactor', 1.4), ov: PART(ov.group, 'Thermal overload relay', 1.4), st: PART(st, 'START (green) and STOP (red)', 2), motor: PART(motor, '3-phase motor', 2), enc: PART(enc, 'Panel', 1) };
    return { group: root, parts: parts, tick: true, update: function (t, time) { ct.update(t); ov.update(0); fan.rotation.x = (fan.rotation.x + (t > .95 ? .45 : 0)) % (PI * 2); gb.position.z = .3 - (t > .1 && t < .9 ? .12 : 0); } };
  };
})();
