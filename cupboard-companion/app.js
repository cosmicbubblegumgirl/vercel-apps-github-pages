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

  const scanCatalog = [
    ["Milk", "fridge", "Dairy", "litre", 1, 24, 7],
    ["Eggs", "fridge", "Dairy", "item", 6, 24, 18],
    ["Cheese", "fridge", "Dairy", "g", 250, 48, 21],
    ["Yoghurt", "fridge", "Dairy", "tub", 1, 32, 14],
    ["Spinach", "fridge", "Vegetables", "packet", 1, 26, 3],
    ["Carrots", "fridge", "Vegetables", "item", 5, 18, 10],
    ["Cucumber", "fridge", "Vegetables", "item", 1, 16, 6],
    ["Tomato", "fridge", "Vegetables", "item", 4, 18, 6],
    ["Chicken", "freezer", "Proteins", "kg", 1, 85, 90],
    ["Frozen vegetables", "freezer", "Vegetables", "packet", 1, 34, 120],
    ["Mince", "freezer", "Proteins", "kg", 0.5, 65, 90],
    ["Rice", "pantry", "Grains", "kg", 2, 62, 365],
    ["Pasta", "pantry", "Grains", "packet", 1, 22, 240],
    ["Canned tomatoes", "pantry", "Canned goods", "tin", 2, 36, 365],
    ["Beans", "pantry", "Canned goods", "tin", 2, 34, 365],
    ["Chickpeas", "pantry", "Canned goods", "tin", 2, 34, 365],
    ["Lentils", "pantry", "Grains", "packet", 1, 26, 365],
    ["Onion", "pantry", "Vegetables", "item", 4, 16, 21],
    ["Garlic", "pantry", "Vegetables", "packet", 1, 18, 35],
    ["Bread", "breakfast", "Bakery", "packet", 1, 18, 5],
    ["Oats", "breakfast", "Breakfast", "kg", 1, 36, 240],
    ["Flour", "baking", "Baking", "kg", 1, 24, 180],
    ["Peanut butter", "breakfast", "Spreads", "jar", 1, 42, 240],
    ["Soy sauce", "spice", "Sauces", "bottle", 1, 28, 365],
    ["Curry powder", "spice", "Spices", "packet", 1, 20, 365],
    ["Tuna", "backup", "Backup meals", "tin", 2, 38, 450]
  ];

  const scanDefaults = {
    pantry: ["Rice", "Pasta", "Canned tomatoes", "Beans", "Onion", "Garlic"],
    fridge: ["Milk", "Eggs", "Cheese", "Spinach", "Carrots", "Tomato"],
    freezer: ["Chicken", "Frozen vegetables", "Mince"],
    spice: ["Soy sauce", "Curry powder", "Garlic"],
    baking: ["Flour", "Oats"],
    breakfast: ["Bread", "Oats", "Peanut butter", "Milk"],
    backup: ["Tuna", "Beans", "Canned tomatoes"],
    receipt: ["Milk", "Eggs", "Bread", "Chicken", "Rice", "Tomato"],
    invoice: ["Rice", "Pasta", "Canned tomatoes", "Beans", "Milk", "Chicken"]
  };

  const wheelOptions = [
    "Pasta",
    "Rice bowl",
    "Stir-fry",
    "Soup",
    "Wraps",
    "Curry",
    "Tray bake",
    "Breakfast",
    "Pizza",
    "Snack board",
    "Leftovers",
    "One-pan"
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

  function recipeSlug(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function ingredientMeasure(name) {
    const lookup = {
      "Pasta": [0.5, "packet"],
      "Rice": [0.3, "kg"],
      "Canned tomatoes": [1, "tin"],
      "Onion": [1, "item"],
      "Garlic": [1, "item"],
      "Milk": [0.25, "litre"],
      "Cheese": [80, "g"],
      "Spinach": [1, "packet"],
      "Carrots": [2, "item"],
      "Chicken": [0.4, "kg"],
      "Frozen vegetables": [1, "packet"],
      "Soy sauce": [1, "portion"],
      "Curry powder": [1, "portion"],
      "Flour": [0.4, "kg"],
      "Oats": [0.2, "kg"],
      "Tuna": [1, "tin"],
      "Eggs": [2, "item"],
      "Bread": [4, "slice"],
      "Potatoes": [4, "item"],
      "Beans": [1, "tin"],
      "Chickpeas": [1, "tin"],
      "Lentils": [1, "packet"],
      "Peanut butter": [2, "tbsp"],
      "Noodles": [1, "packet"],
      "Mushrooms": [1, "packet"],
      "Wraps": [4, "item"],
      "Coconut milk": [1, "tin"],
      "Parmesan": [40, "g"],
      "Basil": [1, "portion"],
      "Yoghurt": [0.25, "tub"],
      "Paprika": [1, "portion"],
      "Mince": [0.4, "kg"],
      "Cabbage": [0.5, "head"],
      "Peas": [1, "cup"],
      "Stock": [1, "cube"],
      "Lemon": [1, "item"],
      "Cucumber": [1, "item"],
      "Apple": [1, "item"],
      "Banana": [1, "item"]
    };
    const [amount, unit] = lookup[name] || [1, "portion"];
    return { name, amount, unit };
  }

  const recipeTwists = [
    { suffix: "", tags: ["classic"], ingredients: [], time: 0, cost: 0, difficulty: "Easy", leftover: "Best for two portions.", step: "Serve as soon as it tastes balanced." },
    { suffix: " With Fresh Veg", tags: ["soon", "healthy"], ingredients: ["Spinach", "Carrots"], time: 4, cost: 14, difficulty: "Easy", leftover: "One lunch portion if bulked with rice.", step: "Fold in the fresh veg near the end." },
    { suffix: " Batch Prep", tags: ["batch", "leftovers"], ingredients: ["Rice", "Frozen vegetables"], time: 8, cost: 18, difficulty: "Easy", leftover: "Two planned leftover portions.", step: "Cook a little extra and portion it before serving." },
    { suffix: " Date-Night Style", tags: ["date", "fancy"], ingredients: ["Cheese", "Basil"], time: 6, cost: 24, difficulty: "Medium", leftover: "Small lunch portion if you save a scoop.", step: "Plate neatly and finish with cheese or herbs." },
    { suffix: " Pantry-First", tags: ["cheap", "no-shop"], ingredients: ["Canned tomatoes", "Onion", "Garlic"], time: 3, cost: 8, difficulty: "Easy", leftover: "None unless doubled.", step: "Lean on pantry seasoning instead of buying extras." }
  ];

  const extraRecipeFamilies = [
    { title: "Peanut Butter Noodles For Two", tags: ["cheap", "lazy"], time: 12, cost: 28, ingredients: ["Noodles", "Peanut butter", "Soy sauce", "Garlic"], steps: ["Boil noodles.", "Whisk peanut butter, soy sauce, and garlic.", "Toss noodles through the sauce.", "Loosen with hot water if needed."], tip: "Peanut butter makes a fast sauce without takeout prices." },
    { title: "Shakshuka For Two", tags: ["cheap", "breakfast"], time: 24, cost: 38, ingredients: ["Eggs", "Canned tomatoes", "Onion", "Paprika", "Bread"], steps: ["Cook onion with paprika.", "Add tomatoes and simmer.", "Crack eggs into the sauce.", "Serve with toast."], tip: "Eggs stretch a tomato tin into a full dinner." },
    { title: "Lentil Bolognese For Two", tags: ["cheap", "pasta"], time: 32, cost: 44, ingredients: ["Lentils", "Pasta", "Canned tomatoes", "Onion", "Garlic"], steps: ["Cook onion and garlic.", "Add lentils and tomatoes.", "Simmer until thick.", "Serve over pasta."], tip: "Lentils replace mince when the budget is tight." },
    { title: "Chickpea Curry For Two", tags: ["cheap", "curry"], time: 24, cost: 40, ingredients: ["Chickpeas", "Canned tomatoes", "Curry powder", "Rice", "Onion"], steps: ["Cook onion with curry powder.", "Add chickpeas and tomatoes.", "Simmer until glossy.", "Serve with rice."], tip: "Canned chickpeas are a low-effort protein." },
    { title: "Tuna Pasta Bake For Two", tags: ["comfort", "pasta"], time: 30, cost: 52, ingredients: ["Tuna", "Pasta", "Milk", "Cheese", "Frozen vegetables"], steps: ["Cook pasta.", "Make a quick milk and cheese sauce.", "Fold in tuna and vegetables.", "Bake until bubbling."], tip: "Use frozen veg to avoid fresh waste." },
    { title: "Loaded Baked Potatoes For Two", tags: ["cheap", "comfort"], time: 38, cost: 36, ingredients: ["Potatoes", "Cheese", "Beans", "Onion"], steps: ["Bake or microwave potatoes.", "Warm beans with onion.", "Split potatoes open.", "Top with beans and cheese."], tip: "Potatoes are a filling base when the fridge is light." },
    { title: "Savory Oats For Two", tags: ["breakfast", "cheap"], time: 10, cost: 20, ingredients: ["Oats", "Eggs", "Cheese", "Soy sauce"], steps: ["Cook oats with water or milk.", "Season with soy sauce.", "Top with egg.", "Finish with cheese."], tip: "Oats work as dinner when treated like rice." },
    { title: "Tomato Bean Stew For Two", tags: ["soup", "cheap"], time: 26, cost: 34, ingredients: ["Beans", "Canned tomatoes", "Carrots", "Onion", "Stock"], steps: ["Cook onion and carrots.", "Add beans, tomatoes, and stock.", "Simmer until thick.", "Serve with bread or rice."], tip: "Beans and tomatoes make a no-shop stew." },
    { title: "Chicken Wraps For Two", tags: ["wraps", "leftovers"], time: 18, cost: 58, ingredients: ["Chicken", "Wraps", "Carrots", "Yoghurt", "Cucumber"], steps: ["Cook chicken strips.", "Mix yoghurt with garlic.", "Slice vegetables.", "Roll everything into wraps."], tip: "Wraps turn small chicken portions into a full meal." },
    { title: "Vegetable Fried Rice For Two", tags: ["rice bowl", "lazy"], time: 14, cost: 28, ingredients: ["Rice", "Eggs", "Frozen vegetables", "Soy sauce", "Garlic"], steps: ["Fry garlic and rice.", "Add vegetables.", "Scramble eggs in the pan.", "Season with soy sauce."], tip: "Use cold rice for the best texture." },
    { title: "Creamy Garlic Chicken For Two", tags: ["date", "comfort"], time: 28, cost: 74, ingredients: ["Chicken", "Garlic", "Milk", "Cheese", "Rice"], steps: ["Brown chicken.", "Add garlic.", "Make a quick creamy sauce with milk and cheese.", "Serve over rice."], tip: "Milk and cheese keep it creamy without buying cream." },
    { title: "Potato Hash For Two", tags: ["breakfast", "one-pan"], time: 22, cost: 30, ingredients: ["Potatoes", "Onion", "Eggs", "Paprika"], steps: ["Dice potatoes small.", "Fry with onion and paprika.", "Make two spaces in the pan.", "Crack in eggs and cover."], tip: "Small potato cubes cook faster and use less oil." },
    { title: "Egg Tomato Toast For Two", tags: ["lazy", "breakfast"], time: 11, cost: 24, ingredients: ["Eggs", "Bread", "Canned tomatoes", "Garlic"], steps: ["Toast bread.", "Warm tomatoes with garlic.", "Scramble or fry eggs.", "Pile eggs and sauce on toast."], tip: "Toast turns a small sauce into dinner." },
    { title: "Pantry Minestrone For Two", tags: ["soup", "no-shop"], time: 29, cost: 36, ingredients: ["Pasta", "Beans", "Canned tomatoes", "Carrots", "Stock"], steps: ["Simmer tomatoes, carrots, beans, and stock.", "Add pasta.", "Cook until tender.", "Season and serve."], tip: "Tiny pasta amounts make soup feel bigger." },
    { title: "Mushroom Rice For Two", tags: ["rice bowl", "comfort"], time: 27, cost: 46, ingredients: ["Rice", "Mushrooms", "Onion", "Garlic", "Cheese"], steps: ["Cook onion, garlic, and mushrooms.", "Add rice and water.", "Simmer until rice is tender.", "Finish with cheese."], tip: "A little cheese gives risotto energy without special rice." },
    { title: "Bean Quesadillas For Two", tags: ["wraps", "cheap"], time: 16, cost: 35, ingredients: ["Wraps", "Beans", "Cheese", "Onion", "Paprika"], steps: ["Mash beans with onion and paprika.", "Spread onto wraps.", "Add cheese.", "Toast in a dry pan."], tip: "Beans make wraps more filling than cheese alone." },
    { title: "Spinach Omelette For Two", tags: ["soon", "breakfast"], time: 12, cost: 30, ingredients: ["Spinach", "Eggs", "Cheese", "Onion"], steps: ["Soften onion.", "Wilt spinach.", "Add beaten eggs.", "Finish with cheese."], tip: "Use wilting greens before they become waste." },
    { title: "Chicken Soup For Two", tags: ["soup", "leftovers"], time: 34, cost: 48, ingredients: ["Chicken", "Carrots", "Onion", "Stock", "Rice"], steps: ["Simmer chicken with onion, carrots, and stock.", "Shred chicken.", "Add rice.", "Cook until cozy and thick."], tip: "Rice makes soup feel like a full dinner." },
    { title: "Herby Tomato Pasta For Two", tags: ["pasta", "no-shop"], time: 18, cost: 32, ingredients: ["Pasta", "Canned tomatoes", "Basil", "Garlic", "Onion"], steps: ["Cook pasta.", "Simmer tomatoes with onion and garlic.", "Add basil.", "Toss pasta through the sauce."], tip: "Herbs make pantry sauce feel fresher." },
    { title: "Breakfast Pancakes For Two", tags: ["breakfast", "comfort"], time: 20, cost: 26, ingredients: ["Flour", "Milk", "Eggs", "Banana"], steps: ["Mix flour, milk, and eggs.", "Slice banana.", "Cook pancakes in batches.", "Top with banana."], tip: "Pancakes rescue milk and eggs before shopping day." }
  ];

  recipes.push(...extraRecipeFamilies.flatMap((family, familyIndex) =>
    recipeTwists.map((twist, twistIndex) => {
      const title = `${family.title}${twist.suffix}`;
      const ingredientNames = [...new Set([...family.ingredients, ...twist.ingredients])];
      return {
        id: `${recipeSlug(title)}-${familyIndex}-${twistIndex}`,
        title,
        servings: 2,
        time: family.time + twist.time,
        difficulty: twist.difficulty,
        estimatedCost: family.cost + twist.cost,
        cost: family.cost + twist.cost,
        ingredients: ingredientNames.map(ingredientMeasure),
        steps: [...family.steps, twist.step],
        tags: [...new Set([...family.tags, ...twist.tags])],
        leftover: twist.leftover,
        leftoverPotential: twist.leftover,
        tip: family.tip
      };
    })
  ));

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
    servings: 2,
    previewMode: "web",
    scanDrafts: [],
    scanSource: "",
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
  const recipeServings = (recipe) => Number(recipe.servings || 2);
  const servingScale = (recipe) => state.servings / recipeServings(recipe);
  const scaledCost = (recipe) => Math.round(Number(recipe.cost || recipe.estimatedCost || 0) * servingScale(recipe));
  const scaledAmount = (recipe, ingredient) => Number(ingredient.amount || 1) * servingScale(recipe);
  const today = () => new Date(new Date().toDateString());
  const isoDay = (offset) => {
    const date = today();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  function formatAmount(value) {
    const rounded = Math.round(value * 100) / 100;
    if (Number.isInteger(rounded)) return String(rounded);
    return String(rounded).replace(/\.?0+$/, "");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  const recipeImageCache = new Map();

  function hashString(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = ((hash << 5) - hash) + value.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function recipeTheme(recipe) {
    const title = recipe.title.toLowerCase();
    const tags = recipe.tags.join(" ");
    if (title.includes("tuna")) return "tuna-pasta";
    if (title.includes("garlic chicken") || title.includes("chicken") && title.includes("pasta")) return "creamy-chicken";
    if (title.includes("chicken") && title.includes("wrap")) return "wraps";
    if (title.includes("chicken") && title.includes("soup")) return "soup";
    if (title.includes("chicken")) return "chicken-rice";
    if (title.includes("pizza")) return "pizza";
    if (title.includes("pancake")) return "pancakes";
    if (title.includes("potato")) return "potato";
    if (title.includes("shakshuka")) return "shakshuka";
    if (title.includes("fried rice") || tags.includes("rice bowl")) return "fried-rice";
    if (title.includes("curry")) return "curry";
    if (title.includes("noodle")) return "noodles";
    if (title.includes("omelette")) return "omelette";
    if (title.includes("soup") || title.includes("stew") || title.includes("minestrone")) return "soup";
    if (title.includes("quesadilla") || title.includes("wrap")) return "wraps";
    if (title.includes("oats")) return "oats";
    if (title.includes("pasta") || title.includes("bolognese")) return "pasta";
    return "pantry-bowl";
  }

  function garnish(seed) {
    const leaves = [
      [622, 146, -18], [682, 188, 22], [600, 248, 12], [720, 264, -28],
      [242, 138, 18], [192, 236, -14], [286, 300, 28]
    ];
    return leaves.map(([x, y, rotation], index) => {
      const offset = ((seed + index * 17) % 16) - 8;
      return `<ellipse cx="${x + offset}" cy="${y - offset}" rx="20" ry="8" fill="#2f8a5f" transform="rotate(${rotation} ${x} ${y})"/>`;
    }).join("");
  }

  function dishMarkup(theme, seed) {
    const tomato = `<circle cx="312" cy="190" r="22" fill="#d94b38"/><circle cx="564" cy="238" r="18" fill="#d94b38"/><circle cx="452" cy="314" r="20" fill="#f05f45"/>`;
    const herbs = garnish(seed);
    const pasta = `
      <g fill="none" stroke="#f3cf77" stroke-width="20" stroke-linecap="round">
        <path d="M246 244c70-72 156 54 230-18 56-54 110-16 170 26"/>
        <path d="M250 300c86-50 150 34 228-24 66-48 126-6 178 34"/>
        <path d="M300 188c70 38 134 28 198-12 70-44 124 8 168 42"/>
      </g>`;
    const chicken = `
      <g fill="#f2c08a" stroke="#a65d35" stroke-width="6" stroke-linecap="round">
        <path d="M388 194c50-34 126-18 154 34-22 36-106 42-156 8-20-14-18-30 2-42z"/>
        <path d="M472 286c54-30 118-8 144 38-30 30-106 34-148 2-18-14-16-30 4-40z"/>
        <path d="M298 272c42-28 100-14 126 28-24 28-88 32-122 6-18-12-18-24-4-34z"/>
      </g>`;
    const rice = `
      <g fill="#fff7df">
        ${Array.from({ length: 34 }, (_, index) => {
          const x = 250 + ((index * 47 + seed) % 330);
          const y = 172 + ((index * 31 + seed) % 160);
          return `<ellipse cx="${x}" cy="${y}" rx="13" ry="5" transform="rotate(${(index * 23) % 180} ${x} ${y})"/>`;
        }).join("")}
      </g>`;
    const curry = `<ellipse cx="450" cy="250" rx="260" ry="112" fill="#dd8b2f"/><ellipse cx="450" cy="236" rx="230" ry="82" fill="#f1b24d"/><circle cx="342" cy="232" r="24" fill="#f7d37b"/><circle cx="456" cy="274" r="20" fill="#8f5b2c"/><circle cx="548" cy="226" r="24" fill="#fff7df"/>`;
    const soup = `<ellipse cx="450" cy="248" rx="270" ry="118" fill="#c9503f"/><ellipse cx="450" cy="230" rx="238" ry="82" fill="#e86c45"/><circle cx="360" cy="232" r="18" fill="#f3cf77"/><circle cx="512" cy="260" r="22" fill="#fff7df"/><circle cx="592" cy="220" r="14" fill="#2f8a5f"/>`;
    const eggs = `<ellipse cx="380" cy="238" rx="58" ry="42" fill="#fffaf0"/><circle cx="386" cy="240" r="18" fill="#e0a529"/><ellipse cx="510" cy="250" rx="62" ry="44" fill="#fffaf0"/><circle cx="504" cy="248" r="18" fill="#e0a529"/>`;
    const wraps = `<path d="M268 178h340l-78 174H340z" fill="#f0c06a"/><path d="M318 208h248l-50 106H366z" fill="#fff7df"/><circle cx="386" cy="248" r="18" fill="#d94b38"/><rect x="424" y="224" width="108" height="22" rx="11" fill="#2f8a5f"/>`;
    const pizza = `<circle cx="450" cy="250" r="155" fill="#f1b24d"/><circle cx="450" cy="250" r="128" fill="#e2624f"/><g fill="#fff7df"><circle cx="386" cy="202" r="22"/><circle cx="514" cy="224" r="20"/><circle cx="430" cy="314" r="24"/></g><g fill="#2f8a5f"><circle cx="474" cy="184" r="13"/><circle cx="544" cy="298" r="12"/><circle cx="342" cy="282" r="12"/></g>`;
    const pancakes = `<ellipse cx="450" cy="308" rx="190" ry="58" fill="#c8863d"/><ellipse cx="450" cy="268" rx="174" ry="54" fill="#dfa751"/><ellipse cx="450" cy="232" rx="160" ry="50" fill="#efc06f"/><rect x="418" y="182" width="64" height="42" rx="8" fill="#e0a529"/>`;
    const potato = `<ellipse cx="382" cy="250" rx="108" ry="76" fill="#b8793e"/><ellipse cx="524" cy="250" rx="108" ry="76" fill="#c48645"/><path d="M324 246c50 36 110 36 164 0" stroke="#fff7df" stroke-width="20" stroke-linecap="round"/><path d="M464 246c50 36 110 36 164 0" stroke="#fff7df" stroke-width="20" stroke-linecap="round"/>`;
    const oats = `<ellipse cx="450" cy="250" rx="250" ry="112" fill="#ead6ad"/><circle cx="340" cy="232" r="28" fill="#d9a05b"/><circle cx="468" cy="284" r="22" fill="#f3cf77"/><circle cx="566" cy="226" r="26" fill="#fff7df"/>`;

    const themes = {
      "tuna-pasta": `${pasta}<g fill="#f7d6bd"><path d="M348 220l54 22-40 32-60-18z"/><path d="M536 258l58 20-36 34-62-16z"/></g>${tomato}${herbs}`,
      "creamy-chicken": `<ellipse cx="450" cy="250" rx="262" ry="116" fill="#fff4cf"/>${pasta}${chicken}${herbs}`,
      "chicken-rice": `${rice}${chicken}<circle cx="342" cy="292" r="18" fill="#d94b38"/>${herbs}`,
      "fried-rice": `${rice}<rect x="330" y="214" width="60" height="28" rx="10" fill="#e0a529"/><circle cx="512" cy="236" r="20" fill="#2f8a5f"/>${eggs}${herbs}`,
      curry,
      soup,
      shakshuka: `<ellipse cx="450" cy="250" rx="252" ry="112" fill="#b84034"/><ellipse cx="450" cy="234" rx="222" ry="80" fill="#e2624f"/>${eggs}${herbs}`,
      noodles: `<g fill="none" stroke="#f3cf77" stroke-width="18" stroke-linecap="round">${Array.from({ length: 7 }, (_, index) => `<path d="M${250 + index * 38} ${210 + (index % 2) * 28}c54-42 92 48 148 2s96-26 144 18"/>`).join("")}</g><circle cx="346" cy="286" r="18" fill="#d94b38"/>${herbs}`,
      wraps,
      pizza,
      pancakes,
      potato,
      omelette: `<ellipse cx="450" cy="250" rx="240" ry="104" fill="#e0a529"/><ellipse cx="450" cy="232" rx="206" ry="70" fill="#f3cf77"/>${herbs}<circle cx="540" cy="264" r="18" fill="#fff7df"/>`,
      oats,
      pasta: `${pasta}${tomato}${herbs}`,
      "pantry-bowl": `${rice}${tomato}${herbs}<circle cx="506" cy="250" r="24" fill="#f3cf77"/>`
    };
    return themes[theme] || themes["pantry-bowl"];
  }

  function recipeImageSrc(recipe) {
    if (recipeImageCache.has(recipe.id)) return recipeImageCache.get(recipe.id);
    const seed = hashString(recipe.title);
    const bg = [
      ["#704324", "#d8a15e"],
      ["#533b2f", "#bf8f54"],
      ["#213f35", "#7ca86a"],
      ["#402f3d", "#b57562"]
    ][seed % 4];
    const theme = recipeTheme(recipe);
    const id = `dish${seed}`;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="${escapeHtml(recipe.title)}">
        <defs>
          <linearGradient id="${id}-table" x1="0" x2="1" y1="0" y2="1">
            <stop stop-color="${bg[0]}"/>
            <stop offset="1" stop-color="${bg[1]}"/>
          </linearGradient>
          <radialGradient id="${id}-shine" cx="36%" cy="24%" r="48%">
            <stop stop-color="#ffffff" stop-opacity="0.52"/>
            <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#120c08" flood-opacity="0.28"/>
          </filter>
        </defs>
        <rect width="900" height="520" fill="url(#${id}-table)"/>
        <g opacity="0.14" fill="#fff7df">
          <rect x="0" y="82" width="900" height="7"/>
          <rect x="0" y="262" width="900" height="6"/>
          <rect x="0" y="410" width="900" height="8"/>
        </g>
        <circle cx="210" cy="120" r="86" fill="url(#${id}-shine)"/>
        <g filter="url(#${id}-shadow)">
          <ellipse cx="450" cy="284" rx="330" ry="150" fill="#f8f2df"/>
          <ellipse cx="450" cy="254" rx="292" ry="126" fill="#e8dfc8"/>
          ${dishMarkup(theme, seed)}
        </g>
      </svg>
    `.replace(/\s+/g, " ").trim();
    const src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    recipeImageCache.set(recipe.id, src);
    return src;
  }

  function catalogRecord(name) {
    return scanCatalog.find(([itemName]) => itemName.toLowerCase() === name.toLowerCase()) || scanCatalog[0];
  }

  function draftFromName(name, locationOverride = "") {
    const [itemName, location, category, unit, quantity, price, expiryDays] = catalogRecord(name);
    const scanLocation = locationOverride || location;
    return {
      id: uid(),
      selected: true,
      name: itemName,
      quantity,
      unit,
      location: scanLocation,
      category,
      section: category,
      price,
      expiryDate: isoDay(expiryDays),
      notes: "Added from kitchen scan"
    };
  }

  function findCatalogNames(text) {
    const haystack = text.toLowerCase();
    return [...new Set(scanCatalog
      .map(([name]) => name)
      .filter((name) => haystack.includes(name.toLowerCase()) || haystack.includes(name.toLowerCase().replace(/\s+/g, ""))))];
  }

  function buildScanDrafts(type, location, fileName, extractedText = "") {
    const matched = findCatalogNames(`${fileName} ${extractedText}`);
    const fallbackKey = type === "kitchen" ? location : type;
    const names = matched.length ? matched : (scanDefaults[fallbackKey] || scanDefaults.receipt);
    return names.slice(0, 10).map((name) => draftFromName(name, type === "kitchen" ? location : ""));
  }

  function renderScanDrafts() {
    const list = $("#scanReviewList");
    $("#scanDraftTitle").textContent = state.scanDrafts.length
      ? `${state.scanDrafts.length} suggested item${state.scanDrafts.length === 1 ? "" : "s"} from ${state.scanSource}`
      : "Waiting for scan";
    list.innerHTML = state.scanDrafts.map((draft) => `
      <article class="scan-row" data-scan-row="${draft.id}">
        <input type="checkbox" ${draft.selected ? "checked" : ""} data-scan-field="selected" aria-label="Use ${draft.name}" />
        <label>Item<input value="${escapeHtml(draft.name)}" data-scan-field="name" /></label>
        <label>Qty<input type="number" min="0" step="0.1" value="${draft.quantity}" data-scan-field="quantity" /></label>
        <label>Unit<input value="${escapeHtml(draft.unit)}" data-scan-field="unit" /></label>
        <label>Location<select data-scan-field="location">${storageAreas.map((area) => `<option value="${area.id}" ${area.id === draft.location ? "selected" : ""}>${area.name}</option>`).join("")}</select></label>
      </article>
    `).join("") || `<article class="scan-row"><strong>No suggestions yet</strong><span>Upload a photo, receipt image, or PDF invoice first.</span></article>`;
  }

  function syncScanDraftFromInput(input) {
    const row = input.closest("[data-scan-row]");
    if (!row) return;
    const draft = state.scanDrafts.find((item) => item.id === row.dataset.scanRow);
    if (!draft) return;
    const field = input.dataset.scanField;
    draft[field] = field === "selected" ? input.checked : field === "quantity" ? Number(input.value || 0) : input.value;
  }

  async function readPdfText(file) {
    const buffer = await file.arrayBuffer();
    return new TextDecoder("latin1").decode(buffer).replace(/[^\x20-\x7E]+/g, " ");
  }

  async function handleScanFile(file, source) {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const type = source === "document" ? $("#documentTypeSelect").value : "kitchen";
    const location = $("#scanLocationSelect").value || state.selectedStorage;
    let extractedText = "";
    let preview = `<strong>${escapeHtml(file.name)}</strong><p>${isPdf ? "PDF invoice loaded for text matching." : "Image loaded for scan review."}</p>`;

    if (isPdf) {
      extractedText = await readPdfText(file);
    } else {
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      preview = `<img src="${dataUrl}" alt="Scan preview" /><strong>${escapeHtml(file.name)}</strong><p>Review the suggested items below before saving.</p>`;
    }

    state.scanSource = type === "kitchen" ? areaById(location).name : type === "invoice" ? "PDF invoice" : "receipt image";
    state.scanDrafts = buildScanDrafts(type, location, file.name, extractedText);
    $("#scanPreview").innerHTML = preview;
    renderScanDrafts();
  }

  async function addScanDraftsToInventory() {
    const selected = state.scanDrafts.filter((draft) => draft.selected && draft.name.trim());
    await Promise.all(selected.map((draft) => dbPut("groceries", {
      id: uid(),
      userEmail: state.user.email,
      name: draft.name.trim(),
      category: draft.category || "Scanned",
      quantity: Number(draft.quantity || 1),
      unit: draft.unit || "item",
      location: draft.location || state.selectedStorage,
      section: draft.section || draft.category || "Scanned",
      expiryDate: draft.expiryDate || isoDay(14),
      purchaseDate: isoDay(0),
      price: Number(draft.price || 0),
      status: "Good",
      notes: draft.notes,
      barcode: "",
      image: ""
    })));
    await loadUserData();
    if (selected[0]) state.selectedStorage = selected[0].location;
    render();
  }

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

  function setPreviewMode(mode) {
    state.previewMode = mode === "mobile" ? "mobile" : "web";
    document.body.classList.toggle("preview-mobile", state.previewMode === "mobile");
    $$("[data-preview-mode]").forEach((button) => button.classList.toggle("active", button.dataset.previewMode === state.previewMode));
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

  function renderWheelOptions() {
    $("#dinnerWheel").innerHTML = wheelOptions.map((label, index) => `<span style="--i:${index}">${label}</span>`).join("");
  }

  function renderServingControl() {
    const select = $("#servingSelect");
    if (select && Number(select.value) !== state.servings) select.value = String(state.servings);
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
        <p>Scaled for ${state.servings} ${state.servings === 1 ? "person" : "people"} at ${currency.format(scaledCost(best.recipe))} total. Uses ${best.status.owned.slice(0, 4).join(", ") || "your pantry"}${best.status.missing.length ? `. Need to buy: ${best.status.missing.join(", ")}.` : ". No shopping needed."}</p>
      </div>
      <img class="spotlight-photo" src="${recipeImageSrc(best.recipe)}" alt="${escapeHtml(best.recipe.title)}" />
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
        <img class="recipe-photo" src="${recipeImageSrc(recipe)}" alt="${escapeHtml(recipe.title)}" loading="lazy" />
        <header>
          <div>
            <strong>${recipe.title}</strong>
            <p class="record-label">${currency.format(scaledCost(recipe))} total | ${currency.format(scaledCost(recipe) / state.servings)} per person | serves ${state.servings}</p>
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
      return `<article class="prep-day"><h3>${day}</h3><div class="prep-meal"><strong>${pick?.title || "Open slot"}</strong><span>${pick ? `${pick.time} min | ${currency.format(scaledCost(pick))} | serves ${state.servings}` : "Plan a meal"}</span></div><button class="small-action" type="button" data-plan-day="${day}">Swap meal</button></article>`;
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
    renderWheelOptions();
    renderServingControl();
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
    $("#cookMeta").innerHTML = `<span>${recipe.time} min</span><span>${currency.format(scaledCost(recipe))} for ${state.servings}</span><span>${recipe.difficulty}</span><span>${recipe.leftover}</span>`;
    $("#cookIngredients").innerHTML = recipe.ingredients.map((ingredient) => {
      const owned = Boolean(findOwnedIngredient(ingredient.name));
      return `<label><input type="checkbox" ${owned ? "checked" : ""} /> ${formatAmount(scaledAmount(recipe, ingredient))} ${ingredient.unit} ${ingredient.name}</label>`;
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
      const amount = sameUnit ? scaledAmount(recipe, ingredient) : Math.min(Number(item.quantity || 0), Math.max(1, servingScale(recipe)));
      item.quantity = Math.max(0, Number(item.quantity || 0) - amount);
      await dbPut("groceries", item);
    }
    await dbPut("containers", {
      id: uid(),
      userEmail: state.user.email,
      name: `${recipe.title} leftovers`,
      portions: recipe.leftover.toLowerCase().includes("none") ? 1 : Math.max(1, Math.round(state.servings / 2)),
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
    if (button.dataset.previewMode) {
      setPreviewMode(button.dataset.previewMode);
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
    if (button.matches("[data-open-scan]")) {
      state.scanDrafts = [];
      state.scanSource = "";
      $("#scanPreview").innerHTML = "<strong>No scan selected yet.</strong><p>Choose a photo, receipt, or PDF invoice to generate a review list.</p>";
      renderScanDrafts();
      openDialog($("#scanDialog"));
      return;
    }
    if (button.matches("[data-close-scan]")) {
      closeDialog($("#scanDialog"));
      return;
    }
    if (button.matches("[data-clear-scan]")) {
      state.scanDrafts = [];
      state.scanSource = "";
      $("#kitchenPhotoInput").value = "";
      $("#receiptFileInput").value = "";
      $("#scanPreview").innerHTML = "<strong>No scan selected yet.</strong><p>Choose a photo, receipt, or PDF invoice to generate a review list.</p>";
      renderScanDrafts();
      return;
    }
    if (button.matches("[data-confirm-scan]")) {
      await addScanDraftsToInventory();
      closeDialog($("#scanDialog"));
      return;
    }
    if (button.matches("[data-scan-to-shopping]")) {
      const selected = state.scanDrafts.filter((draft) => draft.selected && draft.name.trim());
      await Promise.all(selected.map((draft) => addShoppingItem({
        name: draft.name.trim(),
        quantity: `${draft.quantity || 1} ${draft.unit || "item"}`,
        reason: `From ${state.scanSource || "scan"}`,
        priority: "medium",
        estimatedPrice: draft.price || 20
      })));
      await loadUserData();
      closeDialog($("#scanDialog"));
      setView("shopping");
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
      await Promise.all(status.missing.map((name) => addShoppingItem({ name, quantity: state.servings > 2 ? `${formatAmount(servingScale(recipe))}x` : "1", reason: `${recipe.title} for ${state.servings}`, priority: status.missing.length === 1 ? "medium" : "low", estimatedPrice: 24 })));
      await loadUserData();
      setView("shopping");
      return;
    }
    if (button.dataset.planRecipe) {
      const recipe = recipes.find((row) => row.id === button.dataset.planRecipe);
      await dbPut("containers", { id: uid(), userEmail: state.user.email, name: `${recipe.title} prep`, portions: state.servings, location: "Meal plan", eatBy: isoDay(5), notes: `Planned for ${state.servings}` });
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
      const chosenIndex = Math.floor(Math.random() * wheelOptions.length);
      const chosen = wheelOptions[chosenIndex];
      const segment = 360 / wheelOptions.length;
      state.wheelRotation += 720 + (360 - chosenIndex * segment) + Math.floor(Math.random() * segment);
      $("#dinnerWheel").style.transform = `rotate(${state.wheelRotation}deg)`;
      $("#wheelResult").textContent = `${chosen} for ${state.servings}`;
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
      await dbPut("containers", { id: uid(), userEmail: state.user.email, name: `${state.currentRecipe.title} leftovers`, portions: Math.max(1, Math.round(state.servings / 2)), location: "Fridge", eatBy: isoDay(2), notes: `Saved from cooking mode for ${state.servings}` });
      await loadUserData();
      renderMealPrep();
      return;
    }
    if (button.dataset.timer) {
      startTimer(Number(button.dataset.timer));
    }
  }

  async function handleChange(event) {
    if (event.target.matches("[data-scan-file]")) {
      await handleScanFile(event.target.files?.[0], event.target.dataset.scanFile);
      return;
    }
    if (event.target.matches("[data-scan-field]")) {
      syncScanDraftFromInput(event.target);
      return;
    }
    if (event.target.id === "servingSelect") {
      state.servings = Number(event.target.value || 2);
      renderRecipeSpotlight();
      renderRecipes();
      renderMealPrep();
      renderHomeMetrics();
      return;
    }
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
    $("#scanLocationSelect").innerHTML = storageAreas
      .filter((area) => area.id !== "cleaning")
      .map((area) => `<option value="${area.id}">${area.name}</option>`)
      .join("");

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
    setPreviewMode("web");
    render();
  }

  init().catch((error) => {
    console.error(error);
    document.body.insertAdjacentHTML("afterbegin", `<div style="padding:1rem;background:#ffe8e3;color:#8f342a;font-weight:800">Cupboard Companion could not start: ${error.message}</div>`);
  });
})();
