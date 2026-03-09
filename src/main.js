// --- AUDIO ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;

function playTone(freq, type, duration, vol=0.1) {
    if (isMuted) return; // Halt if audio is toggled off
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function soundRoll() {
    playTone(400, 'square', 0.05, 0.05);
    setTimeout(() => playTone(600, 'square', 0.05, 0.05), 50);
    setTimeout(() => playTone(500, 'square', 0.08, 0.05), 100);
}

function soundSuccess() {
    playTone(440, 'sine', 0.1); 
    setTimeout(() => playTone(554, 'sine', 0.1), 100); 
    setTimeout(() => playTone(659, 'sine', 0.3), 200); 
}

function soundDamage() {
    playTone(150, 'sawtooth', 0.2, 0.2);
    setTimeout(() => playTone(100, 'sawtooth', 0.3, 0.2), 150);
}

// --- GAME LOGIC ---
const MAX_HP = 30;
let hp = MAX_HP;
let currentRoom = 0;
const maxRooms = 10;
let gameOver = false;
let currentEncounter = null;

const adjectives = ["feral 🐺", "shadowy 🌑", "hulking 💪", "venomous 🐍", "undead 🧟", "flaming 🔥", "crystalline 💎", "cursed 🔮"];
const monsters = ["Goblin", "Orc", "Skeleton", "Slime", "Troll", "Mimic", "Cultist", "Banshee", "Golem"];
const roomTypes = ["damp cave", "ruined library", "royal tomb", "torture chamber", "crystal cavern", "sunken shrine"];
const traps = ["tripwire", "poison dart trap", "pitfall", "swinging axe", "magic rune", "collapsing ceiling"];
const diceOptions = [4, 6, 8, 10, 12, 20, 100];

// DOM Elements
const logEl = document.getElementById('story-log');
const hpEl = document.getElementById('hp-display');
const roomEl = document.getElementById('room-display');
const inputEl = document.getElementById('dice-input');
const submitBtn = document.getElementById('submit-btn');
const digitalBtn = document.getElementById('digital-btn');
const audioToggleBtn = document.getElementById('audio-toggle-btn');
const restartAnytimeBtn = document.getElementById('restart-anytime-btn');

function addLog(text, cssClass) {
    const div = document.createElement('div');
    div.className = `log-entry ${cssClass}`;
    div.innerText = text;
    logEl.appendChild(div);
    logEl.scrollTo({ top: logEl.scrollHeight, behavior: 'smooth' });
}

function triggerVisualEffect(type) {
    if (type === 'damage') {
        document.body.classList.remove('shake');
        void document.body.offsetWidth;
        document.body.classList.add('shake');
    } else if (type === 'success') {
        logEl.classList.remove('flash-green');
        void logEl.offsetWidth;
        logEl.classList.add('flash-green');
    }
}

function generateEncounter() {
    const isCombat = Math.random() > 0.4;
    const room = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const requiredDie = diceOptions[Math.floor(Math.random() * diceOptions.length)];
    
    let dc = Math.floor(requiredDie * (0.4 + Math.random() * 0.35));
    if (dc < 2) dc = 2; 
    let damage = Math.floor(requiredDie / 4) + 2; 

    let prompt, success, fail;

    if (isCombat) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const mon = monsters[Math.floor(Math.random() * monsters.length)];
        prompt = `You enter a ${room}. A ${adj} ${mon} attacks! Roll a d${requiredDie} to attack or evade. (DC: ${dc})`;
        success = `⚔️ You outmaneuver the ${mon} and strike a fatal blow!`;
        fail = `🩸 The ${mon} overpowers you!`;
    } else {
        const trap = traps[Math.floor(Math.random() * traps.length)];
        prompt = `You navigate a ${room} and trigger a ${trap}! Roll a d${requiredDie} to dodge or disarm it. (DC: ${dc})`;
        success = `💨 You skillfully avoid the ${trap}!`;
        fail = `💥 You fail to react in time!`;
    }

    return { prompt, success, fail, requiredDie, dc, damage };
}

function startRun() {
    hp = MAX_HP;
    currentRoom = 0;
    gameOver = false;
    currentEncounter = null;
    
    hpEl.innerText = hp;
    roomEl.innerText = currentRoom;
    logEl.innerHTML = '';
    
    // Re-enable inputs in case restarting from a game over state
    submitBtn.disabled = false;
    digitalBtn.disabled = false;
    inputEl.disabled = false;

    addLog("🧙‍♂️ DM: The dungeon has shifted. A new run begins. Survive 10 rooms.", "dm-text");
    addLog("--------------------------------------------------", "dm-text");
    nextRoom();
}

function nextRoom() {
    if (currentRoom >= maxRooms) {
        winGame();
        return;
    }
    
    currentRoom++;
    roomEl.innerText = currentRoom;
    currentEncounter = generateEncounter();
    
    inputEl.placeholder = `Roll a d${currentEncounter.requiredDie}...`;
    inputEl.min = 1;
    inputEl.max = currentEncounter.requiredDie;
    
    addLog(`DM: ${currentEncounter.prompt}`, "dm-text");
}

function handleRoll(rollValue) {
    if (gameOver || !currentEncounter) return;

    if (!isMuted && audioCtx.state === 'suspended') audioCtx.resume();

    const maxDie = currentEncounter.requiredDie;
    let roll = rollValue || parseInt(inputEl.value);

    if (isNaN(roll) || roll < 1 || roll > maxDie) {
        alert(`Please enter a valid roll between 1 and ${maxDie}.`);
        return;
    }

    soundRoll();
    inputEl.value = ''; 
    addLog(`🎲 You rolled a ${roll} (d${maxDie}).`, "player-text");

    setTimeout(() => {
        if (roll === maxDie && maxDie !== 4) {
            addLog(`🌟 MAX ROLL! Critical Success!`, "success-text");
            resolveEncounter(true);
        } else if (roll === 1) {
            addLog(`💀 NATURAL 1! Critical Failure!`, "damage-text");
            resolveEncounter(false, true); 
        } else if (roll >= currentEncounter.dc) {
            resolveEncounter(true);
        } else {
            resolveEncounter(false);
        }
    }, 400);
}

function resolveEncounter(isSuccess, isCritFail = false) {
    if (isSuccess) {
        soundSuccess();
        triggerVisualEffect('success');
        addLog(currentEncounter.success, "success-text");
        
        if (Math.random() < 0.25) {
            const heal = Math.floor(Math.random() * 6) + 2;
            hp = Math.min(MAX_HP, hp + heal); 
            hpEl.innerText = hp;
            addLog(`🧪 You found a potion and healed ${heal} HP!`, "success-text");
        }

        setTimeout(() => {
            if(!gameOver) {
                addLog("--------------------------------------------------", "dm-text");
                nextRoom();
            }
        }, 1200);
    } else {
        soundDamage();
        triggerVisualEffect('damage');
        
        let dmgTaken = currentEncounter.damage;
        if (isCritFail) dmgTaken += 3; 
        
        hp -= dmgTaken;
        hpEl.innerText = hp;
        addLog(`${currentEncounter.fail} You took ${dmgTaken} damage!`, "damage-text");
        
        if (hp <= 0) {
            loseGame();
        } else {
            setTimeout(() => {
                if(!gameOver) {
                    addLog(`DM: You are still trapped! Roll d${currentEncounter.requiredDie} again. (DC: ${currentEncounter.dc})`, "dm-text");
                }
            }, 1200);
        }
    }
}

function loseGame() {
    gameOver = true;
    hpEl.innerText = "0";
    addLog("--------------------------------------------------", "damage-text");
    addLog(`🪦 YOU DIED in room ${currentRoom}. Click Restart above to try again.`, "damage-text");
    endGameUI();
}

function winGame() {
    gameOver = true;
    soundSuccess();
    setTimeout(() => playTone(880, 'sine', 0.5), 300);
    addLog("--------------------------------------------------", "success-text");
    addLog("🏆 VICTORY! You survived the shifting dungeon!", "success-text");
    endGameUI();
}

function endGameUI() {
    submitBtn.disabled = true;
    digitalBtn.disabled = true;
    inputEl.disabled = true;
}

// --- EVENT LISTENERS ---
submitBtn.addEventListener('click', () => handleRoll());
digitalBtn.addEventListener('click', () => {
    if (currentEncounter) {
        const autoRoll = Math.floor(Math.random() * currentEncounter.requiredDie) + 1;
        handleRoll(autoRoll);
    }
});

inputEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleRoll();
    }
});

// Audio Toggle
audioToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    audioToggleBtn.innerText = isMuted ? '🔇 Sound Off' : '🔊 Sound On';
    if (!isMuted && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
});

// Restart Anytime
restartAnytimeBtn.addEventListener('click', () => {
    // Optional: Only confirm if they are mid-game and alive
    if (!gameOver && currentRoom > 0 && hp > 0) {
        if (!confirm("Abandon current run and start over?")) return;
    }
    startRun();
});

// Boot up
window.onload = startRun;