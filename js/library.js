/* VoltVerse library registry. To add a component: add a tool to a family below (or a new family),
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
      { title: 'DC Generator Cut-Section', href: 'dc-generator.html', tag: '3D model', icon: 'fa-bolt',
        desc: 'Yoke, pole cores, pole shoes, field windings, armature, commutator, brushes, cooling fan and sealed bearings, with cut section, exploded view and an air gap highlight.' },
      { title: '3D Induction Motor', href: 'induction-motor.html', tag: '3D model', icon: 'fa-fan',
        desc: 'A cast-iron TEFC motor cut in half: squirrel cage and slip ring constructions, exploded view and the rotating field.' }
    ] },
  { id: 'generators', title: 'Generators', accent: 'amber', icon: 'fa-bolt',
    blurb: 'Turn motion into electricity. Cut one open and see how the DC output is made.',
    tools: [
      { title: 'DC Generator Cut-Section', href: 'dc-generator.html', tag: '3D model', icon: 'fa-bolt',
        desc: 'Yoke, pole cores, pole shoes, field windings, armature, commutator, brushes, cooling fan and sealed bearings. Half-cut and exploded views, with the air gap highlighted.' }
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
  { id: 'reference', title: 'Components & Reference', accent: 'sky', icon: 'fa-shapes',
    blurb: 'Insulators, wires and the symbols you meet in every drawing.',
    tools: [
      { title: '3D Insulator Visualizer', href: 'insulators.html', tag: '3D model', icon: 'fa-plug-circle-bolt',
        desc: 'Pin, suspension, strain, shackle, post and composite insulators with annotated parts and ratings.' },
      { title: 'Wire Directory & Voltage Drop', href: 'wire-directory.html', tag: 'Calculator', icon: 'fa-bezier-curve',
        desc: 'Wire cross-sections and current ratings, plus a voltage drop calculator.' },
      { title: 'Electrical & Electronics Symbols', href: 'symbols.html', tag: 'Reference', icon: 'fa-shapes',
        desc: 'A searchable guide to the circuit symbols used in diploma courses.' }
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
