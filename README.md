# VoltVerse – Electrical Explorers
Static site, no build step needed. Pages: index.html, explorer.html, calculator.html.

Deploy: push this folder to GitHub, then vercel.com/new > Import > Framework "Other" > Deploy.
Or from this folder: `npx vercel --prod`.

If you add new Tailwind classes: `npm i -D tailwindcss@3.4.17 && npx tailwindcss -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify`
