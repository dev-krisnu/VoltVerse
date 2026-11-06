# VoltVerse – the 3D Electrical Component Library
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
