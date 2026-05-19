const state = {
  user: null,
  doodles: [],
  clips: [],
  filter: "all",
  query: "",
  sort: "fresh",
  visibleLimit: 36,
  view: "gallery",
  audio: null,
  paintColor: "#7DBFA2",
  brushSize: 10,
  mood: "Misty"
};

const page = document.body.dataset.page;
const savedTheme = (() => {
  const requested = new URLSearchParams(window.location.search).get("theme");
  if (requested === "dark" || requested === "light") return requested;
  try {
    return localStorage.getItem("doodleflow-theme") || localStorage.getItem("doodledrift-theme") || "light";
  } catch {
    return "light";
  }
})();
document.documentElement.dataset.theme = savedTheme;

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function toast(message, error = false) {
  const existing = qs(".toast");
  if (existing) existing.remove();
  const node = document.createElement("div");
  node.className = `notice toast${error ? " error" : ""}`;
  node.textContent = message;
  Object.assign(node.style, {
    position: "fixed",
    right: "18px",
    bottom: "18px",
    zIndex: "40",
    maxWidth: "320px"
  });
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function initials(user) {
  const source = user?.displayName || user?.username || "DF";
  return source.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function displayHandle(user) {
  return user?.username || "DoodleFriend";
}

function sameHandle(a, b) {
  return String(a || "").toLowerCase() === String(b || "").toLowerCase();
}

function hashString(value) {
  return String(value || "").split("").reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function avatar(user, size = "") {
  const cls = size ? `avatar ${size}` : "avatar";
  if (user?.avatar) {
    return `<span class="${cls}"><img src="${user.avatar}" alt="${escapeHtml(user.displayName)} profile picture"></span>`;
  }
  return `<span class="${cls}" aria-hidden="true">${escapeHtml(initials(user))}</span>`;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("doodleflow-theme", theme);
  } catch {}
  qsa("[data-theme-toggle]").forEach((button) => {
    button.textContent = theme === "dark" ? "Light" : "Dark";
    button.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  });
}

function themeButton() {
  const theme = document.documentElement.dataset.theme || "light";
  return `<button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch theme">${theme === "dark" ? "Light" : "Dark"}</button>`;
}

function bindThemeToggle(root = document) {
  qsa("[data-theme-toggle]", root).forEach((button) => {
    button.addEventListener("click", () => {
      setTheme((document.documentElement.dataset.theme || "light") === "dark" ? "light" : "dark");
    });
  });
  setTheme(document.documentElement.dataset.theme || "light");
}

function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function setActiveNav() {
  qsa(".nav-links a").forEach((link) => {
    const nav = link.dataset.nav;
    link.classList.toggle("active", nav === page);
  });
}

function updateAccountUI() {
  const account = qs("#accountActions");
  if (!account) return;
  if (state.user) {
    account.innerHTML = `
      <a href="profile.html" title="My DoodleDen">${avatar(state.user)}<span>${escapeHtml(state.user.displayName)}</span></a>
      ${themeButton()}
      <button id="logoutButton" type="button" aria-label="Float Away">Float Away</button>
    `;
    qs("#logoutButton")?.addEventListener("click", async () => {
      await api("/api/auth/logout", { method: "POST", body: "{}" });
      state.user = null;
      window.location.href = "login.html";
    });
  } else {
    account.innerHTML = `${themeButton()}<a href="login.html">Enter the Den</a>`;
  }
  bindThemeToggle(account);
}

async function loadMe() {
  const data = await api("/api/me");
  state.user = data.user;
  updateAccountUI();
}

async function loadDoodles() {
  const data = await api("/api/doodles");
  state.doodles = data.doodles;
  renderDoodles();
  renderSpotlight();
}

function typeName(type) {
  return ({ art: "Canvas Doodle", music: "Echo Doodle", blog: "Story Doodle" }[type] || "Doodle");
}

function seededNumber(seed, salt, min, max) {
  const span = max - min + 1;
  return min + (hashString(`${seed}:${salt}`) % span);
}

function seededFloat(seed, salt, min, max) {
  return min + (hashString(`${seed}:${salt}`) % 1000) / 1000 * (max - min);
}

function paletteFor(doodle, seed) {
  const base = /^#[0-9a-fA-F]{6}$/.test(doodle.color || "") ? doodle.color : "#B8DEC8";
  const colors = [base, "#BFD7EA", "#C7E6E2", "#D9D0F0", "#E6DC8F", "#D7E8BA", "#9EC7B4", "#A9CBE3", "#C2DDA4", "#CFC4EC", "#F8FBF1"];
  return Array.from({ length: 6 }, (_, index) => colors[(seededNumber(seed, `palette-${index}`, 0, colors.length - 1))]);
}

function dotField(seed, count, color = "#f8fbf1", opacity = 0.44) {
  return Array.from({ length: count }, (_, index) => {
    const cx = seededNumber(seed, `dot-x-${index}`, 4, 96);
    const cy = seededNumber(seed, `dot-y-${index}`, 5, 65);
    const r = seededFloat(seed, `dot-r-${index}`, 0.8, 3.9).toFixed(1);
    const o = seededFloat(seed, `dot-o-${index}`, 0.14, opacity).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${o}"/>`;
  }).join("");
}

function brushStrokes(seed, count, color = "#28433c", width = 1.2) {
  return Array.from({ length: count }, (_, index) => {
    const y = seededNumber(seed, `stroke-y-${index}`, 12, 62);
    const x = seededNumber(seed, `stroke-x-${index}`, 4, 28);
    const end = seededNumber(seed, `stroke-end-${index}`, 70, 98);
    const lift = seededNumber(seed, `stroke-lift-${index}`, -12, 12);
    const o = seededFloat(seed, `stroke-o-${index}`, 0.12, 0.42).toFixed(2);
    return `<path d="M${x} ${y} C${x + 22} ${y + lift}, ${end - 22} ${y - lift}, ${end} ${y + lift / 2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${o}"/>`;
  }).join("");
}

function generatedCanvasArt(doodle) {
  const seed = hashString(`${doodle.id}-${doodle.title}-${doodle.color}`);
  const palette = paletteFor(doodle, seed);
  const [a, b, c, d, e, f] = palette;
  const gid = `canvas_${String(doodle.id || seed).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  const styleTags = [
    "abstract-painting",
    "character-art",
    "sketch",
    "animation",
    "painting",
    "collage",
    "mood-map",
    "botanical-art",
    "geometric-art",
    "fantasy-character"
  ];
  const taggedStyle = styleTags.findIndex((tag) => doodle.tags?.includes(tag));
  const style = taggedStyle >= 0 ? taggedStyle : seed % styleTags.length;
  const defs = `
    <defs>
      <linearGradient id="${escapeHtml(gid)}_bg" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="${escapeHtml(a)}" offset="0"/>
        <stop stop-color="${escapeHtml(b)}" offset="0.54"/>
        <stop stop-color="${escapeHtml(c)}" offset="1"/>
      </linearGradient>
      <radialGradient id="${escapeHtml(gid)}_glow" cx="48%" cy="42%" r="55%">
        <stop stop-color="#f8fbf1" stop-opacity="0.82" offset="0"/>
        <stop stop-color="${escapeHtml(d)}" stop-opacity="0.34" offset="0.58"/>
        <stop stop-color="#28433c" stop-opacity="0.08" offset="1"/>
      </radialGradient>
      <filter id="${escapeHtml(gid)}_soft" x="-15%" y="-15%" width="130%" height="130%">
        <feGaussianBlur stdDeviation="0.55"/>
      </filter>
    </defs>`;

  const styles = [
    () => `
      <rect width="100" height="70" rx="5" fill="url(#${escapeHtml(gid)}_bg)"/>
      <path d="M-6 58 C18 28, 34 68, 58 35 S86 20, 106 48 L106 76 L-6 76Z" fill="#f8fbf1" opacity="0.34"/>
      <ellipse cx="29" cy="26" rx="24" ry="15" fill="${escapeHtml(d)}" opacity="0.48" transform="rotate(-18 29 26)"/>
      <ellipse cx="66" cy="42" rx="26" ry="13" fill="${escapeHtml(e)}" opacity="0.4" transform="rotate(13 66 42)"/>
      ${brushStrokes(seed, 7, "#28433c", 1.6)}
      ${dotField(seed, 14)}
      <path d="M15 58 C29 47, 41 61, 54 50 S79 49, 89 38" fill="none" stroke="#f8fbf1" stroke-width="2.5" stroke-linecap="round" opacity="0.62"/>`,
    () => `
      <rect width="100" height="70" rx="5" fill="url(#${escapeHtml(gid)}_bg)"/>
      <circle cx="50" cy="29" r="15" fill="#f8fbf1" opacity="0.72"/>
      <path d="M35 27 C38 10, 62 10, 66 28 C59 23, 45 22, 35 27Z" fill="${escapeHtml(d)}" opacity="0.78"/>
      <path d="M31 66 C33 48, 43 39, 51 39 S69 49, 72 66Z" fill="${escapeHtml(e)}" opacity="0.62"/>
      <path d="M43 29 q3 4 6 0 M56 29 q3 4 6 0 M47 36 C52 40, 58 40, 63 36" fill="none" stroke="#28433c" stroke-width="1.2" stroke-linecap="round" opacity="0.58"/>
      <path d="M23 52 C19 41, 24 32, 34 29 M78 53 C84 42, 79 33, 68 29" fill="none" stroke="#28433c" stroke-width="1.4" stroke-linecap="round" opacity="0.28"/>
      ${dotField(seed, 10, "#f8fbf1", 0.5)}
      <path d="M82 17 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#f8fbf1" opacity="0.62"/>`,
    () => `
      <rect width="100" height="70" rx="5" fill="#f8fbf1"/>
      <rect x="6" y="6" width="88" height="58" rx="4" fill="url(#${escapeHtml(gid)}_bg)" opacity="0.36"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${10 + i * 3} ${12 + i * 5} C${25 + i * 2} ${5 + i * 7}, ${49 - i} ${25 + i * 2}, ${83 - i * 2} ${11 + i * 5}" fill="none" stroke="#28433c" stroke-width="${i % 3 === 0 ? 1.5 : 0.8}" opacity="${i % 2 ? 0.22 : 0.38}" stroke-linecap="round"/>`).join("")}
      <circle cx="36" cy="33" r="14" fill="none" stroke="#28433c" stroke-width="1.2" opacity="0.3"/>
      <path d="M31 45 l13 -21 l14 28 l-25 -8 l29 -7" fill="none" stroke="${escapeHtml(d)}" stroke-width="2" opacity="0.62" stroke-linejoin="round"/>
      ${dotField(seed, 18, "#28433c", 0.18)}`,
    () => `
      <rect width="100" height="70" rx="5" fill="url(#${escapeHtml(gid)}_bg)"/>
      <circle cx="50" cy="35" r="22" fill="url(#${escapeHtml(gid)}_glow)" opacity="0.74"/>
      <g transform-origin="50 35">
        <animateTransform attributeName="transform" type="rotate" from="0 50 35" to="360 50 35" dur="${5 + seed % 5}s" repeatCount="indefinite"/>
        <ellipse cx="50" cy="35" rx="34" ry="12" fill="none" stroke="#f8fbf1" stroke-width="1.4" opacity="0.66"/>
        <ellipse cx="50" cy="35" rx="15" ry="31" fill="none" stroke="#28433c" stroke-width="1.1" opacity="0.26"/>
        <circle cx="84" cy="35" r="4" fill="${escapeHtml(e)}"/>
        <circle cx="50" cy="4" r="3" fill="#f8fbf1"/>
      </g>
      ${dotField(seed, 18, "#f8fbf1", 0.62)}
      <path d="M13 59 C26 49, 35 56, 47 49 S72 45, 88 55" fill="none" stroke="#28433c" stroke-width="1.2" opacity="0.25"/>`,
    () => `
      <rect width="100" height="70" rx="5" fill="${escapeHtml(f)}"/>
      ${Array.from({ length: 9 }, (_, i) => {
        const x = seededNumber(seed, `paint-x-${i}`, -8, 84);
        const y = seededNumber(seed, `paint-y-${i}`, 4, 58);
        const w = seededNumber(seed, `paint-w-${i}`, 18, 48);
        const h = seededNumber(seed, `paint-h-${i}`, 7, 22);
        const color = [a, b, c, d, e][i % 5];
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${seededNumber(seed, `paint-r-${i}`, 3, 12)}" fill="${escapeHtml(color)}" opacity="${seededFloat(seed, `paint-o-${i}`, 0.38, 0.82).toFixed(2)}" transform="rotate(${seededNumber(seed, `paint-rot-${i}`, -18, 18)} ${x + w / 2} ${y + h / 2})"/>`;
      }).join("")}
      ${brushStrokes(seed, 6, "#f8fbf1", 2.1)}
      ${dotField(seed, 22, "#28433c", 0.24)}`,
    () => `
      <rect width="100" height="70" rx="5" fill="url(#${escapeHtml(gid)}_bg)"/>
      <path d="M0 0 L34 0 L12 70 L0 70Z" fill="#f8fbf1" opacity="0.52"/>
      <path d="M66 0 L100 0 L100 70 L80 70Z" fill="${escapeHtml(d)}" opacity="0.5"/>
      <ellipse cx="50" cy="35" rx="19" ry="25" fill="#f8fbf1" opacity="0.68"/>
      <ellipse cx="50" cy="35" rx="10" ry="21" fill="${escapeHtml(e)}" opacity="0.42"/>
      <path d="M44 16 C31 25, 30 49, 45 59 M56 16 C71 27, 71 49, 55 59" fill="none" stroke="#28433c" stroke-width="1.1" opacity="0.32"/>
      <path d="M33 35 l-9 -7 l12 -2 M67 35 l9 -7 l-12 -2" fill="none" stroke="#f8fbf1" stroke-width="2" stroke-linecap="round" opacity="0.74"/>
      ${dotField(seed, 12, "#28433c", 0.22)}`,
    () => `
      <rect width="100" height="70" rx="5" fill="#101916"/>
      <rect width="100" height="70" rx="5" fill="url(#${escapeHtml(gid)}_bg)" opacity="0.54"/>
      ${Array.from({ length: 7 }, (_, i) => `<path d="M${seededNumber(seed, `map-x-${i}`, 0, 20)} ${seededNumber(seed, `map-y-${i}`, 10, 62)} C${seededNumber(seed, `map-c1-${i}`, 20, 40)} ${seededNumber(seed, `map-c2-${i}`, 0, 72)}, ${seededNumber(seed, `map-c3-${i}`, 56, 80)} ${seededNumber(seed, `map-c4-${i}`, 0, 72)}, ${seededNumber(seed, `map-end-${i}`, 82, 104)} ${seededNumber(seed, `map-end-y-${i}`, 10, 62)}" fill="none" stroke="#f8fbf1" stroke-width="${i % 2 ? 0.8 : 1.4}" opacity="${i % 2 ? 0.26 : 0.48}"/>`).join("")}
      ${dotField(seed, 28, "#f8fbf1", 0.76)}
      <path d="M20 50 l8 -15 l9 12 l9 -22 l12 28 l11 -16 l10 13" fill="none" stroke="${escapeHtml(e)}" stroke-width="2" stroke-linecap="round" opacity="0.62"/>`,
    () => `
      <rect width="100" height="70" rx="5" fill="url(#${escapeHtml(gid)}_bg)"/>
      ${Array.from({ length: 8 }, (_, i) => {
        const x = 12 + i * 10;
        const h = seededNumber(seed, `leaf-h-${i}`, 18, 48);
        return `<path d="M${x} 66 C${x - 2} ${54 - h / 5}, ${x + 2} ${38 - h / 4}, ${x} ${68 - h}" fill="none" stroke="#28433c" stroke-width="1.1" opacity="0.35"/><ellipse cx="${x - 5}" cy="${62 - h / 2}" rx="5" ry="9" fill="${escapeHtml([d, e, f, b][i % 4])}" opacity="0.6" transform="rotate(${-28 + i * 7} ${x - 5} ${62 - h / 2})"/><ellipse cx="${x + 5}" cy="${57 - h / 2}" rx="4" ry="8" fill="#f8fbf1" opacity="0.42" transform="rotate(${24 - i * 5} ${x + 5} ${57 - h / 2})"/>`;
      }).join("")}
      <circle cx="${seededNumber(seed, "sun-x", 18, 80)}" cy="${seededNumber(seed, "sun-y", 10, 28)}" r="8" fill="#f8fbf1" opacity="0.68"/>
      ${brushStrokes(seed, 4, "#f8fbf1", 1.1)}`,
    () => `
      <rect width="100" height="70" rx="5" fill="#f8fbf1"/>
      ${Array.from({ length: 35 }, (_, i) => {
        const x = (i % 7) * 15 - 2;
        const y = Math.floor(i / 7) * 16 - 4;
        const color = [a, b, c, d, e, f][i % 6];
        const shape = i % 3;
        if (shape === 0) return `<rect x="${x}" y="${y}" width="18" height="18" rx="5" fill="${escapeHtml(color)}" opacity="0.78"/>`;
        if (shape === 1) return `<circle cx="${x + 9}" cy="${y + 9}" r="9" fill="${escapeHtml(color)}" opacity="0.66"/>`;
        return `<path d="M${x} ${y + 18} L${x + 9} ${y} L${x + 18} ${y + 18}Z" fill="${escapeHtml(color)}" opacity="0.72"/>`;
      }).join("")}
      <path d="M0 35 H100 M50 0 V70" stroke="#28433c" stroke-width="0.8" opacity="0.16"/>`,
    () => `
      <rect width="100" height="70" rx="5" fill="url(#${escapeHtml(gid)}_bg)"/>
      <path d="M20 58 C18 39, 30 24, 48 26 C61 15, 79 24, 78 44 C78 58, 62 64, 49 59 C38 66, 23 64, 20 58Z" fill="#f8fbf1" opacity="0.56"/>
      <path d="M38 38 q3 4 6 0 M57 38 q3 4 6 0 M43 49 C50 53, 57 53, 64 48" fill="none" stroke="#28433c" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
      <path d="M29 26 C24 17, 29 11, 40 16 M67 25 C80 14, 87 22, 76 34" fill="none" stroke="${escapeHtml(e)}" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
      ${brushStrokes(seed, 5, "#28433c", 0.9)}
      ${dotField(seed, 16, "#f8fbf1", 0.55)}
      <path d="M10 60 C25 51, 38 65, 52 55 S78 51, 92 62" fill="none" stroke="#f8fbf1" stroke-width="2" stroke-linecap="round" opacity="0.58"/>`
  ];

  return `
    <svg class="generated-canvas-art" viewBox="0 0 100 70" role="img" aria-label="${escapeHtml(doodle.title)} artwork preview" xmlns="http://www.w3.org/2000/svg">
      ${defs}
      ${styles[style]()}
    </svg>
  `;
}

function postVisual(doodle) {
  if (doodle.type === "art") {
    if (doodle.artDataUrl) {
      return `<div class="art-preview uploaded"><img src="${doodle.artDataUrl}" alt="${escapeHtml(doodle.title)}"></div>`;
    }
    return `<div class="art-preview generated">${generatedCanvasArt(doodle)}</div>`;
  }
  if (doodle.type === "music") {
    const bars = Array.from({ length: 9 }, (_, i) => {
      const h = 22 + ((doodle.tempo + i * 13) % 54);
      return `<span style="height:${h}px"></span>`;
    }).join("");
    return `<button class="sound-preview play-doodle" type="button" data-tempo="${doodle.tempo}" aria-label="Play ${escapeHtml(doodle.title)}">${bars}</button>`;
  }
  return `<div class="scroll-preview"><span></span><span></span><span></span></div>`;
}

function reactionMenu(doodle) {
  const reactions = [
    ["glow", "Glow"],
    ["hush", "Hush"],
    ["spark", "Spark"],
    ["moon", "Moon"],
    ["leaf", "Leaf"]
  ];
  return `
    <div class="reaction-row" aria-label="Glow reactions">
      ${reactions.map(([key, label]) => `<button class="chip ${doodle.userGlow === key ? "active" : ""}" type="button" data-glow="${doodle.id}" data-reaction="${key}">${label}</button>`).join("")}
    </div>
  `;
}

function doodleCard(doodle, extra = "", index = 0) {
  const tags = doodle.tags?.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") || "";
  const saveLabel = doodle.saved ? "Cloud Clipped" : "Cloud Clip";
  const source = doodle.sourceName ? `<a class="source-pill" href="${escapeHtml(doodle.sourceUrl)}" target="_blank" rel="noreferrer">Source: ${escapeHtml(doodle.sourceName)}</a>` : "";
  return `
    <article class="post-card doodle-card ${extra}" style="--post-color:${doodle.color}; --i:${index}" data-doodle-card="${doodle.id}">
      <div class="post-meta">
        <a class="author-link" href="profile.html?u=${escapeHtml(doodle.author?.username || "")}">
          ${avatar(doodle.author)}
          <span><strong>${escapeHtml(doodle.author?.displayName || "Unknown")}</strong><small class="muted">@${escapeHtml(displayHandle(doodle.author))} · ${relativeTime(doodle.createdAt)}</small></span>
        </a>
        <span class="type-pill">${escapeHtml(typeName(doodle.type))}</span>
      </div>
      ${postVisual(doodle)}
      <div>
        <h3>${escapeHtml(doodle.title)}</h3>
        <p class="post-body">${escapeHtml(doodle.body)}</p>
      </div>
      ${source}
      <div class="tag-row">${tags}<span>${escapeHtml(doodle.mood)}</span></div>
      ${reactionMenu(doodle)}
      <div class="post-actions">
        <span class="muted">${doodle.glowCount} Glows · ${doodle.echoCount} Echoes · ${doodle.saveCount} Cloud Clips</span>
        <div class="mini-actions">
          <button class="icon-button echo-button" type="button" data-echo-open="${doodle.id}" title="Leave an Echo" aria-label="Leave an Echo">Echo</button>
          <button class="icon-button save-button ${doodle.saved ? "saved" : ""}" type="button" data-cloud="${doodle.id}" title="${saveLabel}" aria-label="${saveLabel}">Clip</button>
        </div>
      </div>
      <div class="echo-panel hidden" data-echo-panel="${doodle.id}"></div>
    </article>
  `;
}

function filteredDoodles() {
  let doodles = [...state.doodles];
  if (state.filter === "saved") doodles = doodles.filter((doodle) => doodle.saved);
  else if (["art", "music", "blog"].includes(state.filter)) doodles = doodles.filter((doodle) => doodle.type === state.filter);
  else if (state.filter !== "all") doodles = doodles.filter((doodle) => doodle.mood?.toLowerCase().includes(state.filter.toLowerCase()));

  const query = state.query.trim().toLowerCase();
  if (query) {
    doodles = doodles.filter((doodle) => [
      doodle.title,
      doodle.body,
      doodle.mood,
      doodle.author?.displayName,
      displayHandle(doodle.author),
      ...(doodle.tags || [])
    ].some((value) => String(value || "").toLowerCase().includes(query)));
  }

  if (state.sort === "glows") doodles.sort((a, b) => b.glowCount - a.glowCount);
  if (state.sort === "clouds") doodles.sort((a, b) => b.saveCount - a.saveCount);
  if (state.sort === "echoes") doodles.sort((a, b) => b.echoCount - a.echoCount);
  return doodles;
}

function renderDoodles(targetSelector = "#doodleGrid") {
  const grid = qs(targetSelector);
  if (!grid) return;
  grid.classList.toggle("list-view", state.view === "cozy");
  const doodles = filteredDoodles();
  const visible = doodles.slice(0, state.visibleLimit);
  if (!doodles.length) {
    grid.innerHTML = `<div class="empty-state"><div><h2>No Doodles here yet</h2><p class="muted">The next Cloud Clip or Doodle will drift in soon.</p></div></div>`;
  } else {
    grid.innerHTML = visible.map((doodle, index) => doodleCard(doodle, "", index)).join("");
  }
  bindDoodleActions(grid);
  updateLoadMore(doodles.length);
  updateStats();
}

function updateLoadMore(total) {
  const button = qs("#loadMoreDoodles");
  if (!button) return;
  button.classList.toggle("hidden", total <= state.visibleLimit);
  button.textContent = `Load more Doodles (${Math.max(0, total - state.visibleLimit)} left)`;
}

function bindDoodleActions(root = document) {
  qsa("[data-cloud]", root).forEach((button) => {
    button.addEventListener("click", async () => {
      if (!state.user) return toast("Enter the Den to save Cloud Clips.", true);
      try {
        await api(`/api/doodles/${button.dataset.cloud}/cloud`, { method: "POST", body: "{}" });
        await loadDoodles();
        if (page === "clips") await loadClips();
      } catch (error) {
        toast(error.message, true);
      }
    });
  });

  qsa("[data-glow]", root).forEach((button) => {
    button.addEventListener("click", async () => {
      if (!state.user) return toast("Enter the Den to Glow a Doodle.", true);
      try {
        await api(`/api/doodles/${button.dataset.glow}/glow`, {
          method: "POST",
          body: JSON.stringify({ reaction: button.dataset.reaction })
        });
        await loadDoodles();
        if (page === "glowboard") await loadGlowboard();
      } catch (error) {
        toast(error.message, true);
      }
    });
  });

  qsa("[data-echo-open]", root).forEach((button) => {
    button.addEventListener("click", () => toggleEchoPanel(button.dataset.echoOpen));
  });

  qsa(".play-doodle", root).forEach((button) => {
    button.addEventListener("click", () => playSequence(Number(button.dataset.tempo || 72)));
  });
}

async function toggleEchoPanel(doodleId) {
  const panel = qs(`[data-echo-panel="${doodleId}"]`);
  if (!panel) return;
  panel.classList.toggle("hidden");
  if (!panel.classList.contains("hidden")) await renderEchoPanel(doodleId, panel);
}

async function renderEchoPanel(doodleId, panel) {
  const data = await api(`/api/doodles/${doodleId}/echoes`);
  panel.innerHTML = `
    <div class="echo-list">
      ${data.echoes.map((echo) => `
        <div class="echo-item">
          ${avatar(echo.author)}
          <p><strong>${escapeHtml(echo.author?.displayName || "Someone")}</strong><br>${escapeHtml(echo.body)}</p>
        </div>
      `).join("") || `<p class="muted">No Echoes yet. Leave the first kind ripple.</p>`}
    </div>
    <form class="echo-form" data-echo-form="${doodleId}">
      <input name="body" placeholder="Echo something kind" autocomplete="off">
      <button class="button" type="submit">Leave Echo</button>
    </form>
  `;
  qs(`[data-echo-form="${doodleId}"]`, panel).addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return toast("Enter the Den to leave an Echo.", true);
    const data = Object.fromEntries(new FormData(event.target));
    try {
      await api(`/api/doodles/${doodleId}/echoes`, { method: "POST", body: JSON.stringify(data) });
      await renderEchoPanel(doodleId, panel);
      await loadDoodles();
    } catch (error) {
      toast(error.message, true);
    }
  });
}

function setupFilters() {
  qsa("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      state.visibleLimit = 36;
      qsa("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
      if (page === "clips") renderClipFilter();
      else renderDoodles();
    });
  });
}

function setupFeedControls() {
  qs("#feedSearch")?.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.visibleLimit = 36;
    renderDoodles();
  });

  qs("#feedSort")?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    state.visibleLimit = 36;
    renderDoodles();
  });

  qs("#loadMoreDoodles")?.addEventListener("click", () => {
    state.visibleLimit += 36;
    renderDoodles();
  });

  qs("#surpriseDoodle")?.addEventListener("click", () => {
    const doodles = filteredDoodles();
    if (!doodles.length) return;
    const pick = doodles[Math.floor(Math.random() * doodles.length)];
    state.visibleLimit = Math.max(state.visibleLimit, doodles.indexOf(pick) + 1);
    renderDoodles();
    qs(`[data-doodle-card="${pick.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  qsa("[data-view-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = state.view === "gallery" ? "cozy" : "gallery";
      button.textContent = state.view === "gallery" ? "Cozy View" : "Gallery View";
      renderDoodles();
    });
  });
}

function updateStats() {
  const stats = qs("#homeStats");
  if (!stats) return;
  const saved = state.doodles.filter((doodle) => doodle.saved).length;
  const glows = state.doodles.reduce((sum, doodle) => sum + doodle.glowCount, 0);
  stats.innerHTML = `
    <div class="stat"><strong>${state.doodles.length}</strong><span class="muted">Doodles</span></div>
    <div class="stat"><strong>${saved}</strong><span class="muted">Cloud Clips</span></div>
    <div class="stat"><strong>${glows}</strong><span class="muted">Glows</span></div>
  `;
}

function renderSpotlight() {
  const target = qs("#spotlightDoodle");
  if (!target || !state.doodles.length) return;
  const top = [...state.doodles].sort((a, b) => (b.glowCount + b.saveCount) - (a.glowCount + a.saveCount))[0];
  target.innerHTML = doodleCard(top, "spotlight-card");
  bindDoodleActions(target);
}

function setupMoodCanvas() {
  const canvas = qs("#moodCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const palettes = {
    Misty: ["#B8DEC8", "#BFD7EA", "#F8FBF1"],
    Sparkly: ["#E6DC8F", "#C7E6E2", "#F8FBF1"],
    Stormy: ["#BFD7EA", "#D9D0F0", "#28433C"],
    Floaty: ["#C7E6E2", "#D9D0F0", "#F8FBF1"],
    Cozy: ["#D7E8BA", "#E6DC8F", "#F8FBF1"],
    Brave: ["#B8DEC8", "#E6DC8F", "#28433C"]
  };
  const particles = Array.from({ length: 36 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 3 + (i % 6),
    speed: 0.001 + (i % 5) * 0.0005
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    const colors = palettes[state.mood] || palettes.Misty;
    const fill = ctx.createLinearGradient(0, 0, w, h);
    fill.addColorStop(0, colors[0]);
    fill.addColorStop(0.58, colors[1]);
    fill.addColorStop(1, colors[2]);
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(40, 67, 60, 0.18)";
    ctx.lineWidth = 2 * devicePixelRatio;
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      const y = h * (0.18 + i * 0.11);
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.28, y - 36, w * 0.62, y + 40, w, y - 8);
      ctx.stroke();
    }

    particles.forEach((p, index) => {
      p.y -= p.speed;
      if (p.y < -0.08) p.y = 1.08;
      ctx.beginPath();
      ctx.fillStyle = index % 3 === 0 ? "rgba(248,251,241,0.72)" : "rgba(40,67,60,0.12)";
      ctx.arc(p.x * w, p.y * h, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
  qsa("[data-mood]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mood = button.dataset.mood;
      qsa("[data-mood]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });
}

function quickDoodleWordCount(form) {
  const body = form?.elements?.body?.value || "";
  return body.trim() ? body.trim().split(/\s+/).length : 0;
}

function updateQuickDoodleMeter(form) {
  const count = quickDoodleWordCount(form);
  const meter = qs("#quickDoodleMeter");
  const countNode = qs("#quickDoodleCount");
  const hint = qs("#quickDoodleHint");
  if (meter) meter.style.width = `${Math.min(100, Math.round(count / 52 * 100))}%`;
  if (countNode) countNode.textContent = `${count} ${count === 1 ? "word" : "words"}`;
  if (!hint) return;
  if (count === 0) hint.textContent = "Start small. A few clear words are enough.";
  else if (count < 12) hint.textContent = "Nice beginning. Add one sensory detail to give it shape.";
  else if (count < 36) hint.textContent = "This has a good flow. A mood tag will make it easier to find.";
  else hint.textContent = "Strong little piece. Keep it focused and let it breathe.";
}

function primeQuickDoodleFromFlow(values) {
  const form = qs("#quickDoodleForm");
  if (!form) return;
  const presets = {
    blog: {
      type: "blog",
      title: "A small flowing note",
      body: "Today feels like a soft shift: one color, one sound, and one brave thought moving together.",
      mood: "Misty",
      tags: "writing, calm, flow"
    },
    art: {
      type: "art",
      title: "Color current sketch",
      body: "A visual Doodle built from layered lines, quiet color, and one bright mark that keeps moving.",
      mood: "Sparkly",
      tags: "canvas, color, flow"
    },
    music: {
      type: "music",
      title: "Low light loop",
      body: "A tiny Echo Doodle with soft pulses, warm tempo, and a little shimmer tucked underneath.",
      mood: "Floaty",
      tags: "music, echo, flow"
    },
    mood: {
      type: "blog",
      title: "Mood check in motion",
      body: "Right now my mood is changing shape slowly, and I want to notice the part that feels easier.",
      mood: "Brave",
      tags: "mood, reflection, flow"
    }
  };
  const preset = presets[values.focus] || presets.blog;
  const energyNote = values.energy >= 4 ? " high-energy" : values.energy <= 2 ? " gentle" : " balanced";
  form.elements.type.value = preset.type;
  form.elements.title.value = preset.title;
  form.elements.body.value = `${preset.body} This one has a${energyNote} pace.`;
  form.elements.mood.value = preset.mood;
  form.elements.tags.value = preset.tags;
  form.classList.add("is-primed");
  setTimeout(() => form.classList.remove("is-primed"), 1400);
  updateQuickDoodleMeter(form);
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setupFlowTuner() {
  const hero = qs(".flow-hero");
  if (!hero) return;
  const suggestion = qs("#flowSuggestion");
  const focusControl = qs("#flowFocus");
  const palettes = {
    blog: ["#c7e6e2", "#e6dc8f"],
    art: ["#f5c2e7", "#b8dec8"],
    music: ["#bfd7ea", "#d9d0f0"],
    mood: ["#d7e8ba", "#f5c2e7"]
  };
  const focusCopy = {
    blog: "writing flow",
    art: "visual flow",
    music: "sound flow",
    mood: "mood-check flow"
  };
  let lastFocus = "";

  function values() {
    return {
      energy: Number(qs("#flowEnergy")?.value || 3),
      pace: Number(qs("#flowPace")?.value || 2),
      focus: focusControl?.value || "blog"
    };
  }

  function syncFeedFocus(focus) {
    if (focus === lastFocus) return;
    lastFocus = focus;
    state.filter = ["art", "music", "blog"].includes(focus) ? focus : "all";
    qsa("[data-filter]").forEach((item) => item.classList.toggle("active", item.dataset.filter === state.filter));
    renderDoodles();
  }

  function render() {
    const next = values();
    const palette = palettes[next.focus] || palettes.blog;
    const pace = next.pace <= 2 ? "calm discovery" : next.pace >= 4 ? "quick discovery" : "steady discovery";
    const energy = next.energy <= 2 ? "gentle" : next.energy >= 4 ? "bright" : "balanced";
    hero.style.setProperty("--flow-a", palette[0]);
    hero.style.setProperty("--flow-b", palette[1]);
    hero.style.setProperty("--flow-lift", `${next.energy * 11}px`);
    hero.style.setProperty("--flow-lift-strong", `${next.energy * 13}px`);
    hero.style.setProperty("--flow-lift-bright", `${next.energy * 17}px`);
    hero.style.setProperty("--flow-lift-soft", `${next.energy * 9}px`);
    hero.style.setProperty("--flow-speed", `${Math.max(3, 9 - next.pace)}s`);
    if (suggestion) {
      suggestion.textContent = `A ${energy} ${focusCopy[next.focus]} with ${pace} and fewer distractions.`;
    }
    syncFeedFocus(next.focus);
  }

  qsa("[data-flow-control]").forEach((control) => {
    control.addEventListener("input", render);
    control.addEventListener("change", render);
  });

  qs("[data-flow-randomize]")?.addEventListener("click", () => {
    const focusOptions = ["blog", "art", "music", "mood"];
    qs("#flowEnergy").value = String(1 + Math.floor(Math.random() * 5));
    qs("#flowPace").value = String(1 + Math.floor(Math.random() * 5));
    focusControl.value = focusOptions[Math.floor(Math.random() * focusOptions.length)];
    render();
  });

  qsa("[data-flow-fill]").forEach((button) => {
    button.addEventListener("click", () => primeQuickDoodleFromFlow(values()));
  });

  render();
}

function setupQuickDoodle() {
  const form = qs("#quickDoodleForm");
  if (!form) return;
  qsa("[data-quick-prompt]", form).forEach((button) => {
    button.addEventListener("click", () => {
      form.elements.body.value = `${button.dataset.quickPrompt} `;
      form.elements.body.focus();
      updateQuickDoodleMeter(form);
    });
  });
  form.elements.body?.addEventListener("input", () => updateQuickDoodleMeter(form));
  form.elements.title?.addEventListener("input", () => updateQuickDoodleMeter(form));
  updateQuickDoodleMeter(form);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return toast("Enter the Den to post a Doodle.", true);
    const data = Object.fromEntries(new FormData(form));
    try {
      await api("/api/doodles", {
        method: "POST",
        body: JSON.stringify({ ...data, tags: data.tags || "check-in", color: "#B8DEC8" })
      });
      form.reset();
      updateQuickDoodleMeter(form);
      toast("Your Doodle flowed into the feed.");
      await loadDoodles();
    } catch (error) {
      toast(error.message, true);
    }
  });
}

function setupLogin() {
  const login = qs("#loginForm");
  const register = qs("#registerForm");
  qsa("[data-auth-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const mode = tab.dataset.authTab;
      qsa("[data-auth-tab]").forEach((item) => item.classList.toggle("active", item === tab));
      login.classList.toggle("hidden", mode !== "login");
      register.classList.toggle("hidden", mode !== "register");
    });
  });

  login?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(login)))
      });
      window.location.href = "index.html";
    } catch (error) {
      toast(error.message, true);
    }
  });

  register?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(register)))
      });
      if (result.requiresConfirmation) {
        toast(result.message || "Account created. Check your email, then sign in.");
        qs('[data-auth-tab="login"]')?.click();
        return;
      }
      window.location.href = "profile.html";
    } catch (error) {
      toast(error.message, true);
    }
  });
}

function setupPainter() {
  const canvas = qs("#paintCanvas");
  const form = qs("#artDoodleForm");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let lastPoint = null;
  let historyIndex = -1;
  const history = [];
  let activePalette = ["#7DBFA2", "#8CB9D9", "#D9D0F0", "#E6DC8F", "#28433C"];
  let activeStamp = "spark";
  let didInitialHistory = false;

  state.paintTool = "brush";
  state.brushOpacity = 0.92;
  state.blendMode = "source-over";
  state.mirrorPaint = false;

  function drawCanvasBackdrop() {
    const width = canvas.width;
    const height = canvas.height;
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, activePalette[3] || "#edf8f4");
    bg.addColorStop(0.52, activePalette[1] || "#cfe5ea");
    bg.addColorStop(1, "#f8fbf1");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const cssWidth = width / devicePixelRatio;
    const cssHeight = height / devicePixelRatio;
    ctx.globalAlpha = 0.34;
    ctx.strokeStyle = activePalette[4] || "#28433c";
    ctx.lineWidth = 1;
    for (let y = 42; y < cssHeight; y += 48) {
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.bezierCurveTo(cssWidth * 0.28, y - 18, cssWidth * 0.56, y + 18, cssWidth - 18, y - 8);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#f8fbf1";
    ctx.beginPath();
    ctx.arc(cssWidth * 0.18, cssHeight * 0.23, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.56;
    ctx.fillStyle = activePalette[4] || "#28433c";
    ctx.font = "700 18px Inter, sans-serif";
    ctx.fillText("Canvas Cave", 24, 32);
    ctx.globalAlpha = 0.45;
    ctx.font = "500 13px Inter, sans-serif";
    ctx.fillText("Draw your weather today", 24, 54);
    ctx.restore();
  }

  function updateHistoryButtons() {
    const undo = qs("#undoCanvas");
    const redo = qs("#redoCanvas");
    if (undo) undo.disabled = historyIndex <= 0;
    if (redo) redo.disabled = historyIndex >= history.length - 1;
  }

  function pushHistory() {
    if (!canvas.width || !canvas.height) return;
    history.splice(historyIndex + 1);
    history.push(canvas.toDataURL("image/png"));
    if (history.length > 24) history.shift();
    historyIndex = history.length - 1;
    updateHistoryButtons();
  }

  function restoreHistory(index) {
    if (index < 0 || index >= history.length) return;
    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      historyIndex = index;
      updateHistoryButtons();
    };
    image.src = history[index];
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const snapshot = document.createElement("canvas");
    const hadDrawing = canvas.width > 0 && canvas.height > 0;
    snapshot.width = canvas.width || 1;
    snapshot.height = canvas.height || 1;
    if (hadDrawing) snapshot.getContext("2d").drawImage(canvas, 0, 0);
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.width * 0.75 * devicePixelRatio;
    drawCanvasBackdrop();
    if (hadDrawing) ctx.drawImage(snapshot, 0, 0, canvas.width, canvas.height);
    if (!didInitialHistory) {
      didInitialHistory = true;
      pushHistory();
    }
  }

  function pointer(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * devicePixelRatio, y: (event.clientY - rect.top) * devicePixelRatio };
  }

  function mirrorPoint(point) {
    return { x: canvas.width - point.x, y: point.y };
  }

  function applyPaintStyle() {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = state.brushOpacity;
    ctx.globalCompositeOperation = state.paintTool === "eraser" ? "destination-out" : state.blendMode;
    ctx.strokeStyle = state.paintColor;
    ctx.fillStyle = state.paintColor;
    ctx.lineWidth = state.brushSize * devicePixelRatio;

    if (state.paintTool === "marker") {
      ctx.globalAlpha = Math.max(0.18, state.brushOpacity * 0.48);
      ctx.globalCompositeOperation = state.blendMode === "source-over" ? "multiply" : state.blendMode;
      ctx.lineWidth = state.brushSize * 1.85 * devicePixelRatio;
    }

    if (state.paintTool === "eraser") {
      ctx.globalAlpha = 1;
      ctx.lineWidth = state.brushSize * 1.55 * devicePixelRatio;
    }
  }

  function drawSegment(from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    if (state.mirrorPaint) {
      const mirroredFrom = mirrorPoint(from);
      const mirroredTo = mirrorPoint(to);
      ctx.beginPath();
      ctx.moveTo(mirroredFrom.x, mirroredFrom.y);
      ctx.lineTo(mirroredTo.x, mirroredTo.y);
      ctx.stroke();
    }
  }

  function sprayAt(point) {
    ctx.save();
    applyPaintStyle();
    const radius = state.brushSize * 1.9 * devicePixelRatio;
    const dots = Math.max(18, Math.round(state.brushSize * 2.4));
    for (let i = 0; i < dots; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = point.x + Math.cos(angle) * distance;
      const y = point.y + Math.sin(angle) * distance;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1.2, Math.random() * 2.8) * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function starPath(size) {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (Math.PI / 5) * i;
      const radius = i % 2 === 0 ? size : size * 0.45;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawStamp(point) {
    const size = Math.max(14, state.brushSize * 2.8) * devicePixelRatio;
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.globalAlpha = state.brushOpacity;
    ctx.globalCompositeOperation = state.blendMode;
    ctx.fillStyle = state.paintColor;
    ctx.strokeStyle = activePalette[4] || "#28433c";
    ctx.lineWidth = Math.max(2, state.brushSize * 0.28) * devicePixelRatio;

    if (activeStamp === "moon") {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.72, 0, Math.PI * 2);
      ctx.arc(size * 0.32, -size * 0.18, size * 0.72, Math.PI * 2, 0, true);
      ctx.fill("evenodd");
    } else if (activeStamp === "heart") {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.48);
      ctx.bezierCurveTo(-size, -size * 0.12, -size * 0.5, -size * 0.75, 0, -size * 0.35);
      ctx.bezierCurveTo(size * 0.5, -size * 0.75, size, -size * 0.12, 0, size * 0.48);
      ctx.fill();
    } else if (activeStamp === "leaf") {
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.42, size * 0.9, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size * 0.32, size * 0.44);
      ctx.lineTo(size * 0.34, -size * 0.46);
      ctx.stroke();
    } else if (activeStamp === "portal") {
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.7, size * 0.96, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha *= 0.62;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.42, size * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (activeStamp === "frame") {
      ctx.strokeRect(-size * 0.7, -size * 0.48, size * 1.4, size * 0.96);
      ctx.globalAlpha *= 0.55;
      ctx.fillRect(-size * 0.52, -size * 0.3, size * 1.04, size * 0.6);
    } else {
      starPath(size * 0.72);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStampSet(point) {
    drawStamp(point);
    if (state.mirrorPaint) drawStamp(mirrorPoint(point));
  }

  function start(event) {
    event.preventDefault();
    const p = pointer(event);
    if (state.paintTool === "stamp") {
      drawStampSet(p);
      pushHistory();
      return;
    }
    if (state.paintTool === "spray") {
      drawing = true;
      sprayAt(p);
      if (state.mirrorPaint) sprayAt(mirrorPoint(p));
      return;
    }
    drawing = true;
    lastPoint = p;
    ctx.save();
    applyPaintStyle();
  }

  function move(event) {
    if (!drawing) return;
    event.preventDefault();
    const p = pointer(event);
    if (state.paintTool === "spray") {
      sprayAt(p);
      if (state.mirrorPaint) sprayAt(mirrorPoint(p));
      return;
    }
    drawSegment(lastPoint || p, p);
    lastPoint = p;
  }

  function finishDrawing() {
    if (!drawing) return;
    drawing = false;
    lastPoint = null;
    if (state.paintTool !== "spray") ctx.restore();
    pushHistory();
  }

  function bindSwatches() {
    qsa("[data-swatch]").forEach((button) => {
      button.style.background = button.dataset.swatch;
      button.addEventListener("click", () => {
        state.paintColor = button.dataset.swatch;
        const customColor = qs("#customPaintColor");
        if (customColor) customColor.value = state.paintColor;
        qsa("[data-swatch]").forEach((item) => item.classList.toggle("active", item === button));
      });
    });
  }

  function renderSwatches(colors) {
    const tray = qs("#swatchTray");
    if (!tray) return;
    tray.innerHTML = colors.map((color, index) => `
      <button class="swatch ${index === 0 ? "active" : ""}" type="button" data-swatch="${escapeHtml(color)}" style="background:${escapeHtml(color)}" title="${escapeHtml(color)}"></button>
    `).join("");
    state.paintColor = colors[0];
    const customColor = qs("#customPaintColor");
    if (customColor) customColor.value = colors[0];
    bindSwatches();
  }

  function remixCanvas() {
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext("2d").drawImage(canvas, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.18;
    ctx.drawImage(snapshot, 8 * devicePixelRatio, -6 * devicePixelRatio);
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.13;
    ctx.drawImage(snapshot, -10 * devicePixelRatio, 8 * devicePixelRatio);
    ctx.globalCompositeOperation = "source-over";
    for (let i = 0; i < 7; i += 1) {
      ctx.strokeStyle = activePalette[i % activePalette.length];
      ctx.globalAlpha = 0.24;
      ctx.lineWidth = (2 + i * 0.45) * devicePixelRatio;
      ctx.beginPath();
      const y = canvas.height * (0.18 + i * 0.1);
      ctx.moveTo(canvas.width * 0.08, y);
      ctx.bezierCurveTo(canvas.width * 0.32, y - 42 * devicePixelRatio, canvas.width * 0.64, y + 42 * devicePixelRatio, canvas.width * 0.92, y - 10 * devicePixelRatio);
      ctx.stroke();
    }
    ctx.restore();
    pushHistory();
  }

  function addTexture() {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    for (let i = 0; i < 180; i += 1) {
      ctx.globalAlpha = Math.random() * 0.16 + 0.04;
      ctx.fillStyle = activePalette[i % activePalette.length] || state.paintColor;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, (Math.random() * 2.8 + 0.8) * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = activePalette[4] || "#28433c";
    ctx.lineWidth = 1 * devicePixelRatio;
    for (let y = 0; y < canvas.height; y += 18 * devicePixelRatio) {
      ctx.beginPath();
      ctx.moveTo(0, y + Math.random() * 8 * devicePixelRatio);
      ctx.lineTo(canvas.width, y + Math.random() * 8 * devicePixelRatio);
      ctx.stroke();
    }
    ctx.restore();
    pushHistory();
  }

  function filterCanvas(type) {
    if (type === "texture") {
      addTexture();
      return;
    }
    if (type === "invert") {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < image.data.length; i += 4) {
        image.data[i] = 255 - image.data[i];
        image.data[i + 1] = 255 - image.data[i + 1];
        image.data[i + 2] = 255 - image.data[i + 2];
      }
      ctx.putImageData(image, 0, 0);
      pushHistory();
      return;
    }
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext("2d").drawImage(canvas, 0, 0);
    ctx.save();
    if (type === "blur") ctx.filter = "blur(2.2px) saturate(1.08)";
    if (type === "glow") {
      ctx.filter = "blur(7px) saturate(1.35)";
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.42;
    }
    ctx.drawImage(snapshot, 0, 0);
    ctx.restore();
    pushHistory();
  }

  function addPosterText() {
    const input = qs("#canvasText");
    const text = input?.value.trim();
    if (!text) {
      input?.focus();
      return toast("Type text before adding it to the canvas.", true);
    }
    const maxWidth = canvas.width * 0.78;
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    ctx.save();
    ctx.globalAlpha = state.brushOpacity;
    ctx.globalCompositeOperation = state.blendMode;
    ctx.fillStyle = state.paintColor;
    ctx.strokeStyle = "rgba(248, 251, 241, 0.78)";
    ctx.lineWidth = 5 * devicePixelRatio;
    ctx.font = `800 ${Math.max(24, state.brushSize * 3.2) * devicePixelRatio}px Inter, sans-serif`;
    words.forEach((word) => {
      const test = `${line} ${word}`.trim();
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    const startY = canvas.height * 0.52 - (lines.length - 1) * 22 * devicePixelRatio;
    lines.slice(0, 4).forEach((textLine, index) => {
      const x = canvas.width * 0.12;
      const y = startY + index * 44 * devicePixelRatio;
      ctx.strokeText(textLine, x, y);
      ctx.fillText(textLine, x, y);
    });
    ctx.restore();
    pushHistory();
  }

  function importImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.drawImage(image, x, y, width, height);
        ctx.restore();
        pushHistory();
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("pointerdown", start);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerleave", finishDrawing);
  window.addEventListener("pointerup", finishDrawing);

  bindSwatches();

  qsa("[data-palette]").forEach((button) => {
    button.addEventListener("click", () => {
      activePalette = button.dataset.palette.split(",").map((color) => color.trim());
      qsa("[data-palette]").forEach((item) => item.classList.toggle("active", item === button));
      renderSwatches(activePalette);
      toast(`${button.dataset.paletteName || "Palette"} loaded.`);
    });
  });

  qs("#brushSize")?.addEventListener("input", (event) => {
    state.brushSize = Number(event.target.value);
    qs("#brushValue").textContent = state.brushSize;
  });

  qs("#brushOpacity")?.addEventListener("input", (event) => {
    state.brushOpacity = Number(event.target.value) / 100;
    qs("#opacityValue").textContent = event.target.value;
  });

  qs("#blendMode")?.addEventListener("change", (event) => {
    state.blendMode = event.target.value;
  });

  qs("#customPaintColor")?.addEventListener("input", (event) => {
    state.paintColor = event.target.value;
    qsa("[data-swatch]").forEach((item) => item.classList.remove("active"));
  });

  qs("#pickCanvasColor")?.addEventListener("click", async () => {
    if (!window.EyeDropper) return toast("Eyedropper is not available in this browser.", true);
    try {
      const result = await new window.EyeDropper().open();
      state.paintColor = result.sRGBHex;
      const customColor = qs("#customPaintColor");
      if (customColor) customColor.value = result.sRGBHex;
      qsa("[data-swatch]").forEach((item) => item.classList.remove("active"));
    } catch {
      toast("Eyedropper cancelled.");
    }
  });

  qs("#mirrorPaint")?.addEventListener("change", (event) => {
    state.mirrorPaint = event.target.checked;
  });

  qsa("[data-paint-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      state.paintTool = button.dataset.paintTool;
      qsa("[data-paint-tool]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });

  qsa("[data-stamp]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStamp = button.dataset.stamp;
      qsa("[data-stamp]").forEach((item) => item.classList.toggle("active", item === button));
      state.paintTool = "stamp";
      qsa("[data-paint-tool]").forEach((item) => item.classList.toggle("active", item.dataset.paintTool === "stamp"));
    });
  });

  qs("#clearCanvas")?.addEventListener("click", () => {
    drawCanvasBackdrop();
    pushHistory();
  });

  qs("#fillCanvas")?.addEventListener("click", () => {
    drawCanvasBackdrop();
    pushHistory();
  });

  qs("#remixCanvas")?.addEventListener("click", remixCanvas);

  qsa("[data-canvas-filter]").forEach((button) => {
    button.addEventListener("click", () => filterCanvas(button.dataset.canvasFilter));
  });

  qs("#undoCanvas")?.addEventListener("click", () => restoreHistory(historyIndex - 1));
  qs("#redoCanvas")?.addEventListener("click", () => restoreHistory(historyIndex + 1));

  qs("#uploadCanvasImage")?.addEventListener("click", () => qs("#imageUpload")?.click());
  qs("#imageUpload")?.addEventListener("change", (event) => importImage(event.target.files?.[0]));
  qs("#addCanvasText")?.addEventListener("click", addPosterText);

  qs("#downloadCanvas")?.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `doodledrift-canvas-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  qsa("[data-art-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      qs("#artPrompt").value = button.dataset.artPrompt;
    });
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return toast("Enter the Den before sharing a Canvas Doodle.", true);
    const data = Object.fromEntries(new FormData(form));
    try {
      await api("/api/doodles", {
        method: "POST",
        body: JSON.stringify({ ...data, type: "art", artDataUrl: canvas.toDataURL("image/png"), color: state.paintColor })
      });
      form.reset();
      toast("Your Canvas Doodle joined the Flow.");
    } catch (error) {
      toast(error.message, true);
    }
  });
}

function audioContext() {
  if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
  return state.audio;
}

function playTone(freq, duration = 0.35, when = 0, options = {}) {
  const ctx = audioContext();
  ctx.resume?.();
  const start = ctx.currentTime + when;
  const echoAmount = Number.isFinite(options.echo) ? options.echo : 0.22;
  const filterAmount = Number.isFinite(options.filter) ? options.filter : 0.54;
  const gainAmount = Number.isFinite(options.gain) ? options.gain : 0.13;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const delay = ctx.createDelay();
  const feedback = ctx.createGain();
  const wet = ctx.createGain();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(520 + filterAmount * 720, start);
  filter.frequency.exponentialRampToValueAtTime(1200 + filterAmount * 1800, start + 0.08);
  filter.frequency.exponentialRampToValueAtTime(420 + filterAmount * 760, start + duration);
  delay.delayTime.value = 0.12 + echoAmount * 0.22;
  feedback.gain.value = Math.min(0.5, echoAmount * 0.52);
  wet.gain.value = Math.min(0.24, echoAmount * 0.2);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainAmount, start + 0.05);
  gain.gain.linearRampToValueAtTime(gainAmount * 0.72, start + Math.max(0.06, duration * 0.5));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  gain.connect(filter);
  filter.connect(ctx.destination);
  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(ctx.destination);

  [
    { type: options.wave || "sine", frequency: freq, detune: -4 },
    { type: options.overtone || "triangle", frequency: freq * 2, detune: 3 }
  ].forEach((voice) => {
    const osc = ctx.createOscillator();
    osc.type = voice.type;
    osc.frequency.value = voice.frequency;
    osc.detune.value = voice.detune;
    osc.connect(gain);
    osc.start(start);
    osc.stop(start + duration + 0.22);
  });
}

function playSequence(tempo = 72, tones = [261.63, 329.63, 392, 523.25, 440, 349.23], options = {}) {
  const beat = 60 / tempo;
  tones.forEach((freq, index) => playTone(freq, beat * 0.72, index * beat * 0.55, options));
  return tones.length * beat * 0.55 + beat;
}

async function setupMusic() {
  const pads = qsa(".note-pad");
  const tempo = qs("#tempo");
  const tempoValue = qs("#tempoValue");
  const form = qs("#musicDoodleForm");

  pads.forEach((pad) => {
    pad.addEventListener("click", () => {
      playTone(Number(pad.dataset.freq), 0.55);
      pad.classList.add("playing");
      setTimeout(() => pad.classList.remove("playing"), 220);
    });
  });

  tempo?.addEventListener("input", () => {
    tempoValue.textContent = tempo.value;
  });

  qs("#playPattern")?.addEventListener("click", () => playSequence(Number(tempo?.value || 72)));

  function djValue(id, fallback) {
    const value = Number(qs(id)?.value);
    return Number.isFinite(value) ? value : fallback;
  }

  function updateDjOutputs() {
    [
      ["#deckATempo", "#deckATempoValue"],
      ["#deckBTempo", "#deckBTempoValue"],
      ["#djCrossfade", "#djCrossfadeValue"],
      ["#djEcho", "#djEchoValue"],
      ["#djFilter", "#djFilterValue"]
    ].forEach(([inputId, outputId]) => {
      const input = qs(inputId);
      const output = qs(outputId);
      if (input && output) output.textContent = input.value;
    });
  }

  function deckGain(deck) {
    const crossfade = djValue("#djCrossfade", 50) / 100;
    if (deck === "A") return 0.18 * (1 - crossfade + 0.2);
    if (deck === "B") return 0.18 * (crossfade + 0.2);
    return 0.13;
  }

  function playDjTrigger(button, delay = 0) {
    const deck = button.dataset.deck || "mix";
    const tempoId = deck === "A" ? "#deckATempo" : deck === "B" ? "#deckBTempo" : null;
    const tempoValue = tempoId ? djValue(tempoId, Number(button.dataset.tempo || 90)) : Number(button.dataset.tempo || 90);
    const tones = button.dataset.tones.split(",").map(Number).filter(Boolean);
    const beat = 60 / tempoValue;
    const seconds = tones.length * beat * 0.55 + beat;
    const run = () => {
      playSequence(tempoValue, tones, {
        gain: deckGain(deck),
        echo: djValue("#djEcho", 38) / 100,
        filter: djValue("#djFilter", 54) / 100,
        wave: deck === "B" ? "triangle" : "sine",
        overtone: deck === "B" ? "sawtooth" : "triangle"
      });
      qsa(".dj-deck, .dj-mixer").forEach((item) => item.classList.remove("is-cued"));
      button.closest(".dj-deck, .dj-mixer")?.classList.add("is-cued");
      button.classList.add("is-playing");
      qs(".dj-console")?.classList.add("is-live");
      setTimeout(() => {
        button.classList.remove("is-playing");
        qs(".dj-console")?.classList.remove("is-live");
      }, seconds * 1000);
    };
    if (delay > 0) setTimeout(run, delay * 1000);
    else run();
    return seconds;
  }

  qsa(".dj-slider input").forEach((input) => input.addEventListener("input", updateDjOutputs));
  updateDjOutputs();

  qsa("[data-dj-trigger]").forEach((button) => {
    button.addEventListener("click", () => playDjTrigger(button));
  });

  qs("#playDjSet")?.addEventListener("click", () => {
    const triggers = qsa("[data-dj-trigger]");
    const a = triggers.find((button) => button.dataset.deck === "A");
    const mix = triggers.find((button) => button.dataset.deck === "mix");
    const b = triggers.find((button) => button.dataset.deck === "B");
    let next = 0;
    [a, mix, b].filter(Boolean).forEach((button) => {
      const seconds = playDjTrigger(button, next);
      next += Math.max(1.4, seconds * 0.58);
    });
  });

  const playlistTarget = qs("#playlistGrid");
  if (playlistTarget) {
    const data = await api("/api/playlists");
    playlistTarget.innerHTML = data.playlists.map((playlist) => `
      <button class="playlist-card" type="button" style="--post-color:${playlist.color}" data-tones="${playlist.tones.join(",")}" aria-label="Play original generated ${escapeHtml(playlist.name)} tone sketch">
        <strong>${escapeHtml(playlist.name)}</strong>
        <span>${escapeHtml(playlist.mood)}</span>
        <small>Original generated tones</small>
      </button>
    `).join("");
    qsa("[data-tones]", playlistTarget).forEach((button) => {
      button.addEventListener("click", () => {
        qsa(".playlist-card", playlistTarget).forEach((item) => item.classList.remove("is-playing"));
        const seconds = playSequence(72, button.dataset.tones.split(",").map(Number));
        button.classList.add("is-playing");
        setTimeout(() => button.classList.remove("is-playing"), seconds * 1000);
      });
    });
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return toast("Enter the Den before sharing an Echo Doodle.", true);
    const data = Object.fromEntries(new FormData(form));
    try {
      await api("/api/doodles", {
        method: "POST",
        body: JSON.stringify({ ...data, type: "music", tempo: Number(tempo.value), color: "#BFD7EA" })
      });
      form.reset();
      tempo.value = 72;
      tempoValue.textContent = "72";
      toast("Your Echo Doodle joined the Flow.");
    } catch (error) {
      toast(error.message, true);
    }
  });
}

function setupBlog() {
  const prompts = [
    "The color my feeling wants today is...",
    "A song that could hold this moment would sound like...",
    "The small door I am ready to open is...",
    "If my worry became weather, it would change when...",
    "One kind sentence I can borrow from tomorrow is..."
  ];
  const prompt = qs("#promptCard");
  const body = qs("#blogBody");
  const meter = qs("#wordMeter span");
  const count = qs("#wordCount");
  const form = qs("#blogDoodleForm");

  function newPrompt() {
    prompt.textContent = prompts[Math.floor(Math.random() * prompts.length)];
    qs("#blogPrompt").value = prompt.textContent;
  }

  function updateWords() {
    const words = body.value.trim() ? body.value.trim().split(/\s+/).length : 0;
    count.textContent = `${words} words`;
    meter.style.width = `${Math.min(100, words)}%`;
  }

  qs("#newPrompt")?.addEventListener("click", newPrompt);
  body?.addEventListener("input", updateWords);
  newPrompt();
  updateWords();

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return toast("Enter the Den before publishing a Story Doodle.", true);
    const data = Object.fromEntries(new FormData(form));
    try {
      await api("/api/doodles", {
        method: "POST",
        body: JSON.stringify({ ...data, type: "blog", body: body.value, color: "#E6DC8F" })
      });
      form.reset();
      newPrompt();
      updateWords();
      toast("Your Story Doodle joined the Flow.");
    } catch (error) {
      toast(error.message, true);
    }
  });
}

async function loadClips() {
  const grid = qs("#clipGrid");
  if (!grid) return;
  if (!state.user) {
    grid.innerHTML = `<div class="empty-state"><div><h2>Enter the Den to gather Cloud Clips</h2><p class="muted">Saved Doodles become your private inspiration sky.</p><a class="button" href="login.html">Enter the Den</a></div></div>`;
    return;
  }
  const data = await api("/api/clips");
  state.clips = data.clips;
  renderClipFilter();
}

function renderClipFilter() {
  const grid = qs("#clipGrid");
  if (!grid) return;
  const clips = (state.clips || []).filter((clip) => state.filter === "all" || clip.doodle.type === state.filter || clip.collection === state.filter);
  if (!clips.length) {
    grid.innerHTML = `<div class="empty-state"><div><h2>No Cloud Clips yet</h2><p class="muted">Save Doodles from the feed to build an inspiration sky.</p></div></div>`;
    return;
  }
  grid.innerHTML = clips.map((clip) => `
    <div class="clip-wrap">
      ${doodleCard(clip.doodle, "clip-card")}
      <div class="panel clip-editor">
        <label>Collection
          <select data-collection="${clip.doodleId}">
            ${["Calm Clouds", "Music Magic", "Art Sparks", "Writing Wisps", "Healing Hues", "Dream Boards"].map((name) => `<option ${clip.collection === name ? "selected" : ""}>${name}</option>`).join("")}
          </select>
        </label>
        <label>Private note
          <textarea class="clip-note" data-note="${clip.doodleId}" placeholder="Why did this Doodle shimmer?">${escapeHtml(clip.note || "")}</textarea>
        </label>
      </div>
    </div>
  `).join("");
  bindDoodleActions(grid);
  bindClipEditors(grid);
}

function bindClipEditors(root) {
  qsa("[data-note], [data-collection]", root).forEach((field) => {
    let timer;
    field.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => saveClipEditor(field), 450);
    });
    field.addEventListener("change", () => saveClipEditor(field));
  });
}

async function saveClipEditor(field) {
  const id = field.dataset.note || field.dataset.collection;
  const note = qs(`[data-note="${id}"]`)?.value || "";
  const collection = qs(`[data-collection="${id}"]`)?.value || "Dream Boards";
  await api(`/api/clips/${id}`, { method: "PATCH", body: JSON.stringify({ note, collection }) });
}

async function setupProfile() {
  const shell = qs("#profileShell");
  if (!shell) return;
  const params = new URLSearchParams(location.search);
  const username = params.get("u") || state.user?.username;
  if (!username) {
    shell.innerHTML = `<div class="empty-state"><div><h2>Enter the Den to shape your DoodleDen</h2><a class="button" href="login.html">Enter the Den</a></div></div>`;
    return;
  }
  const data = await api(`/api/profile/${username}`);
  const own = sameHandle(state.user?.username, data.profile.username);
  shell.innerHTML = `
    <aside class="panel profile-card">
      ${avatar(data.profile, "large")}
      <div>
        <h1>${escapeHtml(data.profile.displayName)}</h1>
        <p class="muted">@${escapeHtml(displayHandle(data.profile))} · ${escapeHtml(data.profile.moodBadge || "Floaty")}</p>
        <p>${escapeHtml(data.profile.bio || "A quiet DoodleDen waiting for its first Little Legend.")}</p>
        <p class="notice">${escapeHtml(data.profile.aura || "New leaf")}</p>
      </div>
      <div class="tag-row">${(data.profile.favoriteColors || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <div class="tag-row">${(data.profile.interests || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <div class="stat-grid">
        <div class="stat"><strong>${data.doodles.length}</strong><span>Doodles</span></div>
        <div class="stat"><strong>${data.cloudClips}</strong><span>Cloud Clips</span></div>
        <div class="stat"><strong>${data.glows}</strong><span>Glows</span></div>
      </div>
    </aside>
    <section class="panel">
      ${own ? profileForm(data.profile) : ""}
      <h2>${own ? "My Posted Doodles" : "Posted Doodles"}</h2>
      <div id="profilePosts" class="feed-grid">${data.doodles.map((doodle) => doodleCard(doodle)).join("") || `<div class="empty-state"><div><h2>No Doodles yet</h2></div></div>`}</div>
    </section>
  `;
  bindDoodleActions(shell);
  if (own) bindProfileForm();
}

function profileForm(user) {
  return `
    <form id="profileForm" class="profile-form">
      <div class="avatar-upload">
        <label>Profile picture
          <input id="avatarInput" type="file" accept="image/*">
        </label>
      </div>
      <div class="form-grid two">
        <label>Display name
          <input name="displayName" value="${escapeHtml(user.displayName)}" required>
        </label>
        <label>Mood badge
          <select name="moodBadge">
            ${["Misty", "Sparkly", "Stormy", "Floaty", "Cozy", "Wobbly", "Glowy", "Quiet", "Brave", "Lost in the Fog"].map((mood) => `<option ${user.moodBadge === mood ? "selected" : ""}>${mood}</option>`).join("")}
          </select>
        </label>
      </div>
      <label>Little Legend
        <textarea name="bio">${escapeHtml(user.bio || "")}</textarea>
      </label>
      <label>Aura
        <input name="aura" value="${escapeHtml(user.aura || "")}">
      </label>
      <div class="form-grid two">
        <label>Favorite colors
          <input name="favoriteColors" value="${escapeHtml((user.favoriteColors || []).join(", "))}">
        </label>
        <label>Creative interests
          <input name="interests" value="${escapeHtml((user.interests || []).join(", "))}">
        </label>
      </div>
      <button class="button" type="submit">Save DoodleDen</button>
    </form>
  `;
}

function bindProfileForm() {
  const form = qs("#profileForm");
  let avatarData = state.user?.avatar || "";
  qs("#avatarInput")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { avatarData = reader.result; };
    reader.readAsDataURL(file);
  });
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      const result = await api("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...data, avatar: avatarData })
      });
      state.user = result.user;
      updateAccountUI();
      toast("DoodleDen saved.");
      await setupProfile();
    } catch (error) {
      toast(error.message, true);
    }
  });
}

async function setupMoodMeadow() {
  const form = qs("#moodForm");
  const logs = qs("#moodLogs");
  const prompt = qs("#matchedPrompt");
  const color = qs("#moodColor");

  qsa("[data-meadow-mood]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mood = button.dataset.meadowMood;
      qsa("[data-meadow-mood]").forEach((item) => item.classList.toggle("active", item === button));
      qs("#moodInput").value = state.mood;
    });
  });

  color?.addEventListener("input", () => {
    qs("#colorRune").style.background = color.value;
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.user) return toast("Enter the Den to track Mood Meadow history.", true);
    const data = Object.fromEntries(new FormData(form));
    try {
      const result = await api("/api/mood-logs", { method: "POST", body: JSON.stringify(data) });
      prompt.textContent = result.log.prompt;
      toast("Mood mark saved.");
      await renderMoodLogs(logs);
    } catch (error) {
      toast(error.message, true);
    }
  });

  await renderMoodLogs(logs);
}

async function renderMoodLogs(target) {
  if (!target) return;
  if (!state.user) {
    target.innerHTML = `<p class="muted">Enter the Den to see mood history over time.</p>`;
    return;
  }
  const data = await api("/api/mood-logs");
  target.innerHTML = data.logs.map((log) => `
    <div class="mood-log" style="--post-color:${log.color}">
      <strong>${escapeHtml(log.mood)}</strong>
      <span>${relativeTime(log.createdAt)} · ${escapeHtml(log.prompt)}</span>
      <p>${escapeHtml(log.note || "")}</p>
    </div>
  `).join("") || `<p class="muted">No Mood Marks yet.</p>`;
}

async function setupPromptPotion() {
  const card = qs("#potionPrompt");
  const category = qs("#promptCategory");
  const custom = qs("#customPromptText");
  const lab = qs("#potionLab");
  const ingredients = qsa("[data-ingredient]");
  let currentPrompt = null;
  let brewTimer = null;

  const fallbackIngredients = {
    mood: ["calm", "electric", "misty", "brave", "dreamy", "restless"],
    subject: ["tiny city", "moon garden", "forest doorway", "floating notebook", "friendly robot", "cloud kitchen"],
    style: ["sticker collage", "ink sketch", "soft watercolor", "pixel poster", "album cover", "comic panel"]
  };

  const categoryDetails = {
    art: ["color contrast", "hidden symbols", "shape language", "negative space"],
    music: ["rhythm marks", "sound waves", "bass texture", "quiet-to-loud movement"],
    writing: ["one secret sentence", "a strange narrator", "three sensory clues", "a tiny plot twist"],
    reflection: ["a boundary", "a soft truth", "a next step", "a self-kindness note"],
    "self-care": ["a recovery ritual", "a comfort object", "a slower pace", "a small reset"]
  };

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function ingredientValue(id, fallbackKey) {
    const value = qs(id)?.value.trim();
    return value || pick(fallbackIngredients[fallbackKey]);
  }

  function categoryValue() {
    if (!category || category.value === "all") return pick(["art", "music", "writing", "reflection", "self-care"]);
    return category.value;
  }

  function generatedPrompt() {
    const mood = ingredientValue("#ingredientMood", "mood");
    const subject = ingredientValue("#ingredientSubject", "subject");
    const style = ingredientValue("#ingredientStyle", "style");
    const type = categoryValue();
    const detail = pick(categoryDetails[type] || categoryDetails.art);
    const note = custom?.value.trim();
    const templates = [
      `Create a ${style} Doodle of ${subject} that feels ${mood}. Build the scene around ${detail}, then add one tiny mark that only future-you would understand.`,
      `Draw ${subject} as if it has been brewed with ${mood} energy. Use ${style} techniques, exaggerate ${detail}, and leave one quiet corner for a secret symbol.`,
      `Turn ${mood}, ${subject}, and ${style} into a Doodle spell. Make ${detail} the main visual clue, then add three small textures that change the mood.`,
      `Design a ${style} poster where ${subject} is trying to explain ${mood}. Include ${detail}, a repeated shape, and one unexpected color choice.`
    ];
    const text = `${pick(templates)}${note ? ` Extra note: ${note}` : ""}`;
    return { category: type, text };
  }

  function showPrompt(prompt) {
    currentPrompt = prompt;
    if (!card) return;
    card.innerHTML = `<span>${escapeHtml(prompt.category)}</span><strong>${escapeHtml(prompt.text)}</strong>`;
  }

  function brew() {
    window.clearTimeout(brewTimer);
    lab?.classList.add("is-brewing");
    if (card) {
      card.innerHTML = `<span>Brewing</span><strong>Combining your three beakers into a fresh Doodle prompt...</strong>`;
    }
    brewTimer = window.setTimeout(() => {
      showPrompt(generatedPrompt());
      lab?.classList.remove("is-brewing");
    }, 860);
  }

  qs("#brewPrompt")?.addEventListener("click", brew);
  category?.addEventListener("change", () => {
    if (currentPrompt) brew();
  });
  ingredients.forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        brew();
      }
    });
  });
  qs("#useCustomPrompt")?.addEventListener("click", () => {
    const text = custom?.value.trim();
    if (!text) {
      custom?.focus();
      return toast("Type an extra note first, then pour it into the potion.", true);
    }
    showPrompt({ category: category?.value === "all" ? "custom" : category.value, text });
  });
  qs("#saveCustomPrompt")?.addEventListener("click", async () => {
    const text = currentPrompt?.text || custom?.value.trim();
    if (!text) {
      return toast("Brew or type a prompt before saving it.", true);
    }
    if (!state.user) return toast("Enter the Den to save custom prompts.", true);
    try {
      const data = await api("/api/prompts", {
        method: "POST",
        body: JSON.stringify({ category: currentPrompt?.category || (category?.value === "all" ? "reflection" : category.value), text })
      });
      showPrompt(data.prompt);
      toast("Custom Prompt saved to the Potion shelf.");
    } catch (error) {
      toast(error.message, true);
    }
  });
  custom?.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      qs("#useCustomPrompt")?.click();
    }
  });
}

async function setupQuests() {
  const grid = qs("#questGrid");
  if (!grid) return;
  const data = await api("/api/quests");
  grid.innerHTML = data.quests.map((quest) => `
    <article class="quest-card">
      <span class="type-pill">${escapeHtml(quest.category)}</span>
      <h3>${escapeHtml(quest.title)}</h3>
      <p>${escapeHtml(quest.body)}</p>
      <p class="notice">${escapeHtml(quest.reward)}</p>
      <button class="button secondary quest-start" type="button">Start Quest</button>
    </article>
  `).join("");
  qsa(".quest-start", grid).forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "Quest tucked into Firefly Alerts";
      button.disabled = true;
    });
  });
}

async function loadGlowboard() {
  const top = qs("#glowboardGrid");
  const theme = qs("#weeklyTheme");
  if (!top) return;
  const data = await api("/api/glowboard");
  if (theme) theme.textContent = data.theme;
  top.innerHTML = data.top.map((doodle) => doodleCard(doodle, "glow-card")).join("");
  bindDoodleActions(top);
}

async function init() {
  setActiveNav();
  bindThemeToggle();
  await loadMe().catch(() => updateAccountUI());
  if (["home", "clips", "profile", "glowboard"].includes(page)) await loadDoodles().catch(() => {});
  if (page === "home") {
    setupMoodCanvas();
    setupFilters();
    setupFeedControls();
    setupFlowTuner();
    setupQuickDoodle();
  }
  if (page === "login") setupLogin();
  if (page === "canvas") setupPainter();
  if (page === "music") setupMusic();
  if (page === "blog") setupBlog();
  if (page === "clips") {
    setupFilters();
    await loadClips();
  }
  if (page === "profile") await setupProfile();
  if (page === "mood") await setupMoodMeadow();
  if (page === "prompts") await setupPromptPotion();
  if (page === "quests") await setupQuests();
  if (page === "glowboard") await loadGlowboard();
}

init();
