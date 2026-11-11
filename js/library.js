/* V-NODE library registry. To add a component: add a tool to a family below (or a new family),
   then create its page (copy dc-motor.html as a starting point) and add its tab to the nav of that page. */
window.VOLTVERSE_LIBRARY = [
  { id: 'transformers', title: 'Transformers', accent: 'cyan', icon: 'fa-bolt',
    blurb: 'Step voltage up or down with no moving parts. Take one apart, then solve its numbers.',
    tools: [
      { title: '3D Transformer Explorer', href: 'transformer-explorer.html', tag: '3D model', icon: 'fa-cube',
        desc: 'Orbit 10 parts of an oil-filled power transformer, switch to cutaway view and read the formula behind each part.' },
      { title: 'Transformer Calculator', href: 'transformer-calculator.html', tag: 'Calculator', icon: 'fa-calculator',
        desc: 'Change voltage, current, turns or frequency and watch peak flux, phase lag and a live oscilloscope respond.' },
      { title: 'Transformer Design Calculator', href: 'transformer-design.html', tag: 'Design tool', icon: 'fa-ruler-combined',
        desc: 'Enter kVA, voltage and frequency to get core size, turns, wire gauge, weights and the materials needed for the rating.' }
    ] },
  { id: 'motors', title: 'Motors', accent: 'amber', icon: 'fa-gears',
    blurb: 'Turn electrical energy into motion. See exactly what sits inside the casing.',
    tools: [
      { title: 'DC Motor Cut-Section Visualizer', href: 'dc-motor.html', tag: '3D model', icon: 'fa-gears',
        desc: 'Yoke, poles, armature, commutator and brushes in 3D, with a spinning rotor and the working principle of each part.' },
      { title: 'DC Motor Types Comparison', href: 'dc-motor-types.html', tag: '3D + circuits', icon: 'fa-diagram-project',
        desc: 'Series, shunt and compound motors side by side: 3D cutaway, circuit schematic, equations, characteristics and uses.' },
      { title: '3D Induction Motor', href: 'induction-motor.html', tag: '3D model', icon: 'fa-fan',
        desc: 'A cast-iron TEFC motor cut in half: squirrel cage and slip ring constructions, exploded view and the rotating field.' }
    ] },
  { id: 'generators', title: 'Generators', accent: 'amber', icon: 'fa-bolt',
    blurb: 'Turn motion into electricity. Cut one open and see how the DC output is made.',
    tools: [
      { title: 'DC Generator Cut-Section', href: 'dc-generator.html', tag: '3D model', icon: 'fa-bolt',
        desc: 'Yoke, pole cores, pole shoes, field windings, armature, commutator, brushes, cooling fan and sealed bearings. Half-cut and exploded views, with the air gap highlighted.' }
    ] },
  { id: 'supports', fresh: true, title: 'Line Supports', accent: 'cyan', icon: 'fa-tower-cell',
    blurb: 'The poles and towers that carry power lines, from a village pole to a 220 kV tower. 15 structures in 3D.',
    tools: [
      { title: 'Wooden Poles', href: 'supports.html#wood_single', tag: '3 models', icon: 'fa-tree', desc: 'Single pole, A-type and H-type wooden structures with cross-arms, stays, earthing and the buried base.' },
      { title: 'Steel Poles & Towers', href: 'supports.html#steel_110', tag: '3 models', icon: 'fa-grip-lines-vertical', desc: '110 kV and 220 kV lattice towers drawn to the standard dimensions, plus a swaged tubular steel pole.' },
      { title: 'RCC & PCC Poles', href: 'supports.html#rcc_single', tag: '3 models + X-ray', icon: 'fa-cubes', desc: 'Reinforced and pre-stressed concrete poles. Switch on X-ray to see the steel cage inside.' },
      { title: 'Lattice Steel Towers', href: 'supports.html#lat_delta', tag: '6 models', icon: 'fa-tower-cell', desc: 'Horizontal, delta, vertical, single-column delta, H-frame and guyed Vee structures, built leg by leg.' }
    ] },
  { id: 'isolators', fresh: true, title: 'Isolators', accent: 'amber', icon: 'fa-plug-circle-bolt',
    blurb: 'Substation disconnectors that give a visible break. Open and close each one in 3D.',
    tools: [
      { title: 'HV Isolators', href: 'isolators.html', tag: '6 working models', icon: 'fa-plug-circle-bolt', desc: 'Single-break, double-break, vertical-break, knee-break, pantograph and semi-pantograph isolators with earth switch, ratings and the safe operating sequence.' }
    ] },
  { id: 'safety', fresh: true, title: 'Safety & PPE', accent: 'amber', icon: 'fa-user-shield',
    blurb: 'See what arc-flash protection looks like on a real person, then learn the rules.',
    tools: [
      { title: 'Arc-Flash PPE Categories 1 to 4', href: 'ppe.html', tag: 'Animated 3D person', icon: 'fa-user-shield', desc: 'A lifelike worker in each NFPA 70E category, with an arc-flash demonstration and every garment explained.' },
      { title: 'Electrical Safety Guide', href: 'safety-guide.html', tag: 'Guide + quiz', icon: 'fa-shield-halved', desc: 'Safety zones, regional rules, a rule search and a safety quiz.' }
    ] },
  { id: 'switches', title: 'Switches', accent: 'amber', icon: 'fa-toggle-on',
    blurb: 'Fourteen interactive switch labs, from the knife switch to the MCB.',
    tools: [
      { title: 'Electrical Switches', href: 'switches.html', tag: '14 3D labs', icon: 'fa-toggle-on',
        desc: 'Knife, toggle, push button, rotary, float, limit, centrifugal, SPST, SPDT, DPST, DPDT, flush, intermediate and MCB, each with a 3D model and a circuit symbol.' }
    ] },
  { id: 'electronics', title: 'Power Electronics', accent: 'cyan', icon: 'fa-wave-square',
    blurb: 'Turn AC into DC and smooth it out.',
    tools: [
      { title: 'Rectifier & Filter Visualizer', href: 'rectifier.html', tag: 'Circuit + scope', icon: 'fa-wave-square',
        desc: 'Half-wave, center-tap and bridge rectifiers with C, L, LC and pi filters: current flow, oscilloscope, ripple and efficiency.' }
    ] },
  { id: 'reference', title: 'Components & Reference', accent: 'sky', icon: 'fa-book',
    blurb: 'Insulators, cables and symbols: the parts around the machines.',
    tools: [
      { title: '3D Insulator Visualizer', href: 'insulators.html', tag: '3D model', icon: 'fa-plug-circle-bolt',
        desc: 'Pin, suspension, strain, shackle, post and composite insulators with labelled parts, creepage distance and flashover ratings.' },
      { title: 'Wire Directory & Voltage Drop', href: 'wire-directory.html', tag: 'Calculator', icon: 'fa-bezier-curve',
        desc: 'Cable cross-sections with current ratings, plus a voltage drop calculator for length, load and material.' },
      { title: 'Electrical & Electronics Symbols', href: 'symbols.html', tag: 'Reference', icon: 'fa-shapes',
        desc: 'A searchable guide to the circuit symbols in the diploma syllabus, with what each one does.' }
    ] },
  { id: 'hobby', title: 'Hobby Electronics', accent: 'cyan', icon: 'fa-microchip',
    blurb: 'The boards and parts you build projects with, plus starter projects to build and extend.',
    tools: [
      { title: 'Hobby Electronics Lab', href: 'hobby-electronics.html', tag: '10 3D parts + 5 projects', icon: 'fa-microchip',
        desc: 'Arduino Uno, ESP32, HC-05, servo, ultrasonic sensor, relay and more in 3D, with pinouts, specs, and five starter projects you can build.' }
    ] },
  { id: 'practice', title: 'Practice', accent: 'sky', icon: 'fa-graduation-cap',
    blurb: 'Check what you remember after exploring.',
    tools: [
      { title: 'Electrical Quiz Lab', href: 'quiz.html', tag: 'Quiz', icon: 'fa-graduation-cap',
        desc: 'Ten questions per round from a bank of 50 diploma-level questions, with explanations and no repeats.' }
    ] },
  { id: 'soon', title: 'Coming next', soon: true,
    blurb: 'The library keeps growing. Planned families:',
    items: ['Synchronous motors', 'Circuit breakers', 'Relays and contactors', 'Capacitors and inductors', 'Rectifiers and inverters'] }
];
