let audioContext;
let lastPlayedAt = 0;
const volumeBoost = 1.45;

const soundProfile = {
  click: { start: 440, end: 300, volume: 0.085, duration: 0.055, type: 'triangle' },
  action: { start: 520, end: 360, volume: 0.095, duration: 0.07, type: 'sine' },
  compare: { start: 420, end: 620, volume: 0.1, duration: 0.08, type: 'triangle' },
  reset: { start: 300, end: 180, volume: 0.09, duration: 0.08, type: 'sawtooth' },
  undo: { start: 420, end: 260, volume: 0.088, duration: 0.065, type: 'triangle' },
  redo: { start: 260, end: 420, volume: 0.088, duration: 0.065, type: 'triangle' },
  start: { start: 360, end: 720, volume: 0.11, duration: 0.09, type: 'triangle' },
  blocked: { start: 220, end: 170, volume: 0.095, duration: 0.11, type: 'square' },
  successLow: { start: 520, end: 660, volume: 0.1, duration: 0.09, type: 'sine' },
  successHigh: { start: 660, end: 880, volume: 0.09, duration: 0.12, type: 'triangle' }
};

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
}

function playTone(profile) {
  const context = getAudioContext();
  if (!context) return;
  if (context.state === 'suspended') context.resume();

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const now = context.currentTime;
  const volume = Math.min(profile.volume * volumeBoost, 0.22);

  oscillator.type = profile.type;
  oscillator.frequency.setValueAtTime(profile.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(profile.end, now + profile.duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + profile.duration + 0.01);
}

export function playClickSound(kind = 'click') {
  const now = performance.now();
  if (now - lastPlayedAt < 45) return;
  lastPlayedAt = now;

  playTone(soundProfile[kind] ?? soundProfile.click);
}

export function playSimulationStartSound() {
  playTone(soundProfile.start);
}

export function playGoalReachedSound() {
  playTone(soundProfile.successLow);
  window.setTimeout(() => playTone(soundProfile.successHigh), 105);
}

export function playNoPathSound() {
  playTone(soundProfile.blocked);
}

export function playCompareSound() {
  playTone(soundProfile.compare);
}

export function playResetSound() {
  playTone(soundProfile.reset);
}

export function playUndoSound() {
  playTone(soundProfile.undo);
}

export function playRedoSound() {
  playTone(soundProfile.redo);
}
