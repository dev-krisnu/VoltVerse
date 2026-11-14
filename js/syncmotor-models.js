/* Synchronous motor models. 1 unit = 10 mm. Motor axis is z. update(e, time, mode). */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI, seg = K.seg, lerp = K.lerp;
  var PH = [0xef4444, 0xfacc15, 0x3b82f6];

  /* rotor with two or four salient poles */
  function rotor(poles, withDamper, withRings) {
    var r = G(), cu = M(0xc87b3e, .95, .25, { emissive: 0xff6a00, emissiveIntensity: 0 }), dm = M(0xd9a05b, .9, .3, { emissive: 0xff8a00, emissiveIntensity: 0 });
    cyl(1.2, 3.2, k.iron, 0, 0, 0, r, 32).rotation.x = PI / 2; var shaft = cyl(.38, 9, k.steel, 0, 0, .6, r, 20); shaft.rotation.x = PI / 2; var pl = G(), caps = [], coils = G(), dampers = [], fc = null;
    for (var i = 0; i < poles; i++) {
      var a = i * 2 * PI / poles, p = G(); p.rotation.z = a; box(.9, 1.3, 3.0, k.iron, 0, 1.55, 0, p);
      var shoe = new T.Mesh(new T.CylinderGeometry(2.25, 2.25, 3.0, 20, 1, false, PI - .38, .76), k.iron); shoe.rotation.x = PI / 2; p.add(shoe);
      var cap = box(.3, .1, 3.0, i % 2 ? M(0x3b82f6, .1, .5) : M(0xef4444, .1, .5), 0, 2.3, 0); p.add(cap); caps.push(cap);
      var cg = G(); [-1, 1].forEach(function (s2) { box(.38, 1.1, 3.1, cu, s2 * .66, 1.55, 0, cg); }); p.add(cg); if (i === 0) fc = cg;
      pl.add(p);
      if (withDamper) for (var j = -2; j <= 2; j++) { var d = cyl(.1, 3.5, dm, 0, 0, 0, null, 8); d.rotation.x = PI / 2; var ang = j * .13; d.position.set(Math.sin(ang) * 2.2, Math.cos(ang) * 2.2, 0); p.add(d); dampers.push(d); }
    }
    r.add(pl); var rings = G();
    if (withDamper) { [-1.8, 1.8].forEach(function (z) { var er = K.tor(2.1, .1, dm, 0, 0, z, rings, 0); }); r.add(rings); }
    var sr = G(); if (withRings) { [1.0, 1.9].forEach(function (z, i) { var ring = cyl(.62, .5, k.brass, 0, 0, 4.6 + z * .9, sr, 28); ring.rotation.x = PI / 2; }); r.add(sr); }
    r.userData = { fcoil: fc, cu: cu, dm: dm, caps: caps, shaft: shaft, damp: dampers, rings: rings, sr: sr, poles: pl }; return r;
  }
  function stator(open) {
    var s = G(), ringM = K.ghost(0x4b5563, .35, { side: T.DoubleSide }); var ring = K.lathe([[2.55, -1.5], [3.6, -1.5], [3.6, 1.5], [2.55, 1.5], [2.55, -1.5]], ringM, 48); ring.rotation.x = PI / 2; s.add(ring);
    var coils = [], mats = [], cg2 = G(); s.add(cg2); for (var i = 0; i < 6; i++) { var a = i * PI / 3, m = M(PH[i % 3], .2, .5, { emissive: PH[i % 3], emissiveIntensity: 0 }); mats.push(m); var c = box(.7, .9, 3.6, m, 0, 0, 0, cg2); c.position.set(Math.cos(a) * 2.95, Math.sin(a) * 2.95, 0); c.rotation.z = a; coils.push(c); }
    var frame = G(); var fb = cyl(3.9, 4.4, K.ghost(0x2b3340, .16, { side: T.DoubleSide }), 0, 0, 0, frame, 40); fb.rotation.x = PI / 2; var foot = box(8, .5, 5, k.dark, 0, -4.1, 0, frame); s.add(frame);
    s.userData = { coils: coils, mats: mats, ring: ring, frame: frame, cg: cg2 }; return s;
  }
  function fieldArrow() { var f = G(); var nb = box(2.2, .22, .22, M(0xef4444, 0, .4, { emissive: 0xef4444, emissiveIntensity: .8 }), 1.1, 0, 0, f), sb = box(2.2, .22, .22, M(0x3b82f6, 0, .4, { emissive: 0x3b82f6, emissiveIntensity: .8 }), -1.1, 0, 0, f); var tip = new T.Mesh(new T.ConeGeometry(.28, .6, 12), M(0xef4444, 0, .4, { emissive: 0xef4444, emissiveIntensity: .8 })); tip.rotation.z = -PI / 2; tip.position.set(2.4, 0, 0); f.add(tip); f.position.z = 1.9; return f; }
  function energise(s, th, k2) { for (var i = 0; i < 6; i++) { var c = Math.cos(th - i * PI / 3); s.userData.mats[i].emissiveIntensity = k2 * (c * c) * 1.6; } }

  function machine(o) {
    var root = G(), st = stator(), ro = rotor(o.poles || 2, o.damper, o.rings), fa = fieldArrow(); root.add(st, ro, fa); ro.userData.shaft.visible = true;
    var phase = { f: 0, r: 0, last: null };
    root.userData = { st: st, ro: ro, fa: fa, phase: phase };
    root.position.y = 4.4;
    return root;
  }
  function dtOf(ph, time) { var dt = ph.last == null ? 0 : Math.min(.1, Math.max(0, time - ph.last)); ph.last = time; return dt; }
  function wrap(a) { while (a > PI) a -= 2 * PI; while (a < -PI) a += 2 * PI; return a; }

  /* ---------- rotor locking onto the rotating field ---------- */
  B.lock = function () {
    var root = machine({ poles: 2, damper: false, rings: false }), u = root.userData, st = u.st, ro = u.ro, fa = u.fa, ph = u.phase, delta = 0, slipTot = 0;
    return { group: root, tick: true, parts: { stator: PART(st.userData.ring, 'Stator core', 9), coils: PART(st.userData.cg, 'Three-phase stator winding', 9), field: PART(fa, 'Rotating magnetic field', 8), rotor: PART(ro.userData.poles, 'Salient-pole rotor (DC excited)', 8), shaft: PART(ro.userData.shaft, 'Shaft', 8) },
      update: function (e, time, mode) {
        var dt = dtOf(ph, time), w = 2.6 * seg(e, 0, .12); ph.f += w * dt; var dl;
        if (mode === 'sync') dl = .09 * seg(e, .12, .3); else if (mode === 'load') dl = (.09 + .6 * seg(e, .15, .6)); else dl = (.09 + 1.45 * seg(e, .15, .72)) ;
        var pulled = mode === 'pull' && e > .72, slip = 0; if (pulled) { slipTot += dt * w * (.4 + .55 * seg(e, .72, .95)); slip = slipTot; } else slipTot = 0;
        ph.r = ph.f - (pulled ? PI / 2 * 1.0 : dl) - (pulled ? slip : 0) + (pulled ? .0 : 0); if (e < .12) { ph.r = ph.f; }
        fa.rotation.z = ph.f; ro.rotation.z = ph.r; energise(st, ph.f, seg(e, 0, .1)); u.ro.userData.cu.emissiveIntensity = seg(e, .08, .2) * (pulled ? .2 + .3 * Math.sin(time * 14) : .5);
        var sh = pulled ? .05 * Math.sin(time * 30) * (1 - seg(e, .95, 1)) : 0; root.position.x = sh; } };
  };

  /* ---------- cutaway: slip rings, damper bars, field coils ---------- */
  B.cut = function () {
    var root = G(), st = stator(), ro = rotor(4, true, true); root.add(ro);
    var half = new T.Mesh(new T.CylinderGeometry(3.7, 3.7, 3.6, 48, 1, true, 0, PI), K.ghost(0x4b5563, .42, { side: T.DoubleSide })); half.rotation.x = PI / 2; half.rotation.z = 0; var cover = G(); cover.add(half); root.add(cover);
    var inner = new T.Mesh(new T.CylinderGeometry(2.45, 2.45, 3.6, 48, 1, true, PI, PI), K.ghost(0x6b7280, .55, { side: T.DoubleSide })); inner.rotation.x = PI / 2; root.add(inner);
    for (var i = 0; i < 12; i++) { var a = i * PI / 6, c = box(.45, .6, 3.5, M(PH[i % 3], .2, .5), Math.cos(a) * 2.75, Math.sin(a) * 2.75, 0, root); c.rotation.z = a; }
    var brush = G(); [0, 1].forEach(function (i) { var bz = 4.6 + (i ? 1.9 : 1.0) * .9; box(.5, 1.1, .5, M(0x1f1f23, .1, .8), 0, 1.15, bz, brush); box(.35, .9, .35, k.brass, 0, 1.95, bz, brush); box(.18, .18, 1.4, k.red, 0, 2.4, bz, brush); }); root.add(brush);
    var lead = K.tube([[0, 2.4, 5.4], [0, 3.3, 6.2], [1.2, 3.6, 7.2]], .09, k.red, root); var dc = G(); box(1.8, 1.1, 1.0, k.green, 1.8, 3.6, 7.4, dc); K.txt('DC', .9, .5, null, 1.8, 3.6, 7.92, dc, '#fff', 54); root.add(dc);
    var bearing = cyl(.8, 1.0, k.dark, 0, 0, 3.4, root, 20); bearing.rotation.x = PI / 2; var foot = box(8, .5, 5, k.dark, 0, -4.1, 0, root);
    root.rotation.y = -.95; root.position.y = 4.4; var ph = { r: 0, last: null };
    return { group: root, tick: true, parts: { cover: PART(half, 'Stator frame (cut open)', 10), stator: PART(inner, 'Laminated stator core', 9), rotor: PART(ro.userData.poles, 'Salient-pole rotor', 8), fcoil: PART(ro.userData.fcoil, 'Field winding (DC)', 8), damper: PART(ro.userData.damp[0], 'Damper bars in the pole faces', 9), rings: PART(ro.userData.rings, 'Damper end rings', 9), slip: PART(ro.userData.sr, 'Slip rings', 7), brush: PART(brush, 'Carbon brushes', 7), dc: PART(dc, 'DC exciter supply', 7) },
      update: function (e, time) { var dt = dtOf(ph, time); ph.r += dt * (.5 + 1.4 * e); ro.rotation.z = ph.r; half.material.opacity = .42 * (1 - e); cover.visible = e < .98; inner.material.opacity = .55 * (1 - e * .7); ro.position.z = e * 0; ro.userData.cu.emissiveIntensity = .25 + .3 * e; ro.userData.dm.emissiveIntensity = e * (.25 + .15 * Math.sin(time * 5)); } };
  };

  /* ---------- why it is not self-starting ---------- */
  B.start = function () {
    var root = machine({ poles: 2, damper: true, rings: true }), u = root.userData, st = u.st, ro = u.ro, fa = u.fa, ph = u.phase, wr = 0;
    var arrowP = G(); var ap = new T.Mesh(new T.ConeGeometry(.35, 1.2, 14), M(0xfacc15, 0, .4, { emissive: 0xfacc15, emissiveIntensity: .9 })); ap.position.set(0, 3.55, 1.9); arrowP.add(ap); root.add(arrowP);
    return { group: root, tick: true, parts: { field: PART(fa, 'Rotating stator field (3000 rpm at 2 poles, 50 Hz)', 8), rotor: PART(ro.userData.poles, 'Rotor (stationary at start)', 8), damper: PART(ro.userData.damp[0], 'Damper bars: they give the starting torque', 9), stator: PART(st.userData.ring, 'Stator', 9), arrow: PART(arrowP, 'Torque direction on the rotor', 8) },
      update: function (e, time, mode) {
        var dt = dtOf(ph, time), w = 2.6 * seg(e, 0, .1); ph.f += w * dt; var lockK = 0, slip;
        if (mode === 'no') { ph.r = .25 * Math.sin(ph.f * 1.0) * seg(e, .05, .15); arrowP.visible = true; arrowP.rotation.z = (Math.sin(ph.f) > 0 ? 0 : PI); ap.material.emissiveIntensity = .9; slip = 1; ro.userData.dm.emissiveIntensity = 0; }
        else { var sp = seg(e, .1, .75); wr = w * (1 - Math.pow(1 - sp, 2.2)) * .97; if (e > .8) { wr = w; } slip = Math.max(0, 1 - wr / Math.max(w, .001)); if (e <= .8) ph.r += wr * dt; else ph.r = ph.f - .06; ro.userData.dm.emissiveIntensity = e < .8 ? slip * 1.2 : 0; arrowP.visible = false; lockK = seg(e, .8, .9); }
        fa.rotation.z = ph.f; ro.rotation.z = ph.r; energise(st, ph.f, seg(e, 0, .1)); ro.userData.cu.emissiveIntensity = lockK * .6; } };
  };

  /* ---------- power factor and the V-curve ---------- */
  B.pf = function () {
    var root = machine({ poles: 2, damper: true, rings: true }), u = root.userData, st = u.st, ro = u.ro, fa = u.fa, ph = u.phase;
    var gauge = G(); var gd = cyl(1.6, .3, k.dark, 0, 0, 0, gauge, 40); gd.rotation.x = PI / 2; var face = cyl(1.5, .05, k.white, 0, 0, .18, gauge, 40); face.rotation.x = PI / 2; var needle = G(); box(.08, 1.3, .06, M(0xdc2626, 0, .4), 0, .65, 0, needle); needle.position.z = .26; gauge.add(needle); for (var i = 0; i < 9; i++) { var a = -PI * .75 + i * PI * 1.5 / 8, tk = box(.05, .22, .04, M(0x111827, 0, .5), Math.sin(a) * 1.25, Math.cos(a) * 1.25, .22); tk.rotation.z = -a; gauge.add(tk); } K.txt('Ia', .8, .45, null, 0, -.7, .24, gauge, '#111827', 60); gauge.position.set(5.6, 1.6, 0); root.add(gauge);
    var rh = G(); box(2, .5, 1.4, k.dark, 0, 0, 0, rh); var knob = cyl(.5, .3, k.orange, 0, .4, 0, rh, 24); box(.08, .1, .45, k.white, 0, .56, .22, knob); rh.position.set(5.6, -2.4, 0); root.add(rh); K.txt('FIELD', 1.6, .4, null, 5.6, -1.7, 0, root, '#fbbf24', 40);
    
    return { group: root, tick: true, parts: { field: PART(fa, 'Rotating field', 9), rotor: PART(ro.userData.poles, 'Rotor and DC field winding', 9), gauge: PART(gauge, 'Armature current meter', 5), rheo: PART(rh, 'Field rheostat (sets excitation)', 5), st: PART(st.userData.ring, 'Stator', 9) },
      update: function (v, time) { var dt = dtOf(ph, time); ph.f += 2.2 * dt; ph.r = ph.f - .12; fa.rotation.z = ph.f; ro.rotation.z = ph.r; energise(st, ph.f, 1); var If = .4 + v * 1.4, Ia = Math.sqrt(1 + Math.pow(.9 * (If - 1), 2)); ro.userData.cu.emissiveIntensity = Math.max(0, (If - .3) * .6); needle.rotation.z = PI * .75 - K.cl((Ia - .98) / .3, 0, 1) * PI * 1.5; knob.rotation.y = -v * 4; } };
  };
})();
