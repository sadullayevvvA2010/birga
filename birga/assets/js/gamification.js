const Gamification = (() => {
  function currentLevel(xp) {
    let lvl = CONFIG.LEVELS[0];
    for (const l of CONFIG.LEVELS) if (xp >= l.xp) lvl = l;
    return lvl;
  }
  function nextLevel(xp) {
    return CONFIG.LEVELS.find(l => l.xp > xp) || null;
  }
  function levelProgress(xp) {
    const cur = currentLevel(xp);
    const next = nextLevel(xp);
    if (!next) return 100;
    return Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100);
  }

  function addXP(amount, reason = '') {
    const user = Auth.getCurrent();
    if (!user) return null;
    const oldLevel = currentLevel(user.xp).level;
    user.xp = (user.xp || 0) + amount;
    user.level = currentLevel(user.xp).level;
    Auth.setCurrent(user);
    const users = Storage.get('users', []);
    const i = users.findIndex(u => u.id === user.id);
    if (i >= 0) { users[i].xp = user.xp; users[i].level = user.level; Storage.set('users', users); }

    Notifications.push({
      type: 'xp',
      title: `${t('toast.xp')} +${amount}`,
      body: reason,
      icon: '⚡',
    });

    if (user.level > oldLevel) {
      UI.toast(`🎉 ${t('toast.levelup')} Level ${user.level}`, 'success', 4000);
      Notifications.push({
        type: 'level',
        title: t('toast.levelup'),
        body: `Level ${user.level} — ${currentLevel(user.xp).name}`,
        icon: '🏆',
      });
    }
    return user;
  }

  function awardBadge(badgeId, name) {
    const user = Auth.getCurrent();
    if (!user) return;
    user.badges = user.badges || [];
    if (user.badges.includes(badgeId)) return;
    user.badges.push(badgeId);
    Auth.setCurrent(user);
    UI.toast(`🏅 ${t('toast.badge')} ${name}`, 'success', 4000);
    Notifications.push({ type: 'badge', title: t('toast.badge'), body: name, icon: '🏅' });
  }

  // Global leaderboard from users list
  function leaderboard(period = 'all') {
    const users = Storage.get('users', []);
    const demo = CONFIG.DEMO_USER;
    const all = [{ ...demo }]; // include demo
    users.forEach(u => { if (u.id !== demo.id) all.push({ ...u, passwordHash: undefined }); });
    all.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    return all;
  }

  return { currentLevel, nextLevel, levelProgress, addXP, awardBadge, leaderboard };
})();
window.Gamification = Gamification;