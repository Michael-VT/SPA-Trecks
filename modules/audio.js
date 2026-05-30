// modules/audio.js
// Полностью переработанная система звука по пожеланиям пользователя.
//
// Идея:
// - 4 коротких весёлых музыкальных "заготовки" (музыкальных трека), которые играют по кругу.
// - Можно выбрать один из них как фон или выключить музыку совсем.
// - Поверх музыки можно включать/выключать тоны (реакция на скорость) и голосовые подсказки.
// - Всё звучит приятно, музыкально, без "бульканья".
//
// Режимы (кнопка 🔊 или клавиша A):
//   0 = Музыка выкл + тоны выкл
//   1 = Только тоны (реакция на скорость)
//   2 = Музыка 1 (Light Morning) + тоны
//   3 = Музыка 2 (Energetic) + тоны
//   4 = Музыка 3 (Chill Paris) + тоны
//   5 = Музыка 4 (Motivational) + тоны
//   (Голос можно включать/выключать отдельно позже)

let audioCtx = null;
let masterGain = null;
let musicGain = null;
let tonesGain = null;

let currentMode = 0;           // 0..5 как выше
let currentMusicTrack = 0;     // 0 = off, 1-4 = выбранный трек
let voiceEnabled = true;

let musicScheduler = null;
let lastKmAnnounced = 0;
let lastVoiceTime = 0;

const MUSIC_TRACKS = [
  { id: 0, name: "Выкл" },
  { id: 1, name: "Sunny Jog" },
  { id: 2, name: "Energetic Paris" },
  { id: 3, name: "Playful Morning" },
  { id: 4, name: "Motivational Run" },
];

function ensureContext() {
  if (audioCtx) return audioCtx;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(audioCtx.destination);

    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.55;
    musicGain.connect(masterGain);

    tonesGain = audioCtx.createGain();
    tonesGain.gain.value = 0.45;
    tonesGain.connect(masterGain);
  } catch (e) {
    console.warn("Web Audio недоступен", e);
  }
  return audioCtx;
}

export function initAudio() {
  ensureContext();
  try {
    const saved = parseInt(localStorage.getItem("spa-audio-mode") || "2", 10);
    currentMode = isNaN(saved) ? 2 : saved;
    currentMusicTrack = currentMode >= 2 ? (currentMode - 1) : 0;
  } catch {}
  if (currentMusicTrack > 0) startMusicTrack(currentMusicTrack);
}

export function getAudioMode() { return currentMode; }
export function getAudioModeLabel() {
  if (currentMode === 0) return "Выкл";
  if (currentMode === 1) return "Тоны";
  return MUSIC_TRACKS[currentMusicTrack]?.name || "Музыка";
}

export function cycleAudioMode() {
  currentMode = (currentMode + 1) % 6;
  currentMusicTrack = currentMode >= 2 ? (currentMode - 1) : 0;

  stopCurrentMusic();

  if (currentMusicTrack > 0) {
    startMusicTrack(currentMusicTrack);
  }

  try { localStorage.setItem("spa-audio-mode", String(currentMode)); } catch {}
  return currentMode;
}

export function setMasterVolume(v) {
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
}

export function pauseAudio() {
  stopCurrentMusic();
  if (audioCtx && audioCtx.state === "running") audioCtx.suspend().catch(() => {});
}

export function resumeAudio() {
  ensureContext();
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  if (currentMusicTrack > 0) startMusicTrack(currentMusicTrack);
}

// Главная функция — вызывается из playback при каждом шаге
export function onPlaybackProgress(point, cumulativeKm = 0) {
  if (!point || currentMode === 0 || !audioCtx) return;

  const speed = point.speed || 10;

  // === Тоны (реакция на скорость) — лёгкие, не мешающие музыке ===
  if (currentMode === 1 || currentMode >= 2) {
    const freq = 220 + Math.min(13, speed) * 14;
    playSoftTone(freq, 0.06, 0.07, tonesGain);

    // Лёгкие "шаги"
    if (Math.random() < 0.55) {
      playSoftTone(780 + (speed - 9) * 22, 0.012, 0.022, tonesGain, 0.5);
    }
  }

  // === Голосовые подсказки ===
  if (voiceEnabled && currentMode >= 2) {
    const now = Date.now();
    const km = Math.floor(cumulativeKm);

    if (km > lastKmAnnounced && (now - lastVoiceTime) > 9500) {
      speak(`Километр ${km}. ${Math.round(speed)} км/ч`);
      lastKmAnnounced = km;
      lastVoiceTime = now;
    }
  }
}

// === Музыкальные треки (4 заметно разных весёлых трека) ===

function stopCurrentMusic() {
  if (musicScheduler) {
    clearInterval(musicScheduler);
    musicScheduler = null;
  }
}

// Лёгкий весёлый бит (kick + hats) — общий для всех треков
function playLightDrums(now, step) {
  const beat = step % 16;

  // Kick (приятный, не тяжёлый)
  if (beat === 0 || beat === 8) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 58;
    gain.gain.value = 0.7;
    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
    osc.stop(now + 0.28);
  }

  // Лёгкие весёлые хэты
  if (beat % 2 === 1) {
    const noise = audioCtx.createBufferSource();
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.08, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 4500;

    const gain = audioCtx.createGain();
    gain.gain.value = (beat % 4 === 3) ? 0.12 : 0.07;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);
    noise.start(now);
  }
}

function startMusicTrack(trackId) {
  stopCurrentMusic();
  if (!audioCtx) return;

  const bpm = 128;
  const stepMs = (60 / bpm) * 250; // 16th notes

  let step = 0;

  musicScheduler = setInterval(() => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Лёгкий весёлый бит (общий для всех треков)
    playLightDrums(now, step);

    switch (trackId) {
      case 1: playSunnyJog(now, step); break;
      case 2: playEnergeticParis(now, step); break;
      case 3: playPlayfulMorning(now, step); break;
      case 4: playMotivationalRun(now, step); break;
    }
    step++;
  }, stepMs);
}

// === 4 заметно разных весёлых трека (только Web Audio) ===

function playSunnyJog(now, step) {
  const beat = step % 16;

  // Весёлая мажорная мелодия (C major) — светлая и прыгающая
  const melody = [523, 659, 784, 880, 784, 659, 523, 784, 880, 1046, 880, 784, 659, 523, 659, 784];
  playSoftTone(melody[beat], 0.18, 0.22, musicGain);

  // Лёгкая гармония сверху
  if (beat % 2 === 0) {
    playSoftTone(melody[beat] * 1.5, 0.12, 0.10, musicGain);
  }

  // Весёлый бас (не низкий и мрачный)
  if (beat % 4 === 0) {
    playSoftTone(262, 0.26, 0.18, musicGain, 0.65);
  }

  // Лёгкие "шаги" (как приятный ритм бега)
  if (beat % 2 === 1) {
    playSoftTone(880 + (beat % 4) * 40, 0.06, 0.08, musicGain);
  }
}

function playEnergeticParis(now, step) {
  const beat = step % 16;

  // Более энергичная мелодия (G major) с характером
  const melody = [784, 880, 988, 1046, 988, 880, 784, 988, 1046, 1175, 1046, 988, 880, 784, 880, 988];
  playSoftTone(melody[beat], 0.17, 0.24, musicGain);

  // Синкопированная гармония
  if ([3, 7, 11, 15].includes(beat)) {
    playSoftTone(melody[beat] * 1.25, 0.11, 0.12, musicGain);
  }

  // Чёткий бас
  if (beat % 4 === 0) {
    playSoftTone(392, 0.24, 0.20, musicGain, 0.6);
  }
}

function playPlayfulMorning(now, step) {
  const beat = step % 16;

  // Игривая, немного капризная, но очень позитивная мелодия (F major)
  const melody = [698, 784, 880, 932, 880, 784, 698, 880, 932, 1046, 932, 880, 784, 698, 784, 880];
  playSoftTone(melody[beat], 0.19, 0.21, musicGain);

  // Весёлые "ответы" в высоком регистре
  if (beat % 4 === 2) {
    playSoftTone(1397, 0.09, 0.14, musicGain); // высокая нота
  }

  // Мягкий бас
  if (beat % 4 === 0) {
    playSoftTone(349, 0.22, 0.16, musicGain, 0.7);
  }
}

function playMotivationalRun(now, step) {
  const beat = step % 16;

  // Бодрая, мотивирующая, но всё равно весёлая мелодия (D major)
  const melody = [587, 659, 740, 880, 740, 880, 988, 880, 740, 880, 1046, 880, 740, 659, 740, 880];
  playSoftTone(melody[beat], 0.16, 0.25, musicGain);

  // Сильнее ритм + лёгкие акценты
  if (beat % 2 === 0) {
    playSoftTone(melody[beat] * 1.2, 0.10, 0.11, musicGain);
  }

  // Уверенный бас
  if (beat % 4 === 0) {
    playSoftTone(294, 0.23, 0.19, musicGain, 0.55);
  }
}

// === Вспомогательные генераторы ===

function playChord(time, frequencies, duration, dest, volume = 0.4) {
  frequencies.forEach((f, i) => {
    setTimeout(() => {
      playSoftTone(f, duration, volume / (i + 1.2), dest, 0.9);
    }, i * 8);
  });
}

function playSoftTone(freq, duration, volume, dest, decay = 0.9) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.value = freq;

  filter.type = "lowpass";
  filter.frequency.value = 2100;

  gain.gain.value = volume;

  const now = audioCtx.currentTime;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest || musicGain);

  osc.start(now);
  gain.gain.linearRampToValueAtTime(0.0001, now + duration * decay);
  osc.stop(now + duration * decay + 0.05);
}

function speak(text) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.08;
    u.pitch = 1.0;
    u.volume = 0.78;
    const voices = window.speechSynthesis.getVoices();
    const ru = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("ru"));
    if (ru) u.voice = ru;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}

// Для отладки
export function debugAudio() {
  console.log("Audio mode:", currentMode, "Music track:", currentMusicTrack);
}