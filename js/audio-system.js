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
  
  // Musique de fond - Thème South Park simplifié
  startBackgroundMusic() {
    if (!this.initAudioContext() || !this.musicEnabled || this.musicLoop) return;
    
    this.playBackgroundLoop();
  }
  
  playBackgroundLoop() {
    if (!this.musicEnabled) return;
    
    // Mélodie simple inspirée du thème South Park
    const melody = [
      {freq: 523, duration: 0.4}, // C
      {freq: 587, duration: 0.4}, // D
      {freq: 659, duration: 0.4}, // E
      {freq: 698, duration: 0.4}, // F
      {freq: 784, duration: 0.8}, // G
      {freq: 659, duration: 0.4}, // E
      {freq: 523, duration: 0.8}, // C
      {freq: 0, duration: 1.0},   // Pause
    ];
    
    let noteIndex = 0;
    
    const playNextNote = () => {
      if (!this.musicEnabled) {
        this.musicLoop = null;
        return;
      }
      
      const note = melody[noteIndex];
      
      if (note.freq > 0) {
        // Jouer la note avec un volume plus faible
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.musicVolume * this.masterVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + note.duration - 0.01);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + note.duration);
      }
      
      noteIndex = (noteIndex + 1) % melody.length;
      
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