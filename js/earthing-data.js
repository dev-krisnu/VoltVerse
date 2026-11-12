/* Earthing content: from the Experiment 7 (Syl 10) notes, extended with typical IS 3043 / IEEE 80 teaching values. */
(function () {
  var SOILS = [['Wet organic soil / marsh', 10], ['Moist clay', 40], ['Loam / garden soil', 100], ['Sand (damp)', 300], ['Gravel / stony', 600], ['Dry sand / rock', 2000]];
  window.CAT = {
    order: ['pipe', 'plate', 'strip', 'rod', 'mat'],
    principleTitle: 'How it works', prosTitle: 'Best used where', rowsTitle: 'Dimensions',
    act: { on: 'Show fault current', off: 'Hide current', idleText: 'Healthy · no fault', onText: 'Fault current…', offText: 'Clearing…', doneText: 'Fault current to earth' },
    fit: 1.0, dir: [.25, .12, 1], viewer: { pos: [2, 0, 8], target: [0, -1.4, 0], ground: false, grid: false, size: 30, min: 1.5, max: 40, fog: .012, maxPolar: Math.PI / 2 - .01 },
    generic: { soil: 'Layers from the top: topsoil, loam/clay, sand and rock. The blue band is the water table. Moist clay and loam below it conduct best, and dry sand or rock conduct worst.', eq: 'The metal body of the equipment. If a live wire touches it, the earth conductor carries the fault current to the ground and the fuse or breaker trips.', lead: 'The earth conductor joins the equipment body to the electrode. It must be thick, short and green or green/yellow.' },
    models: {
      pipe: { title: 'Pipe earthing', short: 'Pipe', std: 'Most common · IS 3043',
        desc: 'A galvanised iron pipe is placed upright in a bored hole. The hole is filled with layers of charcoal and salt. A funnel at the top lets you pour water in.',
        rating: [['Pipe', '40 mm GI'], ['Length', '2.5 m'], ['Chamber', '30 × 30 × 30 cm']],
        principle: 'The pipe is drilled with holes along its length. Water poured into the funnel goes through the holes and soaks the charcoal and salt. The salt dissolves, and the wet charcoal keeps the soil around the pipe moist and conductive all year round. Fault current leaves the pipe through its whole surface and spreads out in the soil.',
        pros: ['Houses, small factories and workshops with moist soil', 'Places where you can pour water into the pit regularly', 'Where soil depth allows a 2.5 m pipe'],
        rows: [['Pipe', 'GI, 40 mm dia., 2.5 m long'], ['Top of pipe', 'Not less than 20 cm below ground level'], ['Chamber', 'Not less than 30 × 30 × 30 cm, with cover'], ['Fill', 'Alternate layers of charcoal and salt'], ['Earth wire', '8 SWG for high tension connections'], ['Water', 'Poured in through the funnel (every few weeks in summer)']],
        facts: ['Charcoal holds moisture. Salt lowers the resistance of the soil around the pipe.', 'Too much salt eats the pipe, so use the layers and not a heap.'],
        parts: { cover: 'The cast-iron cover sits on a concrete chamber so you can reach the funnel and test the joint.', funnel: 'A funnel with a wire mesh stops stones going in when you add water.', pipe: 'The GI pipe, with 12 mm holes along the lower length so water seeps out into the fill.', fill: 'Alternate layers of charcoal (about 150 mm) and salt (about 75 mm).', lead: 'GI strip or wire joined to the pipe with GI nuts, bolts and washers.' } },
      plate: { title: 'Plate earthing', short: 'Plate', std: 'Deep installations · IS 3043',
        desc: 'A flat copper or GI plate is buried upright, deep down in the ground, with a watering pipe running up to a chamber at the top.',
        rating: [['Plate', '60 × 60 cm'], ['Depth', '≥ 3 m'], ['Material', 'Cu or GI']],
        principle: 'A plate has a very large surface for its size, so it can pass a lot of current to the soil. It is buried deep (3 m or more) where the soil stays damp all year, and it is surrounded by charcoal and salt like the pipe. The watering pipe on top lets you add water without digging.',
        pros: ['Substations, power stations and large buildings', 'Where a high fault current has to be carried', 'Places with a deep, damp soil layer'],
        rows: [['Plate', 'Galvanised copper or iron'], ['Typical size', 'Cu 60 × 60 cm × 3.15 mm, GI 60 × 60 cm × 6.3 mm'], ['Depth', 'Not less than 3 m from ground level'], ['Position', 'Buried vertically'], ['Fill', 'Charcoal and salt around the plate'], ['Watering pipe', '19 mm GI with funnel']],
        facts: ['Plate and pipe earths are similar, but the plate carries more current for the same pit.', 'Digging 3 m is expensive, so plates are used only where needed.'],
        parts: { plate: 'The earth electrode. It is bolted to the earth conductor with GI nuts and bolts.', fill: 'Charcoal and salt layers keep the soil around the plate damp and conductive.', pipe: 'A 19 mm GI pipe. Water poured at the top flows down to the plate.', funnel: 'Funnel at the top of the watering pipe.', cover: 'Chamber and CI cover for access.' } },
      strip: { title: 'Strip (or wire) earthing', short: 'Strip', std: 'Rocky ground · IS 3043',
        desc: 'A long flat strip of copper or steel is laid in a shallow trench. It is used where the soil is thin or rocky and a deep electrode cannot be driven.',
        rating: [['Cu strip', '25 × 4 mm'], ['Depth', '≥ 0.5 m'], ['Length', '≥ 15 m']],
        principle: 'When rock is close to the surface you cannot go down, so you go sideways. The strip is laid flat and long in a trench filled with fine soil, and a long length gives a large contact area with the ground. The strip is a good choice for overhead line towers, where it can be laid in a star from the tower foot.',
        pros: ['Rocky or hilly ground', 'Transmission line tower footings', 'Where the water table is deep'],
        rows: [['Copper strip', 'Not less than 25 × 4 mm'], ['GI / steel strip', 'Not less than 25 × 1.6 mm; heavier (about 3 mm) strip is preferred'], ['Depth', 'Not less than 0.5 m'], ['Length buried', 'Not less than 15 m'], ['Backfill', 'Fine soil, optionally with salt']],
        facts: ['The model shows 6 m for clarity. A real strip is at least 15 m long.', 'Joints are bolted or brazed, never just twisted.'],
        parts: { strip: 'The copper strip, laid flat in the trench.', trench: 'The trench is filled with fine soil, free from stones that could damage the strip.', salt: 'A bed of salt under the strip keeps the soil damp.', joint: 'Bolted or brazed joint between the earth conductor and the strip.', pit: 'Inspection pit at the end so that the joint can be tested.' } },
      rod: { title: 'Rod earthing', short: 'Rod', std: 'Modern standard · IEC 62561',
        desc: 'A long metal rod is driven straight into the ground. Rods can be joined end to end with couplers to reach damp soil far below the surface.',
        rating: [['Rod', '14 to 20 mm'], ['Length', '1.2 to 3 m'], ['Type', 'Cu / CuBond / SS']],
        principle: 'A driven rod reaches the lower soil layers, which stay moist and are less affected by seasons. If one rod does not give a low enough resistance, drive more rods at least two rod-lengths apart and connect them in parallel. Their resistances combine like parallel resistors.',
        pros: ['Homes, shops and telecom sites', 'Sandy or loose soil that is easy to drive into', 'Where a quick, low-cost earth is wanted'],
        rows: [['Solid copper rod', 'Best conductivity, resists corrosion'], ['Copper-bonded rod', 'Steel core for strength, copper outside'], ['Stainless steel rod', 'Used where corrosion is severe'], ['Typical size', '14.2 mm × 1.2 to 3 m'], ['Coupler', 'Threaded brass sleeve joins sections'], ['Spacing', 'At least 2 × rod length for multiple rods']],
        facts: ['Rods are also called ground rods in North America.', 'Doubling the length lowers resistance much more than doubling the thickness.'],
        parts: { rod: 'Two 1.2 m sections joined to make a 2.4 m rod, with a pointed tip for driving.', coupler: 'The threaded coupler joins two rod sections without a weak spot.', clamp: 'A copper clamp joins the earth conductor to the rod.', cover: 'Inspection pit with cover for testing the joint.' } },
      mat: { title: 'Earth mat (grid)', short: 'Earth mat', std: 'Substations · IEEE 80',
        desc: 'A grid of copper conductors buried across the whole substation yard, with rods at the corners. Every piece of equipment and the fence is bonded to it.',
        rating: [['Depth', '0.3 to 0.6 m'], ['Mesh', '3 to 10 m'], ['Resistance', '< 1 Ω']],
        principle: 'In a big fault the ground itself carries thousands of amperes and its surface is at a different voltage from point to point. The grid ties everything to the same voltage, so a person standing in the yard has almost no voltage between hands and feet (touch voltage) or between feet (step voltage).',
        pros: ['Power stations and substations', 'Large industrial plants', 'Any place where a person could touch equipment during a fault'],
        rows: [['Conductors', 'Bare copper or steel, bonded at every crossing'], ['Rods', 'At corners and at equipment'], ['Fence', 'Bonded to the grid'], ['Surface', 'A layer of gravel raises the safe touch voltage']],
        facts: ['Step voltage is the voltage across your two feet. Touch voltage is across your hand and your feet.', 'The grid is designed from the largest fault current and the soil resistivity.'],
        parts: { grid: 'Bare copper conductors laid in a grid.', rods: 'Driven rods reach the lower, damp soil.', joints: 'Every crossing is bolted or welded.', tr: 'The transformer tank is bonded to the grid.', fence: 'The fence is bonded too, so touching it is safe.', bond: 'Thick bonding conductor from equipment to the grid.' } }
    },
    extra: function () {
      return '<h3>Check the resistance</h3><div class="ea-calc"><label>Soil<select id="ea-soil">' + SOILS.map(function (s) { return '<option value="' + s[1] + '">' + s[0] + ' · ' + s[1] + ' Ω·m</option>'; }).join('') + '</select></label>' +
        '<label>Rod or pipe length (m)<input id="ea-L" type="number" value="2.5" min="0.5" max="12" step="0.1"></label><label>Diameter (mm)<input id="ea-d" type="number" value="40" min="8" max="100" step="1"></label><label>Electrodes in parallel<input id="ea-n" type="number" value="1" min="1" max="10" step="1"></label>' +
        '<div class="ea-out"><small>Resistance</small><b id="ea-R">—</b><span id="ea-v"></span></div></div><p style="font-size:12px;color:#7d90a8">R = ρ / (2πL) × (ln(8L/d) − 1) for one vertical rod or pipe. Parallel electrodes are assumed to be spaced at least twice their length apart.</p>' +
        '<h3>Aim of earthing</h3><ul><li>Keep touch and step voltage low during a fault, so no one gets a lethal shock.</li><li>Protect equipment from voltage spikes and keep the neutral steady when the load is unbalanced.</li><li>Give the fault current an easy path so that fuses and breakers trip at once.</li><li>Lead lightning surges safely into the ground and away from electronics.</li></ul>' +
        '<h3>What is earthing?</h3><p>If a live wire touches a metal case, the case becomes live and current can pass through you. Earthing joins that case to the ground by a path of very low resistance, so that the fault current takes that path and the protective device switches off the supply. It also connects the electrical system to the general mass of earth, so that lightning or surge energy is discharged.</p>' +
        '<h3>Resistance limits</h3><div class="vk-xwrap"><table class="cat-grid"><thead><tr><th>Installation</th><th>Earth resistance</th></tr></thead><tbody><tr><td>Power stations</td><td>below 1 Ω</td></tr><tr><td>Industrial plants</td><td>below 5 Ω</td></tr><tr><td>Domestic wiring</td><td>below 8 Ω</td></tr><tr><td>Earth continuity conductor</td><td>below 1 Ω</td></tr></tbody></table></div>' +
        '<p><b style="color:#fff">Low resistance</b> means the earthing is effective and the breakers trip fast. <b style="color:#fff">High resistance</b> means shock risk, damaged equipment and breakers that may not trip.</p>';
    },
    afterRender: function (id, el) {
      var $ = function (i) { return el.querySelector('#' + i); }; if (!$('ea-L')) return;
      function go() { var rho = +$('ea-soil').value, L = Math.max(.3, +$('ea-L').value), d = Math.max(5, +$('ea-d').value) / 1000, n = Math.max(1, Math.round(+$('ea-n').value)), r = rho / (2 * Math.PI * L) * (Math.log(8 * L / d) - 1) / n; $('ea-R').textContent = r.toFixed(1) + ' Ω'; $('ea-v').textContent = r <= 5 ? 'Good for industrial and domestic use' : r <= 8 ? 'Acceptable for domestic wiring only' : 'Too high: lengthen it or add electrodes'; $('ea-v').style.color = r <= 5 ? '#34d399' : r <= 8 ? '#facc15' : '#fb7185'; }
      el.addEventListener('input', function (e) { if (e.target.closest('.ea-calc')) go(); }); go();
    }
  };
})();
