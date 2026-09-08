import fs from 'fs';
import path from 'path';
import { STYLES } from './definitions.mjs';
import { generateHtmlDesign, generateGalleryIndex, generateReadme } from './templates.mjs';

function getNavegacionComponentContent(slug, style) {
  switch (slug) {
    case 'navbar':
      return {
        html: `
          <nav style="display: flex; gap: 1rem; align-items: center; justify-content: center; width: 100%;">
            <a href="#home" class="nav-link ui-element active" data-target="Home">Home</a>
            <a href="#about" class="nav-link ui-element" data-target="About">About</a>
            <a href="#contact" class="nav-link ui-element" data-target="Contact">Contact</a>
          </nav>
          <div id="nav-status" style="margin-top: 1rem; font-weight: bold;">Active: Home</div>
        `,
        js: `
          const links = document.querySelectorAll('.nav-link');
          const status = document.getElementById('nav-status');
          links.forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              links.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
              status.textContent = 'Active: ' + link.getAttribute('data-target');
            });
          });
        `
      };
    case 'hamburger':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <button id="hamburger-btn" class="ui-element" aria-label="Toggle Navigation Menu">
              ☰ Menu
            </button>
            <div id="hamburger-menu" style="display: none; flex-direction: column; gap: 0.5rem; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; width: 200px;">
              <a href="#" style="color: inherit; text-decoration: none;">Dashboard</a>
              <a href="#" style="color: inherit; text-decoration: none;">Settings</a>
              <a href="#" style="color: inherit; text-decoration: none;">Logout</a>
            </div>
          </div>
        `,
        js: `
          const btn = document.getElementById('hamburger-btn');
          const menu = document.getElementById('hamburger-menu');
          btn.addEventListener('click', () => {
            const isHidden = menu.style.display === 'none';
            menu.style.display = isHidden ? 'flex' : 'none';
            btn.textContent = isHidden ? '✕ Close' : '☰ Menu';
          });
        `
      };
    case 'tabs':
      return {
        html: `
          <div style="width: 100%; max-width: 400px; margin: 0 auto;">
            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1rem;">
              <button class="tab-btn ui-element active" data-tab="1" aria-label="Tab 1">Tab 1</button>
              <button class="tab-btn ui-element" data-tab="2" aria-label="Tab 2">Tab 2</button>
            </div>
            <div id="tab-panel-1" class="tab-panel" style="display: block; padding: 1rem; border: 1px solid currentColor; border-radius: 8px;">
              Content for Panel 1
            </div>
            <div id="tab-panel-2" class="tab-panel" style="display: none; padding: 1rem; border: 1px solid currentColor; border-radius: 8px;">
              Content for Panel 2
            </div>
          </div>
        `,
        js: `
          const btns = document.querySelectorAll('.tab-btn');
          btns.forEach(btn => {
            btn.addEventListener('click', () => {
              btns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              const target = btn.getAttribute('data-tab');
              document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
              document.getElementById('tab-panel-' + target).style.display = 'block';
            });
          });
        `
      };
    case 'breadcrumbs':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <nav aria-label="Breadcrumb" style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.95rem;">
              <a href="#" class="bc-item" data-name="Home" style="color: inherit;">Home</a>
              <span>/</span>
              <a href="#" class="bc-item" data-name="Products" style="color: inherit;">Products</a>
              <span>/</span>
              <span id="bc-current" style="font-weight: bold;">Laptops</span>
            </nav>
            <div id="bc-output" style="font-size: 0.9rem;">Current Page: Laptops</div>
          </div>
        `,
        js: `
          const items = document.querySelectorAll('.bc-item');
          const out = document.getElementById('bc-output');
          items.forEach(item => {
            item.addEventListener('click', (e) => {
              e.preventDefault();
              out.textContent = 'Navigated to: ' + item.getAttribute('data-name');
            });
          });
        `
      };
    case 'sidebar':
      return {
        html: `
          <div style="display: flex; gap: 1rem; align-items: stretch; justify-content: center; width: 100%; max-width: 450px;">
            <aside id="sidebar" style="width: 140px; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; transition: all 0.3s;">
              <button id="sb-toggle" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-bottom: 0.5rem;" aria-label="Toggle Sidebar">Collapse</button>
              <div class="sb-nav" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <a href="#" style="color: inherit;">Overview</a>
                <a href="#" style="color: inherit;">Reports</a>
              </div>
            </aside>
            <main style="flex: 1; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; text-align: left;">
              <h4>Dashboard Content</h4>
              <p style="font-size: 0.85rem; margin-top: 0.5rem;">Sidebar toggle test.</p>
            </main>
          </div>
        `,
        js: `
          const sb = document.getElementById('sidebar');
          const btn = document.getElementById('sb-toggle');
          const nav = sb.querySelector('.sb-nav');
          btn.addEventListener('click', () => {
            const isCollapsed = nav.style.display === 'none';
            nav.style.display = isCollapsed ? 'flex' : 'none';
            sb.style.width = isCollapsed ? '140px' : '60px';
            btn.textContent = isCollapsed ? 'Collapse' : 'Expand';
          });
        `
      };
    case 'pagination':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="display: flex; gap: 0.5rem;">
              <button class="pg-btn ui-element active" data-page="1" aria-label="Page 1">1</button>
              <button class="pg-btn ui-element" data-page="2" aria-label="Page 2">2</button>
              <button class="pg-btn ui-element" data-page="3" aria-label="Page 3">3</button>
            </div>
            <div id="pg-output" style="font-weight: bold;">Page 1 Loaded</div>
          </div>
        `,
        js: `
          const btns = document.querySelectorAll('.pg-btn');
          const out = document.getElementById('pg-output');
          btns.forEach(btn => {
            btn.addEventListener('click', () => {
              btns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              out.textContent = 'Page ' + btn.getAttribute('data-page') + ' Loaded';
            });
          });
        `
      };
    case 'infinite-scroll':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <div id="scroll-list" style="height: 150px; overflow-y: auto; border: 1px solid currentColor; width: 100%; padding: 0.5rem;">
              <div class="scroll-item" style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">Item 1</div>
              <div class="scroll-item" style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">Item 2</div>
              <div class="scroll-item" style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">Item 3</div>
            </div>
            <button id="load-more-btn" class="ui-element" aria-label="Load More Items">Load More</button>
          </div>
        `,
        js: `
          const list = document.getElementById('scroll-list');
          const btn = document.getElementById('load-more-btn');
          let count = 3;
          btn.addEventListener('click', () => {
            for (let i = 0; i < 2; i++) {
              count++;
              const div = document.createElement('div');
              div.className = 'scroll-item';
              div.style.cssText = 'padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);';
              div.textContent = 'Item ' + count;
              list.appendChild(div);
            }
          });
        `
      };
    case 'bottom-nav':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;">
            <nav style="display: flex; justify-content: space-around; width: 100%; max-width: 360px; padding: 0.75rem; border: 1px solid currentColor; border-radius: 20px;">
              <button class="bnav-btn ui-element active" data-item="Home" aria-label="Home Nav">🏠 Home</button>
              <button class="bnav-btn ui-element" data-item="Search" aria-label="Search Nav">🔍 Search</button>
              <button class="bnav-btn ui-element" data-item="Profile" aria-label="Profile Nav">👤 Profile</button>
            </nav>
            <div id="bnav-output" style="font-weight: bold;">Active View: Home</div>
          </div>
        `,
        js: `
          const btns = document.querySelectorAll('.bnav-btn');
          const out = document.getElementById('bnav-output');
          btns.forEach(btn => {
            btn.addEventListener('click', () => {
              btns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              out.textContent = 'Active View: ' + btn.getAttribute('data-item');
            });
          });
        `
      };
    case 'anchor':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;">
            <a href="#target-section" id="anchor-link" class="ui-element" aria-label="Scroll to target section">Scroll to Section</a>
            <div style="height: 100px; overflow-y: scroll; width: 100%; max-width: 320px; border: 1px solid currentColor; padding: 0.5rem;" id="scroll-box">
              <p style="margin-bottom: 120px;">Top of container...</p>
              <p id="target-section" style="font-weight: bold; color: #ff0055;">Target Section Reached!</p>
            </div>
          </div>
        `,
        js: `
          const link = document.getElementById('anchor-link');
          const target = document.getElementById('target-section');
          const box = document.getElementById('scroll-box');
          link.addEventListener('click', (e) => {
            e.preventDefault();
            box.scrollTop = target.offsetTop;
            target.style.outline = '2px solid currentColor';
          });
        `
      };
    case 'toc':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 360px;">
            <div style="text-align: left; width: 100%; padding: 0.5rem; border: 1px solid currentColor;">
              <strong>Table of Contents</strong>
              <ul style="list-style: none; padding-left: 0.5rem; margin-top: 0.5rem;">
                <li><a href="#" class="toc-item" data-section="Section 1" style="color: inherit;">1. Introduction</a></li>
                <li><a href="#" class="toc-item" data-section="Section 2" style="color: inherit;">2. Features</a></li>
              </ul>
            </div>
            <div id="toc-output" style="font-weight: bold;">Viewing: Introduction</div>
          </div>
        `,
        js: `
          const items = document.querySelectorAll('.toc-item');
          const out = document.getElementById('toc-output');
          items.forEach(item => {
            item.addEventListener('click', (e) => {
              e.preventDefault();
              out.textContent = 'Viewing: ' + item.getAttribute('data-section');
            });
          });
        `
      };
  }
}

const NAVEGACION_SLUGS = [
  'navbar', 'hamburger', 'tabs', 'breadcrumbs', 'sidebar',
  'pagination', 'infinite-scroll', 'bottom-nav', 'anchor', 'toc'
];

for (const slug of NAVEGACION_SLUGS) {
  const dir = path.join('ui-components', slug);
  fs.mkdirSync(dir, { recursive: true });

  for (const style of STYLES) {
    const content = getNavegacionComponentContent(slug, style);
    const html = generateHtmlDesign(slug, style, content);
    fs.writeFileSync(path.join(dir, `design-${style.id}.html`), html);
  }

  const indexHtml = generateGalleryIndex(slug, 'Navegación');
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

  const readme = generateReadme(slug, 'Navegación');
  fs.writeFileSync(path.join(dir, 'README.md'), readme);
}

console.log('Navegación components generated successfully.');
