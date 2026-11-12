/* Hobby electronics, part 2: pin labels on every board, extra realism, and new parts. Extends window.HobbyModels (loaded after hobby-models.js). 1 unit = 1 cm. */
(function (G) {
  'use strict';
  var T = THREE, HM = G.HobbyModels, B = HM.parts, P = HM.projects;
  function M(c, m, r, o) { return new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m == null ? .15 : m, roughness: r == null ? .6 : r }, o || {})); }
  function box(w, h, d, c, x, y, z, p, m, r, o) { var q = new T.Mesh(new T.BoxGeometry(w, h, d), M(c, m, r, o)); q.position.set(x, y, z); if (p) p.add(q); return q; }
  function cyl(r, h, c, x, y, z, p, ax, m, r2, seg) { var q = new T.Mesh(new T.CylinderGeometry(r, r, h, seg || 28), M(c, m, r2)); if (ax === 'x') q.rotation.z = Math.PI / 2; if (ax === 'z') q.rotation.x = Math.PI / 2; q.position.set(x, y, z); if (p) p.add(q); return q; }
  function pcb(w, d, c, p) { return box(w, .16, d, c, 0, 0, 0, p, .1, .55); }
  function txt(text, w, h, x, y, z, p, fg, size, bg) {
    var cv = document.createElement('canvas'); cv.width = 256; cv.height = Math.round(256 * h / w), cx = cv.getContext('2d'); var cx = cv.getContext('2d');
    if (bg) { cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); } cx.fillStyle = fg || '#fff'; cx.font = '700 ' + (size || 40) + 'px Inter, Arial, sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(text, cv.width / 2, cv.height / 2);
    var t2 = new T.CanvasTexture(cv); t2.anisotropy = 4; var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: t2, transparent: !bg })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); if (p) p.add(m); m.userData.tex = t2; m.userData.cv = cv; return m;
  }
  function pins(n, pitch, x, y, z, p, ax) { var g = new T.Group(), len = n * pitch; g.add(ax === 'z' ? box(.25, .25, len, 0x15171c, 0, .125, 0) : box(len, .25, .25, 0x15171c, 0, .125, 0)); var im = new T.InstancedMesh(new T.BoxGeometry(.06, .9, .06), M(0xd4af37, .9, .25), n), mt = new T.Matrix4(); for (var i = 0; i < n; i++) { var o = -len / 2 + pitch * (i + .5); mt.makeTranslation(ax === 'z' ? 0 : o, .2, ax === 'z' ? o : 0); im.setMatrixAt(i, mt); } g.add(im); g.position.set(x, y, z); if (p) p.add(g); return g; }
  function led(c, x, y, z, p) { return box(.16, .1, .1, c, x, y, z, p, 0, .3, { emissive: c, emissiveIntensity: .6 }); }
  function wire(pts, c, p, r) { var m = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(function (a) { return new T.Vector3(a[0], a[1], a[2]); })), 24, r || .05, 6, false), M(c, .1, .5)); if (p) p.add(m); return m; }
  function hole(x, z, p, y) { var r = new T.Mesh(new T.TorusGeometry(.14, .045, 8, 20), M(0xd4af37, .9, .3)); r.rotation.x = Math.PI / 2; r.position.set(x, (y || .08) + .01, z); p.add(r); var d = new T.Mesh(new T.CircleGeometry(.12, 16), new T.MeshBasicMaterial({ color: 0x05070a })); d.rotation.x = -Math.PI / 2; d.position.set(x, (y || .08) + .012, z); p.add(d); }
  function smd(g, list, y) { list.forEach(function (a) { box(a[2] || .22, .07, a[3] || .12, a[4] || 0x1c1c1c, a[0], (y || .08) + .04, a[1], g, .2, .5); }); }

  /* ---------- pin labels ---------- */
  function kind(n) { var u = n.toUpperCase(); if (/^(GND|G)$/.test(u)) return ['#d1d5db', '#111827']; if (/^(5V|3V3|3\.3V|VIN|VCC|VDD|\+5V|\+12V|VBUS|VSYS|5V\/VIN)$/.test(u)) return ['#fecaca', '#7f1d1d']; if (/^A\d|^ADC|^A0$/.test(u)) return ['#fde68a', '#78350f']; if (/RST|EN$|RESET|AREF|IOREF|^NC$|RSV/.test(u)) return ['#e9d5ff', '#4c1d95']; if (/SDA|SCL|SDI|SCK|MOSI|MISO|TX|RX/.test(u)) return ['#bbf7d0', '#14532d']; return ['#cffafe', '#083344']; }
  /* pin names as upright tags, staggered over four heights with leader lines so they stay readable. axis x: pins run along x; axis z: along z */
  function tagCanvas(nm) { var k = kind(nm), cv = document.createElement('canvas'); cv.width = 256; cv.height = 72; var c = cv.getContext('2d'); c.fillStyle = 'rgba(8,12,20,.88)'; (c.roundRect || c.rect).call(c, 3, 5, 250, 62, 16); c.fill(); c.strokeStyle = k[0]; c.lineWidth = 3.5; c.stroke(); c.fillStyle = k[0]; var f = 40; c.font = '800 ' + f + 'px Inter, Arial'; var tw = c.measureText(nm).width; if (tw > 226) { f = Math.floor(f * 226 / tw); c.font = '800 ' + f + 'px Inter, Arial'; } c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(nm, 128, 38); return [cv, k[0]]; }
  function pinTags(g, names, cx, z, pitch, axis, lift, y) {
    var n = names.length, len = n * pitch, grp = g.userData.labels;
    names.forEach(function (nm, i) {
      var o = -len / 2 + pitch * (i + .5), px = axis === 'z' ? cx : cx + o, pz = axis === 'z' ? z + o : z, lv = i % 4, ty = (y || .08) + 1.25 + lv * .3 + (lift || 0);
      var cc = tagCanvas(nm), sp = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(cc[0]), depthTest: false, transparent: true })); sp.scale.set(.78, .78 * 72 / 256, 1); sp.position.set(px, ty, pz); sp.renderOrder = 30; grp.add(sp);
      var ln = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(px, (y || .08) + .75, pz), new T.Vector3(px, ty - .1, pz)]), new T.LineBasicMaterial({ color: new T.Color(cc[1]), transparent: true, opacity: .55 })); grp.add(ln);
    });
  }
  function silk(g, names, cx, z, pitch, inward, y) { pinTags(g, names, cx, z, pitch, 'x', 0, y); }
  function silkZ(g, names, x, cz, pitch, inward, y) { pinTags(g, names, x, cz, pitch, 'z', 0, y); }
  /* sprite label above a point */
  function tag(g, text, x, y, z, col) {
    var cv = document.createElement('canvas'); cv.width = 256; cv.height = 72; var c = cv.getContext('2d'); var k = col ? [col, '#000'] : kind(text); c.fillStyle = 'rgba(8,12,20,.82)'; (c.roundRect || c.rect).call(c, 4, 6, 248, 60, 14); c.fill(); c.strokeStyle = k[0]; c.lineWidth = 3; c.stroke(); c.fillStyle = k[0]; c.font = '800 34px Inter, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 128, 38);
    var s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(cv), depthTest: false, transparent: true })); s.scale.set(1.3, .365, 1); s.position.set(x, y, z); s.renderOrder = 20; g.userData.labels.add(s); return s;
  }
  function withLabels(g) { g.userData.labels = new T.Group(); g.add(g.userData.labels); return g; }
  function rows(g, defs) { defs.forEach(function (d) { if (d.v) silkZ(g, d.names, d.x, d.z, d.pitch || .254, d.inward || 0, d.y || .08); else silk(g, d.names, d.cx, d.z, d.pitch || .254, d.inward || 0, d.y || .08); }); }

  /* ---------- upgrade existing parts: realism + labels ---------- */
  var orig = {}; Object.keys(B).forEach(function (k) { orig[k] = B[k]; });
  B.uno = function () {
    var g = withLabels(orig.uno()), y = .08;
    [[-3.1, -2.1], [3.1, -2.1 + .55], [-3.1, 2.1], [2.9, 2.1]].forEach(function (a) { hole(a[0], a[1], g); });
    /* ICSP headers, infinity logo, more SMD parts, mains reset */
    pins(3, .254, 3.05, y, 0, g, 'z'); box(.5, .25, .76, 0x15171c, 3.05, y + .125, 0, g); box(.76, .25, .5, 0x15171c, -2.55, y + .125, -.2, g);
    smd(g, [[1.2, 1.55], [1.5, 1.55], [1.8, 1.55], [.4, .9], [.4, 1.2], [-.1, -.6], [-.5, -.9], [2.6, .6], [2.6, .9], [2.6, 1.2]]);
    var l1 = new T.Mesh(new T.TorusGeometry(.2, .035, 8, 24), M(0xe8fbff, 0, .4)); l1.rotation.x = Math.PI / 2; l1.position.set(.55, y + .02, .1); g.add(l1); var l2 = l1.clone(); l2.position.x = .98; g.add(l2);
    txt('DIGITAL (PWM ~)', 2.6, .3, 1.0, y + .02, -1.85, g, '#e8fbff', 26); txt('POWER', 1.5, .3, -.85, y + .02, 1.85, g, '#e8fbff', 26); txt('ANALOG IN', 1.6, .3, 2.45, y + .02, 1.85, g, '#e8fbff', 26);
    rows(g, [{ names: ['SCL', 'SDA', 'AREF', 'GND', '~13', '~12', '~11', '~10', '~9', '8'].map(function (s) { return s.replace(/^~?(\d+)$/, function (m, d) { return (m[0] === '~' ? '~D' : 'D') + d; }); }), cx: -.56, z: -2.35, inward: .62 },
    { names: ['D7', '~D6', '~D5', 'D4', '~D3', 'D2', 'D1 TX', 'D0 RX'], cx: 2.13, z: -2.35, inward: .62 },
    { names: ['NC', 'IOREF', 'RESET', '3V3', '5V', 'GND', 'GND', 'VIN'], cx: .115, z: 2.35, inward: -.62 },
    { names: ['A0', 'A1', 'A2', 'A3', 'A4 SDA', 'A5 SCL'], cx: 2.29, z: 2.35, inward: -.62 }]);
    return g;
  };
  B.esp32 = function () {
    var g = withLabels(orig.esp32()), y = .08; [[-2.5, -1.1], [-2.5, 1.1], [2.4, -1.1], [2.4, 1.1]].forEach(function (a) { hole(a[0], a[1], g); });
    smd(g, [[-.4, .7], [-.1, .7], [.2, .8], [-.7, -.7], [-.4, -.75], [-1.3, 0], [-1.3, .3]]); box(.45, .06, .35, 0x0a0a0a, -.9, y + .04, .75, g); txt('EN', .4, .22, -1.55, y + .02, -.45, g, '#fff', 30); txt('BOOT', .6, .22, -1.55, y + .02, .45, g, '#fff', 26);
    var L = ['3V3', 'EN', 'VP 36', 'VN 39', 'IO34', 'IO35', 'IO32', 'IO33', 'IO25', 'IO26', 'IO27', 'IO14', 'IO12', 'GND', 'IO13', 'SD2', 'SD3', 'CMD', '5V'], R = ['GND', 'IO23', 'IO22', 'TX0', 'RX0', 'IO21', 'GND', 'IO19', 'IO18', 'IO5', 'IO17', 'IO16', 'IO4', 'IO0', 'IO2', 'IO15', 'SD1', 'SD0', 'CLK'];
    silk(g, L.slice().reverse(), -.1, -1.2, .254, .62, y); silk(g, R.slice().reverse(), -.1, 1.2, .254, -.62, y); return g;
  };
  B.pico = function () {
    var g = withLabels(orig.pico()), y = .08; [[-2.4, -.8], [-2.4, .8], [2.4, -.8], [2.4, .8]].forEach(function (a) { hole(a[0], a[1], g); }); smd(g, [[1.2, .4], [1.5, .4], [.9, -.4], [-.9, -.3]]);
    var Lp = ['GP0', 'GP1', 'GND', 'GP2', 'GP3', 'GP4', 'GP5', 'GND', 'GP6', 'GP7', 'GP8', 'GP9', 'GND', 'GP10', 'GP11', 'GP12', 'GP13', 'GND', 'GP14', 'GP15'], Rp = ['VBUS', 'VSYS', 'GND', '3V3 EN', '3V3', 'ADC REF', 'GP28', 'GND', 'GP27', 'GP26', 'RUN', 'GP22', 'GND', 'GP21', 'GP20', 'GP19', 'GP18', 'GND', 'GP17', 'GP16'];
    silk(g, Lp.slice().reverse(), 0, -.9, .254, .62, y); silk(g, Rp.slice().reverse(), 0, .9, .254, -.62, y); return g;
  };
  B.hc05 = function () { var g = withLabels(orig.hc05()); [['EN', 0], ['VCC', 1], ['GND', 2], ['TXD', 3], ['RXD', 4], ['STATE', 5]].forEach(function (a) { tag(g, a[0], -1.9, .9 + .0, -.635 + a[1] * .254 * 1 + (-0.0), a[0] === 'VCC' || a[0] === 'GND' ? undefined : undefined); }); g.userData.labels.children.forEach(function (s, i) { s.position.set(-2.55, 1.4 + (i % 2) * .5, -.635 + i * .254 * 1); s.scale.set(.9, .26, 1); }); return g; };
  B.hcsr04 = function () { var g = withLabels(orig.hcsr04()); ['VCC', 'TRIG', 'ECHO', 'GND'].forEach(function (n, i) { var s = tag(g, n, -.38 + i * .254 * 1.0 * 1.0 - .0, 1.6 + (i % 2) * .5, 1.35); s.scale.set(.7, .2, 1); s.position.x = -.38 + i * .254; }); return g; };
  B.relay = function () { var g = withLabels(orig.relay()); ['IN', 'GND', 'VCC'].forEach(function (n, i) { var s = tag(g, n, -2.95, 1.2 + i * .0, -1.0 + (i - 1) * .254 - .0); s.scale.set(.6, .17, 1); s.position.set(-2.95, 1.0 + (i % 2) * .4, -1.0 + (i - 1) * .254 * 1.6); }); ['COM', 'NO', 'NC'].forEach(function (n, i) { var s = tag(g, n, .5 + (i - 1) * .7, 2.0, 1.15, '#fde68a'); s.scale.set(.6, .17, 1); }); return g; };
  B.oled = function () { var g = withLabels(orig.oled()); ['GND', 'VCC', 'SCL', 'SDA'].forEach(function (n, i) { var s = tag(g, n, -.38 + i * .254, 1.2 + (i % 2) * .4, -1.2); s.scale.set(.6, .17, 1); s.position.x = -.38 + i * .254; }); return g; };
  B.dht11 = function () { var g = withLabels(orig.dht11()); ['VCC', 'DATA', 'NC', 'GND'].forEach(function (n, i) { var s = tag(g, n, -.5 + i * .33, -.9, 0, n === 'NC' ? '#e9d5ff' : undefined); s.scale.set(.6, .17, 1); }); return g; };
  B.servo = function () { var g = withLabels(orig.servo()); [['GND', '#d1d5db', -.25], ['5V', '#fecaca', 0], ['SIGNAL', '#fdba74', .25]].forEach(function (a, i) { var s = tag(g, a[0], 3.7, .9 + i * .0, a[2] * 2.4, a[1]); s.scale.set(.8, .23, 1); }); return g; };

  /* ---------- new parts ---------- */
  B.nano = function () {
    var g = withLabels(new T.Group()), y = .08; pcb(4.5, 1.8, 0x0b6a8c, g); box(.9, .55, .75, 0xc0c8d4, -2.15, y + .28, 0, g, .9, .25); box(.95, .12, .95, 0x15171c, .45, y + .06, 0, g); box(.55, .06, .55, 0x15171c, -.5, y + .03, 0, g); cyl(.15, .25, 0xc9ccd1, -1.0, y + .12, -.45, g, 'x', .85, .3); box(.4, .2, .3, 0xc0c8d4, 1.5, y + .1, 0, g, .9, .25); led(0x22c55e, 1.9, y + .05, -.3, g); led(0xf59e0b, 1.9, y + .05, .3, g);
    pins(15, .254, .2, y, .77, g, 'x'); pins(15, .254, .2, y, -.77, g, 'x'); smd(g, [[1.0, .4], [1.0, -.4], [-.2, .5], [-.2, -.5]]); txt('NANO', 1.0, .3, 1.2, y + .02, 0, g, '#e8fbff', 36);
    var Lc = ['D1 TX', 'D0 RX', 'RST', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'], Rc = ['VIN', 'GND', 'RST', '5V', 'A7', 'A6', 'A5', 'A4 SDA', 'A3', 'A2', 'A1', 'A0', 'AREF', '3V3', 'D13'];
    silk(g, Lc, .2, .77, .254, -.62, y); silk(g, Rc, .2, -.77, .254, .62, y); return g;
  };
  B.nodemcu = function () {
    var g = withLabels(new T.Group()), y = .08; pcb(5.8, 2.6, 0x14181d, g); box(2.4, .26, 1.6, 0xc9ced6, 1.5, y + .13, 0, g, .9, .3); box(.8, .03, 1.6, 0x0a0a0a, 2.55, y + .02, 0, g); txt('ESP-12E', 1.4, .4, 1.5, y + .28, 0, g, '#222', 36); box(.85, .3, .75, 0xb8c0cc, -2.8, y + .15, 0, g, .9, .25); box(.55, .22, .45, 0x15171c, -2.0, y + .1, .5, g); box(.5, .25, .5, 0x20242b, -1.3, y + .12, -.4, g); box(.4, .2, .3, 0xe5e7eb, -1.9, y + .1, -.7, g); box(.4, .2, .3, 0xe5e7eb, -1.9, y + .1, .9, g); led(0x3b82f6, -.9, y + .05, .8, g);
    pins(15, .254, -.2, y, -1.1, g, 'x'); pins(15, .254, -.2, y, 1.1, g, 'x'); smd(g, [[-.6, .6], [-.3, .6], [-.6, -.6]]);
    var Lc = ['A0', 'RSV', 'RSV', 'SD3', 'SD2', 'SD1', 'CMD', 'SD0', 'CLK', 'GND', '3V3', 'EN', 'RST', 'GND', 'VIN'], Rc = ['D0', 'D1', 'D2', 'D3', 'D4', '3V3', 'GND', 'D5', 'D6', 'D7', 'D8', 'RX', 'TX', 'GND', '3V3'];
    silk(g, Lc.slice().reverse(), -.2, -1.1, .254, .62, y); silk(g, Rc.slice().reverse(), -.2, 1.1, .254, -.62, y); return g;
  };
  B.l298n = function () {
    var g = withLabels(new T.Group()), y = .08; pcb(4.3, 4.3, 0xb91c1c, g);
    box(1.5, 1.7, .55, 0x15171c, 0, y + .85, -.9, g, .3, .5); for (var i = -3; i <= 3; i++) box(1.5, 1.5, .06, 0x2a2d33, 0, y + .8, -1.1 + i * 0 - .35 + .0 - .0, g, .4, .45).position.set(0, y + .85, -1.25 - i * 0 + 0 - .0), g.children[g.children.length - 1].position.set(0, y + .85, -1.2 - 0);
    for (var k = 0; k < 7; k++) { var f = box(1.55, 1.1, .05, 0x1f2227, 0, y + 1.0, -.98 + k * .0 - .0 + (k - 3) * .14 * 1.0 + .0, g, .4, .45); f.position.z = -.9 + (k - 3) * .16 + .0; f.position.y = y + 1.35; }
    box(1.0, .55, .9, 0x0e0e10, 0, y + .28, .7, g);
    [[-1.65, -1.05], [-1.65, 0.0], [1.65, -1.05], [1.65, 0.0], [-.6, 1.8], [0, 1.8], [.6, 1.8]].forEach(function (a, i) { box(.7, .75, .75, 0x2563eb, a[0] * (i < 4 ? 1 : 1), y + .38, a[1] + (i < 4 ? .5 : 0), g, 0, .5); [-.15, .15].forEach(function (s) { cyl(.11, .06, 0xd4af37, a[0] + (i < 4 ? 0 : 0), y + .78, a[1] + (i < 4 ? .5 : 0) + s * 1, g, null, .9, .3); }); });
    cyl(.35, .9, 0x222831, -1.2, y + .45, 1.1, g); cyl(.35, .9, 0x222831, 1.2, y + .45, 1.1, g); box(.3, .25, .3, 0xe5e7eb, 1.2, y + .12, .0, g);
    pins(6, .254, 1.2, y, -1.9, g, 'x'); pins(2, .254, -1.6, y, -1.9, g, 'x'); smd(g, [[-.4, 1.3], [.4, 1.3], [0, 1.0]]);
    txt('L298N', 1.2, .35, -.0, y + .02, 1.2, g, '#fff', 36);
    [['OUT1', -2.35, -.55, '#fde68a'], ['OUT2', -2.35, .45, '#fde68a'], ['OUT3', 2.35, -.55, '#fde68a'], ['OUT4', 2.35, .45, '#fde68a'], ['12V', -.75, 2.55, '#fecaca'], ['GND', 0, 2.55, '#d1d5db'], ['5V', .75, 2.55, '#fecaca']].forEach(function (a) { var s = tag(g, a[0], a[1], 1.5, a[2] * (a[2] > 2 ? 1 : 1) + (a[2] > 2 ? 0 : 0), a[3]); s.scale.set(.75, .21, 1); s.position.set(a[1], 1.7, a[2]); });
    var hn = ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB']; silk(g, hn, 1.2, -1.9, .254, .55, y); return g;
  };
  B.stepper = function () {
    var g = withLabels(new T.Group()), y = 0, can = cyl(1.4, 1.9, 0xb0b7c3, -2.4, .95, 0, g, null, .85, .35, 40); cyl(1.38, .08, 0x9aa1ad, -2.4, 1.92, 0, g, null, .8, .3, 40); cyl(.25, .8, 0xd8dde4, -2.4, 2.35, 0, g, null, .9, .25);
    box(.4, 0.9, .12, 0xd8dde4, -2.4, 2.4, .2, g, .9, .25); [-1, 1].forEach(function (s) { box(1.0, .12, .7, 0xb0b7c3, -2.4 + s * 1.7, 1.55, 0, g, .85, .35); cyl(.13, .13, 0x0f172a, -2.4 + s * 2.0, 1.62, 0, g); });
    cyl(.55, .1, 0x9aa1ad, -2.4, 1.95, 0, g, null, .8, .3); box(.9, .25, .9, 0xe5e7eb, -2.4, .55, 1.5, g, 0, .5);
    [0x1e5fd0, 0xdb2777, 0xfacc15, 0xf97316, 0xdc2626].forEach(function (c, i) { wire([[-2.4, .55, 1.9], [-1.7, .4, 2.3 + i * .02], [-.8, .25, 2.2 + (i - 2) * .12], [1.3, .15, 1.6 + (i - 2) * .12]], c, g, .04); });
    var bd = new T.Group(); bd.position.set(3.0, 0, 0); g.add(bd); pcb(3.5, 3.1, 0x1565c0, bd); box(1.9, .5, .6, 0x0e0e10, 0, .33, -.2, bd); box(.7, .35, .5, 0xe5e7eb, -1.5, .26, 1.1, bd); [0xef4444, 0xef4444, 0xef4444, 0xef4444].forEach(function (c, i) { led(c, -.5 + i * .35, .13, .8, bd); }); pins(4, .254, .35, .08, 1.35, bd, 'x'); pins(2, .254, 1.3, .08, 1.35, bd, 'x'); smd(bd, [[-.2, .5, .25, .12], [.2, .5, .25, .12]], .08); box(.35, .2, .35, 0x15171c, -1.2, .18, .2, bd);
    txt('ULN2003', 1.5, .3, .0, .1, .3, bd, '#e8f1ff', 30); ['IN1', 'IN2', 'IN3', 'IN4'].forEach(function (n, i) { var s = tag(g, n, 3.0 + .35 + (i - 1.5) * .254 - .0, 1.4, 1.35); s.scale.set(.6, .17, 1); s.position.x = 3.35 + (i - 1.5) * .254 - 0; }); tag(g, '5-12V', 4.3, 1.4, 1.35, '#fecaca').scale.set(.7, .2, 1); var gs = tag(g, 'GND', 4.05, 1.0, 1.35, '#d1d5db'); gs.scale.set(.6, .17, 1);
    g.userData.shaft = null; g.userData.update = function (t) { }; var sh = g.children[2]; g.userData.update = function (t) { sh.rotation.y = t * 1.5; }; return g;
  };
  function servoLike(blue, wiring, big) {
    var g = withLabels(new T.Group()), s = big ? 1.25 : 1; var b = new T.Group(); b.scale.set(s, s, s); g.add(b);
    box(2.25, 2.2, 1.2, blue, 0, 1.1, 0, b, .1, .5); box(3.3, .18, 1.2, blue, 0, 1.7, 0, b, .1, .5); [-1.4, 1.4].forEach(function (x) { cyl(.12, .2, 0x0f172a, x, 1.7, 0, b); }); cyl(.5, .35, blue, -.55, 2.35, 0, b, null, .1, .5);
    if (big) cyl(.34, .1, 0xd4af37, -.55, 2.58, 0, b, null, .9, .3); cyl(.2, .35, 0xe5e7eb, -.55, 2.7, 0, b, null, .6, .3); var horn = new T.Group(); box(2.4, .1, .38, 0xf3f4f6, .8, 0, 0, horn, 0, .5); cyl(.3, .12, 0xf3f4f6, 0, 0, 0, horn); horn.position.set(-.55, 2.95, 0); b.add(horn);
    [[0x7c3f1d, -.25], [0xdc2626, 0], [0xf97316, .25]].forEach(function (a) { wire([[1.12, .6, a[1]], [1.8, .45, a[1]], [2.6, .2, a[1] * 1.6], [3.4, .08, a[1] * 2]], a[0], b, .05); }); [['GND', '#d1d5db', -.5], ['5V', '#fecaca', 0], ['SIGNAL', '#fdba74', .5]].forEach(function (a) { var t = tag(g, a[0], 3.8 * s, 1.0 * s, a[2] * 2 * s, a[1]); t.scale.set(.8, .23, 1); });
    g.userData.update = function (t) { horn.rotation.y = Math.sin(t * 1.6) * 1.2; }; return g;
  }
  B.mg996r = function () { return servoLike(0x20242b, 0, true); };
  B.mpu6050 = function () {
    var g = withLabels(new T.Group()), y = .08; pcb(2.1, 1.6, 0x1d4ed8, g); box(.5, .09, .5, 0x1c1c1c, .3, y + .05, 0, g); box(.35, .09, .25, 0x23262d, -.4, y + .05, .45, g); hole(.9, .6, g); hole(.9, -.6, g); pins(8, .254, -.1, y, -.62, g, 'x'); smd(g, [[-.3, .1], [-.55, .1], [.1, -.4], [.5, -.4]]); txt('GY-521', .9, .2, .1, y + .02, .5, g, '#e8f1ff', 28);
    ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'].forEach(function (n, i) { var s = tag(g, n, -.1 + (i - 3.5) * .254, 1.2 + (i % 2) * .4, -.62); s.scale.set(.5, .15, 1); }); return g;
  };
  B.lcd1602 = function () {
    var g = withLabels(new T.Group()), y = .08; pcb(8.0, 3.6, 0x1e6f3a, g); box(7.2, .35, 2.5, 0x0b3a6b, 0, y + .18, -.05, g, .1, .4); var scr = txt('', 6.4, 1.3, 0, y + .37, -.05, g, '#bfe6ff', 40, '#1b6fc9'); g.userData.scr = scr; pins(16, .254, -2.8, y, 1.55, g, 'x');
    var bp = new T.Group(); bp.position.set(0, y, 1.55); g.add(bp); box(3.0, .3, .65, 0x15171c, 1.4, .17, 0, bp); pins(4, .254, 3.3, .1, 1.1, bp, 'z'); hole(-3.7, -1.55, g); hole(3.7, -1.55, g); hole(-3.7, 1.55, g); hole(3.7, 1.55, g); cyl(.25, .18, 0x2563eb, 1.2, .2, .0, bp); txt('I2C', .8, .22, .0, .3, 0, bp, '#fff', 28);
    function draw(t) { var cv = scr.userData.cv, c = cv.getContext('2d'); c.fillStyle = '#1b6fc9'; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = '#e8f6ff'; c.font = '700 40px monospace'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('V-NODE  Temp', 14, cv.height * .3); c.fillText((24 + Math.sin(t) * 2).toFixed(1) + ' C  OK', 14, cv.height * .72); scr.userData.tex.needsUpdate = true; } draw(0); var last = 0; g.userData.update = function (t) { if (t - last > .5) { last = t; draw(t); } };
    ['GND', 'VCC', 'SDA', 'SCL'].forEach(function (n, i) { var s = tag(g, n, 4.35, 1.3 + (i % 2) * .4, 1.1 + (i - 1.5) * .254 * 1.0); s.scale.set(.6, .17, 1); s.position.set(4.6, 1.1 + (i % 2) * .4, 1.55 + (i - 1.5) * .3); }); return g;
  };
  B.pir = function () {
    var g = withLabels(new T.Group()), y = .08; pcb(3.2, 2.4, 0x2e7d32, g); var dome = new T.Mesh(new T.SphereGeometry(1.1, 36, 20, 0, Math.PI * 2, 0, Math.PI / 2), M(0xf5f5f0, 0, .35, { transparent: true, opacity: .95 })); dome.scale.y = .8; dome.position.set(.3, y + .55, 0); g.add(dome); box(.9, .3, .9, 0xb8c0cc, .3, y + .2, 0, g, .8, .3);
    for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; box(.04, .6, .04, 0xe5e7eb, .3 + Math.cos(a) * .75, y + .62, Math.sin(a) * .75, g, 0, .5).rotation.y = a; }
    cyl(.22, .3, 0xf59e0b, -1.2, y + .15, -.7, g); cyl(.22, .3, 0xf59e0b, -1.2, y + .15, .7, g); box(.5, .2, .35, 0x15171c, -1.2, y + .1, 0, g); pins(3, .254, 1.4, y, 0, g, 'z'); smd(g, [[-.6, .9], [-.6, -.9], [.9, .9]]);
    ['VCC', 'OUT', 'GND'].forEach(function (n, i) { var s = tag(g, n, 2.0, 1.2 + (i % 2) * .4, (i - 1) * .254); s.scale.set(.6, .17, 1); s.position.set(2.1, 1.2 + (i % 2) * .4, (i - 1) * .3); }); return g;
  };
  B.soil = function () {
    var g = withLabels(new T.Group()), y = .08; var pr = new T.Group(); g.add(pr); box(2.2, .12, 6.0, 0x1b1d22, 0, 0, -3.0, pr, .1, .5); [-.5, .5].forEach(function (x) { box(.5, .02, 5.2, 0xd4af37, x, .08, -3.3, pr, .9, .3); }); var tip = new T.Mesh(new T.CylinderGeometry(1.1, 0, .12, 4), M(0x1b1d22, .1, .5)); tip.rotation.y = Math.PI / 4; tip.scale.set(1, 1, 1); tip.position.set(0, 0, -6.4); tip.rotation.x = 0;
    pcb(3.0, 2.2, 0x1565c0, g); box(.6, .25, .5, 0x15171c, .4, y + .12, .3, g); cyl(.22, .3, 0x2563eb, -.7, y + .15, .4, g); led(0xef4444, .3, y + .05, -.5, g); led(0x22c55e, .7, y + .05, -.5, g); pins(4, .254, .0, y, 1.0, g, 'x'); smd(g, [[.9, .0], [1.1, .3]]);
    ['AO', 'DO', 'GND', 'VCC'].forEach(function (n, i) { var s = tag(g, n, 0, 1.2 + (i % 2) * .4, 1.0, n === 'VCC' ? '#fecaca' : n === 'GND' ? '#d1d5db' : '#fde68a'); s.scale.set(.5, .15, 1); s.position.x = (i - 1.5) * .254; }); g.position.z = 2.6; return g;
  };
  B.buzzer = function () {
    var g = withLabels(new T.Group()); cyl(.62, .95, 0x15171c, 0, .48, 0, g); cyl(.15, .02, 0x0a0a0a, 0, .96, 0, g); box(.25, .01, .06, 0xe5e7eb, -.3, .97, -.3, g); box(.06, .01, .25, 0xe5e7eb, -.3, .97, -.3, g);
    [-.25, .25].forEach(function (x, i) { cyl(.03, 1.0, 0xc0c8d4, x * 2, -.45, 0, g, null, .9, .3); }); var w = cyl(.65, .02, 0xd4af37, 0, .0, 0, g); w.visible = false; var rings = new T.Group(); for (var i = 0; i < 3; i++) { var r = new T.Mesh(new T.TorusGeometry(.8 + i * .35, .02, 6, 40), new T.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: .4 })); r.rotation.x = Math.PI / 2; r.position.y = 1.0; rings.add(r); } g.add(rings);
    tag(g, '+  long leg', -.5, -.3, .8, '#fecaca').scale.set(1.0, .27, 1); tag(g, '-', .5, -.3, .8, '#d1d5db').scale.set(.4, .14, 1); g.userData.update = function (t) { rings.children.forEach(function (r, i) { var k = (t * 1.2 + i / 3) % 1; r.scale.setScalar(.5 + k); r.material.opacity = .5 * (1 - k); r.position.y = 1.0 + k * .4; }); }; return g;
  };
  B.mq2 = function () {
    var g = withLabels(new T.Group()), y = .08; pcb(3.2, 2.2, 0x1565c0, g); var c = cyl(.8, 1.0, 0xc9ced6, -.5, y + .5, 0, g, null, .85, .4, 36); cyl(.72, .04, 0x777d86, -.5, y + 1.01, 0, g); for (var i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; box(.04, .04, .04, 0x1b1d22, -.5 + Math.cos(a) * .5 * Math.random(), y + 1.04, Math.sin(a) * .5 * Math.random(), g); } box(.5, .3, .5, 0x15171c, 1.0, y + .15, -.3, g); cyl(.22, .3, 0x2563eb, 1.0, y + .15, .5, g); led(0xef4444, 1.3, y + .05, .0, g); pins(4, .254, .3, y, 1.0, g, 'x'); smd(g, [[1.2, .5], [1.2, .7]]);
    ['VCC', 'GND', 'DO', 'AO'].forEach(function (n, i) { var s = tag(g, n, .3, 1.5 + (i % 2) * .4, 1.0); s.scale.set(.5, .15, 1); s.position.x = .3 + (i - 1.5) * .254; }); return g;
  };

  /* ---------- helper for project scenes ---------- */
  function put(g, o, x, z, ry) { o.position.set(x, 0, z); if (ry) o.rotation.y = ry; g.add(o); return o; }
  function scene() { return new T.Group(); }
  function ledPart(c, x, z, g) { var l = new T.Group(); cyl(.25, .1, 0x222222, 0, .05, 0, l); var body = new T.Mesh(new T.CylinderGeometry(.25, .25, .5, 20), M(c, 0, .2, { transparent: true, opacity: .85, emissive: c, emissiveIntensity: .1 })); body.position.y = .35; l.add(body); var dome = new T.Mesh(new T.SphereGeometry(.25, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), body.material); dome.position.y = .6; l.add(dome); cyl(.02, .8, 0xc0c8d4, -.1, -.2, 0, l); cyl(.02, .6, 0xc0c8d4, .1, -.1, 0, l); l.position.set(x, 0, z); l.userData.m = body.material; g.add(l); return l; }
  function btn(x, z, g) { var b = new T.Group(); box(.9, .35, .9, 0x20242b, 0, .18, 0, b); cyl(.28, .22, 0xdc2626, 0, .45, 0, b); b.position.set(x, 0, z); b.userData.cap = b.children[1]; g.add(b); return b; }
  function resPart(x, z, g, ry) { var r = new T.Group(); cyl(.12, .8, 0xd9b88a, 0, .15, 0, r, 'x'); [[-.25, 0x7c3f1d], [-.1, 0x111111], [.05, 0xdc2626], [.28, 0xd4af37]].forEach(function (a) { cyl(.125, .05, a[1], a[0], .15, 0, r, 'x'); }); cyl(.025, 1.4, 0xc0c8d4, 0, .1, 0, r, 'x'); r.position.set(x, 0, z); if (ry) r.rotation.y = ry; g.add(r); return r; }
  function potPart(x, z, g) { var p = new T.Group(); cyl(.55, .5, 0x1e5aa8, 0, .25, 0, p); cyl(.3, .5, 0xe5e7eb, 0, .7, 0, p); var k = box(.1, .1, .5, 0x111111, 0, .96, 0, p); p.userData.knob = k; p.position.set(x, 0, z); g.add(p); return p; }
  function ldrPart(x, z, g) { var l = new T.Group(); cyl(.5, .25, 0xd8a24a, 0, .12, 0, l); cyl(.4, .04, 0x7b1f12, 0, .26, 0, l); l.position.set(x, 0, z); g.add(l); return l; }
  function rings(color, n) { var gg = new T.Group(), arr = []; for (var i = 0; i < n; i++) { var r = new T.Mesh(new T.TorusGeometry(1, .03, 6, 40), new T.MeshBasicMaterial({ color: color, transparent: true, opacity: .5 })); r.rotation.x = Math.PI / 2; gg.add(r); arr.push(r); } gg.userData.update = function (t, speed, maxR, h) { arr.forEach(function (m, i) { var k = (t * speed + i / n) % 1; m.scale.setScalar(.3 + k * maxR); m.material.opacity = .55 * (1 - k); m.position.y = (h || 0) * k; }); }; return gg; }
  function lampBulb(x, z, g) { var l = new T.Group(); cyl(.35, .4, 0xb8c0cc, 0, .2, 0, l, null, .8, .3); var bm = new T.MeshStandardMaterial({ color: 0xfff1b8, emissive: 0xffd34d, emissiveIntensity: .05, transparent: true, opacity: .9 }); var bl = new T.Mesh(new T.SphereGeometry(.6, 24, 16), bm); bl.position.y = 1.0; l.add(bl); l.userData.m = bm; l.position.set(x, 0, z); g.add(l); return l; }
  function fanPart(x, z, g) { var f = new T.Group(); box(2.6, 2.6, .5, 0x20242b, 0, 1.3, 0, f); var rot = new T.Group(); rot.position.y = 1.3; rot.position.z = .3; for (var i = 0; i < 5; i++) { var b = box(.5, 1.0, .06, 0xe5e7eb, 0, .6, 0, rot); var pv = new T.Group(); pv.rotation.z = i / 5 * Math.PI * 2; pv.add(b); rot.add(pv); } cyl(.25, .3, 0x0f172a, 0, 0, .0, rot, 'z'); f.add(rot); f.userData.rot = rot; f.position.set(x, 0, z); f.rotation.y = -.6; g.add(f); return f; }
  function dcMotor(x, z, g) { var m = new T.Group(); cyl(.75, 2.4, 0xc0c8d4, 0, .75, 0, m, 'x', .85, .35); cyl(.7, .6, 0x20242b, -1.4, .75, 0, m, 'x'); var sh = cyl(.12, 1.0, 0xe5e7eb, 1.7, .75, 0, m, 'x', .9, .3); var wheel = new T.Group(); wheel.position.set(2.2, .75, 0); for (var i = 0; i < 4; i++) { var bl = box(.08, 1.6, .5, 0xfbbf24, 0, 0, 0, wheel); bl.rotation.x = i * Math.PI / 4; } m.add(wheel); m.userData.wheel = wheel; m.position.set(x, 0, z); g.add(m); return m; }
  function pulse(m, on) { if (m && m.userData.m) m.userData.m.emissiveIntensity = on ? 1.4 : .1; }

  /* ---------- 12 new project scenes ---------- */
  P.traffic = function () { var g = scene(); put(g, B.uno(), 0, 4.5); var L = [ledPart(0xef4444, -3, -2, g), ledPart(0xfacc15, 0, -2, g), ledPart(0x22c55e, 3, -2, g)]; [-3, 0, 3].forEach(function (x) { resPart(x, -.5, g, Math.PI / 2); }); g.userData.update = function (t) { var s = Math.floor(t / 1.6) % 4; pulse(L[0], s === 0); pulse(L[1], s === 1 || s === 3); pulse(L[2], s === 2); }; return g; };
  P.button = function () { var g = scene(); put(g, B.uno(), 0, 4.5); var b = btn(-3, -2, g), l = ledPart(0x22c55e, 3, -2, g); resPart(3, -.6, g, Math.PI / 2); g.userData.update = function (t) { var on = Math.sin(t * 1.2) > 0; b.userData.cap.position.y = on ? .36 : .45; pulse(l, on); }; return g; };
  P.dimmer = function () { var g = scene(); put(g, B.uno(), 0, 4.5); var p = potPart(-3, -2, g), l = ledPart(0xfbbf24, 3, -2, g); resPart(3, -.6, g, Math.PI / 2); g.userData.update = function (t) { var v = (Math.sin(t * .8) + 1) / 2; p.userData.knob.rotation.y = v * 4 - 2; l.userData.m.emissiveIntensity = .1 + v * 1.8; }; return g; };
  P.nightlamp = function () { var g = scene(); put(g, B.uno(), 0, 4.5); var ld = ldrPart(-3, -2, g); resPart(-3, -.4, g, Math.PI / 2); var l = ledPart(0xfff1b8, 3, -2, g); resPart(3, -.6, g, Math.PI / 2); var sun = new T.Mesh(new T.SphereGeometry(.7, 20, 14), new T.MeshBasicMaterial({ color: 0xfde68a })); sun.position.set(-3, 4, -2); g.add(sun); g.userData.update = function (t) { var day = Math.sin(t * .7) > 0; sun.visible = day; pulse(l, !day); }; return g; };
  P.pir = function () { var g = scene(); put(g, B.uno(), 0, 4.5); put(g, B.pir(), -3, -2); put(g, B.buzzer(), 3.5, -2); var rg = rings(0xf59e0b, 3); rg.position.set(-3, .3, -2); g.add(rg); var man = new T.Group(); cyl(.25, 1.4, 0x64748b, 0, .8, 0, man); var hd = new T.Mesh(new T.SphereGeometry(.28, 14, 10), M(0x94a3b8)); hd.position.y = 1.7; man.add(hd); g.add(man); g.userData.update = function (t) { var x = -8 + ((t * 1.1) % 10); man.position.set(x, 0, -1); rg.userData.update(t, .8, 1.6, 0); var near = Math.abs(x + 3) < 2.2; rg.visible = true; g.children.forEach(function (c) { if (c.userData.update && c !== g) c.userData.update(near ? t : 0); }); }; return g; };
  P.lcdtemp = function () { var g = scene(); put(g, B.uno(), 0, 5); put(g, B.lcd1602(), 0, -3); put(g, B.dht11(), 6, 5); g.userData.update = function (t) { g.children.forEach(function (c) { if (c.userData.update) c.userData.update(t); }); }; return g; };
  P.soil = function () { var g = scene(); put(g, B.uno(), 0, 5); put(g, B.soil(), -4, -4); var l = ledPart(0xef4444, 3, -2, g), b = put(g, B.buzzer(), 5.5, -2); var pot = new T.Mesh(new T.CylinderGeometry(1.4, 1.0, 1.6, 24), M(0x9a4d2a, 0, .8)); pot.position.set(-4, .8, -9); g.add(pot); var soil = new T.Mesh(new T.CylinderGeometry(1.3, 1.3, .1, 24), M(0x3b2a1a, 0, 1)); soil.position.set(-4, 1.55, -9); g.add(soil); g.userData.update = function (t) { var dry = Math.sin(t * .6) > 0; pulse(l, dry); b.userData.update(dry ? t : 0); soil.material.color.setHex(dry ? 0x8a6a45 : 0x2c1f12); }; return g; };
  P.relaylamp = function () { var g = scene(); put(g, B.uno(), 0, 5); var rl = put(g, B.relay(), 1, -2); var bt = btn(-4, 3, g); var lamp = lampBulb(7, -2, g); g.userData.update = function (t) { var on = Math.sin(t * 1.1) > 0; rl.userData.update(on ? t : 0); bt.userData.cap.position.y = on ? .36 : .45; lamp.userData.m.emissiveIntensity = on ? 1.8 : .05; }; return g; };
  P.stepper = function () { var g = scene(); put(g, B.uno(), 0, 6); var st = put(g, B.stepper(), -2, -3); var pt = potPart(6, 0, g); g.userData.update = function (t) { st.userData.update(t); pt.userData.knob.rotation.y = Math.sin(t * .6) * 2; }; return g; };
  P.motor = function () { var g = scene(); put(g, B.uno(), 0, 6); put(g, B.l298n(), -1, -2); var m = dcMotor(7, -3, g), pt = potPart(6, 3, g); g.userData.update = function (t) { var v = (Math.sin(t * .6) + 1) / 2; m.userData.wheel.rotation.x += v * .45; pt.userData.knob.rotation.y = v * 4 - 2; }; return g; };
  P.gas = function () { var g = scene(); put(g, B.uno(), 0, 5); put(g, B.mq2(), -4, -2); var l = ledPart(0xef4444, 2.5, -2, g), b = put(g, B.buzzer(), 5, -2); var smoke = rings(0x94a3b8, 4); smoke.position.set(-4, 1.2, -2); g.add(smoke); g.userData.update = function (t) { var gas = Math.sin(t * .7) > .2; smoke.visible = gas; smoke.userData.update(t, .5, 1.4, 3); pulse(l, gas && Math.sin(t * 10) > 0); b.userData.update(gas ? t : 0); }; return g; };
  P.parking = function () { var g = scene(); put(g, B.uno(), 0, 5); put(g, B.hcsr04(), -3, -3); var L = [ledPart(0x22c55e, 2, -2, g), ledPart(0xfacc15, 3.3, -2, g), ledPart(0xef4444, 4.6, -2, g)]; var b = put(g, B.buzzer(), 7, -2); var car = new T.Group(); var cb = new T.Mesh(new T.BoxGeometry(2, .8, 4), M(0x3b82f6, .3, .4)); cb.position.y = .6; car.add(cb); g.add(car); var rg = rings(0x67e8f9, 3); rg.position.set(-3, 1, -4.3); g.add(rg); g.userData.update = function (t) { var d = 9 + Math.sin(t * .6) * 6; car.position.set(-3, 0, -4.3 - d); car.rotation.y = 0; rg.userData.update(t, .9, 2.2, 0); var near = d < 6.5, mid = d < 10, far = true; pulse(L[0], far); pulse(L[1], mid); pulse(L[2], near); b.userData.update(near ? t : 0); }; return g; };
  P.esp32web = function () { var g = scene(); put(g, B.esp32(), 0, 4); var l = ledPart(0x3b82f6, 2, -2, g); resPart(2, -.8, g, Math.PI / 2); var ph = new T.Group(); box(1.7, .12, 3.2, 0x111418, 0, 0, 0, ph, .2, .4); var sc = box(1.5, .02, 2.9, 0x2563eb, 0, .08, 0, ph, 0, .3, { emissive: 0x2563eb, emissiveIntensity: .3 }); ph.position.set(-5, .1, -3); ph.rotation.y = .5; g.add(ph); var rg = rings(0xa78bfa, 3); rg.position.set(0, .5, 4); g.add(rg); g.userData.update = function (t) { var on = Math.sin(t * 1.3) > 0; rg.userData.update(t, .6, 2.5, 2.5); pulse(l, on); sc.material.emissiveIntensity = on ? .9 : .25; }; return g; };
})(window);
