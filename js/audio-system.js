// ============================================
// SOUTH PARK ELEMENTARY - SYSTÈME AUDIO
// Musique : fichier local via HTML5 Audio
// SFX     : sons 8-bit générés (Web Audio API)
// ============================================

class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.sfxVolume    = 0.5;
    this.musicEnabled = true;
    this.sfxEnabled   = true;

    // Lecteur HTML5 pour la musique de fond
    this.bgMusic = null;
    this.musicStarted = false;

    // Flag : l'utilisateur a interagi avec la page
    this.userInteracted = false;

    // Charger les préférences sauvegardées
    this.loadSettings();

    // Créer l'élément audio
    this._initBgMusic();
  }

  // --------------------------------------------------
  // Musique de fond — HTML5 Audio (fichier local)
  // --------------------------------------------------

  _initBgMusic() {
    const audio = new Audio();
    audio.src    = 'audio/southpark-theme.mp3';
    audio.loop   = true;
    audio.volume = this.masterVolume;
    audio.preload = 'none';

    audio.addEventListener('error', () => {
      console.warn('Fichier audio introuvable : audio/southpark-theme.mp3');
    });

    this.bgMusic = audio;
  }

  startBackgroundMusic() {
    if (!this.musicEnabled || !this.bgMusic || this.musicStarted) return;
    this.bgMusic.volume = this.masterVolume;
    this.bgMusic.play().then(() => {
      this.musicStarted = true;
    }).catch(e => {
      console.warn('Lecture audio impossible :', e);
    });
  }

  stopBackgroundMusic() {
    this.musicEnabled = false;
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
    this.musicStarted = false;
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

  // --------------------------------------------------
  // Volume
  // --------------------------------------------------

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.masterVolume;
    }
    this.saveSettings();
  }

  // --------------------------------------------------
  // Sauvegarder / Charger les paramètres
  // --------------------------------------------------

  saveSettings() {
    localStorage.setItem('sp-audio-settings', JSON.stringify({
      musicEnabled: this.musicEnabled,
      sfxEnabled:   this.sfxEnabled,
      masterVolume: this.masterVolume,
      sfxVolume:    this.sfxVolume
    }));
  }

  loadSettings() {
    const saved = localStorage.getItem('sp-audio-settings');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        this.musicEnabled = s.musicEnabled !== false;
        this.sfxEnabled   = s.sfxEnabled   !== false;
        this.masterVolume = s.masterVolume  || 0.3;
        this.sfxVolume    = s.sfxVolume     || 0.5;
      } catch (e) {}
    }
  }

  // --------------------------------------------------
  // Web Audio API — SFX 8-bit (inchangés)
  // --------------------------------------------------

  initAudioContext() {
    // Ne jamais créer l'AudioContext avant un geste utilisateur
    if (!this.userInteracted) return false;
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

  createOscillator(frequency, type = 'square', duration = 0.1) {
    if (!this.audioContext || !this.sfxEnabled) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode   = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.sfxVolume * this.masterVolume,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    return oscillator;
  }

  // Sons du mini-jeu
  playKickSound() {
    if (!this.initAudioContext()) return;
    const osc1 = this.createOscillator(800, 'sawtooth', 0.15);
    if (osc1) {
      osc1.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
    }
    setTimeout(() => { this.createOscillator(150, 'square', 0.05); }, 50);
  }

  playImpactSound() {
    if (!this.initAudioContext()) return;
    this.createOscillator(100, 'sawtooth', 0.1);
    setTimeout(() => { this.createOscillator(80, 'square', 0.08); }, 30);
  }

  playPowerUpSound() {
    if (!this.initAudioContext()) return;
    [262, 330, 392, 523].forEach((freq, i) => {
      setTimeout(() => { this.createOscillator(freq, 'square', 0.2); }, i * 50);
    });
  }

  playAchievementSound() {
    if (!this.initAudioContext()) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => { this.createOscillator(freq, 'triangle', 0.3); }, i * 100);
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
    setTimeout(() => { this.createOscillator(400, 'triangle', 0.1); }, 50);
  }

  playKennyToggleSound() {
    if (!this.initAudioContext()) return;
    const kenny = document.getElementById('kenny-main-toggle');
    if (kenny && kenny.checked) {
      this.createOscillator(200, 'sine', 0.2);
      setTimeout(() => { this.createOscillator(400, 'sine', 0.2); }, 100);
    } else {
      this.createOscillator(400, 'sine', 0.2);
      setTimeout(() => { this.createOscillator(200, 'sine', 0.3); }, 100);
    }
  }

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    this.saveSettings();
    return this.sfxEnabled;
  }

  // Méthodes conservées pour compatibilité
  setMusicVolume(v) { this.setMasterVolume(v); }
  setSFXVolume(v)   { this.sfxVolume = Math.max(0, Math.min(1, v)); this.saveSettings(); }
}

// Instance globale
window.audioSystem = new AudioSystem();

// Démarrer la musique au premier clic (requis par les navigateurs modernes)
document.addEventListener('click', function initAudio() {
  if (window.audioSystem) {
    // Autoriser la création de l'AudioContext maintenant
    window.audioSystem.userInteracted = true;

    // Initialiser Web Audio pour les SFX
    window.audioSystem.initAudioContext();
    if (window.audioSystem.audioContext &&
        window.audioSystem.audioContext.state === 'suspended') {
      window.audioSystem.audioContext.resume();
    }
    // Lancer la musique de fond
    if (window.audioSystem.musicEnabled) {
      window.audioSystem.startBackgroundMusic();
    }
  }
  document.removeEventListener('click', initAudio);
}, { once: true });