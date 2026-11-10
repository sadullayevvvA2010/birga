const Storage = (() => {
  const PREFIX = CONFIG.STORAGE_PREFIX;
  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function remove(key) { localStorage.removeItem(PREFIX + key); }
  function clearAll() {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(PREFIX)) localStorage.removeItem(k);
    });
  }
  function push(key, item, max = 100) {
    const arr = get(key, []);
    arr.unshift(item);
    if (arr.length > max) arr.length = max;
    set(key, arr);
    return arr;
  }
  return { set, get, remove, clearAll, push };
})();
window.Storage = Storage;