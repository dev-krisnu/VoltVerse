/* Circuit breakers: MCB, MCCB, RCCB, ACB, VCB. 1 unit = 10 mm. update(t 0..1, time, mode). */
(function () {
  'use strict';
  var T = THREE, C = window.CAT, B = C.build = {}, K = KIT, M = K.M, k = K.K, G = K.G, box = K.box, cyl = K.cyl, PART = K.PART, PI = Math.PI, seg = K.seg, lerp = K.lerp;

  /* one thermal-magnetic pole, standing up: top terminal y+, bottom terminal y-, front z+. s scales the mechanism */
  function pole(o) {
    o = o || {}; var g = G(), w = o.w || 1.8;
    var heatM = M(0xb87333, .8, .4, { emissive: 0xff3b00, emissiveIntensity: 0 }), arcM = new T.MeshBasicMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0 });
    var top = K.term(0, 4.2, .4, g, 2.4), bot = K.term(0, -4.2, .4, g, 2.4); var terms = G(); terms.add(top, bot); g.add(terms);
    var bim = G(); bim.position.set(0, 3.2, -1.4); box(.5, 2.4, .1, heatM, 0, -1.2, -.06, bim); box(.5, 2.4, .1, k.steel, 0, -1.2, .06, bim); g.add(bim);
    var coil = G(); var cw = K.helixY(.5, 2.4, 9, .045, k.cu); cw.position.set(0, -2.1, -1.8); coil.add(cw); var plunger = cyl(.24, 2.2, k.iron, 0, -2.7, -1.8, coil, 18); K.cyl(.55, .15, k.iron, 0, -3.35, -1.8, coil, 20); g.add(coil);
    var arm = G(); arm.position.set(0, -.2, 2.2); box(.5, .18, 3.4, k.cu, 0, 0, -1.7, arm); box(.5, .14, .5, k.ag, 0, -.12, -3.4, arm); g.add(arm);
    box(.5, .14, .5, k.ag, 0, -.46, -1.2, g); box(.45, .6, .45, k.cu, 0, -.8, -1.2, g);
    var chute = G(); for (var i = 0; i < 8; i++) box(.95, .04, 1.2, k.steel, 0, 1.15 + i * .2, -1.35, chute); box(.05, 1.8, 1.2, k.grey, .5, 1.9, -1.35, chute); box(.05, 1.8, 1.2, k.grey, -.5, 1.9, -1.35, chute); g.add(chute);
    var arc = new T.Mesh(new T.CylinderGeometry(.07, .07, 1, 8), arcM); arc.position.set(0, .3, -1.2); g.add(arc); var arcL = new T.PointLight(0x9ad8ff, 0, 6); arcL.position.set(0, .8, -1.2); g.add(arcL);
    var lever = G(); lever.position.set(0, .9, 2.7); box(.7, 1.9, .5, o.lev || k.black, 0, .75, 0, lever); g.add(lever);
    var latch = G(); latch.position.set(0, 1.4, .6); box(.3, 1.2, .3, k.steel, 0, 0, 0, latch); g.add(latch);
    var path = K.flow([[0, 4.0, .4], [0, 3.2, -1.4], [0, .9, -1.4], [0, .5, .8], [0, -.1, 2.0], [0, -.3, 1.0], [0, -.3, -1.2], [0, -.5, -1.2], [0, -1.0, -1.8], [0, -3.2, -1.8], [0, -3.9, .4]], 0xfde047, 16, .11); g.add(path.group);
    g.userData = { bim: bim, plunger: plunger, arm: arm, arc: arc, arcM: arcM, arcL: arcL, lever: lever, latch: latch, heatM: heatM, path: path, terms: terms, coil: coil, chute: chute };
    return g;
  }
  function setPole(g, s, time) { /* s: {bend, stroke, trip, arc, heat, cur, speed} */
    var u = g.userData; u.bim.rotation.x = -s.bend * .3; u.plunger.position.y = -2.7 + s.stroke * 1.2; u.arm.rotation.x = s.trip * .42; u.lever.rotation.x = lerp(.33, -.33, s.trip); u.latch.rotation.z = s.trip * .6;
    u.heatM.emissiveIntensity = s.heat * 1.8; var h = 1.1 + s.trip * 2.4; u.arc.scale.set(1, Math.max(.01, s.arc * (.6 + s.trip * 1.6) * (1 + .15 * Math.sin(time * 90))), 1); u.arc.position.y = -.35 + (.5 + s.trip * 1.3) * Math.max(.01, s.arc) * .8; u.arcM.opacity = s.arc * (.75 + .25 * Math.sin(time * 70)); u.arcL.intensity = s.arc * 3;
    u.path.update(time, s.speed, s.cur);
  }
  function state(t, mode) { var ol = mode === 'ol'; var trip = ol ? seg(t, .8, .88) : seg(t, .1, .17); return { bend: ol ? seg(t, 0, .8) : seg(t, 0, .1) * .15, heat: ol ? seg(t, 0, .8) * (1 - trip * .7) : 0, stroke: ol ? 0 : seg(t, 0, .12), trip: trip, arc: ol ? seg(t, .8, .86) * (1 - seg(t, .9, 1)) : seg(t, .1, .15) * (1 - seg(t, .45, .6)), cur: 1 - seg(t, ol ? .86 : .15, ol ? .9 : .18), speed: ol ? .55 : .9 }; }
  function front(g, s, y, w) { return K.txt(s, w || 1.4, .5, null, 0, y, 3.12, g, '#e5e7eb', 46); }

  /* ---------- MCB ---------- */
  B.mcb = function () {
    var root = G(), p = pole({ lev: k.black }); root.add(p); var body = box(1.8, 9, 6.2, K.ghost(0xdfe3e8, .2), 0, 0, 0, root);
    box(1.82, .5, 6.22, k.white, 0, 4.25, 0, root); box(1.82, .5, 6.22, k.white, 0, -4.25, 0, root); box(1.2, .5, .7, k.steel, 0, -4.2, -3.4, root); front(root, 'C16', -2.9); K.txt('MCB', 1.4, .5, null, 0, 3.35, 3.12, root, '#7dd3fc', 44);
    root.rotation.y = -.5; root.position.y = 4.6;
    return { group: root, parts: { body: PART(body, 'Moulded housing', 5), term: PART(p.userData.terms, 'Line and load terminals', 4), bim: PART(p.userData.bim, 'Bimetal strip (thermal)', 4.5), coil: PART(p.userData.coil, 'Solenoid and plunger (magnetic)', 4.5), arm: PART(p.userData.arm, 'Moving contact', 4.5), chute: PART(p.userData.chute, 'Arc chute plates', 4.5), lever: PART(p.userData.lever, 'Toggle handle', 4.5) }, update: function (t, time, mode) { setPole(p, state(t, mode), time); } };
  };

  /* ---------- MCCB ---------- */
  B.mccb = function () {
    var root = G(), poles = [], sp = 3.4; var shell = K.ghost(0x2b3340, .28);
    for (var i = -1; i <= 1; i++) { var p = pole({ lev: k.black }); p.scale.set(1.5, 1.2, 1.15); p.position.x = i * sp; root.add(p); poles.push(p); box(.12, 10.5, 7.1, shell, i * sp + sp / 2, 0, 0, root); }
    var body = box(3 * sp + .4, 10.6, 7.2, shell, 0, 0, 0, root);
    box(3 * sp + .5, .6, 7.3, k.dark, 0, 5.0, 0, root); box(3 * sp + .5, .6, 7.3, k.dark, 0, -5.0, 0, root);
    var bar = box(3 * sp + .2, .35, .35, k.steel, 0, 1.45, 2.4, root); var handle = G(); handle.position.set(0, 1.0, 3.8); box(1.2, 2.6, 1.0, K.ghost(0x111316, 1), 0, 1.3, 0, handle); root.add(handle);
    var dials = G(); [-1, 1].forEach(function (x) { var d = cyl(.7, .35, k.dark, x * 2.4, 2.6, 3.7, dials, 24); d.rotation.x = PI / 2; box(.08, .5, .08, k.orange, x * 2.4, 2.6, 3.95, dials); }); root.add(dials);
    K.txt('MCCB 250 A', 4.5, .9, null, 0, -2.0, 3.65, root, '#e5e7eb', 46); K.txt('Ir  Im', 3, .5, null, 0, 4.2, 3.65, root, '#93c5fd', 40);
    var led = box(.5, .25, .15, K.glowM(0xef4444, 0), 3.2, -3.5, 3.65, root);
    root.rotation.y = -.55; root.scale.setScalar(.72); root.position.y = 3.5;
        return { group: root, parts: { body: PART(body, 'Moulded case', 9), poles: PART(poles[1], 'Pole with contacts and arc chute', 5), bar: PART(bar, 'Common trip bar (trips all 3 poles)', 7), handle: PART(handle, 'Handle: ON, TRIPPED, OFF', 6), dials: PART(dials, 'Adjustable trip dials (Ir and Im)', 6), led: PART(led, 'Trip indicator', 6) }, update: function (t, time, mode) { var s = state(t, mode); poles.forEach(function (p) { setPole(p, s, time); }); handle.rotation.x = lerp(-.28, .25, s.trip) * .9 + (s.trip > .5 ? -.12 : 0); bar.rotation.x = s.trip * .9; led.material.emissiveIntensity = s.trip > .4 ? 1.8 : 0; } };
  };

  /* ---------- RCCB ---------- */
  B.rccb = function () {
    var root = G(), body = box(7.2, 9, 6.2, K.ghost(0xdfe3e8, .2), 0, 4.5, 0, root); box(7.22, .4, 6.22, k.white, 0, 8.9, 0, root); box(7.22, .4, 6.22, k.white, 0, .1, 0, root);
    var terms = G(); [-2.6, -.9, .9, 2.6].forEach(function (x) { K.term(x, 9.3, 1, terms, 2.2); K.term(x, -.3, 1, terms, 2.2); }); root.add(terms);
    var coreG = G(); var coreM = M(0x8a929c, .9, .35, { emissive: 0x22d3ee, emissiveIntensity: 0 }); var core = new T.Mesh(new T.TorusGeometry(1.5, .55, 16, 40), coreM); core.position.set(-.8, 4.6, 0); coreG.add(core); var sense = new T.Mesh(new T.TorusGeometry(1.5, .66, 10, 40, 1.5), k.cu); sense.position.copy(core.position); sense.rotation.z = 2.2; coreG.add(sense); root.add(coreG);
    var wires = G(); var lw = K.tube([[-2.6, 9.0, 1], [-2.6, 7.2, 1], [-.8, 6.8, .2], [-.8, 2.4, .2], [-2.6, 2.0, 1], [-2.6, .1, 1]], .16, k.red, wires), nw = K.tube([[-.9, 9.0, 1], [-.9, 7.4, .6], [-.9, 6.6, -.4], [-.8, 4.6, -.45], [-.9, 2.6, -.4], [-.9, .1, 1]], .16, k.blue, wires); root.add(wires);
    var relay = G(); relay.position.set(2.6, 4.9, 0); box(1.6, 1.8, 1.6, k.dark, 0, 0, 0, relay); var rp = box(.35, 1.4, .35, k.steel, 0, .7, 0, relay); root.add(relay);
    var spring = K.helixY(.28, 1.6, 6, .04, k.steel); spring.position.set(1.6, 6.6, 0); root.add(spring);
    var contacts = G(); [-2.6, -.9].forEach(function (x, i) { var a = G(); a.position.set(x, 3.2, 1.3); box(.3, .15, 1.7, k.cu, 0, 0, 0, a); contacts.add(a); box(.4, .2, .4, k.ag, x, 3.0, .45, contacts); }); root.add(contacts);
    var tbtn = cyl(.36, .3, k.blue, 1.0, 8.9, 2.5, root, 20); tbtn.position.y = 8.95; K.txt('T', .5, .5, null, 1.0, 9.18, 2.5, root, '#fff', 60).rotation.x = -PI / 2;
    var rf = box(.25, 1.4, .25, k.green, -2.5, 8.95, 2.7, root);
    K.txt('RCCB 40A 30mA', 4.6, .7, null, 0, 1.4, 3.12, root, '#e5e7eb', 38);
    var ldot = K.flow([[-2.6, 9.0, 1], [-2.6, 7.2, 1], [-.8, 6.8, .2], [-.8, 2.4, .2], [-2.6, 2.0, 1], [-2.6, .1, 1]], 0xef4444, 12, .13), ndot = K.flow([[-.9, .1, 1], [-.9, 2.6, -.4], [-.8, 4.6, -.45], [-.9, 7.4, .6], [-.9, 9.0, 1]], 0x60a5fa, 12, .13), leak = K.flow([[-.8, 2.6, .2], [3.6, 2.6, 2.6], [3.6, -1.6, 3.4], [3.6, -3.0, 3.4]], 0xfb923c, 9, .15); root.add(ldot.group, ndot.group, leak.group);
    var field = G(); for (var i = 0; i < 3; i++) { var r = new T.Mesh(new T.TorusGeometry(2.0 + i * .22, .03, 6, 40), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 })); r.position.copy(core.position); field.add(r); } root.add(field);
    var pad = box(1.4, .15, 1.4, k.green, 3.6, -3.1, 3.4, root); K.txt('EARTH', 1.6, .4, null, 3.6, -3.0, 4.4, root, '#86efac', 40);
    root.rotation.y = -.45; root.position.set(0, 0, 0); root.scale.setScalar(.8);
    return { group: root, parts: { body: PART(body, 'Housing', 7), terms: PART(terms, 'L and N terminals (2-pole)', 6), core: PART(coreG, 'Toroidal core with sensing winding', 5), wires: PART(wires, 'Live and neutral through the core', 5), relay: PART(relay, 'Polarised trip relay', 5), spring: PART(spring, 'Tripping spring', 5), contacts: PART(contacts, 'Main contacts', 5), tbtn: PART(tbtn, 'TEST button', 5) },
      update: function (t, time, mode) { var leakK = mode === 'earth' ? seg(t, .05, .5) : mode === 'press' ? seg(t, .05, .35) : 0, trip = mode === 'earth' ? seg(t, .45, .55) : mode === 'press' ? seg(t, .3, .4) : 0, hi = mode === 'ol' ? seg(t, 0, .3) : mode === 'sc' ? seg(t, 0, .1) : 0;
        var on = 1 - trip; ldot.update(time, .35 + hi * 1.6, on); ndot.update(time, .35 + hi * 1.6, on); leak.update(time, .7, leakK * on * (mode === 'press' ? 0 : 1) + (mode === 'press' ? seg(t, .05, .3) * on : 0));
        field.children.forEach(function (r, i) { r.material.opacity = leakK * on * .55 * (.6 + .4 * Math.sin(time * 6 + i)); }); contacts.children.forEach(function (c, i) { if (i % 2 === 0) c.rotation.x = -trip * .5; });
        rp.position.y = .7 + trip * .6; spring.scale.y = 1 - trip * .35; tbtn.position.y = 8.95 - (mode === 'press' ? seg(t, 0, .3) * .15 : 0); rf.material.color.setHex(trip > .5 ? 0xef4444 : 0x2e7d32); coreM.emissiveIntensity = leakK * on * .6; } };
  };

  /* ---------- ACB ---------- */
  B.acb = function () {
    var root = G(); var frame = box(15, 15.5, 8, K.ghost(0x38404c, .3), 0, 8.5, 0, root); box(15.4, .5, 8.4, k.dark, 0, 16.3, 0, root); box(15.4, .5, 8.4, k.dark, 0, .5, 0, root);
    var poles = [], arcs = [], bridges = [], chutes = G(), tg = G(); root.add(tg); var arcM = new T.MeshBasicMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0 });
    for (var i = -1; i <= 1; i++) { var x = i * 4.2; box(1.6, 4.2, 1.4, k.cu, x, 14.4, -2.6, tg); box(1.6, 4.2, 1.4, k.cu, x, 2.4, -2.6, tg); box(2.6, 1.0, 1.4, k.brass, x, 16.4, -2.6, tg); box(2.6, 1.0, 1.4, k.brass, x, .4, -2.6, tg);
      var br = G(); br.position.set(x, 8.0, -1.2); box(.9, 3.4, .5, k.cu, 0, 1.7, 0, br); box(1, .5, .7, k.ag, 0, 3.4, 0, br); br.userData.x = x; root.add(br); bridges.push(br); box(1, .5, .7, k.ag, x, 11.9, -1.2, root); box(.6, 3.2, .6, k.cu, x, 13.2, -1.8, root);
      for (var j = 0; j < 10; j++) box(2.6, .08, 2.4, k.steel, x, 9.6 + j * .35, -1.0, chutes); var a = new T.Mesh(new T.CylinderGeometry(.14, .14, 1, 8), arcM); a.position.set(x, 9.4, -1.1); root.add(a); arcs.push(a); }
    root.add(chutes);
    var shaft = cyl(.4, 14, k.steel, 0, 6.0, 0.2, root, 16); shaft.rotation.z = PI / 2; var links = G(); [-1, 0, 1].forEach(function (i) { box(.3, 3, .3, k.steel, i * 4.2, 5.6, -.5, links); }); root.add(links);
    var spring = K.helixY(.9, 4.6, 12, .1, k.steel); spring.position.set(-5.2, 5.2, 2.2); root.add(spring); var motor = box(2.4, 1.8, 2, k.blue, -5.4, 2.2, 2.2, root); var cam = cyl(1.1, .5, k.grey, -3.0, 5.2, 2.4, root, 24); cam.rotation.x = PI / 2;
    var trip = G(); box(5.2, 3.2, .5, k.dark, 4.0, 9.2, 4.2, trip); var lcd = box(3.2, 1.2, .1, K.glowM(0x22d3ee, .5), 4.0, 9.7, 4.5, trip); [-1, 0, 1].forEach(function (i) { box(.5, .5, .2, k.orange, 2.8 + (i + 1) * 1.2, 8.3, 4.5, trip); }); root.add(trip);
    var rails = G(); box(.6, .8, 8.6, k.steel, -7.7, 1.2, 0, rails); box(.6, .8, 8.6, k.steel, 7.7, 1.2, 0, rails); root.add(rails);
    var btn = G(); box(1.5, .9, .5, k.green, -4.2, 3.2, 4.3, btn); box(1.5, .9, .5, k.red, -2.2, 3.2, 4.3, btn); root.add(btn); var ind = box(.6, .5, .3, K.glowM(0xef4444, 0), 0, 3.2, 4.3, root);
    K.txt('ACB 3200 A', 5, .8, null, -4.0, 7.0, 4.15, root, '#e5e7eb', 44);
    var lamp = new T.PointLight(0x9ad8ff, 0, 18); lamp.position.set(0, 9.6, 1); root.add(lamp);
    root.rotation.y = -.55; root.scale.setScalar(.48); root.position.y = 0;
    return { group: root, parts: { frame: PART(frame, 'Frame (see-through)', 14), terms: PART(tg, 'Main terminals', 8), bridges: PART(bridges[1], 'Moving contacts (3 poles)', 7), chutes: PART(chutes, 'Arc chutes with splitter plates', 8), spring: PART(spring, 'Closing spring', 7), motor: PART(motor, 'Spring-charging motor', 7), trip: PART(trip, 'Electronic trip unit', 7), rails: PART(rails, 'Draw-out rails', 8) },
      update: function (t, time, mode) { var ol = mode === 'ol', op = ol ? seg(t, .8, .9) : seg(t, .1, .18), arc = ol ? seg(t, .8, .86) * (1 - seg(t, .92, 1)) : seg(t, .1, .15) * (1 - seg(t, .5, .65)); bridges.forEach(function (b) { b.position.y = 8.0 - op * 3.4; });
        links.position.y = -op * 3.4; shaft.rotation.x = op * .5; spring.scale.y = 1 - op * .5; spring.position.y = 5.2 + op * 1.15; cam.rotation.z = -op * 2.4;
        var cTop = 8.0 - op * 3.4 + 3.4 + .25, fBot = 11.65; arcs.forEach(function (a) { var h = fBot - cTop; a.scale.set(1 + .6 * arc, Math.max(.01, h), 1); a.position.y = (fBot + cTop) / 2; a.visible = arc > .01 && h > .05; }); arcM.opacity = arc * (.75 + .25 * Math.sin(time * 80)); lamp.intensity = arc * 5;
        lcd.material.emissiveIntensity = .5 + (ol ? seg(t, 0, .8) * .6 : seg(t, 0, .1) * 1.0); ind.material.emissiveIntensity = op > .5 ? 2 : 0; } };
  };

  /* ---------- VCB ---------- */
  B.vcb = function () {
    var root = G(), pls = [], mov = [], arcs = [], arcM = new T.MeshBasicMaterial({ color: 0xc4a8ff, transparent: true, opacity: 0 });
    var frame = box(14, 11, 6.5, K.ghost(0x2b3340, .22), 0, 5.8, 0, root); var mech = box(14.2, 3.4, 6.7, k.dark, 0, 1.7, 0, root); K.txt('VCB 12 kV 630 A', 6, .8, null, 0, 1.7, 3.4, root, '#e5e7eb', 40);
    for (var i = -1; i <= 1; i++) { var x = i * 4.4; var pole = G(); pole.position.x = x; var shell = new T.Mesh(new T.CylinderGeometry(1.15, 1.15, 5.6, 32, 1, true), K.ghost(0xe7dccb, .35, { side: T.DoubleSide })); shell.position.y = 7.4; pole.add(shell);
      cyl(1.3, .3, k.alu, 0, 10.35, 0, pole, 28); cyl(1.3, .3, k.alu, 0, 4.45, 0, pole, 28); cyl(.62, 2.2, k.cu, 0, 9.0, 0, pole, 20); var m = G(); m.position.y = 7.06; cyl(.36, 4.2, k.steel, 0, -1.7, 0, m, 14); cyl(.62, .24, k.ag, 0, .55, 0, m, 20); pole.add(m); mov.push(m); cyl(.62, .24, k.ag, 0, 7.85, 0, pole, 20); var shield = cyl(.9, 3.2, K.ghost(0xb0b7c0, .5), 0, 6.9, 0, pole, 24); shield.material.side = T.DoubleSide;
      var bel = G(); for (var j = 0; j < 7; j++) bel.add(K.tor(.55, .07, k.steel, 0, 4.7 + j * .2, 0, null)); pole.add(bel); pole.userData.bel = bel;
      var ins = cyl(1.0, 4.4, k.orange, 0, 12.8, 0, pole, 24); for (var q = 0; q < 6; q++) cyl(1.5, .16, k.orange, 0, 11.0 + q * .62, 0, pole, 24); var cap = cyl(.9, .4, k.alu, 0, 15.2, 0, pole, 20); pole.userData.ins = ins;
      var a = new T.Mesh(new T.CylinderGeometry(.22, .22, 1, 12), arcM); a.position.set(0, 7.4, 0); pole.add(a); arcs.push(a); var rod = cyl(.3, 2.6, k.steel, 0, 2.6, 0, pole, 12); pole.userData.rod = rod; pole.userData.mov = m; pole.userData.shell = shell; root.add(pole); pls.push(pole); }
    var bar = box(10.4, .35, .35, k.steel, 0, 3.1, 1.8, root); var springB = K.helixY(.8, 2.4, 9, .1, k.steel); springB.position.set(-5.6, 1.9, 2.6); root.add(springB); var coilT = box(1.4, 1.2, 1.2, k.blue, 5.4, 1.8, 2.6, root); var relay = G(); box(2.6, 1.8, .5, k.dark, 6.2, 8.3, 3.5, relay); var rl = box(.9, .5, .1, K.glowM(0x22d3ee, .5), 6.2, 8.6, 3.8, relay); root.add(relay);
    var lamp = new T.PointLight(0xc4a8ff, 0, 14); lamp.position.set(0, 7.5, 1); root.add(lamp);
    root.rotation.y = -.5; root.scale.setScalar(.5); root.position.y = 0;
    return { group: root, parts: { frame: PART(frame, 'Frame and pole assembly', 14), vi: PART(pls[1].userData.shell, 'Vacuum interrupter (ceramic bottle)', 6), contacts: PART(pls[1].userData.mov, 'Contacts: fixed and moving', 5), bel: PART(pls[1].userData.bel, 'Metal bellows (keeps the vacuum)', 5), ins: PART(pls[1].userData.ins, 'Epoxy pole insulator', 8), mech: PART(mech, 'Spring-operated mechanism', 12), spring: PART(springB, 'Opening spring', 7), relay: PART(relay, 'Protection relay (trip signal)', 7) },
      update: function (t, time, mode) { var ol = mode === 'ol', op = ol ? seg(t, .8, .9) : seg(t, .1, .18), arc = ol ? seg(t, .82, .88) * (1 - seg(t, .92, 1)) : seg(t, .12, .17) * (1 - seg(t, .45, .6)); var gap = op * 1.2;
        pls.forEach(function (p, i) { var my = 7.06 - gap * 1.0, mv = p.userData.mov; mv.position.y = my; var a = arcs[i], top = 7.73, bot = my + .67; a.scale.y = Math.max(.01, top - bot); a.position.y = (top + bot) / 2; a.visible = arc > .02 && top - bot > .05; p.userData.rod.position.y = 2.6 - gap * 1.0; var bel = p.userData.bel, span = (my - 1.2) - 4.7; bel.children.forEach(function (r, j) { r.position.y = 4.7 + j * span / 6; }); });
        arcM.opacity = arc * (.7 + .3 * Math.sin(time * 70)); lamp.intensity = arc * 4; bar.position.y = 3.1 - gap * 1.0; springB.scale.y = 1 - op * .3; rl.material.emissiveIntensity = (ol ? seg(t, 0, .8) * .7 : seg(t, 0, .1)) + (op > .1 ? 1.8 : 0); } };
  };
})();
