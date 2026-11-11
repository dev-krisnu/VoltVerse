# V-NODE – the 3D Electrical Component Library
Static site, no build step needed.

## Pages
- `index.html` – library home (cards come from `js/library.js`)
- Transformers: `transformer-explorer.html`, `transformer-calculator.html`, `transformer-design.html`
- Motors: `dc-motor.html`, `dc-motor-types.html`, `induction-motor.html` (model in `js/induction-model.js`)
- Power electronics: `rectifier.html`
- Switches: `switches.html` (menu) and 14 labs `switch-<name>.html`; list in `js/switches-data.js`, shared engine in `js/switches-engine.js`
- Practice: `quiz.html` (50 questions in `js/quiz-data.js`, 10 per round, no repeats until all are seen)

## Deploy
Push to GitHub, then vercel.com/new > Import > Framework "Other" > Deploy. Or run `npx vercel --prod` in this folder.

## Add a new component
1. Copy `dc-motor.html` as a starting page and build the component in it.
2. Add an entry to `js/library.js` (a new family, or a new tool in an existing family).
3. Add a tab for it to the bottom `<nav class="app-nav">` of the pages in that family.

## Add quiz questions
Add objects to `js/quiz-data.js` with `id`, `topic`, `q`, `options` (4), `correct` (index) and `exp`. The round size is `ROUND` in `js/quiz.js`.

## Tailwind
CSS is prebuilt in `css/tailwind.css`. After adding new classes in HTML or `js/`:
`npm i -D tailwindcss@3.4.17 && npx tailwindcss -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify`


## Added in this update
- Slip ring induction motor: slip rings now sit in an open guard behind the end cover, with the fan and cowl at the very end (as on the real machine).
- DC Generator cut-section (`dc-generator.html`): pole shoes, field windings, air gap, cooling fan, sealed ball bearings, half-cut and exploded views, wheel and pinch zoom.
- Ported to local assets (no CDN): `insulators.html`, `wire-directory.html`, `symbols.html`.
- Hobby Electronics Lab (`hobby-electronics.html`): 10 parts and 5 starter projects in 3D.
- Fonts: Space Grotesk (headings) + Inter (text) + JetBrains Mono (data), all self-hosted. Icon font subset extended.
- Rebuild CSS after adding classes: `npx tailwindcss@3.4.17 -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify`

## V-NODE 2.0 additions
- **Brand**: the site is now V-NODE. `js/vnode.js` + `css/vnode.css` draw the splash/loader (cinematic logo, grid and sparks with the neon-glass title, progress and telemetry). First visit per session plays the full intro (tap to skip); later pages and internal links use a short branded curtain.
- **Line Supports** (`supports.html`): 15 structures (wooden, steel, RCC/PCC, six lattice types). Models are generated in `js/supports-models.js` and `js/supports-lattice.js`, content in `js/supports-data.js`. Deep links: `supports.html#lat_delta`.
- **Isolators** (`isolators.html`): six working HV isolators with earth-switch interlock (`js/isolators-*.js`).
- **Arc-flash PPE** (`ppe.html`): animated 3D worker for categories 1 to 4 (`js/ppe-human.js`, `js/ppe-person.js`), arc-flash test, garment inspector. **Safety guide** (`safety-guide.html`, Alpine vendored in `vendor/alpine.min.js`).
- **Mobile**: `css/mobile.css` + `js/mobile.js` (pixel-ratio cap, sticky 3D stage layouts, scroll reveal), `css/vk.css` for the new pages, shared engine `js/vk-engine.js`.
