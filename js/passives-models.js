/* Passive component 3D models (resistors, inductors, capacitors). 1 unit = 10 mm. Each model: update(t) fades the outer body to show the inside. */
(function () {
  'use strict';
  var T = THREE, V = VK, v3 = V.v3, PI = Math.PI, PB = window.PB = { resistor: {}, inductor: {}, capacitor: {} };
  function M(c, m, r, x) { return new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m, roughness: r }, x || {})); }
  var K = { steel: M(0xc9d0d8, .95, .22), cu: M(0xc87b3e, .95, .25), brass: M(0xdcae3c, .95, .26), black: M(0x17181c, .1, .6), white: M(0xf2f2ec, 0, .35), alu: M(0xdfe5eb, .95, .25), silverT: M(0xd7dbe0, .9, .3), cer: M(0xf0ebe0, 0, .4) };
  var BAND = { black: 0x111111, brown: 0x6b3a1e, red: 0xc62828, orange: 0xf57c00, yellow: 0xfdd835, green: 0x2e9b46, blue: 0x1e5fd0, violet: 0x7e3ec4, grey: 0x8a8f96, white: 0xf5f5f5, gold: 0xd4a537, silver: 0xbfc4ca };
  var G = function () { return new T.Group(); };
  function mesh(g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; }
  function cyl(r, h, m, x, y, z, seg) { return mesh(new T.CylinderGeometry(r, r, h, seg || 24), m, x, y, z); }
  function cylX(r, h, m, x, y, z, seg) { var o = cyl(r, h, m, x, y, z, seg); o.rotation.z = PI / 2; return o; }
  function lat(p, m, seg, phi) { return new T.Mesh(new T.LatheGeometry(p.map(function (a) { return new T.Vector2(a[0], a[1]); }), seg || 40, 0, phi || PI * 2), m); }
  function tube(pts, r, m, seg) { return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(function (p) { return v3(p[0], p[1], p[2]); })), seg || 60, r, 8, false), m); }
  function helix(r, len, turns, wr, m, axis, steps) { var pts = [], n = steps || turns * 14; for (var i = 0; i <= n; i++) { var u = i / n, a = u * turns * PI * 2; pts.push(axis === 'x' ? [ -len / 2 + u * len, Math.cos(a) * r, Math.sin(a) * r] : [Math.cos(a) * r, -len / 2 + u * len, Math.sin(a) * r]); } return tube(pts, wr, m, n * 2); }
  function PART(o, l, z) { return { obj: o, label: l, zoom: z || 1.6 }; }
  function ghostMat(base, opt) { var m = base.clone(); m.transparent = true; m.depthWrite = true; m.side = T.DoubleSide; Object.assign(m, opt || {}); return m; }
  function fade(mats, t) { mats.forEach(function (m) { m.opacity = 1 - .86 * t; m.depthWrite = t < .3; }); }
  function pad(r) { return mesh(new T.CylinderGeometry(r || 1.7, r || 1.7, .06, 56), M(0x141c28, .2, .9), 0, -.01, 0); }
  function finish(root, parts, mats, extra) { var o = { group: root, parts: parts, update: function (t) { fade(mats, t); if (extra) extra(t); } }; return o; }
  function leadsX(len, y, r) { var g = G(); [-1, 1].forEach(function (s) { g.add(cylX(r || .035, len, K.steel, s * (len / 2 + .0), y, 0, 10)); }); return g; }

  /* ===================== RESISTORS ===================== */
  function axialBody(col, L, R) { return lat([[0, -L / 2], [R * .8, -L / 2], [R, -L / 2 + R * .5], [R * .88, -L * .3], [R * .88, L * .3], [R, L / 2 - R * .5], [R * .8, L / 2], [0, L / 2]], M(col, .1, .45), 48); }
  function bandSet(len, R, colors) { var g = G(), xs = [-.55, -.32, -.09, .26]; if (colors.length === 5) xs = [-.6, -.4, -.2, .0, .38]; colors.forEach(function (c, i) { var b = cylX(R * 1.02, .1, M(BAND[c], .2, .45), xs[i] * len / 1.45, 0, 0, 40); b.userData.band = i; g.add(b); }); return g; }
  function axialResistor(kind) {
    var root = G(), L = 1.3, R = .26, y = .55, mats = [], col = kind === 'metal' ? 0x7fb2d6 : 0xd9b88a, body = axialBody(col, L, R); body.rotation.z = PI / 2; body.position.y = y; var bm = body.material = ghostMat(body.material); mats.push(bm);
    var leads = G(); [-1, 1].forEach(function (s) { leads.add(tube([[s * L / 2, y, 0], [s * (L / 2 + .6), y, 0], [s * (L / 2 + 1.0), y - .0, 0]], .035, K.steel, 12)); }); root.add(leads);
    var cols = kind === 'metal' ? ['brown', 'black', 'black', 'red', 'brown'] : ['brown', 'black', 'orange', 'gold'];
    var bands = bandSet(L, R, cols); bands.position.y = y; bands.children.forEach(function (b) { b.material = ghostMat(b.material); mats.push(b.material); }); root.add(body, bands);
    var core = G(); core.position.y = y; core.add(cylX(R * .62, L * .9, K.cer, 0, 0, 0, 24)); core.add(helix(R * .64, L * .76, kind === 'metal' ? 9 : 6, .018, kind === 'metal' ? M(0x1d4e89, .6, .4) : M(0x111111, .2, .6), 'x', 200)); [-1, 1].forEach(function (s) { core.add(cylX(R * .7, .1, K.silverT, s * L * .46, 0, 0, 24)); }); root.add(core, pad());
    var parts = { body: PART(body, kind === 'metal' ? 'Epoxy coating' : 'Lacquer coating', 1.6), bands: PART(bands, 'Colour bands', 1.8), leads: PART(leads, 'Tinned copper leads', 1.4), film: PART(core, kind === 'metal' ? 'Metal film & spiral cut' : 'Carbon film & spiral cut', 1.7) };
    var o = finish(root, parts, mats); o.setBands = function (cs) { var i = 0; bands.children.forEach(function (b) { if (cs[b.userData.band]) b.material.color.setHex(BAND[cs[b.userData.band]]); }); }; return o;
  }
  PB.resistor.carbon = function () { return axialResistor('carbon'); };
  PB.resistor.metal = function () { return axialResistor('metal'); };
  PB.resistor.wire = function () {
    var root = G(), mats = [], y = .75, L = 2.2, R = .38;
    var core = cylX(R * .8, L, K.cer, 0, y, 0, 36); var wind = helix(R * .86, L * .86, 16, .045, K.cu, 'x', 260); wind.position.y = y;
    var coat = cylX(R, L * .9, ghostMat(M(0xdedbd2, 0, .35, { opacity: .5 })), 0, y, 0, 36); coat.material.opacity = 1; mats.push(coat.material);
    var caps = G(); [-1, 1].forEach(function (s) { caps.add(cylX(R * 1.05, .22, K.brass, s * L * .5, y, 0, 36)); caps.add(cylX(R * .5, .06, K.steel, s * (L * .5 + .12), y, 0, 20)); });
    var leads = G(); [-1, 1].forEach(function (s) { leads.add(tube([[s * (L / 2 + .1), y, 0], [s * (L / 2 + .6), y, 0], [s * (L / 2 + 1.1), y - .3, 0]], .05, K.steel, 12)); });
    root.add(core, wind, coat, caps, leads, pad());
    return finish(root, { coat: PART(coat, 'Ceramic / vitreous coating', 1.4), wind: PART(wind, 'Resistance wire winding', 1.6), core: PART(core, 'Ceramic former', 1.6), caps: PART(caps, 'End caps', 2), leads: PART(leads, 'Leads', 1.3) }, mats);
  };
  PB.resistor.smd = function () {
    var root = G(), mats = [], y = .22, bm = ghostMat(M(0x1b1c20, .1, .5)); var body = mesh(new T.BoxGeometry(2.0, .26, 1.25), bm, 0, y, 0); mats.push(bm);
    var sub = mesh(new T.BoxGeometry(2.0, .1, 1.25), M(0xe8e3d6, 0, .6), 0, y - .03, 0); var film = mesh(new T.BoxGeometry(1.2, .03, 1.0), M(0x2f2f35, .3, .5), 0, y + .04, 0);
    var ends = G(); [-1, 1].forEach(function (s) { ends.add(mesh(new T.BoxGeometry(.38, .3, 1.3), K.silverT, s * .88, y, 0)); });
    var lbl = G(); [['1', -.5], ['0', 0], ['3', .5]].forEach(function (a) { lbl.add(mesh(new T.BoxGeometry(.14, .01, .32), K.white, a[1] * .75, y + .14, 0)); });
    var base = mesh(new T.BoxGeometry(3.4, .06, 2.4), M(0x0f4c2a, .1, .6), 0, -.03, 0); var trk = G(); [-1, 1].forEach(function (s) { trk.add(mesh(new T.BoxGeometry(.7, .02, 1.5), K.cu, s * 1.0, .02, 0)); });
    root.add(base, trk, sub, film, body, ends, lbl);
    return finish(root, { body: PART(body, 'Protective overglaze', 2.2), film: PART(film, 'Resistive film', 2.2), sub: PART(sub, 'Alumina substrate', 2.2), ends: PART(ends, 'Tin terminations', 2.2), lbl: PART(lbl, 'Code "103" = 10 kΩ', 2.4), base: PART(base, 'PCB pad', 1.6) }, mats);
  };
  PB.resistor.pot = function () {
    var root = G(), mats = [], hm = ghostMat(M(0x2b3a4d, .5, .4)); mats.push(hm); var hous = lat([[0, 0], [1.1, 0], [1.1, .6], [1.0, .66], [0, .66]], hm, 48); hous.position.y = .1;
    var track = lat([[.72, 0], [.9, 0], [.9, .02], [.72, .02]], M(0x252525, .2, .6), 48, PI * 1.5); track.position.y = .38; track.rotation.y = PI * .25;
    var wiper = G(); wiper.add(mesh(new T.BoxGeometry(.8, .03, .09), K.brass, .4, 0, 0)); wiper.add(cyl(.09, .1, K.brass, .8, 0, 0, 10)); wiper.position.y = .42;
    var shaft = G(); shaft.add(cyl(.28, 1.2, K.alu, 0, .95, 0, 28)); for (var i = 0; i < 20; i++) { var a = i / 20 * PI * 2; shaft.add(mesh(new T.BoxGeometry(.03, 1.0, .05), K.steel, Math.cos(a) * .28, .95, Math.sin(a) * .28)); shaft.children[shaft.children.length - 1].rotation.y = -a; } shaft.add(cyl(.5, .1, K.steel, 0, .72, 0, 32)); shaft.add(cyl(.18, .18, K.steel, 0, .44, 0, 20)); shaft.position.y = 0;
    var pins = G(); [-.6, 0, .6].forEach(function (x) { pins.add(mesh(new T.BoxGeometry(.1, .8, .04), K.steel, x, -.3, 1.0)); });
    root.add(hous, track, wiper, shaft, pins, pad());
    var o = finish(root, { hous: PART(hous, 'Housing', 1.8), shaft: PART(shaft, 'Shaft & bushing', 1.8), track: PART(track, 'Carbon track', 2), wiper: PART(wiper, 'Wiper', 2.4), pins: PART(pins, 'Three terminals', 2.4) }, mats, function (t) { var a = t * PI * 1.4; wiper.rotation.y = a; shaft.rotation.y = a; });
    return o;
  };
  PB.resistor.ntc = function () {
    var root = G(), mats = [], y = .85, em = ghostMat(M(0xdc5a1b, 0, .3)); mats.push(em); var coat = lat([[0, -.55], [.45, -.45], [.62, 0], [.5, .4], [0, .65]], em, 36); coat.position.y = y; coat.scale.y = 1.0;
    var bead = mesh(new T.SphereGeometry(.2, 18, 14), M(0x3a3028, 0, .5), 0, y, 0); var wires = G(); [-.12, .12].forEach(function (x) { wires.add(tube([[x, y, 0], [x, y - .6, 0], [x * 3.2, .0, 0]], .03, K.steel, 12)); wires.add(tube([[x, y, 0], [x, y + .0, 0]], .02, K.steel, 4)); });
    var leads = G(); [-1, 1].forEach(function (s) { leads.add(tube([[s * .1, y - .5, 0], [s * .12, 0, 0], [s * .3, -.0, 0]], .035, K.steel, 8)); });
    root.add(coat, bead, wires, pad(1.3));
    return finish(root, { coat: PART(coat, 'Epoxy coating', 1.8), bead: PART(bead, 'Ceramic bead (metal oxide)', 2.4), leads: PART(wires, 'Leads', 1.8) }, mats);
  };
  PB.resistor.ldr = function () {
    var root = G(), mats = [], y = .3, bm = ghostMat(M(0x9a6a2c, .1, .5), { }); mats.push(bm); var ring = lat([[.95, 0], [1.1, 0], [1.1, .3], [.95, .3]], M(0x1a1a1c, .2, .5), 48);
    var disc = cyl(1.0, .1, M(0xd8a24a, .2, .45), 0, .05, 0, 48); var pts = [], n = 8; for (var i = 0; i <= n; i++) { var yy = -.7 + i * 1.4 / n; var half = Math.sqrt(Math.max(0, .94 - yy * yy)) * .88; pts.push(i % 2 ? [-half, yy] : [half, yy]); }
    var track = G(); for (i = 0; i < n; i++) { var a = pts[i], b = pts[i + 1]; track.add(mesh(new T.BoxGeometry(Math.abs(a[0] - b[0]) + .08, .03, .08), M(0x7b1f12, .2, .5), (a[0] + b[0]) / 2, .13, (a[1] + b[1]) / 2)); }
    [[-.9, .0], [.9, 0]].forEach(function (p) { track.add(mesh(new T.BoxGeometry(.3, .035, 1.5), K.silverT, p[0], .13, 0)); });
    var win = cyl(.98, .06, ghostMat(M(0xbfe3ff, 0, .05, { opacity: .35 })), 0, .2, 0, 48); win.material.opacity = .4; mats.push(win.material);
    var leads = G(); [-.35, .35].forEach(function (x) { leads.add(tube([[x, .06, -.6], [x, -.4, -.6], [x, -1.4, -.6]].map(function (p) { return [p[0], p[1], p[2]]; }), .04, K.steel, 12)); });
    root.add(ring, disc, track, win, leads, pad());
    return finish(root, { win: PART(win, 'Clear window', 1.8), track: PART(track, 'Cadmium sulphide track', 1.8), ring: PART(ring, 'Plastic ring', 2), contacts: PART(leads, 'Leads', 1.8) }, mats);
  };
  PB.resistor.cement = function () {
    var root = G(), mats = [], bm = ghostMat(M(0xe9e5d8, 0, .45)); mats.push(bm); var body = mesh(new T.BoxGeometry(2.8, .8, .8), bm, 0, .6, 0);
    var core = cylX(.22, 2.4, K.cer, 0, .6, 0, 20), wind = helix(.26, 2.2, 14, .03, M(0x8a8f96, .8, .3), 'x', 200); wind.position.y = .6; var leads = G();
    [-1, 1].forEach(function (s) { leads.add(tube([[s * 1.35, .6, 0], [s * 1.9, .6, 0], [s * 2.2, -.1, 0]], .05, K.steel, 12)); });
    var lbl = mesh(new T.BoxGeometry(1.6, .02, .5), K.white, 0, 1.01, 0);
    root.add(body, core, wind, leads, lbl, pad(2.2));
    return finish(root, { body: PART(body, 'Ceramic case, cement-filled', 1.6), wind: PART(wind, 'Resistance wire', 1.8), leads: PART(leads, 'Leads', 1.4), lbl: PART(lbl, 'Printed value & watts', 2.4) }, mats);
  };

  /* ===================== INDUCTORS ===================== */
  function bobbinCoil(len, r, turns, wr) { var g = G(); g.add(helix(r, len, turns, wr, K.cu, 'y', turns * 16)); return g; }
  PB.inductor.air = function () {
    var root = G(), c = helix(.7, 2.0, 7, .06, K.cu, 'y', 200); c.position.y = 1.35; var former = mesh(new T.CylinderGeometry(.62, .62, 2.0, 32, 1, true), ghostMat(M(0x9ac7e0, 0, .1, { opacity: .35 })), 0, 1.35, 0); former.material.opacity = .0; var tails = G(); tails.add(tube([[.7, .35, 0], [.9, -.1, 0], [1.4, .0, 0]], .06, K.cu, 12)); tails.add(tube([[.7, 2.35, 0], [1.4, 2.5, 0], [1.9, 1.6, 0], [1.9, .0, .0]], .06, K.cu, 20));
    var field = G(); for (var i = 0; i < 4; i++) { var r0 = 1.1 + i * .45; var cv = new T.EllipseCurve(0, 1.35, r0 * 1.2, r0 * 1.6, 0, PI * 2, false); var ptsE = cv.getPoints(80).map(function (p) { return [p.x, p.y, 0]; }); var ln = tube(ptsE, .012, M(0x22d3ee, 0, .3, { emissive: 0x22d3ee, emissiveIntensity: .8, transparent: true, opacity: 0 }), 80); field.add(ln); }
    root.add(c, tails, field, pad(2.2));
    return { group: root, parts: { coil: PART(c, 'Copper winding', 1.4), tails: PART(tails, 'Terminals', 1.8), field: PART(field, 'Magnetic field', 1.1) }, update: function (t) { field.children.forEach(function (l, i) { l.material.opacity = t * (.8 - i * .12); }); } };
  };
  PB.inductor.iron = function () {
    var root = G(), mats = [], lam = G(), core = M(0x7f8791, .85, .35);
    for (var i = 0; i < 10; i++) { var z = -.45 + i * .1; lam.add(mesh(new T.BoxGeometry(2.6, 2.0, .09), i % 2 ? core : M(0x6e7680, .85, .35), 0, 1.2, z)); }
    var win = G(); [-.55, .55].forEach(function (x) { win.add(mesh(new T.BoxGeometry(.34, 1.3, 1.2), M(0x0c1118, 0, .9), x * 1.0, 1.2, 0)); });
    var bob = mesh(new T.BoxGeometry(.7, 1.5, 1.4), M(0xd4b483, 0, .6), 0, 1.2, 0); var coilM = ghostMat(K.cu); mats.push(coilM); var coil = mesh(new T.BoxGeometry(.92, 1.3, 1.42), coilM, 0, 1.2, 0); coil.scale.set(1.0, 1, 1);
    for (i = 0; i < 12; i++) coil.add(mesh(new T.BoxGeometry(.94, .015, 1.44), M(0x8a4a1c, .9, .3), 0, -.6 + i * .11, 0));
    var tails = G(); [-.2, .2].forEach(function (x) { tails.add(tube([[x, .55, .7], [x, .3, 1.0], [x * 3, -.0, 1.6]], .04, K.cu, 12)); });
    root.add(lam, win, bob, coil, tails, pad(2.2));
    return finish(root, { core: PART(lam, 'Laminated silicon-steel core', 1.3), coil: PART(coil, 'Copper winding', 1.5), bob: PART(bob, 'Bobbin', 1.8), tails: PART(tails, 'Terminals', 2) }, mats);
  };
  PB.inductor.toroid = function () {
    var root = G(), R = 1.0, r = .45, mats = [], cm = ghostMat(M(0x2c2f36, .3, .45)); mats.push(cm); var core = mesh(new T.TorusGeometry(R, r, 28, 64), cm, 0, 1.0, 0); core.rotation.x = PI / 2;
    var pts = [], turns = 28; for (var i = 0; i <= turns * 12; i++) { var u = i / (turns * 12), a = u * PI * 2, b = u * turns * PI * 2, rr = R + (r + .07) * Math.cos(b), yy = (r + .07) * Math.sin(b); pts.push([Math.cos(a) * rr, 1.0 + yy, Math.sin(a) * rr]); }
    var wind = tube(pts.slice(0, Math.round(pts.length * .82)), .03, K.cu, 700); var ends = G(); ends.add(tube([pts[0], [pts[0][0] + .4, pts[0][1] - .5, pts[0][2] - .4], [R + 1.2, 0, -.4]], .035, K.cu, 12)); var pe = pts[Math.round(pts.length * .82)]; ends.add(tube([pe, [pe[0] * 1.2, pe[1] - .5, pe[2] * 1.2], [pe[0] * 1.5, 0, pe[2] * 1.5]], .035, K.cu, 12));
    var gl = G(); root.add(core, wind, ends, pad(2.4));
    return finish(root, { core: PART(core, 'Ferrite / powdered-iron ring', 1.5), wind: PART(wind, 'Toroidal winding', 1.5), ends: PART(ends, 'Leads', 2.2) }, mats);
  };
  PB.inductor.choke = function () {
    var root = G(), mats = [], y = .55, bm = ghostMat(M(0x2b3a52, 0, .55)); mats.push(bm); var body = lat([[0, -.8], [.4, -.8], [.42, -.7], [.42, .7], [.4, .8], [0, .8]], bm, 36); body.rotation.z = PI / 2; body.position.y = y;
    var cols = ['brown', 'black', 'brown', 'silver'], bands = G(); [-.5, -.28, -.06, .46].forEach(function (x, i) { var b = cylX(.43, .1, ghostMat(M(BAND[cols[i]], .2, .45)), x, y, 0, 32); mats.push(b.material); bands.add(b); }); bands.position.y = 0;
    var core = cylX(.26, 1.4, M(0x4a4038, .2, .6), 0, y, 0, 24), wind = helix(.3, 1.3, 14, .035, K.cu, 'x', 220); wind.position.y = y; var leads = G(); [-1, 1].forEach(function (s) { leads.add(tube([[s * .8, y, 0], [s * 1.3, y, 0], [s * 1.7, y - .1, 0]], .035, K.steel, 12)); });
    root.add(body, bands, core, wind, leads, pad(2));
    return finish(root, { body: PART(body, 'Moulded body', 1.6), bands: PART(bands, 'Colour bands (10 µH)', 1.8), core: PART(core, 'Ferrite rod core', 1.8), wind: PART(wind, 'Winding', 1.8), leads: PART(leads, 'Leads', 1.5) }, mats);
  };
  PB.inductor.smd = function () {
    var root = G(), mats = [], bm = ghostMat(M(0x25272c, .3, .45)); mats.push(bm); var body = mesh(new T.BoxGeometry(2.4, .9, 2.4), bm, 0, .55, 0); body.geometry.translate(0, 0, 0);
    var core = mesh(new T.CylinderGeometry(.8, .8, .5, 28), M(0x46403a, .4, .5), 0, .55, 0), w = helix(.5, .45, 9, .045, K.cu, 'y', 130); w.position.y = .55;
    var tm = G(); [-1, 1].forEach(function (s) { tm.add(mesh(new T.BoxGeometry(.5, .5, 2.0), K.silverT, s * 1.1, .3, 0)); });
    var lbl = mesh(new T.BoxGeometry(1.0, .01, .5), K.white, 0, 1.01, 0); var base = mesh(new T.BoxGeometry(4, .06, 3.2), M(0x0f4c2a, .1, .6), 0, -.03, 0);
    root.add(base, body, core, w, tm, lbl);
    return finish(root, { body: PART(body, 'Shielded ferrite body', 2), core: PART(core, 'Ferrite drum core', 2.2), wind: PART(w, 'Flat winding', 2.4), tm: PART(tm, 'Terminals', 2.2), lbl: PART(lbl, 'Marking "4R7" = 4.7 µH', 2.4) }, mats);
  };
  PB.inductor.slug = function () {
    var root = G(), c = helix(.55, 1.8, 8, .05, K.cu, 'y', 160); c.position.y = 1.3; var form = lat([[.5, .5], [.52, .5], [.52, 2.2], [.5, 2.2]], ghostMat(M(0x3a8dd6, 0, .3, { opacity: .5 })), 36); var slug = G(); slug.add(cyl(.34, 1.4, M(0x4c4540, .3, .5), 0, .0, 0, 24)); slug.add(cyl(.12, .5, K.steel, 0, .8, 0, 12)); slug.add(mesh(new T.BoxGeometry(.4, .06, .08), K.steel, 0, 1.04, 0)); slug.position.y = 1.3;
    var can = lat([[.82, .2], [.82, 2.5], [.78, 2.5], [.78, .2]], ghostMat(M(0xdfe5eb, .9, .3)), 40); var mats = []; can.material.opacity = .26;
    var pins = G(); [-.4, .4].forEach(function (x) { pins.add(cyl(.05, .6, K.steel, x, -.1, 0, 8)); });
    root.add(c, form, slug, can, pins, pad(1.8));
    return { group: root, parts: { coil: PART(c, 'Winding', 1.5), slug: PART(slug, 'Tuning slug (ferrite)', 1.8), can: PART(can, 'Screening can', 1.5), pins: PART(pins, 'Pins', 2) }, update: function (t) { slug.position.y = .75 + t * 1.2; } };
  };

  /* ===================== CAPACITORS ===================== */
  PB.capacitor.disc = function () {
    var root = G(), mats = [], y = .9, em = ghostMat(M(0xd9822b, 0, .35)); mats.push(em); var coat = lat([[0, -.55], [.8, -.5], [.95, 0], [.85, .55], [.0, .7]], em, 48); coat.rotation.x = PI / 2; coat.scale.set(1, .35, 1); coat.position.y = y; coat.rotation.x = 0; var body = new T.Mesh(new T.CylinderGeometry(.9, .9, .32, 48), em); body.rotation.x = PI / 2; body.position.y = y;
    var plates = G(); [-.1, .1].forEach(function (z) { var p = new T.Mesh(new T.CylinderGeometry(.72, .72, .02, 40), K.silverT); p.rotation.x = PI / 2; p.position.set(0, y, z); plates.add(p); }); var cer = new T.Mesh(new T.CylinderGeometry(.78, .78, .17, 40), M(0xf3ede0, 0, .4)); cer.rotation.x = PI / 2; cer.position.y = y; plates.add(cer);
    var leads = G(); [-.3, .3].forEach(function (x) { leads.add(tube([[x, y - .5, 0], [x, y - 1.0, 0], [x, 0, 0]], .035, K.steel, 12)); leads.add(tube([[x, y - .1, 0], [x, y - .5, 0]], .035, K.steel, 4)); });
    var lbl = mesh(new T.BoxGeometry(.7, .4, .01), M(0x222222, 0, .7), 0, y + .1, .17); root.add(body, plates, leads, lbl, pad(1.8));
    return finish(root, { body: PART(body, 'Epoxy dip coating', 1.8), plates: PART(plates, 'Ceramic dielectric & silver plates', 1.8), leads: PART(leads, 'Leads', 1.6), lbl: PART(lbl, 'Code "104" = 100 nF', 2.2) }, mats);
  };
  PB.capacitor.mlcc = function () {
    var root = G(), mats = [], bm = ghostMat(M(0xa56a32, 0, .5)); mats.push(bm); var body = mesh(new T.BoxGeometry(2.0, .9, 1.25), bm, 0, .55, 0);
    var stack = G(); for (var i = 0; i < 14; i++) { var left = i % 2 === 0; stack.add(mesh(new T.BoxGeometry(1.55, .018, 1.0), K.silverT, left ? -.25 : .25, .15 + i * .054, 0)); stack.children[stack.children.length - 1].scale.x = 1; stack.children[stack.children.length - 1].position.x = left ? -.2 : .2; }
    var ends = G(); [-1, 1].forEach(function (s) { ends.add(mesh(new T.BoxGeometry(.4, .94, 1.3), K.silverT, s * .8, .55, 0)); });
    var base = mesh(new T.BoxGeometry(3.4, .06, 2.4), M(0x0f4c2a, .1, .6), 0, -.03, 0); root.add(base, body, stack, ends);
    return finish(root, { body: PART(body, 'Ceramic body (X7R)', 2), stack: PART(stack, 'Interleaved electrodes', 2.2), ends: PART(ends, 'End terminations', 2.2), base: PART(base, 'PCB', 1.5) }, mats);
  };
  PB.capacitor.film = function () {
    var root = G(), mats = [], bm = ghostMat(M(0xd6a021, 0, .45)); mats.push(bm); var body = mesh(new T.BoxGeometry(2.4, 1.5, .9), bm, 0, .95, 0);
    var roll = G(); for (var i = 0; i < 7; i++) { var rr = .18 + i * .09; var o = new T.Mesh(new T.TorusGeometry(rr, .015, 6, 40), i % 2 ? K.silverT : M(0x3b9ad9, .2, .3)); o.position.set(0, .95, 0); roll.add(o); } var cyl2 = new T.Mesh(new T.CylinderGeometry(.82, .82, 1.9, 36), M(0x3b9ad9, .2, .5, {})); cyl2.rotation.z = PI / 2; cyl2.scale.set(1, 1, .5);
    var roll2 = new T.Mesh(new T.CylinderGeometry(.62, .62, 2.0, 36), M(0xcfa83c, .8, .3)); roll2.rotation.z = PI / 2; roll2.position.y = .95; roll2.scale.set(1, 1, .5); roll2.scale.z = .45; var spiral = G(); for (i = 0; i < 6; i++) { var t2 = new T.Mesh(new T.CylinderGeometry(.1 + i * .1, .1 + i * .1, 2.0, 32, 1, true), i % 2 ? M(0x3b9ad9, .2, .4, { side: T.DoubleSide }) : M(0xd6d9de, .9, .2, { side: T.DoubleSide })); t2.rotation.z = PI / 2; t2.position.y = .95; t2.scale.z = .5; spiral.add(t2); }
    var leads = G(); [-.8, .8].forEach(function (x) { leads.add(tube([[x, .2, 0], [x, -.6, 0], [x, -1.0, 0]], .045, K.steel, 12)); }); var lbl = mesh(new T.BoxGeometry(1.2, .5, .01), K.white, 0, 1.0, .46);
    root.add(body, spiral, leads, lbl, pad(2));
    return finish(root, { body: PART(body, 'Resin box', 1.8), spiral: PART(spiral, 'Rolled metallised film', 1.8), leads: PART(leads, 'Leads', 1.6), lbl: PART(lbl, 'Marking "474J" = 470 nF ±5 %', 2.4) }, mats);
  };
  PB.capacitor.electrolytic = function () {
    var root = G(), mats = [], R = .8, H = 2.0, am = ghostMat(M(0x2f5bd1, .3, .35)); mats.push(am); var can = lat([[0, 0], [R, 0], [R, H], [R * .95, H + .06], [0, H + .06]], am, 48); can.position.y = .1;
    var top = G(); top.add(mesh(new T.CylinderGeometry(R * .94, R * .94, .03, 40), K.alu, 0, H + .17, 0)); top.add(mesh(new T.BoxGeometry(1.0, .02, .06), M(0x888e96, .6, .4), 0, H + .19, 0)); top.add(mesh(new T.BoxGeometry(.06, .02, 1.0), M(0x888e96, .6, .4), 0, H + .19, 0));
    var stripe = new T.Mesh(new T.CylinderGeometry(R * 1.003, R * 1.003, H * .9, 24, 1, true, -PI * .14, PI * .28), M(0xd7dde4, 0, .5, { side: T.DoubleSide })); stripe.position.y = .1 + H / 2; root.add(stripe);
    var minus = G(); for (var i = 0; i < 4; i++) { var m = mesh(new T.BoxGeometry(.22, .035, .02), M(0x14233a, 0, .5), 0, .5 + i * .38, 0); var a = 0; m.position.set(Math.sin(a) * R * 1.01, .5 + i * .38, Math.cos(a) * R * 1.01); m.rotation.y = a; minus.add(m); }
    var roll = G(); for (i = 0; i < 9; i++) { var rr = .12 + i * .075; var o = new T.Mesh(new T.CylinderGeometry(rr, rr, H * .9, 32, 1, true), i % 2 ? M(0xd8dde3, .9, .25, { side: T.DoubleSide }) : M(0x9b8a67, 0, .6, { side: T.DoubleSide })); o.position.y = .1 + H / 2; roll.add(o); }
    var leads = G(); [-.35, .35].forEach(function (x, i) { leads.add(mesh(new T.CylinderGeometry(.04, .04, i ? 1.7 : 1.9, 10), K.steel, x, -.8 - (i ? 0 : .1) + .15, 0)); }); var seal = mesh(new T.CylinderGeometry(R * .96, R * .96, .1, 40), M(0x151515, 0, .8), 0, .13, 0);
    root.add(can, top, minus, roll, leads, seal, pad(2));
    return finish(root, { can: PART(can, 'Aluminium can & sleeve', 1.7), stripe: PART(stripe, 'Negative (−) stripe', 2.2), top: PART(top, 'Safety vent', 2.4), roll: PART(roll, 'Rolled foil & wet paper', 1.8), leads: PART(leads, 'Leads (longer = +)', 1.6), seal: PART(seal, 'Rubber seal', 2.4) }, mats);
  };
  PB.capacitor.tantalum = function () {
    var root = G(), mats = [], bm = ghostMat(M(0xe3a41a, 0, .3)); mats.push(bm); var body = lat([[0, -.6], [.5, -.55], [.7, 0], [.6, .55], [.2, .85], [0, .9]], bm, 40); body.position.y = 1.0;
    var core = mesh(new T.SphereGeometry(.32, 20, 16), M(0x3a3a3f, .6, .4), 0, 1.0, 0); var mk = mesh(new T.BoxGeometry(.3, .06, .02), M(0x7a2a10, 0, .5), -.25, 1.3, .62); mk.rotation.x = -.1; var plus = G(); plus.add(mesh(new T.BoxGeometry(.3, .07, .02), M(0x7a2a10, 0, .5), 0, 1.35, .62), mesh(new T.BoxGeometry(.07, .3, .02), M(0x7a2a10, 0, .5), 0, 1.35, .62)); plus.position.x = -.3;
    var leads = G(); [-.25, .25].forEach(function (x) { leads.add(tube([[x, .6, 0], [x, -.0, 0], [x, -.3, 0]], .035, K.steel, 12)); });
    root.add(body, core, plus, leads, pad(1.6));
    return finish(root, { body: PART(body, 'Epoxy bead', 2), core: PART(core, 'Sintered tantalum anode', 2.4), plus: PART(plus, '+ polarity mark', 2.6), leads: PART(leads, 'Leads', 1.8) }, mats);
  };
  PB.capacitor.super = function () {
    var root = G(), mats = [], bm = ghostMat(M(0x16191f, .3, .4)); mats.push(bm); var can = lat([[0, 0], [1.3, 0], [1.3, 1.2], [1.2, 1.28], [0, 1.28]], bm, 56); can.position.y = .15;
    var band = mesh(new T.CylinderGeometry(1.31, 1.31, .35, 56, 1, true), M(0xe2b11b, 0, .5, { side: T.DoubleSide }), 0, .9, 0); var top = mesh(new T.CylinderGeometry(1.1, 1.1, .02, 40), K.silverT, 0, 1.45, 0); var cells = G(); for (var i = 0; i < 12; i++) cells.add(mesh(new T.CylinderGeometry(1.05, 1.05, .035, 40), i % 2 ? K.silverT : M(0x2c2c30, .1, .8), 0, .35 + i * .08, 0));
    var leads = G(); [-.55, .55].forEach(function (x) { leads.add(tube([[x, .15, 0], [x, -.4, 0], [x, -.8, 0]], .05, K.steel, 12)); }); var pl = mesh(new T.BoxGeometry(.5, .06, .02), K.white, 0, 1.0, 1.31);
    root.add(can, band, top, cells, leads, pl, pad(2.2));
    return finish(root, { can: PART(can, 'Metal can', 1.7), band: PART(band, 'Rating band 2.7 V 10 F', 2), cells: PART(cells, 'Carbon electrodes & separator', 1.9), leads: PART(leads, 'Leads', 2) }, mats);
  };
  PB.capacitor.variable = function () {
    var root = G(), st = G(), ro = G(), y0 = .55;
    for (var i = 0; i < 7; i++) { var s = new T.Mesh(new T.CylinderGeometry(1.0, 1.0, .03, 40, 1, false, 0, PI), M(0xd7dde4, .9, .25, { side: T.DoubleSide })); s.position.set(0, y0 + i * .2, 0); st.add(s); }
    for (i = 0; i < 6; i++) { var r = new T.Mesh(new T.CylinderGeometry(.96, .96, .03, 40, 1, false, 0, PI), M(0xe8c15a, .9, .25, { side: T.DoubleSide })); r.position.set(0, y0 + .1 + i * .2, 0); r.rotation.y = PI; ro.add(r); }
    var shaft = cyl(.1, 1.8, K.steel, 0, 1.1, 0, 16); var fr = G(); fr.add(mesh(new T.BoxGeometry(2.4, .12, .12), M(0x2c3a4c, .5, .4), 0, .3, -.9)); fr.add(mesh(new T.BoxGeometry(2.4, .12, .12), M(0x2c3a4c, .5, .4), 0, 1.9, -.9)); fr.add(cyl(.05, 1.6, K.steel, -1.1, 1.1, -.9, 10)); fr.add(cyl(.05, 1.6, K.steel, 1.1, 1.1, -.9, 10)); var knob = cyl(.34, .3, M(0x16181c, .1, .5), 0, 2.15, 0, 32);
    var rot = G(); rot.add(ro, shaft, knob); root.add(st, rot, fr, pad(2));
    return { group: root, parts: { stator: PART(st, 'Fixed plates (stator)', 1.5), rotor: PART(rot, 'Moving plates (rotor)', 1.5), frame: PART(fr, 'Frame', 1.6) }, update: function (t) { rot.rotation.y = -t * PI * .92; } };
  };
  /* act labels for rotary/slug models */
  window.PB_ACT_TURN = { on: 'Turn it', off: 'Turn back', idleText: 'Minimum', onText: 'Turning…', offText: 'Turning back…', doneText: 'Maximum' };
  var kind = (window.CAT && CAT.kind) || 'resistor'; if (window.CAT) CAT.build = PB[kind];
})();
