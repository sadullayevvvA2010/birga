const Quiz = (() => {
  function all() { return Storage.get('quizzes', []); }
  function save(list) { Storage.set('quizzes', list); }
  function get(id) { return all().find(q => q.id === id) || null; }

  function create(data) {
    const user = Auth.getCurrent();
    if (!user) return null;
    const quiz = {
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title: data.title,
      description: data.description || '',
      timePerQ: Number(data.timePerQ) || 20,
      questions: data.questions || [],
      authorId: user.id,
      authorName: user.name,
      authorUsername: user.username,
      plays: 0,
      createdAt: new Date().toISOString(),
    };
    const list = all();
    list.unshift(quiz);
    save(list);
    Gamification.addXP(CONFIG.XP.QUIZ_CREATE, 'Quiz yaratildi');
    Gamification.awardBadge('first-quiz', 'Birinchi quiz');
    return quiz;
  }
  function update(id, patch) {
    const list = all();
    const i = list.findIndex(q => q.id === id);
    if (i < 0) return null;
    list[i] = { ...list[i], ...patch };
    save(list);
    return list[i];
  }
  function remove(id) {
    save(all().filter(q => q.id !== id));
  }
  function incrementPlays(id) {
    const q = get(id);
    if (!q) return;
    update(id, { plays: (q.plays || 0) + 1 });
  }

  // Seed demo quizzes on first run
  function seed() {
    if (all().length > 0) return;
    const seedList = [
      {
        id: 'q_seed_1',
        title: 'O‘zbekiston tarixi',
        description: 'O‘zbekiston tarixiga oid 5 savol',
        timePerQ: 20,
        questions: [
          { text: 'O‘zbekiston mustaqillikka erishgan yil?', answers: ['1989', '1990', '1991', '1992'], correct: 2 },
          { text: 'O‘zbekistonning poytaxti?', answers: ['Samarqand', 'Toshkent', 'Buxoro', 'Namangan'], correct: 1 },
          { text: 'O‘zbekiston bayrog‘ida nechta rang bor?', answers: ['2', '3', '4', '5'], correct: 2 },
          { text: 'O‘zbekistonning eng katta shahri?', answers: ['Samarqand', 'Toshkent', 'Andijon', 'Namangan'], correct: 1 },
          { text: 'Amir Temur qaysi shaharda tug‘ilgan?', answers: ['Toshkent', 'Shahrisabz', 'Samarqand', 'Buxoro'], correct: 1 },
        ],
        authorId: 'demo-user',
        authorName: 'Demo Foydalanuvchi',
        authorUsername: 'demo',
        plays: 124,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_seed_2',
        title: 'IT va Texnologiya',
        description: 'Texnologiya sohasidagi qiziqarli savollar',
        timePerQ: 15,
        questions: [
          { text: 'HTML nimani anglatadi?', answers: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Tool Markup Language', 'None'], correct: 0 },
          { text: 'JavaScript qaysi yilda yaratilgan?', answers: ['1993', '1995', '1998', '2000'], correct: 1 },
          { text: 'CSS nima uchun ishlatiladi?', answers: ['Ma’lumotlar bazasi', 'Dizayn', 'Backend', 'Server'], correct: 1 },
          { text: 'Qaysi biri brauzer?', answers: ['Chrome', 'Windows', 'Linux', 'Photoshop'], correct: 0 },
        ],
        authorId: 'demo-user',
        authorName: 'Demo Foydalanuvchi',
        authorUsername: 'demo',
        plays: 87,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_seed_3',
        title: 'Geografiya dunyosi',
        description: 'Dunyo davlatlari va poytaxtlari',
        timePerQ: 20,
        questions: [
          { text: 'Fransiya poytaxti?', answers: ['London', 'Parij', 'Berlin', 'Madrid'], correct: 1 },
          { text: 'Eng katta okean?', answers: ['Atlantika', 'Hind', 'Tinch', 'Shimoliy'], correct: 2 },
          { text: 'Nil daryosi qaysi qit’ada?', answers: ['Osiyo', 'Afrika', 'Yevropa', 'Amerika'], correct: 1 },
        ],
        authorId: 'demo-user',
        authorName: 'Demo Foydalanuvchi',
        authorUsername: 'demo',
        plays: 203,
        createdAt: new Date().toISOString(),
      },
    ];
    save(seedList);
  }

  return { all, save, get, create, update, remove, incrementPlays, seed };
})();
window.Quiz = Quiz;