const app = document.querySelector('#app');

let token = localStorage.getItem('taskforge_token') || '';
let activeUser = JSON.parse(localStorage.getItem('taskforge_user') || 'null');
let workspace = JSON.parse(localStorage.getItem('taskforge_workspace') || 'null');
let summary = JSON.parse(localStorage.getItem('taskforge_summary') || 'null');
let activePreviewTask = null;
let theme = localStorage.getItem('taskforge_theme') || 'dark';
let pdfPalette = localStorage.getItem('taskforge_pdf_palette') || 'executive';
let notifications = JSON.parse(localStorage.getItem('taskforge_notifications') || '[]');
let todos = JSON.parse(localStorage.getItem('taskforge_todos') || '[]');
let pomodoro = JSON.parse(localStorage.getItem('taskforge_pomodoro') || 'null') || {
  mode: 'Focus',
  duration: 25 * 60,
  remaining: 25 * 60,
  running: false,
  startedAt: 0,
};

const lanes = ['Backlog', 'Doing', 'Review', 'Done'];
const plans = [
  ['Little Smithy', 299, 'Small teams shaping one active product.'],
  ['Squad Smith', 899, 'Cross-functional squads with reporting and permissions.'],
  ['Forge House', 2400, 'Portfolio governance, approvals, and executive health views.'],
];
const commandItems = [
  ['Risk radar', 'High-priority cards are surfaced before they become blocked work.', '92%'],
  ['Standup brief', 'A concise daily narrative generated from movement across the board.', '06:45'],
  ['Decision queue', 'Unclear tasks move into a dedicated shaping queue for PM review.', '7'],
];
const timeline = [
  ['Discovery', 'Map requests and score effort'],
  ['Sprint Alpha', 'Ship core workflow and collect signal'],
  ['Review Gate', 'Stakeholder readout and scope control'],
  ['Launch', 'Release with evidence and owner handoff'],
];
const pdfPalettes = [
  ['executive', 'Executive violet'],
  ['ocean', 'Ocean cyan'],
  ['ember', 'Ember gold'],
  ['mono', 'Monochrome'],
];
const pomodoroModes = {
  Focus: 25 * 60,
  Break: 5 * 60,
  Deep: 50 * 60,
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function money(value) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(value);
}

function currentReport() {
  return workspace?.notes?.[0]?.report || null;
}

function authHeaders({ json = false } = {}) {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  if (activeUser?.email) headers['X-Demo-User-Email'] = activeUser.email;
  if (activeUser?.name) headers['X-Demo-User-Name'] = activeUser.name;
  return headers;
}

function showStatus(selector, message) {
  const target = document.querySelector(selector);
  if (target) target.textContent = message;
}

function routeTo(path) {
  const route = path === '/' ? '' : path.replace(/^\//, '');
  history.pushState({}, '', route ? `#${route}` : location.pathname.replace(location.hash, ''));
  render();
}

function pathName() {
  const hashRoute = location.hash.replace(/^#\/?/, '');
  const path = hashRoute ? `/${hashRoute}` : '/';
  return ['/', '/login', '/boards'].includes(path) ? path : '/';
}

function addNotification(message, type = 'update') {
  notifications = [
    {
      id: crypto.randomUUID(),
      message,
      type,
      time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
    },
    ...notifications,
  ].slice(0, 8);
  persist();
}

function notificationPanel() {
  return `
    <aside class="notification-panel">
      <div>
        <span class="eyebrow">Notifications</span>
        <h3>Workspace activity</h3>
      </div>
      <div class="notification-list">
        ${notifications.length ? notifications.map((item) => `
          <article>
            <span>${escapeHtml(item.time)}</span>
            <p>${escapeHtml(item.message)}</p>
          </article>
        `).join('') : '<p>No updates yet. Board moves, todos, reports, and timer sessions appear here.</p>'}
      </div>
    </aside>
  `;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function currentPomodoroRemaining() {
  if (!pomodoro.running) return pomodoro.remaining;
  return Math.max(0, pomodoro.remaining - ((Date.now() - pomodoro.startedAt) / 1000));
}

function reportPreview(report) {
  if (!report) return '';
  return `
    <div class="report-preview">
      <div class="report-topline">
        <span>${escapeHtml(report.status)} status</span>
        <strong>${escapeHtml(report.deliveryScore)}%</strong>
      </div>
      <h4>${escapeHtml(report.title)}</h4>
      <p>${escapeHtml(report.executiveSummary)}</p>
      <div class="report-metrics">
        ${report.metrics.map((metric) => `
          <article>
            <span>${escapeHtml(metric.label)}</span>
            <strong>${escapeHtml(metric.value)}</strong>
            <small>${escapeHtml(metric.detail)}</small>
          </article>
        `).join('')}
      </div>
      <div class="report-sections">
        ${report.sections.map((section) => `
          <details ${section.heading === 'Risks and blockers' || section.heading === 'Recommended next moves' ? 'open' : ''}>
            <summary>${escapeHtml(section.heading)}</summary>
            <ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </details>
        `).join('')}
      </div>
    </div>
  `;
}

function reportToText(report) {
  return [
    report.title,
    `Date: ${report.date}`,
    `Status: ${report.status}`,
    `Delivery score: ${report.deliveryScore}%`,
    '',
    'Executive summary',
    report.executiveSummary,
    '',
    'Metrics',
    ...report.metrics.map((metric) => `${metric.label}: ${metric.value} - ${metric.detail}`),
    '',
    ...report.sections.flatMap((section) => [
      section.heading,
      ...section.items.map((item) => `- ${item}`),
      '',
    ]),
  ].join('\n');
}

function nav() {
  return `
    <nav class="nav">
      <a class="brand" href="/" data-route><img class="brand-logo" src="assets/logo.svg" alt="SprintSmith logo" />SprintSmith</a>
      <div class="nav-links">
        <a href="/boards" data-route>Boards</a>
        <a href="/login" data-route>Login</a>
        <a href="/#command">Command</a>
        <a href="/#plans">Plans</a>
        <a href="/boards#portal" data-route>Portal</a>
      </div>
      <div class="nav-actions">
        <button class="theme-toggle" id="theme-toggle" type="button" aria-pressed="${theme === 'light'}">${theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
        <a class="nav-cta" href="${activeUser ? '/boards' : '/login'}" data-route>${activeUser ? activeUser.name : 'Create workspace'}</a>
      </div>
    </nav>
  `;
}

function hero() {
  const tasks = workspace?.tasks || demoTasks();
  const featuredTask = tasks.find((task) => task.id === activePreviewTask) || tasks.find((task) => task.status === 'Review') || tasks[0];
  return `
    <section id="top" class="hero">
      <div class="hero-copy">
        <span class="eyebrow">SaaS operating system for product teams</span>
        <h1>Turn scattered work into a clear sprint rhythm.</h1>
        <p>SprintSmith is a quirky product workshop for serious teams: shape messy requests, hammer tasks into lanes, and forge clean sprint summaries before standup.</p>
        <div class="hero-actions">
          <a class="cta" href="/login" data-route>Create demo workspace</a>
          <a class="ghost" href="/boards" data-route>Open project boards</a>
        </div>
      </div>
      <div class="hero-visual">
        <img src="assets/team-1.jpg" alt="Product team planning a sprint" />
        <div class="hero-insight">
          <span>Selected card</span>
          <strong>${featuredTask.title}</strong>
          <p>${featuredTask.status} by ${featuredTask.owner}. Priority: ${featuredTask.priority}.</p>
        </div>
        <div class="hero-board">${boardMarkup(tasks)}</div>
      </div>
    </section>
  `;
}

function demoTasks() {
  return [
    { id: 'd1', title: 'Map onboarding journey', owner: 'Nadia', status: 'Backlog', days: 2, priority: 'High' },
    { id: 'd2', title: 'Polish executive dashboard', owner: 'Leo', status: 'Doing', days: 1, priority: 'High' },
    { id: 'd3', title: 'QA empty state language', owner: 'Sam', status: 'Review', days: 1, priority: 'Low' },
    { id: 'd4', title: 'Ship responsive workspace', owner: 'Mila', status: 'Done', days: 0, priority: 'High' },
  ];
}

function boardMarkup(tasks) {
  return lanes.map((lane) => `
    <div class="lane">
      <h3>${lane}</h3>
      ${tasks.filter((task) => task.status === lane).map(taskCard).join('') || '<p class="empty">No tasks</p>'}
    </div>
  `).join('');
}

function taskCard(task) {
  return `
    <article class="task-card ${task.id === activePreviewTask ? 'is-active' : ''}" draggable="true" data-task="${task.id}">
      <b>${task.title}</b>
      <span>${task.owner} · ${task.days}d</span>
      <em>${task.priority}</em>
      ${token ? `<div class="move-row">${lanes.filter((lane) => lane !== task.status).map((lane) => `<button type="button" data-move="${task.id}" data-status="${lane}">${lane}</button>`).join('')}</div>` : ''}
    </article>
  `;
}

function workspaceSection() {
  const tasks = workspace?.tasks || demoTasks();
  const data = summary || { backlog: 2, doing: 1, review: 1, done: 1, health: 'Watch' };
  return `
    <section id="workspace" class="section workspace">
      <div class="section-header">
        <span class="eyebrow">Live workspace</span>
        <h2>Board, health, and team signals in one operating view.</h2>
      </div>
      <div class="metrics">
        <article><span>Backlog</span><strong>${data.backlog}</strong><p>ideas waiting for shaping</p></article>
        <article><span>Doing</span><strong>${data.doing}</strong><p>active delivery work</p></article>
        <article><span>Health</span><strong>${data.health}</strong><p>sprint confidence</p></article>
      </div>
      <div class="full-board">${boardMarkup(tasks)}</div>
    </section>
  `;
}

function commandCenter() {
  return `
    <section id="command" class="section command">
      <div class="section-header">
        <span class="eyebrow">Sprint command center</span>
        <h2>One sleek surface for priorities, risks, and stakeholder-ready updates.</h2>
      </div>
      <div class="command-grid">
        <div class="command-panel">
          ${commandItems.map(([title, detail, metric]) => `<article><span>${title}</span><strong>${metric}</strong><p>${detail}</p></article>`).join('')}
        </div>
        <div class="heatmap">
          <h3>Priority heatmap</h3>
          <div class="heat-grid">
            ${Array.from({ length: 24 }, (_, index) => `<i style="--heat:${(index % 6) + 1}"></i>`).join('')}
          </div>
          <p>Heat levels combine age, owner load, priority, and sprint stage.</p>
        </div>
      </div>
    </section>
  `;
}

function forgeFlow() {
  return `
    <section id="forgeflow" class="section forgeflow">
      <div>
        <span class="eyebrow">ForgeFlow method</span>
        <h2>A unique rhythm for shaping, shipping, and reviewing work.</h2>
        <p>SprintSmith is built around three loops: shape the next decision, ship the smallest useful slice, then review evidence before expanding scope.</p>
      </div>
      <div class="flow-steps">
        <article><b>01</b><h3>Shape</h3><p>Turn unclear requests into scored, owner-ready cards.</p></article>
        <article><b>02</b><h3>Ship</h3><p>Move work with clear status, priority, and delivery risk.</p></article>
        <article><b>03</b><h3>Review</h3><p>Generate sprint notes and executive summaries from the board.</p></article>
      </div>
    </section>
  `;
}

function teamStory() {
  return `
    <section class="section team-story">
      <div class="story-card large"><img src="assets/team-2.jpg" alt="Team collaborating around a laptop" /><h3>Less chaos before standup</h3><p>Teams can see what is shaped, what is moving, and what needs review without opening five different tools.</p></div>
      <div class="story-stack">
        <article class="story-card"><img src="assets/team-3.jpg" alt="Workspace planning session" /><h3>Board-first planning</h3><p>Every workspace starts from a visible board and grows into reporting only when needed.</p></article>
        <article class="story-card"><img src="assets/team-4.jpg" alt="Team meeting in bright office" /><h3>Leadership-ready summaries</h3><p>Generate a crisp sprint focus note for founders, PMs, and client stakeholders.</p></article>
      </div>
    </section>
  `;
}

function launchTimeline() {
  return `
    <section class="section launch">
      <div>
        <span class="eyebrow">Launch timeline</span>
        <h2>Make progress visible before anyone asks for a status update.</h2>
      </div>
      <div class="timeline">
        ${timeline.map(([title, detail], index) => `<article><b>0${index + 1}</b><h3>${title}</h3><p>${detail}</p></article>`).join('')}
      </div>
    </section>
  `;
}

function plansSection() {
  return `
    <section id="plans" class="section plans">
      <div class="section-header">
        <span class="eyebrow">SaaS packages</span>
        <h2>Plans that scale from solo product builder to portfolio team.</h2>
      </div>
      <div class="plan-grid">
        ${plans.map(([name, price, detail]) => `<article><span>${money(price)} / month</span><h3>${name}</h3><p>${detail}</p><button type="button" data-plan="${name}">Select plan</button></article>`).join('')}
      </div>
    </section>
  `;
}

function portal() {
  const boardHasReviewedWork = Boolean(summary?.reportReady || workspace?.tasks?.some((task) => task.status === 'Review' || task.status === 'Done'));
  const reportReady = Boolean(token && boardHasReviewedWork);
  const report = currentReport();
  const reportText = workspace?.notes?.[0]?.text
    || (reportReady
      ? 'AI automatic report is available because work is in Review or Done.'
      : !token
        ? 'Create or log into a workspace, then move work into Review or Done to unlock reports.'
      : 'Move at least one task to Review or Done to unlock the AI automatic report generator.');
  return `
    <section id="portal" class="section portal">
      <div class="section-header">
        <span class="eyebrow">Workspace portal</span>
        <h2>Create a workspace, add work, generate sprint focus.</h2>
      </div>
      <div class="portal-grid">
        <form class="portal-card" id="auth-form">
          <h3>${activeUser ? `Welcome, ${activeUser.name}` : 'Create account / login'}</h3>
          <input name="name" placeholder="Name" value="${activeUser?.name || ''}" />
          <input name="email" type="email" placeholder="Email" value="${activeUser?.email || ''}" required />
          <input name="password" type="password" placeholder="Password" required />
          <div class="button-row">
            <button name="mode" value="register">Create workspace</button>
            <button name="mode" value="login">Login</button>
          </div>
          <p id="auth-status">${activeUser ? 'Workspace session active.' : 'Use any demo email and password.'}</p>
        </form>
        <form class="portal-card" id="task-form">
          <h3>Add a task</h3>
          <input name="title" placeholder="Task title" required />
          <input name="owner" placeholder="Owner" />
          <select name="priority"><option>High</option><option>Medium</option><option>Low</option></select>
          <button>Add to backlog</button>
          <p id="task-status"></p>
        </form>
        <article class="portal-card">
          <h3>AI automatic report</h3>
          <p id="summary-note">${reportText}</p>
          <span class="availability ${reportReady ? 'ready' : ''}">${reportReady ? 'Ready for reviewed work' : token ? 'Available after Review or Done' : 'Login required'}</span>
          <label class="field-label" for="pdf-palette">PDF color palette</label>
          <select id="pdf-palette">
            ${pdfPalettes.map(([value, label]) => `<option value="${value}" ${value === pdfPalette ? 'selected' : ''}>${label}</option>`).join('')}
          </select>
          <div class="button-row">
            <button type="button" id="summary-button" ${reportReady ? '' : 'disabled'}>${report ? 'Refresh report' : reportReady ? 'Generate report' : token ? 'Move task to Review/Done first' : 'Login to generate reports'}</button>
            <button type="button" id="download-report" ${reportReady ? '' : 'disabled'}>Download detailed PDF</button>
          </div>
          ${reportPreview(report)}
        </article>
      </div>
    </section>
  `;
}

function loginPage() {
  return `
    <section class="page login-page">
      <div class="login-copy">
        <span class="eyebrow">Secure workspace access</span>
        <h1>Sign in to your SprintSmith command room.</h1>
        <p>Create a demo workspace or log back in to manage project boards, reports, todos, notifications, and focus sessions from one clean operating surface.</p>
        <div class="login-points">
          <article><b>01</b><span>Live board controls</span></article>
          <article><b>02</b><span>Detailed PDF reports</span></article>
          <article><b>03</b><span>Focus timer and todos</span></article>
        </div>
      </div>
      <form class="portal-card auth-card" id="auth-form">
        <h3>${activeUser ? `Welcome back, ${activeUser.name}` : 'Create account / login'}</h3>
        <input name="name" placeholder="Name" value="${activeUser?.name || ''}" />
        <input name="email" type="email" placeholder="Email" value="${activeUser?.email || ''}" required />
        <input name="password" type="password" placeholder="Password" required />
        <div class="button-row">
          <button name="mode" value="register">Create workspace</button>
          <button name="mode" value="login">Login</button>
        </div>
        <p id="auth-status">${activeUser ? 'Workspace session active.' : 'Use any demo email and password.'}</p>
      </form>
    </section>
  `;
}

function taskFormCard() {
  return `
    <form class="portal-card" id="task-form">
      <h3>Add project task</h3>
      <input name="title" placeholder="Task title" required />
      <input name="owner" placeholder="Owner" value="${activeUser?.name || ''}" />
      <select name="priority"><option>High</option><option>Medium</option><option>Low</option></select>
      <button>Add to backlog</button>
      <p id="task-status"></p>
    </form>
  `;
}

function reportCard() {
  const boardHasReviewedWork = Boolean(summary?.reportReady || workspace?.tasks?.some((task) => task.status === 'Review' || task.status === 'Done'));
  const reportReady = Boolean(token && boardHasReviewedWork);
  const report = currentReport();
  const reportText = workspace?.notes?.[0]?.text
    || (reportReady
      ? 'AI automatic report is available because work is in Review or Done.'
      : !token
        ? 'Login first, then move work into Review or Done to unlock reports.'
      : 'Move at least one task to Review or Done to unlock the AI report generator.');
  return `
    <article class="portal-card report-card" id="portal">
      <h3>AI report center</h3>
      <p id="summary-note">${reportText}</p>
      <span class="availability ${reportReady ? 'ready' : ''}">${reportReady ? 'Ready for reviewed work' : token ? 'Available after Review or Done' : 'Login required'}</span>
      <label class="field-label" for="pdf-palette">PDF color palette</label>
      <select id="pdf-palette">
        ${pdfPalettes.map(([value, label]) => `<option value="${value}" ${value === pdfPalette ? 'selected' : ''}>${label}</option>`).join('')}
      </select>
      <div class="button-row">
        <button type="button" id="summary-button" ${reportReady ? '' : 'disabled'}>${report ? 'Refresh report' : reportReady ? 'Generate report' : token ? 'Move task to Review/Done first' : 'Login to generate reports'}</button>
        <button type="button" id="download-report" ${reportReady ? '' : 'disabled'}>Download detailed PDF</button>
      </div>
      ${reportPreview(report)}
    </article>
  `;
}

function todoPanel() {
  return `
    <article class="portal-card todo-panel">
      <h3>Auto-sync todo list</h3>
      <form id="todo-form" class="inline-form">
        <input name="todo" placeholder="Add a todo and sync it to Backlog" required />
        <button>Add</button>
      </form>
      <ul class="todo-list">
        ${todos.length ? todos.map((todo) => `
          <li class="${todo.done ? 'is-done' : ''}">
            <label>
              <input type="checkbox" data-todo-toggle="${todo.id}" ${todo.done ? 'checked' : ''} />
              <span>${escapeHtml(todo.title)}</span>
            </label>
            <button type="button" data-todo-delete="${todo.id}">Remove</button>
          </li>
        `).join('') : '<li class="empty-row">No todos yet.</li>'}
      </ul>
    </article>
  `;
}

function pomodoroPanel() {
  return `
    <article class="portal-card pomodoro-card">
      <h3>Pomodoro focus</h3>
      <div class="timer-face">
        <span>${escapeHtml(pomodoro.mode)}</span>
        <strong id="pomodoro-time">${formatTime(currentPomodoroRemaining())}</strong>
        <p id="pomodoro-state">${pomodoro.running ? 'Focus session running' : 'Ready when you are'}</p>
      </div>
      <div class="segmented">
        ${Object.keys(pomodoroModes).map((mode) => `<button type="button" class="${pomodoro.mode === mode ? 'active' : ''}" data-pomodoro-mode="${mode}">${mode}</button>`).join('')}
      </div>
      <div class="button-row">
        <button type="button" id="pomodoro-start">Start</button>
        <button type="button" id="pomodoro-pause">Pause</button>
        <button type="button" id="pomodoro-reset">Reset</button>
      </div>
    </article>
  `;
}

function boardPage() {
  const tasks = workspace?.tasks || demoTasks();
  const data = summary || { backlog: 2, doing: 1, review: 1, done: 1, health: 'Watch' };
  return `
    <section class="page workspace-app" id="boards">
      <div class="app-header">
        <div>
          <span class="eyebrow">Interactive project boards</span>
          <h1>${activeUser ? `${activeUser.name}'s workspace` : 'Project operating board'}</h1>
          <p>Move cards, create synced todos, run focus sessions, and generate stakeholder-ready reports from one live board.</p>
        </div>
        <a class="cta" href="/login" data-route>${activeUser ? 'Switch account' : 'Login to sync'}</a>
      </div>
      <div class="workspace-stats">
        <article><span>Backlog</span><strong>${data.backlog}</strong></article>
        <article><span>Doing</span><strong>${data.doing}</strong></article>
        <article><span>Review</span><strong>${data.review || 0}</strong></article>
        <article><span>Done</span><strong>${data.done || 0}</strong></article>
        <article><span>Health</span><strong>${data.health}</strong></article>
      </div>
      <div class="board-layout">
        <main class="board-main">
          <div class="board-toolbar">
            <h2>Live project board</h2>
            <p>Use the status buttons on each card to move work through the delivery flow.</p>
          </div>
          <div class="full-board app-board">${boardMarkup(tasks)}</div>
        </main>
        <aside class="workspace-sidebar">
          ${taskFormCard()}
          ${todoPanel()}
          ${pomodoroPanel()}
          ${reportCard()}
          ${notificationPanel()}
        </aside>
      </div>
    </section>
  `;
}

function homePage() {
  return `${hero()}${commandCenter()}${forgeFlow()}${teamStory()}${launchTimeline()}${plansSection()}${liveData()}`;
}

function liveData() {
  return `
    <section id="live-data" class="section live-band">
      <div class="section-header">
        <span class="eyebrow">Backend connected</span>
        <h2>Live API for product operations.</h2>
      </div>
      <div class="metrics" id="site-metrics"></div>
      <div class="ops-panel"><b>Product activity</b><ul id="activity"></ul></div>
    </section>
  `;
}

function render() {
  document.body.dataset.theme = theme;
  const path = pathName();
  const page = path === '/login' ? loginPage() : path === '/boards' ? boardPage() : homePage();
  app.innerHTML = `<div class="site">${nav()}${page}${footer()}</div>`;
  wire();
  loadSite();
  if (token) loadWorkspace();
  if (window.location.hash) {
    requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth' }));
  }
}

function footer() {
  return `
    <footer class="site-footer">
      <div>
        <span>SprintSmith</span>
        <p>Clean product rhythm, forged with a little wit and a very serious respect for done work.</p>
      </div>
      <strong>A Quantum Cupcake Creation</strong>
    </footer>
  `;
}

function wire() {
  document.querySelectorAll('[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    routeTo(link.getAttribute('href'));
  }));
  document.querySelector('#auth-form')?.addEventListener('submit', auth);
  document.querySelector('#task-form')?.addEventListener('submit', addTask);
  document.querySelector('#todo-form')?.addEventListener('submit', addTodo);
  document.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
  document.querySelector('#pdf-palette')?.addEventListener('change', (event) => {
    pdfPalette = event.target.value;
    localStorage.setItem('taskforge_pdf_palette', pdfPalette);
  });
  const summaryButton = document.querySelector('#summary-button');
  if (summaryButton && !summaryButton.disabled) summaryButton.addEventListener('click', generateSummary);
  const downloadButton = document.querySelector('#download-report');
  if (downloadButton && !downloadButton.disabled) downloadButton.addEventListener('click', downloadPdfReport);
  document.querySelector('#pomodoro-start')?.addEventListener('click', startPomodoro);
  document.querySelector('#pomodoro-pause')?.addEventListener('click', pausePomodoro);
  document.querySelector('#pomodoro-reset')?.addEventListener('click', resetPomodoro);
  document.querySelectorAll('[data-pomodoro-mode]').forEach((button) => button.addEventListener('click', () => setPomodoroMode(button.dataset.pomodoroMode)));
  document.querySelectorAll('[data-todo-toggle]').forEach((input) => input.addEventListener('change', () => toggleTodo(input.dataset.todoToggle, input.checked)));
  document.querySelectorAll('[data-todo-delete]').forEach((button) => button.addEventListener('click', () => deleteTodo(button.dataset.todoDelete)));
  document.querySelectorAll('[data-task]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      activePreviewTask = card.dataset.task;
      render();
    });
  });
document.querySelectorAll('[data-move]').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    moveTask(button.dataset.move, button.dataset.status);
  }));
  document.querySelectorAll('[data-plan]').forEach((button) => {
    button.addEventListener('click', () => {
      routeTo('/login');
      addNotification(`${button.dataset.plan} selected. Create a workspace to continue.`, 'plan');
    });
  });
}

function toggleTheme() {
  theme = theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('taskforge_theme', theme);
  render();
}

async function auth(event) {
  event.preventDefault();
  const endpoint = event.submitter.value === 'login' ? '/api/login' : '/api/register';
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok) {
    document.querySelector('#auth-status').textContent = data.error;
    return;
  }
  token = data.token;
  activeUser = data.user;
  workspace = data.workspace;
  summary = data.summary;
  addNotification(`${activeUser.name} signed in and workspace synced.`, 'auth');
  persist();
  routeTo('/boards');
}

async function loadWorkspace() {
  const before = JSON.stringify(workspace?.tasks?.map((task) => `${task.id}:${task.status}`) || []);
  const response = await fetch('/api/workspace', { headers: authHeaders() });
  if (!response.ok) {
    showStatus('#task-status', 'Workspace session needs login or refresh.');
    return;
  }
  const data = await response.json();
  workspace = data.workspace;
  summary = data.summary;
  persist();
  const after = JSON.stringify(workspace?.tasks?.map((task) => `${task.id}:${task.status}`) || []);
  if (pathName() === '/boards' && before !== after) render();
}

async function addTask(event) {
  event.preventDefault();
  const status = document.querySelector('#task-status');
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  const response = await fetch('/api/tasks', { method: 'POST', headers: authHeaders({ json: true }), body: JSON.stringify(payload) });
  const data = await response.json();
  status.textContent = response.ok ? 'Task added to backlog.' : data.error;
  if (response.ok) {
    workspace = data.workspace;
    summary = data.summary;
    addNotification(`Task added to Backlog: ${payload.title}`, 'task');
    persist();
    render();
  }
}

async function moveTask(id, status) {
  showStatus('#task-status', `Moving task to ${status}...`);
  const response = await fetch('/api/move-task', { method: 'POST', headers: authHeaders({ json: true }), body: JSON.stringify({ id, status }) });
  const data = await response.json();
  if (response.ok) {
    workspace = data.workspace;
    summary = data.summary;
    addNotification(`Task moved to ${status}.`, 'board');
    persist();
    render();
    showStatus('#task-status', `Task moved to ${status}.`);
  } else {
    showStatus('#task-status', data.error || 'Could not move that task.');
    loadWorkspace();
  }
}

async function generateSummary() {
  const response = await fetch('/api/summary', { method: 'POST', headers: authHeaders() });
  const data = await response.json();
  if (response.ok) {
    workspace = data.workspace;
    summary = data.summary;
    addNotification('AI report refreshed from reviewed and completed work.', 'report');
    persist();
    render();
  } else {
    document.querySelector('#summary-note').textContent = data.error;
  }
}

async function downloadPdfReport() {
  showStatus('#summary-note', 'Preparing detailed PDF report...');
  const response = await fetch(`/api/report-pdf?palette=${encodeURIComponent(pdfPalette)}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Could not prepare the PDF report.' }));
    showStatus('#summary-note', data.error);
    return;
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const fallbackName = currentReport()?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'sprintsmith-report';
  anchor.href = url;
  anchor.download = `${fallbackName}.pdf`;
  anchor.target = '_blank';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showStatus('#summary-note', 'Detailed PDF report is downloading.');
  addNotification(`Detailed ${pdfPalette} PDF report downloaded.`, 'report');
}

async function addTodo(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = new FormData(form).get('todo')?.trim();
  if (!title) return;
  const todo = { id: crypto.randomUUID(), title, done: false, taskId: null };
  todos = [todo, ...todos];
  addNotification(`Todo added: ${title}`, 'todo');

  if (token) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify({ title, owner: activeUser?.name || 'Owner', priority: 'Medium', status: 'Backlog' }),
    });
    const data = await response.json();
    if (response.ok) {
      workspace = data.workspace;
      summary = data.summary;
      todo.taskId = workspace.tasks[0]?.id || null;
      addNotification('Todo synced to the project board backlog.', 'sync');
    } else {
      addNotification(data.error || 'Todo saved locally but did not sync.', 'warning');
    }
  }

  form.reset();
  persist();
  render();
}

async function toggleTodo(id, done) {
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;
  todo.done = done;
  addNotification(`${done ? 'Completed' : 'Reopened'} todo: ${todo.title}`, 'todo');
  if (done && todo.taskId && token) {
    const response = await fetch('/api/move-task', {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify({ id: todo.taskId, status: 'Done' }),
    });
    const data = await response.json();
    if (response.ok) {
      workspace = data.workspace;
      summary = data.summary;
      addNotification('Completed todo moved its board task to Done.', 'sync');
    }
  }
  persist();
  render();
}

function deleteTodo(id) {
  const todo = todos.find((item) => item.id === id);
  todos = todos.filter((item) => item.id !== id);
  addNotification(`Removed todo: ${todo?.title || 'item'}`, 'todo');
  persist();
  render();
}

function startPomodoro() {
  pomodoro.remaining = currentPomodoroRemaining();
  pomodoro.running = true;
  pomodoro.startedAt = Date.now();
  addNotification(`${pomodoro.mode} Pomodoro started.`, 'timer');
  persist();
  render();
}

function pausePomodoro() {
  pomodoro.remaining = currentPomodoroRemaining();
  pomodoro.running = false;
  addNotification(`${pomodoro.mode} Pomodoro paused.`, 'timer');
  persist();
  render();
}

function resetPomodoro() {
  pomodoro.running = false;
  pomodoro.remaining = pomodoro.duration;
  pomodoro.startedAt = 0;
  addNotification(`${pomodoro.mode} Pomodoro reset.`, 'timer');
  persist();
  render();
}

function setPomodoroMode(mode) {
  pomodoro.mode = mode;
  pomodoro.duration = pomodoroModes[mode] || pomodoroModes.Focus;
  pomodoro.remaining = pomodoro.duration;
  pomodoro.running = false;
  pomodoro.startedAt = 0;
  addNotification(`${mode} timer selected.`, 'timer');
  persist();
  render();
}

function tickPomodoro() {
  const timeTarget = document.querySelector('#pomodoro-time');
  if (timeTarget) timeTarget.textContent = formatTime(currentPomodoroRemaining());
  if (pomodoro.running && currentPomodoroRemaining() <= 0) {
    pomodoro.running = false;
    pomodoro.remaining = pomodoro.duration;
    addNotification(`${pomodoro.mode} Pomodoro complete.`, 'timer');
    persist();
    render();
  }
}

async function loadSite() {
  if (!document.querySelector('#site-metrics') || !document.querySelector('#activity')) return;
  const response = await fetch('/api/site');
  const data = await response.json();
  document.querySelector('#site-metrics').innerHTML = data.metrics.map((metric) => `<article><span>${metric.label}</span><strong>${metric.value}</strong><p>${metric.detail}</p></article>`).join('');
  document.querySelector('#activity').innerHTML = data.activity.map((item) => `<li>${item}</li>`).join('');
}

function persist() {
  localStorage.setItem('taskforge_token', token);
  localStorage.setItem('taskforge_user', JSON.stringify(activeUser));
  localStorage.setItem('taskforge_workspace', JSON.stringify(workspace));
  localStorage.setItem('taskforge_summary', JSON.stringify(summary));
  localStorage.setItem('taskforge_notifications', JSON.stringify(notifications));
  localStorage.setItem('taskforge_todos', JSON.stringify(todos));
  localStorage.setItem('taskforge_pomodoro', JSON.stringify(pomodoro));
}

window.addEventListener('popstate', render);
window.addEventListener('hashchange', render);
setInterval(tickPomodoro, 1000);
render();
