(() => {
  const nativeFetch = window.fetch.bind(window);
  const seedTasks = [
    { id: 't1', title: 'Map onboarding journey', owner: 'Nadia', status: 'Backlog', days: 2, priority: 'High' },
    { id: 't2', title: 'Polish executive dashboard', owner: 'Leo', status: 'Doing', days: 1, priority: 'High' },
    { id: 't3', title: 'Add billing plan states', owner: 'Amina', status: 'Backlog', days: 3, priority: 'Medium' },
    { id: 't4', title: 'QA empty state language', owner: 'Sam', status: 'Review', days: 1, priority: 'Low' },
    { id: 't5', title: 'Ship responsive workspace', owner: 'Mila', status: 'Done', days: 0, priority: 'High' },
  ];

  const siteData = {
    metrics: [
      { label: 'Velocity', value: '31', detail: 'points completed this sprint' },
      { label: 'Blocked', value: '3', detail: 'items needing review' },
      { label: 'Health', value: '92%', detail: 'delivery confidence' },
    ],
    activity: ['Roadmap moved into review', 'Design QA checklist completed', 'AI sprint summary drafted'],
  };

  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const id = (prefix) => `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const parseBody = async (options = {}) => (options.body ? JSON.parse(options.body) : {});

  function userFromPayload(payload) {
    return { id: read('taskforge_user', null)?.id || id('user'), name: payload.name || 'Demo Maker', email: payload.email || 'demo@sprintsmith.local' };
  }

  function workspaceFor(user) {
    const existing = read('taskforge_workspace', null);
    if (existing?.tasks) return existing;
    return { id: id('workspace'), userId: user.id, name: `${user.name}'s SprintSmith Workshop`, plan: 'Scale', tasks: seedTasks.map((task) => ({ ...task })), notes: [] };
  }

  function summarize(workspace) {
    const counts = workspace.tasks.reduce((acc, task) => ({ ...acc, [task.status]: (acc[task.status] || 0) + 1 }), {});
    return {
      workspace,
      summary: {
        backlog: counts.Backlog || 0,
        doing: counts.Doing || 0,
        review: counts.Review || 0,
        done: counts.Done || 0,
        reportReady: Boolean((counts.Review || 0) + (counts.Done || 0)),
        health: workspace.tasks.some((task) => task.priority === 'High' && task.status !== 'Done') ? 'Watch' : 'Clear',
      },
    };
  }

  function buildReport(workspace) {
    const tasks = workspace.tasks;
    const done = tasks.filter((task) => task.status === 'Done');
    const review = tasks.filter((task) => task.status === 'Review');
    const doing = tasks.filter((task) => task.status === 'Doing');
    const backlog = tasks.filter((task) => task.status === 'Backlog');
    const highRisk = tasks.filter((task) => task.priority === 'High' && task.status !== 'Done');
    const score = Math.min(100, Math.max(42, Math.round(((done.length * 1.25 + review.length) / Math.max(tasks.length, 1)) * 100)));
    return {
      title: `${workspace.name} AI Sprint Report`,
      date: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: highRisk.length ? 'Watch' : 'Clear',
      deliveryScore: score,
      executiveSummary: `SprintSmith analysed ${tasks.length} tasks across the board. ${review.length} are in Review and ${done.length} are Done. ${highRisk.length ? 'High-priority open work needs attention before external reporting.' : 'The board is in a presentable delivery state.'}`,
      metrics: [
        { label: 'Reviewed', value: String(review.length), detail: 'tasks waiting for sign-off' },
        { label: 'Completed', value: String(done.length), detail: 'tasks ready as delivery evidence' },
        { label: 'Active', value: String(doing.length), detail: 'tasks moving through the sprint' },
      ],
      sections: [
        { heading: 'Reviewed work', items: review.length ? review.map((task) => task.title) : ['No tasks are waiting in Review.'] },
        { heading: 'Completed work', items: done.length ? done.map((task) => task.title) : ['No tasks have reached Done yet.'] },
        { heading: 'Risks and blockers', items: highRisk.length ? highRisk.map((task) => `${task.title} is still ${task.status}.`) : ['No high-priority blockers are visible.'] },
        { heading: 'Recommended next moves', items: backlog.length ? ['Pull one high-priority backlog item into Doing.', 'Use the review lane for stakeholder-ready work.'] : ['Keep the next standup focused on review and release evidence.'] },
      ],
    };
  }

  window.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.startsWith('/api/')) return nativeFetch(input, options);
    const method = (options.method || 'GET').toUpperCase();
    const payload = await parseBody(options);
    const user = read('taskforge_user', null) || userFromPayload(payload);
    let workspace = workspaceFor(user);

    if (url.pathname === '/api/site') return json({ ...siteData, workspaces: 1 });
    if (method === 'POST' && ['/api/register', '/api/login'].includes(url.pathname)) {
      const nextUser = userFromPayload(payload);
      workspace = workspaceFor(nextUser);
      write('taskforge_user', nextUser);
      write('taskforge_workspace', workspace);
      return json({ token: id('token'), user: nextUser, ...summarize(workspace) }, url.pathname.endsWith('register') ? 201 : 200);
    }
    if (url.pathname === '/api/workspace') return json(summarize(workspace));
    if (method === 'POST' && url.pathname === '/api/tasks') {
      workspace.tasks.unshift({ id: id('task'), title: payload.title || 'Untitled task', owner: payload.owner || user.name, status: payload.status || 'Backlog', days: Number(payload.days || 1), priority: payload.priority || 'Medium' });
      write('taskforge_workspace', workspace);
      return json(summarize(workspace), 201);
    }
    if (method === 'POST' && url.pathname === '/api/move-task') {
      const task = workspace.tasks.find((item) => item.id === payload.id);
      if (task) task.status = payload.status;
      write('taskforge_workspace', workspace);
      return json(summarize(workspace));
    }
    if (method === 'POST' && url.pathname === '/api/summary') {
      const report = buildReport(workspace);
      const note = { id: id('note'), createdAt: new Date().toISOString(), report };
      workspace.notes = [note, ...(workspace.notes || [])].slice(0, 5);
      write('taskforge_workspace', workspace);
      return json({ note, ...summarize(workspace) }, 201);
    }
    if (url.pathname === '/api/report-pdf') {
      const report = workspace.notes?.[0]?.report || buildReport(workspace);
      const text = [report.title, report.executiveSummary, ...report.sections.flatMap((section) => [section.heading, ...section.items])].join('\n\n');
      return new Response(new Blob([text], { type: 'application/pdf' }), { status: 200, headers: { 'Content-Type': 'application/pdf' } });
    }
    return json({ error: 'Static endpoint not found' }, 404);
  };
})();
