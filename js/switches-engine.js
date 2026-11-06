/* Shared 3D engine for the switch lab pages: scene, lights, shadows, resize, frame-rate independent loop. */
(function () {
  'use strict';
  var S = { dtScale: 1 }, scene, camera, renderer, controls, container, home, shadowTimer = 0;

  S.k = function (f) { return 1 - Math.pow(1 - f, S.dtScale); }; // frame-rate independent smoothing factor
  Object.defineProperty(S, 's', { get: function () { return S.dtScale; } });

  S.create = function (o) {
    container = document.getElementById('canvas-container');
    var canvas = document.getElementById('three-canvas');
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x020617);
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    home = new THREE.Vector3(o.camera[0], o.camera[1], o.camera[2]); camera.position.copy(home);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.06;
    controls.maxDistance = o.maxDistance || 12; controls.minDistance = o.minDistance || 1.8;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    scene.add(new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.35));
    var key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(5, 8, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
    var sc = key.shadow.camera; sc.left = -6; sc.right = 6; sc.top = 6; sc.bottom = -6; sc.near = 1; sc.far = 24;
    scene.add(key);
    var fill = new THREE.DirectionalLight(0x38bdf8, 0.4); fill.position.set(-6, -2, -5); scene.add(fill);
    var rim = new THREE.DirectionalLight(0xf59e0b, 0.25); rim.position.set(0, 3, -7); scene.add(rim);

    var gy = o.gridY;
    var grid = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b); grid.position.y = gy; scene.add(grid);
    var catcher = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: 0.4 }));
    catcher.rotation.x = -Math.PI / 2; catcher.position.y = gy + 0.002; catcher.receiveShadow = true; scene.add(catcher);
    S.catcher = catcher;

    function size() {
      var w = container.clientWidth, h = container.clientHeight; if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
    }
    new ResizeObserver(size).observe(container); size();
    S.scene = scene; S.camera = camera; S.renderer = renderer; S.controls = controls;
    return S;
  };

  // every mesh casts shadows; run again if a page builds new geometry later
  S.refreshShadows = function () {
    scene.traverse(function (m) { if (m.isMesh && m !== S.catcher) { m.castShadow = true; } });
  };

  S.reset = function () { controls.reset(); camera.position.copy(home); controls.target.set(0, 0, 0); controls.update(); };

  S.start = function (extra, getAuto) {
    var last = 0;
    S.refreshShadows();
    (function loop(now) {
      requestAnimationFrame(loop);
      if (document.hidden) { last = now; return; }
      var dt = Math.min((now - last) / 1000 || 0.016, 0.05); last = now; S.dtScale = dt * 60;
      if (extra) extra(dt);
      if (now - shadowTimer > 1500) { shadowTimer = now; S.refreshShadows(); }
      controls.autoRotate = getAuto ? !!getAuto() : false; controls.autoRotateSpeed = 2.0;
      controls.update(); renderer.render(scene, camera);
    })(0);
  };

  window.SWE = S;
})();
