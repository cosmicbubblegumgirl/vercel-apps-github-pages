(() => {
  const DB_KEY = "sefirahAtelierDbV1";
  const SESSION_KEY = "sefirahAtelierSessionV1";

  const seedPosts = [
    {
      id: "post-seed-1",
      authorId: "seed-archivist",
      authorName: "Clockwork Archivist",
      title: "Notes from a useful dream",
      body: "I keep a notebook beside my bed because the clearest clues arrive between sleep and breakfast. Today's entry contains a door, a brass key, and a warning to question tidy prophecies.",
      tags: ["dreams", "door", "theory"],
      attachments: [],
      mysterious: ["seed-moon", "seed-key"],
      comments: [
        {
          id: "comment-seed-1",
          authorName: "Velvet Oracle",
          body: "The tidy prophecy part feels very familiar.",
          createdAt: "2026-06-20T12:04:00.000Z"
        }
      ],
      createdAt: "2026-06-20T11:30:00.000Z"
    },
    {
      id: "post-seed-2",
      authorId: "seed-artist",
      authorName: "Velvet Oracle",
      title: "Tarot prompt: choose the pathway that would survive a bad group project",
      body: "My answer is Paragon if the deadline is real, Trickster-adjacent Error if the deadline is imaginary, and Guardian-coded Justiciar if someone touches the shared folder.",
      tags: ["tarot", "quiz", "community"],
      attachments: [],
      mysterious: ["seed-archivist"],
      comments: [],
      createdAt: "2026-06-21T15:12:00.000Z"
    }
  ];

  function emptyDb() {
    return {
      users: [],
      posts: seedPosts,
      cards: [],
      quizResults: []
    };
  }

  function readDb() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DB_KEY) || "null");
      const db = parsed && typeof parsed === "object" ? parsed : emptyDb();
      return {
        users: Array.isArray(db.users) ? db.users : [],
        posts: Array.isArray(db.posts) && db.posts.length ? db.posts : seedPosts,
        cards: Array.isArray(db.cards) ? db.cards : [],
        quizResults: Array.isArray(db.quizResults) ? db.quizResults : []
      };
    } catch (error) {
      return emptyDb();
    }
  }

  function writeDb(db) {
    localStorage.setItem(DB_KEY, JSON.stringify({
      users: db.users || [],
      posts: db.posts || [],
      cards: db.cards || [],
      quizResults: db.quizResults || []
    }));
  }

  function init() {
    const db = readDb();
    const hasSeeds = db.posts.some((post) => post.id === "post-seed-1");
    if (!hasSeeds) {
      db.posts.push(...seedPosts);
      writeDb(db);
    }
    return exportSnapshot();
  }

  function publicUser(user) {
    return user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    } : null;
  }

  function currentUser() {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return readDb().users.find((user) => user.id === userId) || null;
  }

  async function hashPassword(password) {
    const input = String(password || "");
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      const data = new TextEncoder().encode(input);
      const hash = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
    }
    return `fallback-${hash}`;
  }

  async function signUp({ name, email, password }) {
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanName || !cleanEmail || !password) throw new Error("Name, email, and password are required.");
    if (!cleanEmail.includes("@")) throw new Error("Use a valid email address.");
    if (String(password).length < 6) throw new Error("Use at least 6 characters for the password.");

    const db = readDb();
    if (db.users.some((user) => user.email === cleanEmail)) throw new Error("That email already has a local account.");

    const user = {
      id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
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
    const user = db.users.find((entry) => entry.email === cleanEmail);
    if (!user || user.passwordHash !== await hashPassword(password)) throw new Error("Email or password did not match.");
    localStorage.setItem(SESSION_KEY, user.id);
    return publicUser(user);
  }

  function logOut() {
    localStorage.removeItem(SESSION_KEY);
  }

  function actor() {
    const user = currentUser();
    return user ? publicUser(user) : {
      id: "guest",
      name: "Guest under the Fog",
      email: "",
      createdAt: ""
    };
  }

  function createPost({ title, body, tags, attachments }) {
    const user = actor();
    if (user.id === "guest") throw new Error("Log in locally before posting to the community.");
    const cleanTitle = String(title || "").trim();
    const cleanBody = String(body || "").trim();
    if (!cleanTitle || !cleanBody) throw new Error("A title and post body are required.");

    const db = readDb();
    const post = {
      id: `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      authorId: user.id,
      authorName: user.name,
      title: cleanTitle,
      body: cleanBody,
      tags: String(tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8),
      attachments: Array.isArray(attachments) ? attachments.slice(0, 8) : [],
      mysterious: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    db.posts.unshift(post);
    writeDb(db);
    return post;
  }

  function getPosts() {
    return readDb().posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function toggleMysterious(postId) {
    const user = actor();
    const db = readDb();
    const post = db.posts.find((entry) => entry.id === postId);
    if (!post) throw new Error("Post not found.");
    post.mysterious = Array.isArray(post.mysterious) ? post.mysterious : [];
    const index = post.mysterious.indexOf(user.id);
    if (index >= 0) {
      post.mysterious.splice(index, 1);
    } else {
      post.mysterious.push(user.id);
    }
    writeDb(db);
    return post;
  }

  function addComment(postId, body) {
    const user = actor();
    const cleanBody = String(body || "").trim();
    if (!cleanBody) throw new Error("Write a comment first.");
    const db = readDb();
    const post = db.posts.find((entry) => entry.id === postId);
    if (!post) throw new Error("Post not found.");
    post.comments = Array.isArray(post.comments) ? post.comments : [];
    const comment = {
      id: `comment-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      authorName: user.name,
      body: cleanBody,
      createdAt: new Date().toISOString()
    };
    post.comments.push(comment);
    writeDb(db);
    return comment;
  }

  function saveCard(card) {
    const user = actor();
    const db = readDb();
    const saved = {
      ...card,
      id: card.id || `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      ownerId: user.id,
      ownerName: user.name,
      createdAt: new Date().toISOString()
    };
    db.cards.unshift(saved);
    db.cards = db.cards.slice(0, 40);
    writeDb(db);
    return saved;
  }

  function getCards() {
    const user = actor();
    return readDb().cards.filter((card) => card.ownerId === user.id || card.ownerId === "guest");
  }

  function saveResult(result) {
    const user = actor();
    const db = readDb();
    const saved = {
      ...result,
      id: `result-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      ownerId: user.id,
      ownerName: user.name,
      createdAt: new Date().toISOString()
    };
    db.quizResults.unshift(saved);
    db.quizResults = db.quizResults.slice(0, 20);
    writeDb(db);
    return saved;
  }

  function getResults() {
    const user = actor();
    return readDb().quizResults.filter((result) => result.ownerId === user.id || result.ownerId === "guest");
  }

  function exportSnapshot() {
    return {
      user: publicUser(currentUser()),
      posts: getPosts(),
      cards: getCards(),
      quizResults: getResults()
    };
  }

  window.SEFIRAH_DB = {
    init,
    currentUser: () => publicUser(currentUser()),
    signUp,
    logIn,
    logOut,
    createPost,
    getPosts,
    toggleMysterious,
    addComment,
    saveCard,
    getCards,
    saveResult,
    getResults,
    exportSnapshot
  };
})();
