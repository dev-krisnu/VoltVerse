(function () {
  var P = PX;
  window.CAT = {
    kind: 'inductor', fit: 1.2, order: ['air', 'iron', 'toroid', 'choke', 'smd', 'slug'],
    act: P.act, prosTitle: 'Where it is used', rowsTitle: 'Specifications', dir: [.45, .5, 1], viewer: { pos: [4, 4, 6], target: [0, 1, 0], size: 20 },
    models: {
      air: { title: 'Air-core inductor', short: 'Air core', std: 'Coil · RF',
        desc: 'Just a coil of wire with nothing inside. Without a magnetic core it cannot saturate, so it stays linear at any current. It is used at radio frequencies.',
        rating: [['L', 'nH to µH'], ['Core', 'Air (µr = 1)'], ['Q', '50 to 200']],
        act: { on: 'Show field', off: 'Hide field', idleText: 'No current', onText: 'Field building…', offText: 'Field fading…', doneText: 'Field around the coil' },
        principle: 'Current in a wire makes a magnetic field. A coil adds the fields of its turns together inside it. If the current changes, the changing flux induces a voltage that opposes the change: V = L · di/dt. For a long solenoid, L = µ₀N²A / l. Doubling the turns makes L four times bigger.',
        pros: ['Radio tuners, antennas and RF filters', 'Metal detectors and wireless chargers', 'Circuits where no core loss is allowed'],
        rows: [['Formula (solenoid)', 'L = µ₀ N² A / l'], ['µ₀', '4π × 10⁻⁷ H/m'], ['Reactance', 'X_L = 2πfL'], ['Energy', 'E = ½ L I²'], ['Saturation', 'None']],
        facts: ['The blue loops show the field around the coil when current flows.', 'Air-core coils are large for a given inductance, since air is a poor magnetic material.'],
        parts: { coil: 'Copper winding.', tails: 'The ends are the terminals.', field: 'The magnetic field lines, closed loops through the coil.' } },
      iron: { title: 'Iron-core inductor', short: 'Iron core', std: 'Laminated · mains frequency',
        desc: 'A coil on a stack of thin iron sheets. The core multiplies the inductance by hundreds, so a big inductance fits in a small space. It is used at power frequencies.',
        rating: [['L', 'mH to H'], ['Core', 'Silicon steel'], ['Use', '50/60 Hz']],
        principle: 'Iron guides the magnetic flux, which raises L by the relative permeability µr (hundreds to thousands). The core is made of thin insulated laminations so eddy currents cannot flow through it and heat it. If the current is too big the core saturates and L falls sharply.',
        pros: ['Smoothing chokes in power supplies', 'Fluorescent-lamp ballasts', 'Filters in power circuits and motor drives'],
        rows: [['Core', 'E-I laminations, silicon steel'], ['µr', '200 to 5000'], ['Winding', 'Enamelled copper wire'], ['Air gap', 'Prevents saturation under DC'], ['Losses', 'Copper loss, hysteresis, eddy current']],
        facts: ['Laminations stop eddy currents. A solid iron core would get very hot.', 'A transformer is two coils on one such core.'],
        parts: { core: 'Stack of insulated E and I laminations.', coil: 'Copper winding.', bob: 'Plastic bobbin that holds the coil.', tails: 'Terminals.' } },
      toroid: { title: 'Toroidal inductor', short: 'Toroid', std: 'Ferrite ring',
        desc: 'A coil wound round a ring-shaped core. The flux stays inside the ring, so very little leaks out and it hardly disturbs other parts.',
        rating: [['L', 'µH to mH'], ['Core', 'Ferrite or iron powder'], ['Leakage', 'Very low']],
        principle: 'The flux goes round the ring and has no gap to leak out of. This gives a high L for few turns and low electromagnetic interference. For a toroid, L = µ₀µr N² h ln(ro/ri) / 2π, where h is the height and ro, ri the outer and inner radii.',
        pros: ['Switch-mode power supplies and EMI filters', 'Audio amplifiers and isolating transformers', 'Common-mode chokes on cables'],
        rows: [['Formula', 'L = µ₀µr N² h ln(ro/ri) / 2π'], ['Ferrite', 'Higher frequencies, low loss'], ['Iron powder', 'Higher currents, soft saturation'], ['Winding', 'Spread evenly round the ring']],
        facts: ['A ferrite clamp on a USB cable is a common-mode toroidal choke.', 'Evenly spread turns give the lowest stray field.'],
        parts: { core: 'Ferrite or powdered-iron ring.', wind: 'Copper turns round the ring.', ends: 'Leads.' } },
      choke: { title: 'Axial (colour-coded) inductor', short: 'Axial choke', std: 'Looks like a resistor',
        desc: 'A small coil on a ferrite rod with a moulded body and leads at both ends. It is marked with colour bands like a resistor, but the value is in microhenries.',
        rating: [['L', '1 µH to 10 mH'], ['Tolerance', '± 10 %'], ['Bands', 'µH']],
        principle: 'A winding on a ferrite rod gives a higher L in a small size. The bands follow the resistor colour code and the answer is in µH. For example brown, black, brown is 1 and 0 followed by ×10, which is 100 µH. A silver last band means ±10 %.',
        pros: ['Filters and RF chokes', 'Noise suppression on supply lines', 'Small switching converters'],
        rows: [['Colour code', 'Like resistors, answer in µH'], ['Example', 'brown black brown silver = 100 µH ± 10 %'], ['Core', 'Ferrite rod'], ['Package', 'Moulded axial']],
        facts: ['Do not confuse it with a resistor: check the body with a meter. A resistor reads ohms; an inductor reads almost zero.'],
        parts: { body: 'Moulded plastic body.', bands: 'Bands read like a resistor, in µH.', core: 'Ferrite rod.', wind: 'Winding.', leads: 'Leads.' } },
      smd: { title: 'SMD power inductor', short: 'SMD power', std: 'Shielded · 4.7 µH',
        desc: 'A compact shielded inductor for the switching converters on modern boards. The code "4R7" means 4.7 µH.',
        rating: [['L', '4.7 µH'], ['Isat', 'Several amps'], ['DCR', 'mΩ range']],
        principle: 'A flat winding sits on a ferrite drum core, and a ferrite shell closes the magnetic path, so the field does not leak out. The two ratings to watch are the saturation current (where L falls by about 30 %) and DCR, the winding resistance that causes heat.',
        pros: ['Buck and boost converters on phones and laptops', 'LED drivers', 'Microcontroller board regulators'],
        rows: [['Marking', '4R7 = 4.7 µH'], ['Isat', 'Current at which L drops ≈ 30 %'], ['Irms', 'Current for about 40 °C rise'], ['DCR', 'Winding resistance']],
        facts: ['Choose an inductor with Isat above the peak current of the converter.'],
        parts: { body: 'Shielded ferrite body.', core: 'Ferrite drum core.', wind: 'Flat copper winding.', tm: 'Terminals.', lbl: 'Marking.' } },
      slug: { title: 'Tunable (slug) inductor', short: 'Variable (slug)', std: 'RF tuning',
        desc: 'A coil with a movable ferrite slug. Screwing the slug in or out changes the inductance, so it is used to tune radio circuits.',
        rating: [['Tuning', '± 10 to 30 %'], ['Core', 'Ferrite slug'], ['Use', 'RF']],
        act: { on: 'Screw slug in', off: 'Screw slug out', idleText: 'Slug out · low L', onText: 'Screwing in…', offText: 'Backing out…', doneText: 'Slug in · high L' },
        principle: 'The more of the ferrite slug sits inside the coil, the more flux the coil can pass, so L rises. Together with a capacitor, the coil forms a resonant circuit at f = 1 / (2π√(LC)), and moving the slug changes f.',
        pros: ['IF transformers in radio receivers', 'Oscillators and filters', 'Test equipment'],
        rows: [['Resonance', 'f = 1 / (2π√LC)'], ['Slug', 'Ferrite with a hex or slot drive'], ['Can', 'Aluminium screen']],
        facts: ['Use a plastic tuning tool: a metal screwdriver would change L itself.'],
        parts: { coil: 'Winding.', slug: 'Tuning slug.', can: 'Screening can.', pins: 'Pins.' } }
    },
    extra: function () {
      return '<h3>Reactance and energy</h3><div class="px-calc">' + P.field('li-l', 'Inductance', 10, 'mH') + P.field('li-f', 'Frequency', 50, 'Hz') + P.field('li-i', 'Current', 2, 'A') + '<div class="px-out"><small>Reactance</small><b id="li-x">—</b><span id="li-e"></span></div></div>' +
        '<h3>Combine inductors</h3><div class="px-calc">' + P.field('lc-a', 'L₁', 10, 'mH') + P.field('lc-b', 'L₂', 20, 'mH') + '<div class="px-out"><small>Series  ·  Parallel</small><b id="lc-o">—</b><span>Series: L₁ + L₂. Parallel: L₁L₂ / (L₁ + L₂), if no mutual coupling.</span></div></div>' +
        '<h3>Rules to remember</h3><ul><li>An inductor opposes a change in current. It acts like a short circuit to DC and a larger resistance to higher frequencies.</li><li>Voltage across it is V = L · di/dt.</li><li>The energy it stores in the magnetic field is ½ L I².</li><li>Opening a circuit that carries current into an inductor causes a high voltage spike. A diode across a relay coil stops it.</li></ul>';
    },
    afterRender: function (id, el) {
      var $ = function (i) { return el.querySelector('#' + i); }; if (!$('li-l')) return;
      function go() { var L = (+$('li-l').value || 0) / 1e3, f = +$('li-f').value || 0, I = +$('li-i').value || 0; $('li-x').textContent = P.fmt(2 * Math.PI * f * L, 'Ω'); $('li-e').textContent = 'Stored energy: ' + P.fmt(.5 * L * I * I, 'J'); var a = +$('lc-a').value || 0, b = +$('lc-b').value || 0; $('lc-o').textContent = P.fmt((a + b) / 1e3, 'H') + '  ·  ' + (a + b > 0 ? P.fmt(a * b / (a + b) / 1e3, 'H') : '—'); }
      el.addEventListener('input', go); go();
    }
  };
})();
