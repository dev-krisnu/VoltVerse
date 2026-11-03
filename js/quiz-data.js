/* 50 hand-checked questions. Each round draws 10 without repeats. */
window.QUIZ_BANK = [
 {
  "topic": "Transformers",
  "q": "A 2200/220 V single-phase transformer has a turns ratio of 10:1. If primary current is 5 A, what is the ideal secondary current?",
  "options": [
   "0.5 A",
   "50 A",
   "25 A",
   "5 A"
  ],
  "correct": 1,
  "exp": "Power remains constant ideally: I2 = I1 * (N1/N2) = 5 * 10 = 50 A.",
  "id": "q01"
 },
 {
  "topic": "Transformers",
  "q": "What component is used in a transformer to absorb moisture from the air entering the conservator tank?",
  "options": [
   "Buchholz Relay",
   "Silica Gel Breather",
   "Explosion Vent",
   "Commutator"
  ],
  "correct": 1,
  "exp": "Silica gel inside the breather absorbs moisture from incoming air to keep transformer oil dry.",
  "id": "q02"
 },
 {
  "topic": "Transformers",
  "q": "Open circuit test on a transformer is conducted to determine which of the following losses?",
  "options": [
   "Copper losses",
   "Core / Iron losses",
   "Frictional losses",
   "Stray load losses"
  ],
  "correct": 1,
  "exp": "Open circuit test is performed at rated voltage on the LV side to measure core (iron) losses.",
  "id": "q03"
 },
 {
  "topic": "Transformers",
  "q": "Short circuit test on a transformer is conducted primarily to determine which parameter?",
  "options": [
   "Core loss",
   "Full-load copper loss & equivalent impedance",
   "Dielectric strength",
   "Magnetizing current"
  ],
  "correct": 1,
  "exp": "Short circuit test is conducted at rated current on HV side to determine full-load copper loss and equivalent impedance.",
  "id": "q04"
 },
 {
  "topic": "Transformers",
  "q": "What is the condition for achieving maximum efficiency in a transformer?",
  "options": [
   "Copper loss = 2 * Iron loss",
   "Copper loss = Iron loss",
   "Iron loss = 0",
   "Copper loss = 0"
  ],
  "correct": 1,
  "exp": "Maximum efficiency occurs when variable copper loss equals constant iron loss (Wcu = Wi).",
  "id": "q05"
 },
 {
  "topic": "Transformers",
  "q": "Why are transformer cores laminated?",
  "options": [
   "To reduce copper loss",
   "To reduce eddy current loss",
   "To reduce hysteresis loss",
   "To increase mechanical strength"
  ],
  "correct": 1,
  "exp": "Laminations insulate thin sheets from one another, increasing resistance to eddy currents and reducing eddy current loss.",
  "id": "q06"
 },
 {
  "topic": "Induction Motors",
  "q": "Calculate the synchronous speed (Ns) of a 4-pole 3-phase induction motor connected to a 50 Hz AC supply.",
  "options": [
   "1000 RPM",
   "1500 RPM",
   "3000 RPM",
   "1440 RPM"
  ],
  "correct": 1,
  "exp": "Ns = (120 * f) / P = (120 * 50) / 4 = 1500 RPM.",
  "id": "q07"
 },
 {
  "topic": "Induction Motors",
  "q": "If a 4-pole induction motor running at 50 Hz has a full-load speed of 1440 RPM, what is its slip percentage?",
  "options": [
   "2 %",
   "4 %",
   "5 %",
   "6 %"
  ],
  "correct": 1,
  "exp": "Ns = 1500 RPM. Slip s = (1500 - 1440)/1500 = 60/1500 = 0.04 or 4%.",
  "id": "q08"
 },
 {
  "topic": "Induction Motors",
  "q": "Which motor provides high starting torque with external resistance inserted into the rotor circuit?",
  "options": [
   "Squirrel Cage Induction Motor",
   "Slip Ring (Wound Rotor) Motor",
   "Synchronous Motor",
   "Single Phase Shaded Pole Motor"
  ],
  "correct": 1,
  "exp": "Slip Ring induction motors allow external rheostats connected via carbon brushes to maximize starting torque.",
  "id": "q09"
 },
 {
  "topic": "Induction Motors",
  "q": "What happens to the rotor frequency (fr) of an induction motor when the slip increases?",
  "options": [
   "Decreases",
   "Increases",
   "Remains constant at 50 Hz",
   "Becomes zero"
  ],
  "correct": 1,
  "exp": "Rotor frequency fr = s * f. As slip s increases under load, rotor frequency increases proportionally.",
  "id": "q10"
 },
 {
  "topic": "Induction Motors",
  "q": "At stand-still (standstill condition), what is the value of slip (s) for an induction motor?",
  "options": [
   "0",
   "0.5",
   "1",
   "Infinity"
  ],
  "correct": 2,
  "exp": "At standstill, rotor speed Nr = 0, so slip s = (Ns - 0)/Ns = 1.",
  "id": "q11"
 },
 {
  "topic": "Induction Motors",
  "q": "What is the primary reason for skewing rotor slots in a squirrel cage induction motor?",
  "options": [
   "To increase copper area",
   "To prevent cogging (magnetic locking) and reduce noise",
   "To reduce stator resistance",
   "To simplify winding process"
  ],
  "correct": 1,
  "exp": "Skewing rotor slots reduces magnetic hum, prevents magnetic locking (cogging) between stator and rotor teeth, and produces smoother torque.",
  "id": "q12"
 },
 {
  "topic": "Induction Motors",
  "q": "A 6-pole 3-phase induction motor is supplied from a 60 Hz source. What is its synchronous speed?",
  "options": [
   "1200 RPM",
   "1000 RPM",
   "1800 RPM",
   "3600 RPM"
  ],
  "correct": 0,
  "exp": "Ns = (120 * 60) / 6 = 7200 / 6 = 1200 RPM.",
  "id": "q13"
 },
 {
  "topic": "Induction Motors",
  "q": "In a Star-Delta starter, what is the starting current compared to Direct-On-Line (DOL) starting current?",
  "options": [
   "1/3 of DOL starting current",
   "1/sqrt(3) of DOL starting current",
   "3 times DOL starting current",
   "Equal to DOL starting current"
  ],
  "correct": 0,
  "exp": "Star voltage is Vph = Vline / sqrt(3), reducing phase current and line current to 1/3 of the Delta (DOL) starting value.",
  "id": "q14"
 },
 {
  "topic": "DC Machines",
  "q": "In a DC generator, what is the main function of the commutator?",
  "options": [
   "Convert DC voltage to AC voltage",
   "Convert AC induced in armature to DC output",
   "Reduce mechanical friction",
   "Increase magnetic flux"
  ],
  "correct": 1,
  "exp": "The commutator functions as a mechanical rectifier converting alternating voltage generated in the armature coil into direct voltage.",
  "id": "q15"
 },
 {
  "topic": "DC Machines",
  "q": "Why is a DC series motor never started without load?",
  "options": [
   "It will fail to start",
   "It will run at dangerously high speed",
   "Its back EMF becomes zero",
   "Its field winding burns immediately"
  ],
  "correct": 1,
  "exp": "At no load, field current is very small, leading to minimal flux. Speed N ∝ 1/Flux, so speed rises to dangerously high levels.",
  "id": "q16"
 },
 {
  "topic": "DC Machines",
  "q": "Interpoles in DC machines are connected in:",
  "options": [
   "Series with armature winding",
   "Parallel with armature winding",
   "Series with field winding",
   "Parallel with field winding"
  ],
  "correct": 0,
  "exp": "Interpoles carry full armature current to neutralize cross-magnetizing armature reaction in the commutating zone.",
  "id": "q17"
 },
 {
  "topic": "DC Machines",
  "q": "The direction of rotation of a DC motor can be reversed by reversing:",
  "options": [
   "Supply terminals only",
   "Either field terminals or armature terminals",
   "Both field and armature terminals simultaneously",
   "Speed control rheostat"
  ],
  "correct": 1,
  "exp": "Reversing either field or armature current direction changes torque direction. Reversing both keeps torque direction identical.",
  "id": "q18"
 },
 {
  "topic": "DC Machines",
  "q": "Back EMF (Eb) in a DC motor is proportional to which factors?",
  "options": [
   "Flux and Speed (Phi * N)",
   "Armature resistance only",
   "Terminal voltage only",
   "Supply frequency"
  ],
  "correct": 0,
  "exp": "Back EMF Eb = (P * Phi * N * Z) / (60 * A), hence Eb ∝ Phi * N.",
  "id": "q19"
 },
 {
  "topic": "Circuit Math",
  "q": "Calculate the equivalent resistance of three 30 Ω resistors connected in parallel.",
  "options": [
   "90 Ω",
   "10 Ω",
   "30 Ω",
   "15 Ω"
  ],
  "correct": 1,
  "exp": "Req = R / n = 30 / 3 = 10 Ω.",
  "id": "q20"
 },
 {
  "topic": "Circuit Math",
  "q": "A 100 W incandescent lamp is operated for 10 hours daily. How many units (kWh) of energy are consumed in 30 days?",
  "options": [
   "3 kWh",
   "30 kWh",
   "300 kWh",
   "10 kWh"
  ],
  "correct": 1,
  "exp": "Energy = (100 W * 10 h * 30 days) / 1000 = 30,000 / 1000 = 30 kWh (units).",
  "id": "q21"
 },
 {
  "topic": "Circuit Math",
  "q": "What is the total capacitance of two 10 µF capacitors connected in series?",
  "options": [
   "20 µF",
   "5 µF",
   "10 µF",
   "100 µF"
  ],
  "correct": 1,
  "exp": "For capacitors in series: Ceq = (C1 * C2) / (C1 + C2) = (10 * 10) / 20 = 5 µF.",
  "id": "q22"
 },
 {
  "topic": "Circuit Math",
  "q": "Calculate the inductive reactance (Xl) of a 0.1 H inductor at a supply frequency of 50 Hz.",
  "options": [
   "31.4 Ω",
   "314 Ω",
   "15.7 Ω",
   "62.8 Ω"
  ],
  "correct": 0,
  "exp": "Xl = 2 * pi * f * L = 2 * 3.1416 * 50 * 0.1 = 31.416 Ω.",
  "id": "q23"
 },
 {
  "topic": "Circuit Math",
  "q": "In a series RLC circuit at resonance, what is the net circuit impedance (Z)?",
  "options": [
   "Z = R",
   "Z = 0",
   "Z = Xl + Xc",
   "Z = Infinity"
  ],
  "correct": 0,
  "exp": "At resonance Xl = Xc, cancelling reactive impedance so net impedance Z = R (minimum and purely resistive).",
  "id": "q24"
 },
 {
  "topic": "Measurements",
  "q": "Which meter is used to measure very high insulation resistance of electrical cables?",
  "options": [
   "Multimeter",
   "Megger (Insulation Tester)",
   "Wheatstone Bridge",
   "Wattmeter"
  ],
  "correct": 1,
  "exp": "A Megger is a high-voltage ohmmeter designed specifically to measure insulation resistance in megohms.",
  "id": "q25"
 },
 {
  "topic": "Measurements",
  "q": "PMMC (Permanent Magnet Moving Coil) instruments can measure which type of electrical quantity?",
  "options": [
   "DC quantities only",
   "AC quantities only",
   "Both AC and DC",
   "High frequency RF signals"
  ],
  "correct": 0,
  "exp": "PMMC instruments operate on magnetic torque produced by DC. On AC, average torque is zero due to inertia.",
  "id": "q26"
 },
 {
  "topic": "Measurements",
  "q": "To extend the range of a DC Ammeter, what component should be connected with the meter movement?",
  "options": [
   "High resistance in series",
   "Low resistance (Shunt) in parallel",
   "Capacitor in series",
   "Inductor in parallel"
  ],
  "correct": 1,
  "exp": "A low resistance shunt in parallel bypasses the bulk of total circuit current around the sensitive meter movement.",
  "id": "q27"
 },
 {
  "topic": "Measurements",
  "q": "To extend the voltage measurement range of a Voltmeter, what component should be added?",
  "options": [
   "Low resistance shunt in parallel",
   "High resistance multiplier in series",
   "Parallel capacitor",
   "Series inductor"
  ],
  "correct": 1,
  "exp": "A high-resistance multiplier in series drops excess voltage across itself, extending voltmeter range.",
  "id": "q28"
 },
 {
  "topic": "Power Systems",
  "q": "What is the primary reason for transmitting electrical power at very high voltages over long distances?",
  "options": [
   "To increase line capacitance",
   "To reduce I²R transmission line losses",
   "To decrease insulation cost",
   "To prevent corona effect"
  ],
  "correct": 1,
  "exp": "Higher voltage reduces current for the same power (P=VI), drastically lowering I²R heating losses in conductors.",
  "id": "q29"
 },
 {
  "topic": "Transmission",
  "q": "Which insulator type is used on dead-end sharp corner towers of overhead transmission lines?",
  "options": [
   "Pin type insulator",
   "Strain type insulator",
   "Shackle insulator",
   "Post insulator"
  ],
  "correct": 1,
  "exp": "Strain insulators are designed to handle mechanical tension at line terminations and sharp curves.",
  "id": "q30"
 },
 {
  "topic": "Transmission",
  "q": "ACSR conductors stand for:",
  "options": [
   "Aluminum Conducted Steel Reinforced",
   "Aluminum Conductor Steel Reinforced",
   "All Copper Steel Reinforced",
   "Aluminum Cable Standard Reinforced"
  ],
  "correct": 1,
  "exp": "ACSR stands for Aluminum Conductor Steel Reinforced, where central steel core provides mechanical tensile strength.",
  "id": "q31"
 },
 {
  "topic": "Switchgear",
  "q": "What medium is used in SF6 Circuit Breakers to extinguish the electrical arc?",
  "options": [
   "Compressed Air",
   "Mineral Transformer Oil",
   "Sulfur Hexafluoride Gas",
   "Vacuum"
  ],
  "correct": 2,
  "exp": "SF6 (Sulfur Hexafluoride) gas has superior electronegative property and high dielectric strength for rapid arc quenching.",
  "id": "q32"
 },
 {
  "topic": "Switchgear",
  "q": "What is the Buchholz Relay used for in transformer protection?",
  "options": [
   "Overcurrent protection",
   "Internal gas/incipient fault protection",
   "Earth fault protection",
   "Reverse power protection"
  ],
  "correct": 1,
  "exp": "Buchholz relay is a gas-actuated protective device mounted between the main oil tank and conservator to detect internal faults.",
  "id": "q33"
 },
 {
  "topic": "Switchgear",
  "q": "A fuse rating is given as 16 A. What does this rating represent?",
  "options": [
   "Maximum peak surge current",
   "Continuous current it can carry without melting",
   "Minimum fault current",
   "Current at which it melts in 1 microsecond"
  ],
  "correct": 1,
  "exp": "Rated fuse current is the maximum RMS current the fuse element can carry continuously without overheating or melting.",
  "id": "q34"
 },
 {
  "topic": "Switchgear",
  "q": "What is the purpose of providing surge arresters (lightning arresters) near sub-station transformers?",
  "options": [
   "To prevent overload",
   "To divert high-voltage transient lightning surges to ground",
   "To improve power factor",
   "To limit fault current"
  ],
  "correct": 1,
  "exp": "Lightning arresters provide a low-resistance path to ground for steep lightning voltage transients, protecting transformer insulation.",
  "id": "q35"
 },
 {
  "topic": "Power Electronics",
  "q": "An SCR (Silicon Controlled Rectifier) is a semiconductor device having how many P-N junctions?",
  "options": [
   "2",
   "3",
   "4",
   "5"
  ],
  "correct": 1,
  "exp": "SCR is a 4-layer (P-N-P-N) device with 3 P-N junctions (J1, J2, J3) and 3 terminals (Anode, Cathode, Gate).",
  "id": "q36"
 },
 {
  "topic": "Power Electronics",
  "q": "A TRIAC is equivalent to:",
  "options": [
   "Two SCRs connected in anti-parallel with common gate",
   "Two diodes in series",
   "SCR and transistor in cascade",
   "BJT and MOSFET"
  ],
  "correct": 0,
  "exp": "TRIAC is a bidirectional 5-layer device equivalent to two inverse-parallel SCRs with a single gate terminal.",
  "id": "q37"
 },
 {
  "topic": "Power Electronics",
  "q": "Which power semiconductor device is voltage-controlled and has high input impedance with fast switching capability?",
  "options": [
   "BJT",
   "SCR",
   "Power MOSFET",
   "TRIAC"
  ],
  "correct": 2,
  "exp": "Power MOSFET is a voltage-controlled majority-carrier device offering high input impedance and fast switching speeds.",
  "id": "q38"
 },
 {
  "topic": "Power Electronics",
  "q": "An Inverter is a power electronic circuit used to convert:",
  "options": [
   "AC to DC",
   "Fixed DC to variable AC",
   "DC to DC",
   "AC to AC frequency"
  ],
  "correct": 1,
  "exp": "An inverter converts direct current (DC) input into alternating current (AC) output at desired voltage and frequency.",
  "id": "q39"
 },
 {
  "topic": "Control Systems",
  "q": "A closed-loop control system differs from an open-loop system primarily due to the presence of:",
  "options": [
   "Amplifier",
   "Feedback loop",
   "Power supply",
   "Output actuator"
  ],
  "correct": 1,
  "exp": "Closed-loop systems incorporate feedback to compare actual output against target input and minimize error.",
  "id": "q40"
 },
 {
  "topic": "Transformers",
  "q": "A transformer works on which basic principle?",
  "options": [
   "Self induction only",
   "Mutual induction",
   "Electrostatic induction",
   "Hall effect"
  ],
  "correct": 1,
  "exp": "A changing flux in the primary links with the secondary winding and induces an EMF in it by mutual induction.",
  "id": "q41"
 },
 {
  "topic": "Transformers",
  "q": "Why can a transformer not work on a DC supply?",
  "options": [
   "DC has too high a voltage",
   "DC gives a constant flux, so no EMF is induced in the secondary",
   "DC has no current",
   "DC raises the iron loss to zero"
  ],
  "correct": 1,
  "exp": "A transformer needs a changing flux. DC gives a steady flux, so nothing is induced, and the primary may overheat.",
  "id": "q42"
 },
 {
  "topic": "Induction Motors",
  "q": "Which part of an induction motor carries the 3-phase supply and creates the rotating magnetic field?",
  "options": [
   "Rotor",
   "Stator",
   "Shaft",
   "End cover"
  ],
  "correct": 1,
  "exp": "The 3-phase winding in the stator slots produces a magnetic field that rotates at synchronous speed.",
  "id": "q43"
 },
 {
  "topic": "Induction Motors",
  "q": "In a TEFC induction motor, what is the job of the fan on the shaft?",
  "options": [
   "To make the rotor lighter",
   "To blow air over the frame fins to cool the motor",
   "To increase the starting torque",
   "To supply air inside the stator"
  ],
  "correct": 1,
  "exp": "TEFC means totally enclosed fan cooled. The fan pushes outside air over the fins on the frame, and the inside stays sealed.",
  "id": "q44"
 },
 {
  "topic": "Induction Motors",
  "q": "Slip rings and carbon brushes are found in which type of motor?",
  "options": [
   "Squirrel cage induction motor",
   "Slip ring (wound rotor) induction motor",
   "Single-phase capacitor motor",
   "Universal motor in a mixer"
  ],
  "correct": 1,
  "exp": "A wound rotor has a 3-phase winding whose ends go to slip rings, so external resistance can be added through the brushes.",
  "id": "q45"
 },
 {
  "topic": "DC Machines",
  "q": "Which DC motor runs at almost constant speed from no load to full load?",
  "options": [
   "Series motor",
   "Shunt motor",
   "Cumulative compound motor",
   "Differential compound motor"
  ],
  "correct": 1,
  "exp": "The shunt field is across the supply, so the flux stays nearly constant and the speed changes very little with load.",
  "id": "q46"
 },
 {
  "topic": "DC Machines",
  "q": "Which DC motor is preferred for traction and cranes because of its high starting torque?",
  "options": [
   "Shunt motor",
   "Series motor",
   "Separately excited motor",
   "Permanent magnet motor"
  ],
  "correct": 1,
  "exp": "In a series motor the flux rises with current, so torque (proportional to flux x armature current) is very high at start.",
  "id": "q47"
 },
 {
  "topic": "DC Machines",
  "q": "What is the job of the carbon brushes in a DC machine?",
  "options": [
   "To produce the main flux",
   "To carry current between the rotating commutator and the external circuit",
   "To cool the armature",
   "To reduce the speed"
  ],
  "correct": 1,
  "exp": "The brushes slide on the commutator and conduct current to or from the armature winding.",
  "id": "q48"
 },
 {
  "topic": "Circuit Math",
  "q": "A heater of resistance 46 ohm is connected to a 230 V supply. What current does it draw?",
  "options": [
   "0.2 A",
   "5 A",
   "10 A",
   "50 A"
  ],
  "correct": 1,
  "exp": "I = V / R = 230 / 46 = 5 A.",
  "id": "q49"
 },
 {
  "topic": "Switchgear",
  "q": "An MCB (miniature circuit breaker) protects a circuit against:",
  "options": [
   "Overload and short circuit",
   "Low voltage only",
   "Lightning only",
   "Frequency variation"
  ],
  "correct": 0,
  "exp": "An MCB has a thermal element for overload and a magnetic element for short circuits, and it can be reset after tripping.",
  "id": "q50"
 }
];
