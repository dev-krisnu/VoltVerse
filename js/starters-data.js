/* Motor starters. Curves are typical and illustrative: a 7 x FLC direct-on-line start is the reference. Time axis: 12 s. */
(function () {
  var TT = 12, E = Math.exp, S = function (t, a, b) { return Math.max(0, Math.min(1, (t - a) / (b - a))); };
  var N = {
    dol: function (t) { return 1 - E(-t / 1.2); },
    sd: function (t) { var ts = 6; return t < ts ? .82 * (1 - E(-t / 2.6)) : 1 - (1 - .82 * (1 - E(-ts / 2.6))) * E(-(t - ts) / 1.0); },
    at: function (t) { var ts = 5; return t < ts ? .8 * (1 - E(-t / 2.0)) : 1 - (1 - .8 * (1 - E(-ts / 2.0))) * E(-(t - ts) / .9); },
    rr: function (t) { return (1 - E(-t / 3.2)) * .995; },
    ss: function (t) { return t < 7 ? 1 - E(-t / 2.6) : 1 - (1 - (1 - E(-7 / 2.6))) * E(-(t - 7) / .6); }
  };
  var I = {
    dol: function (t) { return 1 + 5.8 * (1 - N.dol(t)); },
    sd: function (t) { var ts = 6; if (t < ts) return .33 * (1 + 5.8 * (1 - N.sd(t) / .97)); return 1 + 5.8 * (1 - N.sd(t)) * .6 + 1.3 * E(-(t - ts) / .12); },
    at: function (t) { var ts = 5; if (t < ts) return .4225 * (1 + 5.8 * (1 - N.at(t) / .97)); return 1 + 5.8 * (1 - N.at(t)) * .35 + .9 * E(-(t - ts) / .15); },
    rr: function (t) { var st = [0, 2.5, 5, 7.5], k = 0; for (var i = 0; i < 4; i++) if (t >= st[i]) k = i; var lt = t - st[k]; return k === 3 ? 1 + .55 * E(-lt / 1.2) : (1.65 - .06 * k) - .45 * (lt / 2.5); },
    ss: function (t) { if (t < .8) return 1 + 2 * (t / .8); if (t < 7) return 3.0 - .35 * (t - .8) / 6.2 - .0 * N.ss(t); return 1 + 1.7 * E(-(t - 7) / .3) * 0; }
  };
  window.SCURVE = { TT: TT, N: N, I: I, S: S };
  var ACT = function (on, off) { return { on: on, off: off, idleText: 'Motor stopped', onText: 'Starting…', offText: 'Stopping…', doneText: 'Running at full speed' }; };
  function chart(key, label, note) {
    return { title: 'Starting current against time', h: 230, note: note, draw: function (x, w, h, t) {
      var CH = window.CATCHART, g = CH.grid(x, w, h, { l: 40, nx: 6, ny: 4, yl: function (f) { return (f * 8).toFixed(0) + '×'; }, xl: function (f) { return Math.round(f * TT) + ' s'; }, xt: 'time · current as × full-load current' }), i, a = [], b = [];
      for (i = 0; i <= 160; i++) { var tt = i / 160 * TT; a.push([g.l + g.w * i / 160, g.b - g.h * I.dol(tt) / 8]); b.push([g.l + g.w * i / 160, g.b - g.h * Math.min(8, I[key](tt)) / 8]); }
      CH.line(x, a, 'rgba(248,113,113,.75)', 1.6, [5, 4]); CH.line(x, b.slice(0, Math.max(2, Math.round(t * 160))), '#67e8f9', 2.4);
      x.font = '600 10.5px Inter,Arial'; x.textAlign = 'left'; x.fillStyle = '#f87171'; x.fillText('Direct on line', g.l + g.w * .22, g.b - g.h * .87); x.fillStyle = '#67e8f9'; x.fillText(label, g.l + g.w * .5, g.t + 12);
      var tc = t * TT, v = Math.min(8, I[key](tc)); CH.dot(x, g.l + g.w * t, g.b - g.h * v / 8, '#facc15'); x.fillStyle = '#e2e8f0'; x.textAlign = g.l + g.w * t > w * .7 ? 'right' : 'left'; x.fillText(v.toFixed(1) + '× FLC · ' + Math.round(N[key](tc) * 100) + '% speed', g.l + g.w * t + (g.l + g.w * t > w * .7 ? -9 : 9), g.b - g.h * v / 8 - 10); } };
  }
  window.CAT = {
    kind: 'x', fit: 1.05, order: ['sd', 'at', 'rr', 'ss'], prosTitle: 'Where it is used', rowsTitle: 'Specifications', dir: [.45, .45, 1], viewer: { pos: [4, 6, 12], target: [0, 3, 0], size: 40 },
    models: {
      sd: { title: 'Star-delta starter', short: 'Star-delta', std: 'IEC 60947-4-1 · 3 contactors', linear: true, speed: function () { return .075; }, act: ACT('Press START', 'Press STOP'),
        desc: 'The motor starts with its windings in star, so each winding sees only 58 % of line voltage. After a few seconds a timer changes the connection to delta, and the motor runs at full voltage.',
        rating: [['Start current', '≈ 1/3 of DOL'], ['Start torque', '≈ 1/3 of DOL'], ['Needs', '6-terminal motor']],
        principle: 'In star, each winding gets line voltage divided by √3, so the current is 1/√3 of the normal and the line current is one third of the DOL value. The torque falls to one third too. Three contactors do the switching: main K1 joins the supply, star K2 shorts the three winding ends together, and delta K3 connects each winding end to the start of the next one. K2 and K3 are interlocked so that they can never close together, which would short the supply. A timer drops K2 and then pulls in K3 after a short gap.',
        pros: ['Pumps, fans and compressors that start with a light load', 'Machine tools and conveyors', 'Motors above about 5 kW on a 400 V supply'],
        rows: [['Motor connection', 'Delta when running (400 V winding rating)'], ['Contactors', 'K1 main, K2 star, K3 delta, with an interlock'], ['Changeover', 'At about 80 to 90 % of full speed'], ['Starting current', '2 to 2.5 × FLC'], ['Drawback', 'Current and torque spike at changeover']],
        facts: ['The motor must be wound for delta at the supply voltage, or it will burn out when it changes to delta.', 'Do not start with a heavy load. A third of the torque may not turn it.'],
        chart: chart('sd', 'Star-delta', 'Line current, with a short spike when the starter changes from star to delta.'),
        parts: { k1: 'K1: main contactor.', k2: 'K2: star contactor. It joins the three winding ends together.', k3: 'K3: delta contactor. It connects the windings in a triangle.', tb: 'The motor terminal box with six terminals. Links show star or delta.', volt: 'Voltage across each winding: 58 % in star, 100 % in delta.', timer: 'The timer that decides when to change.', motor: 'Three-phase induction motor.' } },
      at: { title: 'Auto-transformer starter', short: 'Auto-transformer', std: 'Korndörfer · 50 / 65 / 80 % taps', linear: true, speed: function () { return .085; }, act: ACT('Press START', 'Press STOP'),
        desc: 'A three-phase autotransformer steps the supply down to 50, 65 or 80 % while the motor speeds up. Then it is bypassed, and the motor runs on full voltage.',
        rating: [['Taps', '50 / 65 / 80 %'], ['Line current', '≈ k² × DOL'], ['Torque', '≈ k² × DOL']],
        principle: 'With a tap at fraction k of the line voltage, the motor current falls to k times its DOL value. Because the transformer also steps the current, the supply current falls again by k, so the line current is k² times DOL. The torque drops by the same factor. On a 65 % tap the line current is 42 % of DOL. Once the motor is near full speed, the run contactor connects the motor directly to the supply and the transformer is removed. In the closed-transition (Korndörfer) circuit the motor is never left without supply during changeover, so there is almost no spike.',
        pros: ['Large cage motors and heavy loads: crushers, compressors', 'Mills and pumps where the supply is weak', 'Places where star-delta does not give enough torque'],
        rows: [['Tap choice', 'Lowest tap that gives enough starting torque'], ['Line current', 'At 65 %: 0.42 × DOL'], ['Contactors', 'Start (and star point), run'], ['Cost', 'High: the transformer is large'], ['Duty', 'Rated for limited starts per hour']],
        facts: ['The transformer is only on for the few seconds of starting, so it is rated for short duty.', 'The motor can be any ordinary three-terminal motor, unlike star-delta.'],
        chart: chart('at', 'Auto-transformer, 65 % tap', 'Line current from the supply with a 65 % tap. It is lower than the motor current.'),
        parts: { tr: 'Three-phase autotransformer with taps.', taps: 'Tap leads at 50, 65 and 80 % of the winding.', k1: 'Start contactor: connects the transformer.', k2: 'Run contactor: connects the motor straight to the supply.', motor: 'Three-phase induction motor.' } },
      rr: { title: 'Rotor-resistance starter', short: 'Rotor resistance', std: 'Slip-ring motor · 3 steps', linear: true, speed: function () { return .08; }, act: ACT('Press START', 'Press STOP'),
        desc: 'Used only with slip-ring induction motors. Resistance is added to the rotor circuit through the slip rings to start. It is cut out in steps as the motor speeds up.',
        rating: [['Start current', '1.5 to 2 × FLC'], ['Start torque', 'Up to full pull-out torque'], ['Motor', 'Wound-rotor']],
        principle: 'Extra rotor resistance does two good things. It lowers the rotor current, so the stator current drops. And it moves the peak of the torque-speed curve toward standstill, so the motor can give high torque at start. Three resistor banks are cut out one after another by contactors, so the current dips and rises in a saw-tooth pattern. At full speed all resistance is shorted, and the slip rings are shorted together like a cage rotor. Some starters also lift the brushes and short the rings to reduce wear.',
        pros: ['Cranes, hoists and lifts needing high torque at start', 'Ball mills, crushers and conveyors with heavy loads', 'Weak supply where start current must be low'],
        rows: [['Resistor steps', 'Usually 3 to 5'], ['Short-circuiting', 'Contactors, or a drum controller'], ['Speed control', 'Resistance in the circuit also lowers speed'], ['Losses', 'The resistor wastes heat while it is in circuit'], ['Efficiency', 'Poor if used for long-term speed control']],
        facts: ['The resistors are built for short duty, so they will burn if left in circuit.', 'Modern drives with a VFD have replaced many wound-rotor starters.'],
        chart: chart('rr', 'Rotor resistance', 'Current in the supply lines. Each time a resistor step is cut out, the current jumps up a little.'),
        parts: { motor: 'Slip-ring induction motor.', rings: 'Slip rings that bring the rotor circuit out.', r1: 'Resistor bank 1: cut out first.', r2: 'Resistor bank 2.', r3: 'Resistor bank 3: the last one cut out.', cont: 'Contactors that short the resistor banks.' } },
      ss: { title: 'Soft starter', short: 'Soft starter', std: 'Thyristor soft starter · bypass', linear: true, speed: function () { return .09; }, act: ACT('Press START', 'Press STOP'),
        desc: 'Back-to-back thyristors in each phase slowly raise the voltage on the motor from a low value to full voltage. The current is limited, and the motor starts without jerk.',
        rating: [['Current limit', '2 to 4 × FLC'], ['Ramp time', '1 to 30 s'], ['Starts', 'Smooth, no steps']],
        principle: 'In each phase, two thyristors (SCRs) are wired in anti-parallel. They conduct only after the gate pulse. By delaying the pulse each half cycle (a larger firing angle), the starter cuts a part of every voltage wave, so the motor sees a lower voltage. The firing angle is reduced step by step until the thyristors conduct for the full wave. A bypass contactor then closes across them so there is no heating at full speed. A soft stop can ramp the voltage down, which prevents water hammer in pumps.',
        pros: ['Pumps (soft stop prevents water hammer)', 'Fans, conveyors and compressors', 'Where shock to belts, gears and couplings must be avoided'],
        rows: [['Adjustments', 'Initial voltage, ramp time, current limit'], ['Protection', 'Overload, phase loss, over-temperature'], ['Bypass', 'Contactor that closes when the ramp is done'], ['Harmonics', 'Some during ramp, none when bypassed'], ['Torque', 'Falls with the square of the voltage']],
        facts: ['A soft starter changes voltage only. It cannot control speed, unlike a VFD.', 'Starting torque falls with the square of the voltage, so a loaded motor may not start on a very low setting.'],
        chart: chart('ss', 'Soft starter', 'The current is held near the limit while the motor accelerates, then drops when the bypass contactor closes.'),
        parts: { scr: 'Anti-parallel thyristors in each phase.', sink: 'Heat sink for the thyristors.', byp: 'Bypass contactor.', ctrl: 'Control board and display.', volt: 'Output voltage bar: it rises as the starter ramps up.', motor: 'Three-phase motor.' } }
    }
  };
})();
