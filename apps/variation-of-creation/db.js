(() => {
  const dbKey = "vocLocalDb";
  const sessionKey = "vocSession";
  const seedKey = "vocSeedRowsV2";
  const seedFiles = [
    "data/art.csv",
    "data/generated-art-200.csv",
    "data/icons.csv",
    "data/generated-icons-200.csv",
    "data/logos.csv",
    "data/generated-logos-200.csv",
    "data/svgrepo-tattoo.csv",
    "data/tattoos.csv",
    "data/generated-tattoos-200.csv",
    "data/generated-comics-200.csv",
    "data/comics.csv"
  ];

  const fallbackSeeds = [
    {
      id: "art-001",
      kind: "art",
      title: "Prism Bloom",
      vibe: "soft radiant studio wall",
      palette: "auroraInk",
      control_a: "botanical",
      control_b: "petals",
      control_c: "Make a flower out of light",
      intensity: "7",
      prompt: "Layer botanical forms with luminous petals and inked orbit lines",
      tags: "art,botanical,soft glow",
      license: "Original free-to-use seed"
    },
    {
      id: "icon-001",
      kind: "icon",
      title: "Cosmic Pin",
      vibe: "bright app icon badge",
      palette: "auroraInk",
      control_a: "orbital",
      control_b: "stars",
      control_c: "Find the little universe",
      intensity: "6",
      prompt: "Create a rounded app icon with an orbital center and star bursts",
      tags: "icon,app,badge",
      license: "Original free-to-use seed"
    },
    {
      id: "logo-001",
      kind: "logo",
      title: "Nova Craft",
      vibe: "sleek maker studio",
      palette: "auroraInk",
      control_a: "badge",
      control_b: "sleek",
      control_c: "NC",
      intensity: "5",
      prompt: "Design a polished badge logo for a creative maker studio",
      tags: "logo,badge,studio",
      license: "Original free-to-use seed"
    },
    {
      id: "tattoo-001",
      kind: "tattoo",
      title: "Moon Vine",
      vibe: "delicate forearm flow",
      palette: "monoStencil",
      control_a: "botanical",
      control_b: "forearm",
      control_c: "vertical",
      intensity: "6",
      prompt: "Draw a fine-line botanical forearm tattoo with a quiet moon rhythm",
      tags: "tattoo,forearm,botanical",
      license: "Original free-to-use seed"
    },
    {
      id: "comic-001",
      kind: "comic",
      title: "Pixel Nova",
      vibe: "neon chase opening",
      palette: "citrusCircuit",
      control_a: "three",
      control_b: "neon",
      control_c: "Pixel Nova",
      intensity: "7",
      prompt: "Make a three-panel chase where color becomes the getaway route",
      tags: "comic,neon,chase",
      license: "Original free-to-use seed"
    }
  ];

  let seeds = [];

  function readDb() {
    try {
      const parsed = JSON.parse(localStorage.getItem(dbKey) || "{}");
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        creations: Array.isArray(parsed.creations) ? parsed.creations : []
      };
    } catch (error) {
      return { users: [], creations: [] };
    }
  }

  function writeDb(db) {
    localStorage.setItem(dbKey, JSON.stringify({
      users: db.users || [],
      creations: db.creations || []
    }));
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"' && quoted && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") i += 1;
        row.push(cell);
        if (row.some((part) => part.trim() !== "")) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell);
    if (row.some((part) => part.trim() !== "")) rows.push(row);
    const headers = rows.shift() || [];
    return rows.map((parts) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header.trim()] = (parts[index] || "").trim();
      });
      return item;
    });
  }

  async function loadSeeds() {
    const cached = localStorage.getItem(seedKey);
    if (cached) {
      try {
        seeds = JSON.parse(cached);
        if (Array.isArray(seeds) && seeds.length) return seeds;
      } catch (error) {
        seeds = [];
      }
    }

    try {
      const loaded = [];
      for (const file of seedFiles) {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Could not load ${file}`);
        loaded.push(...parseCsv(await response.text()));
      }
      seeds = loaded;
      localStorage.setItem(seedKey, JSON.stringify(seeds));
      return seeds;
    } catch (error) {
      seeds = fallbackSeeds;
      return seeds;
    }
  }

  function currentUser() {
    const userId = localStorage.getItem(sessionKey);
    if (!userId) return null;
    return readDb().users.find((user) => user.id === userId) || null;
  }

  async function hashPassword(password) {
    const input = String(password || "");
    if (window.crypto && window.crypto.subtle) {
      const data = new TextEncoder().encode(input);
      const hash = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = Math.imul(31, hash) + input.charCodeAt(i) | 0;
    }
    return `fallback-${hash}`;
  }

  async function signUp({ name, email, password }) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanName = String(name || "").trim();
    if (!cleanName || !cleanEmail || !password) throw new Error("Name, email, and password are required.");
    if (!cleanEmail.includes("@")) throw new Error("Use a valid email address.");
    if (String(password).length < 6) throw new Error("Password must be at least 6 characters.");

    const db = readDb();
    if (db.users.some((user) => user.email === cleanEmail)) throw new Error("That email already has an account.");

    const user = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDb(db);
    localStorage.setItem(sessionKey, user.id);
    return { id: user.id, name: user.name, email: user.email };
  }

  async function logIn({ email, password }) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const db = readDb();
    const user = db.users.find((entry) => entry.email === cleanEmail);
    if (!user || user.passwordHash !== await hashPassword(password)) throw new Error("Email or password did not match.");
    localStorage.setItem(sessionKey, user.id);
    return { id: user.id, name: user.name, email: user.email };
  }

  function logOut() {
    localStorage.removeItem(sessionKey);
  }

  function publicUser(user) {
    return user ? { id: user.id, name: user.name, email: user.email } : null;
  }

  function saveCreation(item) {
    const db = readDb();
    const user = currentUser();
    db.creations.unshift({
      ...item,
      ownerId: user ? user.id : "guest",
      ownerName: user ? user.name : "Guest Studio",
      createdAt: item.createdAt || new Date().toISOString()
    });
    db.creations = db.creations.slice(0, 60);
    writeDb(db);
  }

  function readCreations() {
    const user = currentUser();
    const db = readDb();
    if (!user) return db.creations.filter((item) => item.ownerId === "guest");
    return db.creations.filter((item) => item.ownerId === user.id);
  }

  function readGallery() {
    const saved = readCreations();
    const seedItems = seeds.map((seed) => ({
      ...seed,
      seed: true,
      createdAt: "Seed CSV",
      recipe: seed.prompt
    }));
    return [...saved, ...seedItems];
  }

  function clearCreations() {
    const user = currentUser();
    const ownerId = user ? user.id : "guest";
    const db = readDb();
    db.creations = db.creations.filter((item) => item.ownerId !== ownerId);
    writeDb(db);
  }

  function exportSnapshot() {
    return {
      currentUser: publicUser(currentUser()),
      seeds,
      creations: readCreations()
    };
  }

  window.VOC_DB = {
    init: loadSeeds,
    getSeeds: (kind) => kind ? seeds.filter((seed) => seed.kind === kind) : seeds.slice(),
    currentUser: () => publicUser(currentUser()),
    signUp,
    logIn,
    logOut,
    saveCreation,
    readCreations,
    readGallery,
    clearCreations,
    exportSnapshot
  };
})();
