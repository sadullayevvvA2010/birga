const Notifications = (() => {
  function all() { return Storage.get('notifications', []); }
  function save(list) { Storage.set('notifications', list); }

  function push({ type = 'info', title = '', body = '', icon = '🔔' }) {
    const list = all();
    list.unshift({
      id: 'n_' + Date.now() + Math.random().toString(36).slice(2, 6),
      type, title, body, icon,
      read: false,
      at: new Date().toISOString(),
    });
    if (list.length > 200) list.length = 200;
    save(list);
  }
  function markAllRead() {
    const list = all().map(n => ({ ...n, read: true }));
    save(list);
  }
  function unreadCount() { return all().filter(n => !n.read).length; }
  function clear() { save([]); }
  return { all, push, markAllRead, unreadCount, clear };
})();
window.Notifications = Notifications;