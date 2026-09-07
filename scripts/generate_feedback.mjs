import fs from 'fs';
import path from 'path';
import { STYLES } from './definitions.mjs';
import { generateHtmlDesign, generateGalleryIndex, generateReadme } from './templates.mjs';

function getFeedbackComponentContent(slug, style) {
  switch (slug) {
    case 'alert':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 350px;">
            <div id="alert-banner" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; width: 100%;">
              <span>⚠️ System update available!</span>
              <button id="alert-close" class="ui-element" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" aria-label="Dismiss Alert">Dismiss</button>
            </div>
            <div id="alert-status" style="font-size: 0.85rem; display: none;">Alert dismissed.</div>
          </div>
        `,
        js: `
          const banner = document.getElementById('alert-banner');
          const status = document.getElementById('alert-status');
          document.getElementById('alert-close').addEventListener('click', () => {
            banner.style.display = 'none';
            status.style.display = 'block';
          });
        `
      };
    case 'toast':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <button id="toast-trigger" class="ui-element" aria-label="Trigger Toast Notification">Show Toast</button>
            <div id="toast-msg" style="display: none; padding: 0.75rem 1.25rem; border: 1px solid currentColor; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
              Action completed successfully!
            </div>
          </div>
        `,
        js: `
          const btn = document.getElementById('toast-trigger');
          const toast = document.getElementById('toast-msg');
          btn.addEventListener('click', () => {
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 2500);
          });
        `
      };
    case 'modal':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <button id="modal-open" class="ui-element" aria-label="Open Dialog Modal">Open Modal</button>
            <div id="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); align-items: center; justify-content: center; z-index: 2000;">
              <div style="background: inherit; border: 1px solid currentColor; padding: 2rem; border-radius: 12px; max-width: 320px; text-align: center;">
                <h3>Modal Window</h3>
                <p style="margin: 1rem 0; font-size: 0.9rem;">This is a modal popover window.</p>
                <button id="modal-close" class="ui-element" aria-label="Close Dialog Modal">Close</button>
              </div>
            </div>
          </div>
        `,
        js: `
          const open = document.getElementById('modal-open');
          const close = document.getElementById('modal-close');
          const overlay = document.getElementById('modal-overlay');
          open.addEventListener('click', () => { overlay.style.display = 'flex'; });
          close.addEventListener('click', () => { overlay.style.display = 'none'; });
        `
      };
    case 'popover':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative;">
            <button id="pop-btn" class="ui-element" aria-label="Toggle Popover">Toggle Popover</button>
            <div id="pop-content" style="display: none; position: absolute; top: 110%; padding: 1rem; border: 1px solid currentColor; border-radius: 8px; width: 220px; z-index: 10;">
              <p style="font-size: 0.85rem;">Popover content details displayed here.</p>
            </div>
          </div>
        `,
        js: `
          const btn = document.getElementById('pop-btn');
          const pop = document.getElementById('pop-content');
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            pop.style.display = pop.style.display === 'none' ? 'block' : 'none';
          });
          document.addEventListener('click', () => { pop.style.display = 'none'; });
        `
      };
    case 'tooltip':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative;">
            <button id="tip-target" class="ui-element" aria-label="Hover over for tooltip">Hover Me</button>
            <div id="tip-box" style="display: none; position: absolute; bottom: 110%; padding: 0.5rem 0.75rem; border: 1px solid currentColor; border-radius: 4px; font-size: 0.8rem; white-space: nowrap;">
              Tooltip Info Text
            </div>
          </div>
        `,
        js: `
          const target = document.getElementById('tip-target');
          const box = document.getElementById('tip-box');
          target.addEventListener('mouseenter', () => { box.style.display = 'block'; });
          target.addEventListener('mouseleave', () => { box.style.display = 'none'; });
          target.addEventListener('focus', () => { box.style.display = 'block'; });
          target.addEventListener('blur', () => { box.style.display = 'none'; });
        `
      };
    case 'progress-bar':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <div style="width: 100%; height: 16px; border: 1px solid currentColor; border-radius: 8px; overflow: hidden;">
              <div id="prog-fill" style="width: 25%; height: 100%; background: currentColor; transition: width 0.3s;"></div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <span id="prog-val" style="font-weight: bold;">25%</span>
              <button id="prog-inc" class="ui-element" aria-label="Increase Progress">+25%</button>
            </div>
          </div>
        `,
        js: `
          let pct = 25;
          const fill = document.getElementById('prog-fill');
          const val = document.getElementById('prog-val');
          document.getElementById('prog-inc').addEventListener('click', () => {
            pct = pct >= 100 ? 0 : pct + 25;
            fill.style.width = pct + '%';
            val.textContent = pct + '%';
          });
        `
      };
    case 'spinner':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div id="spinner-graphic" style="width: 36px; height: 36px; border: 4px solid rgba(255,255,255,0.2); border-top: 4px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <button id="spin-toggle" class="ui-element" aria-label="Toggle Loading State">Stop Loading</button>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
          </div>
        `,
        js: `
          const graphic = document.getElementById('spinner-graphic');
          const btn = document.getElementById('spin-toggle');
          let loading = true;
          btn.addEventListener('click', () => {
            loading = !loading;
            graphic.style.animationPlayState = loading ? 'running' : 'paused';
            btn.textContent = loading ? 'Stop Loading' : 'Start Loading';
          });
        `
      };
    case 'empty-state':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; max-width: 300px;">
            <div style="font-size: 3rem;">📭</div>
            <h4>No Messages Yet</h4>
            <p style="font-size: 0.85rem;">Your inbox is completely empty.</p>
            <button id="empty-cta" class="ui-element" aria-label="Refresh Inbox">Refresh Inbox</button>
          </div>
        `,
        js: `
          const cta = document.getElementById('empty-cta');
          cta.addEventListener('click', () => {
            cta.textContent = 'Checking...';
            setTimeout(() => { cta.textContent = 'Refreshed!'; }, 1000);
          });
        `
      };
    case 'error-404':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center;">
            <h1 style="font-size: 4rem; line-height: 1;">404</h1>
            <p style="font-size: 1.1rem;">Page Not Found</p>
            <a href="#" id="go-home" class="ui-element" style="text-decoration: none;" aria-label="Return to Homepage">Back to Safety</a>
          </div>
        `,
        js: `
          document.getElementById('go-home').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Navigating Home...');
          });
        `
      };
    case 'confirm-dialog':
      return {
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 320px;">
            <p>Are you sure you want to delete this file?</p>
            <div style="display: flex; gap: 1rem;">
              <button id="confirm-yes" class="ui-element" aria-label="Confirm Action">Yes</button>
              <button id="confirm-no" class="ui-element" aria-label="Cancel Action">No</button>
            </div>
            <div id="confirm-result" style="font-weight: bold; min-height: 1.2rem;"></div>
          </div>
        `,
        js: `
          const res = document.getElementById('confirm-result');
          document.getElementById('confirm-yes').addEventListener('click', () => { res.textContent = 'Confirmed: File Deleted'; });
          document.getElementById('confirm-no').addEventListener('click', () => { res.textContent = 'Cancelled'; });
        `
      };
  }
}

const FEEDBACK_SLUGS = [
  'alert', 'toast', 'modal', 'popover', 'tooltip',
  'progress-bar', 'spinner', 'empty-state', 'error-404', 'confirm-dialog'
];

for (const slug of FEEDBACK_SLUGS) {
  const dir = path.join('ui-components', slug);
  fs.mkdirSync(dir, { recursive: true });

  for (const style of STYLES) {
    const content = getFeedbackComponentContent(slug, style);
    const html = generateHtmlDesign(slug, style, content);
    fs.writeFileSync(path.join(dir, `design-${style.id}.html`), html);
  }

  const indexHtml = generateGalleryIndex(slug, 'Feedback');
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

  const readme = generateReadme(slug, 'Feedback');
  fs.writeFileSync(path.join(dir, 'README.md'), readme);
}

console.log('Feedback components generated successfully.');
