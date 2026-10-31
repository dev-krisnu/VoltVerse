/* 3D hero: a generalized electric machine (motor / generator).
   A two-pole magnet rotor spins inside a 12-coil stator; magnetic flux loops through the rotor, air gap and stator iron,
   and the stator coils light up as the rotating field passes them. */
(function () {
  var box = document.getElementById('hero3d'), cv = document.getElementById('hero-gl'),
      still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start() { try {
    var T = THREE, TAU = Math.PI * 2, NT = 12, L = 1.5;
    var r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    var sc = new T.Scene(), cam = new T.PerspectiveCamera(36, 1, .1, 80);
    cam.position.set(0, .3, 13.6); cam.lookAt(0, 0, 0);
    sc.add(new T.AmbientLight(0x8fa3c7, .75));
    var d1 = new T.DirectionalLight(0xffffff, 1.1); d1.position.set(3, 5, 7); sc.add(d1);
    var p1 = new T.PointLight(0x22d3ee, 1.2, 0); p1.position.set(-6, 3, 6); sc.add(p1);
    var p2 = new T.PointLight(0xf59e0b, 1.2, 0); p2.position.set(6, -3, 5); sc.add(p2);
    var rig = new T.Group(); sc.add(rig);

    function sprite() { var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); }
    var dot = sprite();
    function pts(n, col, size) { var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3));
      var p = new T.Points(geo, new T.PointsMaterial({ color: col, size: size, map: dot, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); p.frustumCulled = false; return p; }
    var steel = new T.MeshStandardMaterial({ color: 0x3b4f70, metalness: .85, roughness: .32, side: T.DoubleSide });

    // ---- stator: laminated ring, 12 teeth, 12 wound coils
    function cyl(ro, ri, bs) { var m = new T.Mesh(new T.CylinderGeometry(ro, ro, L, 96, 1, true), bs || steel); m.rotation.x = Math.PI / 2; return m; }
    [-L / 2, L / 2].forEach(function (z) { var e = new T.Mesh(new T.TorusGeometry(2.98, .07, 14, 160), steel); e.position.z = z; rig.add(e); });
    var sc2 = document.createElement('canvas'); sc2.width = 64; sc2.height = 8; var g2 = sc2.getContext('2d');
    g2.fillStyle = '#3b2204'; g2.fillRect(0, 0, 64, 8); g2.fillStyle = '#ffd08a'; for (var x = 0; x < 64; x += 8) g2.fillRect(x, 0, 5, 8);
    var wtex = new T.CanvasTexture(sc2); wtex.wrapS = wtex.wrapT = T.RepeatWrapping; wtex.repeat.set(5, 1);
    var coils = [];
    for (var i = 0; i < NT; i++) {
      var th = i / NT * TAU, c = Math.cos(th), s = Math.sin(th);
      var tooth = new T.Mesh(new T.BoxGeometry(1.3, .12, L * .96), steel); tooth.position.set(2.3 * c, 2.3 * s, 0); tooth.rotation.z = th; rig.add(tooth);
      var cm = new T.MeshStandardMaterial({ color: 0x9a6a2a, map: wtex, emissive: 0xff8c1a, emissiveMap: wtex, emissiveIntensity: .14, metalness: .35, roughness: .45 });
      var coil = new T.Mesh(new T.BoxGeometry(.8, .42, L * .8), cm); coil.position.set(1.95 * c, 1.95 * s, 0); coil.rotation.z = th; rig.add(coil);
      coils.push({ mat: cm, th: th });
    }
    // ---- rotor: two-pole permanent magnet + shaft
    var rotor = new T.Group(); rig.add(rotor);
    function half(start, col, em) { var m = new T.Mesh(new T.CylinderGeometry(.95, .95, L * 1.1, 48, 1, false, start, Math.PI), new T.MeshStandardMaterial({ color: col, emissive: em, metalness: .65, roughness: .22 })); m.rotation.x = Math.PI / 2; rotor.add(m); }
    half(0, 0x22d3ee, 0x07343d); half(Math.PI, 0xf59e0b, 0x4a2a05);
    var shaft = new T.Mesh(new T.CylinderGeometry(.13, .13, 3.6, 24), new T.MeshStandardMaterial({ color: 0xcbd5e1, metalness: .95, roughness: .15 })); shaft.rotation.x = Math.PI / 2; rotor.add(shaft);

    // ---- magnetic flux: closed loops (rotor frame, pole axis = +x) and particles that travel along them
    var curves = [];
    [-1, 1].forEach(function (sg) { [.18, .46, .74].forEach(function (y0) { [-.5, 0, .5].forEach(function (z) {
      var y = sg * y0, a1 = .22 + y0 * 1.15, P = [new T.Vector3(-.9, y, z), new T.Vector3(.9, y, z)], q;
      function pol(rad, a) { return new T.Vector3(rad * Math.cos(a), sg * rad * Math.sin(a), z); }
      P.push(pol(1.6, a1 * .75), pol(2.62, a1));
      for (q = 1; q <= 5; q++) P.push(pol(2.66, a1 + (Math.PI - 2 * a1) * q / 6));
      P.push(pol(2.62, Math.PI - a1), pol(1.6, Math.PI - a1 * .75));
      curves.push(new T.CatmullRomCurve3(P, true, 'catmullrom', .5));
    }); }); });
    var lineMat = new T.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: .42, blending: T.AdditiveBlending, depthWrite: false });
    curves.forEach(function (cu) { rotor.add(new T.Mesh(new T.TubeGeometry(cu, 120, .016, 4, true), lineMat)); });
    var PER = 8, flux = pts(curves.length * PER, 0xd9f4ff, .3); rotor.add(flux);
    // ---- quiet decoration: air-gap glow, tick ring, slow dashed outer ring, dust
    var gap = new T.Mesh(new T.TorusGeometry(1.2, .012, 8, 128), new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: .55, blending: T.AdditiveBlending })); rig.add(gap);
    var dg = new T.BufferGeometry().setFromPoints(new T.EllipseCurve(0, 0, 3.75, 3.75, 0, TAU, false, 0).getPoints(160).map(function (p) { return new T.Vector3(p.x, p.y, 0); }));
    var dash = new T.LineSegments(dg, new T.LineDashedMaterial({ color: 0x38bdf8, dashSize: .12, gapSize: .2, transparent: true, opacity: .55 })); dash.computeLineDistances(); rig.add(dash);
    var dust = pts(240, 0x7aa2c8, .07), dp = dust.geometry.attributes.position.array;
    for (var k = 0; k < 240; k++) { var rd = 6 + Math.random() * 6, a = Math.random() * TAU, b = Math.acos(2 * Math.random() - 1); dp[k*3] = rd*Math.sin(b)*Math.cos(a); dp[k*3+1] = rd*Math.cos(b); dp[k*3+2] = rd*Math.sin(b)*Math.sin(a); }
    sc.add(dust);

    var v = new T.Vector3(), ux = -.4, uy = .4, tNow = 2;
    function frame(t) {
      var phi = t * .85; rotor.rotation.z = phi;
      for (var i = 0; i < NT; i++) { var d = Math.cos(coils[i].th - phi); coils[i].mat.emissiveIntensity = .16 + .8 * Math.pow(d * d, 2.5); }
      var fa = flux.geometry.attributes.position.array, n = 0;
      for (var c = 0; c < curves.length; c++) for (var j = 0; j < PER; j++) { curves[c].getPoint((j / PER + t * .09) % 1, v); fa[n++] = v.x; fa[n++] = v.y; fa[n++] = v.z; }
      flux.geometry.attributes.position.needsUpdate = true;
      dash.rotation.z = -t * .05; dust.rotation.y = t * .01;
      rig.rotation.x = ux; rig.rotation.y = uy + .4 * Math.sin(t * .3);
      r.render(sc, cam);
    }
    function size() { var w = box.clientWidth, h = box.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); frame(tNow); }
    var vis = true, drag = false, lx = 0, ly = 0, last = 0;
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(box);
    cv.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) { if (!drag) return; uy += (e.clientX - lx) * .008; ux = Math.max(-1.3, Math.min(.2, ux + (e.clientY - ly) * .006)); lx = e.clientX; ly = e.clientY; if (still) frame(tNow); });
    ['pointerup', 'pointercancel'].forEach(function (n) { cv.addEventListener(n, function () { drag = false; }); });
    new ResizeObserver(size).observe(box);
    cv.classList.remove('hidden'); document.getElementById('hero-fallback').style.display = 'none'; size();
    if (still) return;
    (function loop(ms) { requestAnimationFrame(loop); var dt = Math.min((ms - last) / 1000, .05); last = ms; if (!vis || document.hidden) return; tNow += dt; frame(tNow); })(0);
  } catch (e) { /* keep the static fallback */ } }
  addEventListener('load', function () { var s = document.createElement('script'); s.src = 'vendor/three.min.js'; s.onload = start; document.head.appendChild(s); });
})();
