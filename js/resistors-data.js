/* Resistor content. Colour code per IEC 60062; E-series per IEC 60063. */
(function () {
  var COL = [['black', 0], ['brown', 1], ['red', 2], ['orange', 3], ['yellow', 4], ['green', 5], ['blue', 6], ['violet', 7], ['grey', 8], ['white', 9]];
  var HEX = { black: '#111', brown: '#6b3a1e', red: '#c62828', orange: '#f57c00', yellow: '#fdd835', green: '#2e9b46', blue: '#1e5fd0', violet: '#7e3ec4', grey: '#8a8f96', white: '#f5f5f5', gold: '#d4a537', silver: '#bfc4ca' };
  var MULT = [['black', 1], ['brown', 10], ['red', 100], ['orange', 1e3], ['yellow', 1e4], ['green', 1e5], ['blue', 1e6], ['violet', 1e7], ['grey', 1e8], ['white', 1e9], ['gold', .1], ['silver', .01]];
  var TOL = [['brown', 1], ['red', 2], ['green', .5], ['blue', .25], ['violet', .1], ['grey', .05], ['gold', 5], ['silver', 10]];
  var P = PX;
  window.CAT = {
    kind: 'resistor', fit: 1.2,
    order: ['carbon', 'metal', 'wire', 'smd', 'pot', 'ntc', 'ldr', 'cement'],
    act: P.act, prosTitle: 'Where it is used', rowsTitle: 'Specifications', dir: [.45, .5, 1], viewer: { pos: [4, 4, 6], target: [0, .6, 0], size: 20 },
    generic: { leads: 'The leads are tinned copper wire. Tinning stops corrosion and makes soldering easy.' },
    models: {
      carbon: { title: 'Carbon film resistor', short: 'Carbon film', std: 'Axial · IEC 60115',
        desc: 'The cheapest and most common resistor. A thin film of carbon is deposited on a ceramic rod. A spiral groove cut along the film sets the resistance. Colour bands give the value.',
        rating: [['Tolerance', '± 5 %'], ['Power', '¼ W typ.'], ['Tempco', '−200 to −500 ppm/°C']],
        principle: 'Resistance R = ρL / A. The spiral groove makes the carbon path very long and narrow, so a thin film can have a high resistance. The more turns, the higher the value. Carbon film has a negative temperature coefficient, so its resistance drops slightly as it warms.',
        pros: ['General-purpose circuits, hobby projects and school labs', 'LED current limiting, pull-up and pull-down resistors', 'Anywhere high precision is not needed'],
        rows: [['Typical values', '1 Ω to 10 MΩ, E12 / E24 series'], ['Power ratings', '⅛, ¼, ½, 1, 2 W'], ['Bands', '4 bands (2 digits, multiplier, tolerance)'], ['Noise', 'Higher than metal film'], ['Max temperature', 'About 155 °C']],
        facts: ['A resistor wastes the power P = I²R as heat. Choose a rating at least twice the calculated power.', 'Read the bands from the end that has the bands closest together.'],
        parts: { body: 'Lacquer coating that insulates and protects the film.', bands: 'Colour bands. Move the sliders below to change them and see the value.', film: 'Carbon film on a ceramic rod, with a spiral groove.' } },
      metal: { title: 'Metal film resistor', short: 'Metal film', std: 'Axial · precision',
        desc: 'The same construction as carbon film, but with a thin film of nickel-chromium alloy. It is more accurate, more stable and quieter. It uses five colour bands.',
        rating: [['Tolerance', '± 1 %'], ['Power', '¼ W typ.'], ['Tempco', '± 50 ppm/°C']],
        principle: 'A metal alloy film changes its resistance far less with temperature than carbon, so the value stays close to the marked one. Laser trimming cuts the spiral to an exact value. The extra band gives a third digit so that 1 % values (E96) can be marked.',
        pros: ['Audio, instrumentation and measuring circuits', 'Op-amp gain and filter networks', 'Reference dividers in power supplies and ADC inputs'],
        rows: [['Bands', '5 bands (3 digits, multiplier, tolerance)'], ['Tolerance', '0.1 %, 0.5 %, 1 %, 2 %'], ['Series', 'E96 (1 %) and E192'], ['Tempco', '10 to 100 ppm/°C'], ['Body colour', 'Often light blue']],
        facts: ['Metal film noise is much lower than carbon film.', 'A 5-band resistor with brown, black, black, red, brown is 100 × 100 = 10 kΩ at 1 %.'],
        parts: { body: 'Epoxy or lacquer coating, often light blue.', bands: 'Five colour bands: three digits, multiplier, tolerance.', film: 'Nickel-chromium film with a laser-cut spiral.' } },
      wire: { title: 'Wire-wound resistor', short: 'Wire-wound', std: 'Power · IEC 60115-4',
        desc: 'Resistance wire (nichrome, constantan or manganin) is wound on a ceramic former. It handles heavy power and stays stable. The value is printed on the body.',
        rating: [['Power', '1 to 100+ W'], ['Tolerance', '± 1 to 5 %'], ['Tempco', '< 50 ppm/°C']],
        principle: 'Alloy wire has a high resistivity and almost zero change with temperature. A long wire wound into a coil gives the resistance. The ceramic former takes the heat, and end caps carry the current in. Because it is a coil, it also has some inductance, so it is a poor choice at high frequency.',
        pros: ['Power supplies, motor starters and braking resistors', 'Dummy loads and current-sense shunts', 'Test benches and amplifiers'],
        rows: [['Wire', 'Nichrome, constantan, manganin'], ['Former', 'Ceramic (alumina)'], ['Coating', 'Vitreous enamel or silicone'], ['Running temperature', 'Up to 250 °C or more'], ['Weak point', 'Inductive at high frequency']],
        facts: ['These get very hot. Mount them clear of the board and heat-sensitive parts.', 'A non-inductive winding (Ayrton-Perry) cancels the magnetic field.'],
        parts: { coat: 'Ceramic or vitreous coating protects the winding.', wind: 'Resistance wire wound on the former.', core: 'Ceramic former takes the heat.', caps: 'Metal end caps carry current to the winding.' } },
      smd: { title: 'SMD chip resistor', short: 'SMD chip', std: 'Surface mount · 0805 shown',
        desc: 'A tiny flat block soldered straight on the board. Most modern electronics use chip resistors. The 0805 size is 2.0 × 1.25 mm. The value is printed as a number code.',
        rating: [['Size', '0805'], ['Power', '⅛ W'], ['Tolerance', '± 1 %']],
        principle: 'A thick film of ruthenium oxide is printed on an alumina substrate and trimmed by laser. Tin terminations at the two ends are soldered to the pads. The three digits "103" mean 10 followed by 3 zeros: 10 000 Ω = 10 kΩ.',
        pros: ['Every phone, laptop, controller and Arduino board', 'High-density, machine-assembled boards', 'Small signal and power-conditioning circuits'],
        rows: [['Common sizes', '0402, 0603, 0805, 1206'], ['0603 power', '⅒ W'], ['0805 power', '⅛ W'], ['1206 power', '¼ W'], ['Code', '3 or 4 digits: 103 = 10 kΩ, 1002 = 10 kΩ, 4R7 = 4.7 Ω']],
        facts: ['"R" stands for the decimal point: 4R7 is 4.7 Ω.', 'Chip resistors have no polarity; either end works.'],
        parts: { body: 'Protective overglaze.', film: 'Thick-film resistive layer, trimmed by laser.', sub: 'Alumina ceramic substrate.', ends: 'Tin-plated terminations soldered to the pads.', lbl: 'The marking is a 3-digit code.', base: 'The PCB with copper pads.' } },
      pot: { title: 'Potentiometer', short: 'Potentiometer', std: 'Variable · rotary',
        desc: 'A resistor with a sliding contact. Turning the shaft moves the wiper along a carbon track. With three terminals it acts as an adjustable voltage divider.',
        rating: [['Terminals', '3'], ['Tolerance', '± 20 %'], ['Power', '0.1 to 0.5 W']],
        principle: 'The two outer terminals are connected across the full track. The middle terminal is the wiper. If you apply a voltage across the outer terminals, the wiper gives a fraction of it, set by the shaft angle. With just the wiper and one end it acts as a variable resistor (rheostat).',
        pros: ['Volume, tone and brightness controls', 'Adjusting set-points on sensors and circuits', 'Analogue joysticks and position sensors'],
        act: { on: 'Turn the shaft', off: 'Turn back', idleText: 'Minimum', onText: 'Turning…', offText: 'Turning back…', doneText: 'Maximum' },
        rows: [['Taper', 'Linear (B) or logarithmic (A, audio)'], ['Values', '1 kΩ to 1 MΩ'], ['Rotation', 'About 270°'], ['Life', 'About 10 000 to 100 000 turns']],
        facts: ['Audio pots are logarithmic because the ear hears loudness on a log scale.', 'Wire the wiper to the input of the next stage, and never to the supply.'],
        parts: { hous: 'Metal or plastic case.', shaft: 'Knurled shaft with a bushing for a panel.', track: 'Carbon resistive track in an arc.', wiper: 'A spring metal contact that slides on the track.', pins: 'Three terminals: end, wiper, end.' } },
      ntc: { title: 'NTC thermistor', short: 'NTC thermistor', std: 'Temperature sensor',
        desc: 'A resistor whose value drops sharply as it gets warmer. "NTC" means negative temperature coefficient. The typical 10 kΩ NTC reads 10 kΩ at 25 °C.',
        rating: [['R at 25 °C', '10 kΩ'], ['Beta', '≈ 3950 K'], ['Range', '−40 to 125 °C']],
        principle: 'The bead is a sintered mix of metal oxides. Heating frees more charge carriers, so the resistance falls. R = R₀ · exp[B (1/T − 1/T₀)] with T in kelvin. A voltage divider with a fixed resistor turns this into a voltage that a microcontroller can read.',
        pros: ['Digital thermometers, 3D-printer hot ends, battery packs', 'Inrush current limiters in power supplies', 'Fans, air conditioners and ovens'],
        rows: [['Material', 'Metal oxide ceramic'], ['Equation', 'R = R₀ exp[B(1/T − 1/T₀)]'], ['Opposite type', 'PTC: resistance rises with temperature'], ['Self-heating', 'Keep the current small']],
        facts: ['Use the Steinhart-Hart equation for better accuracy than the B formula.', 'PTC thermistors are used as resettable fuses.'],
        parts: { coat: 'Epoxy coating.', bead: 'Ceramic bead made of metal oxides.', leads: 'Fine wires to the bead.' } },
      ldr: { title: 'LDR (photoresistor)', short: 'LDR', std: 'Light sensor',
        desc: 'A resistor that changes with light. In the dark it has a very high resistance, and in bright light it falls to a few hundred ohms to a few kilohms.',
        rating: [['Dark', '≥ 1 MΩ'], ['Bright', '≈ 1 kΩ'], ['Response', '≈ 20 to 30 ms']],
        principle: 'Cadmium sulphide is a semiconductor. Light that hits it frees charge carriers, so the conductivity rises and the resistance falls. The serpentine track makes the sensing area large for a small part.',
        pros: ['Automatic street lights and night lamps', 'Light meters and alarms', 'Line-following robots'],
        rows: [['Material', 'Cadmium sulphide (CdS)'], ['Spectrum', 'Visible light, peak near green'], ['Speed', 'Slow compared with a photodiode'], ['Note', 'Cadmium is restricted in many regions']],
        facts: ['An LDR in a divider with a fixed resistor gives a voltage that rises or falls with light.'],
        parts: { win: 'Transparent window.', track: 'Serpentine CdS track between two electrodes.', ring: 'Plastic ring.', contacts: 'Two leads.' } },
      cement: { title: 'Cement (sand-cast) resistor', short: 'Cement', std: 'Power · 5 to 20 W',
        desc: 'A wire-wound resistor inside a rectangular ceramic case filled with cement. It is a cheap, rugged power resistor.',
        rating: [['Power', '5 to 20 W'], ['Tolerance', '± 5 %'], ['Values', '0.1 Ω to 10 kΩ']],
        principle: 'A wire coil on a ceramic rod sits inside a ceramic case, packed with cement. The cement gives heat conduction and protects the coil. The body runs hot, so it must be fitted with a gap above the board.',
        pros: ['Power supply bleeders and current limiters', 'Motor controls and lighting', 'Audio amplifier output stages'],
        rows: [['Case', 'Ceramic with cement fill'], ['Marking', 'Printed value and watts, for example 5W 10Ω J'], ['Tolerance code', 'J = ±5 %']],
        facts: ['The case can reach 200 °C in use.', 'Do not touch it while a circuit is running.'],
        parts: { body: 'Ceramic case.', wind: 'Resistance wire coil inside.', leads: 'Thick leads.', lbl: 'Printed value, watts and tolerance.' } }
    },
    extra: function () {
      var ds = COL.map(function (c) { return [c[1], c[0] + ' · ' + c[1]]; });
      return '<h3>Colour-code calculator</h3><div class="px-seg" id="rc-n"><button type="button" aria-pressed="true" data-n="4">4 bands</button><button type="button" aria-pressed="false" data-n="5">5 bands</button></div>' +
        '<div class="px-calc" style="margin-top:10px">' + P.sel('rc1', 'Band 1', ds, 1) + P.sel('rc2', 'Band 2', ds, 0) + '<span class="wide" id="rc3w" style="display:none">' + P.sel('rc3', 'Band 3', ds, 0) + '</span>' + P.sel('rcm', 'Multiplier', MULT.map(function (c) { return [c[1], c[0] + ' · ×' + c[1]]; }), 1e3) + P.sel('rct', 'Tolerance', TOL.map(function (c) { return [c[1], c[0] + ' · ±' + c[1] + ' %']; }), 5) +
        '<div class="px-out"><div class="px-cc" id="rc-bars"></div><small>Value</small><b id="rc-v">—</b><span id="rc-t"></span></div></div>' +
        '<h3>Ohm\'s law and power</h3><div class="px-calc">' + P.field('rl-v', 'Voltage', 5, 'V') + P.field('rl-r', 'Resistance', 220, 'Ω') + '<div class="px-out"><small>Current and power</small><b id="rl-o">—</b><span id="rl-s"></span></div></div>' +
        '<h3>Combine resistors</h3><div class="px-calc">' + P.field('rs-a', 'R₁', 100, 'Ω') + P.field('rs-b', 'R₂', 220, 'Ω') + '<div class="px-out"><small>Series  ·  Parallel</small><b id="rs-o">—</b><span>Series: R₁ + R₂. Parallel: R₁R₂ / (R₁ + R₂).</span></div></div>' +
        '<h3>Standard values (E12)</h3><p>10 12 15 18 22 27 33 39 47 56 68 82, times 1, 10, 100 and so on. E24 has 24 values per decade (5 %), E96 has 96 (1 %).</p>' +
        '<h3>Colour code</h3><div class="vk-xwrap"><table class="cat-grid"><thead><tr><th>Colour</th><th>Digit</th><th>Multiplier</th><th>Tol.</th></tr></thead><tbody>' + [['black', 0, '×1', ''], ['brown', 1, '×10', '±1 %'], ['red', 2, '×100', '±2 %'], ['orange', 3, '×1 k', ''], ['yellow', 4, '×10 k', ''], ['green', 5, '×100 k', '±0.5 %'], ['blue', 6, '×1 M', '±0.25 %'], ['violet', 7, '×10 M', '±0.1 %'], ['grey', 8, '×100 M', '±0.05 %'], ['white', 9, '×1 G', ''], ['gold', '', '×0.1', '±5 %'], ['silver', '', '×0.01', '±10 %']].map(function (r) { return '<tr><td><i style="display:inline-block;width:11px;height:11px;border-radius:3px;background:' + HEX[r[0]] + ';margin-right:7px;vertical-align:-1px;border:1px solid #26344a"></i>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('') + '</tbody></table></div>';
    },
    afterRender: function (id, el) {
      var $ = function (i) { return el.querySelector('#' + i); }; if (!$('rc1')) return; var n = 4, byV = {}; COL.forEach(function (c) { byV[c[1]] = c[0]; }); var mV = {}; MULT.forEach(function (c) { mV[c[1]] = c[0]; }); var tV = {}; TOL.forEach(function (c) { tV[c[1]] = c[0]; });
      function go() {
        var d1 = +$('rc1').value, d2 = +$('rc2').value, d3 = +$('rc3').value, m = +$('rcm').value, tl = +$('rct').value, v = (n === 4 ? d1 * 10 + d2 : d1 * 100 + d2 * 10 + d3) * m;
        var cs = [byV[d1], byV[d2]]; if (n === 5) cs.push(byV[d3]); cs.push(mV[m], tV[tl]);
        $('rc-bars').innerHTML = cs.map(function (c) { return '<i style="background:' + HEX[c] + '"></i>'; }).join(''); $('rc-v').textContent = P.fmt(v, 'Ω') + ' ± ' + tl + ' %'; $('rc-t').textContent = 'Range: ' + P.fmt(v * (1 - tl / 100), 'Ω') + ' to ' + P.fmt(v * (1 + tl / 100), 'Ω');
        var c = window.CATAPI && CATAPI.cur(); if (c && c.setBands && ((id === 'carbon' && n === 4) || (id === 'metal' && n === 5))) c.setBands(cs);
        var V = +$('rl-v').value || 0, R = +$('rl-r').value || 0; if (R > 0) { var I = V / R; $('rl-o').textContent = P.fmt(I, 'A') + ' · ' + P.fmt(V * I, 'W'); $('rl-s').textContent = I * V > .25 ? 'More than ¼ W: use a bigger resistor' : 'Fits a ¼ W resistor'; } else { $('rl-o').textContent = '—'; $('rl-s').textContent = ''; }
        var a = +$('rs-a').value || 0, b = +$('rs-b').value || 0; $('rs-o').textContent = P.fmt(a + b, 'Ω') + '  ·  ' + (a + b > 0 ? P.fmt(a * b / (a + b), 'Ω') : '—');
      }
      el.addEventListener('input', go); el.addEventListener('change', go);
      $('rc-n').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; n = +b.dataset.n; this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); $('rc3w').style.display = n === 5 ? '' : 'none'; go(); });
      if (id === 'metal') { n = 5; $('rc-n').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.n === '5'); }); $('rc3w').style.display = ''; $('rc1').value = 1; $('rc2').value = 0; $('rc3').value = 0; $('rcm').value = 100; $('rct').value = 1; } else if (id === 'carbon') { $('rc1').value = 1; $('rc2').value = 0; $('rcm').value = 1e3; $('rct').value = 5; }
      go();
    }
  };
})();
