# Vedant Foundation

A responsive animal-welfare awareness website. It presents animal-killing estimates, invites compassionate reflection on faith and animal welfare, and introduces plant-based protein sources.

## Pages

The site is a single scrolling page with these sections:

1. **Home** — animated animal-photo collage and headline.
2. **Daily data** — estimated number of animals killed each day.
3. **Species** — estimates by species.
4. **Faith** — a respectful reflection on compassion, belief, and animal-related rituals.
5. **Protein** — examples of plant-based protein sources.
6. **Contact** — an invitation to reach out by email or phone.

## Run locally

There is no build step or package installation. From the project root, start a local static file server, for example with Python:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/src/> in your browser. Alternatively, open `src/index.html` with a local development server such as the VS Code Live Server extension. Using a local server helps the browser load the images and scripts consistently.

## Deploy with GitHub Pages

The included GitHub Actions workflow deploys the site when changes are pushed to the `main` or `master` branch. It publishes `src/`, `Public/`, and the root redirect page so the website opens from the repository's Pages URL.

1. Push this project to a GitHub repository on the `main` or `master` branch.
2. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Open the **Actions** tab and wait for the **Deploy to GitHub Pages** workflow to finish.
4. Open the Pages URL shown under **Settings → Pages**.

You can also start a deployment from **Actions → Deploy to GitHub Pages → Run workflow**.

## Project structure

```text
Hackthon Site/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml  # GitHub Pages deployment
├── index.html                # Redirects the Pages homepage to src/
├── Public/                  # Animal photography used by the page
└── src/
    ├── assets/
    │   └── profile-logo.png
    ├── index.html            # Page content and navigation
    ├── script.js             # Navigation, scrolling, and animations
    └── style.css             # Layout, visual design, and responsive styles
```

## Interactions and dependencies

- GSAP 3.12.5, ScrollTrigger, and ScrollToPlugin provide scroll reveals, the layered page-overlay effect, progress tracking, and smooth in-page navigation.
- GSAP plugins and Google Fonts load from CDNs, so those enhancements and fonts require an internet connection.
- The mobile navigation, image collage, and hero headline animation are implemented in `src/script.js` and `src/style.css`.
- Reduced-motion preferences are respected for animated effects.
- Contact links are configured in `src/index.html`.

## Customization

- Edit section text and navigation labels in `src/index.html`.
- Update colors, layouts, and responsive breakpoints in `src/style.css`.
- Adjust navigation and animation behavior in `src/script.js`.
- Keep image paths in the HTML in sync with the files in `Public/` and `src/assets/`.
