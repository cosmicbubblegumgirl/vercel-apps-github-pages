const app = document.querySelector('#app');

const images = {
  hero: 'assets/plus-hero.jpg',
  walking: 'assets/plus-movement.jpg',
  home: 'assets/plus-home.jpg',
  food: 'assets/kind-food.jpg',
  coach: 'assets/plus-coach.jpg',
  calm: 'assets/plus-meditation.jpg',
  strength: 'assets/plus-strength.jpg',
  softness: 'assets/plus-calm.jpg',
};

const firstSteps = [
  { title: 'Mirror-neutral breath', time: '2 min', fear: 'Very low', detail: 'Stand somewhere private, breathe slowly, and say one neutral thing about your body: “This body is allowed to begin.”' },
  { title: 'Chair-supported strength', time: '4 min', fear: 'Low', detail: 'Use a chair for supported sit-to-stands, wall presses, or calf raises. No floor work required.' },
  { title: 'One-song walk', time: '5 min', fear: 'Low', detail: 'Walk until one song ends. Stopping is allowed. The goal is starting without judgement.' },
  { title: 'Kind plate add-on', time: '3 min', fear: 'Very low', detail: 'Add one supportive food to a meal instead of cutting everything out. We build trust first.' },
];

const supportStyles = [
  { value: 'private', label: 'Private and quiet', match: 'Mira Chen', role: 'Plus-size confidence coach' },
  { value: 'gentle', label: 'Gentle reminders', match: 'Noah Vale', role: 'Low-esteem habit coach' },
  { value: 'guided', label: 'Step-by-step guidance', match: 'Amara Lee', role: 'Joint-friendly movement coach' },
  { value: 'community', label: 'Small supportive group', match: 'Tali Stone', role: 'Body-respect group host' },
];

const state = {
  page: location.pathname,
  token: localStorage.getItem('kindstride_token') || '',
  user: JSON.parse(localStorage.getItem('kindstride_user') || 'null'),
  fear: Number(localStorage.getItem('kindstride_fear') || 3),
  mood: localStorage.getItem('kindstride_mood') || 'unsure',
  plan: JSON.parse(localStorage.getItem('kindstride_plan') || 'null'),
  caloriePlan: JSON.parse(localStorage.getItem('kindstride_calorie_plan') || 'null'),
  habits: JSON.parse(localStorage.getItem('kindstride_habits') || '{"water":false,"breath":false,"walk":false,"stretch":false,"meal":false}'),
  supportStyle: localStorage.getItem('kindstride_support') || 'gentle',
  messages: JSON.parse(localStorage.getItem('kindstride_messages') || '[]'),
  goals: JSON.parse(localStorage.getItem('kindstride_goals') || 'null') || [
    { id: 'goal-1', title: 'Create a private login', stage: 'Done' },
    { id: 'goal-2', title: 'Choose one body-respect first step', stage: 'Next' },
    { id: 'goal-3', title: 'Build a calm movement plan', stage: 'Later' },
    { id: 'goal-4', title: 'Create a gentle calorie plan', stage: 'Later' },
  ],
  notifications: JSON.parse(localStorage.getItem('kindstride_notifications') || '[]'),
};

function persist() {
  localStorage.setItem('kindstride_token', state.token);
  localStorage.setItem('kindstride_user', JSON.stringify(state.user));
  localStorage.setItem('kindstride_fear', String(state.fear));
  localStorage.setItem('kindstride_mood', state.mood);
  localStorage.setItem('kindstride_plan', JSON.stringify(state.plan));
  localStorage.setItem('kindstride_calorie_plan', JSON.stringify(state.caloriePlan));
  localStorage.setItem('kindstride_habits', JSON.stringify(state.habits));
  localStorage.setItem('kindstride_support', state.supportStyle);
  localStorage.setItem('kindstride_messages', JSON.stringify(state.messages));
  localStorage.setItem('kindstride_goals', JSON.stringify(state.goals));
  localStorage.setItem('kindstride_notifications', JSON.stringify(state.notifications));
}

function notify(message) {
  state.notifications = [
    { id: crypto.randomUUID(), message, time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) },
    ...state.notifications,
  ].slice(0, 7);
  persist();
}

function celebrate(message = 'Goal achieved') {
  const burst = document.createElement('div');
  burst.className = 'confetti-burst';
  burst.setAttribute('aria-label', message);
  burst.innerHTML = Array.from({ length: 34 }, (_, index) => `<span style="--i:${index};--x:${Math.random() * 220 - 110}px;--r:${Math.random() * 360}deg"></span>`).join('');
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 1400);
}

function routeTo(path) {
  const route = path === '/' ? '' : path.replace(/^\//, '');
  history.pushState({}, '', route ? `#${route}` : location.pathname.replace(location.hash, ''));
  state.page = pathName();
  render();
}

function pathName() {
  const hashRoute = location.hash.replace(/^#\/?/, '');
  const path = hashRoute ? `/${hashRoute}` : '/';
  return ['/', '/login', '/first-step', '/plan', '/calorie-plan', '/dashboard', '/progress', '/support', '/portal'].includes(path) ? path : '/';
}

function confidenceScore() {
  const habitPoints = Object.values(state.habits).filter(Boolean).length * 9;
  const fearRelief = (6 - state.fear) * 7;
  const planPoints = state.plan ? 14 : 0;
  const caloriePoints = state.caloriePlan ? 8 : 0;
  return Math.min(96, 28 + habitPoints + fearRelief + planPoints + caloriePoints);
}

function badges() {
  const habitCount = Object.values(state.habits).filter(Boolean).length;
  const movedGoals = state.goals.filter((goal) => goal.stage === 'Done').length;
  return [
    { title: 'Brave Login', detail: 'Created a private space to begin.', unlocked: Boolean(state.user), icon: '01' },
    { title: 'Body Respect Start', detail: 'Chose one action without insulting your body.', unlocked: state.notifications.some((item) => item.message.includes('first win') || item.message.includes('saved for later')), icon: '02' },
    { title: 'Curve-Safe Planner', detail: 'Generated a joint-friendly movement plan.', unlocked: Boolean(state.plan), icon: '03' },
    { title: 'Plate Peace', detail: 'Built a non-extreme calorie-deficit plan.', unlocked: Boolean(state.caloriePlan), icon: '04' },
    { title: 'Tiny Wins Trio', detail: 'Checked off at least three small habits.', unlocked: habitCount >= 3, icon: '05' },
    { title: 'Progress Keeper', detail: 'Moved at least two goals to Done.', unlocked: movedGoals >= 2, icon: '06' },
  ];
}

function authHeaders(extra = {}) {
  return state.token ? { ...extra, Authorization: `Bearer ${state.token}` } : extra;
}

function bestFirstStep() {
  if (state.fear >= 5) return firstSteps[0];
  if (state.fear === 4) return firstSteps[3];
  if (state.mood === 'tired') return firstSteps[0];
  if (state.mood === 'embarrassed') return firstSteps[1];
  return firstSteps[2];
}

async function api(path, options = {}) {
  const response = await fetch(path, options);
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || 'Request failed');
  }
  return response.json();
}

function nav() {
  const links = [
    ['/', 'Home'],
    ['/login', 'Login'],
    ['/first-step', 'First Step'],
    ['/plan', 'Calm Plan'],
    ['/calorie-plan', 'Calories'],
    ['/dashboard', 'Dashboard'],
    ['/progress', 'Progress'],
    ['/support', 'Support'],
    ['/portal', 'Portal'],
  ];
  return `
    <nav class="nav">
      <a class="brand" href="/" data-route>
        <img class="brand-logo" src="assets/logo.svg" alt="KindStride logo" />
        <span>KindStride</span>
      </a>
      <div class="nav-links">
        ${links.map(([href, label]) => `<a class="${pathName() === href ? 'active' : ''}" href="${href}" data-route>${label}</a>`).join('')}
      </div>
      <a class="nav-cta" href="${state.user ? '/dashboard' : '/login'}" data-route>${state.user ? state.user.name : 'Login'}</a>
    </nav>
  `;
}

function shell(content) {
  return `<div class="site">${nav()}${content}${footer()}</div>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div>
        <span>KindStride</span>
        <p>Made for plus-size women by one determined cupcake with a clipboard, a soft plan, and zero time for body shame.</p>
      </div>
      <strong>A Quantum Cupcake Creation</strong>
    </footer>
  `;
}

function homePage() {
  return `
    <main>
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">For plus-size women scared to start getting healthy</span>
          <h1>Your body is not the problem. The plan should feel safer.</h1>
          <p>KindStride helps plus-size women with low self-esteem begin gently: private confidence tools, joint-friendly movement, calm calorie planning, and support that never shames your body.</p>
          <div class="hero-actions">
            <a class="cta" href="/first-step" data-route>Find my first step</a>
            <a class="ghost" href="/support" data-route>Match gentle support</a>
          </div>
        </div>
        <div class="hero-media">
          <img src="${images.hero}" alt="A beautiful young adult plus-size woman meditating in a calm wellness space" />
          <div class="readiness-card">
            <span>Confidence today</span>
            <strong>${confidenceScore()}%</strong>
            <p>Built from body-respect wins, not punishment workouts.</p>
          </div>
        </div>
      </section>
      <section class="section program-strip">
        <div class="section-header">
          <span class="eyebrow">Plus-size, low-pressure features</span>
          <h2>Designed for the moment before confidence arrives.</h2>
        </div>
        <div class="program-grid">
          ${[
            ['Gym anxiety support', 'Tell the app how exposed or embarrassed you feel and get a private action that still counts.', images.softness],
            ['Chair and joint-friendly plans', 'Short sessions with no floor work required, body-size-aware pacing, and safe substitutions.', images.strength],
            ['Food without body shame', 'Gentle calorie-deficit guidance that adds structure without crash dieting or punishment.', images.food],
            ['Plus-size support matching', 'Choose private, guided, gentle, or community support before booking a body-respect coach.', images.coach],
          ].map(featureCard).join('')}
        </div>
      </section>
      <section class="section feature-band">
        <article><b>01</b><h3>No body shaming</h3><p>The app does not ask you to hate your body into change. It builds trust first.</p></article>
        <article><b>02</b><h3>Private confidence tools</h3><p>Use the fear slider, mood selector, badge system, and habit cockpit without anyone watching.</p></article>
        <article><b>03</b><h3>Comfort-aware wellness flow</h3><p>Login, calorie plans, check-ins, achievements, generated plans, and coach matching are backend connected.</p></article>
      </section>
    </main>
  `;
}

function featureCard([title, detail, image]) {
  return `
    <article class="program-card">
      <img src="${image}" alt="${title}" />
      <div><span>KindStride</span><h3>${title}</h3><p>${detail}</p></div>
    </article>
  `;
}

function loginPage() {
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">Private Login</span>
        <h1>A private account for rebuilding body trust.</h1>
        <p>Create a user profile or login to keep your joint-friendly plan, gentle calorie-deficit target, badges, and support activity in one protected member space.</p>
      </section>
      <section class="portal-layout section-tight">
        <form class="panel portal-form" id="auth-form">
          <label>Name<input name="name" value="${state.user?.name || ''}" /></label>
          <label>Email<input name="email" type="email" value="${state.user?.email || ''}" required /></label>
          <label>Password<input name="password" type="password" required /></label>
          <div class="button-row">
            <button class="cta" name="mode" value="register" type="submit">Create account</button>
            <button class="ghost" name="mode" value="login" type="submit">Login</button>
          </div>
          <p id="auth-status">${state.user ? `Logged in as ${state.user.name}.` : 'Your demo account is private to this browser and backend session.'}</p>
        </form>
        <div class="panel notification-panel">
          <h2>What unlocks after login</h2>
          <article><span>Badge</span><p>Earn the Brave Login badge.</p></article>
          <article><span>Plan</span><p>Connect movement, calorie planning, and support actions to one profile.</p></article>
          <article><span>Privacy</span><p>No public feed, pressure ranking, or comparison leaderboard.</p></article>
        </div>
      </section>
    </main>
  `;
}

function firstStepPage() {
  const step = bestFirstStep();
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">First Step Finder</span>
        <h1>Tell us how exposed starting feels today.</h1>
        <p>This page turns body anxiety into a tiny, realistic action. You do not need to feel confident before you begin.</p>
      </section>
      <section class="planner-layout section-tight">
        <div class="panel planner-form">
          <label class="fear-label">How intimidating does moving your body feel today?
            <input id="fear-slider" type="range" min="1" max="5" value="${state.fear}" />
            <span>${['Barely', 'A little', 'Unsure', 'Nervous', 'Very scared'][state.fear - 1]}</span>
          </label>
          <label>What feels closest?
            <div class="segmented">
              ${[
                ['unsure', 'I do not know where to start'],
                ['tired', 'I am tired'],
                ['embarrassed', 'I feel embarrassed in my body'],
                ['hopeful', 'I want to try without pressure'],
              ].map(([value, label]) => `<button class="${state.mood === value ? 'active' : ''}" type="button" data-mood="${value}">${label}</button>`).join('')}
            </div>
          </label>
          <button class="cta" type="button" id="save-first-step">Save this as my first win</button>
        </div>
        <article class="panel plan-card gentle-card">
          <span class="eyebrow">Recommended first step</span>
          <h2>${step.title}</h2>
          <p>${step.detail}</p>
          <div class="stat-grid">
            <article><span>Time</span><strong>${step.time}</strong></article>
            <article><span>Pressure</span><strong>${step.fear}</strong></article>
            <article><span>Goal</span><strong>Start</strong></article>
          </div>
        </article>
      </section>
      <section class="section-tight movement-map">
        ${firstSteps.map((item) => `<button data-first-step="${item.title}">${item.title}</button>`).join('')}
      </section>
    </main>
  `;
}

function planPage() {
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">Calm Plan Builder</span>
        <h1>Build a week that respects your body size, joints, and confidence.</h1>
        <p>Choose low-pressure details and generate a gentle plan with supported movement, food confidence, recovery cues, and private pacing.</p>
      </section>
      <section class="planner-layout section-tight">
        <form class="panel planner-form" id="plan-form">
          <label>Main hope
            <select name="goal">
              <option>Feel less stuck</option>
              <option>Move with less joint pressure</option>
              <option>Build quiet strength</option>
              <option>Feel better around food</option>
              <option>Feel safer in a gym</option>
            </select>
          </label>
          <label>Minutes per day
            <select name="minutes"><option>5</option><option>10</option><option>15</option><option>20</option></select>
          </label>
          <label>Where feels safest?
            <select name="space"><option>At home</option><option>Outside</option><option>Quiet gym corner</option><option>Chair or desk</option></select>
          </label>
          <label>Support style
            <select name="support">${supportStyles.map((style) => `<option value="${style.value}" ${style.value === state.supportStyle ? 'selected' : ''}>${style.label}</option>`).join('')}</select>
          </label>
          <button class="cta" type="submit">Generate calm plan</button>
          <p id="planner-status"></p>
        </form>
        <div class="plan-result">${state.plan ? planCard(state.plan) : emptyPlan()}</div>
      </section>
    </main>
  `;
}

function emptyPlan() {
  return `<article class="panel empty-state"><h2>Your plan will appear here.</h2><p>Start with something so small it feels almost too easy. That is the point.</p></article>`;
}

function planCard(plan) {
  return `
    <article class="panel plan-card">
      <span class="eyebrow">${plan.supportLabel}</span>
      <h2>${plan.title}</h2>
      <p>${plan.note}</p>
      <div class="stat-grid">
        <article><span>Daily time</span><strong>${plan.minutes} min</strong></article>
        <article><span>Comfort</span><strong>${plan.comfort}</strong></article>
        <article><span>Starter price</span><strong>${plan.price}</strong></article>
      </div>
      <div class="week-grid">
        ${plan.blocks.map((block) => `<article><b>${block.day}</b><span>${block.session}</span><small>${block.detail}</small></article>`).join('')}
      </div>
    </article>
  `;
}

function caloriePlanPage() {
  const plan = state.caloriePlan;
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">Gentle Calorie Deficit</span>
        <h1>Build a calorie-deficit plan without body shame.</h1>
        <p>Estimate maintenance calories, choose a patient deficit, and get practical meal anchors that protect energy, mood, and self-worth. This is educational guidance, not medical advice.</p>
      </section>
      <section class="planner-layout section-tight">
        <form class="panel planner-form" id="calorie-form">
          <label>Body profile
            <select name="profile"><option value="neutral">Prefer neutral estimate</option><option value="female">Female estimate</option><option value="male">Male estimate</option></select>
          </label>
          <label>Age<input name="age" type="number" min="16" max="90" value="30" required /></label>
          <label>Height in cm<input name="height_cm" type="number" min="120" max="230" value="165" required /></label>
          <label>Weight in kg<input name="weight_kg" type="number" min="40" max="250" value="80" required /></label>
          <label>Activity level
            <select name="activity">
              <option value="1.2">Mostly sitting</option>
              <option value="1.35">Light movement</option>
              <option value="1.5">Active most days</option>
              <option value="1.7">Very active</option>
            </select>
          </label>
          <label>Deficit pace
            <select name="pace">
              <option value="patient">Patient: smallest change</option>
              <option value="gentle" selected>Gentle: steady but kind</option>
              <option value="steady">Steady: still sensible</option>
            </select>
          </label>
          <button class="cta" type="submit">Create calorie plan</button>
          <p id="calorie-status"></p>
        </form>
        <div class="plan-result">
          ${plan ? calorieResult(plan) : '<article class="panel empty-state"><h2>No calorie plan yet.</h2><p>Use calm numbers to create structure. The target will avoid aggressive restriction floors.</p></article>'}
        </div>
      </section>
    </main>
  `;
}

function calorieResult(plan) {
  return `
    <article class="panel plan-card calorie-result">
      <span class="eyebrow">${plan.title}</span>
      <h2>${plan.target} calories/day</h2>
      <p>${plan.note}</p>
      <div class="stat-grid">
        <article><span>Maintenance</span><strong>${plan.maintenance}</strong></article>
        <article><span>Deficit</span><strong>${plan.deficit}</strong></article>
        <article><span>Protein</span><strong>${plan.protein}</strong></article>
      </div>
      <div class="week-grid">
        ${plan.meals.map((meal, index) => `<article><b>Anchor ${index + 1}</b><span>${meal}</span><small>Keep familiar foods. Adjust gently.</small></article>`).join('')}
      </div>
    </article>
  `;
}

function dashboardPage() {
  return `
    <main class="page">
      <section class="page-hero dashboard-hero">
        <div>
          <span class="eyebrow">Body Confidence Dashboard</span>
          <h1>Progress that does not require hating yourself first.</h1>
          <p>Track tiny rituals, save check-ins, unlock badges, and watch your confidence score grow without comparison or harsh streak pressure.</p>
        </div>
        <div class="score-dial"><strong>${confidenceScore()}%</strong><span>Confidence</span></div>
      </section>
      <section class="dashboard-grid section-tight">
        <form class="panel signal-panel" id="checkin-form">
          <h2>Gentle check-in</h2>
          <label>Before starting today<select name="before"><option>Scared of being seen</option><option>Unsure</option><option>Okay</option><option>Hopeful</option></select></label>
          <label>After one small action<select name="after"><option>A little better</option><option>The same, and that is okay</option><option>Proud</option><option>Ready for tomorrow</option></select></label>
          <button class="cta" type="submit">Save check-in</button>
          <p id="checkin-status"></p>
        </form>
        <div class="panel habit-panel">
          <h2>Tiny win cockpit</h2>
          ${Object.entries({ water: 'Drink water', breath: '60 second breathing', walk: 'Short private walk', stretch: 'Chair-supported stretch', meal: 'One kind meal choice' }).map(([key, label]) => `
            <label class="habit"><input type="checkbox" data-habit="${key}" ${state.habits[key] ? 'checked' : ''} />${label}</label>
          `).join('')}
        </div>
        <div class="panel">
          <h2>Saved calm plan</h2>
          ${state.plan ? `<p>${state.plan.title}</p><div class="mini-week">${state.plan.blocks.map((block) => `<span>${block.day}</span>`).join('')}</div>` : '<p>No calm plan yet. Build one when you feel ready.</p>'}
        </div>
      </section>
      <section class="section-tight dashboard-addons">
        <div class="panel">
          <h2>Calorie deficit plan</h2>
          ${state.caloriePlan ? `<p>${state.caloriePlan.title}</p><div class="mini-week"><span>${state.caloriePlan.target} cal/day</span><span>${state.caloriePlan.deficit} deficit</span><span>${state.caloriePlan.protein}</span></div>` : '<p>No calorie plan yet. Build a gentle food structure when you are ready.</p><a class="ghost inline-link" href="/calorie-plan" data-route>Create calorie plan</a>'}
        </div>
        <div class="panel badge-panel">
          <h2>Achievement badges</h2>
          <div class="badge-grid">
            ${badges().map((badge) => `
              <article class="badge ${badge.unlocked ? 'unlocked' : ''}">
                <div class="badge-medal">${badge.icon}</div>
                <span>${badge.unlocked ? 'Unlocked' : 'Locked'}</span>
                <strong>${badge.title}</strong>
                <p>${badge.detail}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    </main>
  `;
}

function progressPage() {
  const stages = ['Next', 'Doing', 'Done', 'Later'];
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">Private Progress Board</span>
        <h1>A gentle board for goals, messages, and confidence.</h1>
        <p>Post private encouragement, add goals that respect your body, and move them through small stages. No comparison, no public leaderboard.</p>
      </section>
      <section class="progress-layout section-tight">
        <form class="panel message-form" id="message-form">
          <h2>Message yourself kindly</h2>
          <label>Private message<textarea name="message" rows="4" placeholder="Example: I am allowed to start slowly." required></textarea></label>
          <button class="cta" type="submit">Post private message</button>
          <p id="message-status"></p>
        </form>
        <form class="panel message-form" id="goal-form">
          <h2>Add a body-respect goal</h2>
          <label>Goal<input name="title" placeholder="Example: Walk privately for one song" required /></label>
          <button class="cta" type="submit">Add goal</button>
          <p id="goal-status"></p>
        </form>
      </section>
      <section class="section-tight message-board">
        <div class="panel">
          <h2>Encouragement messages</h2>
          <div class="message-list">
            ${state.messages.length ? state.messages.map((item) => `<article><span>${item.time}</span><p>${item.text}</p></article>`).join('') : '<p>No private messages yet. Start with one sentence you would say to a friend.</p>'}
          </div>
        </div>
      </section>
      <section class="section-tight progress-board">
        ${stages.map((stage) => `
          <div class="progress-lane">
            <h3>${stage}</h3>
            ${state.goals.filter((goal) => goal.stage === stage).map(goalCard).join('') || '<p class="empty-lane">No goals here yet.</p>'}
          </div>
        `).join('')}
      </section>
    </main>
  `;
}

function goalCard(goal) {
  const stages = ['Next', 'Doing', 'Done', 'Later'].filter((stage) => stage !== goal.stage);
  return `
    <article class="goal-card">
      <strong>${goal.title}</strong>
      <div class="goal-actions">
        ${stages.map((stage) => `<button type="button" data-goal="${goal.id}" data-stage="${stage}">${stage}</button>`).join('')}
      </div>
    </article>
  `;
}

function supportPage() {
  const match = supportStyles.find((style) => style.value === state.supportStyle) || supportStyles[1];
  return `
    <main class="page">
      <section class="page-hero coach-hero">
        <div>
          <span class="eyebrow">Support Match</span>
          <h1>Choose support that respects plus-size bodies.</h1>
          <p>KindStride matches plus-size women with support that respects privacy, gym anxiety, self-esteem, joint comfort, and pace.</p>
        </div>
        <img src="${images.coach}" alt="A beautiful young adult plus-size woman working with a supportive coach" />
      </section>
      <section class="coach-layout section-tight">
        <div class="panel quiz-panel">
          <h2>What support feels best?</h2>
          ${supportStyles.map((style) => `<button class="${state.supportStyle === style.value ? 'active' : ''}" data-support="${style.value}">${style.label}</button>`).join('')}
        </div>
        <article class="panel matched-coach">
          <span class="eyebrow">Your gentle match</span>
          <h2>${match.match}</h2>
          <p>${match.role}. This support style is built for women who want progress without being pushed into shame, comparison, or performance mode.</p>
          <div class="stat-grid">
            <article><span>Style</span><strong>${match.label}</strong></article>
            <article><span>Consult</span><strong>20 min</strong></article>
            <article><span>Price</span><strong>R390</strong></article>
          </div>
          <button class="cta" id="reserve-support">Reserve gentle consult</button>
        </article>
      </section>
      <section class="section-tight coach-grid">
        ${supportStyles.map((style) => `<article class="coach-card"><h3>${style.match}</h3><p>${style.role}</p><span>${style.label}</span></article>`).join('')}
      </section>
    </main>
  `;
}

function portalPage() {
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">Beginner Portal</span>
        <h1>Ask for help without apologising for your body.</h1>
        <p>Send a private starter request. The backend records your goals, comfort level, support preference, and what would make starting feel emotionally safer.</p>
      </section>
      <section class="portal-layout section-tight">
        <form class="panel portal-form" id="lead-form">
          <label>Name<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>What feels hardest?<select name="barrier"><option>Starting</option><option>Consistency</option><option>Feeling embarrassed in my body</option><option>Food choices</option><option>Low energy</option><option>Gym anxiety</option></select></label>
          <label>Preferred start date<input name="start_date" type="date" required /></label>
          <button class="cta" type="submit">Send private starter request</button>
          <p id="lead-status"></p>
        </form>
        <div class="panel notification-panel">
          <h2>Your private activity</h2>
          ${state.notifications.length ? state.notifications.map((item) => `<article><span>${item.time}</span><p>${item.message}</p></article>`).join('') : '<p>No activity yet. Tiny wins, plans, check-ins, and consults appear here.</p>'}
        </div>
      </section>
    </main>
  `;
}

function render() {
  state.page = pathName();
  const pages = {
    '/': homePage,
    '/login': loginPage,
    '/first-step': firstStepPage,
    '/plan': planPage,
    '/calorie-plan': caloriePlanPage,
    '/dashboard': dashboardPage,
    '/progress': progressPage,
    '/support': supportPage,
    '/portal': portalPage,
  };
  app.innerHTML = shell(pages[state.page]());
  wire();
}

function wire() {
  document.querySelectorAll('[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      routeTo(link.getAttribute('href'));
    });
  });

  document.querySelector('#auth-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#auth-status');
    const submitter = event.submitter;
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const endpoint = submitter.value === 'login' ? '/api/login' : '/api/register';
    status.textContent = submitter.value === 'login' ? 'Logging in...' : 'Creating account...';
    try {
      const data = await api(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      state.token = data.token;
      state.user = data.user;
      if (state.goals.find((goal) => goal.id === 'goal-1')) state.goals.find((goal) => goal.id === 'goal-1').stage = 'Done';
      notify(`${data.user.name} logged into a private KindStride space.`);
      celebrate('Brave Login badge unlocked');
      persist();
      routeTo('/dashboard');
    } catch (error) {
      status.textContent = error.message;
    }
  });

  document.querySelector('#fear-slider')?.addEventListener('input', (event) => {
    state.fear = Number(event.target.value);
    persist();
    render();
  });

  document.querySelectorAll('[data-mood]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mood = button.dataset.mood;
      persist();
      render();
    });
  });

  document.querySelector('#save-first-step')?.addEventListener('click', () => {
    if (state.goals.find((goal) => goal.id === 'goal-2')) state.goals.find((goal) => goal.id === 'goal-2').stage = 'Done';
    notify(`${bestFirstStep().title} saved as your first win.`);
    celebrate('First Step Saved badge unlocked');
    routeTo('/dashboard');
  });

  document.querySelectorAll('[data-first-step]').forEach((button) => {
    button.addEventListener('click', () => {
      notify(`${button.dataset.firstStep} saved for later.`);
      routeTo('/dashboard');
    });
  });

  document.querySelector('#plan-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#planner-status');
    status.textContent = 'Building a calm plan...';
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.fear = state.fear;
    try {
      const data = await api('/api/plans', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(payload) });
      state.plan = data.plan;
      state.supportStyle = payload.support;
      if (state.goals.find((goal) => goal.id === 'goal-3')) state.goals.find((goal) => goal.id === 'goal-3').stage = 'Done';
      notify(`${data.plan.title} saved to your dashboard.`);
      celebrate('Calm Planner badge unlocked');
      persist();
      render();
    } catch (error) {
      status.textContent = error.message;
    }
  });

  document.querySelector('#calorie-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#calorie-status');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    status.textContent = 'Calculating a gentle deficit...';
    try {
      const data = await api('/api/calorie-plan', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(payload) });
      state.caloriePlan = data.plan;
      if (state.goals.find((goal) => goal.id === 'goal-4')) state.goals.find((goal) => goal.id === 'goal-4').stage = 'Done';
      notify(`${data.plan.title} saved with a ${data.plan.deficit} calorie deficit.`);
      celebrate('Plate Peace badge unlocked');
      persist();
      render();
    } catch (error) {
      status.textContent = error.message;
    }
  });

  document.querySelectorAll('[data-habit]').forEach((input) => {
    input.addEventListener('change', () => {
      state.habits[input.dataset.habit] = input.checked;
      notify(`${input.parentElement.textContent.trim()} updated.`);
      if (Object.values(state.habits).filter(Boolean).length === 3) celebrate('Tiny Wins Trio badge unlocked');
      persist();
      render();
    });
  });

  document.querySelector('#checkin-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#checkin-status');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.confidence = confidenceScore();
    try {
      await api('/api/checkins', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(payload) });
      notify(`Check-in saved at ${confidenceScore()}% confidence.`);
      status.textContent = 'Check-in saved.';
      render();
    } catch (error) {
      status.textContent = error.message;
    }
  });

  document.querySelector('#message-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    state.messages = [
      { id: crypto.randomUUID(), text: payload.message, time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) },
      ...state.messages,
    ].slice(0, 12);
    notify('Private encouragement message posted.');
    persist();
    celebrate('Kind message posted');
    render();
  });

  document.querySelector('#goal-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    state.goals.unshift({ id: crypto.randomUUID(), title: payload.title, stage: 'Next' });
    notify(`${payload.title} added to your progress board.`);
    persist();
    render();
  });

  document.querySelectorAll('[data-goal]').forEach((button) => {
    button.addEventListener('click', () => {
      const goal = state.goals.find((item) => item.id === button.dataset.goal);
      if (!goal) return;
      goal.stage = button.dataset.stage;
      notify(`${goal.title} moved to ${goal.stage}.`);
      if (goal.stage === 'Done') celebrate('Progress goal completed');
      persist();
      render();
    });
  });

  document.querySelectorAll('[data-support]').forEach((button) => {
    button.addEventListener('click', () => {
      state.supportStyle = button.dataset.support;
      persist();
      render();
    });
  });

  document.querySelector('#reserve-support')?.addEventListener('click', () => {
    const match = supportStyles.find((style) => style.value === state.supportStyle) || supportStyles[1];
    notify(`Gentle consult reserved with ${match.match}.`);
    celebrate('Support Reached badge unlocked');
    routeTo('/portal');
  });

  document.querySelector('#lead-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#lead-status');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.plan = state.plan?.title || 'No plan yet';
    payload.support = state.supportStyle;
    payload.fear = state.fear;
    try {
      await api('/api/leads', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(payload) });
      notify(`${payload.name}'s private starter request was sent.`);
      status.textContent = 'Private starter request sent.';
      event.currentTarget.reset();
      render();
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

addEventListener('popstate', render);
addEventListener('hashchange', render);
render();
