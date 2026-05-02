// ============================================
// SOUTH PARK ELEMENTARY - SYSTÈME AUDIO
// Style Année 2000 - Sons 8-bit générés
// ============================================

class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.musicVolume = 0.2;
    this.sfxVolume = 0.5;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.currentMusic = null;
    this.musicLoop = null;
    
    // Charger les préférences
    this.loadSettings();
    
    // Initialiser le contexte audio au premier clic
    this.initAudioContext();
  }
  
  initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.log('Web Audio API non supportée');
        return false;
      }
    }
    return true;
  }
  
  // Sauvegarder/charger les paramètres
  saveSettings() {
    localStorage.setItem('sp-audio-settings', JSON.stringify({
      musicEnabled: this.musicEnabled,
      sfxEnabled: this.sfxEnabled,
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume
    }));
  }
  
  loadSettings() {
    const saved = localStorage.getItem('sp-audio-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.musicEnabled = settings.musicEnabled !== false;
      this.sfxEnabled = settings.sfxEnabled !== false;
      this.masterVolume = settings.masterVolume || 0.3;
      this.musicVolume = settings.musicVolume || 0.2;
      this.sfxVolume = settings.sfxVolume || 0.5;
    }
  }
  
  // Créer un oscillateur pour les sons 8-bit
  createOscillator(frequency, type = 'square', duration = 0.1) {
    if (!this.audioContext || !this.sfxEnabled) return null;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.sfxVolume * this.masterVolume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
    
    return oscillator;
  }
  
  // Sons du mini-jeu
  playKickSound() {
    if (!this.initAudioContext()) return;
    
    // Son de kick : sweep descendant
    const osc1 = this.createOscillator(800, 'sawtooth', 0.15);
    if (osc1) {
      osc1.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
    }
    
    // Ajout d'un bruit pour l'impact
    setTimeout(() => {
      this.createOscillator(150, 'square', 0.05);
    }, 50);
  }
  
  playImpactSound() {
    if (!this.initAudioContext()) return;
    
    // Son d'impact : bruit court
    this.createOscillator(100, 'sawtooth', 0.1);
    setTimeout(() => {
      this.createOscillator(80, 'square', 0.08);
    }, 30);
  }
  
  playPowerUpSound() {
    if (!this.initAudioContext()) return;
    
    // Son de power-up : arpège montant
    const notes = [262, 330, 392, 523]; // C, E, G, C
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'square', 0.2);
      }, i * 50);
    });
  }
  
  playAchievementSound() {
    if (!this.initAudioContext()) return;
    
    // Son d'achievement : fanfare courte
    const melody = [523, 659, 784, 1047]; // C, E, G, C
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator(freq, 'triangle', 0.3);
      }, i * 100);
    });
  }
  
  // Sons d'interface
  playClickSound() {
    if (!this.initAudioContext()) return;
    this.createOscillator(800, 'square', 0.05);
  }
  
  playPageChangeSound() {
    if (!this.initAudioContext()) return;
    this.createOscillator(600, 'triangle', 0.1);
    setTimeout(() => {
      this.createOscillator(400, 'triangle', 0.1);
    }, 50);
  }
  
  playKennyToggleSound() {
    if (!this.initAudioContext()) return;
    
    // Son différent selon l'état
    const kenny = document.getElementById('kenny-main-toggle');
    if (kenny && kenny.checked) {
      // Kenny ressuscite : son montant
      this.createOscillator(200, 'sine', 0.2);
      setTimeout(() => {
        this.createOscillator(400, 'sine', 0.2);
      }, 100);
    } else {
      // Kenny meurt : son descendant
      this.createOscillator(400, 'sine', 0.2);
      setTimeout(() => {
        this.createOscillator(200, 'sine', 0.3);
      }, 100);
    }
  }
  
  // Musique de fond - Thème South Park amélioré
  startBackgroundMusic() {
    if (!this.initAudioContext() || !this.musicEnabled || this.musicLoop) return;
    
    this.playBackgroundLoop();
  }
  
  playBackgroundLoop() {
    if (!this.musicEnabled) return;
    
    // Mélodie principale inspirée du thème South Park (plus riche)
    const mainMelody = [
      // Intro
      {freq: 523, duration: 0.3, harmony: 392},  // C + G
      {freq: 587, duration: 0.3, harmony: 440},  // D + A
      {freq: 659, duration: 0.3, harmony: 494},  // E + B
      {freq: 698, duration: 0.3, harmony: 523},  // F + C
      {freq: 784, duration: 0.6, harmony: 587},  // G + D
      {freq: 659, duration: 0.3, harmony: 494},  // E + B
      {freq: 523, duration: 0.6, harmony: 392},  // C + G
      {freq: 0, duration: 0.2},                  // Pause
      
      // Variation 1
      {freq: 659, duration: 0.3, harmony: 523},  // E + C
      {freq: 698, duration: 0.3, harmony: 523},  // F + C
      {freq: 784, duration: 0.3, harmony: 587},  // G + D
      {freq: 880, duration: 0.3, harmony: 659},  // A + E
      {freq: 784, duration: 0.6, harmony: 587},  // G + D
      {freq: 698, duration: 0.3, harmony: 523},  // F + C
      {freq: 659, duration: 0.6, harmony: 523},  // E + C
      {freq: 0, duration: 0.2},                  // Pause
      
      // Variation 2 (plus rapide)
      {freq: 523, duration: 0.2, harmony: 392},  // C + G
      {freq: 587, duration: 0.2, harmony: 440},  // D + A
      {freq: 659, duration: 0.2, harmony: 494},  // E + B
      {freq: 784, duration: 0.4, harmony: 587},  // G + D
      {freq: 659, duration: 0.2, harmony: 494},  // E + B
      {freq: 587, duration: 0.2, harmony: 440},  // D + A
      {freq: 523, duration: 0.4, harmony: 392},  // C + G
      {freq: 0, duration: 0.2},                  // Pause
      
      // Finale
      {freq: 784, duration: 0.3, harmony: 523},  // G + C
      {freq: 880, duration: 0.3, harmony: 659},  // A + E
      {freq: 1047, duration: 0.6, harmony: 784}, // C + G (octave)
      {freq: 0, duration: 0.4},                  // Pause longue
    ];
    
    let noteIndex = 0;
    let bassIndex = 0;
    
    // Ligne de basse (joue en parallèle)
    const bassLine = [
      {freq: 131, duration: 0.6},  // C
      {freq: 147, duration: 0.6},  // D
      {freq: 165, duration: 0.6},  // E
      {freq: 196, duration: 0.6},  // G
    ];
    
    const playNextNote = () => {
      if (!this.musicEnabled) {
        this.musicLoop = null;
        return;
      }
      
      const note = mainMelody[noteIndex];
      
      if (note.freq > 0) {
        // Mélodie principale
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.musicVolume * this.masterVolume * 0.6, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + note.duration - 0.01);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + note.duration);
        
        // Harmonie (accord)
        if (note.harmony) {
          const harmonyOsc = this.audioContext.createOscillator();
          const harmonyGain = this.audioContext.createGain();
          
          harmonyOsc.connect(harmonyGain);
          harmonyGain.connect(this.audioContext.destination);
          
          harmonyOsc.frequency.setValueAtTime(note.harmony, this.audioContext.currentTime);
          harmonyOsc.type = 'sine';
          
          harmonyGain.gain.setValueAtTime(0, this.audioContext.currentTime);
          harmonyGain.gain.linearRampToValueAtTime(this.musicVolume * this.masterVolume * 0.3, this.audioContext.currentTime + 0.01);
          harmonyGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + note.duration - 0.01);
          
          harmonyOsc.start(this.audioContext.currentTime);
          harmonyOsc.stop(this.audioContext.currentTime + note.duration);
        }
      }
      
      // Ligne de basse (toutes les 2 notes)
      if (noteIndex % 2 === 0) {
        const bass = bassLine[bassIndex % bassLine.length];
        const bassOsc = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        
        bassOsc.connect(bassGain);
        bassGain.connect(this.audioContext.destination);
        
        bassOsc.frequency.setValueAtTime(bass.freq, this.audioContext.currentTime);
        bassOsc.type = 'sawtooth';
        
        bassGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        bassGain.gain.linearRampToValueAtTime(this.musicVolume * this.masterVolume * 0.4, this.audioContext.currentTime + 0.01);
        bassGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + bass.duration - 0.01);
        
        bassOsc.start(this.audioContext.currentTime);
        bassOsc.stop(this.audioContext.currentTime + bass.duration);
        
        bassIndex++;
      }
      
      noteIndex = (noteIndex + 1) % mainMelody.length;
      
      this.musicLoop = setTimeout(playNextNote, note.duration * 1000);
    };
    
    playNextNote();
  }
  
  stopBackgroundMusic() {
    this.musicEnabled = false;
    if (this.musicLoop) {
      clearTimeout(this.musicLoop);
      this.musicLoop = null;
    }
    this.saveSettings();
  }
  
  toggleBackgroundMusic() {
    if (this.musicEnabled) {
      this.stopBackgroundMusic();
    } else {
      this.musicEnabled = true;
      this.saveSettings();
      this.startBackgroundMusic();
    }
    return this.musicEnabled;
  }
  
  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    this.saveSettings();
    return this.sfxEnabled;
  }
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
}

// Instance globale
window.audioSystem = new AudioSystem();

// Auto-start de la musique après le premier clic utilisateur
document.addEventListener('click', function initAudio() {
  if (window.audioSystem && window.audioSystem.musicEnabled) {
    window.audioSystem.startBackgroundMusic();
  }
  document.removeEventListener('click', initAudio);
}, { once: true });