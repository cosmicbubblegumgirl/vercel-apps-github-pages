(async () => {
  const page = document.body.dataset.page;
  const themeKey = "vocTheme";

  const palettes = {
    auroraInk: {
      name: "Aurora Ink",
      paper: "#fff8ed",
      ink: "#131718",
      colors: ["#10a398", "#ec6f42", "#7156d9", "#f3b332", "#1e7a53"]
    },
    citrusCircuit: {
      name: "Citrus Circuit",
      paper: "#f7fff4",
      ink: "#14201c",
      colors: ["#00a878", "#ff9f1c", "#e84855", "#28536b", "#f7d046"]
    },
    velvetSignal: {
      name: "Velvet Signal",
      paper: "#fff5fb",
      ink: "#1d1620",
      colors: ["#8f2d56", "#3a86ff", "#ffbe0b", "#2ec4b6", "#5f0f40"]
    },
    mossFlame: {
      name: "Moss Flame",
      paper: "#fbfbef",
      ink: "#171a13",
      colors: ["#557a3a", "#df633e", "#2b7a78", "#c78a23", "#7b4b94"]
    },
    monoStencil: {
      name: "Mono Stencil",
      paper: "#fbfaf5",
      ink: "#111111",
      colors: ["#111111", "#f2f0e8", "#76766f", "#c94336", "#0f9b91"]
    }
  };

  const studioOptions = {
    kind: ["art", "icon", "logo", "tattoo", "comic"],
    palette: Object.keys(palettes),
    base: ["orbital", "botanical", "crystal", "signal", "mask"],
    motif: ["stars", "ribbons", "glyphs", "petals", "sparks"],
    text: [
      "Create the variation",
      "A mark becomes a myth",
      "Signal in full color",
      "New art from old sparks",
      "Make the remix visible"
    ]
  };

  const logoOptions = {
    shape: ["badge", "spark", "wave", "facets", "portal"],
    personality: ["sleek", "playful", "luxury", "street", "future"],
    palette: Object.keys(palettes),
    names: ["Nova Craft", "Signal Bloom", "Ink Method", "Bright Fold", "Muse Circuit"],
    mono: ["NC", "SB", "IM", "BF", "MC"]
  };

  const tattooOptions = {
    motif: ["botanical", "celestial", "mythic", "geometric", "wave"],
    placement: ["forearm", "shoulder", "spine", "ankle", "sternum"],
    flow: ["vertical", "spiral", "crescent", "band", "crest"],
    accent: ["black", "red", "teal", "violet"]
  };

  const comicOptions = {
    layout: ["three", "splash", "grid", "poster"],
    mood: ["neon", "mystic", "cosmic", "street"],
    palette: Object.keys(palettes),
    heroes: ["Pixel Nova", "Ink Relay", "Captain Color", "Glyph Ryder", "Vera Volt"],
    captions: [
      "The portal answered in color.",
      "Every panel changed the ending.",
      "The city blinked first.",
      "A secret symbol lit the sky.",
      "The remix had a heartbeat."
    ]
  };

  const uploadState = {
    fileName: "",
    imageData: "",
    loaded: false
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const value = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : "";
  };
  const number = (id) => Number(value(id));
  const sample = (items) => items[Math.floor(Math.random() * items.length)];
  const titleCase = (text) => String(text).replace(/(^|\s)\S/g, (match) => match.toUpperCase());
  const slug = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "creation";

  function initCommon() {
    const savedTheme = localStorage.getItem(themeKey) || "light";
    document.documentElement.dataset.theme = savedTheme;
    updateThemeButton(savedTheme);

    $$(".nav-links a").forEach((link) => {
      if (link.dataset.nav === page) link.classList.add("active");
    });
    syncAuthNav();

    const themeButton = $("[data-theme-toggle]");
    if (themeButton) {
      themeButton.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem(themeKey, next);
        updateThemeButton(next);
        redrawPage();
      });
    }

    $$("input[type='range']").forEach((input) => {
      const output = document.querySelector(`[data-output="${input.id}"]`);
      const sync = () => {
        if (output) output.textContent = input.value;
      };
      input.addEventListener("input", sync);
      sync();
    });
  }

  function syncAuthNav() {
    const link = $("[data-auth-link]");
    if (!link || !window.VOC_DB) return;
    const user = window.VOC_DB.currentUser();
    if (!user) {
      link.textContent = "Login";
      link.href = "login.html";
      return;
    }
    link.textContent = user.name;
    link.href = "gallery.html";
    link.title = "Open your saved studio gallery";
  }

  function updateThemeButton(theme) {
    const button = $("[data-theme-toggle]");
    if (button) button.textContent = theme === "dark" ? "Light" : "Dark";
  }

  function activeMode(group) {
    const active = $(`[data-mode-group="${group}"] .active`);
    return active ? active.dataset.value : "";
  }

  function setActiveMode(group, valueToSet) {
    $$(`[data-mode-group="${group}"] .mode-button`).forEach((button) => {
      button.classList.toggle("active", button.dataset.value === valueToSet);
    });
  }

  function bindModeGroup(group, callback) {
    $$(`[data-mode-group="${group}"] .mode-button`).forEach((button) => {
      button.addEventListener("click", () => {
        setActiveMode(group, button.dataset.value);
        callback();
      });
    });
  }

  function setRandomSelect(id, options) {
    const el = document.getElementById(id);
    if (el) el.value = sample(options);
  }

  function setRandomRange(id, min = 1, max = 10) {
    const el = document.getElementById(id);
    if (el) {
      el.value = String(Math.floor(Math.random() * (max - min + 1)) + min);
      el.dispatchEvent(new Event("input"));
    }
  }

  function setStatus(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => {
      el.textContent = "ready";
    }, 1800);
  }

  function makeRng(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function hashText(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function palette(name) {
    return palettes[name] || palettes.auroraInk;
  }

  function clearCanvas(canvas, pal) {
    const ctx = canvas.getContext("2d");
    const { width: w, height: h } = canvas;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, pal.paper);
    grad.addColorStop(0.58, mix(pal.paper, pal.colors[1], 0.1));
    grad.addColorStop(1, mix(pal.paper, pal.colors[2], 0.12));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1;
    for (let x = -h; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return ctx;
  }

  function mix(a, b, amount) {
    const ca = parseColor(a);
    const cb = parseColor(b);
    const next = ca.map((part, index) => Math.round(part + (cb[index] - part) * amount));
    return `rgb(${next[0]}, ${next[1]}, ${next[2]})`;
  }

  function parseColor(color) {
    const hex = color.replace("#", "");
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }

  function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function polygon(ctx, cx, cy, radius, sides, rotation = 0) {
    ctx.beginPath();
    for (let i = 0; i < sides; i += 1) {
      const angle = rotation + i * Math.PI * 2 / sides;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function star(ctx, cx, cy, outer, inner, points, rotation = -Math.PI / 2) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i += 1) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = rotation + i * Math.PI / points;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawTextFit(ctx, text, x, y, maxWidth, startSize, weight = 800, align = "center") {
    let size = startSize;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    do {
      ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
      if (ctx.measureText(text).width <= maxWidth || size <= 18) break;
      size -= 2;
    } while (size > 18);
    ctx.fillText(text, x, y);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((part, index) => {
      ctx.fillText(part, x, y + index * lineHeight);
    });
  }

  function drawMotifs(ctx, state, pal, rng, cx, cy, radius) {
    const colors = pal.colors;
    const count = state.complexity + 7;
    for (let i = 0; i < count; i += 1) {
      const angle = i * Math.PI * 2 / count + rng() * 0.32;
      const dist = radius * (0.32 + rng() * 0.72);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const size = 18 + rng() * 48;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + rng());
      ctx.fillStyle = colors[i % colors.length];
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 5;
      if (state.motif === "stars") {
        star(ctx, 0, 0, size, size * 0.42, 5 + (i % 3));
        ctx.fill();
        ctx.stroke();
      } else if (state.motif === "ribbons") {
        ctx.beginPath();
        ctx.moveTo(-size, -size * 0.25);
        ctx.bezierCurveTo(-size * 0.2, -size, size * 0.2, size, size, size * 0.25);
        ctx.lineWidth = Math.max(9, size * 0.22);
        ctx.strokeStyle = colors[i % colors.length];
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.strokeStyle = pal.ink;
        ctx.stroke();
      } else if (state.motif === "glyphs") {
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.55, 0, Math.PI * 1.35);
        ctx.moveTo(-size * 0.35, size * 0.2);
        ctx.lineTo(size * 0.35, -size * 0.45);
        ctx.stroke();
      } else if (state.motif === "petals") {
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.35, size * 0.86, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, 0);
        ctx.lineTo(size * 0.6, 0);
        ctx.moveTo(0, -size * 0.6);
        ctx.lineTo(0, size * 0.6);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawCoreMark(ctx, state, pal, rng, cx, cy, radius) {
    const colors = pal.colors;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let i = 0; i < state.symmetry + 4; i += 1) {
      const angle = i * Math.PI * 2 / (state.symmetry + 4);
      ctx.save();
      ctx.rotate(angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 7;
      ctx.globalAlpha = 0.92;
      if (state.base === "orbital") {
        ctx.beginPath();
        ctx.ellipse(radius * 0.25, 0, radius * 0.58, radius * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (state.base === "botanical") {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(radius * 0.12, -radius * 0.42, radius * 0.54, -radius * 0.42, radius * 0.72, 0);
        ctx.bezierCurveTo(radius * 0.54, radius * 0.42, radius * 0.12, radius * 0.42, 0, 0);
        ctx.fill();
        ctx.stroke();
      } else if (state.base === "crystal") {
        polygon(ctx, radius * 0.4, 0, radius * 0.3, 4 + (i % 3), Math.PI / 4);
        ctx.fill();
        ctx.stroke();
      } else if (state.base === "signal") {
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.arc(0, 0, radius * (0.26 + i * 0.035), -0.55, 0.55);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(radius * 0.26, 0, radius * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(radius * 0.33, 0, radius * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = pal.paper;
        ctx.fill();
      }
      ctx.restore();
    }

    const inner = ctx.createRadialGradient(0, 0, radius * 0.05, 0, 0, radius * 0.42);
    inner.addColorStop(0, pal.paper);
    inner.addColorStop(1, colors[2]);
    ctx.fillStyle = inner;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = pal.ink;
    drawTextFit(ctx, "VOC", 0, 2, radius * 0.5, radius * 0.16, 900);
    ctx.restore();
  }

  function drawStudio() {
    const canvas = $("#studioCanvas");
    if (!canvas) return;
    const state = {
      kind: activeMode("studioKind") || "art",
      palette: value("studioPalette"),
      base: value("studioBase"),
      motif: value("studioMotif"),
      text: value("studioText"),
      complexity: number("studioComplexity"),
      symmetry: number("studioSymmetry")
    };
    const pal = palette(state.palette);
    const seed = hashText(JSON.stringify(state));
    const rng = makeRng(seed);
    const ctx = clearCanvas(canvas, pal);
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.34;

    if (state.kind === "tattoo") {
      drawTattooArt(ctx, canvas, {
        motif: state.base === "botanical" ? "botanical" : "geometric",
        placement: "forearm",
        flow: state.base === "signal" ? "spiral" : "vertical",
        weight: Math.max(2, Math.round(state.symmetry / 2)),
        detail: state.complexity,
        accent: "black"
      });
    } else if (state.kind === "comic") {
      drawComicArt(ctx, canvas, {
        layout: "poster",
        hero: state.text || "Variation Hero",
        mood: "cosmic",
        caption: "The remix changed everything.",
        energy: state.complexity,
        palette: state.palette
      });
    } else {
      drawMotifs(ctx, state, pal, rng, cx, cy, radius);
      drawCoreMark(ctx, state, pal, rng, cx, cy, radius);
      if (state.kind === "icon") {
        ctx.lineWidth = 24;
        ctx.strokeStyle = pal.ink;
        roundedRect(ctx, 120, 120, w - 240, h - 240, 130);
        ctx.stroke();
      }
      if (state.kind === "logo") {
        ctx.fillStyle = pal.ink;
        drawTextFit(ctx, state.text || "Variation of Creation", cx, h - 150, w - 180, 78, 900);
        ctx.fillStyle = pal.colors[1];
        roundedRect(ctx, cx - 170, h - 96, 340, 18, 9);
        ctx.fill();
      }
      if (state.kind === "art") {
        ctx.strokeStyle = pal.ink;
        ctx.lineWidth = 8;
        ctx.globalAlpha = 0.65;
        for (let i = 0; i < 9; i += 1) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius * (0.45 + i * 0.07), rng() * 6, rng() * 6 + Math.PI);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    }

    $("#studioTitle").textContent = `${titleCase(state.kind)} Remix`;
    renderRecipe("#studioRecipe", [
      ["Format", titleCase(state.kind)],
      ["Palette", pal.name],
      ["Base", titleCase(state.base)],
      ["Motif", titleCase(state.motif)],
      ["Complexity", state.complexity],
      ["Symmetry", state.symmetry]
    ]);
  }

  function renderRecipe(selector, items) {
    const target = $(selector);
    if (!target) return;
    target.innerHTML = items.map(([key, val]) => (
      `<div class="recipe-item"><strong>${escapeHtml(key)}</strong><span>${escapeHtml(val)}</span></div>`
    )).join("");
  }

  function escapeHtml(valueToEscape) {
    return String(valueToEscape)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setSelectIfOption(id, nextValue) {
    const el = document.getElementById(id);
    if (!el || !nextValue) return;
    if (Array.from(el.options).some((option) => option.value === nextValue)) {
      el.value = nextValue;
    }
  }

  function renderSeedDeck() {
    const deck = $("#seedDeck");
    if (!deck || !window.VOC_DB) return;

    const kind = deck.dataset.seedKind;
    const seeds = pickSeedDeckRows(kind);

    deck.innerHTML = seeds.map((seed) => `
      <article class="seed-card">
        <canvas class="seed-preview seed-thumb" width="720" height="480" data-seed-canvas="${escapeHtml(seed.id)}" aria-label="${escapeHtml(seed.title)} preview"></canvas>
        <div>
          <small>${escapeHtml(seed.kind)} / ${escapeHtml(seed.vibe)}${seed.source_title ? " / SVGrepo" : ""}</small>
          <h3>${escapeHtml(seed.title)}</h3>
          <p>${escapeHtml(seed.prompt)}</p>
        </div>
        <button class="button" type="button" data-use-seed="${escapeHtml(seed.id)}">Use Vibe</button>
      </article>
    `).join("");

    $$("[data-use-seed]", deck).forEach((button) => {
      button.addEventListener("click", () => {
        const seed = window.VOC_DB.getSeeds().find((item) => item.id === button.dataset.useSeed);
        if (seed) applySeed(seed);
      });
    });
    drawSeedPreviews(deck);
  }

  function pickSeedDeckRows(kind) {
    if (!window.VOC_DB) return [];
    if (kind && kind !== "all") return window.VOC_DB.getSeeds(kind).slice(0, 8);

    const allSeeds = window.VOC_DB.getSeeds();
    return ["art", "icon", "logo", "tattoo", "comic"].flatMap((seedKind) => {
      return allSeeds.filter((seed) => seed.kind === seedKind).slice(0, 2);
    });
  }

  function drawSeedPreviews(scope = document) {
    if (!window.VOC_DB) return;
    const seedMap = new Map(window.VOC_DB.getSeeds().map((seed) => [seed.id, seed]));
    $$("[data-seed-canvas]", scope).forEach((canvas) => {
      const seed = seedMap.get(canvas.dataset.seedCanvas);
      if (seed) drawSeedPreview(canvas, seed);
    });
  }

  function drawSeedPreview(canvas, seed) {
    const ctx = canvas.getContext("2d");
    const pal = palette(seed.palette);
    const rng = makeRng(hashText(seed.id + seed.prompt));

    if (seed.kind === "logo") {
      clearCanvas(canvas, pal);
      const state = {
        name: seed.title,
        mono: seed.control_c || seed.title.slice(0, 2).toUpperCase(),
        shape: seed.control_a,
        personality: seed.control_b,
        palette: seed.palette,
        detail: Number(seed.intensity || 5)
      };
      drawLogoMark(ctx, state, pal, rng, canvas.width * 0.3, canvas.height * 0.48, Math.min(canvas.width, canvas.height) * 0.23);
      ctx.fillStyle = pal.ink;
      drawTextFit(ctx, seed.title, canvas.width * 0.55, canvas.height * 0.42, canvas.width * 0.36, 44, 900, "left");
      ctx.fillStyle = pal.colors[1];
      roundedRect(ctx, canvas.width * 0.55, canvas.height * 0.56, canvas.width * 0.26, 12, 6);
      ctx.fill();
      return;
    }

    if (seed.kind === "tattoo") {
      drawTattooArt(ctx, canvas, {
        motif: seed.control_a,
        placement: seed.control_b,
        flow: seed.control_c,
        weight: Math.max(2, Math.round(Number(seed.intensity || 5) / 2)),
        detail: Number(seed.intensity || 6),
        accent: "black"
      });
      return;
    }

    if (seed.kind === "comic") {
      drawComicArt(ctx, canvas, {
        layout: seed.control_a,
        hero: seed.control_c || seed.title,
        mood: seed.control_b,
        caption: seed.prompt,
        energy: Number(seed.intensity || 7),
        palette: seed.palette
      });
      return;
    }

    const state = {
      kind: seed.kind,
      palette: seed.palette,
      base: seed.control_a || "orbital",
      motif: seed.control_b || "stars",
      text: seed.control_c || seed.title,
      complexity: Number(seed.intensity || 6),
      symmetry: Math.max(3, Math.min(9, Number(seed.intensity || 6)))
    };
    clearCanvas(canvas, pal);
    drawMotifs(ctx, state, pal, rng, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.31);
    drawCoreMark(ctx, state, pal, rng, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.28);
    if (seed.kind === "icon") {
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 16;
      roundedRect(ctx, canvas.width * 0.18, canvas.height * 0.14, canvas.width * 0.64, canvas.height * 0.72, 58);
      ctx.stroke();
    }
  }

  function applySeed(seed) {
    if (page === "studio") {
      setActiveMode("studioKind", seed.kind);
      setSelectIfOption("studioPalette", seed.palette);
      setSelectIfOption("studioBase", seed.control_a);
      setSelectIfOption("studioMotif", seed.control_b);
      $("#studioText").value = seed.control_c || seed.title;
      $("#studioComplexity").value = seed.intensity || 6;
      $("#studioComplexity").dispatchEvent(new Event("input"));
      $("#studioSymmetry").value = Math.min(10, Math.max(2, Number(seed.intensity || 5)));
      $("#studioSymmetry").dispatchEvent(new Event("input"));
      drawStudio();
      setStatus("studioStatus", "seed loaded");
    }

    if (page === "logos" && seed.kind === "logo") {
      $("#logoName").value = seed.title;
      $("#logoMono").value = seed.control_c || seed.title.slice(0, 2).toUpperCase();
      setSelectIfOption("logoShape", seed.control_a);
      setSelectIfOption("logoPersonality", seed.control_b);
      setSelectIfOption("logoPalette", seed.palette);
      $("#logoDetail").value = seed.intensity || 5;
      $("#logoDetail").dispatchEvent(new Event("input"));
      drawLogo();
    }

    if (page === "tattoos" && seed.kind === "tattoo") {
      setSelectIfOption("tattooMotif", seed.control_a);
      setSelectIfOption("tattooPlacement", seed.control_b);
      setSelectIfOption("tattooFlow", seed.control_c);
      $("#tattooDetail").value = seed.intensity || 6;
      $("#tattooDetail").dispatchEvent(new Event("input"));
      drawTattoo();
    }

    if (page === "comics" && seed.kind === "comic") {
      setSelectIfOption("comicLayout", seed.control_a);
      setSelectIfOption("comicMood", seed.control_b);
      $("#comicHero").value = seed.control_c || seed.title;
      $("#comicCaption").value = seed.prompt;
      $("#comicEnergy").value = seed.intensity || 7;
      $("#comicEnergy").dispatchEvent(new Event("input"));
      setSelectIfOption("comicPalette", seed.palette);
      drawComic();
    }
  }

  function currentStudioRecipe() {
    const kind = activeMode("studioKind") || "art";
    return `A ${kind} remix using ${palette(value("studioPalette")).name}, ${value("studioBase")} structure, ${value("studioMotif")} motifs, complexity ${value("studioComplexity")}, symmetry ${value("studioSymmetry")}, and the text "${value("studioText")}".`;
  }

  function initStudio() {
    bindModeGroup("studioKind", drawStudio);
    ["studioPalette", "studioBase", "studioMotif", "studioText", "studioComplexity", "studioSymmetry"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", drawStudio);
    });
    $("[data-action='shuffle-studio']").addEventListener("click", () => {
      setActiveMode("studioKind", sample(studioOptions.kind));
      setRandomSelect("studioPalette", studioOptions.palette);
      setRandomSelect("studioBase", studioOptions.base);
      setRandomSelect("studioMotif", studioOptions.motif);
      $("#studioText").value = sample(studioOptions.text);
      setRandomRange("studioComplexity", 2, 10);
      setRandomRange("studioSymmetry", 2, 10);
      drawStudio();
      setStatus("studioStatus", "shuffled");
    });
    $("[data-action='save-studio']").addEventListener("click", () => {
      saveCreation("studio", $("#studioCanvas"), currentStudioRecipe());
      setStatus("studioStatus", "saved");
    });
    $("[data-action='download-studio']").addEventListener("click", () => downloadCanvas($("#studioCanvas"), "variation-of-creation"));
    $("[data-action='copy-studio']").addEventListener("click", () => copyText(currentStudioRecipe(), "studioStatus"));
    drawStudio();
  }

  function drawLogo() {
    const canvas = $("#logoCanvas");
    if (!canvas) return;
    const state = {
      name: value("logoName") || "Nova Craft",
      mono: (value("logoMono") || "NC").slice(0, 4).toUpperCase(),
      shape: value("logoShape"),
      personality: value("logoPersonality"),
      palette: value("logoPalette"),
      detail: number("logoDetail")
    };
    const pal = palette(state.palette);
    const rng = makeRng(hashText(JSON.stringify(state)));
    const ctx = clearCanvas(canvas, pal);
    const w = canvas.width;
    const h = canvas.height;

    $("#logoTitle").textContent = state.name;
    ctx.fillStyle = mix(pal.paper, pal.colors[0], 0.08);
    roundedRect(ctx, 72, 82, 382, 382, 82);
    ctx.fill();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 12;
    ctx.stroke();
    drawLogoMark(ctx, state, pal, rng, 263, 273, 142);

    ctx.fillStyle = pal.ink;
    drawTextFit(ctx, state.name, 520, 230, 640, 82, 900, "left");
    ctx.fillStyle = pal.colors[1];
    roundedRect(ctx, 522, 300, 330, 20, 10);
    ctx.fill();
    ctx.fillStyle = pal.ink;
    ctx.font = "700 32px Inter, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(titleCase(state.personality), 522, 372);
    ctx.fillStyle = pal.colors[2];
    ctx.fillText(`${state.mono} / ${titleCase(state.shape)}`, 522, 418);

    const y = 616;
    ["Icon", "Badge", "Mono"].forEach((label, index) => {
      const x = 90 + index * 382;
      ctx.fillStyle = "#fffdf8";
      roundedRect(ctx, x, y, 300, 190, 28);
      ctx.fill();
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 6;
      ctx.stroke();
      drawLogoMark(ctx, state, pal, rng, x + 88, y + 96, 54);
      ctx.fillStyle = pal.ink;
      drawTextFit(ctx, index === 0 ? state.mono : label, x + 200, y + 96, 150, index === 0 ? 46 : 32, 900);
    });
  }

  function drawLogoMark(ctx, state, pal, rng, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = Math.max(6, radius * 0.08);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    const colors = pal.colors;

    if (state.shape === "badge") {
      polygon(ctx, 0, 0, radius, 6, Math.PI / 6);
      ctx.fillStyle = colors[0];
      ctx.fill();
      ctx.stroke();
    } else if (state.shape === "spark") {
      star(ctx, 0, 0, radius, radius * 0.38, 8);
      ctx.fillStyle = colors[1];
      ctx.fill();
      ctx.stroke();
    } else if (state.shape === "wave") {
      ctx.fillStyle = colors[2];
      ctx.beginPath();
      ctx.moveTo(-radius, 0);
      ctx.bezierCurveTo(-radius * 0.45, -radius, radius * 0.28, radius, radius, -radius * 0.15);
      ctx.bezierCurveTo(radius * 0.35, radius * 0.2, -radius * 0.26, -radius * 0.2, -radius, radius * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (state.shape === "facets") {
      for (let i = 0; i < 5; i += 1) {
        ctx.rotate(Math.PI * 2 / 5);
        polygon(ctx, radius * 0.36, 0, radius * 0.45, 3 + (i % 2), rng() * 2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[3];
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "#fffdf8";
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = Math.max(4, radius * 0.05);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = pal.ink;
    drawTextFit(ctx, state.mono, 0, 1, radius * 0.68, radius * 0.34, 900);
    ctx.restore();
  }

  function initLogo() {
    ["logoName", "logoMono", "logoShape", "logoPersonality", "logoPalette", "logoDetail"].forEach((id) => {
      document.getElementById(id).addEventListener("input", drawLogo);
    });
    $("[data-action='shuffle-logo']").addEventListener("click", () => {
      const index = Math.floor(Math.random() * logoOptions.names.length);
      $("#logoName").value = logoOptions.names[index];
      $("#logoMono").value = logoOptions.mono[index];
      setRandomSelect("logoShape", logoOptions.shape);
      setRandomSelect("logoPersonality", logoOptions.personality);
      setRandomSelect("logoPalette", logoOptions.palette);
      setRandomRange("logoDetail", 2, 10);
      drawLogo();
    });
    $("[data-action='save-logo']").addEventListener("click", () => saveCreation("logo", $("#logoCanvas"), `${value("logoName")} logo with ${value("logoShape")} mark and ${palette(value("logoPalette")).name} palette.`));
    $("[data-action='download-logo']").addEventListener("click", () => downloadCanvas($("#logoCanvas"), `${slug(value("logoName"))}-logo`));
    drawLogo();
  }

  function tattooAccentColor(accent) {
    return {
      black: "#111111",
      red: "#c94336",
      teal: "#0f9b91",
      violet: "#6954c9"
    }[accent] || "#111111";
  }

  function drawTattooArt(ctx, canvas, state) {
    const w = canvas.width;
    const h = canvas.height;
    const accent = tattooAccentColor(state.accent);
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#111111";
    ctx.fillStyle = "#111111";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4 + state.weight * 1.4;

    const cx = w / 2;
    const top = h * 0.13;
    const bottom = h * 0.83;
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, top - 40);
    ctx.lineTo(cx, bottom + 40);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 4 + state.weight * 1.4;

    if (state.flow === "band") {
      for (let i = 0; i < state.detail + 4; i += 1) {
        const y = top + i * ((bottom - top) / (state.detail + 3));
        ctx.beginPath();
        ctx.moveTo(w * 0.18, y);
        ctx.bezierCurveTo(w * 0.35, y - 50, w * 0.65, y + 50, w * 0.82, y);
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, top);
      for (let i = 0; i <= 9; i += 1) {
        const y = top + (bottom - top) * i / 9;
        const offset = state.flow === "spiral" ? Math.sin(i * 1.35) * 82 : state.flow === "crescent" ? Math.sin(i * 0.58) * 128 : 0;
        ctx.lineTo(cx + offset, y);
      }
      ctx.stroke();
    }

    drawTattooMotif(ctx, state, cx, (top + bottom) / 2, Math.min(w, h) * 0.3, accent);

    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(3, state.weight);
    for (let i = 0; i < state.detail + 4; i += 1) {
      const angle = i * Math.PI * 2 / (state.detail + 4);
      const x = cx + Math.cos(angle) * (80 + i * 9);
      const y = h * 0.48 + Math.sin(angle) * (170 + i * 6);
      if (state.motif === "botanical") {
        ctx.beginPath();
        ctx.ellipse(x, y, 18 + i, 42 + i * 2, angle, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        polygon(ctx, x, y, 18 + i, 3 + (i % 4), angle);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#111111";
    ctx.font = "800 30px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${titleCase(state.motif)} / ${titleCase(state.placement)}`, cx, h - 72);
  }

  function drawTattooMotif(ctx, state, cx, cy, radius, accent) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = "#111111";
    ctx.fillStyle = "transparent";

    if (state.motif === "celestial") {
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.42, Math.PI * 0.15, Math.PI * 1.8);
      ctx.stroke();
      ctx.strokeStyle = accent;
      for (let i = 0; i < 8; i += 1) {
        star(ctx, Math.cos(i) * radius * 0.55, Math.sin(i * 1.4) * radius * 0.55, 18, 8, 5);
        ctx.stroke();
      }
    } else if (state.motif === "mythic") {
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.8);
      ctx.bezierCurveTo(radius * 0.52, -radius * 0.22, radius * 0.36, radius * 0.42, 0, radius * 0.8);
      ctx.bezierCurveTo(-radius * 0.36, radius * 0.42, -radius * 0.52, -radius * 0.22, 0, -radius * 0.8);
      ctx.stroke();
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.moveTo(-radius * 0.46, -radius * 0.24);
      ctx.lineTo(radius * 0.46, -radius * 0.24);
      ctx.moveTo(-radius * 0.32, radius * 0.22);
      ctx.lineTo(radius * 0.32, radius * 0.22);
      ctx.stroke();
    } else if (state.motif === "geometric") {
      for (let i = 0; i < 5; i += 1) {
        polygon(ctx, 0, 0, radius * (0.25 + i * 0.12), 3 + (i % 4), Math.PI / 6 + i);
        ctx.stroke();
      }
    } else if (state.motif === "wave") {
      for (let i = -2; i <= 2; i += 1) {
        ctx.beginPath();
        ctx.moveTo(-radius, i * 42);
        ctx.bezierCurveTo(-radius * 0.4, i * 42 - 82, radius * 0.4, i * 42 + 82, radius, i * 42);
        ctx.stroke();
      }
    } else {
      for (let i = 0; i < 10; i += 1) {
        ctx.save();
        ctx.rotate(i * Math.PI * 2 / 10);
        ctx.beginPath();
        ctx.ellipse(0, -radius * 0.36, radius * 0.12, radius * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawTattoo() {
    const canvas = $("#tattooCanvas");
    if (!canvas) return;
    const state = {
      motif: value("tattooMotif"),
      placement: value("tattooPlacement"),
      flow: value("tattooFlow"),
      weight: number("tattooWeight"),
      detail: number("tattooDetail"),
      accent: value("tattooAccent")
    };
    const ctx = canvas.getContext("2d");
    drawTattooArt(ctx, canvas, state);
    $("#tattooTitle").textContent = `${titleCase(state.motif)} ${titleCase(state.placement)}`;
  }

  function initTattoo() {
    ["tattooMotif", "tattooPlacement", "tattooFlow", "tattooWeight", "tattooDetail", "tattooAccent"].forEach((id) => {
      document.getElementById(id).addEventListener("input", drawTattoo);
    });
    $("[data-action='shuffle-tattoo']").addEventListener("click", () => {
      setRandomSelect("tattooMotif", tattooOptions.motif);
      setRandomSelect("tattooPlacement", tattooOptions.placement);
      setRandomSelect("tattooFlow", tattooOptions.flow);
      setRandomSelect("tattooAccent", tattooOptions.accent);
      setRandomRange("tattooWeight", 1, 10);
      setRandomRange("tattooDetail", 2, 10);
      drawTattoo();
    });
    $("[data-action='save-tattoo']").addEventListener("click", () => saveCreation("tattoo", $("#tattooCanvas"), `${titleCase(value("tattooMotif"))} tattoo for ${value("tattooPlacement")} with ${value("tattooFlow")} flow.`));
    $("[data-action='download-tattoo']").addEventListener("click", () => downloadCanvas($("#tattooCanvas"), `${value("tattooMotif")}-tattoo`));
    drawTattoo();
  }

  function drawComicArt(ctx, canvas, state) {
    const pal = palette(state.palette);
    const w = canvas.width;
    const h = canvas.height;
    const rng = makeRng(hashText(JSON.stringify(state)));
    ctx.fillStyle = pal.paper;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = pal.ink;
    ctx.fillRect(42, 42, w - 84, h - 84);

    const panels = comicPanels(state.layout, w, h);
    panels.forEach((panel, index) => {
      ctx.save();
      roundedRect(ctx, panel.x, panel.y, panel.w, panel.h, 12);
      ctx.clip();
      const grad = ctx.createLinearGradient(panel.x, panel.y, panel.x + panel.w, panel.y + panel.h);
      grad.addColorStop(0, pal.colors[(index + 1) % pal.colors.length]);
      grad.addColorStop(1, pal.colors[(index + 3) % pal.colors.length]);
      ctx.fillStyle = grad;
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      drawComicTexture(ctx, panel, pal, rng, state.energy);
      drawHero(ctx, panel, pal, index, state.energy);
      drawSpeech(ctx, panel, pal, index === panels.length - 1 ? state.caption : comicLine(state.mood, index));
      ctx.restore();
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 11;
      roundedRect(ctx, panel.x, panel.y, panel.w, panel.h, 12);
      ctx.stroke();
    });

    ctx.fillStyle = pal.paper;
    roundedRect(ctx, 72, 64, Math.min(560, w - 144), 92, 14);
    ctx.fill();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.fillStyle = pal.ink;
    drawTextFit(ctx, state.hero || "Pixel Nova", 96, 111, Math.min(510, w - 190), 48, 900, "left");
  }

  function comicPanels(layout, w, h) {
    if (layout === "splash") {
      return [{ x: 78, y: 178, w: w - 156, h: h - 250 }];
    }
    if (layout === "grid") {
      const gap = 28;
      const pw = (w - 156 - gap) / 2;
      const ph = (h - 250 - gap) / 2;
      return [
        { x: 78, y: 178, w: pw, h: ph },
        { x: 78 + pw + gap, y: 178, w: pw, h: ph },
        { x: 78, y: 178 + ph + gap, w: pw, h: ph },
        { x: 78 + pw + gap, y: 178 + ph + gap, w: pw, h: ph }
      ];
    }
    if (layout === "poster") {
      return [
        { x: 78, y: 178, w: w - 156, h: h - 250 },
        { x: w - 438, y: h - 290, w: 360, h: 218 }
      ];
    }
    const gap = 28;
    const pw = (w - 156 - gap * 2) / 3;
    return [0, 1, 2].map((i) => ({ x: 78 + i * (pw + gap), y: 178, w: pw, h: h - 250 }));
  }

  function comicLine(mood, index) {
    const lines = {
      neon: ["The alley lit up.", "A signal screamed.", "Run toward color."],
      mystic: ["The rune opened.", "Old light returned.", "Truth wore a mask."],
      cosmic: ["Stars bent close.", "The ship sang back.", "Gravity took notes."],
      street: ["Paint hit the wall.", "The block held breath.", "Noise became rhythm."]
    };
    return (lines[mood] || lines.neon)[index % 3];
  }

  function drawComicTexture(ctx, panel, pal, rng, energy) {
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    for (let i = 0; i < energy * 8; i += 1) {
      const x = panel.x + rng() * panel.w;
      const y = panel.y + rng() * panel.h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 30 + rng() * 90, y - 40 + rng() * 80);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawHero(ctx, panel, pal, index, energy) {
    const cx = panel.x + panel.w * (0.46 + (index % 2) * 0.08);
    const cy = panel.y + panel.h * 0.58;
    const scale = Math.min(panel.w, panel.h) / 280;
    ctx.fillStyle = pal.ink;
    ctx.beginPath();
    ctx.arc(cx, cy - 86 * scale, 34 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 46 * scale);
    ctx.lineTo(cx - 58 * scale, cy + 98 * scale);
    ctx.lineTo(cx + 66 * scale, cy + 98 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fffdf8";
    ctx.lineWidth = Math.max(5, 7 * scale);
    ctx.beginPath();
    ctx.moveTo(cx - 78 * scale, cy - 8 * scale);
    ctx.lineTo(cx + 92 * scale, cy - 42 * scale);
    ctx.moveTo(cx - 42 * scale, cy + 94 * scale);
    ctx.lineTo(cx - 104 * scale, cy + 168 * scale);
    ctx.moveTo(cx + 40 * scale, cy + 94 * scale);
    ctx.lineTo(cx + 110 * scale, cy + 150 * scale);
    ctx.stroke();
    ctx.strokeStyle = pal.colors[(index + 2) % pal.colors.length];
    ctx.lineWidth = Math.max(6, energy * 1.6);
    ctx.beginPath();
    ctx.arc(cx, cy - 38 * scale, 96 * scale, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }

  function drawSpeech(ctx, panel, pal, text) {
    const bubbleW = Math.min(panel.w * 0.82, 360);
    const bubbleH = Math.min(116, panel.h * 0.32);
    const x = panel.x + panel.w * 0.08;
    const y = panel.y + panel.h * 0.08;
    ctx.fillStyle = "#fffdf8";
    roundedRect(ctx, x, y, bubbleW, bubbleH, 18);
    ctx.fill();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = pal.ink;
    ctx.font = "800 27px Inter, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    wrapText(ctx, text, x + 20, y + 21, bubbleW - 40, 31, 3);
  }

  function drawComic() {
    const canvas = $("#comicCanvas");
    if (!canvas) return;
    const state = {
      layout: value("comicLayout"),
      hero: value("comicHero"),
      mood: value("comicMood"),
      caption: value("comicCaption"),
      energy: number("comicEnergy"),
      palette: value("comicPalette")
    };
    const ctx = canvas.getContext("2d");
    drawComicArt(ctx, canvas, state);
    $("#comicTitle").textContent = state.hero || "Comic Lab";
  }

  function initComic() {
    ["comicLayout", "comicHero", "comicMood", "comicCaption", "comicEnergy", "comicPalette"].forEach((id) => {
      document.getElementById(id).addEventListener("input", drawComic);
    });
    $("[data-action='shuffle-comic']").addEventListener("click", () => {
      $("#comicHero").value = sample(comicOptions.heroes);
      $("#comicCaption").value = sample(comicOptions.captions);
      setRandomSelect("comicLayout", comicOptions.layout);
      setRandomSelect("comicMood", comicOptions.mood);
      setRandomSelect("comicPalette", comicOptions.palette);
      setRandomRange("comicEnergy", 2, 10);
      drawComic();
    });
    $("[data-action='save-comic']").addEventListener("click", () => saveCreation("comic", $("#comicCanvas"), `${value("comicHero")} comic page in ${value("comicMood")} mood: ${value("comicCaption")}`));
    $("[data-action='download-comic']").addEventListener("click", () => downloadCanvas($("#comicCanvas"), `${slug(value("comicHero"))}-comic`));
    drawComic();
  }

  function saveCreation(kind, canvas, recipe) {
    if (!canvas) return;
    const item = {
      id: `voc-${Date.now()}`,
      kind,
      recipe,
      image: canvas.toDataURL("image/png")
    };
    if (window.VOC_DB) {
      window.VOC_DB.saveCreation(item);
    }
  }

  function readGallery() {
    return window.VOC_DB ? window.VOC_DB.readGallery() : [];
  }

  function downloadCanvas(canvas, name) {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${slug(name)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function downloadText(name, content, type = "application/json") {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.download = name;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function copyText(text, statusId) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(statusId, "copied");
    } catch (error) {
      setStatus(statusId, "copy blocked");
    }
  }

  function drawUploadPlaceholder() {
    const canvas = $("#uploadCanvas");
    if (!canvas) return;
    const pal = palette("auroraInk");
    const ctx = clearCanvas(canvas, pal);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 10;
    roundedRect(ctx, canvas.width * 0.18, canvas.height * 0.18, canvas.width * 0.64, canvas.height * 0.58, 34);
    ctx.stroke();
    ctx.strokeStyle = pal.colors[0];
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(cx - 170, cy + 88);
    ctx.bezierCurveTo(cx - 70, cy - 70, cx + 72, cy + 132, cx + 168, cy - 44);
    ctx.stroke();
    ctx.fillStyle = pal.ink;
    drawTextFit(ctx, "Upload your art", cx, cy - 110, canvas.width * 0.62, 54, 900);
    ctx.fillStyle = pal.colors[1];
    drawTextFit(ctx, "doodles / sketches / drawings", cx, cy + 150, canvas.width * 0.62, 32, 800);
  }

  function fitImageRect(image, canvas) {
    const imageRatio = image.width / image.height;
    const canvasRatio = canvas.width / canvas.height;
    let width = canvas.width;
    let height = canvas.height;

    if (imageRatio > canvasRatio) {
      height = width / imageRatio;
    } else {
      width = height * imageRatio;
    }

    return {
      x: (canvas.width - width) / 2,
      y: (canvas.height - height) / 2,
      width,
      height
    };
  }

  function drawUploadedImage(image) {
    const canvas = $("#uploadCanvas");
    if (!canvas) return "";
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rect = fitImageRect(image, canvas);
    ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = "#131718";
    ctx.lineWidth = 8;
    roundedRect(ctx, rect.x + 8, rect.y + 8, rect.width - 16, rect.height - 16, 18);
    ctx.stroke();
    return canvas.toDataURL("image/jpeg", 0.86);
  }

  function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("That image could not be loaded."));
      image.src = dataUrl;
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("That file could not be read."));
      reader.readAsDataURL(file);
    });
  }

  async function handleUploadFile(file) {
    const message = $("#uploadMessage");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.classList.add("error");
      message.textContent = "Choose an image file.";
      return;
    }

    message.classList.remove("error");
    message.textContent = "Loading image...";
    const dataUrl = await readFileAsDataUrl(file);
    const image = await loadImageFromDataUrl(dataUrl);
    uploadState.fileName = file.name;
    uploadState.imageData = drawUploadedImage(image);
    uploadState.loaded = true;
    $("#uploadPreviewTitle").textContent = file.name;
    $("#uploadStatus").textContent = "ready";
    message.textContent = `${file.name} is ready to save.`;
  }

  function clearUpload() {
    uploadState.fileName = "";
    uploadState.imageData = "";
    uploadState.loaded = false;
    const fileInput = $("#uploadFile");
    if (fileInput) fileInput.value = "";
    $("#uploadPreviewTitle").textContent = "No file selected";
    $("#uploadStatus").textContent = "waiting";
    $("#uploadMessage").textContent = "";
    $("#uploadMessage").classList.remove("error");
    drawUploadPlaceholder();
  }

  function renderUploadLibrary() {
    const target = $("#uploadLibrary");
    if (!target) return;
    const uploads = window.VOC_DB
      ? window.VOC_DB.readCreations()
        .filter((item) => item.kind === "upload" && item.image)
        .slice(0, 8)
      : [];

    if (!uploads.length) {
      target.innerHTML = `
        <div class="empty-gallery upload-empty">
          <h2>No personal images saved yet.</h2>
          <p>Your uploaded doodles, sketches, drawings, photos, and reference images will appear here after you save them.</p>
        </div>
      `;
      return;
    }

    target.innerHTML = uploads.map((item) => `
      <article class="upload-library-card">
        <img src="${item.image}" alt="${escapeHtml(item.title || "Uploaded image")}">
        <div class="upload-library-card-body">
          <h3>${escapeHtml(item.title || "Uploaded image")}</h3>
          <p>${escapeHtml(item.uploadType || "image")} saved ${new Date(item.createdAt).toLocaleDateString()}</p>
          ${item.tags ? `<div class="gallery-meta"><span>${escapeHtml(item.tags)}</span></div>` : ""}
        </div>
      </article>
    `).join("");
  }

  function initUpload() {
    const form = $("#uploadForm");
    const drop = $("#uploadDrop");
    const fileInput = $("#uploadFile");
    const message = $("#uploadMessage");
    if (!form || !drop || !fileInput) return;

    drawUploadPlaceholder();
    renderUploadLibrary();

    fileInput.addEventListener("change", () => {
      handleUploadFile(fileInput.files[0]).catch((error) => {
        message.classList.add("error");
        message.textContent = error.message;
      });
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      drop.addEventListener(eventName, (event) => {
        event.preventDefault();
        drop.classList.add("dragging");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      drop.addEventListener(eventName, (event) => {
        event.preventDefault();
        drop.classList.remove("dragging");
      });
    });

    drop.addEventListener("drop", (event) => {
      handleUploadFile(event.dataTransfer.files[0]).catch((error) => {
        message.classList.add("error");
        message.textContent = error.message;
      });
    });

    drop.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!uploadState.loaded) {
        message.classList.add("error");
        message.textContent = "Upload an image before saving.";
        return;
      }

      const title = value("uploadTitle") || uploadState.fileName || "Uploaded artwork";
      const type = value("uploadType") || "art";
      const note = value("uploadNote") || "Uploaded artwork";
      const tags = value("uploadTags");
      try {
        if (window.VOC_DB) {
          window.VOC_DB.saveCreation({
            id: `upload-${Date.now()}`,
            kind: "upload",
            title,
            uploadType: type,
            tags,
            recipe: `${title} / ${type}: ${note}`,
            image: uploadState.imageData
          });
        }
      } catch (error) {
        message.classList.add("error");
        message.textContent = "The browser database is full. Try a smaller image or clear older saves.";
        return;
      }

      message.classList.remove("error");
      message.textContent = "Saved to your gallery.";
      $("#uploadStatus").textContent = "saved";
      renderUploadLibrary();
    });

    $("[data-action='clear-upload']").addEventListener("click", clearUpload);
    $("[data-action='download-upload']").addEventListener("click", () => {
      if (uploadState.loaded) downloadCanvas($("#uploadCanvas"), value("uploadTitle") || uploadState.fileName);
    });
  }

  function initAuth() {
    const form = $("[data-auth-form]");
    const message = $("#authMessage");
    if (!form || !window.VOC_DB) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fields = Object.fromEntries(new FormData(form).entries());
      message.classList.remove("error");
      message.textContent = "Working...";

      try {
        if (form.dataset.authForm === "signup") {
          await window.VOC_DB.signUp(fields);
          message.textContent = "Account created. Opening your gallery...";
        } else {
          await window.VOC_DB.logIn(fields);
          message.textContent = "Logged in. Opening your gallery...";
        }
        syncAuthNav();
        window.setTimeout(() => {
          window.location.href = "gallery.html";
        }, 650);
      } catch (error) {
        message.classList.add("error");
        message.textContent = error.message || "Something went wrong.";
      }
    });
  }

  function initGallery() {
    let filter = "all";
    const pageSize = 60;
    let visibleCount = pageSize;
    const render = () => renderGallery(filter, visibleCount);
    $$("[data-gallery-filter] button").forEach((button) => {
      button.addEventListener("click", () => {
        filter = button.dataset.value;
        visibleCount = pageSize;
        $$("[data-gallery-filter] button").forEach((btn) => btn.classList.toggle("active", btn === button));
        render();
      });
    });
    const loadMore = $("#loadMoreGallery");
    if (loadMore) {
      loadMore.addEventListener("click", () => {
        visibleCount += pageSize;
        render();
      });
    }
    $("[data-action='export-gallery']").addEventListener("click", () => {
      const snapshot = window.VOC_DB ? window.VOC_DB.exportSnapshot() : readGallery();
      downloadText("variation-of-creation-db.json", JSON.stringify(snapshot, null, 2));
    });
    $("[data-action='clear-gallery']").addEventListener("click", () => {
      if (window.VOC_DB) window.VOC_DB.clearCreations();
      render();
    });
    const logoutButton = $("[data-action='logout']");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        if (window.VOC_DB) window.VOC_DB.logOut();
        syncAuthNav();
        render();
      });
    }
    render();
  }

  function renderGallery(filter, visibleCount = 60) {
    const grid = $("#galleryGrid");
    if (!grid) return;
    const items = readGallery().filter((item) => filter === "all" || item.kind === filter);
    const visibleItems = items.slice(0, visibleCount);
    const loadMore = $("#loadMoreGallery");
    if (loadMore) {
      loadMore.hidden = visibleItems.length >= items.length;
      loadMore.textContent = `Load more samples (${visibleItems.length} of ${items.length})`;
    }
    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-gallery">
          <h2>No saved variations yet.</h2>
          <p>Saved studio, logo, tattoo, and comic pieces appear here with their recipes and export previews.</p>
          <a class="button primary" href="index.html">Open Studio</a>
        </div>
      `;
      return;
    }
    grid.innerHTML = visibleItems.map((item) => `
      <article class="gallery-card">
        ${item.image
          ? `<img src="${item.image}" alt="${escapeHtml(item.kind)} saved artwork">`
          : `<canvas class="seed-preview seed-art" width="720" height="720" data-seed-canvas="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.title)} seed artwork"></canvas>`
        }
        <div class="gallery-card-body">
          <h2>${escapeHtml(item.title || titleCase(item.kind))}</h2>
          <p>${escapeHtml(item.recipe)}</p>
          <div class="gallery-meta">
            <span>${item.seed ? "CSV seed" : new Date(item.createdAt).toLocaleDateString()}</span>
            <span>${escapeHtml(item.kind)}</span>
            ${item.uploadType ? `<span>${escapeHtml(item.uploadType)}</span>` : ""}
            ${item.tags ? `<span>${escapeHtml(item.tags)}</span>` : ""}
            ${item.license ? `<span>${escapeHtml(item.license)}</span>` : ""}
            ${item.source_url ? `<a href="${escapeHtml(item.source_url)}" target="_blank" rel="noreferrer">source</a>` : ""}
          </div>
          ${item.image
            ? `<button class="button" type="button" data-download-saved="${item.id}">PNG</button>`
            : `<a class="button" href="${seedTarget(item.kind)}">Use Generator</a>`
          }
        </div>
      </article>
    `).join("");
    $$("[data-download-saved]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = readGallery().find((entry) => entry.id === button.dataset.downloadSaved);
        if (!item) return;
        const link = document.createElement("a");
        link.download = `${item.kind}-${item.id}.png`;
        link.href = item.image;
        link.click();
      });
    });
    drawSeedPreviews(grid);
  }

  function seedTarget(kind) {
    return {
      logo: "logos.html",
      tattoo: "tattoos.html",
      comic: "comics.html"
    }[kind] || "index.html";
  }

  function redrawPage() {
    if (page === "studio") drawStudio();
    if (page === "logos") drawLogo();
    if (page === "tattoos") drawTattoo();
    if (page === "comics") drawComic();
  }

  initCommon();
  if (page === "upload") initUpload();

  if (window.VOC_DB) {
    await window.VOC_DB.init();
    if (page === "upload") renderUploadLibrary();
  }

  if (page === "studio") initStudio();
  if (page === "logos") initLogo();
  if (page === "tattoos") initTattoo();
  if (page === "comics") initComic();
  if (page === "gallery") initGallery();
  if (page === "login" || page === "signup") initAuth();
  renderSeedDeck();
})();
