const fullBackgrounds = [
    {
        id: "roadborn",
        label: "Roadborn Drifter",
        detail: "You learned to move before trouble settled in.",
        rewards: {
            inventory: ["road-torn cloak"],
            gold: 1
        }
    },
    {
        id: "farmhand",
        label: "Village Farmhand",
        detail: "Long labor and lean winters hardened you.",
        rewards: {
            inventory: ["field hook", "stout gloves"]
        }
    },
    {
        id: "castaway",
        label: "Temple Castaway",
        detail: "Prayer once gave you shelter, even if it never gave you answers.",
        rewards: {
            inventory: ["sun-mark charm"]
        }
    },
    {
        id: "courier",
        label: "Gutter Courier",
        detail: "You survived by carrying secrets faster than knives could catch you.",
        rewards: {
            inventory: ["sealed satchel"],
            gold: 2
        }
    },
    {
        id: "squire",
        label: "Failed Squire",
        detail: "You remember drills, broken oaths, and the weight of borrowed steel.",
        rewards: {
            inventory: ["worn dagger", "oath ribbon"]
        }
    },
    {
        id: "apothecary",
        label: "Debt-Bound Apothecary",
        detail: "You were taught what keeps blood inside a body and how much that knowledge costs.",
        rewards: {
            inventory: ["tonic vials"]
        }
    },
    {
        id: "ferryman",
        label: "Marsh Ferryman",
        detail: "You know what drifts in with the dark and what should never be hauled ashore.",
        rewards: {
            inventory: ["river token", "coil of rope"]
        }
    },
    {
        id: "gravekeeper",
        label: "Gravekeeper's Kin",
        detail: "The dead never frightened you as much as the living who profited from them.",
        rewards: {
            inventory: ["grave candle", "spade charm"]
        }
    }
];

const fullOrigins = [
    {
        id: "stormcoast",
        label: "Storm Coast Refugee",
        detail: "Salt wind taught you patience and the habit of reading danger before it breaks.",
        rewards: {
            inventory: ["salt charm"]
        }
    },
    {
        id: "mireborn",
        label: "Mireborn Fisher",
        detail: "You grew up on black water, bent reeds, and the sound of things hunting in fog.",
        rewards: {
            inventory: ["marsh boots"]
        }
    },
    {
        id: "quarryborn",
        label: "Red Quarry Heir",
        detail: "You know how stone gives, where it breaks, and what labor steals from a family.",
        rewards: {
            inventory: ["iron wedge"]
        }
    },
    {
        id: "valepilgrim",
        label: "Vale Pilgrim",
        detail: "You walked old shrines until their prayers sounded more like warnings than comfort.",
        rewards: {
            inventory: ["pilgrim beads"]
        }
    },
    {
        id: "emberward",
        label: "Ember Ward Foundling",
        detail: "You were raised in the shadow of old fires and learned to keep moving when sparks started talking.",
        rewards: {
            inventory: ["ash scarf"]
        }
    },
    {
        id: "cathedralward",
        label: "Cathedral Orphan",
        detail: "The cracked bells raised you harder than any parent ever could.",
        rewards: {
            inventory: ["shrine scrap"]
        }
    },
    {
        id: "caravanborn",
        label: "Caravan Child",
        detail: "Trade routes were your nursery, and strangers were safer than stillness.",
        rewards: {
            inventory: ["trade seal"],
            gold: 1
        }
    },
    {
        id: "thornwild",
        label: "Thornwild Trapper",
        detail: "You know where brush hides paths and where paths hide jaws.",
        rewards: {
            inventory: ["snare cord"]
        }
    }
];

const fullStartingBoons = [
    {
        id: "smuggled-steel",
        label: "Smuggled Steel",
        detail: "You begin with a hidden blade and the nerve to use it.",
        rewards: {
            inventory: ["smuggled shortblade"],
            gold: 2
        }
    },
    {
        id: "heirloom-charm",
        label: "Heirloom Charm",
        detail: "Something old rides with you, and so does the memory of who gave it up.",
        rewards: {
            inventory: ["heirloom charm", "healing cloth"]
        }
    },
    {
        id: "field-satchel",
        label: "Field Satchel",
        detail: "Bandages, bitterroot, and practical sense beat luck more often than people admit.",
        rewards: {
            inventory: ["field satchel", "bandage roll"]
        }
    },
    {
        id: "lantern-kit",
        label: "Lantern Kit",
        detail: "Darkness cannot own a road if you carry the right kind of light.",
        rewards: {
            inventory: ["hooded lantern", "lamp oil"]
        }
    },
    {
        id: "lockwallet",
        label: "Lockwallet",
        detail: "Somebody paid you in tools instead of trust, and that was enough.",
        rewards: {
            inventory: ["slim lockpick"],
            gold: 5
        }
    },
    {
        id: "loaded-bones",
        label: "Loaded Bone Dice",
        detail: "You keep a gambler's relic on you, and sometimes fortune pretends not to notice.",
        rewards: {
            inventory: ["loaded bone dice"],
            rerolls: 1
        }
    }
];

const fullDistricts = [
    {
        id: "blackmere-road",
        label: "Blackmere Road",
        detail: "Old milestones lean toward the marsh while caravans vanish between soaked trees.",
        rewards: {
            inventory: ["road map"],
            gold: 1
        }
    },
    {
        id: "lantern-quarter",
        label: "Lantern Quarter",
        detail: "Every window burns low and every alley keeps a second mouth for rumor.",
        rewards: {
            inventory: ["lantern token"]
        }
    },
    {
        id: "miregate-slip",
        label: "Miregate Slip",
        detail: "Docks rot in black water while smugglers and ferrymen sell the same lies with different smiles.",
        rewards: {
            inventory: ["ferry chit"]
        }
    },
    {
        id: "gallows-end",
        label: "Gallows End",
        detail: "Rope bridges, execution posts, and hard-eyed watchers make every step feel judged.",
        rewards: {
            inventory: ["execution nail"]
        }
    },
    {
        id: "ashmarket-rise",
        label: "Ashmarket Rise",
        detail: "Merchants haggle under soot and half the goods on offer were stolen before dawn.",
        rewards: {
            inventory: ["market chit"],
            gold: 2
        }
    },
    {
        id: "rookwatch-fields",
        label: "Rookwatch Fields",
        detail: "Scarecrows lean over wet grain while abandoned watch posts stare at the tree line.",
        rewards: {
            inventory: ["field whistle"]
        }
    },
    {
        id: "brasshook-docks",
        label: "Brasshook Docks",
        detail: "Chain cranes and rusted hulls make the waterline sound like a battlefield at night.",
        rewards: {
            inventory: ["dock hook"]
        }
    },
    {
        id: "thornwall-ward",
        label: "Thornwall Ward",
        detail: "A once-rich district now hides behind boarded windows, private guards, and trimmed briars gone wild.",
        rewards: {
            inventory: ["ward pass"]
        }
    },
    {
        id: "hollow-bell-close",
        label: "Hollow Bell Close",
        detail: "The bells still ring here, but nobody agrees on who pulls the ropes.",
        rewards: {
            inventory: ["bell scrap"]
        }
    },
    {
        id: "salt-widow-steps",
        label: "Salt Widow Steps",
        detail: "Tight stairways, bitter wind, and sea-blown shrines stack a thousand grudges on one slope.",
        rewards: {
            inventory: ["salted prayer ribbon"]
        }
    }
];

const fullChapterWeathers = [
    "Cold rain drags sideways through the ward",
    "River fog swallows the alleys and leaves every light haloed",
    "Heat lightning claws over the rooftops without ever breaking",
    "A hard frost whitens the cobbles and stiffens every hinge",
    "Lantern smoke clots the sky above the chimneys",
    "A bruise-colored dawn hangs low and refuses to rise",
    "Wind worries every sign chain and rattles every shutter",
    "Ash drifts in lazy sheets from some fire nobody admits to starting",
    "Mildew mist beads on stone and leather alike",
    "Thunder rolls underfoot as if the streets themselves were unsettled"
];

const fullChapterPressures = [
    "{faction} are sweeping hard and asking the wrong questions",
    "a fresh bounty is moving faster than rumor",
    "grave bells keep ringing with no hands on the ropes",
    "{threat} have started claiming whole blocks after sundown",
    "somebody is buying maps to the sealed places under {district}",
    "the city watch is leaning on anyone who looks newly armed",
    "smugglers are moving bodies instead of cargo tonight",
    "an old debt is waking up in the wrong quarter",
    "every safehouse in {district} is charging blood instead of coin",
    "{faction} are burning records before dawn can find them",
    "a hunting party is closing around the district one alley at a time",
    "the people of {district} are locking doors and hiding keys"
];

const fullChapterObjectives = [
    "A missing courier vanished carrying proof tied to {faction}",
    "Someone will pay well for what is hidden under {district}",
    "A sealed route through the district has finally cracked open",
    "{contact} swears there is a prize here worth killing for",
    "The night's best leverage is buried somewhere beneath the noise",
    "A rival crew reached {district} first, but not by much",
    "If you leave before finding the truth here, somebody else writes the story",
    "{threat} are guarding something too valuable to move in daylight",
    "An old cache tied to {faction} surfaced with the tide and then vanished again",
    "The district keeps pointing at the same secret from three different angles",
    "A survivor from last night wants you to finish what they could not",
    "The road says your next break is somewhere inside {district}"
];

const fullChapterOmens = [
    "Every dog in the district is barking toward the same alley.",
    "You keep finding the same footprint turned the wrong way.",
    "No candle in the ward will stay lit for long.",
    "A child's song keeps surfacing where no children should be.",
    "Every locked door has fresh scratches around the keyhole.",
    "The night's first corpse is missing its shadow.",
    "Something under the street answers footsteps a beat too late.",
    "{contact} insists the district is remembering your name already.",
    "The bells ring one note lower every hour.",
    "Even the thieves in {district} are walking like they are being watched."
];

const fullChapterThreats = [
    "grave crows",
    "charcoal-eyed mercenaries",
    "reef-cut smugglers",
    "bonepickers",
    "bell-cloaked zealots",
    "a rusted automaton patrol",
    "marsh hounds",
    "masked debt collectors",
    "carrion monks",
    "thorn-armored scavengers",
    "dockside killers",
    "salt-soaked revenants"
];

const fullFactionNames = [
    "the Lamplighters",
    "the Rook Syndicate",
    "the Ash Choir",
    "the Mire Court",
    "the Thorn Compact",
    "the Bellwardens",
    "the Hook Guild",
    "the Night Cartel"
];

const fullRumorTemplates = [
    "{contact} says {faction} already bought three keys to {district}.",
    "A ferryman swears the dead are paying passage in {district}.",
    "The watch thinks {threat} are nesting under a grain house nearby.",
    "Nobody in {district} has seen dawn from the same rooftop twice this week.",
    "{contact} insists a buried ledger in {district} names every buyer worth fearing.",
    "A drunk merchant says the safest house in the district changed owners without opening its door.",
    "{faction} are paying double for names and triple for silence.",
    "Someone heard chains moving under {district} long after the forges went dark.",
    "The last crew through here left coin behind because they ran out of time.",
    "A chapel wall in {district} opened by itself and then forgot how.",
    "The district's best smuggler route is being guarded like a shrine.",
    "{contact} claims a map of the ward redraws itself every midnight."
];

const fullRestDescriptions = [
    "You duck into a lamp-black attic and wait out the worst of the hunt.",
    "A ferryman gives you a dry bench and asks no questions worth answering.",
    "You buy half a room, a hard bed, and one hour without pursuit.",
    "An abandoned shrine gives you four walls and just enough peace to breathe.",
    "You sleep behind stacked crates while rain hammers the roof above.",
    "A cellar under a butcher shop turns out to be safer than it smells.",
    "A shuttered apothecary lets you patch yourself in candlelight.",
    "You find shelter in a broken watch post before the district can turn on you again."
];

const fullNpcFirstNames = ["Mara", "Tovin", "Sable", "Bran", "Iris", "Corin", "Vera", "Lark", "Orin", "Nessa", "Pike", "Elra"];
const fullNpcEpithets = ["Redhand", "Vale", "Mourn", "Ash", "Thread", "Crow", "Salt", "Rook", "Mire", "Vane", "Gleam", "Hollow"];

const fullLeadTemplates = [
    {
        id: "watchtower-cache",
        label: "Ruined Watchtower",
        title: "Climb the ruined watchtower",
        summary: "climb the ruined watchtower above {district} and wrench open its hidden cache",
        text: "The {weather}. Halfway up, {threat} are already working at a sealed chest under the landing.",
        statKey: "str",
        dc: 12,
        damage: 2,
        calling: ["Blade", "Marshal"],
        success: [
            "You haul the cache loose before the tower can betray you again.",
            "You force the old landing to give way and claim the watchtower's secret."
        ],
        fail: [
            "A broken step snaps and the tower answers with stone and splinters.",
            "{threat} meet you on the landing and make the climb costly."
        ],
        epilogue: [
            "The road answers strength with steel. A hard calling gathers around you.",
            "You solve the night by force, and the shape of a frontline calling grows clearer."
        ],
        rewards: {
            goldRange: [2, 5],
            inventoryPool: ["weathered spear", "marching orders", "tower key", "brass buckler"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "armory",
                label: "Pry open the armory",
                title: "Break the sealed armory",
                text: "A warped iron door still guards the upper room. The lock remembers every failed hand.",
                statKey: "int",
                dc: 13,
                damage: 2,
                success: "You read the frame correctly and open the room without bringing it down.",
                fail: "You guess wrong, jam the hinges, and wear the splintering rebound.",
                rewards: {
                    goldRange: [2, 4],
                    inventoryPool: ["signal flare", "oilskin map", "tower bolt", "brass buckler"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "signal",
                label: "Light the signal brazier",
                title: "Wake the signal brazier",
                text: "A cold brazier hangs over the parapet. If you light it, somebody will answer.",
                statKey: "cha",
                dc: 11,
                damage: 1,
                success: "The right scout answers the flare and throws you coin and a warning before vanishing.",
                fail: "The wrong eyes catch the flame, and escaping them hurts.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["tower key", "sealed warning", "watch token"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "chapel-bells",
        label: "Cracked Chapel Bells",
        title: "Answer the chapel bells",
        summary: "follow the cracked bells of {district} toward a half-buried chapel",
        text: "Each broken note carries through the ward. Beneath the floor, something is still answering prayer.",
        statKey: "wis",
        dc: 12,
        damage: 2,
        calling: ["Faith", "Seer"],
        success: [
            "You find the hidden reliquary before the chapel's dead can close around it.",
            "You keep your nerve and pull a useful blessing out of a place that wanted worship instead."
        ],
        fail: [
            "The cold voice under the stone gets too close before you can pull away.",
            "The chapel answers back and leaves a bruise deeper than the floorboards."
        ],
        epilogue: [
            "You hear patterns where most people hear dread. A sacred road is opening.",
            "The night keeps offering you signs, and you keep reading them correctly."
        ],
        rewards: {
            goldRange: [1, 3],
            inventoryPool: ["sun-mark charm", "healing cloth", "reliquary shard", "chapel key"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "crypt",
                label: "Descend into the crypt",
                title: "Open the chapel crypt",
                text: "A narrow crypt stair drops under the altar, breathing stale incense and colder air.",
                statKey: "con",
                dc: 13,
                damage: 2,
                success: "You outlast the crypt's stale breath and drag a prize back into the light.",
                fail: "The air below turns on you and forces a stumbling retreat.",
                rewards: {
                    goldRange: [2, 5],
                    inventoryPool: ["reliquary coffer", "grave chain", "blessed nails"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "lanterns",
                label: "Relight the prayer lanterns",
                title: "Wake the prayer lanterns",
                text: "A row of dead lanterns lines the aisle. If they burn again, the chapel may show its real shape.",
                statKey: "cha",
                dc: 11,
                damage: 1,
                success: "The room steadies in the new light and leaves you richer for your nerve.",
                fail: "The flame leaps too hot, bursts glass, and drives you back through smoke.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["silver tithe", "lantern glass", "chapel token"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "caravan-tracks",
        label: "Fresh Caravan Tracks",
        title: "Follow the caravan tracks",
        summary: "slip after the fresh caravan tracks cutting away from {district}",
        text: "The churned mud runs hard toward the brush. Whoever fled here dropped more than speed behind them.",
        statKey: "dex",
        dc: 12,
        damage: 2,
        calling: ["Shadow", "Warden"],
        success: [
            "You outpace the patrol and recover what the fleeing crew could not carry.",
            "The trail gives you exactly one clean opening, and you take it."
        ],
        fail: [
            "A snapping branch gives you away and the chase turns ugly fast.",
            "The hunters double back smarter than expected, and you pay for the mistake."
        ],
        epilogue: [
            "You move like somebody born for alleys, shutters, and locked windows.",
            "Stealth fits you too naturally now to call it luck."
        ],
        rewards: {
            goldRange: [4, 7],
            inventoryPool: ["hunter's knife", "dropped purse", "route tag", "smuggler clasp"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "camp",
                label: "Raid the abandoned camp",
                title: "Turn the camp inside out",
                text: "A lean camp still smolders beside the trail. Its owners are gone, but not by much.",
                statKey: "str",
                dc: 12,
                damage: 2,
                success: "You strip the camp fast and vanish with the best of it.",
                fail: "The owners swing back too soon and drive you through thorns to live.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["map scrap", "salted jerky", "camp sigil"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "bargain",
                label: "Shadow them and bargain",
                title: "Trade leverage for coin",
                text: "You catch the smugglers before they realize how much you already know.",
                statKey: "cha",
                dc: 11,
                damage: 1,
                success: "They buy your silence with coin and a route mark burned into brass.",
                fail: "They smile, stall, and then start throwing knives.",
                rewards: {
                    goldRange: [4, 8],
                    inventoryPool: ["route tag", "smuggler token", "quiet favor"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "flooded-cistern",
        label: "Flooded Cistern",
        title: "Drop into the flooded cistern",
        summary: "drop into a flooded cistern beneath {district} before the current claims the cache below",
        text: "Black water swirls under a broken hatch. The cistern walls breathe mildew and old iron.",
        statKey: "con",
        dc: 12,
        damage: 2,
        calling: ["Warden", "Iron"],
        success: [
            "You outlast the cold and pull a prize from the current before it takes you with it.",
            "The cistern tries to drown your nerve first, but your body refuses the lesson."
        ],
        fail: [
            "The water drags you under the stone lip and leaves you coughing blood and algae.",
            "A hidden current slams you into the wall before you can plant your feet."
        ],
        epilogue: [
            "Endurance has become its own weapon in your hands.",
            "You are learning how to keep moving after the moment that should have stopped you."
        ],
        rewards: {
            goldRange: [2, 5],
            inventoryPool: ["river pearls", "waterlogged ledger", "cistern seal", "rusted chain key"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "sluice",
                label: "Reset the sluice gate",
                title: "Force the sluice gate",
                text: "A jammed sluice controls the water level. It can either save the chamber or flatten you.",
                statKey: "int",
                dc: 13,
                damage: 2,
                success: "You read the gate's pattern and turn the flood into your ally.",
                fail: "You mistime the crank and the next surge batters you hard.",
                rewards: {
                    goldRange: [2, 5],
                    inventoryPool: ["sluice sigil", "brass valve key", "dry archive page"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "crawl",
                label: "Crawl the overflow tunnel",
                title: "Work through the overflow tunnel",
                text: "A side tunnel snakes away shoulder-wide and slick with silt.",
                statKey: "dex",
                dc: 12,
                damage: 1,
                success: "You wriggle through first and find what the broader tunnel could not hold.",
                fail: "The stone bites down and you leave skin and breath behind.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["sealed vial", "silt-cut coin", "hidden latch key"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "stolen-ledger",
        label: "Rat King's Ledger",
        title: "Recover the stolen ledger",
        summary: "trace a stolen ledger through the back rooms of {district}",
        text: "Somebody stole the wrong book from {faction}, and now half the ward is looking for the pages.",
        statKey: "int",
        dc: 12,
        damage: 2,
        calling: ["Hexer", "Broker"],
        success: [
            "You read the scramble of clues correctly and find the ledger before its last owner does.",
            "The puzzle breaks in your hands, and the district gives up names it wanted buried."
        ],
        fail: [
            "You open the wrong lock and the hidden defense answers immediately.",
            "The false trail costs you time, blood, and almost the truth."
        ],
        epilogue: [
            "You are starting to think like somebody who wins with patterns instead of muscle.",
            "The night's knots loosen when you pull the right thread."
        ],
        rewards: {
            goldRange: [3, 6],
            inventoryPool: ["blackmail ledger", "cipher wheel", "ink-stained seal", "coded page"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "stacks",
                label: "Slip the record stacks",
                title: "Move through the record stacks",
                text: "Tall shelves and tighter corridors create more blind spots than safety.",
                statKey: "dex",
                dc: 12,
                damage: 1,
                success: "You ghost through the stacks and come out with the best page intact.",
                fail: "A dropped ledger echoes like a bell and brings company running.",
                rewards: {
                    goldRange: [2, 5],
                    inventoryPool: ["sealed testimony", "stack key", "ledger ribbon"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "broker",
                label: "Lean on the book broker",
                title: "Pressure the broker",
                text: "{contact} knows who moved the ledger, but selling truth is their first instinct.",
                statKey: "cha",
                dc: 11,
                damage: 1,
                success: "You buy, bluff, and corner the broker into giving up the right name.",
                fail: "The broker stalls until hired muscle arrives behind you.",
                rewards: {
                    goldRange: [4, 7],
                    inventoryPool: ["broker's favor", "quiet contract", "ink coin"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "whisper-market",
        label: "Whisper Market Auction",
        title: "Crash the whisper market",
        summary: "walk into a whisper market in {district} and leave with the best price or the best lie",
        text: "Under shuttered lanterns, buyers whisper over a prize nobody wants to name out loud.",
        statKey: "cha",
        dc: 12,
        damage: 2,
        calling: ["Broker", "Shadow"],
        success: [
            "You take control of the room before the room realizes it should have feared you.",
            "A cleaner lie wins the table, and the auction breaks your way."
        ],
        fail: [
            "The crowd reads your angle too late to spare you the retaliation.",
            "You lose the room for one fatal breath and the market punishes the gap."
        ],
        epilogue: [
            "People are beginning to move when you speak, even when they hate it.",
            "Charisma is turning into leverage, and leverage into survival."
        ],
        rewards: {
            goldRange: [4, 8],
            inventoryPool: ["auction token", "silk purse", "coded invitation", "ring of introduction"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "read-room",
                label: "Read the bidders",
                title: "Study the bidders",
                text: "Every nod and every pause in the room says more than the bids themselves.",
                statKey: "wis",
                dc: 12,
                damage: 1,
                success: "You spot the real buyer and cut the crowd out of the deal.",
                fail: "You read the wrong face and walk into the trap smiling.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["bidder seal", "silenced warrant", "house marker"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "forge-token",
                label: "Forge a buyer's token",
                title: "Counterfeit the token",
                text: "A single brass token opens the best table in the room.",
                statKey: "int",
                dc: 13,
                damage: 2,
                success: "The counterfeit passes long enough for you to steal what matters.",
                fail: "The token fails in someone's hand and the whole room turns sharp.",
                rewards: {
                    goldRange: [4, 7],
                    inventoryPool: ["counterfeit mold", "brass buyer token", "auction ledger"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "grave-orchard",
        label: "Grave Orchard",
        title: "Walk the grave orchard",
        summary: "cross the grave orchard beyond {district} and read what the dead are trying to warn you about",
        text: "Crooked grave trees rattle with bone charms, and every furrow smells like old rain and older secrets.",
        statKey: "wis",
        dc: 12,
        damage: 2,
        calling: ["Faith", "Hexer"],
        success: [
            "You read the warning in time and claim what the orchard was trying to hide.",
            "The dead point you toward the right root and away from the worst hunger."
        ],
        fail: [
            "You mistake a warning for an invitation and the orchard closes around you.",
            "The grave rows turn wrong under your feet before you can break their pull."
        ],
        epilogue: [
            "You are learning to hear the difference between fear and prophecy.",
            "The dark keeps talking, and you keep surviving the conversation."
        ],
        rewards: {
            goldRange: [2, 5],
            inventoryPool: ["grave bloom", "bone charm", "orchard key", "ancestor scrap"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "roots",
                label: "Hack through the root cellar",
                title: "Break the root cellar open",
                text: "A cellar door below the orchard is welded shut with living root.",
                statKey: "str",
                dc: 12,
                damage: 2,
                success: "You tear the roots wide and take the cellar's best secret with you.",
                fail: "The roots snap back harder than rope and leave their mark.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["grave spade", "burial ring", "earthbound seal"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "breath",
                label: "Breathe the dust and continue",
                title: "Outlast the grave dust",
                text: "The only path forward runs through a chamber thick with pale dust.",
                statKey: "con",
                dc: 12,
                damage: 2,
                success: "You grit through the choking haze and come out carrying proof.",
                fail: "The dust gets in your lungs and makes the rest of the night hurt.",
                rewards: {
                    goldRange: [2, 5],
                    inventoryPool: ["grave dust vial", "mourning coin", "root lantern"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "chainlift-quarry",
        label: "Broken Chainlift",
        title: "Ride the broken chainlift",
        summary: "take a broken chainlift down into an old cut beneath {district}",
        text: "The lift still moves if somebody is reckless enough to trust it. Tonight that somebody might be you.",
        statKey: "str",
        dc: 12,
        damage: 2,
        calling: ["Marshal", "Iron"],
        success: [
            "You force the chainlift to obey long enough to reach the prize below.",
            "Steel, leverage, and nerve get you down and back before the rig decides to die."
        ],
        fail: [
            "A link bursts under strain and throws the whole descent sideways.",
            "The lift answers your weight with a scream and a brutal swing."
        ],
        epilogue: [
            "You keep turning failing machinery into opportunity.",
            "The harsher the tool, the better it seems to fit your hands."
        ],
        rewards: {
            goldRange: [3, 6],
            inventoryPool: ["quarry token", "iron wedge", "ore sample", "lift key"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "fumes",
                label: "Walk the blasting tunnel",
                title: "Outlast the blasting tunnel",
                text: "Blasting fumes still hang in the lower cut, thick enough to make light wobble.",
                statKey: "con",
                dc: 12,
                damage: 2,
                success: "You keep your feet and lungs under you long enough to claim the lower cache.",
                fail: "The fumes take their tax before you can escape them.",
                rewards: {
                    goldRange: [2, 5],
                    inventoryPool: ["blasting chalk", "miners' paybox", "iron respirator"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "plans",
                label: "Read the survey plans",
                title: "Decode the quarry plans",
                text: "A soaked survey board leans against the wall, full of marks only a patient eye will trust.",
                statKey: "int",
                dc: 13,
                damage: 1,
                success: "You find the hidden shaft on paper before anybody else finds it in the dark.",
                fail: "You read the marks wrong and step where the stone is thinnest.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["survey slate", "vein map", "quarry seal"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "glasshouse-fire",
        label: "Shattered Glasshouse",
        title: "Cross the shattered glasshouse",
        summary: "cross a shattered glasshouse in {district} before its fire gutters out",
        text: "Broken panes throw back orange light while heat rolls through rows of dead vines and hidden blades.",
        statKey: "dex",
        dc: 12,
        damage: 2,
        calling: ["Shadow", "Blade"],
        success: [
            "You move through fire and glass without giving either the chance to keep you.",
            "The fastest line through the ruin is yours, and the prize survives because of it."
        ],
        fail: [
            "Glass gives underfoot and the ruin collects its payment in blood.",
            "A burst of heat blinds you long enough for the room to cut you open."
        ],
        epilogue: [
            "Speed and precision are becoming second nature.",
            "You are learning that an opening only has to exist for one heartbeat."
        ],
        rewards: {
            goldRange: [3, 6],
            inventoryPool: ["glass cutter", "charred ledger page", "greenhouse key", "emberglass shard"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "smoke",
                label: "Push through the smoke room",
                title: "Endure the smoke room",
                text: "A side chamber is full of rolling smoke and half-burned shelving.",
                statKey: "con",
                dc: 12,
                damage: 2,
                success: "You keep low, keep breathing, and drag out what the fire missed.",
                fail: "The smoke strips the strength from your legs before you can clear it.",
                rewards: {
                    goldRange: [2, 5],
                    inventoryPool: ["smoke filter", "charcoal bloom", "glass vial"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "broker",
                label: "Sell the salvage fast",
                title: "Move the salvage before dawn",
                text: "{contact} offers quick coin for whatever you can carry out of the ruin.",
                statKey: "cha",
                dc: 11,
                damage: 1,
                success: "You talk the price upward and leave richer than the room expected.",
                fail: "The broker reads your urgency and cuts you while smiling.",
                rewards: {
                    goldRange: [4, 8],
                    inventoryPool: ["broker's chit", "hot goods note", "ember token"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "moonwell-observatory",
        label: "Moonwell Observatory",
        title: "Unlock the moonwell observatory",
        summary: "unlock the drowned observatory on the edge of {district}",
        text: "A brass dome sits half-submerged beyond the ward, its mechanisms still twitching in the dark.",
        statKey: "int",
        dc: 12,
        damage: 2,
        calling: ["Seer", "Hexer"],
        success: [
            "The observatory yields when you match thought to mechanism.",
            "You wake the old brass logic just long enough to take what matters."
        ],
        fail: [
            "The mechanism bites back with a snap of gears and dirty water.",
            "You force the wrong sequence and the room answers like a sprung trap."
        ],
        epilogue: [
            "Old machines and stranger truths are starting to open for you.",
            "You think in angles now, and the world keeps rewarding it."
        ],
        rewards: {
            goldRange: [3, 6],
            inventoryPool: ["star chart", "moonwell lens", "brass astrolabe tooth", "tidal notes"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "well",
                label: "Read the moonwell surface",
                title: "Read the moonwell",
                text: "The black water below reflects more than the sky when someone looks correctly.",
                statKey: "wis",
                dc: 12,
                damage: 1,
                success: "You see past the surface and take a clue no map could have given you.",
                fail: "The reflection shows too much, too fast, and leaves you reeling.",
                rewards: {
                    goldRange: [2, 5],
                    inventoryPool: ["moonwell omen", "silver reed", "drowned route mark"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "rafters",
                label: "Cross the collapsed rafters",
                title: "Move across the rafters",
                text: "A broken walkway hangs above the central chamber with just enough structure left to tempt you.",
                statKey: "dex",
                dc: 12,
                damage: 2,
                success: "You make the crossing and reach the sealed case beyond the break.",
                fail: "The rafters shift under you and nearly finish the job the water started.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["sealed case", "brass token", "skyglass shard"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "kennel-riot",
        label: "Foggy Kennels",
        title: "Quiet the foggy kennels",
        summary: "cross the foggy kennels under {district} before the hunting beasts are loosed",
        text: "Chains knock softly in the fog while something big breathes behind rotten boards.",
        statKey: "con",
        dc: 12,
        damage: 2,
        calling: ["Warden", "Blade"],
        success: [
            "You hold your ground long enough to take the kennel master's best prize.",
            "The beasts smell fear, not you, and that changes the whole room."
        ],
        fail: [
            "A lunge from the fog takes its bite before you can answer.",
            "The kennel breaks open all at once and the pack leaves you bleeding."
        ],
        epilogue: [
            "The night is learning it cannot simply outlast you.",
            "Pain keeps showing up late to your fights now."
        ],
        rewards: {
            goldRange: [2, 5],
            inventoryPool: ["kennel key", "iron whistle", "hunting collar", "bone token"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "mastiff",
                label: "Break the lead mastiff",
                title: "Bring down the lead mastiff",
                text: "One chained brute is controlling the whole room through raw threat.",
                statKey: "str",
                dc: 12,
                damage: 2,
                success: "You break the beast's charge and claim the kennel master's leverage.",
                fail: "The impact lands before your grip does.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["chain lead", "beast-tag", "keeper's key"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "handler",
                label: "Turn the handler",
                title: "Win over the handler",
                text: "{contact} knows how to quiet the pack if you can reach them before the fear does.",
                statKey: "cha",
                dc: 11,
                damage: 1,
                success: "The handler swings the room your way and leaves you with a new favor owed.",
                fail: "The handler folds under pressure, and the pack follows their panic.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["handler's favor", "quiet whistle", "kennel route note"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    },
    {
        id: "velvet-theatre",
        label: "Velvet Theatre",
        title: "Slip backstage at the velvet theatre",
        summary: "slip backstage at the velvet theatre in {district} and steal the scene before anyone else can",
        text: "Music leaks through torn curtains while every dressing room hides one more agenda than face.",
        statKey: "cha",
        dc: 12,
        damage: 2,
        calling: ["Broker", "Seer"],
        success: [
            "You own the room before the actors realize the play changed hands.",
            "A better performance, a sharper lie, and the theatre opens right up to you."
        ],
        fail: [
            "You lose the audience for one breath and the knives come out behind the curtains.",
            "The wrong applause covers the wrong move, and the theatre takes advantage."
        ],
        epilogue: [
            "Presence is becoming its own kind of weapon for you.",
            "You understand now that a stage and an ambush often share the same floor."
        ],
        rewards: {
            goldRange: [4, 7],
            inventoryPool: ["velvet pass", "playbill code", "stage key", "masked ring"],
            inventoryCount: [1, 2]
        },
        followups: [
            {
                id: "catwalk",
                label: "Cross the catwalks",
                title: "Move over the catwalks",
                text: "The best vantage in the house hangs above a drop and three weak planks.",
                statKey: "dex",
                dc: 12,
                damage: 2,
                success: "You cross cleanly and take the theatre's best-kept secret from above.",
                fail: "A missed step turns the rafters into a weapon against you.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["catwalk key", "stage lantern", "hidden script"],
                    inventoryCount: [1, 2]
                }
            },
            {
                id: "script",
                label: "Decode the prompt script",
                title: "Read the hidden script",
                text: "A stage manager's script lies open, full of marks that look more like signals than cues.",
                statKey: "int",
                dc: 13,
                damage: 1,
                success: "You decode the script and find the message tucked between performances.",
                fail: "You chase the wrong interpretation until the room turns hostile.",
                rewards: {
                    goldRange: [3, 6],
                    inventoryPool: ["hidden script", "director's seal", "prompt key"],
                    inventoryCount: [1, 2]
                }
            }
        ]
    }
];

const fullFinaleTemplates = [
    {
        id: "pressure-point",
        title: "Break the pressure point",
        text: "The district offers one last opening. Lean on {bestStatLabel} and turn {pressure} back on itself.",
        success: [
            "You crack the district open and leave with the chapter's cleanest leverage.",
            "The night's pressure breaks before you do, and you walk away holding the best of it."
        ],
        fail: [
            "The district catches you overreaching and answers with a hard lesson.",
            "You press one beat too long and the ward punishes the greed."
        ],
        epilogue: [
            "{name} is becoming the kind of traveler this city remembers.",
            "Your calling sharpens every time you refuse to leave a chapter half-finished."
        ],
        damage: 2,
        rewards: {
            goldRange: [4, 7],
            inventoryPool: ["inked map fragment", "sealed warrant", "blackmail ledger page", "district key"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "rival-hideout",
        title: "Hit the rival hideout",
        text: "A rival crew is staging out of {district}. Lean on {bestStatLabel} and take their leverage before dawn.",
        success: [
            "You break the hideout clean and leave them with nothing but broken plans.",
            "The rival crew folds faster than expected once you hit the right seam."
        ],
        fail: [
            "The hideout is better prepared than rumor promised.",
            "Your timing slips, and the rival crew is waiting for exactly that."
        ],
        epilogue: [
            "You are starting to leave bruises on the city's power structure.",
            "Not every chapter ends with a corpse, but more of them now end in your favor."
        ],
        damage: 2,
        rewards: {
            goldRange: [3, 7],
            inventoryPool: ["rival sigil", "counterfeit pass", "pay ledger", "safehouse map"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "sealed-route",
        title: "Open the sealed route",
        text: "Somewhere under {district}, a sealed route is finally vulnerable. {bestStatLabel} is your best chance to take it.",
        success: [
            "You open the path and harvest everything valuable before the ward notices.",
            "The route yields just enough to change the next chapter."
        ],
        fail: [
            "The seal opens the wrong way and the backlash finds you first.",
            "The hidden route proves why it stayed closed so long."
        ],
        epilogue: [
            "You are turning buried doors into opportunities now.",
            "The city keeps hiding things, and you keep teaching it why that no longer works."
        ],
        damage: 2,
        rewards: {
            goldRange: [4, 8],
            inventoryPool: ["route sigil", "smuggler chain", "seal fragment", "buried charter"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "chase-silence",
        title: "Catch the silence broker",
        text: "{contact} is trying to leave {district} carrying the chapter's best secret. {bestStatLabel} decides whether they keep it.",
        success: [
            "You catch the broker before the district can close behind them.",
            "A cleaner move wins the pursuit and the secret changes hands."
        ],
        fail: [
            "The broker had a cleaner exit prepared than you did.",
            "You almost catch them, which hurts worse than missing entirely."
        ],
        epilogue: [
            "The hunt is beginning to bend toward your pace.",
            "Secrets travel through this city, but fewer of them escape you now."
        ],
        damage: 2,
        rewards: {
            goldRange: [4, 7],
            inventoryPool: ["sealed confession", "broker's purse", "silent route pass", "name list"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "midnight-cache",
        title: "Crack the midnight cache",
        text: "A chapter like this always hides one last cache. Lean on {bestStatLabel} and take it before the ward wakes.",
        success: [
            "You break the cache and leave the district poorer than it planned.",
            "The final lock gives, and the night pays out in full."
        ],
        fail: [
            "The cache is trapped more cleverly than expected.",
            "The last lock turns into the night's hardest bite."
        ],
        epilogue: [
            "You are getting too dangerous to ignore now.",
            "Every chapter ends with more of the city in your pockets."
        ],
        damage: 2,
        rewards: {
            goldRange: [5, 8],
            inventoryPool: ["midnight cache key", "stolen tithe", "map fragment", "moon-silver token"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "turn-the-hunt",
        title: "Turn the hunt around",
        text: "{threat} think they have you marked. Use {bestStatLabel} and show them how wrong they are.",
        success: [
            "You reverse the hunt and walk off with their best tools.",
            "The predators misjudge the night, and you make them regret it."
        ],
        fail: [
            "The counter-ambush lands late, and the price is immediate.",
            "They read your angle just well enough to make it hurt."
        ],
        epilogue: [
            "Predators are beginning to learn your name the hard way.",
            "The city hunts everything. Tonight it learned you hunt back."
        ],
        damage: 2,
        rewards: {
            goldRange: [3, 7],
            inventoryPool: ["hunter's chain", "threat token", "pursuit map", "blood-marked purse"],
            inventoryCount: [1, 2]
        }
    }
];

const fullAllianceTemplates = [
    {
        id: "backroom-oath",
        title: "Court a backroom ally",
        text: "{contact}, a fixer tied to {faction}, will hear you out if your nerve holds.",
        success: "The meeting lands clean. You leave with a new ally and a favor that will matter later.",
        fail: "The meeting sours, and getting out intact costs blood and pride.",
        epilogue: "{name} is building a network instead of just a body count.",
        damage: 1,
        rewards: {
            goldRange: [1, 3],
            inventoryPool: ["favor owed by {contact}", "quiet introduction", "ally token"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "shrine-compact",
        title: "Make a shrine-side compact",
        text: "A wary keeper at a side shrine knows things that do not survive daylight. They might share them with the right voice.",
        success: "The keeper trusts your tone and parts with a useful vow and a safer route.",
        fail: "Your approach lands wrong, and the keeper's friends make sure you feel it.",
        epilogue: "Even the cautious are beginning to take your side.",
        damage: 1,
        rewards: {
            goldRange: [1, 3],
            inventoryPool: ["shrine blessing", "keeper's route note", "favor owed by {contact}"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "dockside-contact",
        title: "Buy a dockside contact",
        text: "{contact} has one boat, two lies, and access to exactly the part of the city you need.",
        success: "You buy the truth instead of the lie and gain a contact worth keeping.",
        fail: "The contact tries to sell you twice and the second price is pain.",
        epilogue: "Useful people are beginning to remember you favorably.",
        damage: 1,
        rewards: {
            goldRange: [2, 4],
            inventoryPool: ["dockside contact", "river shortcut", "favor owed by {contact}"],
            inventoryCount: [1, 2]
        }
    },
    {
        id: "watch-bribe",
        title: "Turn a watch officer",
        text: "A tired watch officer in {district} is closer to compromise than duty. If you read them right, they can become an asset.",
        success: "Coin, timing, and tone line up. The officer bends your way for now.",
        fail: "The offer lands badly and the officer answers with steel instead of silence.",
        epilogue: "You are not just surviving the city anymore. You are learning how to bend it.",
        damage: 1,
        rewards: {
            goldRange: [1, 3],
            inventoryPool: ["watch favor", "patrol route", "favor owed by {contact}"],
            inventoryCount: [1, 2]
        }
    }
];
