// Global app bootstrap
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Theme first (avoid flash)
    UI.initTheme();

    // Seed demo data
    Quiz.seed();
    Challenge.seed();
    Polls.seed();
    Stories.seed();
    Community.seed();

    // Language
    I18N.init();
    document.documentElement.lang = I18N.get();

    // Landing nav scroll shadow
    const nav = document.querySelector('.landing-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 30) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      });
    }

    // Theme toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.toggleTheme();
        UI.toast('Theme: ' + (document.documentElement.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️'));
      });
    });

    // Language switcher buttons
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        I18N.set(lang);
      });
    });
    I18N.apply();

    // Logout buttons
    document.querySelectorAll('[data-logout]').forEach(btn => {
      btn.addEventListener('click', () => Auth.logout());
    });

    // Fill current user avatar/name in navbars
    const user = Auth.getCurrent();
    if (user) {
      document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name);
      document.querySelectorAll('[data-user-avatar]').forEach(el => el.src = user.avatar || 'images/avatars/default.svg');
      document.querySelectorAll('[data-user-xp]').forEach(el => el.textContent = user.xp || 0);
      document.querySelectorAll('[data-user-level]').forEach(el => el.textContent = user.level || 1);
    }

    // Unread badge
    const unread = Notifications.unreadCount();
    document.querySelectorAll('[data-unread-badge]').forEach(el => {
      el.textContent = unread;
      el.style.display = unread > 0 ? 'inline-block' : 'none';
    });
  });
})();