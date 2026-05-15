const APP_NAME = "Moonbeam Mind";
const SCALE = ["Never", "Rarely", "Sometimes", "Often", "Very often"];
const ANSWERS_KEY = "moonbeam-mind-answers";
const DRAFT_KEY = "moonbeam-mind-draft";
const STORIES_KEY = "moonbeam-mind-stories";

const CATEGORY_DETAILS = {
  "Executive Function": "planning, starting, finishing, and organizing tasks",
  "Attention & Stimulation": "focus shifting, novelty seeking, and attention regulation",
  "Emotional Regulation": "intensity, overwhelm, and mood recovery",
  "Social Communication": "reading cues, pacing conversations, and social strain",
  "Sensory Processing": "sound, light, texture, and other sensory sensitivity",
  "Routine & Repetition": "comfort with sameness, repetition, and predictability",
  "Energy & Recovery": "fatigue, burnout, rest, and post-effort recovery"
};

const CATEGORY_COLORS = {
  "Executive Function": ["#8b7bff", "#5de2e7", "#ffc46b"],
  "Attention & Stimulation": ["#6f8cff", "#63f1cc", "#ffd36f"],
  "Emotional Regulation": ["#ff7a9e", "#ffb36b", "#ffd86f"],
  "Social Communication": ["#79a9ff", "#84f1ff", "#c3b6ff"],
  "Sensory Processing": ["#ff9ec9", "#8ef1ff", "#ffe58c"],
  "Routine & Repetition": ["#a68bff", "#8bd8ff", "#f9cf7c"],
  "Energy & Recovery": ["#8f87ff", "#78f0d1", "#ffb88a"]
};

const QUESTION_BANK = {
  "Executive Function": [
    "Do you have trouble starting important tasks even when you want to do them?",
    "Do you lose track of steps in multi-step tasks?",
    "Do deadlines feel hard to estimate or manage?",
    "Do you forget what you were doing when interrupted?",
    "Do small chores pile up until they feel overwhelming?",
    "Do you struggle to prioritize what to do first?",
    "Do you need external pressure to begin tasks?",
    "Do you feel mentally blocked when switching from rest to responsibility?"
  ],
  "Attention & Stimulation": [
    "Does your attention swing between intense focus and complete drift?",
    "Do you seek stimulation when tasks feel boring or repetitive?",
    "Do you get distracted by unrelated thoughts while trying to focus?",
    "Do you jump between tabs, apps, or tasks without meaning to?",
    "Do you feel restless when you have to stay with one task too long?",
    "Do you miss details because your mind moves ahead too quickly?",
    "Do you interrupt yourself by chasing a new idea before finishing the first one?",
    "Do you feel more focused when there is novelty, urgency, or challenge?"
  ],
  "Emotional Regulation": [
    "Do emotions rise quickly and feel difficult to slow down?",
    "Do small frustrations sometimes hit you harder than expected?",
    "Do you replay upsetting moments for a long time?",
    "Do you need longer than others to recover after emotional stress?",
    "Do you feel easily overwhelmed when several demands happen at once?",
    "Do you shut down or withdraw when feelings become too intense?",
    "Do you feel shame or self-criticism after struggling with everyday tasks?",
    "Do you notice emotional exhaustion after masking or pushing through the day?"
  ],
  "Social Communication": [
    "Do conversations feel hard to pace naturally?",
    "Do you worry you are misunderstood even when you try to be clear?",
    "Do you miss subtle tone shifts, hints, or body language?",
    "Do social interactions leave you mentally drained afterward?",
    "Do you rehearse what to say before or after conversations?",
    "Do group settings feel harder than one-on-one conversations?",
    "Do you struggle to know when to join in or stop talking?",
    "Do you feel like you perform or mask to seem more socially comfortable?"
  ],
  "Sensory Processing": [
    "Do sounds, lights, smells, or textures become overwhelming faster than they seem to for others?",
    "Do crowded places make it hard to think clearly?",
    "Do certain fabrics, tags, or textures bother you intensely?",
    "Do you need to control your environment to stay comfortable or calm?",
    "Do background noises make focusing much harder?",
    "Do you feel physically tense when sensory input builds up?",
    "Do you avoid places because they feel too bright, loud, or busy?",
    "Do you need quiet time after sensory overload?"
  ],
  "Routine & Repetition": [
    "Do changes to plans feel more stressful than they seem to for others?",
    "Do you rely on routines to feel calm or functional?",
    "Do repeated actions, phrases, or habits help you regulate?",
    "Do you feel unsettled when things are not done in a familiar way?",
    "Do you revisit the same interests, topics, or comforts repeatedly?",
    "Do you find transitions easier when you can predict what happens next?",
    "Do you feel safer when your environment is structured and consistent?",
    "Do interruptions to a routine affect your mood for the rest of the day?"
  ],
  "Energy & Recovery": [
    "Do you feel unusually drained after tasks that look small from the outside?",
    "Do busy days take longer than expected to recover from?",
    "Do you push through until you crash instead of noticing limits earlier?",
    "Do you need more recovery time after social, sensory, or mental effort?",
    "Do you wake up tired even after rest when life feels demanding?",
    "Do you have cycles of high output followed by shutdown or burnout?",
    "Do you struggle to tell whether you need stimulation, rest, food, or quiet?"
  ]
};

const questions = Object.entries(QUESTION_BANK).flatMap(([category, items]) =>
  items.map((text) => ({ category, text }))
);

const els = {
  progressRing: document.getElementById("progressRing"),
  progressPercent: document.getElementById("progressPercent"),
  progressText: document.getElementById("progressText"),
  heroInsight: document.getElementById("heroInsight"),
  categoryFilter: document.getElementById("categoryFilter"),
  focusBtn: document.getElementById("focusBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  focusLabel: document.getElementById("focusLabel"),
  questionList: document.getElementById("questionList"),
  summaryBtn: document.getElementById("summaryBtn"),
  resetBtn: document.getElementById("resetBtn"),
  answeredMetric: document.getElementById("answeredMetric"),
  averageMetric: document.getElementById("averageMetric"),
  liveBars: document.getElementById("liveBars"),
  trail: document.getElementById("trail"),
  dynamicInsight: document.getElementById("dynamicInsight"),
  summaryBadge: document.getElementById("summaryBadge"),
  summaryText: document.getElementById("summaryText"),
  summaryBars: document.getElementById("summaryBars"),
  whyInput: document.getElementById("whyInput"),
  dayInput: document.getElementById("dayInput"),
  helpInput: document.getElementById("helpInput"),
  whyCount: document.getElementById("whyCount"),
  dayCount: document.getElementById("dayCount"),
  helpCount: document.getElementById("helpCount"),
  storyMeterFill: document.getElementById("storyMeterFill"),
  storyMeterLabel: document.getElementById("storyMeterLabel"),
  saveReflectionBtn: document.getElementById("saveReflectionBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  saveStatus: document.getElementById("saveStatus"),
  savedBoard: document.getElementById("savedBoard"),
  fx: document.getElementById("fx")
};

const state = {
  answers: loadAnswers(),
  draft: loadDraft(),
  stories: loadStories(),
  filter: "All",
  focus: false,
  activeIndex: 0,
  pointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
};

function loadAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(ANSWERS_KEY) || "null");
    if (Array.isArray(saved) && saved.length === questions.length) {
      return saved.map((v) => (typeof v === "number" ? v : null));
    }
  } catch {}
  return Array(questions.length).fill(null);
}

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
  } catch {
    return {};
  }
}

function loadStories() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORIES_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveAnswers() {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(state.answers));
}

function saveDraft() {
  state.draft = {
    why: els.whyInput.value,
    day: els.dayInput.value,
    help: els.helpInput.value
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(state.draft));
}

function saveStories() {
  localStorage.setItem(STORIES_KEY, JSON.stringify(state.stories));
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, "<br>");
}

function categoryList() {
  return ["All", ...Object.keys(QUESTION_BANK)];
}

function visibleIndexes() {
  const all = questions
    .map((q, i) => ({ q, i }))
    .filter((item) => state.filter === "All" || item.q.category === state.filter)
    .map((item) => item.i);

  if (!all.length) return [];
  if (!all.includes(state.activeIndex)) state.activeIndex = all[0];
  return state.focus ? [state.activeIndex] : all;
}

function filteredIndexes() {
  return questions
    .map((q, i) => ({ q, i }))
    .filter((item) => state.filter === "All" || item.q.category === state.filter)
    .map((item) => item.i);
}

function buildFilter() {
  els.categoryFilter.innerHTML = categoryList()
    .map((name) => `<option value="${name}">${name === "All" ? "All categories" : name}</option>`)
    .join("");
  els.categoryFilter.value = state.filter;
}

function renderQuestions() {
  const indexes = visibleIndexes();

  if (!indexes.length) {
    els.questionList.innerHTML = '<div class="saved-empty">No questions match this filter.</div>';
    syncControls();
    return;
  }

  els.questionList.innerHTML = indexes.map((index) => {
    const q = questions[index];
    const scale = SCALE.map((label, value) => `
      <label class="${state.answers[index] === value ? "selected" : ""}" data-index="${index}" data-value="${value}">
        <input type="radio" name="q-${index}" value="${value}" ${state.answers[index] === value ? "checked" : ""}>
        <strong>${value}</strong>
        <small>${label}</small>
      </label>
    `).join("");

    return `
      <article class="question-card ${state.activeIndex === index ? "active" : ""} ${state.answers[index] !== null ? "answered" : ""}" id="q-${index}">
        <div class="question-top">
          <div class="num">${index + 1}</div>
          <div>
            <p class="question-text">${q.text}</p>
            <span class="tag">${q.category}</span>
          </div>
        </div>
        <div class="scale">${scale}</div>
      </article>
    `;
  }).join("");

  syncControls();
}

function syncControls() {
  const indexes = filteredIndexes();
  const pos = indexes.indexOf(state.activeIndex);

  els.focusBtn.textContent = `Focus mode: ${state.focus ? "On" : "Off"}`;
  els.prevBtn.disabled = pos <= 0;
  els.nextBtn.disabled = pos === -1 || pos >= indexes.length - 1;

  if (!indexes.length) {
    els.focusLabel.textContent = "No visible questions";
  } else if (!state.focus) {
    els.focusLabel.textContent = state.filter === "All"
      ? `Showing all ${indexes.length} questions`
      : `Showing ${indexes.length} in ${state.filter}`;
  } else {
    els.focusLabel.textContent = `Focus question ${pos + 1} of ${indexes.length}`;
  }
}

function jump(step) {
  const indexes = filteredIndexes();
  if (!indexes.length) return;
  const pos = indexes.indexOf(state.activeIndex);
  const nextPos = Math.max(0, Math.min(indexes.length - 1, (pos === -1 ? 0 : pos) + step));
  state.activeIndex = indexes[nextPos];
  renderQuestions();
  document.getElementById(`q-${state.activeIndex}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function answeredValues() {
  return state.answers.filter((v) => v !== null);
}

function categoryStats() {
  return Object.keys(QUESTION_BANK).map((category) => {
    let total = 0;
    let answered = 0;
    questions.forEach((q, index) => {
      if (q.category !== category) return;
      const v = state.answers[index];
      if (v !== null) {
        total += v;
        answered += 1;
      }
    });
    const avg = answered ? total / answered : 0;
    return {
      category,
      answered,
      avg,
      pct: (avg / 4) * 100
    };
  });
}

function dominantCategory() {
  return categoryStats()
    .filter((item) => item.answered > 0)
    .sort((a, b) => b.avg - a.avg)[0] || null;
}

function applyTheme() {
  const dom = dominantCategory();
  const colors = CATEGORY_COLORS[dom?.category || "Executive Function"];
  document.documentElement.style.setProperty("--accent", colors[0]);
  document.documentElement.style.setProperty("--accent2", colors[1]);
  document.documentElement.style.setProperty("--accent3", colors[2]);
}

function renderBars(target) {
  const stats = categoryStats();
  target.innerHTML = stats.map((item) => `
    <div class="bar-row">
      <div class="bar-top">
        <span>${item.category}</span>
        <span>${item.answered ? item.avg.toFixed(1) : "0.0"} / 4</span>
      </div>
      <div class="track"><div class="fill" style="width:${item.pct}%"></div></div>
    </div>
  `).join("");
}

function renderTrail() {
  els.trail.innerHTML = state.answers.map((value, index) => `
    <button
      type="button"
      class="${state.activeIndex === index ? "current" : ""}"
      data-jump="${index}"
      data-level="${value === null ? 0 : value}"
      title="Question ${index + 1}${value === null ? "" : ` • ${SCALE[value]}`}"
    ></button>
  `).join("");
}

function updateMetrics() {
  const answered = answeredValues();
  const count = answered.length;
  const pct = Math.round((count / questions.length) * 100);
  const avg = count ? (answered.reduce((a, b) => a + b, 0) / count).toFixed(1) : "0.0";

  els.progressRing.style.background = `conic-gradient(var(--accent2) ${pct}%, rgba(255,255,255,.08) ${pct}% 100%)`;
  els.progressPercent.textContent = `${pct}%`;
  els.progressText.textContent = `${count} of ${questions.length} answered`;
  els.answeredMetric.textContent = `${count} / ${questions.length}`;
  els.averageMetric.textContent = `${avg} / 4.0`;

  const dom = dominantCategory();
  if (!dom) {
    els.heroInsight.textContent = "Answer a few questions to reveal your strongest current pattern.";
    els.dynamicInsight.textContent = "As you answer, this will highlight which area seems to stand out most right now.";
    return;
  }

  const phase = pct < 25 ? "early" : pct < 60 ? "forming" : "clearer";
  els.heroInsight.textContent = `${dom.category} is currently your strongest area (${dom.avg.toFixed(1)} / 4).`;
  els.dynamicInsight.textContent = `Your picture is ${phase}. ${dom.category} stands out most, which may reflect ${CATEGORY_DETAILS[dom.category]}. Focus mode can help you move through one prompt at a time.`;
}

function renderSummary() {
  const stats = categoryStats().filter((item) => item.answered > 0).sort((a, b) => b.avg - a.avg);
  renderBars(els.summaryBars);

  if (!stats.length) {
    els.summaryBadge.textContent = "Complete the questionnaire";
    els.summaryBadge.className = "pill neutral";
    els.summaryText.textContent = "Finish some questions and this section will summarize broad themes that appear strongest for you right now.";
    return;
  }

  const top = stats[0];
  const next = stats[1];
  const label = top.avg >= 3 ? "Strong pattern" : top.avg >= 2 ? "Moderate pattern" : "Early signal";
  els.summaryBadge.textContent = label;
  els.summaryBadge.className = "pill";

  const comparison = next
    ? `The next strongest area is ${next.category} at ${next.avg.toFixed(1)} / 4.`
    : "More categories will compare as you answer more items.";

  els.summaryText.textContent = `${top.category} currently stands out most at ${top.avg.toFixed(1)} / 4, which may reflect ${CATEGORY_DETAILS[top.category]}. ${comparison} This summary is for reflection, not diagnosis.`;
}

function updateStoryUI() {
  const why = els.whyInput.value.trim();
  const day = els.dayInput.value.trim();
  const help = els.helpInput.value.trim();

  els.whyCount.textContent = `${why.length} characters`;
  els.dayCount.textContent = `${day.length} characters`;
  els.helpCount.textContent = `${help.length} characters`;

  const total = why.length + day.length + help.length;
  const pct = Math.min(100, Math.round((total / 900) * 100));
  els.storyMeterFill.style.width = `${pct}%`;
  els.storyMeterLabel.textContent = `${pct}% complete`;
}

function renderSavedBoard() {
  if (!state.stories.length) {
    els.savedBoard.innerHTML = '<div class="saved-empty">No saved reflections yet. Your entries stay in this browser unless you export them.</div>';
    return;
  }

  els.savedBoard.innerHTML = state.stories
    .slice()
    .reverse()
    .map((entry) => `
      <article class="saved-card">
        <div class="saved-meta">
          <span>${new Date(entry.timestamp).toLocaleString()}</span>
          <span>${entry.total} characters</span>
        </div>
        <h4>Why this feels familiar</h4>
        <p>${escapeHtml(entry.why || "—")}</p>
        <h4>Day-to-day life</h4>
        <p>${escapeHtml(entry.day || "—")}</p>
        <h4>Validation and support</h4>
        <p>${escapeHtml(entry.help || "—")}</p>
      </article>
    `).join("");
}

function saveReflection() {
  const payload = {
    timestamp: Date.now(),
    why: els.whyInput.value.trim(),
    day: els.dayInput.value.trim(),
    help: els.helpInput.value.trim()
  };
  payload.total = payload.why.length + payload.day.length + payload.help.length;

  if (!payload.total) {
    els.saveStatus.textContent = "Write something first, then save your reflection.";
    return;
  }

  state.stories.push(payload);
  saveStories();
  renderSavedBoard();
  els.saveStatus.textContent = "Reflection saved locally on this device.";
}

function downloadReflection() {
  const text = [
    `${APP_NAME} Reflection`,
    "",
    `Saved: ${new Date().toLocaleString()}`,
    "",
    "Why this feels familiar:",
    els.whyInput.value || "",
    "",
    "Day-to-day life:",
    els.dayInput.value || "",
    "",
    "Validation / support:",
    els.helpInput.value || ""
  ].join("\n");

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "moonbeam-mind-reflection.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function resetAll() {
  if (!confirm("Reset all answers and clear the saved draft text?")) return;
  state.answers = Array(questions.length).fill(null);
  saveAnswers();
  [els.whyInput, els.dayInput, els.helpInput].forEach((el) => { el.value = ""; });
  saveDraft();
  renderQuestions();
  renderTrail();
  renderBars(els.liveBars);
  renderSummary();
  updateMetrics();
  updateStoryUI();
  els.saveStatus.textContent = "Answers and draft reset. Saved reflection cards were kept.";
}

function bindEvents() {
  els.categoryFilter.addEventListener("change", (e) => {
    state.filter = e.target.value;
    renderQuestions();
  });

  els.focusBtn.addEventListener("click", () => {
    state.focus = !state.focus;
    renderQuestions();
  });

  els.prevBtn.addEventListener("click", () => jump(-1));
  els.nextBtn.addEventListener("click", () => jump(1));

  els.questionList.addEventListener("change", (e) => {
    const input = e.target.closest('input[type="radio"]');
    if (!input) return;
    const index = Number(input.name.replace("q-", ""));
    state.answers[index] = Number(input.value);
    state.activeIndex = index;
    saveAnswers();
    renderQuestions();
    renderTrail();
    renderBars(els.liveBars);
    applyTheme();
    updateMetrics();
    renderSummary();
  });

  els.trail.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-jump]");
    if (!btn) return;
    state.activeIndex = Number(btn.dataset.jump);
    if (!filteredIndexes().includes(state.activeIndex)) state.filter = "All";
    els.categoryFilter.value = state.filter;
    renderQuestions();
    document.getElementById(`q-${state.activeIndex}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    renderTrail();
  });

  els.summaryBtn.addEventListener("click", () => {
    renderSummary();
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.resetBtn.addEventListener("click", resetAll);

  [els.whyInput, els.dayInput, els.helpInput].forEach((input) => {
    input.addEventListener("input", () => {
      saveDraft();
      updateStoryUI();
      els.saveStatus.textContent = "Draft auto-saved in this browser.";
    });
  });

  els.saveReflectionBtn.addEventListener("click", saveReflection);
  els.downloadBtn.addEventListener("click", downloadReflection);

  window.addEventListener("mousemove", (e) => {
    state.pointer.x = e.clientX;
    state.pointer.y = e.clientY;
  });

  window.addEventListener("resize", () => resizeFx(true));
}

function applyDraftToFields() {
  els.whyInput.value = state.draft.why || "";
  els.dayInput.value = state.draft.day || "";
  els.helpInput.value = state.draft.help || "";
}

let fxCtx;
let stars = [];

function resizeFx(reset = false) {
  const ratio = window.devicePixelRatio || 1;
  const canvas = els.fx;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  fxCtx = canvas.getContext("2d");
  fxCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

  if (reset || !stars.length) {
    stars = Array.from({ length: 36 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4
    }));
  }
}

function animateFx() {
  if (!fxCtx) return requestAnimationFrame(animateFx);
  const answered = answeredValues().length;
  const energy = answered / questions.length;
  fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((s, i) => {
    const pullX = (state.pointer.x - s.x) * 0.00003 * (1 + energy * 5);
    const pullY = (state.pointer.y - s.y) * 0.00003 * (1 + energy * 5);
    s.dx += pullX;
    s.dy += pullY;
    s.dx *= 0.995;
    s.dy *= 0.995;
    s.x += s.dx;
    s.y += s.dy;

    if (s.x < -20) s.x = window.innerWidth + 20;
    if (s.x > window.innerWidth + 20) s.x = -20;
    if (s.y < -20) s.y = window.innerHeight + 20;
    if (s.y > window.innerHeight + 20) s.y = -20;

    fxCtx.beginPath();
    fxCtx.arc(s.x, s.y, s.r + energy * 1.5, 0, Math.PI * 2);
    fxCtx.fillStyle = i % 3 === 0 ? "rgba(139,123,255,.35)" : i % 3 === 1 ? "rgba(93,226,231,.28)" : "rgba(255,196,107,.24)";
    fxCtx.fill();
  });

  requestAnimationFrame(animateFx);
}

function init() {
  if (questions.length !== 55) {
    console.warn(`Expected 55 questions, got ${questions.length}.`);
  }

  buildFilter();
  applyDraftToFields();
  renderQuestions();
  renderTrail();
  renderBars(els.liveBars);
  renderSummary();
  renderSavedBoard();
  updateStoryUI();
  applyTheme();
  updateMetrics();
  bindEvents();
  resizeFx(true);
  animateFx();
}

init();