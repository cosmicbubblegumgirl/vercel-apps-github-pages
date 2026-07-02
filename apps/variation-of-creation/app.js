(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const page = document.body.dataset.page || "home";
  const db = window.SEFIRAH_DB;

  const sourceUrl = "https://lordofthemysteries.fandom.com/wiki/Pathways";

  const pathwayGroups = [
    "Lord of Mysteries",
    "God Almighty",
    "Eternal Darkness",
    "Calamity of Destruction",
    "Demon of Knowledge",
    "Key of Light",
    "Goddess of Origin",
    "Father of Devils",
    "The Anarchy",
    "Outer Deity"
  ];

  const pathways = [
    makePath("fool", "Fool", "Lord of Mysteries", "Standard", "mask", "Performer of impossible exits", ["improvising", "nerve", "stagecraft"], "You keep moving when the plan changes. What looks like luck is often timing, nerve, and a good sense of theatre.", "overplaying the bit", "smoke-threaded tarot mask", "The spotlight is safest when you know where the trapdoor is."),
    makePath("error", "Error", "Lord of Mysteries", "Standard", "glitch", "Loophole hunter", ["wit", "adaptation", "pattern-breaking"], "You notice the weak point in a system before anyone else has admitted the system is wobbling.", "testing every lock", "silver monocle charm", "A rule is only scary until you find its typo."),
    makePath("door", "Door", "Lord of Mysteries", "Standard", "door", "Distance breaker", ["travel", "curiosity", "escape routes"], "You are built for thresholds: new cities, strange rooms, forbidden tabs, and plans with emergency exits.", "leaving too early", "brass key on black ribbon", "Some people open doors. You negotiate with them."),
    makePath("visionary", "Visionary", "God Almighty", "Standard", "eye", "Dream architect", ["empathy", "symbolism", "deep focus"], "You treat dreams like blueprints and feelings like weather maps. The invisible does not stay invisible for long.", "living inside the draft", "oneiric glass lens", "Reality first arrives as a sketch behind your eyes."),
    makePath("sun", "Sun", "God Almighty", "Standard", "sun", "Bright oath keeper", ["clarity", "courage", "morale"], "You bring warmth into grim rooms, but your kindness has a spine and a steady light.", "assuming honesty wins fast", "sun-forged candle pin", "If the room is dark, bring a light that lasts."),
    makePath("tyrant", "Tyrant", "God Almighty", "Standard", "storm", "Storm captain", ["force", "momentum", "command"], "You prefer decisive weather. When the pressure drops, you become the thunder people remember.", "pushing past nuance", "storm bell gauntlet", "Sometimes the answer is a wave. Sometimes it is you."),
    makePath("white-tower", "White Tower", "God Almighty", "Standard", "tower", "System scholar", ["analysis", "memory", "teaching"], "You build ladders out of facts and climb them until the view starts making sense.", "turning life into footnotes", "ivory tower bookmark", "Understanding is a staircase with more steps than expected."),
    makePath("hanged-man", "Hanged Man", "God Almighty", "Standard", "chain", "Shadow theologian", ["sacrifice", "endurance", "paradox"], "You can hold contradictions without dropping them, which makes you unsettlingly good in moral fog.", "romanticizing burden", "black prayer-chain", "Even the abyss has grammar if you listen carefully."),
    makePath("darkness", "Darkness", "Eternal Darkness", "Standard", "moon", "Nocturne keeper", ["rest", "mystery", "quiet control"], "You know the value of silence, recovery, hidden rooms, and letting a question sleep before answering.", "vanishing instead of resting", "velvet moon vial", "Night is not absence. It is a different library."),
    makePath("death", "Death", "Eternal Darkness", "Standard", "skull", "Threshold mourner", ["closure", "courage", "transformation"], "You do not flinch from endings. You know how to close a chapter without pretending it did not matter.", "mistaking endings for identity", "bone-white hourglass", "Every ending leaves a doorframe behind."),
    makePath("twilight-giant", "Twilight Giant", "Eternal Darkness", "Standard", "giant", "Last-light sentinel", ["stamina", "duty", "protection"], "You are built for long watches, difficult promises, and standing firm when the sky changes color.", "carrying too much alone", "amber shield sigil", "Hold the line, but let someone hold the lantern."),
    makePath("demoness", "Demoness", "Calamity of Destruction", "Standard", "thorn", "Glamour disaster poet", ["magnetism", "tactics", "reinvention"], "You understand charm as a blade, beauty as misdirection, and reinvention as survival art.", "making drama useful too often", "crimson thorn fan", "A little danger can be couture if you tailor it well."),
    makePath("red-priest", "Red Priest", "Calamity of Destruction", "Standard", "flame", "War-table spark", ["strategy", "heat", "rallying"], "You turn a room from anxious to mobilized. Plans wake up when you start pacing.", "confusing urgency with truth", "ember-stained battle card", "Every revolution begins as a badly timed meeting."),
    makePath("hermit", "Hermit", "Demon of Knowledge", "Standard", "book", "Hidden librarian", ["research", "privacy", "occult craft"], "You collect marginal notes, careful sources, and theories that need time before they are ready to be shared.", "hoarding insight", "sealed grimoire page", "The best secrets prefer a quiet desk."),
    makePath("paragon", "Paragon", "Demon of Knowledge", "Standard", "gear", "Impossible maker", ["engineering", "precision", "invention"], "You can make elegance out of scrap, spreadsheets, stubbornness, and one tool nobody else understands.", "over-optimizing the soul", "brass automaton key", "If the miracle breaks, improve the hinge."),
    makePath("wheel-of-fortune", "Wheel of Fortune", "Key of Light", "Standard", "wheel", "Probability gambler", ["timing", "luck", "risk reading"], "You feel when the room is about to turn. Your gift is less luck than timing, nerve, and attention.", "trusting omens too much", "gold probability coin", "Fate shuffles. You still watch the dealer."),
    makePath("mother", "Mother", "Goddess of Origin", "Standard", "vine", "Life gardener", ["care", "growth", "repair"], "You notice what needs water, space, protection, or a firmer boundary disguised as compassion.", "over-nurturing chaos", "greenhouse reliquary", "Growth is not soft. It cracks stone."),
    makePath("moon", "Moon", "Goddess of Origin", "Standard", "crescent", "Tide listener", ["intuition", "cycles", "medicine"], "You read moods, seasons, cravings, and quiet changes before they have names.", "absorbing every tide", "lunar apothecary spoon", "Your instincts speak in moonlight and symptoms."),
    makePath("abyss", "Abyss", "Father of Devils", "Standard", "abyss", "Depth diver", ["intensity", "survival", "forbidden honesty"], "You can stare directly at the uncomfortable thing and still ask what it is trying to teach.", "testing the edge", "black mirror shard", "Depth is dangerous, but denial is louder."),
    makePath("chained", "Chained", "Father of Devils", "Standard", "lock", "Bound power", ["restraint", "will", "containment"], "You know that self-control is not boring. It is a locked room with weather inside.", "holding pain too tightly", "iron restraint ring", "Power learns manners when you name its leash."),
    makePath("black-emperor", "Black Emperor", "The Anarchy", "Standard", "crown", "Rule breaker sovereign", ["ambition", "authority", "subversion"], "You can read hierarchy like a menu and somehow order the forbidden item with confidence.", "turning every room into a chessboard", "obsidian crown seal", "A throne is just a chair with consequences."),
    makePath("justiciar", "Justiciar", "The Anarchy", "Standard", "scale", "Lawblade witness", ["fairness", "judgment", "accountability"], "You have a courtroom in your chest and it keeps excellent records.", "rigidity in a storm", "gold-edged verdict card", "Mercy and justice both need clean hands."),
    makePath("circle-of-inevitability", "Circle of Inevitability", "Outer Deity", "Non-standard", "ring", "Loop prophet", ["cycles", "omens", "recursion"], "You catch patterns returning with new costumes and old intentions.", "calling every coincidence destiny", "recursive clock ring", "The circle closes. You bring receipts."),
    makePath("dancer", "Dancer", "Outer Deity", "Non-standard", "step", "Ritual mover", ["rhythm", "embodiment", "timing"], "Your instincts arrive through motion first and explanation later.", "performing through exhaustion", "silver step charm", "The body knows a prophecy before the mouth does."),
    makePath("villain", "Villain", "Outer Deity", "Non-standard", "blade", "Narrative antagonist", ["nerve", "provocation", "strategy"], "You understand that pressure reveals characters, including your own.", "becoming the lesson too often", "ink-black dagger bookmark", "A good plot twist still needs manners."),
    makePath("scrooge", "Scrooge", "Outer Deity", "Non-standard", "coin", "Hoarded leverage", ["resourcefulness", "bargaining", "defense"], "You track value, debts, exits, and the emotional cost of every bargain.", "mistaking scarcity for safety", "cold coin ledger", "Never spend your soul at retail price."),
    makePath("sinner", "Sinner", "Outer Deity", "Non-standard", "scar", "Confession engine", ["honesty", "contrition", "edge wisdom"], "You know where the ugly truths are buried, including the ones that can become compost.", "living as your worst chapter", "red wax confession seal", "A stain can become a map if you stop worshipping it."),
    makePath("lawyer", "Lawyer", "Outer Deity", "Non-standard", "quill", "Contract spider", ["argument", "contracts", "social reading"], "You can hear the loophole breathing before anyone signs the paper.", "winning arguments that need healing", "ink quill contract", "Fine print is a haunted forest."),
    makePath("painter", "Painter", "Outer Deity", "Non-standard", "brush", "Reality colorist", ["imagery", "mood", "aesthetic force"], "You alter the emotional weather by changing the frame, the color, or the myth.", "making beauty do all the talking", "violet pigment knife", "Paint the omen until it confesses."),
    makePath("homunculus", "Homunculus", "Outer Deity", "Non-standard", "vessel", "Tiny lab miracle", ["experimentation", "identity", "adaptation"], "You rebuild yourself in clever little versions until one finally fits the room.", "treating yourself like a prototype", "glass vessel heart", "Even the small creation can haunt the cathedral."),
    makePath("chaos-mist", "Chaos Mist", "Outer Deity", "Non-standard", "mist", "Fog mathematician", ["entropy", "ambiguity", "weird calm"], "You function well when the map dissolves. Ambiguity does not scare you as much as false certainty does.", "letting ambiguity become avoidance", "mist-stained prism", "When the fog arrives, become the compass."),
    makePath("calamity", "Calamity", "Outer Deity", "Non-standard", "meteor", "Beautiful problem", ["disruption", "rebirth", "impact"], "You are the kind of change that arrives with sound effects and an exit strategy.", "confusing impact with purpose", "fractured star medal", "Not every explosion is a message, but yours often is.")
  ];

  const quizQuestions = [
    {
      q: "When the room turns strange, what do you do first?",
      choices: [
        choice("Act calm long enough for a plan to form.", { fool: 4, redPriest: 2, demoness: 1 }),
        choice("Look for the hidden rule everyone missed.", { error: 4, lawyer: 2, whiteTower: 2 }),
        choice("Find the exit, the spare exit, and the route nobody checked.", { door: 4, chaosMist: 1, wheelOfFortune: 2 }),
        choice("Ask who is being protected and why.", { justiciar: 3, mother: 2, twilightGiant: 2 })
      ]
    },
    {
      q: "Pick the knowledge that keeps pulling you back.",
      choices: [
        choice("Dream symbolism, memory, and the meaning behind images.", { visionary: 4, moon: 2, painter: 2 }),
        choice("Engineering notes with scorch marks.", { paragon: 4, hermit: 2, homunculus: 2 }),
        choice("Old laws, loopholes, and careful contracts.", { justiciar: 3, blackEmperor: 2, lawyer: 3 }),
        choice("Ritual history and the parts people leave out.", { hermit: 4, hangedMan: 2, abyss: 2 })
      ]
    },
    {
      q: "Your emotional weather is usually...",
      choices: [
        choice("A candlelit library during a storm.", { darkness: 3, hermit: 3, whiteTower: 2 }),
        choice("Sunlight through stained glass, with receipts.", { sun: 4, justiciar: 2, mother: 1 }),
        choice("Magnetic, intense, and better dressed than expected.", { demoness: 4, blackEmperor: 2, villain: 2 }),
        choice("Tidal, intuitive, and quietly accurate.", { moon: 4, visionary: 2, circleOfInevitability: 2 })
      ]
    },
    {
      q: "Choose a magical workspace.",
      choices: [
        choice("Clockwork desk, scattered lenses, one humming machine.", { paragon: 4, whiteTower: 2, homunculus: 2 }),
        choice("Balcony over fog, doors labelled with impossible cities.", { door: 4, fool: 2, chaosMist: 1 }),
        choice("Greenhouse apothecary with moonwater labels.", { mother: 3, moon: 3, painter: 1 }),
        choice("War table, red thread, pins, and a very persuasive kettle.", { redPriest: 4, tyrant: 2, blackEmperor: 2 })
      ]
    },
    {
      q: "Your hidden strength is probably...",
      choices: [
        choice("Keeping calm while everyone else names the disaster.", { darkness: 3, twilightGiant: 3, chained: 2 }),
        choice("Seeing the pattern before it has a name.", { visionary: 3, wheelOfFortune: 3, whiteTower: 2 }),
        choice("Turning scraps into a working miracle.", { paragon: 4, homunculus: 2, hermit: 1 }),
        choice("Making people move when the plan matters.", { tyrant: 3, redPriest: 3, sun: 2 })
      ]
    },
    {
      q: "What flaw gets you into trouble?",
      choices: [
        choice("I keep opening doors just because they are there.", { door: 3, abyss: 2, fool: 2 }),
        choice("I can turn an argument into a full production.", { lawyer: 3, demoness: 2, blackEmperor: 2 }),
        choice("I carry burdens like they prove I care.", { hangedMan: 3, chained: 3, twilightGiant: 2 }),
        choice("I overthink until the answer needs a chair.", { whiteTower: 4, hermit: 2, visionary: 1 })
      ]
    },
    {
      q: "In a team, what role do you become?",
      choices: [
        choice("The person with the plan, backup plan, and legal footnote.", { justiciar: 3, lawyer: 3, whiteTower: 2 }),
        choice("The spark that gets everybody moving.", { redPriest: 3, sun: 3, tyrant: 2 }),
        choice("The quiet specialist everyone underestimates.", { hermit: 3, darkness: 2, chained: 2 }),
        choice("The wildcard who saves the day and refuses to overexplain.", { fool: 3, error: 3, wheelOfFortune: 2 })
      ]
    },
    {
      q: "Which sentence sounds most like you?",
      choices: [
        choice("The system is broken, so I brought tools.", { paragon: 4, blackEmperor: 2, error: 1 }),
        choice("The dream was not subtle, but it was useful.", { visionary: 3, painter: 3, moon: 2 }),
        choice("If fate writes the first draft, I still want edit rights.", { wheelOfFortune: 3, fool: 2, circleOfInevitability: 2 }),
        choice("I am not angry. I am accurately calibrated.", { justiciar: 3, tyrant: 2, redPriest: 2 })
      ]
    },
    {
      q: "What power would you trust yourself with?",
      choices: [
        choice("Travel, portals, and well-timed entrances.", { door: 4, fool: 2, chaosMist: 1 }),
        choice("Healing, growth, and knowing when to prune.", { mother: 4, moon: 2, sun: 1 }),
        choice("Authority that can rewrite the rules.", { blackEmperor: 3, justiciar: 3, tyrant: 2 }),
        choice("Secrets, research, and the locked cabinet.", { hermit: 4, hangedMan: 2, abyss: 2 })
      ]
    },
    {
      q: "How do you handle pressure?",
      choices: [
        choice("I become sharper, louder, and very scheduled.", { redPriest: 3, tyrant: 3, justiciar: 1 }),
        choice("I go quiet and start connecting impossible dots.", { darkness: 2, visionary: 3, whiteTower: 2 }),
        choice("I improvise so fast it looks planned.", { fool: 3, error: 3, wheelOfFortune: 2 }),
        choice("I turn it into fuel, art, or a better boundary.", { death: 3, moon: 2, painter: 2 })
      ]
    },
    {
      q: "What are you quietly building toward?",
      choices: [
        choice("A future version of me with better tools.", { paragon: 3, homunculus: 3, sun: 1 }),
        choice("A private library of answers nobody can dismiss.", { hermit: 3, whiteTower: 3, visionary: 1 }),
        choice("Freedom from rooms that were too small.", { door: 3, blackEmperor: 2, fool: 2 }),
        choice("A circle finally broken, named, or survived.", { circleOfInevitability: 3, death: 3, chained: 2 })
      ]
    },
    {
      q: "Choose your symbol.",
      choices: [
        choice("Key", { door: 3, error: 2, lawyer: 1 }),
        choice("Eye", { visionary: 3, fool: 2, whiteTower: 1 }),
        choice("Flame", { redPriest: 3, sun: 2, calamity: 1 }),
        choice("Clock", { wheelOfFortune: 3, circleOfInevitability: 2, paragon: 1 })
      ]
    },
    {
      q: "A stranger offers you a potion. You...",
      choices: [
        choice("Ask for the ingredient list and side-effect chart.", { whiteTower: 3, hermit: 2, paragon: 2 }),
        choice("Check whether the bottle feels wrong.", { moon: 2, abyss: 2, visionary: 2 }),
        choice("Make them explain the terms first.", { justiciar: 2, blackEmperor: 2, lawyer: 2 }),
        choice("Drink it only if the timing and the label both check out.", { fool: 3, wheelOfFortune: 2, demoness: 1 })
      ]
    },
    {
      q: "Your preferred aesthetic is...",
      choices: [
        choice("Grey fog, antique brass, long coat energy.", { fool: 2, door: 2, blackEmperor: 2 }),
        choice("Moonlit apothecary with velvet labels.", { moon: 3, mother: 2, darkness: 2 }),
        choice("Red thread, war room, candle wax, strong opinions.", { redPriest: 3, tyrant: 2, demoness: 1 }),
        choice("Library tower, clean margins, forbidden appendix.", { whiteTower: 3, hermit: 3, hangedMan: 1 })
      ]
    },
    {
      q: "When someone underestimates you, what happens?",
      choices: [
        choice("They discover the quiet part had a strategy.", { darkness: 2, chained: 2, hermit: 2 }),
        choice("They become part of the lesson plan.", { justiciar: 3, sun: 2, tyrant: 1 }),
        choice("They lose track of which version of me they met.", { fool: 3, error: 2, demoness: 2 }),
        choice("They get a prototype, a chart, and a sharper question.", { paragon: 3, whiteTower: 2, homunculus: 2 })
      ]
    },
    {
      q: "What kind of friend are you when things get messy?",
      choices: [
        choice("The one who stays calm and makes tea before the hard talk.", { darkness: 3, mother: 2, twilightGiant: 2 }),
        choice("The one who says the uncomfortable truth clearly.", { justiciar: 3, sun: 2, sinner: 2 }),
        choice("The one who finds a practical fix and starts building it.", { paragon: 3, hermit: 2, whiteTower: 2 }),
        choice("The one who makes everyone laugh just enough to breathe.", { fool: 3, error: 2, dancer: 2 })
      ]
    },
    {
      q: "Choose the object you would keep in your coat pocket.",
      choices: [
        choice("A folded contract with one line underlined.", { lawyer: 3, blackEmperor: 2, justiciar: 2 }),
        choice("A glass vial labelled only with a date.", { moon: 3, mother: 2, death: 2 }),
        choice("A chipped gear from a machine that should not work.", { paragon: 3, homunculus: 2, hermit: 2 }),
        choice("A coin you never spend because it keeps landing upright.", { wheelOfFortune: 3, scrooge: 2, circleOfInevitability: 2 })
      ]
    },
    {
      q: "How do you decide whether to trust someone?",
      choices: [
        choice("I watch what they do when nobody benefits.", { justiciar: 3, sun: 2, twilightGiant: 2 }),
        choice("I listen for the part of the story they avoid.", { abyss: 3, sinner: 2, visionary: 2 }),
        choice("I check whether their promises survive detail.", { lawyer: 3, whiteTower: 2, blackEmperor: 2 }),
        choice("I give them one small door and see how they use it.", { door: 3, fool: 2, error: 2 })
      ]
    },
    {
      q: "Pick a scene that feels like home.",
      choices: [
        choice("A quiet archive with one lamp still on.", { hermit: 3, whiteTower: 2, darkness: 2 }),
        choice("A greenhouse after rain, all glass and green light.", { mother: 3, moon: 2, painter: 2 }),
        choice("A ship deck before a storm breaks.", { tyrant: 3, redPriest: 2, calamity: 2 }),
        choice("A theatre corridor where every door leads somewhere else.", { fool: 3, door: 3, dancer: 1 })
      ]
    },
    {
      q: "What kind of mistake teaches you fastest?",
      choices: [
        choice("A broken build, a burnt wire, or a tool that jams.", { paragon: 3, homunculus: 2, whiteTower: 2 }),
        choice("Trusting the wrong pattern and having to redraw it.", { visionary: 3, wheelOfFortune: 2, circleOfInevitability: 2 }),
        choice("Speaking too softly when the moment needed a line.", { justiciar: 3, redPriest: 2, sun: 2 }),
        choice("Walking too close to the edge just to understand it.", { abyss: 3, chained: 2, sinner: 2 })
      ]
    },
    {
      q: "What do you do with power?",
      choices: [
        choice("Measure it, name it, and set rules around it.", { chained: 3, justiciar: 2, whiteTower: 2 }),
        choice("Use it to protect people who are being cornered.", { twilightGiant: 3, sun: 2, mother: 2 }),
        choice("Test it until I know what it can and cannot do.", { paragon: 3, error: 2, abyss: 2 }),
        choice("Keep it quiet until the right moment.", { darkness: 3, blackEmperor: 2, demoness: 2 })
      ]
    },
    {
      q: "Your notes app is mostly full of...",
      choices: [
        choice("Research fragments, source links, and careful questions.", { hermit: 3, whiteTower: 3, paragon: 1 }),
        choice("Dreams, images, names, and half-finished symbols.", { visionary: 3, painter: 3, moon: 1 }),
        choice("Plans, counters, costs, and reminders to negotiate.", { scrooge: 3, lawyer: 2, blackEmperor: 2 }),
        choice("Lines I wanted to say but saved for later.", { demoness: 2, villain: 2, redPriest: 2 })
      ]
    },
    {
      q: "How do you handle a rule that feels wrong?",
      choices: [
        choice("I challenge it directly and ask who it serves.", { justiciar: 4, sun: 2, blackEmperor: 1 }),
        choice("I find the gap in the wording and use it carefully.", { error: 3, lawyer: 3, fool: 1 }),
        choice("I build a better process and prove it works.", { paragon: 3, whiteTower: 2, redPriest: 2 }),
        choice("I wait, watch, and move when the rule weakens.", { darkness: 2, wheelOfFortune: 3, door: 2 })
      ]
    },
    {
      q: "Which compliment would actually land?",
      choices: [
        choice("You made the complicated thing feel possible.", { whiteTower: 3, paragon: 2, sun: 2 }),
        choice("You noticed what everyone else walked past.", { visionary: 3, hermit: 2, moon: 2 }),
        choice("You made people feel safer without making a show of it.", { twilightGiant: 3, mother: 2, darkness: 2 }),
        choice("You changed the room without asking permission.", { blackEmperor: 3, demoness: 2, redPriest: 2 })
      ]
    },
    {
      q: "At the end of a long day, what still feels worth doing?",
      choices: [
        choice("Putting one tool back where future-me can find it.", { paragon: 2, whiteTower: 2, hermit: 2 }),
        choice("Checking in on the person who went quiet.", { mother: 3, moon: 2, sun: 2 }),
        choice("Writing down the lesson before it fades.", { death: 3, sinner: 2, visionary: 2 }),
        choice("Looking at the sky and deciding tomorrow is still open.", { door: 2, wheelOfFortune: 2, fool: 2 })
      ]
    }
  ];

  const stickerTypes = [
    { id: "eye", label: "Spectral Eye" },
    { id: "key", label: "Brass Key" },
    { id: "door", label: "Wander Door" },
    { id: "clock", label: "Clock Halo" },
    { id: "moon", label: "Moon Vial" },
    { id: "flame", label: "Red Flame" },
    { id: "crown", label: "Black Crown" },
    { id: "book", label: "Forbidden Book" },
    { id: "chain", label: "Iron Chain" },
    { id: "star", label: "Star Chart" },
    { id: "potion", label: "Potion Bottle" },
    { id: "monocle", label: "Monocle Warning" }
  ];

  const palettes = {
    fog: ["#071016", "#10242b", "#24d6c9", "#f7d36a", "#f35fb0"],
    velvet: ["#11070f", "#31122f", "#a02568", "#f7d36a", "#cfe8ff"],
    brass: ["#130f09", "#3a2812", "#d8a94f", "#24d6c9", "#fff1b8"],
    moon: ["#060914", "#151a31", "#8aa4ff", "#cdd9ff", "#f35fb0"],
    ember: ["#120808", "#3a1216", "#dd3f4f", "#f7a34b", "#ffe3a5"]
  };

  let quizState = { index: 0, answers: [], scores: {} };
  let creatorState = null;
  let selectedElementId = null;
  let dragState = null;

  document.addEventListener("DOMContentLoaded", () => {
    db?.init?.();
    renderShell();
    route();
    bindGlobalActions();
    requestAnimationFrame(() => document.body.classList.add("ready"));
  });

  function makePath(id, name, group, type, icon, archetype, traits, summary, weakness, tool, quote) {
    return {
      id,
      name,
      group,
      type,
      icon,
      archetype,
      traits,
      summary,
      weakness,
      tool,
      quote,
      role: roleFor(icon),
      aesthetic: aestheticFor(group, type)
    };
  }

  function roleFor(icon) {
    const roles = {
      mask: "The improviser who makes impossible tasks feel rehearsed.",
      glitch: "The strategist who spots system cracks before they spread.",
      door: "The scout who finds routes, openings, and fresh air.",
      eye: "The interpreter who turns signals into direction.",
      sun: "The morale anchor who makes courage easier to access.",
      storm: "The force multiplier who moves the room into action.",
      tower: "The analyst who turns chaos into a map.",
      chain: "The endurance holder who names the cost clearly.",
      moon: "The quiet regulator who notices the tide changing.",
      skull: "The closer who helps the team finish and transform.",
      giant: "The shield who keeps watch when everyone is tired.",
      thorn: "The social tactician who turns charm into leverage.",
      flame: "The mobilizer who gives a plan heat.",
      book: "The specialist who knows where the hidden answer lives.",
      gear: "The maker who builds a working solution.",
      wheel: "The timing reader who knows when to move.",
      vine: "The cultivator who keeps growth alive.",
      crescent: "The intuition keeper who tracks subtle shifts.",
      abyss: "The depth worker who faces the difficult layer.",
      lock: "The restraint master who keeps power contained.",
      crown: "The negotiator who understands authority.",
      scale: "The witness who keeps fairness visible."
    };
    return roles[icon] || "The uncanny specialist who changes the room's weather.";
  }

  function aestheticFor(group, type) {
    if (type !== "Standard") return "unofficial outer-cosmos dossier, cracked brass, inked warnings";
    const map = {
      "Lord of Mysteries": "grey fog, black tarot, hidden doors, clockwork mischief",
      "God Almighty": "stained glass, radiant ink, ivory archives, sacred geometry",
      "Eternal Darkness": "velvet night, amber shields, graveyard flowers, moonlit steel",
      "Calamity of Destruction": "red silk, war maps, ash gold, candle smoke",
      "Demon of Knowledge": "workbench brass, sealed books, violet formulas, precise tools",
      "Key of Light": "gold coins, probability wheels, lucky blue sparks",
      "Goddess of Origin": "greenhouse moonlight, glass vials, medicinal silver",
      "Father of Devils": "black mirrors, iron rings, sealed confession wax",
      "The Anarchy": "obsidian courts, gold law marks, crown shadows"
    };
    return map[group] || "fogbound tarot, antique gold, spectral teal";
  }

  function choice(text, weights) {
    const normalized = {};
    Object.entries(weights).forEach(([key, value]) => {
      normalized[toKebab(key)] = value;
    });
    return { text, weights: normalized };
  }

  function toKebab(value) {
    return String(value).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^-/, "");
  }

  function renderShell() {
    const user = db?.currentUser?.();
    $("#siteHeader").innerHTML = `
      <div class="nav-wrap">
        <a class="brand-link" href="./index.html" aria-label="Sefirah Atelier home">
          <img src="./assets/logo.svg" alt="Sefirah Atelier">
        </a>
        <button class="nav-toggle" type="button" data-toggle-nav aria-label="Open navigation">
          <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" aria-label="Primary">
          ${navLink("home", "Home", "./index.html")}
          ${navLink("quiz", "Quiz", "./quiz.html")}
          ${navLink("pathways", "Pathways", "./pathways.html")}
          ${navLink("creator", "Tarot Studio", "./creator.html")}
          ${navLink("blog", "Community", "./blog.html")}
        </nav>
        <div class="account-bar">
          ${user ? `<span class="account-chip">${escapeHtml(user.name)}</span><button class="ghost-button small" type="button" data-logout>Log out</button>` : `<a class="ghost-button small" href="./login.html">Log in</a>`}
        </div>
      </div>
    `;

    $("#siteFooter").innerHTML = `
      <div class="footer-inner">
        <strong>a quantum cupcake conjuring</strong>
        <span>Fan-made. Pathway names and grouping reference the <a href="${sourceUrl}" target="_blank" rel="noreferrer">Lord of the Mysteries Wiki Pathways page</a>.</span>
      </div>
    `;
  }

  function navLink(id, label, href) {
    return `<a class="${page === id ? "active" : ""}" href="${href}">${label}</a>`;
  }

  function route() {
    const root = $("#appRoot");
    if (!root) return;
    const renderers = {
      home: renderHome,
      pathways: renderPathways,
      quiz: renderQuiz,
      creator: renderCreator,
      blog: renderBlog,
      login: renderLogin
    };
    (renderers[page] || renderHome)(root);
  }

  function bindGlobalActions() {
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-toggle-nav]")) {
        document.body.classList.toggle("nav-open");
      }
      if (event.target.closest("[data-logout]")) {
        db.logOut();
        toast("Logged out of the local account.");
        renderShell();
        if (page === "login") renderLogin($("#appRoot"));
      }
    });
  }

  function renderHome(root) {
    const featured = ["Fool", "Door", "Visionary", "Paragon", "Wheel of Fortune", "Moon", "Black Emperor", "Justiciar"];
    root.innerHTML = `
      <section class="hero-scene">
        <div class="hero-art" aria-hidden="true"></div>
        <div class="hero-overlay" aria-hidden="true"></div>
        <div class="floating-pathways" aria-hidden="true">
          ${featured.map((name, index) => `<span style="--i:${index};">${escapeHtml(name)}</span>`).join("")}
        </div>
        <div class="hero-copy reveal">
          <p class="eyebrow">Sefirah Atelier</p>
          <h1>Discover Your Pathway</h1>
          <p>Answer twenty-five strange but honest questions, make a tarot identity card, and step into a grey-fog community for theories, aesthetics, and pathway talk.</p>
          <div class="hero-actions">
            <a class="button primary" href="./quiz.html">Begin the Ritual</a>
            <a class="button secondary" href="./pathways.html">View All Pathways</a>
            <a class="button quiet" href="./creator.html">Open Tarot Studio</a>
          </div>
        </div>
      </section>

      <section class="section-grid">
        <article class="omen-panel reveal">
          <div>
            <p class="eyebrow">Grey Fog Dispatch</p>
          <h2>Ask the atelier for a small omen.</h2>
          </div>
          <p id="omenText">The brass cards are restless. They recommend beginning before your confidence arrives.</p>
          <button class="button secondary" type="button" data-roll-omen>Shuffle Omen</button>
        </article>

        <article class="mini-quiz-panel reveal">
          <p class="eyebrow">Fast Read</p>
          <h2>Pick a symbol and get a pathway hint.</h2>
          <div class="symbol-grid">
            ${["Key", "Eye", "Flame", "Mirror", "Clock", "Star", "Mask", "Book"].map((item) => `<button type="button" data-symbol-hint="${item}">${item}</button>`).join("")}
          </div>
          <p id="symbolHint">The atelier is waiting for your first symbol.</p>
        </article>
      </section>

      <section class="feature-bands">
        <a class="feature-band reveal" href="./quiz.html">
          <span>01</span>
          <strong>Personality Ritual</strong>
          <p>Twenty-five questions score your main pathway and secondary influence.</p>
        </a>
        <a class="feature-band reveal" href="./creator.html">
          <span>02</span>
          <strong>Tarot Creator</strong>
          <p>Drag stickers, choose frames, upload attachments, and export a custom card.</p>
        </a>
        <a class="feature-band reveal" href="./blog.html">
          <span>03</span>
          <strong>Mysterious Community</strong>
          <p>Post theories, files, cards, comments, and tarot-card reactions.</p>
        </a>
      </section>

      <section class="pathway-preview reveal">
        <div class="section-heading">
          <p class="eyebrow">Archive sample</p>
          <h2>Pathways with texture, mood, and actual choices.</h2>
          <a class="text-link" href="./pathways.html">Browse archive</a>
        </div>
        <div class="pathway-strip">
          ${pathways.slice(0, 8).map(renderPathwayMiniCard).join("")}
        </div>
      </section>
    `;

    const omens = [
      "The monocle on the desk is not yours. Do not wear it before breakfast.",
      "A locked door has been pretending to be a wall. Ask better questions.",
      "The candle flame leaned left. Someone is about to call that destiny.",
      "Your chaos-to-wisdom ratio is legally impressive today.",
      "The stars have filed a complaint about your sleep schedule.",
      "A tarot card twitched when you walked past. It knows something and loves attention."
    ];

    $("[data-roll-omen]")?.addEventListener("click", () => {
      $("#omenText").textContent = omens[Math.floor(Math.random() * omens.length)];
      $("#omenText").classList.remove("pulse-text");
      void $("#omenText").offsetWidth;
      $("#omenText").classList.add("pulse-text");
    });

    $$("[data-symbol-hint]").forEach((button) => {
      button.addEventListener("click", () => {
        const map = {
          Key: "Door influence: you are looking for a route the room forgot to mention.",
          Eye: "Visionary influence: you are seeing the pattern through the wallpaper.",
          Flame: "Red Priest influence: your plan needs heat, not another meeting.",
          Mirror: "Abyss influence: you can face the difficult reflection without flinching.",
          Clock: "Wheel of Fortune influence: timing is the spell.",
          Star: "Sun influence: your hope is louder than the fog.",
          Mask: "Fool influence: you can survive a scene change with flair.",
          Book: "Hermit influence: the answer is in the forbidden appendix."
        };
        $("#symbolHint").textContent = map[button.dataset.symbolHint];
        $$("[data-symbol-hint]").forEach((item) => item.classList.toggle("active", item === button));
      });
    });
  }

  function renderPathwayMiniCard(path) {
    return `
      <article class="path-mini-card" data-icon="${path.icon}">
        <span>${escapeHtml(path.group)}</span>
        <strong>${escapeHtml(path.name)}</strong>
        <p>${escapeHtml(path.archetype)}</p>
      </article>
    `;
  }

  function renderPathways(root) {
    root.innerHTML = `
      <section class="page-hero compact reveal">
        <p class="eyebrow">Pathway Archive</p>
        <h1>Thirty-two cards under the grey fog.</h1>
        <p>Browse standard and non-standard pathway-inspired archetypes. The names and grouping are referenced from the fandom wiki; the personality readings here are original fan-made interpretations.</p>
      </section>

      <section class="archive-toolbar reveal">
        <label class="search-field">Search pathways
          <input id="pathSearch" type="search" placeholder="Try Fool, Moon, justice, brass...">
        </label>
        <label class="search-field">Filter
          <select id="pathType">
            <option value="all">All types</option>
            <option value="Standard">Standard</option>
            <option value="Non-standard">Non-standard</option>
          </select>
        </label>
        <div class="chip-row" id="groupFilters">
          <button class="active" type="button" data-group="all">All Groups</button>
          ${pathwayGroups.map((group) => `<button type="button" data-group="${escapeAttr(group)}">${escapeHtml(group)}</button>`).join("")}
        </div>
      </section>

      <section id="pathGrid" class="path-grid" aria-live="polite"></section>
      <dialog id="pathModal" class="path-modal"></dialog>
    `;

    const filters = { search: "", type: "all", group: "all" };
    const render = () => {
      const search = filters.search.toLowerCase();
      const filtered = pathways.filter((path) => {
        const haystack = `${path.name} ${path.group} ${path.type} ${path.archetype} ${path.traits.join(" ")} ${path.summary} ${path.aesthetic}`.toLowerCase();
        return (filters.type === "all" || path.type === filters.type)
          && (filters.group === "all" || path.group === filters.group)
          && (!search || haystack.includes(search));
      });
      $("#pathGrid").innerHTML = filtered.map(renderPathwayCard).join("") || `<p class="empty-state">No pathway answered that knock. Try a wider search.</p>`;
      bindPathCards();
    };

    $("#pathSearch").addEventListener("input", (event) => {
      filters.search = event.target.value;
      render();
    });
    $("#pathType").addEventListener("change", (event) => {
      filters.type = event.target.value;
      render();
    });
    $$("[data-group]").forEach((button) => {
      button.addEventListener("click", () => {
        filters.group = button.dataset.group;
        $$("[data-group]").forEach((item) => item.classList.toggle("active", item === button));
        render();
      });
    });
    render();
  }

  function renderPathwayCard(path) {
    return `
      <article class="path-card reveal" data-path-id="${path.id}" data-icon="${path.icon}">
        <div class="path-card-head">
          <span>${escapeHtml(path.type)}</span>
          <i aria-hidden="true"></i>
        </div>
        <h2>${escapeHtml(path.name)}</h2>
        <p>${escapeHtml(path.summary)}</p>
        <div class="trait-row">
          ${path.traits.map((trait) => `<span>${escapeHtml(trait)}</span>`).join("")}
        </div>
        <button class="button secondary full" type="button" data-open-path="${path.id}">Learn More</button>
      </article>
    `;
  }

  function bindPathCards() {
    $$("[data-open-path]").forEach((button) => {
      button.addEventListener("click", () => openPathModal(button.dataset.openPath));
    });
  }

  function openPathModal(id) {
    const path = pathways.find((item) => item.id === id);
    const modal = $("#pathModal");
    if (!path || !modal) return;
    modal.innerHTML = `
      <div class="modal-card" data-icon="${path.icon}">
        <button class="modal-close" type="button" data-close-modal aria-label="Close">x</button>
        <p class="eyebrow">${escapeHtml(path.group)} / ${escapeHtml(path.type)}</p>
        <h2>${escapeHtml(path.name)} Pathway</h2>
        <p>${escapeHtml(path.summary)}</p>
        <dl class="detail-list">
          <div><dt>Archetype</dt><dd>${escapeHtml(path.archetype)}</dd></div>
          <div><dt>Team role</dt><dd>${escapeHtml(path.role)}</dd></div>
          <div><dt>Watch out for</dt><dd>${escapeHtml(path.weakness)}</dd></div>
          <div><dt>Tool or symbol</dt><dd>${escapeHtml(path.tool)}</dd></div>
          <div><dt>Aesthetic</dt><dd>${escapeHtml(path.aesthetic)}</dd></div>
        </dl>
        <blockquote>${escapeHtml(path.quote)}</blockquote>
        <div class="modal-actions">
          <a class="button primary" href="./quiz.html">Take Quiz</a>
          <a class="button secondary" href="./creator.html">Make Tarot Card</a>
        </div>
      </div>
    `;
    modal.showModal();
    $("[data-close-modal]", modal).addEventListener("click", () => modal.close());
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.close();
    }, { once: true });
  }

  function renderQuiz(root) {
    quizState = { index: 0, answers: [], scores: {} };
    root.innerHTML = `
      <section class="quiz-page reveal">
        <div class="quiz-intro">
          <p class="eyebrow">Personality Ritual</p>
          <h1>Let the cards read the room.</h1>
          <p>Twenty-five questions, one main pathway, one secondary influence, and a result card you can save or turn into a custom tarot design.</p>
        </div>
        <section class="quiz-card" id="quizCard"></section>
      </section>
    `;
    renderQuizStep();
  }

  function renderQuizStep() {
    const question = quizQuestions[quizState.index];
    const total = quizQuestions.length;
    const selectedIndex = quizState.answers[quizState.index];
    $("#quizCard").innerHTML = `
      <div class="quiz-progress">
        <span>Question ${quizState.index + 1} of ${total}</span>
        <div><i style="width:${((quizState.index + 1) / total) * 100}%"></i></div>
      </div>
      <h2>${escapeHtml(question.q)}</h2>
      <div class="answer-grid">
        ${question.choices.map((item, index) => `
          <button class="${selectedIndex === index ? "selected" : ""}" type="button" data-answer="${index}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            ${escapeHtml(item.text)}
          </button>
        `).join("")}
      </div>
      <div class="quiz-actions">
        <button class="button secondary" type="button" data-quiz-back ${quizState.index === 0 ? "disabled" : ""}>Back</button>
        <button class="button primary" type="button" data-quiz-next ${selectedIndex === undefined ? "disabled" : ""}>${quizState.index === total - 1 ? "Reveal Pathway" : "Next"}</button>
      </div>
    `;
    $$("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        quizState.answers[quizState.index] = Number(button.dataset.answer);
        renderQuizStep();
      });
    });
    $("[data-quiz-back]")?.addEventListener("click", () => {
      quizState.index = Math.max(0, quizState.index - 1);
      renderQuizStep();
    });
    $("[data-quiz-next]")?.addEventListener("click", () => {
      if (quizState.answers[quizState.index] === undefined) return;
      if (quizState.index < quizQuestions.length - 1) {
        quizState.index += 1;
        renderQuizStep();
      } else {
        revealResult();
      }
    });
  }

  function revealResult() {
    const messages = [
      "Stirring your personality potion...",
      "Checking the star chart...",
      "Measuring your chaos-to-wisdom ratio...",
      "Checking whether the fog has filed paperwork...",
      "Asking the tarot deck to stop being theatrical..."
    ];
    let index = 0;
    $("#quizCard").innerHTML = `
      <div class="loading-ritual">
        <div class="ritual-ring" aria-hidden="true"></div>
        <p id="loadingMessage">${messages[0]}</p>
      </div>
    `;
    const timer = setInterval(() => {
      index = (index + 1) % messages.length;
      $("#loadingMessage").textContent = messages[index];
    }, 420);
    setTimeout(() => {
      clearInterval(timer);
      const result = scoreQuiz();
      db?.saveResult?.(result);
      renderResult(result);
    }, 2100);
  }

  function scoreQuiz() {
    const scores = {};
    quizState.answers.forEach((answerIndex, questionIndex) => {
      const choiceItem = quizQuestions[questionIndex].choices[answerIndex];
      Object.entries(choiceItem.weights).forEach(([id, value]) => {
        scores[id] = (scores[id] || 0) + value;
      });
    });
    pathways.forEach((path) => {
      if (!scores[path.id]) scores[path.id] = 0;
    });
    const ranked = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => pathways.find((path) => path.id === id))
      .filter(Boolean);
    const main = ranked[0];
    const secondary = ranked.find((path) => path.id !== main.id) || ranked[1];
    return {
      mainId: main.id,
      secondaryId: secondary.id,
      scores,
      quote: main.quote
    };
  }

  function renderResult(result) {
    const main = getPath(result.mainId);
    const secondary = getPath(result.secondaryId);
    $("#quizCard").innerHTML = `
      <article class="result-card" id="resultCard" data-icon="${main.icon}">
        <p class="eyebrow">Your pathway is</p>
        <h2>${escapeHtml(main.name)} Pathway</h2>
        <p class="secondary-line">Secondary influence: <strong>${escapeHtml(secondary.name)}</strong></p>
        <p class="result-summary">${escapeHtml(makeResultSummary(main, secondary))}</p>
        <div class="result-grid">
          <div><span>Strengths</span><p>${main.traits.map(capitalize).join(", ")}</p></div>
          <div><span>Weakness</span><p>${escapeHtml(main.weakness)}</p></div>
          <div><span>Team role</span><p>${escapeHtml(main.role)}</p></div>
          <div><span>Magical tool</span><p>${escapeHtml(main.tool)}</p></div>
          <div><span>Aesthetic</span><p>${escapeHtml(main.aesthetic)}</p></div>
          <div><span>Quote</span><p>${escapeHtml(main.quote)}</p></div>
        </div>
        <div class="quiz-actions wrap">
          <button class="button primary" type="button" data-share-result>Share Result</button>
          <button class="button secondary" type="button" data-download-result>Download Card</button>
          <a class="button quiet" href="./creator.html">Make Tarot Card</a>
          <button class="button secondary" type="button" data-restart-quiz>Restart Quiz</button>
        </div>
      </article>
    `;
    $("[data-restart-quiz]").addEventListener("click", () => renderQuiz($("#appRoot")));
    $("[data-share-result]").addEventListener("click", () => shareText(`I drew the ${main.name} Pathway with ${secondary.name} influence on Sefirah Atelier.`));
    $("[data-download-result]").addEventListener("click", () => downloadResultSvg(main, secondary));
  }

  function makeResultSummary(main, secondary) {
    return `You move through the world as ${articleFor(main.archetype)} ${main.archetype.toLowerCase()} with a ${secondary.name} influence. You are at your best when your instincts have room, structure, and a clear reason to act.`;
  }

  function articleFor(text) {
    return /^[aeiou]/i.test(text) ? "an" : "a";
  }

  function renderCreator(root) {
    creatorState = {
      title: "The Grey Fog Witness",
      subtitle: "Sequence of careful instinct",
      pathwayId: "fool",
      palette: "fog",
      frame: "ornate",
      elements: [
        newElement("eye", "Spectral Eye", 46, 30, 1.2, 0),
        newElement("key", "Brass Key", 20, 70, 0.9, -12),
        newElement("clock", "Clock Halo", 72, 68, 0.85, 9)
      ]
    };
    selectedElementId = creatorState.elements[0].id;

    root.innerHTML = `
      <section class="creator-page reveal">
        <div class="creator-heading">
          <div>
            <p class="eyebrow">Tarot Card Creator</p>
            <h1>Design a pathway tarot card with your own symbols.</h1>
          </div>
          <div class="creator-actions">
            <button class="button primary" type="button" data-save-card>Save Card</button>
            <button class="button secondary" type="button" data-export-card>Export SVG</button>
          </div>
        </div>

        <div class="creator-layout">
          <aside class="toolbox panel">
            <div class="panel-title">
              <span>Card text</span>
              <strong>Identity layer</strong>
            </div>
            <label>Title
              <input id="cardTitle" value="${escapeAttr(creatorState.title)}">
            </label>
            <label>Subtitle
              <input id="cardSubtitle" value="${escapeAttr(creatorState.subtitle)}">
            </label>
            <label>Pathway
              <select id="cardPathway">
                ${pathways.map((path) => `<option value="${path.id}" ${path.id === creatorState.pathwayId ? "selected" : ""}>${escapeHtml(path.name)}</option>`).join("")}
              </select>
            </label>
            <div class="panel-title">
              <span>Palette</span>
              <strong>Choose the ritual lighting</strong>
            </div>
            <div class="palette-grid">
              ${Object.entries(palettes).map(([id, colors]) => `
                <button class="${id === creatorState.palette ? "active" : ""}" type="button" data-palette="${id}" aria-label="${id} palette">
                  ${colors.map((color) => `<i style="background:${color}"></i>`).join("")}
                </button>
              `).join("")}
            </div>
            <div class="panel-title">
              <span>Frame</span>
              <strong>Card border</strong>
            </div>
            <div class="segmented">
              ${["ornate", "minimal", "clockwork"].map((frame) => `<button class="${frame === creatorState.frame ? "active" : ""}" type="button" data-frame="${frame}">${capitalize(frame)}</button>`).join("")}
            </div>
          </aside>

          <section class="tarot-workbench panel">
            <div class="stage-toolbar">
              <button class="icon-tool" type="button" data-add-text title="Add text" aria-label="Add text">T</button>
              <button class="icon-tool" type="button" data-delete-element title="Delete selected" aria-label="Delete selected">x</button>
              <button class="icon-tool" type="button" data-bring-front title="Bring forward" aria-label="Bring forward">^</button>
              <button class="icon-tool" type="button" data-send-back title="Send back" aria-label="Send back">v</button>
              <label class="upload-tool">Upload<input id="cardUpload" type="file" multiple accept="*/*"></label>
            </div>
            <div class="tarot-stage-wrap">
              <div id="tarotStage" class="tarot-stage" aria-label="Editable tarot card preview"></div>
            </div>
          </section>

          <aside class="stickers-panel panel">
            <div class="panel-title">
              <span>Fan sticker shelf</span>
              <strong>Original lore-inspired motifs</strong>
            </div>
            <div class="sticker-grid">
              ${stickerTypes.map((item) => `<button type="button" data-add-sticker="${item.id}" data-label="${escapeAttr(item.label)}"><i class="sticker-symbol sticker-${item.id}"></i><span>${escapeHtml(item.label)}</span></button>`).join("")}
            </div>
            <div class="panel-title">
              <span>Selected layer</span>
              <strong id="selectedLayerName">Spectral Eye</strong>
            </div>
            <label>Scale
              <input id="elementScale" type="range" min="45" max="190" value="120">
            </label>
            <label>Rotation
              <input id="elementRotation" type="range" min="-45" max="45" value="0">
            </label>
            <div id="layerList" class="layer-list"></div>
          </aside>
        </div>

        <section class="saved-cards-section reveal">
          <div class="section-heading">
            <p class="eyebrow">Local saves</p>
            <h2>Your card cabinet</h2>
          </div>
          <div id="savedCards" class="saved-card-grid"></div>
        </section>
      </section>
    `;
    bindCreator();
    updateTarotCanvas();
    renderSavedCards();
  }

  function bindCreator() {
    $("#cardTitle").addEventListener("input", (event) => {
      creatorState.title = event.target.value;
      updateTarotCanvas();
    });
    $("#cardSubtitle").addEventListener("input", (event) => {
      creatorState.subtitle = event.target.value;
      updateTarotCanvas();
    });
    $("#cardPathway").addEventListener("change", (event) => {
      creatorState.pathwayId = event.target.value;
      updateTarotCanvas();
    });
    $$("[data-palette]").forEach((button) => {
      button.addEventListener("click", () => {
        creatorState.palette = button.dataset.palette;
        $$("[data-palette]").forEach((item) => item.classList.toggle("active", item === button));
        updateTarotCanvas();
      });
    });
    $$("[data-frame]").forEach((button) => {
      button.addEventListener("click", () => {
        creatorState.frame = button.dataset.frame;
        $$("[data-frame]").forEach((item) => item.classList.toggle("active", item === button));
        updateTarotCanvas();
      });
    });
    $$("[data-add-sticker]").forEach((button) => {
      button.addEventListener("click", () => {
        const element = newElement(button.dataset.addSticker, button.dataset.label, 35 + Math.random() * 26, 36 + Math.random() * 32, 1, 0);
        creatorState.elements.push(element);
        selectedElementId = element.id;
        updateTarotCanvas();
        toast(`${button.dataset.label} added.`);
      });
    });
    $("[data-add-text]").addEventListener("click", () => {
      const element = newElement("text", "A carefully worded omen", 24, 48, 1, -2);
      creatorState.elements.push(element);
      selectedElementId = element.id;
      updateTarotCanvas();
    });
    $("[data-delete-element]").addEventListener("click", () => {
      creatorState.elements = creatorState.elements.filter((element) => element.id !== selectedElementId);
      selectedElementId = creatorState.elements[0]?.id || null;
      updateTarotCanvas();
    });
    $("[data-bring-front]").addEventListener("click", () => moveSelectedLayer(1));
    $("[data-send-back]").addEventListener("click", () => moveSelectedLayer(-1));
    $("#elementScale").addEventListener("input", (event) => {
      const selected = selectedElement();
      if (!selected) return;
      selected.scale = Number(event.target.value) / 100;
      updateTarotCanvas(false);
    });
    $("#elementRotation").addEventListener("input", (event) => {
      const selected = selectedElement();
      if (!selected) return;
      selected.rotation = Number(event.target.value);
      updateTarotCanvas(false);
    });
    $("#cardUpload").addEventListener("change", async (event) => {
      const files = await readFiles(event.target.files, 4);
      files.forEach((file, index) => {
        const type = file.type.startsWith("image/") && file.data ? "upload-image" : "file";
        creatorState.elements.push(newElement(type, file.name, 28 + index * 7, 42 + index * 7, 0.8, 0, file.data, file.type));
      });
      selectedElementId = creatorState.elements.at(-1)?.id || selectedElementId;
      updateTarotCanvas();
      event.target.value = "";
    });
    $("[data-export-card]").addEventListener("click", () => downloadCardSvg());
    $("[data-save-card]").addEventListener("click", () => {
      const saved = db?.saveCard?.(creatorState);
      toast(saved ? "Card saved to the local cabinet." : "Card could not be saved.");
      renderSavedCards();
    });
  }

  function newElement(type, label, x, y, scale, rotation, src = "", mime = "") {
    return {
      id: `el-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      label,
      x,
      y,
      scale,
      rotation,
      src,
      mime
    };
  }

  function selectedElement() {
    return creatorState?.elements.find((element) => element.id === selectedElementId) || null;
  }

  function updateTarotCanvas(full = true) {
    const stage = $("#tarotStage");
    if (!stage || !creatorState) return;
    const path = getPath(creatorState.pathwayId);
    const colors = palettes[creatorState.palette];
    stage.style.setProperty("--c0", colors[0]);
    stage.style.setProperty("--c1", colors[1]);
    stage.style.setProperty("--c2", colors[2]);
    stage.style.setProperty("--c3", colors[3]);
    stage.style.setProperty("--c4", colors[4]);
    stage.dataset.frame = creatorState.frame;
    stage.innerHTML = `
      <div class="tarot-card-face">
        <span class="tarot-corner top">I</span>
        <span class="tarot-corner bottom">XXII</span>
        <div class="card-constellation" aria-hidden="true"></div>
        <div class="major-sigil" data-icon="${path.icon}" aria-hidden="true"><i></i></div>
        <div class="tarot-title">
          <span>${escapeHtml(path.name)} Pathway</span>
          <strong>${escapeHtml(creatorState.title || "Untitled Omen")}</strong>
          <em>${escapeHtml(creatorState.subtitle || path.archetype)}</em>
        </div>
        <p class="tarot-quote">${escapeHtml(path.quote)}</p>
        <div id="elementLayer" class="element-layer">
          ${creatorState.elements.map(renderCanvasElement).join("")}
        </div>
      </div>
    `;
    bindCanvasElements();
    renderLayers();
    syncSelectedControls();
    if (full) stage.classList.add("card-pop");
    setTimeout(() => stage.classList.remove("card-pop"), 260);
  }

  function renderCanvasElement(element) {
    const selected = element.id === selectedElementId ? "selected" : "";
    const style = `left:${element.x}%;top:${element.y}%;--scale:${element.scale};--rot:${element.rotation}deg;`;
    if (element.type === "upload-image" && element.src) {
      return `<button class="canvas-element upload-image ${selected}" type="button" data-element-id="${element.id}" style="${style}"><img src="${element.src}" alt="${escapeAttr(element.label)}"></button>`;
    }
    if (element.type === "file") {
      return `<button class="canvas-element file-chip ${selected}" type="button" data-element-id="${element.id}" style="${style}"><span>FILE</span>${escapeHtml(element.label)}</button>`;
    }
    if (element.type === "text") {
      return `<button class="canvas-element text-chip ${selected}" type="button" data-element-id="${element.id}" style="${style}">${escapeHtml(element.label)}</button>`;
    }
    return `<button class="canvas-element sticker-chip ${selected}" type="button" data-element-id="${element.id}" style="${style}"><i class="sticker-symbol sticker-${element.type}"></i><span>${escapeHtml(element.label)}</span></button>`;
  }

  function bindCanvasElements() {
    $$(".canvas-element").forEach((element) => {
      element.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        const item = creatorState.elements.find((entry) => entry.id === element.dataset.elementId);
        if (!item) return;
        selectedElementId = item.id;
        const stageRect = $("#tarotStage").getBoundingClientRect();
        dragState = {
          id: item.id,
          startX: event.clientX,
          startY: event.clientY,
          x: item.x,
          y: item.y,
          rect: stageRect
        };
        element.setPointerCapture?.(event.pointerId);
        updateTarotCanvas(false);
      });
    });

    document.onpointermove = (event) => {
      if (!dragState || !creatorState) return;
      const item = creatorState.elements.find((entry) => entry.id === dragState.id);
      if (!item) return;
      const dx = ((event.clientX - dragState.startX) / dragState.rect.width) * 100;
      const dy = ((event.clientY - dragState.startY) / dragState.rect.height) * 100;
      item.x = clamp(dragState.x + dx, 6, 88);
      item.y = clamp(dragState.y + dy, 8, 88);
      updateTarotCanvas(false);
    };
    document.onpointerup = () => {
      dragState = null;
    };
  }

  function renderLayers() {
    const list = $("#layerList");
    if (!list || !creatorState) return;
    list.innerHTML = creatorState.elements.slice().reverse().map((element, index) => `
      <button class="${element.id === selectedElementId ? "active" : ""}" type="button" data-select-layer="${element.id}">
        <span>${index + 1}</span>
        <strong>${escapeHtml(element.label)}</strong>
      </button>
    `).join("");
    $$("[data-select-layer]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedElementId = button.dataset.selectLayer;
        updateTarotCanvas(false);
      });
    });
  }

  function syncSelectedControls() {
    const selected = selectedElement();
    $("#selectedLayerName").textContent = selected ? selected.label : "No layer selected";
    if (selected) {
      $("#elementScale").value = Math.round(selected.scale * 100);
      $("#elementRotation").value = selected.rotation;
    }
  }

  function moveSelectedLayer(direction) {
    const index = creatorState.elements.findIndex((element) => element.id === selectedElementId);
    if (index < 0) return;
    const next = clamp(index + direction, 0, creatorState.elements.length - 1);
    const [item] = creatorState.elements.splice(index, 1);
    creatorState.elements.splice(next, 0, item);
    updateTarotCanvas(false);
  }

  function renderSavedCards() {
    const target = $("#savedCards");
    if (!target) return;
    const cards = db?.getCards?.() || [];
    target.innerHTML = cards.length ? cards.slice(0, 8).map((card) => {
      const path = getPath(card.pathwayId);
      return `
        <article>
          <span>${escapeHtml(path.name)}</span>
          <strong>${escapeHtml(card.title)}</strong>
          <p>${escapeHtml(card.subtitle)}</p>
        </article>
      `;
    }).join("") : `<p class="empty-state">No saved tarot cards yet. Your cabinet is still empty.</p>`;
  }

  function renderBlog(root) {
    const user = db?.currentUser?.();
    root.innerHTML = `
      <section class="page-hero compact reveal">
        <p class="eyebrow">Community Blog</p>
        <h1>Post theories, cards, files, and pathway notes.</h1>
        <p>All posts, comments, attachments, and mysterious reactions are saved in this browser for GitHub Pages compatibility.</p>
      </section>

      <section class="blog-layout">
        <aside class="panel blog-composer reveal">
          ${user ? renderPostForm(user) : renderLoginInvite()}
        </aside>
        <section class="feed-panel">
          <div class="feed-toolbar">
            <label class="search-field">Search community
              <input id="postSearch" type="search" placeholder="Search title, tags, body...">
            </label>
            <select id="postSort" aria-label="Sort posts">
              <option value="fresh">Fresh fog</option>
              <option value="mysterious">Most mysterious</option>
              <option value="comments">Most commented</option>
            </select>
          </div>
          <div id="postFeed" class="post-feed" aria-live="polite"></div>
        </section>
      </section>
    `;
    bindBlog();
    renderPosts();
  }

  function renderPostForm(user) {
    return `
      <p class="eyebrow">Posting as ${escapeHtml(user.name)}</p>
      <h2>Write a post</h2>
      <form id="postForm" class="form-stack">
        <label>Title
          <input name="title" placeholder="Theory, card drop, pathway question..." required>
        </label>
        <label>Body
          <textarea name="body" rows="7" placeholder="Write a theory, a card note, a question, or a pathway read." required></textarea>
        </label>
        <label>Tags
          <input name="tags" placeholder="tarot, pathway, theory">
        </label>
        <label class="upload-box">Attachments
          <input name="attachments" type="file" multiple accept="*/*">
          <span>Images, videos, audio, PDFs, docs, zips, and other files are accepted. Large files are saved as name-only chips.</span>
        </label>
        <button class="button primary full" type="submit">Post to the Fog</button>
      </form>
    `;
  }

  function renderLoginInvite() {
    return `
      <p class="eyebrow">Local login needed</p>
      <h2>Claim a name before posting.</h2>
      <p class="muted">You can read, comment as a guest, and mark posts mysterious. To create a post, make a local account on this device.</p>
      <a class="button primary full" href="./login.html">Create Local Account</a>
    `;
  }

  function bindBlog() {
    $("#postForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      try {
        const attachments = await readFiles(form.getAll("attachments").filter((file) => file && file.name), 8);
        db.createPost({
          title: form.get("title"),
          body: form.get("body"),
          tags: form.get("tags"),
          attachments
        });
        event.currentTarget.reset();
        toast("Post released into the fog.");
        renderPosts();
      } catch (error) {
        toast(error.message);
      }
    });
    $("#postSearch")?.addEventListener("input", renderPosts);
    $("#postSort")?.addEventListener("change", renderPosts);
  }

  function renderPosts() {
    const feed = $("#postFeed");
    if (!feed) return;
    const search = ($("#postSearch")?.value || "").toLowerCase();
    const sort = $("#postSort")?.value || "fresh";
    let posts = db?.getPosts?.() || [];
    if (search) {
      posts = posts.filter((post) => `${post.title} ${post.body} ${post.authorName} ${(post.tags || []).join(" ")}`.toLowerCase().includes(search));
    }
    if (sort === "mysterious") posts.sort((a, b) => (b.mysterious?.length || 0) - (a.mysterious?.length || 0));
    if (sort === "comments") posts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));

    feed.innerHTML = posts.length ? posts.map(renderPost).join("") : `<p class="empty-state">No posts found in this fog bank.</p>`;
    bindPostActions();
  }

  function renderPost(post) {
    return `
      <article class="post-card reveal" data-post-id="${post.id}">
        <div class="post-head">
          <div>
            <strong>${escapeHtml(post.title)}</strong>
            <span>by ${escapeHtml(post.authorName)} - ${formatDate(post.createdAt)}</span>
          </div>
          <button class="mysterious-button" type="button" data-mysterious="${post.id}" aria-label="Mark post mysterious">
            <i></i><span>${post.mysterious?.length || 0}</span>
          </button>
        </div>
        <p>${escapeHtml(post.body)}</p>
        ${post.tags?.length ? `<div class="trait-row">${post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        ${post.attachments?.length ? `<div class="attachment-grid">${post.attachments.map(renderAttachment).join("")}</div>` : ""}
        <div class="comments">
          <strong>${post.comments?.length || 0} comments</strong>
          ${(post.comments || []).map((comment) => `<p><span>${escapeHtml(comment.authorName)}</span> ${escapeHtml(comment.body)}</p>`).join("")}
          <form data-comment-form="${post.id}">
            <input name="comment" placeholder="Add a comment from under the fog">
            <button class="button secondary" type="submit">Comment</button>
          </form>
        </div>
      </article>
    `;
  }

  function renderAttachment(file) {
    if (file.type?.startsWith("image/") && file.data) {
      return `<figure><img src="${file.data}" alt="${escapeAttr(file.name)}"><figcaption>${escapeHtml(file.name)}</figcaption></figure>`;
    }
    if (file.type?.startsWith("video/") && file.data) {
      return `<figure><video src="${file.data}" controls></video><figcaption>${escapeHtml(file.name)}</figcaption></figure>`;
    }
    if (file.type?.startsWith("audio/") && file.data) {
      return `<figure><audio src="${file.data}" controls></audio><figcaption>${escapeHtml(file.name)}</figcaption></figure>`;
    }
    return `<a class="file-attachment" ${file.data ? `href="${file.data}" download="${escapeAttr(file.name)}"` : ""}><span>FILE</span><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(file.type || "unknown type")}</small></a>`;
  }

  function bindPostActions() {
    $$("[data-mysterious]").forEach((button) => {
      button.addEventListener("click", () => {
        try {
          const post = db.toggleMysterious(button.dataset.mysterious);
          button.classList.add("conjuring");
          setTimeout(() => button.classList.remove("conjuring"), 520);
          button.querySelector("span").textContent = post.mysterious.length;
          toast("Marked as mysterious.");
        } catch (error) {
          toast(error.message);
        }
      });
    });
    $$("[data-comment-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = $("input", form);
        try {
          db.addComment(form.dataset.commentForm, input.value);
          input.value = "";
          renderPosts();
        } catch (error) {
          toast(error.message);
        }
      });
    });
  }

  function renderLogin(root) {
    const user = db?.currentUser?.();
    root.innerHTML = `
      <section class="login-page reveal">
        <div class="login-copy">
          <p class="eyebrow">Local Account</p>
          <h1>${user ? `Welcome, ${escapeHtml(user.name)}.` : "Keep your fog cabinet on this device."}</h1>
          <p>Sefirah Atelier is static on GitHub Pages, so accounts are local browser profiles. They save cards, results, and posts on this device without sending data to a server.</p>
        </div>
        <div class="auth-panel panel">
          ${user ? renderAccountPanel(user) : renderAuthForms()}
        </div>
      </section>
    `;
    bindAuth();
  }

  function renderAccountPanel(user) {
    return `
      <h2>Local profile active</h2>
      <dl class="detail-list">
        <div><dt>Name</dt><dd>${escapeHtml(user.name)}</dd></div>
        <div><dt>Email</dt><dd>${escapeHtml(user.email)}</dd></div>
      </dl>
      <div class="auth-actions">
        <a class="button primary" href="./blog.html">Open Community</a>
        <a class="button secondary" href="./creator.html">Open Tarot Studio</a>
        <button class="button quiet" type="button" data-logout>Log out</button>
      </div>
    `;
  }

  function renderAuthForms() {
    return `
      <div class="auth-tabs">
        <button class="active" type="button" data-auth-tab="login">Log in</button>
        <button type="button" data-auth-tab="signup">Sign up</button>
      </div>
      <form id="loginForm" class="form-stack auth-form active">
        <label>Email
          <input name="email" type="email" required>
        </label>
        <label>Password
          <input name="password" type="password" required>
        </label>
        <button class="button primary full" type="submit">Log in</button>
      </form>
      <form id="signupForm" class="form-stack auth-form">
        <label>Name
          <input name="name" required>
        </label>
        <label>Email
          <input name="email" type="email" required>
        </label>
        <label>Password
          <input name="password" type="password" minlength="6" required>
        </label>
        <button class="button primary full" type="submit">Create local account</button>
      </form>
    `;
  }

  function bindAuth() {
    $$("[data-auth-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        $$("[data-auth-tab]").forEach((item) => item.classList.toggle("active", item === button));
        $$(".auth-form").forEach((form) => form.classList.toggle("active", form.id.startsWith(button.dataset.authTab)));
      });
    });
    $("#loginForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      try {
        await db.logIn({ email: form.get("email"), password: form.get("password") });
        toast("Logged in locally.");
        renderShell();
        renderLogin($("#appRoot"));
      } catch (error) {
        toast(error.message);
      }
    });
    $("#signupForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      try {
        await db.signUp({ name: form.get("name"), email: form.get("email"), password: form.get("password") });
        toast("Local account created.");
        renderShell();
        renderLogin($("#appRoot"));
      } catch (error) {
        toast(error.message);
      }
    });
  }

  function getPath(id) {
    return pathways.find((path) => path.id === id) || pathways[0];
  }

  async function readFiles(fileList, limit = 8) {
    const files = Array.from(fileList || []).slice(0, limit);
    return Promise.all(files.map((file) => new Promise((resolve) => {
      const base = {
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: ""
      };
      if (file.size > 900000) {
        resolve(base);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve({ ...base, data: String(reader.result || "") });
      reader.onerror = () => resolve(base);
      reader.readAsDataURL(file);
    })));
  }

  function shareText(text) {
    if (navigator.share) {
      navigator.share({ text }).catch(() => copyText(text));
    } else {
      copyText(text);
    }
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text)
      .then(() => toast("Copied to clipboard."))
      .catch(() => toast(text));
  }

  function downloadResultSvg(main, secondary) {
    const svg = buildSimpleSvg(`${main.name} Pathway`, `Secondary influence: ${secondary.name}`, main.quote, palettes.fog);
    downloadFile(`${slug(main.name)}-pathway-result.svg`, svg, "image/svg+xml");
  }

  function downloadCardSvg() {
    const path = getPath(creatorState.pathwayId);
    const colors = palettes[creatorState.palette];
    const stickers = creatorState.elements.map((element) => {
      const x = Math.round((element.x / 100) * 640);
      const y = Math.round((element.y / 100) * 960);
      const label = element.type === "upload-image" ? "Upload" : element.label;
      return `<text x="${x}" y="${y}" fill="${colors[3]}" font-size="${Math.round(22 * element.scale)}" font-family="Inter, Arial" text-anchor="middle" transform="rotate(${element.rotation} ${x} ${y})">${escapeXml(label)}</text>`;
    }).join("");
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="960" viewBox="0 0 640 960">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="640" y2="960">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="0.55" stop-color="${colors[1]}"/>
      <stop offset="1" stop-color="${colors[4]}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="960" rx="36" fill="url(#bg)"/>
  <rect x="34" y="34" width="572" height="892" rx="24" fill="none" stroke="${colors[3]}" stroke-width="10"/>
  <rect x="62" y="62" width="516" height="836" rx="18" fill="rgba(0,0,0,0.22)" stroke="${colors[2]}" stroke-width="3"/>
  <circle cx="320" cy="320" r="112" fill="none" stroke="${colors[2]}" stroke-width="8"/>
  <path d="M190 320c38-68 83-94 130-94s92 26 130 94c-38 68-83 94-130 94s-92-26-130-94Z" fill="none" stroke="${colors[3]}" stroke-width="9"/>
  <circle cx="320" cy="320" r="38" fill="${colors[2]}"/>
  <text x="320" y="590" fill="#ffffff" font-size="56" font-family="Georgia, serif" font-weight="700" text-anchor="middle">${escapeXml(creatorState.title || path.name)}</text>
  <text x="320" y="644" fill="${colors[3]}" font-size="27" font-family="Inter, Arial" font-weight="700" text-anchor="middle">${escapeXml(path.name)} Pathway</text>
  <text x="320" y="690" fill="#dce7f5" font-size="24" font-family="Inter, Arial" text-anchor="middle">${escapeXml(creatorState.subtitle || path.archetype)}</text>
  <text x="320" y="816" fill="${colors[3]}" font-size="22" font-family="Georgia, serif" text-anchor="middle">${escapeXml(path.quote)}</text>
  ${stickers}
</svg>`;
    downloadFile(`${slug(creatorState.title || path.name)}-tarot-card.svg`, svg, "image/svg+xml");
  }

  function buildSimpleSvg(title, subtitle, quote, colors) {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="1600">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="0.48" stop-color="${colors[1]}"/>
      <stop offset="1" stop-color="${colors[4]}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1600" rx="70" fill="url(#bg)"/>
  <rect x="70" y="70" width="1060" height="1460" rx="46" fill="none" stroke="${colors[3]}" stroke-width="18"/>
  <circle cx="600" cy="455" r="185" fill="none" stroke="${colors[2]}" stroke-width="16"/>
  <path d="M355 455c75-122 160-170 245-170s170 48 245 170c-75 122-160 170-245 170S430 577 355 455Z" fill="none" stroke="${colors[3]}" stroke-width="18"/>
  <circle cx="600" cy="455" r="64" fill="${colors[2]}"/>
  <text x="600" y="850" fill="#ffffff" font-size="100" font-family="Georgia, serif" font-weight="700" text-anchor="middle">${escapeXml(title)}</text>
  <text x="600" y="930" fill="${colors[3]}" font-size="46" font-family="Inter, Arial" font-weight="700" text-anchor="middle">${escapeXml(subtitle)}</text>
  <text x="600" y="1170" fill="#dce7f5" font-size="38" font-family="Georgia, serif" text-anchor="middle">${escapeXml(quote)}</text>
</svg>`;
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Download prepared.");
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  }

  function capitalize(value) {
    const text = String(value || "");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function slug(value) {
    return String(value || "sefirah-card").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  function escapeXml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toast(message) {
    const element = $("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("show"), 2600);
  }
})();
