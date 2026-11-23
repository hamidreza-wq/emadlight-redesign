# Emadlight — home page redesign concept

A concept redesign of the home page of **فروشگاه الکتریکی عماد لایت** ([emadlight.ir](https://www.emadlight.ir/rha/)).
This is an unofficial design proposal, not the live store.

**Live demo:** https://hamidreza-wq.github.io/emadlight-redesign/

## What it is

- One static page: `index.html`, `styles.css`, `script.js`. No build step.
- Right-to-left Persian layout (`dir="rtl"`, `lang="fa"`) set in Vazirmatn.
- Light and dark themes through CSS custom properties, with a toggle that remembers the choice.
- Video hero (modern interior with a statement chandelier), animated gradients, glowing buttons, tilt cards and scroll reveals.
- Respects `prefers-reduced-motion`: no autoplay and no animation.
- Responsive down to 375px, with a full-screen mobile menu.

## Content

All text, prices, categories, articles, contact details and images come from the original site and are loaded from its own URLs. Nothing about the business was invented.

The hero videos are free stock footage from Pexels:
[TR Studio](https://www.pexels.com/video/elegant-modern-living-room-interior-design-29466012/) on desktop and
[Real Estate 4k](https://www.pexels.com/video/luxurious-modern-interior-living-space-40398036/) on phones.

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Portfolio

Read more about this project on [Hamid Reza Bayat's portfolio](https://hamidbayat.co.uk/projects/emadlight-redesign).
