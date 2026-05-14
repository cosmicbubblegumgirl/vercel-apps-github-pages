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

const fishingModes = ["Bait", "Spoon", "Soft plastic", "Live bait", "Scratch bait"];

const speciesProfiles = [
  {
    id: "shad",
    name: "Shad / Elf",
    style: "Spoon",
    spots: ["main", "tidal", "whale", "south"],
    wave: [0.7, 2.3],
    windMax: 30,
    bait: "Sardine strip, spoon, small paddle-tail",
    rig: "Short steel bite trace or spoon clip",
    reason: "Predatory fish that often hunt bait in working whitewater and around points.",
    source: "https://www.sensationtackle.co.za/2023/07/shad-szn-how-to-catch-them-when-the-sardines-are-around/"
  },
  {
    id: "kob",
    name: "Kob / Kabeljou",
    style: "Bait",
    spots: ["main", "lagoon", "south", "parking"],
    wave: [0.8, 2.0],
    windMax: 24,
    bait: "Chokka, sardine, mackerel, prawn",
    rig: "Sliding sinker fish-finder rig",
    reason: "Kob favour sandy beaches, gutters, river mouths and colour changes.",
    source: "https://fishinginfo.co.za/kob.html"
  },
  {
    id: "garrick",
    name: "Garrick / Leervis",
    style: "Live bait",
    spots: ["lagoon", "whale", "south"],
    wave: [0.6, 2.2],
    windMax: 28,
    bait: "Live mullet, plug, bucktail, spoon",
    rig: "Live-bait slide or topwater lure setup",
    reason: "Garrick patrol surf channels, rocky points and river mouths chasing baitfish.",
    source: "https://www.fishbook.co.za/spinning-for-garrick/"
  },
  {
    id: "blacktail",
    name: "Blacktail",
    style: "Scratch bait",
    spots: ["tidal", "whale", "south"],
    wave: [0.4, 1.8],
    windMax: 24,
    bait: "Prawn, mussel, red bait, chokka sliver",
    rig: "Light scratching trace",
    reason: "Reef and rock-edge feeders suit careful close-range baits.",
    source: "https://www.southcoasthappenings.co.za/fishinghotspots.htm"
  },
  {
    id: "bronze-bream",
    name: "Bronze bream",
    style: "Scratch bait",
    spots: ["tidal", "whale"],
    wave: [0.6, 1.9],
    windMax: 24,
    bait: "Prawn, mussel, crab, red bait",
    rig: "Light rock trace with short sinker snood",
    reason: "Rocky reef pockets and foamy ledges are better than open sand.",
    source: "https://www.southcoasthappenings.co.za/fishinghotspots.htm"
  },
  {
    id: "kingfish",
    name: "Kingfish",
    style: "Soft plastic",
    spots: ["whale", "south", "parking"],
    wave: [0.5, 1.8],
    windMax: 22,
    bait: "Bucktail, spoon, paddle-tail",
    rig: "Leader-to-lure spinning setup",
    reason: "Fast lures around current seams and baitfish movement can draw strikes.",
    source: "https://www.southcoasthappenings.co.za/fishinghotspots.htm"
  }
];

const rigGuides = [
  guide("fish-finder", "Fish-finder sliding sinker", "kob", "Bait", "Sand gutters", "ov24J-aZ1lo", "https://norrik.com/fishing-rigs/fish-finder-rig/", ["Thread sinker slide on the main line.", "Add a bead to protect the knot.", "Tie on a swivel, then 45-75 cm leader.", "Tie a circle hook and bait with chokka or sardine."]),
  guide("carolina", "Carolina surf drift", "kob", "Bait", "Gentle sand", "ov24J-aZ1lo", "https://castandspear.com/carolina-rig/", ["Slide an egg sinker onto the main line.", "Add a bead and swivel stopper.", "Tie a longer leader for natural drift.", "Cast beyond the shorebreak and let bait move."]),
  guide("kob-bait", "Kob chokka bait trace", "kob", "Bait", "River mouth colour line", "4zWKFjWxRRM", "https://fishinginfo.co.za/kob.html", ["Use a strong 12-14 ft rod and leader.", "Build a chokka strip around the hook.", "Bind with cotton so it casts cleanly.", "Place it in the gutter edge, not dead water."]),
  guide("double-hook-kob", "Double-hook kob bait", "kob", "Bait", "Deeper trough", "4zWKFjWxRRM", "https://reelanglingadventures.co.za/", ["Snell the top hook above the main hook.", "Lay sardine or chokka between hooks.", "Cotton-wrap until firm but scented.", "Fish a short leader when surf is messy."]),
  guide("shad-spoon", "Shad spoon search pattern", "shad", "Spoon", "Whitewater edge", "ov24J-aZ1lo", "https://www.sensationtackle.co.za/2023/07/shad-szn-how-to-catch-them-when-the-sardines-are-around/", ["Tie braid to leader with a compact knot.", "Add a small clip or short bite trace.", "Cast a silver spoon in clear water.", "Change retrieve speed every few casts."]),
  guide("shad-sardine", "Shad sardine strip trace", "shad", "Bait", "Rocky point wash", "ov24J-aZ1lo", "https://www.outdoorselfdefense.co.za/product/adrenalin-shad-trace/", ["Tie a short steel trace to prevent bite-offs.", "Use a sharp J or circle hook.", "Cut a narrow sardine belly strip.", "Drift it through the wash with tension."]),
  guide("garrick-live", "Garrick live mullet slide", "garrick", "Live bait", "River mouth", "ov24J-aZ1lo", "https://www.sensationtackle.co.za/2023/07/chasing-garrick/", ["Cast and set a grapnel sinker.", "Clip the live-bait slide onto the main line.", "Hook live mullet lightly through the nose.", "Let the fish run before setting pressure."]),
  guide("garrick-plug", "Garrick plug surface retrieve", "garrick", "Soft plastic", "Backline channel", "ov24J-aZ1lo", "https://www.fishbook.co.za/spinning-for-garrick/", ["Use a leader suited to abrasion.", "Clip on a floating plug or pencil bait.", "Cast across the channel mouth.", "Retrieve with pauses when fish follow."]),
  guide("garrick-bucktail", "Garrick bucktail sweep", "garrick", "Soft plastic", "Point current seam", "ov24J-aZ1lo", "https://www.fishbook.co.za/spinning-for-garrick/", ["Tie leader direct to bucktail.", "Cast up-current from the seam.", "Let it sink for two counts.", "Sweep and pause to mimic injured bait."]),
  guide("blacktail-prawn", "Blacktail prawn scratch trace", "blacktail", "Scratch bait", "Tidal rocks", "ov24J-aZ1lo", "https://www.southcoasthappenings.co.za/fishinghotspots.htm", ["Use light leader and small hook.", "Pin a prawn tail neatly.", "Use a small ball or cone sinker.", "Drop near foam pockets, not on top of fish."]),
  guide("blacktail-mussel", "Blacktail mussel bait", "blacktail", "Scratch bait", "Reef pocket", "ov24J-aZ1lo", "https://www.southcoasthappenings.co.za/fishinghotspots.htm", ["Cotton mussel onto a small hook.", "Keep the bait compact.", "Use a short sinker snood.", "Lift gently when bites tap twice."]),
  guide("bronze-bream-prawn", "Bronze bream prawn trace", "bronze-bream", "Scratch bait", "Foamy reef", "ov24J-aZ1lo", "https://www.southcoasthappenings.co.za/fishinghotspots.htm", ["Choose a sheltered ledge pocket.", "Use a stealthy fluorocarbon leader.", "Thread prawn so the hook point is clear.", "Hold the rod high to avoid reef snags."]),
  guide("bronze-bream-crab", "Bronze bream crab bait", "bronze-bream", "Scratch bait", "Low-tide rock edge", "ov24J-aZ1lo", "https://www.southcoasthappenings.co.za/fishinghotspots.htm", ["Crack the crab shell lightly.", "Bind bait onto a strong small hook.", "Use just enough sinker to hold.", "Let the bait settle beside white foam."]),
  guide("kingfish-spoon", "Kingfish long spoon", "kingfish", "Spoon", "Clean point water", "ov24J-aZ1lo", "https://www.southcoasthappenings.co.za/fishinghotspots.htm", ["Use a long-cast metal spoon.", "Tie strong leader for speed casting.", "Cast past visible baitfish.", "Retrieve fast with sudden pauses."]),
  guide("kingfish-paddletail", "Kingfish paddle-tail jig", "kingfish", "Soft plastic", "Current seam", "ov24J-aZ1lo", "https://jacita.co.za/2025/07/18/the-best-rock-surf-fishing-rods-reels-tackle-for-south-african-beaches/", ["Choose jig weight for the wind.", "Thread paddle-tail perfectly straight.", "Let it sink near the channel lip.", "Lift-drop through the strike zone."]),
  guide("river-mouth-dropshot", "River-mouth dropshot", "kob", "Soft plastic", "Lagoon mouth", "ov24J-aZ1lo", "https://fishinginfo.co.za/kob.html", ["Rig a soft plastic on a jighead.", "Cast across the mouth, not straight out.", "Let it touch bottom briefly.", "Hop it through the colour change."]),
  guide("float-trace", "Light float trace", "blacktail", "Scratch bait", "Calm rock pool edge", "ov24J-aZ1lo", "https://planetseafishing.com/video/catch-cook-from-south-african-shores/", ["Set a small float above a swivel.", "Tie a short hook snood below.", "Use prawn or chokka sliver.", "Let swell move bait naturally."]),
  guide("paternoster-scratch", "Two-hook paternoster", "blacktail", "Scratch bait", "Mixed reef sand", "ov24J-aZ1lo", "https://www.fieldandstream.com/outdoor-gear/fishing/baits-lures-and-flies/surf-fishing-rigs/", ["Tie two dropper loops above the sinker.", "Keep snoods short to prevent tangles.", "Use two different baits.", "Move after ten quiet minutes."]),
  guide("breakaway-sinker", "Breakaway sinker rough ground", "bronze-bream", "Scratch bait", "Snaggy rocks", "ov24J-aZ1lo", "https://www.fishing.net.nz/fishing-advice/how-to/slide-baiting-in-the-surf/", ["Tie a weaker sinker link.", "Use stronger leader to the hook.", "Cast short and accurate.", "Break the sinker free if snagged."]),
  guide("night-glow", "Night glow bait trace", "shad", "Bait", "Dusk and night wash", "ov24J-aZ1lo", "https://planetseafishing.com/video/catch-cook-from-south-african-shores/", ["Add a small glow bead above the hook.", "Use fresh sardine strip.", "Cast into safe, visible wash.", "Keep line tight and light ready."])
];

let selectedSpot = hotspots[0];
let selectedMode = fishingModes[0];
let selectedRigId = rigGuides[0].id;
let journalSnapshot = null;
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
    species: renderSpecies,
    rigging: renderRigging,
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
    ["Species indicators", `${speciesProfiles.length} Ramsgate species profiles scored against wind, wave, method and area.`],
    ["Rigging coach", `${rigGuides.length} numbered setups with diagrams, sources and video support.`],
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

function renderSpecies() {
  const spotSelect = document.querySelector("#speciesSpot");
  const modeSelect = document.querySelector("#speciesMode");
  const board = document.querySelector("#speciesBoard");
  if (!spotSelect || !modeSelect || !board) return;

  spotSelect.innerHTML = hotspots.map((spot) => `<option value="${spot.id}">${spot.name}</option>`).join("");
  modeSelect.innerHTML = fishingModes.map((mode) => `<option>${mode}</option>`).join("");
  spotSelect.value = selectedSpot.id;
  modeSelect.value = selectedMode;

  spotSelect.addEventListener("change", () => {
    selectedSpot = hotspots.find((spot) => spot.id === spotSelect.value) || selectedSpot;
    renderSpecies();
  });
  modeSelect.addEventListener("change", () => {
    selectedMode = modeSelect.value;
    renderSpecies();
  });

  document.querySelector("#speciesConditionStrip").innerHTML = conditionStripHTML(createConditionSnapshot(selectedSpot));
  const ranked = speciesProfiles
    .map((profile) => ({ profile, score: scoreSpecies(profile, selectedSpot, selectedMode, weatherState) }))
    .sort((a, b) => b.score - a.score);

  board.innerHTML = ranked.map(({ profile, score }, index) => `
    <article class="species-card">
      <div class="species-head">
        <span class="tag">#${index + 1}</span>
        <strong>${profile.name}</strong>
      </div>
      <div class="score-bar" style="--score:${score}%"><span>${score}% match</span></div>
      <p>${profile.reason}</p>
      <div class="condition-pills">
        <span>${profile.style}</span>
        <span>${profile.bait}</span>
        <span>${profile.rig}</span>
      </div>
      <small>${speciesWhy(profile, selectedSpot, selectedMode, weatherState)}</small>
      <a class="secondary" href="${profile.source}" target="_blank" rel="noreferrer">Source</a>
    </article>
  `).join("");
}

function renderRigging() {
  const rigSelect = document.querySelector("#rigSpecies");
  const spotSelect = document.querySelector("#rigSpot");
  const details = document.querySelector("#rigDetails");
  const list = document.querySelector("#rigList");
  if (!rigSelect || !spotSelect || !details || !list) return;

  rigSelect.innerHTML = rigGuides.map((guide) => `<option value="${guide.id}">${guide.title}</option>`).join("");
  spotSelect.innerHTML = hotspots.map((spot) => `<option value="${spot.id}">${spot.name}</option>`).join("");
  rigSelect.value = selectedRigId;
  spotSelect.value = selectedSpot.id;

  rigSelect.addEventListener("change", () => {
    selectedRigId = rigSelect.value;
    renderRigging();
  });
  spotSelect.addEventListener("change", () => {
    selectedSpot = hotspots.find((spot) => spot.id === spotSelect.value) || selectedSpot;
    renderRigging();
  });

  const selected = rigGuides.find((guide) => guide.id === selectedRigId) || rigGuides[0];
  const profile = speciesProfiles.find((item) => item.id === selected.species) || speciesProfiles[0];
  const score = scoreSpecies(profile, selectedSpot, selected.style, weatherState);
  document.querySelector("#rigConditionStrip").innerHTML = conditionStripHTML(createConditionSnapshot(selectedSpot));

  details.innerHTML = `
    <div class="species-head">
      <span class="tag">${selected.style}</span>
      <strong>${selected.title}</strong>
    </div>
    <div class="score-bar" style="--score:${score}%"><span>${score}% fit for ${selectedSpot.name}</span></div>
    <p><strong>Best water:</strong> ${selected.bestWater}. <strong>Target:</strong> ${profile.name}.</p>
    ${renderRigDiagram(selected)}
    <ol class="step-list">
      ${selected.steps.map((step) => `<li>${step}</li>`).join("")}
    </ol>
    <div class="video-frame">
      <iframe title="${selected.title} video" src="https://www.youtube.com/embed/${selected.videoId}" loading="lazy" allowfullscreen></iframe>
    </div>
    <a class="secondary" href="${selected.source}" target="_blank" rel="noreferrer">Technique source</a>
  `;

  list.innerHTML = rigGuides.map((guide, index) => {
    const itemProfile = speciesProfiles.find((item) => item.id === guide.species) || speciesProfiles[0];
    const itemScore = scoreSpecies(itemProfile, selectedSpot, guide.style, weatherState);
    return `
      <button class="rig-button ${guide.id === selected.id ? "active" : ""}" data-id="${guide.id}" type="button">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${guide.title}</strong>
        <small>${guide.bestWater} | ${itemScore}%</small>
      </button>
    `;
  }).join("");

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRigId = button.dataset.id;
      renderRigging();
    });
  });
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

function guide(id, title, species, style, bestWater, videoId, source, steps) {
  return { id, title, species, style, bestWater, videoId, source, steps };
}

function createConditionSnapshot(spot) {
  return {
    capturedAt: new Date().toISOString(),
    spot: spot.name,
    lat: spot.lat,
    lon: spot.lon,
    userLat: userPosition?.lat || null,
    userLon: userPosition?.lon || null,
    temp: weatherState?.temp ?? "?",
    wind: weatherState?.wind ?? "?",
    windDir: weatherState?.windDir ?? "?",
    wave: weatherState?.wave ?? "?",
    seaTemp: weatherState?.seaTemp ?? "?",
    bite: weatherState ? biteSummary(weatherState) : "Awaiting live conditions"
  };
}

function conditionStripHTML(snapshot) {
  return `
    <span>${snapshot.spot}</span>
    <span>Wind ${snapshot.wind} km/h @ ${snapshot.windDir} deg</span>
    <span>Wave ${snapshot.wave} m</span>
    <span>Sea ${snapshot.seaTemp} C</span>
    <span>${snapshot.bite}</span>
  `;
}

function scoreSpecies(profile, spot, mode, state) {
  const windValue = Number(state?.wind);
  const waveValue = Number(state?.wave);
  const wind = Number.isFinite(windValue) ? windValue : 18;
  const wave = Number.isFinite(waveValue) ? waveValue : 1.1;
  let score = 34;
  if (profile.spots.includes(spot.id)) score += 22;
  if (profile.style === mode) score += 18;
  if (wave >= profile.wave[0] && wave <= profile.wave[1]) score += 18;
  else score -= Math.min(18, Math.round(Math.abs(wave - profile.wave[1]) * 8));
  if (wind <= profile.windMax) score += 14;
  else score -= Math.min(16, Math.round((wind - profile.windMax) * 1.2));
  if (spot.id === "lagoon" && ["kob", "garrick"].includes(profile.id)) score += 6;
  if (spot.id === "tidal" && ["blacktail", "bronze-bream"].includes(profile.id)) score += 6;
  return Math.max(8, Math.min(96, Math.round(score)));
}

function speciesWhy(profile, spot, mode, state) {
  const parts = [];
  parts.push(profile.spots.includes(spot.id) ? "Area suits this species" : "Area is less direct, scout first");
  parts.push(profile.style === mode ? "chosen style matches" : `try ${profile.style.toLowerCase()} for a better fit`);
  if (state?.wave) parts.push(`wave window target ${profile.wave[0]}-${profile.wave[1]} m`);
  if (state?.wind) parts.push(`wind ceiling ${profile.windMax} km/h`);
  return parts.join("; ") + ".";
}

function renderRigDiagram(guide) {
  const labels = guide.steps.slice(0, 4).map((step) => compactStep(step));
  return `
    <div class="rig-diagram">
      <svg viewBox="0 0 760 300" role="img" aria-label="${guide.title} labelled rig diagram">
        <defs>
          <marker id="arrow-${guide.id}" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#2a1c13"></path>
          </marker>
        </defs>
        <path d="M54 64 C 186 56, 260 72, 378 60 S 590 66, 706 52" fill="none" stroke="#245f69" stroke-width="10" stroke-linecap="round"></path>
        <line x1="96" y1="132" x2="642" y2="132" stroke="#2a1c13" stroke-width="7" stroke-linecap="round"></line>
        <circle cx="190" cy="132" r="22" fill="#b98232" stroke="#2a1c13" stroke-width="6"></circle>
        <rect x="302" y="111" width="56" height="42" rx="14" fill="#e7d1a5" stroke="#2a1c13" stroke-width="6"></rect>
        <path d="M602 122 c 42 20 42 70 -2 78 c -29 5 -52 -14 -48 -42" fill="none" stroke="#9c2f25" stroke-width="11" stroke-linecap="round"></path>
        ${labels.map((_, index) => diagramLabel(index + 1, guide.id)).join("")}
      </svg>
      <div class="diagram-notes">
        ${labels.map((label, index) => `
          <div class="diagram-note">
            <span>${index + 1}</span>
            <strong>${label}</strong>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function compactStep(step) {
  return step.replace(/\.$/, "");
}

function diagramLabel(number, markerId) {
  const points = [
    [118, 238, 180, 150],
    [286, 238, 318, 150],
    [462, 238, 548, 142],
    [626, 238, 602, 174]
  ][number - 1];
  return `
    <g>
      <circle cx="${points[0]}" cy="${points[1]}" r="24" fill="#9c2f25"></circle>
      <text x="${points[0]}" y="${points[1] + 8}" text-anchor="middle" fill="#fff8e1" font-size="24" font-weight="800">${number}</text>
      <line x1="${points[0]}" y1="${points[1] - 28}" x2="${points[2]}" y2="${points[3]}" stroke="#2a1c13" stroke-width="4" marker-end="url(#arrow-${markerId})"></line>
    </g>
  `;
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
  if ((location.hash || "#home") === "#species") renderSpecies();
  if ((location.hash || "#home") === "#rigging") renderRigging();
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
  const captureButton = document.querySelector("#captureConditions");
  form.date.valueAsDate = new Date();
  form.time.value = new Date().toTimeString().slice(0, 5);
  form.spot.innerHTML = hotspots.map((spot) => `<option value="${spot.id}">${spot.name}</option>`).join("");
  form.species.innerHTML = speciesProfiles.map((profile) => `<option>${profile.name}</option>`).join("");
  journalSnapshot = createConditionSnapshot(selectedSpot);
  renderSnapshotCard();
  form.spot.addEventListener("change", () => {
    selectedSpot = hotspots.find((spot) => spot.id === form.spot.value) || selectedSpot;
    journalSnapshot = createConditionSnapshot(selectedSpot);
    renderSnapshotCard();
  });
  captureButton.addEventListener("click", () => {
    const spot = hotspots.find((item) => item.id === form.spot.value) || selectedSpot;
    journalSnapshot = createConditionSnapshot(spot);
    form.date.value = journalSnapshot.capturedAt.slice(0, 10);
    form.time.value = new Date(journalSnapshot.capturedAt).toTimeString().slice(0, 5);
    renderSnapshotCard();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const spot = hotspots.find((item) => item.id === data.spot) || selectedSpot;
    const entries = loadJournal();
    entries.unshift({
      ...data,
      spotName: spot.name,
      snapshot: journalSnapshot || createConditionSnapshot(spot),
      id: crypto.randomUUID()
    });
    localStorage.setItem("codiesJournal", JSON.stringify(entries));
    form.reset();
    form.date.valueAsDate = new Date();
    form.time.value = new Date().toTimeString().slice(0, 5);
    form.spot.value = selectedSpot.id;
    journalSnapshot = createConditionSnapshot(selectedSpot);
    renderSnapshotCard();
    renderJournalEntries();
  });
  renderJournalEntries();
}

function renderSnapshotCard() {
  const card = document.querySelector("#journalSnapshot");
  if (!card || !journalSnapshot) return;
  card.innerHTML = `
    <strong>Condition snapshot</strong>
    <span>${new Date(journalSnapshot.capturedAt).toLocaleString()}</span>
    <span>${journalSnapshot.spot} | ${formatCoord(journalSnapshot)}</span>
    <span>Wind ${journalSnapshot.wind} km/h @ ${journalSnapshot.windDir} deg | Wave ${journalSnapshot.wave} m | Sea ${journalSnapshot.seaTemp} C</span>
    <span>${journalSnapshot.bite}</span>
  `;
}

function renderJournalEntries() {
  const container = document.querySelector("#journalEntries");
  if (!container) return;
  const entries = loadJournal();
  container.innerHTML = entries.length
    ? entries.map((entry) => `
      <article class="journal-entry">
        <small>${entry.date} ${entry.time || ""} | ${entry.spotName || entry.spot}</small>
        <h3>${entry.species || "Session notes"} ${entry.result ? `- ${entry.result}` : ""}</h3>
        <p><strong>Bait:</strong> ${entry.bait || "Not recorded"} | <strong>Method:</strong> ${entry.method || "Not recorded"}</p>
        <div class="condition-pills">
          ${entry.length ? `<span>${entry.length} cm</span>` : ""}
          ${entry.weight ? `<span>${entry.weight} kg</span>` : ""}
          ${entry.snapshot ? `<span>Wind ${entry.snapshot.wind} km/h</span><span>Wave ${entry.snapshot.wave} m</span><span>${entry.snapshot.bite}</span>` : ""}
        </div>
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
