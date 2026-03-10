// --- AUDIO ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;
const narratorSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
const speechEngine = narratorSupported ? window.speechSynthesis : null;
const NARRATOR_SETTINGS_KEY = 'ddr-narrator-settings';
const narratorVoiceKeywords = {
    female: ['female', 'woman', 'zira', 'samantha', 'victoria', 'ava', 'allison', 'aria', 'jenny', 'joanna', 'karen', 'moira', 'salli', 'serena', 'emma'],
    male: ['male', 'man', 'david', 'mark', 'daniel', 'alex', 'fred', 'arthur', 'brian', 'george', 'james', 'oliver', 'ryan', 'steven', 'tom', 'guy', 'matthew']
};
let narratorEnabled = false;
let narratorVoiceStyle = 'female';
let selectedNarratorVoice = null;

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
let isRollPending = false;
let runToken = 0;

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
const narratorToggleBtn = document.getElementById('narrator-toggle-btn');
const restartAnytimeBtn = document.getElementById('restart-anytime-btn');
const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsPanelEl = document.getElementById('settings-panel');
const narratorVoiceStatusEl = document.getElementById('narrator-voice-status');
const narratorVoiceInputEls = Array.from(document.querySelectorAll('input[name="narrator-voice"]'));
const virtualDiceToggleEl = document.getElementById('virtual-dice-toggle');
const virtualDiceToggleLabelEl = document.getElementById('virtual-dice-toggle-label');
const virtualDiceStageEl = document.getElementById('virtual-dice-stage');
const virtualDieEl = document.getElementById('virtual-die');
const virtualDieLabelEl = document.getElementById('virtual-die-label');
const virtualDieValueEl = document.getElementById('virtual-die-value');

function addLog(text, cssClass, options = {}) {
    const { narrate = false, narrationText = text } = options;
    const div = document.createElement('div');
    div.className = `log-entry ${cssClass}`;
    div.innerText = text;
    logEl.appendChild(div);
    logEl.scrollTo({ top: logEl.scrollHeight, behavior: 'smooth' });

    if (narrate) {
        speakNarration(narrationText);
    }
}

function saveNarratorSettings() {
    try {
        localStorage.setItem(NARRATOR_SETTINGS_KEY, JSON.stringify({
            narratorEnabled,
            narratorVoiceStyle
        }));
    } catch (error) {
        console.warn('Unable to save narrator settings.', error);
    }
}

function loadNarratorSettings() {
    try {
        const savedSettings = localStorage.getItem(NARRATOR_SETTINGS_KEY);
        if (!savedSettings) return;

        const parsedSettings = JSON.parse(savedSettings);
        narratorEnabled = parsedSettings.narratorEnabled === true;
        narratorVoiceStyle = parsedSettings.narratorVoiceStyle === 'male' ? 'male' : 'female';
    } catch (error) {
        console.warn('Unable to load narrator settings.', error);
    }
}

function getNarratorVoiceDescriptor(voice) {
    return `${voice.name} ${voice.voiceURI} ${voice.lang}`.toLowerCase();
}

function chooseNarratorVoice() {
    if (!narratorSupported) return null;

    const voices = speechEngine.getVoices();
    if (!voices.length) return null;

    const englishVoices = voices.filter(voice => /^en(-|_)?/i.test(voice.lang) || /^en$/i.test(voice.lang));
    const candidates = englishVoices.length ? englishVoices : voices;
    const preferredKeywords = narratorVoiceKeywords[narratorVoiceStyle];
    const otherKeywords = narratorVoiceKeywords[narratorVoiceStyle === 'female' ? 'male' : 'female'];

    let bestVoice = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const voice of candidates) {
        const descriptor = getNarratorVoiceDescriptor(voice);
        let score = 0;

        if (/^en-us/i.test(voice.lang)) score += 2;
        else if (/^en/i.test(voice.lang)) score += 1;

        if (voice.localService) score += 1;
        if (voice.default) score += 1;
        if (preferredKeywords.some(keyword => descriptor.includes(keyword))) score += 6;
        if (otherKeywords.some(keyword => descriptor.includes(keyword))) score -= 3;

        if (score > bestScore) {
            bestScore = score;
            bestVoice = voice;
        }
    }

    return bestVoice;
}

function syncNarratorVoiceSelection() {
    selectedNarratorVoice = chooseNarratorVoice();

    if (!narratorSupported) {
        narratorVoiceStatusEl.innerText = 'Speech narration is not supported in this browser.';
        return;
    }

    if (!selectedNarratorVoice) {
        narratorVoiceStatusEl.innerText = 'Voice list is still loading. Your browser default will be used until it is ready.';
        return;
    }

    const voiceStyleLabel = narratorVoiceStyle === 'male' ? 'Male' : 'Female';
    narratorVoiceStatusEl.innerText = `${voiceStyleLabel} narrator: ${selectedNarratorVoice.name} (${selectedNarratorVoice.lang}).`;
}

function syncNarratorVoiceInputs() {
    narratorVoiceInputEls.forEach(inputEl => {
        inputEl.checked = inputEl.value === narratorVoiceStyle;
        inputEl.disabled = !narratorSupported;
    });
}

function updateAudioToggleLabel() {
    audioToggleBtn.innerText = isMuted ? '\uD83D\uDD07 Sound Off' : '\uD83D\uDD0A Sound On';
}

function updateNarratorToggleLabel() {
    if (!narratorSupported) {
        narratorToggleBtn.disabled = true;
        narratorToggleBtn.innerText = '\uD83D\uDDE3 Narrator N/A';
        narratorToggleBtn.title = 'Speech narration is not supported in this browser.';
        return;
    }

    narratorToggleBtn.disabled = isMuted;
    narratorToggleBtn.innerText = narratorEnabled
        ? (isMuted ? '\uD83D\uDDE3 Narrator Paused' : '\uD83D\uDDE3 Narrator On')
        : '\uD83D\uDDE3 Narrator Off';
    narratorToggleBtn.title = isMuted ? 'Turn sound back on to use the narrator.' : 'Toggle spoken DM narration.';
}

function syncAudioControls() {
    updateAudioToggleLabel();
    updateNarratorToggleLabel();
}

function setSettingsPanelVisibility(isVisible) {
    settingsPanelEl.hidden = !isVisible;
    settingsToggleBtn.setAttribute('aria-expanded', String(isVisible));
}

function canNarrate() {
    return narratorSupported && narratorEnabled && !isMuted;
}

function stopNarration() {
    if (speechEngine) {
        speechEngine.cancel();
    }
}

function speakNarration(text) {
    if (!canNarrate()) return;

    const narration = String(text || '')
        .replace(/[^\x00-\x7F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!narration) return;

    stopNarration();

    const utterance = new SpeechSynthesisUtterance(narration);
    if (selectedNarratorVoice) {
        utterance.voice = selectedNarratorVoice;
    }
    utterance.lang = selectedNarratorVoice?.lang || 'en-US';
    utterance.rate = narratorVoiceStyle === 'male' ? 0.94 : 1.02;
    utterance.pitch = narratorVoiceStyle === 'male' ? 0.86 : 1.12;
    speechEngine.speak(utterance);
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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function syncRollControls() {
    const disableRollInputs = gameOver || isRollPending;
    submitBtn.disabled = disableRollInputs;
    digitalBtn.disabled = disableRollInputs;
    inputEl.disabled = disableRollInputs;
    virtualDiceToggleEl.disabled = isRollPending;
}

function updateVirtualDiceToggleLabel() {
    virtualDiceToggleLabelEl.innerText = virtualDiceToggleEl.checked ? 'Virtual On' : 'Virtual Off';
}

function syncVirtualDiceDisplay() {
    virtualDiceStageEl.hidden = true;
    virtualDiceStageEl.classList.remove('is-visible');
    virtualDiceStageEl.classList.remove('is-rolling');
    virtualDieEl.classList.remove('is-rolling');

    if (!currentEncounter) return;

    virtualDieEl.dataset.die = String(currentEncounter.requiredDie);
    virtualDieLabelEl.innerText = `d${currentEncounter.requiredDie}`;
    virtualDieValueEl.innerText = '?';
}

async function playVirtualRoll(maxDie, finalRoll, activeRunToken) {
    if (!virtualDiceToggleEl.checked) {
        await wait(250);
        return;
    }

    virtualDiceStageEl.hidden = false;
    virtualDiceStageEl.classList.remove('is-visible');
    virtualDiceStageEl.classList.remove('is-rolling');
    virtualDieEl.classList.remove('is-rolling');
    virtualDieEl.dataset.die = String(maxDie);
    virtualDieLabelEl.innerText = `d${maxDie}`;
    void virtualDieEl.offsetWidth;
    virtualDiceStageEl.classList.add('is-visible');
    virtualDieEl.classList.add('is-rolling');
    virtualDiceStageEl.classList.add('is-rolling');
    virtualDieValueEl.innerText = String(Math.floor(Math.random() * maxDie) + 1);

    const intervalMs = maxDie === 100 ? 55 : 80;
    const intervalId = setInterval(() => {
        virtualDieValueEl.innerText = String(Math.floor(Math.random() * maxDie) + 1);
    }, intervalMs);

    await wait(850);

    clearInterval(intervalId);
    if (runToken !== activeRunToken) {
        syncVirtualDiceDisplay();
        return;
    }

    virtualDieValueEl.innerText = String(finalRoll);
    virtualDieEl.classList.remove('is-rolling');
    virtualDiceStageEl.classList.remove('is-rolling');
    await wait(325);

    if (runToken !== activeRunToken) {
        syncVirtualDiceDisplay();
        return;
    }

    virtualDiceStageEl.classList.remove('is-visible');
    await wait(180);

    if (runToken !== activeRunToken) {
        syncVirtualDiceDisplay();
        return;
    }

    virtualDiceStageEl.hidden = true;
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
    runToken += 1;
    stopNarration();
    hp = MAX_HP;
    currentRoom = 0;
    gameOver = false;
    currentEncounter = null;
    isRollPending = false;
    
    hpEl.innerText = hp;
    roomEl.innerText = currentRoom;
    logEl.innerHTML = '';
    inputEl.value = '';
    
    updateVirtualDiceToggleLabel();
    syncRollControls();
    syncVirtualDiceDisplay();
    syncAudioControls();

    addLog("\uD83E\uDDD9\u200D\u2642\uFE0F DM: The dungeon has shifted. A new run begins. Survive 10 rooms.", "dm-text");
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
    syncVirtualDiceDisplay();
    
    addLog(`DM: ${currentEncounter.prompt}`, "dm-text", {
        narrate: true,
        narrationText: currentEncounter.prompt
    });
}

async function handleRoll(rollValue) {
    if (gameOver || !currentEncounter || isRollPending) return;

    if (!isMuted && audioCtx.state === 'suspended') audioCtx.resume();

    const maxDie = currentEncounter.requiredDie;
    const encounterAtRoll = currentEncounter;
    const runTokenAtRoll = runToken;
    let roll = rollValue ?? parseInt(inputEl.value, 10);

    if (isNaN(roll) || roll < 1 || roll > maxDie) {
        alert(`Please enter a valid roll between 1 and ${maxDie}.`);
        return;
    }

    isRollPending = true;
    syncRollControls();
    soundRoll();
    inputEl.value = '';
    await playVirtualRoll(maxDie, roll, runTokenAtRoll);

    if (gameOver || runToken !== runTokenAtRoll || currentEncounter !== encounterAtRoll || !isRollPending) {
        return;
    }
    addLog(`🎲 You rolled a ${roll} (d${maxDie}).`, "player-text");

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
}

function resolveEncounter(isSuccess, isCritFail = false) {
    const runTokenAtResolve = runToken;

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
            if (runToken !== runTokenAtResolve) return;
            if(!gameOver) {
                addLog("--------------------------------------------------", "dm-text");
                nextRoom();
            }
            isRollPending = false;
            syncRollControls();
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
                if (runToken !== runTokenAtResolve) return;
                if(!gameOver) {
                    const retryPrompt = `You are still trapped! Roll d${currentEncounter.requiredDie} again. (DC: ${currentEncounter.dc})`;
                    addLog(`DM: ${retryPrompt}`, "dm-text", {
                        narrate: true,
                        narrationText: retryPrompt
                    });
                    isRollPending = false;
                    syncRollControls();
                }
            }, 1200);
        }
    }
}

function loseGame() {
    gameOver = true;
    isRollPending = false;
    stopNarration();
    hpEl.innerText = "0";
    addLog("--------------------------------------------------", "damage-text");
    addLog(`🪦 YOU DIED in room ${currentRoom}. Click Restart above to try again.`, "damage-text");
    endGameUI();
}

function winGame() {
    gameOver = true;
    isRollPending = false;
    stopNarration();
    soundSuccess();
    setTimeout(() => playTone(880, 'sine', 0.5), 300);
    addLog("--------------------------------------------------", "success-text");
    addLog("🏆 VICTORY! You survived the shifting dungeon!", "success-text");
    endGameUI();
}

function endGameUI() {
    syncRollControls();
    syncAudioControls();
}

loadNarratorSettings();
syncNarratorVoiceInputs();
syncNarratorVoiceSelection();
syncAudioControls();

if (speechEngine) {
    if (typeof speechEngine.addEventListener === 'function') {
        speechEngine.addEventListener('voiceschanged', syncNarratorVoiceSelection);
    } else {
        speechEngine.onvoiceschanged = syncNarratorVoiceSelection;
    }
}

// --- EVENT LISTENERS ---
submitBtn.addEventListener('click', () => handleRoll());
digitalBtn.addEventListener('click', () => {
    if (currentEncounter) {
        const autoRoll = Math.floor(Math.random() * currentEncounter.requiredDie) + 1;
        handleRoll(autoRoll);
    }
});

inputEl.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleRoll();
    }
});

virtualDiceToggleEl.addEventListener('change', () => {
    updateVirtualDiceToggleLabel();
    syncVirtualDiceDisplay();
});

narratorToggleBtn.addEventListener('click', () => {
    if (narratorToggleBtn.disabled) return;

    narratorEnabled = !narratorEnabled;
    saveNarratorSettings();
    syncAudioControls();

    if (!narratorEnabled) {
        stopNarration();
        return;
    }

    const narrationPreview = currentEncounter ? currentEncounter.prompt : 'The dungeon awaits your next roll.';
    speakNarration(narrationPreview);
});

settingsToggleBtn.addEventListener('click', event => {
    event.stopPropagation();
    setSettingsPanelVisibility(settingsPanelEl.hidden);
});

narratorVoiceInputEls.forEach(inputEl => {
    inputEl.addEventListener('change', () => {
        if (!inputEl.checked) return;

        narratorVoiceStyle = inputEl.value === 'male' ? 'male' : 'female';
        saveNarratorSettings();
        syncNarratorVoiceInputs();
        syncNarratorVoiceSelection();

        if (canNarrate()) {
            const narrationPreview = currentEncounter ? currentEncounter.prompt : 'The dungeon awaits your next roll.';
            speakNarration(narrationPreview);
        }
    });
});

document.addEventListener('click', event => {
    if (settingsPanelEl.hidden) return;
    if (settingsPanelEl.contains(event.target) || settingsToggleBtn.contains(event.target)) return;
    setSettingsPanelVisibility(false);
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !settingsPanelEl.hidden) {
        setSettingsPanelVisibility(false);
    }
});

// Audio Toggle
audioToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;

    if (isMuted) {
        stopNarration();
    } else {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (narratorEnabled && currentEncounter) {
            speakNarration(currentEncounter.prompt);
        }
    }

    syncAudioControls();
});

// Restart Anytime
restartAnytimeBtn.addEventListener('click', () => {
    if (!gameOver && currentRoom > 0 && hp > 0) {
        if (!confirm('Abandon current run and start over?')) return;
    }
    startRun();
});

// Boot up
window.onload = startRun;
