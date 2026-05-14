const RAMSGATE = { lat: -30.8864, lon: 30.3464 };

const hotspots = [
  {
    id: "main",
    name: "Ramsgate Main Beach",
    lat: -30.8864,
    lon: 30.3464,
    bestFor: "Dawn surf casting, family-safe access, quick condition checks",
    bait: "Sardine, chokka strips, small spoons",
    note: "Blue Flag main beach with nearby parking, lifeguards, lagoon, tidal pool and restaurants.",
    source: "South Coast Explore lists Ramsgate Beach at 30.8864 S, 30.3464 E."
  },
  {
    id: "tidal",
    name: "Noel Quarry Tidal Pool Rocks",
    lat: -30.889,
    lon: 30.349,
    bestFor: "Rock edges, scratching species, careful low-tide scouting",
    bait: "Prawn, mussel, chokka",
    note: "On the right-hand side of Ramsgate main beach. Fish away from swimmers and watch surge.",
    source: "Ramsgate.co.za describes the tidal pool area as having great fishing spots."
  },
  {
    id: "lagoon",
    name: "Bilanhlolo River Mouth",
    lat: -30.8873,
    lon: 30.3476,
    bestFor: "Structure, colour lines after rain, estuary edge observation",
    bait: "Small spoons, dropshot, sardine belly",
    note: "Respect local rules and avoid casting into swimming or boat activity areas.",
    source: "Ramsgate is described as sitting at the Bilanhlolo river mouth."
  },
  {
    id: "whale",
    name: "Whale Deck Walk Rocks",
    lat: -30.891,
    lon: 30.352,
    bestFor: "Scouting current lines, sardine-run watch, elevated visual checks",
    bait: "Metal spoons, plugs, live-look scouting",
    note: "Use this as a viewing and decision point before choosing a safe casting ledge.",
    source: "Local Ramsgate beach guides mention the whale-watching deck opposite the beach."
  },
  {
    id: "south",
    name: "Ramsgate South Shore",
    lat: -30.8944,
    lon: 30.34508,
    bestFor: "Quieter shore sessions and walking searches for gutters",
    bait: "Sardine, chokka, paddle-tail plastics",
    note: "A useful mark when the main beach is busy. Check swell and access before committing.",
    source: "FishAngler lists Ramsgate fishing around -30.8944, 30.34508."
  },
  {
    id: "parking",
    name: "South Beach Parking Access",
    lat: -30.9073,
    lon: 30.3346,
    bestFor: "Early starts, scouting south-facing water, quiet access",
    bait: "Spoon, redeye sardine, chokka",
    note: "A farther access point south of the main beach; confirm conditions and safety on arrival.",
    source: "iOverlander lists Ramsgate beach parking at -30.90730, 30.33460."
  }
];

const trackerItems = [
  "Check wind, wave height and water colour before leaving",
  "Open directions to the chosen spot",
  "Log one Ramsgate condition note",
  "Try two bait or lure presentations",
  "Record catch or blank-session learning",
  "Review local regulations and safe access"
];

const fallbackPosts = [
  {
    title: "FishingReminder Ramsgate fishing times",
    link: "https://www.fishingreminder.com/ZA/charts/fishing_times/Ramsgate",
    pubDate: new Date().toISOString(),
    description: "Ramsgate-specific fishing times, nearby beaches, bays and map-based fishing marks."
  },
  {
    title: "Ski-Boat Magazine",
    link: "https://www.anglerpublications.co.za/",
    pubDate: new Date().toISOString(),
    description: "South African offshore and coastal angling stories, tackle notes and destination coverage."
  },
  {
    title: "Visit KZN South Coast: Ramsgate Beach",
    link: "https://www.visitkznsouthcoast.co.za/blue-flag-beaches-ramsgate-beach/",
    pubDate: new Date().toISOString(),
    description: "Local beach amenities, seasonal events, ski-boat launching, fishing and Ramsgate visitor notes."
  }
];

const feedSources = [
  "https://www.anglingtimes.co.uk/feed/",
  "https://www.fishingworld.com.au/rss",
  "https://www.tackletour.com/reviews.xml"
];

let selectedSpot = hotspots[0];
let userPosition = null;
let weatherState = null;

const app = document.querySelector("#app");
const navLinks = [...document.querySelectorAll(".top-nav a")];

window.addEventListener("hashchange", render);
document.querySelector("#locateBtn").addEventListener("click", startTracking);
render();
refreshWeather();
setInterval(refreshWeather, 10 * 60 * 1000);

function render() {
  const route = location.hash.replace("#", "") || "home";
  const template = document.querySelector(`#${route}Page`) || document.querySelector("#homePage");
  app.replaceChildren(template.content.cloneNode(true));
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${route}`));

  const handlers = {
    home: renderHome,
    map: renderMap,
    hotspots: renderHotspots,
    conditions: renderConditions,
    learn: () => {},
    feed: renderFeed,
    tracker: renderTracker,
    journal: renderJournal
  };
  (handlers[route] || renderHome)();
}

function renderHome() {
  const homeCards = document.querySelector("#homeCards");
  if (!homeCards) return;
  const cards = [
    ["Live conditions", weatherState ? biteSummary(weatherState) : "Weather and marine data updates from Open-Meteo."],
    ["Exact map marks", `${hotspots.length} Ramsgate shore marks with Google Maps directions.`],
    ["Private logbook", `${loadJournal().length} saved journal ${loadJournal().length === 1 ? "entry" : "entries"} on this device.`]
  ];
  homeCards.innerHTML = cards
    .map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`)
    .join("");
  const heroCondition = document.querySelector("#heroCondition");
  const heroMeta = document.querySelector("#heroMeta");
  if (weatherState) {
    heroCondition.textContent = biteSummary(weatherState);
    heroMeta.textContent = `Wind ${weatherState.wind} km/h, waves ${weatherState.wave ?? "?"} m, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
}

function renderMap() {
  const list = document.querySelector("#spotList");
  list.innerHTML = hotspots.map((spot) => spotButton(spot)).join("");
  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSpot = hotspots.find((spot) => spot.id === button.dataset.id);
      renderMap();
    });
  });
  document.querySelector("#nearestBtn").addEventListener("click", chooseNearest);
  updateMap();
}

function spotButton(spot) {
  const distance = userPosition ? `${distanceKm(userPosition, spot).toFixed(1)} km away` : formatCoord(spot);
  return `
    <button class="spot-button ${spot.id === selectedSpot.id ? "active" : ""}" data-id="${spot.id}" type="button">
      <strong>${spot.name}</strong><br />
      <small>${distance}</small>
    </button>
  `;
}

function updateMap() {
  const frame = document.querySelector("#mapFrame");
  const directions = document.querySelector("#directionsLink");
  if (!frame || !directions) return;
  const lat = selectedSpot.lat;
  const lon = selectedSpot.lon;
  frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.018}%2C${lat - 0.012}%2C${lon + 0.018}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lon}`;
  directions.href = userPosition
    ? `https://www.google.com/maps/dir/?api=1&origin=${userPosition.lat},${userPosition.lon}&destination=${lat},${lon}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
}

function renderHotspots() {
  document.querySelector("#hotspotGrid").innerHTML = hotspots.map((spot) => `
    <article class="spot-card">
      <span class="tag">${formatCoord(spot)}</span>
      <h3>${spot.name}</h3>
      <p>${spot.note}</p>
      <div class="spot-meta">
        <span>${spot.bestFor}</span>
        <span>${spot.bait}</span>
      </div>
      <small>${spot.source}</small>
      <a class="secondary" href="https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lon}" target="_blank" rel="noreferrer">Open spot map</a>
    </article>
  `).join("");
}

function renderConditions() {
  drawSeaCanvas();
  updateConditionPanel();
}

function updateConditionPanel() {
  const panel = document.querySelector("#conditionPanel");
  if (!panel) return;
  if (!weatherState) {
    panel.innerHTML = `<h3>Reading live conditions</h3><p>Fetching weather and marine data for Ramsgate Beach.</p>`;
    return;
  }
  panel.innerHTML = `
    <h3>${biteSummary(weatherState)}</h3>
    <p>${conditionAdvice(weatherState)}</p>
    <div class="metric-grid">
      ${metric("Wind", `${weatherState.wind} km/h`, `${weatherState.windDir} deg`)}
      ${metric("Air", `${weatherState.temp} C`, "Open-Meteo current")}
      ${metric("Wave", weatherState.wave ? `${weatherState.wave} m` : "N/A", "Marine estimate")}
      ${metric("Sea temp", weatherState.seaTemp ? `${weatherState.seaTemp} C` : "N/A", "Marine estimate")}
    </div>
    <small>Data refreshes every 10 minutes from Open-Meteo weather and marine endpoints. Use local safety judgment before fishing rocks or surf.</small>
  `;
}

function metric(label, value, hint) {
  return `<div class="metric"><small>${label}</small><strong>${value}</strong><small>${hint}</small></div>`;
}

async function refreshWeather() {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${RAMSGATE.lat}&longitude=${RAMSGATE.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`;
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${RAMSGATE.lat}&longitude=${RAMSGATE.lon}&current=wave_height,sea_surface_temperature`;
    const [weather, marine] = await Promise.all([fetch(weatherUrl), fetch(marineUrl)]);
    const weatherJson = await weather.json();
    const marineJson = await marine.json();
    weatherState = {
      temp: Math.round(weatherJson.current.temperature_2m),
      wind: Math.round(weatherJson.current.wind_speed_10m),
      windDir: Math.round(weatherJson.current.wind_direction_10m),
      code: weatherJson.current.weather_code,
      wave: marineJson.current?.wave_height?.toFixed(1),
      seaTemp: marineJson.current?.sea_surface_temperature?.toFixed(1)
    };
  } catch (error) {
    weatherState = { temp: "?", wind: "?", windDir: "?", wave: null, seaTemp: null, code: 0 };
  }
  renderHome();
  updateConditionPanel();
  drawSeaCanvas();
}

function biteSummary(state) {
  const wave = Number(state.wave || 0);
  const wind = Number(state.wind || 0);
  if (wind <= 18 && wave > 0 && wave <= 1.5) return "Good window for shore fishing";
  if (wind <= 28 && wave <= 2.2) return "Fishable, choose sheltered water";
  return "Rough window, scout before casting";
}

function conditionAdvice(state) {
  const wind = Number(state.wind || 0);
  const wave = Number(state.wave || 0);
  if (wind > 28 || wave > 2.2) return "Prioritise the beach and viewing decks over rock ledges. Look for protected gutters and avoid exposed points.";
  if (wind < 12 && wave <= 1.2) return "Clean water and gentle surf can suit early spoons, scratching around edges, and careful river-mouth scouting.";
  return "Watch the sandbanks and breaking wave gaps. A short move north or south can make a big difference on Ramsgate's compact beach.";
}

function drawSeaCanvas() {
  const canvas = document.querySelector("#seaCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const now = Date.now() / 900;
  const wind = Number(weatherState?.wind || 12);
  const wave = Number(weatherState?.wave || 1);

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#b98545");
  sky.addColorStop(0.42, "#f2d99c");
  sky.addColorStop(0.43, "#295964");
  sky.addColorStop(1, "#102e36");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(74, 45, 19, 0.7)";
  ctx.beginPath();
  ctx.moveTo(0, 356);
  ctx.bezierCurveTo(180, 326, 300, 380, 460, 342);
  ctx.bezierCurveTo(620, 306, 760, 362, width, 334);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  for (let layer = 0; layer < 5; layer++) {
    ctx.beginPath();
    const yBase = 230 + layer * 42;
    for (let x = 0; x <= width; x += 12) {
      const y = yBase + Math.sin((x + now * (1 + layer / 2)) / (34 - layer * 2)) * (8 + wave * 4) + Math.cos((x + now) / 71) * 5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(241, 229, 189, ${0.22 + layer * 0.07})`;
    ctx.lineWidth = 2 + layer;
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 246, 217, 0.88)";
  ctx.font = "700 34px Georgia";
  ctx.fillText("Ramsgate live watch", 38, 62);
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText(`${biteSummary(weatherState || { wind, wave })}`, 42, 96);
  ctx.fillText(`Wind ${wind} km/h  |  Wave ${wave || "?"} m`, 42, 126);

  const stamp = document.querySelector("#canvasStamp");
  if (stamp) stamp.textContent = `Rendered ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

async function renderFeed() {
  const list = document.querySelector("#feedList");
  const status = document.querySelector("#feedStatus");
  document.querySelector("#refreshFeed").addEventListener("click", renderFeed);
  list.innerHTML = fallbackPosts.map(postCard).join("");
  try {
    const results = await Promise.allSettled(feedSources.map(loadFeed));
    const posts = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 9);
    if (posts.length) {
      list.innerHTML = posts.map(postCard).join("");
      status.textContent = `Loaded ${posts.length} current posts.`;
    } else {
      status.textContent = "Showing curated sources because RSS returned no current items.";
    }
  } catch {
    status.textContent = "Showing curated sources because RSS loading was blocked.";
  }
}

async function loadFeed(source) {
  const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source)}`;
  const response = await fetch(proxyUrl);
  const json = await response.json();
  return (json.items || []).map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    description: stripHtml(item.description || "").slice(0, 180)
  }));
}

function postCard(post) {
  return `
    <article class="feed-item">
      <time>${new Date(post.pubDate).toLocaleDateString()}</time>
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <a class="secondary" href="${post.link}" target="_blank" rel="noreferrer">Read post</a>
    </article>
  `;
}

function renderTracker() {
  const saved = JSON.parse(localStorage.getItem("codiesTracker") || "{}");
  const form = document.querySelector("#trackerForm");
  form.innerHTML = trackerItems.map((item, index) => `
    <label class="check-row">
      <input type="checkbox" data-index="${index}" ${saved[index] ? "checked" : ""} />
      <span><strong>${item}</strong><br /><small>${trackerHint(index)}</small></span>
    </label>
  `).join("");
  form.addEventListener("change", () => {
    const next = {};
    form.querySelectorAll("input").forEach((input) => {
      next[input.dataset.index] = input.checked;
    });
    localStorage.setItem("codiesTracker", JSON.stringify(next));
    updateProgress();
  });
  updateProgress();
}

function trackerHint(index) {
  return [
    "The sea changes faster than the plan.",
    "Map links open directly to the selected coordinate.",
    "Journal notes make tomorrow's trip sharper.",
    "Small experiments beat guessing.",
    "Blank days still teach the beach.",
    "Keep Ramsgate safe, legal and clean."
  ][index];
}

function updateProgress() {
  const saved = JSON.parse(localStorage.getItem("codiesTracker") || "{}");
  const done = Object.values(saved).filter(Boolean).length;
  const percent = Math.round((done / trackerItems.length) * 100);
  const ring = document.querySelector("#progressRing");
  if (ring) {
    ring.style.setProperty("--percent", `${percent}%`);
    ring.querySelector("span").textContent = `${percent}%`;
  }
  const summary = document.querySelector("#trackerSummary");
  if (summary) summary.textContent = `${done} of ${trackerItems.length} Ramsgate mission steps complete.`;
}

function renderJournal() {
  const form = document.querySelector("#journalForm");
  form.date.valueAsDate = new Date();
  form.spot.innerHTML = hotspots.map((spot) => `<option>${spot.name}</option>`).join("");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const entries = loadJournal();
    entries.unshift({ ...data, id: crypto.randomUUID() });
    localStorage.setItem("codiesJournal", JSON.stringify(entries));
    form.reset();
    form.date.valueAsDate = new Date();
    renderJournalEntries();
  });
  renderJournalEntries();
}

function renderJournalEntries() {
  const container = document.querySelector("#journalEntries");
  if (!container) return;
  const entries = loadJournal();
  container.innerHTML = entries.length
    ? entries.map((entry) => `
      <article class="journal-entry">
        <small>${entry.date} | ${entry.spot}</small>
        <h3>${entry.species || "Session notes"}</h3>
        <p><strong>Bait:</strong> ${entry.bait || "Not recorded"}</p>
        <p>${entry.notes || "No notes yet."}</p>
        <button data-id="${entry.id}" type="button">Delete</button>
      </article>
    `).join("")
    : `<article class="journal-entry"><h3>No entries yet</h3><p>Log your first Ramsgate session and the map starts remembering with you.</p></article>`;
  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const next = loadJournal().filter((entry) => entry.id !== button.dataset.id);
      localStorage.setItem("codiesJournal", JSON.stringify(next));
      renderJournalEntries();
    });
  });
}

function loadJournal() {
  return JSON.parse(localStorage.getItem("codiesJournal") || "[]");
}

function startTracking() {
  const button = document.querySelector("#locateBtn");
  if (!navigator.geolocation) {
    button.textContent = "No GPS";
    return;
  }
  button.textContent = "Tracking...";
  navigator.geolocation.watchPosition(
    (position) => {
      userPosition = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      const nearest = [...hotspots].sort((a, b) => distanceKm(userPosition, a) - distanceKm(userPosition, b))[0];
      button.textContent = `${nearest.name}: ${distanceKm(userPosition, nearest).toFixed(1)} km`;
      if ((location.hash || "#home") === "#map") renderMap();
    },
    () => {
      button.textContent = "GPS blocked";
    },
    { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
  );
}

function chooseNearest() {
  if (!userPosition) {
    startTracking();
    return;
  }
  selectedSpot = [...hotspots].sort((a, b) => distanceKm(userPosition, a) - distanceKm(userPosition, b))[0];
  renderMap();
}

function distanceKm(from, to) {
  const radius = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lon - from.lon);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

function formatCoord(spot) {
  return `${Math.abs(spot.lat).toFixed(4)} S, ${spot.lon.toFixed(4)} E`;
}

function stripHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.textContent || "";
}
