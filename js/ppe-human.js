/* Procedural human for the PPE section. A real skeleton (hips, spine, neck, shoulders, elbows, wrists, fingers, hips, knees, ankles),
   smooth lofted limbs, a sculpted head with eyes that blink, and layered clothing with fabric weave, folds and seams.
   Poses are blended every frame, so standing, walking, working and flinching all move like a person. */
(function () {
  'use strict';
  var T = THREE, V = VK, P = window.VKP = window.VKP || {};

  /* ---------- geometry helpers ---------- */
  function cr(p0, p1, p2, p3, t) { var t2 = t * t, t3 = t2 * t; return .5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3); }
  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  /* loft: stack of superellipse rings along Y. secs: [{y,rx,rz,cx,cz,n}], smooth Catmull-Rom between them. */
  function loft(secs, o) {
    o = o || {}; var N = o.N || 36, R = o.res || 6, rings = [], i, j, k, keys = ['y', 'rx', 'rz', 'cx', 'cz', 'n'];
    function g(i) { return secs[Math.max(0, Math.min(secs.length - 1, i))]; }
    for (i = 0; i < secs.length - 1; i++) for (k = 0; k < R; k++) { var t = k / R, r = {}; keys.forEach(function (kk) { var d = kk === 'cx' || kk === 'cz' ? 0 : (kk === 'n' ? 2 : 0); r[kk] = cr(g(i - 1)[kk] == null ? d : g(i - 1)[kk], g(i)[kk] == null ? d : g(i)[kk], g(i + 1)[kk] == null ? d : g(i + 1)[kk], g(i + 2)[kk] == null ? d : g(i + 2)[kk], t); }); rings.push(r); }
    var L = secs[secs.length - 1], last = {}; keys.forEach(function (kk) { last[kk] = L[kk] == null ? (kk === 'n' ? 2 : 0) : L[kk]; }); rings.push(last);
    var pos = [], uv = [], idx = [], W = N + 1, wr = o.wr || [], vAcc = 0, prev = null;
    rings.forEach(function (r, ri) {
      if (prev) vAcc += Math.hypot(r.y - prev.y, (r.rx + r.rz) * .1 - (prev.rx + prev.rz) * .1); prev = r;
      for (var j = 0; j <= N; j++) {
        var a = j / N * 6.2831853, s = Math.sin(a), c = Math.cos(a), n = Math.max(1.6, r.n || 2), sx = Math.sign(s) * Math.pow(Math.abs(s), 2 / n), sz = Math.sign(c) * Math.pow(Math.abs(c), 2 / n), f = 1;
        for (var q = 0; q < wr.length; q++) { var b = wr[q], w = smooth(b.y0 - b.fade, b.y0, r.y) * (1 - smooth(b.y1, b.y1 + b.fade, r.y)); if (w > 0) f += b.amp * w * Math.sin(a * b.freq + b.ph + r.y * (b.k || 0)); }
        pos.push(r.cx + r.rx * sx * f, r.y, r.cz + r.rz * sz * f); uv.push(j / N * (o.uRep || 3), vAcc / (o.vScale || .18));
      }
    });
    var nr = rings.length;
    for (i = 0; i < nr - 1; i++) for (j = 0; j < N; j++) { var a0 = i * W + j, b0 = a0 + 1, c0 = a0 + W, d0 = c0 + 1; if (o.skip && o.skip(rings[i].y, j / N * 6.2831853, i, j)) continue; idx.push(a0, c0, b0, b0, c0, d0); }
    function cap(ri, up) { var r = rings[ri], base = pos.length / 3; pos.push(r.cx, r.y, r.cz); uv.push(.5, .5); for (var j = 0; j < N; j++) { var a1 = ri * W + j, b1 = a1 + 1; up ? idx.push(base, a1, b1) : idx.push(base, b1, a1); } }
    var ge = new T.BufferGeometry(); ge.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); ge.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); ge.setIndex(idx);
    /* orient normals outward by testing one quad */
    var ia = idx[0], ib = idx[1], ic = idx[2], pa = new T.Vector3(pos[ia * 3], pos[ia * 3 + 1], pos[ia * 3 + 2]), pb = new T.Vector3(pos[ib * 3], pos[ib * 3 + 1], pos[ib * 3 + 2]), pc = new T.Vector3(pos[ic * 3], pos[ic * 3 + 1], pos[ic * 3 + 2]);
    var nrm = new T.Vector3().crossVectors(pb.clone().sub(pa), pc.clone().sub(pa)), rad = new T.Vector3(pa.x - rings[0].cx, 0, pa.z - rings[0].cz);
    var flip = nrm.dot(rad) < 0; if (flip) { for (var m = 0; m < idx.length; m += 3) { var tmp = idx[m + 1]; idx[m + 1] = idx[m + 2]; idx[m + 2] = tmp; } ge.setIndex(idx); }
    var topUp = rings[nr - 1].y > rings[0].y;
    if (o.capTop) { cap(nr - 1, topUp !== flip ? true : false); } if (o.capBottom) { cap(0, topUp !== flip ? false : true); }
    ge.computeVertexNormals();
    var nn = ge.attributes.normal; for (i = 0; i < nr; i++) { var l = i * W, rr = i * W + N; var x = nn.getX(l) + nn.getX(rr), y = nn.getY(l) + nn.getY(rr), z = nn.getZ(l) + nn.getZ(rr), ln = Math.hypot(x, y, z) || 1; nn.setXYZ(l, x / ln, y / ln, z / ln); nn.setXYZ(rr, x / ln, y / ln, z / ln); }
    return ge;
  }
  P.loft = loft;
  function capsule(r, len, seg) {
    var pts = [], n = seg || 8, h = len / 2, i; for (i = 0; i <= n; i++) { var a = -Math.PI / 2 + i / n * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r, -h + Math.sin(a) * r)); }
    for (i = 0; i <= n; i++) { var b = i / n * Math.PI / 2; pts.push(new T.Vector2(Math.cos(b) * r, h + Math.sin(b) * r)); }
    return new T.LatheGeometry(pts, 14);
  }
  P.capsule = capsule;
  function ell(rx, ry, rz, mat, x, y, z, ws, hs) { var m = new T.Mesh(new T.SphereGeometry(1, ws || 24, hs || 16), mat); m.scale.set(rx, ry, rz); m.position.set(x || 0, y || 0, z || 0); return m; }
  P.ell = ell;
  function G() { return new T.Group(); }

  /* ---------- materials ---------- */
  function fabric(hex, o) {
    o = o || {}; var tx = V.noiseTex(256, 256, function (x, w, h) {
      x.fillStyle = hex; x.fillRect(0, 0, w, h);
      for (var i = -h; i < w + h; i += 9) { x.strokeStyle = 'rgba(255,255,255,' + ((o.weave || .07) * .35) + ')'; x.lineWidth = 1; x.beginPath(); x.moveTo(i, 0); x.lineTo(i + h, h); x.stroke(); x.strokeStyle = 'rgba(0,0,0,' + ((o.weave || .07) * .35) + ')'; x.beginPath(); x.moveTo(i + 1.5, 0); x.lineTo(i + 1.5 + h, h); x.stroke(); }
      for (i = 0; i < 900; i++) { x.fillStyle = 'rgba(' + (Math.random() < .5 ? '255,255,255' : '0,0,0') + ',' + Math.random() * (o.noise || .03) * .5 + ')'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    });
    var m = new T.MeshStandardMaterial({ map: tx, color: 0xffffff, roughness: o.rough == null ? .92 : o.rough, metalness: 0, bumpMap: tx, bumpScale: o.bump || 0, envMapIntensity: .5 });
    m.userData.base = m.color.clone(); return m;
  }
  function leather(hex, rough) {
    var tx = V.noiseTex(128, 128, function (x, w, h) { x.fillStyle = hex; x.fillRect(0, 0, w, h); for (var i = 0; i < 700; i++) { x.fillStyle = 'rgba(' + (Math.random() < .5 ? '255,235,210' : '0,0,0') + ',' + Math.random() * .05 + ')'; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, .8 + Math.random() * 1.2, 0, 7); x.fill(); } });
    return new T.MeshStandardMaterial({ map: tx, roughness: rough || .62, metalness: .02, bumpMap: tx, bumpScale: .05, envMapIntensity: .5 });
  }
  P.fabric = fabric; P.leather = leather;
  function plastic(hex, cc) { return new T.MeshPhysicalMaterial({ color: hex, roughness: .32, metalness: 0, clearcoat: cc == null ? .8 : cc, clearcoatRoughness: .18 }); }
  P.plastic = plastic;
  function skinMat() {
    var tx = V.noiseTex(128, 128, function (x, w, h) { x.fillStyle = '#c98d68'; x.fillRect(0, 0, w, h); for (var i = 0; i < 900; i++) { x.fillStyle = 'rgba(' + (Math.random() < .5 ? '120,60,40' : '255,200,170') + ',' + Math.random() * .07 + ')'; x.fillRect(Math.random() * w, Math.random() * h, 1, 1); } });
    return new T.MeshPhysicalMaterial({ map: tx, roughness: .55, metalness: 0, clearcoat: .08, sheen: new T.Color(0xff9a7a) });
  }

  /* ---------- head: sculpted sphere with brow, nose, cheeks, lips, ears and eyes ---------- */
  function buildHead(skin) {
    var head = G(), ge = new T.SphereGeometry(1, 56, 40), p = ge.attributes.position, v = new T.Vector3();
    function bump(x, y, z, cx, cy, cz, sx, sy, sz, amp) { var d = ((x - cx) / sx) * ((x - cx) / sx) + ((y - cy) / sy) * ((y - cy) / sy) + ((z - cz) / sz) * ((z - cz) / sz); return amp * Math.exp(-d); }
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i); var x = v.x, y = v.y, z = v.z;               /* unit sphere */
      var X = x * .074, Y = y * .102, Z = z * .09;                            /* base ellipsoid (m) */
      var jaw = smooth(.1, -.7, y); X *= 1 - .22 * jaw; Z *= 1 - .08 * jaw; if (y < -.55 && z > 0) Z += .007 * smooth(-.55, -.9, y);      /* tapered jaw, chin */
      Z += bump(X, Y, Z, 0, -.012, .09, .02, .025, .03, .024);                  /* nose */
      Z += bump(X, Y, Z, 0, .033, .088, .06, .014, .03, .006);                  /* brow */
      Z += bump(X, Y, Z, 0, -.06, .085, .015, .007, .02, .004) * (Y < -.05 ? 1 : 0);
      [-1, 1].forEach(function (s) {
        Z -= bump(X, Y, Z, s * .033, .02, .085, .013, .011, .02, .008);        /* eye sockets */
        Z += bump(X, Y, Z, s * .05, -.027, .068, .02, .018, .03, .007);        /* cheeks */
        X += s * bump(X, Y, Z, s * .02, -.015, .098, .008, .01, .02, .003) * 0;
      });
      Z -= bump(X, Y, Z, 0, -.047, .09, .02, .003, .02, .004);                  /* mouth line */
      Z += bump(X, Y, Z, 0, -.088, .08, .03, .014, .03, .007);                  /* chin */
      p.setXYZ(i, X, Y, Z);
    }
    ge.computeVertexNormals(); var skull = new T.Mesh(ge, skin); head.add(skull);
    var lipM = new T.MeshStandardMaterial({ color: 0xa8584f, roughness: .45 });
    head.add(ell(.017, .0055, .008, lipM, 0, -.0455, .0865)); head.add(ell(.015, .0065, .008, lipM, 0, -.0535, .0855));
    var browM = new T.MeshStandardMaterial({ color: 0x1b140f, roughness: .9 });
    [-1, 1].forEach(function (s) {
      var eye = G(); eye.position.set(s * .033, .02, .0795);
      var ball = ell(.0108, .0102, .01, new T.MeshStandardMaterial({ color: 0xe9e2d9, roughness: .3 }), 0, 0, 0, 20, 14); eye.add(ball);
      var iris = ell(.0054, .0054, .003, new T.MeshStandardMaterial({ color: 0x3b2314, roughness: .3 }), 0, 0, .0082, 18, 12); eye.add(iris);
      var pup = ell(.0026, .0026, .0018, new T.MeshBasicMaterial({ color: 0x050505 }), 0, 0, .0098, 12, 8); eye.add(pup);
      var glint = ell(.0011, .0011, .0008, new T.MeshBasicMaterial({ color: 0xffffff }), 0.0018, .0018, .0108, 8, 6); eye.add(glint);
      var lid = new T.Mesh(new T.SphereGeometry(1, 20, 10, 0, 6.2832, 0, 1.57), skin); lid.scale.set(.0116, .0116, .0112); lid.rotation.x = -1.45; eye.add(lid); eye.userData.lid = lid; eye.userData.ball = ball; head.userData['eye' + (s > 0 ? 'R' : 'L')] = eye;
      head.add(eye);
      var br = ell(.0145, .0032, .006, browM, s * .033, .043, .0865, 12, 8); br.rotation.z = -s * .22; br.rotation.y = s * .18; head.add(br);
      var ear = ell(.0075, .02, .013, skin, s * .0735, -.004, -.005, 16, 12); ear.rotation.y = s * .25; head.add(ear);
      var earIn = ell(.004, .013, .007, new T.MeshStandardMaterial({ color: 0xa3644b, roughness: .8 }), s * .0775, -.004, -.002, 12, 8); earIn.rotation.y = s * .25; head.add(earIn);
    });
    var nostril = new T.MeshBasicMaterial({ color: 0x3a1c14 }); [-1, 1].forEach(function (s) { head.add(ell(.0045, .0028, .004, nostril, s * .009, -.0225, .0895, 8, 6)); });
    /* short hair: shell over the upper/back of the skull */
    var hairM = new T.MeshStandardMaterial({ color: 0x15100d, roughness: .95 });
    var hg = new T.SphereGeometry(1, 40, 24, 0, 6.2832, 0, 1.9), hp = hg.attributes.position;
    for (i = 0; i < hp.count; i++) { var hx = hp.getX(i), hy = hp.getY(i), hz = hp.getZ(i), f = hz > .1 && hy < .55 ? 0 : 1; var k = 1.045 + .01 * Math.sin(hx * 18 + hy * 11); if (hz > .25 && hy < .62) hy = .62 + (hy - .62) * .1; hp.setXYZ(i, hx * .074 * k, hy * .102 * k + .002, hz * .09 * k - (hz > 0 ? .0035 * smooth(.2, 1, hz) * (hy < .7 ? 1 : 0) : 0)); }
    hg.computeVertexNormals(); var hair = new T.Mesh(hg, hairM); hair.position.y = .002; head.add(hair);
    head.userData.hair = hair; head.userData.skull = skull;
    return head;
  }
  P.buildHead = buildHead; P.skinMat = skinMat; P.G = G; P.ell = ell; P.smooth = smooth;
})();
