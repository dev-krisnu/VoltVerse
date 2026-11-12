/* Earthing 3D cut-sections. 1 unit = 1 metre. Ground surface at y = 0, soil slab behind the section plane z = 0. */
(function () {
  'use strict';
  var T = THREE, V = VK, v3 = V.v3, C = window.CAT, PI = Math.PI, B = C.build = {};
  var tex = {};
  function speckle(base, spots, n, big) {
    var k = base + spots.join(''); if (tex[k]) return tex[k];
    var cv = document.createElement('canvas'); cv.width = cv.height = 256; var x = cv.getContext('2d'); x.fillStyle = base; x.fillRect(0, 0, 256, 256);
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < n; i++) { x.fillStyle = spots[i % spots.length]; var r = (big ? 2 + rnd() * 7 : 1 + rnd() * 2.6); x.beginPath(); if (big) { x.moveTo(rnd() * 256, rnd() * 256); for (var q = 0; q < 4; q++) x.lineTo(x.canvas.width * rnd(), x.canvas.height * rnd() * 0 + rnd() * 256); } else x.arc(rnd() * 256, rnd() * 256, r, 0, 7); x.fill(); }
    if (big) { x.fillStyle = base; x.globalAlpha = .55; x.fillRect(0, 0, 256, 256); x.globalAlpha = 1; for (var j = 0; j < 90; j++) { x.fillStyle = spots[j % spots.length]; var cx = rnd() * 256, cy = rnd() * 256, rr = 6 + rnd() * 14; x.beginPath(); x.ellipse(cx, cy, rr, rr * (.6 + rnd() * .4), rnd() * 3, 0, 7); x.fill(); } }
    var t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.RepeatWrapping; t.encoding = T.sRGBEncoding; t.anisotropy = 4; tex[k] = t; return t;
  }
  var SOIL = {
    top: { c: '#47321f', s: ['#2e2012', '#6b4a2f', '#3a2918'], n: 1400, nm: 'Topsoil' },
    clay: { c: '#8b5a3a', s: ['#a86f48', '#6f452b', '#9a6040'], n: 900, nm: 'Moist clay' },
    loam: { c: '#6a4e34', s: ['#86664a', '#4d3827', '#7a5b3d'], n: 1000, nm: 'Loam' },
    sand: { c: '#c7a86c', s: ['#e0c68f', '#a98b52', '#d8b97a'], n: 1800, nm: 'Sand' },
    gravel: { c: '#8b8982', s: ['#b4b1a8', '#5e5c57', '#9b988f'], n: 160, big: true, nm: 'Gravel / stones' },
    rock: { c: '#565a62', s: ['#7a7f88', '#3c3f45', '#686d75'], n: 120, big: true, nm: 'Rock' },
    char: { c: '#141414', s: ['#2d2d2d', '#000', '#3b3b3b'], n: 900, nm: 'Charcoal' },
    salt: { c: '#e8e8e2', s: ['#ffffff', '#cfd6d8', '#f4f1e6'], n: 1000, nm: 'Common salt' }
  };
  var smat = {};
  function sm(k, rx, ry) { var key = k + rx + ry; if (smat[key]) return smat[key]; var d = SOIL[k], t = speckle(d.c, d.s, d.n, d.big).clone(); t.needsUpdate = true; t.repeat.set(rx || 3, ry || 1); smat[key] = new T.MeshStandardMaterial({ map: t, roughness: .95, metalness: 0 }); return smat[key]; }
  var MT = {
    gi: new T.MeshStandardMaterial({ color: 0xaab3bd, metalness: .85, roughness: .38 }),
    cu: new T.MeshStandardMaterial({ color: 0xc87b3e, metalness: .95, roughness: .26 }),
    ci: new T.MeshStandardMaterial({ color: 0x2a2d33, metalness: .6, roughness: .5 }),
    conc: new T.MeshStandardMaterial({ color: 0x9aa0a6, roughness: .9 }),
    grass: new T.MeshStandardMaterial({ color: 0x3f7d3a, roughness: .95 }),
    wire: new T.MeshStandardMaterial({ color: 0x22c55e, roughness: .5 }),
    yel: new T.MeshStandardMaterial({ color: 0xfacc15, roughness: .5 }),
    cab: new T.MeshStandardMaterial({ color: 0x4b5d73, roughness: .5, metalness: .4 }),
    water: new T.MeshStandardMaterial({ color: 0x2f8fd6, transparent: true, opacity: .32, roughness: .1, depthWrite: false }),
    glow: new T.MeshBasicMaterial({ color: 0xffe066 }), glowB: new T.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: .0, depthWrite: false })
  };
  function G() { return new T.Group(); }
  function box(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); return o; }
  function cyl(r, h, m, x, y, z, seg) { var o = new T.Mesh(new T.CylinderGeometry(r, r, h, seg || 20), m); o.position.set(x || 0, y || 0, z || 0); return o; }
  function tube(pts, r, m) { return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(function (p) { return v3(p[0], p[1], p[2]); }), false, 'catmullrom', .05), 60, r, 8, false), m); }
  function PART(o, l, z) { return { obj: o, label: l, zoom: z || 1.6 }; }

  /* soil slab: strata = [[kind, thickness], ...] top to bottom. Returns {g, bottom} */
  function ground(W, D, strata, water) {
    var g = G(), y = 0;
    strata.forEach(function (s, i) { var h = s[1], m = box(W, h, D, sm(s[0], W / 2, Math.max(1, h)), 0, y - h / 2, -D / 2); g.add(m); y -= h; });
    var grass = box(W, .08, D, MT.grass, 0, .04, -D / 2); g.add(grass);
    var tr = new T.Mesh(new T.BoxGeometry(W, .0, D), MT.grass); /* placeholder */
    if (water != null) { var wt = box(W + .02, .12, D + .02, MT.water, 0, -water, -D / 2); g.add(wt); }
    /* faint front half so the electrode reads as buried */
    var ghost = box(W, y * -1, .9, new T.MeshStandardMaterial({ color: 0x6b7b8c, transparent: true, opacity: .07, depthWrite: false }), 0, y / 2, .45); ghost.userData.ghost = true; g.add(ghost);
    return { g: g, bottom: y };
  }
  function equipment(x) { var g = G(); g.add(box(.9, 1.1, .6, MT.cab, x, .55, -.25)); g.add(box(.7, .06, .5, MT.conc, x, .03, -.25)); var lug = box(.12, .08, .06, MT.cu, x, .1, .08); g.add(lug); return g; }
  function lead(pts, r) { var t = tube(pts, r || .03, MT.wire); var st = tube(pts, (r || .03) * .6, MT.yel); return [t]; }
  function pit(x, y, w, h, withCover) { var g = G(); g.add(box(.12, h, .5, MT.conc, x - w / 2, y - h / 2, -.05), box(.12, h, .5, MT.conc, x + w / 2, y - h / 2, -.05), box(w, .1, .5, MT.conc, x, y - h, -.05)); if (withCover) { var cv = box(w + .08, .04, .5, MT.ci, x, y + .03, -.05); g.add(cv); } return g; }
  function dots(n, curves, sp) {
    var g = G(), ms = [], i; for (i = 0; i < n; i++) { var o = new T.Mesh(new T.SphereGeometry(.035, 8, 6), MT.glow); o.visible = false; g.add(o); ms.push(o); }
    return { g: g, upd: function (t, time) { for (var k = 0; k < ms.length; k++) { var c = curves[k % curves.length], u = ((time * sp + k * .137) % 1); var p = c.getPoint(u); ms[k].position.copy(p); ms[k].visible = t > .02; ms[k].scale.setScalar(.5 + t * .9 * (1 - u * .5)); } } };
  }
  function arcCurves(cx, cy, R0, n) { var cs = [], i; for (i = 0; i < n; i++) { var a = (i / (n - 1)) * PI * .86 + PI * .07; var pts = []; for (var k = 0; k <= 8; k++) { var u = k / 8; var rr = R0 + u * 1.6 * (.6 + .5 * Math.sin(a)); pts.push(v3(cx + Math.cos(a - PI / 2 + PI / 2) * rr * Math.sin(a * 1) * 1.4 * (a > PI / 2 ? -1 : 1) * 0 + Math.cos(a) * rr * 1.4, cy - Math.sin(a) * rr * 1.0 + 0, .06)); } cs.push(new T.CatmullRomCurve3(pts)); } return cs; }
  function spread(cx, cy, R0, n) { /* current lines from an electrode into the surrounding soil */
    var cs = []; for (var i = 0; i < n; i++) { var a = i / n * PI * 2, pts = []; for (var k = 0; k <= 6; k++) { var u = k / 6, rr = R0 + u * 1.4; pts.push(v3(cx + Math.cos(a) * rr * 1.15, Math.min(-.15, cy + Math.sin(a) * rr * .9), .07)); } cs.push(new T.CurvePath ? new T.CatmullRomCurve3(pts) : null); } return cs;
  }
  function mount(root, parts, build) { return build; }
  function finish(root, parts, upd, curves, fx) {
    var d = dots(26, curves, .16); root.add(d.g); var aura = fx || null;
    var o = { group: root, parts: parts, tick: true, update: function (t, time) { d.upd(t, time || 0); if (aura) aura.forEach(function (m) { m.material.opacity = t * .22; }); } };
    return o;
  }
  function auraFor(root, cx, cy, rx, ry) { var m = new T.Mesh(new T.CylinderGeometry(1, 1, .05, 40, 1, false, 0, PI * 2), MT.glowB.clone()); m.rotation.x = PI / 2; m.scale.set(rx, 1, ry); m.position.set(cx, cy, .02); root.add(m); return [m]; }
  function lines(root, cx, cy, R0, n) { return spread(cx, cy, R0, n); }
  function wtr(y) { return box(1, .1, 1, MT.water, 0, y, 0); }

  /* ---------- PIPE ---------- */
  B.pipe = function () {
    var root = G(), W = 6.4, Dp = 1.4, gr = ground(W, Dp, [['top', .6], ['loam', 1.2], ['clay', 1.4], ['sand', .8]], 2.35); root.add(gr.g);
    var eq = equipment(-2.3); root.add(eq); var yTop = -.3, yBot = -2.8;
    /* charcoal / salt layers: 150 mm + 75 mm, repeating */
    var layers = G(), y = yBot, k = 0; while (y < yTop - .01) { var h = (k % 2 ? .075 : .15) * 1.2; h = Math.min(h, yTop - y); layers.add(box(.62, h, .5, sm(k % 2 ? 'salt' : 'char', 1, 1), 0, y + h / 2, -.05)); y += h; k++; }
    root.add(layers);
    var pipeP = G(); pipeP.add(cyl(.03, 2.5, MT.gi, 0, (yTop + yBot) / 2 - .0, 0, 24)); pipeP.children[0].position.y = -1.55; var tip = new T.Mesh(new T.ConeGeometry(.03, .14, 18), MT.gi); tip.rotation.x = PI; tip.position.y = yBot - .06; pipeP.add(tip);
    for (var i = 0; i < 9; i++) { var h2 = new T.Mesh(new T.CylinderGeometry(.011, .011, .07, 10), new T.MeshBasicMaterial({ color: 0x0b0d10 })); h2.rotation.x = PI / 2; h2.position.set(0, -.7 - i * .22, .03); pipeP.add(h2); }
    var sock = cyl(.045, .1, MT.gi, 0, -.37, 0, 20); pipeP.add(sock);
    var top = G(); top.add(cyl(.018, .55, MT.gi, 0, -.1, 0, 14)); var fun = new T.Mesh(new T.CylinderGeometry(.14, .03, .12, 24, 1, true), MT.gi); fun.material = MT.gi.clone(); fun.material.side = T.DoubleSide; fun.position.y = .2; top.add(fun);
    var mesh = new T.Mesh(new T.CircleGeometry(.14, 24), new T.MeshBasicMaterial({ color: 0xcfd5db, wireframe: true })); mesh.rotation.x = -PI / 2; mesh.position.y = .26; top.add(mesh);
    [-.06, .02].forEach(function (yy) { top.add(cyl(.05, .035, MT.cu, 0, yy, 0, 6)); }); top.add(cyl(.065, .012, MT.gi, 0, -.2, 0, 20));
    var ch = pit(0, 0, .6, .5, true); root.add(ch);
    var lead1 = lead([[-2.3, .1, .1], [-2.3, -.2, .1], [-2.0, -.3, .1], [-.5, -.3, .1], [-.05, -.3, .05]], .03); lead1.forEach(function (m) { root.add(m); });
    root.add(pipeP, top);
    var cv = ch.children[ch.children.length - 1]; var parts = { cover: PART(ch, 'Chamber & CI cover', 2.2), funnel: PART(top, 'Funnel & wire mesh', 3), pipe: PART(pipeP, 'GI pipe (40 mm, 2.5 m)', 1.3), fill: PART(layers, 'Charcoal & salt layers', 1.4), lead: PART(lead1[0], 'Earth conductor', 1.5), eq: PART(eq, 'Equipment (earthed)', 2), soil: PART(gr.g, 'Soil layers', 1) };
    var path = new T.CatmullRomCurve3([v3(-2.3, .15, .12), v3(-2.3, -.2, .12), v3(-2.0, -.3, .12), v3(-.5, -.3, .12), v3(-.05, -.5, .08), v3(0, -1.5, .08), v3(0, -2.7, .08)]);
    var arcs = []; for (var a = 0; a < 14; a++) { var an = a / 14 * PI * 2, pts = []; for (var kk = 0; kk <= 6; kk++) { var rr = .08 + kk / 6 * 1.7; pts.push(v3(Math.cos(an) * rr * 1.2, Math.min(-.35, -1.6 + Math.sin(an) * rr * 1.5), .07)); } arcs.push(new T.CatmullRomCurve3(pts)); }
    var curves = [path, path, path].concat(arcs); var aur = auraFor(root, 0, -1.55, 1.5, 1.5);
    return finish(root, parts, null, curves, aur);
  };

  /* ---------- PLATE ---------- */
  B.plate = function () {
    var root = G(), W = 6.4, Dp = 1.4, gr = ground(W, Dp, [['top', .6], ['clay', 1.6], ['loam', 1.2], ['sand', 1.0]], 2.1); root.add(gr.g);
    var eq = equipment(-2.3); root.add(eq); var yc = -3.4;
    var layers = G(), y = yc - .55, k = 0; while (y < yc + .55) { var h = Math.min(k % 2 ? .1 : .15, yc + .55 - y); layers.add(box(1.0, h, .5, sm(k % 2 ? 'salt' : 'char', 1, 1), 0, y + h / 2, -.05)); y += h; k++; } root.add(layers);
    var plate = box(.6, .6, .05, MT.cu, 0, yc, .04); var bolts = G(); [-.2, .2].forEach(function (b) { bolts.add(cyl(.025, .03, MT.gi, b, yc - .15, .08, 6)); });
    var pipeP = G(); pipeP.add(cyl(.0095 * 2, 3.0, MT.gi, 0, -1.5, .07, 16)); var top = G(); var fun = new T.Mesh(new T.CylinderGeometry(.12, .025, .1, 24, 1, true), Object.assign(MT.gi.clone(), { side: T.DoubleSide })); fun.position.set(0, .25, .07); top.add(fun); top.add(cyl(.02, .5, MT.gi, 0, -.02, .07, 12));
    var ch = pit(0, 0, .6, .5, true); root.add(ch);
    var lead1 = lead([[-2.3, .1, .1], [-2.3, -.2, .1], [-2.0, -.3, .1], [-.55, -.3, .1], [-.55, -3.0, .1], [-.3, yc - .2, .1], [-.18, yc - .15, .08]], .03); lead1.forEach(function (m) { root.add(m); });
    root.add(plate, bolts, pipeP, top);
    var parts = { plate: PART(plate, 'Copper / GI plate', 2), fill: PART(layers, 'Charcoal & salt backfill', 1.8), pipe: PART(pipeP, 'Watering pipe (19 mm GI)', 1.1), funnel: PART(top, 'Funnel', 3), cover: PART(ch, 'Chamber & CI cover', 2.2), lead: PART(lead1[0], 'Earth conductor', 1.2), eq: PART(eq, 'Equipment (earthed)', 2), soil: PART(gr.g, 'Soil layers', 1) };
    var path = new T.CatmullRomCurve3([v3(-2.3, .15, .12), v3(-2.3, -.2, .12), v3(-2.0, -.3, .12), v3(-.55, -.3, .12), v3(-.55, -3.0, .12), v3(-.2, yc - .15, .1), v3(0, yc, .08)]);
    var arcs = []; for (var a = 0; a < 14; a++) { var an = a / 14 * PI * 2, pts = []; for (var kk = 0; kk <= 6; kk++) { var rr = .3 + kk / 6 * 1.6; pts.push(v3(Math.cos(an) * rr * 1.1, yc + Math.sin(an) * rr * 1.0, .08)); } arcs.push(new T.CatmullRomCurve3(pts)); }
    return finish(root, parts, null, [path, path, path].concat(arcs), auraFor(root, 0, yc, 1.5, 1.5));
  };

  /* ---------- STRIP ---------- */
  B.strip = function () {
    var root = G(), W = 7.2, Dp = 1.4, gr = ground(W, Dp, [['top', .45], ['gravel', .5], ['rock', 1.2]], null); root.add(gr.g);
    var eq = equipment(-2.9); root.add(eq);
    var trench = box(5.4, .3, .5, sm('loam', 2, 1), .35, -.55, -.05); root.add(trench);
    var strip = box(5.4, .018, .09, MT.cu, .35, -.55, .1); var edge = box(5.4, .09, .008, MT.cu, .35, -.5, .15); root.add(strip);
    var salt = box(5.4, .05, .5, sm('salt', 3, 1), .35, -.66, -.05); root.add(salt);
    var brk = G(); [[-2.45], [3.15]].forEach(function (b) { var z = new T.Mesh(new T.TorusGeometry(.14, .012, 6, 20, PI), MT.yel); z.position.set(b[0], -.55, .1); z.rotation.z = PI / 2; brk.add(z); }); root.add(brk);
    var lead1 = lead([[-2.9, .1, .1], [-2.9, -.2, .1], [-2.5, -.5, .1], [-2.1, -.55, .1]], .028); lead1.forEach(function (m) { root.add(m); });
    var bolt = G(); [-2.15, -2.05].forEach(function (b) { bolt.add(cyl(.03, .04, MT.gi, b, -.55, .15, 8)); }); root.add(bolt);
    var ch = pit(3.1, 0, .5, .4, true); root.add(ch); var st2 = box(.3, .018, .09, MT.cu, 3.0, -.4, .1); root.add(st2);
    var up = tube([[2.3, -.55, .1], [2.9, -.55, .1], [3.1, -.3, .1]], .02, MT.cu); root.add(up);
    var parts = { strip: PART(strip, 'Copper strip 25 × 4 mm', 1.5), trench: PART(trench, 'Trench backfill', 1.8), salt: PART(salt, 'Salt bed', 2.4), lead: PART(lead1[0], 'Earth conductor', 1.5), joint: PART(bolt, 'Bolted joint', 3), pit: PART(ch, 'Inspection pit', 2.2), eq: PART(eq, 'Equipment (earthed)', 2), soil: PART(gr.g, 'Soil layers', 1) };
    var path = new T.CatmullRomCurve3([v3(-2.9, .15, .12), v3(-2.9, -.2, .12), v3(-2.5, -.5, .12), v3(-2.1, -.55, .12), v3(.4, -.55, .12), v3(3.0, -.55, .12)]);
    var arcs = []; for (var a = 0; a < 10; a++) { var x0 = -2.0 + a * .6, pts = []; for (var kk = 0; kk <= 5; kk++) { var rr = .1 + kk / 5 * .9; pts.push(v3(x0 + (a % 2 ? .1 : -.1) * kk * .3, -.55 - rr, .08)); } arcs.push(new T.CatmullRomCurve3(pts)); }
    var au = auraFor(root, .35, -.75, 2.9, .5);
    return finish(root, parts, null, [path, path, path].concat(arcs), au);
  };

  /* ---------- ROD ---------- */
  B.rod = function () {
    var root = G(), W = 6.4, Dp = 1.4, gr = ground(W, Dp, [['top', .5], ['sand', 1.2], ['clay', 1.2], ['loam', 1.0]], 2.4); root.add(gr.g);
    var eq = equipment(-2.3); root.add(eq); var rodP = G(); var L = 2.4;
    rodP.add(cyl(.028, 1.2, MT.cu, 0, -.65, .02, 16)); rodP.add(cyl(.028, 1.2, MT.cu, 0, -1.85, .02, 16)); var tip = new T.Mesh(new T.ConeGeometry(.028, .16, 16), MT.cu); tip.rotation.x = PI; tip.position.set(0, -2.53, .02); rodP.add(tip);
    var cp = cyl(.04, .14, new T.MeshStandardMaterial({ color: 0xd9a93a, metalness: .95, roughness: .25 }), 0, -1.25, .02, 16); rodP.add(cp);
    var cl = G(); cl.add(box(.14, .1, .1, MT.cu, 0, -.18, .02)); cl.add(cyl(.02, .12, MT.gi, 0, -.18, .08, 8)); rodP.add(cl);
    var ch = pit(0, 0, .5, .35, true); root.add(ch);
    var lead1 = lead([[-2.3, .1, .1], [-2.3, -.15, .1], [-2.0, -.18, .1], [-.5, -.18, .1], [-.1, -.18, .08]], .028); lead1.forEach(function (m) { root.add(m); });
    root.add(rodP);
    var parts = { rod: PART(rodP, 'Copper-bonded rod (2 × 1.2 m)', 1.2), coupler: PART(cp, 'Threaded coupler', 3), clamp: PART(cl, 'Rod clamp', 3.2), cover: PART(ch, 'Inspection pit', 2.2), lead: PART(lead1[0], 'Earth conductor', 1.5), eq: PART(eq, 'Equipment (earthed)', 2), soil: PART(gr.g, 'Soil layers', 1) };
    var path = new T.CatmullRomCurve3([v3(-2.3, .15, .12), v3(-2.3, -.15, .12), v3(-2.0, -.18, .12), v3(-.5, -.18, .12), v3(-.06, -.3, .08), v3(0, -1.5, .08), v3(0, -2.4, .08)]);
    var arcs = []; for (var a = 0; a < 14; a++) { var an = a / 14 * PI * 2, pts = []; for (var kk = 0; kk <= 6; kk++) { var rr = .08 + kk / 6 * 1.6; pts.push(v3(Math.cos(an) * rr * .9, Math.min(-.3, -1.4 + Math.sin(an) * rr * 1.7), .07)); } arcs.push(new T.CatmullRomCurve3(pts)); }
    return finish(root, parts, null, [path, path, path].concat(arcs), auraFor(root, 0, -1.4, 1.2, 1.7));
  };

  /* ---------- EARTH MAT ---------- */
  B.mat = function () {
    var root = G(), W = 8, Dp = 6; var g = G();
    var soil = box(W, 1.6, Dp, sm('loam', 4, 1), 0, -.8, 0); g.add(soil); var top = box(W, .06, Dp, new T.MeshStandardMaterial({ color: 0x9a9d96, roughness: .95, map: speckle('#8a8780', ['#b4b1a8', '#5e5c57'], 120, true) }), 0, .03, 0); top.material.transparent = true; top.material.opacity = .55; top.material.depthWrite = false; g.add(top); root.add(g);
    var grid = G(), nx = 6, nz = 5, x0 = -3.2, z0 = -2.4, dx = 6.4 / (nx - 1), dz = 4.8 / (nz - 1);
    for (var i = 0; i < nx; i++) grid.add(box(.045, .045, 4.8, MT.cu, x0 + i * dx, -.5, 0));
    for (var j = 0; j < nz; j++) grid.add(box(6.4, .045, .045, MT.cu, 0, -.5, z0 + j * dz));
    var rods = G(); [[0, 0], [nx - 1, 0], [0, nz - 1], [nx - 1, nz - 1], [2, 0], [2, nz - 1]].forEach(function (a) { rods.add(cyl(.035, 2.4, MT.cu, x0 + a[0] * dx, -1.7, z0 + a[1] * dz, 12)); });
    var joints = G(); for (i = 0; i < nx; i++) for (j = 0; j < nz; j++) joints.add(cyl(.05, .06, MT.gi, x0 + i * dx, -.5, z0 + j * dz, 10));
    var tr = G(); tr.add(box(1.5, 1.2, 1.1, new T.MeshStandardMaterial({ color: 0x57677c, roughness: .4, metalness: .5 }), 0, .66, .0)); for (i = -2; i <= 2; i++) tr.add(cyl(.05, .35, new T.MeshStandardMaterial({ color: 0xb87b43, roughness: .15 }), i * .24, 1.4, .0, 12)); tr.position.set(.3, 0, .1);
    var fence = G(); var fm = new T.MeshStandardMaterial({ color: 0x8c96a2, metalness: .8, roughness: .4 }); [[-4, -3], [4, -3], [4, 3], [-4, 3]].forEach(function (p, k) { fence.add(cyl(.03, 1.2, fm, p[0], .6, p[1], 8)); }); var rail = [[-4, -3, 8, 0], [-4, 3, 8, 0]]; rail.forEach(function (r) { fence.add(box(8, .03, .03, fm, 0, .95, r[1])); fence.add(box(8, .03, .03, fm, 0, .35, r[1])); });
    var bond = tube([[.3, .1, .6], [.3, -.2, .9], [x0 + 2 * dx, -.5, z0 + 3 * dz]], .03, MT.wire);
    var rootAll = G(); root.add(grid, rods, joints, tr, fence, bond);
    var parts = { grid: PART(grid, 'Copper grid conductors', 1.3), rods: PART(rods, 'Driven earth rods', 1.3), joints: PART(joints, 'Cross-bonded joints', 2.4), tr: PART(tr, 'Transformer (bonded)', 2), fence: PART(fence, 'Fence (bonded)', 1.4), bond: PART(bond, 'Equipment bond', 2) };
    var path = new T.CatmullRomCurve3([v3(.3, 1.0, .6), v3(.3, -.2, .9), v3(x0 + 2 * dx, -.5, z0 + 3 * dz), v3(.3, -.5, 1.0)]);
    var arcs = []; for (var a = 0; a < 12; a++) { var an = a / 12 * PI * 2, pts = []; for (var kk = 0; kk <= 6; kk++) { var rr = .2 + kk / 6 * 2.4; pts.push(v3(Math.cos(an) * rr * 1.3 + .3, -.5 - kk * .1, Math.sin(an) * rr * 1.0)); } arcs.push(new T.CatmullRomCurve3(pts)); }
    return finish(root, parts, null, [path, path, path].concat(arcs), null);
  };
})();
