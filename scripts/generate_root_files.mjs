import fs from 'fs';
import path from 'path';
import { CATEGORIES, STYLES } from './definitions.mjs';

const allSlugs = Object.values(CATEGORIES).flat();

let formsHtml = '';
let totalCount = 0;

allSlugs.forEach(slug => {
  STYLES.forEach(style => {
    totalCount++;
    const filePath = path.join('ui-components', slug, `design-${style.id}.html`);
    let htmlContent = '';
    if (fs.existsSync(filePath)) {
      htmlContent = fs.readFileSync(filePath, 'utf8');
    }

    // Prepare JSON payload for CodePen define
    const dataObj = {
      title: `${slug.toUpperCase()} - Design ${style.id} (${style.nameEN})`,
      description: `Component: ${slug}, Design ${style.id}: ${style.nameEN} / ${style.nameES}. Designed by Harley Vásquez.`,
      html: htmlContent,
      editors: "100"
    };

    const jsonStr = JSON.stringify(dataObj).replace(/"/g, '&quot;');

    formsHtml += `
      <div class="pen-card">
        <h3>${totalCount}. ${slug.toUpperCase()} - Design ${style.id}: ${style.nameEN}</h3>
        <p>Category: ${getCategoryForSlug(slug)} | Author: Harley Vásquez</p>
        <form action="https://codepen.io/cpe/pen/define" method="POST" target="_blank">
          <input type="hidden" name="data" value="${jsonStr}" />
          <button type="submit" class="btn">Open in CodePen</button>
        </form>
      </div>
    `;
  });
});

function getCategoryForSlug(slug) {
  for (const [cat, slugs] of Object.entries(CATEGORIES)) {
    if (slugs.includes(slug)) return cat;
  }
  return 'UI Component';
}

const codepenPrefillHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodePen Prefill - 560 UI Components / Harley Vásquez</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; padding: 2rem; }
    header { text-align: center; margin-bottom: 2rem; }
    header h1 { font-size: 2.2rem; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    header p { color: #94a3b8; margin-top: 0.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; max-width: 1400px; margin: 0 auto; }
    .pen-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem; }
    .pen-card h3 { font-size: 1rem; color: #f1f5f9; }
    .pen-card p { font-size: 0.8rem; color: #64748b; }
    .btn { background: #38bdf8; color: #0f172a; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; text-decoration: none; display: inline-block; }
    .btn:hover { background: #7dd3fc; }
  </style>
</head>
<body>
  <header>
    <h1>CodePen Prefill - 560 UI Component Forms</h1>
    <p>Click any button below to instantly export the standalone design into CodePen</p>
    <p>Created by Harley Vásquez | <a href="https://www.linkedin.com/in/harleyvasquez/" target="_blank" style="color:#38bdf8;">LinkedIn</a></p>
  </header>

  <div class="grid">
    ${formsHtml}
  </div>
</body>
</html>`;

fs.writeFileSync('codepen-prefill.html', codepenPrefillHtml);

const mainReadmeContent = `# 560 UI Component Designs

A comprehensive suite of **56 UI Components** with **10 distinct aesthetic & functional designs each = 560 unique UI designs**. Each design is a 100% self-contained HTML file (inline CSS + JS, zero external dependencies/CDNs) with real interactivity, accessibility support, and responsive layouts.

## Created By
**Harley Vásquez**
LinkedIn: [Harley Vásquez](https://www.linkedin.com/in/harleyvasquez/)

---

## 56 UI Components Summary

### 1. Entrada (15 Components / 150 Designs)
\`button\`, \`checkbox\`, \`radio\`, \`switch\`, \`text-field\`, \`text-area\`, \`dropdown\`, \`date-picker\`, \`time-picker\`, \`slider\`, \`stepper\`, \`file-uploader\`, \`search-bar\`, \`color-picker\`, \`filters\`

### 2. Navegación (10 Components / 100 Designs)
\`navbar\`, \`hamburger\`, \`tabs\`, \`breadcrumbs\`, \`sidebar\`, \`pagination\`, \`infinite-scroll\`, \`bottom-nav\`, \`anchor\`, \`toc\`

### 3. Datos (13 Components / 130 Designs)
\`card\`, \`list\`, \`grid\`, \`table\`, \`carousel\`, \`accordion\`, \`avatar\`, \`badge\`, \`tag\`, \`timeline\`, \`charts\`, \`calendar\`, \`code-block\`

### 4. Feedback (10 Components / 100 Designs)
\`alert\`, \`toast\`, \`modal\`, \`popover\`, \`tooltip\`, \`progress-bar\`, \`spinner\`, \`empty-state\`, \`error-404\`, \`confirm-dialog\`

### 5. Global (8 Components / 80 Designs)
\`header\`, \`footer\`, \`logo\`, \`media-player\`, \`hero\`, \`icons\`, \`divider\`, \`blockquote\`

---

## 10 Distinct Visual Styles
1. **Design 01**: Modern Dark Glassmorphism
2. **Design 02**: Clean Light Minimalist
3. **Design 03**: Soft Neumorphism Light
4. **Design 04**: Vibrant Cyberpunk Neon
5. **Design 05**: Retro Terminal Green
6. **Design 06**: Luxury Gold & Obsidian
7. **Design 07**: Editorial High-Contrast Serif
8. **Design 08**: Brutalist Pop Art Bold
9. **Design 09**: Nordic Frost Gradient
10. **Design 10**: Futuristic Hologram Indigo

---

## Testing & CodePen Integration
- **Automated Probe Test**: Run \`node tests/probe.mjs\` to verify all 560 designs render without console errors and pass interactive UI state assertions in headless Chrome via Puppeteer.
- **CodePen Prefill**: Open \`codepen-prefill.html\` to submit any of the 560 designs directly into CodePen via POST forms.
`;

fs.writeFileSync('README.md', mainReadmeContent);

console.log('Root codepen-prefill.html and README.md generated successfully.');
