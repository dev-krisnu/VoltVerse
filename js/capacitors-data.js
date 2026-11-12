(function () {
  var P = PX;
  window.CAT = {
    kind: 'capacitor', fit: 1.2, order: ['disc', 'mlcc', 'film', 'electrolytic', 'tantalum', 'super', 'variable'],
    act: P.act, prosTitle: 'Where it is used', rowsTitle: 'Specifications', dir: [.45, .5, 1], viewer: { pos: [4, 4, 6], target: [0, 1, 0], size: 20 },
    models: {
      disc: { title: 'Ceramic disc capacitor', short: 'Ceramic disc', std: 'Radial · 100 nF shown',
        desc: 'A small ceramic disc with a silver plate on each face, dipped in orange epoxy. It has no polarity and works at high frequency. The code "104" means 100 nF.',
        rating: [['C', '1 pF to 1 µF'], ['Voltage', '50 V typ.'], ['Polarity', 'None']],
        principle: 'Two conducting plates separated by an insulator (the dielectric) store charge: Q = CV. C = ε₀εr A / d. Ceramic has a high εr, so a small disc gives a useful C. Because it has no winding it has very low inductance, so it works well at radio frequencies.',
        pros: ['Decoupling next to every microchip', 'Filters and timing circuits', 'Radio and high-frequency circuits'],
        rows: [['Dielectric', 'Ceramic (Class 1 C0G or Class 2 X7R, Y5V)'], ['Code', '104 = 10 × 10⁴ pF = 100 nF'], ['Tolerance', 'K = ±10 %, M = ±20 %, Z = +80 / −20 %'], ['Polarity', 'None']],
        facts: ['Class 2 ceramics change value with voltage and temperature.', 'Place the decoupling capacitor as close as possible to the chip pins.'],
        parts: { body: 'Epoxy coating.', plates: 'Ceramic dielectric between two silver plates.', leads: 'Leads.', lbl: 'Printed code, "104" means 100 nF.' } },
      mlcc: { title: 'MLCC (SMD ceramic)', short: 'MLCC (SMD)', std: 'Multilayer chip',
        desc: 'Many thin electrodes stacked with ceramic between them make a big capacitance in a tiny chip. Every phone has hundreds.',
        rating: [['C', '1 pF to 100 µF'], ['Voltage', '6.3 to 100 V'], ['Size', '0402 to 1210']],
        principle: 'Stacking N layers puts N−1 capacitors in parallel, and the capacitances add. Alternate electrodes reach the left and right terminals. More layers and thinner ceramic make C larger.',
        pros: ['Decoupling on every modern board', 'Switching-power-supply filters', 'RF matching'],
        rows: [['Dielectrics', 'C0G / NP0 (stable), X7R, X5R (high C)'], ['Layers', '100s to 1000s'], ['Polarity', 'None'], ['Note', 'DC bias lowers the real capacitance']],
        facts: ['A 10 µF X5R may give only 4 µF at its rated voltage.', 'Chips can crack if the board bends.'],
        parts: { body: 'Ceramic body.', stack: 'Alternating electrodes in the ceramic.', ends: 'Terminations.', base: 'PCB.' } },
      film: { title: 'Film capacitor', short: 'Film', std: 'Polyester / polypropylene',
        desc: 'Two long metal foils or metallised films separated by plastic film are rolled up and put in a box. Stable, long-lived and non-polarised.',
        rating: [['C', '1 nF to 100 µF'], ['Voltage', '63 V to 2 kV'], ['Life', 'Very long']],
        principle: 'The plastic film (polyester or polypropylene) is the dielectric. Metallised film is self-healing: if a pinhole breaks down, the thin metal around it vaporises and the capacitor keeps working. A roll makes a large area in a small volume.',
        pros: ['Audio crossovers and signal paths', 'Mains-voltage X and Y safety capacitors', 'Motor-run capacitors and snubbers'],
        rows: [['Dielectrics', 'PET (polyester), PP, PPS'], ['Marking', '474J = 47 × 10⁴ pF = 470 nF ±5 %'], ['Tolerance code', 'J = ±5 %, K = ±10 %'], ['Polarity', 'None']],
        facts: ['Polypropylene has the lowest loss. Polyester is cheaper.'],
        parts: { body: 'Resin box.', spiral: 'Rolled metallised film.', leads: 'Leads.', lbl: 'Marking 474J.' } },
      electrolytic: { title: 'Aluminium electrolytic capacitor', short: 'Electrolytic', std: 'Polarised · large C',
        desc: 'A big capacitance in a can. It is polarised: the stripe marks the negative lead, and the longer lead is positive. It is used to smooth power supplies.',
        rating: [['C', '1 µF to 100 000 µF'], ['Voltage', '6.3 to 450 V'], ['Polarity', 'Yes · stripe = −']],
        principle: 'A thin aluminium oxide layer made on the anode foil is the dielectric. Because it is only nanometres thick, C is huge. The oxide only forms and holds with the correct polarity, so a reverse voltage destroys it and can make it vent or burst. A paper soaked in electrolyte forms the cathode contact.',
        pros: ['Smoothing after a rectifier', 'Power-supply energy storage and filtering', 'Audio coupling and bypass'],
        rows: [['Polarity', 'Stripe marks the negative lead'], ['Voltage', 'Never exceed the rating; use 20 % margin'], ['Temperature', '85 °C or 105 °C rated'], ['ESR', 'Gets worse with age and heat'], ['Vent', 'Cross on top lets gas escape']],
        facts: ['Capacitor life roughly halves for every 10 °C rise.', 'Discharge large capacitors before you touch a circuit.'],
        parts: { can: 'Aluminium can with a coloured sleeve.', stripe: 'The stripe with minus signs marks the negative lead.', top: 'Safety vent: the scored cross opens if gas builds up.', roll: 'Anode foil, paper and cathode foil, rolled up.', leads: 'Leads: the longer one is positive.', seal: 'Rubber seal.' } },
      tantalum: { title: 'Tantalum capacitor', short: 'Tantalum', std: 'Polarised · compact',
        desc: 'A small, stable polarised capacitor with a sintered tantalum anode. The orange bead has a "+" mark.',
        rating: [['C', '0.1 to 470 µF'], ['Voltage', '4 to 50 V'], ['Polarity', 'Yes · + mark']],
        principle: 'Tantalum powder is sintered into a porous pellet, giving a vast surface. An oxide layer of tantalum pentoxide is the dielectric. This gives more capacitance per volume than aluminium electrolytic and better stability, but a surge or reverse voltage can make it fail short and burn.',
        pros: ['Phones, laptops and medical devices', 'Space-limited filters', 'Timing circuits that need stable values'],
        rows: [['Marking', '+ for the positive lead'], ['Derating', 'Use at 50 % of rated voltage'], ['Failure mode', 'Can fail as a short circuit'], ['Cost', 'Higher than aluminium']],
        facts: ['Derate tantalums to half the rated voltage in low-impedance circuits.'],
        parts: { body: 'Epoxy bead.', core: 'Sintered tantalum anode.', plus: 'Plus mark.', leads: 'Leads.' } },
      super: { title: 'Supercapacitor', short: 'Supercap', std: 'Farads',
        desc: 'Stores thousands of times more charge than an electrolytic. Typical cells are 2.7 V, rated in farads. They bridge power gaps and charge in seconds.',
        rating: [['C', '0.1 to 3000 F'], ['Voltage', '2.7 V / cell'], ['Cycle life', '> 500 000']],
        principle: 'Activated carbon has a huge surface area. The charge sits in an electric double layer only atoms thick, so C is huge. No chemical reaction is needed, so it charges and discharges quickly and survives hundreds of thousands of cycles. Energy is E = ½CV².',
        pros: ['Memory backup and real-time clock supplies', 'Regenerative braking in vehicles and cranes', 'Short power bursts for sensors and flash'],
        rows: [['Energy', 'E = ½ C V²'], ['Voltage', '2.7 V per cell, stack cells for more'], ['Polarity', 'Yes'], ['Leakage', 'Higher than a battery']],
        facts: ['A 10 F cell at 2.7 V stores ½ × 10 × 2.7² ≈ 36 J.', 'Cells in series need balancing.'],
        parts: { can: 'Metal can.', band: 'Rating band.', cells: 'Carbon electrodes and separator.', leads: 'Leads.' } },
      variable: { title: 'Variable (tuning) capacitor', short: 'Variable', std: 'Air-gap gang',
        desc: 'A set of fixed plates and a set of moving plates. Turning the shaft changes how far the plates overlap, so the capacitance changes. It was used to tune radios.',
        rating: [['C', '10 to 500 pF'], ['Dielectric', 'Air'], ['Use', 'Tuning']],
        act: { on: 'Turn the knob', off: 'Turn back', idleText: 'Plates apart · low C', onText: 'Turning…', offText: 'Turning back…', doneText: 'Plates meshed · high C' },
        principle: 'C = ε₀εr A / d. Turning the rotor makes the overlapping area A bigger and C rises. With an inductor it makes a resonant circuit, f = 1 / (2π√(LC)). Turning the knob moves the station.',
        pros: ['Old radio tuners', 'Antenna tuners and RF test gear', 'Trimmer versions on circuit boards'],
        rows: [['Dielectric', 'Air or plastic film'], ['Formula', 'C = ε₀ εr A / d'], ['Resonance', 'f = 1 / (2π√LC)']],
        facts: ['Plates must never touch. The gap is a fraction of a millimetre.'],
        parts: { stator: 'Fixed plates.', rotor: 'Moving plates on the shaft.', frame: 'Frame.' } }
    },
    extra: function () {
      var codes = [['104', '100 nF'], ['103', '10 nF'], ['473', '47 nF'], ['102', '1 nF'], ['22', '22 pF'], ['474', '470 nF']];
      return '<h3>Read the printed code</h3><div class="px-calc">' + P.field('ca-c', '3-digit code', 104, '') + P.sel('ca-t', 'Tolerance letter', [[5, 'J ±5 %'], [10, 'K ±10 %'], [20, 'M ±20 %'], [1, 'F ±1 %'], [2, 'G ±2 %']], 5) + '<div class="px-out"><small>Value</small><b id="ca-o">—</b><span id="ca-r"></span></div></div>' +
        '<p style="font-size:12px;color:#7d90a8">The first two digits are the value in pF and the third is the number of zeros. For example 104 is 10 followed by 4 zeros: 100 000 pF = 100 nF.</p>' +
        '<h3>Reactance and energy</h3><div class="px-calc">' + P.field('cx-c', 'Capacitance', 100, 'µF') + P.field('cx-f', 'Frequency', 50, 'Hz') + P.field('cx-v', 'Voltage', 12, 'V') + '<div class="px-out"><small>Reactance</small><b id="cx-x">—</b><span id="cx-e"></span></div></div>' +
        '<h3>Combine capacitors</h3><div class="px-calc">' + P.field('cc-a', 'C₁', 10, 'µF') + P.field('cc-b', 'C₂', 22, 'µF') + '<div class="px-out"><small>Parallel  ·  Series</small><b id="cc-o">—</b><span>Parallel: C₁ + C₂. Series: C₁C₂ / (C₁ + C₂). Capacitors add in parallel, unlike resistors.</span></div></div>' +
        '<h3>Rules to remember</h3><ul><li>A capacitor blocks DC and passes AC. Its reactance X_C = 1 / (2πfC) falls as frequency rises.</li><li>Q = C × V, and the energy stored is ½ C V².</li><li>Time constant of an RC circuit: τ = R × C. After 5τ the capacitor is almost fully charged.</li><li>Polarised capacitors (electrolytic, tantalum) must be connected the right way round.</li></ul>';
    },
    afterRender: function (id, el) {
      var $ = function (i) { return el.querySelector('#' + i); }; if (!$('ca-c')) return;
      function go() {
        var s = String($('ca-c').value || '').replace(/\D/g, ''), pf = null; if (s.length === 3) pf = +s.slice(0, 2) * Math.pow(10, +s[2]); else if (s.length && s.length <= 2) pf = +s;
        $('ca-o').textContent = pf == null ? 'Enter 2 or 3 digits' : P.fmt(pf * 1e-12, 'F'); var tl = +$('ca-t').value; $('ca-r').textContent = pf == null ? '' : 'Range: ' + P.fmt(pf * (1 - tl / 100) * 1e-12, 'F') + ' to ' + P.fmt(pf * (1 + tl / 100) * 1e-12, 'F');
        var C = (+$('cx-c').value || 0) * 1e-6, f = +$('cx-f').value || 0, V = +$('cx-v').value || 0; $('cx-x').textContent = C * f > 0 ? P.fmt(1 / (2 * Math.PI * f * C), 'Ω') : '—'; $('cx-e').textContent = 'Stored: ' + P.fmt(.5 * C * V * V, 'J') + ', charge ' + P.fmt(C * V, 'C');
        var a = +$('cc-a').value || 0, b = +$('cc-b').value || 0; $('cc-o').textContent = P.fmt((a + b) * 1e-6, 'F') + '  ·  ' + (a + b > 0 ? P.fmt(a * b / (a + b) * 1e-6, 'F') : '—');
      }
      el.addEventListener('input', go); el.addEventListener('change', go); go();
    }
  };
})();
