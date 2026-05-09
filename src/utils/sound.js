let audioContext;
let lastPlayedAt = 0;

const soundProfile = {
  click: { start: 440, end: 300, volume: 0.034, duration: 0.055, type: 'triangle' },
  action: { start: 520, end: 360, volume: 0.04, duration: 0.07, type: 'sine' }
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

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const now = context.currentTime;

  oscillator.type = profile.type;
  oscillator.frequency.setValueAtTime(profile.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(profile.end, now + profile.duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(profile.volume, now + 0.008);
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
