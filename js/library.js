/* V-NODE library registry, organised in the seven categories of the home screen.
   To add a tool: add it to a category below, then create its page and add its tab to that page's nav. */
window.VOLTVERSE_LIBRARY = [
  { id: 'transformer', title: 'Transformer', color: '#22d3ee', icon: 'fa-bolt', key: 'Step voltage up or down',
    blurb: 'No moving parts, huge job. Take a transformer apart, then solve its numbers.',
    tools: [
      { title: '3D Transformer', href: 'transformer-explorer.html', tag: '3D model', icon: 'fa-cube', desc: 'Orbit 10 parts of an oil-filled power transformer, switch to cutaway view and read the formula behind each part.' },
      { title: 'Calculator', href: 'transformer-calculator.html', tag: 'Calculator', icon: 'fa-calculator', desc: 'Change voltage, current, turns or frequency and watch peak flux, phase lag and a live oscilloscope respond.' },
      { title: 'Design Calculator', href: 'transformer-design.html', tag: 'Design tool', icon: 'fa-ruler-combined', desc: 'Enter kVA, voltage and frequency to get core size, turns, wire gauge, weights and the materials needed for the rating.' }
    ] },
  { id: 'motors', title: 'Motors (AC / DC)', color: '#f59e0b', icon: 'fa-gears', key: 'Electricity in, motion out',
    blurb: 'See exactly what sits inside the casing and why the shaft turns.',
    tools: [
      { title: 'DC Cut Section', href: 'dc-motor.html', tag: '3D model', icon: 'fa-gears', desc: 'Yoke, poles, armature, commutator and brushes in 3D, with a spinning rotor and the working principle of each part.' },
      { title: 'DC Types', href: 'dc-motor-types.html', tag: '3D + circuits', icon: 'fa-diagram-project', desc: 'Series, shunt and compound motors side by side: 3D cutaway, circuit schematic, equations, characteristics and uses.' },
      { title: '3D Induction Motor', href: 'induction-motor.html', tag: '3D model', icon: 'fa-fan', desc: 'A cast-iron TEFC motor cut in half: squirrel cage and slip ring constructions, exploded view and the rotating field.' }
    ] },
  { id: 'generator', title: 'Generator', color: '#34d399', icon: 'fa-bolt', key: 'Motion in, electricity out',
    blurb: 'Cut one open and see how DC output is made.',
    tools: [
      { title: 'DC Generator', href: 'dc-generator.html', tag: '3D model', icon: 'fa-bolt', desc: 'Yoke, pole cores, pole shoes, field windings, armature, commutator, brushes, fan and bearings. Half-cut and exploded views, with the air gap highlighted.' }
    ] },
  { id: 'basic', title: 'Basic Electrical', color: '#60a5fa', icon: 'fa-plug', key: 'Wires, switches and symbols',
    blurb: 'The everyday parts every circuit is built from.',
    tools: [
      { title: 'Wire Directory', href: 'wire-directory.html', tag: 'Calculator', icon: 'fa-bezier-curve', desc: 'Cable cross-sections with current ratings, plus a voltage drop calculator for length, load and material.' },
      { title: 'Switches', href: 'switches.html', tag: '14 3D labs', icon: 'fa-toggle-on', desc: 'Knife, toggle, push button, rotary, float, limit, centrifugal, SPST, SPDT, DPST, DPDT, flush, intermediate and MCB, each with a 3D model and a circuit symbol.' },
      { title: 'Symbols', href: 'symbols.html', tag: 'Reference', icon: 'fa-shapes', desc: 'A searchable guide to the circuit symbols in the diploma syllabus, with what each one does.' },
      { title: 'Lamp Holders', href: 'holders.html', tag: '9 3D models', icon: 'fa-lightbulb', desc: 'Pendant, batten, angle, bracket, Edison screw, Goliath, tube light, weatherproof and bayonet holders. Fit the lamp and see the contacts inside.' },
      { title: 'Resistors', href: 'resistors.html', tag: '8 types + calculator', icon: 'fa-wave-square', desc: 'Carbon and metal film, wire-wound, SMD, potentiometer, NTC, LDR and cement resistors, with a colour-code calculator.' },
      { title: 'Inductors', href: 'inductors.html', tag: '6 types + calculator', icon: 'fa-ring', desc: 'Air-core, iron-core, toroid, axial choke, SMD power and tunable inductors, with reactance and energy calculators.' },
      { title: 'Capacitors', href: 'capacitors.html', tag: '7 types + calculator', icon: 'fa-battery-half', desc: 'Ceramic, MLCC, film, electrolytic, tantalum, supercap and variable capacitors, with a code reader and calculators.' }
    ] },
  { id: 'safety', title: 'Electrical Safety', color: '#fb7185', icon: 'fa-shield-halved', key: 'Rules and protective gear',
    blurb: 'See what arc-flash protection looks like on a real person, then learn the rules.',
    tools: [
      { title: 'Safety Rules', href: 'safety-guide.html', tag: 'Guide + quiz', icon: 'fa-shield-halved', desc: 'Safety zones, regional rules, a rule search and a safety quiz.' },
      { title: 'Safety PPE', href: 'ppe.html', tag: 'Animated 3D person', icon: 'fa-user-shield', desc: 'A lifelike worker in each NFPA 70E arc-flash category 1 to 4, with an arc-flash test and every garment explained.' },
      { title: 'Earthing', href: 'earthing.html', tag: '5 ground cut-sections', icon: 'fa-bore-hole', desc: 'Pipe, plate, strip and rod earthing plus the substation earth mat, buried in layered soil, with fault current flow and a resistance calculator.' }
    ] },
  { id: 'transmission', title: 'Transmission & Switchgear', color: '#c084fc', icon: 'fa-tower-cell', key: 'Poles, insulators and isolators',
    blurb: 'How power travels from the station to your street, and how it is switched safely.',
    tools: [
      { title: 'Poles & Towers', href: 'supports.html', tag: '15 structures', icon: 'fa-tower-cell', desc: 'Wooden, steel, RCC and PCC poles and six lattice tower types, with X-ray views and the real dimensions.' },
      { title: 'Insulator', href: 'insulators.html', tag: '3D model', icon: 'fa-plug-circle-bolt', desc: 'Pin, suspension, strain, shackle, post and composite insulators with labelled parts, creepage distance and flashover ratings.' },
      { title: 'HV Isolator', href: 'isolators.html', tag: '6 working models', icon: 'fa-power-off', desc: 'Single-break, double-break, vertical-break, knee-break, pantograph and semi-pantograph isolators with an earth switch interlock.' }
    ] },
  { id: 'power-electronics', title: 'Power Electronics', color: '#2dd4bf', icon: 'fa-wave-square', key: 'Turn AC into DC',
    blurb: 'Switching AC into DC and smoothing it out.',
    tools: [
      { title: 'Rectifier', href: 'rectifier.html', tag: 'Circuit + scope', icon: 'fa-wave-square', desc: 'Half-wave, center-tap and bridge rectifiers with C, L, LC and pi filters: current flow, oscilloscope, ripple and efficiency.' }
    ] },
  { id: 'soon', title: 'Coming next', soon: true, blurb: 'The library keeps growing. Planned:',
    items: ['Synchronous motors', 'Circuit breakers', 'Relays and contactors', 'Motor starters', 'AC to DC converters', 'Hobby electronics: more boards, servos and projects'] }
];
