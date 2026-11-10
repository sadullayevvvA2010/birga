const Battle = (() => {
  // Demo 1v1 vs. simulated AI
  function start(quiz, opts = {}) {
    const state = {
      quiz,
      questions: shuffle([...quiz.questions]),
      current: 0,
      youScore: 0,
      oppScore: 0,
      youAnswers: [],
      oppAnswers: [],
      startedAt: new Date().toISOString(),
      turn: opts.startTurn || 'you',
    };
    Storage.set('battle_state', state);
    return state;
  }
  function getState() { return Storage.get('battle_state', null); }
  function clear() { Storage.remove('battle_state'); }

  function answer(idx) {
    const s = getState();
    if (!s) return null;
    const q = s.questions[s.current];
    const correct = idx === q.correct;
    if (correct) s.youScore++;
    s.youAnswers.push(idx);

    // Simulated opponent: 65% accuracy, faster/slower based on random
    const oppCorrect = Math.random() < 0.65;
    let oppIdx = oppCorrect ? q.correct : q.answers.findIndex((_, i) => i !== q.correct);
    s.oppAnswers.push(oppIdx);
    if (oppCorrect) s.oppScore++;

    s.current++;
    Storage.set('battle_state', s);

    if (s.current >= s.questions.length) {
      return { done: true, state: s };
    }
    return { done: false, state: s };
  }

  function finish() {
    const s = getState();
    if (!s) return null;
    let result = 'draw';
    if (s.youScore > s.oppScore) result = 'win';
    else if (s.youScore < s.oppScore) result = 'lose';
    if (result === 'win') Gamification.addXP(CONFIG.XP.BATTLE_WIN, 'Battle g‘alabasi');
    else Gamification.addXP(CONFIG.XP.BATTLE_LOSE, 'Battle qatnashuvi');
    Gamification.awardBadge('first-battle', 'Birinchi battle');
    if (result === 'win') Gamification.awardBadge('battle-winner', 'Battle g‘olibi');
    return { ...s, result };
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return { start, getState, clear, answer, finish };
})();
window.Battle = Battle;