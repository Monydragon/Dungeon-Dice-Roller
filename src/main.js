const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;

const narratorSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const speechEngine = narratorSupported ? window.speechSynthesis : null;
const APP_SETTINGS_KEY = "ddr-app-settings";
const narratorVoiceKeywords = {
    female: ["female", "woman", "zira", "samantha", "victoria", "ava", "allison", "aria", "jenny", "joanna", "karen", "moira", "salli", "serena", "emma"],
    male: ["male", "man", "david", "mark", "daniel", "alex", "fred", "arthur", "brian", "george", "james", "oliver", "ryan", "steven", "tom", "guy", "matthew"]
};

let narratorEnabled = false;
let narratorVoiceStyle = "female";
let narratorVoiceId = "";
let selectedNarratorVoice = null;
let virtualDiceEnabled = true;
let virtualDiceDockTimeoutId = null;
let virtualDiceHideTimeoutId = null;
let activeActionResolver = null;
let actionInputEnterHandler = null;

const CLASSIC_BASE_HP = 30;
const CLASSIC_ROOM_GOAL = 10;
const VIRTUAL_DICE_HIDE_DELAY = 2400;

const classicDiceOptions = [4, 6, 8, 10, 12, 20, 100];
const classicAdjectives = [
    "feral", "shadowy", "hulking", "venomous", "undead", "flaming", "crystalline", "cursed",
    "frostbitten", "ragged", "ironclad", "howling", "ashen", "thorned", "ravenous", "bloodstained",
    "storm-marked", "sunken", "bone-plated", "mistbound", "moon-eyed", "scarred", "rotting", "shrieking",
    "obsidian", "moldering", "glittering", "grim", "spiteful", "slavering", "runed", "lurching",
    "oozing", "barbed", "ember-eyed", "mud-caked", "fanged", "sable", "twisted", "warped",
    "pale", "brutal", "hollow", "gloom-soaked", "maddened", "brambled", "carrion-fed", "witch-lit",
    "blighted", "shattered", "hidebound", "sly", "stone-skinned", "graveborn", "charred", "echoing",
    "grimy", "serrated", "acid-spitting", "storm-touched", "netherbound", "smoke-wreathed", "glass-jawed", "vicious",
    "lurking", "dire", "clockwork", "plague-ridden", "sorrowful", "void-touched", "root-choked", "marrow-hungry",
    "drowned", "gilded", "reeking", "nightmarish", "hissing", "tremor-born", "lantern-eyed", "rift-torn"
];
const classicMonsters = [
    "Goblin", "Orc", "Skeleton", "Slime", "Troll", "Mimic", "Cultist", "Banshee", "Golem",
    "Kobold", "Ghoul", "Wraith", "Ogre", "Harpy", "Lizardfolk", "Gnoll", "Imp", "Dryad",
    "Warg", "Specter", "Hobgoblin", "Bugbear", "Drake", "Wyvernling", "Ooze", "Carrion Crawler",
    "Necromancer", "Warlock", "Bandit Captain", "Rat Swarm", "Spider Brood", "Stone Gargoyle", "Animated Armor", "Dark Acolyte",
    "Bog Witch", "Feral Hound", "Cave Serpent", "Shadow Stalker", "Bone Knight", "Crypt Beetle", "Mire Hag", "Ice Revenant",
    "Fire Sprite", "Storm Wisp", "Moon Wolf", "Ash Ghul", "Grave Hound", "Tunnel Worm", "Blood Bat", "Rotting Giant",
    "Clockwork Sentinel", "Fungal Horror", "Marsh Hydra", "Rift Imp", "Cinder Drake", "Scarecrow", "Plague Monk", "Dread Pirate",
    "Sewer Mutant", "Cave Fisher", "Hook Horror", "Moon Cultist", "Frost Ogre", "Sand Wraith", "Soul Leech", "Vampire Thrall",
    "Corrupted Treant", "Rogue Automaton", "Deep One", "Grave Templar", "Maggot King", "Mirror Shade", "Ruin Minotaur", "Shambling Vine",
    "Hellhound", "Bone Oracle", "Swamp Troll", "Murk Elemental", "Cursed Falconer", "Blind Cyclops", "Dusk Assassin", "Iron Colossus",
    "Coffin Lurker", "Moth Prophet", "Chain Devil", "Kraken Spawn", "Raven Knight", "Widow Spider", "Salt Ghast", "Thorn Beast", "Drowned Sailor"
];
const classicRoomTypes = [
    "damp cave", "ruined library", "royal tomb", "torture chamber", "crystal cavern", "sunken shrine",
    "collapsed barracks", "forgotten armory", "fungal grotto", "abandoned chapel", "flooded crypt", "echoing hall",
    "bone pit", "ash-covered forge", "moonlit cistern", "sealed treasury", "cursed nursery", "watchtower cellar",
    "smuggler tunnel", "witch's pantry", "sacrificial altar room", "collapsed observatory", "rotting banquet hall", "thorn-choked courtyard",
    "gravekeeper's den", "idol chamber", "storm-battered bridge", "mosaic sanctum", "buried prison", "iron foundry",
    "mirror gallery", "rotted theater", "frozen vault", "hanging garden", "dusty scriptorium", "ritual bathhouse",
    "broken throne room", "candlelit catacomb", "copper pumping station", "maze of roots", "mildewed dormitory", "collapsed mine shaft",
    "echo vault", "gutter shrine", "spider hatchery", "briar chapel", "submerged archive", "clockwork workshop",
    "ossuary hall", "moonwell chamber", "quarantine ward", "infernal kiln", "storm drain nexus", "salt cellar",
    "shattered courtroom", "foggy kennels", "brass conservatory", "lantern storehouse", "grave orchard", "haunted gallery"
];
const classicTraps = [
    "tripwire", "poison dart trap", "pitfall", "swinging axe", "magic rune", "collapsing ceiling",
    "snare net", "spiked portcullis", "flame jet", "freezing sigil", "acid spray", "whispering curse",
    "alarm bell wire", "falling cage", "blade pendulum", "sleep gas vent", "false floor", "rolling boulder",
    "lightning coil", "necrotic glyph", "scything chain", "hidden caltrops", "boiling tar chute", "spirit tether",
    "exploding idol", "iron jaw clamp", "poison needle lock", "floodgate release", "shatterglass tiles", "mirror hex",
    "dart statue", "smoke bomb tripline", "bone spike launcher", "crushing wall", "grease chute", "summoning seal",
    "stone hand snare", "grave dust burst", "hook chain", "arcane mine", "collar snare", "rot gas pocket",
    "lava vent", "thunder sigil", "razor wire hallway", "spring lance", "spore cloud", "blood ward",
    "phantom lure", "mimic chest latch", "corrosive mist", "chain noose", "gravity well", "rune brand",
    "ice slick curse", "sand collapse", "howling ward", "shock lattice", "curse mirror", "golem alarm"
];

const statOrder = [
    { key: "str", label: "Strength", short: "STR" },
    { key: "dex", label: "Dexterity", short: "DEX" },
    { key: "con", label: "Constitution", short: "CON" },
    { key: "int", label: "Intelligence", short: "INT" },
    { key: "wis", label: "Wisdom", short: "WIS" },
    { key: "cha", label: "Charisma", short: "CHA" }
];

const difficultyConfigs = {
    story: {
        label: "Story",
        description: "You can fail, but there is no death and no lasting loss. The story keeps moving.",
        classic: {
            hpBonus: 6,
            dcMod: -2,
            damageMultiplier: 0,
            rewardMultiplier: 1.1,
            rerollStart: 0,
            rerollCap: 0,
            rerollEarnChance: 0,
            failForward: true,
            endless: false
        },
        full: {
            dcMod: -2,
            damageMultiplier: 0,
            rewardMultiplier: 1.1,
            rerollStart: 0,
            rerollCap: 0,
            rerollEarnChance: 0,
            failForward: true,
            noDeath: true,
            endless: false,
            chapterGoal: 4
        }
    },
    easy: {
        label: "Easy",
        description: "You can die, but you start with a full three-stack reroll pool and take softer hits.",
        classic: {
            hpBonus: 4,
            dcMod: -1,
            damageMultiplier: 0.82,
            rewardMultiplier: 1,
            rerollStart: 3,
            rerollCap: 3,
            rerollEarnChance: 0.38,
            failForward: false,
            endless: false
        },
        full: {
            dcMod: -1,
            damageMultiplier: 0.82,
            rewardMultiplier: 1,
            rerollStart: 3,
            rerollCap: 3,
            rerollEarnChance: 0.38,
            failForward: false,
            noDeath: false,
            endless: false,
            chapterGoal: 6
        }
    },
    normal: {
        label: "Normal",
        description: "Baseline pacing with earned rerolls from strong play and solid chapter clears.",
        classic: {
            hpBonus: 0,
            dcMod: 0,
            damageMultiplier: 1,
            rewardMultiplier: 1,
            rerollStart: 0,
            rerollCap: 2,
            rerollEarnChance: 0.22,
            failForward: false,
            endless: false
        },
        full: {
            dcMod: 0,
            damageMultiplier: 1,
            rewardMultiplier: 1,
            rerollStart: 0,
            rerollCap: 2,
            rerollEarnChance: 0.22,
            failForward: false,
            noDeath: false,
            endless: false,
            chapterGoal: 8
        }
    },
    hard: {
        label: "Hard",
        description: "No rerolls. Failures hit harder, but successful scenes and treasure pay out more.",
        classic: {
            hpBonus: -2,
            dcMod: 2,
            damageMultiplier: 1.35,
            rewardMultiplier: 1.45,
            rerollStart: 0,
            rerollCap: 0,
            rerollEarnChance: 0,
            failForward: false,
            endless: false
        },
        full: {
            dcMod: 2,
            damageMultiplier: 1.4,
            rewardMultiplier: 1.45,
            rerollStart: 0,
            rerollCap: 0,
            rerollEarnChance: 0,
            failForward: false,
            noDeath: false,
            endless: false,
            chapterGoal: 16
        }
    },
    endless: {
        label: "Endless",
        description: "The crawl or chapter loop never stops. Difficulty slowly climbs while progression carries forward.",
        classic: {
            hpBonus: 2,
            dcMod: 1,
            damageMultiplier: 1.1,
            rewardMultiplier: 1.2,
            rerollStart: 1,
            rerollCap: 2,
            rerollEarnChance: 0.2,
            failForward: false,
            endless: true
        },
        full: {
            dcMod: 1,
            damageMultiplier: 1.1,
            rewardMultiplier: 1.2,
            rerollStart: 1,
            rerollCap: 2,
            rerollEarnChance: 0.2,
            failForward: false,
            noDeath: false,
            endless: true,
            chapterGoal: null
        }
    }
};

const screenEls = {
    menu: document.getElementById("menu-screen"),
    story: document.getElementById("story-screen"),
    playground: document.getElementById("playground-screen"),
    options: document.getElementById("options-screen")
};

const headerEl = document.getElementById("header");
const mainContentEl = document.getElementById("main-content");
const modeKickerEl = document.getElementById("mode-kicker");
const modeTitleEl = document.getElementById("mode-title");
const modeSubtitleEl = document.getElementById("mode-subtitle");
const statsEl = document.getElementById("stats");
const storyLogEl = document.getElementById("story-log");
const controlsEl = document.getElementById("controls");
const audioToggleBtn = document.getElementById("audio-toggle-btn");
const narratorToggleBtn = document.getElementById("narrator-toggle-btn");
const menuBtn = document.getElementById("menu-btn");
const restartAnytimeBtn = document.getElementById("restart-anytime-btn");
const menuChoiceEls = Array.from(document.querySelectorAll("[data-mode-choice]"));
const difficultyChoiceEls = Array.from(document.querySelectorAll("[data-difficulty-choice]"));
const difficultyDescriptionEl = document.getElementById("difficulty-description");

const adventureBadgeEl = document.getElementById("adventure-badge");
const adventureTitleEl = document.getElementById("adventure-title");
const adventureTextEl = document.getElementById("adventure-text");
const adventureHelperEl = document.getElementById("adventure-helper");
const adventureSummaryEl = document.getElementById("adventure-summary");
const adventurePanelEl = document.getElementById("adventure-panel");
const adventureInputWrapEl = document.getElementById("adventure-input-wrap");
const adventureInputLabelEl = document.getElementById("adventure-input-label");
const adventureNumberInputEl = document.getElementById("adventure-number-input");
const adventureActionsEl = document.getElementById("adventure-actions");

const playgroundDieEls = Array.from(document.querySelectorAll("[data-die-option]"));
const playgroundModifierEl = document.getElementById("playground-modifier");
const playgroundRollBtn = document.getElementById("playground-roll-btn");
const playgroundResultEl = document.getElementById("playground-result");
const playgroundHistoryEl = document.getElementById("playground-history");
const optionsVirtualDiceToggleEl = document.getElementById("options-virtual-dice-toggle");
const narratorVoiceStatusEl = document.getElementById("narrator-voice-status");
const narratorVoiceInputEls = Array.from(document.querySelectorAll('input[name="narrator-voice"]'));
const narratorVoiceSelectEl = document.getElementById("narrator-voice-select");
const narratorVoicePrevBtn = document.getElementById("narrator-voice-prev-btn");
const narratorVoiceNextBtn = document.getElementById("narrator-voice-next-btn");
const narratorVoicePreviewBtn = document.getElementById("narrator-voice-preview-btn");

const virtualDiceStageEl = document.getElementById("virtual-dice-stage");
const virtualDieEl = document.getElementById("virtual-die");
const virtualDieLabelEl = document.getElementById("virtual-die-label");
const virtualDieValueEl = document.getElementById("virtual-die-value");
const virtualRollResultsEl = document.getElementById("virtual-roll-results");
const virtualRollNoteEl = document.getElementById("virtual-roll-note");

const appState = {
    currentMode: "menu",
    runToken: 0,
    selectedDifficulty: "normal",
    classic: null,
    full: null,
    playground: null
};

function createClassicState(difficultyKey = "normal") {
    const maxHp = getClassicMaxHp(difficultyKey);
    const config = getDifficultyConfig(difficultyKey).classic;

    return {
        difficultyKey,
        maxHp,
        hp: maxHp,
        currentRoom: 0,
        gameOver: false,
        currentEncounter: null,
        isRollPending: false,
        rerolls: config.rerollStart,
        pendingFailure: null,
        lastRollSummary: ""
    };
}

function createFullState(difficultyKey = "normal") {
    const config = getDifficultyConfig(difficultyKey).full;

    return {
        difficultyKey,
        phase: "idle",
        chapterComplete: false,
        chapter: 1,
        totalChapters: config.chapterGoal,
        gameOver: false,
        rerolls: config.rerollStart,
        route: [],
        recentLeadIds: [],
        currentDistrictId: null,
        character: createFullCharacter()
    };
}

function createFullCharacter() {
    return {
        name: "Nameless Wanderer",
        background: "Unclaimed",
        origin: "Unmoored",
        boon: "None",
        startLocation: "Unknown Road",
        startLocationId: null,
        calling: "Unknown",
        className: "Unchosen",
        gold: 0,
        inventory: [],
        stats: statOrder.reduce((accumulator, stat) => {
            accumulator[stat.key] = null;
            return accumulator;
        }, {}),
        hp: null,
        maxHp: null
    };
}

function createPlaygroundState() {
    return {
        selectedDie: 20,
        modifier: 0,
        lastRoll: null,
        history: []
    };
}

appState.classic = createClassicState("normal");
appState.full = createFullState("normal");
appState.playground = createPlaygroundState();

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = randomInt(0, index);
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
}

function pickDistinctItems(items, count) {
    return shuffleArray([...new Set(items)]).slice(0, Math.max(0, count));
}

function findById(items, id) {
    return items.find(item => item.id === id) || null;
}

function resolveTemplateText(templateOrTemplates, context = {}) {
    if (!templateOrTemplates) return "";

    const template = Array.isArray(templateOrTemplates)
        ? randomFrom(templateOrTemplates)
        : templateOrTemplates;

    return String(template)
        .replace(/\{(\w+)\}/g, (_match, key) => {
            const value = context[key];
            return value == null ? "" : String(value);
        })
        .replace(/\s+/g, " ")
        .trim();
}

function rollDie(maxDie) {
    return Math.floor(Math.random() * maxDie) + 1;
}

function abilityModifier(score) {
    if (typeof score !== "number") return 0;
    return Math.floor((score - 10) / 2);
}

function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function buildCheckSummary(roll, modifier, total, dc) {
    const modifierChunk = modifier === 0 ? "" : ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)}`;
    return `d20 ${roll}${modifierChunk} = ${total} against DC ${dc}.`;
}

function formatStatValue(score) {
    return typeof score === "number" ? String(score) : "--";
}

function truncateText(value, maxLength = 24) {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function buildInventorySummary(items = [], gold = 0, maxItems = 3) {
    const previewItems = items
        .slice(0, maxItems)
        .map(item => truncateText(item, 18));
    const extraCount = Math.max(0, items.length - previewItems.length);
    const itemText = extraCount > 0
        ? `${previewItems.join(", ")}, +${extraCount} more`
        : previewItems.join(", ");

    if (itemText) {
        return gold > 0 ? `${itemText} | ${gold} gold` : itemText;
    }

    return gold > 0 ? `${gold} gold` : "Nothing";
}

function buildFullStatSummary(character) {
    return statOrder
        .map(stat => `${stat.short} ${formatStatValue(character.stats[stat.key])}`)
        .join(" | ");
}

function getHighestStat(character) {
    let best = statOrder[0];

    for (const stat of statOrder) {
        const bestScore = character.stats[best.key] ?? Number.NEGATIVE_INFINITY;
        const currentScore = character.stats[stat.key] ?? Number.NEGATIVE_INFINITY;

        if (currentScore > bestScore) {
            best = stat;
        }
    }

    return best;
}

function recalculateFullCharacter(character) {
    if (typeof character.stats.con !== "number") return;

    const nextMaxHp = Math.max(6, 10 + abilityModifier(character.stats.con));

    if (character.maxHp == null) {
        character.maxHp = nextMaxHp;
        character.hp = nextMaxHp;
        return;
    }

    const hpDifference = character.maxHp - (character.hp ?? character.maxHp);
    character.maxHp = nextMaxHp;
    character.hp = Math.max(1, nextMaxHp - hpDifference);
}

function addInventory(character, items) {
    for (const item of items) {
        if (!character.inventory.includes(item)) {
            character.inventory.push(item);
        }
    }
}

function getDifficultyConfig(key = appState.selectedDifficulty) {
    return difficultyConfigs[key] || difficultyConfigs.normal;
}

function getClassicMaxHp(difficultyKey) {
    return CLASSIC_BASE_HP + getDifficultyConfig(difficultyKey).classic.hpBonus;
}

function getFullChapterGoal(difficultyKey) {
    return getDifficultyConfig(difficultyKey).full.chapterGoal;
}

function getFullCampaignLengthText(difficultyKey) {
    const config = getDifficultyConfig(difficultyKey).full;

    if (config.endless) {
        return "Endless campaign. The chapter loop never closes.";
    }

    if (config.chapterGoal === 8) {
        return "An 8-chapter campaign tuned for about an hour of play.";
    }

    if (config.chapterGoal === 16) {
        return "A 16-chapter campaign tuned for about two hours of play.";
    }

    return `${config.chapterGoal}-chapter campaign with persistent character progression.`;
}

function getFullJourneyLabel(state) {
    return state.totalChapters
        ? `Chapter ${state.chapter}/${state.totalChapters}`
        : `Chapter ${state.chapter} | Endless`;
}

function getFullDistrictById(id) {
    return findById(fullDistricts, id) || fullDistricts[0];
}

function buildFullDistrictCycle(lastDistrictId = null) {
    const cycle = shuffleArray(fullDistricts.map(district => district.id));

    if (lastDistrictId == null) {
        return cycle;
    }

    const firstDifferentIndex = cycle.findIndex(districtId => districtId !== lastDistrictId);
    if (firstDifferentIndex > 0) {
        [cycle[0], cycle[firstDifferentIndex]] = [cycle[firstDifferentIndex], cycle[0]];
    }

    return cycle;
}

function ensureFullRouteLength(state, requiredLength = state.chapter) {
    if (!state.route.length) {
        state.route.push(state.character.startLocationId || fullDistricts[0].id);
    }

    while (state.route.length < requiredLength) {
        const cycle = buildFullDistrictCycle(state.route[state.route.length - 1]);

        for (const districtId of cycle) {
            if (state.route.length >= requiredLength) {
                break;
            }

            if (districtId === state.route[state.route.length - 1]) {
                continue;
            }

            state.route.push(districtId);
        }
    }
}

function getFullChapterDistrict(chapter, route = []) {
    const districtId = route[chapter - 1];
    if (districtId) {
        return getFullDistrictById(districtId);
    }

    return fullDistricts[(chapter - 1) % fullDistricts.length];
}

function getFullChapterScale(chapter) {
    return Math.floor((chapter - 1) / 2);
}

function materializeRewardTemplate(rewardTemplate = {}, context = {}) {
    const hasInventoryPool = Array.isArray(rewardTemplate.inventoryPool);
    const sourceItems = hasInventoryPool
        ? rewardTemplate.inventoryPool
        : (rewardTemplate.inventory || []);
    const resolvedItems = sourceItems
        .map(item => resolveTemplateText(item, context))
        .filter(Boolean);
    const gold = Array.isArray(rewardTemplate.goldRange)
        ? randomInt(rewardTemplate.goldRange[0], rewardTemplate.goldRange[1])
        : (rewardTemplate.gold || 0);
    const healing = Array.isArray(rewardTemplate.healingRange)
        ? randomInt(rewardTemplate.healingRange[0], rewardTemplate.healingRange[1])
        : (rewardTemplate.healing || 0);
    const rerolls = rewardTemplate.rerolls || 0;

    const inventory = hasInventoryPool
        ? pickDistinctItems(
            resolvedItems,
            Math.min(
                resolvedItems.length,
                Array.isArray(rewardTemplate.inventoryCount)
                    ? randomInt(rewardTemplate.inventoryCount[0], rewardTemplate.inventoryCount[1])
                    : (rewardTemplate.inventoryCount || 1)
            )
        )
        : [...new Set(resolvedItems)];

    return { gold, healing, inventory, rerolls };
}

function buildNpcName() {
    return `${randomFrom(fullNpcFirstNames)} ${randomFrom(fullNpcEpithets)}`;
}

function generateRandomWandererName() {
    return `${randomFrom(fullNpcFirstNames)} ${randomFrom(fullNpcEpithets)}`;
}

function normalizeCharacterName(value) {
    return value
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 28);
}

function buildFullChapterContext(state) {
    ensureFullRouteLength(state, state.chapter);

    const district = getFullChapterDistrict(state.chapter, state.route);
    const baseContext = {
        district: district.label,
        districtId: district.id,
        districtDetail: district.detail,
        faction: randomFrom(fullFactionNames),
        threat: randomFrom(fullChapterThreats),
        contact: buildNpcName(),
        name: state.character.name
    };

    return {
        ...baseContext,
        weather: resolveTemplateText(randomFrom(fullChapterWeathers), baseContext),
        pressure: resolveTemplateText(randomFrom(fullChapterPressures), baseContext),
        objective: resolveTemplateText(randomFrom(fullChapterObjectives), baseContext),
        omen: resolveTemplateText(randomFrom(fullChapterOmens), baseContext),
        rumor: resolveTemplateText(randomFrom(fullRumorTemplates), baseContext)
    };
}

function selectFullLeadTemplates(state, count = 3) {
    const recentLeadIds = state.recentLeadIds.slice(-4);
    const fresh = shuffleArray(fullLeadTemplates.filter(template => !recentLeadIds.includes(template.id)));
    const fallback = shuffleArray(fullLeadTemplates.filter(template => recentLeadIds.includes(template.id)));
    return [...fresh, ...fallback].slice(0, count);
}

function materializeFullScene(template, context, options = {}) {
    const sceneContext = {
        ...context,
        contact: buildNpcName(),
        rival: buildNpcName(),
        witness: buildNpcName()
    };

    return {
        id: template.id,
        label: resolveTemplateText(template.label, sceneContext),
        title: resolveTemplateText(template.title, sceneContext),
        summary: resolveTemplateText(template.summary, sceneContext),
        text: resolveTemplateText(template.text, sceneContext),
        statKey: template.statKey,
        dc: template.dc,
        damage: template.damage,
        calling: Array.isArray(template.calling) ? randomFrom(template.calling) : template.calling,
        success: resolveTemplateText(template.success, sceneContext),
        fail: resolveTemplateText(template.fail, sceneContext),
        epilogue: resolveTemplateText(template.epilogue, sceneContext),
        rewards: materializeRewardTemplate(template.rewards, sceneContext),
        followups: options.includeFollowups === false
            ? []
            : (template.followups || []).map(followup => materializeFullScene(followup, sceneContext, { includeFollowups: false }))
    };
}

function applyFullRewardBundle(rewards = {}, context = {}) {
    const state = appState.full;
    const config = getDifficultyConfig(state.difficultyKey).full;
    const bundle = materializeRewardTemplate(rewards, context);
    const { character } = state;
    let grantedRerolls = 0;

    addInventory(character, bundle.inventory);
    character.gold += bundle.gold;

    if (bundle.healing > 0 && character.maxHp != null) {
        character.hp = Math.min(character.maxHp, character.hp + bundle.healing);
    }

    if (bundle.rerolls > 0 && config.rerollCap > 0) {
        const nextRerolls = Math.min(config.rerollCap, state.rerolls + bundle.rerolls);
        grantedRerolls = nextRerolls - state.rerolls;
        state.rerolls = nextRerolls;
    }

    return {
        ...bundle,
        rerolls: grantedRerolls
    };
}

function addLog(text, cssClass, options = {}) {
    const { narrate = false, narrationText = text } = options;
    const entryEl = document.createElement("div");
    entryEl.className = `log-entry ${cssClass}`;
    entryEl.textContent = text;
    storyLogEl.appendChild(entryEl);
    storyLogEl.scrollTo({ top: storyLogEl.scrollHeight, behavior: "smooth" });

    if (narrate) {
        speakNarration(narrationText);
    }
}

function clearStoryLog() {
    storyLogEl.innerHTML = "";
}

function renderStats(items = []) {
    statsEl.innerHTML = "";

    if (!items.length) {
        statsEl.hidden = true;
        return;
    }

    for (const item of items) {
        const cardEl = document.createElement("div");
        cardEl.className = `stat-card${item.tone ? ` ${item.tone}` : ""}`;

        const labelEl = document.createElement("span");
        labelEl.className = "stat-card-label";
        labelEl.textContent = item.label;

        const valueEl = document.createElement("span");
        valueEl.className = "stat-card-value";
        valueEl.textContent = item.value;

        cardEl.append(labelEl, valueEl);
        statsEl.appendChild(cardEl);
    }

    statsEl.hidden = false;
}

function renderDifficultySelector() {
    const config = getDifficultyConfig(appState.selectedDifficulty);

    difficultyChoiceEls.forEach(button => {
        const isSelected = button.dataset.difficultyChoice === appState.selectedDifficulty;
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
    });

    difficultyDescriptionEl.textContent = config.description;
}

function renderClassicStats() {
    const state = appState.classic;
    const difficulty = getDifficultyConfig(state.difficultyKey);
    const depthText = difficulty.classic.endless
        ? `Depth ${state.currentRoom}`
        : `${state.currentRoom}/${CLASSIC_ROOM_GOAL}`;

    renderStats([
        { label: "Mode", value: "Classic Adventure" },
        { label: "Difficulty", value: difficulty.label, tone: "warn" },
        { label: "HP", value: `${Math.max(0, state.hp)}/${state.maxHp}`, tone: "hp" },
        { label: "Depth", value: depthText, tone: "depth" },
        { label: "Rerolls", value: state.rerolls > 0 ? String(state.rerolls) : "None", tone: state.rerolls > 0 ? "success" : "" }
    ]);
}

function renderFullStats() {
    const state = appState.full;
    const difficulty = getDifficultyConfig(state.difficultyKey);
    const { character } = state;
    const journeyText = getFullJourneyLabel(state);
    const backgroundText = [character.background, character.origin]
        .filter(value => value && !["Unclaimed", "Unmoored"].includes(value))
        .map(value => truncateText(value, 18))
        .join(" | ") || "Unclaimed";
    const startText = [character.startLocation, character.boon]
        .filter(value => value && !["Unknown Road", "None"].includes(value))
        .map(value => truncateText(value, 18))
        .join(" | ") || "Unchosen";
    const gearText = buildInventorySummary(character.inventory, character.gold);
    const hpText = character.maxHp != null && character.hp != null
        ? `${Math.max(0, character.hp)}/${character.maxHp}`
        : "Unrolled";

    renderStats([
        { label: "Name", value: character.name },
        { label: "Difficulty", value: difficulty.label, tone: "warn" },
        { label: "Journey", value: journeyText, tone: "depth" },
        { label: "Background", value: backgroundText },
        { label: "Start", value: startText },
        { label: "Calling", value: character.calling, tone: "success" },
        { label: "HP", value: hpText, tone: "hp" },
        { label: "Rerolls", value: state.rerolls > 0 ? String(state.rerolls) : "None", tone: state.rerolls > 0 ? "success" : "" },
        { label: "Stats", value: buildFullStatSummary(character) },
        { label: "Gear", value: gearText }
    ]);
}

function renderPlaygroundStats() {
    const state = appState.playground;
    const lastRoll = state.lastRoll
        ? `${state.lastRoll.total} total`
        : "No roll yet";

    renderStats([
        { label: "Mode", value: "Dice Playground" },
        { label: "Selected Die", value: `d${state.selectedDie}`, tone: "depth" },
        { label: "Modifier", value: formatModifier(state.modifier) },
        { label: "Last Result", value: lastRoll, tone: "success" }
    ]);
}

function playTone(freq, type, duration, volume = 0.1) {
    if (isMuted) return;
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

function soundRoll() {
    playTone(400, "square", 0.05, 0.05);
    setTimeout(() => playTone(600, "square", 0.05, 0.05), 50);
    setTimeout(() => playTone(500, "square", 0.08, 0.05), 100);
}

function soundSuccess() {
    playTone(440, "sine", 0.1);
    setTimeout(() => playTone(554, "sine", 0.1), 100);
    setTimeout(() => playTone(659, "sine", 0.3), 200);
}

function soundDamage() {
    playTone(150, "sawtooth", 0.2, 0.2);
    setTimeout(() => playTone(100, "sawtooth", 0.3, 0.2), 150);
}

function setModeBanner(kicker, title, subtitle) {
    modeKickerEl.textContent = kicker;
    modeTitleEl.textContent = title;
    modeSubtitleEl.textContent = subtitle;
    document.title = title === "Dungeon Dice Roller"
        ? "Dungeon Dice Roller"
        : `Dungeon Dice Roller | ${title}`;
}

function showScreen(name) {
    Object.entries(screenEls).forEach(([key, element]) => {
        element.hidden = key !== name;
    });

    resetViewportPositions();
    requestAnimationFrame(syncVirtualDicePlacement);
}

function setControlsVisible(isVisible) {
    if (!controlsEl) return;
    controlsEl.hidden = !isVisible;
}

function setRestartButton(hidden, label = "Restart") {
    restartAnytimeBtn.hidden = hidden;
    restartAnytimeBtn.textContent = label;
}

function shouldAutoFocusActionInput() {
    return !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
}

function resetViewportPositions() {
    const scrollingEl = document.scrollingElement;

    if (scrollingEl) {
        scrollingEl.scrollTop = 0;
        scrollingEl.scrollLeft = 0;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mainContentEl.scrollTop = 0;
    mainContentEl.scrollLeft = 0;
    storyLogEl.scrollTop = 0;
    adventurePanelEl.scrollTop = 0;
}

function updateNavigationState() {
    const onMenu = appState.currentMode === "menu";

    menuBtn.hidden = onMenu;
    menuBtn.disabled = onMenu;

    if (appState.currentMode === "classic") {
        setRestartButton(false, "Restart Classic");
    } else if (appState.currentMode === "full") {
        setRestartButton(false, "Restart Full Adventure");
    } else if (appState.currentMode === "playground") {
        setRestartButton(false, "Clear Playground");
    } else {
        setRestartButton(true);
    }
}

function triggerVisualEffect(type) {
    if (type === "damage") {
        document.body.classList.remove("shake");
        void document.body.offsetWidth;
        document.body.classList.add("shake");
        return;
    }

    if (type === "success") {
        storyLogEl.classList.remove("flash-green");
        void storyLogEl.offsetWidth;
        storyLogEl.classList.add("flash-green");
    }
}

function saveSettings() {
    try {
        localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify({
            narratorEnabled,
            narratorVoiceStyle,
            narratorVoiceId,
            virtualDiceEnabled,
            selectedDifficulty: appState.selectedDifficulty
        }));
    } catch (error) {
        console.warn("Unable to save settings.", error);
    }
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem(APP_SETTINGS_KEY);
        if (!savedSettings) return;

        const parsedSettings = JSON.parse(savedSettings);
        narratorEnabled = parsedSettings.narratorEnabled === true;
        narratorVoiceStyle = ["female", "male", "all"].includes(parsedSettings.narratorVoiceStyle)
            ? parsedSettings.narratorVoiceStyle
            : "female";
        narratorVoiceId = typeof parsedSettings.narratorVoiceId === "string"
            ? parsedSettings.narratorVoiceId
            : "";
        virtualDiceEnabled = parsedSettings.virtualDiceEnabled !== false;

        if (difficultyConfigs[parsedSettings.selectedDifficulty]) {
            appState.selectedDifficulty = parsedSettings.selectedDifficulty;
        }
    } catch (error) {
        console.warn("Unable to load settings.", error);
    }
}

function getNarratorVoiceId(voice) {
    if (!voice) return "";
    return `${voice.voiceURI || voice.name}::${voice.lang}`;
}

function getNarratorVoicePlaybackProfile(voice = selectedNarratorVoice) {
    const category = getNarratorVoiceCategory(voice);

    if (category === "male") {
        return { rate: 0.94, pitch: 0.86 };
    }

    if (category === "female") {
        return { rate: 1.02, pitch: 1.12 };
    }

    return { rate: 0.98, pitch: 1 };
}

function findNarratorVoiceById(voiceId, voices) {
    if (!voiceId) return null;
    return voices.find(voice => getNarratorVoiceId(voice) === voiceId) || null;
}

function getNarratorVoicesForStyle(style = narratorVoiceStyle) {
    const voices = getSortedNarratorVoices(style);

    if (style === "all") {
        return voices;
    }

    const matching = voices.filter(voice => getNarratorVoiceCategory(voice) === style);
    const neutral = voices.filter(voice => getNarratorVoiceCategory(voice) === "neutral");

    return matching.length ? [...matching, ...neutral] : voices;
}

function buildNarratorVoiceLabel(voice) {
    const labels = [];

    if (voice.default) labels.push("default");
    if (voice.localService) labels.push("local");

    return `${voice.name} · ${voice.lang}${labels.length ? ` · ${labels.join(", ")}` : ""}`;
}

function syncNarratorVoiceControls() {
    const styleVoices = getNarratorVoicesForStyle();
    const hasVoices = styleVoices.length > 0;

    narratorVoiceInputEls.forEach(input => {
        input.checked = input.value === narratorVoiceStyle;
        input.disabled = !narratorSupported;
    });

    narratorVoiceSelectEl.disabled = !narratorSupported || !hasVoices;
    narratorVoicePrevBtn.disabled = !narratorSupported || styleVoices.length < 2;
    narratorVoiceNextBtn.disabled = !narratorSupported || styleVoices.length < 2;
    narratorVoicePreviewBtn.disabled = !narratorSupported || !selectedNarratorVoice || isMuted;
    narratorVoicePreviewBtn.title = isMuted
        ? "Turn sound back on to preview narrator voices."
        : "Play a short preview using the selected narrator voice.";
}

function renderNarratorVoicePicker() {
    narratorVoiceSelectEl.innerHTML = "";

    if (!narratorSupported) {
        const unsupportedOption = document.createElement("option");
        unsupportedOption.textContent = "Speech narration is not supported";
        narratorVoiceSelectEl.appendChild(unsupportedOption);
        syncNarratorVoiceControls();
        return;
    }

    const styleVoices = getNarratorVoicesForStyle();

    if (!styleVoices.length) {
        const loadingOption = document.createElement("option");
        loadingOption.textContent = "Loading browser voices...";
        narratorVoiceSelectEl.appendChild(loadingOption);
        syncNarratorVoiceControls();
        return;
    }

    styleVoices.forEach(voice => {
        const optionEl = document.createElement("option");
        optionEl.value = getNarratorVoiceId(voice);
        optionEl.textContent = buildNarratorVoiceOptionLabel(voice);
        narratorVoiceSelectEl.appendChild(optionEl);
    });

    narratorVoiceSelectEl.value = narratorVoiceId;
    syncNarratorVoiceControls();
}

function syncNarratorVoiceSelection() {
    const styleVoices = getNarratorVoicesForStyle();
    selectedNarratorVoice = findNarratorVoiceById(narratorVoiceId, styleVoices) || styleVoices[0] || null;
    narratorVoiceId = getNarratorVoiceId(selectedNarratorVoice);
    renderNarratorVoicePicker();

    if (!narratorSupported) {
        narratorVoiceStatusEl.textContent = "Speech narration is not supported in this browser.";
        return;
    }

    const allVoices = getSortedNarratorVoices("all");

    if (!allVoices.length) {
        narratorVoiceStatusEl.textContent = "Voice list is still loading. Your browser default will be used until it is ready.";
        return;
    }

    const explicitMatches = narratorVoiceStyle === "all"
        ? allVoices.length
        : allVoices.filter(voice => getNarratorVoiceCategory(voice) === narratorVoiceStyle).length;
    const selectedIndex = Math.max(0, styleVoices.findIndex(voice => getNarratorVoiceId(voice) === narratorVoiceId)) + 1;
    const styleLabel = narratorVoiceStyle === "all"
        ? "All browser voices"
        : `${narratorVoiceStyle.charAt(0).toUpperCase()}${narratorVoiceStyle.slice(1)} voices`;

    if (!selectedNarratorVoice) {
        narratorVoiceStatusEl.textContent = `${styleLabel} are available, but the active voice could not be resolved yet.`;
        return;
    }

    if (narratorVoiceStyle !== "all" && explicitMatches === 0) {
        narratorVoiceStatusEl.textContent = `${selectedNarratorVoice.name} (${selectedNarratorVoice.lang}) ${selectedIndex}/${styleVoices.length}. No clearly ${narratorVoiceStyle} voices were detected, so the full browser list is shown.`;
        return;
    }

    narratorVoiceStatusEl.textContent = `${selectedNarratorVoice.name} (${selectedNarratorVoice.lang}) ${selectedIndex}/${styleVoices.length}. ${styleLabel} available in this browser: ${styleVoices.length}.`;
}

function updateAudioToggleLabel() {
    audioToggleBtn.textContent = isMuted ? "Sound Off" : "Sound On";
}

function updateNarratorToggleLabel() {
    if (!narratorSupported) {
        narratorToggleBtn.disabled = true;
        narratorToggleBtn.textContent = "Narrator N/A";
        narratorToggleBtn.title = "Speech narration is not supported in this browser.";
        return;
    }

    narratorToggleBtn.disabled = isMuted;
    narratorToggleBtn.textContent = narratorEnabled
        ? (isMuted ? "Narrator Paused" : "Narrator On")
        : "Narrator Off";
    narratorToggleBtn.title = isMuted
        ? "Turn sound back on to use the narrator."
        : "Toggle spoken narration.";
}

function syncAudioControls() {
    updateAudioToggleLabel();
    updateNarratorToggleLabel();
    syncNarratorVoiceControls();
}

function syncOptionControls() {
    optionsVirtualDiceToggleEl.checked = virtualDiceEnabled;
    syncNarratorVoiceSelection();
}

function getNarratorVoiceDescriptor(voice) {
    if (!voice) return "";
    return `${voice.name} ${voice.voiceURI} ${voice.lang}`.toLowerCase();
}

function getNarratorVoiceCategory(voice) {
    if (!voice) return "neutral";

    const descriptor = getNarratorVoiceDescriptor(voice);
    const femaleMatches = narratorVoiceKeywords.female.filter(keyword => descriptor.includes(keyword)).length;
    const maleMatches = narratorVoiceKeywords.male.filter(keyword => descriptor.includes(keyword)).length;

    if (femaleMatches > maleMatches && femaleMatches > 0) {
        return "female";
    }

    if (maleMatches > femaleMatches && maleMatches > 0) {
        return "male";
    }

    return "neutral";
}

function getSortedNarratorVoices(style = narratorVoiceStyle) {
    if (!narratorSupported) return [];

    const voices = speechEngine.getVoices();
    if (!voices.length) return [];

    const preferredKeywords = narratorVoiceKeywords[style] || [];
    const otherKeywords = narratorVoiceKeywords[style === "female" ? "male" : "female"] || [];

    return [...voices].sort((left, right) => {
        const getScore = voice => {
            const descriptor = getNarratorVoiceDescriptor(voice);
            const category = getNarratorVoiceCategory(voice);
            let score = 0;

            if (/^en-us/i.test(voice.lang)) score += 3;
            else if (/^en/i.test(voice.lang)) score += 2;
            else score -= 1;

            if (voice.localService) score += 1;
            if (voice.default) score += 1;

            if (style === "all") {
                if (category !== "neutral") score += 1;
            } else {
                if (category === style) score += 8;
                else if (category !== "neutral") score -= 4;
                if (preferredKeywords.some(keyword => descriptor.includes(keyword))) score += 4;
                if (otherKeywords.some(keyword => descriptor.includes(keyword))) score -= 2;
            }

            return score;
        };

        const scoreDifference = getScore(right) - getScore(left);
        if (scoreDifference !== 0) return scoreDifference;

        const languageDifference = left.lang.localeCompare(right.lang);
        if (languageDifference !== 0) return languageDifference;

        return left.name.localeCompare(right.name);
    });
}

function buildNarratorVoiceOptionLabel(voice) {
    const labels = [];

    if (voice.default) labels.push("default");
    if (voice.localService) labels.push("local");

    return `${voice.name} | ${voice.lang}${labels.length ? ` | ${labels.join(", ")}` : ""}`;
}

function cycleNarratorVoice(direction) {
    const styleVoices = getNarratorVoicesForStyle();
    if (!styleVoices.length) return;

    const currentIndex = Math.max(0, styleVoices.findIndex(voice => getNarratorVoiceId(voice) === narratorVoiceId));
    const nextIndex = (currentIndex + direction + styleVoices.length) % styleVoices.length;

    narratorVoiceId = getNarratorVoiceId(styleVoices[nextIndex]);
    saveSettings();
    syncNarratorVoiceSelection();

    if (!isMuted) {
        previewNarratorVoice();
    }
}

function previewNarratorVoice() {
    if (!narratorSupported || !selectedNarratorVoice || isMuted) return;

    speakNarration(`Voice preview. ${getNarrationPreview()}`, {
        force: true,
        voice: selectedNarratorVoice
    });
}

function canNarrate() {
    return narratorSupported && narratorEnabled && !isMuted;
}

function stopNarration() {
    if (speechEngine) {
        speechEngine.cancel();
    }
}

function speakNarration(text, options = {}) {
    const { force = false, voice = selectedNarratorVoice } = options;

    if (!force && !canNarrate()) return;
    if (!narratorSupported || isMuted) return;

    const narration = String(text || "")
        .replace(/[^\x00-\x7F]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!narration) return;

    stopNarration();

    const utterance = new SpeechSynthesisUtterance(narration);
    if (voice) {
        utterance.voice = voice;
    }
    utterance.lang = voice?.lang || "en-US";

    const playbackProfile = getNarratorVoicePlaybackProfile(voice);
    utterance.rate = playbackProfile.rate;
    utterance.pitch = playbackProfile.pitch;
    speechEngine.speak(utterance);
}

function getNarrationPreview() {
    if (appState.currentMode === "classic" && appState.classic.currentEncounter) {
        return appState.classic.currentEncounter.prompt;
    }

    if (appState.currentMode === "full") {
        return "The road into Blackmere waits for your next choice.";
    }

    if (appState.currentMode === "playground") {
        return "The dice tray is ready.";
    }

    return "Choose a mode to begin.";
}

function shouldShowVirtualDice() {
    return virtualDiceEnabled && ["classic", "full", "playground"].includes(appState.currentMode);
}

function clearVirtualRollResults() {
    virtualRollResultsEl.innerHTML = "";
}

function setVirtualRollNote(text = "") {
    virtualRollNoteEl.textContent = text;
    virtualRollNoteEl.hidden = !text;
}

function clearVirtualDiceDockTimeout() {
    if (virtualDiceDockTimeoutId == null) return;

    clearTimeout(virtualDiceDockTimeoutId);
    virtualDiceDockTimeoutId = null;
}

function clearVirtualDiceHideTimeout() {
    if (virtualDiceHideTimeoutId == null) return;

    clearTimeout(virtualDiceHideTimeoutId);
    virtualDiceHideTimeoutId = null;
}

function hideVirtualDiceStage() {
    clearVirtualDiceDockTimeout();
    clearVirtualDiceHideTimeout();
    virtualDiceStageEl.hidden = true;
    virtualDiceStageEl.classList.remove("is-visible", "is-focused", "is-rolling");
    virtualDieEl.classList.remove("is-rolling");
    document.body.classList.remove("has-virtual-dice");
    document.documentElement.style.setProperty("--virtual-dice-reserved-space", "0px");
}

function revealVirtualDiceStage(resetHideTimer = true) {
    if (resetHideTimer) {
        clearVirtualDiceHideTimeout();
    }

    document.body.classList.add("has-virtual-dice");
    virtualDiceStageEl.hidden = false;
    virtualDiceStageEl.classList.add("is-visible");
}

function getVirtualDiceViewportEl() {
    if (appState.currentMode === "classic" || appState.currentMode === "full") {
        return screenEls.story;
    }

    if (appState.currentMode === "playground") {
        return screenEls.playground;
    }

    return mainContentEl;
}

function syncVirtualDicePlacement() {
    if (virtualDiceStageEl.hidden) {
        document.documentElement.style.setProperty("--virtual-dice-reserved-space", "0px");
        return;
    }

    const viewportEl = getVirtualDiceViewportEl();
    const viewportRect = viewportEl?.getBoundingClientRect();
    const headerBottom = headerEl?.getBoundingClientRect().bottom ?? 0;
    const topBound = viewportRect ? viewportRect.top + 12 : headerBottom + 12;
    const bottomBound = viewportRect ? viewportRect.bottom - 12 : window.innerHeight - 12;
    const availableHeight = Math.max(0, bottomBound - topBound);
    const stageHeight = virtualDiceStageEl.offsetHeight || 0;
    const centeredTop = topBound + Math.max(0, (availableHeight - stageHeight) / 2);
    const reservedSpace = Math.max(0, stageHeight + 18);

    document.documentElement.style.setProperty("--virtual-dice-center-top", `${Math.round(centeredTop)}px`);
    document.documentElement.style.setProperty("--virtual-dice-reserved-space", `${Math.round(reservedSpace)}px`);
}

function queueVirtualDiceDock(delay = 280) {
    clearVirtualDiceDockTimeout();

    virtualDiceDockTimeoutId = window.setTimeout(() => {
        virtualDiceDockTimeoutId = null;
        virtualDiceStageEl.classList.remove("is-focused");
        syncVirtualDicePlacement();
    }, delay);
}

function queueVirtualDiceHide(delay = VIRTUAL_DICE_HIDE_DELAY) {
    clearVirtualDiceHideTimeout();

    virtualDiceHideTimeoutId = window.setTimeout(() => {
        virtualDiceHideTimeoutId = null;
        hideVirtualDiceStage();
    }, delay);
}

function appendVirtualRollResult({ label, value, dropped = false }) {
    const chipEl = document.createElement("span");
    chipEl.className = `roll-chip${dropped ? " is-dropped" : ""}`;
    chipEl.textContent = `${label}: ${value}`;
    virtualRollResultsEl.appendChild(chipEl);
    requestAnimationFrame(syncVirtualDicePlacement);
}

function syncVirtualDiceDisplay(maxDie = 20, options = {}) {
    const {
        label = `d${maxDie}`,
        value = "?",
        clearResults = false,
        note,
        reveal = false
    } = options;

    if (!shouldShowVirtualDice()) {
        hideVirtualDiceStage();
        return;
    }

    const wasHidden = virtualDiceStageEl.hidden;
    const shouldReveal = reveal || !virtualDiceStageEl.hidden;

    if (shouldReveal) {
        revealVirtualDiceStage(reveal || wasHidden);
    }

    virtualDiceStageEl.classList.remove("is-rolling");
    virtualDieEl.classList.remove("is-rolling");
    virtualDieEl.dataset.die = String(maxDie);
    virtualDieLabelEl.textContent = label;
    virtualDieValueEl.textContent = String(value);

    if (clearResults) {
        clearVirtualRollResults();
    }

    if (typeof note === "string") {
        setVirtualRollNote(note);
    }

    if (!shouldReveal) {
        return;
    }

    syncVirtualDicePlacement();
    requestAnimationFrame(syncVirtualDicePlacement);
}

function renderVirtualRollBreakdown({ maxDie = 20, label = `d${maxDie}`, value = "?", entries = [], note = "" }) {
    syncVirtualDiceDisplay(maxDie, {
        label,
        value,
        clearResults: true,
        note,
        reveal: true
    });

    entries.forEach(entry => appendVirtualRollResult(entry));
    syncVirtualDicePlacement();
    queueVirtualDiceHide();
}

async function playVirtualRoll(maxDie, finalRoll, activeToken, options = {}) {
    const {
        label = `d${maxDie}`,
        recordLabel = label,
        resetResults = false,
        note = "",
        dropped = false
    } = options;

    if (!shouldShowVirtualDice()) {
        await wait(180);
        return;
    }

    if (resetResults) {
        clearVirtualRollResults();
    }

    if (note) {
        setVirtualRollNote(note);
    }

    clearVirtualDiceDockTimeout();
    syncVirtualDiceDisplay(maxDie, {
        label,
        value: rollDie(maxDie),
        reveal: true
    });

    virtualDiceStageEl.classList.add("is-focused");
    virtualDiceStageEl.classList.add("is-rolling");
    virtualDieEl.classList.add("is-rolling");
    syncVirtualDicePlacement();

    const intervalMs = maxDie === 100 ? 55 : 80;
    const intervalId = setInterval(() => {
        virtualDieValueEl.textContent = String(rollDie(maxDie));
    }, intervalMs);

    await wait(850);

    clearInterval(intervalId);

    if (appState.runToken !== activeToken) {
        virtualDiceStageEl.classList.remove("is-focused");
        syncVirtualDiceDisplay(maxDie, { label });
        return;
    }

    virtualDieValueEl.textContent = String(finalRoll);
    virtualDiceStageEl.classList.remove("is-rolling");
    virtualDieEl.classList.remove("is-rolling");
    appendVirtualRollResult({
        label: recordLabel,
        value: finalRoll,
        dropped
    });
    queueVirtualDiceDock();
    queueVirtualDiceHide();
}

function recordManualRoll(maxDie, roll, note = "") {
    renderVirtualRollBreakdown({
        maxDie,
        label: `d${maxDie}`,
        value: roll,
        entries: [{ label: "Manual", value: roll }],
        note
    });
}

function setActionPanel(config = {}) {
    const {
        badge = "Adventure Panel",
        title = "The next move lands here.",
        text = "The story log keeps the narration. This panel handles the next choice, check, or reroll.",
        helper = "",
        narrate = false,
        narrationText = [title, text, helper].filter(Boolean).join(" ")
    } = config;

    adventureBadgeEl.textContent = badge;
    adventureTitleEl.textContent = title;
    adventureTextEl.textContent = text;
    adventureHelperEl.textContent = helper;
    adventureHelperEl.hidden = !helper;

    if (narrate) {
        speakNarration(narrationText);
    }
}

function setActionSummary(text = "") {
    adventureSummaryEl.textContent = text;
    adventureSummaryEl.hidden = !text;
}

function clearActionButtons() {
    adventureActionsEl.innerHTML = "";
}

function renderActionButtons(actions) {
    clearActionButtons();

    for (const action of actions) {
        const buttonEl = document.createElement("button");
        buttonEl.type = "button";
        buttonEl.className = `action-btn${action.variant ? ` ${action.variant}` : ""}`;
        buttonEl.textContent = action.label;
        buttonEl.disabled = action.disabled === true;
        buttonEl.addEventListener("click", action.onClick);
        adventureActionsEl.appendChild(buttonEl);
    }
}

function showActionInput({
    label,
    min = null,
    max = null,
    placeholder = "",
    value = "",
    disabled = false,
    onEnter,
    inputType = "number",
    inputMode = inputType === "number" ? "numeric" : "text",
    maxLength = null,
    autoCapitalize = "off",
    spellcheck = false
}) {
    adventureInputLabelEl.textContent = label;
    adventureNumberInputEl.type = inputType;
    adventureNumberInputEl.setAttribute("inputmode", inputMode);
    adventureNumberInputEl.placeholder = placeholder;
    adventureNumberInputEl.value = value;
    adventureNumberInputEl.disabled = disabled;
    adventureNumberInputEl.setAttribute("autocapitalize", autoCapitalize);
    adventureNumberInputEl.spellcheck = spellcheck;

    if (min != null) {
        adventureNumberInputEl.min = String(min);
    } else {
        adventureNumberInputEl.removeAttribute("min");
    }

    if (max != null) {
        adventureNumberInputEl.max = String(max);
    } else {
        adventureNumberInputEl.removeAttribute("max");
    }

    if (maxLength != null) {
        adventureNumberInputEl.maxLength = maxLength;
    } else {
        adventureNumberInputEl.removeAttribute("maxlength");
    }

    adventureInputWrapEl.hidden = false;
    actionInputEnterHandler = onEnter || null;

    if (shouldAutoFocusActionInput()) {
        requestAnimationFrame(() => adventureNumberInputEl.focus());
    }
}

function hideActionInput() {
    adventureInputWrapEl.hidden = true;
    adventureNumberInputEl.type = "text";
    adventureNumberInputEl.setAttribute("inputmode", "text");
    adventureNumberInputEl.value = "";
    adventureNumberInputEl.placeholder = "";
    adventureNumberInputEl.disabled = false;
    adventureNumberInputEl.setAttribute("autocapitalize", "off");
    adventureNumberInputEl.spellcheck = false;
    adventureNumberInputEl.removeAttribute("min");
    adventureNumberInputEl.removeAttribute("max");
    adventureNumberInputEl.removeAttribute("maxlength");
    actionInputEnterHandler = null;
}

function resolveActiveAction(result) {
    if (!activeActionResolver) return;

    const resolve = activeActionResolver;
    activeActionResolver = null;
    hideActionInput();
    clearActionButtons();
    resolve(result);
}

function cancelActiveAction() {
    if (!activeActionResolver) {
        hideActionInput();
        clearActionButtons();
        setActionSummary("");
        return;
    }

    const resolve = activeActionResolver;
    activeActionResolver = null;
    hideActionInput();
    clearActionButtons();
    setActionSummary("");
    resolve(null);
}

function openActionShell(config) {
    cancelActiveAction();
    hideActionInput();
    clearActionButtons();
    setActionSummary("");
    setActionPanel({
        ...config,
        narrate: config.narrate !== false
    });

    return new Promise(resolve => {
        activeActionResolver = resolve;
    });
}

async function showInfoAction(config) {
    const promise = openActionShell(config);
    renderActionButtons([
        {
            label: config.buttonLabel || "Continue",
            onClick: () => resolveActiveAction(true)
        }
    ]);
    return promise;
}

async function showChoiceAction(config) {
    const promise = openActionShell(config);
    renderActionButtons(config.choices.map(choice => ({
        label: choice.label,
        variant: choice.variant,
        onClick: () => resolveActiveAction(choice.id)
    })));
    return promise;
}

async function showTextEntryAction(config) {
    const promise = openActionShell(config);

    const commitEntry = () => {
        const rawValue = adventureNumberInputEl.value || "";
        const value = typeof config.normalize === "function"
            ? config.normalize(rawValue)
            : rawValue.trim();
        const error = typeof config.validate === "function"
            ? config.validate(value)
            : "";

        if (error) {
            alert(error);
            return;
        }

        resolveActiveAction(value);
    };

    const applySuggestion = () => {
        if (typeof config.suggestionFactory !== "function") return;

        const suggestion = config.suggestionFactory();
        adventureNumberInputEl.value = suggestion;
        setActionSummary(`Suggested: ${suggestion}`);

        if (shouldAutoFocusActionInput()) {
            requestAnimationFrame(() => {
                adventureNumberInputEl.focus();
                adventureNumberInputEl.select();
            });
        }
    };

    showActionInput({
        label: config.label,
        placeholder: config.placeholder,
        value: config.value || "",
        onEnter: commitEntry,
        inputType: "text",
        inputMode: "text",
        maxLength: config.maxLength || null,
        autoCapitalize: config.autoCapitalize || "words",
        spellcheck: config.spellcheck === true
    });

    renderActionButtons([
        {
            label: config.buttonLabel || "Continue",
            onClick: commitEntry
        },
        ...(typeof config.suggestionFactory === "function"
            ? [{
                label: config.suggestionLabel || "Randomize",
                variant: "secondary",
                onClick: applySuggestion
            }]
            : [])
    ]);

    return promise;
}

async function showStatRollAction(stat, activeToken) {
    const promise = openActionShell({
        badge: "Character Creation",
        title: `Roll ${stat.label}`,
        text: "Use 4d6 and drop the lowest die. Each digital die lands in the tray as it rolls.",
        helper: "Digital rolling shows every die. Physical rolling can still be entered as a final total between 3 and 18."
    });

    const renderInitialActions = () => {
        hideActionInput();
        setActionSummary("");
        renderActionButtons([
            {
                label: "Roll Digitally",
                variant: "secondary",
                onClick: runDigitalRoll
            },
            {
                label: "Use Physical Total",
                variant: "ghost",
                onClick: renderManualEntry
            }
        ]);
    };

    const runDigitalRoll = async () => {
        renderActionButtons([{ label: "Rolling...", disabled: true }]);

        const rolls = [];

        for (let index = 0; index < 4; index += 1) {
            const result = rollDie(6);
            soundRoll();
            await playVirtualRoll(6, result, activeToken, {
                recordLabel: `Die ${index + 1}`,
                resetResults: index === 0,
                note: `Rolling ${stat.label} with 4d6.`
            });

            if (appState.runToken !== activeToken) {
                return;
            }

            rolls.push(result);
            await wait(60);
        }

        const droppedValue = Math.min(...rolls);
        const droppedIndex = rolls.indexOf(droppedValue);
        const total = rolls.reduce((sum, value, index) => {
            return index === droppedIndex ? sum : sum + value;
        }, 0);

        renderVirtualRollBreakdown({
            maxDie: 6,
            label: "4d6",
            value: total,
            note: `Dropped the lowest die for ${stat.label}.`,
            entries: rolls.map((value, index) => ({
                label: `Die ${index + 1}`,
                value,
                dropped: index === droppedIndex
            }))
        });

        setActionSummary(`Rolls: ${rolls.join(", ")}. Dropped ${droppedValue}. ${stat.label} becomes ${total}.`);
        renderActionButtons([
            {
                label: `Accept ${total}`,
                onClick: () => resolveActiveAction({
                    total,
                    method: "digital",
                    rolls,
                    dropped: droppedValue
                })
            }
        ]);
    };

    const renderManualEntry = () => {
        const commitManualEntry = () => {
            const manualTotal = parseInt(adventureNumberInputEl.value, 10);

            if (Number.isNaN(manualTotal) || manualTotal < 3 || manualTotal > 18) {
                alert("Enter a final stat total between 3 and 18.");
                return;
            }

            renderVirtualRollBreakdown({
                maxDie: 6,
                label: "4d6",
                value: manualTotal,
                note: `Manual total entered for ${stat.label}.`,
                entries: [{ label: stat.short, value: manualTotal }]
            });

            resolveActiveAction({
                total: manualTotal,
                method: "manual",
                rolls: null,
                dropped: null
            });
        };

        showActionInput({
            label: `Enter your ${stat.label} total`,
            min: 3,
            max: 18,
            placeholder: "3 - 18",
            onEnter: commitManualEntry
        });

        setActionSummary("");
        renderActionButtons([
            {
                label: "Use Total",
                onClick: commitManualEntry
            },
            {
                label: "Back",
                variant: "ghost",
                onClick: renderInitialActions
            }
        ]);
    };

    renderInitialActions();
    return promise;
}

function canUseFullReroll() {
    const state = appState.full;
    const config = getDifficultyConfig(state.difficultyKey).full;
    return config.rerollCap > 0 && state.rerolls > 0;
}

async function showAbilityCheckAction({ title, text, stat, modifier, dc, activeToken }) {
    const promise = openActionShell({
        badge: "Ability Check",
        title,
        text,
        helper: `Roll a d20 and add ${stat.label} ${formatModifier(modifier)} against DC ${dc}.${canUseFullReroll() ? ` Rerolls available: ${appState.full.rerolls}.` : ""}`
    });

    const renderInitialActions = () => {
        hideActionInput();
        setActionSummary("");
        renderActionButtons([
            {
                label: "Roll Digitally",
                variant: "secondary",
                onClick: runDigitalCheck
            },
            {
                label: "Use Physical d20",
                variant: "ghost",
                onClick: renderManualEntry
            }
        ]);
    };

    const renderOutcomeActions = result => {
        if (!result.success && canUseFullReroll()) {
            renderActionButtons([
                {
                    label: `Spend Reroll (${appState.full.rerolls})`,
                    onClick: () => {
                        appState.full.rerolls -= 1;
                        renderFullStats();
                        addLog(`You spend a reroll and force the moment to happen again. (${appState.full.rerolls} left.)`, "player-text");
                        setActionPanel({
                            badge: "Ability Check",
                            title,
                            text,
                            helper: `Roll a d20 and add ${stat.label} ${formatModifier(modifier)} against DC ${dc}.${canUseFullReroll() ? ` Rerolls available: ${appState.full.rerolls}.` : ""}`
                        });
                        renderInitialActions();
                    }
                },
                {
                    label: "Keep Result",
                    variant: "ghost",
                    onClick: () => resolveActiveAction(result)
                }
            ]);
            return;
        }

        renderActionButtons([
            {
                label: "Continue",
                onClick: () => resolveActiveAction(result)
            }
        ]);
    };

    const finalizeCheck = (roll, method) => {
        const total = roll + modifier;
        const success = total >= dc;

        renderVirtualRollBreakdown({
            maxDie: 20,
            label: "d20",
            value: roll,
            note: `${stat.label} ${formatModifier(modifier)} against DC ${dc}.`,
            entries: [{ label: method === "manual" ? "Manual" : "Roll", value: roll }]
        });

        setActionSummary(`${buildCheckSummary(roll, modifier, total, dc)} ${success ? "Success." : "Failure."}`);
        renderOutcomeActions({
            roll,
            total,
            success,
            method
        });
    };

    const runDigitalCheck = async () => {
        renderActionButtons([{ label: "Rolling...", disabled: true }]);
        const roll = rollDie(20);
        soundRoll();
        await playVirtualRoll(20, roll, activeToken, {
            resetResults: true,
            note: title
        });

        if (appState.runToken !== activeToken) {
            return;
        }

        finalizeCheck(roll, "digital");
    };

    const renderManualEntry = () => {
        const commitManualEntry = () => {
            const roll = parseInt(adventureNumberInputEl.value, 10);

            if (Number.isNaN(roll) || roll < 1 || roll > 20) {
                alert("Enter a d20 roll between 1 and 20.");
                return;
            }

            recordManualRoll(20, roll, title);
            finalizeCheck(roll, "manual");
        };

        showActionInput({
            label: "Enter your d20 roll",
            min: 1,
            max: 20,
            placeholder: "1 - 20",
            onEnter: commitManualEntry
        });

        setActionSummary("");
        renderActionButtons([
            {
                label: "Use Roll",
                onClick: commitManualEntry
            },
            {
                label: "Back",
                variant: "ghost",
                onClick: renderInitialActions
            }
        ]);
    };

    renderInitialActions();
    return promise;
}

function beginMode(mode) {
    appState.runToken += 1;
    appState.currentMode = mode;
    document.body.dataset.mode = mode;
    hideVirtualDiceStage();
    cancelActiveAction();
    stopNarration();
}

function showMenu() {
    beginMode("menu");
    setModeBanner("Main Menu", "Dungeon Dice Roller", "Choose a mode and shared difficulty for the next adventure.");
    showScreen("menu");
    renderStats();
    renderDifficultySelector();
    setControlsVisible(false);
    syncVirtualDiceDisplay(20);
    updateNavigationState();
}

function openOptions() {
    beginMode("options");
    setModeBanner("Options", "Options", "Adjust narration voice preferences and animated die behavior.");
    showScreen("options");
    renderStats();
    setControlsVisible(false);
    syncVirtualDiceDisplay(20);
    syncOptionControls();
    updateNavigationState();
}

function openPlayground() {
    beginMode("playground");
    setModeBanner("Dice Playground", "Dice Playground", "Roll any common die, add a modifier, and keep a short history.");
    showScreen("playground");
    setControlsVisible(false);
    renderPlayground();
    updateNavigationState();
}

function resetPlayground() {
    appState.playground = createPlaygroundState();
    if (appState.currentMode === "playground") {
        renderPlayground();
    }
}

function renderPlayground() {
    const state = appState.playground;
    renderPlaygroundStats();
    playgroundModifierEl.value = String(state.modifier);

    playgroundDieEls.forEach(button => {
        button.classList.toggle("is-selected", Number(button.dataset.dieOption) === state.selectedDie);
    });

    if (!state.lastRoll) {
        playgroundResultEl.textContent = "No roll yet. Choose a die and roll.";
    } else {
        const modifierText = state.lastRoll.modifier
            ? ` with ${formatModifier(state.lastRoll.modifier)}`
            : "";
        playgroundResultEl.textContent = `d${state.lastRoll.die} rolled ${state.lastRoll.base}${modifierText} for ${state.lastRoll.total} total.`;
    }

    playgroundHistoryEl.innerHTML = "";

    if (!state.history.length) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "history-item";
        emptyEl.textContent = "No rolls recorded yet.";
        playgroundHistoryEl.appendChild(emptyEl);
    } else {
        state.history.forEach(entry => {
            const itemEl = document.createElement("div");
            itemEl.className = "history-item";
            itemEl.textContent = `d${entry.die} -> ${entry.base}${entry.modifier ? ` ${formatModifier(entry.modifier)}` : ""} = ${entry.total}`;

            const detailEl = document.createElement("small");
            detailEl.textContent = entry.detail;
            itemEl.appendChild(detailEl);
            playgroundHistoryEl.appendChild(itemEl);
        });
    }

    syncVirtualDiceDisplay(state.selectedDie, {
        label: `d${state.selectedDie}`,
        value: state.lastRoll ? state.lastRoll.base : "?",
        note: "Playground digital rolls land here."
    });
}

async function rollPlaygroundDie() {
    if (appState.currentMode !== "playground") return;

    const token = appState.runToken;
    const state = appState.playground;
    const base = rollDie(state.selectedDie);
    const modifier = state.modifier;
    const total = base + modifier;

    soundRoll();
    await playVirtualRoll(state.selectedDie, base, token, {
        resetResults: true,
        note: `Rolling a playground d${state.selectedDie}.`
    });

    if (appState.currentMode !== "playground" || appState.runToken !== token) return;

    state.lastRoll = {
        die: state.selectedDie,
        base,
        modifier,
        total
    };

    state.history.unshift({
        die: state.selectedDie,
        base,
        modifier,
        total,
        detail: modifier
            ? `Applied modifier ${formatModifier(modifier)}.`
            : "No modifier applied."
    });

    state.history = state.history.slice(0, 8);
    renderPlayground();
}

function buildClassicHelperText(state) {
    const config = getDifficultyConfig(state.difficultyKey);
    const encounter = state.currentEncounter;

    if (!encounter) {
        return config.description;
    }

    return `${config.description} Roll a d${encounter.requiredDie}. Rerolls: ${state.rerolls > 0 ? state.rerolls : "none"}.`;
}

function renderClassicPanel({ narrate = false } = {}) {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    const difficulty = getDifficultyConfig(state.difficultyKey);

    if (state.gameOver) {
        setActionPanel({
            badge: `Classic Adventure | ${difficulty.label}`,
            title: difficulty.classic.endless ? `The endless run stopped at depth ${state.currentRoom}.` : "The classic run is over.",
            text: state.hp > 0
                ? "You cleared the dungeon. Restart when you want another run."
                : "The dungeon finally claimed you. Restart when you want another attempt.",
            helper: "Use Restart above to begin another run.",
            narrate
        });
        setActionSummary(state.lastRollSummary);
        hideActionInput();
        clearActionButtons();
        return;
    }

    if (!state.currentEncounter) {
        setActionPanel({
            badge: `Classic Adventure | ${difficulty.label}`,
            title: "The dungeon shifts.",
            text: "The next room is being pulled into place.",
            helper: difficulty.description,
            narrate
        });
        setActionSummary(state.lastRollSummary);
        hideActionInput();
        clearActionButtons();
        return;
    }

    if (state.pendingFailure) {
        const pending = state.pendingFailure;
        setActionPanel({
            badge: `Classic Adventure | ${difficulty.label}`,
            title: difficulty.classic.endless ? `Depth ${state.currentRoom} bites back` : `Room ${state.currentRoom} bites back`,
            text: `${state.currentEncounter.fail} Spend a reroll or take ${pending.damageTaken} damage.`,
            helper: `You rolled ${pending.roll} against DC ${state.currentEncounter.dc}.`,
            narrate
        });
        setActionSummary(state.lastRollSummary);
        hideActionInput();
        renderActionButtons([
            {
                label: `Spend Reroll (${state.rerolls})`,
                onClick: spendClassicReroll
            },
            {
                label: "Take Hit",
                variant: "ghost",
                onClick: applyClassicFailure
            }
        ]);
        return;
    }

    setActionPanel({
        badge: `Classic Adventure | ${difficulty.label}`,
        title: difficulty.classic.endless
            ? `Endless Depth ${state.currentRoom}`
            : `Room ${state.currentRoom} of ${CLASSIC_ROOM_GOAL}`,
        text: state.currentEncounter.prompt,
        helper: buildClassicHelperText(state),
        narrate
    });
    setActionSummary(state.lastRollSummary);

    showActionInput({
        label: `Enter your d${state.currentEncounter.requiredDie} roll`,
        min: 1,
        max: state.currentEncounter.requiredDie,
        placeholder: `1 - ${state.currentEncounter.requiredDie}`,
        disabled: state.isRollPending,
        onEnter: () => handleClassicRoll()
    });

    renderActionButtons([
        {
            label: state.isRollPending ? "Rolling..." : "Roll Digitally",
            variant: "secondary",
            disabled: state.isRollPending,
            onClick: () => handleClassicRoll(rollDie(state.currentEncounter.requiredDie), "digital")
        },
        {
            label: "Submit Manual Roll",
            disabled: state.isRollPending,
            onClick: () => handleClassicRoll(null, "manual")
        }
    ]);
}

function generateClassicEncounter(state) {
    const config = getDifficultyConfig(state.difficultyKey).classic;
    const isCombat = Math.random() > 0.4;
    const room = randomFrom(classicRoomTypes);
    const requiredDie = randomFrom(classicDiceOptions);
    const depthScale = Math.floor(Math.max(0, state.currentRoom - 1) / 3);

    let dc = Math.floor(requiredDie * (0.4 + Math.random() * 0.28));
    dc += config.dcMod + depthScale;
    dc = clamp(dc, 2, requiredDie === 4 ? 4 : requiredDie - 1);

    let damage = Math.floor(requiredDie / 4) + 2 + Math.floor(Math.max(0, state.currentRoom - 1) / 4);
    damage = Math.max(1, Math.round(damage * config.damageMultiplier));

    let prompt;
    let success;
    let fail;

    if (isCombat) {
        const adjective = randomFrom(classicAdjectives);
        const monster = randomFrom(classicMonsters);
        prompt = `You enter a ${room}. A ${adjective} ${monster} attacks. Roll a d${requiredDie} to strike or evade. (DC: ${dc})`;
        success = `You outmaneuver the ${monster} and bring it down.`;
        fail = `The ${monster} overruns your position.`;
    } else {
        const trap = randomFrom(classicTraps);
        prompt = `You navigate a ${room} and trigger a ${trap}. Roll a d${requiredDie} to dodge or disarm it. (DC: ${dc})`;
        success = `You avoid the ${trap} with seconds to spare.`;
        fail = `You fail to react in time.`;
    }

    return { prompt, success, fail, requiredDie, dc, damage };
}

function startClassicAdventure() {
    beginMode("classic");
    appState.classic = createClassicState(appState.selectedDifficulty);

    const difficulty = getDifficultyConfig(appState.classic.difficultyKey);

    setModeBanner(
        "Classic Adventure",
        "Classic Adventure",
        `${difficulty.label} difficulty. The original dungeon crawl now respects the shared difficulty rules.`
    );
    showScreen("story");
    clearStoryLog();
    renderClassicStats();
    setControlsVisible(false);
    updateNavigationState();

    appState.classic.lastRollSummary = "";
    renderClassicPanel();
    addLog("DM: The dungeon shifts. The classic crawl begins again.", "dm-text", {
        narrate: true,
        narrationText: "The dungeon shifts. The classic crawl begins again."
    });
    addLog(`Difficulty set to ${difficulty.label}. ${difficulty.description}`, "success-text");
    addLog("--------------------------------------------------", "dm-text");
    nextClassicRoom();
}

function nextClassicRoom() {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    const config = getDifficultyConfig(state.difficultyKey).classic;

    if (!config.endless && state.currentRoom >= CLASSIC_ROOM_GOAL) {
        winClassicGame();
        return;
    }

    state.currentRoom += 1;
    state.currentEncounter = generateClassicEncounter(state);
    state.pendingFailure = null;
    state.isRollPending = false;
    state.lastRollSummary = "";
    renderClassicStats();
    renderClassicPanel();

    if (config.endless && state.currentRoom > 1 && state.currentRoom % 10 === 0) {
        addLog(`DM: Depth ${state.currentRoom}. The dungeon keeps unfolding.`, "dm-text", {
            narrate: true,
            narrationText: `Depth ${state.currentRoom}. The dungeon keeps unfolding.`
        });
    }

    addLog(`DM: ${state.currentEncounter.prompt}`, "dm-text", {
        narrate: true,
        narrationText: state.currentEncounter.prompt
    });
}

function maybeAwardClassicReroll(reason, guaranteed = false) {
    const state = appState.classic;
    const config = getDifficultyConfig(state.difficultyKey).classic;

    if (config.rerollCap <= 0 || state.rerolls >= config.rerollCap) {
        return false;
    }

    if (!guaranteed && Math.random() >= config.rerollEarnChance) {
        return false;
    }

    state.rerolls += 1;
    renderClassicStats();
    addLog(`${reason} Rerolls: ${state.rerolls}/${config.rerollCap}.`, "success-text");
    return true;
}

async function handleClassicRoll(rollValue = null, source = "manual") {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    if (state.gameOver || !state.currentEncounter || state.isRollPending || state.pendingFailure) return;

    if (!isMuted && audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const maxDie = state.currentEncounter.requiredDie;
    const roll = rollValue ?? parseInt(adventureNumberInputEl.value, 10);

    if (Number.isNaN(roll) || roll < 1 || roll > maxDie) {
        alert(`Please enter a valid roll between 1 and ${maxDie}.`);
        return;
    }

    const encounterAtRoll = state.currentEncounter;
    const token = appState.runToken;

    state.isRollPending = true;
    renderClassicPanel();

    if (source === "manual") {
        recordManualRoll(maxDie, roll, `Manual d${maxDie} result.`);
    } else {
        soundRoll();
        await playVirtualRoll(maxDie, roll, token, {
            resetResults: true,
            note: `Classic Adventure d${maxDie}.`
        });
    }

    if (appState.currentMode !== "classic" || appState.runToken !== token || state.currentEncounter !== encounterAtRoll) {
        return;
    }

    const rollSummary = `You rolled a ${roll} on d${maxDie}.`;
    state.lastRollSummary = rollSummary;
    setActionSummary(rollSummary);
    addLog(rollSummary, "player-text");

    if (roll === maxDie && maxDie !== 4) {
        addLog("Critical success.", "success-text");
        resolveClassicSuccess(roll, true);
        return;
    }

    if (roll === 1) {
        addLog("Critical failure.", "damage-text");
        resolveClassicFailure(roll, true);
        return;
    }

    if (roll >= encounterAtRoll.dc) {
        resolveClassicSuccess(roll, false);
        return;
    }

    resolveClassicFailure(roll, false);
}

function resolveClassicSuccess(roll, isCritical) {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    const encounter = state.currentEncounter;
    const config = getDifficultyConfig(state.difficultyKey).classic;
    const token = appState.runToken;

    soundSuccess();
    triggerVisualEffect("success");
    addLog(encounter.success, "success-text");

    const potionChance = 0.24 * config.rewardMultiplier;
    if (Math.random() < potionChance) {
        const healing = Math.max(2, Math.round((Math.floor(Math.random() * 6) + 2) * Math.max(1, config.rewardMultiplier - 0.05)));
        state.hp = Math.min(state.maxHp, state.hp + healing);
        renderClassicStats();
        addLog(`You find time to breathe and recover ${healing} HP.`, "success-text");
    }

    if (isCritical || state.currentRoom % 3 === 0) {
        maybeAwardClassicReroll("The room opens just enough for you to bank a reroll.", true);
    } else {
        maybeAwardClassicReroll("You turn the pressure into another reroll.");
    }

    setTimeout(() => {
        if (appState.currentMode !== "classic" || appState.runToken !== token) return;
        state.isRollPending = false;
        state.pendingFailure = null;
        addLog("--------------------------------------------------", "dm-text");

        if (!config.endless && state.currentRoom >= CLASSIC_ROOM_GOAL) {
            winClassicGame();
            return;
        }

        nextClassicRoom();
    }, 900);
}

function resolveClassicFailure(roll, isCriticalFailure) {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    const encounter = state.currentEncounter;
    const config = getDifficultyConfig(state.difficultyKey).classic;

    let damageTaken = encounter.damage;
    if (isCriticalFailure) {
        damageTaken += config.failForward ? 0 : 2;
    }

    damageTaken = Math.max(1, damageTaken);

    if (config.failForward) {
        soundDamage();
        triggerVisualEffect("damage");
        addLog(`${encounter.fail} Story difficulty turns the setback into flavor instead of loss.`, "damage-text");
        state.isRollPending = false;
        state.pendingFailure = null;
        renderClassicPanel();

        setTimeout(() => {
            if (appState.currentMode !== "classic") return;
            addLog("--------------------------------------------------", "dm-text");
            nextClassicRoom();
        }, 900);
        return;
    }

    if (state.rerolls > 0) {
        state.isRollPending = false;
        state.pendingFailure = {
            roll,
            damageTaken
        };
        state.lastRollSummary = `${buildCheckSummary(roll, 0, roll, encounter.dc)} Take the hit or spend a reroll.`;
        renderClassicPanel();
        return;
    }

    applyClassicFailure();
}

function spendClassicReroll() {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    if (!state.pendingFailure || state.rerolls <= 0) return;

    state.rerolls -= 1;
    state.pendingFailure = null;
    state.lastRollSummary = "Reroll spent. The room still demands another roll.";
    renderClassicStats();
    addLog(`You spend a reroll and reset your footing. (${state.rerolls} left.)`, "player-text");
    renderClassicPanel();
}

function applyClassicFailure() {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    const encounter = state.currentEncounter;
    const pending = state.pendingFailure || { damageTaken: encounter.damage };
    const token = appState.runToken;

    soundDamage();
    triggerVisualEffect("damage");

    state.pendingFailure = null;
    state.hp -= pending.damageTaken;
    state.isRollPending = false;
    renderClassicStats();
    addLog(`${encounter.fail} You take ${pending.damageTaken} damage.`, "damage-text");

    if (state.hp <= 0) {
        loseClassicGame();
        return;
    }

    const retryPrompt = `You are still trapped. Roll d${encounter.requiredDie} again. (DC: ${encounter.dc})`;
    state.lastRollSummary = retryPrompt;
    renderClassicPanel();

    setTimeout(() => {
        if (appState.currentMode !== "classic" || appState.runToken !== token) return;
        addLog(`DM: ${retryPrompt}`, "dm-text", {
            narrate: true,
            narrationText: retryPrompt
        });
        renderClassicPanel();
    }, 700);
}

function loseClassicGame() {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    state.gameOver = true;
    state.isRollPending = false;
    state.pendingFailure = null;
    stopNarration();
    renderClassicStats();
    addLog("--------------------------------------------------", "damage-text");
    addLog(`You died in room ${state.currentRoom}. Restart Classic Adventure to try again.`, "damage-text");
    renderClassicPanel();
}

function winClassicGame() {
    if (appState.currentMode !== "classic") return;

    const state = appState.classic;
    state.gameOver = true;
    state.isRollPending = false;
    state.pendingFailure = null;
    stopNarration();
    soundSuccess();
    setTimeout(() => playTone(880, "sine", 0.5), 300);
    addLog("--------------------------------------------------", "success-text");
    addLog("Victory. You survived the shifting dungeon.", "success-text");
    renderClassicPanel();
}

function buildRewardText(items = [], gold = 0, healing = 0, rerolls = 0) {
    const parts = [];

    if (items.length) {
        parts.push(items.join(", "));
    }

    if (gold > 0) {
        parts.push(`${gold} gold`);
    }

    if (healing > 0) {
        parts.push(`${healing} HP`);
    }

    if (rerolls > 0) {
        parts.push(`${rerolls} reroll${rerolls === 1 ? "" : "s"}`);
    }

    return parts.join(" and ");
}

function maybeAwardFullReroll(reason, guaranteed = false) {
    const state = appState.full;
    const config = getDifficultyConfig(state.difficultyKey).full;

    if (config.rerollCap <= 0 || state.rerolls >= config.rerollCap) {
        return false;
    }

    if (!guaranteed && Math.random() >= config.rerollEarnChance) {
        return false;
    }

    state.rerolls += 1;
    renderFullStats();
    addLog(`${reason} Rerolls: ${state.rerolls}/${config.rerollCap}.`, "success-text");
    return true;
}

function applyFullSceneOutcome(scene, result, appliedDc) {
    if (appState.currentMode !== "full") return false;

    const state = appState.full;
    const config = getDifficultyConfig(state.difficultyKey).full;
    const character = state.character;

    if (result.success) {
        soundSuccess();
        triggerVisualEffect("success");

        const goldAward = Math.max(0, Math.round((scene.rewards?.gold || 0) * config.rewardMultiplier));
        const items = scene.rewards?.inventory || [];
        const healing = scene.rewards?.healing
            ? Math.max(1, Math.round(scene.rewards.healing * Math.max(1, config.rewardMultiplier - 0.05)))
            : 0;

        addInventory(character, items);
        character.gold += goldAward;
        if (healing > 0 && character.maxHp != null) {
            character.hp = Math.min(character.maxHp, character.hp + healing);
        }

        addLog(scene.success, "success-text");

        const rewardText = buildRewardText(items, goldAward, healing);
        if (rewardText) {
            addLog(`You secure ${rewardText}.`, "success-text");
        }

        if (scene.epilogue) {
            addLog(scene.epilogue, "success-text");
        }

        if (result.roll === 20 || result.total >= appliedDc + 4) {
            maybeAwardFullReroll("A clean win leaves you with a fresh reroll.", true);
        } else {
            maybeAwardFullReroll("You keep enough momentum to bank a reroll.");
        }
    } else {
        soundDamage();
        triggerVisualEffect("damage");
        addLog(scene.fail, "damage-text");

        if (config.failForward) {
            addLog("Story difficulty keeps the setback from becoming a real loss. You fail forward and keep moving.", "damage-text");
        } else {
            const damageTaken = Math.max(1, Math.round(scene.damage * config.damageMultiplier));
            character.hp = Math.max(0, (character.hp ?? 0) - damageTaken);
            addLog(`You lose ${damageTaken} HP.`, "damage-text");

            if ((character.hp ?? 0) <= 0) {
                if (config.noDeath) {
                    character.hp = 1;
                    addLog("Story difficulty refuses to let the road end here.", "damage-text");
                } else {
                    loseFullAdventure();
                    renderFullStats();
                    return false;
                }
            }
        }
    }

    renderFullStats();
    return !state.gameOver;
}

function renderFullEndPanel(title, text, helper = "Use Restart above to begin another Full Adventure.") {
    setActionPanel({
        badge: `Full Adventure | ${getDifficultyConfig(appState.full.difficultyKey).label}`,
        title,
        text,
        helper
    });
    setActionSummary("");
    hideActionInput();
    clearActionButtons();
}

function loseFullAdventure() {
    if (appState.currentMode !== "full") return;

    const state = appState.full;
    const district = getFullChapterDistrict(state.chapter, state.route);
    state.gameOver = true;
    state.phase = "dead";
    state.chapterComplete = false;
    stopNarration();
    addLog("--------------------------------------------------", "damage-text");
    addLog(`${state.character.name} falls in ${district.label} on chapter ${state.chapter}. Restart Full Adventure to roll a new wanderer.`, "damage-text");
    renderFullEndPanel("The road closes.", `${state.character.name} falls before ${district.label} can be mastered.`);
}

function startFullAdventure() {
    beginMode("full");
    appState.full = createFullState(appState.selectedDifficulty);

    const difficulty = getDifficultyConfig(appState.full.difficultyKey);

    setModeBanner(
        "Full Adventure",
        "Full Adventure",
        `${difficulty.label} difficulty. ${getFullCampaignLengthText(appState.full.difficultyKey)}`
    );
    showScreen("story");
    clearStoryLog();
    renderFullStats();
    setControlsVisible(false);
    updateNavigationState();
    renderFullEndPanel("A long road stretches ahead.", "Name your wanderer, choose your past, and decide where the campaign begins.");

    const token = appState.runToken;
    runFullAdventure(token);
}

async function playFullChapter(token) {
    if (appState.currentMode !== "full" || appState.runToken !== token) return false;

    const state = appState.full;
    const { character } = state;
    const difficulty = getDifficultyConfig(state.difficultyKey);
    const chapterContext = buildFullChapterContext(state);
    const district = getFullDistrictById(chapterContext.districtId);
    const chapterScale = getFullChapterScale(state.chapter);
    const leadScenes = selectFullLeadTemplates(state, 3).map(template => materializeFullScene(template, chapterContext));

    state.phase = "chapter";
    state.chapterComplete = false;
    state.currentDistrictId = district.id;
    renderFullStats();

    addLog(`${getFullJourneyLabel(state)}: ${district.label}.`, "dm-text", {
        narrate: true,
        narrationText: `${getFullJourneyLabel(state)}. ${district.label}.`
    });
    addLog(`${chapterContext.weather}. ${chapterContext.pressure}.`, "dm-text");
    addLog(`${chapterContext.objective} ${chapterContext.omen}`, "dm-text");
    addLog(`Rumor: ${chapterContext.rumor}`, "dm-text");

    const leadChoice = await showChoiceAction({
        badge: `${difficulty.label} | ${getFullJourneyLabel(state)}`,
        title: district.label,
        text: "Which lead do you follow first?",
        helper: `${difficulty.description} ${district.detail}`,
        choices: leadScenes.map(scene => ({
            id: scene.id,
            label: scene.label
        }))
    });
    if (!leadChoice || appState.currentMode !== "full" || appState.runToken !== token) return false;

    const scene = leadScenes.find(option => option.id === leadChoice);
    const sceneStat = statOrder.find(stat => stat.key === scene.statKey);
    const sceneModifier = abilityModifier(character.stats[scene.statKey]);
    const sceneDc = scene.dc + chapterScale + difficulty.full.dcMod;
    state.recentLeadIds.push(scene.id);
    state.recentLeadIds = state.recentLeadIds.slice(-8);

    character.calling = scene.calling;
    renderFullStats();

    addLog(`You choose to ${scene.summary}.`, "dm-text", {
        narrate: true,
        narrationText: `You choose to ${scene.summary}.`
    });

    const openingCheck = await showAbilityCheckAction({
        title: scene.title,
        text: scene.text,
        stat: sceneStat,
        modifier: sceneModifier,
        dc: sceneDc,
        activeToken: token
    });
    if (!openingCheck || appState.currentMode !== "full" || appState.runToken !== token) return false;

    if (!applyFullSceneOutcome(scene, openingCheck, sceneDc)) {
        return false;
    }

    const followupChoice = await showChoiceAction({
        badge: `Chapter ${state.chapter}`,
        title: "What angle do you take next?",
        text: "The first break in the night opens a second decision.",
        helper: "Keep the flow natural: choose the next move, then roll only when the moment actually demands it.",
        choices: scene.followups.map(option => ({
            id: option.id,
            label: option.label
        }))
    });
    if (!followupChoice || appState.currentMode !== "full" || appState.runToken !== token) return false;

    const followup = scene.followups.find(option => option.id === followupChoice);
    const followupStat = statOrder.find(stat => stat.key === followup.statKey);
    const followupModifier = abilityModifier(character.stats[followup.statKey]);
    const followupDc = followup.dc + chapterScale + difficulty.full.dcMod;

    addLog(`You pivot and decide to ${followup.label.toLowerCase()}.`, "dm-text", {
        narrate: true,
        narrationText: `You decide to ${followup.label.toLowerCase()}.`
    });

    const followupCheck = await showAbilityCheckAction({
        title: followup.title,
        text: followup.text,
        stat: followupStat,
        modifier: followupModifier,
        dc: followupDc,
        activeToken: token
    });
    if (!followupCheck || appState.currentMode !== "full" || appState.runToken !== token) return false;

    if (!applyFullSceneOutcome(followup, followupCheck, followupDc)) {
        return false;
    }

    const nightChoice = await showChoiceAction({
        badge: getFullJourneyLabel(state),
        title: "How do you close the chapter?",
        text: "Push for one more prize, disappear into shelter, work the rumor mill, or try to leave with an ally.",
        helper: chapterContext.rumor,
        choices: [
            { id: "press", label: "Press The Advantage" },
            { id: "rest", label: "Take Shelter" },
            { id: "scheme", label: "Work The Rumor Mill" },
            { id: "ally", label: "Court An Ally" }
        ]
    });
    if (!nightChoice || appState.currentMode !== "full" || appState.runToken !== token) return false;

    if (nightChoice === "press") {
        const bestStat = getHighestStat(character);
        const bestModifier = abilityModifier(character.stats[bestStat.key]);
        const finalDc = 13 + chapterScale + difficulty.full.dcMod;
        const finalScene = materializeFullScene(
            randomFrom(fullFinaleTemplates),
            {
                ...chapterContext,
                bestStatLabel: bestStat.label,
                name: character.name
            },
            { includeFollowups: false }
        );

        addLog(`You trust ${bestStat.label} and push deeper into ${district.label}.`, "dm-text", {
            narrate: true,
            narrationText: `You trust ${bestStat.label} and push deeper into ${district.label}.`
        });

        const finalCheck = await showAbilityCheckAction({
            title: finalScene.title,
            text: finalScene.text,
            stat: bestStat,
            modifier: bestModifier,
            dc: finalDc,
            activeToken: token
        });
        if (!finalCheck || appState.currentMode !== "full" || appState.runToken !== token) return false;

        if (!applyFullSceneOutcome(finalScene, finalCheck, finalDc)) {
            return false;
        }
    } else if (nightChoice === "rest") {
        const missingHp = character.maxHp != null
            ? Math.max(0, character.maxHp - (character.hp ?? character.maxHp))
            : 0;
        const healed = character.maxHp != null
            ? Math.min(missingHp, Math.max(2, Math.ceil(missingHp * 0.65)))
            : 0;

        if (healed > 0) {
            character.hp += healed;
        }

        addLog(randomFrom(fullRestDescriptions), "success-text");
        if (healed > 0) {
            addLog(`The pause restores ${healed} HP.`, "success-text");
        }
        maybeAwardFullReroll("A calm night gives you room to bank a reroll.");
        renderFullStats();
    } else if (nightChoice === "scheme") {
        const rumorItem = `rumor about ${chapterContext.faction}`;
        const goldGain = randomInt(2, 5);
        character.gold += goldGain;
        addInventory(character, [rumorItem, `note on ${district.label}`]);
        addLog(`You work the rumor mill and leave ${district.label} with coin, names, and leverage.`, "success-text");
        addLog(`You secure ${goldGain} gold and a fresh rumor tied to ${chapterContext.faction}.`, "success-text");
        maybeAwardFullReroll("Quiet leverage keeps you sharp for the next chapter.", true);
        renderFullStats();
    } else {
        const allyStat = (character.stats.cha ?? 0) >= (character.stats.wis ?? 0)
            ? statOrder.find(stat => stat.key === "cha")
            : statOrder.find(stat => stat.key === "wis");
        const allyModifier = abilityModifier(character.stats[allyStat.key]);
        const allyDc = 12 + chapterScale + difficulty.full.dcMod;
        const allyScene = materializeFullScene(
            randomFrom(fullAllianceTemplates),
            {
                ...chapterContext,
                name: character.name
            },
            { includeFollowups: false }
        );

        addLog(`You try to turn the night's contacts into something lasting.`, "dm-text", {
            narrate: true,
            narrationText: "You try to turn the night's contacts into something lasting."
        });

        const allyCheck = await showAbilityCheckAction({
            title: allyScene.title,
            text: allyScene.text,
            stat: allyStat,
            modifier: allyModifier,
            dc: allyDc,
            activeToken: token
        });
        if (!allyCheck || appState.currentMode !== "full" || appState.runToken !== token) return false;

        if (!applyFullSceneOutcome(allyScene, allyCheck, allyDc)) {
            return false;
        }
    }

    addLog(`The chapter settles. ${district.label} knows your scent now.`, "dm-text");
    return true;
}

async function runFullAdventure(token) {
    if (appState.currentMode !== "full" || appState.runToken !== token) return;

    const state = appState.full;
    const { character } = state;
    const difficulty = getDifficultyConfig(state.difficultyKey);

    state.phase = "character-creation";

    const logCreationRewards = (label, bundle) => {
        const rewardText = buildRewardText(bundle.inventory, bundle.gold, 0, bundle.rerolls);

        if (!rewardText) return;
        addLog(`${label} gives you ${rewardText}.`, "success-text");
    };

    addLog("Prologue: A long arrival.", "dm-text", {
        narrate: true,
        narrationText: "Prologue. A long arrival."
    });
    addLog(`You arrive with no class, little coin, and a road sized to ${getFullCampaignLengthText(state.difficultyKey).toLowerCase()}`, "dm-text");

    const intro = await showInfoAction({
        badge: "Full Adventure",
        title: "A long arrival",
        text: "This version keeps the narration in the story log while the side panel handles your next choice, roll, or reroll.",
        helper: difficulty.description,
        buttonLabel: "Begin Character Creation"
    });
    if (!intro || appState.currentMode !== "full" || appState.runToken !== token) return;

    const characterName = await showTextEntryAction({
        badge: "Character Creation",
        title: "Name your wanderer",
        text: "The road will remember what you call yourself.",
        helper: "Type a name or let the road hand you an alias.",
        label: "Character name",
        placeholder: "e.g. Mara Vale",
        buttonLabel: "Claim This Name",
        suggestionLabel: "Random Alias",
        suggestionFactory: generateRandomWandererName,
        normalize: normalizeCharacterName,
        validate: value => {
            if (value.length < 2) return "Enter a name that is at least 2 characters long.";
            if (!/^[A-Za-z][A-Za-z' -]*$/.test(value)) {
                return "Use letters, spaces, apostrophes, or hyphens for the name.";
            }
            return "";
        }
    });
    if (!characterName || appState.currentMode !== "full" || appState.runToken !== token) return;

    character.name = characterName;
    renderFullStats();
    addLog(`You take the road as ${character.name}.`, "player-text");

    const backgroundChoice = await showChoiceAction({
        badge: "Character Creation",
        title: "Choose the past you still claim",
        text: "You have no class yet, but you do have history.",
        helper: "Pick the life that shaped you before this road.",
        choices: fullBackgrounds.map(background => ({
            id: background.id,
            label: background.label
        }))
    });
    if (!backgroundChoice || appState.currentMode !== "full" || appState.runToken !== token) return;

    const background = findById(fullBackgrounds, backgroundChoice);
    character.background = background.label;
    const backgroundBundle = applyFullRewardBundle(background.rewards, { name: character.name });
    renderFullStats();
    addLog(`Background chosen: ${character.background}. ${background.detail}`, "player-text");
    logCreationRewards(character.background, backgroundBundle);

    const originChoice = await showChoiceAction({
        badge: "Character Creation",
        title: "Choose where you come from",
        text: "Your homeland still clings to your habits, accent, and scars.",
        helper: "Pick the place that shaped how you read danger.",
        choices: fullOrigins.map(origin => ({
            id: origin.id,
            label: origin.label
        }))
    });
    if (!originChoice || appState.currentMode !== "full" || appState.runToken !== token) return;

    const origin = findById(fullOrigins, originChoice);
    character.origin = origin.label;
    const originBundle = applyFullRewardBundle(origin.rewards, { name: character.name });
    renderFullStats();
    addLog(`Origin chosen: ${character.origin}. ${origin.detail}`, "player-text");
    logCreationRewards(character.origin, originBundle);

    const boonChoice = await showChoiceAction({
        badge: "Character Creation",
        title: "Choose what you start with",
        text: "Nobody steps onto a long road truly empty-handed.",
        helper: "Pick one starting edge to carry into the campaign.",
        choices: fullStartingBoons.map(boon => ({
            id: boon.id,
            label: boon.label
        }))
    });
    if (!boonChoice || appState.currentMode !== "full" || appState.runToken !== token) return;

    const boon = findById(fullStartingBoons, boonChoice);
    character.boon = boon.label;
    const boonBundle = applyFullRewardBundle(boon.rewards, { name: character.name });
    renderFullStats();
    addLog(`Starting boon: ${character.boon}. ${boon.detail}`, "player-text");
    logCreationRewards(character.boon, boonBundle);

    const startChoice = await showChoiceAction({
        badge: "Character Creation",
        title: "Choose where the campaign begins",
        text: "Your first chapter starts wherever you decide to step onto the road.",
        helper: "This choice sets the opening district for the full adventure route.",
        choices: fullDistricts.map(district => ({
            id: district.id,
            label: district.label
        }))
    });
    if (!startChoice || appState.currentMode !== "full" || appState.runToken !== token) return;

    const startDistrict = getFullDistrictById(startChoice);
    character.startLocation = startDistrict.label;
    character.startLocationId = startDistrict.id;
    state.route = [startDistrict.id];
    ensureFullRouteLength(state, Math.max(state.totalChapters || 4, 4));
    const startBundle = applyFullRewardBundle(startDistrict.rewards, { district: startDistrict.label, name: character.name });
    renderFullStats();
    addLog(`Starting district: ${character.startLocation}. ${startDistrict.detail}`, "player-text");
    logCreationRewards(character.startLocation, startBundle);

    const statIntro = await showInfoAction({
        badge: "Character Creation",
        title: "Roll your ability scores",
        text: "Each score uses 4d6, dropping the lowest die. Digital rolling now shows every die in the shared tray.",
        helper: getFullCampaignLengthText(state.difficultyKey),
        buttonLabel: "Roll Stats"
    });
    if (!statIntro || appState.currentMode !== "full" || appState.runToken !== token) return;

    for (const stat of statOrder) {
        const result = await showStatRollAction(stat, token);
        if (!result || appState.currentMode !== "full" || appState.runToken !== token) return;

        character.stats[stat.key] = result.total;
        recalculateFullCharacter(character);
        renderFullStats();

        if (result.method === "digital") {
            addLog(`${stat.label}: ${result.total} from rolls ${result.rolls.join(", ")}.`, "player-text");
        } else {
            addLog(`${stat.label}: ${result.total} entered from physical dice.`, "player-text");
        }
    }

    recalculateFullCharacter(character);
    renderFullStats();

    const strongestStat = getHighestStat(character);
    addLog(`The rolls settle. ${character.name}'s strongest ability is ${strongestStat.label}, but the class remains unchosen.`, "success-text");

    const creationComplete = await showInfoAction({
        badge: "Character Ready",
        title: "Your wanderer takes shape",
        text: `${character.name} is ready. Highest stat: ${strongestStat.label}. HP: ${character.hp}/${character.maxHp}.`,
        helper: difficulty.full.rerollCap > 0
            ? `Starting rerolls: ${state.rerolls}. ${getFullCampaignLengthText(state.difficultyKey)}`
            : getFullCampaignLengthText(state.difficultyKey),
        buttonLabel: `Step Into ${character.startLocation}`
    });
    if (!creationComplete || appState.currentMode !== "full" || appState.runToken !== token) return;

    while (appState.currentMode === "full" && appState.runToken === token) {
        const chapterCompleted = await playFullChapter(token);
        if (!chapterCompleted || appState.currentMode !== "full" || appState.runToken !== token || state.gameOver) {
            return;
        }

        state.chapterComplete = true;

        const finalChapterReached = !difficulty.full.endless
            && state.totalChapters != null
            && state.chapter >= state.totalChapters;

        if (finalChapterReached) {
            break;
        }

        const recovery = character.maxHp != null
            ? Math.min(3, Math.max(0, character.maxHp - (character.hp ?? character.maxHp)))
            : 0;

        if (recovery > 0) {
            character.hp += recovery;
            addLog(`A hard pause between chapters restores ${recovery} HP.`, "success-text");
        }

        state.chapter += 1;
        ensureFullRouteLength(state, state.chapter);
        renderFullStats();

        const nextDistrict = getFullChapterDistrict(state.chapter, state.route);
        const continueJourney = await showInfoAction({
            badge: difficulty.full.endless ? "Endless" : "Journey Continues",
            title: `${nextDistrict.label} awaits`,
            text: difficulty.full.endless
                ? `${nextDistrict.label} opens ahead. Endless difficulty keeps the loop alive.`
                : `${nextDistrict.label} is next. The road is not finished with ${character.name}.`,
            helper: `Current HP ${character.hp}/${character.maxHp}. Rerolls ${state.rerolls}.`,
            buttonLabel: `Continue to ${getFullJourneyLabel(state)}`
        });
        if (!continueJourney || appState.currentMode !== "full" || appState.runToken !== token) return;
    }

    state.phase = "complete";
    state.chapterComplete = true;
    renderFullStats();

    addLog("--------------------------------------------------", "success-text");
    addLog(`${character.name} survives ${state.totalChapters} chapters and leaves the road changed.`, "success-text");

    await showInfoAction({
        badge: "Campaign Complete",
        title: `${character.name}'s campaign is complete`,
        text: `${character.name} crossed ${state.totalChapters} chapters starting from ${character.startLocation} and turned the road into something personal.`,
        helper: "Restart Full Adventure to roll a different wanderer or switch modes from the menu.",
        buttonLabel: "Close Campaign"
    });

    renderFullEndPanel(
        "Campaign complete.",
        `${character.name} finishes the road with ${character.gold} gold and ${character.inventory.length} keepsakes worth naming.`
    );
}

function shouldConfirmAbandon() {
    if (appState.currentMode === "classic") {
        return appState.classic.currentRoom > 0 && !appState.classic.gameOver;
    }

    if (appState.currentMode === "full") {
        return appState.full.phase !== "idle" && !appState.full.chapterComplete && !appState.full.gameOver;
    }

    if (appState.currentMode === "playground") {
        return appState.playground.history.length > 0;
    }

    return false;
}

function confirmAbandon(targetLabel) {
    if (!shouldConfirmAbandon()) return true;
    return confirm(`Leave the current mode and open ${targetLabel}?`);
}

function handleMenuNavigation() {
    if (appState.currentMode === "menu") return;
    if (!confirmAbandon("the main menu")) return;
    showMenu();
}

function handleRestart() {
    if (appState.currentMode === "classic") {
        if (!appState.classic.gameOver && appState.classic.currentRoom > 0 && !confirm("Abandon the current Classic Adventure run and start over?")) {
            return;
        }
        startClassicAdventure();
        return;
    }

    if (appState.currentMode === "full") {
        if (appState.full.phase !== "idle" && !appState.full.chapterComplete && !appState.full.gameOver && !confirm("Restart Full Adventure and roll a new character?")) {
            return;
        }
        startFullAdventure();
        return;
    }

    if (appState.currentMode === "playground") {
        resetPlayground();
    }
}

function initEventListeners() {
    audioToggleBtn.addEventListener("click", () => {
        isMuted = !isMuted;

        if (isMuted) {
            stopNarration();
        } else {
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }

            if (narratorEnabled) {
                speakNarration(getNarrationPreview());
            }
        }

        syncAudioControls();
    });

    narratorToggleBtn.addEventListener("click", () => {
        if (narratorToggleBtn.disabled) return;

        narratorEnabled = !narratorEnabled;
        saveSettings();
        syncAudioControls();

        if (!narratorEnabled) {
            stopNarration();
            return;
        }

        speakNarration(getNarrationPreview());
    });

    menuBtn.addEventListener("click", handleMenuNavigation);
    restartAnytimeBtn.addEventListener("click", handleRestart);

    menuChoiceEls.forEach(button => {
        button.addEventListener("click", () => {
            const choice = button.dataset.modeChoice;

            if (choice === "classic") {
                startClassicAdventure();
            } else if (choice === "full") {
                startFullAdventure();
            } else if (choice === "playground") {
                openPlayground();
            } else if (choice === "options") {
                openOptions();
            }
        });
    });

    difficultyChoiceEls.forEach(button => {
        button.addEventListener("click", () => {
            const nextDifficulty = button.dataset.difficultyChoice;
            if (!difficultyConfigs[nextDifficulty]) return;

            appState.selectedDifficulty = nextDifficulty;
            renderDifficultySelector();
            saveSettings();
        });
    });

    playgroundDieEls.forEach(button => {
        button.addEventListener("click", () => {
            appState.playground.selectedDie = Number(button.dataset.dieOption);
            renderPlayground();
        });
    });

    playgroundModifierEl.addEventListener("change", () => {
        const parsed = parseInt(playgroundModifierEl.value, 10);
        appState.playground.modifier = Number.isNaN(parsed) ? 0 : clamp(parsed, -20, 20);
        renderPlayground();
    });

    playgroundRollBtn.addEventListener("click", rollPlaygroundDie);

    optionsVirtualDiceToggleEl.addEventListener("change", () => {
        virtualDiceEnabled = optionsVirtualDiceToggleEl.checked;
        saveSettings();
        syncVirtualDiceDisplay(appState.playground.selectedDie || 20);
    });

    narratorVoiceInputEls.forEach(input => {
        input.addEventListener("change", () => {
            if (!input.checked) return;

            narratorVoiceStyle = ["female", "male", "all"].includes(input.value)
                ? input.value
                : "female";
            narratorVoiceId = "";
            saveSettings();
            syncNarratorVoiceSelection();

            if (canNarrate()) {
                speakNarration(getNarrationPreview());
            }
        });
    });

    narratorVoiceSelectEl.addEventListener("change", () => {
        narratorVoiceId = narratorVoiceSelectEl.value;
        saveSettings();
        syncNarratorVoiceSelection();

        if (canNarrate()) {
            speakNarration(getNarrationPreview());
        }
    });

    narratorVoicePrevBtn.addEventListener("click", () => {
        cycleNarratorVoice(-1);
    });

    narratorVoiceNextBtn.addEventListener("click", () => {
        cycleNarratorVoice(1);
    });

    narratorVoicePreviewBtn.addEventListener("click", () => {
        previewNarratorVoice();
    });

    adventureNumberInputEl.addEventListener("keydown", event => {
        if (event.key === "Enter" && actionInputEnterHandler) {
            event.preventDefault();
            actionInputEnterHandler();
        }
    });

    const handleViewportResize = () => {
        requestAnimationFrame(syncVirtualDicePlacement);
    };

    window.addEventListener("resize", handleViewportResize);

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleViewportResize);
        window.visualViewport.addEventListener("scroll", handleViewportResize);
    }
}

function initNarratorEngine() {
    loadSettings();
    syncOptionControls();
    syncNarratorVoiceSelection();
    syncAudioControls();
    renderDifficultySelector();

    if (speechEngine) {
        if (typeof speechEngine.addEventListener === "function") {
            speechEngine.addEventListener("voiceschanged", syncNarratorVoiceSelection);
        } else {
            speechEngine.onvoiceschanged = syncNarratorVoiceSelection;
        }
    }
}

function bootApp() {
    initNarratorEngine();
    initEventListeners();
    showMenu();
}

window.addEventListener("load", bootApp);
