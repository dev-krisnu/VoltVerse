/* VoltVerse library registry. To add a component: add a tool to a family below (or a new family),
   then create its page (copy dc-motor.html as a starting point) and add its tab to the nav of that page. */
window.VOLTVERSE_LIBRARY = [
  { id: 'transformers', title: 'Transformers', accent: 'cyan', icon: 'fa-bolt',
    blurb: 'Step voltage up or down with no moving parts. Take one apart, then solve its numbers.',
    tools: [
      { title: '3D Transformer Explorer', href: 'transformer-explorer.html', tag: '3D model', icon: 'fa-cube',
        desc: 'Orbit 10 parts of an oil-filled power transformer, switch to cutaway view and read the formula behind each part.' },
      { title: 'Transformer Calculator', href: 'transformer-calculator.html', tag: 'Calculator', icon: 'fa-calculator',
        desc: 'Change voltage, current, turns or frequency and watch peak flux, phase lag and a live oscilloscope respond.' }
    ] },
  { id: 'motors', title: 'Motors', accent: 'amber', icon: 'fa-gears',
    blurb: 'Turn electrical energy into motion. See exactly what sits inside the casing.',
    tools: [
      { title: 'DC Motor Cut-Section Visualizer', href: 'dc-motor.html', tag: '3D model', icon: 'fa-gears',
        desc: 'Yoke, poles, armature, commutator and brushes in 3D, with a spinning rotor and the working principle of each part.' }
    ] },
  { id: 'soon', title: 'Coming next', soon: true,
    blurb: 'The library keeps growing. Planned families:',
    items: ['Generators', 'Induction motors', 'Circuit breakers', 'Relays and contactors', 'Capacitors and inductors', 'Rectifiers and inverters'] }
];
