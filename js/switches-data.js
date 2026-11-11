/* V-NODE switch registry. Add a switch here and create its page (copy switch-knife.html) to list it in the menu. */
window.VV_SWITCH_CATS = [
  { id: 'mech', title: 'Mechanism and Operation', blurb: 'How the contacts are driven: by hand, by pressure, by liquid, position or speed.' },
  { id: 'pole', title: 'Pole and Throw', blurb: 'How many circuits a switch controls and how many paths it can choose.' },
  { id: 'wiring', title: 'Wiring and Installation', blurb: 'Switches used in domestic and building wiring.' },
  { id: 'protect', title: 'Protection', blurb: 'Switching devices that also trip on faults.' }
];
window.VV_SWITCHES_SOON = [
  { name: 'ELCB / RCCB', tag: 'Earth leakage protection', sub: 'Trips in milliseconds when current leaks to earth, protecting people from shock (30 mA).' },
  { name: 'HV Isolator', tag: 'High voltage', sub: 'Off-load disconnector that gives a visible air gap on 11 kV to 765 kV lines.' },
  { name: 'HV Circuit Breaker', tag: 'SF6 / vacuum', sub: 'Breaks fault currents up to 40 kA on 33 kV to 400 kV systems.' }
];
window.VV_SWITCHES = [
 {
  "n": 1,
  "id": "knife",
  "file": "switch-knife.html",
  "name": "Knife Switch",
  "cat": "mech",
  "tag": "Manual isolation",
  "sub": "Hinged copper blade manual isolation disconnector",
  "chips": [
   "Up to 600 V",
   "30-600 A"
  ],
  "sym": "<svg viewBox=\"0 0 100 60\" class=\"w-full h-full stroke-electric-400 fill-none stroke-2\"> <circle cx=\"20\" cy=\"30\" r=\"4\"/> <circle cx=\"80\" cy=\"30\" r=\"4\"/> <path d=\"M 24 30 L 70 12\" stroke-width=\"2.5\"/> <path d=\"M 84 30 L 95 30 M 5 30 L 16 30\"/> <circle cx=\"70\" cy=\"12\" r=\"2.5\" class=\"fill-amber-400 stroke-none\"/> </svg>"
 },
 {
  "n": 2,
  "id": "toggle",
  "file": "switch-toggle.html",
  "name": "Toggle Switch",
  "cat": "mech",
  "tag": "Snap action",
  "sub": "Snap-action lever mechanism for control & power distribution",
  "chips": [
   "12 V DC - 250 V AC",
   "1-30 A"
  ],
  "sym": "<svg viewBox=\"0 0 80 50\" class=\"w-full h-full stroke-electric-400 fill-none stroke-2\"> <circle cx=\"15\" cy=\"25\" r=\"3.5\"/> <circle cx=\"65\" cy=\"25\" r=\"3.5\"/> <path d=\"M 18.5 25 L 55 10\" stroke-width=\"2\"/> <path d=\"M 35 18 L 30 5\" stroke-dasharray=\"2 2\" stroke-width=\"1.5\" class=\"stroke-slate-400\"/> <path d=\"M 0 25 L 11.5 25 M 68.5 25 L 80 25\"/> </svg>"
 },
 {
  "n": 3,
  "id": "push",
  "file": "switch-push.html",
  "name": "Push Button Switch",
  "cat": "mech",
  "tag": "Momentary",
  "sub": "Momentary contact actuator with internal helical return spring",
  "chips": [
   "3-8 N force",
   "100,000+ cycles"
  ],
  "sym": "<svg viewBox=\"0 0 80 50\" class=\"w-full h-full stroke-red-400 fill-none stroke-2\"> <circle cx=\"20\" cy=\"30\" r=\"3\"/> <circle cx=\"60\" cy=\"30\" r=\"3\"/> <path d=\"M 20 20 L 60 20\" stroke-width=\"2\"/> <path d=\"M 40 20 L 40 5\" stroke-width=\"2\"/> <path d=\"M 30 5 L 50 5\" stroke-width=\"2\"/> <path d=\"M 0 30 L 17 30 M 63 30 L 80 30\"/> </svg>"
 },
 {
  "n": 4,
  "id": "rotary",
  "file": "switch-rotary.html",
  "name": "Rotary Switch",
  "cat": "mech",
  "tag": "Multi-position",
  "sub": "Cam-operated multi-stage rotational mechanical disconnector",
  "chips": [
   "30-90 degree steps",
   "1-630 A"
  ],
  "sym": "<svg viewBox=\"0 0 100 80\" class=\"w-full h-full stroke-amber-400 fill-none stroke-2\"> <line x1=\"10\" y1=\"40\" x2=\"35\" y2=\"40\" /> <circle cx=\"35\" cy=\"40\" r=\"2.5\" class=\"fill-amber-400\" /> <line x1=\"35\" y1=\"40\" x2=\"65\" y2=\"25\" stroke-dasharray=\"2,2\" stroke-width=\"1.5\"/> <line x1=\"35\" y1=\"40\" x2=\"65\" y2=\"15\" stroke-width=\"2.5\"/> <circle cx=\"68\" cy=\"15\" r=\"2.5\" class=\"fill-amber-400\" /> <text x=\"75\" y=\"18\" class=\"text-[8px] fill-slate-300 font-mono stroke-none\">P1</text> <circle cx=\"70\" cy=\"32\" r=\"2.5\" class=\"fill-amber-400\" /> <text x=\"77\" y=\"35\" class=\"text-[8px] fill-slate-300 font-mono stroke-none\">P2</text> <circle cx=\"68\" cy=\"49\" r=\"2.5\" class=\"fill-amber-400\" /> <text x=\"75\" y=\"52\" class=\"text-[8px] fill-slate-300 font-mono stroke-none\">P3</text> <circle cx=\"60\" cy=\"64\" r=\"2.5\" class=\"fill-amber-400\" /> <text x=\"67\" y=\"67\" class=\"text-[8px] fill-slate-300 font-mono stroke-none\">P4</text> <path d=\"M 45 22 A 20 20 0 0 1 52 55\" stroke-width=\"1\" stroke-dasharray=\"2,2\" /> </svg>"
 },
 {
  "n": 5,
  "id": "float",
  "file": "switch-float.html",
  "name": "Float Switch",
  "cat": "mech",
  "tag": "Level sensing",
  "sub": "Gravity & buoyancy tilted liquid-level automatic controller",
  "chips": [
   "IP68 sealed",
   "10-16 A"
  ],
  "sym": "<svg viewBox=\"0 0 100 80\" class=\"w-full h-full stroke-amber-400 fill-none stroke-2\"> <line x1=\"15\" y1=\"40\" x2=\"35\" y2=\"40\" /> <circle cx=\"35\" cy=\"40\" r=\"2.5\" class=\"fill-amber-400\" /> <line x1=\"35\" y1=\"40\" x2=\"65\" y2=\"22\" stroke-width=\"2.5\" /> <circle cx=\"65\" cy=\"40\" r=\"2.5\" class=\"fill-amber-400\" /> <line x1=\"65\" y1=\"40\" x2=\"85\" y2=\"40\" /> <line x1=\"50\" y1=\"31\" x2=\"50\" y2=\"18\" stroke-dasharray=\"2,2\" stroke-width=\"1.5\" /> <circle cx=\"50\" cy=\"14\" r=\"6\" class=\"fill-cyan-400/20 stroke-cyan-400\" stroke-width=\"1.5\" /> <path d=\"M 40 24 Q 45 22 50 24 T 60 24\" stroke=\"#38bdf8\" stroke-width=\"1\" /> </svg>"
 },
 {
  "n": 6,
  "id": "limit",
  "file": "switch-limit.html",
  "name": "Limit Switch",
  "cat": "mech",
  "tag": "Position sensing",
  "sub": "Heavy-duty roller-lever electromechanical position interlock switch",
  "chips": [
   "IP67 sealed",
   "1 NO + 1 NC"
  ],
  "sym": "<svg viewBox=\"0 0 120 80\" class=\"w-full h-full stroke-amber-400 fill-none stroke-2\"> <line x1=\"10\" y1=\"45\" x2=\"25\" y2=\"45\" /> <circle cx=\"25\" cy=\"45\" r=\"2.5\" class=\"fill-amber-400\" /> <line x1=\"25\" y1=\"45\" x2=\"50\" y2=\"28\" stroke-width=\"2.5\" /> <polygon points=\"40,25 48,20 48,30\" class=\"fill-cyan-400 stroke-cyan-400\" /> <circle cx=\"50\" cy=\"45\" r=\"2.5\" class=\"fill-amber-400\" /> <line x1=\"50\" y1=\"45\" x2=\"65\" y2=\"45\" /> <line x1=\"70\" y1=\"15\" x2=\"70\" y2=\"65\" stroke=\"#334155\" stroke-dasharray=\"2,2\" /> <line x1=\"75\" y1=\"45\" x2=\"88\" y2=\"45\" /> <circle cx=\"88\" cy=\"45\" r=\"2.5\" class=\"fill-amber-400\" /> <line x1=\"88\" y1=\"45\" x2=\"110\" y2=\"45\" stroke-width=\"2.5\" /> <polygon points=\"98,40 106,35 106,45\" class=\"fill-cyan-400 stroke-cyan-400\" /> <circle cx=\"110\" cy=\"45\" r=\"2.5\" class=\"fill-amber-400\" /> <line x1=\"110\" y1=\"45\" x2=\"118\" y2=\"45\" /> </svg>"
 },
 {
  "n": 7,
  "id": "centrifugal",
  "file": "switch-centrifugal.html",
  "name": "Centrifugal Switch",
  "cat": "mech",
  "tag": "Speed sensing",
  "sub": "Shaft-mounted speed-sensitive automatic starter winding disconnector",
  "chips": [
   "Cut-off 75-80% Ns",
   "Normally closed"
  ],
  "sym": "<svg viewBox=\"0 0 200 100\" class=\"w-full h-full stroke-amber-400 fill-none stroke-2\"> <line x1=\"10\" y1=\"20\" x2=\"40\" y2=\"20\" /> <line x1=\"10\" y1=\"80\" x2=\"40\" y2=\"80\" /> <path d=\"M 40 20 L 70 20 Q 80 10 90 20 Q 100 30 110 20 Q 120 10 130 20 L 160 20 L 160 80 L 10 80\" stroke=\"#38bdf8\" fill=\"none\" /> <text x=\"85\" y=\"12\" fill=\"#38bdf8\" font-size=\"8\" stroke=\"none\">Main Winding</text> <line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"50\" /> <path d=\"M 40 50 L 55 50 Q 65 40 75 50 Q 85 60 95 50 L 110 50\" stroke=\"#f59e0b\" fill=\"none\" /> <text x=\"50\" y=\"42\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\">Start Winding</text> <line x1=\"110\" y1=\"42\" x2=\"110\" y2=\"58\" stroke=\"#a855f7\" /> <line x1=\"116\" y1=\"42\" x2=\"116\" y2=\"58\" stroke=\"#a855f7\" /> <line x1=\"116\" y1=\"50\" x2=\"135\" y2=\"50\" stroke=\"#f59e0b\" /> <circle cx=\"138\" cy=\"50\" r=\"2\" fill=\"#f59e0b\" /> <line x1=\"138\" y1=\"50\" x2=\"155\" y2=\"40\" stroke=\"#f59e0b\" stroke-width=\"2\" /> <path d=\"M 148 42 Q 155 42 155 35\" stroke=\"#fbbf24\" fill=\"none\" stroke-dasharray=\"1,1\" /> <circle cx=\"160\" cy=\"50\" r=\"2\" fill=\"#f59e0b\" /> <line x1=\"160\" y1=\"50\" x2=\"160\" y2=\"80\" /> <text x=\"125\" y=\"66\" fill=\"#fbbf24\" font-size=\"7\" stroke=\"none\">Centrifugal Sw.</text> </svg>"
 },
 {
  "n": 8,
  "id": "spst",
  "file": "switch-spst.html",
  "name": "SPST Switch",
  "cat": "pole",
  "tag": "1 pole, 1 throw",
  "sub": "Basic ON/OFF single circuit control switch (1 Input Pole, 1 Output Throw)",
  "chips": [
   "1 track",
   "Normally open"
  ],
  "sym": "<svg viewBox=\"0 0 200 100\" class=\"w-full h-full stroke-sky-400 fill-none stroke-2\"> <line x1=\"20\" y1=\"50\" x2=\"60\" y2=\"50\" /> <circle cx=\"60\" cy=\"50\" r=\"4\" class=\"fill-sky-400\" /> <line x1=\"60\" y1=\"50\" x2=\"135\" y2=\"25\" stroke=\"#f59e0b\" stroke-width=\"3\" /> <circle cx=\"140\" cy=\"50\" r=\"4\" class=\"fill-sky-400\" /> <line x1=\"140\" y1=\"50\" x2=\"180\" y2=\"50\" /> <text x=\"25\" y=\"40\" fill=\"#38bdf8\" font-size=\"9\" stroke=\"none\" font-family=\"monospace\">INPUT (POLE)</text> <text x=\"110\" y=\"70\" fill=\"#38bdf8\" font-size=\"9\" stroke=\"none\" font-family=\"monospace\">OUTPUT (THROW)</text> </svg>"
 },
 {
  "n": 9,
  "id": "spdt",
  "file": "switch-spdt.html",
  "name": "SPDT Switch",
  "cat": "pole",
  "tag": "Changeover",
  "sub": "Dual-path selector switch (1 Input COM Pole, 2 Output Throws: L1 / L2)",
  "chips": [
   "Break-before-make",
   "2-way control"
  ],
  "sym": "<svg viewBox=\"0 0 200 100\" class=\"w-full h-full stroke-sky-400 fill-none stroke-2\"> <line x1=\"20\" y1=\"50\" x2=\"60\" y2=\"50\" /> <circle cx=\"60\" cy=\"50\" r=\"4\" class=\"fill-amber-400 stroke-amber-400\" /> <line x1=\"60\" y1=\"50\" x2=\"135\" y2=\"25\" stroke=\"#f59e0b\" stroke-width=\"3\" /> <circle cx=\"140\" cy=\"25\" r=\"4\" class=\"fill-sky-400\" /> <line x1=\"140\" y1=\"25\" x2=\"180\" y2=\"25\" /> <circle cx=\"140\" cy=\"75\" r=\"4\" class=\"fill-emerald-400\" /> <line x1=\"140\" y1=\"75\" x2=\"180\" y2=\"75\" /> <text x=\"15\" y=\"40\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">COM</text> <text x=\"150\" y=\"20\" fill=\"#38bdf8\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">L1</text> <text x=\"150\" y=\"90\" fill=\"#34d399\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">L2</text> </svg>"
 },
 {
  "n": 10,
  "id": "dpst",
  "file": "switch-dpst.html",
  "name": "DPST Switch",
  "cat": "pole",
  "tag": "Double isolation",
  "sub": "Dual-circuit master isolator (Switches Live & Neutral simultaneously)",
  "chips": [
   "2 NO contacts",
   "Live + neutral"
  ],
  "sym": "<svg viewBox=\"0 0 200 100\" class=\"w-full h-full stroke-amber-400 fill-none stroke-2\"> <line x1=\"20\" y1=\"30\" x2=\"60\" y2=\"30\" stroke=\"#f59e0b\" /> <circle cx=\"60\" cy=\"30\" r=\"4\" class=\"fill-amber-400 stroke-amber-400\" /> <line x1=\"60\" y1=\"30\" x2=\"135\" y2=\"15\" stroke=\"#f59e0b\" stroke-width=\"2.5\" /> <circle cx=\"140\" cy=\"30\" r=\"4\" class=\"fill-amber-400\" /> <line x1=\"140\" y1=\"30\" x2=\"180\" y2=\"30\" stroke=\"#f59e0b\" /> <line x1=\"95\" y1=\"22\" x2=\"95\" y2=\"62\" stroke=\"#94a3b8\" stroke-dasharray=\"3 3\" stroke-width=\"1.5\" /> <line x1=\"20\" y1=\"70\" x2=\"60\" y2=\"70\" stroke=\"#38bdf8\" /> <circle cx=\"60\" cy=\"70\" r=\"4\" class=\"fill-sky-400 stroke-sky-400\" /> <line x1=\"60\" y1=\"70\" x2=\"135\" y2=\"55\" stroke=\"#38bdf8\" stroke-width=\"2.5\" /> <circle cx=\"140\" cy=\"70\" r=\"4\" class=\"fill-sky-400\" /> <line x1=\"140\" y1=\"70\" x2=\"180\" y2=\"70\" stroke=\"#38bdf8\" /> <text x=\"15\" y=\"22\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">LINE (L)</text> <text x=\"15\" y=\"88\" fill=\"#38bdf8\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">NEUTRAL (N)</text> <text x=\"145\" y=\"22\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">LOAD L</text> <text x=\"145\" y=\"88\" fill=\"#38bdf8\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">LOAD N</text> </svg>"
 },
 {
  "n": 11,
  "id": "dpdt",
  "file": "switch-dpdt.html",
  "name": "DPDT Switch",
  "cat": "pole",
  "tag": "Reversing",
  "sub": "6-Terminal Dual Line Reversing & Routing Switch",
  "chips": [
   "6 terminals",
   "ON-ON / ON-OFF-ON"
  ],
  "sym": "<svg viewBox=\"0 0 220 110\" class=\"w-full h-full stroke-amber-400 fill-none stroke-2\"> <text x=\"10\" y=\"32\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">COM 1</text> <circle cx=\"50\" cy=\"30\" r=\"4\" class=\"fill-amber-400 stroke-amber-400\" /> <line x1=\"50\" y1=\"30\" x2=\"110\" y2=\"18\" stroke=\"#f59e0b\" stroke-width=\"2.5\" /> <circle cx=\"120\" cy=\"15\" r=\"4\" class=\"fill-sky-400\" /> <text x=\"130\" y=\"18\" fill=\"#38bdf8\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">Throw 1A</text> <circle cx=\"120\" cy=\"45\" r=\"4\" class=\"fill-slate-500\" /> <text x=\"130\" y=\"48\" fill=\"#94a3b8\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">Throw 1B</text> <line x1=\"80\" y1=\"24\" x2=\"80\" y2=\"74\" stroke=\"#94a3b8\" stroke-dasharray=\"3 3\" stroke-width=\"1.5\" /> <text x=\"10\" y=\"82\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">COM 2</text> <circle cx=\"50\" cy=\"80\" r=\"4\" class=\"fill-amber-400 stroke-amber-400\" /> <line x1=\"50\" y1=\"80\" x2=\"110\" y2=\"68\" stroke=\"#f59e0b\" stroke-width=\"2.5\" /> <circle cx=\"120\" cy=\"65\" r=\"4\" class=\"fill-sky-400\" /> <text x=\"130\" y=\"68\" fill=\"#38bdf8\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">Throw 2A</text> <circle cx=\"120\" cy=\"95\" r=\"4\" class=\"fill-slate-500\" /> <text x=\"130\" y=\"98\" fill=\"#94a3b8\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">Throw 2B</text> </svg>"
 },
 {
  "n": 12,
  "id": "flush",
  "file": "switch-flush.html",
  "name": "Surface & Flush Switch",
  "cat": "wiring",
  "tag": "Wall wiring",
  "sub": "Domestic Wall Wiring & Modular Box Switches (6A/16A, 240V AC)",
  "chips": [
   "6 A / 16 A, 240 V",
   "Polycarbonate body"
  ],
  "sym": "<svg viewBox=\"0 0 200 100\" class=\"w-full h-full stroke-sky-400 fill-none stroke-2\"> <line x1=\"20\" y1=\"50\" x2=\"70\" y2=\"50\" stroke=\"#f59e0b\" stroke-width=\"2.5\" /> <text x=\"15\" y=\"40\" fill=\"#f59e0b\" font-size=\"9\" stroke=\"none\" font-family=\"monospace\">Phase (L)</text> <circle cx=\"70\" cy=\"50\" r=\"4\" class=\"fill-sky-400\" /> <line x1=\"70\" y1=\"50\" x2=\"125\" y2=\"28\" stroke=\"#38bdf8\" stroke-width=\"2.5\" /> <circle cx=\"130\" cy=\"50\" r=\"4\" class=\"fill-sky-400\" /> <line x1=\"130\" y1=\"50\" x2=\"180\" y2=\"50\" stroke=\"#10b981\" stroke-width=\"2.5\" /> <text x=\"135\" y=\"40\" fill=\"#10b981\" font-size=\"9\" stroke=\"none\" font-family=\"monospace\">Load Out</text> </svg>"
 },
 {
  "n": 13,
  "id": "intermediate",
  "file": "switch-intermediate.html",
  "name": "Intermediate Switch",
  "cat": "wiring",
  "tag": "3+ way control",
  "sub": "4-Terminal Crossover Switch for Multi-Way (3+ Location) Lighting",
  "chips": [
   "4 terminals",
   "Crossover (DPDT)"
  ],
  "sym": "<svg viewBox=\"0 0 200 100\" class=\"w-full h-full stroke-sky-400 fill-none stroke-2\"> <circle cx=\"40\" cy=\"30\" r=\"4\" class=\"fill-amber-400\" /> <circle cx=\"40\" cy=\"70\" r=\"4\" class=\"fill-amber-400\" /> <circle cx=\"160\" cy=\"30\" r=\"4\" class=\"fill-emerald-400\" /> <circle cx=\"160\" cy=\"70\" r=\"4\" class=\"fill-emerald-400\" /> <text x=\"25\" y=\"33\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">L1</text> <text x=\"25\" y=\"73\" fill=\"#f59e0b\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">L2</text> <text x=\"170\" y=\"33\" fill=\"#10b981\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">L3</text> <text x=\"170\" y=\"73\" fill=\"#10b981\" font-size=\"8\" stroke=\"none\" font-family=\"monospace\">L4</text> <line x1=\"40\" y1=\"30\" x2=\"160\" y2=\"30\" stroke=\"#38bdf8\" stroke-width=\"2\" /> <line x1=\"40\" y1=\"70\" x2=\"160\" y2=\"70\" stroke=\"#38bdf8\" stroke-width=\"2\" /> <line x1=\"40\" y1=\"30\" x2=\"160\" y2=\"70\" stroke=\"#94a3b8\" stroke-width=\"1.5\" stroke-dasharray=\"4\" /> <line x1=\"40\" y1=\"70\" x2=\"160\" y2=\"30\" stroke=\"#94a3b8\" stroke-width=\"1.5\" stroke-dasharray=\"4\" /> </svg>"
 },
 {
  "n": 14,
  "id": "mcb",
  "file": "switch-mcb.html",
  "name": "MCB",
  "cat": "protect",
  "tag": "Overcurrent protection",
  "sub": "Single-Pole Magnetothermal Overload & Short-Circuit Protection Device",
  "chips": [
   "230 / 415 V AC",
   "6-10 kA breaking"
  ],
  "sym": "<svg viewBox=\"0 0 200 100\" class=\"w-full h-full stroke-sky-400 fill-none stroke-2\"> <line x1=\"20\" y1=\"50\" x2=\"60\" y2=\"50\" stroke=\"#94a3b8\" /> <line x1=\"140\" y1=\"50\" x2=\"180\" y2=\"50\" stroke=\"#94a3b8\" /> <circle cx=\"60\" cy=\"50\" r=\"3\" class=\"fill-sky-400\" /> <circle cx=\"140\" cy=\"50\" r=\"3\" class=\"fill-sky-400\" /> <line x1=\"60\" y1=\"50\" x2=\"135\" y2=\"30\" stroke=\"#38bdf8\" stroke-width=\"2.5\" /> <path d=\"M 85 50 L 85 70 L 95 70 L 95 50\" stroke=\"#f59e0b\" stroke-width=\"1.5\" /> <rect x=\"105\" y=\"60\" width=\"16\" height=\"15\" rx=\"2\" stroke=\"#ef4444\" stroke-width=\"1.5\" /> <line x1=\"113\" y1=\"35\" x2=\"113\" y2=\"60\" stroke=\"#ef4444\" stroke-dasharray=\"2,2\" stroke-width=\"1\" /> <text x=\"75\" y=\"85\" fill=\"#f59e0b\" font-size=\"7\" stroke=\"none\" font-family=\"monospace\">Thermal</text> <text x=\"105\" y=\"85\" fill=\"#ef4444\" font-size=\"7\" stroke=\"none\" font-family=\"monospace\">Magnetic</text> </svg>"
 }
];
