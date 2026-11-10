const Polls = (() => {
  const KEY = 'polls';
  const VOTES_KEY = 'poll_votes';

  function all() { return Storage.get(KEY, []); }
  function save(list) { Storage.set(KEY, list); }
  function get(id) { return all().find(p => p.id === id); }
  function votes() { return Storage.get(VOTES_KEY, {}); }
  function saveVotes(v) { Storage.set(VOTES_KEY, v); }

  function create({ question, options }) {
    const user = Auth.getCurrent();
    const p = {
      id: 'p_' + Date.now() + Math.random().toString(36).slice(2, 6),
      question,
      options: options.map((text, i) => ({ id: 'o' + i, text, votes: 0 })),
      authorId: user?.id || 'anon',
      authorName: user?.name || 'Anonim',
      createdAt: new Date().toISOString(),
    };
    const list = all();
    list.unshift(p);
    save(list);
    Gamification.addXP(CONFIG.XP.POLL_CREATE, 'So‘rovnoma yaratildi');
    return p;
  }

  function vote(pollId, optionId) {
    const v = votes();
    if (v[pollId]) return { ok: false, reason: 'already_voted' };
    const list = all();
    const p = list.find(x => x.id === pollId);
    if (!p) return { ok: false };
    const opt = p.options.find(o => o.id === optionId);
    if (!opt) return { ok: false };
    opt.votes++;
    save(list);
    v[pollId] = optionId;
    saveVotes(v);
    Gamification.addXP(CONFIG.XP.POLL_VOTE, 'Ovoz berildi');
    return { ok: true, poll: p };
  }

  function hasVoted(pollId) { return !!votes()[pollId]; }
  function myVote(pollId) { return votes()[pollId] || null; }

  function seed() {
    if (all().length > 0) return;
    save([
      {
        id: 'p_seed_1',
        question: 'Eng yaxshi dasturlash tili qaysi?',
        options: [
          { id: 'o0', text: 'JavaScript', votes: 42 },
          { id: 'o1', text: 'Python', votes: 38 },
          { id: 'o2', text: 'Go', votes: 15 },
          { id: 'o3', text: 'Rust', votes: 9 },
        ],
        authorId: 'demo-user',
        authorName: 'Demo',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'p_seed_2',
        question: 'Qaysi ijtimoiy tarmoqni ko‘proq ishlatasiz?',
        options: [
          { id: 'o0', text: 'Telegram', votes: 210 },
          { id: 'o1', text: 'Instagram', votes: 158 },
          { id: 'o2', text: 'YouTube', votes: 87 },
          { id: 'o3', text: 'TikTok', votes: 64 },
        ],
        authorId: 'demo-user',
        authorName: 'Demo',
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  return { all, save, get, create, vote, hasVoted, myVote, seed };
})();
window.Polls = Polls;