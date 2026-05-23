(() => {
  "use strict";

  const DB_NAME = "CupboardCompanionDB";
  const DB_VERSION = 1;
  const SESSION_KEY = "currentUser";
  const GUEST_EMAIL = "guest@cupboard.local";
  const currency = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });

  const storageAreas = [
    { id: "pantry", name: "Pantry cupboard", type: "pantry", tone: "gold large", sections: ["Grains", "Canned goods", "Sauces"] },
    { id: "fridge", name: "Fridge", type: "fridge", tone: "cool tall", sections: ["Dairy", "Vegetables", "Leftovers"] },
    { id: "freezer", name: "Freezer", type: "freezer", tone: "cool tall", sections: ["Proteins", "Frozen meals", "Vegetables"] },
    { id: "spice", name: "Spice rack", type: "spice", tone: "green", sections: ["Spices", "Herbs", "Seasoning"] },
    { id: "snack", name: "Snack cupboard", type: "snack", tone: "pink", sections: ["Sweet", "Salty", "Lunchbox"] },
    { id: "cleaning", name: "Cleaning cupboard", type: "cleaning", tone: "grey", sections: ["Sprays", "Laundry", "Refills"] },
    { id: "baking", name: "Baking shelf", type: "baking", tone: "cream", sections: ["Flour", "Sugar", "Decor"] },
    { id: "breakfast", name: "Breakfast shelf", type: "breakfast", tone: "green", sections: ["Oats", "Cereal", "Spreads"] },
    { id: "backup", name: "Emergency shelf", type: "backup", tone: "gold", sections: ["Backup meals", "Water", "Essentials"] }
  ];

  const quickAdds = [
    ["Milk", "fridge", "Dairy", "litre", 1, 24],
    ["Eggs", "fridge", "Dairy", "item", 6, 24],
    ["Bread", "breakfast", "Bakery", "packet", 1, 18],
    ["Rice", "pantry", "Grains", "kg", 1, 32],
    ["Pasta", "pantry", "Grains", "packet", 1, 22],
    ["Chicken", "freezer", "Proteins", "kg", 1, 85],
    ["Onion", "pantry", "Vegetables", "item", 3, 12],
    ["Tomato", "fridge", "Vegetables", "item", 4, 18],
    ["Cheese", "fridge", "Dairy", "g", 250, 48]
  ];

  const recipes = [
    {
      id: "tomato-garlic-pasta",
      title: "Tomato Garlic Pasta For Two",
      time: 20,
      cost: 34,
      difficulty: "Easy",
      tags: ["pasta", "cheap", "lazy", "ready"],
      ingredients: [
        { name: "Pasta", amount: 0.5, unit: "packet" },
        { name: "Canned tomatoes", amount: 1, unit: "tin" },
        { name: "Garlic", amount: 2, unit: "item" },
        { name: "Onion", amount: 1, unit: "item" },
        { name: "Basil", amount: 1, unit: "portion" }
      ],
      steps: ["Boil pasta until tender.", "Cook onion and garlic in a pan.", "Add tomatoes and simmer for eight minutes.", "Toss pasta through the sauce and finish with basil."],
      leftover: "None, but the sauce can stretch into lunch toasties.",
      tip: "Canned tomatoes beat jar sauce on price."
    },
    {
      id: "chicken-stir-fry",
      title: "Chicken Stir-fry Bowls For Two",
      time: 25,
      cost: 58,
      difficulty: "Easy",
      tags: ["rice bowl", "healthy", "soon"],
      ingredients: [
        { name: "Chicken", amount: 0.4, unit: "kg" },
        { name: "Rice", amount: 0.3, unit: "kg" },
        { name: "Carrots", amount: 2, unit: "item" },
        { name: "Soy sauce", amount: 1, unit: "portion" },
        { name: "Spring onion", amount: 1, unit: "item" }
      ],
      steps: ["Cook rice.", "Slice chicken and vegetables.", "Stir-fry chicken until golden.", "Add carrots and soy sauce.", "Serve over rice with spring onion."],
      leftover: "One lunch bowl if you add extra rice.",
      tip: "Frozen veg keeps the cost predictable."
    },
    {
      id: "spinach-pasta",
      title: "Creamy Spinach Pasta For Two",
      time: 18,
      cost: 42,
      difficulty: "Easy",
      tags: ["pasta", "soon", "lazy"],
      ingredients: [
        { name: "Spinach", amount: 1, unit: "packet" },
        { name: "Pasta", amount: 0.5, unit: "packet" },
        { name: "Milk", amount: 0.25, unit: "litre" },
        { name: "Cheese", amount: 80, unit: "g" },
        { name: "Garlic", amount: 1, unit: "item" }
      ],
      steps: ["Cook pasta.", "Wilt spinach with garlic.", "Add milk and cheese for a quick sauce.", "Fold pasta through and season."],
      leftover: "Best eaten fresh.",
      tip: "Use milk plus cheese instead of buying cream."
    },
    {
      id: "lentil-curry",
      title: "Lentil Curry And Rice For Two",
      time: 30,
      cost: 42,
      difficulty: "Easy",
      tags: ["cheap", "batch", "rice bowl"],
      ingredients: [
        { name: "Lentils", amount: 1, unit: "packet" },
        { name: "Rice", amount: 0.3, unit: "kg" },
        { name: "Canned tomatoes", amount: 1, unit: "tin" },
        { name: "Curry powder", amount: 1, unit: "portion" },
        { name: "Onion", amount: 1, unit: "item" }
      ],
      steps: ["Cook onion and curry powder.", "Add lentils and tomatoes.", "Simmer until tender.", "Serve with rice and save the extra sauce."],
      leftover: "Two freezer portions if doubled.",
      tip: "Lentils make the lowest-cost protein in this pantry."
    },
    {
      id: "egg-fried-rice",
      title: "Egg Fried Rice For Two",
      time: 14,
      cost: 28,
      difficulty: "Easy",
      tags: ["cheap", "lazy", "leftovers", "rice bowl"],
      ingredients: [
        { name: "Rice", amount: 0.3, unit: "kg" },
        { name: "Eggs", amount: 2, unit: "item" },
        { name: "Frozen vegetables", amount: 1, unit: "packet" },
        { name: "Soy sauce", amount: 1, unit: "portion" }
      ],
      steps: ["Fry rice in a hot pan.", "Push rice aside and scramble eggs.", "Add frozen vegetables.", "Season with soy sauce."],
      leftover: "One lunch portion.",
      tip: "Cold leftover rice fries best."
    },
    {
      id: "date-night-pizza",
      title: "Homemade Pizza Night For Two",
      time: 35,
      cost: 72,
      difficulty: "Medium",
      tags: ["fancy", "date", "comfort"],
      ingredients: [
        { name: "Flour", amount: 0.4, unit: "kg" },
        { name: "Canned tomatoes", amount: 1, unit: "tin" },
        { name: "Cheese", amount: 160, unit: "g" },
        { name: "Mushrooms", amount: 1, unit: "packet" },
        { name: "Garlic", amount: 1, unit: "item" }
      ],
      steps: ["Mix a quick dough.", "Crush tomatoes with garlic.", "Top with cheese and mushrooms.", "Bake until crisp."],
      leftover: "Two slices for tomorrow.",
      tip: "Pizza night uses pantry basics and avoids delivery markup."
    }
  ];

  const rescueIdeas = [
    ["Half an onion", "Omelette, fried rice, soup base"],
    ["Leftover rice", "Fried rice, rice pudding, burrito bowls"],
    ["Soft tomatoes", "Pasta sauce, shakshuka, soup"],
    ["Stale bread", "Croutons, French toast, breadcrumbs"],
    ["Small cheese block", "Toasties, pasta finish, snack board"],
    ["Carrot ends", "Stock bag, slaw, curry base"]
  ];

  const state = {
    db: null,
    user: null,
    selectedStorage: "pantry",
    view: "home",
    authMode: "signin",
    items: [],
    shopping: [],
    containers: [],
    waste: [],
    recipeFilter: "all",
    timerId: null,
    timerSeconds: 0,
    currentRecipe: null,
    wheelRotation: 0
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const areaById = (id) => storageAreas.find((area) => area.id === id) || storageAreas[0];
  const today = () => new Date(new Date().toDateString());
  const isoDay = (offset) => {
    const date = today();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        [
          ["users", "email"],
          ["sessions", "key"],
          ["groceries", "id"],
          ["shopping", "id"],
          ["containers", "id"],
          ["waste", "id"]
        ].forEach(([name, keyPath]) => {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath });
            if (name !== "users" && name !== "sessions") store.createIndex("userEmail", "userEmail", { unique: false });
          }
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function store(name, mode = "readonly") {
    return state.db.transaction(name, mode).objectStore(name);
  }

  function promisify(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function dbGet(name, key) {
    return promisify(store(name).get(key));
  }

  async function dbPut(name, value) {
    return promisify(store(name, "readwrite").put(value));
  }

  async function dbDelete(name, key) {
    return promisify(store(name, "readwrite").delete(key));
  }

  async function dbByUser(name, userEmail = state.user.email) {
    return promisify(store(name).index("userEmail").getAll(userEmail));
  }

  async function deleteUserRows(name, userEmail = state.user.email) {
    const rows = await dbByUser(name, userEmail);
    await Promise.all(rows.map((row) => dbDelete(name, row.id)));
  }

  async function hashPin(pin, salt) {
    const data = new TextEncoder().encode(`${salt}:${pin}`);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function createUser(email, displayName, pin, seeded = false) {
    const salt = uid();
    const user = {
      email,
      displayName: displayName || email.split("@")[0],
      salt,
      pinHash: await hashPin(pin, salt),
      createdAt: new Date().toISOString(),
      seeded
    };
    await dbPut("users", user);
    return user;
  }

  async function setSession(user) {
    state.user = user;
    await dbPut("sessions", { key: SESSION_KEY, email: user.email });
    await seedAccountIfNeeded(user.email);
    await loadUserData();
    render();
  }

  async function signOut() {
    await dbDelete("sessions", SESSION_KEY);
    const guest = await ensureGuestUser();
    await setSession(guest);
  }

  async function ensureGuestUser() {
    let user = await dbGet("users", GUEST_EMAIL);
    if (!user) user = await createUser(GUEST_EMAIL, "Guest kitchen", "0000", false);
    return user;
  }

  function starterItems(userEmail) {
    return [
      ["Rice", "Grains", 2, "kg", "pantry", "Grains", 62, -8, 90, "Estimated meals left: 8"],
      ["Pasta", "Grains", 1, "packet", "pantry", "Grains", 22, -5, 180, "Shortcut dinner staple"],
      ["Canned tomatoes", "Canned goods", 3, "tin", "pantry", "Canned goods", 54, -10, 365, "Good sauce base"],
      ["Onion", "Vegetables", 4, "item", "pantry", "Vegetables", 16, -3, 12, "Keep dry and cool"],
      ["Garlic", "Vegetables", 1, "packet", "pantry", "Vegetables", 18, -14, 35, "Recipe booster"],
      ["Milk", "Dairy", 1, "litre", "fridge", "Dairy", 24, -2, 3, "Use for oats and sauce"],
      ["Cheese", "Dairy", 250, "g", "fridge", "Dairy", 48, -4, 10, "Grate and freeze extras"],
      ["Spinach", "Vegetables", 1, "packet", "fridge", "Vegetables", 26, -2, 1, "Use before it wilts"],
      ["Carrots", "Vegetables", 5, "item", "fridge", "Vegetables", 18, -6, 2, "Soup or stir-fry"],
      ["Chicken", "Proteins", 1, "kg", "freezer", "Proteins", 86, -5, 45, "Split into two meals"],
      ["Frozen vegetables", "Vegetables", 1, "packet", "freezer", "Vegetables", 34, -12, 120, "Fast fried rice"],
      ["Soy sauce", "Sauces", 1, "bottle", "spice", "Seasoning", 28, -30, 300, "Stir-fry staple"],
      ["Curry powder", "Spices", 1, "packet", "spice", "Spices", 20, -50, 360, "Batch cook helper"],
      ["Flour", "Baking", 1, "kg", "baking", "Flour", 24, -18, 180, "Pizza and pancakes"],
      ["Oats", "Breakfast", 1, "kg", "breakfast", "Oats", 36, -9, 220, "Cheap breakfasts"],
      ["Tuna", "Backup meals", 2, "tin", "backup", "Backup meals", 38, -22, 450, "Emergency protein"],
      ["Dish soap", "Cleaning", 1, "bottle", "cleaning", "Refills", 32, -20, 260, "Running low soon"]
    ].map(([name, category, quantity, unit, location, section, price, boughtOffset, expiryOffset, notes]) => ({
      id: uid(),
      userEmail,
      name,
      category,
      quantity,
      unit,
      location,
      section,
      purchaseDate: isoDay(boughtOffset),
      expiryDate: isoDay(expiryOffset),
      price,
      status: "Good",
      notes,
      barcode: "",
      image: ""
    }));
  }

  function starterShopping(userEmail) {
    return [
      { id: uid(), userEmail, name: "Spring onion", quantity: "1 bunch", reason: "Chicken stir-fry", priority: "medium", estimatedPrice: 14, checked: false },
      { id: uid(), userEmail, name: "Lentils", quantity: "1 packet", reason: "Budget curry", priority: "medium", estimatedPrice: 26, checked: false },
      { id: uid(), userEmail, name: "Mushrooms", quantity: "1 packet", reason: "Date-night pizza", priority: "low", estimatedPrice: 28, checked: false }
    ];
  }

  function starterContainers(userEmail) {
    return [
      { id: uid(), userEmail, name: "Chicken curry", portions: 2, location: "Fridge", eatBy: isoDay(3), notes: "Dinner plus lunch" },
      { id: uid(), userEmail, name: "Rice", portions: 3, location: "Fridge", eatBy: isoDay(2), notes: "Use for fried rice" },
      { id: uid(), userEmail, name: "Vegetable soup", portions: 4, location: "Freezer", eatBy: isoDay(60), notes: "Emergency dinner" }
    ];
  }

  async function seedAccountIfNeeded(userEmail) {
    const user = await dbGet("users", userEmail);
    if (user?.seeded) return;
    await Promise.all(starterItems(userEmail).map((item) => dbPut("groceries", item)));
    await Promise.all(starterShopping(userEmail).map((item) => dbPut("shopping", item)));
    await Promise.all(starterContainers(userEmail).map((item) => dbPut("containers", item)));
    await dbPut("users", { ...user, seeded: true });
    state.user = { ...user, seeded: true };
  }

  async function resetCurrentDemo() {
    await Promise.all(["groceries", "shopping", "containers", "waste"].map((name) => deleteUserRows(name)));
    await dbPut("users", { ...state.user, seeded: false });
    state.user.seeded = false;
    await seedAccountIfNeeded(state.user.email);
    await loadUserData();
    render();
  }

  async function loadUserData() {
    state.items = await dbByUser("groceries");
    state.shopping = await dbByUser("shopping");
    state.containers = await dbByUser("containers");
    state.waste = await dbByUser("waste");
  }

  function daysUntil(dateString) {
    if (!dateString) return 999;
    const target = new Date(dateString + "T00:00:00");
    return Math.ceil((target - today()) / 86400000);
  }

  function itemHealth(item) {
    const days = daysUntil(item.expiryDate);
    if (item.quantity <= 0) return "empty";
    if (days < 0) return "expired";
    if (days <= 2) return "danger";
    if (days <= 6) return "soon";
    return "good";
  }

  function storageHealth(areaId) {
    const items = state.items.filter((item) => item.location === areaId && item.quantity > 0);
    const danger = items.filter((item) => ["danger", "expired"].includes(itemHealth(item))).length;
    const soon = items.filter((item) => itemHealth(item) === "soon").length;
    if (!items.length) return { label: "Empty", className: "status-grey" };
    if (danger) return { label: "Expiring", className: "status-red" };
    if (soon || items.length <= 2) return { label: "Watch", className: "status-yellow" };
    if (areaId === "freezer" && items.length >= 3) return { label: "Full", className: "status-blue" };
    return { label: "Healthy", className: "" };
  }

  function iconSvg(type) {
    const paths = {
      pantry: "M5 4h14v17H5z M8 7h8 M8 12h8 M8 17h8",
      fridge: "M7 3h10v18H7z M7 10h10 M10 6v2 M10 13v2",
      freezer: "M12 3v18 M5 7l14 10 M19 7L5 17 M7 5l2 3 M17 5l-2 3 M7 19l2-3 M17 19l-2-3",
      spice: "M8 4h8l1 4v12H7V8z M9 8h6 M10 12h4",
      snack: "M6 8h12l-1 12H7z M9 8V5h6v3 M9 13h6",
      cleaning: "M9 3h6v5l3 4v8H6v-8l3-4z M9 8h6 M8 14h8",
      baking: "M6 9h12l-2 11H8z M9 9V5h6v4 M10 14h4",
      breakfast: "M5 8h14v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z M8 5h8 M19 10h2v4h-2",
      backup: "M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7z M9 12h6 M12 9v6"
    };
    return `<svg class="storage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[type] || paths.pantry}"/></svg>`;
  }

  function setView(view) {
    state.view = view;
    $$(".view").forEach((node) => node.classList.toggle("active", node.dataset.view === view));
    $$(".nav-button").forEach((node) => node.classList.toggle("active", node.dataset.viewTarget === view));
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }

  function renderKitchen() {
    const grid = $("#kitchenGrid");
    grid.innerHTML = storageAreas.map((area) => {
      const items = state.items.filter((item) => item.location === area.id && item.quantity > 0);
      const health = storageHealth(area.id);
      const mini = items.slice(0, 9).map(() => '<span class="mini-item"></span>').join("");
      return `
        <button class="storage-tile ${area.tone} ${area.type} ${state.selectedStorage === area.id ? "open" : ""}" type="button" data-storage="${area.id}">
          ${iconSvg(area.type)}
          <span class="mist"></span>
          <span class="storage-meta"><span class="status-dot ${health.className}">${health.label}</span><span>${area.sections.length} zones</span></span>
          <span class="storage-name">${area.name}</span>
          <span class="storage-count">${items.length} item${items.length === 1 ? "" : "s"}</span>
          <span class="mini-items">${mini}</span>
        </button>
      `;
    }).join("");
  }

  function renderQuickAdds() {
    $("#quickAddGrid").innerHTML = quickAdds.map(([name]) => `<button type="button" data-quick-add="${name}">${name}</button>`).join("");
  }

  function renderStorageList() {
    $("#storageList").innerHTML = storageAreas.map((area) => {
      const count = state.items.filter((item) => item.location === area.id && item.quantity > 0).length;
      return `<button class="${state.selectedStorage === area.id ? "active" : ""}" type="button" data-select-storage="${area.id}"><span>${area.name}</span><strong>${count}</strong></button>`;
    }).join("");
    $("#selectedStorageTitle").textContent = areaById(state.selectedStorage).name;
  }

  function renderCategoryFilter() {
    const categories = [...new Set(state.items.map((item) => item.category).filter(Boolean))].sort();
    const filter = $("#categoryFilter");
    const current = filter.value || "all";
    filter.innerHTML = `<option value="all">All categories</option>${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}`;
    filter.value = categories.includes(current) ? current : "all";
  }

  function renderShelfLayout() {
    const area = areaById(state.selectedStorage);
    const items = state.items.filter((item) => item.location === state.selectedStorage && item.quantity > 0);
    const sections = [...new Set([...area.sections, ...items.map((item) => item.section).filter(Boolean)])];
    $("#shelfLayout").innerHTML = sections.map((section) => {
      const sectionItems = items.filter((item) => (item.section || item.category) === section || item.category === section);
      return `<article class="shelf-bin"><strong>${section}</strong><div class="shelf-items">${sectionItems.map((item) => `<span draggable="true" data-drag-item="${item.id}">${item.name}</span>`).join("") || "<span>Open space</span>"}</div></article>`;
    }).join("");
  }

  function renderItems() {
    const search = ($("#inventorySearch")?.value || "").trim().toLowerCase();
    const category = $("#categoryFilter")?.value || "all";
    const items = state.items
      .filter((item) => item.location === state.selectedStorage)
      .filter((item) => !search || item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search))
      .filter((item) => category === "all" || item.category === category)
      .sort((a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate));

    $("#itemGrid").innerHTML = items.map((item) => {
      const health = itemHealth(item);
      const days = daysUntil(item.expiryDate);
      const expiry = days < 0 ? "Expired" : days === 0 ? "Expires today" : `Expires in ${days} day${days === 1 ? "" : "s"}`;
      return `
        <article class="item-card ${health === "soon" ? "expiring" : ""} ${["danger", "expired"].includes(health) ? "danger" : ""}">
          <header>
            <div>
              <strong>${item.name}</strong>
              <p class="record-label">${item.quantity} ${item.unit} left</p>
            </div>
            <button class="icon-action" type="button" data-edit-item="${item.id}" aria-label="Edit ${item.name}">...</button>
          </header>
          <div class="item-meta">
            <span>${areaById(item.location).name}</span>
            <span>${item.section || item.category}</span>
            <span>${expiry}</span>
            <span>${currency.format(Number(item.price || 0))}</span>
          </div>
          <p>${item.notes || "No notes yet."}</p>
          <div class="item-actions">
            <button type="button" data-use-some="${item.id}">Use some</button>
            <button type="button" data-add-more="${item.id}">Add more</button>
            <button type="button" data-finish-item="${item.id}">Finished</button>
            <button type="button" data-move-item="${item.id}">Move</button>
            <button type="button" data-shop-item="${item.id}">Shop</button>
            <button type="button" data-find-recipe="${item.name}">Recipes</button>
          </div>
        </article>
      `;
    }).join("") || `<article class="item-card"><strong>No groceries here yet</strong><p>Add an item or move something into this storage area.</p></article>`;
  }

  function findOwnedIngredient(ingredientName) {
    const needle = ingredientName.toLowerCase();
    return state.items.find((item) => item.quantity > 0 && (item.name.toLowerCase() === needle || item.name.toLowerCase().includes(needle) || needle.includes(item.name.toLowerCase())));
  }

  function recipeStatus(recipe) {
    const owned = [];
    const missing = [];
    const expiring = [];
    recipe.ingredients.forEach((ingredient) => {
      const item = findOwnedIngredient(ingredient.name);
      if (item) {
        owned.push(ingredient.name);
        if (daysUntil(item.expiryDate) <= 3) expiring.push(ingredient.name);
      } else {
        missing.push(ingredient.name);
      }
    });
    return {
      owned,
      missing,
      expiring,
      canMake: missing.length === 0,
      oneMissing: missing.length === 1,
      matchScore: owned.length * 3 - missing.length * 2 + expiring.length * 2 - Math.max(0, recipe.cost - 60) / 20
    };
  }

  function rankedRecipes() {
    return recipes.map((recipe) => ({ recipe, status: recipeStatus(recipe) })).sort((a, b) => b.status.matchScore - a.status.matchScore);
  }

  function renderRecipeSpotlight() {
    const best = rankedRecipes()[0];
    if (!best) return;
    $("#recipeSpotlight").innerHTML = `
      <div>
        <p class="eyebrow">Tonight's best meal</p>
        <h2>${best.recipe.title}</h2>
        <p>Uses ${best.status.owned.slice(0, 4).join(", ") || "your pantry"}${best.status.missing.length ? `. Need to buy: ${best.status.missing.join(", ")}.` : ". No shopping needed."}</p>
      </div>
      <button class="primary-action" type="button" data-cook-recipe="${best.recipe.id}">Cook now</button>
    `;
  }

  function renderRecipes() {
    const filtered = rankedRecipes().filter(({ recipe, status }) => {
      if (state.recipeFilter === "ready") return status.canMake;
      if (state.recipeFilter === "one") return status.oneMissing;
      if (state.recipeFilter === "soon") return status.expiring.length;
      if (state.recipeFilter === "cheap") return recipe.cost <= 45 || recipe.tags.includes("cheap");
      if (state.recipeFilter === "lazy") return recipe.time <= 20 || recipe.tags.includes("lazy");
      return true;
    });

    $("#recipeGrid").innerHTML = filtered.map(({ recipe, status }) => `
      <article class="recipe-card">
        <div class="recipe-art" aria-hidden="true"></div>
        <header>
          <div>
            <strong>${recipe.title}</strong>
            <p class="record-label">${currency.format(recipe.cost)} total | ${currency.format(recipe.cost / 2)} per person</p>
          </div>
          <span class="priority ${status.canMake ? "" : status.oneMissing ? "medium" : "high"}">${status.canMake ? "Make now" : status.oneMissing ? "One missing" : `${status.missing.length} gaps`}</span>
        </header>
        <div class="recipe-meta">
          <span>${recipe.time} min</span>
          <span>${recipe.difficulty}</span>
          <span>${recipe.leftover}</span>
        </div>
        <div>
          <p class="record-label">You have</p>
          <div class="owned-list">${status.owned.map((name) => `<span class="tag">${name}</span>`).join("") || "<span class=\"tag\">No matches yet</span>"}</div>
        </div>
        <div>
          <p class="record-label">Missing</p>
          <div class="missing-list">${status.missing.map((name) => `<span class="tag">${name}</span>`).join("") || "<span class=\"tag\">Nothing</span>"}</div>
        </div>
        <p>${recipe.tip}</p>
        <div class="recipe-actions">
          <button type="button" data-cook-recipe="${recipe.id}">Cook now</button>
          <button type="button" data-add-missing="${recipe.id}">Add gaps</button>
          <button type="button" data-plan-recipe="${recipe.id}">Plan week</button>
        </div>
      </article>
    `).join("") || `<article class="recipe-card"><strong>No recipes match this filter.</strong><p>Try another mood or add a few staples.</p></article>`;
  }

  function renderMealPrep() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const picks = rankedRecipes();
    $("#weeklyPlanner").innerHTML = days.map((day, index) => {
      const pick = picks[index % picks.length]?.recipe;
      return `<article class="prep-day"><h3>${day}</h3><div class="prep-meal"><strong>${pick?.title || "Open slot"}</strong><span>${pick ? `${pick.time} min | ${currency.format(pick.cost)}` : "Plan a meal"}</span></div><button class="small-action" type="button" data-plan-day="${day}">Swap meal</button></article>`;
    }).join("");

    const soon = state.items.filter((item) => daysUntil(item.expiryDate) <= 6 && item.quantity > 0).sort((a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate));
    $("#useSoonList").innerHTML = soon.slice(0, 6).map((item) => `<article class="use-soon-row"><strong>${item.name}</strong><span>${daysUntil(item.expiryDate) <= 0 ? "Use today" : `Use within ${daysUntil(item.expiryDate)} days`}</span></article>`).join("") || `<article class="use-soon-row"><strong>Nothing urgent</strong><span>Your fresh food is looking calm.</span></article>`;

    $("#containerCount").textContent = String(state.containers.length);
    $("#containerList").innerHTML = state.containers.map((row) => `<article class="container-row"><strong>${row.name}</strong><span>${row.portions} portion${row.portions === 1 ? "" : "s"} | ${row.location} | eat by ${row.eatBy}</span><span>${row.notes || ""}</span></article>`).join("");
  }

  function renderShopping() {
    const sort = $("#shoppingSort")?.value || "priority";
    const rank = { high: 0, medium: 1, low: 2 };
    const rows = [...state.shopping].sort((a, b) => {
      if (sort === "price") return Number(b.estimatedPrice || 0) - Number(a.estimatedPrice || 0);
      if (sort === "reason") return String(a.reason).localeCompare(String(b.reason));
      return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3);
    });
    $("#shoppingList").innerHTML = rows.map((item) => `
      <article class="shopping-item ${item.checked ? "checked" : ""}">
        <input type="checkbox" ${item.checked ? "checked" : ""} data-toggle-shop="${item.id}" aria-label="Check ${item.name}" />
        <div>
          <strong>${item.name}</strong>
          <p class="record-label">${item.quantity} | ${item.reason}</p>
        </div>
        <span class="priority ${item.priority === "high" ? "high" : item.priority === "medium" ? "medium" : ""}">${currency.format(Number(item.estimatedPrice || 0))}</span>
      </article>
    `).join("") || `<article class="shopping-item"><span></span><div><strong>Your list is empty</strong><p class="record-label">Generate gaps from recipes and low-stock items.</p></div><span></span></article>`;
  }

  function renderSavings() {
    const soonValue = state.items.filter((item) => daysUntil(item.expiryDate) <= 6 && item.quantity > 0).reduce((sum, item) => sum + Number(item.price || 0), 0);
    const readyValue = rankedRecipes().filter(({ status }) => status.canMake).length * 38;
    const wasteValue = state.waste.reduce((sum, row) => sum + Number(row.value || 0), 0);
    $("#monthlySaved").textContent = `${currency.format(soonValue + readyValue)} saved`;
    $("#wasteValue").textContent = `${currency.format(wasteValue)} wasted`;
    $("#wasteNote").textContent = state.waste.length ? `Most recent: ${state.waste[0].name}` : "No waste logged in this demo yet.";
    $("#rescueGrid").innerHTML = rescueIdeas.map(([title, body]) => `<article class="rescue-tile"><strong>${title}</strong><p>${body}</p></article>`).join("");
  }

  function renderHomeMetrics() {
    const soon = state.items.filter((item) => daysUntil(item.expiryDate) <= 6 && item.quantity > 0);
    const ready = rankedRecipes().filter(({ status }) => status.canMake);
    const gaps = new Set(rankedRecipes().slice(0, 4).flatMap(({ status }) => status.missing));
    const savings = soon.reduce((sum, item) => sum + Number(item.price || 0), 0) + ready.length * 25;
    $("#useSoonCount").textContent = String(soon.length);
    $("#readyMealsCount").textContent = String(ready.length);
    $("#savingsEstimate").textContent = currency.format(savings);
    $("#shoppingGapCount").textContent = String(gaps.size);
  }

  function renderAccount() {
    const name = state.user?.displayName || "Guest kitchen";
    $("#accountName").textContent = name;
    $("#accountInitial").textContent = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  }

  function renderAssistant() {
    const urgent = state.items.filter((item) => daysUntil(item.expiryDate) <= 2 && item.quantity > 0).sort((a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate))[0];
    const best = rankedRecipes()[0];
    $("#assistantMessage").textContent = urgent
      ? `${urgent.name} needs a rescue. Try ${best.recipe.title}.`
      : `${best.recipe.title} is your best pantry-first dinner.`;
  }

  function render() {
    if (!state.user) return;
    renderAccount();
    renderKitchen();
    renderQuickAdds();
    renderStorageList();
    renderCategoryFilter();
    renderShelfLayout();
    renderItems();
    renderRecipeSpotlight();
    renderRecipes();
    renderMealPrep();
    renderShopping();
    renderSavings();
    renderHomeMetrics();
    renderAssistant();
  }

  function fillForm(item = null) {
    const form = $("#itemForm");
    form.reset();
    $("[name='id']", form).value = item?.id || "";
    $("[name='name']", form).value = item?.name || "";
    $("[name='quantity']", form).value = item?.quantity ?? 1;
    $("[name='unit']", form).value = item?.unit || "item";
    $("[name='location']", form).value = item?.location || state.selectedStorage;
    $("[name='section']", form).value = item?.section || "";
    $("[name='category']", form).value = item?.category || "";
    $("[name='purchaseDate']", form).value = item?.purchaseDate || isoDay(0);
    $("[name='expiryDate']", form).value = item?.expiryDate || isoDay(14);
    $("[name='price']", form).value = item?.price || "";
    $("[name='notes']", form).value = item?.notes || "";
    $("#dialogTitle").textContent = item ? `Edit ${item.name}` : "Add grocery";
    $("[data-delete-item]").style.visibility = item ? "visible" : "hidden";
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  async function saveItemFromForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const existing = data.id ? state.items.find((item) => item.id === data.id) : null;
    const item = {
      id: data.id || uid(),
      userEmail: state.user.email,
      name: data.name.trim(),
      category: data.category.trim() || "General",
      quantity: Number(data.quantity || 0),
      unit: data.unit,
      location: data.location,
      section: data.section.trim() || data.category.trim() || "General",
      expiryDate: data.expiryDate,
      purchaseDate: data.purchaseDate,
      price: Number(data.price || 0),
      status: existing?.status || "Good",
      notes: data.notes.trim(),
      barcode: existing?.barcode || "",
      image: existing?.image || ""
    };
    await dbPut("groceries", item);
    await loadUserData();
    closeDialog($("#itemDialog"));
    state.selectedStorage = item.location;
    render();
  }

  async function changeQuantity(id, delta) {
    const item = state.items.find((row) => row.id === id);
    if (!item) return;
    item.quantity = Math.max(0, Number(item.quantity || 0) + delta);
    await dbPut("groceries", item);
    await loadUserData();
    render();
  }

  async function addShoppingItem(partial) {
    const item = {
      id: uid(),
      userEmail: state.user.email,
      name: partial.name,
      quantity: partial.quantity || "1",
      reason: partial.reason || "Manual add",
      priority: partial.priority || "medium",
      estimatedPrice: Number(partial.estimatedPrice || 20),
      checked: false
    };
    await dbPut("shopping", item);
  }

  async function generateShoppingList() {
    const lowStock = state.items.filter((item) => item.quantity > 0 && Number(item.quantity) <= 1 && !["spice", "cleaning"].includes(item.location));
    const recipeGaps = [...new Set(rankedRecipes().slice(0, 4).flatMap(({ status }) => status.missing))];
    await Promise.all(lowStock.map((item) => addShoppingItem({ name: item.name, quantity: `1 ${item.unit}`, reason: "Running low", priority: "high", estimatedPrice: item.price || 20 })));
    await Promise.all(recipeGaps.map((name) => addShoppingItem({ name, quantity: "1", reason: "Meal plan gap", priority: "medium", estimatedPrice: 24 })));
    await loadUserData();
    renderShopping();
    renderHomeMetrics();
  }

  async function openCooking(recipeId) {
    const recipe = recipes.find((row) => row.id === recipeId);
    if (!recipe) return;
    state.currentRecipe = recipe;
    $("#cookingTitle").textContent = recipe.title;
    $("#cookMeta").innerHTML = `<span>${recipe.time} min</span><span>${currency.format(recipe.cost)} for two</span><span>${recipe.difficulty}</span><span>${recipe.leftover}</span>`;
    $("#cookIngredients").innerHTML = recipe.ingredients.map((ingredient) => {
      const owned = Boolean(findOwnedIngredient(ingredient.name));
      return `<label><input type="checkbox" ${owned ? "checked" : ""} /> ${ingredient.amount} ${ingredient.unit} ${ingredient.name}</label>`;
    }).join("");
    $("#cookSteps").innerHTML = recipe.steps.map((step) => `<li>${step}</li>`).join("");
    $("#timerDisplay").textContent = "Timer idle";
    openDialog($("#cookingDialog"));
  }

  async function finishCooking() {
    const recipe = state.currentRecipe;
    if (!recipe) return;
    for (const ingredient of recipe.ingredients) {
      const item = findOwnedIngredient(ingredient.name);
      if (!item) continue;
      const sameUnit = item.unit.toLowerCase() === ingredient.unit.toLowerCase();
      const amount = sameUnit ? Number(ingredient.amount || 1) : Math.min(Number(item.quantity || 0), 1);
      item.quantity = Math.max(0, Number(item.quantity || 0) - amount);
      await dbPut("groceries", item);
    }
    await dbPut("containers", {
      id: uid(),
      userEmail: state.user.email,
      name: `${recipe.title} leftovers`,
      portions: recipe.leftover.toLowerCase().includes("none") ? 1 : 2,
      location: "Fridge",
      eatBy: isoDay(3),
      notes: recipe.leftover
    });
    await loadUserData();
    closeDialog($("#cookingDialog"));
    render();
  }

  function startTimer(minutes) {
    clearInterval(state.timerId);
    state.timerSeconds = minutes * 60;
    const display = $("#timerDisplay");
    const tick = () => {
      const mins = Math.floor(state.timerSeconds / 60);
      const secs = String(state.timerSeconds % 60).padStart(2, "0");
      display.textContent = `${mins}:${secs}`;
      if (state.timerSeconds <= 0) {
        clearInterval(state.timerId);
        display.textContent = "Done";
      }
      state.timerSeconds -= 1;
    };
    tick();
    state.timerId = setInterval(tick, 1000);
  }

  async function submitAuth(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(form.email.value || "").trim().toLowerCase();
    const pin = String(form.pin.value || "");
    const displayName = String(form.displayName.value || "").trim();
    const status = $("#authStatus");
    status.textContent = "";

    if (state.authMode === "signup") {
      if (await dbGet("users", email)) {
        status.textContent = "That account already exists. Sign in instead.";
        return;
      }
      const user = await createUser(email, displayName, pin, false);
      await setSession(user);
      closeDialog($("#authDialog"));
      return;
    }

    const user = await dbGet("users", email);
    if (!user || user.pinHash !== await hashPin(pin, user.salt)) {
      status.textContent = "Email or PIN did not match.";
      return;
    }
    await setSession(user);
    closeDialog($("#authDialog"));
  }

  function setAuthMode(mode) {
    state.authMode = mode;
    $$("[data-auth-mode]").forEach((button) => button.classList.toggle("active", button.dataset.authMode === mode));
    $("#authSubmit").textContent = mode === "signup" ? "Create account" : "Sign in";
    $("#authStatus").textContent = "";
  }

  async function handleClick(event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.viewTarget) {
      setView(button.dataset.viewTarget);
      return;
    }
    if (button.dataset.storage) {
      state.selectedStorage = button.dataset.storage;
      renderKitchen();
      setTimeout(() => setView("cupboards"), 180);
      return;
    }
    if (button.dataset.selectStorage) {
      state.selectedStorage = button.dataset.selectStorage;
      render();
      return;
    }
    if (button.matches("[data-open-add]")) {
      fillForm();
      openDialog($("#itemDialog"));
      return;
    }
    if (button.matches("[data-close-dialog]")) {
      closeDialog($("#itemDialog"));
      return;
    }
    if (button.matches("[data-open-auth]")) {
      $("#authForm").reset();
      $("#authForm").email.value = state.user?.email === GUEST_EMAIL ? "" : state.user?.email || "";
      openDialog($("#authDialog"));
      return;
    }
    if (button.matches("[data-close-auth]")) {
      closeDialog($("#authDialog"));
      return;
    }
    if (button.dataset.authMode) {
      setAuthMode(button.dataset.authMode);
      return;
    }
    if (button.matches("[data-sign-out]")) {
      await signOut();
      closeDialog($("#authDialog"));
      return;
    }
    if (button.dataset.quickAdd) {
      const quick = quickAdds.find(([name]) => name === button.dataset.quickAdd);
      if (!quick) return;
      const [name, location, category, unit, quantity, price] = quick;
      await dbPut("groceries", {
        id: uid(),
        userEmail: state.user.email,
        name,
        category,
        quantity,
        unit,
        location,
        section: category,
        purchaseDate: isoDay(0),
        expiryDate: isoDay(location === "fridge" ? 7 : location === "freezer" ? 90 : 180),
        price,
        status: "Good",
        notes: "Quick added",
        barcode: "",
        image: ""
      });
      await loadUserData();
      state.selectedStorage = location;
      render();
      return;
    }
    if (button.dataset.editItem) {
      fillForm(state.items.find((item) => item.id === button.dataset.editItem));
      openDialog($("#itemDialog"));
      return;
    }
    if (button.dataset.useSome) {
      const item = state.items.find((row) => row.id === button.dataset.useSome);
      await changeQuantity(button.dataset.useSome, Number(item?.quantity || 0) > 1 ? -1 : -0.25);
      return;
    }
    if (button.dataset.addMore) {
      await changeQuantity(button.dataset.addMore, 1);
      return;
    }
    if (button.dataset.finishItem) {
      await dbDelete("groceries", button.dataset.finishItem);
      await loadUserData();
      render();
      return;
    }
    if (button.dataset.moveItem) {
      const item = state.items.find((row) => row.id === button.dataset.moveItem);
      const nextIndex = (storageAreas.findIndex((area) => area.id === item.location) + 1) % storageAreas.length;
      item.location = storageAreas[nextIndex].id;
      item.section = storageAreas[nextIndex].sections[0];
      await dbPut("groceries", item);
      await loadUserData();
      state.selectedStorage = item.location;
      render();
      return;
    }
    if (button.dataset.shopItem) {
      const item = state.items.find((row) => row.id === button.dataset.shopItem);
      await addShoppingItem({ name: item.name, quantity: `1 ${item.unit}`, reason: "Replacement", priority: "medium", estimatedPrice: item.price });
      await loadUserData();
      setView("shopping");
      return;
    }
    if (button.dataset.findRecipe) {
      state.recipeFilter = "all";
      setView("recipes");
      $("#assistantMessage").textContent = `Recipes using ${button.dataset.findRecipe} are ready in the feed.`;
      return;
    }
    if (button.dataset.cookRecipe) {
      await openCooking(button.dataset.cookRecipe);
      return;
    }
    if (button.dataset.addMissing) {
      const recipe = recipes.find((row) => row.id === button.dataset.addMissing);
      const status = recipeStatus(recipe);
      await Promise.all(status.missing.map((name) => addShoppingItem({ name, quantity: "1", reason: recipe.title, priority: status.missing.length === 1 ? "medium" : "low", estimatedPrice: 24 })));
      await loadUserData();
      setView("shopping");
      return;
    }
    if (button.dataset.planRecipe) {
      const recipe = recipes.find((row) => row.id === button.dataset.planRecipe);
      await dbPut("containers", { id: uid(), userEmail: state.user.email, name: `${recipe.title} prep`, portions: 2, location: "Meal plan", eatBy: isoDay(5), notes: "Planned for two" });
      await loadUserData();
      setView("prep");
      return;
    }
    if (button.matches("[data-generate-list]")) {
      await generateShoppingList();
      return;
    }
    if (button.matches("[data-clear-checked]")) {
      await Promise.all(state.shopping.filter((row) => row.checked).map((row) => dbDelete("shopping", row.id)));
      await loadUserData();
      renderShopping();
      return;
    }
    if (button.matches("[data-make-sauce]")) {
      await addShoppingItem({ name: "Parmesan", quantity: "1 small block", reason: "Homemade tomato sauce upgrade", priority: "low", estimatedPrice: 35 });
      await loadUserData();
      renderShopping();
      return;
    }
    if (button.matches("[data-log-waste]")) {
      const name = window.prompt("What was wasted?", "Lettuce");
      if (!name) return;
      const value = Number(window.prompt("Estimated value in rand?", "18") || 0);
      await dbPut("waste", { id: uid(), userEmail: state.user.email, name, value, createdAt: new Date().toISOString() });
      await loadUserData();
      renderSavings();
      return;
    }
    if (button.matches("[data-reset-demo]")) {
      await resetCurrentDemo();
      return;
    }
    if (button.matches("[data-spin-wheel]")) {
      const choices = ["Tomato Garlic Pasta", "Chicken Stir-fry Bowls", "Lentil Curry", "Egg Fried Rice", "Homemade Pizza", "Leftover Rescue"];
      const chosen = choices[Math.floor(Math.random() * choices.length)];
      state.wheelRotation += 720 + Math.floor(Math.random() * 360);
      $("#dinnerWheel").style.transform = `rotate(${state.wheelRotation}deg)`;
      $("#wheelResult").textContent = chosen;
      return;
    }
    if (button.matches("[data-smart-cook]")) {
      const best = rankedRecipes().find(({ status }) => status.expiring.length) || rankedRecipes()[0];
      setView("recipes");
      setTimeout(() => openCooking(best.recipe.id), 220);
      return;
    }
    if (button.matches("[data-add-container]")) {
      await dbPut("containers", { id: uid(), userEmail: state.user.email, name: "Soup prep", portions: 2, location: "Fridge", eatBy: isoDay(4), notes: "Added from meal prep" });
      await loadUserData();
      renderMealPrep();
      return;
    }
    if (button.matches("[data-close-cooking]")) {
      closeDialog($("#cookingDialog"));
      return;
    }
    if (button.matches("[data-finish-cooking]")) {
      await finishCooking();
      return;
    }
    if (button.matches("[data-save-leftovers]")) {
      if (!state.currentRecipe) return;
      await dbPut("containers", { id: uid(), userEmail: state.user.email, name: `${state.currentRecipe.title} leftovers`, portions: 1, location: "Fridge", eatBy: isoDay(2), notes: "Saved from cooking mode" });
      await loadUserData();
      renderMealPrep();
      return;
    }
    if (button.dataset.timer) {
      startTimer(Number(button.dataset.timer));
    }
  }

  async function handleChange(event) {
    if (event.target.id === "inventorySearch" || event.target.id === "categoryFilter") {
      renderItems();
    }
    if (event.target.id === "shoppingSort") {
      renderShopping();
    }
    if (event.target.matches("[data-toggle-shop]")) {
      const item = state.shopping.find((row) => row.id === event.target.dataset.toggleShop);
      item.checked = event.target.checked;
      await dbPut("shopping", item);
      await loadUserData();
      renderShopping();
    }
  }

  async function init() {
    state.db = await openDB();
    const locationSelect = $("#locationSelect");
    locationSelect.innerHTML = storageAreas.map((area) => `<option value="${area.id}">${area.name}</option>`).join("");

    const session = await dbGet("sessions", SESSION_KEY);
    let user = session?.email ? await dbGet("users", session.email) : null;
    if (!user) user = await ensureGuestUser();
    state.user = user;
    await seedAccountIfNeeded(user.email);
    await loadUserData();

    document.addEventListener("click", handleClick);
    document.addEventListener("change", handleChange);
    $("#itemForm").addEventListener("submit", saveItemFromForm);
    $("#authForm").addEventListener("submit", submitAuth);
    $("#inventorySearch").addEventListener("input", renderItems);
    $("#categoryFilter").addEventListener("change", renderItems);
    $("#shoppingSort").addEventListener("change", renderShopping);
    $("#recipeFilters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      state.recipeFilter = button.dataset.filter;
      $$(".filter-chip", $("#recipeFilters")).forEach((chip) => chip.classList.toggle("active", chip === button));
      renderRecipes();
    });
    $("[data-delete-item]").addEventListener("click", async () => {
      const id = $("[name='id']", $("#itemForm")).value;
      if (!id) return;
      await dbDelete("groceries", id);
      await loadUserData();
      closeDialog($("#itemDialog"));
      render();
    });

    setAuthMode("signin");
    render();
  }

  init().catch((error) => {
    console.error(error);
    document.body.insertAdjacentHTML("afterbegin", `<div style="padding:1rem;background:#ffe8e3;color:#8f342a;font-weight:800">Cupboard Companion could not start: ${error.message}</div>`);
  });
})();
