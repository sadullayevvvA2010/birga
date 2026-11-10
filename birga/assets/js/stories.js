const Stories = (() => {
  const KEY = 'stories';
  function all() { return Storage.get(KEY, []); }
  function save(list) { Storage.set(KEY, list); }
  function get(id) { return all().find(s => s.id === id); }

  function create({ text, imageUrl }) {
    const user = Auth.getCurrent();
    if (!user) return null;
    const s = {
      id: 's_' + Date.now() + Math.random().toString(36).slice(2, 6),
      text,
      imageUrl: imageUrl || '',
      authorId: user.id,
      authorName: user.name,
      authorUsername: user.username,
      avatar: user.avatar,
      views: 0,
      reactions: {},
      createdAt: new Date().toISOString(),
    };
    const list = all();
    list.unshift(s);
    save(list);
    Gamification.addXP(CONFIG.XP.STORY_POST, 'Story qo‘shildi');
    return s;
  }
  function view(id) {
    const list = all();
    const s = list.find(x => x.id === id);
    if (!s) return;
    s.views++;
    save(list);
  }
  function react(id, emoji) {
    const list = all();
    const s = list.find(x => x.id === id);
    if (!s) return;
    s.reactions[emoji] = (s.reactions[emoji] || 0) + 1;
    save(list);
    return s;
  }
  function sortedByTime() {
    return [...all()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function seed() {
    if (all().length > 0) return;
    save([
      {
        id: 's_seed_1', text: 'Bugun BIRGA da birinchi quizimni yaratdim! 🎉',
        imageUrl: '', authorId: 'demo-user', authorName: 'Demo Foydalanuvchi',
        authorUsername: 'demo', avatar: 'images/avatars/default.svg',
        views: 42, reactions: { '❤️': 5, '🔥': 2 },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 's_seed_2', text: 'Kim battlega tayyor? 💪',
        imageUrl: '', authorId: 'demo-user', authorName: 'Ali',
        authorUsername: 'ali', avatar: 'images/avatars/avatar1.svg',
        views: 78, reactions: { '🔥': 12, '😮': 3 },
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ]);
  }
  return { all, save, get, create, view, react, sortedByTime, seed };
})();
window.Stories = Stories;