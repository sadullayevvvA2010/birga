const Auth = (() => {
  // NOTE: This is a DEMO auth. Passwords are hashed with SHA-256 via Web Crypto
  // to avoid storing plaintext, but this is NOT production-grade security.
  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getUsers() { return Storage.get('users', []); }
  function saveUsers(u) { Storage.set('users', u); }
  function getCurrent() { return Storage.get('currentUser', null); }
  function setCurrent(u) { Storage.set('currentUser', u); }
  function isLoggedIn() { return !!getCurrent(); }

  function requireAuth(redirect = 'login.html') {
    if (!isLoggedIn()) {
      UI.toast(t('toast.login_required'), 'error');
      setTimeout(() => location.href = redirect, 700);
      return false;
    }
    return true;
  }

  async function register({ name, username, email, password }) {
    const users = getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: t('auth.error.exists') };
    }
    const passwordHash = await sha256(password);
    const user = {
      id: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      name, username, email, passwordHash,
      avatar: 'images/avatars/default.svg',
      bio: '',
      xp: 0,
      level: 1,
      badges: [],
      joinedAt: new Date().toISOString(),
      stats: { quizzes: 0, challenges: 0, battles: 0, wins: 0, posts: 0 },
    };
    users.push(user);
    saveUsers(users);
    const safe = { ...user }; delete safe.passwordHash;
    setCurrent(safe);
    return { ok: true, user: safe };
  }

  async function login({ email, password }) {
    const users = getUsers();
    const passwordHash = await sha256(password);
    const user = users.find(u =>
      (u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase())
      && u.passwordHash === passwordHash
    );
    if (!user) return { ok: false, error: t('auth.error.invalid') };
    const safe = { ...user }; delete safe.passwordHash;
    setCurrent(safe);
    return { ok: true, user: safe };
  }

  function loginDemo() {
    const demo = { ...CONFIG.DEMO_USER };
    setCurrent(demo);
    return demo;
  }

  function logout() {
    Storage.remove('currentUser');
    UI.toast(t('toast.logout'), 'success');
    setTimeout(() => location.href = 'index.html', 600);
  }

  function updateProfile(patch) {
    const cur = getCurrent();
    if (!cur) return null;
    const updated = { ...cur, ...patch };
    setCurrent(updated);
    // also persist to users
    const users = getUsers();
    const i = users.findIndex(u => u.id === updated.id);
    if (i >= 0) { users[i] = { ...users[i], ...patch }; saveUsers(users); }
    return updated;
  }

  return { register, login, loginDemo, logout, isLoggedIn, getCurrent, setCurrent, requireAuth, updateProfile, sha256 };
})();
window.Auth = Auth;