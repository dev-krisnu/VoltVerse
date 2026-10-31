# VoltVerse – the 3D Electrical Component Library
Static site, no build step needed.

Pages: `index.html` (library home), `transformer-explorer.html`, `transformer-calculator.html`, `dc-motor.html`.

## Deploy
Push to GitHub, then vercel.com/new > Import > Framework "Other" > Deploy. Or run `npx vercel --prod` in this folder.

## Add a new component
1. Copy `dc-motor.html` as a starting page and build the new component in it.
2. Add an entry to `js/library.js` (a new family, or a new tool inside an existing family). The home page picks it up automatically.
3. Add a tab for it to the bottom `<nav class="app-nav">` of the new page.

## Tailwind
CSS is prebuilt in `css/tailwind.css`. After adding new classes in HTML or `js/`:
`npm i -D tailwindcss@3.4.17 && npx tailwindcss -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify`
