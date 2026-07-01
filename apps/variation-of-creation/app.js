(() => {
  const app = document.querySelector(".app-shell");
  if (!app) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const state = {
    view: "studio",
    selected: null,
    selectedId: "hero-title",
    drag: null,
    botRun: 0,
    toastTimer: null
  };

  const templates = {
    launch: {
      title: "Design serious things without becoming a serious person.",
      copy: "Templates, brand kits, prototypes, mockups, AI assets, and collaboration on one delightfully organized board.",
      note: "Big ideas, tiny sticky notes, zero chaos... mostly.",
      badge: "AI polish pass",
      className: ""
    },
    bakery: {
      title: "Tiny cakes, giant main-character energy.",
      copy: "A warm carousel system for menus, reels, sticker packs, and a landing hero that smells faintly like cinnamon.",
      note: "No crumbs left behind.",
      badge: "Bakery carousel",
      className: "template-bakery"
    },
    mobile: {
      title: "A polished app flow with delightful little taps.",
      copy: "Frames, components, constraints, comments, device previews, and export-ready UI states.",
      note: "Wireframe glow-up complete.",
      badge: "Mobile kit",
      className: "template-mobile"
    }
  };

  const botReplies = [
    "I built a cleaner hierarchy, added a reusable CTA block, and tuned the palette so the chaos has manners.",
    "Generated a layout stack with social sizes, a landing hero, icon moments, and a tidy little brand rule.",
    "I made it quirkier: bolder note, brighter accent, friendlier copy, and one suspiciously charming sticker."
  ];

  function init() {
    bindNavigation();
    bindGlobalClicks();
    bindInspectorTabs();
    bindPropertyControls();
    bindDragging();
    bindBrandKit();
    bindCursorTrail();
    renderLayers();
    selectObject($('[data-object="hero-title"]'));
    setView(location.hash?.replace("#", "") || "studio");
  }

  function bindNavigation() {
    $$("[data-view-link]").forEach((control) => {
      control.addEventListener("click", (event) => {
        event.preventDefault();
        setView(control.dataset.viewLink);
      });
    });
  }

  function setView(view) {
    const panel = $(`[data-view-panel="${view}"]`);
    if (!panel) return;
    state.view = view;
    $$("[data-view-panel]").forEach((item) => item.classList.toggle("active", item === panel));
    $$("[data-view-link]").forEach((item) => item.classList.toggle("active", item.dataset.viewLink === view));
    if (location.hash !== `#${view}`) {
      history.replaceState(null, "", `#${view}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindGlobalClicks() {
    document.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add]");
      const templateButton = event.target.closest("[data-template]");
      const promptButton = event.target.closest("[data-prompt]");
      const actionButton = event.target.closest("[data-action]");
      const marketFilter = event.target.closest("[data-market-filter]");
      const transitionButton = event.target.closest("[data-transition]");
      const sizeButton = event.target.closest("[data-size]");

      if (addButton) {
        addObject(addButton.dataset.add);
      }

      if (templateButton) {
        applyTemplate(templateButton.dataset.template);
      }

      if (promptButton) {
        $("#botPrompt").value = promptButton.dataset.prompt;
        setInspectorTab("bot");
        runQuirkBot(promptButton.dataset.prompt);
      }

      if (marketFilter) {
        filterMarket(marketFilter.dataset.marketFilter);
      }

      if (transitionButton) {
        $$("[data-transition]").forEach((button) => button.classList.toggle("active", button === transitionButton));
        toast(`${readable(transitionButton.dataset.transition)} transition selected.`);
      }

      if (sizeButton) {
        setCanvasSize(sizeButton.dataset.size, sizeButton);
      }

      if (actionButton) {
        handleAction(actionButton.dataset.action, actionButton);
      }
    });
  }

  function handleAction(action, button) {
    const promptInput = $("#botPrompt");
    const format = button?.dataset?.format;
    const actions = {
      undo: () => toast("Undo tucked safely into version history."),
      redo: () => toast("Redo restored the last brave pixel."),
      comments: () => {
        $("#collabStrip")?.classList.add("attention");
        toast("18 comments, 3 approvals, and one very polite nitpick.");
        setTimeout(() => $("#collabStrip")?.classList.remove("attention"), 700);
      },
      share: () => toast("Share link copied for the team workspace."),
      export: () => toast("Export queue ready: PNG, JPG, PDF, SVG, HTML/CSS, decks, and social sizes."),
      "export-format": () => toast(`${format} export prepared.`),
      "new-board": () => {
        setView("studio");
        addObject("frame");
        toast("New board created. Your pixels are waiting patiently.");
      },
      approve: () => toast("Board approved. The chaos is now certified charming."),
      "bot-run": () => runQuirkBot(promptInput.value),
      "bot-clean": () => runQuirkBot("Make this cleaner and more polished."),
      "bot-quirky": () => runQuirkBot("Make this quirkier, brighter, and more playful."),
      "bot-polish": () => runQuirkBot("Polish this into a high-end design system."),
      "preview-flow": () => toast("Prototype preview opened with smart animate and device comments."),
      "add-comment": () => toast("Comment pinned to the selected prototype connection."),
      "check-brand": () => updateBrandScore(true),
      "open-market": () => toast("Filters: style, category, price, creator, format, and use case."),
      "make-quirky": () => {
        setView("studio");
        runQuirkBot("Make it clean. Make it clever. Make it Quirkboards.");
      }
    };

    actions[action]?.();
  }

  function bindInspectorTabs() {
    $$("[data-inspector-tab]").forEach((tab) => {
      tab.addEventListener("click", () => setInspectorTab(tab.dataset.inspectorTab));
    });
  }

  function setInspectorTab(name) {
    $$("[data-inspector-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.inspectorTab === name));
    $$("[data-inspector-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.inspectorPanel === name));
  }

  function bindPropertyControls() {
    $("#propertyText")?.addEventListener("input", (event) => {
      if (!state.selected) return;
      if (state.selected.classList.contains("object-card-mini")) {
        state.selected.querySelector("strong").textContent = event.target.value || "Brand kit called";
      } else {
        state.selected.textContent = event.target.value;
      }
      renderLayers();
    });

    $("#propertyColor")?.addEventListener("input", (event) => {
      state.selected?.style.setProperty("--object-color", event.target.value);
    });

    $("#propertyOpacity")?.addEventListener("input", (event) => {
      if (state.selected) state.selected.style.opacity = Number(event.target.value) / 100;
    });

    $("#propertySize")?.addEventListener("input", (event) => {
      if (state.selected) state.selected.style.setProperty("--object-scale", Number(event.target.value) / 100);
    });

    $("#propertyRotation")?.addEventListener("input", (event) => {
      if (state.selected) state.selected.style.setProperty("--object-rotation", `${event.target.value}deg`);
    });

    $("#zoomRange")?.addEventListener("input", (event) => {
      $(".creative-floor").style.zoom = `${Number(event.target.value)}%`;
    });
  }

  function bindDragging() {
    $("#mainBoard")?.addEventListener("pointerdown", (event) => {
      const object = event.target.closest("[data-object]");
      if (!object) return;
      selectObject(object);
      const board = $("#mainBoard").getBoundingClientRect();
      const rect = object.getBoundingClientRect();
      state.drag = {
        object,
        board,
        startX: event.clientX,
        startY: event.clientY,
        left: ((rect.left - board.left) / board.width) * 100,
        top: ((rect.top - board.top) / board.height) * 100
      };
      object.classList.add("dragging");
      object.setPointerCapture?.(event.pointerId);
    });

    document.addEventListener("pointermove", (event) => {
      if (!state.drag) return;
      const { object, board, startX, startY, left, top } = state.drag;
      const dx = ((event.clientX - startX) / board.width) * 100;
      const dy = ((event.clientY - startY) / board.height) * 100;
      const nextLeft = clamp(left + dx, 0, 88);
      const nextTop = clamp(top + dy, 0, 88);
      object.style.left = `${snap(nextLeft, 50)}%`;
      object.style.top = `${snap(nextTop, 50)}%`;
      showSnapLines(nextLeft, nextTop);
    });

    document.addEventListener("pointerup", () => {
      if (!state.drag) return;
      state.drag.object.classList.remove("dragging");
      state.drag = null;
      showSnapLines(null, null);
      renderLayers();
    });
  }

  function showSnapLines(left, top) {
    const h = $("#snapLineH");
    const v = $("#snapLineV");
    const nearLeft = left !== null && Math.abs(left - 50) < 2.2;
    const nearTop = top !== null && Math.abs(top - 50) < 2.2;
    v?.classList.toggle("visible", nearLeft);
    h?.classList.toggle("visible", nearTop);
    if (v) v.style.left = "50%";
    if (h) h.style.top = "50%";
  }

  function snap(value, target) {
    return Math.abs(value - target) < 2.2 ? target : value;
  }

  function selectObject(object) {
    if (!object) return;
    $$("[data-object]").forEach((item) => item.classList.toggle("selected", item === object));
    state.selected = object;
    state.selectedId = object.dataset.object;
    updateInspector();
    renderLayers();
  }

  function updateInspector() {
    const object = state.selected;
    if (!object) return;

    $("#selectedName").textContent = object.dataset.object;
    $("#propertyText").value = object.classList.contains("object-card-mini")
      ? object.querySelector("strong")?.textContent || object.dataset.object
      : object.textContent.trim();

    const color = getComputedStyle(object).getPropertyValue("--object-color").trim();
    $("#propertyColor").value = normalizeColor(color || "#f5f7ff");
    $("#propertyOpacity").value = Math.round(Number(object.style.opacity || 1) * 100);
    $("#propertySize").value = Math.round(Number(getComputedStyle(object).getPropertyValue("--object-scale") || 1) * 100);
    $("#propertyRotation").value = parseInt(getComputedStyle(object).getPropertyValue("--object-rotation"), 10) || 0;
  }

  function addObject(kind) {
    const board = $("#mainBoard");
    const id = `${kind}-${Date.now().toString(36).slice(-5)}`;
    const object = document.createElement("div");
    object.className = "design-object";
    object.dataset.object = id;
    object.dataset.kind = kind;
    object.style.left = `${18 + Math.random() * 48}%`;
    object.style.top = `${18 + Math.random() * 48}%`;
    object.style.width = kind === "frame" ? "260px" : kind === "text" ? "260px" : "160px";
    object.style.height = kind === "frame" ? "170px" : kind === "text" ? "82px" : "92px";
    object.style.setProperty("--object-color", pickColor());

    if (kind === "text") {
      object.classList.add("object-copy");
      object.textContent = "Make it clean. Make it clever. Make it Quirkboards.";
    } else if (kind === "shape") {
      object.classList.add("object-shape");
      object.textContent = "";
    } else if (kind === "note") {
      object.classList.add("object-note");
      object.textContent = "Tiny sticky note, big main-character planning.";
    } else if (kind === "frame") {
      object.classList.add("object-card-mini");
      object.innerHTML = "<span>New frame</span><strong>Reusable component</strong><i></i>";
    } else {
      object.classList.add("object-badge");
      object.textContent = kind === "upload" ? "uploaded asset" : "AI asset";
    }

    board.append(object);
    selectObject(object);
    toast(`${readable(kind)} added to the board.`);
  }

  function applyTemplate(name) {
    const template = templates[name] || templates.launch;
    const board = $("#mainBoard");
    board.classList.remove("template-bakery", "template-mobile");
    if (template.className) board.classList.add(template.className);

    $(".object-heading").textContent = template.title;
    $(".object-copy").textContent = template.copy;
    $(".object-note").textContent = template.note;
    $(".object-badge").textContent = template.badge;

    $$("[data-template]").forEach((button) => button.classList.toggle("active", button.dataset.template === name));
    selectObject($(".object-heading"));
    toast(`${readable(name)} template loaded.`);
  }

  function setCanvasSize(size, activeButton) {
    const board = $("#mainBoard");
    board.classList.remove("size-social", "size-deck", "size-web");
    board.classList.add(`size-${size}`);
    $$("[data-size]").forEach((button) => button.classList.toggle("active", button === activeButton));
    toast(`${readable(size)} board size active.`);
  }

  function renderLayers() {
    const list = $("#layerList");
    if (!list) return;
    list.replaceChildren();
    $$("[data-object]", $("#mainBoard")).reverse().forEach((object, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "layer-row";
      row.classList.toggle("active", object === state.selected);
      row.innerHTML = `
        <span>${index + 1}</span>
        <strong>${objectLabel(object)}</strong>
        <small>${object.dataset.kind}</small>
      `;
      row.addEventListener("click", () => {
        selectObject(object);
        setInspectorTab("properties");
      });
      list.append(row);
    });
  }

  function runQuirkBot(prompt = "") {
    const cleanPrompt = prompt.trim() || $("#botPrompt").placeholder;
    $("#botPrompt").value = cleanPrompt;
    state.botRun += 1;

    if (/bakery|carousel|instagram/i.test(cleanPrompt)) {
      applyTemplate("bakery");
    } else if (/wireframe|mobile|app/i.test(cleanPrompt)) {
      applyTemplate("mobile");
    } else if (/logo|palette|brand/i.test(cleanPrompt)) {
      addObject("asset");
      state.selected.textContent = "Generated logo mark";
      state.selected.style.setProperty("--object-color", "#f8d84a");
    } else if (/quirk/i.test(cleanPrompt)) {
      addObject("note");
    }

    const response = $("#botResponse");
    const reply = botReplies[state.botRun % botReplies.length];
    response.innerHTML = `
      <strong>QuirkBot</strong>
      <span>${reply}</span>
      <span>Prompt: ${escapeHtml(cleanPrompt)}</span>
    `;
    setInspectorTab("bot");
    toast("QuirkBot generated a new design suggestion.");
  }

  function filterMarket(filter) {
    $$("[data-market-filter]").forEach((button) => button.classList.toggle("active", button.dataset.marketFilter === filter));
    $$(".product-card").forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.marketCategory !== filter);
    });
  }

  function bindBrandKit() {
    $$("[data-brand-meter]").forEach((slider) => {
      slider.addEventListener("input", () => updateBrandScore(false));
    });

    $$("#brandSwatches button").forEach((button) => {
      button.addEventListener("click", () => {
        $("#propertyColor").value = rgbToHex(getComputedStyle(button).backgroundColor);
        state.selected?.style.setProperty("--object-color", $("#propertyColor").value);
        toast("Brand swatch applied to the selected layer.");
      });
    });

    updateBrandScore(false);
  }

  function updateBrandScore(announce) {
    const sliders = $$("[data-brand-meter]").map((input) => Number(input.value));
    const [playful, premium, bold, minimal, quirky, corporate] = sliders;
    const score = clamp(Math.round((playful + premium + bold + minimal * 0.68 + quirky + (100 - corporate) * 0.7) / 5.38), 0, 99);
    $("#brandScore").textContent = `${score}%`;
    $("#brandVoice").textContent = score > 82
      ? "Playful, polished, friendly, and useful."
      : "Useful and tidy, with room for a brighter wink.";
    $("#brandAdvice").textContent = score > 88
      ? "Spacing, tone, and color usage look tidy. Your brand kit called. It wants boundaries."
      : "A few colors and tone rules are drifting. Make it cleaner, then make it Quirkboards.";
    if (announce) toast(`Brand consistency check complete: ${score}%.`);
  }

  function bindCursorTrail() {
    const points = [];
    const dots = Array.from({ length: 10 }, (_, index) => {
      const dot = document.createElement("span");
      dot.className = "trail-dot";
      dot.style.background = index % 3 === 0 ? "var(--yellow)" : index % 2 ? "var(--coral)" : "var(--cyan)";
      dot.style.width = `${8 - index * 0.35}px`;
      dot.style.height = `${8 - index * 0.35}px`;
      document.body.append(dot);
      points[index] = { x: 0, y: 0 };
      return dot;
    });

    let point = { x: 0, y: 0 };
    let active = false;
    document.addEventListener("pointermove", (event) => {
      point = { x: event.clientX, y: event.clientY };
      active = true;
    });

    function animate() {
      dots.forEach((dot, index) => {
        const target = index === 0 ? point : points[index - 1];
        points[index].x += (target.x - points[index].x) * 0.32;
        points[index].y += (target.y - points[index].y) * 0.32;
        dot.style.opacity = active ? String(clamp(0.62 - index * 0.045, 0.12, 0.62)) : "0";
        dot.style.transform = `translate(${points[index].x}px, ${points[index].y}px)`;
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  function toast(message) {
    const element = $("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => element.classList.remove("show"), 2400);
  }

  function objectLabel(object) {
    const text = object.classList.contains("object-card-mini")
      ? object.querySelector("strong")?.textContent
      : object.textContent;
    return (text || object.dataset.object).trim().slice(0, 36);
  }

  function pickColor() {
    return ["#21d7c4", "#ff6b6b", "#f8d84a", "#a8ff60", "#ff8cc6", "#f5f7ff"][Math.floor(Math.random() * 6)];
  }

  function readable(value) {
    return String(value || "").split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }

  function normalizeColor(value) {
    if (!value) return "#f5f7ff";
    if (value.startsWith("#")) return value.slice(0, 7);
    return rgbToHex(value);
  }

  function rgbToHex(rgb) {
    const values = String(rgb).match(/\d+/g);
    if (!values || values.length < 3) return "#f5f7ff";
    return `#${values.slice(0, 3).map((value) => Number(value).toString(16).padStart(2, "0")).join("")}`;
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  init();
})();
