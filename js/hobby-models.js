/* Hobby electronics 3D models. Procedural, 1 unit = 1 cm, board top surface near y = 0.08. Exposes window.HobbyModels. */
(function (G) {
  'use strict';
  var T = THREE;
  function M(c, m, r, o) { return new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m == null ? 0.15 : m, roughness: r == null ? 0.6 : r }, o || {})); }
  function box(w, h, d, c, x, y, z, p, m, r) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), M(c, m, r)); o.position.set(x, y, z); if (p) p.add(o); return o; }
  function cyl(r, h, c, x, y, z, p, ax, m, r2) { var o = new T.Mesh(new T.CylinderGeometry(r, r, h, 24), M(c, m, r2)); if (ax === 'x') o.rotation.z = Math.PI / 2; if (ax === 'z') o.rotation.x = Math.PI / 2; o.position.set(x, y, z); if (p) p.add(o); return o; }
  function pcb(w, d, c, p) { return box(w, 0.16, d, c, 0, 0, 0, p, 0.1, 0.55); }
  function label(text, w, h, x, y, z, p, fg, bg, size) {
    var cv = document.createElement('canvas'); cv.width = 256; cv.height = Math.round(256 * h / w); var cx = cv.getContext('2d');
    if (bg) { cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); }
    cx.fillStyle = fg || '#fff'; cx.font = '700 ' + (size || 40) + 'px Inter, Arial, sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(text, cv.width / 2, cv.height / 2);
    var tx = new T.CanvasTexture(cv); tx.anisotropy = 4;
    var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tx, transparent: !bg }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); if (p) p.add(m); m.userData.tex = tx; m.userData.cv = cv; return m;
  }
  function pins(n, pitch, x, y, z, p, ax, housing) {
    var g = new T.Group(), len = n * pitch;
    if (housing !== false) g.add(ax === 'z' ? box(0.25, 0.25, len, 0x15171c, 0, 0.125, 0) : box(len, 0.25, 0.25, 0x15171c, 0, 0.125, 0));
    var im = new T.InstancedMesh(new T.BoxGeometry(0.06, 0.9, 0.06), M(0xd4af37, 0.9, 0.25), n), mt = new T.Matrix4();
    for (var i = 0; i < n; i++) { var o = -len / 2 + pitch * (i + 0.5); mt.makeTranslation(ax === 'z' ? 0 : o, 0.2, ax === 'z' ? o : 0); im.setMatrixAt(i, mt); }
    g.add(im); g.position.set(x, y, z); if (p) p.add(g); return g;
  }
  function led(c, x, y, z, p) { return box(0.16, 0.1, 0.1, c, x, y, z, p, 0, 0.3, { emissive: c, emissiveIntensity: 0.6 }); }
  function wire(pts, c, p, r) {
    var m = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(function (a) { return new T.Vector3(a[0], a[1], a[2]); })), 24, r || 0.05, 6, false), M(c, 0.1, 0.5));
    if (p) p.add(m); return m;
  }
  function holes(cols, rows, pitch, x0, z0, y, p) {
    var im = new T.InstancedMesh(new T.BoxGeometry(0.1, 0.02, 0.1), M(0x23262d, 0, 0.9), cols * rows.length), mt = new T.Matrix4(), n = 0;
    rows.forEach(function (z) { for (var c = 0; c < cols; c++) { mt.makeTranslation(x0 + c * pitch, y, z); im.setMatrixAt(n++, mt); } });
    p.add(im);
  }

  var B = {};
  B.uno = function () {
    var g = new T.Group(), y = 0.08; pcb(6.9, 5.3, 0x0e6f8f, g);
    label('ARDUINO UNO', 3.2, 0.6, 0.9, y + 0.01, -0.7, g, '#e8fbff', null, 34);
    box(1.9, 1.2, 1.3, 0xb8c0cc, -2.75, y + 0.6, -1.1, g, 0.9, 0.25);
    box(1.6, 1.1, 1.1, 0x15171c, -2.85, y + 0.55, 1.7, g);
    box(3.5, 0.4, 0.75, 0x15171c, 0.9, y + 0.2, 0.85, g); box(0.7, 0.15, 0.7, 0x15171c, -1.6, y + 0.08, 0.2, g);
    box(0.6, 0.25, 0.35, 0xc0c8d4, -0.6, y + 0.12, 0.1, g, 0.9, 0.2); box(0.8, 0.5, 0.5, 0x20242b, -1.7, y + 0.25, 1.6, g);
    box(0.6, 0.35, 0.6, 0xc9ccd1, -1.2, y + 0.17, -1.7, g, 0.8, 0.3); cyl(0.17, 0.2, 0xdc2626, -1.2, y + 0.4, -1.7, g);
    cyl(0.3, 0.7, 0x222831, -1.0, y + 0.35, 1.7, g); cyl(0.3, 0.7, 0x222831, -0.3, y + 0.35, 1.9, g);
    led(0x22c55e, 1.9, y + 0.05, -1.3, g); led(0xf59e0b, 1.6, y + 0.05, -1.3, g);
    pins(10, 0.254, -0.56, y, -2.35, g, 'x'); pins(8, 0.254, 2.13, y, -2.35, g, 'x');
    pins(8, 0.254, 0.115, y, 2.35, g, 'x'); pins(6, 0.254, 2.29, y, 2.35, g, 'x');
    return g;
  };
  B.esp32 = function () {
    var g = new T.Group(), y = 0.08; pcb(5.44, 2.8, 0x111418, g);
    box(2.55, 0.28, 1.8, 0xc9ced6, 1.2, y + 0.14, 0, g, 0.9, 0.3);
    box(0.7, 0.03, 1.8, 0x0a0a0a, 2.37, y + 0.02, 0, g);
    [-0.6, -0.2, 0.2, 0.6].forEach(function (z) { box(0.55, 0.012, 0.06, 0xd4af37, 2.37, y + 0.04, z, g, 0.9, 0.3); });
    label('ESP32', 1.6, 0.5, 0.9, y + 0.3, 0, g, '#222', null, 40);
    box(0.8, 0.3, 0.8, 0xb8c0cc, -2.55, y + 0.15, 0, g, 0.9, 0.25); box(0.55, 0.12, 0.55, 0x15171c, -1.7, y + 0.06, 0.5, g);
    box(0.5, 0.45, 0.5, 0x20242b, -1.0, y + 0.22, -0.2, g);
    [-0.9, 0.9].forEach(function (z) { box(0.45, 0.2, 0.45, 0xc9ccd1, -2.0, y + 0.1, z, g, 0.8, 0.3); });
    led(0xef4444, -1.4, y + 0.05, 0.9, g); led(0x3b82f6, -1.2, y + 0.05, 0.9, g);
    pins(19, 0.254, -0.1, y, -1.2, g, 'x'); pins(19, 0.254, -0.1, y, 1.2, g, 'x');
    return g;
  };
  B.hc05 = function () {
    var g = new T.Group(), y = 0.08; pcb(3.7, 1.6, 0x1565c0, g);
    box(2.7, 0.12, 1.3, 0x2e7d32, 0.4, y + 0.06, 0, g); box(1.1, 0.2, 0.95, 0xc9ced6, 0.75, y + 0.2, 0, g, 0.9, 0.3);
    label('HC-05', 0.95, 0.4, 0.75, y + 0.32, 0, g, '#222', null, 40);
    box(0.7, 0.03, 1.1, 0x0a0a0a, -0.7, y + 0.14, 0, g);
    box(0.45, 0.2, 0.35, 0xe5e7eb, 1.45, y + 0.1, 0.6, g); var l = led(0xef4444, 1.2, y + 0.05, -0.55, g);
    pins(6, 0.254, -1.65, y, 0, g, 'z');
    g.userData.update = function (t) { l.material.emissiveIntensity = 0.2 + 0.8 * (Math.sin(t * 6) > 0 ? 1 : 0); };
    return g;
  };
  B.pico = function () {
    var g = new T.Group(), y = 0.08; pcb(5.1, 2.1, 0x1b7b34, g);
    box(0.7, 0.1, 0.7, 0x15171c, 0.6, y + 0.05, 0, g); box(0.55, 0.08, 0.45, 0x15171c, -0.4, y + 0.04, 0.4, g);
    box(0.8, 0.3, 0.7, 0xb8c0cc, -2.4, y + 0.15, 0, g, 0.9, 0.25); box(0.5, 0.25, 0.5, 0xf3f4f6, -1.6, y + 0.12, 0, g);
    label('Pico', 1.2, 0.4, 1.4, y + 0.01, 0, g, '#fff', null, 40);
    led(0x22c55e, 0.2, y + 0.05, -0.6, g);
    pins(20, 0.254, 0, y, -0.9, g, 'x'); pins(20, 0.254, 0, y, 0.9, g, 'x');
    return g;
  };
  B.breadboard = function (cols) {
    cols = cols || 60; var g = new T.Group(), pitch = 0.254, w = cols * pitch + 1.3, x0 = -(cols - 1) * pitch / 2;
    box(w, 0.85, 5.5, 0xe8e6df, 0, 0.425, 0, g, 0, 0.8);
    box(w - 0.4, 0.02, 0.4, 0x9ca3af, 0, 0.86, 0, g, 0, 0.9);
    var top = 0.86, rows = []; for (var i = 0; i < 5; i++) { rows.push(-1.27 + i * pitch); rows.push(0.254 + i * pitch); }
    holes(cols, rows, pitch, x0, 0, top, g);
    holes(Math.floor(cols * 0.8), [-2.3, -2.04, 2.04, 2.3], pitch, -(Math.floor(cols * 0.8) - 1) * pitch / 2, 0, top, g);
    [[-2.62, 0xdc2626], [-1.72, 0x2563eb], [1.72, 0xdc2626], [2.62, 0x2563eb]].forEach(function (a) { box(w - 0.9, 0.012, 0.04, a[1], 0, top + 0.01, a[0], g, 0, 0.6); });
    g.userData.pitch = pitch; g.userData.x0 = x0; g.userData.top = top; return g;
  };
  B.servo = function () {
    var g = new T.Group(), blue = 0x1e5aa8;
    box(2.25, 2.2, 1.2, blue, 0, 1.1, 0, g, 0.1, 0.5); box(3.3, 0.18, 1.2, blue, 0, 1.7, 0, g, 0.1, 0.5);
    [-1.4, 1.4].forEach(function (x) { cyl(0.12, 0.2, 0x0f172a, x, 1.7, 0, g); });
    cyl(0.5, 0.35, blue, -0.55, 2.35, 0, g, null, 0.1, 0.5); cyl(0.2, 0.35, 0xe5e7eb, -0.55, 2.7, 0, g, null, 0.6, 0.3);
    var horn = new T.Group(); box(2.4, 0.1, 0.38, 0xf3f4f6, 0.8, 0, 0, horn, 0, 0.5); cyl(0.3, 0.12, 0xf3f4f6, 0, 0, 0, horn); horn.position.set(-0.55, 2.95, 0); g.add(horn);
    [[0x7c3f1d, -0.25], [0xdc2626, 0], [0xf97316, 0.25]].forEach(function (a) { wire([[1.12, 0.6, a[1]], [1.8, 0.45, a[1]], [2.6, 0.2, a[1] * 1.6], [3.4, 0.08, a[1] * 2]], a[0], g, 0.05); });
    g.userData.horn = horn; g.userData.update = function (t) { horn.rotation.y = Math.sin(t * 1.6) * 1.2; };
    return g;
  };
  B.hcsr04 = function () {
    var g = new T.Group(), y = 0.08; pcb(4.5, 2.0, 0x1565c0, g);
    [-1.1, 1.1].forEach(function (x) { cyl(0.8, 1.2, 0xb0b7c3, x, y + 0.6, -0.1, g, null, 0.85, 0.35); cyl(0.62, 0.05, 0x1f2937, x, y + 1.21, -0.1, g); });
    box(0.8, 0.5, 0.3, 0x15171c, 0, y + 0.25, 0.35, g); box(0.5, 0.25, 0.3, 0xc0c8d4, 0.2, y + 0.12, -0.1, g, 0.9, 0.25);
    pins(4, 0.254, 0, y, 0.85, g, 'x'); label('HC-SR04', 1.6, 0.4, 0, y + 0.01, 0.55, g, '#e8f1ff', null, 34);
    return g;
  };
  B.relay = function () {
    var g = new T.Group(), y = 0.08; pcb(5.1, 3.4, 0x1e66b0, g);
    box(1.9, 1.55, 1.5, 0x0d47a1, -0.4, y + 0.78, -0.3, g, 0, 0.5); label('SRD-05VDC', 1.5, 0.4, -0.4, y + 1.57, -0.3, g, '#e8f1ff', null, 30);
    var tb = box(2.2, 1.0, 0.9, 0x2e7d32, 0.5, y + 0.5, 1.15, g, 0, 0.5);
    [-0.7, 0, 0.7].forEach(function (x) { cyl(0.2, 0.1, 0xd4af37, 0.5 + x, y + 1.05, 1.15, g, null, 0.9, 0.3); });
    box(0.6, 0.15, 0.4, 0x15171c, 1.5, y + 0.07, -0.8, g); box(0.35, 0.3, 0.3, 0x15171c, 1.9, y + 0.15, 0.2, g);
    var l1 = led(0xef4444, -1.9, y + 0.05, 0.9, g), l2 = led(0x22c55e, -1.9, y + 0.05, 0.5, g);
    pins(3, 0.254, -2.2, y, -1.0, g, 'z');
    g.userData.update = function (t) { var on = Math.sin(t * 2) > 0; l1.material.emissiveIntensity = on ? 1 : 0.1; l2.material.emissiveIntensity = on ? 0.2 : 1; };
    return g;
  };
  B.oled = function () {
    var g = new T.Group(), y = 0.08; pcb(2.7, 2.8, 0x0f4c9c, g);
    box(2.3, 0.08, 1.5, 0x05070a, 0, y + 0.04, 0.2, g, 0.3, 0.2);
    var scr = label('', 2.0, 1.0, 0, y + 0.1, 0.2, g, '#8fe3ff', '#000', 40); g.userData.scr = scr;
    pins(4, 0.254, 0, y, -1.2, g, 'x');
    function draw(t) { var cv = scr.userData.cv, cx = cv.getContext('2d'); cx.fillStyle = '#000'; cx.fillRect(0, 0, cv.width, cv.height); cx.fillStyle = '#8fe3ff'; cx.font = '700 46px monospace'; cx.textAlign = 'left'; cx.textBaseline = 'middle'; cx.fillText(g.userData.text || ('T ' + (24 + Math.sin(t) * 2).toFixed(1) + 'C'), 18, cv.height / 2); scr.userData.tex.needsUpdate = true; }
    g.userData.draw = draw; draw(0); var last = 0;
    g.userData.update = function (t) { if (t - last > 0.4) { last = t; draw(t); } };
    return g;
  };
  B.dht11 = function () {
    var g = new T.Group(); box(1.7, 0.2, 1.2, 0x1e293b, 0, 0.1, 0, g);
    box(1.55, 2.05, 0.77, 0x1e90d8, 0, 1.22, 0, g, 0, 0.5);
    for (var r = 0; r < 7; r++) for (var c = 0; c < 5; c++) box(0.16, 0.16, 0.04, 0x0b4a75, -0.55 + c * 0.275, 0.6 + r * 0.26, 0.4, g, 0, 0.9);
    for (var i = 0; i < 4; i++) box(0.06, 0.8, 0.06, 0xc0c8d4, -0.5 + i * 0.33, -0.2, 0, g, 0.9, 0.3);
    label('DHT11', 1.2, 0.3, 0, 2.26, 0, g, '#e8f1ff', null, 32).rotation.x = 0;
    return g;
  };

  /* ---------- starter project scenes ---------- */
  function place(o, x, y, z, ry) { o.position.set(x, y, z); if (ry) o.rotation.y = ry; return o; }
  function resistor(x, y, z, p, ry) {
    var r = new T.Group(); cyl(0.12, 0.9, 0xd9b77e, 0, 0, 0, r, 'x', 0.1, 0.7);
    [[-0.28, 0xdc2626], [-0.08, 0xdc2626], [0.12, 0x7c3f1d], [0.32, 0xd4af37]].forEach(function (a) { cyl(0.125, 0.05, a[1], a[0], 0, 0, r, 'x'); });
    cyl(0.02, 0.5, 0xc0c8d4, -0.65, 0, 0, r, 'x', 0.9, 0.3); cyl(0.02, 0.5, 0xc0c8d4, 0.65, 0, 0, r, 'x', 0.9, 0.3);
    r.position.set(x, y, z); if (ry) r.rotation.y = ry; if (p) p.add(r); return r;
  }
  function ledPart(c, x, y, z, p) {
    var l = new T.Group(), m = M(c, 0, 0.2, { transparent: true, opacity: 0.85, emissive: c, emissiveIntensity: 0.1 });
    var b = new T.Mesh(new T.CylinderGeometry(0.25, 0.25, 0.5, 20), m); b.position.y = 0.25; l.add(b);
    var d = new T.Mesh(new T.SphereGeometry(0.25, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), m); d.position.y = 0.5; l.add(d);
    cyl(0.02, 0.6, 0xc0c8d4, -0.07, -0.25, 0, l, null, 0.9, 0.3); cyl(0.02, 0.5, 0xc0c8d4, 0.07, -0.2, 0, l, null, 0.9, 0.3);
    l.position.set(x, y, z); if (p) p.add(l); l.userData.mat = m; return l;
  }
  function rings(color, n) {
    var g = new T.Group(), arr = [];
    for (var i = 0; i < n; i++) { var m = new T.Mesh(new T.TorusGeometry(1, 0.03, 8, 48), new T.MeshBasicMaterial({ color: color, transparent: true, opacity: 0 })); m.rotation.x = Math.PI / 2; g.add(m); arr.push(m); }
    g.userData.update = function (t, speed, maxR, h) { arr.forEach(function (m, i) { var k = ((t * speed + i / n) % 1); m.scale.setScalar(0.3 + k * maxR); m.position.y = k * h; m.material.opacity = 0.8 * (1 - k); }); };
    return g;
  }
  function phone(x, y, z, p) { var g = new T.Group(); box(1.7, 0.12, 3.2, 0x111418, 0, 0, 0, g, 0.2, 0.4); var s = box(1.5, 0.02, 2.9, 0x2563eb, 0, 0.07, 0, g, 0, 0.3, { emissive: 0x1d4ed8, emissiveIntensity: 0.5 }); g.position.set(x, y, z); g.rotation.set(0, 0.5, 0.35); if (p) p.add(g); g.userData.screen = s; return g; }
  function fan(x, y, z, p) {
    var g = new T.Group(); box(3.2, 0.5, 3.2, 0x1f2937, 0, 0, 0, g); var rot = new T.Group(); rot.position.y = 0.3; g.add(rot);
    cyl(0.4, 0.4, 0x111827, 0, 0, 0, rot);
    for (var k = 0; k < 5; k++) { var b = box(1.1, 0.04, 0.5, 0x93c5fd, 0.8, 0.1, 0, new T.Group(), 0, 0.4); var h = new T.Group(); h.rotation.y = k * Math.PI * 2 / 5; b.position.x = 0.9; b.rotation.x = 0.3; h.add(b); rot.add(h); }
    g.position.set(x, y, z); if (p) p.add(g); g.userData.rot = rot; return g;
  }
  var P = {};
  P.blink = function () {
    var g = new T.Group(); var uno = place(B.uno(), 0, 0, 5, 0); g.add(uno);
    var bb = B.breadboard(30); place(bb, 0, 0, -3.5, 0); g.add(bb);
    var top = bb.userData.top, x0 = bb.userData.x0, pt = bb.userData.pitch;
    var lx = x0 + 10 * pt, rx = x0 + 15 * pt;
    var l = ledPart(0xef4444, lx, top, -3.5 - 0.254 * 2, g); resistor(rx, top + 0.15, -3.5 - 0.254 * 2, g, 0);
    wire([[-0.687, 0.9, 2.65], [-0.7, 3, 0], [rx + 0.65, 2.2, -3], [rx + 0.65, top + 0.1, -3.5 - 0.5]], 0xf59e0b, g);
    wire([[-0.94, 0.9, 2.65], [-4, 3.5, -2], [lx + 0.07, 2, -3], [lx + 0.07, top + 0.05, -3.5 - 0.3]], 0x111827, g);
    g.userData.update = function (t) { l.userData.mat.emissiveIntensity = Math.sin(t * 5) > 0 ? 1.2 : 0.05; };
    g.userData.fit = 1; return g;
  };
  P.distance = function () {
    var g = new T.Group(); g.add(place(B.uno(), 0, 0, 5, 0));
    var sr = place(B.hcsr04(), -5, 0, -4, 0); g.add(sr); var od = place(B.oled(), 4.5, 0, -4, 0); g.add(od);
    wire([[-0.56, 0.9, 2.65], [-2, 3, -1], [-4.4, 1.2, -3.2]], 0x22c55e, g); wire([[0.2, 0.9, 2.65], [-1, 3.6, -1], [-5.3, 1.3, -3.2]], 0xf59e0b, g);
    wire([[2.3, 0.9, 2.65], [3, 3, -1], [4.2, 1.2, -5.1]], 0x3b82f6, g);
    var rg = rings(0x38bdf8, 3); rg.position.set(-5 + 1.1, 1.3, -4); g.add(rg);
    var wall = box(4, 0.2, 3, 0xf3f4f6, -4, 8, -4, g, 0, 0.5, { transparent: true, opacity: 0.6 });
    g.userData.update = function (t) { var h = 5.5 + Math.sin(t * 0.9) * 3; wall.position.y = h; rg.userData.update(t, 0.8, 1.8, h - 1.3); od.userData.text = 'D ' + Math.round(h * 4) + ' cm'; od.userData.update(t); };
    return g;
  };
  P.bluetooth = function () {
    var g = new T.Group(); g.add(place(B.uno(), 0, 0, 5, 0)); var hc = place(B.hc05(), -4.5, 0, -4, 0); g.add(hc);
    var bb = B.breadboard(20); place(bb, 4.5, 0, -4, 0); bb.scale.set(0.9, 1, 0.9); g.add(bb); var top = bb.userData.top;
    var l = ledPart(0x22c55e, 4.5 - 1, top, -4.4, g); resistor(4.5 + 0.8, top + 0.15, -4.4, g, 0);
    wire([[0.9, 0.9, 2.65], [-0.5, 3, -1], [-3.0, 1.2, -3.6]], 0x3b82f6, g); wire([[0.64, 0.9, 2.65], [-0.8, 3.3, -1], [-3.0, 1.2, -4.2]], 0xf59e0b, g);
    wire([[0.4, 0.9, 2.65], [2, 3, 0], [5.3, 1.2, -4.7]], 0xdc2626, g);
    var ph = phone(-4.5, 8, -4, g), rg = rings(0x60a5fa, 3); rg.position.set(-4.5, 1.2, -4); g.add(rg);
    g.userData.update = function (t) { var on = Math.sin(t * 1.3) > 0; l.userData.mat.emissiveIntensity = on ? 1.2 : 0.05; ph.userData.screen.material.emissiveIntensity = on ? 1 : 0.3; rg.userData.update(t, 0.7, 2.6, 6.5); hc.userData.update(t); };
    return g;
  };
  P.servo = function () {
    var g = new T.Group(); g.add(place(B.uno(), 0, 0, 5, 0)); var sv = place(B.servo(), 0, 0, -5, 0); g.add(sv);
    [[0x7c3f1d, 2.0], [0xdc2626, 2.3], [0xf97316, 2.6]].forEach(function (a, i) { wire([[3.4, 0.08, -5 + (i - 1) * 0.5], [4, 1.5, -3], [2.5 - i * 0.5, 3.5, 0], [-0.7 + i * 0.5, 0.9, 2.65]], a[0], g); });
    var arm = box(3.2, 0.1, 0.3, 0xfbbf24, 1.6, 0, 0, new T.Group(), 0, 0.5); var grp = new T.Group(); grp.add(arm); grp.position.set(-0.55, 3.15, -5); g.add(grp);
    g.userData.update = function (t) { sv.userData.update(t); grp.rotation.y = sv.userData.horn.rotation.y; };
    return g;
  };
  P.fan = function () {
    var g = new T.Group(); g.add(place(B.esp32(), 0, 0, 5, 0));
    var dh = place(B.dht11(), -6, 0, -1, 0); g.add(dh); var rl = place(B.relay(), 1, 0, -3, 0); g.add(rl); var fn = fan(7, 0, -3, g); var rg = rings(0xa78bfa, 3); rg.position.set(1.5, 0.5, 5); g.add(rg);
    wire([[-6, 0.5, 5], [-6.5, 1, 2], [-6.3, -0.1, -0.3]], 0xf59e0b, g); wire([[-2.2, 0.5, 6.2], [-3, 2, 1], [-1.2, 0.4, -4.1]], 0x3b82f6, g);
    wire([[3.2, 0.3, -2.2], [5, 1.5, -1.5], [6.2, 0.4, -2.5]], 0xdc2626, g); wire([[1.2, 0.4, -1.9], [3, 1.8, 0], [6.2, 0.4, -3.5]], 0x111827, g);
    g.userData.update = function (t) { var temp = 27 + Math.sin(t * 0.5) * 4, on = temp > 27.2; fn.userData.rot.rotation.y += on ? 0.35 : 0; rl.userData.update(on ? t : 0); rg.userData.update(t, 0.6, 2.2, 3); };
    return g;
  };
  G.HobbyModels = { parts: B, projects: P, fitScale: function (id) { return 1; } };
})(window);
