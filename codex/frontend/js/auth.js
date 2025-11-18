(function () {
  const STORAGE_KEY = 'mini_board_user';

  function readUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('Failed to parse stored user', err);
      return null;
    }
  }

  function writeUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  window.authStorage = {
    getUser: readUser,
    setUser: writeUser,
    clear: () => localStorage.removeItem(STORAGE_KEY)
  };
})();
