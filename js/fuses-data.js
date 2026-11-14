/* Fuses. Standards: IEC 60269 (industrial), BS 3036 (rewirable), ISO 8820 (blade), IEC 60127 (miniature). Curves are typical bands. */
(function () {
  var tc = window.TCCHART.tc;
  var ACT = function (m) { return m === 'sc' ? { on: 'Apply short-circuit', off: 'Replace fuse', idleText: 'Carrying normal current', onText: 'Fault building…', offText: 'Fitting a new fuse…', doneText: 'Blown in milliseconds' } : { on: 'Apply overload (2×)', off: 'Replace fuse', idleText: 'Carrying normal current', onText: 'Element heating…', offText: 'Fitting a new fuse…', doneText: 'Blown by overload' }; };
  var MODES = [['ol', 'Overload'], ['sc', 'Short-circuit']];
  function sp(m) { return m === 'sc' ? .8 : .13; }
  window.CAT = {
    kind: 'x', fit: 1.1, order: ['hrc', 'rewire', 'blade', 'glass'], prosTitle: 'Where it is used', rowsTitle: 'Specifications', dir: [.5, .4, 1], viewer: { pos: [5, 5, 11], target: [0, 1, 0], size: 40 }, modesTitle: 'Choose a fault',
    models: {
      hrc: { title: 'HRC cartridge fuse', short: 'HRC cartridge', std: 'IEC 60269 · gG, 63 A, 500 V', modes: MODES, act: ACT, speed: sp, linear: true,
        desc: 'The industrial fuse. A silver element in a sealed ceramic tube filled with quartz sand. It can break a fault current of 120 kA safely, without any flame or noise outside.',
        rating: [['Breaking', '80 to 120 kA'], ['Current', '2 to 1250 A'], ['Voltage', '400 to 690 V']],
        principle: 'The element is a thin silver ribbon with narrow notches. The notches are the weak points, so they carry the most current density and melt first. In a short-circuit all notches melt together in less than a millisecond, and the ribbon is cut in many places in series. Many short arcs are formed. The quartz sand absorbs the heat of each arc, and the sand melts into glass (fulgurite), which seals the gap. The current is forced to zero before it has reached its peak. This is called current limiting. In an overload the fuse acts slowly, as a small area of the element heats up and melts. The striker pin pops out to show it has blown or to trip a switch.',
        pros: ['Motor feeders and distribution boards (gG, aM)', 'Protection of semiconductors and drives (gR)', 'Main service fuse of a building'],
        rows: [['gG', 'General purpose: cables and loads'], ['aM', 'Motor circuits: backs up an overload relay'], ['gR / aR', 'Fast: semiconductors'], ['Sizes', 'Cylindrical (10×38), NH (blade) 00 to 4'], ['Current limiting', 'Cuts the fault before the peak'], ['Indicator', 'Striker or colour flag']],
        facts: ['A blown HRC fuse is replaced as a whole. It cannot be repaired.', 'Always change all three fuses of a three-phase set, so they age together.'],
        chart: tc({ hi: [[1.6, 3600], [2, 400], [3, 40], [5, 6], [10, .15], [20, .02], [100, .01]], lo: [[1.25, 3600], [1.6, 600], [2, 80], [3, 10], [5, 1.2], [10, .04], [20, .006], [100, .002]], nt: 1.25, ol: 2, sc: 20, xt: 'current ÷ rated', note: 'Typical gG melting band: it takes about one hour at 1.6 × In and well under a millisecond at 20 × In.' }),
        parts: { body: 'Ceramic body. It can stand the heat and pressure of an arc.', sand: 'Quartz sand. It cools and squeezes the arc.', caps: 'Brass end caps (or blades).', el: 'Silver element with notches. The notches melt first.', striker: 'Striker pin: it pops out when the fuse blows.' } },
      rewire: { title: 'Rewirable (kitkat) fuse', short: 'Rewirable', std: 'BS 3036 / IS 2086 · 15 A', modes: MODES, act: ACT, speed: sp, linear: true,
        desc: 'The old home fuse. A porcelain carrier holds a thin wire of tinned copper. When the wire melts, you pull the carrier out, fit new wire and push it back.',
        rating: [['Breaking', '1 to 4 kA'], ['Current', '5 to 100 A'], ['Fusing factor', '≈ 1.4 to 2']],
        principle: 'The fuse wire is the weakest part of the circuit. Its heat input is I²R and it loses heat to the terminals and air. At the rated current, the two balance. When the current is higher, the wire heats up until it melts at about 230 °C (tin). Because the wire has no sand and no seal, the arc stays in the open air, and the fuse is slow and cannot interrupt a big fault current. The ratio of the current that melts the wire to the rated current is called the fusing factor, and for a rewirable fuse it is quite high (about 1.5 to 2), so the protection is not close.',
        pros: ['Old domestic and small commercial fuse boards', 'Low-cost protection where the fault level is small', 'Some meter cut-outs and bell circuits'],
        rows: [['Wire', 'Tinned copper, size marked on the carrier'], ['Fusing factor', 'About 1.5 to 2'], ['Carrier', 'Porcelain or bakelite'], ['Colour code', 'Carrier is colour-marked for rating'], ['Drawback', 'Low breaking capacity and easy to misuse']],
        facts: ['Never use a thicker wire, nail, or foil. A fuse that does not blow can start a fire.', 'Switch off and isolate before you take out the carrier.'],
        chart: tc({ hi: [[1.5, 7200], [2, 3600], [3, 300], [5, 40], [10, 2], [100, .2]], lo: [[1.5, 3600], [2, 200], [3, 40], [5, 6], [10, .3], [100, .05]], nt: 1.4, ol: 2.5, sc: 15, note: 'Typical rewirable band: slow and wide, so it protects less closely than an HRC fuse.' }),
        parts: { base: 'Porcelain base with the supply terminals.', carrier: 'Removable carrier with a handle.', tms: 'Terminals with screws that clamp the wire.', wire: 'The fuse wire.' } },
      blade: { title: 'Blade fuse (automotive)', short: 'Blade', std: 'ISO 8820 · ATO / ATC, 10 A, 32 V', modes: MODES, act: ACT, speed: sp, linear: true,
        desc: 'The fuse in a car. Two metal blades and a zinc strip inside a transparent plastic body. The colour of the body gives the rating.',
        rating: [['Voltage', '32 V DC'], ['Current', '2 to 40 A'], ['Breaking', '1 kA']],
        principle: 'A narrow zinc strip joins the two blades. Normal current heats it a little. An overload heats it until it melts at the thin bridge in the middle, and the break appears as a gap that you can see through the clear window. The fuse is fast because the strip has a very small mass. Colours follow the standard: 5 A tan, 7.5 A brown, 10 A red, 15 A blue, 20 A yellow, 25 A clear, 30 A green. Mini, standard and maxi sizes share the same system.',
        pros: ['Cars, bikes, boats and trucks (12 V and 24 V)', 'Solar and battery systems on low voltage', 'DIY and automotive fuse boxes'],
        rows: [['Colours', '5 A tan · 10 A red · 15 A blue · 20 A yellow · 30 A green'], ['Sizes', 'Micro, mini, standard (ATO), maxi'], ['Fuse puller', 'Use the plastic tool in the fuse box'], ['Check', 'Look through the window for a broken strip'], ['Rule', 'Replace only with the same rating']],
        facts: ['A fuse that keeps blowing means a fault. A bigger fuse is not a cure.', 'These are DC fuses rated at 32 V. Do not use them on mains.'],
        chart: tc({ hi: [[1.35, 1800], [2, 5], [3.5, .5], [6, .1], [10, .04], [100, .02]], lo: [[1.1, 3600], [1.35, 100], [2, .15], [3.5, .04], [6, .02], [10, .01], [100, .004]], nt: 1.1, ol: 2, sc: 10, note: 'Typical fast-acting blade fuse band.' }),
        parts: { body: 'Transparent plastic body. The colour shows the current rating.', blades: 'The metal blades that plug into the fuse box.', el: 'Zinc element between the blades. The thin bridge melts.' } },
      glass: { title: 'Glass fuse (5×20 mm)', short: 'Glass tube', std: 'IEC 60127 · F2A L 250 V', modes: MODES, act: ACT, speed: sp, linear: true,
        desc: 'A thin wire inside a glass tube. It protects equipment such as meters, amplifiers and small power supplies, and you can see by eye whether it has blown.',
        rating: [['Sizes', '5×20 mm and 6.3×32 mm'], ['Current', '32 mA to 20 A'], ['Breaking', '35 A to 1.5 kA']],
        principle: 'The wire is a short length of silver-plated copper or a similar alloy. When it melts, the wire vaporises and the vapour can condense on the glass, which turns black after a big fault. Fast-blow (F) fuses react quickly and are used with sensitive electronics. Slow-blow (T, time-delay) fuses use a thicker wire, often with a spring or a lump of solder, so that they can tolerate a switch-on surge, for example of a transformer or motor. Glass ones have a low breaking capacity, so on a high-energy supply, a ceramic type (with the H marking) should be used instead.',
        pros: ['Multimeters, audio amplifiers and bench supplies', 'Plug-in equipment with a small transformer', 'Fuse holders and panel-mount fuses'],
        rows: [['F', 'Fast-acting'], ['T', 'Time-delay (slow-blow)'], ['L / H', 'Low or high breaking capacity (glass = L)'], ['Ceramic', 'Sand-filled types have a higher rating'], ['Black glass', 'Short-circuit blow'], ['Smoky glass', 'Overload']],
        facts: ['A multimeter 10 A range often has a high-breaking-capacity ceramic fuse for safety. Do not replace it with glass.', 'Replace with the same size, current, type and voltage rating.'],
        chart: tc({ hi: [[1.5, 3600], [2, 5], [2.75, .5], [4, .05], [10, .02], [100, .01]], lo: [[1.1, 3600], [1.5, 60], [2, .2], [2.75, .01], [10, .003], [100, .002]], nt: 1.1, ol: 2, sc: 12, note: 'Typical fast-blow (F) glass fuse band. Slow-blow (T) is much slower in the overload region.' }),
        parts: { tube: 'Glass tube. You can see whether the wire is intact.', caps: 'Metal end caps.', el: 'Thin fuse wire.' } }
    }
  };
})();
