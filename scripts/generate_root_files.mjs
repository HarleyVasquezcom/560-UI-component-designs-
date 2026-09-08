import fs from 'fs';
import path from 'path';
import { CATEGORIES, STYLES } from './definitions.mjs';
import { getCssForStyle } from './templates.mjs';

const allSlugs = Object.values(CATEGORIES).flat();

function getComponentContent(slug) {
  switch (slug) {
    // Entrada
    case 'button':
      return { html: `<button id="btn-interactive" class="ui-element" aria-label="Interactive Button">Click Me (<span id="click-count">0</span>)</button>`, js: `let count = 0; const btn = document.getElementById('btn-interactive'); const counter = document.getElementById('click-count'); btn.addEventListener('click', () => { count++; counter.textContent = count; btn.classList.toggle('clicked'); });` };
    case 'checkbox':
      return { html: `<label style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; font-size: 1.1rem;"><input type="checkbox" id="chk-interactive" class="ui-checkbox" style="width: 22px; height: 22px; cursor: pointer;" aria-label="Toggle Checkbox"><span id="chk-label" style="user-select: none;">Option is Unchecked</span></label>`, js: `const chk = document.getElementById('chk-interactive'); const label = document.getElementById('chk-label'); chk.addEventListener('change', () => { label.textContent = chk.checked ? 'Option is Checked!' : 'Option is Unchecked'; label.style.fontWeight = chk.checked ? 'bold' : 'normal'; });` };
    case 'radio':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;"><label style="cursor: pointer;"><input type="radio" name="opt" value="Option A" class="ui-radio" aria-label="Option A" checked> Option A</label><label style="cursor: pointer;"><input type="radio" name="opt" value="Option B" class="ui-radio" aria-label="Option B"> Option B</label><div id="radio-output" style="margin-top: 0.5rem; font-weight: bold;">Selected: Option A</div></div>`, js: `const radios = document.querySelectorAll('.ui-radio'); const out = document.getElementById('radio-output'); radios.forEach(r => r.addEventListener('change', (e) => { out.textContent = 'Selected: ' + e.target.value; }));` };
    case 'switch':
      return { html: `<div style="display: flex; align-items: center; gap: 1rem; justify-content: center;"><span>Off</span><button id="switch-btn" class="ui-element" role="switch" aria-checked="false" aria-label="Toggle Switch"><span id="switch-status">OFF</span></button><span>On</span></div>`, js: `const sw = document.getElementById('switch-btn'); const status = document.getElementById('switch-status'); sw.addEventListener('click', () => { const isChecked = sw.getAttribute('aria-checked') === 'true'; sw.setAttribute('aria-checked', !isChecked); status.textContent = !isChecked ? 'ON' : 'OFF'; sw.style.opacity = !isChecked ? '1' : '0.7'; });` };
    case 'text-field':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 320px; margin: 0 auto;"><label for="txt-input">Enter Text:</label><input type="text" id="txt-input" class="ui-element" placeholder="Type something..." aria-label="Text Input" style="width: 100%;"><div id="txt-output" style="font-size: 0.9rem; min-height: 1.2rem;">Value: </div></div>`, js: `const input = document.getElementById('txt-input'); const out = document.getElementById('txt-output'); input.addEventListener('input', (e) => { out.textContent = 'Value: ' + e.target.value; });` };
    case 'text-area':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 380px; margin: 0 auto;"><label for="txt-area">Your Message:</label><textarea id="txt-area" class="ui-element" rows="4" placeholder="Write multiple lines..." aria-label="Textarea Input" style="width: 100%; resize: vertical;"></textarea><div id="area-counter" style="font-size: 0.85rem; text-align: right;">0 characters</div></div>`, js: `const area = document.getElementById('txt-area'); const counter = document.getElementById('area-counter'); area.addEventListener('input', () => { counter.textContent = area.value.length + ' characters'; });` };
    case 'dropdown':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 300px; margin: 0 auto;"><label for="dd-select">Select Category:</label><select id="dd-select" class="ui-element" aria-label="Dropdown Select" style="width: 100%; cursor: pointer;"><option value="Design">Design</option><option value="Development">Development</option><option value="Marketing">Marketing</option></select><div id="dd-output" style="font-size: 0.9rem;">Selected: Design</div></div>`, js: `const sel = document.getElementById('dd-select'); const out = document.getElementById('dd-output'); sel.addEventListener('change', () => { out.textContent = 'Selected: ' + sel.value; });` };
    case 'date-picker':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 280px; margin: 0 auto;"><label for="dt-picker">Choose Date:</label><input type="date" id="dt-picker" class="ui-element" aria-label="Date Picker" style="width: 100%;"><div id="dt-output" style="font-size: 0.9rem;">Date: None</div></div>`, js: `const dt = document.getElementById('dt-picker'); const out = document.getElementById('dt-output'); dt.addEventListener('change', () => { out.textContent = 'Date: ' + (dt.value || 'None'); });` };
    case 'time-picker':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 280px; margin: 0 auto;"><label for="tm-picker">Select Time:</label><input type="time" id="tm-picker" class="ui-element" aria-label="Time Picker" style="width: 100%;"><div id="tm-output" style="font-size: 0.9rem;">Time: None</div></div>`, js: `const tm = document.getElementById('tm-picker'); const out = document.getElementById('tm-output'); tm.addEventListener('change', () => { out.textContent = 'Time: ' + (tm.value || 'None'); });` };
    case 'slider':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 320px; margin: 0 auto;"><label for="slider-input">Adjust Value:</label><input type="range" id="slider-input" min="0" max="100" value="50" class="ui-slider" aria-label="Slider Control" style="width: 100%; cursor: pointer;"><div id="slider-out" style="font-size: 1.1rem; font-weight: bold;">Value: 50</div></div>`, js: `const slider = document.getElementById('slider-input'); const out = document.getElementById('slider-out'); slider.addEventListener('input', () => { out.textContent = 'Value: ' + slider.value; });` };
    case 'stepper':
      return { html: `<div style="display: flex; align-items: center; justify-content: center; gap: 1rem;"><button id="step-dec" class="ui-element" aria-label="Decrease Value">-</button><span id="step-value" style="font-size: 1.5rem; font-weight: bold; min-width: 3rem; text-align: center;">0</span><button id="step-inc" class="ui-element" aria-label="Increase Value">+</button></div>`, js: `let val = 0; const num = document.getElementById('step-value'); document.getElementById('step-dec').addEventListener('click', () => { val--; num.textContent = val; }); document.getElementById('step-inc').addEventListener('click', () => { val++; num.textContent = val; });` };
    case 'file-uploader':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; max-width: 320px; margin: 0 auto;"><label for="file-input" class="ui-element" style="cursor: pointer; display: inline-block;">Select File</label><input type="file" id="file-input" aria-label="File Upload Input" style="display: none;"><div id="file-name" style="font-size: 0.9rem; word-break: break-all;">No file chosen</div></div>`, js: `const input = document.getElementById('file-input'); const name = document.getElementById('file-name'); input.addEventListener('change', () => { name.textContent = input.files.length ? input.files[0].name : 'No file chosen'; });` };
    case 'search-bar':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 350px; margin: 0 auto;"><input type="search" id="search-input" class="ui-element" placeholder="Search items..." aria-label="Search Input" style="width: 100%;"><ul id="search-results" style="list-style: none; padding: 0; text-align: left; background: rgba(0,0,0,0.2); border-radius: 6px; overflow: hidden;"><li style="padding: 0.5rem 1rem;">Apple</li><li style="padding: 0.5rem 1rem;">Banana</li><li style="padding: 0.5rem 1rem;">Cherry</li></ul></div>`, js: `const input = document.getElementById('search-input'); const items = document.querySelectorAll('#search-results li'); input.addEventListener('input', () => { const q = input.value.toLowerCase(); items.forEach(li => { li.style.display = li.textContent.toLowerCase().includes(q) ? 'block' : 'none'; }); });` };
    case 'color-picker':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;"><label for="color-input">Pick a Color:</label><input type="color" id="color-input" value="#38bdf8" aria-label="Color Picker" style="width: 60px; height: 40px; cursor: pointer; border: none; border-radius: 4px;"><div id="color-code" style="font-family: monospace; font-size: 1.1rem; font-weight: bold;">#38BDF8</div></div>`, js: `const picker = document.getElementById('color-input'); const code = document.getElementById('color-code'); picker.addEventListener('input', () => { code.textContent = picker.value.toUpperCase(); });` };
    case 'filters':
      return { html: `<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 380px; margin: 0 auto;"><div style="display: flex; gap: 0.5rem; justify-content: center;"><button class="filter-btn ui-element" data-category="all" aria-label="Filter All">All</button><button class="filter-btn ui-element" data-category="tech" aria-label="Filter Tech">Tech</button><button class="filter-btn ui-element" data-category="life" aria-label="Filter Life">Life</button></div><div id="filter-items" style="display: flex; flex-direction: column; gap: 0.5rem;"><div class="item" data-cat="tech" style="padding: 0.5rem; border: 1px solid currentColor;">Tech Article 1</div><div class="item" data-cat="life" style="padding: 0.5rem; border: 1px solid currentColor;">Lifestyle Post</div><div class="item" data-cat="tech" style="padding: 0.5rem; border: 1px solid currentColor;">Tech Gadget</div></div></div>`, js: `const btns = document.querySelectorAll('.filter-btn'); const items = document.querySelectorAll('#filter-items .item'); btns.forEach(btn => { btn.addEventListener('click', () => { const cat = btn.getAttribute('data-category'); items.forEach(item => { item.style.display = (cat === 'all' || item.getAttribute('data-cat') === cat) ? 'block' : 'none'; }); }); });` };

    // Navegación
    case 'navbar':
      return { html: `<nav style="display: flex; gap: 1rem; align-items: center; justify-content: center; width: 100%;"><a href="#home" class="nav-link ui-element active" data-target="Home">Home</a><a href="#about" class="nav-link ui-element" data-target="About">About</a><a href="#contact" class="nav-link ui-element" data-target="Contact">Contact</a></nav><div id="nav-status" style="margin-top: 1rem; font-weight: bold;">Active: Home</div>`, js: `const links = document.querySelectorAll('.nav-link'); const status = document.getElementById('nav-status'); links.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); links.forEach(l => l.classList.remove('active')); link.classList.add('active'); status.textContent = 'Active: ' + link.getAttribute('data-target'); }); });` };
    case 'hamburger':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><button id="hamburger-btn" class="ui-element" aria-label="Toggle Navigation Menu">☰ Menu</button><div id="hamburger-menu" style="display: none; flex-direction: column; gap: 0.5rem; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; width: 200px;"><a href="#" style="color: inherit; text-decoration: none;">Dashboard</a><a href="#" style="color: inherit; text-decoration: none;">Settings</a><a href="#" style="color: inherit; text-decoration: none;">Logout</a></div></div>`, js: `const btn = document.getElementById('hamburger-btn'); const menu = document.getElementById('hamburger-menu'); btn.addEventListener('click', () => { const isHidden = menu.style.display === 'none'; menu.style.display = isHidden ? 'flex' : 'none'; btn.textContent = isHidden ? '✕ Close' : '☰ Menu'; });` };
    case 'tabs':
      return { html: `<div style="width: 100%; max-width: 400px; margin: 0 auto;"><div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1rem;"><button class="tab-btn ui-element active" data-tab="1" aria-label="Tab 1">Tab 1</button><button class="tab-btn ui-element" data-tab="2" aria-label="Tab 2">Tab 2</button></div><div id="tab-panel-1" class="tab-panel" style="display: block; padding: 1rem; border: 1px solid currentColor; border-radius: 8px;">Content for Panel 1</div><div id="tab-panel-2" class="tab-panel" style="display: none; padding: 1rem; border: 1px solid currentColor; border-radius: 8px;">Content for Panel 2</div></div>`, js: `const btns = document.querySelectorAll('.tab-btn'); btns.forEach(btn => { btn.addEventListener('click', () => { btns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); const target = btn.getAttribute('data-tab'); document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none'); document.getElementById('tab-panel-' + target).style.display = 'block'; }); });` };
    case 'breadcrumbs':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><nav aria-label="Breadcrumb" style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.95rem;"><a href="#" class="bc-item" data-name="Home" style="color: inherit;">Home</a><span>/</span><a href="#" class="bc-item" data-name="Products" style="color: inherit;">Products</a><span>/</span><span id="bc-current" style="font-weight: bold;">Laptops</span></nav><div id="bc-output" style="font-size: 0.9rem;">Current Page: Laptops</div></div>`, js: `const items = document.querySelectorAll('.bc-item'); const out = document.getElementById('bc-output'); items.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); out.textContent = 'Navigated to: ' + item.getAttribute('data-name'); }); });` };
    case 'sidebar':
      return { html: `<div style="display: flex; gap: 1rem; align-items: stretch; justify-content: center; width: 100%; max-width: 450px;"><aside id="sidebar" style="width: 140px; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; transition: all 0.3s;"><button id="sb-toggle" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-bottom: 0.5rem;" aria-label="Toggle Sidebar">Collapse</button><div class="sb-nav" style="display: flex; flex-direction: column; gap: 0.5rem;"><a href="#" style="color: inherit;">Overview</a><a href="#" style="color: inherit;">Reports</a></div></aside><main style="flex: 1; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; text-align: left;"><h4>Dashboard Content</h4><p style="font-size: 0.85rem; margin-top: 0.5rem;">Sidebar toggle test.</p></main></div>`, js: `const sb = document.getElementById('sidebar'); const btn = document.getElementById('sb-toggle'); const nav = sb.querySelector('.sb-nav'); btn.addEventListener('click', () => { const isCollapsed = nav.style.display === 'none'; nav.style.display = isCollapsed ? 'flex' : 'none'; sb.style.width = isCollapsed ? '140px' : '60px'; btn.textContent = isCollapsed ? 'Collapse' : 'Expand'; });` };
    case 'pagination':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><div style="display: flex; gap: 0.5rem;"><button class="pg-btn ui-element active" data-page="1" aria-label="Page 1">1</button><button class="pg-btn ui-element" data-page="2" aria-label="Page 2">2</button><button class="pg-btn ui-element" data-page="3" aria-label="Page 3">3</button></div><div id="pg-output" style="font-weight: bold;">Page 1 Loaded</div></div>`, js: `const btns = document.querySelectorAll('.pg-btn'); const out = document.getElementById('pg-output'); btns.forEach(btn => { btn.addEventListener('click', () => { btns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); out.textContent = 'Page ' + btn.getAttribute('data-page') + ' Loaded'; }); });` };
    case 'infinite-scroll':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><div id="scroll-list" style="height: 150px; overflow-y: auto; border: 1px solid currentColor; width: 100%; padding: 0.5rem;"><div class="scroll-item" style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">Item 1</div><div class="scroll-item" style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">Item 2</div><div class="scroll-item" style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">Item 3</div></div><button id="load-more-btn" class="ui-element" aria-label="Load More Items">Load More</button></div>`, js: `const list = document.getElementById('scroll-list'); const btn = document.getElementById('load-more-btn'); let count = 3; btn.addEventListener('click', () => { for (let i = 0; i < 2; i++) { count++; const div = document.createElement('div'); div.className = 'scroll-item'; div.style.cssText = 'padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);'; div.textContent = 'Item ' + count; list.appendChild(div); } });` };
    case 'bottom-nav':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;"><nav style="display: flex; justify-content: space-around; width: 100%; max-width: 360px; padding: 0.75rem; border: 1px solid currentColor; border-radius: 20px;"><button class="bnav-btn ui-element active" data-item="Home" aria-label="Home Nav">🏠 Home</button><button class="bnav-btn ui-element" data-item="Search" aria-label="Search Nav">🔍 Search</button><button class="bnav-btn ui-element" data-item="Profile" aria-label="Profile Nav">👤 Profile</button></nav><div id="bnav-output" style="font-weight: bold;">Active View: Home</div></div>`, js: `const btns = document.querySelectorAll('.bnav-btn'); const out = document.getElementById('bnav-output'); btns.forEach(btn => { btn.addEventListener('click', () => { btns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); out.textContent = 'Active View: ' + btn.getAttribute('data-item'); }); });` };
    case 'anchor':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;"><a href="#target-section" id="anchor-link" class="ui-element" aria-label="Scroll to target section">Scroll to Section</a><div style="height: 100px; overflow-y: scroll; width: 100%; max-width: 320px; border: 1px solid currentColor; padding: 0.5rem;" id="scroll-box"><p style="margin-bottom: 120px;">Top of container...</p><p id="target-section" style="font-weight: bold; color: #ff0055;">Target Section Reached!</p></div></div>`, js: `const link = document.getElementById('anchor-link'); const target = document.getElementById('target-section'); const box = document.getElementById('scroll-box'); link.addEventListener('click', (e) => { e.preventDefault(); box.scrollTop = target.offsetTop; target.style.outline = '2px solid currentColor'; });` };
    case 'toc':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 360px;"><div style="text-align: left; width: 100%; padding: 0.5rem; border: 1px solid currentColor;"><strong>Table of Contents</strong><ul style="list-style: none; padding-left: 0.5rem; margin-top: 0.5rem;"><li><a href="#" class="toc-item" data-section="Section 1" style="color: inherit;">1. Introduction</a></li><li><a href="#" class="toc-item" data-section="Section 2" style="color: inherit;">2. Features</a></li></ul></div><div id="toc-output" style="font-weight: bold;">Viewing: Introduction</div></div>`, js: `const items = document.querySelectorAll('.toc-item'); const out = document.getElementById('toc-output'); items.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); out.textContent = 'Viewing: ' + item.getAttribute('data-section'); }); });` };

    // Datos
    case 'card':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><div id="demo-card" style="padding: 1.5rem; border: 1px solid currentColor; border-radius: 12px; cursor: pointer; transition: transform 0.2s;" aria-label="Interactive Card"><h3>Card Title</h3><p style="font-size: 0.9rem; margin-top: 0.5rem;">Click to toggle details.</p><div id="card-detail" style="display: none; margin-top: 0.75rem; font-size: 0.85rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.2);">Extra information unlocked!</div></div></div>`, js: `const card = document.getElementById('demo-card'); const detail = document.getElementById('card-detail'); card.addEventListener('click', () => { detail.style.display = detail.style.display === 'none' ? 'block' : 'none'; });` };
    case 'list':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 320px;"><ul id="interactive-list" style="list-style: none; padding: 0;"><li class="list-item" style="padding: 0.75rem; border: 1px solid currentColor; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">Item 1 (Click to select)</li><li class="list-item" style="padding: 0.75rem; border: 1px solid currentColor; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer;">Item 2 (Click to select)</li></ul><div id="list-output" style="font-size: 0.9rem; font-weight: bold;">Selected: None</div></div>`, js: `const items = document.querySelectorAll('#interactive-list .list-item'); const out = document.getElementById('list-output'); items.forEach((item, idx) => { item.addEventListener('click', () => { items.forEach(i => i.style.opacity = '0.6'); item.style.opacity = '1'; out.textContent = 'Selected: Item ' + (idx + 1); }); });` };
    case 'grid':
      return { html: `<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;"><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; width: 100%; max-width: 340px; margin: 0 auto;"><div class="grid-cell" style="padding: 1rem; border: 1px solid currentColor; cursor: pointer; text-align: center;">Cell A</div><div class="grid-cell" style="padding: 1rem; border: 1px solid currentColor; cursor: pointer; text-align: center;">Cell B</div></div><div id="grid-output" style="font-weight: bold;">Clicked Cell: None</div></div>`, js: `const cells = document.querySelectorAll('.grid-cell'); const out = document.getElementById('grid-output'); cells.forEach(cell => { cell.addEventListener('click', () => { out.textContent = 'Clicked Cell: ' + cell.textContent; }); });` };
    case 'table':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 360px;"><table id="demo-table" style="width: 100%; border-collapse: collapse; text-align: left;"><thead><tr style="border-bottom: 2px solid currentColor; cursor: pointer;"><th id="th-name" style="padding: 0.5rem;">Name ⇕</th><th id="th-score" style="padding: 0.5rem;">Score ⇕</th></tr></thead><tbody><tr><td style="padding: 0.5rem;">Alice</td><td style="padding: 0.5rem;">92</td></tr><tr><td style="padding: 0.5rem;">Bob</td><td style="padding: 0.5rem;">85</td></tr></tbody></table></div>`, js: `const thName = document.getElementById('th-name'); const thScore = document.getElementById('th-score'); let nameAsc = true; thName.addEventListener('click', () => { nameAsc = !nameAsc; thName.textContent = 'Name ' + (nameAsc ? '▲' : '▼'); }); thScore.addEventListener('click', () => { thScore.textContent = 'Score ▲'; });` };
    case 'carousel':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><div id="carousel-slide" style="padding: 2rem; border: 1px solid currentColor; border-radius: 8px; width: 100%; text-align: center; font-size: 1.2rem; font-weight: bold;">Slide 1</div><div style="display: flex; gap: 1rem;"><button id="car-prev" class="ui-element" aria-label="Previous Slide">Prev</button><button id="car-next" class="ui-element" aria-label="Next Slide">Next</button></div></div>`, js: `const slides = ['Slide 1', 'Slide 2', 'Slide 3']; let idx = 0; const slideEl = document.getElementById('carousel-slide'); document.getElementById('car-prev').addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; slideEl.textContent = slides[idx]; }); document.getElementById('car-next').addEventListener('click', () => { idx = (idx + 1) % slides.length; slideEl.textContent = slides[idx]; });` };
    case 'accordion':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 350px;"><button id="acc-header" class="ui-element" style="width: 100%; text-align: left;" aria-expanded="false" aria-label="Toggle Accordion">Accordion Section 1 ▼</button><div id="acc-panel" style="display: none; padding: 1rem; border: 1px solid currentColor; border-radius: 6px;">Accordion inner details and text content.</div></div>`, js: `const header = document.getElementById('acc-header'); const panel = document.getElementById('acc-panel'); header.addEventListener('click', () => { const isExpanded = header.getAttribute('aria-expanded') === 'true'; header.setAttribute('aria-expanded', !isExpanded); panel.style.display = !isExpanded ? 'block' : 'none'; header.textContent = 'Accordion Section 1 ' + (!isExpanded ? '▲' : '▼'); });` };
    case 'avatar':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;"><div id="avatar-img" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; position: relative;">HV<span id="status-dot" style="position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; background: #22c55e; border-radius: 50%; border: 2px solid #000;"></span></div><div id="avatar-info" style="font-size: 0.9rem; font-weight: bold;">Status: Online</div></div>`, js: `const av = document.getElementById('avatar-img'); const dot = document.getElementById('status-dot'); const info = document.getElementById('avatar-info'); let online = true; av.addEventListener('click', () => { online = !online; dot.style.background = online ? '#22c55e' : '#ef4444'; info.textContent = 'Status: ' + (online ? 'Online' : 'Offline'); });` };
    case 'badge':
      return { html: `<div style="display: flex; align-items: center; justify-content: center; gap: 1rem;"><button id="badge-btn" class="ui-element" aria-label="Notifications Button" style="position: relative;">Notifications<span id="badge-count" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: #fff; border-radius: 10px; padding: 2px 6px; font-size: 0.75rem; font-weight: bold;">3</span></button><button id="clear-badge" class="ui-element" aria-label="Clear Notifications" style="padding: 0.5rem 0.75rem; font-size: 0.8rem;">Clear</button></div>`, js: `const count = document.getElementById('badge-count'); document.getElementById('badge-btn').addEventListener('click', () => { let current = parseInt(count.textContent) || 0; count.textContent = current + 1; count.style.display = 'inline-block'; }); document.getElementById('clear-badge').addEventListener('click', () => { count.textContent = '0'; });` };
    case 'tag':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><div style="display: flex; gap: 0.5rem;" id="tag-container"><span class="ui-tag" style="padding: 0.4rem 0.8rem; border: 1px solid currentColor; border-radius: 16px; cursor: pointer;">Design ✕</span><span class="ui-tag" style="padding: 0.4rem 0.8rem; border: 1px solid currentColor; border-radius: 16px; cursor: pointer;">Code ✕</span></div><div id="tag-status" style="font-size: 0.85rem;">Click tag to remove</div></div>`, js: `const tags = document.querySelectorAll('.ui-tag'); tags.forEach(tag => { tag.addEventListener('click', () => { tag.style.display = 'none'; }); });` };
    case 'timeline':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><div style="border-left: 2px solid currentColor; padding-left: 1rem; text-align: left; width: 100%;"><div class="tl-event" style="cursor: pointer; margin-bottom: 1rem;"><strong>2023</strong>: Project Started</div><div class="tl-event" style="cursor: pointer;"><strong>2024</strong>: Global Launch</div></div><div id="tl-detail" style="font-weight: bold; font-size: 0.9rem;">Click an event for details</div></div>`, js: `const events = document.querySelectorAll('.tl-event'); const detail = document.getElementById('tl-detail'); events.forEach(ev => { ev.addEventListener('click', () => { detail.textContent = 'Selected: ' + ev.textContent.trim(); }); });` };
    case 'charts':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><div style="display: flex; align-items: flex-end; justify-content: space-around; height: 120px; width: 100%; border-bottom: 2px solid currentColor;"><div id="bar-1" style="width: 30px; height: 40%; background: currentColor; transition: height 0.3s;"></div><div id="bar-2" style="width: 30px; height: 75%; background: currentColor; transition: height 0.3s;"></div></div><button id="chart-update" class="ui-element" aria-label="Randomize Chart Data">Randomize Data</button></div>`, js: `const b1 = document.getElementById('bar-1'); const b2 = document.getElementById('bar-2'); document.getElementById('chart-update').addEventListener('click', () => { b1.style.height = Math.floor(Math.random() * 80 + 20) + '%'; b2.style.height = Math.floor(Math.random() * 80 + 20) + '%'; });` };
    case 'calendar':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 300px;"><div style="font-weight: bold;">October 2024</div><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; width: 100%;"><button class="cal-day ui-element" aria-label="October 14">14</button><button class="cal-day ui-element" aria-label="October 15">15</button><button class="cal-day ui-element" aria-label="October 16">16</button></div><div id="cal-output" style="font-size: 0.9rem;">Selected Day: None</div></div>`, js: `const days = document.querySelectorAll('.cal-day'); const out = document.getElementById('cal-output'); days.forEach(day => { day.addEventListener('click', () => { out.textContent = 'Selected Day: Oct ' + day.textContent; }); });` };
    case 'code-block':
      return { html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 380px;"><div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-family: monospace; font-size: 0.85rem;">JavaScript</span><button id="copy-btn" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Copy Code">Copy</button></div><pre style="padding: 1rem; border: 1px solid currentColor; border-radius: 6px; text-align: left; overflow-x: auto; font-family: monospace; font-size: 0.85rem;"><code id="code-content">console.log("Hello, World!");</code></pre></div>`, js: `const btn = document.getElementById('copy-btn'); const code = document.getElementById('code-content'); btn.addEventListener('click', () => { navigator.clipboard ? navigator.clipboard.writeText(code.textContent) : null; btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy'; }, 2000); });` };

    // Feedback
    case 'alert':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 350px;"><div id="alert-banner" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; width: 100%;"><span>⚠️ System update available!</span><button id="alert-close" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Dismiss Alert">Dismiss</button></div><div id="alert-status" style="font-size: 0.85rem; display: none;">Alert dismissed.</div></div>`, js: `const banner = document.getElementById('alert-banner'); const status = document.getElementById('alert-status'); document.getElementById('alert-close').addEventListener('click', () => { banner.style.display = 'none'; status.style.display = 'block'; });` };
    case 'toast':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><button id="toast-trigger" class="ui-element" aria-label="Trigger Toast Notification">Show Toast</button><div id="toast-msg" style="display: none; padding: 0.75rem 1.25rem; border: 1px solid currentColor; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">Action completed successfully!</div></div>`, js: `const btn = document.getElementById('toast-trigger'); const toast = document.getElementById('toast-msg'); btn.addEventListener('click', () => { toast.style.display = 'block'; setTimeout(() => { toast.style.display = 'none'; }, 2500); });` };
    case 'modal':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><button id="modal-open" class="ui-element" aria-label="Open Dialog Modal">Open Modal</button><div id="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); align-items: center; justify-content: center; z-index: 2000;"><div style="background: inherit; border: 1px solid currentColor; padding: 2rem; border-radius: 12px; max-width: 320px; text-align: center;"><h3>Modal Window</h3><p style="margin: 1rem 0; font-size: 0.9rem;">This is a modal popover window.</p><button id="modal-close" class="ui-element" aria-label="Close Dialog Modal">Close</button></div></div></div>`, js: `const open = document.getElementById('modal-open'); const close = document.getElementById('modal-close'); const overlay = document.getElementById('modal-overlay'); open.addEventListener('click', () => { overlay.style.display = 'flex'; }); close.addEventListener('click', () => { overlay.style.display = 'none'; });` };
    case 'popover':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative;"><button id="pop-btn" class="ui-element" aria-label="Toggle Popover">Toggle Popover</button><div id="pop-content" style="display: none; position: absolute; top: 110%; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; width: 220px; z-index: 10;"><p style="font-size: 0.85rem;">Popover content details displayed here.</p></div></div>`, js: `const btn = document.getElementById('pop-btn'); const pop = document.getElementById('pop-content'); btn.addEventListener('click', (e) => { e.stopPropagation(); pop.style.display = pop.style.display === 'none' ? 'block' : 'none'; }); document.addEventListener('click', () => { pop.style.display = 'none'; });` };
    case 'tooltip':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative;"><button id="tip-target" class="ui-element" aria-label="Hover over for tooltip">Hover Me</button><div id="tip-box" style="display: none; position: absolute; bottom: 110%; padding: 0.5rem 0.75rem; border: 1px solid currentColor; border-radius: 4px; font-size: 0.8rem; white-space: nowrap;">Tooltip Info Text</div></div>`, js: `const target = document.getElementById('tip-target'); const box = document.getElementById('tip-box'); target.addEventListener('mouseenter', () => { box.style.display = 'block'; }); target.addEventListener('mouseleave', () => { box.style.display = 'none'; }); target.addEventListener('focus', () => { box.style.display = 'block'; }); target.addEventListener('blur', () => { box.style.display = 'none'; });` };
    case 'progress-bar':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><div style="width: 100%; height: 16px; border: 1px solid currentColor; border-radius: 8px; overflow: hidden;"><div id="prog-fill" style="width: 25%; height: 100%; background: currentColor; transition: width 0.3s;"></div></div><div style="display: flex; gap: 1rem; align-items: center;"><span id="prog-val" style="font-weight: bold;">25%</span><button id="prog-inc" class="ui-element" aria-label="Increase Progress">+25%</button></div></div>`, js: `let pct = 25; const fill = document.getElementById('prog-fill'); const val = document.getElementById('prog-val'); document.getElementById('prog-inc').addEventListener('click', () => { pct = pct >= 100 ? 0 : pct + 25; fill.style.width = pct + '%'; val.textContent = pct + '%'; });` };
    case 'spinner':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><div id="spinner-graphic" style="width: 36px; height: 36px; border: 4px solid rgba(255,255,255,0.2); border-top: 4px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></div><button id="spin-toggle" class="ui-element" aria-label="Toggle Loading State">Stop Loading</button><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style></div>`, js: `const graphic = document.getElementById('spinner-graphic'); const btn = document.getElementById('spin-toggle'); let loading = true; btn.addEventListener('click', () => { loading = !loading; graphic.style.animationPlayState = loading ? 'running' : 'paused'; btn.textContent = loading ? 'Stop Loading' : 'Start Loading'; });` };
    case 'empty-state':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; max-width: 300px;"><div style="font-size: 3rem;">📭</div><h4>No Messages Yet</h4><p style="font-size: 0.85rem;">Your inbox is completely empty.</p><button id="empty-cta" class="ui-element" aria-label="Refresh Inbox">Refresh Inbox</button></div>`, js: `const cta = document.getElementById('empty-cta'); cta.addEventListener('click', () => { cta.textContent = 'Checking...'; setTimeout(() => { cta.textContent = 'Refreshed!'; }, 1000); });` };
    case 'error-404':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center;"><h1 style="font-size: 4rem; line-height: 1;">404</h1><p style="font-size: 1.1rem;">Page Not Found</p><a href="#" id="go-home" class="ui-element" style="text-decoration: none;" aria-label="Return to Homepage">Back to Safety</a></div>`, js: `document.getElementById('go-home').addEventListener('click', (e) => { e.preventDefault(); alert('Navigating Home...'); });` };
    case 'confirm-dialog':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><p>Are you sure you want to delete this file?</p><div style="display: flex; gap: 1rem;"><button id="confirm-yes" class="ui-element" aria-label="Confirm Action">Yes</button><button id="confirm-no" class="ui-element" aria-label="Cancel Action">No</button></div><div id="confirm-result" style="font-weight: bold; min-height: 1.2rem;"></div></div>`, js: `const res = document.getElementById('confirm-result'); document.getElementById('confirm-yes').addEventListener('click', () => { res.textContent = 'Confirmed: File Deleted'; }); document.getElementById('confirm-no').addEventListener('click', () => { res.textContent = 'Cancelled'; });` };

    // Global
    case 'header':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;"><header id="sticky-header" style="width: 100%; max-width: 400px; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;"><strong>AppHeader</strong><button id="header-nav-btn" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Toggle Header Navigation">Nav</button></header><div id="header-status" style="font-size: 0.85rem;">Sticky header active</div></div>`, js: `const btn = document.getElementById('header-nav-btn'); const status = document.getElementById('header-status'); btn.addEventListener('click', () => { status.textContent = status.textContent === 'Sticky header active' ? 'Menu clicked!' : 'Sticky header active'; });` };
    case 'footer':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; max-width: 360px;"><footer style="width: 100%; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; text-align: center;"><p style="font-size: 0.9rem;">© <span id="footer-year">2024</span> Harley Vásquez. All rights reserved.</p><button id="footer-link" class="ui-element" style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Footer Privacy Link">Privacy Policy</button></footer></div>`, js: `document.getElementById('footer-link').addEventListener('click', () => { alert('Privacy Policy clicked'); });` };
    case 'logo':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><svg id="interactive-logo" width="80" height="80" viewBox="0 0 100 100" style="cursor: pointer; transition: transform 0.3s;"><polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" stroke-width="8" /><circle cx="50" cy="60" r="15" fill="currentColor" /></svg><div id="logo-status" style="font-size: 0.85rem;">Hover or click logo</div></div>`, js: `const logo = document.getElementById('interactive-logo'); const status = document.getElementById('logo-status'); logo.addEventListener('click', () => { logo.style.transform = 'rotate(180deg)'; status.textContent = 'Logo Rotated!'; });` };
    case 'media-player':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;"><div style="display: flex; align-items: center; gap: 1rem;"><button id="media-play" class="ui-element" aria-label="Play or Pause Audio">▶ Play</button><span id="media-time" style="font-family: monospace;">00:00</span></div><input type="range" id="media-seek" value="0" min="0" max="100" style="width: 100%; cursor: pointer;" aria-label="Audio Seekbar"></div>`, js: `const play = document.getElementById('media-play'); const time = document.getElementById('media-time'); const seek = document.getElementById('media-seek'); let isPlaying = false; play.addEventListener('click', () => { isPlaying = !isPlaying; play.textContent = isPlaying ? '⏸ Pause' : '▶ Play'; }); seek.addEventListener('input', () => { time.textContent = '00:' + String(seek.value).padStart(2, '0'); });` };
    case 'hero':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; max-width: 400px;"><h2 style="font-size: 2rem;">Build Amazing Products</h2><p style="font-size: 0.95rem;">Empower your workflow with clean UI designs.</p><button id="hero-cta" class="ui-element" aria-label="Call to Action Get Started">Get Started</button></div>`, js: `document.getElementById('hero-cta').addEventListener('click', () => { alert('Get Started CTA Triggered!'); });` };
    case 'icons':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;"><div style="display: flex; gap: 1.5rem; font-size: 1.8rem;"><span class="icon-item" data-name="Heart" style="cursor: pointer;">❤️</span><span class="icon-item" data-name="Star" style="cursor: pointer;">⭐</span><span class="icon-item" data-name="Lightning" style="cursor: pointer;">⚡</span></div><div id="icon-name" style="font-size: 0.9rem; font-weight: bold;">Hover or click an icon</div></div>`, js: `const icons = document.querySelectorAll('.icon-item'); const name = document.getElementById('icon-name'); icons.forEach(ic => { ic.addEventListener('click', () => { name.textContent = 'Selected Icon: ' + ic.getAttribute('data-name'); }); });` };
    case 'divider':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 360px;"><p style="font-size: 0.85rem;">Section Top</p><div style="display: flex; align-items: center; width: 100%; gap: 1rem;"><div style="flex: 1; height: 1px; background: currentColor;"></div><button id="divider-label" class="ui-element" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" aria-label="Toggle Divider Label">OR</button><div style="flex: 1; height: 1px; background: currentColor;"></div></div><p style="font-size: 0.85rem;">Section Bottom</p></div>`, js: `const lbl = document.getElementById('divider-label'); lbl.addEventListener('click', () => { lbl.textContent = lbl.textContent === 'OR' ? 'AND' : 'OR'; });` };
    case 'blockquote':
      return { html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 380px;"><blockquote id="quote-box" style="padding: 1rem; border-left: 4px solid currentColor; font-style: italic; width: 100%;">"Simplicity is the ultimate sophistication."<footer style="margin-top: 0.5rem; font-style: normal; font-weight: bold;">— Leonardo da Vinci</footer></blockquote><button id="quote-copy" class="ui-element" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" aria-label="Copy Citation">Copy Quote</button></div>`, js: `const btn = document.getElementById('quote-copy'); btn.addEventListener('click', () => { btn.textContent = 'Quote Copied!'; setTimeout(() => { btn.textContent = 'Copy Quote'; }, 2000); });` };

    default:
      return { html: `<div>${slug} component</div>`, js: `` };
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCategoryForSlug(slug) {
  for (const [cat, slugs] of Object.entries(CATEGORIES)) {
    if (slugs.includes(slug)) return cat;
  }
  return 'UI Component';
}

let formsHtml = '';
let totalCount = 0;

allSlugs.forEach(slug => {
  STYLES.forEach(style => {
    totalCount++;
    const css = getCssForStyle(style, slug);
    const content = getComponentContent(slug);

    const fullHtml = `<div class="component-box">\n  ${content.html}\n</div>`;

    const dataObj = {
      title: `${slug.toUpperCase()} - Design ${style.id} (${style.nameEN})`,
      description: `Component: ${slug}, Design ${style.id}: ${style.nameEN} / ${style.nameES}. Designed by Harley Vásquez.`,
      tags: [slug, style.theme, 'ui-components', 'harley-vasquez'],
      editors: '111',
      html: fullHtml,
      css: css,
      js: content.js
    };

    const jsonStr = escapeHtml(JSON.stringify(dataObj));

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
