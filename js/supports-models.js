/* Line-support 3D models: wooden poles, concrete poles, tubular steel pole, lattice towers.
   Every builder returns { group, parts:{id:{obj,label}}, sway:[...], ground:{w,d}|null, xray(on)? } */
(function () {
  'use strict';
  var T = THREE, V = VK, v3 = V.v3, M = V.mat, S = window.VKS = window.VKS || {}, B = S.build = {};
  var _m = {};
  function mat(k, f) { return _m[k] || (_m[k] = f()); }
  var X = {
    wood: function () { return mat('wood', function () { return M.wood('#7b5230'); }); },
    woodLight: function () { return mat('woodL', function () { return M.wood('#a07a4c'); }); },
    steel: function () { return mat('steel', function () { return M.galv(); }); },
    dark: function () { return mat('dark', function () { return M.std(0x4b5563, .9, .35); }); },
    alu: function () { return mat('alu', function () { return M.std(0xcfd6de, .9, .3); }); },
    cond: function () { return mat('cond', function () { return M.std(0x9aa3ad, .85, .4); }); },
    ear: function () { return mat('ear', function () { return M.std(0x6b7280, .8, .45); }); },
    por: function () { return mat('por', function () { return M.porcelain(0x7a4328); }); },
    glass: function () { return mat('glass', function () { return M.porcelain(0x5fb0d6); }); },
    gray: function () { return mat('gray', function () { return M.porcelain(0xc9ced4); }); },
    conc: function () { return mat('conc', function () { return M.concrete('#9a9fa5'); }); },
    soil: function () { var m = M.soil(); m.transparent = true; m.opacity = .78; m.depthWrite = false; return mat('soil', function () { return m; }); },
    rebar: function () { return mat('rebar', function () { return M.std(0xd97706, .8, .45); }); },
    red: function () { return mat('red', function () { return M.std(0xdc2626, .1, .5); }); },
    pad: function () { return mat('pad', function () { return M.concrete('#7f868e'); }); }
  };
  S.X = X;
  S.holeGround = function (w, d, s) { return holeGround(w, d, s); };
  function ph(x, y, z) { return new T.Vector3(x, y, z); }
  function G() { return new T.Group(); }
  function mesh(g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; }

  /* ground that has a rectangular hole so buried parts can be seen */
  function holeGround(w, d, size) {
    var s = new T.Shape(); s.absarc(0, 0, size, 0, Math.PI * 2, false);
    var h = new T.Path(); h.moveTo(-w / 2, -d / 2); h.lineTo(-w / 2, d / 2); h.lineTo(w / 2, d / 2); h.lineTo(w / 2, -d / 2); h.lineTo(-w / 2, -d / 2); s.holes.push(h);
    var m = new T.Mesh(new T.ShapeGeometry(s, 48), new T.MeshBasicMaterial({ color: 0x0f1b2b }));
    m.rotation.x = -Math.PI / 2; m.position.y = -.002; return m;
  }
  function soilBlock(w, d, depth) { /* transparent soil cut-away, open on top */
    var g = G(), m = X.soil();
    var b = mesh(new T.BoxGeometry(w, depth, d), m, 0, -depth / 2, 0); g.add(b);
    var edge = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(w, depth, d)), new T.LineBasicMaterial({ color: 0x8a6a45, transparent: true, opacity: .6 })); edge.position.y = -depth / 2; g.add(edge);
    return g;
  }
  function plate(txt, w, h, bg, fg) {
    var t = V.noiseTex(128, Math.round(128 * h / w), function (x, W, H) { x.fillStyle = bg; x.fillRect(0, 0, W, H); x.strokeStyle = fg; x.lineWidth = 5; x.strokeRect(5, 5, W - 10, H - 10); x.fillStyle = fg; x.font = 'bold ' + Math.round(H * .5) + 'px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, W / 2, H / 2 + 3); });
    t.wrapS = t.wrapT = T.ClampToEdgeWrapping; return new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: t }));
  }
  /* half span of conductor leaving the structure on both sides along Z */
  function conductors(root, pts, span, sag, rad) {
    var gr = G();
    pts.forEach(function (p) {
      [-1, 1].forEach(function (s) {
        var a = [], n = 22;
        for (var i = 0; i <= n; i++) { var t = i / n * .5; a.push(new T.Vector3(p.x, p.y - 4 * sag * t * (1 - t) * 1, s * span * t * 2)); }
        gr.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(a), 40, rad || .045, 6), X.cond()));
      });
    });
    root.add(gr); return gr;
  }
  S.conductors = conductors;
  function pinInsulator(h, r) {
    var g = G(); g.add(V.postInsulator(h, r, 3, X.por()));
    var pin = new T.Mesh(new T.CylinderGeometry(r * .22, r * .26, h * .7, 10), X.steel()); pin.position.y = -h * .18; g.add(pin);
    var cap = new T.Mesh(new T.CylinderGeometry(r * .5, r * .62, h * .06, 14), X.steel()); cap.position.y = h * 1.0; g.add(cap);
    return g;
  }
  function channel(len, w, h, mat) { /* C-section channel along X */
    var g = G(), t = Math.min(w, h) * .14;
    g.add(mesh(new T.BoxGeometry(len, t, w), mat || X.steel(), 0, h / 2 - t / 2, 0));
    g.add(mesh(new T.BoxGeometry(len, h, t), mat || X.steel(), 0, 0, w / 2 - t / 2)); g.add(mesh(new T.BoxGeometry(len, h, t), mat || X.steel(), 0, 0, -w / 2 + t / 2));
    g.add(mesh(new T.BoxGeometry(len, t, w), mat || X.steel(), 0, -h / 2 + t / 2, 0)); return g;
  }
  function taperPole(rt, rb, h, embed, material, seg) {
    var g = new T.CylinderGeometry(rt, rb, h + embed, seg || 28, 14, false), p = g.attributes.position;
    for (var i = 0; i < p.count; i++) { var x = p.getX(i), z = p.getZ(i), y = p.getY(i), k = 1 + .012 * Math.sin(y * 1.7 + x * 9) + .008 * Math.sin(y * 4.1); p.setX(i, x * k); p.setZ(i, z * k); }
    g.computeVertexNormals();
    var uv = g.attributes.uv; for (i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * (h + embed) / 3);
    var m = new T.Mesh(g, material); m.position.y = (h - embed) / 2; return m;
  }
  function bolt(g, x, y, z, ax) { var b = mesh(new T.CylinderGeometry(.03, .03, .09, 8), X.dark(), x, y, z); if (ax === 'z') b.rotation.x = Math.PI / 2; else if (ax === 'x') b.rotation.z = Math.PI / 2; g.add(b); }
  function earthDown(g, x, z, top, r) { /* GI earth strip down the structure to an earth rod */
    var m = new V.Merge(X.ear()); m.rod(ph(x, top, z), ph(x, -.4, z), .02); m.rod(ph(x, -.4, z), ph(x + .8, -.4, z + .5), .02); m.rod(ph(x + .8, -.4, z + .5), ph(x + .8, -2.6, z + .5), .05); g.add(m.mesh());
    g.add(mesh(new T.BoxGeometry(.5, .05, .5), X.ear(), x + .8, -2.7, z + .5));
  }
  function stay(g, px, py, pz, ax, az, rad) {
    var m = new V.Merge(X.ear()); m.rod(ph(px, py, pz), ph(ax, 0, az), rad || .018); m.rod(ph(ax, 0, az), ph(ax * 1.04, -1.6, az * 1.04), .035);
    g.add(m.mesh()); g.add(mesh(new T.BoxGeometry(.55, .08, .55), X.steel(), ax * 1.04, -1.65, az * 1.04));
    var egg = mesh(new T.SphereGeometry(.07, 12, 8), X.por(), px + (ax - px) * .55, py + (0 - py) * .55, pz + (az - pz) * .55); egg.scale.set(1, 1.6, 1); g.add(egg);
  }

  /* ================= WOOD ================= */
  B.wood_single = function () {
    var g = G(), pole = G(), arm = G(), ins = G(), found = G(), earth = G(), stayG = G(), plates = G();
    pole.add(taperPole(.07, .135, 9.5, 1.6, X.wood()));
    pole.add(mesh(new T.ConeGeometry(.072, .08, 24), X.wood(), 0, 9.54, 0));
    var ay = 8.55, ch = channel(1.9, .075, .1); ch.position.set(0, ay + .02, .115); arm.add(ch);
    var br = new V.Merge(X.steel()); br.strut(ph(0, ay - 1.0, .12), ph(.8, ay, .12), .045); br.strut(ph(0, ay - 1.0, .12), ph(-.8, ay, .12), .045);
    br.rod(ph(0, ay + .02, -.12), ph(0, ay + .02, .2), .035); arm.add(br.mesh());
    bolt(arm, 0, ay - 1.0, .12, 'z');
    [-.85, .85].forEach(function (x) { var i = pinInsulator(.34, .065); i.position.set(x, ay + .08, .115); ins.add(i); });
    var top = pinInsulator(.34, .065); top.position.set(0, 9.59, 0); ins.add(top);
    found.add(soilBlock(2.4, 2.4, 1.7)); found.add(mesh(new T.CylinderGeometry(.2, .22, .25, 20), X.pad(), 0, -1.55, 0));
    earthDown(earth, .14, 0, 8.3, .02);
    stay(stayG, .09, 8.1, .1, 0, 4.3);
    var dp = plate('\u26A1', .26, .22, '#f5d90a', '#111'); dp.position.set(0, 3.0, .146); plates.add(dp);
    var np = plate('11kV', .24, .12, '#f8fafc', '#111'); np.position.set(0, 2.3, .146); plates.add(np);
    [pole, arm, ins, found, earth, stayG, plates].forEach(function (o) { g.add(o); });
    S.conductors(g, [ph(-.85, ay + .42, .115), ph(.85, ay + .42, .115), ph(0, 9.93, 0)], 20, 1.1, .04);
    return { group: g, ground: { w: 2.4, d: 2.4 }, sway: [], parts: { pole: { obj: pole, label: 'Wooden pole' }, arm: { obj: arm, label: 'Steel cross-arm', zoom: 1.5 }, ins: { obj: ins, label: 'Pin insulators', zoom: 1.7 }, found: { obj: found, label: 'Embedded base' }, earth: { obj: earth, label: 'Earthing' }, stay: { obj: stayG, label: 'Stay set' }, plates: { obj: plates, label: 'Danger plate', zoom: 2.4 } }, tall: 11 };
  };

  B.wood_a = function () {
    var g = G(), legs = G(), arm = G(), ins = G(), found = G(), brace = G(), earth = G(), stayG = G();
    var h = 9.5, e = 1.6, bx = 1.25, ang = Math.atan(bx / h);
    [-1, 1].forEach(function (s) {
      var l = G(); l.add(taperPole(.07, .13, h, e, X.wood())); /* local pole, then rotate about base point */
      l.rotation.z = -s * Math.atan((bx - .1) / h) * -1; l.position.set(s * bx, 0, 0); l.rotation.z = s * Math.atan((bx - .1) / (h)); legs.add(l);
      var sb = soilBlock(1.3, 1.6, 1.7); sb.position.x = s * (bx + .12); found.add(sb);
    });
    var topY = 8.45, xt = bx * (1 - topY / (h + 0)) + 0.1;
    function xAt(y, s) { return s * (bx - (bx - .1) * y / h); }
    var bm = new V.Merge(X.woodLight());
    [3.2, 5.6].forEach(function (y) { bm.strut(ph(xAt(y, -1) + .1, y, .13), ph(xAt(y, 1) - .1, y, .13), .06, .14); });
    brace.add(bm.mesh());
    var sm = new V.Merge(X.steel()); sm.strut(ph(xAt(3.2, -1), 3.2, .17), ph(xAt(5.6, 1), 5.6, .17), .04, .006 + .04); sm.strut(ph(xAt(3.2, 1), 3.2, .17), ph(xAt(5.6, -1), 5.6, .17), .04, .046); brace.add(sm.mesh());
    var ay = 8.6, ch = channel(2.6, .075, .1); ch.position.set(0, ay, .2); arm.add(ch);
    var am = new V.Merge(X.steel()); am.strut(ph(-.35, ay - .8, .2), ph(-1.2, ay, .2), .04); am.strut(ph(.35, ay - .8, .2), ph(1.2, ay, .2), .04); am.strut(ph(-xAt(ay - .8, 1) * 0 - .2, ay - .8, .2), ph(.2, ay - .8, .2), .04); arm.add(am.mesh());
    [-1.15, 0, 1.15].forEach(function (x) { var i = pinInsulator(.36, .068); i.position.set(x, ay + .05, .2); ins.add(i); });
    [-1, 1].forEach(function (s) { bolt(arm, xAt(ay, s), ay, .13, 'z'); });
    earthDown(earth, xAt(5, 1) + .1, .1, 8.2, .02);
    stay(stayG, xAt(8.2, 1), 8.2, .14, 0, 4.6); stay(stayG, xAt(8.2, -1), 8.2, .14, 0, -4.6);
    [legs, brace, arm, ins, found, earth, stayG].forEach(function (o) { g.add(o); });
    S.conductors(g, [ph(-1.15, ay + .05 + .37, .2), ph(0, ay + .05 + .37, .2), ph(1.15, ay + .05 + .37, .2)], 20, 1.1, .04);
    return { group: g, ground: { w: 4.6, d: 2.2 }, sway: [], parts: { legs: { obj: legs, label: 'Two inclined poles', zoom: 1.2 }, brace: { obj: brace, label: 'Cross-bracing' }, arm: { obj: arm, label: 'Cross-arm', zoom: 1.5 }, ins: { obj: ins, label: 'Pin insulators', zoom: 1.7 }, found: { obj: found, label: 'Embedded bases' }, earth: { obj: earth, label: 'Earthing' }, stay: { obj: stayG, label: 'Stay wires' } }, tall: 11 };
  };

  B.wood_h = function () {
    var g = G(), poles = G(), arm = G(), ins = G(), found = G(), brace = G(), earth = G(), plates = G(), sw = [];
    var h = 12, e = 2, sp = 1.7;
    [-1, 1].forEach(function (s) { var p = taperPole(.09, .16, h, e, X.wood()); p.position.x = s * sp; poles.add(p); var c = mesh(new T.ConeGeometry(.092, .1, 20), X.wood(), s * sp, h + .05, 0); poles.add(c); var sb = soilBlock(1.3, 1.3, e + .1); sb.position.x = s * sp; found.add(sb); found.add(mesh(new T.CylinderGeometry(.28, .3, .3, 20), X.pad(), s * sp, -e + .25, 0)); });
    var bm = new V.Merge(X.woodLight()); [4.4, 9.3].forEach(function (y) { bm.strut(ph(-sp + .1, y, .17), ph(sp - .1, y, .17), .08, .16); }); brace.add(bm.mesh());
    var xm = new V.Merge(X.steel()); xm.strut(ph(-sp + .1, 4.4, .26), ph(sp - .1, 9.3, .26), .05, .006 + .05); xm.strut(ph(sp - .1, 4.4, .26), ph(-sp + .1, 9.3, .26), .05, .056); brace.add(xm.mesh());
    var ay = 11.0, ch = channel(4.3, .09, .13); ch.position.set(0, ay, .22); arm.add(ch);
    var ch2 = channel(4.3, .09, .13); ch2.position.set(0, ay - .3, .22); arm.add(ch2);
    var am = new V.Merge(X.steel()); [-1, 1].forEach(function (s) { am.strut(ph(s * sp, ay - 1.2, .26), ph(s * (sp + .9), ay - .3, .26), .05); }); am.strut(ph(-sp, ay - .3, .26), ph(0, ay, .26), .04); am.strut(ph(sp, ay - .3, .26), ph(0, ay, .26), .04); arm.add(am.mesh());
    [-1.9, 0, 1.9].forEach(function (x) { var st = V.string(3, .18, X.glass(), X.steel()); st.position.set(x, ay - .38, .22); ins.add(st); sw.push(st); });
    [-1, 1].forEach(function (s) { [ay, ay - .3].forEach(function (y) { bolt(arm, s * sp, y, .14, 'z'); }); });
    earthDown(earth, sp + .17, 0, 9.5, .02);
    var np = plate('33kV', .3, .16, '#f8fafc', '#111'); np.position.set(-sp, 3.0, .175); plates.add(np);
    [poles, brace, arm, ins, found, earth, plates].forEach(function (o) { g.add(o); });
    var L = ins.children[0].userData.len, cp = [-1.9, 0, 1.9].map(function (x) { return ph(x, ay - .38 - L, .22); });
    var cg = S.conductors(g, cp, 22, 1.4, .05);
    return { group: g, ground: { w: 6, d: 2 }, sway: sw, parts: { poles: { obj: poles, label: 'Twin poles', zoom: 1.2 }, brace: { obj: brace, label: 'Cross-bracing' }, arm: { obj: arm, label: 'Double cross-arm', zoom: 1.4 }, ins: { obj: ins, label: 'Suspension strings', zoom: 1.7 }, found: { obj: found, label: 'Embedded bases' }, earth: { obj: earth, label: 'Earthing' } }, tall: 13.5 };
  };

  /* ================= CONCRETE ================= */
  function rccBody(h, e, wt, wb, dt, db) { /* rectangular tapered pole with chamfers; returns mesh */
    var g = new T.BoxGeometry(1, h + e, 1, 1, 24, 1), p = g.attributes.position;
    for (var i = 0; i < p.count; i++) { var y = p.getY(i), t = (y + (h + e) / 2) / (h + e), w = wb + (wt - wb) * t, d = db + (dt - db) * t; p.setX(i, p.getX(i) * w); p.setZ(i, p.getZ(i) * d); p.setY(i, y); }
    g.computeVertexNormals(); var m = new T.Mesh(g, X.conc()); m.position.y = (h - e) / 2; return m;
  }
  function pccBody(h, e, rt, rb) {
    var g = new T.CylinderGeometry(rt, rb, h + e, 36, 1, false), m = new T.Mesh(g, X.conc()); m.position.y = (h - e) / 2;
    var rings = new V.Merge(M.std(0x858b92, 0, .95)), n = Math.round(h / .9);
    for (var i = 1; i < n; i++) { var y = -e + (h + e) * i / n, t = i / n, r = rb + (rt - rb) * t; rings.geo(new T.TorusGeometry(r + .002, .006, 6, 36), 0, y, 0, Math.PI / 2, 0, 0); }
    var grp = G(); grp.add(m); grp.add(rings.mesh()); return grp;
  }
  function rebarCage(h, e, wt, wb, dt, db, round) {
    var m = new V.Merge(X.rebar()), n = 0, pts = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
    if (!round) pts.forEach(function (c) { m.rod(ph(c[0] * (wb / 2 - .02), -e, c[1] * (db / 2 - .02)), ph(c[0] * (wt / 2 - .02), h, c[1] * (dt / 2 - .02)), .022); });
    else for (var k = 0; k < 10; k++) { var a = k / 10 * Math.PI * 2; m.rod(ph(Math.cos(a) * (wb - .04), -e, Math.sin(a) * (wb - .04)), ph(Math.cos(a) * (wt - .04), h, Math.sin(a) * (wt - .04)), .012); }
    var sn = Math.round((h + e) / .35);
    for (var i = 0; i <= sn; i++) { var t = i / sn, y = -e + (h + e) * t, w = wb + (wt - wb) * t, d = db + (dt - db) * t;
      if (round) m.geo(new T.TorusGeometry(w - .04, .006, 5, 28), 0, y, 0, Math.PI / 2, 0, 0); else { var a2 = w / 2 - .02, b2 = d / 2 - .02; m.rod(ph(-a2, y, -b2), ph(a2, y, -b2), .008); m.rod(ph(a2, y, -b2), ph(a2, y, b2), .008); m.rod(ph(a2, y, b2), ph(-a2, y, b2), .008); m.rod(ph(-a2, y, b2), ph(-a2, y, -b2), .008); } }
    return m.mesh();
  }
  function concretePole(opt) {
    var g = G(), pole = G(), arms = G(), ins = G(), found = G(), earth = G(), steelG = G(), sw = [], conc = X.conc();
    var h = opt.h, e = opt.e, cage;
    var body = opt.round ? pccBody(h, e, opt.rt, opt.rb) : rccBody(h, e, opt.wt, opt.wb, opt.dt, opt.db);
    pole.add(body);
    if (!opt.round) { /* fixing holes */ var hm = new V.Merge(M.std(0x1b1f24, 0, 1)); for (var y = 1.5; y < h - .3; y += .5) { var t = (y + e) / (h + e), w = opt.wb + (opt.wt - opt.wb) * t, d = opt.db + (opt.dt - opt.db) * t; hm.geo(new T.CylinderGeometry(.018, .018, d + .01, 8), 0, y, 0, Math.PI / 2, 0, 0); } pole.add(hm.mesh()); }
    cage = opt.round ? rebarCage(h, e, opt.rt, opt.rb, 0, 0, true) : rebarCage(h, e, opt.wt, opt.wb, opt.dt, opt.db, false); cage.visible = false; pole.add(cage);
    var topW = opt.round ? opt.rt * 2 : opt.wt, dz = opt.round ? opt.rt : opt.dt / 2;
    opt.arms.forEach(function (a) {
      var ch = channel(a.len, .08, .11); ch.position.set(0, a.y, dz + .06); arms.add(ch);
      var mm = new V.Merge(X.steel()); mm.strut(ph(-a.len / 2 + .1, a.y - .02, dz + .06), ph(-a.len / 2 + .1, a.y - .02, dz + .06), .01); mm.strut(ph(-.12, a.y - .9, dz + .06), ph(-a.len / 2 + .25, a.y, dz + .06), .04); mm.strut(ph(.12, a.y - .9, dz + .06), ph(a.len / 2 - .25, a.y, dz + .06), .04);
      mm.rod(ph(-topW / 2 - .02, a.y, dz + .02), ph(topW / 2 + .02, a.y, dz + .02), .05); arms.add(mm.mesh());
      var xs = a.xs; xs.forEach(function (x) { var i; if (a.susp) { i = V.string(a.susp, .17, X.glass(), X.steel()); i.position.set(x, a.y - .06, dz + .06); sw.push(i); } else { i = pinInsulator(.36, .07); i.position.set(x, a.y + .06, dz + .06); } ins.add(i); });
    });
    if (opt.top) { var tp = pinInsulator(.36, .07); tp.position.set(0, h + .05, 0); ins.add(tp); }
    var sb = soilBlock(opt.sw || 1.6, opt.sw || 1.6, e + .1); found.add(sb); found.add(mesh(new T.CylinderGeometry(.25, .28, .3, 18), X.pad(), 0, -e + .25, 0));
    earthDown(earth, (opt.round ? opt.rb : opt.wb / 2) + .04, 0, h - .6, .02);
    var np = plate(opt.kv, .26, .14, '#f8fafc', '#111'); np.position.set(0, 2.6, (opt.round ? opt.rb : opt.db / 2) + .006); pole.add(np);
    var dp = plate('\u26A1', .24, .2, '#f5d90a', '#111'); dp.position.set(0, 3.1, (opt.round ? opt.rb : opt.db / 2) + .006); pole.add(dp);
    [pole, arms, ins, found, earth].forEach(function (o) { g.add(o); });
    var cp = []; opt.arms.forEach(function (a) { var L = a.susp ? ins.children[0].userData.len : .36; a.xs.forEach(function (x) { cp.push(ph(x, a.susp ? a.y - .06 - (V.string(a.susp, .17, X.glass()).userData.len) : a.y + .06 + .36, dz + .06)); }); });
    if (opt.top) cp.push(ph(0, h + .05 + .36, 0));
    S.conductors(g, cp, 24, 1.3, .045);
    var xr = function (on) { conc.transparent = on; conc.opacity = on ? .22 : 1; conc.depthWrite = !on; cage.visible = on; };
    var xm = X.conc(); xm.needsUpdate = true;
    return { group: g, ground: { w: opt.sw || 1.6, d: opt.sw || 1.6 }, sway: sw, xray: xr, parts: { pole: { obj: pole, label: opt.round ? 'Spun PCC pole' : 'RCC pole body', zoom: 1.1 }, arms: { obj: arms, label: 'Steel cross-arms', zoom: 1.5 }, ins: { obj: ins, label: 'Insulators', zoom: 1.6 }, found: { obj: found, label: 'Embedded base' }, earth: { obj: earth, label: 'Earthing' } }, tall: h + 2 };
  }
  B.rcc_double = function () { return concretePole({ h: 13, e: 2.1, wt: .2, wb: .38, dt: .15, db: .26, kv: '33kV', sw: 1.8, arms: [{ y: 12.2, len: 2.4, xs: [-1.0, 1.0], susp: 3 }, { y: 10.4, len: 2.6, xs: [-1.1, 1.1], susp: 3 }, { y: 8.6, len: 2.8, xs: [-1.2, 1.2], susp: 3 }] }); };
  B.rcc_single = function () { return concretePole({ h: 9, e: 1.6, wt: .15, wb: .28, dt: .12, db: .2, kv: '11kV', sw: 1.4, top: true, arms: [{ y: 8.1, len: 1.9, xs: [-.85, .85] }] }); };
  B.pcc_solid = function () { return concretePole({ h: 11, e: 1.8, rt: .1, rb: .165, round: true, kv: '11kV', sw: 1.5, top: true, arms: [{ y: 10.1, len: 2.0, xs: [-.9, .9] }] }); };

  /* ================= TUBULAR STEEL ================= */
  B.steel_tubular = function () {
    var g = G(), pole = G(), arms = G(), ins = G(), found = G(), earth = G(), sw = [], sm = X.steel();
    var secs = [[.215, .185, 0, 4.6], [.185, .155, 4.2, 8.8], [.155, .12, 8.4, 13.0]];
    secs.forEach(function (s, i) { var c = new T.Mesh(new T.CylinderGeometry(s[1], s[0], s[3] - s[2], 40, 1, true), new T.MeshStandardMaterial({ color: 0xa9b3bd, metalness: .85, roughness: .38, side: T.DoubleSide })); c.position.y = (s[2] + s[3]) / 2; pole.add(c); if (i) { var col = mesh(new T.CylinderGeometry(s[0] + .012, s[0] + .012, .22, 40, 1, true), new T.MeshStandardMaterial({ color: 0x7d8895, metalness: .9, roughness: .3, side: T.DoubleSide }), 0, s[2] + .1, 0); pole.add(col); } });
    pole.add(mesh(new T.CylinderGeometry(.13, .12, .08, 24), X.dark(), 0, 13.04, 0)); pole.add(mesh(new T.SphereGeometry(.05, 12, 8), X.dark(), 0, 13.12, 0));
    var base = mesh(new T.BoxGeometry(.7, .05, .7), X.dark(), 0, .12, 0), bm = new V.Merge(X.dark()); pole.add(base);
    [[1, 1], [-1, 1], [1, -1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function (c) { bm.rod(ph(c[0] * .29, -.5, c[1] * .29), ph(c[0] * .29, .22, c[1] * .29), .035); bm.geo(new T.CylinderGeometry(.045, .045, .04, 6), c[0] * .29, .165, c[1] * .29); });
    [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(function (c) { bm.strut(ph(c[0] * .1, .15, c[1] * .21), ph(c[0] * .1, .6, c[1] * .21), .03, .02); });
    pole.add(bm.mesh());
    found.add(soilBlock(1.6, 1.6, 1.8)); var pier = mesh(new T.CylinderGeometry(.55, .6, 1.6, 28), X.pad(), 0, -.9, 0); found.add(pier);
    var cage = new V.Merge(X.rebar()); for (var k = 0; k < 8; k++) { var a = k / 8 * 6.283; cage.rod(ph(Math.cos(a) * .42, -1.6, Math.sin(a) * .42), ph(Math.cos(a) * .42, -.05, Math.sin(a) * .42), .02); } found.add(cage.mesh());
    /* crossarms: lattice-type tubular arms, 2 levels */
    var levels = [{ y: 12.3, len: 1.8, n: 3 }, { y: 10.1, len: 2.0, n: 3 }], am = new V.Merge(sm), pts = [];
    levels.forEach(function (L) { [-1, 1].forEach(function (s) {
      am.rod(ph(s * .15, L.y + .0, 0), ph(s * L.len, L.y + .0, 0), .07); am.rod(ph(s * .15, L.y - .75, 0), ph(s * L.len, L.y + .0, 0), .055);
      am.rod(ph(s * .15, L.y + .5, 0), ph(s * L.len * .95, L.y + .05, 0), .04);
      var st = V.string(L.n, .17, X.gray(), X.steel()); st.position.set(s * (L.len - .05), L.y - .08, 0); ins.add(st); sw.push(st); pts.push(ph(s * (L.len - .05), L.y - .08 - st.userData.len, 0)); }); });
    arms.add(am.mesh());
    var peak = new V.Merge(sm); peak.rod(ph(0, 13.0, 0), ph(0, 13.8, 0), .05); arms.add(peak.mesh());
    earthDown(earth, .24, 0, 12.8, .02);
    var step = new V.Merge(X.dark()); for (var y = 2.5; y < 8; y += .6) { step.rod(ph(.18 + .0, y, -.1), ph(.4, y, -.1), .02); } pole.add(step.mesh());
    [pole, arms, ins, found, earth].forEach(function (o) { g.add(o); });
    S.conductors(g, pts, 24, 1.4, .05);
    return { group: g, ground: { w: 1.6, d: 1.6 }, sway: sw, parts: { pole: { obj: pole, label: 'Swaged tubular shaft', zoom: 1.1 }, joint: { obj: pole, label: 'Slip joints' }, arms: { obj: arms, label: 'Cross-arms', zoom: 1.4 }, ins: { obj: ins, label: 'Insulator strings', zoom: 1.5 }, found: { obj: found, label: 'Pier & anchor bolts', zoom: 1.6 }, earth: { obj: earth, label: 'Earthing' } }, tall: 14.5 };
  };
})();
