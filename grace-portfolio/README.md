# Grace Julius — Portfolio

A dark, terminal-inspired personal portfolio centered on the intersection of
**human-centered AI/interaction** and **cybersecurity**. Static site — no build
step, no dependencies. Deploys to GitHub Pages as-is.

---

## 📁 Structure

```
grace-portfolio/
├── index.html          → page structure + all content (edit text here)
├── css/
│   └── styles.css      → all styling; colors live in :root at the top
├── js/
│   └── script.js       → interactivity (terminal boot, reveals, filters)
├── assets/
│   ├── resume.pdf      → your résumé (swap with your latest)
│   └── grace.jpg       → your photo (add this — see below)
└── README.md
```

---

## 🚀 Deploy to GitHub Pages

**Option A — user site (recommended, clean URL `gracejulius.github.io`)**
1. Create a new repo named **`GraceJulius.github.io`**.
2. Upload everything in this folder to the repo root (not the folder itself —
   `index.html` must sit at the top level).
3. Push. Your site is live at `https://gracejulius.github.io` within a minute.

**Option B — project site (any repo name)**
1. Create a repo, upload the files.
2. Go to **Settings → Pages → Build and deployment**.
3. Source: *Deploy from a branch* → Branch: `main` → `/ (root)` → Save.
4. Live at `https://gracejulius.github.io/<repo-name>/`.

> Tip: Quick local preview — open `index.html` in a browser, or run
> `python3 -m http.server` in this folder and visit `localhost:8000`.

---

## ✏️ How to edit

**Text & content** → all in `index.html`. Each section is clearly commented
(`<!-- ===== HERO ===== -->`, `RESEARCH`, `WORK`, etc.). Find the section, edit
the text. To add a project, copy one `<article class="card">…</article>` block
and change the content.

**Project filters** → each work card has `data-cat="ai security build"`. Add or
remove those keywords to control which filter buttons show the card.

**Your photo** → drop a file at `assets/grace.jpg`. If it's missing, the site
falls back to your live image and then to a "GJ" monogram, so nothing breaks.

**Your résumé** → replace `assets/resume.pdf` with your latest (keep the name,
or update the two links in `index.html`).

**Colors** → open `css/styles.css` and edit the variables in `:root`:
- `--amber` is the main accent (change this one line to recolor the whole site —
  try a green `#3ddc84` or cyan `#62d2e0` phosphor).
- `--bg` is the background; `--text` the body text.

---

## ♿ Accessibility

Built to reflect the accessibility work in the portfolio itself: semantic
landmarks, a skip link, visible focus states, high contrast, and full respect
for `prefers-reduced-motion` (animations, scanlines, and the cursor glow all
switch off for users who prefer reduced motion).

---

## ✅ Pre-launch checklist
- [ ] Add `assets/grace.jpg`
- [ ] Confirm `assets/resume.pdf` is your current résumé
- [ ] Confirm graduation date (Dec 2026 vs. May 2027 — set in the About facts)
- [ ] Make the hero tagline yours
- [ ] Proofread every section

Built by Grace Julius.
