const app = document.querySelector('#app');

let token = localStorage.getItem('vaultpay_token') || '';
let activeUser = JSON.parse(localStorage.getItem('vaultpay_user') || 'null');
let cardState = JSON.parse(localStorage.getItem('vaultpay_card') || 'null');
let transfers = JSON.parse(localStorage.getItem('vaultpay_transfers') || '[]');
let activeFlow = localStorage.getItem('vaultpay_flow') || 'Spend';
let vaultMix = JSON.parse(localStorage.getItem('vaultpay_vault_mix') || '{"essentials":42,"reserve":34,"growth":24}');
let notifications = JSON.parse(localStorage.getItem('vaultpay_notifications') || '[]');
let shoppingRows = JSON.parse(localStorage.getItem('vaultpay_shopping_rows') || 'null') || [
  { id: 'shop-1', date: '08 May', category: 'Groceries', item: 'Fresh produce', quantity: 1, unitPrice: 950 },
  { id: 'shop-2', date: '08 May', category: 'Groceries', item: 'Protein and dairy', quantity: 1, unitPrice: 1250 },
  { id: 'shop-3', date: '08 May', category: 'Groceries', item: 'Pantry staples', quantity: 1, unitPrice: 780 },
  { id: 'shop-4', date: '10 May', category: 'Household', item: 'Cleaning supplies', quantity: 1, unitPrice: 640 },
  { id: 'shop-5', date: '12 May', category: 'Luxury', item: 'Dinner out', quantity: 1, unitPrice: 850 },
  { id: 'shop-6', date: '18 May', category: 'Luxury', item: 'Beauty or grooming', quantity: 1, unitPrice: 650 },
];

const DEMO_BALANCE = 35000;
const DEMO_SAVINGS_GOAL = 200000;
const DEMO_SAVINGS_SAVED = 60000;
const MONTHLY_SAVINGS_CONTRIBUTION = 2000;
const BALANCE_VERSION = 'monthly-budget-goal-20260508';

const regularExpenses = [
  { date: '01 May', name: 'Apartment rent', type: 'Debit order', amount: 9800 },
  { date: '02 May', name: 'Medical aid', type: 'Debit order', amount: 2250 },
  { date: '03 May', name: 'Short-term insurance', type: 'Debit order', amount: 1150 },
  { date: '05 May', name: 'Vehicle repayment', type: 'Debit order', amount: 4200 },
  { date: '07 May', name: 'Mobile + fibre', type: 'Debit order', amount: 1050 },
  { date: '15 May', name: 'Groceries budget', type: 'Planned expense', amount: 4800 },
  { date: '18 May', name: 'Transport and fuel', type: 'Planned expense', amount: 2700 },
  { date: '25 May', name: 'Utilities', type: 'Debit order', amount: 1650 },
  { date: '27 May', name: 'Subscriptions', type: 'Debit order', amount: 430 },
];

const interestCollected = [
  { date: '31 Mar', name: 'Savings interest', amount: 395 },
  { date: '30 Apr', name: 'Savings interest', amount: 412 },
  { date: '31 May', name: 'Projected interest', amount: 428 },
];

if (activeUser && localStorage.getItem('vaultpay_balance_version') !== BALANCE_VERSION) {
  if (
    Number(activeUser.balance || 0) !== DEMO_BALANCE ||
    Number(activeUser.savingsSaved || 0) !== DEMO_SAVINGS_SAVED ||
    Number(activeUser.savingsGoal || 0) !== DEMO_SAVINGS_GOAL
  ) {
    activeUser = {
      ...activeUser,
      balance: DEMO_BALANCE,
      savingsGoal: DEMO_SAVINGS_GOAL,
      savingsSaved: DEMO_SAVINGS_SAVED,
    };
    transfers = [];
  }
  localStorage.setItem('vaultpay_balance_version', BALANCE_VERSION);
}

const routes = ['/', '/dashboard', '/cards', '/insights', '/security', '/shopping', '/portal'];

const spendData = [
  ['Mon', 1480],
  ['Tue', 2360],
  ['Wed', 1890],
  ['Thu', 3920],
  ['Fri', 3180],
  ['Sat', 4460],
  ['Sun', 2750],
];

const products = [
  ['Current', 'Smart current account', 'Instant EFTs, merchant clarity, and calm cashflow tools.'],
  ['Business', 'Creator business wallet', 'Invoice tracking, approval flows, and team card permissions.'],
  ['Reserve', 'Travel reserve vault', 'Goal pockets, exchange-ready spending, and card travel rules.'],
  ['Family', 'Family safety profile', 'Limits, trusted recipients, alerts, and category controls.'],
  ['Black', 'Premium black card', 'Concierge controls, higher limits, and priority fraud review.'],
  ['Auto', 'Savings autopilot', 'Roundups, scheduled vault moves, and progress forecasting.'],
];

const securitySignals = [
  ['Device', 'Device fingerprint matched', 'clear'],
  ['Merchant', 'Merchant velocity normal', 'clear'],
  ['Location', 'Location pattern trusted', 'clear'],
  ['Transfer', 'Large transfer review enabled', 'watch'],
  ['Card', 'Virtual token active', 'clear'],
  ['Session', 'Biometric prompt ready', 'clear'],
];

const flowModes = {
  Spend: {
    title: 'Spend with merchant-aware controls',
    detail: 'Cards can be purpose-built for travel, dining, subscriptions, or one-time checkout without turning the interface into a maze.',
    metric: 'R 18,420',
    accent: '#2b6cb0',
  },
  Save: {
    title: 'Save with quiet automated vaults',
    detail: 'Roundups, payday splits, and goal forecasts move money into safer places without adding another manual budgeting ritual.',
    metric: '39%',
    accent: '#0f766e',
  },
  Shield: {
    title: 'Shield every movement before it happens',
    detail: 'Risk signals are written in plain language so users understand why a payment is approved, watched, or held.',
    metric: 'A+',
    accent: '#132238',
  },
  Send: {
    title: 'Send money with visible decisioning',
    detail: 'Large transfers show status, reference, approval path, and balance impact before the user confirms.',
    metric: '2.8s',
    accent: '#7c3aed',
  },
};

function money(value) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function persist() {
  localStorage.setItem('vaultpay_token', token);
  localStorage.setItem('vaultpay_user', JSON.stringify(activeUser));
  localStorage.setItem('vaultpay_card', JSON.stringify(cardState));
  localStorage.setItem('vaultpay_transfers', JSON.stringify(transfers));
  localStorage.setItem('vaultpay_flow', activeFlow);
  localStorage.setItem('vaultpay_vault_mix', JSON.stringify(vaultMix));
  localStorage.setItem('vaultpay_notifications', JSON.stringify(notifications));
  localStorage.setItem('vaultpay_shopping_rows', JSON.stringify(shoppingRows));
  localStorage.setItem('vaultpay_balance_version', BALANCE_VERSION);
}

function notify(message) {
  notifications = [
    { id: crypto.randomUUID(), message, time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) },
    ...notifications,
  ].slice(0, 8);
  persist();
}

function pathName() {
  const hashRoute = location.hash.replace(/^#\/?/, '');
  const path = hashRoute ? `/${hashRoute}` : '/';
  return routes.includes(path) ? path : '/';
}

function routeTo(path) {
  const route = path === '/' ? '' : path.replace(/^\//, '');
  history.pushState({}, '', route ? `#${route}` : location.pathname.replace(location.hash, ''));
  render();
}

function riskFor(amount) {
  const value = Number(amount || 0);
  if (value > 50000) return { label: 'review', score: 82, detail: 'Manual review required before release.' };
  if (value > 15000) return { label: 'watch', score: 56, detail: 'Extra confirmation recommended.' };
  return { label: 'clear', score: 18, detail: 'Normal pattern, no extra hold required.' };
}

function balance() {
  return activeUser?.balance || DEMO_BALANCE;
}

function expensesTotal() {
  return regularExpenses.reduce((sum, item) => sum + item.amount, 0);
}

function monthlySurplus() {
  return balance() - expensesTotal() - MONTHLY_SAVINGS_CONTRIBUTION;
}

function interestTotal() {
  return interestCollected.reduce((sum, item) => sum + item.amount, 0);
}

function savingsProgress() {
  const saved = activeUser?.savingsSaved || DEMO_SAVINGS_SAVED;
  const goal = activeUser?.savingsGoal || DEMO_SAVINGS_GOAL;
  return Math.min(100, Math.round((saved / goal) * 100));
}

function rowTotal(row) {
  return Number(row.quantity || 1) * Number(row.unitPrice || 0);
}

function shoppingTotal() {
  return shoppingRows.reduce((sum, row) => sum + rowTotal(row), 0);
}

function categoryTotals() {
  return shoppingRows.reduce((totals, row) => {
    totals[row.category] = (totals[row.category] || 0) + rowTotal(row);
    return totals;
  }, {});
}

function nav() {
  const links = [
    ['/', 'Home'],
    ['/dashboard', 'Dashboard'],
    ['/cards', 'Cards'],
    ['/insights', 'FlowLens'],
    ['/security', 'Security'],
    ['/shopping', 'Sheets'],
    ['/portal', 'Portal'],
  ];
  return `
    <nav class="nav">
      <a class="brand" href="/" data-route>
        <img class="brand-logo" src="assets/logo.svg?v=20260509-responsive-6" alt="VaultPay logo" />
        <span>VaultPay</span>
      </a>
      <div class="nav-links">
        ${links.map(([href, label]) => `<a class="${pathName() === href ? 'active' : ''}" href="${href}" data-route>${label}</a>`).join('')}
      </div>
      <a class="nav-cta" href="/portal" data-route>${activeUser ? activeUser.name : 'Open account'}</a>
    </nav>
  `;
}

function shell(content) {
  return `<div class="site">${nav()}${content}${footer()}</div>`;
}

function homePage() {
  return `
    <main>
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Corporate fintech, calmer by design</span>
          <h1>Move, protect, and understand your money in one polished command center.</h1>
          <p>VaultPay combines a conversion-ready fintech website with a live account portal, Rand balances, card controls, risk signals, and transfer flows that feel serious without feeling cold.</p>
          <div class="hero-actions">
            <a class="cta" href="/portal" data-route>Create demo account</a>
            <a class="ghost" href="/dashboard" data-route>View dashboard</a>
          </div>
        </div>
        <div class="executive-visual">
          <img src="assets/corporate-1.jpg" alt="Corporate finance desk with reports" />
          ${cardPreview('hero-card')}
        </div>
      </section>
      <section class="section trust">
        <div class="trust-image"><img src="assets/corporate-3.jpg" alt="Professional team reviewing financial strategy" /></div>
        <div>
          <span class="eyebrow">Built for serious money movement</span>
          <h2>Premium controls with consumer-grade clarity.</h2>
          <div class="trust-list">
            ${[
              ['Treasury-grade guardrails', 'Approval thresholds, role-aware limits, and visible audit trails.'],
              ['Board-ready reporting', 'Exportable transaction views for finance teams and advisors.'],
              ['Human-readable risk', 'Plain-language status for every sensitive movement.'],
            ].map(([title, detail]) => `<article><h3>${title}</h3><p>${detail}</p></article>`).join('')}
          </div>
        </div>
      </section>
      <section class="section product-strip">
        <div class="section-header">
          <span class="eyebrow">Focused products</span>
          <h2>Six account experiences with clear jobs.</h2>
        </div>
        <div class="product-grid">
          ${products.slice(0, 3).map(productCard).join('')}
        </div>
      </section>
    </main>
  `;
}

function dashboardPage() {
  const saved = activeUser?.savingsSaved || DEMO_SAVINGS_SAVED;
  const goal = activeUser?.savingsGoal || DEMO_SAVINGS_GOAL;
  return `
    <main class="page">
      <section class="page-hero dashboard-hero">
        <div>
          <span class="eyebrow">Live account dashboard</span>
          <h1>Financial clarity without visual noise.</h1>
          <p>Track balances, incoming money, scheduled transfers, vault mix, and risk status from one calm executive surface.</p>
        </div>
        <div class="score-tile">
          <span>Current account income</span>
          <strong>${money(balance())}</strong>
        </div>
      </section>
      <section class="dashboard-grid section-tight">
        <article class="balance-panel">
          <span>Monthly income</span>
          <strong>${money(balance())}</strong>
          <p>Current account income for the month before debit orders, planned expenses, and savings contribution.</p>
          <div class="pulse-row">
            <b>${money(expensesTotal())}</b><small>regular expenses</small>
            <b>${money(monthlySurplus())}</b><small>surplus after savings</small>
          </div>
        </article>
        <article class="goal-panel">
          <span>Savings account</span>
          <h3>${money(saved)}</h3>
          <div class="progress savings-progress" aria-label="${savingsProgress()}% of savings goal reached">
            <i style="width:${savingsProgress()}%"></i>
          </div>
          <div class="progress-meta"><b>${savingsProgress()}% funded</b><small>${money(goal - saved)} remaining</small></div>
          <p>Goal target: ${money(goal)}. Interest collected so far: ${money(interestTotal())}.</p>
        </article>
        <article class="card-control compact-card">
          <span>Savings contribution</span>
          <h3>${money(MONTHLY_SAVINGS_CONTRIBUTION)}</h3>
          <p>After regular expenses and this contribution, projected monthly surplus is ${money(monthlySurplus())}.</p>
          <a class="inline-link" href="/cards" data-route>Review card controls</a>
        </article>
      </section>
      <section class="section-tight monthly-ledger">
        <div class="section-header">
          <span class="eyebrow">Regular debit orders</span>
          <h2>Dated expenses and month-end surplus.</h2>
        </div>
        <div class="ledger-layout">
          <article class="panel expense-table">
            <div class="table-head"><span>Date</span><span>Expense</span><span>Type</span><span>Amount</span></div>
            ${regularExpenses.map((item) => `<div><span>${item.date}</span><strong>${item.name}</strong><em>${item.type}</em><b>${money(item.amount)}</b></div>`).join('')}
          </article>
          <aside class="panel surplus-card">
            <span>Monthly breakdown</span>
            <div><small>Income</small><strong>${money(balance())}</strong></div>
            <div><small>Regular expenses</small><strong>-${money(expensesTotal())}</strong></div>
            <div><small>Savings contribution</small><strong>-${money(MONTHLY_SAVINGS_CONTRIBUTION)}</strong></div>
            <hr />
            <div class="surplus-total"><small>Projected surplus</small><strong>${money(monthlySurplus())}</strong></div>
          </aside>
        </div>
      </section>
      <section class="section-tight interest-section">
        <div class="section-header">
          <span class="eyebrow">Savings interest</span>
          <h2>R60,000 saved toward a R200,000 goal.</h2>
        </div>
        <div class="interest-grid">
          ${interestCollected.map((item) => `<article><span>${item.date}</span><h3>${money(item.amount)}</h3><p>${item.name}</p></article>`).join('')}
          <article class="interest-total"><span>Total interest</span><h3>${money(interestTotal())}</h3><p>Collected and projected interest shown for the current savings rhythm.</p><div class="progress"><i style="width:${savingsProgress()}%"></i></div></article>
        </div>
      </section>
      <section class="section-tight report-strip">
        <img src="assets/corporate-2.jpg" alt="Financial dashboard analytics" />
        <div>
          <span>Executive reporting</span>
          <h2>Evidence-rich dashboards for people who approve money.</h2>
          <p>Transaction context, transfer status, card control changes, and risk decisions stay visible in one operating layer.</p>
        </div>
      </section>
      <section class="section-tight vault-lab">
        <div class="section-header">
          <span class="eyebrow">Vault allocation lab</span>
          <h2>Rebalance a calm money plan.</h2>
        </div>
        <div class="vault-grid">
          ${Object.entries(vaultMix).map(([key, value]) => vaultControl(key, value)).join('')}
          <article class="vault-summary">
            <span>Plan total</span>
            <strong>${Object.values(vaultMix).reduce((sum, value) => sum + Number(value), 0)}%</strong>
            <p>Use this as a planning simulation. Real transfers still go through approval and risk checks.</p>
          </article>
        </div>
      </section>
    </main>
  `;
}

function cardsPage() {
  return `
    <main class="page">
      <section class="page-hero split-hero">
        <div>
          <span class="eyebrow">Card studio</span>
          <h1>Give every card a job, then lock it down.</h1>
          <p>Freeze a card instantly, change merchant categories, tune tap limits, and see the card state update across the portal.</p>
        </div>
        ${cardPreview('studio-card')}
      </section>
      <section class="section-tight card-studio">
        <article class="panel control-panel">
          <h2>Live controls</h2>
          <button id="freeze-card">${cardState?.frozen ? 'Unfreeze card' : 'Freeze card'}</button>
          <button id="online-card">${cardState?.online === false ? 'Enable online spend' : 'Disable online spend'}</button>
          <label>Tap limit
            <input id="tap-limit" type="range" min="500" max="15000" step="500" value="${cardState?.tapLimit || 2500}" />
            <strong>${money(cardState?.tapLimit || 2500)}</strong>
          </label>
          <div class="merchant-locks">
            ${['Travel + Dining', 'Subscriptions', 'Fuel + Groceries', 'One-time Checkout', 'Business Vendors'].map((item) => `<button class="${(cardState?.merchantLock || 'Travel + Dining') === item ? 'active' : ''}" data-merchant="${item}">${item}</button>`).join('')}
          </div>
          <p id="card-status">Card settings are demo-backed through the Node API after login.</p>
        </article>
        <article class="panel approval-panel">
          <h2>Approval trail</h2>
          ${[
            ['Virtual token issued', 'Clear'],
            ['Merchant rule synced', cardState?.merchantLock || 'Travel + Dining'],
            ['Tap limit reviewed', money(cardState?.tapLimit || 2500)],
            ['Status', cardState?.frozen ? 'Frozen' : 'Active'],
          ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('')}
        </article>
      </section>
    </main>
  `;
}

function insightsPage() {
  const mode = flowModes[activeFlow];
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">VaultPay FlowLens</span>
        <h1>A unique cockpit for spend, save, shield, and send.</h1>
        <p>Switch the interface around the job the user came to do. The dashboard becomes a decision tool instead of a chart pile.</p>
      </section>
      <section class="flow-grid section-tight">
        <div class="flow-orbit" style="--flow:${mode.accent}">
          <div class="orbit-ring"></div>
          <strong>${mode.metric}</strong>
          <span>${activeFlow}</span>
        </div>
        <div class="flow-panel">
          <div class="flow-tabs">
            ${Object.keys(flowModes).map((item) => `<button class="${item === activeFlow ? 'active' : ''}" data-flow="${item}">${item}</button>`).join('')}
          </div>
          <h2>${mode.title}</h2>
          <p>${mode.detail}</p>
          <div class="flow-proof"><span>Live risk preview</span><b>${activeFlow === 'Shield' ? 'Every signal explained' : 'No hidden status'}</b></div>
        </div>
      </section>
      <section class="section-tight insight-lab">
        <form class="panel risk-lab" id="risk-form">
          <h2>Transfer risk simulator</h2>
          <label>Amount in rands<input name="amount" type="number" min="1" value="18500" /></label>
          <label>Recipient type<select name="recipient_type"><option>Known supplier</option><option>New recipient</option><option>International account</option><option>Family member</option></select></label>
          <button>Preview risk</button>
          <p id="risk-result">Enter an amount to preview release status before sending.</p>
        </form>
        <article class="panel spend-story">
          <h2>Weekly spend rhythm</h2>
          <div class="mini-chart">${spendData.map(([day, value]) => `<span title="${day}" style="height:${Math.round(value / 45)}%"></span>`).join('')}</div>
          <p>Bars animate from backend-ready demo data so the dashboard feels alive without becoming noisy.</p>
        </article>
      </section>
    </main>
  `;
}

function securityPage() {
  return `
    <main class="page">
      <section class="page-hero split-hero">
        <div>
          <span class="eyebrow">Security center</span>
          <h1>Risk signals made readable.</h1>
          <p>Every large transfer is scored, every card can be locked instantly, and every merchant rule remains visible.</p>
        </div>
        <img class="hero-photo" src="assets/corporate-4.jpg" alt="Corporate meeting with financial planning" />
      </section>
      <section class="section-tight security-grid">
        <div class="signal-list">
          ${securitySignals.map(([type, signal, status], index) => `<div><b>0${index + 1}</b><span><small>${type}</small>${signal}</span><em class="${status}">${status}</em></div>`).join('')}
        </div>
        <article class="panel policy-builder">
          <h2>Approval policy builder</h2>
          <label>Manual review threshold<input id="review-threshold" type="range" min="10000" max="100000" step="5000" value="50000" /></label>
          <strong id="threshold-value">${money(50000)}</strong>
          <p>Set the value where transfers need human approval. This is a demo rule builder for finance teams.</p>
          <button id="save-policy">Save policy</button>
        </article>
      </section>
    </main>
  `;
}

function portalPage() {
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">Member portal</span>
        <h1>Create an account, send money, and keep a clear ledger.</h1>
        <p>The portal uses the Node backend for login, account balance, transfer recording, and card controls. Demo accounts start with ${money(DEMO_BALANCE)}.</p>
      </section>
      <section class="portal-grid section-tight">
        <form class="portal-card" id="auth-form">
          <h2>${activeUser ? `Welcome, ${activeUser.name}` : 'Create account / login'}</h2>
          <input name="name" placeholder="Name" value="${activeUser?.name || ''}" />
          <input name="email" type="email" placeholder="Email" value="${activeUser?.email || ''}" required />
          <input name="password" type="password" placeholder="Password" required />
          <div class="button-row">
            <button name="mode" value="register">Create account</button>
            <button name="mode" value="login">Login</button>
          </div>
          <p id="auth-status">${activeUser ? 'Account session active.' : 'Use any demo email and password.'}</p>
        </form>
        <form class="portal-card" id="transfer-form">
          <h2>Transfer simulator</h2>
          <input name="recipient" placeholder="Recipient" required />
          <input name="amount" type="number" min="1" placeholder="Amount in rands" required />
          <input name="reference" placeholder="Reference" />
          <button>Send transfer</button>
          <p id="transfer-status">${token ? 'Transfers will update your account balance.' : 'Login first to send a demo transfer.'}</p>
        </form>
        <article class="portal-card ledger">
          <h2>Recent ledger</h2>
          <div id="ledger">${transfers.length ? transfers.map(ledgerRow).join('') : '<p>No transfers yet.</p>'}</div>
        </article>
      </section>
      <section class="section-tight live-band">
        <div class="section-header">
          <span class="eyebrow">Backend connected</span>
          <h2>Live operating layer for fintech actions.</h2>
        </div>
        <div class="metrics" id="metrics"></div>
        <div class="ops-panel"><b>Ops activity</b><ul id="activity"></ul></div>
      </section>
      <section class="section-tight notification-dock">
        <h2>Portal notifications</h2>
        <div>${notifications.length ? notifications.map((item) => `<article><span>${item.time}</span><p>${item.message}</p></article>`).join('') : '<p>No notifications yet. Account updates and saved controls appear here.</p>'}</div>
      </section>
    </main>
  `;
}

function shoppingPage() {
  const totals = categoryTotals();
  return `
    <main class="page">
      <section class="page-hero compact">
        <span class="eyebrow">Shopping spreadsheet</span>
        <h1>Plan groceries, household items, and added luxuries in one clean sheet.</h1>
        <p>Create a monthly shopping spreadsheet, separate essentials from luxuries, and export the plan as a CSV file for Excel, Google Sheets, or client handover.</p>
      </section>
      <section class="section-tight sheet-summary">
        <article class="score-tile"><span>Total planned spend</span><strong>${money(shoppingTotal())}</strong></article>
        <article class="score-tile"><span>Groceries</span><strong>${money(totals.Groceries || 0)}</strong></article>
        <article class="score-tile"><span>Added luxuries</span><strong>${money(totals.Luxury || 0)}</strong></article>
      </section>
      <section class="section-tight spreadsheet-layout">
        <form class="panel sheet-form" id="shopping-form">
          <h2>Add item</h2>
          <label>Date<input name="date" placeholder="20 May" required /></label>
          <label>Category
            <select name="category">
              <option>Groceries</option>
              <option>Household</option>
              <option>Luxury</option>
              <option>Personal Care</option>
              <option>Transport</option>
            </select>
          </label>
          <label>Item<input name="item" placeholder="Example: weekly vegetables" required /></label>
          <label>Quantity<input name="quantity" type="number" min="1" value="1" required /></label>
          <label>Unit price<input name="unitPrice" type="number" min="0" value="250" required /></label>
          <button>Add to spreadsheet</button>
          <button class="ghost" type="button" id="download-sheet">Download CSV</button>
          <p id="sheet-status">Rows are saved in this browser and can be exported.</p>
        </form>
        <article class="panel shopping-sheet">
          <div class="sheet-actions">
            <h2>Monthly shopping sheet</h2>
            <button class="ghost" id="reset-sheet" type="button">Reset demo rows</button>
          </div>
          <div class="sheet-table">
            <div class="sheet-head"><span>Date</span><span>Category</span><span>Item</span><span>Qty</span><span>Unit</span><span>Total</span><span></span></div>
            ${shoppingRows.map((row) => `
              <div>
                <span>${row.date}</span>
                <em>${row.category}</em>
                <strong>${row.item}</strong>
                <span>${row.quantity}</span>
                <span>${money(row.unitPrice)}</span>
                <b>${money(rowTotal(row))}</b>
                <button class="delete-row" data-delete-row="${row.id}" type="button">Remove</button>
              </div>
            `).join('')}
          </div>
        </article>
      </section>
      <section class="section-tight category-breakdown">
        ${Object.entries(totals).map(([category, total]) => `<article><span>${category}</span><h3>${money(total)}</h3><p>${Math.round((total / Math.max(1, shoppingTotal())) * 100)}% of planned shopping spend.</p></article>`).join('')}
      </section>
    </main>
  `;
}

function cardPreview(extraClass = '') {
  return `
    <div class="phone-shell ${extraClass}">
      <div class="black-card ${cardState?.frozen ? 'frozen' : ''}">
        <span>Current Account</span>
        <strong>${money(balance())}</strong>
        <small>Monthly income - surplus ${money(monthlySurplus())}</small>
      </div>
      <div class="card-meta">
        <span>Savings ${money(DEMO_SAVINGS_SAVED)}</span>
        <b>${money(MONTHLY_SAVINGS_CONTRIBUTION)} monthly transfer</b>
      </div>
    </div>
  `;
}

function productCard([code, name, detail]) {
  return `<article><span>${code}</span><h3>${name}</h3><p>${detail}</p><button data-product="${name}">Add to account plan</button></article>`;
}

function vaultControl(key, value) {
  const labels = { essentials: 'Essentials', reserve: 'Reserve', growth: 'Growth' };
  return `
    <article class="vault-control">
      <label>${labels[key]}<input data-vault="${key}" type="range" min="0" max="100" value="${value}" /></label>
      <strong>${value}%</strong>
      <p>${money((balance() * value) / 100)} planned</p>
    </article>
  `;
}

function ledgerRow(item) {
  return `<div><b>${item.recipient}</b><span>${money(item.amount)}</span><em class="${item.risk}">${item.risk}</em></div>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div>
        <span>VaultPay</span>
        <p>Calm money movement, guarded balances, and fintech polish with a human pulse.</p>
      </div>
      <strong>A Quantum Cupcake Creation</strong>
    </footer>
  `;
}

function render() {
  const pages = {
    '/': homePage,
    '/dashboard': dashboardPage,
    '/cards': cardsPage,
    '/insights': insightsPage,
    '/security': securityPage,
    '/shopping': shoppingPage,
    '/portal': portalPage,
  };
  app.innerHTML = shell(pages[pathName()]());
  wire();
  if (pathName() === '/portal') loadSite();
  if (token) loadAccount();
}

function wire() {
  document.querySelectorAll('[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      routeTo(link.getAttribute('href'));
    });
  });

  document.querySelector('#auth-form')?.addEventListener('submit', auth);
  document.querySelector('#transfer-form')?.addEventListener('submit', transfer);
  document.querySelector('#shopping-form')?.addEventListener('submit', addShoppingRow);
  document.querySelector('#download-sheet')?.addEventListener('click', downloadShoppingCsv);
  document.querySelector('#reset-sheet')?.addEventListener('click', resetShoppingRows);
  document.querySelector('#freeze-card')?.addEventListener('click', () => updateCard({ frozen: !cardState?.frozen }));
  document.querySelector('#online-card')?.addEventListener('click', () => updateCard({ online: cardState?.online === false }));
  document.querySelector('#tap-limit')?.addEventListener('input', (event) => updateCard({ tapLimit: Number(event.target.value) }, false));
  document.querySelector('#save-policy')?.addEventListener('click', () => {
    notify(`Approval threshold saved at ${document.querySelector('#threshold-value').textContent}.`);
    routeTo('/portal');
  });
  document.querySelector('#review-threshold')?.addEventListener('input', (event) => {
    document.querySelector('#threshold-value').textContent = money(event.target.value);
  });

  document.querySelectorAll('[data-merchant]').forEach((button) => {
    button.addEventListener('click', () => updateCard({ merchantLock: button.dataset.merchant }));
  });

  document.querySelectorAll('[data-vault]').forEach((input) => {
    input.addEventListener('input', () => {
      vaultMix[input.dataset.vault] = Number(input.value);
      persist();
      render();
    });
  });

  document.querySelectorAll('[data-flow]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFlow = button.dataset.flow;
      persist();
      render();
    });
  });

  document.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      notify(`${button.dataset.product} added to the account plan.`);
      routeTo('/portal');
    });
  });

  document.querySelectorAll('[data-delete-row]').forEach((button) => {
    button.addEventListener('click', () => {
      shoppingRows = shoppingRows.filter((row) => row.id !== button.dataset.deleteRow);
      notify('Shopping spreadsheet row removed.');
      persist();
      render();
    });
  });

  document.querySelector('#risk-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const risk = riskFor(payload.amount);
    document.querySelector('#risk-result').innerHTML = `<b>${risk.label.toUpperCase()} risk - ${risk.score}/100</b><br>${risk.detail}`;
  });
}

function addShoppingRow(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  shoppingRows = [
    ...shoppingRows,
    {
      id: crypto.randomUUID(),
      date: payload.date,
      category: payload.category,
      item: payload.item,
      quantity: Number(payload.quantity || 1),
      unitPrice: Number(payload.unitPrice || 0),
    },
  ];
  notify(`${payload.item} added to the shopping spreadsheet.`);
  persist();
  render();
}

function resetShoppingRows() {
  localStorage.removeItem('vaultpay_shopping_rows');
  shoppingRows = [
    { id: 'shop-1', date: '08 May', category: 'Groceries', item: 'Fresh produce', quantity: 1, unitPrice: 950 },
    { id: 'shop-2', date: '08 May', category: 'Groceries', item: 'Protein and dairy', quantity: 1, unitPrice: 1250 },
    { id: 'shop-3', date: '08 May', category: 'Groceries', item: 'Pantry staples', quantity: 1, unitPrice: 780 },
    { id: 'shop-4', date: '10 May', category: 'Household', item: 'Cleaning supplies', quantity: 1, unitPrice: 640 },
    { id: 'shop-5', date: '12 May', category: 'Luxury', item: 'Dinner out', quantity: 1, unitPrice: 850 },
    { id: 'shop-6', date: '18 May', category: 'Luxury', item: 'Beauty or grooming', quantity: 1, unitPrice: 650 },
  ];
  notify('Shopping spreadsheet reset to demo rows.');
  persist();
  render();
}

function downloadShoppingCsv() {
  const headers = ['Date', 'Category', 'Item', 'Quantity', 'Unit Price', 'Total'];
  const rows = shoppingRows.map((row) => [row.date, row.category, row.item, row.quantity, row.unitPrice, rowTotal(row)]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vaultpay-shopping-spreadsheet.csv';
  link.click();
  URL.revokeObjectURL(url);
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
  cardState = data.card;
  notify(`${data.user.name} opened the VaultPay portal.`);
  persist();
  routeTo('/dashboard');
}

async function loadAccount() {
  const response = await fetch('/api/account', { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) return;
  const data = await response.json();
  activeUser = data.user;
  cardState = data.card;
  transfers = data.transfers;
  persist();
}

async function transfer(event) {
  event.preventDefault();
  const status = document.querySelector('#transfer-status');
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  const response = await fetch('/api/transfers', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  const data = await response.json();
  status.textContent = response.ok ? `Transfer sent with ${data.transfer.risk} risk status.` : data.error;
  if (response.ok) {
    activeUser = data.user;
    notify(`${money(data.transfer.amount)} sent to ${data.transfer.recipient} with ${data.transfer.risk} status.`);
    await loadAccount();
    render();
  }
}

async function updateCard(payload, rerender = true) {
  cardState = { frozen: false, online: true, tapLimit: 2500, merchantLock: 'Travel + Dining', ...cardState, ...payload };
  persist();

  if (token) {
    const response = await fetch('/api/card', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(cardState) });
    const data = await response.json();
    if (response.ok) cardState = data.card;
  }

  notify('Card studio settings updated.');
  persist();
  if (rerender) render();
  else {
    const status = document.querySelector('#card-status');
    if (status) status.textContent = `Tap limit updated to ${money(cardState.tapLimit)}.`;
  }
}

async function loadSite() {
  const metrics = document.querySelector('#metrics');
  const activity = document.querySelector('#activity');
  if (!metrics || !activity) return;
  const response = await fetch('/api/site');
  const data = await response.json();
  metrics.innerHTML = data.metrics.map((metric) => `<article><span>${metric.label}</span><strong>${metric.value}</strong><p>${metric.detail}</p></article>`).join('');
  activity.innerHTML = data.activity.map((item) => `<li>${item}</li>`).join('');
}

window.addEventListener('popstate', render);
window.addEventListener('hashchange', render);

render();
