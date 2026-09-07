import { STYLES } from './definitions.mjs';

function getCssForStyle(style, slug) {
  const common = `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background-color: ${style.bg}; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
    header.demo-header { position: fixed; top: 0; left: 0; right: 0; padding: 0.75rem 1.5rem; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; z-index: 1000; color: #fff; font-size: 0.875rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .demo-container { width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; margin-top: 2rem; }
    footer.demo-footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 0.5rem; text-align: center; font-size: 0.75rem; color: rgba(255,255,255,0.6); background: rgba(0,0,0,0.3); }
    footer.demo-footer a { color: inherit; text-decoration: underline; }
  `;

  let specific = '';
  switch(style.id) {
    case '01': // Dark Glass
      specific = `
        body { color: #f8fafc; }
        .component-box { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2rem; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); width: 100%; text-align: center; }
        .ui-element { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; outline: none; display: inline-block; }
        .ui-element:hover, .ui-element:focus { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.4); box-shadow: 0 0 15px rgba(255,255,255,0.2); }
      `;
      break;
    case '02': // Light Minimal
      specific = `
        body { color: #0f172a; }
        header.demo-header { background: rgba(255,255,255,0.8); color: #0f172a; border-bottom: 1px solid #e2e8f0; }
        footer.demo-footer { background: rgba(255,255,255,0.8); color: #64748b; }
        .component-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); width: 100%; text-align: center; }
        .ui-element { background: #0f172a; color: #ffffff; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: all 0.2s ease; outline: none; display: inline-block; }
        .ui-element:hover, .ui-element:focus { background: #334155; }
      `;
      break;
    case '03': // Neumorphism
      specific = `
        body { color: #4a5568; }
        header.demo-header { background: #e0e5ec; color: #2d3748; border-bottom: 2px solid #d1d9e6; }
        footer.demo-footer { background: #e0e5ec; color: #718096; }
        .component-box { background: #e0e5ec; border-radius: 20px; padding: 2.5rem; box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5); width: 100%; text-align: center; }
        .ui-element { background: #e0e5ec; color: #3182ce; border: none; padding: 0.85rem 1.75rem; border-radius: 12px; cursor: pointer; font-size: 1rem; font-weight: 600; box-shadow: 6px 6px 12px #b8b9be, -6px -6px 12px #ffffff; transition: all 0.2s ease; outline: none; display: inline-block; }
        .ui-element:active, .ui-element.active, .ui-element:focus { box-shadow: inset 4px 4px 8px #b8b9be, inset -4px -4px 8px #ffffff; }
      `;
      break;
    case '04': // Cyberpunk
      specific = `
        body { color: #00ffcc; font-family: 'Courier New', monospace; }
        header.demo-header { background: #000; color: #ff0055; border-bottom: 2px solid #00ffcc; }
        footer.demo-footer { background: #000; color: #00ffcc; }
        .component-box { background: #0a0a23; border: 2px solid #ff0055; border-radius: 0px; padding: 2rem; box-shadow: 0 0 15px #ff0055, inset 0 0 10px #00ffcc; width: 100%; text-align: center; clip-path: polygon(0 0, 95% 0, 100% 10%, 100% 100%, 5% 100%, 0 90%); }
        .ui-element { background: #ff0055; color: #fff; border: 2px solid #00ffcc; padding: 0.75rem 1.5rem; cursor: pointer; font-size: 1rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; transition: all 0.2s; outline: none; display: inline-block; box-shadow: 3px 3px 0px #00ffcc; }
        .ui-element:hover, .ui-element:focus { background: #00ffcc; color: #000; box-shadow: 3px 3px 0px #ff0055; }
      `;
      break;
    case '05': // Terminal
      specific = `
        body { color: #33ff33; font-family: monospace; }
        header.demo-header { background: #000; color: #33ff33; border-bottom: 1px dashed #33ff33; }
        footer.demo-footer { background: #000; color: #33ff33; }
        .component-box { background: #050b07; border: 1px solid #33ff33; padding: 2rem; box-shadow: 0 0 10px rgba(51, 255, 51, 0.2); width: 100%; text-align: center; }
        .ui-element { background: transparent; color: #33ff33; border: 1px solid #33ff33; padding: 0.75rem 1.5rem; cursor: pointer; font-size: 1rem; font-family: monospace; transition: all 0.2s ease; outline: none; display: inline-block; }
        .ui-element:hover, .ui-element:focus { background: #33ff33; color: #000; }
      `;
      break;
    case '06': // Luxury
      specific = `
        body { color: #f3e5ab; font-family: Georgia, serif; }
        header.demo-header { background: #111; color: #d4af37; border-bottom: 1px solid #d4af37; }
        footer.demo-footer { background: #111; color: #d4af37; }
        .component-box { background: #141414; border: 1px solid #d4af37; border-radius: 4px; padding: 2rem; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15); width: 100%; text-align: center; }
        .ui-element { background: linear-gradient(135deg, #d4af37, #aa7c11); color: #000; border: none; padding: 0.8rem 1.8rem; border-radius: 2px; cursor: pointer; font-size: 1rem; font-weight: bold; letter-spacing: 1px; transition: all 0.3s ease; outline: none; display: inline-block; }
        .ui-element:hover, .ui-element:focus { filter: brightness(1.2); box-shadow: 0 0 15px rgba(212, 175, 55, 0.5); }
      `;
      break;
    case '07': // Editorial
      specific = `
        body { color: #1a1a1a; font-family: 'Times New Roman', Times, serif; }
        header.demo-header { background: #f4f1ea; color: #1a1a1a; border-bottom: 2px solid #1a1a1a; }
        footer.demo-footer { background: #f4f1ea; color: #555; }
        .component-box { background: #fff8f0; border: 2px solid #1a1a1a; padding: 2.5rem; width: 100%; text-align: center; box-shadow: 8px 8px 0px #1a1a1a; }
        .ui-element { background: #1a1a1a; color: #fff8f0; border: 2px solid #1a1a1a; padding: 0.75rem 1.5rem; cursor: pointer; font-size: 1.1rem; font-style: italic; transition: all 0.2s ease; outline: none; display: inline-block; }
        .ui-element:hover, .ui-element:focus { background: #fff8f0; color: #1a1a1a; }
      `;
      break;
    case '08': // Brutalist
      specific = `
        body { color: #000; font-family: 'Impact', 'Arial Black', sans-serif; }
        header.demo-header { background: #000; color: #fff; border-bottom: 4px solid #000; }
        footer.demo-footer { background: #000; color: #fff; }
        .component-box { background: #ff0055; border: 4px solid #000; padding: 2rem; box-shadow: 10px 10px 0px #000; width: 100%; text-align: center; transform: rotate(-1deg); }
        .ui-element { background: #00ff66; color: #000; border: 4px solid #000; padding: 0.8rem 1.8rem; cursor: pointer; font-size: 1.2rem; font-weight: 900; text-transform: uppercase; box-shadow: 5px 5px 0px #000; transition: all 0.1s ease; outline: none; display: inline-block; }
        .ui-element:hover, .ui-element:focus { transform: translate(-3px, -3px); box-shadow: 8px 8px 0px #000; }
        .ui-element:active { transform: translate(2px, 2px); box-shadow: 3px 3px 0px #000; }
      `;
      break;
    case '09': // Nordic
      specific = `
        body { color: #1e293b; }
        header.demo-header { background: rgba(224, 242, 254, 0.9); color: #0369a1; border-bottom: 1px solid #bae6fd; }
        footer.demo-footer { background: rgba(224, 242, 254, 0.9); color: #0284c7; }
        .component-box { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px); border: 1px solid #bae6fd; border-radius: 20px; padding: 2rem; box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.15); width: 100%; text-align: center; }
        .ui-element { background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: all 0.3s ease; outline: none; display: inline-block; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); }
        .ui-element:hover, .ui-element:focus { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4); }
      `;
      break;
    case '10': // Hologram
      specific = `
        body { color: #a5b4fc; }
        header.demo-header { background: #090a16; color: #818cf8; border-bottom: 1px solid rgba(129, 140, 248, 0.3); }
        footer.demo-footer { background: #090a16; color: #6366f1; }
        .component-box { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(99, 102, 241, 0.5); border-radius: 12px; padding: 2rem; box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); width: 100%; text-align: center; position: relative; overflow: hidden; }
        .component-box::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(129, 140, 248, 0.2), transparent); animation: holoscan 4s infinite; }
        @keyframes holoscan { 0% { left: -100%; } 100% { left: 100%; } }
        .ui-element { background: rgba(99, 102, 241, 0.15); color: #c7d2fe; border: 1px solid #818cf8; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: all 0.3s; outline: none; display: inline-block; box-shadow: inset 0 0 10px rgba(129, 140, 248, 0.3); }
        .ui-element:hover, .ui-element:focus { background: rgba(99, 102, 241, 0.3); color: #fff; box-shadow: 0 0 15px #818cf8; }
      `;
      break;
  }
  return common + specific;
}

export function generateHtmlDesign(slug, style, componentContent) {
  const css = getCssForStyle(style, slug);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slug} - ${style.nameEN} / ${style.nameES}</title>
  <style>
    ${css}
    ${componentContent.css || ''}
  </style>
</head>
<body>
  <header class="demo-header">
    <div><strong>${slug.toUpperCase()}</strong> - Design ${style.id}: ${style.nameEN} / ${style.nameES}</div>
    <div>By Harley Vásquez</div>
  </header>

  <main class="demo-container">
    <div class="component-box">
      ${componentContent.html}
    </div>
  </main>

  <footer class="demo-footer">
    Design #${style.id} | <a href="index.html">Back to ${slug} Gallery</a> | Designed by Harley Vásquez | <a href="https://www.linkedin.com/in/harleyvasquez/" target="_blank">LinkedIn</a>
  </footer>

  <script>
    ${componentContent.js || ''}
  </script>
</body>
</html>`;
}

export function generateGalleryIndex(slug, category) {
  const cardsHtml = STYLES.map(s => `
    <div class="gallery-card">
      <div class="card-header">
        <h3>Design ${s.id}: ${s.nameEN}</h3>
        <p>${s.nameES}</p>
      </div>
      <iframe src="design-${s.id}.html" title="${slug} - Design ${s.id}"></iframe>
      <div class="card-footer">
        <a href="design-${s.id}.html" target="_blank" class="btn">View Fullscreen / Ver Fullscreen</a>
      </div>
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slug.toUpperCase()} Gallery - 10 UI Designs / Harley Vásquez</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; padding: 2rem; min-height: 100vh; }
    header { text-align: center; margin-bottom: 3rem; }
    header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    header p { color: #94a3b8; font-size: 1.1rem; }
    .credits { margin-top: 1rem; color: #cbd5e1; font-size: 0.95rem; }
    .credits a { color: #38bdf8; text-decoration: none; }
    .credits a:hover { text-decoration: underline; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; max-width: 1400px; margin: 0 auto; }
    .gallery-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
    .gallery-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.5); }
    .card-header { padding: 1rem; border-bottom: 1px solid #334155; background: #0f172a; }
    .card-header h3 { font-size: 1.1rem; color: #f1f5f9; }
    .card-header p { font-size: 0.85rem; color: #64748b; }
    iframe { width: 100%; height: 280px; border: none; background: #000; }
    .card-footer { padding: 0.75rem 1rem; background: #0f172a; border-top: 1px solid #334155; text-align: center; }
    .btn { display: inline-block; padding: 0.5rem 1rem; background: #38bdf8; color: #0f172a; font-weight: 600; text-decoration: none; border-radius: 6px; font-size: 0.875rem; transition: background 0.2s; }
    .btn:hover { background: #7dd3fc; }
  </style>
</head>
<body>
  <header>
    <h1>${slug.toUpperCase()} Component Gallery</h1>
    <p>10 Unique Aesthetic Designs & Interactions (Category: ${category})</p>
    <div class="credits">
      Created by Harley Vásquez | <a href="https://www.linkedin.com/in/harleyvasquez/" target="_blank">LinkedIn Profile</a>
    </div>
  </header>

  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>`;
}

export function generateReadme(slug, category) {
  const designsList = STYLES.map(s => `- **Design ${s.id} (${s.nameEN} / ${s.nameES})**: Unique visual styling with fully functional interaction.`).join('\n');

  return `# ${slug.toUpperCase()} Component (${category})

10 self-contained, highly distinct visual designs for the **${slug}** component in both English and Spanish documentation.

## Credits / Créditos
Designed & Developed by **Harley Vásquez**
LinkedIn: [Harley Vásquez](https://www.linkedin.com/in/harleyvasquez/)

---

## English Documentation

### Overview
This folder contains 10 standalone, zero-dependency HTML files illustrating different aesthetic styles and interactive behaviors for the **${slug}** UI component.

### Designs
${designsList}

### Accessibility & Interaction
- Support for hover, active, focus, keyboard navigation, and aria-labels where appropriate.
- Responsive layout scaling from 360px to 1280px screens.

---

## Documentación en Español

### Descripción General
Esta carpeta contiene 10 archivos HTML independientes y sin dependencias externas que muestran diferentes estilos estéticos e interacciones funcionales para el componente de UI **${slug}**.

### Diseños
${designsList}

### Accesibilidad e Interacción
- Soporte para hover, active, focus, navegación por teclado y etiquetas aria.
- Diseño responsivo adaptable de 360px a 1280px.
`;
}
