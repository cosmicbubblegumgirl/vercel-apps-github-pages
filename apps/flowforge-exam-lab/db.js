(() => {
  const DB_KEY = "apiocalypseUsersV1";
  const SESSION_KEY = "apiocalypseSessionV1";

  function emptyDb() {
    return {
      users: [],
      attempts: []
    };
  }

  function readDb() {
    try {
      const saved = JSON.parse(localStorage.getItem(DB_KEY) || "null");
      return {
        users: Array.isArray(saved?.users) ? saved.users : [],
        attempts: Array.isArray(saved?.attempts) ? saved.attempts : []
      };
    } catch (error) {
      return emptyDb();
    }
  }

  function writeDb(db) {
    localStorage.setItem(DB_KEY, JSON.stringify({
      users: db.users,
      attempts: db.attempts
    }));
  }

  function publicUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  function currentUser() {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return publicUser(readDb().users.find((user) => user.id === userId));
  }

  async function hashPassword(password) {
    const text = String(password || "");
    if (window.crypto?.subtle && window.TextEncoder) {
      const data = new TextEncoder().encode(text);
      const hash = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = (Math.imul(31, hash) + text.charCodeAt(i)) | 0;
    }
    return `fallback-${hash}`;
  }

  async function signUp({ name, email, password }) {
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanName) throw new Error("Enter your name.");
    if (!cleanEmail.includes("@")) throw new Error("Enter a valid email address.");
    if (String(password || "").length < 6) throw new Error("Use at least 6 characters for the password.");

    const db = readDb();
    if (db.users.some((user) => user.email === cleanEmail)) {
      throw new Error("That email already has a local learner account.");
    }

    const user = {
      id: `learner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    writeDb(db);
    localStorage.setItem(SESSION_KEY, user.id);
    return publicUser(user);
  }

  async function logIn({ email, password }) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const db = readDb();
    const user = db.users.find((item) => item.email === cleanEmail);

    if (!user || user.passwordHash !== await hashPassword(password)) {
      throw new Error("Email or password did not match.");
    }

    localStorage.setItem(SESSION_KEY, user.id);
    return publicUser(user);
  }

  function logOut() {
    localStorage.removeItem(SESSION_KEY);
  }

  function saveAttempt(attempt) {
    const user = currentUser();
    const ownerId = user?.id || "guest";
    const db = readDb();
    const saved = {
      ...attempt,
      ownerId,
      ownerName: user?.name || "Guest learner"
    };

    db.attempts.unshift(saved);
    db.attempts = db.attempts.slice(0, 80);
    writeDb(db);
    return saved;
  }

  function getAttempts() {
    const user = currentUser();
    const ownerId = user?.id || "guest";
    return readDb().attempts
      .filter((attempt) => attempt.ownerId === ownerId)
      .slice(0, 30);
  }

  function exportData() {
    return {
      user: currentUser(),
      attempts: getAttempts()
    };
  }

  window.CTRL_ALT_DEFEAT_DB = {
    init: () => exportData(),
    currentUser,
    signUp,
    logIn,
    logOut,
    saveAttempt,
    getAttempts,
    exportData
  };
})();
