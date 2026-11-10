const Challenge = (() => {
  const KEY = 'challenges';
  const PARTICIPATION_KEY = 'challenge_participation';

  function all() { return Storage.get(KEY, []); }
  function save(list) { Storage.set(KEY, list); }
  function get(id) { return all().find(c => c.id === id); }
  function participation() { return Storage.get(PARTICIPATION_KEY, {}); }
  function saveParticipation(p) { Storage.set(PARTICIPATION_KEY, p); }

  function create(data) {
    const c = {
      id: 'c_' + Date.now() + Math.random().toString(36).slice(2, 6),
      title: data.title,
      description: data.description || '',
      type: data.type || 'daily',
      xp: data.xp || 40,
      expiresAt: data.expiresAt || null,
      createdAt: new Date().toISOString(),
    };
    const list = all();
    list.unshift(c);
    save(list);
    return c;
  }

  function join(id) {
    const p = participation();
    if (!p[id]) {
      p[id] = { joinedAt: new Date().toISOString(), completed: false };
      saveParticipation(p);
    }
    return p[id];
  }
  function complete(id) {
    const p = participation();
    if (p[id] && !p[id].completed) {
      p[id].completed = true;
      p[id].completedAt = new Date().toISOString();
      saveParticipation(p);
      const c = get(id);
      if (c) {
        Gamification.addXP(c.xp, 'Challenge bajarildi');
        Gamification.awardBadge('challenger', 'Challenger');
      }
      return true;
    }
    return false;
  }

  function seed() {
    if (all().length > 0) return;
    const now = Date.now();
    const seedList = [
      { id: 'c_seed_1', title: '5 ta quiz o‘yna', description: 'Bugun 5 ta quiz o‘ynang', type: 'daily', xp: 40, expiresAt: new Date(now + 86400000).toISOString(), createdAt: new Date().toISOString() },
      { id: 'c_seed_2', title: 'Do‘stni taklif qil', description: 'Bir do‘stingizni BIRGA ga taklif qiling', type: 'weekly', xp: 100, expiresAt: new Date(now + 604800000).toISOString(), createdAt: new Date().toISOString() },
      { id: 'c_seed_3', title: 'Birinchi battle', description: 'Birinchi battleingizni g‘alaba bilan yakunlang', type: 'weekly', xp: 150, expiresAt: new Date(now + 604800000).toISOString(), createdAt: new Date().toISOString() },
    ];
    save(seedList);
  }

  return { all, save, get, create, join, complete, participation, seed };
})();
window.Challenge = Challenge;