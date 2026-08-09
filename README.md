# Modern Animated Personal Portfolio

A responsive personal portfolio built with:

- HTML5
- Modern CSS
- Vanilla JavaScript
- GSAP + ScrollTrigger
- Three.js
- Google Fonts

## Folder structure

```text
portfolio-website/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

### Option 1 — VS Code Live Server

1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

### Option 2 — Python server

Open a terminal inside the project folder:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Customize

Edit `index.html` to replace:

- Name
- Email
- LinkedIn URL
- GitHub URL
- Project descriptions
- Project links

Edit `style.css` to change the main accent:

```css
--accent: #c7ff39;
```

The Three.js particle background and GSAP animations are loaded from CDN, so an internet connection is required when running the page.
