/* 3D hero: a toroidal inductor. Copper winding with current flowing, magnetic flux confined in the core, AC waveforms orbiting. */
(function () {
  var box = document.getElementById('hero3d'), cv = document.getElementById('hero-gl'),
      still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start() { try {
    var T = THREE, R = 1.7, rr = .5, N = 56, TAU = Math.PI * 2;
    var r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    var sc = new T.Scene(), cam = new T.PerspectiveCamera(38, 1, .1, 60);
    cam.position.set(0, 2.6, 10.4); cam.lookAt(0, 0, 0);
    sc.add(new T.AmbientLight(0x8899bb, .9));
    var l1 = new T.PointLight(0x22d3ee, 1.3, 0); l1.position.set(5, 4, 5); sc.add(l1);
    var l2 = new T.PointLight(0xf59e0b, 1.3, 0); l2.position.set(-5, -2, 4); sc.add(l2);
    var l3 = new T.DirectionalLight(0xffffff, 1); l3.position.set(0, 6, 5); sc.add(l3);
    var rig = new T.Group(); rig.rotation.x = .5; sc.add(rig);
    // soft round sprite for particles
    var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    var tex = new T.CanvasTexture(c);
    // ferrite core
    var core = new T.Mesh(new T.TorusGeometry(R, .36, 24, 120), new T.MeshStandardMaterial({ color: 0x1e293b, metalness: .9, roughness: .3 }));
    core.rotation.x = Math.PI / 2; rig.add(core);
    // copper winding wound around the core
    function Helix() { T.Curve.call(this); } Helix.prototype = Object.create(T.Curve.prototype);
    Helix.prototype.getPoint = function (t, o) { var a = t * TAU, b = a * N, k = R + rr * Math.cos(b); return (o || new T.Vector3()).set(k * Math.cos(a), rr * Math.sin(b), k * Math.sin(a)); };
    var hx = new Helix(); hx.arcLengthDivisions = 4000;
    var wm = new T.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x7a3b00, metalness: .85, roughness: .25 });
    rig.add(new T.Mesh(new T.TubeGeometry(hx, 1800, .035, 6, true), wm));
    function pts(n, col, size) {
      var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3));
      var p = new T.Points(geo, new T.PointsMaterial({ color: col, size: size, map: tex, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
      p.frustumCulled = false; return p;
    }
    var E = 170, el = pts(E, 0x22d3ee, .17); rig.add(el);              // electrons in the winding
    var F = 4 * 52, fx = pts(F, 0xbfeaff, .16); rig.add(fx);           // flux inside the core
    var v = new T.Vector3();
    // AC waveform rings (voltage cyan, current amber, phase shifted)
    function ring(rad, col, ph) {
      var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(360 * 3), 3));
      var l = new T.LineLoop(geo, new T.LineBasicMaterial({ color: col, transparent: true, opacity: .85, blending: T.AdditiveBlending }));
      l.frustumCulled = false; l.userData = { rad: rad, ph: ph }; rig.add(l); return l;
    }
    var rings = [ring(2.95, 0x22d3ee, 0), ring(3.1, 0xf59e0b, 1.1)];
    // distant dust for depth
    var dust = pts(260, 0x7aa2c8, .07), dp = dust.geometry.attributes.position.array;
    for (var i = 0; i < 260; i++) { var rd = 5 + Math.random() * 5, th = Math.random() * TAU, ph = Math.acos(2 * Math.random() - 1); dp[i*3] = rd*Math.sin(ph)*Math.cos(th); dp[i*3+1] = rd*Math.cos(ph); dp[i*3+2] = rd*Math.sin(ph)*Math.sin(th); }
    sc.add(dust);
    function frame(t) {
      var ea = el.geometry.attributes.position.array;
      for (var i = 0; i < E; i++) { hx.getPoint((i / E + t * .035) % 1, v); ea[i*3] = v.x; ea[i*3+1] = v.y; ea[i*3+2] = v.z; }
      el.geometry.attributes.position.needsUpdate = true;
      var fa = fx.geometry.attributes.position.array, n = 0;
      for (var j = 0; j < 4; j++) { var b = j * Math.PI / 2, k = R + .2 * Math.cos(b), y = .2 * Math.sin(b);
        for (var i2 = 0; i2 < 52; i2++) { var a = (i2 / 52 + t * .09) * TAU; fa[n++] = k * Math.cos(a); fa[n++] = y; fa[n++] = k * Math.sin(a); } }
      fx.geometry.attributes.position.needsUpdate = true;
      rings.forEach(function (l) { var pa = l.geometry.attributes.position.array, d = l.userData;
        for (var i3 = 0; i3 < 360; i3++) { var a2 = i3 / 360 * TAU; pa[i3*3] = d.rad * Math.cos(a2); pa[i3*3+1] = .3 * Math.sin(5 * a2 - t * 2 + d.ph); pa[i3*3+2] = d.rad * Math.sin(a2); }
        l.geometry.attributes.position.needsUpdate = true; });
      wm.emissiveIntensity = .7 + .4 * Math.sin(t * 2.2);
      r.render(sc, cam);
    }
    function size() { var w = box.clientWidth, h = box.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); frame(tNow); }
    var vis = true, drag = false, lx = 0, ly = 0, tNow = 2, last = 0; rig.rotation.y = -.6;
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(box);
    cv.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) { if (!drag) return; rig.rotation.y += (e.clientX - lx) * .01; rig.rotation.x = Math.max(.05, Math.min(1.2, rig.rotation.x + (e.clientY - ly) * .006)); lx = e.clientX; ly = e.clientY; if (still) frame(tNow); });
    ['pointerup', 'pointercancel'].forEach(function (n) { cv.addEventListener(n, function () { drag = false; }); });
    new ResizeObserver(size).observe(box);
    cv.classList.remove('hidden'); document.getElementById('hero-fallback').style.display = 'none'; size();
    if (still) return;
    (function loop(ms) { requestAnimationFrame(loop); var dt = Math.min((ms - last) / 1000, .05); last = ms;
      if (!vis || document.hidden) return;
      tNow += dt; if (!drag) { rig.rotation.y += dt * .22; } dust.rotation.y += dt * .01; frame(tNow); })(0);
  } catch (e) { /* keep the static fallback */ } }
  addEventListener('load', function () { var s = document.createElement('script'); s.src = 'vendor/three.min.js'; s.onload = start; document.head.appendChild(s); });
})();
