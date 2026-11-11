/* Isolator content. Ratings follow IEC 62271-102; figures are typical catalogue values for teaching. */
window.VKI = window.VKI || {};
VKI.order = ['single', 'double', 'vertical', 'knee', 'pantograph', 'semi'];
VKI.steps = [
  ['Trip the circuit breaker', 'An isolator cannot break load current. The breaker must open first.'],
  ['Operate the isolator', 'Open it with the motor drive or the hand crank.'],
  ['Check the visible gap', 'Look for a clear air gap between contacts. This is what makes isolation safe.'],
  ['Close the earth switch', 'Earth the line side to discharge any trapped charge before work starts.']
];
VKI.generic = {
  posts: ['Post insulators', 'Tall porcelain columns that hold the live parts away from the earthed stand. Their ribs (sheds) lengthen the leakage path across the surface, so rain and dirt do not cause a flashover.'],
  contacts: ['Contacts', 'Silver-plated fingers grip the mating pin or blade with spring pressure. Good contact keeps resistance, and so heating, very low at full load current.'],
  blades: ['Blade and arms', 'Aluminium tubes carry the main current. They are light and stiff, and they swing to open or close the gap.'],
  drive: ['Operating mechanism', 'A motor (or hand crank) turns a vertical pipe. Linkages and rods turn that into the right movement for every phase together, so all three open at the same time.'],
  earth: ['Earth switch', 'A hinged blade that connects the line side to earth after isolation. It is interlocked: it cannot close while the isolator is closed, and the isolator cannot close while it is earthed.'],
  base: ['Support stand', 'A galvanised steel frame that lifts the live parts to a safe height above ground and carries the loads from wind and short-circuit forces.']
};
VKI.models = {
  single: { title: 'Single-break (centre-break)', sub: '132 - 400 kV', std: 'IEC 62271-102', cols: ['132 kV', '220 kV', '400 kV'],
    desc: 'Each phase has two rotating post insulators. Both turn 90 degrees in opposite directions, swinging their contact arms away from each other. That leaves one clear air gap in the middle of the bay.',
    principle: 'The two columns rotate together through a linkage rod. One arm carries a female tulip contact and the other a male pin. Counter-rotation means each arm only needs a quarter turn, so opening is quick and the gap is easy to see.',
    pros: ['Only two posts per phase, so less weight and footprint than a double-break design', 'Quick, short arm movement', 'One clear gap in the centre that crews can inspect'],
    rows: [['Rated voltage', '145 kV', '245 kV', '420 kV'], ['Rated current', '1600 - 2500 A', '2500 - 3150 A', '3150 - 4000 A'], ['Short-time withstand', '40 kA / 3 s', '50 kA / 3 s', '63 kA / 3 s'], ['Impulse withstand (BIL)', '650 kV', '1050 kV', '1425 kV'], ['Mechanical endurance', 'M2 (10,000 ops)', 'M2', 'M2'], ['Insulation', 'Air break', 'Air break', 'Air break']],
    parts: { posts: 'Two rotating porcelain columns per phase. Each carries a bearing head and a terminal pad.', contacts: 'A tulip (female) on one arm and a pin (male) on the other meet at the centre of the span.', blades: 'Two aluminium arms of equal length. They swing out sideways when the posts turn.', drive: 'A crank at the foot of each post and a link rod make the two posts turn in opposite directions together.' } },
  double: { title: 'Double-break (centre-rotating)', sub: '132 - 400 kV', std: 'IEC 62271-102', cols: ['132 kV', '220 kV', '400 kV'],
    desc: 'Three posts per phase. The middle post rotates a long blade through 90 degrees. The blade breaks the circuit at both ends, which gives two gaps in series.',
    principle: 'The fixed end posts carry tulip contacts. The centre post turns the blade out of line with them. Two gaps in series share the voltage, so the clearance needed at each gap is smaller and the blade only sweeps a short arc.',
    pros: ['Two breaks in series give high dielectric strength', 'Blade is one stiff piece and the drive is simple', 'Works well in narrow bays with low phase spacing'],
    rows: [['Rated voltage', '145 kV', '245 kV', '420 kV'], ['Rated current', '1250 - 2500 A', '2500 - 3150 A', '3150 - 4000 A'], ['Short-time withstand', '40 kA / 3 s', '50 kA / 3 s', '63 kA / 3 s'], ['Impulse withstand (BIL)', '650 kV', '1050 kV', '1425 kV'], ['Mechanical endurance', 'M1 / M2', 'M2', 'M2'], ['Gaps in series', '2', '2', '2']],
    parts: { posts: 'Two fixed end posts and one rotating centre post per phase.', contacts: 'A tulip contact sits on each end post, facing the centre.', blades: 'One long aluminium blade with a contact pin at each end. It turns about the middle post.', drive: 'A crank on the centre post turns it. The interphase pipe turns all three phases together.' } },
  vertical: { title: 'Vertical-break', sub: '72.5 - 800 kV', std: 'IEC 62271-102, IEEE C37.30.1', cols: ['145 kV', '245 kV', '420 kV', '800 kV'],
    desc: 'The blade is hinged on one post and swings up to about 85 degrees. The air gap opens upward, so the phases can stand close together.',
    principle: 'A motor turns the centre insulator column. A bell-crank and rod change that rotation into a lifting movement of the blade. When the blade is up, the gap is vertical and easy to see from the ground.',
    pros: ['Needs very little width, so phase spacing can be small', 'Preferred where the bay is narrow (220 - 800 kV)', 'Blade lifts clear of the contact, with a wide vertical gap'],
    rows: [['Rated voltage', '145 kV', '245 kV', '420 kV', '800 kV'], ['Rated current', '2000 A', '3150 A', '4000 A', '5000 A'], ['Short-time withstand', '40 kA / 3 s', '50 kA / 3 s', '63 kA / 3 s', '63 kA / 3 s'], ['Peak withstand', '100 kA', '125 kA', '160 kA', '160 kA'], ['Vertical air gap', '1.4 m', '2.4 m', '3.8 m', '6.4 m'], ['Impulse across gap', '750 kV', '1200 kV', '1660 kV', '2550 kV']],
    parts: { posts: 'A hinge post, a shorter drive column and a contact post.', contacts: 'A tulip jaw on the contact post receives the pin on the blade tip.', blades: 'A tubular blade that lifts about a horizontal hinge.', drive: 'The centre column turns a crank. A rod from the crank lifts the blade.' } },
  knee: { title: 'Knee-break', sub: '145 - 800 kV', std: 'IEC 62271-102, IEEE C37.30.1', cols: ['145 kV', '245 kV', '420 kV', '800 kV'],
    desc: 'The blade has two parts joined by a knuckle hinge. To open, the lower arm rises and the upper arm folds back like a bent knee.',
    principle: 'The folded blade takes far less space than a long straight blade swinging round. It stays stiff in wind and holds up well against ice and short-circuit forces.',
    pros: ['Compact when open, so it needs a small clearance zone', 'Stable in high wind and ice', 'Suits tight switchyards'],
    rows: [['Rated voltage', '145 kV', '245 kV', '420 kV', '800 kV'], ['Rated current', '2000 A', '3150 A', '4000 A', '4000 A'], ['Short-time withstand', '40 kA / 3 s', '50 kA / 3 s', '63 kA / 3 s', '63 kA / 3 s'], ['Endurance class', 'M1 (2,000)', 'M2 (10,000)', 'M2', 'M2'], ['Operating time', 'about 5 s', 'about 6.5 s', 'about 8 s', 'about 10 s'], ['Blade', 'two segments', 'two segments', 'two segments', 'two segments']],
    parts: { posts: 'A hinge post and a contact post.', contacts: 'A silver-plated tulip jaw grips the pin on the blade tip.', blades: 'Two tubes joined at a knuckle hinge. A flexible copper strap carries current across the knee.', drive: 'A crank and drive rod at the foot of the hinge post lift the lower arm.' } },
  pantograph: { title: 'Pantograph', sub: '245 - 800 kV', std: 'IEC 62271-102, IEEE C37.30.1', cols: ['245 kV', '420 kV', '550 kV', '800 kV'],
    desc: 'A diamond-shaped scissor frame stands on one post insulator. It rises to clamp an overhead busbar and folds flat to open.',
    principle: 'The scissor links open and close like a lazy-tongs. Because the isolator stands on one column and reaches upward, a switchyard can be stacked in levels and uses much less land, by as much as 40% in some layouts.',
    pros: ['One support column per phase', 'Saves a large area of switchyard land', 'Suits multi-level busbar layouts in EHV and UHV stations'],
    rows: [['Rated voltage', '245 kV', '420 kV', '550 kV', '800 kV'], ['Rated current', '2500 A', '3150 A', '4000 A', '4000 A'], ['Short-time withstand', '40 kA / 3 s', '50 kA / 3 s', '63 kA / 3 s', '63 kA / 3 s'], ['Vertical reach', '3.5 m', '5.2 m', '6.8 m', '8.5 m'], ['Impulse (BIL)', '1050 kV', '1425 kV', '1800 kV', '2100 kV'], ['Support', '1 post', '1 post', '1 post', '1 post']],
    parts: { posts: 'A single tall post insulator under each scissor.', contacts: 'A contact head at the apex with jaws that clamp the overhead tube.', blades: 'Four aluminium links form the scissor diamond. The overhead tube is the upper busbar.', drive: 'A rotating rod from the base mechanism drives the lower links.' } },
  semi: { title: 'Semi-pantograph', sub: '245 - 800 kV', std: 'IEC 62271-102, IEEE C37.30.1', cols: ['245 kV', '420 kV', '550 kV', '800 kV'],
    desc: 'Half of a pantograph: a single folding arm on one post reaches up to the overhead busbar, with a guide post beside it.',
    principle: 'The two links fold into a Z. A guide rod keeps the contact moving straight up and down, so it lands exactly under the busbar.',
    pros: ['Lighter and simpler than a full pantograph', 'Same land saving as a pantograph', 'Only one pair of arms to maintain'],
    rows: [['Rated voltage', '245 kV', '420 kV', '550 kV', '800 kV'], ['Rated current', '2500 A', '3150 A', '4000 A', '4000 A'], ['Short-time withstand', '40 kA / 3 s', '50 kA / 3 s', '63 kA / 3 s', '63 kA / 3 s'], ['Vertical reach', '3.4 m', '5 m', '6.5 m', '8 m'], ['Impulse (BIL)', '1050 kV', '1425 kV', '1800 kV', '2100 kV'], ['Posts per phase', '2', '2', '2', '2']],
    parts: { posts: 'A tall arm post and a shorter guide post.', contacts: 'A contact head with jaws at the top of the arms.', blades: 'Two links form a Z. The overhead tube is the upper busbar.', drive: 'A guide rod keeps the contact travelling straight.' } }
};
