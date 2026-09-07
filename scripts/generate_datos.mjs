import fs from 'fs';
import path from 'path';
import { STYLES } from './definitions.mjs';
import { generateHtmlDesign, generateGalleryIndex, generateReadme } from './templates.mjs';

function getDatosComponentContent(slug, style) {
  switch (slug) {
    case 'card':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <div id="demo-card" style="padding: 1.5rem; border: 1px solid currentColor; border-radius: 12px; cursor: pointer; transition: transform 0.2s;" aria-label="Interactive Card">
              <h3>Card Title</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">Click to toggle details.</p>
              <div id="card-detail" style="display: none; margin-top: 0.75rem; font-size: 0.85rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.2);">
                Extra information unlocked!
              </div>
            </div>
          </div>
        `,
        js: `
          const card = document.getElementById('demo-card');
          const detail = document.getElementById('card-detail');
          card.addEventListener('click', () => {
            detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
          });
        `
      };
    case 'list':
      return {
        html: `
          <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 320px;">
            <ul id="interactive-list" style="list-style: none; padding: 0;">
              <li class="list-item" style="padding: 0.75rem; border: 1px solid currentColor; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">Item 1 (Click to select)</li>
              <li class="list-item" style="padding: 0.75rem; border: 1px solid currentColor; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">Item 2 (Click to select)</li>
            </ul>
            <div id="list-output" style="font-size: 0.9rem; font-weight: bold;">Selected: None</div>
          </div>
        `,
        js: `
          const items = document.querySelectorAll('#interactive-list .list-item');
          const out = document.getElementById('list-output');
          items.forEach((item, idx) => {
            item.addEventListener('click', () => {
              items.forEach(i => i.style.opacity = '0.6');
              item.style.opacity = '1';
              out.textContent = 'Selected: Item ' + (idx + 1);
            });
          });
        `
      };
    case 'grid':
      return {
        html: `
          <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; width: 100%; max-width: 340px; margin: 0 auto;">
              <div class="grid-cell" style="padding: 1rem; border: 1px solid currentColor; cursor: pointer; text-align: center;">Cell A</div>
              <div class="grid-cell" style="padding: 1rem; border: 1px solid currentColor; cursor: pointer; text-align: center;">Cell B</div>
            </div>
            <div id="grid-output" style="font-weight: bold;">Clicked Cell: None</div>
          </div>
        `,
        js: `
          const cells = document.querySelectorAll('.grid-cell');
          const out = document.getElementById('grid-output');
          cells.forEach(cell => {
            cell.addEventListener('click', () => {
              out.textContent = 'Clicked Cell: ' + cell.textContent;
            });
          });
        `
      };
    case 'table':
      return {
        html: `
          <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 360px;">
            <table id="demo-table" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid currentColor; cursor: pointer;">
                  <th id="th-name" style="padding: 0.5rem;">Name ⇕</th>
                  <th id="th-score" style="padding: 0.5rem;">Score ⇕</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="padding: 0.5rem;">Alice</td><td style="padding: 0.5rem;">92</td></tr>
                <tr><td style="padding: 0.5rem;">Bob</td><td style="padding: 0.5rem;">85</td></tr>
              </tbody>
            </table>
          </div>
        `,
        js: `
          const thName = document.getElementById('th-name');
          const thScore = document.getElementById('th-score');
          let nameAsc = true;
          thName.addEventListener('click', () => {
            nameAsc = !nameAsc;
            thName.textContent = 'Name ' + (nameAsc ? '▲' : '▼');
          });
          thScore.addEventListener('click', () => {
            thScore.textContent = 'Score ▲';
          });
        `
      };
    case 'carousel':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <div id="carousel-slide" style="padding: 2rem; border: 1px solid currentColor; border-radius: 8px; width: 100%; text-align: center; font-size: 1.2rem; font-weight: bold;">
              Slide 1
            </div>
            <div style="display: flex; gap: 1rem;">
              <button id="car-prev" class="ui-element" aria-label="Previous Slide">Prev</button>
              <button id="car-next" class="ui-element" aria-label="Next Slide">Next</button>
            </div>
          </div>
        `,
        js: `
          const slides = ['Slide 1', 'Slide 2', 'Slide 3'];
          let idx = 0;
          const slideEl = document.getElementById('carousel-slide');
          document.getElementById('car-prev').addEventListener('click', () => {
            idx = (idx - 1 + slides.length) % slides.length;
            slideEl.textContent = slides[idx];
          });
          document.getElementById('car-next').addEventListener('click', () => {
            idx = (idx + 1) % slides.length;
            slideEl.textContent = slides[idx];
          });
        `
      };
    case 'accordion':
      return {
        html: `
          <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 350px;">
            <button id="acc-header" class="ui-element" style="width: 100%; text-align: left;" aria-expanded="false" aria-label="Toggle Accordion">
              Accordion Section 1 ▼
            </button>
            <div id="acc-panel" style="display: none; padding: 1rem; border: 1px solid currentColor; border-radius: 6px;">
              Accordion inner details and text content.
            </div>
          </div>
        `,
        js: `
          const header = document.getElementById('acc-header');
          const panel = document.getElementById('acc-panel');
          header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            panel.style.display = !isExpanded ? 'block' : 'none';
            header.textContent = 'Accordion Section 1 ' + (!isExpanded ? '▲' : '▼');
          });
        `
      };
    case 'avatar':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
            <div id="avatar-img" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; position: relative;">
              HV
              <span id="status-dot" style="position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; background: #22c55e; border-radius: 50%; border: 2px solid #000;"></span>
            </div>
            <div id="avatar-info" style="font-size: 0.9rem; font-weight: bold;">Status: Online</div>
          </div>
        `,
        js: `
          const av = document.getElementById('avatar-img');
          const dot = document.getElementById('status-dot');
          const info = document.getElementById('avatar-info');
          let online = true;
          av.addEventListener('click', () => {
            online = !online;
            dot.style.background = online ? '#22c55e' : '#ef4444';
            info.textContent = 'Status: ' + (online ? 'Online' : 'Offline');
          });
        `
      };
    case 'badge':
      return {
        html: `
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
            <button id="badge-btn" class="ui-element" aria-label="Notifications Button" style="position: relative;">
              Notifications
              <span id="badge-count" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: #fff; border-radius: 10px; padding: 2px 6px; font-size: 0.75rem; font-weight: bold;">3</span>
            </button>
            <button id="clear-badge" class="ui-element" aria-label="Clear Notifications" style="padding: 0.5rem 0.75rem; font-size: 0.8rem;">Clear</button>
          </div>
        `,
        js: `
          const count = document.getElementById('badge-count');
          document.getElementById('badge-btn').addEventListener('click', () => {
            let current = parseInt(count.textContent) || 0;
            count.textContent = current + 1;
            count.style.display = 'inline-block';
          });
          document.getElementById('clear-badge').addEventListener('click', () => {
            count.textContent = '0';
          });
        `
      };
    case 'tag':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="display: flex; gap: 0.5rem;" id="tag-container">
              <span class="ui-tag" style="padding: 0.4rem 0.8rem; border: 1px solid currentColor; border-radius: 16px; cursor: pointer;">Design ✕</span>
              <span class="ui-tag" style="padding: 0.4rem 0.8rem; border: 1px solid currentColor; border-radius: 16px; cursor: pointer;">Code ✕</span>
            </div>
            <div id="tag-status" style="font-size: 0.85rem;">Click tag to remove</div>
          </div>
        `,
        js: `
          const tags = document.querySelectorAll('.ui-tag');
          tags.forEach(tag => {
            tag.addEventListener('click', () => {
              tag.style.display = 'none';
            });
          });
        `
      };
    case 'timeline':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <div style="border-left: 2px solid currentColor; padding-left: 1rem; text-align: left; width: 100%;">
              <div class="tl-event" style="cursor: pointer; margin-bottom: 1rem;">
                <strong>2023</strong>: Project Started
              </div>
              <div class="tl-event" style="cursor: pointer;">
                <strong>2024</strong>: Global Launch
              </div>
            </div>
            <div id="tl-detail" style="font-weight: bold; font-size: 0.9rem;">Click an event for details</div>
          </div>
        `,
        js: `
          const events = document.querySelectorAll('.tl-event');
          const detail = document.getElementById('tl-detail');
          events.forEach(ev => {
            ev.addEventListener('click', () => {
              detail.textContent = 'Selected: ' + ev.textContent.trim();
            });
          });
        `
      };
    case 'charts':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 120px; width: 100%; border-bottom: 2px solid currentColor;">
              <div id="bar-1" style="width: 30px; height: 40%; background: currentColor; transition: height 0.3s;"></div>
              <div id="bar-2" style="width: 30px; height: 75%; background: currentColor; transition: height 0.3s;"></div>
            </div>
            <button id="chart-update" class="ui-element" aria-label="Randomize Chart Data">Randomize Data</button>
          </div>
        `,
        js: `
          const b1 = document.getElementById('bar-1');
          const b2 = document.getElementById('bar-2');
          document.getElementById('chart-update').addEventListener('click', () => {
            b1.style.height = Math.floor(Math.random() * 80 + 20) + '%';
            b2.style.height = Math.floor(Math.random() * 80 + 20) + '%';
          });
        `
      };
    case 'calendar':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 300px;">
            <div style="font-weight: bold;">October 2024</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; width: 100%;">
              <button class="cal-day ui-element" aria-label="October 14">14</button>
              <button class="cal-day ui-element" aria-label="October 15">15</button>
              <button class="cal-day ui-element" aria-label="October 16">16</button>
            </div>
            <div id="cal-output" style="font-size: 0.9rem;">Selected Day: None</div>
          </div>
        `,
        js: `
          const days = document.querySelectorAll('.cal-day');
          const out = document.getElementById('cal-output');
          days.forEach(day => {
            day.addEventListener('click', () => {
              out.textContent = 'Selected Day: Oct ' + day.textContent;
            });
          });
        `
      };
    case 'code-block':
      return {
        html: `
          <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 380px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: monospace; font-size: 0.85rem;">JavaScript</span>
              <button id="copy-btn" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Copy Code">Copy</button>
            </div>
            <pre style="padding: 1rem; border: 1px solid currentColor; border-radius: 6px; text-align: left; overflow-x: auto; font-family: monospace; font-size: 0.85rem;"><code id="code-content">console.log("Hello, World!");</code></pre>
          </div>
        `,
        js: `
          const btn = document.getElementById('copy-btn');
          const code = document.getElementById('code-content');
          btn.addEventListener('click', () => {
            navigator.clipboard ? navigator.clipboard.writeText(code.textContent) : null;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
          });
        `
      };
  }
}

const DATOS_SLUGS = [
  'card', 'list', 'grid', 'table', 'carousel', 'accordion',
  'avatar', 'badge', 'tag', 'timeline', 'charts', 'calendar', 'code-block'
];

for (const slug of DATOS_SLUGS) {
  const dir = path.join('ui-components', slug);
  fs.mkdirSync(dir, { recursive: true });

  for (const style of STYLES) {
    const content = getDatosComponentContent(slug, style);
    const html = generateHtmlDesign(slug, style, content);
    fs.writeFileSync(path.join(dir, `design-${style.id}.html`), html);
  }

  const indexHtml = generateGalleryIndex(slug, 'Datos');
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

  const readme = generateReadme(slug, 'Datos');
  fs.writeFileSync(path.join(dir, 'README.md'), readme);
}

console.log('Datos components generated successfully.');
