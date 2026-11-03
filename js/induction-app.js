/* 3D induction motor visualizer: page logic. Model geometry lives in induction-model.js. */
(function () {
  'use strict';
  var NS = 1500; // synchronous speed: 4 poles, 50 Hz
  var PARTS = {
    frame: { name: 'Frame, Fins & Feet', category: 'STATOR ASSEMBLY', icon: 'fa-shield-halved', material: 'Cast iron (or aluminium for small motors)', spec: 'Finned TEFC body with mounting feet',
      description: 'The outer casting that holds the stator core, carries the end covers and bolts to the foundation through its feet. External fins increase surface area so heat from the windings can escape.',
      features: ['Longitudinal cooling fins sit in the air stream from the fan.', 'Feet (the "seats") hold the motor rigidly and take the reaction torque.', 'A machined seat at each end locates the end covers so the rotor stays centred.'],
      comparison: 'Identical for squirrel cage and slip ring motors.' },
    stator_core: { name: 'Stator Core (Laminations)', category: 'STATOR ASSEMBLY', icon: 'fa-layer-group', material: 'Silicon steel laminations (0.35 to 0.5 mm)', spec: '36 slots, pressed into the frame',
      description: 'A stack of thin insulated steel sheets with slots punched around the bore. It gives the magnetic flux an easy path and holds the stator winding in its slots.',
      features: ['Thin insulated laminations cut eddy current loss.', 'Slots are evenly spaced so the winding can be distributed around the bore.', 'The small air gap between the bore and the rotor keeps the magnetising current low.'],
      comparison: 'Identical for both rotor types.' },
    stator_winding: { name: 'Stator Winding', category: 'STATOR ASSEMBLY', icon: 'fa-bolt', material: 'Enamelled copper, class F insulation', spec: '3-phase, coloured here by phase',
      description: 'Three sets of coils placed in the slots and spaced 120 electrical degrees apart. The 3-phase supply makes them create a magnetic field that rotates at synchronous speed. The curved coil ends outside the core are the overhang.',
      features: ['Red, yellow and blue show the three phases.', 'Overhang (end windings) is long enough to clear the end covers and let air circulate.', 'The six leads go to the terminal box for star or delta connection.'],
      comparison: 'Identical for both rotor types.' },
    rotor_cage: { name: 'Squirrel Cage Rotor', category: 'ROTOR ASSEMBLY (CAGE)', icon: 'fa-dharmachakra', material: 'Laminated steel core, die-cast aluminium bars', spec: '28 skewed bars shorted by two end rings',
      description: 'Laminations pressed on the shaft with aluminium bars cast through them. Two end rings short-circuit all the bars, forming a closed cage. The rotating stator field induces current in the bars, and that current produces torque.',
      features: ['Bars are skewed by one slot pitch to reduce magnetic hum and cogging.', 'Small blades cast on the end rings help move air inside the motor.', 'No brushes or slip rings, so almost no maintenance.'],
      comparison: 'Used in most industrial motors. The rotor resistance is fixed, so starting torque cannot be adjusted.' },
    rotor_wound: { name: 'Wound Rotor', category: 'ROTOR ASSEMBLY (SLIP RING)', icon: 'fa-ring', material: 'Laminated core with insulated copper winding', spec: '3-phase, star connected, led out to slip rings',
      description: 'A laminated rotor with a real 3-phase winding in its slots (same number of poles as the stator). The three winding ends go to slip rings on the shaft, so external resistance can be added in the rotor circuit.',
      features: ['External resistance gives high starting torque with low starting current.', 'Resistance can be cut out step by step as the motor speeds up.', 'Used for cranes, hoists, crushers and mills with heavy starting loads.'],
      comparison: 'Replaces the squirrel cage when high starting torque or limited starting current is needed.' },
    slip_rings: { name: 'Slip Rings', category: 'SLIP RING ASSEMBLY', icon: 'fa-circle-notch', material: 'Brass or phosphor bronze on an insulating bush', spec: '3 rings, one per rotor phase',
      description: 'Three metal rings mounted on an insulating sleeve at the non-drive end of the shaft. They turn with the rotor and carry the rotor current out to stationary brushes.',
      features: ['Each ring is insulated from the shaft and from the other rings.', 'The rotor winding leads run through the shaft to the rings.', 'Rings wear slowly and need occasional cleaning.'],
      comparison: 'Found only on slip ring (wound rotor) motors.' },
    brush_gear: { name: 'Brushes & Brush Holders', category: 'SLIP RING ASSEMBLY', icon: 'fa-plug', material: 'Carbon brushes, brass holders, steel springs', spec: 'Spring-loaded sliding contacts',
      description: 'Carbon brushes held by springs press against the slip rings and pass rotor current to the external resistor bank. An open guard around the slip rings keeps hands clear while letting heat out.',
      features: ['Springs keep constant pressure as the brushes wear down.', 'Carbon is self-lubricating and keeps contact resistance low.', 'Brushes need regular inspection and replacement.'],
      comparison: 'Found only on slip ring motors. Some designs lift the brushes and short the rings after starting to reduce wear.' },
    shaft: { name: 'Shaft', category: 'MECHANICAL ASSEMBLY', icon: 'fa-gear', material: 'Medium carbon steel', spec: 'Keyed drive end, ground bearing seats',
      description: 'The rotating member that carries the rotor and transmits the torque to the load. The keyway at the drive end locks pulleys, gears or couplings to it. The white mark helps you see it turning.',
      features: ['Machined step shoulders locate the rotor core and the bearings.', 'A key stops the coupling from slipping on the shaft.', 'The non-drive end carries the cooling fan (cage motor) or the slip rings (wound motor).'],
      comparison: 'Same design; the slip ring motor shaft is longer at the non-drive end to carry the rings.' },
    bearings: { name: 'Ball Bearings', category: 'MECHANICAL ASSEMBLY', icon: 'fa-circle-dot', material: 'Chrome steel races and balls', spec: 'Deep groove ball bearing at each end',
      description: 'One bearing at each end supports the rotor and keeps it centred so the air gap stays small and even. The outer race sits in the end cover hub and the inner race turns with the shaft.',
      features: ['Deep groove type carries both radial and some axial load.', 'Grease filled and sealed for long life.', 'Worn bearings let the rotor sag and rub the stator.'],
      comparison: 'Same in both constructions.' },
    end_cover: { name: 'End Covers (End Shields)', category: 'MECHANICAL ASSEMBLY', icon: 'fa-shield-halved', material: 'Cast iron', spec: 'Bolted flange with central bearing hub',
      description: 'A pair of castings bolted to the ends of the frame. Each has a central hub that holds a bearing, and together they keep the rotor exactly in the middle of the stator bore.',
      features: ['Drive end cover supports the shaft where the load is connected.', 'Non-drive end cover also locates the fan cowl or the slip ring guard.', 'Machined seats keep the bearings and the frame in line.'],
      comparison: 'Same castings in both constructions; only what is bolted to the non-drive end differs.' },
    fan: { name: 'Cooling Fan & Cowl', category: 'COOLING SYSTEM', icon: 'fa-fan', material: 'Plastic or aluminium fan, sheet steel cowl', spec: 'TEFC: totally enclosed, fan cooled',
      description: 'A fan on the non-drive end of the shaft blows outside air along the fins of the frame. The grilled cowl protects the fan and guides the air. The inside of the motor stays sealed from dust and water.',
      features: ['Fan speed follows the rotor speed, so cooling falls if the motor runs slowly.', 'The cowl grille keeps fingers away from the blades.', 'Dirty fins or a blocked grille make the motor run hot.'],
      comparison: 'Shown on the squirrel cage motor. The slip ring motor here uses an open brush-gear guard instead.' },
    terminal_box: { name: 'Terminal Box', category: 'ELECTRICAL CONNECTION', icon: 'fa-plug', material: 'Cast iron or aluminium', spec: '6 terminals: U1 V1 W1 / W2 U2 V2',
      description: 'A box on top of the frame where the supply cable meets the stator leads. Brass links join the terminals for star or delta connection.',
      features: ['Three links in a row give delta, a single bar across three gives star.', 'A gland seals the cable entry.', 'An earth terminal is provided for safety.'],
      comparison: 'Slip ring motors also have a second box for the rotor leads (not shown).' }
  };

  var state = { type: 'cage', cut: false, run: true, rpm: 1450, explode: 0, rmf: true, sel: 'stator_core' };
  var $ = function (id) { return document.getElementById(id); };
  var scene, camera, renderer, controls, res = null, flying = false, userMoved = false, target = new THREE.Vector3(0, 0, 0), camGoal = new THREE.Vector3();
  var spinAngle = 0, fieldAngle = 0, lastT = 0, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();

  function homePos() {
    var box = $('canvas-container'), a = (box.clientWidth || 1) / (box.clientHeight || 1);
    var d = Math.max(9.2, 8.6 / a + 1.4 + state.explode * 4);
    return new THREE.Vector3(0.42, 0.28, 0.86).normalize().multiplyScalar(d);
  }
  function homeTarget() { return new THREE.Vector3(-0.3 + state.explode * 0.5, 0.1, 0); }

  function init() {
    var box = $('canvas-container');
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x0f172a); scene.fog = new THREE.FogExp2(0x0f172a, 0.018);
    camera = new THREE.PerspectiveCamera(40, box.clientWidth / box.clientHeight, 0.1, 120);
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
    catch (e) { box.innerHTML = '<div class="h-full flex items-center justify-center p-6 text-center text-sm text-slate-400">The 3D view needs WebGL, which is not available on this device.</div>'; return false; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setSize(box.clientWidth, box.clientHeight, false);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    box.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.06; controls.minDistance = 3; controls.maxDistance = 26; controls.maxPolarAngle = Math.PI / 2 + 0.2;
    controls.addEventListener('start', function () { flying = false; userMoved = true; });
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    var k = new THREE.DirectionalLight(0xffffff, 1.25); k.position.set(5, 8, 7); scene.add(k);
    var f = new THREE.DirectionalLight(0x38bdf8, 0.5); f.position.set(-6, 2, -5); scene.add(f);
    var g = new THREE.PolarGridHelper(9, 16, 8, 64, 0x334155, 0x1e293b); g.position.y = -1.9; scene.add(g);
    camera.position.copy(homePos()); target.copy(homeTarget()); controls.target.copy(target);
    new ResizeObserver(function () {
      var w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
      if (!userMoved) { camera.position.copy(homePos()); controls.target.copy(homeTarget()); }
    }).observe(box);
    return true;
  }

  function rebuild() {
    if (res) { scene.remove(res.root); IM.dispose(res); }
    res = IM.build(THREE, { type: state.type, cut: state.cut });
    scene.add(res.root); IM.applyExplode(res, state.explode); IM.setHighlight(res, state.sel); res.rmf.visible = state.rmf;
    var allowed = partKeys(); if (allowed.indexOf(state.sel) < 0) { state.sel = allowed[0]; }
    IM.setHighlight(res, state.sel);
  }

  function partKeys() {
    return ['stator_core', 'stator_winding', 'frame', 'end_cover', 'bearings', 'shaft'].concat(state.type === 'cage' ? ['rotor_cage', 'fan'] : ['rotor_wound', 'slip_rings', 'brush_gear'], ['terminal_box']);
  }

  function select(key) {
    state.sel = key; if (res) IM.setHighlight(res, key);
    var d = PARTS[key]; if (!d) return;
    $('part-category').textContent = d.category; $('part-title').textContent = d.name;
    $('part-icon').innerHTML = '<i class="fa-solid ' + d.icon + ' text-lg"></i>';
    $('part-description').textContent = d.description; $('part-material').textContent = d.material; $('part-spec').textContent = d.spec;
    var ul = $('part-features'); ul.innerHTML = ''; d.features.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    $('part-comparison-text').textContent = d.comparison; $('tooltip-text').textContent = d.name;
    document.querySelectorAll('#component-list button').forEach(function (b) { b.classList.toggle('active', b.dataset.key === key); });
  }

  function populateList() {
    var c = $('component-list'); c.innerHTML = '';
    partKeys().forEach(function (key) {
      var d = PARTS[key], b = document.createElement('button');
      b.dataset.key = key; b.type = 'button';
      b.className = 'w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center transition-all glass-btn touch-target' + (key === state.sel ? ' active' : '');
      b.innerHTML = '<span class="flex items-center gap-2 truncate"><i class="fa-solid ' + d.icon + '"></i><span class="truncate">' + d.name + '</span></span>';
      b.addEventListener('click', function () { select(key); });
      c.appendChild(b);
    });
  }

  function speedText() {
    var slip = Math.max(0, (NS - state.rpm) / NS * 100);
    $('speed-display').textContent = state.run ? state.rpm + ' RPM' : '0 RPM (STOPPED)';
    $('slip-info').textContent = state.run ? 'Slip = (' + NS + ' - ' + state.rpm + ') / ' + NS + ' = ' + slip.toFixed(1) + ' %' : 'Stopped: slip = 100 %';
  }

  function setBtn(on, off, a) { $(on).classList.toggle('active', a); $(off).classList.toggle('active', !a); }

  function bind() {
    $('btn-squirrel').addEventListener('click', function () { state.type = 'cage'; setBtn('btn-squirrel', 'btn-slipring', true); if (state.sel === 'rotor_wound' || state.sel === 'slip_rings' || state.sel === 'brush_gear') state.sel = 'rotor_cage'; rebuild(); populateList(); select(state.sel); });
    $('btn-slipring').addEventListener('click', function () { state.type = 'slip'; setBtn('btn-slipring', 'btn-squirrel', true); if (state.sel === 'rotor_cage' || state.sel === 'fan') state.sel = 'rotor_wound'; rebuild(); populateList(); select(state.sel); });
    $('btn-view-full').addEventListener('click', function () { state.cut = false; setBtn('btn-view-full', 'btn-view-cut', true); rebuild(); });
    $('btn-view-cut').addEventListener('click', function () { state.cut = true; setBtn('btn-view-cut', 'btn-view-full', true); rebuild(); });
    $('btn-reset-cam').addEventListener('click', function () { userMoved = false; camGoal.copy(homePos()); target.copy(homeTarget()); flying = true; });
    $('btn-toggle-motor').addEventListener('click', function () {
      state.run = !state.run;
      $('motor-status-icon').className = 'fa-solid ' + (state.run ? 'fa-pause' : 'fa-play'); $('motor-status-text').textContent = state.run ? 'PAUSE' : 'RESUME'; speedText();
    });
    $('slider-rpm').addEventListener('input', function (e) { state.rpm = parseInt(e.target.value, 10) || 0; speedText(); });
    $('slider-explode').addEventListener('input', function (e) {
      state.explode = parseFloat(e.target.value) / 100; $('explode-slider-val').textContent = e.target.value + '%';
      if (res) IM.applyExplode(res, state.explode);
      if (!userMoved) { camera.position.copy(homePos()); controls.target.copy(homeTarget()); }
    });
    $('toggle-rmf').addEventListener('change', function (e) { state.rmf = e.target.checked; if (res) res.rmf.visible = state.rmf; $('rmf-status-badge').classList.toggle('hidden', !state.rmf); });
    // tap / click to inspect (ignore drags)
    var el = renderer.domElement, sx = 0, sy = 0, st = 0;
    el.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; st = performance.now(); });
    el.addEventListener('pointerup', function (e) {
      if (Math.abs(e.clientX - sx) > 6 || Math.abs(e.clientY - sy) > 6 || performance.now() - st > 450 || !res) return;
      var r = el.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / r.width * 2 - 1; mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      var hit = raycaster.intersectObjects(res.root.children, true)[0];
      if (hit) { var o = hit.object; while (o && !o.userData.partKey && o.parent) o = o.parent; if (o && o.userData.partKey) select(o.userData.partKey); }
    });
  }

  function loop(now) {
    requestAnimationFrame(loop);
    var dt = Math.min((now - lastT) / 1000, 0.08); lastT = now;
    if (document.hidden) return;
    if (res && state.run) {
      // slow motion: the synchronous speed is drawn as one revolution per second
      var wr = state.rpm / NS * Math.PI * 2, wf = Math.PI * 2;
      Object.keys(res.parts).forEach(function (k) { res.parts[k].forEach(function (p) { if (p.spin) p.obj.rotation.x += wr * dt; }); });
      res.rmf.rotation.x += wf * dt;
    }
    if (flying) {
      camera.position.lerp(camGoal, 0.12); controls.target.lerp(target, 0.12);
      if (camera.position.distanceTo(camGoal) < 0.02) flying = false;
    }
    controls.update(); renderer.render(scene, camera);
  }

  window.addEventListener('DOMContentLoaded', function () {
    if (!init()) return;
    rebuild(); populateList(); select(state.sel); bind(); speedText();
    requestAnimationFrame(function (t) { lastT = t; loop(t); });
  });
})();
