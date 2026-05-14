(() => {
  const nativeFetch = window.fetch.bind(window);
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const id = (prefix) => `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const parseBody = async (options = {}) => (options.body ? JSON.parse(options.body) : {});
  const defaultCard = { frozen: false, online: true, tapLimit: 2500, merchantLock: 'Travel + Dining' };
  const demoAccount = { balance: 35000, savingsGoal: 200000, savingsSaved: 60000 };

  const siteData = {
    metrics: [
      { label: 'Ledger volume', value: 'R 8.4m', detail: 'simulated payments cleared today' },
      { label: 'Risk score', value: 'A+', detail: 'security center status' },
      { label: 'Approval time', value: '2.8s', detail: 'average transfer decisioning' },
    ],
    activity: ['Virtual card controls synced', 'Fraud rule preview generated for unusual merchant pattern', 'Savings goal automation reviewed for premium account'],
  };

  const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, balance: user.balance, savingsGoal: user.savingsGoal, savingsSaved: user.savingsSaved });
  const activeUser = (payload = {}) => read('vaultpay_user', null) || { id: id('user'), name: payload.name || 'VaultPay Guest', email: payload.email || 'guest@vaultpay.local', ...demoAccount };
  const risk = (amount) => Number(amount || 0) > 50000 ? 'review' : Number(amount || 0) > 15000 ? 'watch' : 'clear';

  window.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.startsWith('/api/')) return nativeFetch(input, options);
    const method = (options.method || 'GET').toUpperCase();
    const payload = await parseBody(options);
    let user = activeUser(payload);
    let card = read('vaultpay_card', defaultCard);
    let transfers = read('vaultpay_transfers', []);

    if (url.pathname === '/api/site') return json({ ...siteData, users: user ? 1 : 0, transfers: transfers.length });
    if (method === 'POST' && ['/api/register', '/api/login'].includes(url.pathname)) {
      user = { ...user, name: payload.name || user.name, email: payload.email || user.email, ...demoAccount };
      card = { ...defaultCard, ...card };
      write('vaultpay_user', user);
      write('vaultpay_card', card);
      return json({ token: id('token'), user: publicUser(user), card }, url.pathname.endsWith('register') ? 201 : 200);
    }
    if (url.pathname === '/api/account') return json({ user: publicUser(user), card, transfers });
    if (method === 'POST' && url.pathname === '/api/transfers') {
      const amount = Number(payload.amount || 0);
      if (!payload.recipient || amount <= 0) return json({ error: 'Recipient and amount are required' }, 400);
      const transfer = { id: id('transfer'), userId: user.id, createdAt: new Date().toISOString(), recipient: payload.recipient, amount, reference: payload.reference || 'VaultPay transfer', risk: risk(amount) };
      transfers = [transfer, ...transfers].slice(0, 30);
      user = { ...user, balance: Math.max(0, Number(user.balance || 0) - amount) };
      write('vaultpay_transfers', transfers);
      write('vaultpay_user', user);
      return json({ ok: true, transfer, user: publicUser(user) }, 201);
    }
    if (method === 'POST' && url.pathname === '/api/card') {
      card = { ...card, ...payload };
      write('vaultpay_card', card);
      return json({ ok: true, card });
    }
    return json({ error: 'Static endpoint not found' }, 404);
  };
})();
