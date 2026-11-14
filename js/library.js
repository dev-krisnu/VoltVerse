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
      { title: '3D Induction Motor', href: 'induction-motor.html', tag: '3D model', icon: 'fa-fan', desc: 'A cast-iron TEFC motor cut in half: squirrel cage and slip ring constructions, exploded view and the rotating field.' },
      { title: 'Synchronous Motor', href: 'sync-motor.html', tag: '4 3D views', icon: 'fa-rotate', desc: 'The rotor locking onto the rotating field, a slip-ring and damper-bar cutaway, why it is not self-starting, and power factor correction with a V-curve.' }
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
      { title: 'Capacitors', href: 'capacitors.html', tag: '7 types + calculator', icon: 'fa-battery-half', desc: 'Ceramic, MLCC, film, electrolytic, tantalum, supercap and variable capacitors, with a code reader and calculators.' },
      { title: 'Diodes & Transistors', href: 'semiconductors.html', tag: '6 junction cutaways', icon: 'fa-microchip', desc: 'Rectifier, Zener, LED, BJT, MOSFET and IGBT. Drag a slider to turn each one on and watch the depletion region and the carriers.' },
      { title: 'Fuses', href: 'fuses.html', tag: '4 types', icon: 'fa-fire', desc: 'HRC cartridge, rewirable, blade and glass fuses. Watch the element melt under overload and short-circuit, with time-current curves.' },
      { title: 'Cables & Wires', href: 'cables.html', tag: '4 cutaways + tables', icon: 'fa-grip-lines', desc: 'Single-core, multicore, armoured and XLPE cables. Peel the layers and read the current-carrying capacity tables.' },
      { title: 'Meters & Instruments', href: 'meters.html', tag: '5 instruments', icon: 'fa-gauge', desc: 'Moving-coil, moving-iron, clamp meter, megger and energy meter with a turning disc. Drag a slider to see how each one reads.' }
    ] },
  { id: 'safety', title: 'Electrical Safety', color: '#fb7185', icon: 'fa-shield-halved', key: 'Rules and protective gear',
    blurb: 'See what arc-flash protection looks like on a real person, then learn the rules.',
    tools: [
      { title: 'Safety Rules', href: 'safety-guide.html', tag: 'Guide + quiz', icon: 'fa-shield-halved', desc: 'Safety zones, regional rules, a rule search and a safety quiz.' },
      { title: 'Safety PPE', href: 'ppe.html', tag: 'Animated 3D person', icon: 'fa-user-shield', desc: 'A lifelike worker in each NFPA 70E arc-flash category 1 to 4, with an arc-flash test and every garment explained.' },
      { title: 'Earthing', href: 'earthing.html', tag: '5 ground cut-sections', icon: 'fa-bore-hole', desc: 'Pipe, plate, strip and rod earthing plus the substation earth mat, buried in layered soil, with fault current flow and a resistance calculator.' }
    ] },
  { id: 'transmission', title: 'Transmission & Switchgear', color: '#c084fc', icon: 'fa-tower-cell', key: 'Poles, insulators, isolators and relays',
    blurb: 'How power travels from the station to your street, and how it is switched safely.',
    tools: [
      { title: 'Poles & Towers', href: 'supports.html', tag: '15 structures', icon: 'fa-tower-cell', desc: 'Wooden, steel, RCC and PCC poles and six lattice tower types, with X-ray views and the real dimensions.' },
      { title: 'Insulator', href: 'insulators.html', tag: '3D model', icon: 'fa-plug-circle-bolt', desc: 'Pin, suspension, strain, shackle, post and composite insulators with labelled parts, creepage distance and flashover ratings.' },
      { title: 'HV Isolator', href: 'isolators.html', tag: '6 working models', icon: 'fa-power-off', desc: 'Single-break, double-break, vertical-break, knee-break, pantograph and semi-pantograph isolators with an earth switch interlock.' },
      { title: 'Relays & Contactors', href: 'relays.html', tag: '5 devices', icon: 'fa-bolt-lightning', desc: 'Relay, contactor, thermal overload relay, solid-state relay and a DOL starter. Energise the coil and watch the contacts move.' },
      { title: 'Circuit Breakers', href: 'breakers.html', tag: '5 breakers', icon: 'fa-toggle-off', desc: 'MCB, MCCB, RCCB/ELCB, ACB and VCB with the trip mechanism, overload and short-circuit animations and time-current curves.' },
      { title: 'Motor Starters', href: 'starters.html', tag: '4 starters + graph', icon: 'fa-gauge-high', desc: 'Star-delta, auto-transformer, rotor-resistance and soft starters, with a starting current against time graph.' },
      { title: 'Switchyard Equipment', href: 'substation.html', tag: 'Bay walkthrough', icon: 'fa-tower-cell', desc: 'What is inside a substation bay: busbars, CTs and PTs, surge arresters and a Buchholz relay.' }
    ] },
  { id: 'power-electronics', title: 'Power Electronics', color: '#2dd4bf', icon: 'fa-wave-square', key: 'Turn AC into DC',
    blurb: 'Switching AC into DC and smoothing it out.',
    tools: [
      { title: 'Rectifier', href: 'rectifier.html', tag: 'Circuit + scope', icon: 'fa-wave-square', desc: 'Half-wave, center-tap and bridge rectifiers with C, L, LC and pi filters: current flow, oscilloscope, ripple and efficiency.' },
      { title: 'AC to DC Converters', href: 'ac-dc.html', tag: '3 converters + waveforms', icon: 'fa-plug-circle-bolt', desc: 'A bridge adaptor, an SMPS cutaway and a phone charger, with the waveform shown at every stage.' }
    ] },
  { id: 'soon', title: 'Coming next', soon: true, blurb: 'The library keeps growing. Planned:',
    items: ['AC generator (alternator)', 'Servo and stepper motor drives', 'Hobby electronics: more projects and modules'] }
];
