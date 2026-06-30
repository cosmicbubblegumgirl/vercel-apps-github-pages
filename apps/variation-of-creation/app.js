if (!document.querySelector("#artCanvas")) {
  initializeStaticPageShell();
} else {
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
  promptSparkGrid: document.querySelector("#promptSparkGrid"),
  mutationRange: document.querySelector("#mutationRange"),
  detailRange: document.querySelector("#detailRange"),
  autoBriefButton: document.querySelector("#autoBriefButton"),
  variationButton: document.querySelector("#variationButton"),
  compositionGroup: document.querySelector("#compositionGroup"),
  harmonyGroup: document.querySelector("#harmonyGroup"),
  finishGroup: document.querySelector("#finishGroup"),
  variationDeck: document.querySelector("#variationDeck"),
  paletteStrip: document.querySelector("#paletteStrip"),
  dnaList: document.querySelector("#dnaList"),
  recipeList: document.querySelector("#recipeList"),
  creditsList: document.querySelector("#creditsList"),
  loadSourcesButton: document.querySelector("#loadSourcesButton"),
  loadAllSourcesButton: document.querySelector("#loadAllSourcesButton"),
  addSourceBatchButton: document.querySelector("#addSourceBatchButton"),
  addSelectedSourcesButton: document.querySelector("#addSelectedSourcesButton"),
  clearSourceSelectionButton: document.querySelector("#clearSourceSelectionButton"),
  selectedSourceCount: document.querySelector("#selectedSourceCount"),
  showMoreSourcesButton: document.querySelector("#showMoreSourcesButton"),
  sourceLibraryGrid: document.querySelector("#sourceLibraryGrid"),
  sourceLibraryStatus: document.querySelector("#sourceLibraryStatus"),
  sourceSearchInput: document.querySelector("#sourceSearchInput"),
  sourceSortSelect: document.querySelector("#sourceSortSelect"),
  sourceGalleryCount: document.querySelector("#sourceGalleryCount"),
  sourcePreviewDialog: document.querySelector("#sourcePreviewDialog"),
  sourcePreviewClose: document.querySelector("#sourcePreviewClose"),
  sourcePreviewImage: document.querySelector("#sourcePreviewImage"),
  sourcePreviewTitle: document.querySelector("#sourcePreviewTitle"),
  sourcePreviewMeta: document.querySelector("#sourcePreviewMeta"),
  sourcePreviewSelectButton: document.querySelector("#sourcePreviewSelectButton"),
  sourcePreviewAddButton: document.querySelector("#sourcePreviewAddButton"),
  aiAssistToggle: document.querySelector("#aiAssistToggle"),
  tattooAdvisorList: document.querySelector("#tattooAdvisorList"),
  aiScore: document.querySelector("#aiScore"),
  reactionOverlay: document.querySelector("#reactionOverlay"),
  reactionStage: document.querySelector(".reaction-stage"),
  reactantOrbit: document.querySelector("#reactantOrbit"),
  finalPreview: document.querySelector("#finalPreview"),
  reactionWords: document.querySelector("#reactionWords"),
  tattooPlacement: document.querySelector("#tattooPlacement"),
  stencilStrengthRange: document.querySelector("#stencilStrengthRange")
};

const ctx = elements.canvas.getContext("2d", { willReadFrequently: true });
const emptyPreviewSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const studioMode = document.body?.dataset.studio || "blend";
const isTattooStudio = studioMode === "tattoo";

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
    blends: ["source-over", "source-over", "multiply", "source-over"],
    clip: "tattoo",
    opacity: 0.94,
    filter: "grayscale(.72) contrast(1.58) saturate(0.68)"
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

const effectProfiles = {
  clean: {
    label: "Clean",
    note: "balanced studio finish",
    score: 0
  },
  bloom: {
    label: "Bloom",
    note: "soft glow and luminous edges",
    score: 5
  },
  glyphs: {
    label: "Glyphs",
    note: "symbolic marks and hand-built detail",
    score: 7
  },
  prism: {
    label: "Prism",
    note: "fractured color bands and energy",
    score: 6
  },
  blueprint: {
    label: "Blueprint",
    note: "layout guides and concept-board structure",
    score: 6
  }
};

const compositionProfiles = {
  orbit: { label: "Orbit", score: 0 },
  hero: { label: "Hero", score: 4 },
  mosaic: { label: "Mosaic", score: 5 },
  cascade: { label: "Cascade", score: 4 },
  triptych: { label: "Triptych", score: 5 }
};

const harmonyProfiles = {
  source: { label: "Source", score: 0 },
  analog: { label: "Analog", score: 3 },
  complement: { label: "Complement", score: 4 },
  heat: { label: "Heat", score: 3 },
  "mono-ink": { label: "Mono ink", score: 4 }
};

const finishProfiles = {
  matte: { label: "Matte", score: 0 },
  gloss: { label: "Gloss", score: 3 },
  riso: { label: "Riso", score: 5 },
  cutline: { label: "Cutline", score: 4 },
  tape: { label: "Tape", score: 4 }
};

const tattooPlacementProfiles = {
  forearm: { label: "Forearm", shape: "limb", x: 0.5, y: 0.52, w: 0.34, h: 0.84, angle: -5 },
  "upper-arm": { label: "Upper arm", shape: "limb", x: 0.5, y: 0.52, w: 0.42, h: 0.76, angle: 7 },
  shoulder: { label: "Shoulder", shape: "circle", x: 0.5, y: 0.45, w: 0.62, h: 0.62, angle: 0 },
  back: { label: "Back", shape: "panel", x: 0.5, y: 0.53, w: 0.68, h: 0.78, angle: 0 },
  sternum: { label: "Sternum", shape: "sternum", x: 0.5, y: 0.52, w: 0.54, h: 0.72, angle: 0 },
  thigh: { label: "Thigh", shape: "limb", x: 0.5, y: 0.54, w: 0.46, h: 0.82, angle: 4 },
  ankle: { label: "Ankle", shape: "band", x: 0.5, y: 0.54, w: 0.7, h: 0.42, angle: -3 }
};

const tattooNeedleProfiles = {
  "fine-line": { label: "Fine line", line: 0.72, alpha: 0.86, dotwork: 0.34, fill: 0.08, wash: 0.02, score: 4 },
  traditional: { label: "Traditional", line: 1.36, alpha: 0.95, dotwork: 0.16, fill: 0.2, wash: 0.04, score: 5 },
  dotwork: { label: "Dotwork", line: 0.82, alpha: 0.78, dotwork: 0.95, fill: 0.06, wash: 0.02, score: 5 },
  blackwork: { label: "Blackwork", line: 1.22, alpha: 0.98, dotwork: 0.28, fill: 0.38, wash: 0.01, score: 6 },
  watercolor: { label: "Watercolor wash", line: 0.9, alpha: 0.74, dotwork: 0.22, fill: 0.06, wash: 0.36, score: 4 }
};

const skinToneProfiles = {
  paper: { label: "Stencil paper", color: "#f7f4ed", grain: "#cdbf9d", ink: "#141414" },
  light: { label: "Light skin", color: "#f2c5aa", grain: "#b97e62", ink: "#17110f" },
  tan: { label: "Tan skin", color: "#c99063", grain: "#81553c", ink: "#120f0e" },
  deep: { label: "Deep skin", color: "#5f392f", grain: "#c08b6a", ink: "#090807" }
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

const promptSparkBank = {
  "mixed-media": ["torn paper edges", "painted texture stack", "found-object silhouette"],
  watercolor: ["loose pigment blooms", "soft edge wash", "transparent botanical layers"],
  "surreal-collage": ["floating dream scale", "impossible horizon", "symbolic cutout scene"],
  "ink-poster": ["bold ink blocks", "screenprint shadow", "high-contrast line rhythm"],
  tattoo: ["flash sheet balance", "clean needle linework", "ornamental skin flow", "body-flow negative space", "stencil-ready contrast"],
  "album-cover": ["record-store drama", "centerpiece title space", "stage-light atmosphere"],
  "character-concept": ["turnaround silhouette", "costume texture notes", "expressive pose study"],
  whimsical: ["playful asymmetry", "storybook sparks", "bright little surprises"],
  cinematic: ["deep contrast lighting", "wide-frame drama", "film-still atmosphere"],
  cozy: ["warm handmade softness", "quiet tactile details", "gentle morning color"],
  electric: ["neon motion trails", "charged contrast", "sharp kinetic rhythm"],
  botanical: ["leaf-vein patterns", "organic curling forms", "pressed flower detail"],
  editorial: ["magazine-ready negative space", "clean graphic hierarchy", "confident art direction"]
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
    "tattoo",
    "tattoos",
    "tattoo art",
    "tattoo flash",
    "tattoo flash drawing",
    "tattoo flash sheet",
    "tattoo line art",
    "tattoo design sketch",
    "tattoo design",
    "traditional tattoo drawing",
    "traditional tattoo",
    "old school tattoo",
    "fine line tattoo sketch",
    "fine line tattoo",
    "ornamental tattoo line art",
    "ornamental tattoo",
    "botanical tattoo drawing",
    "botanical tattoo",
    "blackwork tattoo flash",
    "blackwork tattoo",
    "irezumi tattoo",
    "tattoo stencil",
    "tattooing"
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

const defaultSourceLibraryLimit = 90;
const tattooStudioSourceLimit = 600;
const tattooGalleryPageSize = 60;
const sourceCacheKey = "variationCreation.openSourceLibrary.v1";
const commonsApi = "https://commons.wikimedia.org/w/api.php";

const state = {
  images: [],
  selectedId: null,
  artType: isTattooStudio ? "tattoo" : "mixed-media",
  vibe: isTattooStudio ? "botanical" : "whimsical",
  format: isTattooStudio ? "portrait" : "square",
  outputIntent: isTattooStudio ? "tattoo-flash" : "finished-artwork",
  prompt: "",
  effect: "clean",
  mutation: isTattooStudio ? 42 : 55,
  detail: isTattooStudio ? 78 : 62,
  composition: isTattooStudio ? "hero" : "orbit",
  harmony: isTattooStudio ? "mono-ink" : "source",
  finish: isTattooStudio ? "cutline" : "matte",
  tattooPlacement: "forearm",
  needleStyle: "fine-line",
  skinTone: "paper",
  stencilStrength: isTattooStudio ? 74 : 45,
  seed: 0.42,
  dirtyLayout: false,
  dragging: null,
  lastRecipe: null,
  variationCards: [],
  activeVariationId: null,
  sourceLibrary: readSourceCache(),
  sourceLoading: false,
  sourceSearch: "",
  sourceFilter: "all",
  sourceSort: "curated",
  sourceVisibleCount: isTattooStudio ? tattooGalleryPageSize : defaultSourceLibraryLimit,
  selectedSourceIds: new Set(),
  previewSourceId: "",
  aiAssist: isTattooStudio
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

  compose(options = {}) {
    const format = formats[state.format];
    elements.canvas.width = format.width;
    elements.canvas.height = format.height;

    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const palette = collectPalette();
    const art = artProfiles[state.artType];
    const vibe = vibeProfiles[state.vibe];

    drawBackground(width, height, palette, vibe);
    if (isTattooStudio) {
      drawTattooPlacementGuide(width, height, palette, vibe);
    }
    drawCompositionScaffold(width, height, palette, vibe);

    const drawableLayers = isTattooStudio ? tattooDrawableLayers() : state.images;
    drawableLayers.forEach((layer, index) => {
      drawLayer(layer, index, width, height, art, vibe, palette);
    });

    if (isTattooStudio) {
      drawTattooSeamlessPass(width, height, palette, vibe, drawableLayers);
    }

    drawSynthesisDetails(width, height, palette, art, vibe);
    drawCreativeEffect(width, height, palette, art, vibe);
    drawIntentTreatment(width, height, palette, state.outputIntent);
    drawFinishPass(width, height, palette, art, vibe);
    if (isTattooStudio) {
      drawTattooFinalInkPass(width, height, palette, vibe, drawableLayers);
    }
    if (options.showSelection !== false) {
      drawSelection(width, height);
    }

    const recipe = buildRecipe(palette);
    state.lastRecipe = recipe;
    return recipe;
  }
};

function initialize() {
  bindEvents();
  if (isTattooStudio && elements.textPrompt && !elements.textPrompt.value) {
    elements.textPrompt.placeholder = "fine-line botanical flash, ornamental flow, clean stencil-ready negative space";
  }
  syncStudioControls();
  setFormat(state.format);
  updateInspector();
  renderPromptSparks();
  renderVariationDeck();
  if (isTattooStudio) {
    ensureTattooSampleLibrary();
  }
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
      renderPromptSparks();
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
      renderPromptSparks();
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-effect]").forEach((button) => {
    button.addEventListener("click", () => {
      state.effect = button.dataset.effect;
      state.activeVariationId = null;
      syncActiveButtons("[data-effect]", state.effect, "effect");
      renderVariationDeck();
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-composition]").forEach((button) => {
    button.addEventListener("click", () => {
      state.composition = button.dataset.composition;
      state.activeVariationId = null;
      state.dirtyLayout = false;
      syncActiveButtons("[data-composition]", state.composition, "composition");
      layoutLayers(true);
      renderVariationDeck();
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-harmony]").forEach((button) => {
    button.addEventListener("click", () => {
      state.harmony = button.dataset.harmony;
      state.activeVariationId = null;
      syncActiveButtons("[data-harmony]", state.harmony, "harmony");
      renderVariationDeck();
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-finish]").forEach((button) => {
    button.addEventListener("click", () => {
      state.finish = button.dataset.finish;
      state.activeVariationId = null;
      syncActiveButtons("[data-finish]", state.finish, "finish");
      renderVariationDeck();
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-needle-style]").forEach((button) => {
    button.addEventListener("click", () => {
      state.needleStyle = button.dataset.needleStyle;
      state.artType = "tattoo";
      state.activeVariationId = null;
      syncTattooControls();
      renderVariationDeck();
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-skin-tone]").forEach((button) => {
    button.addEventListener("click", () => {
      state.skinTone = button.dataset.skinTone;
      state.activeVariationId = null;
      syncTattooControls();
      renderArtwork();
    });
  });

  document.querySelectorAll("[data-format]").forEach((button) => {
    button.addEventListener("click", () => setFormat(button.dataset.format));
  });

  if (elements.tattooPlacement) {
    elements.tattooPlacement.addEventListener("change", () => {
      state.tattooPlacement = elements.tattooPlacement.value;
      state.activeVariationId = null;
      layoutLayers(true);
      renderVariationDeck();
      renderArtwork();
    });
  }

  if (elements.stencilStrengthRange) {
    elements.stencilStrengthRange.addEventListener("input", () => {
      state.stencilStrength = Number(elements.stencilStrengthRange.value);
      state.activeVariationId = null;
      renderVariationDeck();
      renderArtwork();
    });
  }

  if (elements.sourceSearchInput) {
    elements.sourceSearchInput.addEventListener("input", () => {
      state.sourceSearch = elements.sourceSearchInput.value.trim().toLowerCase();
      resetSourceVisibleCount();
      renderSourceLibrary();
    });
  }

  if (elements.sourceSortSelect) {
    elements.sourceSortSelect.addEventListener("change", () => {
      state.sourceSort = elements.sourceSortSelect.value;
      resetSourceVisibleCount();
      renderSourceLibrary();
    });
  }

  document.querySelectorAll("[data-source-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sourceFilter = button.dataset.sourceFilter;
      resetSourceVisibleCount();
      syncSourceGalleryControls();
      renderSourceLibrary();
    });
  });

  if (elements.showMoreSourcesButton) {
    elements.showMoreSourcesButton.addEventListener("click", () => {
      increaseSourceVisibleCount();
      renderSourceLibrary();
    });
  }

  if (elements.addSelectedSourcesButton) {
    elements.addSelectedSourcesButton.addEventListener("click", addSelectedSourcesToCanvas);
  }

  if (elements.clearSourceSelectionButton) {
    elements.clearSourceSelectionButton.addEventListener("click", () => {
      state.selectedSourceIds.clear();
      state.previewSourceId = "";
      syncSourceSelectionControls();
      renderSourceLibrary();
    });
  }

  if (elements.sourceLibraryGrid) {
    elements.sourceLibraryGrid.addEventListener("scroll", () => {
      const distanceToEnd = elements.sourceLibraryGrid.scrollHeight - elements.sourceLibraryGrid.scrollTop - elements.sourceLibraryGrid.clientHeight;
      if (distanceToEnd < 180 && increaseSourceVisibleCount()) {
        renderSourceLibrary();
      }
    });
  }

  if (elements.sourcePreviewClose) {
    elements.sourcePreviewClose.addEventListener("click", closeSourcePreview);
  }

  if (elements.sourcePreviewDialog) {
    elements.sourcePreviewDialog.addEventListener("click", (event) => {
      if (event.target === elements.sourcePreviewDialog) closeSourcePreview();
    });
  }

  if (elements.sourcePreviewSelectButton) {
    elements.sourcePreviewSelectButton.addEventListener("click", () => {
      const item = findSourceItemByKey(state.previewSourceId);
      if (item) toggleSourceSelection(item);
      renderSourcePreview();
    });
  }

  if (elements.sourcePreviewAddButton) {
    elements.sourcePreviewAddButton.addEventListener("click", async () => {
      const item = findSourceItemByKey(state.previewSourceId);
      if (!item) return;
      await addSourceToCanvas(item);
      closeSourcePreview();
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSourcePreview();
  });

  if (elements.aiAssistToggle) {
    elements.aiAssistToggle.addEventListener("click", () => {
      state.aiAssist = !state.aiAssist;
      syncTattooControls();
      renderTattooAdvisor();
      renderArtwork();
    });
  }

  elements.outputIntent.addEventListener("change", () => {
    state.outputIntent = elements.outputIntent.value;
    renderArtwork();
  });

  elements.textPrompt.addEventListener("input", () => {
    state.prompt = elements.textPrompt.value.trim();
    renderArtwork();
  });

  elements.mutationRange.addEventListener("input", () => {
    state.mutation = Number(elements.mutationRange.value);
    state.activeVariationId = null;
    renderVariationDeck();
    renderArtwork();
  });

  elements.detailRange.addEventListener("input", () => {
    state.detail = Number(elements.detailRange.value);
    state.activeVariationId = null;
    renderVariationDeck();
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
  elements.autoBriefButton.addEventListener("click", generateCreativeBrief);
  elements.variationButton.addEventListener("click", createVariationDeck);
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

  const tattooStarters = [0, 5, 6, 11].map((index) => {
    const sample = createTattooSampleSource(index);
    return { src: sourceImageUrl(sample), name: sample.title, sourceMeta: sample };
  });

  const blendStarters = [
    createStarterImage("botanical", "botanical sketch"),
    createStarterImage("portrait", "portrait color study"),
    createStarterImage("texture", "paper texture"),
    createStarterImage("light", "light fragment")
  ];

  for (const starter of isTattooStudio ? tattooStarters : blendStarters) {
    await addImageSource(starter.src, starter.name, starter.sourceMeta || null);
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

  if (kind === "tattoo-flash") {
    starterCtx.fillStyle = "#f7f4ed";
    starterCtx.fillRect(0, 0, 980, 980);
    starterCtx.strokeStyle = "#141414";
    starterCtx.lineCap = "round";
    starterCtx.lineJoin = "round";
    starterCtx.lineWidth = 12;
    for (let i = 0; i < 7; i += 1) {
      starterCtx.beginPath();
      starterCtx.moveTo(180 + i * 95, 780);
      starterCtx.bezierCurveTo(120 + i * 70, 560, 270 + i * 64, 390, 220 + i * 86, 190);
      starterCtx.stroke();
      starterCtx.beginPath();
      starterCtx.ellipse(235 + i * 82, 390 + (i % 2) * 58, 48, 86, -0.45, 0, Math.PI * 2);
      starterCtx.stroke();
    }
    starterCtx.lineWidth = 8;
    starterCtx.beginPath();
    starterCtx.arc(500, 500, 220, 0.25, Math.PI * 1.72);
    starterCtx.stroke();
  }

  if (kind === "tattoo-ornament") {
    starterCtx.fillStyle = "#fbf7ec";
    starterCtx.fillRect(0, 0, 980, 980);
    starterCtx.strokeStyle = "#171717";
    starterCtx.lineCap = "round";
    starterCtx.lineJoin = "round";
    starterCtx.lineWidth = 10;
    for (let i = 0; i < 10; i += 1) {
      const y = 170 + i * 70;
      starterCtx.beginPath();
      starterCtx.moveTo(210, y);
      starterCtx.bezierCurveTo(330, y - 80, 470, y + 80, 610, y);
      starterCtx.bezierCurveTo(700, y - 50, 780, y + 20, 810, y + 74);
      starterCtx.stroke();
    }
    starterCtx.lineWidth = 5;
    starterCtx.fillStyle = "#171717";
    for (let i = 0; i < 90; i += 1) {
      starterCtx.beginPath();
      starterCtx.arc(180 + ((i * 67) % 640), 140 + ((i * 43) % 720), 3 + (i % 3), 0, Math.PI * 2);
      starterCtx.fill();
    }
  }

  if (kind === "tattoo-botanical") {
    starterCtx.fillStyle = "#f4efe2";
    starterCtx.fillRect(0, 0, 980, 980);
    starterCtx.strokeStyle = "#101010";
    starterCtx.lineCap = "round";
    starterCtx.lineJoin = "round";
    starterCtx.lineWidth = 9;
    for (let i = 0; i < 12; i += 1) {
      const x = 190 + i * 54;
      starterCtx.beginPath();
      starterCtx.moveTo(x, 830);
      starterCtx.bezierCurveTo(x - 60, 630, x + 92, 470, x + 24, 180);
      starterCtx.stroke();
      starterCtx.beginPath();
      starterCtx.ellipse(x + 30, 420 + (i % 5) * 34, 36, 74, -0.7, 0, Math.PI * 2);
      starterCtx.stroke();
    }
  }

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

function ensureTattooSampleLibrary() {
  const limit = sourceLimitFor("tattoo");
  const existing = state.sourceLibrary.tattoo || [];
  const localSamples = fillTattooSampleSources([], limit);
  const openSources = existing.filter((item) => !item.localSample);
  const merged = [...localSamples, ...openSources];
  const seen = new Set();
  state.sourceLibrary.tattoo = merged.filter((item) => {
    const key = item.id || item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

function fillTattooSampleSources(existing, limit) {
  const filled = [...existing];
  const seen = new Set(existing.map((item) => item.id || item.url));
  let index = 0;

  while (filled.length < limit && index < limit * 2) {
    const sample = createTattooSampleSource(index);
    const key = sample.id || sample.url;
    if (!seen.has(key)) {
      seen.add(key);
      filled.push(sample);
    }
    index += 1;
  }

  return filled.slice(0, limit);
}

function createTattooSampleSource(index) {
  const motifs = ["botanical", "celestial", "mythic", "geometric", "wave", "ornamental"];
  const placements = ["forearm", "upper arm", "shoulder", "back", "sternum", "thigh", "ankle"];
  const flows = ["vertical", "crescent", "band", "crest", "spiral", "cascade"];
  const adjectives = ["Moon", "Velvet", "Neon", "Quiet", "Chrome", "Wild", "Solar", "Ink", "Ghost", "Petal"];
  const nouns = ["Vine", "Orbit", "Oath", "Bloom", "Crest", "Tide", "Signal", "Ritual", "Needle", "Charm"];
  const motif = motifs[index % motifs.length];
  const placement = placements[Math.floor(index / motifs.length) % placements.length];
  const flow = flows[Math.floor(index / (motifs.length * placements.length)) % flows.length];
  const title = `${adjectives[index % adjectives.length]} ${nouns[(index * 3) % nouns.length]} ${String(index + 1).padStart(3, "0")}`;

  return {
    id: `local-tattoo-sample-${String(index + 1).padStart(3, "0")}`,
    title,
    artist: "Variation of Creation Studio",
    license: "Original free-to-use procedural tattoo sketch",
    licenseUrl: "./tattoos.html",
    pageUrl: "./tattoos.html",
    url: "",
    thumb: "",
    artType: "tattoo",
    localSample: true,
    sampleIndex: index,
    motif,
    flow,
    tags: `tattoo,${motif},${placement},${flow}`
  };
}

function createTattooSampleSvg(index, motif, flow) {
  const colors = ["#141414", "#176f65", "#b84c3e", "#713e58", "#b9892d", "#3868a7"];
  const accent = colors[(index % (colors.length - 1)) + 1];
  const paper = index % 4 === 0 ? "#f7f4ed" : index % 4 === 1 ? "#f2eadb" : index % 4 === 2 ? "#efe4d2" : "#fbf7ec";
  const rotate = -8 + (index % 9) * 2;
  const stroke = index % 5 === 0 ? 7 : index % 3 === 0 ? 5 : 4;
  const dots = Array.from({ length: 18 }, (_, dot) => {
    const x = 54 + ((dot * 47 + index * 13) % 252);
    const y = 48 + ((dot * 31 + index * 19) % 264);
    const r = 1.8 + (dot % 3) * 0.8;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#141414" opacity=".42"/>`;
  }).join("");
  const flowPath = flow === "band"
    ? "M42 182 C98 134 143 222 196 178 S288 154 318 208"
    : flow === "crescent"
      ? "M250 62 C132 82 83 184 135 286"
      : flow === "spiral"
        ? "M180 68 C282 86 284 250 178 264 C92 276 71 154 158 137 C218 126 238 196 184 211"
        : "M178 44 C142 104 220 146 178 204 C139 256 190 285 158 326";
  const motifMarkup = {
    botanical: `
      <path d="M180 316 C158 238 204 188 178 112 C170 88 170 67 188 45" fill="none" stroke="#141414" stroke-width="${stroke}" stroke-linecap="round"/>
      ${Array.from({ length: 8 }, (_, leaf) => {
        const y = 88 + leaf * 27;
        const side = leaf % 2 ? -1 : 1;
        return `<path d="M180 ${y} C${180 + side * 38} ${y - 34} ${180 + side * 68} ${y - 2} ${180 + side * 28} ${y + 24}" fill="none" stroke="#141414" stroke-width="3.5" stroke-linecap="round"/>`;
      }).join("")}
      <path d="${flowPath}" fill="none" stroke="${accent}" stroke-width="2.5" opacity=".55"/>`,
    celestial: `
      <path d="${flowPath}" fill="none" stroke="#141414" stroke-width="${stroke}" stroke-linecap="round"/>
      <circle cx="180" cy="168" r="58" fill="none" stroke="#141414" stroke-width="4"/>
      <path d="M203 112 C164 132 155 194 199 224 C141 220 111 146 153 103 C170 88 188 87 203 112Z" fill="none" stroke="${accent}" stroke-width="4"/>
      ${Array.from({ length: 7 }, (_, star) => `<path d="M${74 + star * 35} ${76 + (star % 3) * 72} l6 13 l14 2 l-10 10 l2 14 l-12 -7 l-12 7 l2 -14 l-10 -10 l14 -2Z" fill="none" stroke="#141414" stroke-width="2.2"/>`).join("")}`,
    mythic: `
      <path d="M180 54 C236 90 266 148 256 220 C247 278 210 310 180 326 C150 310 113 278 104 220 C94 148 124 90 180 54Z" fill="none" stroke="#141414" stroke-width="${stroke}"/>
      <path d="M180 92 C143 128 133 178 156 224 C164 240 172 254 180 276 C188 254 196 240 204 224 C227 178 217 128 180 92Z" fill="none" stroke="${accent}" stroke-width="4"/>
      <path d="M110 158 C62 180 55 235 88 272 M250 158 C298 180 305 235 272 272" fill="none" stroke="#141414" stroke-width="3.5" stroke-linecap="round"/>`,
    geometric: `
      <path d="M180 48 L276 126 L248 274 L180 326 L112 274 L84 126Z" fill="none" stroke="#141414" stroke-width="${stroke}"/>
      <path d="M180 48 L180 326 M84 126 L248 274 M276 126 L112 274" fill="none" stroke="#141414" stroke-width="2.5" opacity=".6"/>
      <path d="M180 92 L228 182 L180 272 L132 182Z" fill="none" stroke="${accent}" stroke-width="4"/>
      <circle cx="180" cy="182" r="34" fill="none" stroke="#141414" stroke-width="3"/>`,
    wave: `
      ${Array.from({ length: 8 }, (_, wave) => {
        const y = 82 + wave * 28;
        return `<path d="M56 ${y} C104 ${y - 46} 142 ${y + 46} 190 ${y} S274 ${y - 46} 314 ${y}" fill="none" stroke="${wave % 2 ? "#141414" : accent}" stroke-width="${wave % 2 ? 4 : 3}" stroke-linecap="round" opacity="${wave % 2 ? ".9" : ".62"}"/>`;
      }).join("")}
      <path d="M180 54 C215 118 215 242 180 306 C145 242 145 118 180 54Z" fill="none" stroke="#141414" stroke-width="3"/>`,
    ornamental: `
      <path d="${flowPath}" fill="none" stroke="#141414" stroke-width="${stroke}" stroke-linecap="round"/>
      <path d="M180 70 C210 112 210 156 180 190 C150 156 150 112 180 70Z M180 190 C220 218 222 278 180 318 C138 278 140 218 180 190Z" fill="none" stroke="#141414" stroke-width="4"/>
      <path d="M104 134 C148 126 150 180 180 190 C210 180 212 126 256 134 M104 246 C146 238 150 202 180 190 C210 202 214 238 256 246" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>`
  }[motif];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" role="img" aria-label="${escapeSvgText(motif)} tattoo sample">
    <rect width="360" height="360" rx="18" fill="${paper}" opacity=".08"/>
    <g transform="rotate(${rotate} 180 180)">
      ${motifMarkup}
      ${dots}
    </g>
    <rect x="22" y="22" width="316" height="316" rx="12" fill="none" stroke="#141414" stroke-width="2" opacity=".08"/>
  </svg>`;
}

async function loadSourcesForArtType(artType = state.artType) {
  if (state.sourceLoading) return;
  const existing = state.sourceLibrary[artType] || [];
  const limit = sourceLimitFor(artType);
  if (existing.length >= limit) {
    renderSourceLibrary();
    return;
  }

  state.sourceLoading = true;
  renderSourceLibrary(`Loading ${limit} ${artProfiles[artType].label.toLowerCase()} sources`);
  try {
    state.sourceLibrary[artType] = await fetchCommonsForArtType(artType, limit);
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
  const artTypes = isTattooStudio ? ["tattoo"] : Object.keys(artProfiles);

  try {
    for (const artType of artTypes) {
      const existing = state.sourceLibrary[artType] || [];
      const limit = sourceLimitFor(artType);
      if (existing.length < limit) {
        renderSourceLibrary(`Loading ${limit} ${artProfiles[artType].label.toLowerCase()} sources`);
        state.sourceLibrary[artType] = await fetchCommonsForArtType(artType, limit);
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

function sourceLimitFor(artType = state.artType) {
  return isTattooStudio && artType === "tattoo" ? tattooStudioSourceLimit : defaultSourceLibraryLimit;
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
      let page;
      try {
        page = await fetchCommonsQuery(query, continuation);
      } catch (error) {
        await delay(1000);
        break;
      }
      page.items.forEach((item) => {
        const key = item.id || item.url;
        if (!seen.has(key) && collected.length < limit) {
          seen.add(key);
          collected.push({ ...item, artType });
        }
      });

      if (!page.continuation) break;
      continuation = page.continuation;
      if (limit > defaultSourceLibraryLimit) {
        await delay(260);
      }
    }

    if (collected.length >= limit) break;
    if (limit > defaultSourceLibraryLimit) {
      await delay(320);
    }
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

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`${commonsApi}?${params.toString()}`);
    if (response.status === 429 || response.status >= 500) {
      await delay(900 + attempt * 1100);
      continue;
    }
    if (!response.ok) throw new Error("Commons request failed");

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    return {
      items: pages.map(normalizeCommonsItem).filter(Boolean),
      continuation: data.continue || null
    };
  }

  throw new Error("Commons request failed");
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
  const allItems = state.sourceLibrary[state.artType] || [];
  const items = visibleSourceItems(allItems);
  const label = artProfiles[state.artType].label;
  const limit = sourceLimitFor(state.artType);
  const renderedItems = items.slice(0, Math.min(state.sourceVisibleCount, items.length, limit));
  elements.sourceLibraryGrid.replaceChildren();
  elements.sourceLibraryStatus.textContent = message || `${allItems.length}/${limit} ${label}`;
  syncSourceSelectionControls();
  if (elements.sourceGalleryCount) {
    elements.sourceGalleryCount.textContent = `Showing ${renderedItems.length} of ${items.length} ideas`;
  }
  elements.loadSourcesButton.disabled = state.sourceLoading;
  elements.loadAllSourcesButton.disabled = state.sourceLoading;
  elements.addSourceBatchButton.disabled = state.sourceLoading || !allItems.length;
  if (elements.showMoreSourcesButton) {
    elements.showMoreSourcesButton.disabled = state.sourceLoading || renderedItems.length >= items.length;
  }

  renderedItems.forEach((item) => {
    const key = sourceItemKey(item);
    const isSelected = state.selectedSourceIds.has(key);
    const card = document.createElement("div");
    card.className = "source-card";
    card.dataset.sourceKey = key;
    card.classList.toggle("selected", isSelected);
    if (item.localSample) card.classList.add("local-sample");

    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "source-select-button";
    selectButton.setAttribute("aria-pressed", isSelected ? "true" : "false");
    selectButton.setAttribute("aria-label", `${isSelected ? "Remove" : "Select"} ${item.title || "reference idea"}`);
    selectButton.title = isSelected ? "Remove from selection" : "Select idea";
    selectButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>`;
    selectButton.addEventListener("click", () => toggleSourceSelection(item));

    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "source-thumb";
    thumb.setAttribute("aria-label", `Preview ${item.title || "reference idea"}`);
    thumb.addEventListener("click", () => openSourcePreview(item));
    const image = document.createElement("img");
    image.src = sourceImageUrl(item);
    image.alt = item.title;
    image.loading = "lazy";
    thumb.append(image);

    const link = document.createElement("a");
    link.href = item.pageUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.title = `${item.license} source`;
    link.textContent = "i";

    const body = document.createElement("div");
    body.className = "source-card-body";
    const title = document.createElement("strong");
    title.textContent = item.title || "Tattoo reference";
    const meta = document.createElement("span");
    meta.textContent = sourceMetaLine(item);
    body.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "source-card-actions";

    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "source-card-action";
    previewButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.6"/></svg><span>Preview</span>`;
    previewButton.addEventListener("click", () => openSourcePreview(item));

    const useButton = document.createElement("button");
    useButton.type = "button";
    useButton.className = "source-card-action primary";
    useButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg><span>Use</span>`;
    useButton.addEventListener("click", () => addSourceToCanvas(item));
    actions.append(previewButton, useButton);

    card.append(selectButton, thumb, link, body, actions);
    elements.sourceLibraryGrid.append(card);
  });
}

function sourceItemKey(item) {
  return String(item?.id || item?.url || item?.thumb || item?.title || "");
}

function findSourceItemByKey(key) {
  return (state.sourceLibrary[state.artType] || []).find((item) => sourceItemKey(item) === key) || null;
}

function selectedSourceItems() {
  return [...state.selectedSourceIds].map(findSourceItemByKey).filter(Boolean);
}

function toggleSourceSelection(item) {
  const key = sourceItemKey(item);
  if (!key) return;
  if (state.selectedSourceIds.has(key)) {
    state.selectedSourceIds.delete(key);
  } else {
    state.selectedSourceIds.add(key);
  }
  syncSourceSelectionControls();
  renderSourceLibrary();
}

function syncSourceSelectionControls() {
  const selectedCount = selectedSourceItems().length;
  if (elements.selectedSourceCount) {
    elements.selectedSourceCount.textContent = `${selectedCount} selected`;
  }
  if (elements.addSelectedSourcesButton) {
    elements.addSelectedSourcesButton.disabled = state.sourceLoading || selectedCount === 0;
  }
  if (elements.clearSourceSelectionButton) {
    elements.clearSourceSelectionButton.disabled = state.sourceLoading || selectedCount === 0;
  }
}

function openSourcePreview(item) {
  state.previewSourceId = sourceItemKey(item);
  renderSourcePreview();
  if (elements.sourcePreviewDialog) {
    elements.sourcePreviewDialog.setAttribute("aria-hidden", "false");
  }
}

function closeSourcePreview() {
  if (elements.sourcePreviewDialog) {
    elements.sourcePreviewDialog.setAttribute("aria-hidden", "true");
  }
}

function renderSourcePreview() {
  const item = findSourceItemByKey(state.previewSourceId);
  if (!item) return;
  const isSelected = state.selectedSourceIds.has(sourceItemKey(item));
  if (elements.sourcePreviewImage) {
    elements.sourcePreviewImage.src = sourceImageUrl(item);
    elements.sourcePreviewImage.alt = item.title || "Reference idea preview";
  }
  if (elements.sourcePreviewTitle) {
    elements.sourcePreviewTitle.textContent = item.title || "Reference idea";
  }
  if (elements.sourcePreviewMeta) {
    elements.sourcePreviewMeta.textContent = [
      sourceMetaLine(item),
      item.license || "",
      item.tags ? item.tags.split(",").filter(Boolean).slice(0, 4).join(" / ") : ""
    ].filter(Boolean).join(" - ");
  }
  if (elements.sourcePreviewSelectButton) {
    elements.sourcePreviewSelectButton.textContent = isSelected ? "Selected" : "Select idea";
    elements.sourcePreviewSelectButton.classList.toggle("active", isSelected);
  }
}

function visibleSourceItems(items) {
  let visible = [...items];
  if (state.sourceFilter !== "all") {
    visible = visible.filter((item) => sourceSearchText(item).includes(state.sourceFilter));
  }
  if (state.sourceSearch) {
    visible = visible.filter((item) => sourceSearchText(item).includes(state.sourceSearch));
  }

  if (state.sourceSort === "title") {
    visible.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  } else if (state.sourceSort === "reverse") {
    visible.reverse();
  } else if (state.sourceSort === "open-first") {
    visible.sort((a, b) => Number(Boolean(a.localSample)) - Number(Boolean(b.localSample)));
  }

  return visible;
}

function sourceSearchText(item) {
  return [
    item.title,
    item.artist,
    item.license,
    item.tags,
    item.localSample ? "local procedural sketch tattoo idea reference flash free sample" : "open commons source reference"
  ].filter(Boolean).join(" ").toLowerCase();
}

function sourceMetaLine(item) {
  if (item.localSample) {
    const tags = item.tags?.split(",").filter(Boolean).slice(1, 4).join(" / ");
    return tags || "free procedural sketch";
  }
  return item.artist ? `Open source / ${item.artist}` : "Open source reference";
}

function sourceImageUrl(item) {
  if (item.localSample) {
    const svg = createTattooSampleSvg(item.sampleIndex || 0, item.motif || "ornamental", item.flow || "vertical");
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  return item.thumb || item.url;
}

function renderPromptSparks() {
  const sparks = [
    ...(promptSparkBank[state.artType] || []),
    ...(promptSparkBank[state.vibe] || [])
  ].slice(0, 6);

  elements.promptSparkGrid.replaceChildren();
  sparks.forEach((spark) => {
    const button = document.createElement("button");
    button.className = "spark-button";
    button.type = "button";
    button.textContent = spark;
    button.addEventListener("click", () => appendPromptSpark(spark));
    elements.promptSparkGrid.append(button);
  });
}

function appendPromptSpark(spark) {
  const current = elements.textPrompt.value.trim();
  const next = current ? `${current}, ${spark}` : spark;
  elements.textPrompt.value = next;
  state.prompt = next;
  renderArtwork();
}

function generateCreativeBrief() {
  const palette = collectPalette();
  const imageCount = state.images.length;
  const texture = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.texture, 0) / imageCount : 0.2;
  const recommendedEffect = recommendEffect(texture);
  const recommendedComposition = isTattooStudio
    ? recommendTattooComposition()
    : imageCount > 4 ? "mosaic" : state.artType === "character-concept" ? "triptych" : state.outputIntent === "brand-concept" ? "hero" : "orbit";
  const recommendedHarmony = state.vibe === "electric" ? "complement" : state.vibe === "cozy" ? "heat" : state.artType === "tattoo" ? "mono-ink" : "analog";
  const recommendedFinish = state.artType === "tattoo" ? "cutline" : state.outputIntent === "print-poster" ? "riso" : state.vibe === "editorial" ? "gloss" : "matte";
  const detail = clamp(Math.round((isTattooStudio ? 60 : 52) + texture * 40 + imageCount * 2), 42, 92);
  const mutation = clamp(Math.round((isTattooStudio ? 34 : 48) + palette.length * 4 + texture * 18), 30, 92);
  const tattooDetails = isTattooStudio
    ? [
      tattooPlacementProfiles[state.tattooPlacement].label.toLowerCase(),
      tattooNeedleProfiles[state.needleStyle].label.toLowerCase(),
      `${state.stencilStrength}% stencil clarity`
    ]
    : [];
  const brief = [
    vibeProfiles[state.vibe].label.toLowerCase(),
    artProfiles[state.artType].label.toLowerCase(),
    ...tattooDetails,
    effectProfiles[recommendedEffect].note,
    texture > 0.36 ? "rich layered texture" : "clean readable texture",
    `${readableValue(state.outputIntent).toLowerCase()} finish`,
    `palette led by ${palette.slice(0, 3).join(" ")}`
  ].join(", ");

  state.effect = recommendedEffect;
  state.composition = recommendedComposition;
  state.harmony = recommendedHarmony;
  state.finish = recommendedFinish;
  state.detail = detail;
  state.mutation = mutation;
  state.prompt = brief;
  state.activeVariationId = null;
  elements.textPrompt.value = brief;
  syncCreativeControls();
  layoutLayers(true);
  renderVariationDeck();
  renderArtwork();
}

async function createVariationDeck() {
  if (!state.images.length) {
    await loadStarterSet();
  }

  const base = snapshotCreativeState();
  const candidates = buildVariationCandidates();
  const cards = [];
  elements.variationButton.disabled = true;

  try {
    for (const candidate of candidates) {
      applyCreativeState(candidate);
      layoutLayers(true);
      const recipe = VariationAI.compose({ showSelection: false });
      cards.push({
        ...candidate,
        preview: safeCanvasDataUrl(),
        score: recipe.score
      });
    }
  } finally {
    restoreCreativeState(base);
    state.variationCards = cards;
    state.activeVariationId = null;
    syncCreativeControls();
    renderArtwork();
    renderVariationDeck();
    elements.variationButton.disabled = false;
  }
}

function buildVariationCandidates() {
  const effects = Object.keys(effectProfiles).filter((effect) => effect !== state.effect);
  const preferred = [
    state.effect === "clean" ? "bloom" : state.effect,
    effects[0] || "glyphs",
    state.artType === "tattoo" ? "glyphs" : "prism"
  ];
  const needleOptions = ["fine-line", "dotwork", "blackwork"];

  return preferred.slice(0, 3).map((effect, index) => ({
    id: makeId(),
    label: index === 0 ? "Luminous" : index === 1 ? "Graphic" : "Wild Card",
    effect,
    composition: ["hero", "mosaic", "cascade"][index],
    harmony: ["analog", "complement", "heat"][index],
    finish: ["gloss", "cutline", "riso"][index],
    mutation: clamp(state.mutation + (index - 1) * 18 + 16, 18, 96),
    detail: clamp(state.detail + index * 12 - 6, 22, 96),
    needleStyle: isTattooStudio ? needleOptions[index] : state.needleStyle,
    stencilStrength: isTattooStudio ? clamp(state.stencilStrength + (index - 1) * 12, 35, 96) : state.stencilStrength,
    seed: state.seed + 1.7 + index * 2.31
  }));
}

function renderVariationDeck() {
  elements.variationDeck.replaceChildren();

  if (!state.variationCards.length) {
    const empty = document.createElement("div");
    empty.className = "variation-empty";
    empty.textContent = "No branches yet";
    elements.variationDeck.append(empty);
    return;
  }

  state.variationCards.forEach((card) => {
    const button = document.createElement("button");
    button.className = `variation-card${card.id === state.activeVariationId ? " active" : ""}`;
    button.type = "button";
    button.setAttribute("aria-pressed", card.id === state.activeVariationId ? "true" : "false");

    const image = document.createElement("img");
    image.alt = `${card.label} preview`;
    image.src = card.preview;

    const label = document.createElement("strong");
    label.textContent = card.label;

    const meta = document.createElement("span");
    meta.textContent = `${effectProfiles[card.effect].label} + ${compositionProfiles[card.composition].label} AI ${card.score}%`;

    button.append(image, label, meta);
    button.addEventListener("click", () => applyVariationCard(card));
    elements.variationDeck.append(button);
  });
}

function applyVariationCard(card) {
  state.activeVariationId = card.id;
  applyCreativeState(card);
  layoutLayers(true);
  syncCreativeControls();
  renderArtwork();
  renderVariationDeck();
}

function recommendEffect(texture) {
  if (state.artType === "tattoo" || state.artType === "ink-poster") return "glyphs";
  if (state.outputIntent === "brand-concept" || state.outputIntent === "character-sheet") return "blueprint";
  if (state.vibe === "electric" || texture > 0.42) return "prism";
  if (state.vibe === "cozy" || state.vibe === "botanical") return "bloom";
  return "clean";
}

function recommendTattooComposition() {
  if (state.tattooPlacement === "ankle") return "cascade";
  if (state.tattooPlacement === "back" || state.tattooPlacement === "sternum") return "triptych";
  if (state.tattooPlacement === "shoulder") return "orbit";
  return "hero";
}

function snapshotCreativeState() {
  return {
    seed: state.seed,
    effect: state.effect,
    composition: state.composition,
    harmony: state.harmony,
    finish: state.finish,
    tattooPlacement: state.tattooPlacement,
    needleStyle: state.needleStyle,
    skinTone: state.skinTone,
    stencilStrength: state.stencilStrength,
    mutation: state.mutation,
    detail: state.detail,
    activeVariationId: state.activeVariationId,
    layers: state.images.map((layer) => ({
      id: layer.id,
      x: layer.x,
      y: layer.y,
      scale: layer.scale,
      rotation: layer.rotation,
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      userBlendMode: layer.userBlendMode
    }))
  };
}

function restoreCreativeState(snapshot) {
  state.seed = snapshot.seed;
  state.effect = snapshot.effect;
  state.composition = snapshot.composition;
  state.harmony = snapshot.harmony;
  state.finish = snapshot.finish;
  state.tattooPlacement = snapshot.tattooPlacement;
  state.needleStyle = snapshot.needleStyle;
  state.skinTone = snapshot.skinTone;
  state.stencilStrength = snapshot.stencilStrength;
  state.mutation = snapshot.mutation;
  state.detail = snapshot.detail;
  state.activeVariationId = snapshot.activeVariationId;

  snapshot.layers.forEach((stored) => {
    const layer = state.images.find((item) => item.id === stored.id);
    if (!layer) return;
    Object.assign(layer, stored);
  });
}

function applyCreativeState(values) {
  state.seed = values.seed;
  state.effect = values.effect;
  state.composition = values.composition || state.composition;
  state.harmony = values.harmony || state.harmony;
  state.finish = values.finish || state.finish;
  state.tattooPlacement = values.tattooPlacement || state.tattooPlacement;
  state.needleStyle = values.needleStyle || state.needleStyle;
  state.skinTone = values.skinTone || state.skinTone;
  state.stencilStrength = values.stencilStrength ?? state.stencilStrength;
  state.mutation = values.mutation;
  state.detail = values.detail;
}

function syncStudioControls() {
  syncActiveButtons("[data-art-type]", state.artType, "artType");
  syncActiveButtons("[data-vibe]", state.vibe, "vibe");
  if (elements.outputIntent?.querySelector(`option[value="${state.outputIntent}"]`)) {
    elements.outputIntent.value = state.outputIntent;
  }
  syncCreativeControls();
  syncTattooControls();
  syncSourceGalleryControls();
  syncSourceSelectionControls();
}

function syncCreativeControls() {
  elements.mutationRange.value = Math.round(state.mutation);
  elements.detailRange.value = Math.round(state.detail);
  syncActiveButtons("[data-effect]", state.effect, "effect");
  syncActiveButtons("[data-composition]", state.composition, "composition");
  syncActiveButtons("[data-harmony]", state.harmony, "harmony");
  syncActiveButtons("[data-finish]", state.finish, "finish");
  if (isTattooStudio) syncTattooControls();
}

function syncTattooControls() {
  if (elements.tattooPlacement) elements.tattooPlacement.value = state.tattooPlacement;
  if (elements.stencilStrengthRange) elements.stencilStrengthRange.value = Math.round(state.stencilStrength);
  syncActiveButtons("[data-needle-style]", state.needleStyle, "needleStyle");
  syncActiveButtons("[data-skin-tone]", state.skinTone, "skinTone");
  if (elements.aiAssistToggle) {
    elements.aiAssistToggle.classList.toggle("active", state.aiAssist);
    elements.aiAssistToggle.setAttribute("aria-pressed", state.aiAssist ? "true" : "false");
  }
}

function syncSourceGalleryControls() {
  if (elements.sourceSearchInput && elements.sourceSearchInput.value.trim().toLowerCase() !== state.sourceSearch) {
    elements.sourceSearchInput.value = state.sourceSearch;
  }
  if (elements.sourceSortSelect) elements.sourceSortSelect.value = state.sourceSort;
  syncActiveButtons("[data-source-filter]", state.sourceFilter, "sourceFilter");
}

function resetSourceVisibleCount() {
  state.sourceVisibleCount = isTattooStudio ? tattooGalleryPageSize : defaultSourceLibraryLimit;
}

function increaseSourceVisibleCount() {
  const next = state.sourceVisibleCount + tattooGalleryPageSize;
  if (next === state.sourceVisibleCount) return false;
  state.sourceVisibleCount = next;
  return true;
}

async function addSourceBatch() {
  const items = visibleSourceItems(state.sourceLibrary[state.artType] || []);
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

async function addSelectedSourcesToCanvas() {
  const items = selectedSourceItems();
  if (!items.length || state.sourceLoading) return;

  state.sourceLoading = true;
  renderSourceLibrary(`Adding ${items.length} selected ${items.length === 1 ? "idea" : "ideas"}`);
  for (const item of items) {
    await addSourceToCanvas(item, false);
  }

  state.selectedSourceIds.clear();
  state.seed = Math.random() * 20;
  layoutLayers(true);
  state.sourceLoading = false;
  selectLayer(state.images.at(-1)?.id || state.selectedId);
  closeSourcePreview();
  renderSourceLibrary();
}

async function addSourceToCanvas(item, shouldRender = true) {
  const name = item.title.length > 48 ? `${item.title.slice(0, 45)}...` : item.title;
  const layer = await addImageSource(sourceImageUrl(item), name, {
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
    const position = layoutPosition(index, count);
    layer.x = position.x;
    layer.y = position.y;
    layer.scale = position.scale;
    layer.rotation = position.rotation;
    layer.opacity = isTattooStudio ? tattooLayerOpacity(index, count) : artProfiles[state.artType].opacity;
    layer.blendMode = isTattooStudio ? "source-over" : layer.userBlendMode || defaultBlend(index);
  });
}

function tattooLayerOpacity(index, count) {
  if (index === 0) return 0.98;
  const fade = 0.82 - Math.min(index, Math.max(count - 1, 1)) * 0.045;
  return clamp(fade, 0.48, 0.88);
}

function layoutPosition(index, count) {
  const angle = state.seed + index * ((Math.PI * 2) / count);

  if (isTattooStudio) {
    return tattooLayoutPosition(index, count, angle);
  }

  if (state.composition === "hero") {
    if (index === 0) {
      return { x: 0.5, y: 0.52, scale: 1.24, rotation: Math.round(Math.sin(state.seed) * 5) };
    }
    const side = index % 2 ? -1 : 1;
    const row = Math.ceil(index / 2);
    return {
      x: clamp(0.5 + side * (0.18 + row * 0.035), 0.14, 0.86),
      y: clamp(0.45 + Math.sin(angle) * 0.22, 0.16, 0.84),
      scale: clamp(0.72 - row * 0.025, 0.48, 0.82),
      rotation: Math.round(side * (10 + row * 3))
    };
  }

  if (state.composition === "mosaic") {
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    const col = index % columns;
    const row = Math.floor(index / columns);
    return {
      x: (col + 0.5) / columns,
      y: (row + 0.5) / rows,
      scale: clamp(0.98 / Math.max(columns, rows) * 2.05, 0.52, 0.96),
      rotation: Math.round(Math.sin(angle) * 4)
    };
  }

  if (state.composition === "cascade") {
    const step = count <= 1 ? 0 : index / (count - 1);
    return {
      x: clamp(0.24 + step * 0.52 + Math.sin(angle) * 0.025, 0.16, 0.84),
      y: clamp(0.24 + step * 0.44 + Math.cos(angle) * 0.05, 0.16, 0.84),
      scale: clamp(1.08 - index * 0.045, 0.58, 1.12),
      rotation: Math.round(-16 + step * 32)
    };
  }

  if (state.composition === "triptych") {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      x: [0.22, 0.5, 0.78][col],
      y: clamp(0.42 + row * 0.16 + Math.sin(angle) * 0.025, 0.2, 0.82),
      scale: clamp(0.86 - row * 0.08 + (col === 1 ? 0.12 : 0), 0.5, 1.08),
      rotation: Math.round((col - 1) * 8 + Math.sin(angle) * 4)
    };
  }

  const ring = count < 3 ? 0.13 : 0.16 + (index % 3) * 0.045;
  return {
    x: clamp(0.5 + Math.cos(angle) * ring, 0.18, 0.82),
    y: clamp(0.5 + Math.sin(angle) * ring * 0.76, 0.18, 0.82),
    scale: clamp(1.12 - count * 0.045 + (index % 2) * 0.08, 0.64, 1.24),
    rotation: Math.round(Math.sin(angle * 1.7) * 17)
  };
}

function tattooLayoutPosition(index, count, angle) {
  const slotCount = Math.min(Math.max(count, 1), 8);
  const slot = index % slotCount;
  const depth = Math.floor(index / slotCount);
  const step = slotCount <= 1 ? 0.5 : slot / (slotCount - 1);
  const scalePenalty = depth * 0.11;
  const profile = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;

  if (profile.shape === "band") {
    return {
      x: clamp(0.18 + step * 0.64, 0.14, 0.86),
      y: clamp(0.52 + Math.sin(angle) * 0.055, 0.36, 0.68),
      scale: clamp(0.82 - slotCount * 0.018 + (slot % 2) * 0.04 - scalePenalty, 0.42, 0.88),
      rotation: Math.round(profile.angle + Math.sin(angle) * 8)
    };
  }

  if (profile.shape === "panel") {
    const column = slot % 3;
    const row = Math.floor(slot / 3);
    return {
      x: [0.3, 0.5, 0.7][column],
      y: clamp(0.28 + row * 0.18 + Math.sin(angle) * 0.025, 0.2, 0.82),
      scale: clamp(0.82 - row * 0.055 + (column === 1 ? 0.16 : 0) - scalePenalty, 0.42, 0.98),
      rotation: Math.round((column - 1) * 5 + Math.sin(angle) * 3)
    };
  }

  if (profile.shape === "sternum") {
    const side = slot % 2 ? -1 : 1;
    return {
      x: clamp(0.5 + side * step * 0.18, 0.28, 0.72),
      y: clamp(0.25 + step * 0.54, 0.18, 0.82),
      scale: clamp(0.96 - slot * 0.03 - scalePenalty, 0.48, 1.06),
      rotation: Math.round(side * (8 + step * 16))
    };
  }

  if (profile.shape === "circle") {
    const radius = 0.12 + Math.min(slotCount, 5) * 0.012;
    return {
      x: clamp(0.5 + Math.cos(angle) * radius, 0.26, 0.74),
      y: clamp(0.46 + Math.sin(angle) * radius, 0.24, 0.72),
      scale: clamp(0.92 - slotCount * 0.02 + (slot === 0 ? 0.18 : 0) - scalePenalty, 0.48, 1.08),
      rotation: Math.round(Math.sin(angle * 1.4) * 12)
    };
  }

  return {
    x: clamp(0.5 + Math.sin(angle) * 0.09, 0.26, 0.74),
    y: clamp(0.22 + step * 0.58, 0.16, 0.88),
    scale: clamp(1.02 - slotCount * 0.026 + (slot % 2) * 0.05 - scalePenalty, 0.48, 1.12),
    rotation: Math.round(profile.angle + (step - 0.5) * 20 + Math.sin(angle) * 5)
  };
}

function tattooDrawableLayers() {
  const limit = 8;
  const selected = selectedLayer();
  const isArtworkLayer = (layer) => !/\b(texture|paper|grain|background)\b/i.test(layer.name || "");
  const artworkLayers = state.images.filter(isArtworkLayer);
  const pool = artworkLayers.length ? artworkLayers : state.images;
  const latest = pool.slice(-limit);
  if (selected && isArtworkLayer(selected) && !latest.some((layer) => layer.id === selected.id)) {
    latest[0] = selected;
  }
  return latest;
}

function renderArtwork() {
  const recipe = VariationAI.compose();
  renderAssets();
  updateInspector(recipe);
}

function drawBackground(width, height, palette, vibe) {
  ctx.clearRect(0, 0, width, height);
  const skin = isTattooStudio ? skinToneProfiles[state.skinTone] || skinToneProfiles.paper : null;
  ctx.fillStyle = skin?.color || "#f7f4ed";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  const first = skin ? mixHex(skin.color, palette[0], 0.12) : mixHex(palette[0], vibe.colors[0], 0.44);
  const second = skin ? mixHex(skin.color, palette[1] || palette[0], 0.08) : mixHex(palette[1] || palette[0], vibe.colors[1], 0.34);
  const third = skin ? mixHex(skin.color, palette[2] || palette[0], 0.16) : mixHex(palette[2] || palette[0], vibe.colors[2], 0.44);
  gradient.addColorStop(0, first);
  gradient.addColorStop(0.48, second);
  gradient.addColorStop(1, third);
  ctx.globalAlpha = skin ? 0.52 : 0.64 + (state.mutation / 100) * 0.18;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;

  const paper = ctx.createLinearGradient(width, 0, 0, height);
  paper.addColorStop(0, "rgba(255,255,255,.32)");
  paper.addColorStop(0.5, "rgba(255,255,255,0)");
  paper.addColorStop(1, "rgba(20,25,23,.18)");
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);

  if (skin) {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = state.skinTone === "paper" ? 0.045 : 0.085;
    ctx.fillStyle = skin.grain;
    for (let i = 0; i < 260; i += 1) {
      const x = width * (((i * 79 + 17) % 1000) / 1000);
      const y = height * (((i * 43 + 29) % 1000) / 1000);
      const radius = Math.max(1.4, Math.min(width, height) * (0.0012 + (i % 4) * 0.00045));
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawTattooPlacementGuide(width, height, palette, vibe) {
  const profile = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const minDim = Math.min(width, height);
  const guideWidth = width * profile.w;
  const guideHeight = height * profile.h;
  const strength = state.stencilStrength / 100;

  ctx.save();
  ctx.translate(width * profile.x, height * profile.y);
  ctx.rotate(degreesToRadians(profile.angle));
  ctx.globalCompositeOperation = "multiply";
  ctx.strokeStyle = mixHex(skin.ink, vibe.line, 0.18);
  ctx.lineWidth = Math.max(3, minDim * 0.004);
  ctx.globalAlpha = 0.038 + strength * 0.045;

  ctx.beginPath();
  if (profile.shape === "circle") {
    ctx.ellipse(0, 0, guideWidth / 2, guideHeight / 2, 0, 0, Math.PI * 2);
  } else if (profile.shape === "band") {
    roundedRect(ctx, -guideWidth / 2, -guideHeight / 2, guideWidth, guideHeight, guideHeight * 0.48);
    ctx.moveTo(-guideWidth * 0.42, 0);
    ctx.bezierCurveTo(-guideWidth * 0.16, -guideHeight * 0.16, guideWidth * 0.18, guideHeight * 0.16, guideWidth * 0.42, 0);
  } else if (profile.shape === "sternum") {
    ctx.moveTo(0, -guideHeight / 2);
    ctx.bezierCurveTo(-guideWidth * 0.4, -guideHeight * 0.16, -guideWidth * 0.28, guideHeight * 0.34, 0, guideHeight / 2);
    ctx.bezierCurveTo(guideWidth * 0.28, guideHeight * 0.34, guideWidth * 0.4, -guideHeight * 0.16, 0, -guideHeight / 2);
  } else {
    roundedRect(ctx, -guideWidth / 2, -guideHeight / 2, guideWidth, guideHeight, guideWidth * 0.44);
  }
  ctx.stroke();

  ctx.globalAlpha = 0.028 + strength * 0.035;
  ctx.setLineDash([minDim * 0.018, minDim * 0.014]);
  ctx.beginPath();
  ctx.moveTo(0, -guideHeight * 0.46);
  ctx.lineTo(0, guideHeight * 0.46);
  ctx.moveTo(-guideWidth * 0.42, 0);
  ctx.lineTo(guideWidth * 0.42, 0);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = state.skinTone === "paper" ? 0.08 : 0.06;
  ctx.strokeStyle = palette[0] || vibe.line;
  ctx.lineWidth = Math.max(8, minDim * 0.009);
  ctx.beginPath();
  ctx.moveTo(-guideWidth * 0.32, -guideHeight * 0.28);
  ctx.bezierCurveTo(-guideWidth * 0.05, -guideHeight * 0.42, guideWidth * 0.18, guideHeight * 0.18, guideWidth * 0.34, guideHeight * 0.3);
  ctx.stroke();
  ctx.restore();
}

function drawCompositionScaffold(width, height, palette, vibe) {
  ctx.save();
  const detailLevel = state.detail / 100;

  if (isTattooStudio) {
    const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.018 + detailLevel * 0.018;
    ctx.lineCap = "round";
    ctx.strokeStyle = mixHex(skin.ink, vibe.line, 0.12);
    ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.0035);
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      const offset = (i - 1) * width * 0.07;
      ctx.moveTo(width * 0.5 + offset, height * 0.16);
      ctx.bezierCurveTo(width * (0.34 + i * 0.04), height * 0.34, width * (0.68 - i * 0.04), height * 0.62, width * 0.5 - offset * 0.35, height * 0.86);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  ctx.globalAlpha = 0.09 + detailLevel * 0.11;
  ctx.lineWidth = Math.max(8, Math.min(width, height) * 0.008);
  ctx.strokeStyle = vibe.line;

  for (let i = 0; i < 5 + Math.round(detailLevel * 6); i += 1) {
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
  if (isTattooStudio && art.clip === "tattoo") {
    drawTattooInkLayer(layer, index, width, height, art, vibe, palette);
    return;
  }

  const measure = measureLayer(layer, width, height);
  const x = layer.x * width;
  const y = layer.y * height;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(degreesToRadians(layer.rotation));
  const needle = tattooNeedleProfiles[state.needleStyle] || tattooNeedleProfiles["fine-line"];
  ctx.globalAlpha = isTattooStudio
    ? clamp(layer.opacity * (0.72 + state.stencilStrength / 340), 0.28, 0.96)
    : layer.opacity;
  ctx.globalCompositeOperation = layer.blendMode || defaultBlend(index);
  ctx.filter = isTattooStudio ? `${art.filter} contrast(${1 + needle.line * 0.08})` : art.filter;
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

function drawTattooInkLayer(layer, index, width, height, art, vibe, palette) {
  const measure = measureLayer(layer, width, height);
  const x = layer.x * width;
  const y = layer.y * height;
  const minDim = Math.min(width, height);
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const inkCanvas = createTattooInkCanvas(layer, index, measure, palette);
  const alpha = tattooLayerOpacity(index, tattooDrawableLayers().length || 1);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(degreesToRadians(layer.rotation));
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = clamp(alpha * 0.1, 0.05, 0.13);
  ctx.shadowColor = hexToRgba(skin.ink, 0.08);
  ctx.shadowBlur = Math.max(4, minDim * 0.006);

  const offset = Math.max(1.4, minDim * 0.0022);
  [
    [-offset, 0],
    [offset, 0],
    [0, -offset],
    [0, offset]
  ].forEach(([offsetX, offsetY]) => {
    ctx.globalAlpha = clamp(alpha * 0.035, 0.018, 0.045);
    ctx.drawImage(inkCanvas, -measure.width / 2 + offsetX, -measure.height / 2 + offsetY, measure.width, measure.height);
  });
  ctx.globalAlpha = clamp(alpha * 0.11, 0.06, 0.14);
  ctx.drawImage(inkCanvas, -measure.width / 2, -measure.height / 2, measure.width, measure.height);

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.04 + state.stencilStrength / 2400;
  ctx.strokeStyle = mixHex(skin.ink, vibe.line, 0.08);
  ctx.lineWidth = Math.max(2, minDim * 0.0025);
  drawClipPath(measure.width * 0.98, measure.height * 0.98, index, "ellipse", layer.seed);
  ctx.stroke();
  ctx.restore();
}

function createTattooInkCanvas(layer, index, measure, palette) {
  const targetMax = 520;
  const ratio = measure.width / Math.max(measure.height, 1);
  const canvas = document.createElement("canvas");
  if (ratio >= 1) {
    canvas.width = targetMax;
    canvas.height = Math.max(180, Math.round(targetMax / ratio));
  } else {
    canvas.height = targetMax;
    canvas.width = Math.max(180, Math.round(targetMax * ratio));
  }

  const cacheKey = [
    canvas.width,
    canvas.height,
    Math.round(state.stencilStrength),
    state.skinTone,
    palette.slice(0, 4).join("|")
  ].join(":");
  if (layer.tattooInkCache?.key === cacheKey) {
    return layer.tattooInkCache.canvas;
  }

  const inkCtx = canvas.getContext("2d", { willReadFrequently: true });
  inkCtx.clearRect(0, 0, canvas.width, canvas.height);
  drawImageCoverToContext(inkCtx, layer.image, 0, 0, canvas.width, canvas.height);

  const imageData = inkCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const ink = hexToRgb(mixHex(skin.ink, palette[index % palette.length] || skin.ink, 0.08));
  const threshold = 0.64 + state.stencilStrength / 680;

  for (let i = 0; i < data.length; i += 4) {
    const sourceAlpha = data[i + 3] / 255;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    const chroma = (maxChannel(r, g, b) - minChannel(r, g, b)) / 255;
    const darkInk = clamp((threshold - luminance) * 4.4, 0, 1);
    const colorInk = luminance < 0.58 ? chroma * 0.12 : 0;
    const rawAlpha = Math.pow(clamp(darkInk + colorInk, 0, 1), 1.38) * sourceAlpha;
    const alpha = rawAlpha > 0.065 ? rawAlpha : 0;
    data[i] = ink.r;
    data[i + 1] = ink.g;
    data[i + 2] = ink.b;
    data[i + 3] = Math.round(alpha * 255);
  }

  inkCtx.putImageData(imageData, 0, 0);
  inkCtx.globalCompositeOperation = "source-in";
  inkCtx.globalAlpha = 1;
  inkCtx.fillStyle = hexToRgba(skin.ink, 0.98);
  inkCtx.fillRect(0, 0, canvas.width, canvas.height);
  inkCtx.globalCompositeOperation = "source-over";
  inkCtx.globalAlpha = 1;
  layer.tattooInkCache = { key: cacheKey, canvas };
  return canvas;
}

function drawImageCoverToContext(targetCtx, image, x, y, width, height) {
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

  targetCtx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function drawTattooSeamlessPass(width, height, palette, vibe, layers) {
  if (!layers.length) return;
  const minDim = Math.min(width, height);
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const points = layers
    .map((layer) => ({ x: layer.x * width, y: layer.y * height }))
    .sort((a, b) => a.y - b.y)
    .slice(0, 7);

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (points.length > 1) {
    ctx.globalAlpha = 0.12 + state.stencilStrength / 1200;
    ctx.strokeStyle = mixHex(skin.ink, palette[0] || vibe.line, 0.08);
    ctx.lineWidth = Math.max(4, minDim * 0.0055);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      const previous = points[i - 1];
      const current = points[i];
      const midX = (previous.x + current.x) / 2;
      const midY = (previous.y + current.y) / 2;
      ctx.quadraticCurveTo(previous.x, previous.y, midX, midY);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  drawTattooAnchorDetails(width, height, skin, vibe);

  ctx.globalAlpha = 0.022;
  ctx.strokeStyle = mixHex(skin.ink, vibe.line, 0.18);
  ctx.lineWidth = Math.max(1.5, minDim * 0.0018);
  points.forEach((point, index) => {
    const radius = minDim * (0.028 + (index % 3) * 0.006);
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, radius * 0.82, radius, index * 0.52, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function drawTattooAnchorDetails(width, height, skin, vibe) {
  const profile = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;
  const minDim = Math.min(width, height);
  const guideWidth = width * profile.w;
  const guideHeight = height * profile.h;

  ctx.save();
  ctx.translate(width * profile.x, height * profile.y);
  ctx.rotate(degreesToRadians(profile.angle));
  ctx.globalCompositeOperation = "multiply";
  ctx.strokeStyle = mixHex(skin.ink, vibe.line, 0.08);
  ctx.fillStyle = skin.ink;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.34 + state.stencilStrength / 780;
  ctx.lineWidth = Math.max(3.5, minDim * 0.0048);
  ctx.beginPath();
  ctx.moveTo(0, -guideHeight * 0.37);
  ctx.bezierCurveTo(-guideWidth * 0.18, -guideHeight * 0.18, guideWidth * 0.2, guideHeight * 0.05, 0, guideHeight * 0.36);
  ctx.stroke();

  ctx.globalAlpha = 0.26 + state.stencilStrength / 980;
  ctx.lineWidth = Math.max(2.4, minDim * 0.0034);
  for (let i = 0; i < 5; i += 1) {
    const side = i % 2 ? -1 : 1;
    const y = -guideHeight * 0.22 + i * guideHeight * 0.11;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(side * guideWidth * 0.1, y - guideHeight * 0.08, side * guideWidth * 0.23, y - guideHeight * 0.02, side * guideWidth * 0.18, y + guideHeight * 0.08);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 4; i += 1) {
    const x = (i % 2 ? -1 : 1) * guideWidth * (0.12 + i * 0.018);
    const y = -guideHeight * 0.2 + i * guideHeight * 0.16;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2.5, minDim * 0.004), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawTattooFinalInkPass(width, height, palette, vibe, layers) {
  if (!layers.length) return;
  const profile = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const minDim = Math.min(width, height);
  const guideWidth = width * profile.w;
  const guideHeight = height * profile.h;
  const motif = dominantTattooMotif(layers);

  ctx.save();
  ctx.translate(width * profile.x, height * profile.y);
  ctx.rotate(degreesToRadians(profile.angle));
  ctx.globalCompositeOperation = "multiply";
  ctx.strokeStyle = mixHex(skin.ink, palette[0] || vibe.line, 0.04);
  ctx.fillStyle = skin.ink;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.82;
  ctx.lineWidth = Math.max(4.8, minDim * 0.0062);

  ctx.beginPath();
  ctx.moveTo(0, -guideHeight * 0.38);
  ctx.bezierCurveTo(-guideWidth * 0.16, -guideHeight * 0.22, guideWidth * 0.14, -guideHeight * 0.04, -guideWidth * 0.03, guideHeight * 0.12);
  ctx.bezierCurveTo(-guideWidth * 0.18, guideHeight * 0.26, guideWidth * 0.1, guideHeight * 0.3, 0, guideHeight * 0.4);
  ctx.stroke();

  if (motif === "celestial") {
    drawFinalCelestialMotif(guideWidth, guideHeight, minDim);
  } else if (motif === "ornamental" || motif === "geometric") {
    drawFinalOrnamentalMotif(guideWidth, guideHeight, minDim);
  } else {
    drawFinalBotanicalMotif(guideWidth, guideHeight, minDim);
  }

  ctx.globalAlpha = 0.72;
  [0.18, 0.34, 0.52].forEach((offset, index) => {
    const side = index % 2 ? -1 : 1;
    ctx.beginPath();
    ctx.arc(side * guideWidth * offset, -guideHeight * 0.18 + index * guideHeight * 0.22, Math.max(3.4, minDim * 0.005), 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawFinalBotanicalMotif(guideWidth, guideHeight, minDim) {
  ctx.globalAlpha = 0.76;
  ctx.lineWidth = Math.max(3.2, minDim * 0.0044);
  for (let i = 0; i < 7; i += 1) {
    const side = i % 2 ? -1 : 1;
    const y = -guideHeight * 0.28 + i * guideHeight * 0.095;
    const leafWidth = guideWidth * (0.13 + (i % 3) * 0.018);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(side * leafWidth * 0.48, y - guideHeight * 0.055, side * leafWidth, y - guideHeight * 0.015, side * leafWidth * 0.78, y + guideHeight * 0.07);
    ctx.bezierCurveTo(side * leafWidth * 0.38, y + guideHeight * 0.04, side * leafWidth * 0.18, y + guideHeight * 0.01, 0, y);
    ctx.stroke();
  }
}

function drawFinalOrnamentalMotif(guideWidth, guideHeight, minDim) {
  ctx.globalAlpha = 0.76;
  ctx.lineWidth = Math.max(3.1, minDim * 0.0042);
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(0, -guideHeight * 0.24);
    ctx.bezierCurveTo(side * guideWidth * 0.22, -guideHeight * 0.18, side * guideWidth * 0.22, guideHeight * 0.04, 0, guideHeight * 0.1);
    ctx.bezierCurveTo(side * guideWidth * 0.16, guideHeight * 0.18, side * guideWidth * 0.18, guideHeight * 0.3, 0, guideHeight * 0.34);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.ellipse(0, guideHeight * 0.03, guideWidth * 0.12, guideHeight * 0.1, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFinalCelestialMotif(guideWidth, guideHeight, minDim) {
  ctx.globalAlpha = 0.74;
  ctx.lineWidth = Math.max(3.2, minDim * 0.0044);
  ctx.beginPath();
  ctx.arc(0, -guideHeight * 0.06, guideWidth * 0.2, Math.PI * 0.74, Math.PI * 1.86);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(guideWidth * 0.06, -guideHeight * 0.08, guideWidth * 0.2, Math.PI * 0.76, Math.PI * 1.88);
  ctx.stroke();
  for (let i = 0; i < 5; i += 1) {
    const x = (i % 2 ? -1 : 1) * guideWidth * (0.08 + i * 0.025);
    const y = -guideHeight * 0.28 + i * guideHeight * 0.12;
    ctx.beginPath();
    ctx.moveTo(x, y - minDim * 0.012);
    ctx.lineTo(x, y + minDim * 0.012);
    ctx.moveTo(x - minDim * 0.012, y);
    ctx.lineTo(x + minDim * 0.012, y);
    ctx.stroke();
  }
}

function dominantTattooMotif(layers) {
  const counts = layers.reduce((acc, layer) => {
    const motif = layer.sourceMeta?.motif || "";
    if (motif) acc[motif] = (acc[motif] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "botanical";
}

function drawLayerAccent(layer, index, width, height, measure, art, vibe, palette) {
  ctx.save();
  ctx.translate(layer.x * width, layer.y * height);
  ctx.rotate(degreesToRadians(layer.rotation));

  ctx.globalCompositeOperation = "source-over";
  const needle = tattooNeedleProfiles[state.needleStyle] || tattooNeedleProfiles["fine-line"];
  ctx.globalAlpha = art.clip === "tattoo" ? 0.28 + (state.stencilStrength / 100) * 0.18 : art.clip === "watercolor" ? 0.23 : 0.42;
  ctx.strokeStyle = art.clip === "tattoo" ? (skinToneProfiles[state.skinTone]?.ink || "#141414") : palette[(index + 1) % palette.length] || vibe.line;
  ctx.lineWidth = Math.max(4, Math.min(width, height) * 0.006 * (art.clip === "tattoo" ? needle.line : 1));
  drawClipPath(measure.width, measure.height, index, art.clip, layer.seed);
  ctx.stroke();

  ctx.globalCompositeOperation = art.clip === "tattoo" ? "multiply" : "screen";
  ctx.globalAlpha = art.clip === "tattoo" ? 0.055 + needle.wash * 0.22 : 0.16;
  ctx.fillStyle = vibe.colors[index % vibe.colors.length];
  drawClipPath(measure.width * 0.72, measure.height * 0.72, index + 2, "ellipse", layer.seed);
  ctx.fill();
  ctx.restore();
}

function drawSynthesisDetails(width, height, palette, art, vibe) {
  ctx.save();
  ctx.globalCompositeOperation = art.clip === "ink-poster" || art.clip === "tattoo" ? "multiply" : "overlay";
  ctx.lineCap = "round";

  const detailLevel = state.detail / 100;
  const mutationLevel = state.mutation / 100;
  const promptInfluence = state.prompt ? clamp(state.prompt.length / 120, 0.18, 0.7) : 0.22;
  const needle = tattooNeedleProfiles[state.needleStyle] || tattooNeedleProfiles["fine-line"];
  const tattooBoost = isTattooStudio ? Math.round(state.stencilStrength / 18) : 0;
  const lineCount = isTattooStudio
    ? 4 + Math.round(detailLevel * 7) + tattooBoost
    : 10 + Math.round(detailLevel * 24);
  for (let i = 0; i < lineCount; i += 1) {
    ctx.globalAlpha = isTattooStudio
      ? 0.028 + (i % 3) * 0.008 + promptInfluence * 0.018
      : 0.05 + (i % 4) * 0.012 + promptInfluence * 0.04 + mutationLevel * 0.025;
    ctx.strokeStyle = isTattooStudio
      ? mixHex(skinToneProfiles[state.skinTone]?.ink || "#141414", palette[i % palette.length], 0.12)
      : mixHex(palette[i % palette.length], vibe.colors[(i + 1) % vibe.colors.length], 0.36);
    ctx.lineWidth = Math.max(3, Math.min(width, height) * (0.003 + (i % 5) * 0.001) * (isTattooStudio ? needle.line : 1));
    ctx.beginPath();
    const x = width * (((i * 89) % 100) / 100);
    const y = height * (((i * 53 + 20) % 100) / 100);
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(width * (0.18 + (i % 3) * 0.2), height * (0.1 + (i % 5) * 0.17), width * (0.82 - (i % 4) * 0.12), height * (0.88 - (i % 6) * 0.1), width - x, height - y);
    ctx.stroke();
  }

  drawGrain(width, height, isTattooStudio ? 0.012 + detailLevel * 0.018 : 0.03 + detailLevel * 0.055 + (state.images.length > 4 ? 0.02 : 0));
  if (art.clip === "tattoo") {
    drawTattooLinework(width, height, palette, vibe);
  }
  ctx.restore();
}

function drawCreativeEffect(width, height, palette, art, vibe) {
  const effect = effectProfiles[state.effect] ? state.effect : "clean";
  const intensity = 0.22 + (state.mutation / 100) * 0.58;
  const detail = state.detail / 100;

  if (effect === "bloom") {
    drawBloomEffect(width, height, palette, intensity);
  }

  if (effect === "glyphs") {
    drawGlyphEffect(width, height, palette, vibe, intensity, detail);
  }

  if (effect === "prism") {
    drawPrismEffect(width, height, palette, intensity);
  }

  if (effect === "blueprint") {
    drawBlueprintEffect(width, height, palette, vibe, detail);
  }

  if (effect === "clean") {
    drawCleanFinish(width, height, palette, intensity);
  }
}

function drawBloomEffect(width, height, palette, intensity) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  state.images.forEach((layer, index) => {
    const x = layer.x * width;
    const y = layer.y * height;
    const radius = Math.min(width, height) * (0.18 + intensity * 0.18);
    const glow = ctx.createRadialGradient(x, y, radius * 0.05, x, y, radius);
    glow.addColorStop(0, hexToRgba(palette[index % palette.length], 0.42 * intensity));
    glow.addColorStop(1, hexToRgba(palette[(index + 2) % palette.length], 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  });
  ctx.restore();
}

function drawGlyphEffect(width, height, palette, vibe, intensity, detail) {
  const count = isTattooStudio ? 6 + Math.round(detail * 10) : 12 + Math.round(detail * 28);
  const minDim = Math.min(width, height);

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = isTattooStudio ? 0.055 + intensity * 0.07 : 0.18 + intensity * 0.24;
  ctx.strokeStyle = mixHex(vibe.line, palette[0], 0.35);
  ctx.lineWidth = Math.max(1.5, minDim * (isTattooStudio ? 0.0018 : 0.0032));

  for (let i = 0; i < count; i += 1) {
    const x = width * (((i * 73 + Math.round(state.seed * 47)) % 100) / 100);
    const y = height * (((i * 41 + Math.round(state.seed * 31)) % 100) / 100);
    const size = minDim * (0.018 + ((i % 5) * 0.006));
    drawGlyphMark(x, y, size, i);
  }
  ctx.restore();
}

function drawPrismEffect(width, height, palette, intensity) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.14 + intensity * 0.18;

  for (let i = 0; i < 7; i += 1) {
    const offset = (i - 3) * width * 0.08 + Math.sin(state.seed + i) * width * 0.03;
    ctx.fillStyle = hexToRgba(palette[i % palette.length], 0.24 + intensity * 0.12);
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset + width * 0.2, 0);
    ctx.lineTo(offset + width * 0.62, height);
    ctx.lineTo(offset + width * 0.42, height);
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.12 + intensity * 0.12;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.004);
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(width * (0.12 + i * 0.17), 0);
    ctx.lineTo(width * (0.32 + i * 0.14), height);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBlueprintEffect(width, height, palette, vibe, detail) {
  const minDim = Math.min(width, height);
  const grid = Math.max(56, minDim * (0.08 - detail * 0.025));

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.12 + detail * 0.1;
  ctx.strokeStyle = mixHex(vibe.line, palette[1] || palette[0], 0.35);
  ctx.lineWidth = Math.max(1.5, minDim * 0.0018);

  for (let x = grid; x < width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, height * 0.04);
    ctx.lineTo(x, height * 0.96);
    ctx.stroke();
  }

  for (let y = grid; y < height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(width * 0.04, y);
    ctx.lineTo(width * 0.96, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.32;
  ctx.lineWidth = Math.max(4, minDim * 0.004);
  const margin = minDim * 0.055;
  const mark = minDim * 0.06;
  [
    [margin, margin, 1, 1],
    [width - margin, margin, -1, 1],
    [margin, height - margin, 1, -1],
    [width - margin, height - margin, -1, -1]
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * mark);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * mark, y);
    ctx.stroke();
  });

  ctx.restore();
}

function drawCleanFinish(width, height, palette, intensity) {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.globalAlpha = 0.12 + intensity * 0.08;
  const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.18, width / 2, height / 2, Math.max(width, height) * 0.72);
  vignette.addColorStop(0, "rgba(255,255,255,.4)");
  vignette.addColorStop(0.72, hexToRgba(palette[0], 0.08));
  vignette.addColorStop(1, "rgba(20,20,20,.2)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawFinishPass(width, height, palette, art, vibe) {
  if (state.finish === "gloss") {
    drawGlossFinish(width, height, palette);
  } else if (state.finish === "riso") {
    drawRisoFinish(width, height, palette);
  } else if (state.finish === "cutline") {
    drawCutlineFinish(width, height, art, vibe);
  } else if (state.finish === "tape") {
    drawTapeFinish(width, height, palette);
  } else {
    drawMatteFinish(width, height);
  }
}

function drawMatteFinish(width, height) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.045;
  ctx.fillStyle = "#f4ead6";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawGlossFinish(width, height, palette) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const sheen = ctx.createLinearGradient(0, 0, width, height * 0.6);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.42, "rgba(255,255,255,.34)");
  sheen.addColorStop(0.55, hexToRgba(palette[1] || palette[0], 0.08));
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(4, Math.min(width, height) * 0.006);
  ctx.beginPath();
  ctx.moveTo(width * 0.12, height * 0.18);
  ctx.bezierCurveTo(width * 0.36, height * 0.05, width * 0.62, height * 0.16, width * 0.86, height * 0.08);
  ctx.stroke();
  ctx.restore();
}

function drawRisoFinish(width, height, palette) {
  const minDim = Math.min(width, height);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.16;

  for (let channel = 0; channel < 3; channel += 1) {
    const offsetX = (channel - 1) * minDim * 0.012;
    const offsetY = Math.sin(state.seed + channel) * minDim * 0.01;
    ctx.fillStyle = hexToRgba(palette[channel % palette.length], 0.22);
    for (let i = 0; i < 90; i += 1) {
      const x = width * (((i * 47 + channel * 19) % 100) / 100) + offsetX;
      const y = height * (((i * 83 + channel * 23) % 100) / 100) + offsetY;
      const radius = minDim * (0.003 + (i % 5) * 0.0014);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawCutlineFinish(width, height, art, vibe) {
  if (isTattooStudio && art.clip === "tattoo") {
    drawTattooUnifiedContour(width, height, vibe);
    return;
  }

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  state.images.forEach((layer, index) => {
    const measure = measureLayer(layer, width, height);
    ctx.save();
    ctx.translate(layer.x * width, layer.y * height);
    ctx.rotate(degreesToRadians(layer.rotation));
    ctx.strokeStyle = "#fffdf8";
    ctx.lineWidth = Math.max(9, Math.min(width, height) * 0.011);
    drawClipPath(measure.width * 1.035, measure.height * 1.035, index, art.clip, layer.seed);
    ctx.stroke();
    ctx.strokeStyle = mixHex("#141414", vibe.line, 0.24);
    ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.003);
    drawClipPath(measure.width * 1.04, measure.height * 1.04, index, art.clip, layer.seed);
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

function drawTattooUnifiedContour(width, height, vibe) {
  const profile = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const minDim = Math.min(width, height);
  const guideWidth = width * profile.w;
  const guideHeight = height * profile.h;

  ctx.save();
  ctx.translate(width * profile.x, height * profile.y);
  ctx.rotate(degreesToRadians(profile.angle));
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.16 + state.stencilStrength / 780;
  ctx.strokeStyle = mixHex(skin.ink, vibe.line, 0.1);
  ctx.lineWidth = Math.max(2.4, minDim * 0.0032);
  ctx.setLineDash([minDim * 0.018, minDim * 0.012]);
  ctx.beginPath();
  if (profile.shape === "circle") {
    ctx.ellipse(0, 0, guideWidth / 2, guideHeight / 2, 0, 0, Math.PI * 2);
  } else if (profile.shape === "band") {
    roundedRect(ctx, -guideWidth / 2, -guideHeight / 2, guideWidth, guideHeight, guideHeight * 0.48);
  } else if (profile.shape === "sternum") {
    ctx.moveTo(0, -guideHeight / 2);
    ctx.bezierCurveTo(-guideWidth * 0.4, -guideHeight * 0.16, -guideWidth * 0.28, guideHeight * 0.34, 0, guideHeight / 2);
    ctx.bezierCurveTo(guideWidth * 0.28, guideHeight * 0.34, guideWidth * 0.4, -guideHeight * 0.16, 0, -guideHeight / 2);
  } else {
    roundedRect(ctx, -guideWidth / 2, -guideHeight / 2, guideWidth, guideHeight, guideWidth * 0.44);
  }
  ctx.stroke();
  ctx.restore();
}

function drawTapeFinish(width, height, palette) {
  const minDim = Math.min(width, height);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  state.images.slice(0, 6).forEach((layer, index) => {
    const x = layer.x * width;
    const y = layer.y * height;
    const tapeWidth = minDim * (0.16 + (index % 3) * 0.025);
    const tapeHeight = minDim * 0.038;
    ctx.save();
    ctx.translate(x + Math.sin(index + state.seed) * minDim * 0.13, y - minDim * (0.18 + (index % 2) * 0.06));
    ctx.rotate(degreesToRadians(layer.rotation * 0.35 + (index % 2 ? -12 : 12)));
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = hexToRgba(palette[(index + 2) % palette.length], 0.48);
    roundedRect(ctx, -tapeWidth / 2, -tapeHeight / 2, tapeWidth, tapeHeight, tapeHeight * 0.22);
    ctx.fill();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-tapeWidth / 2, -tapeHeight * 0.12, tapeWidth, tapeHeight * 0.24);
    ctx.restore();
  });
  ctx.restore();
}

function drawGlyphMark(x, y, size, index) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(degreesToRadians((index % 9) * 22 - 44));
  ctx.beginPath();
  if (index % 4 === 0) {
    ctx.arc(0, 0, size, 0, Math.PI * 1.5);
  } else if (index % 4 === 1) {
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
  } else if (index % 4 === 2) {
    ctx.moveTo(-size, size);
    ctx.quadraticCurveTo(0, -size, size, size);
  } else {
    ctx.rect(-size * 0.7, -size * 0.7, size * 1.4, size * 1.4);
  }
  ctx.stroke();
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

  if (intent === "tattoo-flash") {
    const minDim = Math.min(width, height);
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = skinToneProfiles[state.skinTone]?.ink || "#141414";
    ctx.lineWidth = Math.max(4, minDim * 0.0045);
    ctx.strokeRect(width * 0.045, height * 0.045, width * 0.91, height * 0.91);
    ctx.globalAlpha = 0.045;
    ctx.lineWidth = Math.max(2, minDim * 0.002);
    ctx.setLineDash([minDim * 0.012, minDim * 0.016]);
    for (let i = 1; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(width * (0.045 + i * 0.303), height * 0.045);
      ctx.lineTo(width * (0.045 + i * 0.303), height * 0.955);
      ctx.moveTo(width * 0.045, height * (0.045 + i * 0.303));
      ctx.lineTo(width * 0.955, height * (0.045 + i * 0.303));
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  if (intent === "tattoo-stencil") {
    ctx.globalCompositeOperation = "saturation";
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.08 + state.stencilStrength / 420;
    ctx.fillStyle = skinToneProfiles[state.skinTone]?.ink || "#141414";
    ctx.fillRect(0, 0, width, height);
  }

  if (intent === "skin-preview") {
    const minDim = Math.min(width, height);
    const vignette = ctx.createRadialGradient(width / 2, height / 2, minDim * 0.18, width / 2, height / 2, Math.max(width, height) * 0.72);
    vignette.addColorStop(0, "rgba(255,255,255,0)");
    vignette.addColorStop(1, state.skinTone === "paper" ? "rgba(60,40,30,.12)" : "rgba(20,12,8,.28)");
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
  if (isTattooStudio) {
    ctx.globalAlpha = 0.24;
    ctx.setLineDash([Math.max(8, width * 0.006), Math.max(10, width * 0.008)]);
    ctx.strokeStyle = "#176f65";
    ctx.lineWidth = Math.max(1.4, width * 0.0012);
    drawClipPath(measure.width * 1.03, measure.height * 1.03, 0, "ellipse", layer.seed);
    ctx.stroke();
    ctx.restore();
    return;
  }

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
  const baseWidth = isTattooStudio ? 0.72 : 0.54;
  const minHeightRatio = isTattooStudio ? 0.46 : 0.34;
  let layerWidth = minDim * baseWidth * layer.scale;
  let layerHeight = layerWidth / imageRatio;

  if (layerHeight < minDim * minHeightRatio * layer.scale) {
    layerHeight = minDim * minHeightRatio * layer.scale;
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

  return applyHarmony(unique.slice(0, 8), vibePalette).slice(0, 8);
}

function applyHarmony(palette, vibePalette) {
  const safe = palette.length ? palette : vibePalette;

  if (state.harmony === "analog") {
    return safe.map((color, index) => mixHex(color, vibePalette[(index + 1) % vibePalette.length], 0.38));
  }

  if (state.harmony === "complement") {
    return safe.flatMap((color, index) => index % 2 ? [color] : [color, complementHex(color)]);
  }

  if (state.harmony === "heat") {
    const heat = ["#d55d42", "#f2bd4e", "#97406d", "#c48a24"];
    return safe.map((color, index) => mixHex(color, heat[index % heat.length], 0.52));
  }

  if (state.harmony === "mono-ink") {
    return safe.map((color, index) => {
      const target = index % 3 === 0 ? "#141414" : index % 3 === 1 ? "#f7f4ed" : "#64706c";
      return mixHex(color, target, 0.68);
    });
  }

  return safe;
}

function buildRecipe(palette) {
  const imageCount = state.images.length;
  const texture = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.texture, 0) / imageCount : 0;
  const contrast = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.contrast, 0) / imageCount : 0;
  const brightness = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.brightness, 0) / imageCount : 0.55;
  const paletteVariety = Math.min(palette.length / 8, 1);
  const needle = tattooNeedleProfiles[state.needleStyle] || tattooNeedleProfiles["fine-line"];
  const placement = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const tattooScore = isTattooStudio ? needle.score + state.stencilStrength * 0.05 : 0;
  const score = Math.round(clamp(
    24 + imageCount * 15 + texture * 20 + contrast * 16 + paletteVariety * 16 + effectProfiles[state.effect].score + compositionProfiles[state.composition].score + harmonyProfiles[state.harmony].score + finishProfiles[state.finish].score + state.detail * 0.04 + tattooScore,
    0,
    99
  ));
  const dna = [
    { key: "Texture", value: texture > 0.35 ? "tactile and layered" : texture > 0.18 ? "balanced with soft grain" : "smooth and airy" },
    { key: "Light", value: brightness > 0.62 ? "bright source dominant" : brightness < 0.42 ? "shadow-rich contrast" : "mid-tone harmony" },
    { key: "Fusion", value: state.images.length > 3 ? "multi-reactant synthesis" : state.images.length > 1 ? "focused hybrid blend" : "single-source study" }
  ];
  const tattooRows = isTattooStudio ? [
    { key: "Placement", value: placement.label },
    { key: "Needle", value: needle.label },
    { key: "Skin", value: skin.label },
    { key: "Stencil", value: `${Math.round(state.stencilStrength)}%` }
  ] : [];

  return {
    score,
    palette,
    dna,
    rows: [
      { key: "Reactants", value: imageCount ? `${imageCount} images` : "No images" },
      { key: "Art", value: artProfiles[state.artType].label },
      { key: "Vibe", value: vibeProfiles[state.vibe].label },
      { key: "Effect", value: effectProfiles[state.effect].label },
      { key: "Map", value: compositionProfiles[state.composition].label },
      { key: "Chemistry", value: harmonyProfiles[state.harmony].label },
      { key: "Finish", value: finishProfiles[state.finish].label },
      ...tattooRows,
      { key: "Texture", value: texture > 0.35 ? "Rich" : texture > 0.18 ? "Balanced" : "Soft" },
      { key: "Detail", value: state.detail > 72 ? "Intricate" : state.detail > 38 ? "Focused" : "Minimal" },
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
  renderDna(activeRecipe.dna);
  renderRecipe(activeRecipe.rows);
  renderCredits();
  renderTattooAdvisor(activeRecipe);
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

function renderDna(dna = []) {
  elements.dnaList.replaceChildren();
  dna.forEach((row) => {
    const card = document.createElement("div");
    card.className = "dna-card";

    const key = document.createElement("strong");
    key.textContent = row.key;

    const value = document.createElement("span");
    value.textContent = row.value;

    card.append(key, value);
    elements.dnaList.append(card);
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

function renderTattooAdvisor(recipe = state.lastRecipe) {
  if (!elements.tattooAdvisorList || !isTattooStudio) return;
  elements.tattooAdvisorList.replaceChildren();

  if (!state.aiAssist) {
    elements.tattooAdvisorList.append(createAdvisorCard("Advisor paused", "Toggle Pro AI to restore placement, linework, and longevity notes."));
    return;
  }

  const needle = tattooNeedleProfiles[state.needleStyle] || tattooNeedleProfiles["fine-line"];
  const placement = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const imageCount = state.images.length;
  const texture = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.texture, 0) / imageCount : 0.18;
  const contrast = imageCount ? state.images.reduce((sum, layer) => sum + layer.analysis.contrast, 0) / imageCount : 0.28;
  const clarity = state.stencilStrength > 78 ? "high-transfer stencil" : state.stencilStrength > 52 ? "balanced stencil" : "soft exploratory stencil";
  const cards = [
    {
      title: "Placement flow",
      text: tattooPlacementAdvice(placement.shape)
    },
    {
      title: "Needle strategy",
      text: `${needle.label} wants ${needle.line > 1 ? "bolder spacing and confident silhouettes" : "clean negative space and controlled detail"}.`
    },
    {
      title: "Skin read",
      text: `${skin.label} preview with ${contrast > 0.32 ? "strong contrast" : "gentle contrast"} and ${clarity}.`
    },
    {
      title: "Art direction",
      text: imageCount > 3
        ? `Blend the strongest ${Math.min(imageCount, 4)} references, then simplify secondary texture before final stencil.`
        : texture > 0.34 ? "Preserve texture as shading, but keep the outer contour readable from a distance." : "Add one anchor motif so the design has a clear focal point."
    }
  ];

  if (recipe?.score) {
    cards.push({
      title: "Studio read",
      text: `Current synthesis is ${recipe.score}% with ${compositionProfiles[state.composition].label.toLowerCase()} mapping and ${harmonyProfiles[state.harmony].label.toLowerCase()} ink chemistry.`
    });
  }

  cards.forEach((card) => elements.tattooAdvisorList.append(createAdvisorCard(card.title, card.text)));
}

function createAdvisorCard(title, text) {
  const card = document.createElement("div");
  card.className = "advisor-card";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = text;
  card.append(strong, span);
  return card;
}

function tattooPlacementAdvice(shape) {
  if (shape === "band") return "Keep the rhythm continuous, with repeatable elements that still read when wrapped.";
  if (shape === "panel") return "Use a central anchor and mirrored secondary details so the back piece feels intentional.";
  if (shape === "sternum") return "Favor symmetry, tapered vertical movement, and breathing room near the center line.";
  if (shape === "circle") return "Curve the focal elements around the shoulder cap instead of forcing a flat rectangle.";
  return "Let the design travel lengthwise with the body and keep dense details away from the edges.";
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
  elements.finalPreview.src = emptyPreviewSrc;
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
  VariationAI.compose({ showSelection: false });
  const previewUrl = safeCanvasDataUrl();
  if (previewUrl) {
    elements.finalPreview.src = previewUrl;
  }
  elements.reactionOverlay.classList.add("revealed");
  elements.reactionWords.textContent = "Output synthesized";

  await delay(1500);
  elements.reactionOverlay.classList.remove("active", "revealed");
  elements.reactionOverlay.setAttribute("aria-hidden", "true");
  elements.blendButton.disabled = false;
  elements.reactionStatus.textContent = "Output ready";
  renderArtwork();
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
  VariationAI.compose({ showSelection: false });
  const dataUrl = safeCanvasDataUrl();
  if (!dataUrl) {
    elements.reactionStatus.textContent = "Download blocked by a remote source";
    renderArtwork();
    return;
  }
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.download = `variation-of-creation-${stamp}.png`;
  link.href = dataUrl;
  link.click();
  renderArtwork();
}

function safeCanvasDataUrl() {
  try {
    return elements.canvas.toDataURL("image/png");
  } catch (error) {
    return "";
  }
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
  const needle = tattooNeedleProfiles[state.needleStyle] || tattooNeedleProfiles["fine-line"];
  const skin = skinToneProfiles[state.skinTone] || skinToneProfiles.paper;
  const strength = state.stencilStrength / 100;
  const profile = tattooPlacementProfiles[state.tattooPlacement] || tattooPlacementProfiles.forearm;
  ctx.save();
  ctx.translate(width * profile.x, height * profile.y);
  ctx.rotate(degreesToRadians(profile.angle));
  ctx.globalCompositeOperation = "multiply";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = mixHex(skin.ink, vibe.line, 0.12);
  ctx.lineWidth = Math.max(1.8, minDim * 0.0024 * needle.line);
  ctx.globalAlpha = (0.08 + strength * 0.12) * needle.alpha;

  for (let i = 0; i < 3 + Math.round(strength * 3); i += 1) {
    const spread = (i - 2) * minDim * 0.045;
    ctx.beginPath();
    ctx.moveTo(spread, -height * profile.h * 0.34);
    ctx.bezierCurveTo(-width * profile.w * 0.18, -height * profile.h * 0.08, width * profile.w * 0.2, height * profile.h * 0.12, -spread * 0.35, height * profile.h * 0.34);
    ctx.stroke();
  }

  if (needle.fill > 0.12) {
    ctx.globalAlpha = needle.fill * 0.16;
    ctx.fillStyle = skin.ink;
    for (let i = 0; i < 4; i += 1) {
      const x = (i - 1.5) * width * profile.w * 0.12;
      const y = (-0.22 + i * 0.15) * height * profile.h;
      const radius = minDim * (0.026 + (i % 3) * 0.01);
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 1.25, radius, i * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (needle.wash > 0.08) {
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = needle.wash * 0.45;
    palette.slice(0, 4).forEach((color, index) => {
      const x = (index - 1.5) * width * profile.w * 0.11;
      const y = (-0.18 + index * 0.12) * height * profile.h;
      const grd = ctx.createRadialGradient(x, y, minDim * 0.02, x, y, minDim * (0.14 + index * 0.025));
      grd.addColorStop(0, hexToRgba(color, 0.36));
      grd.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = grd;
      ctx.fillRect(-width / 2, -height / 2, width, height);
    });
  }

  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.035 + needle.dotwork * 0.08 + strength * 0.035;
  ctx.fillStyle = mixHex(skin.ink, palette[0] || "#141414", 0.14);
  for (let i = 0; i < 32 + Math.round(needle.dotwork * 72); i += 1) {
    const x = width * profile.w * ((((i * 37 + 11) % 100) / 100) - 0.5);
    const y = height * profile.h * ((((i * 61 + 23) % 100) / 100) - 0.5);
    const radius = 1.2 + (i % 4) * 0.55 + needle.dotwork * 0.7;
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

function complementHex(hex) {
  const rgb = hexToRgb(hex);
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
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

function hexToRgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha, 0, 1)})`;
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

function escapeSvgText(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&apos;"
  })[char]);
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
}

function initializeStaticPageShell() {
  const page = document.body?.dataset.page || "studio";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });

  const themeButton = document.querySelector("[data-theme-toggle]");
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      themeButton.textContent = document.documentElement.classList.contains("dark") ? "Light" : "Dark";
    });
  }
}
