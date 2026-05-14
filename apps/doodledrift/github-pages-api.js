(() => {
  const nativeFetch = window.fetch.bind(window);
  const keys = {
    user: 'doodledrift_static_user_id',
    users: 'doodledrift_static_users',
    doodles: 'doodledrift_static_doodles',
    clips: 'doodledrift_static_clips',
    removedClips: 'doodledrift_static_removed_clips',
    glows: 'doodledrift_static_glows',
    echoes: 'doodledrift_static_echoes',
    moods: 'doodledrift_static_moods',
    prompts: 'doodledrift_static_prompts',
  };

  let seedPromise;
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const id = (prefix) => `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  async function seed() {
    if (!seedPromise) seedPromise = nativeFetch('data/db.json').then((response) => response.json());
    return seedPromise;
  }

  async function db() {
    const base = await seed();
    return {
      ...base,
      users: [...(base.users || []), ...read(keys.users, [])],
      doodles: [...read(keys.doodles, []), ...(base.doodles || [])],
      cloudClips: [...read(keys.clips, []), ...(base.cloudClips || [])],
      glows: [...read(keys.glows, []), ...(base.glows || [])],
      echoes: [...read(keys.echoes, []), ...(base.echoes || [])],
      moodLogs: [...read(keys.moods, []), ...(base.moodLogs || [])],
      prompts: [...read(keys.prompts, []), ...(base.prompts || [])],
    };
  }

  function currentUser(data) {
    const stored = localStorage.getItem(keys.user);
    const userId = stored === null ? 'usr_001' : stored;
    if (!userId) return null;
    return data.users.find((user) => user.id === userId) || null;
  }

  function parseTags(value) {
    if (Array.isArray(value)) return value;
    return String(value || 'check-in').split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  async function requestBody(options = {}) {
    if (!options.body) return {};
    return typeof options.body === 'string' ? JSON.parse(options.body || '{}') : options.body;
  }

  function clipKey(clip) {
    return `${clip.userId}:${clip.doodleId}`;
  }

  function visibleClips(data) {
    const removed = new Set(read(keys.removedClips, []));
    return data.cloudClips.filter((clip) => !removed.has(clipKey(clip)));
  }

  function enrichDoodle(data, doodle) {
    const user = currentUser(data);
    const clips = visibleClips(data);
    const glows = data.glows.filter((glow) => glow.doodleId === doodle.id);
    const echoes = data.echoes.filter((echo) => echo.doodleId === doodle.id);
    return {
      ...doodle,
      author: data.users.find((item) => item.id === doodle.authorId),
      glowCount: glows.length,
      echoCount: echoes.length,
      saveCount: clips.filter((clip) => clip.doodleId === doodle.id).length,
      saved: Boolean(user && clips.some((clip) => clip.userId === user.id && clip.doodleId === doodle.id)),
      userGlow: user ? glows.find((glow) => glow.userId === user.id)?.reaction : '',
    };
  }

  function profileFor(data, user) {
    const doodles = data.doodles.filter((doodle) => doodle.authorId === user.id).map((doodle) => enrichDoodle(data, doodle));
    return {
      profile: user,
      doodles,
      cloudClips: visibleClips(data).filter((clip) => clip.userId === user.id).length,
      glows: data.glows.filter((glow) => doodles.some((doodle) => doodle.id === glow.doodleId)).length,
    };
  }

  function saveCustomUser(user) {
    const users = read(keys.users, []);
    const without = users.filter((item) => item.id !== user.id);
    write(keys.users, [user, ...without]);
  }

  window.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.startsWith('/api/')) return nativeFetch(input, options);

    const method = (options.method || 'GET').toUpperCase();
    const payload = await requestBody(options);
    const data = await db();
    const user = currentUser(data);

    if (url.pathname === '/api/me') return json({ user });
    if (method === 'POST' && url.pathname === '/api/auth/logout') {
      localStorage.setItem(keys.user, '');
      return json({ ok: true });
    }
    if (method === 'POST' && ['/api/auth/login', '/api/auth/register'].includes(url.pathname)) {
      let nextUser = data.users.find((item) => item.email === payload.email || item.username === payload.username);
      if (!nextUser) {
        const username = payload.username || String(payload.email || 'DoodleFriend').split('@')[0].replace(/[^a-z0-9_-]/gi, '') || 'DoodleFriend';
        nextUser = {
          id: id('usr'),
          username,
          email: payload.email || `${username}@doodledrift.local`,
          displayName: payload.displayName || payload.name || username,
          bio: 'A new DoodleDen for saved art, sound, story, and mood marks.',
          moodBadge: 'Glowy',
          aura: 'Freshly opened creative weather',
          favoriteColors: ['#B8DEC8', '#BFD7EA', '#E6DC8F'],
          interests: ['canvas doodles', 'echo notes', 'cloud clips'],
          createdAt: new Date().toISOString(),
        };
        saveCustomUser(nextUser);
      }
      localStorage.setItem(keys.user, nextUser.id);
      return json({ token: id('session'), user: nextUser }, url.pathname.endsWith('register') ? 201 : 200);
    }
    if (url.pathname === '/api/doodles' && method === 'GET') {
      const doodles = data.doodles.map((doodle) => enrichDoodle(data, doodle)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return json({ doodles });
    }
    if (url.pathname === '/api/doodles' && method === 'POST') {
      if (!user) return json({ error: 'Enter the Den first.' }, 401);
      const doodle = {
        id: id('ddl'),
        authorId: user.id,
        type: payload.type || 'blog',
        title: payload.title || 'Untitled Doodle',
        body: payload.body || payload.prompt || 'A tiny creative check-in.',
        mood: payload.mood || 'Glowy',
        color: payload.color || '#B8DEC8',
        tags: parseTags(payload.tags),
        visibility: 'public',
        artDataUrl: payload.artDataUrl || '',
        songName: payload.songName || '',
        tempo: Number(payload.tempo || 72),
        prompt: payload.prompt || '',
        collectionHint: payload.collection || 'Dream Boards',
        createdAt: new Date().toISOString(),
      };
      write(keys.doodles, [doodle, ...read(keys.doodles, [])]);
      return json({ doodle: enrichDoodle(await db(), doodle) }, 201);
    }

    const echoMatch = url.pathname.match(/^\/api\/doodles\/([^/]+)\/echoes$/);
    if (echoMatch && method === 'GET') {
      const echoes = data.echoes
        .filter((echo) => echo.doodleId === echoMatch[1])
        .map((echo) => ({ ...echo, author: data.users.find((item) => item.id === echo.userId) }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return json({ echoes });
    }
    if (echoMatch && method === 'POST') {
      if (!user) return json({ error: 'Enter the Den first.' }, 401);
      const echo = { id: id('ech'), userId: user.id, doodleId: echoMatch[1], body: payload.body || 'A kind echo.', createdAt: new Date().toISOString() };
      write(keys.echoes, [echo, ...read(keys.echoes, [])]);
      return json({ echo }, 201);
    }

    const cloudMatch = url.pathname.match(/^\/api\/doodles\/([^/]+)\/cloud$/);
    if (cloudMatch && method === 'POST') {
      if (!user) return json({ error: 'Enter the Den first.' }, 401);
      const doodleId = cloudMatch[1];
      const removed = new Set(read(keys.removedClips, []));
      const existing = visibleClips(data).find((clip) => clip.userId === user.id && clip.doodleId === doodleId);
      if (existing) removed.add(`${user.id}:${doodleId}`);
      else {
        removed.delete(`${user.id}:${doodleId}`);
        write(keys.clips, [{ userId: user.id, doodleId, collection: 'Dream Boards', note: '', savedAt: new Date().toISOString() }, ...read(keys.clips, [])]);
      }
      write(keys.removedClips, [...removed]);
      return json({ saved: !existing });
    }

    const glowMatch = url.pathname.match(/^\/api\/doodles\/([^/]+)\/glow$/);
    if (glowMatch && method === 'POST') {
      if (!user) return json({ error: 'Enter the Den first.' }, 401);
      const glows = read(keys.glows, []).filter((glow) => !(glow.userId === user.id && glow.doodleId === glowMatch[1]));
      glows.unshift({ userId: user.id, doodleId: glowMatch[1], reaction: payload.reaction || 'glow', createdAt: new Date().toISOString() });
      write(keys.glows, glows);
      return json({ ok: true });
    }

    if (url.pathname === '/api/clips') {
      if (!user) return json({ clips: [] });
      const clips = visibleClips(data)
        .filter((clip) => clip.userId === user.id)
        .map((clip) => ({ ...clip, doodle: enrichDoodle(data, data.doodles.find((doodle) => doodle.id === clip.doodleId)) }))
        .filter((clip) => clip.doodle);
      return json({ clips });
    }
    const clipMatch = url.pathname.match(/^\/api\/clips\/([^/]+)$/);
    if (clipMatch && method === 'PATCH') {
      if (!user) return json({ error: 'Enter the Den first.' }, 401);
      const clips = read(keys.clips, []);
      const index = clips.findIndex((clip) => clip.userId === user.id && clip.doodleId === clipMatch[1]);
      const next = { userId: user.id, doodleId: clipMatch[1], collection: payload.collection || 'Dream Boards', note: payload.note || '', savedAt: new Date().toISOString() };
      if (index >= 0) clips[index] = { ...clips[index], ...next };
      else clips.unshift(next);
      write(keys.clips, clips);
      return json({ clip: next });
    }

    const profileMatch = url.pathname.match(/^\/api\/profile\/([^/]+)$/);
    if (profileMatch) {
      const profile = data.users.find((item) => item.username.toLowerCase() === decodeURIComponent(profileMatch[1]).toLowerCase());
      return profile ? json(profileFor(data, profile)) : json({ error: 'Profile not found' }, 404);
    }
    if (url.pathname === '/api/profile' && method === 'PATCH') {
      if (!user) return json({ error: 'Enter the Den first.' }, 401);
      const updated = {
        ...user,
        ...payload,
        favoriteColors: parseTags(payload.favoriteColors),
        interests: parseTags(payload.interests),
      };
      saveCustomUser(updated);
      localStorage.setItem(keys.user, updated.id);
      return json({ user: updated });
    }

    if (url.pathname === '/api/mood-logs' && method === 'GET') {
      return json({ logs: user ? data.moodLogs.filter((log) => log.userId === user.id).slice(0, 12) : [] });
    }
    if (url.pathname === '/api/mood-logs' && method === 'POST') {
      if (!user) return json({ error: 'Enter the Den first.' }, 401);
      const prompt = data.prompts.find((item) => item.category === payload.category)?.text || 'Draw your weather today.';
      const log = { id: id('mood'), userId: user.id, mood: payload.mood || 'Glowy', color: payload.color || '#B8DEC8', note: payload.note || '', prompt, category: payload.category || 'art', createdAt: new Date().toISOString() };
      write(keys.moods, [log, ...read(keys.moods, [])]);
      return json({ log }, 201);
    }
    if (url.pathname === '/api/prompt') {
      const category = url.searchParams.get('category');
      const pool = data.prompts.filter((prompt) => category === 'all' || !category || prompt.category === category);
      return json({ prompt: pool[Math.floor(Math.random() * Math.max(pool.length, 1))] || data.prompts[0] });
    }
    if (url.pathname === '/api/prompts' && method === 'POST') {
      const prompt = { id: id('prm'), category: payload.category || 'reflection', text: payload.text || 'Make one tiny mark for how today feels.' };
      write(keys.prompts, [prompt, ...read(keys.prompts, [])]);
      return json({ prompt }, 201);
    }
    if (url.pathname === '/api/playlists') return json({ playlists: data.playlists || [] });
    if (url.pathname === '/api/quests') return json({ quests: data.quests || [] });
    if (url.pathname === '/api/glowboard') {
      const top = data.doodles
        .map((doodle) => enrichDoodle(data, doodle))
        .sort((a, b) => b.glowCount - a.glowCount)
        .slice(0, 12);
      return json({ theme: 'Soft courage and cloud clipped inspiration', top });
    }
    return json({ error: 'Static endpoint not found' }, 404);
  };
})();
