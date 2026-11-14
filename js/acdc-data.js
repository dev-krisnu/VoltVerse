/* AC to DC converters. Waveforms are idealised and drawn from simple models. Stage = the active "mode". */
(function () {
  var PI2 = Math.PI * 2, abs = Math.abs, sin = Math.sin;
  /* sampled capacitor-smoothed rectifier: period of one mains cycle, returns function of cycle phase (0..2) */
  function smoothed(peak, drop) { var N = 800, v = [], tau, i, cur = 0, s; tau = 1 / (2 * (drop / peak)); /* decay so that the droop over half a cycle is ~drop */ for (i = 0; i < N * 3; i++) { var f = (i / N) % 1, r = peak * abs(sin(Math.PI * f)); cur = Math.max(r, cur * Math.exp(-(.5 / N) * tau * 2.0)); if (i >= N) v.push(cur); } return function (f) { return v[Math.floor(((f % 2) / 2) * (2 * N)) % (2 * N)]; }; }
  var sm_small = smoothed(15.6, 1.8), sm_bulk = smoothed(325, 38), sm_phone = smoothed(325, 85);
  function pulses(f, hi, lo, duty, per) { var q = (f * 2) % per / per; return q < duty ? hi : lo; }
  var ST = {
    adaptor: [
      { id: 'mains', name: 'Mains', y: [-340, 340], fn: function (f) { return 325 * sin(PI2 * f); }, u: 'V', len: '40 ms', txt: '230 V AC from the socket. The peak is 325 V.' },
      { id: 'xfmr', name: 'Transformer', y: [-20, 20], fn: function (f) { return 17 * sin(PI2 * f); }, u: 'V', len: '40 ms', txt: 'A step-down transformer gives 12 V rms (17 V peak). It is still AC, and it is isolated from the mains.' },
      { id: 'bridge', name: 'Bridge', y: [0, 20], fn: function (f) { return 15.6 * abs(sin(Math.PI * f * 2)); }, u: 'V', len: '40 ms', txt: 'Four diodes flip the negative half. The output is pulsating DC at 100 Hz. The peak is 17 V minus two diode drops, about 15.6 V.' },
      { id: 'filter', name: 'Filter', y: [0, 20], fn: function (f) { return sm_small(f); }, u: 'V', len: '40 ms', txt: 'The capacitor charges at the peaks and feeds the load between them. The ripple is ΔV ≈ I / (2 f C).' },
      { id: 'reg', name: 'Regulator', y: [0, 20], fn: function (f) { return 12 + .03 * sin(PI2 * f * 2); }, u: 'V', len: '40 ms', txt: 'A 7812 regulator removes the ripple and gives a steady 12 V. It needs at least about 14 V in.' }
    ],
    smps: [
      { id: 'ac', name: 'Mains', y: [-340, 340], fn: function (f) { return 325 * sin(PI2 * f); }, u: 'V', len: '40 ms', txt: 'Mains goes straight to the rectifier. There is no 50 Hz transformer.' },
      { id: 'rect', name: 'Rectifier', y: [0, 340], fn: function (f) { return 325 * abs(sin(Math.PI * f * 2)); }, u: 'V', len: '40 ms', txt: 'The bridge makes pulsating DC with a 325 V peak.' },
      { id: 'bulk', name: 'Bulk capacitor', y: [0, 340], fn: function (f) { return sm_bulk(f); }, u: 'V', len: '40 ms', txt: 'The bulk capacitor holds about 300 V DC with some ripple.' },
      { id: 'switch', name: 'Chopper', y: [-200, 340], fn: function (f) { var q = (f * 4 / 1) % 1; return q < .38 ? 310 : q < .62 ? -150 : 0; }, u: 'V', len: '40 µs', txt: 'The MOSFET switches the DC on and off about 100 000 times a second. The transformer primary sees these pulses.' },
      { id: 'sec', name: 'Secondary', y: [-10, 40], fn: function (f) { var q = (f * 2) % 1; return q < .38 ? 28 : -3 * (q > .38 && q < .6 ? 1 : 0); }, u: 'V', len: '40 µs', txt: 'The small ferrite transformer steps the pulses down. A fast diode rectifies them.' },
      { id: 'out', name: 'Output', y: [0, 16], fn: function (f) { return 12 + .12 * sin(PI2 * f * 2); }, u: 'V', len: '40 µs', txt: 'An LC filter smooths the pulses into 12 V DC with very small high-frequency ripple.' }
    ],
    charger: [
      { id: 'ac', name: 'Mains', y: [-340, 340], fn: function (f) { return 325 * sin(PI2 * f); }, u: 'V', len: '40 ms', txt: 'Plug in: 230 V AC.' },
      { id: 'dc', name: 'Bulk DC', y: [0, 340], fn: function (f) { return sm_phone(f); }, u: 'V', len: '40 ms', txt: 'A small bridge and capacitor make about 300 V DC. The small capacitor leaves a lot of ripple.' },
      { id: 'sw', name: 'MOSFET drain', y: [0, 500], fn: function (f) { var q = (f * 2) % 1; return q < .4 ? 3 : q < .55 ? 410 + 80 * Math.exp(-(q - .4) * 60) * sin(PI2 * (q - .4) * 14) : 310 + 25 * sin(PI2 * (q - .55) * 12) * Math.exp(-(q - .55) * 8); }, u: 'V', len: '40 µs', txt: 'In a flyback charger the MOSFET stores energy in the transformer when on, and releases it when off. The spike is leakage inductance, which the snubber clamps.' },
      { id: 'sec', name: 'Secondary', y: [-5, 30], fn: function (f) { var q = (f * 2) % 1; return q > .4 && q < .95 ? 20 * (1 - (q - .4) / .6 * .35) : -3; }, u: 'V', len: '40 µs', txt: 'While the MOSFET is off, the energy flows into the secondary through the output diode.' },
      { id: 'out', name: 'USB output', y: [0, 8], fn: function (f) { return 5 + .05 * sin(PI2 * f * 2); }, u: 'V', len: '40 µs', txt: 'The output capacitor smooths the pulses into 5 V. An opto-coupler tells the controller how much to deliver.' }
    ]
  };
  function chart(key) {
    return { title: 'Waveform at this stage', h: 220, live: true, note: '', draw: function (x, w, h, t, tT, mode) {
      var CH = window.CATCHART, list = ST[key], s = list.filter(function (q) { return q.id === mode; })[0] || list[0], on = Math.min(1, t / .3), y0 = s.y[0], y1 = s.y[1];
      var g = CH.grid(x, w, h - 30, { l: 46, nx: 4, ny: 4, yl: function (f) { var v = y0 + f * (y1 - y0); return Math.round(v) + ' V'; }, xl: function (f) { return (f * parseFloat(s.len)).toFixed(0) + (s.len.indexOf('µ') > 0 ? ' µs' : ' ms'); }, xt: 'time' });
      var ph = (performance.now() / 4000) % 1, pts = [], i, N = 240; for (i = 0; i <= N; i++) { var f = (i / N * 2 + ph * 2) % 2, v = s.fn(f) * on + (1 - on) * (y0 < 0 ? 0 : 0); pts.push([g.l + g.w * i / N, g.b - g.h * (v - y0) / (y1 - y0)]); }
      if (y0 < 0) { x.strokeStyle = 'rgba(255,255,255,.25)'; x.setLineDash([3, 4]); x.beginPath(); var zy = g.b - g.h * (0 - y0) / (y1 - y0); x.moveTo(g.l, zy); x.lineTo(g.r, zy); x.stroke(); x.setLineDash([]); }
      CH.line(x, pts, '#22d3ee', 2.2); x.fillStyle = '#e2e8f0'; x.font = '600 12px Inter,Arial'; x.textAlign = 'left'; x.fillText(s.name, 10, h - 14); x.fillStyle = '#93a4b8'; x.font = '11px Inter,Arial'; var words = s.txt.split(' '), line = '', xx = 10 + x.measureText(s.name).width + 14; x.fillText(on < .05 ? 'Switch on to see the waveform.' : '', xx, h - 14); } };
  }
  var ACT = { on: 'Power on', off: 'Power off', idleText: 'Unplugged', onText: 'Powering up…', offText: 'Powering down…', doneText: 'Powered' };
  window.ACDC = ST;
  window.CAT = {
    kind: 'x', fit: 1.1, order: ['adaptor', 'smps', 'charger'], prosTitle: 'Where it is used', rowsTitle: 'Specifications', dir: [.5, .5, 1], viewer: { pos: [6, 9, 12], target: [0, 1, 0], size: 40 }, modesTitle: 'Pick a stage to see its waveform', speed: .6,
    models: {
      adaptor: { title: 'Full-bridge AC adaptor', short: 'Bridge adaptor', std: 'Linear supply · 230 V to 12 V DC', modes: ST.adaptor.map(function (s) { return [s.id, s.name]; }), act: ACT, linear: true,
        desc: 'The classic linear power supply. A transformer lowers the voltage, a bridge of four diodes makes it DC, a capacitor smooths it, and a regulator holds it steady.',
        rating: [['Input', '230 V AC, 50 Hz'], ['Output', '12 V DC, 1 A'], ['Efficiency', '40 to 60 %']],
        principle: 'The transformer steps 230 V down to about 12 V rms and isolates the output from the mains. In the bridge, two diodes conduct on each half cycle (D1 and D3 on positive, D2 and D4 on negative), so the current always flows the same way through the load. The result is pulsating DC at twice the mains frequency. A big electrolytic capacitor charges at each peak and supplies the load in between, which leaves a small ripple. A linear regulator such as the 7812 burns off the extra voltage as heat, and gives a steady output.',
        pros: ['Audio amplifiers, where switching noise is a problem', 'Lab bench supplies and small battery chargers', 'Teaching: it shows every stage of rectification clearly'],
        rows: [['Bridge output peak', 'Vp − 2 × 0.7 V'], ['Ripple frequency', '2 × mains = 100 Hz'], ['Ripple', 'ΔV ≈ I / (2 f C)'], ['Diode rating', 'PIV above Vp, current above load'], ['Regulator', '7812: 12 V, needs ≥ 14 V in, heat sink above 0.5 A'], ['Weakness', 'Big, heavy and wasteful']],
        facts: ['A larger capacitor gives less ripple. Doubling C halves the ripple.', 'Each diode in a bridge carries current for only part of the cycle, but the peak current is high because the capacitor charges in short bursts.'],
        chart: chart('adaptor'),
        parts: { plug: 'Mains plug pins.', tr: 'Step-down transformer: laminated iron core with primary and secondary windings.', bridge: 'Bridge rectifier: four diodes in a diamond.', cap: 'Electrolytic smoothing capacitor. Mind the polarity.', reg: 'Linear regulator on a small heat sink.', out: 'DC output jack.', pcb: 'Circuit board.' } },
      smps: { title: 'SMPS cutaway', short: 'SMPS', std: 'Switch-mode supply · 230 V to 12 V, 5 A', modes: ST.smps.map(function (s) { return [s.id, s.name]; }), act: ACT, linear: true,
        desc: 'A switch-mode power supply rectifies the mains first, chops it at a very high frequency, and then steps it down with a tiny ferrite transformer. It is light, small and efficient.',
        rating: [['Input', '90 to 264 V AC'], ['Output', '12 V DC, 60 W'], ['Efficiency', '85 to 95 %']],
        principle: 'The mains goes through a filter and a bridge rectifier into a bulk capacitor, which holds about 300 V DC. A PWM controller turns a MOSFET on and off about 100 000 times a second. The pulses drive the primary of a small ferrite transformer, which is much smaller than a 50 Hz one, because transformer size shrinks as frequency rises. The secondary pulses are rectified by a fast diode and smoothed by an LC filter. An opto-coupler and a TL431 reference tell the controller how the output voltage is doing, and the controller changes the pulse width to keep it at 12 V. The opto-coupler keeps the output isolated from the mains.',
        pros: ['Computers, TVs, routers and LED drivers', 'Laptop and phone chargers', 'Industrial 24 V DIN-rail supplies'],
        rows: [['Switching frequency', '50 to 200 kHz'], ['Control', 'PWM: duty cycle is varied to hold the output'], ['Isolation', 'Transformer and opto-coupler, typically 3 to 4 kV'], ['Power factor', 'PFC stage needed above about 75 W'], ['Noise', 'EMI filter at the input'], ['Safety', 'The primary side is at mains potential']],
        facts: ['Never touch the primary side of an SMPS. The bulk capacitor can hold a dangerous charge after unplugging.', 'A "dead" SMPS often has a swollen electrolytic capacitor or a failed start-up resistor.'],
        chart: chart('smps'),
        parts: { filter: 'EMI filter: X capacitor and a common-mode choke.', bridge: 'Bridge rectifier.', bulk: 'Bulk capacitor: about 300 V DC.', ctrl: 'PWM controller IC.', fet: 'Power MOSFET on a heat sink.', tr: 'High-frequency ferrite transformer.', diode: 'Fast output rectifier on a heat sink.', ocap: 'Output filter capacitors.', opto: 'Opto-coupler and TL431: isolated feedback.', case: 'Cover, shown see-through.' } },
      charger: { title: 'Phone charger', short: 'Phone charger', std: 'Flyback · 230 V to 5 V, 2 A (10 W)', modes: ST.charger.map(function (s) { return [s.id, s.name]; }), act: ACT, linear: true,
        desc: 'A phone charger is a tiny flyback SMPS in a plug-top case. It turns 230 V AC into 5 V DC, and it is isolated, so a fault inside cannot send mains to your phone.',
        rating: [['Input', '100 to 240 V AC'], ['Output', '5 V DC, 2 A'], ['Efficiency', '80 to 85 %']],
        principle: 'A flyback converter uses one transformer that stores energy, as well as passing it. When the MOSFET is on, current rises in the primary and the core stores energy, while the output diode is off. When the MOSFET turns off, the field collapses and the energy is pushed into the secondary through the diode, then into the output capacitor and the phone. A controller IC sets the on-time. Feedback comes from an opto-coupler, or from a sense winding. USB Power Delivery chargers also have a chip that talks to the phone and raises the output to 9, 12 or 20 V.',
        pros: ['Phones, tablets and earbuds', 'Small appliances and LED lighting', 'USB Power Delivery and fast chargers'],
        rows: [['Switching frequency', '50 to 130 kHz (GaN chargers are higher)'], ['Isolation', '3 to 4 kV between the mains and the USB port'], ['Class', 'Class II, double insulated, with no earth pin'], ['Output', 'USB-A 5 V, or USB-C with PD up to 20 V'], ['Protection', 'Over-current, over-voltage and short-circuit']],
        facts: ['Use a certified charger. A cheap one may have a weak isolation gap that can be fatal.', 'Gallium nitride (GaN) switches can run much faster than silicon, so GaN chargers are smaller.'],
        chart: chart('charger'),
        parts: { pins: 'Plug pins.', bridge: 'Small bridge rectifier.', cap: 'Bulk capacitor: high voltage, small value.', ctrl: 'Flyback controller IC with the MOSFET inside.', tr: 'Flyback transformer on a ferrite core.', diode: 'Output diode.', ocap: 'Output capacitor.', opto: 'Opto-coupler for feedback.', usb: 'USB port.', case: 'Plastic case, shown see-through.' } }
    }
  };
})();
