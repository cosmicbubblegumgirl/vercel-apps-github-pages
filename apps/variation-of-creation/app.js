const elements = {
  canvas: document.querySelector("#artCanvas"),
  imageInput: document.querySelector("#imageInput"),
  dropZone: document.querySelector("#dropZone"),
  assetGrid: document.querySelector("#assetGrid"),
  imageCount: document.querySelector("#imageCount"),
  sampleButton: document.querySelector("#sampleButton"),
  downloadButton: document.querySelector("#downloadButton"),
  blendButton: document.querySelector("#blendButton"),
  shuffleButton: document.querySelector("#shuffleButton"),
  fitButton: document.querySelector("#fitButton"),
  removeButton: document.querySelector("#removeButton"),
  reactionStatus: document.querySelector("#reactionStatus"),
  emptyState: document.querySelector("#emptyState"),
  selectedLayerName: document.querySelector("#selectedLayerName"),
  opacityRange: document.querySelector("#opacityRange"),
  scaleRange: document.querySelector("#scaleRange"),
  rotationRange: document.querySelector("#rotationRange"),
  blendModeSelect: document.querySelector("#blendModeSelect"),
  outputIntent: document.querySelector("#outputIntent"),
  textPrompt: document.querySelector("#textPrompt"),
  paletteStrip: document.querySelector("#paletteStrip"),
  recipeList: document.querySelector("#recipeList"),
  creditsList: document.querySelector("#creditsList"),
  loadSourcesButton: document.querySelector("#loadSourcesButton"),
  loadAllSourcesButton: document.querySelector("#loadAllSourcesButton"),
  addSourceBatchButton: document.querySelector("#addSourceBatchButton"),
  sourceLibraryGrid: document.querySelector("#sourceLibraryGrid"),
  sourceLibraryStatus: document.querySelector("#sourceLibraryStatus"),
  aiScore: document.querySelector("#aiScore"),
  reactionOverlay: document.querySelector("#reactionOverlay"),
  reactionStage: document.querySelector(".reaction-stage"),
  reactantOrbit: document.querySelector("#reactantOrbit"),
  finalPreview: document.querySelector("#finalPreview"),
  reactionWords: document.querySelector("#reactionWords")
};

const ctx = elements.canvas.getContext("2d", { willReadFrequently: true });

const formats = {
  square: { width: 1400, height: 1400 },
  portrait: { width: 1080, height: 1440 },
  story: { width: 1080, height: 1920 },
  landscape: { width: 1600, height: 1000 },
  banner: { width: 1800, height: 900 }
};

const artProfiles = {
  "mixed-media": {
    label: "Mixed media",
    blends: ["source-over", "overlay", "soft-light", "screen"],
    clip: "blob",
    opacity: 0.9,
    filter: "saturate(1.12) contrast(1.04)"
  },
  watercolor: {
    label: "Watercolor",
    blends: ["soft-light", "screen", "source-over", "multiply"],
    clip: "ellipse",
    opacity: 0.74,
    filter: "saturate(0.94) contrast(0.93) brightness(1.06)"
  },
  "surreal-collage": {
    label: "Surreal collage",
    blends: ["source-over", "multiply", "screen", "overlay"],
    clip: "cutout",
    opacity: 0.94,
    filter: "saturate(1.22) contrast(1.1)"
  },
  "ink-poster": {
    label: "Ink poster",
    blends: ["multiply", "source-over", "luminosity", "overlay"],
    clip: "poster",
    opacity: 0.88,
    filter: "grayscale(.18) contrast(1.32) saturate(0.82)"
  },
  tattoo: {
    label: "Tattoo",
    blends: ["multiply", "source-over", "overlay", "luminosity"],
    clip: "tattoo",
    opacity: 0.86,
    filter: "grayscale(.34) contrast(1.42) saturate(0.76)"
  },
  "album-cover": {
    label: "Album cover",
    blends: ["source-over", "screen", "overlay", "soft-light"],
    clip: "square",
    opacity: 0.92,
    filter: "saturate(1.18) contrast(1.12)"
  },
  "character-concept": {
    label: "Character concept",
    blends: ["source-over", "multiply", "soft-light", "screen"],
    clip: "panel",
    opacity: 0.88,
    filter: "saturate(1.03) contrast(1.08)"
  }
};

const vibeProfiles = {
  whimsical: {
    label: "Whimsical",
    colors: ["#0e8075", "#d55d42", "#f2bd4e", "#3868a7"],
    line: "#97406d",
    warmth: 1.08
  },
  cinematic: {
    label: "Cinematic",
    colors: ["#13251f", "#c48a24", "#3868a7", "#d55d42"],
    line: "#f7f4ed",
    warmth: 0.92
  },
  cozy: {
    label: "Cozy",
    colors: ["#9c4d37", "#4e7b45", "#e2bd6d", "#3868a7"],
    line: "#7a3d57",
    warmth: 1.14
  },
  electric: {
    label: "Electric",
    colors: ["#1a9cc0", "#e04d7a", "#f3cf38", "#26225d"],
    line: "#05a88f",
    warmth: 1
  },
  botanical: {
    label: "Botanical",
    colors: ["#315c40", "#89a44e", "#d9a441", "#9a5543"],
    line: "#0e8075",
    warmth: 1.02
  },
  editorial: {
    label: "Editorial",
    colors: ["#141414", "#f7f4ed", "#c23737", "#3868a7"],
    line: "#c23737",
    warmth: 0.98
  }
};

const sourceLibraryQueries = {
  "mixed-media": [
    "mixed media drawing sketch",
    "collage drawing sketch",
    "abstract art sketch"
  ],
  watercolor: [
    "watercolor sketch drawing",
    "watercolour botanical sketch",
    "watercolor illustration drawing"
  ],
  "surreal-collage": [
    "surreal drawing sketch",
    "fantasy collage drawing",
    "dream illustration sketch"
  ],
  "ink-poster": [
    "ink drawing poster",
    "black ink sketch",
    "line art drawing"
  ],
  tattoo: [
    "tattoo flash drawing",
    "tattoo design sketch",
    "traditional tattoo drawing"
  ],
  "album-cover": [
    "album cover art drawing",
    "music poster illustration",
    "psychedelic drawing art"
  ],
  "character-concept": [
    "character concept sketch",
    "figure drawing sketch",
    "portrait character drawing"
  ]
};

const sourceLibraryLimit = 90;
const sourceCacheKey = "variationCreation.openSourceLibrary.v1";
const commonsApi = "https://commons.wikimedia.org/w/api.php";

const state = {
  images: [],
  selectedId: null,
  artType: "mixed-media",
  vibe: "whimsical",
  format: "square",
  outputIntent: "finished-artwork",
  prompt: "",
  seed: 0.42,
  dirtyLayout: false,
  dragging: null,
  lastRecipe: null,
  sourceLibrary: readSourceCache(),
  sourceLoading: false
};

const VariationAI = {
  analyzeImage(image) {
    const sampleSize = 88;
    const offscreen = document.createElement("canvas");
    const sampleCtx = offscreen.getContext("2d", { willReadFrequently: true });
    offscreen.width = sampleSize;
    offscreen.height = sampleSize;
    sampleCtx.drawImage(image, 0, 0, sampleSize, sampleSize);

    const { data } = sampleCtx.getImageData(0, 0, sampleSize, sampleSize);
    const buckets = new Map();
    let total = 0;
    let rTotal = 0;
    let gTotal = 0;
    let bTotal = 0;
    let brightnessTotal = 0;
    let contrastTotal = 0;
    let textureTotal = 0;
    let previousBrightness = 0;

    for (let i = 0; i < data.length; i += 16) {
      const alpha = data[i + 3];
      if (alpha < 28) continue;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      const saturation = maxChannel(r, g, b) - minChannel(r, g, b);
      const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
      const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0, saturation: 0 };

      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.count += 1;
      bucket.saturation += saturation;
      buckets.set(key, bucket);

      total += 1;
      rTotal += r;
      gTotal += g;
      bTotal += b;
      brightnessTotal += brightness;
      contrastTotal += Math.abs(brightness - 0.5);
      textureTotal += Math.abs(brightness - previousBrightness);
      previousBrightness = brightness;
    }

    const palette = [...buckets.values()]
      .sort((a, b) => (b.count * 2 + b.saturation / 32) - (a.count * 2 + a.saturation / 32))
      .slice(0, 6)
      .map((bucket) => rgbToHex(
        Math.round(bucket.r / bucket.count),
        Math.round(bucket.g / bucket.count),
        Math.round(bucket.b / bucket.count)
      ));

    const safeTotal = Math.max(total, 1);
    return {
      palette: palette.length ? palette : ["#0e8075", "#d55d42", "#f2bd4e"],
      average: rgbToHex(Math.round(rTotal / safeTotal), Math.round(gTotal / safeTotal), Math.round(bTotal / safeTotal)),
      brightness: brightnessTotal / safeTotal,
      contrast: clamp(contrastTotal / safeTotal, 0, 1),
      texture: clamp(textureTotal / safeTotal * 2.8, 0, 1)
    };
  },

  compose() {
    const format = formats[state.format];
    elements.canvas.width = format.width;
    elements.canvas.height = format.height;

    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const palette = collectPalette();
    const art = artProfiles[state.artType];
    const vibe = vibeProfiles[state.vibe];

    drawBackground(width, height, palette, vibe);
    drawCompositionScaffold(width, height, palette, vibe);

    state.images.forEach((layer, index) => {
      drawLayer(layer, index, width, height, art, vibe, palette);
    });

    drawSynthesisDetails(width, height, palette, art, vibe);
    drawIntentTreatment(width, height, palette, state.outputIntent);
    drawSelection(width, height);

    const recipe = buildRecipe(palette);
    state.lastRecipe = recipe;
    return recipe;
  }
};

function initialize() {
  bindEvents();
  setFormat("square");
  updateInspector();
  renderSourceLibrary();
  renderArtwork();
  loadStarterSet();
}

function bindEvents() {
  elements.imageInput.addEventListener("change", (event) => {
    handleFiles([...event.target.files]);
    event.target.value = "";
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.remove("dragging");
    });
  });

  elements.dropZone.addEventListener("drop", (event) => {
    handleFiles([...event.dataTransfer.files]);
  });

  document.querySelectorAll("[data-art-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.artType = button.dataset.artType;
      syncActiveButtons("[data-art-type]", state.artType, "artType");
      renderSourceLibrary();
      state.images.forEach((layer, index) => {
        layer.blendMode = layer.userBlendMode || defaultBlend(index);
        layer.opacity = Math.min(layer.opacity, artProfiles[state.artType].opacity + 0.12);
      });
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-vibe]").forEach((button) => {
    button.addEventListener("click", () => {
      state.vibe = button.dataset.vibe;
      syncActiveButtons("[data-vibe]", state.vibe, "vibe");
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-format]").forEach((button) => {
    button.addEventListener("click", () => setFormat(button.dataset.format));
  });

  elements.outputIntent.addEventListener("change", () => {
    state.outputIntent = elements.outputIntent.value;
    renderArtwork();
  });

  elements.textPrompt.addEventListener("input", () => {
    state.prompt = elements.textPrompt.value.trim();
    renderArtwork();
  });

  elements.opacityRange.addEventListener("input", () => {
    const layer = selectedLayer();
    if (!layer) return;
    layer.opacity = Number(elements.opacityRange.value) / 100;
    renderArtwork();
  });

  elements.scaleRange.addEventListener("input", () => {
    const layer = selectedLayer();
    if (!layer) return;
    layer.scale = Number(elements.scaleRange.value) / 100;
    renderArtwork();
  });

  elements.rotationRange.addEventListener("input", () => {
    const layer = selectedLayer();
    if (!layer) return;
    layer.rotation = Number(elements.rotationRange.value);
    renderArtwork();
  });

  elements.blendModeSelect.addEventListener("change", () => {
    const layer = selectedLayer();
    if (!layer) return;
    layer.blendMode = elements.blendModeSelect.value;
    layer.userBlendMode = layer.blendMode;
    renderArtwork();
  });

  elements.shuffleButton.addEventListener("click", () => {
    state.seed = Math.random() * 20;
    layoutLayers(true);
    renderArtwork();
  });

  elements.fitButton.addEventListener("click", () => {
    const layer = selectedLayer();
    if (!layer) return;
    layer.x = 0.5;
    layer.y = 0.5;
    layer.scale = 1.08;
    layer.rotation = 0;
    syncLayerControls(layer);
    renderArtwork();
  });

  elements.removeButton.addEventListener("click", () => {
    const layer = selectedLayer();
    if (!layer) return;
    state.images = state.images.filter((item) => item.id !== layer.id);
    state.selectedId = state.images[0]?.id || null;
    renderArtwork();
  });

  elements.sampleButton.addEventListener("click", () => loadStarterSet(true));
  elements.downloadButton.addEventListener("click", downloadArtwork);
  elements.blendButton.addEventListener("click", runBlendReaction);
  elements.loadSourcesButton.addEventListener("click", () => loadSourcesForArtType(state.artType));
  elements.loadAllSourcesButton.addEventListener("click", loadAllSourceTypes);
  elements.addSourceBatchButton.addEventListener("click", addSourceBatch);

  elements.canvas.addEventListener("pointerdown", beginCanvasDrag);
  window.addEventListener("pointermove", continueCanvasDrag);
  window.addEventListener("pointerup", endCanvasDrag);
  window.addEventListener("resize", () => renderArtwork());
}

async function handleFiles(files) {
  const imageFiles = files.filter((file) => file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name));
  if (!imageFiles.length) return;

  elements.reactionStatus.textContent = "Reading images";
  const images = await Promise.all(imageFiles.map(readImageFile));
  for (const item of images.filter(Boolean)) {
    await addImageSource(item.src, item.name);
  }
  state.seed = Math.random() * 20;
  layoutLayers(true);
  selectLayer(state.images.at(-1)?.id || state.selectedId);
  renderArtwork();
}

function readImageFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ src: reader.result, name: file.name.replace(/\.[^.]+$/, "") });
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function addImageSource(src, name, sourceMeta = null) {
  return new Promise((resolve) => {
    const image = new Image();
    if (/^https?:\/\//i.test(src)) {
      image.crossOrigin = "anonymous";
    }
    image.onload = () => {
      let analysis;
      try {
        analysis = VariationAI.analyzeImage(image);
      } catch (error) {
        analysis = {
          palette: vibeProfiles[state.vibe].colors,
          average: vibeProfiles[state.vibe].colors[0],
          brightness: 0.55,
          contrast: 0.28,
          texture: 0.24
        };
      }
      const index = state.images.length;
      const layer = {
        id: makeId(),
        name,
        src,
        sourceMeta,
        image,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        analysis,
        x: 0.5,
        y: 0.5,
        scale: 1,
        rotation: 0,
        opacity: artProfiles[state.artType].opacity,
        blendMode: defaultBlend(index),
        seed: Math.random() * 1000
      };

      state.images.push(layer);
      if (!state.selectedId) state.selectedId = layer.id;
      resolve(layer);
    };
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function loadStarterSet(replace = false) {
  if (!replace && state.images.length) return;
  if (replace) {
    state.images = [];
    state.selectedId = null;
  }

  const starters = [
    createStarterImage("botanical", "botanical sketch"),
    createStarterImage("portrait", "portrait color study"),
    createStarterImage("texture", "paper texture"),
    createStarterImage("light", "light fragment")
  ];

  for (const starter of starters) {
    await addImageSource(starter.src, starter.name);
  }

  state.seed = 2.76;
  layoutLayers(true);
  selectLayer(state.images[0]?.id);
  renderArtwork();
}

function createStarterImage(kind, name) {
  const canvas = document.createElement("canvas");
  const starterCtx = canvas.getContext("2d");
  canvas.width = 980;
  canvas.height = 980;

  const bg = starterCtx.createLinearGradient(0, 0, 980, 980);
  bg.addColorStop(0, kind === "portrait" ? "#ffe0c7" : kind === "texture" ? "#f6e9c8" : "#e5f1e7");
  bg.addColorStop(1, kind === "light" ? "#3169a4" : kind === "texture" ? "#b64b45" : "#0e8075");
  starterCtx.fillStyle = bg;
  starterCtx.fillRect(0, 0, 980, 980);

  if (kind === "botanical") {
    starterCtx.strokeStyle = "#173f34";
    starterCtx.lineWidth = 10;
    for (let i = 0; i < 13; i += 1) {
      const x = 140 + i * 58;
      starterCtx.beginPath();
      starterCtx.moveTo(x, 860);
      starterCtx.bezierCurveTo(x - 80, 600, x + 110, 460, x + 25, 180);
      starterCtx.stroke();
      starterCtx.fillStyle = i % 2 ? "#d55d42" : "#f2bd4e";
      starterCtx.beginPath();
      starterCtx.ellipse(x + 28, 380 + (i % 4) * 52, 46, 90, -0.7, 0, Math.PI * 2);
      starterCtx.fill();
    }
  }

  if (kind === "portrait") {
    starterCtx.fillStyle = "#7f3655";
    starterCtx.beginPath();
    starterCtx.ellipse(510, 470, 250, 330, -0.1, 0, Math.PI * 2);
    starterCtx.fill();
    starterCtx.fillStyle = "#f7c6a1";
    starterCtx.beginPath();
    starterCtx.ellipse(500, 455, 165, 220, 0.05, 0, Math.PI * 2);
    starterCtx.fill();
    starterCtx.fillStyle = "#13251f";
    starterCtx.fillRect(390, 425, 48, 14);
    starterCtx.fillRect(555, 425, 48, 14);
    starterCtx.strokeStyle = "#3868a7";
    starterCtx.lineWidth = 24;
    starterCtx.beginPath();
    starterCtx.arc(500, 680, 250, Math.PI * 1.06, Math.PI * 1.94);
    starterCtx.stroke();
  }

  if (kind === "texture") {
    for (let i = 0; i < 260; i += 1) {
      starterCtx.fillStyle = i % 3 === 0 ? "rgba(14,128,117,.22)" : i % 3 === 1 ? "rgba(151,64,109,.24)" : "rgba(196,138,36,.24)";
      starterCtx.fillRect(Math.random() * 980, Math.random() * 980, 18 + Math.random() * 72, 3 + Math.random() * 16);
    }
    starterCtx.strokeStyle = "rgba(20,20,20,.22)";
    starterCtx.lineWidth = 3;
    for (let i = 0; i < 40; i += 1) {
      starterCtx.beginPath();
      starterCtx.moveTo(Math.random() * 980, Math.random() * 980);
      starterCtx.lineTo(Math.random() * 980, Math.random() * 980);
      starterCtx.stroke();
    }
  }

  if (kind === "light") {
    starterCtx.globalCompositeOperation = "screen";
    for (let i = 0; i < 18; i += 1) {
      const grd = starterCtx.createRadialGradient(490, 490, 10, 490, 490, 420 + i * 12);
      grd.addColorStop(0, i % 2 ? "rgba(242,189,78,.4)" : "rgba(255,255,255,.42)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      starterCtx.fillStyle = grd;
      starterCtx.fillRect(0, 0, 980, 980);
    }
    starterCtx.globalCompositeOperation = "source-over";
    starterCtx.strokeStyle = "#f2bd4e";
    starterCtx.lineWidth = 12;
    for (let i = 0; i < 9; i += 1) {
      starterCtx.beginPath();
      starterCtx.moveTo(100 + i * 95, 140);
      starterCtx.quadraticCurveTo(520, 420 + i * 15, 820 - i * 50, 860);
      starterCtx.stroke();
    }
  }

  return { src: canvas.toDataURL("image/png"), name };
}

function readSourceCache() {
  try {
    const cached = window.localStorage?.getItem(sourceCacheKey);
    if (!cached) return {};
    const parsed = JSON.parse(cached);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch (error) {
    return {};
  }
}

function writeSourceCache() {
  try {
    window.localStorage?.setItem(sourceCacheKey, JSON.stringify(state.sourceLibrary));
  } catch (error) {
    // Cache pressure should not block the studio.
  }
}

async function loadSourcesForArtType(artType = state.artType) {
  if (state.sourceLoading) return;
  const existing = state.sourceLibrary[artType] || [];
  if (existing.length >= sourceLibraryLimit) {
    renderSourceLibrary();
    return;
  }

  state.sourceLoading = true;
  renderSourceLibrary(`Loading ${artProfiles[artType].label.toLowerCase()}`);
  try {
    state.sourceLibrary[artType] = await fetchCommonsForArtType(artType, sourceLibraryLimit);
    writeSourceCache();
    renderSourceLibrary();
  } catch (error) {
    renderSourceLibrary("Could not load sources");
  } finally {
    state.sourceLoading = false;
    renderSourceLibrary();
  }
}

async function loadAllSourceTypes() {
  if (state.sourceLoading) return;
  state.sourceLoading = true;
  const artTypes = Object.keys(artProfiles);

  try {
    for (const artType of artTypes) {
      const existing = state.sourceLibrary[artType] || [];
      if (existing.length < sourceLibraryLimit) {
        renderSourceLibrary(`Loading ${artProfiles[artType].label.toLowerCase()}`);
        state.sourceLibrary[artType] = await fetchCommonsForArtType(artType, sourceLibraryLimit);
        writeSourceCache();
      }
    }
  } catch (error) {
    renderSourceLibrary("Some sources could not load");
  } finally {
    state.sourceLoading = false;
    renderSourceLibrary();
  }
}

async function fetchCommonsForArtType(artType, limit) {
  const existing = state.sourceLibrary[artType] || [];
  const collected = [...existing];
  const seen = new Set(existing.map((item) => item.id || item.url));
  const queries = sourceLibraryQueries[artType] || sourceLibraryQueries["mixed-media"];

  for (const query of queries) {
    let continuation = {};
    let attempts = 0;

    while (collected.length < limit && attempts < 4) {
      attempts += 1;
      const page = await fetchCommonsQuery(query, continuation);
      page.items.forEach((item) => {
        const key = item.id || item.url;
        if (!seen.has(key) && collected.length < limit) {
          seen.add(key);
          collected.push({ ...item, artType });
        }
      });

      if (!page.continuation) break;
      continuation = page.continuation;
    }

    if (collected.length >= limit) break;
  }

  return collected.slice(0, limit);
}

async function fetchCommonsQuery(query, continuation = {}) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "50",
    gsrsearch: query,
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: "900"
  });

  Object.entries(continuation).forEach(([key, value]) => {
    params.set(key, value);
  });

  const response = await fetch(`${commonsApi}?${params.toString()}`);
  if (!response.ok) throw new Error("Commons request failed");

  const data = await response.json();
  const pages = Object.values(data.query?.pages || {});
  return {
    items: pages.map(normalizeCommonsItem).filter(Boolean),
    continuation: data.continue || null
  };
}

function normalizeCommonsItem(page) {
  const info = page.imageinfo?.[0];
  if (!info || !info.url || !info.mime?.startsWith("image/")) return null;

  const metadata = info.extmetadata || {};
  const title = cleanText(metadata.ObjectName?.value || page.title.replace(/^File:/i, ""));
  const artist = cleanText(metadata.Artist?.value || metadata.Credit?.value || "Wikimedia Commons");
  const license = cleanText(metadata.LicenseShortName?.value || metadata.UsageTerms?.value || "Commons");
  const pageUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`;
  const licenseUrl = metadata.LicenseUrl?.value || pageUrl;

  if (/non-free|fair use|copyrighted/i.test(license)) return null;

  return {
    id: String(page.pageid),
    title: title || page.title.replace(/^File:/i, ""),
    artist,
    license,
    licenseUrl,
    pageUrl,
    url: info.url,
    thumb: info.thumburl || info.url
  };
}

function renderSourceLibrary(message = "") {
  const items = state.sourceLibrary[state.artType] || [];
  const label = artProfiles[state.artType].label;
  elements.sourceLibraryGrid.replaceChildren();
  elements.sourceLibraryStatus.textContent = message || `${items.length}/${sourceLibraryLimit} ${label}`;
  elements.loadSourcesButton.disabled = state.sourceLoading;
  elements.loadAllSourcesButton.disabled = state.sourceLoading;
  elements.addSourceBatchButton.disabled = state.sourceLoading || !items.length;

  items.slice(0, sourceLibraryLimit).forEach((item) => {
    const card = document.createElement("div");
    card.className = "source-card";

    const image = document.createElement("img");
    image.src = item.thumb || item.url;
    image.alt = item.title;
    image.loading = "lazy";

    const link = document.createElement("a");
    link.href = item.pageUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.title = `${item.license} source`;
    link.textContent = "i";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Use";
    button.addEventListener("click", () => addSourceToCanvas(item));

    card.append(image, link, button);
    elements.sourceLibraryGrid.append(card);
  });
}

async function addSourceBatch() {
  const items = state.sourceLibrary[state.artType] || [];
  if (!items.length || state.sourceLoading) return;

  state.sourceLoading = true;
  renderSourceLibrary("Adding sources");
  const start = Math.max(0, state.images.filter((layer) => layer.sourceMeta?.artType === state.artType).length % Math.max(items.length, 1));
  const batch = [...items.slice(start, start + 12), ...items.slice(0, Math.max(0, start + 12 - items.length))].slice(0, 12);

  for (const item of batch) {
    await addSourceToCanvas(item, false);
  }

  state.seed = Math.random() * 20;
  layoutLayers(true);
  state.sourceLoading = false;
  selectLayer(state.images.at(-1)?.id || state.selectedId);
  renderSourceLibrary();
}

async function addSourceToCanvas(item, shouldRender = true) {
  const name = item.title.length > 48 ? `${item.title.slice(0, 45)}...` : item.title;
  const layer = await addImageSource(item.thumb || item.url, name, {
    title: item.title,
    artist: item.artist,
    license: item.license,
    licenseUrl: item.licenseUrl,
    pageUrl: item.pageUrl,
    artType: item.artType || state.artType
  });

  if (layer && shouldRender) {
    state.seed = Math.random() * 20;
    layoutLayers(true);
    selectLayer(layer.id);
  }
}

function layoutLayers(force = false) {
  if (!force && state.dirtyLayout) return;
  const count = Math.max(state.images.length, 1);
  state.images.forEach((layer, index) => {
    const angle = state.seed + index * ((Math.PI * 2) / count);
    const ring = count < 3 ? 0.13 : 0.16 + (index % 3) * 0.045;
    layer.x = clamp(0.5 + Math.cos(angle) * ring, 0.18, 0.82);
    layer.y = clamp(0.5 + Math.sin(angle) * ring * 0.76, 0.18, 0.82);
    layer.scale = clamp(1.12 - count * 0.045 + (index % 2) * 0.08, 0.64, 1.24);
    layer.rotation = Math.round(Math.sin(angle * 1.7) * 17);
    layer.opacity = artProfiles[state.artType].opacity;
    layer.blendMode = layer.userBlendMode || defaultBlend(index);
  });
}

function renderArtwork() {
  const recipe = VariationAI.compose();
  renderAssets();
  updateInspector(recipe);
}

function drawBackground(width, height, palette, vibe) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7f4ed";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, mixHex(palette[0], vibe.colors[0], 0.44));
  gradient.addColorStop(0.48, mixHex(palette[1] || palette[0], vibe.colors[1], 0.34));
  gradient.addColorStop(1, mixHex(palette[2] || palette[0], vibe.colors[2], 0.44));
  ctx.globalAlpha = 0.74;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;

  const paper = ctx.createLinearGradient(width, 0, 0, height);
  paper.addColorStop(0, "rgba(255,255,255,.32)");
  paper.addColorStop(0.5, "rgba(255,255,255,0)");
  paper.addColorStop(1, "rgba(20,25,23,.18)");
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);
}

function drawCompositionScaffold(width, height, palette, vibe) {
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.lineWidth = Math.max(8, Math.min(width, height) * 0.008);
  ctx.strokeStyle = vibe.line;

  for (let i = 0; i < 7; i += 1) {
    const offset = (i - 3) * Math.min(width, height) * 0.1;
    ctx.beginPath();
    ctx.moveTo(width * -0.05, height * (0.2 + i * 0.1));
    ctx.bezierCurveTo(width * 0.25, height * 0.06 + offset, width * 0.64, height * 0.92 - offset, width * 1.05, height * (0.28 + i * 0.08));
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.09;
  ctx.fillStyle = palette[3] || palette[0];
  for (let i = 0; i < 8; i += 1) {
    const x = ((i * 233 + 97) % 1000) / 1000 * width;
    const y = ((i * 157 + 211) % 1000) / 1000 * height;
    ctx.beginPath();
    ctx.rect(x - width * 0.08, y - height * 0.02, width * 0.22, height * 0.042);
    ctx.fill();
  }
  ctx.restore();
}

function drawLayer(layer, index, width, height, art, vibe, palette) {
  const measure = measureLayer(layer, width, height);
  const x = layer.x * width;
  const y = layer.y * height;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(degreesToRadians(layer.rotation));
  ctx.globalAlpha = layer.opacity;
  ctx.globalCompositeOperation = layer.blendMode || defaultBlend(index);
  ctx.filter = art.filter;
  drawClipPath(measure.width, measure.height, index, art.clip, layer.seed);
  ctx.clip();
  drawImageCover(layer.image, -measure.width / 2, -measure.height / 2, measure.width, measure.height);

  if (art.clip === "poster" || art.clip === "panel") {
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = palette[(index + 2) % palette.length];
    ctx.fillRect(-measure.width / 2, -measure.height / 2, measure.width, measure.height);
  }

  ctx.restore();

  drawLayerAccent(layer, index, width, height, measure, art, vibe, palette);
}

function drawLayerAccent(layer, index, width, height, measure, art, vibe, palette) {
  ctx.save();
  ctx.translate(layer.x * width, layer.y * height);
  ctx.rotate(degreesToRadians(layer.rotation));

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = art.clip === "watercolor" ? 0.23 : 0.42;
  ctx.strokeStyle = palette[(index + 1) % palette.length] || vibe.line;
  ctx.lineWidth = Math.max(4, Math.min(width, height) * 0.006);
  drawClipPath(measure.width, measure.height, index, art.clip, layer.seed);
  ctx.stroke();

  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = vibe.colors[index % vibe.colors.length];
  drawClipPath(measure.width * 0.72, measure.height * 0.72, index + 2, "ellipse", layer.seed);
  ctx.fill();
  ctx.restore();
}

function drawSynthesisDetails(width, height, palette, art, vibe) {
  ctx.save();
  ctx.globalCompositeOperation = art.clip === "ink-poster" || art.clip === "tattoo" ? "multiply" : "overlay";
  ctx.lineCap = "round";

  const promptInfluence = state.prompt ? clamp(state.prompt.length / 120, 0.18, 0.7) : 0.22;
  for (let i = 0; i < 18; i += 1) {
    ctx.globalAlpha = 0.08 + (i % 4) * 0.012 + promptInfluence * 0.04;
    ctx.strokeStyle = mixHex(palette[i % palette.length], vibe.colors[(i + 1) % vibe.colors.length], 0.36);
    ctx.lineWidth = Math.max(3, Math.min(width, height) * (0.003 + (i % 5) * 0.001));
    ctx.beginPath();
    const x = width * (((i * 89) % 100) / 100);
    const y = height * (((i * 53 + 20) % 100) / 100);
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(width * (0.18 + (i % 3) * 0.2), height * (0.1 + (i % 5) * 0.17), width * (0.82 - (i % 4) * 0.12), height * (0.88 - (i % 6) * 0.1), width - x, height - y);
    ctx.stroke();
  }

  drawGrain(width, height, state.images.length > 4 ? 0.08 : 0.055);
  if (art.clip === "tattoo") {
    drawTattooLinework(width, height, palette, vibe);
  }
  ctx.restore();
}

function drawIntentTreatment(width, height, palette, intent) {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  if (intent === "print-poster") {
    ctx.strokeStyle = "rgba(255,255,255,.72)";
    ctx.lineWidth = Math.max(22, Math.min(width, height) * 0.035);
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, width - ctx.lineWidth, height - ctx.lineWidth);
  }

  if (intent === "social-post") {
    ctx.fillStyle = "rgba(255,255,255,.78)";
    ctx.beginPath();
    roundedRect(ctx, width * 0.06, height * 0.06, width * 0.18, Math.max(34, height * 0.035), Math.min(18, width * 0.02));
    ctx.fill();
  }

  if (intent === "brand-concept") {
    const swatchSize = Math.max(34, Math.min(width, height) * 0.043);
    const gap = swatchSize * 0.22;
    palette.slice(0, 5).forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(width - (swatchSize + gap) * (index + 1) - width * 0.04, height - swatchSize - height * 0.045, swatchSize, swatchSize);
    });
  }

  if (intent === "character-sheet") {
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.004);
    ctx.beginPath();
    ctx.moveTo(width * 0.33, height * 0.06);
    ctx.lineTo(width * 0.33, height * 0.94);
    ctx.moveTo(width * 0.66, height * 0.06);
    ctx.lineTo(width * 0.66, height * 0.94);
    ctx.stroke();
  }

  if (intent === "wallpaper") {
    const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.18, width / 2, height / 2, Math.max(width, height) * 0.72);
    vignette.addColorStop(0, "rgba(255,255,255,0)");
    vignette.addColorStop(1, "rgba(0,0,0,.2)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

function drawSelection(width, height) {
  const layer = selectedLayer();
  if (!layer) return;

  const measure = measureLayer(layer, width, height);
  ctx.save();
  ctx.translate(layer.x * width, layer.y * height);
  ctx.rotate(degreesToRadians(layer.rotation));
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.95;
  ctx.setLineDash([Math.max(10, width * 0.008), Math.max(8, width * 0.006)]);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(5, width * 0.004);
  ctx.strokeRect(-measure.width / 2, -measure.height / 2, measure.width, measure.height);
  ctx.strokeStyle = "#141414";
  ctx.lineWidth = Math.max(2, width * 0.002);
  ctx.strokeRect(-measure.width / 2, -measure.height / 2, measure.width, measure.height);
  ctx.restore();
}

function drawClipPath(width, height, index, clip, seed) {
  ctx.beginPath();

  if (clip === "ellipse") {
    ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
    return;
  }

  if (clip === "square") {
    roundedRect(ctx, -width / 2, -height / 2, width, height, Math.min(width, height) * 0.025);
    return;
  }

  if (clip === "poster" || clip === "panel") {
    const tilt = clip === "panel" ? width * 0.08 : width * 0.03;
    ctx.moveTo(-width / 2 + tilt, -height / 2);
    ctx.lineTo(width / 2, -height / 2 + tilt);
    ctx.lineTo(width / 2 - tilt, height / 2);
    ctx.lineTo(-width / 2, height / 2 - tilt);
    ctx.closePath();
    return;
  }

  if (clip === "cutout" || clip === "tattoo") {
    const sides = clip === "tattoo" ? 12 : 7;
    for (let i = 0; i < sides; i += 1) {
      const angle = -Math.PI / 2 + i * (Math.PI * 2 / sides);
      const wobble = clip === "tattoo"
        ? 0.74 + (((Math.sin(seed + i * 0.9) + 1) / 2) * 0.2)
        : 0.82 + (((index + i + seed) * 31) % 18) / 100;
      const x = Math.cos(angle) * width * 0.5 * wobble;
      const y = Math.sin(angle) * height * (clip === "tattoo" ? 0.42 : 0.5) * wobble;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    return;
  }

  const points = 10;
  for (let i = 0; i <= points; i += 1) {
    const angle = -Math.PI / 2 + i * (Math.PI * 2 / points);
    const wobble = 0.78 + (((Math.sin(seed + i * 1.7 + index) + 1) / 2) * 0.26);
    const x = Math.cos(angle) * width * 0.5 * wobble;
    const y = Math.sin(angle) * height * 0.5 * wobble;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      const prevAngle = -Math.PI / 2 + (i - 0.5) * (Math.PI * 2 / points);
      const cpx = Math.cos(prevAngle) * width * 0.54;
      const cpy = Math.sin(prevAngle) * height * 0.54;
      ctx.quadraticCurveTo(cpx, cpy, x, y);
    }
  }
  ctx.closePath();
}

function drawImageCover(image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (imageRatio > targetRatio) {
    sw = image.height * targetRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / targetRatio;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function measureLayer(layer, width, height) {
  const minDim = Math.min(width, height);
  const imageRatio = layer.width / layer.height || 1;
  let layerWidth = minDim * 0.54 * layer.scale;
  let layerHeight = layerWidth / imageRatio;

  if (layerHeight < minDim * 0.34 * layer.scale) {
    layerHeight = minDim * 0.34 * layer.scale;
    layerWidth = layerHeight * imageRatio;
  }

  const maxWidth = width * 0.92;
  const maxHeight = height * 0.92;
  const reduction = Math.min(maxWidth / layerWidth, maxHeight / layerHeight, 1);
  return {
    width: layerWidth * reduction,
    height: layerHeight * reduction
  };
}

function collectPalette() {
  const imagePalette = state.images.flatMap((layer) => layer.analysis.palette);
  const vibePalette = vibeProfiles[state.vibe].colors;
  const merged = [...imagePalette, ...vibePalette].filter(Boolean);
  const unique = [];

  merged.forEach((color) => {
    if (!unique.some((known) => colorDistance(known, color) < 38)) unique.push(color);
  });

  while (unique.length < 6) {
    unique.push(vibePalette[unique.length % vibePalette.length]);
  }

  return unique.slice(0, 8);
}

function buildRecipe(palette) {
  const imageCount = state.images.length;
  const texture = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.texture, 0) / imageCount : 0;
  const contrast = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.contrast, 0) / imageCount : 0;
  const paletteVariety = Math.min(palette.length / 8, 1);
  const score = Math.round(clamp(24 + imageCount * 15 + texture * 20 + contrast * 16 + paletteVariety * 16, 0, 99));

  return {
    score,
    palette,
    rows: [
      { key: "Reactants", value: imageCount ? `${imageCount} images` : "No images" },
      { key: "Art", value: artProfiles[state.artType].label },
      { key: "Vibe", value: vibeProfiles[state.vibe].label },
      { key: "Texture", value: texture > 0.35 ? "Rich" : texture > 0.18 ? "Balanced" : "Soft" },
      { key: "Output", value: readableValue(state.outputIntent) }
    ]
  };
}

function renderAssets() {
  elements.assetGrid.replaceChildren();
  state.images.forEach((layer) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `asset-tile${layer.id === state.selectedId ? " active" : ""}`;
    tile.style.setProperty("--tile-color", layer.analysis.palette[0]);
    tile.setAttribute("aria-pressed", layer.id === state.selectedId ? "true" : "false");

    const image = document.createElement("img");
    image.src = layer.src;
    image.alt = layer.name;

    const label = document.createElement("strong");
    label.textContent = layer.name;

    tile.append(image, label);
    tile.addEventListener("click", () => selectLayer(layer.id));
    elements.assetGrid.append(tile);
  });

  elements.imageCount.textContent = String(state.images.length);
  elements.emptyState.classList.toggle("hidden", state.images.length > 0);
}

function updateInspector(recipe = state.lastRecipe) {
  const layer = selectedLayer();
  const activeRecipe = recipe || buildRecipe(collectPalette());

  elements.selectedLayerName.textContent = layer ? layer.name : "None";
  elements.aiScore.textContent = `AI ${activeRecipe.score}%`;
  elements.reactionStatus.textContent = state.images.length
    ? `${state.images.length} reactants -> ${artProfiles[state.artType].label.toLowerCase()}`
    : "Ready";

  syncLayerControls(layer);
  renderPalette(activeRecipe.palette);
  renderRecipe(activeRecipe.rows);
  renderCredits();
}

function syncLayerControls(layer) {
  const hasLayer = Boolean(layer);
  [elements.opacityRange, elements.scaleRange, elements.rotationRange, elements.blendModeSelect].forEach((control) => {
    control.disabled = !hasLayer;
  });

  if (!layer) {
    elements.opacityRange.value = 92;
    elements.scaleRange.value = 100;
    elements.rotationRange.value = 0;
    elements.blendModeSelect.value = "source-over";
    return;
  }

  elements.opacityRange.value = Math.round(layer.opacity * 100);
  elements.scaleRange.value = Math.round(layer.scale * 100);
  elements.rotationRange.value = Math.round(layer.rotation);
  elements.blendModeSelect.value = layer.blendMode || "source-over";
}

function renderPalette(palette) {
  elements.paletteStrip.replaceChildren();
  palette.slice(0, 6).forEach((color) => {
    const swatch = document.createElement("span");
    swatch.style.background = color;
    elements.paletteStrip.append(swatch);
  });
}

function renderRecipe(rows) {
  elements.recipeList.replaceChildren();
  rows.forEach((row) => {
    const pill = document.createElement("div");
    pill.className = "recipe-pill";

    const key = document.createElement("strong");
    key.textContent = row.key;

    const value = document.createElement("span");
    value.textContent = row.value;

    pill.append(key, value);
    elements.recipeList.append(pill);
  });
}

function renderCredits() {
  elements.creditsList.replaceChildren();
  const credits = [];
  const seen = new Set();

  state.images.forEach((layer) => {
    const source = layer.sourceMeta;
    if (!source?.pageUrl || seen.has(source.pageUrl)) return;
    seen.add(source.pageUrl);
    credits.push(source);
  });

  if (!credits.length) {
    const empty = document.createElement("span");
    empty.className = "empty-credit";
    empty.textContent = "No open sources used";
    elements.creditsList.append(empty);
    return;
  }

  credits.slice(0, 8).forEach((source) => {
    const link = document.createElement("a");
    link.className = "credit-link";
    link.href = source.pageUrl;
    link.target = "_blank";
    link.rel = "noreferrer";

    const title = document.createElement("strong");
    title.textContent = source.title || "Source image";

    const meta = document.createElement("span");
    meta.textContent = `${source.license || "Commons"} - ${source.artist || "Wikimedia Commons"}`;

    link.append(title, meta);
    elements.creditsList.append(link);
  });
}

function selectLayer(id) {
  state.selectedId = id || null;
  renderArtwork();
}

function selectedLayer() {
  return state.images.find((layer) => layer.id === state.selectedId) || null;
}

function beginCanvasDrag(event) {
  if (!state.images.length) return;
  const point = getCanvasPoint(event);
  const hit = hitTest(point.x, point.y);
  if (!hit) return;

  state.selectedId = hit.id;
  state.dragging = {
    id: hit.id,
    startX: point.x,
    startY: point.y,
    layerX: hit.x,
    layerY: hit.y
  };
  state.dirtyLayout = true;
  elements.canvas.classList.add("dragging");
  elements.canvas.setPointerCapture?.(event.pointerId);
  renderArtwork();
}

function continueCanvasDrag(event) {
  if (!state.dragging) return;
  const layer = selectedLayer();
  if (!layer) return;

  const point = getCanvasPoint(event);
  layer.x = clamp(state.dragging.layerX + (point.x - state.dragging.startX) / elements.canvas.width, -0.12, 1.12);
  layer.y = clamp(state.dragging.layerY + (point.y - state.dragging.startY) / elements.canvas.height, -0.12, 1.12);
  renderArtwork();
}

function endCanvasDrag() {
  state.dragging = null;
  elements.canvas.classList.remove("dragging");
}

function hitTest(x, y) {
  for (let index = state.images.length - 1; index >= 0; index -= 1) {
    const layer = state.images[index];
    const measure = measureLayer(layer, elements.canvas.width, elements.canvas.height);
    const centerX = layer.x * elements.canvas.width;
    const centerY = layer.y * elements.canvas.height;
    const point = rotatePoint(x - centerX, y - centerY, -degreesToRadians(layer.rotation));

    if (Math.abs(point.x) <= measure.width / 2 && Math.abs(point.y) <= measure.height / 2) {
      return layer;
    }
  }
  return null;
}

function getCanvasPoint(event) {
  const rect = elements.canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (elements.canvas.width / rect.width),
    y: (event.clientY - rect.top) * (elements.canvas.height / rect.height)
  };
}

function setFormat(formatName) {
  state.format = formatName;
  document.querySelectorAll("[data-format]").forEach((button) => {
    const active = button.dataset.format === formatName;
    button.classList.toggle("active", active);
  });
  renderArtwork();
}

async function runBlendReaction() {
  if (!state.images.length) {
    await loadStarterSet();
  }

  elements.blendButton.disabled = true;
  elements.reactionOverlay.classList.add("active");
  elements.reactionOverlay.classList.remove("revealed");
  elements.reactionOverlay.setAttribute("aria-hidden", "false");
  elements.finalPreview.removeAttribute("src");
  elements.reactantOrbit.replaceChildren();
  elements.reactionWords.textContent = "Mixing reactants";
  elements.reactionStatus.textContent = "Reaction running";

  window.requestAnimationFrame(() => createReactionChips());
  timedWords([
    [520, "Extracting palettes"],
    [1120, "Separating texture"],
    [1690, "Balancing composition"],
    [2180, "Synthesizing output"]
  ]);

  await delay(2380);
  renderArtwork();
  elements.finalPreview.src = elements.canvas.toDataURL("image/png");
  elements.reactionOverlay.classList.add("revealed");
  elements.reactionWords.textContent = "Output synthesized";

  await delay(1500);
  elements.reactionOverlay.classList.remove("active", "revealed");
  elements.reactionOverlay.setAttribute("aria-hidden", "true");
  elements.blendButton.disabled = false;
  elements.reactionStatus.textContent = "Output ready";
}

function createReactionChips() {
  const rect = elements.reactionStage.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const starts = [
    [0.09, 0.18],
    [0.78, 0.14],
    [0.12, 0.72],
    [0.82, 0.68],
    [0.44, 0.05],
    [0.46, 0.82]
  ];

  state.images.slice(0, 8).forEach((layer, index) => {
    const chip = document.createElement("div");
    const image = document.createElement("img");
    const [sx, sy] = starts[index % starts.length];
    const startX = sx * rect.width;
    const startY = sy * rect.height;

    chip.className = "reactant-chip";
    chip.style.setProperty("--start-x", `${startX}px`);
    chip.style.setProperty("--start-y", `${startY}px`);
    chip.style.setProperty("--mid-x", `${centerX - startX + (index % 2 ? -90 : 90)}px`);
    chip.style.setProperty("--mid-y", `${centerY - startY - 90 + index * 8}px`);
    chip.style.setProperty("--end-x", `${centerX - startX}px`);
    chip.style.setProperty("--end-y", `${centerY - startY}px`);
    chip.style.setProperty("--rot", `${index % 2 ? -18 : 18}deg`);
    chip.style.setProperty("--delay", `${index * 130}ms`);
    image.src = layer.src;
    image.alt = "";
    chip.append(image);
    elements.reactantOrbit.append(chip);
  });
}

function timedWords(items) {
  items.forEach(([time, words]) => {
    window.setTimeout(() => {
      if (elements.reactionOverlay.classList.contains("active")) {
        elements.reactionWords.textContent = words;
      }
    }, time);
  });
}

function downloadArtwork() {
  renderArtwork();
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.download = `variation-of-creation-${stamp}.png`;
  link.href = elements.canvas.toDataURL("image/png");
  link.click();
}

function defaultBlend(index) {
  const blends = artProfiles[state.artType].blends;
  return blends[index % blends.length];
}

function syncActiveButtons(selector, value, datasetKey) {
  document.querySelectorAll(selector).forEach((button) => {
    const active = button.dataset[datasetKey] === value;
    button.classList.toggle("active", active);
    if (button.getAttribute("role") === "radio") {
      button.setAttribute("aria-checked", active ? "true" : "false");
    }
  });
}

function drawGrain(width, height, alpha) {
  const amount = Math.round(Math.min(width * height / 260, 9000));
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  for (let i = 0; i < amount; i += 1) {
    const tone = i % 2 ? 255 : 20;
    ctx.globalAlpha = alpha * (0.25 + (i % 5) / 10);
    ctx.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
    ctx.fillRect((i * 97) % width, (i * 193) % height, 1.3, 1.3);
  }
  ctx.restore();
}

function drawTattooLinework(width, height, palette, vibe) {
  const minDim = Math.min(width, height);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = mixHex("#141414", vibe.line, 0.18);
  ctx.lineWidth = Math.max(3, minDim * 0.004);
  ctx.globalAlpha = 0.34;

  for (let i = 0; i < 9; i += 1) {
    const startX = width * (0.14 + (i % 3) * 0.18);
    const startY = height * (0.18 + i * 0.07);
    const endX = width * (0.86 - (i % 2) * 0.16);
    const endY = height * (0.25 + ((i * 13) % 58) / 100);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(width * 0.36, height * (0.08 + i * 0.045), width * 0.62, height * (0.92 - i * 0.035), endX, endY);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.2;
  ctx.fillStyle = palette[0] || "#141414";
  for (let i = 0; i < 120; i += 1) {
    const x = width * (((i * 37 + 11) % 100) / 100);
    const y = height * (((i * 61 + 23) % 100) / 100);
    const radius = 1.8 + (i % 4) * 0.7;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function mixHex(first, second, amount) {
  const a = hexToRgb(first);
  const b = hexToRgb(second);
  return rgbToHex(
    Math.round(a.r + (b.r - a.r) * amount),
    Math.round(a.g + (b.g - a.g) * amount),
    Math.round(a.b + (b.b - a.b) * amount)
  );
}

function colorDistance(first, second) {
  const a = hexToRgb(first);
  const b = hexToRgb(second);
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean.padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((channel) => clamp(channel, 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function readableValue(value) {
  return value.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function cleanText(value) {
  const element = document.createElement("textarea");
  element.innerHTML = String(value || "").replace(/<[^>]*>/g, " ");
  return element.value.replace(/\s+/g, " ").trim();
}

function rotatePoint(x, y, angle) {
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  };
}

function makeId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `image-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function maxChannel(r, g, b) {
  return Math.max(r, g, b);
}

function minChannel(r, g, b) {
  return Math.min(r, g, b);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

initialize();
