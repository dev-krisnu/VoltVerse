/* V-NODE model kit: small shared helpers for the procedural 3D models of the catalogue pages.
   Units differ per page (see each models file). All helpers return THREE objects and add them to `p` when given. */
window.KIT = (function () {
  'use strict';
  var T = THREE, PI = Math.PI, V = window.VK;
  function M(c, m, r, x) { return new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m == null ? .2 : m, roughness: r == null ? .5 : r }, x || {})); }
  var K = { steel: M(0xc9d0d8, .95, .22), cu: M(0xc87b3e, .95, .25), brass: M(0xdcae3c, .95, .26), ag: M(0xe9edf2, 1, .15), alu: M(0xaab3bd, .85, .32), black: M(0x17181c, .1, .6), dark: M(0x242830, .3, .5), grey: M(0x6b7380, .5, .45), white: M(0xf1f2ee, 0, .4), green: M(0x2e7d32, 0, .5), red: M(0xc62828, 0, .45), blue: M(0x1e5fd0, 0, .45), yellow: M(0xe8b923, 0, .45), iron: M(0x8a929c, .9, .35), orange: M(0xea7a1b, 0, .45), pcb: M(0x14532d, .1, .6), ceramic: M(0xe7dccb, .05, .35), rubber: M(0x101114, 0, .85), si: M(0x4b5563, .6, .3), n: M(0x3b82f6, .1, .5), p: M(0xef4444, .1, .5), pl: M(0x8b5cf6, .1, .5) };
  function G() { return new T.Group(); }
  function ghost(c, op, x) { return M(c, .1, .4, Object.assign({ transparent: true, opacity: op == null ? 1 : op, depthWrite: (op == null || op > .9) }, x || {})); }
  function box(w, h, d, m, x, y, z, p) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); if (p) p.add(o); return o; }
  function cyl(r, h, m, x, y, z, p, seg, r2) { var o = new T.Mesh(new T.CylinderGeometry(r, r2 == null ? r : r2, h, seg || 28), m); o.position.set(x || 0, y || 0, z || 0); if (p) p.add(o); return o; }
  function cylX(r, h, m, x, y, z, p, seg) { var o = cyl(r, h, m, x, y, z, p, seg); o.rotation.z = PI / 2; return o; }
  function cylZ(r, h, m, x, y, z, p, seg) { var o = cyl(r, h, m, x, y, z, p, seg); o.rotation.x = PI / 2; return o; }
  function sph(r, m, x, y, z, p) { var o = new T.Mesh(new T.SphereGeometry(r, 20, 14), m); o.position.set(x || 0, y || 0, z || 0); if (p) p.add(o); return o; }
  function tor(R, r, m, x, y, z, p, rx) { var o = new T.Mesh(new T.TorusGeometry(R, r, 10, 40), m); o.position.set(x || 0, y || 0, z || 0); o.rotation.x = rx == null ? PI / 2 : rx; if (p) p.add(o); return o; }
  function v3(a) { return new T.Vector3(a[0], a[1], a[2]); }
  function tube(pts, r, m, p, seg) { var o = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(v3)), seg || 40, r, 8, false), m); if (p) p.add(o); return o; }
  function helixY(r, len, turns, wr, m) { var pts = [], n = Math.max(8, Math.round(turns * 14)); for (var i = 0; i <= n; i++) { var u = i / n, a = u * turns * PI * 2; pts.push([Math.cos(a) * r, -len / 2 + u * len, Math.sin(a) * r]); } return tube(pts, wr, m, null, n * 2); }
  function helixX(r, len, turns, wr, m) { var h = helixY(r, len, turns, wr, m); h.rotation.z = PI / 2; return h; }
  function lathe(prof, m, seg) { return new T.Mesh(new T.LatheGeometry(prof.map(function (q) { return new T.Vector2(q[0], q[1]); }), seg || 36), m); }
  function PART(o, l, z) { return { obj: o, label: l, zoom: z || 1.8 }; }
  function pad(r) { var o = cyl(r || 3, .06, M(0x141c28, .2, .9), 0, -.03, 0); return o; }
  /* text on a plane facing +z (set rotation for other faces) */
  function txt(s, w, h, m, x, y, z, p, col, px, bg) {
    var c = document.createElement('canvas'); c.width = 256; c.height = Math.max(32, Math.round(256 * h / w)); var g = c.getContext('2d'); if (bg) { g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height); }
    g.fillStyle = col || '#fff'; var fs = px || 44; g.font = '700 ' + fs + 'px Inter,Arial,sans-serif'; while (fs > 10 && g.measureText(s).width > c.width * .94) { fs -= 2; g.font = '700 ' + fs + 'px Inter,Arial,sans-serif'; } fs = Math.min(fs, c.height * .8); g.font = '700 ' + fs + 'px Inter,Arial,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, c.width / 2, c.height / 2 + 2);
    var t = new T.CanvasTexture(c); t.anisotropy = 4; var o = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: t, transparent: !bg })); o.position.set(x || 0, y || 0, z || 0); if (p) p.add(o); return o;
  }
  /* current-flow dots along a polyline: returns { group, update(time, speed, on) } */
  function flow(pts, col, n, size) {
    var curve = new T.CatmullRomCurve3(pts.map(v3), false, 'catmullrom', .0), g = G(), mat = new T.MeshBasicMaterial({ color: col || 0xfde047, transparent: true, opacity: 1 }), dots = [];
    for (var i = 0; i < (n || 14); i++) { var d = sph(size || .09, mat); g.add(d); dots.push(d); }
    return { group: g, curve: curve, update: function (time, speed, on) { g.visible = on > .02; mat.opacity = Math.min(1, on); dots.forEach(function (d, i) { var u = ((time * (speed || .3) + i / dots.length) % 1 + 1) % 1; curve.getPointAt(u, d.position); }); } };
  }
  /* glowing emissive material */
  function glowM(c, k) { return M(c, 0, .35, { emissive: c, emissiveIntensity: k == null ? 1 : k }); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function cl(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function seg(t, a, b) { return cl((t - a) / (b - a), 0, 1); }
  /* terminal screw: block + screw head */
  function term(x, y, z, p, s) { var g = G(); box(.5 * (s || 1), .35 * (s || 1), .5 * (s || 1), K.brass, 0, 0, 0, g); cyl(.14 * (s || 1), .1, K.steel, 0, .2 * (s || 1), 0, g, 14); g.position.set(x, y, z); if (p) p.add(g); return g; }
  return { T: T, M: M, K: K, G: G, ghost: ghost, box: box, cyl: cyl, cylX: cylX, cylZ: cylZ, sph: sph, tor: tor, tube: tube, helixY: helixY, helixX: helixX, lathe: lathe, PART: PART, pad: pad, txt: txt, flow: flow, glowM: glowM, lerp: lerp, cl: cl, seg: seg, term: term, v3: v3, PI: PI };
})();
/* LCD plane with updatable text: returns { mesh, set(lines, colour) } */
KIT.lcd = function (w, h, p, x, y, z, bg) {
  var T = THREE, c = document.createElement('canvas'); c.width = 256; c.height = Math.round(256 * h / w); var g = c.getContext('2d'), tex = new T.CanvasTexture(c), last = null;
  var mesh = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex })); mesh.position.set(x || 0, y || 0, z || 0); if (p) p.add(mesh);
  return { mesh: mesh, set: function (lines, col) { var key = lines.join('|') + col; if (key === last) return; last = key; g.fillStyle = bg || '#0f2a1d'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = col || '#86efac'; g.textAlign = 'center'; g.textBaseline = 'middle'; var n = lines.length, fs = Math.min(c.height / (n + .35), 64); lines.forEach(function (s, i) { var f = fs; g.font = '700 ' + f + 'px "JetBrains Mono",monospace'; while (f > 8 && g.measureText(s).width > c.width * .92) { f -= 2; g.font = '700 ' + f + 'px "JetBrains Mono",monospace'; } g.fillText(s, c.width / 2, c.height * (i + .6) / (n + .2)); }); tex.needsUpdate = true; } };
};
