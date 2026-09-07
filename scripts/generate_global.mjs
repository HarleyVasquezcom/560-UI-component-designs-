import fs from 'fs';
import path from 'path';
import { STYLES } from './definitions.mjs';
import { generateHtmlDesign, generateGalleryIndex, generateReadme } from './templates.mjs';

function getGlobalComponentContent(slug, style) {
  switch (slug) {
    case 'header':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;">
            <header id="sticky-header" style="width: 100%; max-width: 400px; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <strong>AppHeader</strong>
              <button id="header-nav-btn" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Toggle Header Navigation">Nav</button>
            </header>
            <div id="header-status" style="font-size: 0.85rem;">Sticky header active</div>
          </div>
        `,
        js: `
          const btn = document.getElementById('header-nav-btn');
          const status = document.getElementById('header-status');
          btn.addEventListener('click', () => {
            status.textContent = status.textContent === 'Sticky header active' ? 'Menu clicked!' : 'Sticky header active';
          });
        `
      };
    case 'footer':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; max-width: 360px;">
            <footer style="width: 100%; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; text-align: center;">
              <p style="font-size: 0.9rem;">© <span id="footer-year">2024</span> Harley Vásquez. All rights reserved.</p>
              <button id="footer-link" class="ui-element" style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Footer Privacy Link">Privacy Policy</button>
            </footer>
          </div>
        `,
        js: `
          document.getElementById('footer-link').addEventListener('click', () => {
            alert('Privacy Policy clicked');
          });
        `
      };
    case 'logo':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <svg id="interactive-logo" width="80" height="80" viewBox="0 0 100 100" style="cursor: pointer; transition: transform 0.3s;">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" stroke-width="8" />
              <circle cx="50" cy="60" r="15" fill="currentColor" />
            </svg>
            <div id="logo-status" style="font-size: 0.85rem;">Hover or click logo</div>
          </div>
        `,
        js: `
          const logo = document.getElementById('interactive-logo');
          const status = document.getElementById('logo-status');
          logo.addEventListener('click', () => {
            logo.style.transform = 'rotate(180deg)';
            status.textContent = 'Logo Rotated!';
          });
        `
      };
    case 'media-player':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <button id="media-play" class="ui-element" aria-label="Play or Pause Audio">▶ Play</button>
              <span id="media-time" style="font-family: monospace;">00:00</span>
            </div>
            <input type="range" id="media-seek" value="0" min="0" max="100" style="width: 100%; cursor: pointer;" aria-label="Audio Seekbar">
          </div>
        `,
        js: `
          const play = document.getElementById('media-play');
          const time = document.getElementById('media-time');
          const seek = document.getElementById('media-seek');
          let isPlaying = false;
          play.addEventListener('click', () => {
            isPlaying = !isPlaying;
            play.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
          });
          seek.addEventListener('input', () => {
            time.textContent = '00:' + String(seek.value).padStart(2, '0');
          });
        `
      };
    case 'hero':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; max-width: 400px;">
            <h2 style="font-size: 2rem;">Build Amazing Products</h2>
            <p style="font-size: 0.95rem;">Empower your workflow with clean UI designs.</p>
            <button id="hero-cta" class="ui-element" aria-label="Call to Action Get Started">Get Started</button>
          </div>
        `,
        js: `
          document.getElementById('hero-cta').addEventListener('click', () => {
            alert('Get Started CTA Triggered!');
          });
        `
      };
    case 'icons':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="display: flex; gap: 1.5rem; font-size: 1.8rem;">
              <span class="icon-item" data-name="Heart" style="cursor: pointer;">❤️</span>
              <span class="icon-item" data-name="Star" style="cursor: pointer;">⭐</span>
              <span class="icon-item" data-name="Lightning" style="cursor: pointer;">⚡</span>
            </div>
            <div id="icon-name" style="font-size: 0.9rem; font-weight: bold;">Hover or click an icon</div>
          </div>
        `,
        js: `
          const icons = document.querySelectorAll('.icon-item');
          const name = document.getElementById('icon-name');
          icons.forEach(ic => {
            ic.addEventListener('click', () => {
              name.textContent = 'Selected Icon: ' + ic.getAttribute('data-name');
            });
          });
        `
      };
    case 'divider':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 360px;">
            <p style="font-size: 0.85rem;">Section Top</p>
            <div style="display: flex; align-items: center; width: 100%; gap: 1rem;">
              <div style="flex: 1; height: 1px; background: currentColor;"></div>
              <button id="divider-label" class="ui-element" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" aria-label="Toggle Divider Label">OR</button>
              <div style="flex: 1; height: 1px; background: currentColor;"></div>
            </div>
            <p style="font-size: 0.85rem;">Section Bottom</p>
          </div>
        `,
        js: `
          const lbl = document.getElementById('divider-label');
          lbl.addEventListener('click', () => {
            lbl.textContent = lbl.textContent === 'OR' ? 'AND' : 'OR';
          });
        `
      };
    case 'blockquote':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 380px;">
            <blockquote id="quote-box" style="padding: 1rem; border-left: 4px solid currentColor; font-style: italic; width: 100%;">
              "Simplicity is the ultimate sophistication."
              <footer style="margin-top: 0.5rem; font-style: normal; font-weight: bold;">— Leonardo da Vinci</footer>
            </blockquote>
            <button id="quote-copy" class="ui-element" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" aria-label="Copy Citation">Copy Quote</button>
          </div>
        `,
        js: `
          const btn = document.getElementById('quote-copy');
          btn.addEventListener('click', () => {
            btn.textContent = 'Quote Copied!';
            setTimeout(() => { btn.textContent = 'Copy Quote'; }, 2000);
          });
        `
      };
  }
}

const GLOBAL_SLUGS = [
  'header', 'footer', 'logo', 'media-player', 'hero',
  'icons', 'divider', 'blockquote'
];

for (const slug of GLOBAL_SLUGS) {
  const dir = path.join('ui-components', slug);
  fs.mkdirSync(dir, { recursive: true });

  for (const style of STYLES) {
    const content = getGlobalComponentContent(slug, style);
    const html = generateHtmlDesign(slug, style, content);
    fs.writeFileSync(path.join(dir, `design-${style.id}.html`), html);
  }

  const indexHtml = generateGalleryIndex(slug, 'Global');
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

  const readme = generateReadme(slug, 'Global');
  fs.writeFileSync(path.join(dir, 'README.md'), readme);
}

console.log('Global components generated successfully.');
