const UI = (() => {
  function ensureToastContainer() {
    let c = document.querySelector('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  }
  function toast(msg, type = 'info', duration = 3000) {
    const c = ensureToastContainer();
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function modal(title, contentHTML, onConfirm = null, confirmText = null) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3 class="mb-4">${escapeHtml(title)}</h3>
        <div class="modal-body mb-6">${contentHTML}</div>
        <div class="flex gap-3 justify-between">
          <button class="btn btn-secondary" data-close>${t('common.cancel')}</button>
          ${onConfirm ? `<button class="btn btn-primary" data-confirm>${escapeHtml(confirmText || t('common.confirm'))}</button>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('[data-close]').onclick = close;
    overlay.onclick = e => { if (e.target === overlay) close(); };
    const cb = overlay.querySelector('[data-confirm]');
    if (cb) cb.onclick = () => { onConfirm(overlay); };
    return overlay;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    Storage.set('theme', theme);
  }
  function initTheme() {
    const saved = Storage.get('theme', CONFIG.DEFAULT_THEME);
    applyTheme(saved);
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch (e) { return ''; }
  }
  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd';
    return formatDate(iso);
  }

  return { toast, escapeHtml, modal, applyTheme, initTheme, toggleTheme, formatDate, timeAgo };
})();
window.UI = UI;