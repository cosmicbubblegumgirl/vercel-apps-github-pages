(() => {
  const nativeFetch = window.fetch.bind(window);
  const usersKey = 'kindstride_static_users';
  const leadKey = 'kindstride_static_leads';
  const checkinKey = 'kindstride_static_checkins';

  const siteData = {
    metrics: [
      { label: 'Tiny wins', value: '1,842', detail: 'first actions completed by beginners' },
      { label: 'Comfort', value: '92%', detail: 'members chose a low-pressure starter path' },
      { label: 'Requests', value: '37', detail: 'private support requests this week' },
    ],
    activity: [
      'A member saved a two-minute doorway stretch',
      'Gentle plan generated for an at-home starter',
      'Private support consult requested',
    ],
  };

  const supportLabels = {
    private: 'Private and quiet support',
    gentle: 'Gentle reminder support',
    guided: 'Step-by-step guidance',
    community: 'Small supportive group',
  };

  function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  function load(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function id(prefix) {
    return `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
  }

  async function body(options = {}) {
    if (!options.body) return {};
    return typeof options.body === 'string' ? JSON.parse(options.body || '{}') : options.body;
  }

  function publicUser(user) {
    return { id: user.id, name: user.name, email: user.email };
  }

  function buildPlan(payload) {
    const fear = Number(payload.fear || 3);
    const minutes = Number(payload.minutes || 5);
    const comfort = fear >= 4 ? 'Very gentle' : fear === 3 ? 'Low pressure' : 'Ready but calm';
    const foodDay = payload.goal === 'Feel better around food';
    return {
      id: id('plan'),
      title: `${comfort} ${payload.goal || 'starter'} week`,
      goal: payload.goal || 'Feel less stuck',
      minutes,
      comfort,
      supportLabel: supportLabels[payload.support] || supportLabels.gentle,
      price: minutes <= 5 ? 'R390' : minutes <= 10 ? 'R590' : 'R790',
      note: 'This plan is intentionally small. It is designed to help you begin without shame, pressure, or all-or-nothing thinking.',
      blocks: [
        { day: 'Day 1', session: foodDay ? 'Kind plate check' : 'One safe movement', detail: foodDay ? 'Add one helpful food, no restriction required.' : `${minutes} minutes in ${(payload.space || 'at home').toLowerCase()} with full permission to stop.` },
        { day: 'Day 2', session: 'Confidence repeat', detail: 'Repeat the easiest part from day one so starting can feel safe.' },
        { day: 'Day 3', session: 'Breath and reset', detail: 'A short breathing cue plus one low-effort stretch.' },
        { day: 'Day 4', session: 'Tiny progress choice', detail: 'Choose a walk, stretch, water ritual, or gentle strength move based on energy.' },
      ],
      createdAt: new Date().toISOString(),
    };
  }

  function buildCaloriePlan(payload) {
    const age = Math.max(16, Number(payload.age || 30));
    const height = Math.max(120, Number(payload.height_cm || 165));
    const weight = Math.max(40, Number(payload.weight_kg || 80));
    const activity = Number(payload.activity || 1.25);
    const profile = payload.profile || 'neutral';
    const pace = payload.pace || 'gentle';
    const sexAdjustment = profile === 'male' ? 5 : profile === 'female' ? -161 : -78;
    const bmr = Math.round((10 * weight) + (6.25 * height) - (5 * age) + sexAdjustment);
    const maintenance = Math.round(bmr * activity);
    const requestedDeficit = pace === 'steady' ? 450 : pace === 'patient' ? 200 : 300;
    const floor = profile === 'male' ? 1500 : profile === 'female' ? 1300 : 1400;
    const target = Math.max(floor, maintenance - requestedDeficit);
    const deficit = Math.max(0, maintenance - target);
    return {
      id: id('calorie'),
      title: `${pace[0].toUpperCase()}${pace.slice(1)} calorie-deficit plan`,
      maintenance,
      target,
      deficit,
      pace,
      protein: `${Math.round(weight * 1.2)}-${Math.round(weight * 1.6)}g`,
      fiber: '25-35g',
      water: '6-8 glasses',
      note: 'This is a gentle estimate, not medical advice. Avoid aggressive restriction and speak with a qualified professional if needed.',
      meals: [
        'Breakfast: protein plus fibre, such as eggs or yoghurt with fruit.',
        'Lunch: a full plate with lean protein, vegetables, and a steady carbohydrate.',
        'Snack: choose a planned option before hunger becomes urgent.',
        'Dinner: keep familiar foods, then adjust portions calmly instead of cutting everything out.',
      ],
      createdAt: new Date().toISOString(),
    };
  }

  window.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.startsWith('/api/')) return nativeFetch(input, options);

    const method = (options.method || 'GET').toUpperCase();
    const payload = await body(options);
    const users = load(usersKey, []);

    if (url.pathname === '/api/site') return json({ ...siteData, users: users.length, leads: load(leadKey, []).length, checkins: load(checkinKey, []).length });
    if (method === 'POST' && ['/api/register', '/api/login'].includes(url.pathname)) {
      let user = users.find((item) => item.email === payload.email);
      if (!user) {
        user = { id: id('user'), name: payload.name || 'KindStride Guest', email: payload.email || `guest-${Date.now()}@kindstride.local` };
        users.push(user);
        save(usersKey, users);
      }
      return json({ token: id('token'), user: publicUser(user) }, url.pathname.endsWith('register') ? 201 : 200);
    }
    if (method === 'POST' && url.pathname === '/api/plans') return json({ plan: buildPlan(payload) }, 201);
    if (method === 'POST' && url.pathname === '/api/calorie-plan') return json({ plan: buildCaloriePlan(payload) }, 201);
    if (method === 'POST' && url.pathname === '/api/checkins') {
      const checkins = load(checkinKey, []);
      checkins.unshift({ id: id('checkin'), ...payload, createdAt: new Date().toISOString() });
      save(checkinKey, checkins);
      return json({ ok: true, checkins }, 201);
    }
    if (method === 'POST' && url.pathname === '/api/leads') {
      const leads = load(leadKey, []);
      leads.unshift({ id: id('lead'), ...payload, createdAt: new Date().toISOString() });
      save(leadKey, leads);
      return json({ ok: true, lead: leads[0] }, 201);
    }
    return json({ error: 'Static endpoint not found' }, 404);
  };
})();
