/**
 * Unstoppable Audio Engine for Birthday Project
 * Automatically plays and loops "Happy Birthday To You" for Chey Kolroth.
 * Designed so that the sound turns on automatically and cannot be turned off.
 */

class BirthdayAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMelody = false;
    this.melodyTimer = null;
    this.currentNoteIndex = 0;
    this.volume = 0.28;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getNoteFreq(note) {
    const notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50
    };
    return notes[note] || 440;
  }

  playChime(freq, duration = 0.6, timeOffset = 0, isBass = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + timeOffset;

    const osc1 = this.ctx.createOscillator();
    osc1.type = isBass ? 'triangle' : 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(isBass ? 0.35 : 0.45, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  getScore() {
    return [
      // "Hap-py Birth-day to you"
      { note: 'G4', dur: 0.75, bass: 'C4' },
      { note: 'G4', dur: 0.25 },
      { note: 'A4', dur: 1.0 },
      { note: 'G4', dur: 1.0 },
      { note: 'C5', dur: 1.0, bass: 'E4' },
      { note: 'B4', dur: 2.0, bass: 'G4' },

      // "Hap-py Birth-day to you"
      { note: 'G4', dur: 0.75, bass: 'G4' },
      { note: 'G4', dur: 0.25 },
      { note: 'A4', dur: 1.0 },
      { note: 'G4', dur: 1.0 },
      { note: 'D5', dur: 1.0, bass: 'F4' },
      { note: 'C5', dur: 2.0, bass: 'E4' },

      // "Hap-py Birth-day dear Chey Kol-roth"
      { note: 'G4', dur: 0.75, bass: 'C4' },
      { note: 'G4', dur: 0.25 },
      { note: 'G5', dur: 1.0, bass: 'C5' },
      { note: 'E5', dur: 1.0, bass: 'G4' },
      { note: 'C5', dur: 1.0, bass: 'A4' },
      { note: 'B4', dur: 1.0 },
      { note: 'A4', dur: 2.0, bass: 'F4' },

      // "Hap-py Birth-day to you"
      { note: 'F5', dur: 0.75, bass: 'F4' },
      { note: 'F5', dur: 0.25 },
      { note: 'E5', dur: 1.0, bass: 'C5' },
      { note: 'C5', dur: 1.0, bass: 'G4' },
      { note: 'D5', dur: 1.0, bass: 'G4' },
      { note: 'C5', dur: 2.8, bass: 'C4' },

      // Gentle pause before repeating
      { note: null, dur: 1.0 }
    ];
  }

  startMelody() {
    this.init();
    if (this.isPlayingMelody) return;
    this.isPlayingMelody = true;
    this.currentNoteIndex = 0;
    this.scheduleNextNote();
  }

  scheduleNextNote() {
    if (!this.isPlayingMelody) {
      this.isPlayingMelody = true;
    }

    const score = this.getScore();
    const item = score[this.currentNoteIndex];
    const beatSeconds = 0.52;
    const noteTime = item.dur * beatSeconds;

    if (item.note) {
      const freq = this.getNoteFreq(item.note);
      this.playChime(freq, noteTime * 1.3);

      if (item.bass) {
        const bassFreq = this.getNoteFreq(item.bass) * 0.5;
        this.playChime(bassFreq, noteTime * 1.5, 0, true);
      }
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % score.length;
    this.melodyTimer = setTimeout(() => {
      this.scheduleNextNote();
    }, noteTime * 1000);
  }

  // Sound cannot be turned off
  stopMelody() {
    return false;
  }

  toggleMelody() {
    this.startMelody();
    return true;
  }

  playBlowSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.55);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.6);
  }

  playPopSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playConfettiChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playChime(freq, 0.45, idx * 0.08);
    });
  }
}

window.birthdayAudio = new BirthdayAudioEngine();
