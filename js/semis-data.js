/* Diodes and transistors. Values are typical datasheet figures. */
(function () {
  var E = Math.exp, S = function (v, a, b) { return Math.max(0, Math.min(1, (v - a) / (b - a))); };
  function mode() { return window.CATAPI ? window.CATAPI.mode() : null; }
  /* generic characteristic chart: f(x) -> y, x range, y range, marker */
  function ch(cfg) {
    return { title: cfg.title || 'Characteristic curve', h: 210, note: cfg.note, draw: function (x, w, h, v, tT, md) {
      var CH = window.CATCHART, l = 38, r = 12, t = 12, b = 30, W = w - l - r, H = h - t - b, X = cfg.x, Y = cfg.y;
      function px(a) { return l + (a - X[0]) / (X[1] - X[0]) * W; } function py(a) { return t + H - (a - Y[0]) / (Y[1] - Y[0]) * H; }
      x.strokeStyle = 'rgba(148,163,184,.14)'; x.lineWidth = 1; for (var i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(l, t + H * i / 4); x.lineTo(l + W, t + H * i / 4); x.stroke(); x.beginPath(); x.moveTo(l + W * i / 4, t); x.lineTo(l + W * i / 4, t + H); x.stroke(); }
      x.strokeStyle = 'rgba(203,213,225,.55)'; x.beginPath(); x.moveTo(l, py(0)); x.lineTo(l + W, py(0)); x.moveTo(px(0), t); x.lineTo(px(0), t + H); x.stroke();
      if (cfg.bands) cfg.bands.forEach(function (bd) { x.fillStyle = bd[2]; x.fillRect(px(bd[0]), t, px(bd[1]) - px(bd[0]), H); x.fillStyle = '#cbd5e1'; x.font = '600 10px Inter,Arial'; x.textAlign = 'center'; x.fillText(bd[3], (px(bd[0]) + px(bd[1])) / 2, t + 11); });
      var pts = [], N = 160, m; for (i = 0; i <= N; i++) { var a = X[0] + (X[1] - X[0]) * i / N; pts.push([px(a), py(cfg.f(a, md))]); } CH.line(x, pts, '#67e8f9', 2.4);
      var mx = cfg.mx(v, md), my = cfg.f(mx, md); CH.dot(x, px(mx), py(my), '#facc15');
      x.fillStyle = '#7d90a8'; x.font = '10.5px Inter,Arial'; x.textAlign = 'right'; x.fillText(cfg.ylab, l + W, t + 22); x.textAlign = 'center'; x.fillText(cfg.xlab, l + W / 2, h - 6); if (cfg.marks) cfg.marks.forEach(function (q) { x.fillStyle = q[2] || '#fbbf24'; x.textAlign = 'left'; x.fillText(q[3], px(q[0]) + 4, py(q[1])); x.fillRect(px(q[0]) - 1, py(0) - 4, 2, 8); }); } };
  }
  var dFwd = function (a) { return E((a - 1) / .07); };
  var PNMODES = [['fwd', 'Forward bias'], ['rev', 'Reverse bias']];
  window.CAT = {
    kind: 'x', fit: 1.1, order: ['rect', 'zener', 'led', 'bjt', 'mosfet', 'igbt'], prosTitle: 'Where it is used', rowsTitle: 'Specifications', dir: [.45, .45, 1], viewer: { pos: [4, 5, 12], target: [0, 2, 0], size: 40 }, modesTitle: 'Bias', speed: .6,
    models: {
      rect: { title: 'Rectifier diode', short: 'Rectifier', std: 'PN junction · e.g. 1N4007', modes: PNMODES, linear: true,
        slider: { title: 'Drag to turn it on', label: 'Voltage across the diode', fmt: function (v) { return mode() === 'rev' ? Math.round(v * 400) + ' V reverse' : (v * 1.0).toFixed(2) + ' V forward'; } },
        statusFn: function (v) { return mode() === 'rev' ? 'Blocking · tiny leakage' : v < .55 ? 'Off · below 0.7 V' : 'On · conducting'; },
        desc: 'A diode lets current go one way only. It is the building block of every rectifier, which changes AC to DC.',
        rating: [['Turn-on', '≈ 0.7 V (silicon)'], ['1N4007', '1 A, 1000 V'], ['Reverse leakage', 'Microamps']],
        principle: 'A PN junction joins P-type silicon (extra holes) to N-type silicon (extra electrons). Where they meet, electrons and holes cancel and leave a thin depletion region with no free carriers. It has a built-in field that blocks current. Forward bias (anode positive) pushes carriers toward the junction and shrinks the depletion region. Above about 0.7 V, carriers flood across and the diode conducts. Reverse bias pulls carriers away, widens the depletion region, and only a tiny leakage current flows.',
        pros: ['Rectifiers in chargers and power supplies', 'Freewheeling diodes across relay coils and motors', 'Reverse-polarity protection'],
        rows: [['Silicon forward drop', '0.6 to 0.7 V'], ['Schottky forward drop', '0.2 to 0.4 V, faster, lower reverse rating'], ['PIV / VRRM', 'Peak reverse voltage it can block'], ['IF(AV)', 'Average forward current'], ['Band marking', 'Stripe at the cathode']],
        facts: ['A silicon diode drops about 0.7 V whatever the current, so it dissipates about 0.7 V × I as heat.', 'Test with a multimeter diode range. About 0.5 to 0.7 V one way and OL the other way means a good diode.'],
        chart: ch({ title: 'Current against voltage', x: [-1, 1], y: [-.08, 1.05], f: function (a) { return a >= 0 ? dFwd(a) : -.01; }, mx: function (v, m) { return m === 'rev' ? -v : v; }, xlab: 'reverse  ◀  voltage  ▶  forward', ylab: 'current', marks: [[.7, .08, '#fbbf24', '0.7 V']] }),
        parts: { p: 'P-type: holes are the majority carriers.', n: 'N-type: electrons are the majority carriers.', dep: 'The depletion region. It shrinks with forward bias and widens with reverse bias.' } },
      zener: { title: 'Zener diode', short: 'Zener', std: 'Breakdown diode · e.g. BZX55C5V1', modes: PNMODES, linear: true,
        slider: { title: 'Drag to turn it on', label: 'Voltage across the diode', fmt: function (v) { return mode() === 'rev' ? (v * 10).toFixed(1) + ' V reverse' : (v * 1.0).toFixed(2) + ' V forward'; } },
        statusFn: function (v) { return mode() !== 'rev' ? (v < .55 ? 'Off' : 'On like a normal diode') : v < .5 ? 'Blocking' : 'Breakdown · holds 5.1 V'; },
        desc: 'A Zener is built to be used in reverse. Above its Zener voltage it conducts and holds that voltage almost constant. This makes it a simple voltage reference or clamp.',
        rating: [['Zener voltage', '2.4 to 200 V'], ['Example', '5.1 V'], ['Power', '0.5 W, 1 W, 5 W']],
        principle: 'Both sides of a Zener are heavily doped, so its depletion region is very thin. In reverse bias, the field across that thin layer becomes strong enough at the Zener voltage to pull electrons out of the bonds (Zener effect below about 5 V) or to knock them loose by collision (avalanche effect above about 7 V). The current then rises steeply while the voltage hardly changes. A series resistor must limit the current, otherwise the diode overheats.',
        pros: ['Simple voltage regulator with a series resistor', 'Protecting a gate or input from overvoltage', 'Voltage reference in small circuits'],
        rows: [['Regulator', 'R = (Vin − Vz) / (Iz + Iload)'], ['Zener test current', 'Usually 5 mA, or as the datasheet says'], ['Temperature', '≈ 0 at 5.1 V, positive above, negative below'], ['Power', 'Pz = Vz × Iz'], ['Always', 'Needs a series resistor']],
        facts: ['Placed in forward bias, a Zener acts like any other diode.', 'A TL431 is an adjustable "active" Zener with a much sharper knee.'],
        chart: ch({ title: 'Current against voltage', x: [-1, 1], y: [-1.05, 1.05], f: function (a) { return a >= 0 ? dFwd(a) : (a < -.5 ? -Math.min(1, (-a - .5) * 9) : -.01); }, mx: function (v, m) { return m === 'rev' ? -v : v; }, xlab: 'reverse  ◀  voltage  ▶  forward', ylab: 'current', marks: [[-.5, -.15, '#fbbf24', 'Vz']] }),
        parts: { p: 'Heavily doped P side.', n: 'Heavily doped N side.', dep: 'Very thin depletion region. This is why it breaks down at a low voltage.' } },
      led: { title: 'LED', short: 'LED', std: 'Light-emitting diode · red, 20 mA', modes: PNMODES, linear: true,
        slider: { title: 'Drag to turn it on', label: 'Voltage across the LED', fmt: function (v) { return mode() === 'rev' ? Math.round(v * 5) + ' V reverse' : (v * 3).toFixed(2) + ' V forward'; } },
        statusFn: function (v) { return mode() === 'rev' ? 'Blocking · no light' : v < .6 ? 'Off' : 'Lit · brighter with more current'; },
        desc: 'An LED is a diode in which electrons and holes give off light when they meet. The colour depends on the semiconductor material.',
        rating: [['Red', '1.8 to 2.2 V'], ['Blue or white', '2.8 to 3.4 V'], ['Current', '5 to 20 mA']],
        principle: 'When current flows forward, electrons and holes meet in the junction and recombine. In silicon the energy turns into heat. In LED materials such as GaAsP, GaN and InGaN, it comes out as a photon. A wider band gap gives a higher-energy photon and a bluer light, and it also needs a higher forward voltage. The epoxy dome shapes the beam. An LED has almost no resistance once it is on, so a series resistor is a must: R = (Vsupply − Vf) / I.',
        pros: ['Indicators on every device', 'Lighting, displays and TV backlights', 'Optocouplers and remote controls (infrared)'],
        rows: [['Series resistor', 'R = (Vs − Vf) / I, e.g. (5 − 2) / 0.02 = 150 Ω'], ['Long leg', 'Anode (+)'], ['Flat side of the rim', 'Cathode (−)'], ['Reverse rating', 'About 5 V only'], ['Brightness', 'Roughly proportional to current']],
        facts: ['Never connect an LED straight to a battery without a resistor. It will burn out in a moment.', 'Colour is set by the material, not by the colour of the plastic.'],
        chart: ch({ title: 'Current against voltage', x: [-1, 1], y: [-.08, 1.05], f: function (a) { return a >= 0 ? E((a - 1) / .06) : -.01; }, mx: function (v, m) { return m === 'rev' ? -v : v; }, xlab: 'reverse  ◀  voltage  ▶  forward', ylab: 'current', marks: [[.66, .06, '#fbbf24', '≈ 2 V']] }),
        parts: { p: 'P-type side.', n: 'N-type side.', dep: 'Junction where electrons and holes recombine and give out light.' } },
      bjt: { title: 'BJT (NPN transistor)', short: 'BJT', std: 'Bipolar junction · e.g. BC547', linear: true,
        slider: { title: 'Drag the base voltage', label: 'Base-emitter voltage', fmt: function (v) { return (v * 1.0).toFixed(2) + ' V'; } },
        statusFn: function (v) { return v < .4 ? 'Cutoff · switch OFF' : v < .8 ? 'Active · amplifying' : 'Saturation · switch ON'; },
        desc: 'A small current into the base controls a much larger current from collector to emitter. It can be used as a switch or as an amplifier.',
        rating: [['Gain hFE', '100 to 500'], ['BC547', '45 V, 100 mA'], ['Vbe on', '≈ 0.7 V']],
        principle: 'An NPN transistor is an N-P-N sandwich. The emitter is heavily doped and the base is very thin. With about 0.7 V between base and emitter, the base-emitter junction is forward biased, and electrons flow from the emitter into the base. The base is so thin that most of them cross it and are swept to the collector by the field of the reverse-biased collector junction. Only about 1 % leave through the base. The collector current is therefore Ic = β × Ib. Below about 0.5 V the transistor is off (cutoff), and with a large base current it is fully on (saturation).',
        pros: ['Switching relays, LEDs and small motors', 'Audio and signal amplifiers', 'Current mirrors and oscillators'],
        rows: [['Regions', 'Cutoff, active, saturation'], ['Ic', 'β × Ib in the active region'], ['Vce(sat)', 'Typically 0.1 to 0.3 V'], ['Base resistor', 'R = (Vin − 0.7) / Ib'], ['PNP', 'Same idea, with all polarities reversed'], ['Pin order BC547', 'C-B-E, flat side to you, left to right']],
        facts: ['Switching a load with a BJT needs a base resistor. Without it the base can pull a large current and burn.', 'Always use enough base current to saturate the transistor when it is used as a switch (Ib ≈ Ic / 10).'],
        chart: ch({ title: 'Collector current against base voltage', x: [0, 1], y: [0, 1.05], f: function (a) { return a < .4 ? .003 : Math.min(1, Math.pow((a - .4) / .4, 1.6)); }, mx: function (v) { return v; }, xlab: 'base-emitter voltage', ylab: 'collector current', bands: [[0, .4, 'rgba(100,116,139,.12)', 'cutoff'], [.4, .8, 'rgba(34,211,238,.1)', 'active'], [.8, 1, 'rgba(34,197,94,.12)', 'saturation']] }),
        parts: { e: 'Emitter: very heavily doped, it sends in electrons.', b: 'Base: very thin and lightly doped.', c: 'Collector: it collects the electrons.', dep: 'Depletion region of the collector-base junction.' } },
      mosfet: { title: 'MOSFET (N-channel)', short: 'MOSFET', std: 'Enhancement type · e.g. IRLZ44N', linear: true,
        slider: { title: 'Drag the gate voltage', label: 'Gate-source voltage', fmt: function (v) { return (v * 10).toFixed(1) + ' V'; } },
        statusFn: function (v) { return v < .4 ? 'Off · no channel' : v < .6 ? 'Channel forming' : 'On · channel open'; },
        desc: 'A voltage on the insulated gate makes a conducting channel between source and drain. The gate takes almost no current, so it is easy to drive.',
        rating: [['Vgs(th)', '1 to 4 V'], ['Rds(on)', '1 mΩ to 1 Ω'], ['Gate current', 'Almost zero (DC)']],
        principle: 'The gate is a metal plate separated from the silicon by a very thin layer of silicon dioxide, so no DC current can flow into it. When the gate voltage rises, its electric field pushes holes away from the surface of the p-substrate and pulls electrons toward it. Above the threshold voltage, a thin layer of electrons, called the channel, connects the n+ source and the n+ drain. Current then flows from drain to source. A higher gate voltage makes the channel richer and its resistance (Rds(on)) smaller. The gate acts like a small capacitor, so the driver needs to charge it quickly for fast switching.',
        pros: ['Switching power supplies and motor drives', 'Battery-protection and load switches', 'Logic chips (CMOS) are made of MOSFETs'],
        rows: [['Logic-level', 'Fully on at 4.5 to 5 V (e.g. IRLZ44N)'], ['Standard', 'Needs about 10 V for full on (e.g. IRF540)'], ['Gate resistor', '10 to 100 Ω to limit ringing'], ['Pull-down', '10 kΩ from gate to source, so it is off if the gate floats'], ['Body diode', 'Built in, from source to drain'], ['Static risk', 'The thin oxide is easily damaged by static']],
        facts: ['A floating gate can turn on by itself. Always add a pull-down resistor.', 'The pin order for most TO-220 MOSFETs is gate, drain, source.'],
        chart: ch({ title: 'Drain current against gate voltage', x: [0, 1], y: [0, 1.05], f: function (a) { return a < .4 ? 0 : Math.pow((a - .4) / .6, 2); }, mx: function (v) { return v; }, xlab: 'gate-source voltage', ylab: 'drain current', marks: [[.4, .1, '#fbbf24', 'Vth']] }),
        parts: { s: 'Source terminal and n+ region.', d: 'Drain terminal and n+ region.', gate: 'Gate: metal on top of the oxide.', ch: 'The channel of electrons that forms near the surface.', sub: 'The p-type substrate (the body).' } },
      igbt: { title: 'IGBT', short: 'IGBT', std: 'Insulated-gate bipolar transistor · e.g. 600 V, 40 A', linear: true,
        slider: { title: 'Drag the gate voltage', label: 'Gate-emitter voltage', fmt: function (v) { return (v * 15).toFixed(1) + ' V'; } },
        statusFn: function (v) { return v < .4 ? 'Off · blocking' : v < .65 ? 'Turning on' : 'On · conductivity modulated'; },
        desc: 'An IGBT has the easy gate of a MOSFET and the high-current handling of a bipolar transistor. It is the standard switch in motor drives, inverters and welders.',
        rating: [['Voltage', '600 V to 6.5 kV'], ['Current', '10 A to 3600 A'], ['Switching', 'Up to about 50 kHz']],
        principle: 'The top of an IGBT is a MOSFET: the gate voltage forms a channel and sends electrons into the lightly doped drift region. The bottom is a p+ collector, which makes the structure a PNP transistor. When the electrons arrive, the collector injects holes into the drift region. The drift region fills with both carriers, so its resistance drops. This is conductivity modulation. It gives a low on-state voltage even at 1000 V ratings, which a power MOSFET cannot do. The cost is a slower turn-off, because the stored carriers have to disappear first.',
        pros: ['VFD (variable frequency drive) inverters', 'Electric vehicle traction inverters', 'Welding machines, UPS and induction heating'],
        rows: [['Vce(sat)', '1.5 to 2.5 V'], ['Gate drive', '+15 V on, −5 to 0 V off'], ['Tail current', 'Slow turn-off, because of stored charge'], ['Module', 'Several IGBTs and diodes in one package'], ['Best range', 'Above about 300 V and 20 A'], ['Protection', 'Needs short-circuit and over-temperature protection']],
        facts: ['An IGBT has a fixed voltage drop of about 2 V, but a MOSFET behaves as a resistor. At low voltages and currents the MOSFET wins.', 'The anti-parallel diode in a module carries the current when the load pushes it back.'],
        chart: ch({ title: 'Collector current against gate voltage', x: [0, 1], y: [0, 1.05], f: function (a) { return a < .4 ? 0 : Math.pow((a - .4) / .6, 1.3); }, mx: function (v) { return v; }, xlab: 'gate-emitter voltage', ylab: 'collector current', marks: [[.4, .1, '#fbbf24', 'Vge(th)']] }),
        parts: { col: 'P+ collector. It injects holes when the IGBT is on.', drift: 'Wide N− drift region. It blocks the high voltage when off.', body: 'P body with the N+ emitter.', gate: 'Insulated gate, like a MOSFET.' } }
    }
  };
})();
