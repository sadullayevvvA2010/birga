const Community = (() => {
  const POSTS_KEY = 'community_posts';
  const COMMUNITIES_KEY = 'communities';

  function allPosts() { return Storage.get(POSTS_KEY, []); }
  function savePosts(list) { Storage.set(POSTS_KEY, list); }
  function allCommunities() { return Storage.get(COMMUNITIES_KEY, []); }
  function saveCommunities(list) { Storage.set(COMMUNITIES_KEY, list); }

  function createPost({ text, communityId = null }) {
    const user = Auth.getCurrent();
    if (!user) return null;
    const post = {
      id: 'post_' + Date.now() + Math.random().toString(36).slice(2, 6),
      text,
      communityId,
      authorId: user.id,
      authorName: user.name,
      authorUsername: user.username,
      avatar: user.avatar,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    const list = allPosts();
    list.unshift(post);
    savePosts(list);
    Gamification.addXP(CONFIG.XP.COMMUNITY_POST, 'Post yozildi');
    return post;
  }

  function like(postId) {
    const user = Auth.getCurrent();
    if (!user) return null;
    const list = allPosts();
    const p = list.find(x => x.id === postId);
    if (!p) return null;
    const i = p.likes.indexOf(user.id);
    if (i >= 0) p.likes.splice(i, 1);
    else { p.likes.push(user.id); Gamification.addXP(CONFIG.XP.COMMUNITY_LIKE, 'Like bosildi'); }
    savePosts(list);
    return p;
  }

  function comment(postId, text) {
    const user = Auth.getCurrent();
    if (!user) return null;
    const list = allPosts();
    const p = list.find(x => x.id === postId);
    if (!p) return null;
    p.comments.push({
      id: 'c_' + Date.now(),
      text,
      authorId: user.id,
      authorName: user.name,
      avatar: user.avatar,
      createdAt: new Date().toISOString(),
    });
    savePosts(list);
    Gamification.addXP(CONFIG.XP.COMMUNITY_COMMENT, 'Izoh yozildi');
    return p;
  }

  function createCommunity({ name, description }) {
    const user = Auth.getCurrent();
    const c = {
      id: 'com_' + Date.now(),
      name,
      description: description || '',
      ownerId: user?.id || 'anon',
      members: user ? [user.id] : [],
      createdAt: new Date().toISOString(),
    };
    const list = allCommunities();
    list.unshift(c);
    saveCommunities(list);
    return c;
  }
  function joinCommunity(id) {
    const user = Auth.getCurrent();
    if (!user) return;
    const list = allCommunities();
    const c = list.find(x => x.id === id);
    if (!c) return;
    if (!c.members.includes(user.id)) { c.members.push(user.id); saveCommunities(list); }
    return c;
  }

  function sortedPosts(mode = 'new') {
    const list = allPosts();
    if (mode === 'popular') return [...list].sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function seed() {
    if (allPosts().length > 0) return;
    savePosts([
      {
        id: 'post_seed_1',
        text: 'BIRGA ga xush kelibsiz! Bu yerda birinchi postingizni yozing 🚀',
        authorId: 'demo-user', authorName: 'Demo', authorUsername: 'demo',
        avatar: 'images/avatars/default.svg',
        likes: [], comments: [], createdAt: new Date().toISOString(),
      },
    ]);
    if (allCommunities().length === 0) {
      saveCommunities([
        { id: 'com_1', name: 'Dasturchilar', description: 'IT va dasturlash', ownerId: 'demo', members: [], createdAt: new Date().toISOString() },
        { id: 'com_2', name: 'Talabalar', description: 'Universitet hayoti', ownerId: 'demo', members: [], createdAt: new Date().toISOString() },
      ]);
    }
  }
  return { allPosts, savePosts, allCommunities, saveCommunities, createPost, like, comment, createCommunity, joinCommunity, sortedPosts, seed };
})();
window.Community = Community;