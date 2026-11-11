/* Builds an animated worker wearing the PPE for arc-flash category 1..4. Needs ppe-human.js. */
(function () {
  'use strict';
  var T = THREE, P = window.VKP, G = P.G, loft = P.loft, ell = P.ell, smooth = P.smooth, RAD = Math.PI / 180;

  function sec(y, rx, rz, cx, cz, n) { return { y: y, rx: rx, rz: rz == null ? rx : rz, cx: cx || 0, cz: cz || 0, n: n || 2 }; }
  function limbSecs(prof, add, zk) { return prof.map(function (p) { return sec(p[0], p[1] + add, (p[1] + add) * (p[2] || 1) * (zk || 1)); }); }
  function mesh(g, m, x, y, z) { var o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; return o; }

  /* ----- hands (gloves) with finger joints ----- */
  function hand(mat, side, sc, long) {
    var h = G(), s = sc || 1, fin = [], palm = ell(.04 * s, .05 * s, .021 * s, mat, 0, -.055 * s, 0, 16, 12); palm.castShadow = true; h.add(palm);
    var knuckle = mesh(new T.BoxGeometry(.074 * s, .02 * s, .03 * s), mat, 0, -.09 * s, 0); knuckle.scale.set(1, 1, .8); h.add(knuckle);
    var defs = [[.028, .044, .040, .029], [.009, .048, .044, .031], [-.010, .045, .041, .029], [-.028, .037, .033, .024]];
    defs.forEach(function (d, i) {
      var g1 = G(); g1.position.set(side * -.002, -.095 * s, d[0] * s); var segs = [d[1], d[2], d[3]], parent = g1, joints = [];
      segs.forEach(function (L, k) {
        var j = G(); if (k) j.position.y = -segs[k - 1] * s; parent.add(j);
        var r = (.0128 - k * .0014 - i * .0003) * s, cap = mesh(P.capsule(r, L * s * .86, 6), mat, 0, -L * s / 2, 0); j.add(cap); joints.push(j); parent = j;
      });
      h.add(g1); fin.push({ g: g1, j: joints });
    });
    var th = G(); th.position.set(side * -.022 * s, -.04 * s, .016 * s); th.rotation.set(-.9, side * .5, side * -.45); h.add(th);
    var t1 = G(), t2 = G(); t2.position.y = -.038 * s; th.add(t1); t1.add(t2); t1.add(mesh(P.capsule(.0125 * s, .03 * s, 6), mat, 0, -.019 * s, 0)); t2.add(mesh(P.capsule(.0105 * s, .026 * s, 6), mat, 0, -.019 * s, 0));
    fin.push({ g: th, j: [t1, t2], thumb: true });
    var cuffL = long ? .11 : .07, cuff = mesh(new T.CylinderGeometry(.034 * s * (long ? 1.05 : 1), .038 * s * (long ? 1.3 : 1.18), cuffL, 22, 1, true), mat, 0, cuffL / 2 - .002, 0); cuff.scale.z = .82; cuff.material.side === T.DoubleSide || 0; h.add(cuff);
    h.userData.fin = fin; return h;
  }
  function curlHand(h, side, c, spread) { /* c in 0..1 */
    h.userData.fin.forEach(function (f, i) {
      if (f.thumb) { f.g.rotation.x = -.9 - .45 * c; f.j[0].rotation.z = side * -.25 * c; f.j[1].rotation.z = side * -.5 * c; return; }
      f.j.forEach(function (j, k) { j.rotation.z = -side * (c * (.5 + .45 * k) + .06 * i * c); });
      f.g.rotation.x = (i - 1.5) * -.03 * (spread || 1);
    });
  }

  /* ----- boots ----- */
  function boot(mat, soleMat) {
    var b = G();
    var sh = new T.Shape(); sh.moveTo(-.04, -.085); sh.quadraticCurveTo(-.045, -.1, 0, -.103); sh.quadraticCurveTo(.045, -.1, .043, -.08); sh.lineTo(.05, .12); sh.quadraticCurveTo(.052, .2, 0, .212); sh.quadraticCurveTo(-.055, .2, -.05, .12); sh.lineTo(-.04, -.085);
    var sg = new T.ExtrudeGeometry(sh, { depth: .03, bevelEnabled: true, bevelThickness: .004, bevelSize: .004, bevelSegments: 2 }); sg.rotateX(Math.PI / 2); sg.translate(0, .03, 0);
    var sole = mesh(sg, soleMat); sole.position.y = .0; b.add(sole);
    var heel = mesh(new T.BoxGeometry(.075, .028, .06), soleMat, 0, .03, -.062); b.add(heel);
    var vamp = ell(.047, .05, .125, mat, 0, .072, .075, 24, 16); vamp.scale.y = .04; b.add(vamp);
    var toe = ell(.046, .033, .05, mat, 0, .062, .15, 20, 12); b.add(toe);
    var shaft = mesh(new T.BufferGeometry(), mat); shaft.geometry = loft([sec(.13, .05, .054, 0, -.01), sec(.1, .053, .06, 0, -.004), sec(.07, .056, .075, 0, .006), sec(.035, .05, .095, 0, .0)], { N: 28, res: 4, capTop: false, uRep: 2 }); shaft.position.y = 0; b.add(shaft);
    var stitch = mesh(new T.TorusGeometry(.052, .0016, 5, 24, 3.1), new T.MeshStandardMaterial({ color: 0xc89a5a, roughness: .8 }), 0, .098, .005); stitch.rotation.set(Math.PI / 2, 0, Math.PI * 1.5); stitch.scale.set(1, 1.2, 1); b.add(stitch);
    var lace = mesh(new T.BoxGeometry(.05, .008, .06), new T.MeshStandardMaterial({ color: 0x15130f, roughness: .7 }), 0, .1, .045); lace.rotation.x = -.3; b.add(lace);
    return b;
  }

  function hardHat(color) {
    var h = G(), m = P.plastic(color, 1);
    var dome = new T.Mesh(new T.SphereGeometry(1, 48, 28, 0, 6.2832, 0, 1.5708), m); dome.scale.set(.106, .092, .116); dome.position.set(0, .03, -.006); dome.castShadow = true; h.add(dome);
    var side = mesh(loft([sec(.032, .106, .116, 0, -.006), sec(.012, .108, .119, 0, -.006), sec(.004, .114, .13, 0, .0)], { N: 40, res: 3 }), m, 0, 0, 0); h.add(side);
    var brimGeo = loft([sec(.006, .113, .129, 0, .0), sec(.0, .125, .145, 0, .004)], { N: 44, res: 2, capBottom: true }); var brim = mesh(brimGeo, m); h.add(brim);
    var peak = ell(.082, .004, .06, m, 0, .004, .136, 24, 8); peak.rotation.x = .12; h.add(peak);
    [-1, 1].forEach(function (s) { var rib = mesh(new T.BoxGeometry(.016, .014, .22), m, s * .012, .122, .0); rib.scale.set(1, 1, 1); h.add(rib); });
    var top = ell(.034, .02, .1, m, 0, .12, 0, 16, 10); h.add(top);
    var strap = mesh(new T.TorusGeometry(.098, .003, 6, 28, 4.2), new T.MeshStandardMaterial({ color: 0x20242b, roughness: .8 }), 0, -.002, 0); strap.rotation.x = Math.PI / 2; strap.rotation.z = 2.1; strap.scale.set(1, 1.15, 1); h.add(strap);
    return h;
  }
  function faceShield(trim) {
    var g = G(), glass = new T.MeshPhysicalMaterial({ color: 0xf4e38a, roughness: .08, metalness: 0, transparent: true, opacity: .3, side: T.DoubleSide, clearcoat: 1, depthWrite: false });
    var pane = new T.Mesh(new T.CylinderGeometry(.142, .142, .3, 44, 1, true, -1.9, 3.8), glass); pane.position.y = -.095; pane.renderOrder = 3; g.add(pane);
    var bar = new T.Mesh(new T.CylinderGeometry(.146, .146, .03, 44, 1, true, -1.95, 3.9), new T.MeshStandardMaterial({ color: trim, roughness: .4, side: T.DoubleSide })); bar.position.y = .052; g.add(bar);
    var bar2 = new T.Mesh(new T.CylinderGeometry(.146, .146, .016, 44, 1, true, -1.95, 3.9), new T.MeshStandardMaterial({ color: trim, roughness: .4, side: T.DoubleSide })); bar2.position.y = -.248; g.add(bar2);
    var shine = new T.Mesh(new T.PlaneGeometry(.03, .2), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .1, depthWrite: false })); shine.position.set(.06, -.07, .13); shine.rotation.y = .45; g.add(shine);
    return g;
  }

  /* ---------- the person ---------- */
  P.buildPerson = function (cat) {
    var skin = P.skinMat(), root = G(), hips = G(), spine = G(), chestG = G(), neck = G(), headJ = G(), headC = G();
    var J = { root: root, hips: hips, spine: spine, chest: chestG, neck: neck, head: headJ }, parts = { all: root }, mats = [], pm = {};
    hips.position.y = .95; root.add(hips); hips.add(spine); chestG.position.y = .3; spine.add(chestG); neck.position.y = .25; chestG.add(neck); headJ.position.y = .07; neck.add(headJ); headC.position.y = .095; headJ.add(headC);
    function part(k, o) { (pm[k] = pm[k] || []).push(o); }

    /* palette per category */
    var tk = cat === 1 ? 'shirt' : cat === 2 ? 'coverall' : cat === 3 ? 'jacket' : 'suit';
    var heavy = cat >= 3, thick = cat === 1 ? .011 : cat === 2 ? .013 : cat === 3 ? .026 : .032;
    var fab = cat === 1 ? P.fabric('#6b6870', { weave: .09 }) : cat === 2 ? P.fabric('#9a9ba2', { weave: .08, noise: .07 }) : cat === 3 ? P.fabric('#54545a', { weave: .1, noise: .08, sheen: 0x666666 }) : P.fabric('#46464c', { weave: .11, noise: .09, sheen: 0x555555 });
    var pantsM = cat === 1 ? P.fabric('#1a1b20', { weave: .06 }) : fab;
    mats.push(fab); if (pantsM !== fab) mats.push(pantsM);
    var glove = cat <= 2 ? P.leather('#7a4a24', .55) : P.leather('#c4c4c9', .7); var bootM = P.leather('#4a2e1a', .5), soleM = new T.MeshStandardMaterial({ color: 0x17140f, roughness: .9 }); mats.push(glove);
    var seam = new T.MeshStandardMaterial({ color: 0x15161a, roughness: .8 }), orange = new T.MeshStandardMaterial({ color: 0xe8780c, roughness: .7, envMapIntensity: .35 });

    /* torso */
    var tAdd = thick, hemY = heavy ? -.40 : (cat === 2 ? -.2 : -.05);
    var tS = [heavy ? sec(hemY, .205 + tAdd * 1.6, .15 + tAdd, 0, 0, 2.3) : sec(hemY, .172 + tAdd, .118 + tAdd, 0, 0, 2.2), sec(-.18, .185 + tAdd, .125 + tAdd, 0, -.004, 2.3), sec(-.08, .172 + tAdd, .112 + tAdd, 0, -.004, 2.3), sec(.12, .152 + tAdd, .1 + tAdd, 0, -.006, 2.3), sec(.3, .172 + tAdd, .108 + tAdd, 0, -.002, 2.4), sec(.42, .187 + tAdd, .115 + tAdd, 0, -.004, 2.5), sec(.5, .197 + tAdd, .108 + tAdd, 0, -.008, 2.6), sec(.545, .165 + tAdd, .085 + tAdd, 0, -.012, 2.4), sec(.575, .085, .072, 0, -.008, 2), sec(.592, .058, .056, 0, 0, 2)];
    if (cat === 1) tS = tS.filter(function (s) { return s.y >= .1; });
    if (cat === 2) tS[0] = sec(hemY, .184 + tAdd, .128 + tAdd, 0, 0, 2.2);
    var torso = mesh(loft(tS, { N: 44, res: 5, capBottom: cat === 1, wr: [{ y0: -.05, y1: .2, fade: .1, amp: .022, freq: 5, ph: 1, k: 6 }, { y0: .18, y1: .4, fade: .1, amp: .008, freq: 7, ph: .4, k: 3 }], uRep: 4 }), fab);
    spine.add(torso); part(cat === 1 ? 'shirt' : cat === 2 ? 'coverall' : cat === 3 ? 'jacket' : 'suit', torso); var torsoMeshes = [torso];
    /* pelvis + pants */
    var pel = mesh(loft([sec(.15, .158 + tAdd, .106 + tAdd, 0, -.004, 2.3), sec(.05, .178 + tAdd, .118 + tAdd, 0, -.004, 2.3), sec(-.06, .175 + tAdd, .12 + tAdd, 0, -.002, 2.2), sec(-.16, .17 + tAdd, .12 + tAdd, 0, 0, 2.2)], { N: 40, res: 4, capBottom: true }), cat === 2 ? fab : pantsM); hips.add(pel); part(cat === 1 ? 'pants' : cat === 2 ? 'coverall' : cat === 3 ? 'jacket' : 'suit', pel);
    if (cat === 1) { var belt = mesh(loft([sec(.145, .157 + tAdd + .003, .104 + tAdd + .003, 0, -.006, 2.3), sec(.118, .157 + tAdd + .003, .104 + tAdd + .003, 0, -.006, 2.3)], { N: 40, res: 1 }), P.leather('#3a2616')); hips.add(belt); var buckle = mesh(new T.BoxGeometry(.032, .028, .008), new T.MeshStandardMaterial({ color: 0xb0b4ba, metalness: .9, roughness: .3 }), 0, .132, .118 + tAdd); hips.add(buckle); part('pants', belt); }
    /* placket, zip, pockets, collar */
    var zip = mesh(new T.BoxGeometry(.006, cat === 2 ? .66 : .54, .004), cat >= 3 ? new T.MeshStandardMaterial({ color: 0x2b2b30, roughness: .6 }) : seam, 0, cat === 2 ? .26 : .27, .115 + tAdd); spine.add(zip); if (cat === 2) zip.position.y = .24; part(tk, zip);
    function pocket(x, y, w, h) { var f = mesh(new T.BoxGeometry(w, h, .012), fab, x, y, .12 + tAdd); f.rotation.x = -.14; spine.add(f); var line = mesh(new T.BoxGeometry(w + .004, .004, .013), seam, x, y + h / 2, .12 + tAdd); line.rotation.x = -.14; spine.add(line); part(cat === 1 ? 'shirt' : cat === 2 ? 'coverall' : cat === 3 ? 'jacket' : 'suit', f); }
    if (cat <= 2) { pocket(-.082, .4, .065, .06); pocket(.082, .4, .065, .06); for (var b = 0; b < (cat === 1 ? 5 : 0); b++) { var bt = mesh(new T.CylinderGeometry(.0065, .0065, .004, 12), new T.MeshStandardMaterial({ color: 0x2a2a2e, roughness: .4 }), 0, .46 - b * .09, .122 + tAdd); bt.rotation.x = Math.PI / 2; spine.add(bt); part('shirt', bt); } }
    if (cat >= 3) { var flap = mesh(new T.BoxGeometry(.04, .66, .02), fab, .035, .12, .112 + tAdd + .004); flap.rotation.x = -.02; spine.add(flap); part(cat === 3 ? 'jacket' : 'suit', flap); [-1, 1].forEach(function (s) { pocket(s * .09, .02, .1, .09); }); for (var q = 0; q < 6; q++) { var sn = mesh(new T.CylinderGeometry(.008, .008, .006, 12), new T.MeshStandardMaterial({ color: 0x9aa0a6, metalness: .8, roughness: .35 }), .035, .42 - q * .11, .126 + tAdd); sn.rotation.x = Math.PI / 2; spine.add(sn); part(cat === 3 ? 'jacket' : 'suit', sn); } }
    if (cat <= 2) { var col = mesh(loft([sec(.595, .068, .066, 0, .004), sec(.575, .075, .072, 0, .004), sec(.555, .086, .08, 0, 0)], { N: 32, res: 3 }), cat === 1 ? fab : fab); spine.add(col); part(cat === 1 ? 'shirt' : 'coverall', col); }

    /* neck */
    var neckMesh = mesh(loft([sec(.0, .052, .055, 0, 0), sec(.08, .05, .053, 0, .004)], { N: 24, res: 2, capTop: true }), skin); neck.add(neckMesh); neckMesh.position.y = -.02;

    /* head (face) */
    var head = P.buildHead(skin); headC.add(head); J.headMesh = head;
    if (cat <= 2) {
      var hat = hardHat(0xf47b0c); hat.position.y = .025; headC.add(hat); part('head', hat);
      var fs = faceShield(cat === 1 ? 0x1e2a6b : 0x1e2a6b); headC.add(fs); part('head', fs);
      var cl = mesh(loft([sec(-.2, .082, .088, 0, -.005), sec(-.16, .09, .096, 0, -.004), sec(-.135, .1, .104, 0, -.002)], { N: 36, res: 3 }), new T.MeshStandardMaterial({ color: cat === 1 ? 0x1e2a6b : 0xd9d0bd, roughness: .8 })); headC.add(cl); part('head', cl);
      if (cat === 2) {
        var cream = P.fabric('#ddd4c0', { weave: .06 }); mats.push(cream);
        var bala = mesh(loft([sec(.075, .09, .104, 0, -.006, 2.1), sec(.03, .097, .108, 0, -.006, 2.1), sec(-.06, .092, .104, 0, -.004), sec(-.12, .075, .09), sec(-.19, .07, .08)], { N: 40, res: 4, skip: function (y, a) { return y > -.105 && y < .062 && Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < .78; } }), cream); bala.scale.set(1.0, 1, 1); headC.add(bala); part('head', bala);
        var cape = mesh(loft([sec(.27, .075, .072), sec(.245, .115, .1, 0, 0, 2.3), sec(.21, .17, .125, 0, 0, 2.5), sec(.17, .205, .13, 0, 0, 2.6)], { N: 40, res: 3 }), cream); chestG.add(cape); part('head', cape);
        var rim = mesh(new T.TorusGeometry(.05, .004, 6, 24), new T.MeshStandardMaterial({ color: 0xd2c8b2, roughness: .9 }), 0, .02, .1); rim.visible = false;
      }
    } else {
      var hf = P.fabric(cat === 3 ? '#54545a' : '#46464c', { weave: .1, noise: .08, sheen: 0x666666 }); mats.push(hf);
      var hood = mesh(loft([sec(.17, .09, .105, 0, -.006, 2.4), sec(.15, .125, .14, 0, -.004, 2.6), sec(.09, .145, .17, 0, .004, 3), sec(0, .15, .178, 0, .006, 3.2), sec(-.1, .155, .172, 0, .002, 3.2), sec(-.17, .165, .16, 0, -.004, 3)], { N: 48, res: 4, uRep: 3, skip: function (y, a) { return y > -.035 && y < .087 && Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < .62; } }), hf); hood.material.side = T.DoubleSide; headC.add(hood); part('hood', hood);
      var yoke = mesh(loft([sec(.27, .13, .13, 0, -.01, 2.4), sec(.24, .22, .15, 0, 0, 2.8), sec(.18, .25, .16, 0, 0, 3), sec(.08, .22, .15, 0, .004, 3), sec(-.05, .2, .135, 0, .006, 3.3)], { N: 44, res: 4, capBottom: false, uRep: 3 }), hf); chestG.add(yoke); part('hood', yoke);
      var bib = mesh(new T.BoxGeometry(.29, .26, .024), hf, 0, .0, .165); bib.position.y = .05; bib.rotation.x = -.05; chestG.add(bib); part('hood', bib);
      var bibEdge = mesh(new T.BoxGeometry(.3, .006, .026), seam, 0, -.083, .166); chestG.add(bibEdge); part('hood', bibEdge);
      var winGlass = new T.MeshPhysicalMaterial({ color: 0xe9d977, roughness: .06, transparent: true, opacity: .42, clearcoat: 1, depthWrite: false });
      var win = mesh(new T.BoxGeometry(.165, .112, .008), winGlass, 0, .027, .146); win.castShadow = false; win.renderOrder = 3; headC.add(win); part('hood', win);
      [[.0, .0865, .166, .007], [0, -.0315, .166, .007]].forEach(function (f) { var fr = mesh(new T.BoxGeometry(f[2], f[3], .014), seam, 0, f[0] === 0 && f[1] < 0 ? -.034 : .089, .146); headC.add(fr); part('hood', fr); });
      [-1, 1].forEach(function (s) { var fr = mesh(new T.BoxGeometry(.007, .124, .014), seam, s * .0855, .027, .146); headC.add(fr); part('hood', fr); for (var r = 0; r < 2; r++) { var rv = mesh(new T.CylinderGeometry(.004, .004, .004, 10), new T.MeshStandardMaterial({ color: 0x9aa0a6, metalness: .9, roughness: .3 }), s * .08, .066 - r * .08, .156); rv.rotation.x = Math.PI / 2; headC.add(rv); } });
      [-1, 1].forEach(function (s) { var vt = mesh(new T.CylinderGeometry(.004, .004, .004, 10), seam, s * .06, -.095, .172); vt.rotation.x = Math.PI / 2; headC.add(vt); });
      var cap = mesh(new T.CylinderGeometry(.008, .008, .006, 12), new T.MeshStandardMaterial({ color: 0x9aa0a6, metalness: .9, roughness: .3 }), 0, .163, .0); headC.add(cap);
    }

    /* arms (+x side = s=+1) */
    var armDefs = { up: [[.05, .058, 1], [-.04, .05, 1.02], [-.17, .045, 1], [-.3, .039, 1]], fo: [[.02, .04, 1], [-.08, .043, 1], [-.2, .033, 1], [-.265, .028, 1]] }, sleeveAdd = thick * .9 + (cat <= 2 ? 0 : .004);
    [1, -1].forEach(function (s) {
      var sh = G(); sh.position.set(s * .205, .2, 0); chestG.add(sh); J['sh' + s] = sh;
      var shoulderCap = ell(.054 + sleeveAdd, .05 + sleeveAdd, .054 + sleeveAdd, fab, s * -.006, .005, 0, 20, 14); sh.add(shoulderCap); part(tk, shoulderCap);
      var ua = mesh(loft(limbSecs(armDefs.up, sleeveAdd, .95), { N: 28, res: 4, wr: [{ y0: -.32, y1: -.22, fade: .06, amp: .06, freq: 4, ph: 0, k: 20 }], uRep: 3 }), fab); sh.add(ua); part(cat === 1 ? 'shirt' : cat === 2 ? 'coverall' : cat === 3 ? 'jacket' : 'suit', ua);
      var el = G(); el.position.y = -.3; sh.add(el); J['el' + s] = el;
      var elb = ell(.04 + sleeveAdd, .04 + sleeveAdd, .04 + sleeveAdd, fab, 0, 0, 0, 16, 12); el.add(elb);
      var fa = mesh(loft(limbSecs(armDefs.fo, sleeveAdd, .95), { N: 28, res: 4, wr: [{ y0: -.1, y1: .02, fade: .05, amp: .05, freq: 4, ph: 1, k: 18 }], uRep: 3 }), fab); el.add(fa); part(cat === 1 ? 'shirt' : cat === 2 ? 'coverall' : cat === 3 ? 'jacket' : 'suit', fa);
      var wr = G(); wr.position.y = -.265; el.add(wr); J['wr' + s] = wr;
      var cuffM = cat >= 3 ? orange : fab, cuff = mesh(loft([sec(.04, .037 + sleeveAdd, .034 + sleeveAdd), sec(-.055, .037 + sleeveAdd * 1.1, .034 + sleeveAdd * 1.1)], { N: 28, res: 2, capBottom: false }), cuffM); wr.add(cuff); part(cat >= 3 ? 'cuffs' : (cat === 1 ? 'shirt' : 'coverall'), cuff);
      if (cat >= 3) { var bs = mesh(new T.BoxGeometry(.01, .06, .004), seam, 0, -.01, (.034 + sleeveAdd) * 1.0); wr.add(bs); part('cuffs', bs); }
      var hd = hand(glove, s, 1, cat >= 3); hd.position.y = -.01; wr.add(hd); J['hd' + s] = hd; part('gloves', hd);
      if (cat >= 3) { var gc = mesh(loft([sec(.05, .04, .036), sec(-.06, .042, .038)], { N: 28, res: 2 }), glove); wr.add(gc); part('gloves', gc); }
    });

    /* legs */
    var legDefs = { th: [[.07, .1, 1.04], [-.08, .092, 1.04], [-.24, .074, 1], [-.44, .058, 1]], sh: [[.03, .058, 1], [-.1, .064, 1.06], [-.24, .046, 1], [-.38, .042, 1]] }, legAdd = thick + (heavy ? .012 : 0);
    var legM = cat === 2 ? fab : pantsM, legKey = cat === 1 ? 'pants' : cat === 2 ? 'coverall' : cat === 3 ? 'jacket' : 'suit';
    [1, -1].forEach(function (s) {
      var hp = G(); hp.position.set(s * .092, -.05, 0); hips.add(hp); J['hp' + s] = hp;
      var th = mesh(loft(limbSecs(legDefs.th, legAdd, 1.0), { N: 32, res: 4, wr: [{ y0: -.12, y1: .03, fade: .08, amp: .035, freq: 3, ph: .7, k: 12 }], uRep: 3 }), legM); hp.add(th); part(legKey, th);
      var kn = G(); kn.position.y = -.44; hp.add(kn); J['kn' + s] = kn; kn.add(ell(.06 + legAdd, .058 + legAdd, .06 + legAdd, legM, 0, 0, .004, 16, 12));
      var sk = mesh(loft(limbSecs(legDefs.sh, legAdd, 1.0), { N: 32, res: 4, wr: [{ y0: -.12, y1: .02, fade: .06, amp: .05, freq: 4, ph: 0, k: 16 }, { y0: -.4, y1: -.28, fade: .06, amp: .05, freq: 5, ph: 2, k: 30 }], uRep: 3 }), legM); kn.add(sk); part(legKey, sk);
      var an = G(); an.position.y = -.38; kn.add(an); J['an' + s] = an; var bt = boot(bootM, soleM); bt.position.set(0, -.082, .012); an.add(bt); part('boots', bt);
    });
    /* shadow flags */
    root.traverse(function (o) { if (o.isMesh) { o.castShadow = o.material && !o.material.transparent; o.receiveShadow = true; } });

    /* ---------- animation ---------- */
    var tg = {}, names = Object.keys(J);
    function tgt(k, x, y, z) { tg[k] = tg[k] || [0, 0, 0]; tg[k][0] = x; tg[k][1] = y; tg[k][2] = z; }
    var st = { pose: 'stand', t: 0, flinchT: -1, blinkT: 2.5, blinkP: 0, look: new T.Vector3(0, 1.6, 4), walkA: 0, curl: .35, stepBack: 0, heat: 0 };
    function pose(dt, t) {
      var br = Math.sin(t * 1.85) * .5 + .5, sway = Math.sin(t * .55), s;
      var p = st.pose, fl = st.flinchT >= 0 ? st.flinchT : -1;
      /* base standing */
      tgt('hips', 0, .03 * sway, .012 * sway); tgt('spine', .02, -.03 * sway, -.012 * sway); tgt('chest', .01 * br, 0, 0); tgt('neck', 0, 0, 0); tgt('head', 0, 0, 0);
      [1, -1].forEach(function (s) {
        tgt('sh' + s, .02 * Math.sin(t * .9 + s), 0, s * (.1 + .006 * br)); tgt('el' + s, -.2 - .02 * br, 0, 0); tgt('wr' + s, -.05, 0, 0);
        tgt('hp' + s, s > 0 ? -.01 : .0, 0, s * .03 + .01 * sway * s); tgt('kn' + s, .035, 0, 0); tgt('an' + s, 0, 0, 0);
      });
      var curl = .5, walkSpd = 0; hips.userData.y = .95; st.rootX = 0; st.rootZ = 0;
      if (p === 'walk') {
        st.walkA = Math.min(1, st.walkA + dt * 1.5); var ph = t * 4.4;
        tgt('hips', 0, .1 * Math.sin(ph), .035 * Math.sin(ph)); tgt('spine', .05, -.12 * Math.sin(ph), -.03 * Math.sin(ph)); tgt('head', 0, .05 * Math.sin(ph), 0);
        [1, -1].forEach(function (s) {
          var f = ph + (s > 0 ? 0 : Math.PI), thigh = -.44 * Math.sin(f), knee = .12 + .78 * Math.pow(Math.max(0, Math.cos(f)), 1.3);
          tgt('hp' + s, thigh, 0, s * .03); tgt('kn' + s, knee, 0, 0); tgt('an' + s, -(thigh * .5) - knee * .25 + .05, 0, 0);
          tgt('sh' + s, .46 * Math.sin(f), 0, s * .08); tgt('el' + s, -.32 - .24 * Math.max(0, Math.sin(f)), 0, 0); tgt('wr' + s, -.05, 0, 0);
        });
        hips.userData.y = .95 - .014 + .016 * Math.cos(2 * ph + .4); curl = .42;
      } else st.walkA = Math.max(0, st.walkA - dt * 3);
      if (p === 'work') {
        tgt('spine', .12, -.08, 0); tgt('chest', .06, 0, 0); tgt('head', .2, .18, 0); tgt('neck', .08, 0, 0);
        tgt('sh1', -1.12, -.04, .14); tgt('el1', -1.2, 0, 0); tgt('wr1', -.12, 0, 0); tgt('sh-1', -.62, 0, -.18); tgt('el-1', -1.45, 0, 0); tgt('wr-1', .05, 0, 0);
        tgt('hp1', -.05, 0, .04); tgt('hp-1', .06, 0, -.04); tgt('kn1', .08, 0, 0); tgt('kn-1', .02, 0, 0); curl = .5;
        tg['sh1'][0] += .04 * Math.sin(t * 1.3); tg['hd1'] = null;
      }
      if (fl >= 0) {
        var a = Math.min(1, fl / .12), rec = smooth(1.5, 2.4, fl), k = a * (1 - rec);
        tgt('head', -.25 * k, .75 * k, .15 * k); tgt('neck', -.12 * k, .2 * k, 0); tgt('spine', .02 - .3 * k, -.25 * k, 0); tgt('chest', -.12 * k, 0, 0); tgt('hips', .02 * k, .1 * k, 0);
        [1, -1].forEach(function (s) { tgt('sh' + s, -1.35 * k, 0, -s * .5 * k + s * .1 * (1 - k)); tgt('el' + s, -2.15 * k - .2 * (1 - k), 0, 0); tgt('wr' + s, -.2 * k, 0, 0); tgt('hp' + s, (s > 0 ? -.2 : .3) * k, 0, s * .03); tgt('kn' + s, .35 * k, 0, 0); });
        curl = .75 * k + .5 * (1 - k); st.stepBack = .25 * k;
      } else st.stepBack *= Math.max(0, 1 - dt * 3);
      st.curl = curl;
      /* eyes/head follow the viewer */
      var lp = root.worldToLocal(st.look.clone()), yaw = Math.max(-.7, Math.min(.7, Math.atan2(lp.x, lp.z))), pit = Math.max(-.3, Math.min(.3, -Math.atan2(lp.y - 1.65, Math.hypot(lp.x, lp.z)))) * .6;
      var lookW = (p === 'stand' && fl < 0) ? 1 : (fl >= 0 ? 0 : (p === 'work' ? .0 : .15));
      tg.head[1] += yaw * .55 * lookW; tg.head[0] += pit * lookW; tg.neck[1] += yaw * .2 * lookW; st.eyeYaw = yaw * .6 * (fl < 0 ? 1 : 0); st.eyePit = pit * .8;
      /* smooth every joint */
      var k2 = 1 - Math.exp(-dt * (fl >= 0 && fl < 1.4 ? 22 : p === 'walk' ? 14 : 7));
      names.forEach(function (n) { var o = J[n], g = tg[n]; if (!g || !o || n === 'root') return; o.rotation.x += (g[0] - o.rotation.x) * k2; o.rotation.y += (g[1] - o.rotation.y) * k2; o.rotation.z += (g[2] - o.rotation.z) * k2; });
      hips.position.y += (hips.userData.y - hips.position.y) * (1 - Math.exp(-dt * 12)); hips.position.z += (-st.stepBack - hips.position.z) * (1 - Math.exp(-dt * 9));
      [1, -1].forEach(function (s) { var c = st.curl + (p === 'work' && s > 0 ? .1 : 0); curlHand(J['hd' + s], s, c); });
      /* breathing: chest expands, shoulders lift slightly */
      var b2 = 1 + .011 * br; torsoMeshes[0].scale.set(b2, 1, 1 + .02 * br);
      /* blinking */
      st.blinkT -= dt; if (st.blinkT <= 0) { st.blinkP = 1; st.blinkT = 2.4 + Math.random() * 3.2; }
      if (st.blinkP > 0) st.blinkP = Math.max(0, st.blinkP - dt * 7);
      var closed = Math.sin(Math.min(1, st.blinkP) * Math.PI); ['eyeL', 'eyeR'].forEach(function (k) { var e = head.userData[k]; if (!e) return; e.userData.lid.rotation.x = -1.45 + 1.3 * closed; e.rotation.y += ((st.eyeYaw || 0) - e.rotation.y) * .2; e.rotation.x += ((st.eyePit || 0) - e.rotation.x) * .2; });
    }
    var out = { root: root, joints: J, parts: pm, mats: mats, head: head, headC: headC, state: st };
    out.update = function (dt, t) { st.t = t; if (st.flinchT >= 0) { st.flinchT += dt; if (st.flinchT > 2.7) st.flinchT = -1; } pose(dt, t); if (st.pose === 'walk') { var ang = t * .95, r = .9; root.position.set(Math.sin(ang) * r, 0, Math.cos(ang) * r - r + 0); root.rotation.y = ang + Math.PI / 2; root.position.set(Math.sin(ang) * r, 0, Math.cos(ang) * r - r); } else { root.position.x += (0 - root.position.x) * (1 - Math.exp(-dt * 4)); root.position.z += (0 - root.position.z) * (1 - Math.exp(-dt * 4)); var ry = root.rotation.y % (Math.PI * 2); root.rotation.y += (0 - (ry > Math.PI ? ry - Math.PI * 2 : ry)) * (1 - Math.exp(-dt * 4)); } };
    out.setPose = function (n) { st.pose = n; if (n === 'walk') { st.walkT0 = st.t; } };
    out.flinch = function () { st.flinchT = 0; };
    out.setHeat = function (h) { /* 0..1+ : orange glow, then charring past 1 */
      mats.forEach(function (m) { if (!m.emissive) return; var g = Math.min(1, h); m.emissive.setRGB(.9 * g, .28 * g, .02 * g); m.emissiveIntensity = h > 0 ? .38 : 0; var c = m.userData.base || new T.Color(1, 1, 1); var ch = h > 1 ? Math.max(.35, 1 - (h - 1) * .6) : 1; m.color.setRGB(ch, ch, ch); });
    };
    return out;
  };
})();
