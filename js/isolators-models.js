/* HV isolator (disconnector) models. Each builder returns { group, parts, update(open 0..1, earth 0..1), live(on), tall, w }.
   Geometry is real-linkage driven: arms, knee joints and pantograph scissors are solved every frame, not faked with keyframes. */
(function () {
  'use strict';
  var T = THREE, V = VK, M = V.mat, v3 = V.v3, I = window.VKI = window.VKI || {}, B = I.build = {};
  var _c = {};
  function c(k, f) { return _c[k] || (_c[k] = f()); }
  var X = {
    por: function () { return c('por', function () { return M.porcelain(0x7b4a2d); }); },
    porG: function () { return c('porG', function () { return M.porcelain(0xb9c0c7); }); },
    galv: function () { return c('galv', function () { return M.std(0x9ea8b3, .85, .45); }); },
    alu: function () { return c('alu', function () { return M.std(0xdfe5eb, .95, .22); }); },
    silver: function () { return c('silver', function () { return M.std(0xf1f5f9, 1, .12); }); },
    cu: function () { return c('cu', function () { return M.copper(); }); },
    dark: function () { return c('dark', function () { return M.std(0x2b3139, .7, .5); }); },
    cab: function () { return c('cab', function () { return M.std(0x5b6b7d, .35, .55); }); },
    pad: function () { return c('pad', function () { return M.concrete('#80868e'); }); },
    earthC: function () { return c('earthC', function () { return M.std(0x22c55e, .5, .4, { emissive: 0x052e16 }); }); },
    yel: function () { return c('yel', function () { return M.std(0xfacc15, .3, .5); }); }
  };
  var UP = new T.Vector3(0, 1, 0), CYL = new T.CylinderGeometry(.5, .5, 1, 16), BOX = new T.BoxGeometry(1, 1, 1);
  function G() { return new T.Group(); }
  function mesh(g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; }
  function link(mat, d) { var m = new T.Mesh(CYL, mat); m.userData.d = d; return m; }
  function place(m, a, b) { var dir = new T.Vector3().subVectors(b, a), L = dir.length(); m.position.addVectors(a, b).multiplyScalar(.5); m.scale.set(m.userData.d, Math.max(L, 1e-4), m.userData.d); if (L > 1e-5) m.quaternion.setFromUnitVectors(UP, dir.multiplyScalar(1 / L)); }
  function pivot(len, r, mat) { var m = mesh(new T.CylinderGeometry(r, r, len, 20), mat); m.rotation.x = Math.PI / 2; return m; }

  /* tall ribbed porcelain post with metal flanges and bolt circle */
  function post(h, r, mat) {
    var g = G(), body = V.postInsulator(h, r, Math.round(h * 5), mat || X.por()); g.add(body);
    [0, h].forEach(function (y) { var f = mesh(new T.CylinderGeometry(r * 1.25, r * 1.25, .07, 28), X.galv(), 0, y, 0); g.add(f);
      for (var i = 0; i < 8; i++) { var a = i / 8 * 6.283, b = mesh(new T.CylinderGeometry(.022, .022, .06, 6), X.dark(), Math.cos(a) * r * 1.08, y + (y ? .05 : -.05), Math.sin(a) * r * 1.08); g.add(b); } });
    return g;
  }
  /* 4-hole terminal pad */
  function terminal() {
    var g = G(); g.add(mesh(new T.BoxGeometry(.34, .035, .22), X.alu(), 0, 0, 0));
    [[-.1, -.07], [.1, -.07], [-.1, .07], [.1, .07]].forEach(function (p) { g.add(mesh(new T.CylinderGeometry(.018, .018, .045, 8), X.dark(), p[0], .01, p[1])); }); return g;
  }
  /* female tulip contact pointing along +X local (opening faces +X) */
  function tulip() {
    var g = G(), body = mesh(new T.CylinderGeometry(.125, .135, .26, 24), X.alu()); body.rotation.z = Math.PI / 2; body.position.x = -.12; g.add(body);
    for (var i = 0; i < 8; i++) { var a = i / 8 * 6.283, f = mesh(new T.BoxGeometry(.34, .03, .05), X.silver(), .07, Math.cos(a) * .09, Math.sin(a) * .09); f.rotation.x = a; g.add(f); }
    [0, .13].forEach(function (x) { var r = mesh(new T.TorusGeometry(.105, .016, 8, 24), X.dark(), x + .01, 0, 0); r.rotation.y = Math.PI / 2; g.add(r); });
    return g;
  }
  /* male pin contact pointing along +X local */
  function pin() { var g = G(), p = mesh(new T.CylinderGeometry(.04, .05, .34, 14), X.silver()); p.rotation.z = Math.PI / 2; p.position.x = .12; g.add(p); var cap = mesh(new T.SphereGeometry(.04, 12, 8), X.silver(), .29, 0, 0); g.add(cap); var col = mesh(new T.CylinderGeometry(.085, .085, .1, 16), X.alu(), -.05, 0, 0); col.rotation.z = Math.PI / 2; g.add(col); return g; }
  function tubeAlong(len, d, mat) { var m = mesh(new T.CylinderGeometry(d / 2, d / 2, len, 20), mat || X.alu()); m.rotation.z = Math.PI / 2; m.position.x = len / 2; return m; }
  function arcHorn(len) { var m = new V.Merge(X.alu()); m.rod(v3(0, 0, 0), v3(len * .5, .18, 0), .02); m.rod(v3(len * .5, .18, 0), v3(len, .22, 0), .02); return m.mesh(); }

  /* galvanised support stand under each phase + shared base channel; returns y of mounting plane */
  function stand(g, xs, z0, SH) {
    var m = new V.Merge(X.galv()), p = new V.Merge(X.pad());
    xs.forEach(function (x) {
      [[-.32, -.32], [.32, -.32], [.32, .32], [-.32, .32]].forEach(function (o) { m.rod(v3(x + o[0], 0, z0 + o[1]), v3(x + o[0] * .78, SH, z0 + o[1] * .78), .1); });
      [.7, 1.45, 2.05].forEach(function (y) { if (y < SH - .1) { var k = .32 - (.32 - .25) * y / SH, l = .32 - (.32 - .25) * (y + .75) / SH; m.rod(v3(x - k, y, z0 - k), v3(x + l, Math.min(y + .75, SH), z0 - l), .045); m.rod(v3(x + k, y, z0 - k), v3(x - l, Math.min(y + .75, SH), z0 - l), .045); m.rod(v3(x - k, y, z0 + k), v3(x + l, Math.min(y + .75, SH), z0 + l), .045); m.rod(v3(x + k, y, z0 + k), v3(x - l, Math.min(y + .75, SH), z0 + l), .045); } });
      m.box(x, SH - .03, z0, .8, .07, .8); p.box(x, .12, z0, 1.0, .24, 1.0);
    });
    return { s: m.mesh(), p: p.mesh() };
  }
  /* earth switch for one phase: blade hinged beside the line-side post, swings to an earthing contact */
  function earthSwitch(SH, x, z0, len, sign) {
    var ZO = 1.0, g = G(); g.position.set(x, SH + .12, z0 + ZO);
    var hinge = pivot(.22, .05, X.dark()); g.add(hinge); g.add(mesh(new T.BoxGeometry(.3, .08, .3), X.galv(), 0, -.06, 0));
    var arm = new T.Group(); if (sign < 0) arm.scale.x = -1; arm.add(tubeAlong(len, .07, X.alu())); var lug = mesh(new T.BoxGeometry(.16, .05, .12), X.earthC(), len, 0, 0); arm.add(lug); g.add(arm);
    g.userData.arm = arm; g.userData.sign = sign;
    /* own galvanised pedestal + pad so the hinge is never floating */
    var ped = new V.Merge(X.galv()); [[-.12, -.12], [.12, -.12], [.12, .12], [-.12, .12]].forEach(function (o) { ped.rod(v3(o[0], -SH - .12 + .24, o[1]), v3(o[0] * .8, -.1, o[1] * .8), .05); }); ped.box(0, -.06, 0, .36, .06, .36);
    g.add(ped.mesh()); g.add(mesh(new T.BoxGeometry(.7, .22, .7), X.pad(), 0, -SH - .12 + .11, 0));
    /* flexible earth braid down to the ground grid (hangs from the hinge) */
    var gl = new V.Merge(X.cu()); gl.rod(v3(0, -.1, .2), v3(sign * .05, -.6, .26), .022); gl.rod(v3(sign * .05, -.6, .26), v3(sign * .05, -SH - .1, .26), .022); g.add(gl.mesh());
    return g;
  }
  function mechanism(g, x, z0, SH) {
    var cab = mesh(new T.BoxGeometry(.9, 1.2, .6), X.cab(), x, 1.0, z0); g.add(cab);
    var door = mesh(new T.BoxGeometry(.04, .95, .45), X.galv(), x + .46, 1.0, z0); g.add(door);
    var lamp = mesh(new T.SphereGeometry(.04, 10, 8), X.earthC(), x + .49, 1.35, z0 + .12); g.add(lamp);
    var shaft = new V.Merge(X.galv()); shaft.rod(v3(x, 1.6, z0), v3(x, SH - .1, z0), .07); g.add(shaft.mesh());
    g.add(mesh(new T.BoxGeometry(1.0, .08, .7), X.pad(), x, .04, z0)); return cab;
  }
  function inter(g, x0, x1, y, zs) { var m = new V.Merge(X.galv()); m.rod(v3(x0, y, zs[0]), v3(x1, y, zs[zs.length - 1]), .07); return m.mesh(); }

  /* generic scaffold: three phases, stand, mechanism, interphase pipe; each phase supplies a build(z0) */
  function scaffold(spec) {
    var g = G(), ph = [], ups = [], SH = 2.5, zs = [-3.2, 0, 3.2], parts = { posts: G(), contacts: G(), blades: G(), drive: G(), earth: G(), base: G() };
    var live = [];
    zs.forEach(function (z0) {
      var s = stand(g, spec.xs, z0, SH); parts.base.add(s.s); parts.base.add(s.p);
      var p = spec.phase(SH, z0, parts); ph.push(p);
      var es = earthSwitch(SH, spec.earthX, z0, spec.earthLen, spec.earthSign); parts.earth.add(es); ph[ph.length - 1].es = es;
    });
    mechanism(parts.drive, spec.mechX, 0, SH);
    parts.drive.add(inter(g, spec.mechX, spec.mechX, SH - .5, zs));
    var cross = new V.Merge(X.galv()); zs.forEach(function (z0) { cross.box(spec.mechX, SH - .06, z0, .5, .07, .5); }); cross.rod(v3(spec.mechX, SH - .06, zs[0]), v3(spec.mechX, SH - .06, zs[2]), .1); parts.base.add(cross.mesh());
    Object.keys(parts).forEach(function (k) { g.add(parts[k]); });
    var self = { group: g, ph: ph, parts: {
      posts: { obj: parts.posts, label: spec.l.posts, zoom: 1.3 }, contacts: { obj: parts.contacts, label: spec.l.contacts, zoom: 1.9 }, blades: { obj: parts.blades, label: spec.l.blades, zoom: 1.4 },
      drive: { obj: parts.drive, label: spec.l.drive, zoom: 1.6 }, earth: { obj: parts.earth, label: 'Earth switch', zoom: 1.5 }, base: { obj: parts.base, label: 'Support stand', zoom: 1.2 } }, tall: spec.tall, w: spec.w, liveMats: spec.liveMats };
    self.update = function (t, e) {
      ph.forEach(function (p) { p.set(t); p.es.userData.arm.rotation.z = p.es.userData.sign * e * (Math.PI / 2 + .04); });
    };
    self.live = function (on) { (spec.liveMats || []).forEach(function (m) { m.emissive.setHex(on ? 0x0891b2 : 0x000000); m.emissiveIntensity = on ? .55 : 0; }); };
    return self;
  }
  function liveMat() { var m = M.std(0xdfe5eb, .95, .22); m.emissive = new T.Color(0x000000); return m; }
  var RAD = Math.PI / 180;

  /* ============ SINGLE BREAK (center break) ============ */
  B.single = function () {
    var lm = liveMat(), PH = 2.5, zs3 = [-3.2, 0, 3.2];
    return scaffold({ xs: [-1.3, 1.3], earthX: -2.05, earthLen: 2.5, earthSign: 1, mechX: -3.0, tall: 7, w: 8, liveMats: [lm],
      l: { posts: 'Twin post insulators', contacts: 'Centre contacts', blades: 'Contact arms', drive: 'Counter-rotation drive' },
      phase: function (SH, z0, P) {
        var L = G(), Rg = G(); L.position.set(-1.3, SH, z0); Rg.position.set(1.3, SH, z0); P.posts.add(L); P.posts.add(Rg);
        var pl = post(PH, .13), pr = post(PH, .13); L.add(pl); Rg.add(pr);
        var hl = G(), hr = G(); hl.position.y = PH; hr.position.y = PH; L.add(hl); Rg.add(hr);
        [hl, hr].forEach(function (h, i) { h.add(mesh(new T.CylinderGeometry(.19, .19, .2, 24), X.galv(), 0, .1, 0)); var t = terminal(); t.position.set(0, .22, 0); h.add(t); });
        var al = tubeAlong(1.2, .11, lm); var ar = tubeAlong(1.2, .11, lm); hl.add(al); al.position.y = .1; var tl = tulip(); tl.position.set(1.2, .1, 0); hl.add(tl);
        ar.rotation.y = Math.PI; ar.position.y = .1; hr.add(ar); var pn = pin(); pn.rotation.y = Math.PI; pn.position.set(-1.2 + .0, .1, 0); hr.add(pn);
        /* crank plates fixed to each post foot (turn with the post), pins at their tips */
        var CR = .26, YC = SH + .38;
        var cl = G(), cr = G(); cl.position.y = .38; cr.position.y = .38; cl.add(mesh(new T.BoxGeometry(.1, .05, CR + .12), X.galv(), 0, 0, CR / 2 - .02)); cr.add(mesh(new T.BoxGeometry(.1, .05, CR + .12), X.galv(), 0, 0, CR / 2 - .02)); L.add(cl); Rg.add(cr);
        var rodL = link(X.galv(), .05), rodR = link(X.galv(), .05); P.drive.add(rodL); P.drive.add(rodR);
        var slider = mesh(new T.BoxGeometry(.3, .16, .3), X.dark(), 0, YC, z0); P.drive.add(slider);
        var pinsM = [mesh(new T.CylinderGeometry(.045, .045, .16, 10), X.dark()), mesh(new T.CylinderGeometry(.045, .045, .16, 10), X.dark())]; pinsM.forEach(function (q) { P.drive.add(q); });
        if (!P.drive.userData.rail) { P.drive.userData.rail = true; var rail = new V.Merge(X.galv()); rail.rod(v3(0, YC - .12, zs3[0] - .6), v3(0, YC - .12, zs3[2] + 1.6), .06); P.drive.add(rail.mesh()); }
        var LEN = 1.75;
        return { set: function (t) { var th = t * 90 * RAD, sn = Math.sin(th), cs = Math.cos(th);
          hl.rotation.y = -th; hr.rotation.y = th; pl.rotation.y = -th; pr.rotation.y = th; L.userData.th = th;
          var pL = v3(-1.3 - CR * sn, YC, z0 + CR * cs), pR = v3(1.3 + CR * sn, YC, z0 + CR * cs);
          var zc = z0 + CR * cs + Math.sqrt(Math.max(.01, LEN * LEN - (1.3 + CR * sn) * (1.3 + CR * sn)));
          var C = v3(0, YC, zc); slider.position.copy(C);
          place(rodL, pL, C); place(rodR, pR, C); pinsM[0].position.copy(pL); pinsM[1].position.copy(pR); cl.rotation.y = -th; cr.rotation.y = th; } };
      } });
  };

  /* ============ DOUBLE BREAK (centre rotating post) ============ */
  B.double = function () {
    var lm = liveMat(), PH = 2.5;
    return scaffold({ xs: [-2.0, 0, 2.0], earthX: -2.75, earthLen: 2.5, earthSign: 1, mechX: -3.7, tall: 7, w: 9.5, liveMats: [lm],
      l: { posts: 'Three post insulators', contacts: 'End contacts', blades: 'Centre rotating blade', drive: 'Rotating drive' },
      phase: function (SH, z0, P) {
        var E1 = G(), E2 = G(), C = G(); E1.position.set(-2.0, SH, z0); E2.position.set(2.0, SH, z0); C.position.set(0, SH, z0); [E1, E2, C].forEach(function (o) { P.posts.add(o); });
        E1.add(post(PH, .13)); E2.add(post(PH, .13)); var cp = post(PH, .14); C.add(cp);
        [E1, E2].forEach(function (e, i) { var h = mesh(new T.CylinderGeometry(.17, .17, .2, 24), X.galv(), 0, PH + .1, 0); e.add(h); var t = terminal(); t.position.set(0, PH + .22, 0); e.add(t);
          var tu = tulip(); tu.position.set(0, PH + .1, 0); if (i === 0) tu.position.x = .0; tu.rotation.y = i === 0 ? 0 : Math.PI; tu.position.x = i === 0 ? .12 : -.12; P.contacts.add(tu); e.add(tu); });
        var head = G(); head.position.y = PH; C.add(head); head.add(mesh(new T.CylinderGeometry(.2, .2, .22, 26), X.galv(), 0, .11, 0));
        var bl = mesh(new T.CylinderGeometry(.055, .055, 3.2, 20), lm); bl.rotation.z = Math.PI / 2; bl.position.y = .12; head.add(bl);
        var p1 = pin(); p1.position.set(1.52, .12, 0); head.add(p1); var p2 = pin(); p2.rotation.y = Math.PI; p2.position.set(-1.52, .12, 0); head.add(p2);
        
        var crank = link(X.galv(), .05); P.drive.add(crank);
        return { set: function (t) { var a = t * 90 * RAD; head.rotation.y = a; cp.rotation.y = a; place(crank, v3(0, SH + .25, z0), v3(.45 * Math.cos(a), SH + .25, z0 - .45 * Math.sin(a))); } };
      } });
  };

  /* ============ VERTICAL BREAK ============ */
  B.vertical = function () {
    var lm = liveMat(), PH = 2.5;
    return scaffold({ xs: [-1.5, 0, 1.5], earthX: -2.25, earthLen: 2.5, earthSign: 1, mechX: -3.3, tall: 8, w: 8.5, liveMats: [lm],
      l: { posts: 'Support posts', contacts: 'Receiving jaw', blades: 'Vertical lifting blade', drive: 'Centre drive column' },
      phase: function (SH, z0, P) {
        var A = G(), Cc = G(), Dg = G(); A.position.set(-1.5, SH, z0); Cc.position.set(0, SH, z0); Dg.position.set(1.5, SH, z0); [A, Cc, Dg].forEach(function (o) { P.posts.add(o); });
        A.add(post(PH, .13)); Dg.add(post(PH, .13)); var dc = post(PH * .72, .12); Cc.add(dc);
        var hA = mesh(new T.CylinderGeometry(.17, .17, .2, 24), X.galv(), 0, PH + .1, 0); A.add(hA); var tA = terminal(); tA.position.set(-.12, PH + .22, 0); A.add(tA);
        var hD = mesh(new T.CylinderGeometry(.17, .17, .2, 24), X.galv(), 0, PH + .1, 0); Dg.add(hD); var tD = terminal(); tD.position.set(.12, PH + .22, 0); Dg.add(tD);
        var tu = tulip(); tu.rotation.y = Math.PI; tu.position.set(-.12, PH + .1, 0); Dg.add(tu); P.contacts.add(tu);
        var hinge = G(); hinge.position.set(0, PH + .26, 0); A.add(hinge); var pv = pivot(.4, .08, X.dark()); hinge.add(pv);
        var blade = G(); hinge.add(blade); var bt = tubeAlong(2.7, .1, lm); blade.add(bt); var p1 = pin(); p1.position.set(2.7, 0, 0); blade.add(p1);
        blade.add(mesh(new T.BoxGeometry(.5, .08, .3), X.alu(), .3, -.1, 0));
        var crank = G(); crank.position.set(0, PH * .72 + .08, 0); Cc.add(crank); crank.add(mesh(new T.BoxGeometry(.5, .05, .07), X.galv(), .2, 0, 0)); var rod = link(X.galv(), .05); P.drive.add(rod);
        return { set: function (t) { var a = t * 85 * RAD; blade.rotation.z = a; dc.rotation.y = t * 90 * RAD; crank.rotation.y = t * 90 * RAD;
          var attach = new T.Vector3(-1.5 + 1.0 * Math.cos(a), SH + PH + .26 + 1.0 * Math.sin(a) + .1, z0), tip = new T.Vector3(crank.position.x + .4 * Math.cos(t * 90 * RAD), SH + PH * .72 + .08, z0 - .4 * Math.sin(t * 90 * RAD));
          place(rod, tip, attach); } };
      } });
  };

  /* ============ KNEE BREAK ============ */
  B.knee = function () {
    var lm = liveMat(), PH = 2.5, L1 = 1.5, L2 = 1.5;
    return scaffold({ xs: [-1.55, 1.55], earthX: -2.3, earthLen: 2.5, earthSign: 1, mechX: -3.3, tall: 8, w: 8.5, liveMats: [lm],
      l: { posts: 'Support posts', contacts: 'Contact jaw', blades: 'Knee-break blade', drive: 'Drive rod' },
      phase: function (SH, z0, P) {
        var A = G(), Bp = G(); A.position.set(-1.55, SH, z0); Bp.position.set(1.55, SH, z0); P.posts.add(A); P.posts.add(Bp);
        A.add(post(PH, .13)); Bp.add(post(PH, .13));
        A.add(mesh(new T.CylinderGeometry(.18, .18, .2, 24), X.galv(), 0, PH + .1, 0)); Bp.add(mesh(new T.CylinderGeometry(.18, .18, .2, 24), X.galv(), 0, PH + .1, 0));
        var t1 = terminal(); t1.position.set(-.14, PH + .22, 0); A.add(t1); var t2 = terminal(); t2.position.set(.14, PH + .22, 0); Bp.add(t2);
        var tu = tulip(); tu.rotation.y = Math.PI; tu.position.set(-.12, PH + .1, 0); Bp.add(tu); P.contacts.add(tu);
        var hinge = G(); hinge.position.set(0, PH + .28, 0); A.add(hinge); hinge.add(pivot(.38, .075, X.dark()));
        var lower = G(); hinge.add(lower); lower.add(tubeAlong(L1, .105, lm)); var knee = G(); knee.position.x = L1; lower.add(knee); knee.add(pivot(.4, .1, X.dark())); knee.add(mesh(new T.BoxGeometry(.3, .16, .34), X.alu(), -.05, 0, 0));
        var upper = G(); upper.position.x = L1; lower.add(upper); upper.add(tubeAlong(L2 - .0, .095, lm)); var pn = pin(); pn.position.set(L2, 0, 0); upper.add(pn);
        var strap = mesh(new T.BoxGeometry(.5, .03, .26), X.cu(), L1 - .05, .09, 0); lower.add(strap);
        var rod = link(X.galv(), .05); P.drive.add(rod); var crank = mesh(new T.BoxGeometry(.4, .05, .06), X.galv(), 0, PH * .3, 0); A.add(crank);
        return { set: function (t) { var a = 65 * RAD * t; lower.rotation.z = a; upper.rotation.z = -165 * RAD * t; knee.rotation.z = 0; strap.rotation.z = -82 * RAD * t; crank.rotation.y = t * 90 * RAD;
          place(rod, v3(-1.55 + .35 * Math.cos(t * 90 * RAD), SH + PH * .3, z0 - .35 * Math.sin(t * 90 * RAD)), v3(-1.55 + .75 * Math.cos(a), SH + PH + .28 + .75 * Math.sin(a) + .08, z0)); } };
      } });
  };

  /* two-link solver: knee point K for hinge H and end C (2D, x/y) */
  function ik(H, C, L1, L2, up) {
    var dx = C.x - H.x, dy = C.y - H.y, d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1e-3), a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), ux = dx / d, uy = dy / d;
    return v3(H.x + a * ux - up * h * uy, H.y + a * uy + up * h * ux, 0);
  }
  function busbar(P, z0, y, SH, half) {
    var bar = mesh(new T.CylinderGeometry(.075, .075, half * 2, 20), X.alu()); bar.rotation.z = Math.PI / 2; bar.position.set(0, y, z0); P.blades.add(bar);
    [-1, 1].forEach(function (s) { var col = new V.Merge(X.galv()); [[-.25, -.25], [.25, -.25], [.25, .25], [-.25, .25]].forEach(function (o) { col.rod(v3(s * half + o[0] * .9, 0, z0 + o[1] * .9), v3(s * half + o[0] * .35, y - 1.5, z0 + o[1] * .35), .13); });
      for (var q = 1; q < 6; q++) { var yy = (y - 1.5) * q / 6; col.rod(v3(s * half - .2, yy, z0 - .2), v3(s * half + .2, yy, z0 + .2), .035); } P.base.add(col.mesh());
      P.base.add(mesh(new T.CylinderGeometry(.14, .14, 1.5, 20), X.porG(), s * half, y - .75, z0)); P.base.add(mesh(new T.BoxGeometry(.5, .06, .5), X.galv(), s * half, y - 1.5, z0));
      var clamp = mesh(new T.CylinderGeometry(.1, .1, .22, 16), X.alu(), s * half, y, z0); clamp.rotation.z = Math.PI / 2; P.blades.add(clamp); });
  }

  /* ============ PANTOGRAPH ============ */
  B.pantograph = function () {
    var lm = liveMat(), PH = 2.8, S = 2.2, HC = 3.5, HO = .95, half = 3.1;
    var self = scaffold({ xs: [0], earthX: 1.05, earthLen: 2.5, earthSign: -1, mechX: -2.0, tall: 10, w: 8, liveMats: [lm], busHalf: half,
      l: { posts: 'Base post insulator', contacts: 'Contact head', blades: 'Scissor arms + busbar', drive: 'Drive' },
      phase: function (SH, z0, P) {
        var Pt = G(); Pt.position.set(0, SH, z0); P.posts.add(Pt); var pp = post(PH, .15, X.porG()); Pt.add(pp);
        Pt.add(mesh(new T.CylinderGeometry(.21, .21, .22, 24), X.galv(), 0, PH + .11, 0)); var tm = terminal(); tm.position.set(.24, PH + .24, 0); Pt.add(tm);
        var by = SH + PH + .24 + HC + .1; busbar(P, z0, by, SH, half);
        var lk = [0, 1, 2, 3].map(function () { return link(lm, .1); }); lk.forEach(function (l) { P.blades.add(l); });
        var pv = [0, 1, 2, 3].map(function () { return pivot(.3, .08, X.dark()); }); pv.forEach(function (p) { P.blades.add(p); });
        var head = G(); P.contacts.add(head); head.add(mesh(new T.BoxGeometry(.4, .06, .22), X.alu(), 0, .0, 0)); var jaws = new V.Merge(X.silver()); jaws.box(-.12, .09, 0, .05, .16, .2); jaws.box(.12, .09, 0, .05, .16, .2); head.add(jaws.mesh());
        var base0 = v3(0, SH + PH + .24, z0);
        return { set: function (t) { var h = HO + (HC - HO) * (1 - t), Bp = new T.Vector3(0, 0, 0), Tp = new T.Vector3(0, h, 0), E1 = ik(Bp, Tp, S, S, 1), E2 = ik(Bp, Tp, S, S, -1);
          function W(p) { return new T.Vector3(base0.x + p.x, base0.y + p.y, z0); }
          place(lk[0], W(Bp), W(E1)); place(lk[1], W(E1), W(Tp)); place(lk[2], W(Bp), W(E2)); place(lk[3], W(E2), W(Tp));
          pv[0].position.copy(W(Bp)); pv[1].position.copy(W(E1)); pv[2].position.copy(W(E2)); pv[3].position.copy(W(Tp)); head.position.copy(W(Tp)).add(v3(0, .0, 0)); } };
      } });
    return self;
  };

  /* ============ SEMI-PANTOGRAPH ============ */
  B.semi = function () {
    var lm = liveMat(), PH = 2.8, L1 = 2.5, L2 = 2.5, HC = 3.4, HO = 1.1, half = 3.1;
    return scaffold({ xs: [-1.2, 1.2], earthX: -1.95, earthLen: 2.5, earthSign: 1, mechX: -3.1, tall: 10, w: 8.5, liveMats: [lm],
      l: { posts: 'Base post insulators', contacts: 'Contact head', blades: 'Half-scissor arms + busbar', drive: 'Drive' },
      phase: function (SH, z0, P) {
        var A = G(), Bp = G(); A.position.set(-1.2, SH, z0); Bp.position.set(1.2, SH, z0); P.posts.add(A); P.posts.add(Bp);
        A.add(post(PH, .15, X.porG())); Bp.add(post(PH * .8, .13, X.porG()));
        A.add(mesh(new T.CylinderGeometry(.21, .21, .22, 24), X.galv(), 0, PH + .11, 0)); Bp.add(mesh(new T.CylinderGeometry(.19, .19, .22, 24), X.galv(), 0, PH * .8 + .11, 0));
        var tm = terminal(); tm.position.set(-.26, PH + .24, 0); A.add(tm);
        var by = SH + PH + .24 + HC + .1; busbar(P, z0, by, SH, half);
        var l1 = link(lm, .11), l2 = link(lm, .1), guide = link(X.galv(), .06); P.blades.add(l1); P.blades.add(l2); P.drive.add(guide);
        var pv = [0, 1, 2].map(function () { return pivot(.3, .08, X.dark()); }); pv.forEach(function (p) { P.blades.add(p); });
        var head = G(); P.contacts.add(head); head.add(mesh(new T.BoxGeometry(.4, .06, .22), X.alu(), 0, 0, 0)); var jaws = new V.Merge(X.silver()); jaws.box(-.12, .09, 0, .05, .16, .2); jaws.box(.12, .09, 0, .05, .16, .2); head.add(jaws.mesh());
        var H0 = v3(-1.2, SH + PH + .24, z0);
        return { set: function (t) { var h = HO + (HC - HO) * (1 - t), Hh = new T.Vector3(0, 0, 0), C = new T.Vector3(1.2, h, 0), K = ik(Hh, C, L1, L2, 1);
          function W(p) { return new T.Vector3(H0.x + p.x, H0.y + p.y, z0); }
          place(l1, W(Hh), W(K)); place(l2, W(K), W(C)); pv[0].position.copy(W(Hh)); pv[1].position.copy(W(K)); pv[2].position.copy(W(C)); head.position.copy(W(C));
          place(guide, v3(1.2, SH + PH * .8 + .22, z0), W(C).add(v3(0, -.06, 0))); } };
      } });
  };
})();
