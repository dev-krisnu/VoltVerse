/* Lattice steel towers. Fixes the broken lines of the old pages: every tower now has four continuous
   angle-iron legs, horizontal girts and X-bracing on all four faces, built as merged geometry (fast on phones). */
(function () {
  'use strict';
  var T = THREE, V = VK, S = window.VKS, B = S.build, X = S.X, ph = V.v3;
  function G() { return new T.Group(); }
  function mesh(g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; }

  /* square lattice shaft. secs = [{y, a}] (half width at height). Adds legs, girts, X-bracing into mergers. */
  function shaft(legs, brace, secs, o) {
    o = o || {}; var tl = o.leg || .17, tg = o.girt || .09, td = o.diag || .075, ar = o.aspect || 1.05, dx = o.cx || 0, dz = o.cz || 0, levels = [];
    for (var i = 0; i < secs.length - 1; i++) {
      var a = secs[i], b = secs[i + 1], dy = b.y - a.y, w = (a.a + b.a), n = Math.max(1, Math.round(dy / (w * ar)));
      for (var k = (i ? 1 : 0); k <= n; k++) { var t = k / n; levels.push({ y: a.y + dy * t, a: a.a + (b.a - a.a) * t }); }
    }
    function cs(L) { return [ph(dx - L.a, L.y, dz - L.a), ph(dx + L.a, L.y, dz - L.a), ph(dx + L.a, L.y, dz + L.a), ph(dx - L.a, L.y, dz + L.a)]; }
    for (var j = 0; j < levels.length; j++) {
      var c0 = cs(levels[j]);
      for (var f = 0; f < 4; f++) { if (j > 0 || o.baseGirt) brace.strut(c0[f], c0[(f + 1) % 4], tg); }
      if (j < levels.length - 1) {
        var c1 = cs(levels[j + 1]);
        for (f = 0; f < 4; f++) {
          legs.strut(c0[f], c1[f], tl);
          var g = (f + 1) % 4; brace.strut(c0[f], c1[g], td); brace.strut(c0[g], c1[f], td);
        }
      }
    }
    return levels;
  }
  /* horizontal truss arm in the XY plane (x outward). Two parallel planes joined at nodes */
  function arm(brace, legs, root, tip, dRoot, dTip, n, wz) {
    var up0 = ph(root.x, root.y + dRoot, 0), up1 = ph(tip.x, tip.y + dTip, 0);
    function P(s, top, z) { var b = ph(root.x + (tip.x - root.x) * s, root.y + (tip.y - root.y) * s, z), d = dRoot + (dTip - dRoot) * s; if (top) b.y += d; return b; }
    [-wz, wz].forEach(function (z) {
      legs.strut(P(0, 0, z), P(1, 0, z), .1); legs.strut(P(0, 1, z), P(1, 1, z), .1);
      for (var i = 0; i < n; i++) { var s0 = i / n, s1 = (i + 1) / n; brace.strut(P(s0, 0, z), P(s0, 1, z), .06); if (i % 2) brace.strut(P(s0, 1, z), P(s1, 0, z), .06); else brace.strut(P(s0, 0, z), P(s1, 1, z), .06); }
      brace.strut(P(1, 0, z), P(1, 1, z), .07);
    });
    for (var k = 0; k <= n; k++) { var s = k / n; brace.strut(P(s, 1, -wz), P(s, 1, wz), .06); if (k % 2 == 0) brace.strut(P(s, 0, -wz), P(s, 0, wz), .06); }
  }
  /* inclined lattice member from a to b with square section half-width a0->a1 (used for V legs, masts) */
  function mast(legs, brace, a, b, w0, w1, n) {
    var dir = new T.Vector3().subVectors(b, a), L = dir.length(), d = dir.clone().normalize();
    var side = new T.Vector3(1, 0, 0), up = new T.Vector3().crossVectors(d, side).normalize(); side.crossVectors(up, d).normalize();
    function ring(t) { var c = ph(a.x + dir.x * t, a.y + dir.y * t, a.z + dir.z * t), w = w0 + (w1 - w0) * t; return [c.clone().addScaledVector(side, -w).addScaledVector(up, -w), c.clone().addScaledVector(side, w).addScaledVector(up, -w), c.clone().addScaledVector(side, w).addScaledVector(up, w), c.clone().addScaledVector(side, -w).addScaledVector(up, w)]; }
    for (var i = 0; i <= n; i++) {
      var r0 = ring(i / n); if (i) for (var f = 0; f < 4; f++) brace.strut(r0[f], r0[(f + 1) % 4], .08);
      if (i < n) { var r1 = ring((i + 1) / n); for (f = 0; f < 4; f++) { legs.strut(r0[f], r1[f], .13); var g = (f + 1) % 4; brace.strut(r0[f], r1[g], .06); brace.strut(r0[g], r1[f], .06); } }
    }
  }
  function footings(g, pts, size) {
    var m = new V.Merge(X.pad()), s = new V.Merge(X.steel());
    pts.forEach(function (p) { m.box(p.x, .22, p.z, size, .44, size); m.geo(new T.CylinderGeometry(size * .28, size * .3, .5, 14), p.x, .62, p.z); s.rod(ph(p.x, .4, p.z), ph(p.x, 1.3, p.z), .22); s.geo(new T.BoxGeometry(.4, .06, .4), p.x, .9, p.z); });
    g.add(m.mesh()); g.add(s.mesh());
  }
  function peakMast(legs, brace, y0, y1, a0, a1, cx) {
    var L = G(); shaft(legs, brace, [{ y: y0, a: a0 }, { y: y1, a: a1 }], { cx: cx || 0, leg: .1, girt: .06, diag: .05, aspect: 1.3 });
  }
  function guy(g, from, to) { var m = new V.Merge(X.ear()); m.rod(from, to, .035); var a = new T.Mesh(new T.CylinderGeometry(.35, .35, .12, 16), X.pad()); a.position.set(to.x, .06, to.z); g.add(m.mesh()); g.add(a); var ar = new V.Merge(X.steel()); ar.rod(to, ph(to.x + (to.x - from.x) * .08, -1.2, to.z + (to.z - from.z) * .08), .06); g.add(ar.mesh()); }

  function finish(o) { /* wrap common outputs */
    return o;
  }
  /* Build a tower from a spec function that fills bodies and returns insulator attachment points */
  function tower(spec) {
    var g = G(), legs = new V.Merge(X.steel()), brace = new V.Merge(X.steel()), found = G(), insG = G(), armsG = G(), peakG = G(), sw = [], pts = [], earthPts = [];
    var armLegs = new V.Merge(X.steel()), armBrace = new V.Merge(X.steel()), pkLegs = new V.Merge(X.steel()), pkBrace = new V.Merge(X.steel());
    var ctx = { legs: legs, brace: brace, armLegs: armLegs, armBrace: armBrace, pkLegs: pkLegs, pkBrace: pkBrace, found: found, g: g, shaft: shaft, arm: arm, mast: mast, footings: footings,
      hang: function (x, y, z, n, r, mat) { var st = V.string(n, (r || .21) * 1.35, mat || X.glass(), X.steel()); st.position.set(x, y, z); insG.add(st); sw.push(st); pts.push(ph(x, y - st.userData.len, z)); },
      stub: function (x, y, z, up) { var m = new V.Merge(X.steel()); m.rod(ph(x, y, z), ph(x, y + (up || .4), z), .06); armsG.add(m.mesh()); },
      earth: function (x, y, z) { earthPts.push(ph(x, y, z)); } };
    var res = spec(ctx);
    var bodyG = G(); bodyG.add(legs.mesh()); bodyG.add(brace.mesh());
    var aG = G(); aG.add(armLegs.mesh()); aG.add(armBrace.mesh()); armsG.add(aG);
    var pG = G(); pG.add(pkLegs.mesh()); pG.add(pkBrace.mesh()); peakG.add(pG);
    [bodyG, armsG, insG, found, peakG].forEach(function (o) { g.add(o); });
    S.conductors(g, pts, res.span || 28, res.sag || 1.6, .06);
    if (earthPts.length) S.conductors(g, earthPts, res.span || 28, (res.sag || 1.6) * .7, .035);
    if (res.guys) res.guys.forEach(function (q) { guy(g, q[0], q[1]); });
    return { group: g, ground: null, sway: sw, tall: res.tall, parts: Object.assign({ body: { obj: bodyG, label: 'Lattice body', zoom: 1.15 }, arms: { obj: armsG, label: 'Cross-arms', zoom: 1.5 }, ins: { obj: insG, label: 'Insulator strings', zoom: 1.7 }, found: { obj: found, label: 'Foundations', zoom: 1.7 }, peak: { obj: peakG, label: 'Peak / earth wire', zoom: 1.8 } }, res.parts || {}) };
  }

  /* ---- 110 kV single circuit (staggered arms, narrow base) ---- */
  B.steel_110 = function () {
    return tower(function (c) {
      var H = 24.2, secs = [{ y: 0, a: 2.1 }, { y: 6, a: 1.45 }, { y: 12.5, a: .95 }, { y: 20.35, a: .62 }, { y: 24.2, a: .42 }];
      shaft(c.legs, c.brace, secs, { leg: .18, girt: .1, diag: .08, aspect: 1.0, baseGirt: true });
      footings(c.found, [{ x: -2.1, z: -2.1 }, { x: 2.1, z: -2.1 }, { x: 2.1, z: 2.1 }, { x: -2.1, z: 2.1 }], 1.1);
      var arms = [{ y: 12.5, s: 1, len: 3.35 }, { y: 15.85, s: -1, len: 3.35 }, { y: 20.35, s: 1, len: 4.5 }];
      arms.forEach(function (A) { var a0 = A.y < 14 ? .95 : A.y < 18 ? .8 : .62; arm(c.armBrace, c.armLegs, ph(A.s * a0, A.y, 0), ph(A.s * (a0 + A.len), A.y + .2, 0), 1.1, .35, 5, .32); c.hang(A.s * (a0 + A.len - .15), A.y + .1, 0, 8, .22); });
      peakMast(c.pkLegs, c.pkBrace, 20.35, 24.2, .62, .2); c.earth(0, 24.3, 0);
      return { tall: 26, span: 30, sag: 1.9, parts: {} };
    });
  };
  /* ---- 220 kV double circuit, 41.6 m ---- */
  B.steel_220 = function () {
    return tower(function (c) {
      var secs = [{ y: 0, a: 3.6 }, { y: 10, a: 2.5 }, { y: 20, a: 1.5 }, { y: 28.5, a: 1.05 }, { y: 36, a: .95 }, { y: 41.6, a: .35 }];
      shaft(c.legs, c.brace, secs, { leg: .26, girt: .13, diag: .11, aspect: 1.0, baseGirt: true });
      footings(c.found, [{ x: -3.6, z: -3.6 }, { x: 3.6, z: -3.6 }, { x: 3.6, z: 3.6 }, { x: -3.6, z: 3.6 }], 1.5);
      [{ y: 28.5, len: 4.5, a: 1.05 }, { y: 33.1, len: 5.5, a: 1.0 }, { y: 37.4, len: 4.6, a: .95 }].forEach(function (A) { [-1, 1].forEach(function (s) { arm(c.armBrace, c.armLegs, ph(s * A.a, A.y, 0), ph(s * (A.a + A.len), A.y + .25, 0), 1.5, .45, 5, .45); c.hang(s * (A.a + A.len - .2), A.y + .15, 0, 13, .3); }); });
      peakMast(c.pkLegs, c.pkBrace, 37.4, 41.6, .95, .22); c.earth(0, 41.7, 0);
      return { tall: 44, span: 40, sag: 2.6, parts: {} };
    });
  };

  /* ================= six lattice structure types ================= */
  B.lat_horizontal = function () {
    return tower(function (c) {
      var secs = [{ y: 0, a: 2.6 }, { y: 5, a: 1.6 }, { y: 10, a: .9 }]; shaft(c.legs, c.brace, secs, { leg: .18, girt: .1, diag: .08, aspect: 1.05, baseGirt: true });
      footings(c.found, [{ x: -2.6, z: -2.6 }, { x: 2.6, z: -2.6 }, { x: 2.6, z: 2.6 }, { x: -2.6, z: 2.6 }], 1.1);
      /* flared V upper legs from waist to the horizontal cross-beam */
      [-1, 1].forEach(function (s) { mast(c.armLegs, c.armBrace, ph(s * .45, 10, 0), ph(s * 5.4, 19.6, 0), .38, .3, 9); });
      arm(c.armBrace, c.armLegs, ph(-6.8, 19.5, 0), ph(6.8, 19.5, 0), 1.0, 1.0, 14, .42);
      [-1, 1].forEach(function (s) { arm(c.armBrace, c.armLegs, ph(s * 5.0, 19.5, 0), ph(s * 8.4, 19.5, 0), 1.0, .5, 3, .38); c.hang(s * 8.1, 19.45, 0, 9, .22); });
      c.hang(0, 19.45, 0, 9, .22);
      [-1, 1].forEach(function (s) { mast(c.pkLegs, c.pkBrace, ph(s * 5.9, 20.5, 0), ph(s * 5.9, 23.4, 0), .3, .1, 3); c.earth(s * 5.9, 23.5, 0); });
      return { tall: 25, span: 32, sag: 2, parts: {} };
    });
  };
  B.lat_delta = function () {
    return tower(function (c) {
      var secs = [{ y: 0, a: 2.7 }, { y: 6, a: 1.7 }, { y: 11, a: 1.1 }]; shaft(c.legs, c.brace, secs, { leg: .18, girt: .1, diag: .08, aspect: 1.05, baseGirt: true });
      footings(c.found, [{ x: -2.7, z: -2.7 }, { x: 2.7, z: -2.7 }, { x: 2.7, z: 2.7 }, { x: -2.7, z: 2.7 }], 1.1);
      /* delta head: diamond frame (outward then back in) with a closing top bar */
      [-1, 1].forEach(function (s) { mast(c.armLegs, c.armBrace, ph(s * .6, 11, 0), ph(s * 3.9, 16.2, 0), .42, .3, 6); mast(c.armLegs, c.armBrace, ph(s * 3.9, 16.2, 0), ph(s * 3.0, 21.6, 0), .3, .26, 6); });
      arm(c.armBrace, c.armLegs, ph(-3.2, 21.6, 0), ph(3.2, 21.6, 0), .9, .9, 7, .4);
      [-1, 1].forEach(function (s) { arm(c.armBrace, c.armLegs, ph(s * 3.9, 16.2, 0), ph(s * 7.4, 16.2, 0), .8, .4, 3, .36); c.hang(s * 7.1, 16.15, 0, 9, .22); });
      c.hang(0, 21.55, 0, 9, .22);
      mast(c.pkLegs, c.pkBrace, ph(0, 22.6, 0), ph(0, 25.6, 0), .3, .08, 3); c.earth(0, 25.7, 0);
      return { tall: 27, span: 32, sag: 2, parts: {} };
    });
  };
  B.lat_vertical = function () {
    return tower(function (c) {
      var secs = [{ y: 0, a: 2.9 }, { y: 10, a: 1.9 }, { y: 20, a: 1.25 }, { y: 28.5, a: .85 }, { y: 32.5, a: .5 }];
      shaft(c.legs, c.brace, secs, { leg: .2, girt: .11, diag: .09, aspect: 1.0, baseGirt: true });
      footings(c.found, [{ x: -2.9, z: -2.9 }, { x: 2.9, z: -2.9 }, { x: 2.9, z: 2.9 }, { x: -2.9, z: 2.9 }], 1.2);
      [{ y: 19.2, len: 4.4, a: 1.3 }, { y: 24.0, len: 5.1, a: 1.0 }, { y: 28.6, len: 4.2, a: .85 }].forEach(function (A) { [-1, 1].forEach(function (s) { arm(c.armBrace, c.armLegs, ph(s * A.a, A.y, 0), ph(s * (A.a + A.len), A.y + .22, 0), 1.2, .4, 4, .34); c.hang(s * (A.a + A.len - .15), A.y + .15, 0, 9, .22); }); });
      mast(c.pkLegs, c.pkBrace, ph(0, 32.5, 0), ph(0, 35.4, 0), .5, .09, 3); c.earth(0, 35.5, 0);
      return { tall: 37, span: 34, sag: 2.2, parts: {} };
    });
  };
  B.lat_single_delta = function () {
    return tower(function (c) {
      var secs = [{ y: 0, a: .62 }, { y: 18, a: .62 }]; shaft(c.legs, c.brace, secs, { leg: .12, girt: .07, diag: .06, aspect: 1.2, baseGirt: true });
      footings(c.found, [{ x: -.62, z: -.62 }, { x: .62, z: -.62 }, { x: .62, z: .62 }, { x: -.62, z: .62 }], .6);
      /* delta head */
      [-1, 1].forEach(function (s) { mast(c.armLegs, c.armBrace, ph(s * .4, 18, 0), ph(s * 2.6, 20.6, 0), .24, .22, 3); mast(c.armLegs, c.armBrace, ph(s * 2.6, 20.6, 0), ph(0, 24.0, 0), .22, .22, 4); });
      arm(c.armBrace, c.armLegs, ph(-2.6, 20.6, 0), ph(2.6, 20.6, 0), .55, .55, 5, .3);
      [-1, 1].forEach(function (s) { arm(c.armBrace, c.armLegs, ph(s * 2.6, 20.6, 0), ph(s * 5.6, 20.6, 0), .6, .3, 3, .28); c.hang(s * 5.35, 20.55, 0, 8, .21); });
      c.hang(0, 23.95, 0, 8, .21); c.earth(0, 25.4, 0);
      mast(c.pkLegs, c.pkBrace, ph(0, 24.0, 0), ph(0, 25.4, 0), .2, .06, 2);
      var guys = []; [-1, 1].forEach(function (s) { guys.push([ph(s * 2.6, 20.6, 0), ph(s * 12, 0, 0)]); guys.push([ph(s * .5, 18.2, 0), ph(s * 10, 0, s * 4)]); guys.push([ph(s * .5, 18.2, 0), ph(s * 10, 0, -s * 4)]); });
      guys.push([ph(0, 24.0, 0), ph(0, 0, 11)]); guys.push([ph(0, 24.0, 0), ph(0, 0, -11)]);
      return { tall: 26, span: 32, sag: 2, guys: guys.slice(0, 2).concat(guys.slice(2, 6).filter(function (q, i) { return i % 2 == 0; })).concat(guys.slice(6)), parts: {} };
    });
  };
  B.lat_hframe = function () {
    return tower(function (c) {
      var sp = 4.4, h = 21;
      [-1, 1].forEach(function (s) { shaft(c.legs, c.brace, [{ y: 0, a: .62 }, { y: h, a: .5 }], { cx: s * sp, leg: .13, girt: .075, diag: .06, aspect: 1.25, baseGirt: true });
        footings(c.found, [{ x: s * sp - .62, z: -.62 }, { x: s * sp + .62, z: -.62 }, { x: s * sp + .62, z: .62 }, { x: s * sp - .62, z: .62 }], .6); });
      /* X-braced panels between the columns */
      [[5.6, 10.8], [13.4, 18.6]].forEach(function (p) { var b = c.armBrace, a = sp - .5; b.strut(ph(-a, p[0], 0), ph(a, p[0], 0), .1); b.strut(ph(-a, p[1], 0), ph(a, p[1], 0), .1); b.strut(ph(-a, p[0], 0), ph(a, p[1], 0), .08); b.strut(ph(a, p[0], 0), ph(-a, p[1], 0), .08); });
      arm(c.armBrace, c.armLegs, ph(-sp - 2.2, 20.4, 0), ph(sp + 2.2, 20.4, 0), 1.1, 1.1, 14, .4);
      [-sp - 1.6, 0, sp + 1.6].forEach(function (x) { c.hang(x, 20.35, 0, 9, .22); });
      [-1, 1].forEach(function (s) { mast(c.pkLegs, c.pkBrace, ph(s * sp, 21.4, 0), ph(s * sp, 24.2, 0), .3, .08, 3); c.earth(s * sp, 24.3, 0); });
      return { tall: 26, span: 32, sag: 2, parts: {} };
    });
  };
  B.lat_vee = function () {
    return tower(function (c) {
      var top = 5.0, H = 21.5;
      [-1, 1].forEach(function (s) { mast(c.legs, c.brace, ph(s * .35, .3, 0), ph(s * top, H, 0), .42, .26, 12); });
      var pv = new V.Merge(X.dark()); pv.geo(new T.CylinderGeometry(.55, .6, .35, 20), 0, .17, 0); pv.rod(ph(-.35, .3, 0), ph(.35, .3, 0), .3); c.found.add(pv.mesh());
      var base = new V.Merge(X.pad()); base.box(0, -.4, 0, 2.2, .8, 1.6); c.found.add(base.mesh());
      arm(c.armBrace, c.armLegs, ph(-top - 2.4, H + .3, 0), ph(top + 2.4, H + .3, 0), 1.0, 1.0, 12, .38);
      [-top - 1.9, 0, top + 1.9].forEach(function (x) { c.hang(x, H + .25, 0, 9, .22); });
      [-1, 1].forEach(function (s) { mast(c.pkLegs, c.pkBrace, ph(s * top, H + 1.3, 0), ph(s * top, H + 3.9, 0), .26, .08, 2); c.earth(s * top, H + 4.0, 0); });
      var guys = []; [-1, 1].forEach(function (s) { guys.push([ph(s * top, H + .3, 0), ph(s * 13.5, 0, 6)]); guys.push([ph(s * top, H + .3, 0), ph(s * 13.5, 0, -6)]); });
      return { tall: 26, span: 32, sag: 2, guys: guys, parts: {} };
    });
  };
})();
