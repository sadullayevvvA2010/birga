const Profile = (() => {
  function current() { return Auth.getCurrent(); }
  function update(patch) { return Auth.updateProfile(patch); }
  function stats() {
    const u = current();
    if (!u) return null;
    const quizzes = Quiz.all().filter(q => q.authorId === u.id).length;
    const posts = Community.allPosts().filter(p => p.authorId === u.id).length;
    return {
      quizzes,
      posts,
      xp: u.xp || 0,
      level: u.level || 1,
      badges: u.badges || [],
    };
  }
  return { current, update, stats };
})();
window.Profile = Profile;