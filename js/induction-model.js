/* Induction motor 3D model: TEFC cast-iron motor, built from the cut-away reference.
   Axis = X. Drive end (shaft tip) at -X, non-drive end (fan / slip rings) at +X.
   Profile angle theta -> world (y, z) = (r sin t, -r cos t). Cut mode keeps the back half (z <= 0). */
(function (G) {
  'use strict';
  var TAU = Math.PI * 2, D = Math.PI / 180;

  function build(T, opt) {
    var half = !!opt.cut, slip = opt.type === 'slip';
    var root = new T.Group(), parts = {};

    function M(color, metal, rough, o) {
      return new T.MeshStandardMaterial(Object.assign({ color: color, metalness: metal, roughness: rough, side: T.DoubleSide }, o || {}));
    }
    function cutMat() { return M(0xe58a22, 0.2, 0.6, { emissive: 0x4a2600, emissiveIntensity: 0.3 }); }
    function add(key, obj, o) {
      o = o || {};
      root.add(obj);
      (parts[key] = parts[key] || []).push({ obj: obj, dx: o.dx || 0, dy: o.dy || 0, spin: !!o.spin, bx: obj.position.x, by: obj.position.y });
      obj.traverse(function (c) { c.userData.partKey = key; });
      return obj;
    }
    function P(x, r, th) { return new T.Vector3(x, r * Math.sin(th), -r * Math.cos(th)); }
    function inHalf(th) { th = Math.atan2(Math.sin(th), Math.cos(th)); return !half || Math.abs(th) < Math.PI / 2 - 1e-6; }
    function box(w, h, d, mat, x, y, z) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; }
    function cylX(r, len, mat, x, y, z, seg) { var m = new T.Mesh(new T.CylinderGeometry(r, r, len, seg || 24), mat); m.rotation.z = Math.PI / 2; m.position.set(x, y || 0, z || 0); return m; }

    // Solid of revolution about X from a closed (r, a) polygon. In cut mode: back half + orange section faces.
    function revolve(pts, mat, segs, fullAlways) {
      var g = new T.Group(), h = half && !fullAlways, v = pts.map(function (p) { return new T.Vector2(p[0], p[1]); });
      v.push(v[0].clone());
      var lathe = new T.Mesh(new T.LatheGeometry(v, segs || 64, h ? Math.PI / 2 : 0, h ? Math.PI : TAU), mat);
      lathe.rotation.z = -Math.PI / 2; g.add(lathe);
      if (h) [1, -1].forEach(function (s) {
        var sh = new T.Shape(); pts.forEach(function (p, i) { if (i) sh.lineTo(p[1], s * p[0]); else sh.moveTo(p[1], s * p[0]); });
        g.add(new T.Mesh(new T.ShapeGeometry(sh), cutMat()));
      });
      return g;
    }
    function arcRing(r, tube, x, mat, a0, aLen) { // torus arc in the YZ plane at x
      var h = new T.Group(), m = new T.Mesh(new T.TorusGeometry(r, tube, 8, 64, aLen), mat);
      m.rotation.z = a0; h.add(m); h.rotation.y = Math.PI / 2; h.position.x = x; return h;
    }
    function ring(r, tube, x, mat) { return half ? arcRing(r, tube, x, mat, -Math.PI / 2, Math.PI) : arcRing(r, tube, x, mat, 0, TAU); }

    // ---------- stator core (laminated, 36 slots) ----------
    function slotted(rOut, rBore, rSlot, n, isHalf) {
      var pts = [], i, k, t, steps = isHalf ? 36 : 72;
      var t0 = isHalf ? -Math.PI / 2 : 0, t1 = isHalf ? Math.PI / 2 : TAU;
      function pt(r, th) { return new T.Vector2(r * Math.cos(th), r * Math.sin(th)); }
      for (i = 0; i <= steps; i++) { t = t0 + (t1 - t0) * i / steps; pts.push(pt(rOut, t)); }
      // inner contour travelling back along the bore, with a slot every 10 degrees (offset 5)
      var inner = [], pitch = TAU / n;
      for (k = n - 1; k >= 0; k--) {
        var c = 5 * D + k * pitch; if (isHalf && !inHalf(c)) continue;
        if (c > Math.PI) c -= TAU;
        inner.push({ c: c });
      }
      inner.sort(function (a, b) { return b.c - a.c; });
      var cur = isHalf ? Math.PI / 2 : TAU;
      var seq = [];
      inner.forEach(function (s) {
        var a = s.c + 2.3 * D, b = s.c - 2.3 * D, a2 = s.c + 2.9 * D, b2 = s.c - 2.9 * D;
        if (!isHalf && s === inner[0] && false) { /* no-op */ }
        seq.push(pt(rBore, Math.min(cur, TAU) ), pt(rBore, a), pt(rSlot, a2), pt(rSlot, b2), pt(rBore, b)); cur = b;
      });
      seq.push(pt(rBore, isHalf ? -Math.PI / 2 : 0));
      // for the full ring, build outer + hole instead of a single polygon
      var shape = new T.Shape();
      if (isHalf) { pts.forEach(function (p, i2) { if (i2) shape.lineTo(p.x, p.y); else shape.moveTo(p.x, p.y); }); seq.forEach(function (p) { shape.lineTo(p.x, p.y); }); }
      else {
        shape.absarc(0, 0, rOut, 0, TAU, false);
        var hole = new T.Path(), first = true, list = [];
        for (k = 0; k < n; k++) {
          var cc = 5 * D + k * pitch;
          list.push(pt(rBore, cc - pitch / 2 + 2.3 * D + 0.0001));
          list.push(pt(rBore, cc - 2.3 * D)); list.push(pt(rSlot, cc - 2.9 * D)); list.push(pt(rSlot, cc + 2.9 * D)); list.push(pt(rBore, cc + 2.3 * D));
          list.push(pt(rBore, cc + pitch / 2 - 2.3 * D - 0.0001));
        }
        list.forEach(function (p) { if (first) { hole.moveTo(p.x, p.y); first = false; } else hole.lineTo(p.x, p.y); });
        shape.holes.push(hole);
      }
      return shape;
    }

    var statorCore = new T.Group();
    (function () {
      var N = 34, len = 1.7, pitch = len / N, t = pitch * 0.92;
      var geo = new T.ExtrudeGeometry(slotted(1.29, 0.80, 1.02, 36, half), { depth: t, bevelEnabled: false });
      geo.rotateY(Math.PI / 2); geo.translate(-t / 2, 0, 0);
      var im = new T.InstancedMesh(geo, M(0xffffff, 0.75, 0.45), N), mtx = new T.Matrix4(), c1 = new T.Color(0x7d8aa0), c2 = new T.Color(0x667389);
      for (var i = 0; i < N; i++) { mtx.makeTranslation(-len / 2 + pitch * (i + 0.5), 0, 0); im.setMatrixAt(i, mtx); im.setColorAt(i, i % 2 ? c1 : c2); }
      statorCore.add(im);
      var pg = new T.ExtrudeGeometry(slotted(1.29, 0.82, 1.0, 36, half), { depth: 0.05, bevelEnabled: false });
      pg.rotateY(Math.PI / 2);
      [-1, 1].forEach(function (s) { var m = new T.Mesh(pg, M(0x4b5563, 0.8, 0.4)); m.position.x = s > 0 ? 0.86 : -0.91; statorCore.add(m); });
    })();
    add('stator_core', statorCore);

    // ---------- stator winding: slot conductors + overhang coils (3 phases) ----------
    var phaseCol = [0xd9432b, 0xe2a82b, 0x3b82f6], winding = new T.Group(), pm = phaseCol.map(function (c) { return M(c, 0.6, 0.35); });
    (function () {
      var n = 36, pitch = TAU / n, k;
      var cg = new T.BoxGeometry(1.86, 0.17, 0.065);
      for (k = 0; k < n; k++) {
        var th = 5 * D + k * pitch; if (!inHalf(th)) continue;
        var m = new T.Mesh(cg, pm[k % 3]), p = P(0, 0.915, th); m.position.copy(p); m.rotation.x = th - Math.PI / 2; winding.add(m);
      }
      for (var e = -1; e <= 1; e += 2) for (k = 0; k < 36; k += 2) {
        var t0 = 5 * D + k * pitch, t1 = t0 + 5 * pitch;
        if (!inHalf(t0) || !inHalf(t1)) continue;
        var dl = t1 - t0, tm = (t0 + t1) / 2;
        var curve = new T.CatmullRomCurve3([P(e * 0.88, 0.95, t0), P(e * 1.06, 1.02, t0 + 0.22 * dl), P(e * 1.2, 1.1, tm), P(e * 1.06, 1.02, t1 - 0.22 * dl), P(e * 0.88, 0.95, t1)]);
        winding.add(new T.Mesh(new T.TubeGeometry(curve, 18, 0.055, 6, false), pm[(k / 2) % 3]));
      }
    })();
    add('stator_winding', winding);

    // ---------- frame (cast iron): shell, fins, feet ----------
    var frame = new T.Group(), ironMat = M(0x5d6b82, 0.7, 0.5);
    frame.add(revolve([[1.3, -1.3], [1.55, -1.3], [1.55, -1.18], [1.5, -1.18], [1.5, 1.18], [1.55, 1.18], [1.55, 1.3], [1.3, 1.3]], ironMat, 72));
    (function () {
      var fg = new T.BoxGeometry(2.3, 0.17, 0.05), nF = 32, k;
      for (k = 0; k < nF; k++) {
        var th = (k + 0.5) * TAU / nF; if (!inHalf(th)) continue;
        var m = new T.Mesh(fg, ironMat), p = P(0, 1.585, th); m.position.copy(p); m.rotation.x = th - Math.PI / 2; frame.add(m);
      }
      // mounting feet (extruded profile in z-y, one pair of feet per side)
      [-1, 1].forEach(function (sz) {
        if (half && sz > 0) return;
        var sh = new T.Shape(); sh.moveTo(0, -1.45); sh.lineTo(0.55 * sz, -1.5); sh.lineTo(1.0 * sz, -1.6); sh.lineTo(1.65 * sz, -1.6); sh.lineTo(1.65 * sz, -1.84); sh.lineTo(0, -1.84);
        [-0.85, 0.85].forEach(function (fx) {
          var g = new T.ExtrudeGeometry(sh, { depth: 0.9, bevelEnabled: false }); g.rotateY(-Math.PI / 2); g.translate(fx + 0.45, 0, half ? -0.004 : 0);
          var m = new T.Mesh(g, ironMat); frame.add(m);
          var bolt = cylX(0.1, 0.12, M(0x94a3b8, 0.9, 0.3, {}), fx, -1.54, 1.38 * sz, 6); bolt.rotation.z = 0; bolt.position.y = -1.545; frame.add(bolt);
        });
      });
    })();
    add('frame', frame);

    // ---------- terminal box ----------
    var tb = new T.Group(), tbMat = M(0x6b778c, 0.6, 0.5), cx = -0.4, by = 1.64;
    tb.add(box(1.0, 0.05, 0.95, tbMat, cx, by, 0));
    tb.add(box(1.0, 0.5, 0.05, tbMat, cx, by + 0.27, -0.45));
    if (!half) tb.add(box(1.0, 0.5, 0.05, tbMat, cx, by + 0.27, 0.45));
    tb.add(box(0.05, 0.5, half ? 0.47 : 0.95, tbMat, cx - 0.475, by + 0.27, half ? -0.24 : 0));
    tb.add(box(0.05, 0.5, half ? 0.47 : 0.95, tbMat, cx + 0.475, by + 0.27, half ? -0.24 : 0));
    tb.add(box(1.08, 0.06, half ? 0.5 : 1.04, tbMat, cx, by + 0.55, half ? -0.27 : 0));
    var brass = M(0xd4a017, 0.85, 0.25), blk = M(0x1f2937, 0.3, 0.6);
    tb.add(box(0.72, 0.07, 0.34, blk, cx, by + 0.07, 0));
    [-1, 1].forEach(function (rz) {
      if (half && rz > 0) return;
      [-0.25, 0, 0.25].forEach(function (sx) { tb.add(cylX(0.035, 0.16, brass, cx + sx, by + 0.17, rz * 0.1, 10)); tb.children[tb.children.length - 1].rotation.z = 0; });
    });
    [-0.25, 0, 0.25].forEach(function (sx) { tb.add(box(0.05, 0.02, 0.24, brass, cx + sx, by + 0.26, -0.0)); });
    var gland = cylX(0.12, 0.28, M(0x374151, 0.6, 0.4), cx - 0.62, by + 0.3, -0.18, 18); tb.add(gland);
    [[-0.5, -0.45], [0.5, -0.45]].forEach(function (c) { var s = cylX(0.025, 0.04, brass, cx + c[0], by + 0.6, c[1] * 0.9, 8); s.rotation.z = 0; tb.add(s); });
    add('terminal_box', tb, { dy: 1.3 });

    // ---------- end shields (end covers) + bolts ----------
    function shieldPoly(sg) {
      return [[0.42, -1.68], [0.68, -1.68], [0.68, -1.46], [1.2, -1.46], [1.55, -1.46], [1.55, -1.3], [1.2, -1.3], [1.2, -1.38], [0.68, -1.38], [0.68, -1.12], [0.42, -1.12]]
        .map(function (p) { return [p[0], p[1] * sg]; });
    }
    [-1, 1].forEach(function (sg) {
      var g = revolve(shieldPoly(sg), ironMat, 72), k;
      for (k = 0; k < 8; k++) {
        var th = (k + 0.5) * TAU / 8; if (!inHalf(th)) continue;
        var b = cylX(0.055, 0.07, M(0xb6c0cf, 0.9, 0.3), sg * 1.5, 0, 0, 6), p = P(sg * 1.5, 1.38, th); b.position.copy(p); g.add(b);
      }
      add('end_cover', g, { dx: sg * 1.0 });
    });

    // ---------- bearings (deep-groove ball bearing, whole) ----------
    [-1, 1].forEach(function (sg) {
      var g = new T.Group(), a = sg * 1.52, hw = 0.12, steel = M(0xc3ccd9, 0.95, 0.2), k;
      g.add(revolve([[0.36, a - hw], [0.42, a - hw], [0.42, a + hw], [0.36, a + hw]], steel, 48, true));
      g.add(revolve([[0.26, a - hw], [0.31, a - hw], [0.31, a + hw], [0.26, a + hw]], steel, 48, true));
      var bg = new T.SphereGeometry(0.036, 12, 10), bm = M(0xe5e7eb, 1, 0.1);
      for (k = 0; k < 10; k++) { var b = new T.Mesh(bg, bm), p = P(a, 0.335, k * TAU / 10); b.position.copy(p); g.add(b); }
      add('bearings', g, { dx: sg * 1.6 });
    });

    // ---------- shaft (rotating) with key and white timing mark ----------
    var shaft = new T.Group(), sEnd = slip ? 2.8 : 2.0;
    shaft.add(revolve([[0, -2.95], [0.2, -2.95], [0.2, -2.35], [0.26, -2.35], [0.26, -0.9], [0.34, -0.9], [0.34, 0.9], [0.26, 0.9], [0.26, sEnd], [0, sEnd]], M(0xaab4c3, 0.95, 0.18), 40, true));
    shaft.add(box(0.5, 0.05, 0.07, M(0x9a7b2f, 0.8, 0.3), -2.62, 0.215, 0));
    shaft.add(box(0.14, 0.012, 0.07, M(0xffffff, 0.1, 0.5), -1.95, 0.262, 0));
    add('shaft', shaft, { spin: true });

    // ---------- rotor ----------
    var rotor = new T.Group();
    (function () {
      var N = 34, len = 1.7, pitch = len / N, t = pitch * 0.92, k;
      var geo = new T.CylinderGeometry(0.75, 0.75, t, 56); geo.rotateZ(Math.PI / 2);
      var im = new T.InstancedMesh(geo, M(0xffffff, 0.75, 0.4), N), mtx = new T.Matrix4(), c1 = new T.Color(0x8b97ab), c2 = new T.Color(0x727f94);
      for (var i = 0; i < N; i++) { mtx.makeTranslation(-len / 2 + pitch * (i + 0.5), 0, 0); im.setMatrixAt(i, mtx); im.setColorAt(i, i % 2 ? c1 : c2); }
      rotor.add(im);
      if (!slip) {
        var al = M(0xd5dbe5, 0.9, 0.22), nB = 28, skew = TAU / nB;
        for (k = 0; k < nB; k++) {
          var th = k * TAU / nB, pts = [];
          for (var j = 0; j <= 6; j++) { var f = j / 6, x = -0.9 + 1.8 * f; pts.push(P(x, 0.735, th + skew * (f - 0.5))); }
          rotor.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, 0.03, 5, false), al));
        }
        [-1, 1].forEach(function (s) {
          rotor.add(revolve([[0.5, s * 0.88], [0.76, s * 0.88], [0.76, s * 1.0], [0.5, s * 1.0]], al, 48, true));
          for (k = 0; k < 14; k++) { var bl = box(0.07, 0.24, 0.03, al, s * 1.04, 0, 0), p = P(s * 1.04, 0.62, k * TAU / 14); bl.position.copy(p); bl.rotation.x = k * TAU / 14 - Math.PI / 2; rotor.add(bl); }
        });
      } else {
        // wound rotor: slot wedges on the surface + 3-phase overhang
        var wm = M(0x1f2937, 0.4, 0.6);
        for (k = 0; k < 36; k++) { var w = box(1.7, 0.012, 0.045, wm, 0, 0, 0), th2 = k * TAU / 36, pp = P(0, 0.752, th2); w.position.copy(pp); w.rotation.x = th2 - Math.PI / 2; rotor.add(w); }
        var pmr = phaseCol.map(function (c) { return M(c, 0.6, 0.35); });
        [-1, 1].forEach(function (s) {
          for (k = 0; k < 36; k += 2) {
            var a0 = k * TAU / 36, a1 = a0 + 5 * TAU / 36, am = (a0 + a1) / 2, dl = a1 - a0;
            var cv = new T.CatmullRomCurve3([P(s * 0.86, 0.7, a0), P(s * 0.98, 0.72, a0 + 0.22 * dl), P(s * 1.1, 0.72, am), P(s * 0.98, 0.72, a1 - 0.22 * dl), P(s * 0.86, 0.7, a1)]);
            rotor.add(new T.Mesh(new T.TubeGeometry(cv, 16, 0.042, 6, false), pmr[(k / 2) % 3]));
          }
        });
      }
    })();
    add(slip ? 'rotor_wound' : 'rotor_cage', rotor, { spin: true });

    // ---------- cooling fan + cowl (cage motor) ----------
    if (!slip) {
      var fan = new T.Group(), fm = M(0x6d5ccf, 0.2, 0.35, { emissive: 0x20164a, emissiveIntensity: 0.3 }), k2;
      fan.add(cylX(0.3, 0.2, M(0x4c3fb0, 0.4, 0.4), 1.82, 0, 0, 24));
      fan.add(revolve([[0.3, 1.78], [0.98, 1.78], [0.98, 1.82], [0.3, 1.82]], fm, 48, true));
      for (k2 = 0; k2 < 12; k2++) {
        var th3 = k2 * TAU / 12, bl2 = box(0.2, 0.52, 0.035, fm, 1.92, 0, 0), pp2 = P(1.92, 0.66, th3);
        bl2.position.copy(pp2); bl2.rotation.x = th3 - Math.PI / 2; bl2.rotation.y = 0.35; fan.add(bl2);
      }
      add('fan', fan, { dx: 1.7, spin: true });
      var cowl = new T.Group(), cm = M(0x7d8aa0, 0.6, 0.4);
      cowl.add(revolve([[1.5, 1.46], [1.5, 1.9], [0.95, 2.18], [0.91, 2.14], [1.455, 1.86], [1.455, 1.46]], cm, 72));
      var gm = M(0x9aa5b8, 0.7, 0.35), kk;
      [0.3, 0.55, 0.8].forEach(function (r) { cowl.add(ring(r, 0.014, 2.17, gm)); });
      for (kk = 0; kk < 16; kk++) { var ts = kk * TAU / 16; if (!inHalf(ts)) continue; var sp = box(0.012, 0.66, 0.025, gm, 2.17, 0, 0), q = P(2.17, 0.6, ts); sp.position.copy(q); sp.rotation.x = ts - Math.PI / 2; cowl.add(sp); }
      add('fan', cowl, { dx: 3.2 });
    } else {
      // ---------- slip rings (rotating) and brush gear (static) ----------
      var rings = new T.Group(), bz = M(0xd9a441, 0.9, 0.22), ins = M(0x2b2f3a, 0.2, 0.7), ci = [1.9, 2.28, 2.66];
      rings.add(cylX(0.36, 1.12, ins, 2.28, 0, 0, 36));
      ci.forEach(function (c) { rings.add(revolve([[0.34, c - 0.1], [0.45, c - 0.1], [0.45, c + 0.1], [0.34, c + 0.1]], bz, 40, true)); });
      add('slip_rings', rings, { dx: 1.5, spin: true });
      var gear = new T.Group(), carbon = M(0x15171c, 0.1, 0.8), spr = M(0xcbd5e1, 0.9, 0.3), hold = M(0x8a6f2c, 0.7, 0.4), guard = M(0x7d8aa0, 0.6, 0.4), k3;
      ci.forEach(function (c) {
        [-50, 50].forEach(function (deg) {
          var th4 = deg * D, br = box(0.13, 0.17, 0.09, carbon, c, 0, 0), pb = P(c, 0.535, th4);
          br.position.copy(pb); br.rotation.x = th4 - Math.PI / 2; gear.add(br);
          var hd = box(0.17, 0.26, 0.13, hold, c, 0, 0), ph = P(c, 0.75, th4); hd.position.copy(ph); hd.rotation.x = th4 - Math.PI / 2; gear.add(hd);
          var arm = box(0.05, 0.3, 0.05, hold, c, 0, 0), pa = P(c, 0.93, th4); arm.position.copy(pa); arm.rotation.x = th4 - Math.PI / 2; gear.add(arm);
          var hp = []; for (var u = 0; u <= 30; u++) { var ang = u / 30 * 5 * TAU; hp.push(P(c, 0.84 + 0.1 * (u / 30), th4).add(new T.Vector3(0.035 * Math.cos(ang), 0, 0.035 * Math.sin(ang) * 0))); }
          // spring (helix around the radial axis)
          var rad = new T.Vector3(0, Math.sin(th4), -Math.cos(th4)), side = new T.Vector3(1, 0, 0), up = new T.Vector3().crossVectors(rad, side).normalize(), sp2 = [];
          for (var q2 = 0; q2 <= 36; q2++) { var f2 = q2 / 36, an = f2 * 6 * TAU, base = rad.clone().multiplyScalar(0.62 + 0.18 * f2); sp2.push(base.add(side.clone().multiplyScalar(0.045 * Math.cos(an))).add(up.clone().multiplyScalar(0.045 * Math.sin(an))).add(new T.Vector3(c, 0, 0))); }
          gear.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(sp2), 36, 0.009, 4, false), spr));
        });
      });
      for (k3 = 0; k3 < 12; k3++) {
        var tg = k3 * TAU / 12; if (!inHalf(tg)) continue;
        var bar = box(1.44, 0.05, 0.05, guard, 2.18, 0, 0), pg = P(2.18, 1.07, tg); bar.position.copy(pg); bar.rotation.x = tg - Math.PI / 2; gear.add(bar);
      }
      gear.add(ring(1.07, 0.03, 2.9, guard)); gear.add(ring(1.07, 0.03, 2.2, guard)); gear.add(ring(1.07, 0.03, 1.5, guard));
      add('brush_gear', gear, { dx: 3.2 });
    }

    // ---------- rotating magnetic field overlay (4-pole, shader) ----------
    var rmf = new T.Mesh(new T.CylinderGeometry(0.785, 0.785, 1.7, 96, 1, true), new T.ShaderMaterial({
      transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec2 vUv; void main(){ float s = cos(2.0 * 6.2831853 * vUv.x); float a = pow(abs(s), 1.6) * 0.3; vec3 c = s > 0.0 ? vec3(1.0,0.25,0.2) : vec3(0.2,0.45,1.0); float edge = smoothstep(0.0,0.08,vUv.y) * smoothstep(1.0,0.92,vUv.y); gl_FragColor = vec4(c, a * edge); }'
    }));
    rmf.rotation.z = Math.PI / 2; rmf.raycast = function () {};
    var rmfHolder = new T.Group(); rmfHolder.add(rmf); root.add(rmfHolder);

    return { root: root, parts: parts, rmf: rmfHolder, slip: slip, half: half };
  }

  function applyExplode(res, e) {
    Object.keys(res.parts).forEach(function (k) { res.parts[k].forEach(function (p) { p.obj.position.x = p.bx + p.dx * e; p.obj.position.y = p.by + p.dy * e; }); });
  }
  function setHighlight(res, key) {
    Object.keys(res.parts).forEach(function (k) {
      res.parts[k].forEach(function (p) {
        p.obj.traverse(function (c) {
          if (!c.isMesh || !c.material || !c.material.emissive) return;
          var m = c.material; if (!m.userData.e0) m.userData.e0 = { c: m.emissive.getHex(), i: m.emissiveIntensity };
          if (k === key) { m.emissive.setHex(0x0ea5e9); m.emissiveIntensity = 0.55; } else { m.emissive.setHex(m.userData.e0.c); m.emissiveIntensity = m.userData.e0.i; }
        });
      });
    });
  }
  function dispose(res) {
    res.root.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { m.dispose(); }); });
  }
  G.IM = { build: build, applyExplode: applyExplode, setHighlight: setHighlight, dispose: dispose };
})(typeof window !== 'undefined' ? window : globalThis);
