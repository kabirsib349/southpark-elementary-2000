// ============================================
// KICK THE BABY - Mini-jeu South Park
// Version AMELIOREE - Plus fun !
// ============================================

class KickTheBabyGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isPlaying = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('kick-baby-food-highscore') || '0');
    this.power = 0;
    this.powerIncreasing = true;
    this.babyFlying = false;
    this.babyX = 0;
    this.babyY = 0;
    this.babyVelocityX = 0;
    this.babyVelocityY = 0;
    this.babyRotation = 0;
    this.gravity = 0.6;
    this.wind = 0;
    this.cartmanX = 100;
    this.cartmanY = 300;
    this.particles = [];
    this.kickCount = 0;
    this.combo = 0;
    this.totalKicks = 0;
    this.snowflakes = [];
    this.cartmanExpression = 'normal';
    this.soundText = '';
    this.soundTextTimer = 0;
    this.achievements = JSON.parse(localStorage.getItem('kick-baby-achievements') || '[]');
    
    // NOUVEAU : Système de cibles de nourriture
    this.foodTarget = null;
    this.gameOver = false;
    this.targetHit = false;
    this.difficulty = 1;
    this.foodTypes = [
      { name: 'KFC', color: '#8B4513', size: 25, points: 1, message: "My KFC!" },
      { name: 'DONUT', color: '#FFB6C1', size: 20, points: 1, message: "Sweet!" },
      { name: 'CHEESY POOFS', color: '#FFA500', size: 30, points: 1, message: "Cheesy Poofs!" },
      { name: 'BURGER', color: '#8B4513', size: 25, points: 1, message: "Awesome!" },
      { name: 'PIZZA', color: '#FF6347', size: 28, points: 1, message: "Pizza time!" }
    ];
    
    this.funnyMessages = [
      "Don't kick the baby!",
      "Kick the baby!",
      "Oh my God!",
      "You bastard!",
      "Respect my authoritah!",
      "MISS! Try again!",
      "So close!",
      "Ike is flying!",
      "Kyle is gonna be mad!",
      "That's messed up!",
      "BULLSEYE!",
      "Screw you guys!",
      "I'm going home!",
      "Damn it!",
      "YES!"
    ];
    this.currentMessage = "";
    this.achievementsList = [
      { id: 'first_hit', name: 'Premier Hit', desc: 'Toucher la nourriture pour la premiere fois', unlocked: false },
      { id: 'score_5', name: 'Sniper', desc: 'Toucher 5 cibles consecutives', unlocked: false },
      { id: 'score_10', name: 'Marksman', desc: 'Toucher 10 cibles consecutives', unlocked: false },
      { id: 'score_20', name: 'Food Master', desc: 'Toucher 20 cibles consecutives', unlocked: false },
      { id: 'perfect_shot', name: 'Tir Parfait', desc: 'Toucher avec 100% de puissance', unlocked: false },
      { id: 'total_100', name: 'Centurion', desc: 'Toucher 100 cibles au total', unlocked: false }
    ];
  }

  init() {
    const modal = document.getElementById('minigame-modal');
    const canvas = document.getElementById('game-canvas');
    
    if (!canvas) return;
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = 600;
    this.canvas.height = 400;
    
    // Charger achievements
    const saved = localStorage.getItem('kick-baby-achievements');
    if (saved) {
      const savedAchievements = JSON.parse(saved);
      this.achievementsList.forEach(ach => {
        const found = savedAchievements.find(s => s.id === ach.id);
        if (found) ach.unlocked = found.unlocked;
      });
    }
    
    // Charger total hits
    this.totalKicks = parseInt(localStorage.getItem('kick-baby-total-hits') || '0');
    
    // Creer flocons de neige
    this.createSnowflakes();
    
    this.reset();
    this.draw();
  }
  
  createSnowflakes() {
    this.snowflakes = [];
    for (let i = 0; i < 30; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: Math.random() * 1 + 0.5,
        size: Math.random() * 3 + 1
      });
    }
  }
  
  // NOUVEAU : Créer une cible de nourriture
  createFoodTarget() {
    const foodType = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
    const minX = 250;
    const maxX = this.canvas.width - 50;
    const minY = 100;
    const maxY = this.cartmanY - 50;
    
    // Difficulté progressive : cible plus petite et plus haute
    const sizeReduction = Math.min(this.score * 0.5, 10);
    const heightIncrease = Math.min(this.score * 2, 50);
    
    this.foodTarget = {
      x: minX + Math.random() * (maxX - minX),
      y: maxY - heightIncrease + Math.random() * (maxY - minY - heightIncrease),
      size: Math.max(foodType.size - sizeReduction, 15),
      color: foodType.color,
      name: foodType.name,
      points: foodType.points,
      message: foodType.message,
      bobOffset: 0 // Pour animation de flottement
    };
  }

  reset() {
    this.isPlaying = true;
    this.gameOver = false;
    this.targetHit = false;
    this.power = 0;
    this.powerIncreasing = true;
    this.babyFlying = false;
    this.babyX = this.cartmanX + 60;
    this.babyY = this.cartmanY + 10;
    this.babyVelocityX = 0;
    this.babyVelocityY = 0;
    this.babyRotation = 0;
    this.wind = (Math.random() - 0.5) * 0.3; // Vent très réduit
    this.particles = [];
    this.currentMessage = "";
    this.kickCount++;
    this.cartmanExpression = 'normal';
    this.soundText = '';
    this.soundTextTimer = 0;
    
    // Créer la première cible de nourriture
    this.createFoodTarget();
  }
  
  // NOUVEAU : Prochaine cible après un hit
  nextTarget() {
    this.babyFlying = false;
    this.babyX = this.cartmanX + 60;
    this.babyY = this.cartmanY + 10;
    this.babyVelocityX = 0;
    this.babyVelocityY = 0;
    this.babyRotation = 0;
    this.targetHit = false;
    this.cartmanExpression = 'happy';
    
    // Créer nouvelle cible
    this.createFoodTarget();
    
    // Message de succès
    this.currentMessage = this.foodTarget.message;
  }

  createParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
        color: ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF'][Math.floor(Math.random() * 4)]
      });
    }
  }

  kick() {
    if (this.babyFlying || !this.isPlaying || this.gameOver) return;
    
    this.babyFlying = true;
    this.totalKicks++;
    localStorage.setItem('kick-baby-total-hits', this.totalKicks);
    
    const angle = -50 * (Math.PI / 180);
    const speed = (this.power / 100) * 15 + 5;
    this.babyVelocityX = Math.cos(angle) * speed;
    this.babyVelocityY = Math.sin(angle) * speed;
    
    // Expression de Cartman
    if (this.power > 90) {
      this.cartmanExpression = 'evil';
      this.unlockAchievement('perfect_shot');
    } else if (this.power < 20) {
      this.cartmanExpression = 'disappointed';
    } else {
      this.cartmanExpression = 'normal';
    }
    
    // Creer des particules au kick
    this.createParticles(this.babyX, this.babyY, 20);
    
    // Son de kick
    if (window.audioSystem) {
      window.audioSystem.playKickSound();
    }
    
    // Son textuel
    this.soundText = 'WHOOSH!';
    this.soundTextTimer = 30;
    
    // Message d'encouragement
    this.currentMessage = "Vise la " + this.foodTarget.name + "!";
  }
  
  unlockAchievement(id) {
    const ach = this.achievementsList.find(a => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      localStorage.setItem('kick-baby-achievements', JSON.stringify(this.achievementsList));
      // Afficher notification
      this.showAchievementNotification(ach);
    }
  }
  
  showAchievementNotification(ach) {
    // Sera affiche dans le draw()
    this.achievementNotification = {
      name: ach.name,
      desc: ach.desc,
      timer: 120
    };
    
    // Son d'achievement
    if (window.audioSystem) {
      window.audioSystem.playAchievementSound();
    }
  }

  update() {
    if (!this.isPlaying || this.gameOver) return;

    // Update power bar
    if (!this.babyFlying) {
      if (this.powerIncreasing) {
        this.power += 3;
        if (this.power >= 100) {
          this.power = 100;
          this.powerIncreasing = false;
        }
      } else {
        this.power -= 3;
        if (this.power <= 0) {
          this.power = 0;
          this.powerIncreasing = true;
        }
      }
    }

    // Update food target animation
    if (this.foodTarget) {
      this.foodTarget.bobOffset += 0.1;
    }

    // Update baby physics
    if (this.babyFlying) {
      this.babyX += this.babyVelocityX;
      this.babyY += this.babyVelocityY;
      this.babyVelocityY += this.gravity;
      this.babyVelocityX += this.wind * 0.02; // Vent très réduit
      this.babyRotation += 0.2;

      // NOUVEAU : Check collision avec la cible de nourriture
      if (this.foodTarget && !this.targetHit) {
        const dist = Math.sqrt(
          Math.pow(this.babyX - this.foodTarget.x, 2) + 
          Math.pow(this.babyY - (this.foodTarget.y + Math.sin(this.foodTarget.bobOffset) * 3), 2)
        );
        
        // Zone de collision = cercle rouge extérieur (size + 3 cercles * 8px)
        const hitZone = this.foodTarget.size + (3 * 8);
        
        if (dist < hitZone) {
          // HIT !
          this.targetHit = true;
          this.score++;
          this.createParticles(this.foodTarget.x, this.foodTarget.y, 25);
          this.soundText = 'HIT!';
          this.soundTextTimer = 30;
          
          // Son de power-up pour le hit
          if (window.audioSystem) {
            window.audioSystem.playPowerUpSound();
          }
          
          // Unlock achievements
          this.unlockAchievement('first_hit');
          if (this.score >= 5) this.unlockAchievement('score_5');
          if (this.score >= 10) this.unlockAchievement('score_10');
          if (this.score >= 20) this.unlockAchievement('score_20');
          if (this.totalKicks >= 100) this.unlockAchievement('total_100');
          
          // Sauvegarder high score
          if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('kick-baby-food-highscore', this.highScore);
          }
          
          // Préparer la prochaine cible après un délai
          setTimeout(() => {
            if (this.isPlaying) {
              this.nextTarget();
            }
          }, 800);
        }
      }

      // Check if baby hit ground
      if (this.babyY >= this.cartmanY + 10) {
        this.babyY = this.cartmanY + 10;
        this.babyFlying = false;
        
        // CORRECTION : Game Over SEULEMENT si on n'a PAS touché la cible
        if (!this.targetHit) {
          this.gameOver = true;
          this.isPlaying = false;
          this.createParticles(this.babyX, this.babyY, 15);
          this.soundText = 'MISS!';
          this.soundTextTimer = 60;
          this.currentMessage = "GAME OVER! Tu as raté!";
          this.cartmanExpression = 'disappointed';
          
          // Son d'impact
          if (window.audioSystem) {
            window.audioSystem.playImpactSound();
          }
        }
        // Si on a touché la cible, on attend juste la prochaine cible
      }

      // Check if baby went off screen
      if (this.babyX > this.canvas.width + 50 || this.babyX < -50 || this.babyY < -50) {
        this.babyFlying = false;
        
        // CORRECTION : Game Over SEULEMENT si on n'a PAS touché la cible
        if (!this.targetHit) {
          this.gameOver = true;
          this.isPlaying = false;
          this.currentMessage = "GAME OVER! Hors limites!";
          this.cartmanExpression = 'disappointed';
          
          // Son d'impact
          if (window.audioSystem) {
            window.audioSystem.playImpactSound();
          }
        }
      }
    }

    // Update particles
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.life--;
      return p.life > 0;
    });
    
    // Update snowflakes
    this.snowflakes.forEach(s => {
      s.y += s.speed;
      if (s.y > this.canvas.height) {
        s.y = -10;
        s.x = Math.random() * this.canvas.width;
      }
    });
    
    // Update sound text timer
    if (this.soundTextTimer > 0) {
      this.soundTextTimer--;
    }
    
    // Update achievement notification
    if (this.achievementNotification) {
      this.achievementNotification.timer--;
      if (this.achievementNotification.timer <= 0) {
        this.achievementNotification = null;
      }
    }
  }

  drawCartman(x, y) {
    const ctx = this.ctx;
    
    // Corps
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(x, y, 45, 55);
    
    // Tete
    ctx.fillStyle = '#FFCC99';
    ctx.beginPath();
    ctx.arc(x + 22, y - 10, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Bonnet
    ctx.fillStyle = '#00AAFF';
    ctx.fillRect(x + 5, y - 25, 35, 18);
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(x + 5, y - 28, 35, 3);
    
    // Yeux selon expression
    ctx.fillStyle = '#000000';
    if (this.cartmanExpression === 'evil') {
      // Yeux mechants
      ctx.beginPath();
      ctx.moveTo(x + 12, y - 10);
      ctx.lineTo(x + 16, y - 6);
      ctx.lineTo(x + 12, y - 6);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 32, y - 10);
      ctx.lineTo(x + 28, y - 6);
      ctx.lineTo(x + 32, y - 6);
      ctx.fill();
    } else if (this.cartmanExpression === 'disappointed') {
      // Yeux tristes
      ctx.fillRect(x + 12, y - 6, 4, 4);
      ctx.fillRect(x + 28, y - 6, 4, 4);
    } else {
      // Yeux normaux
      ctx.fillRect(x + 12, y - 8, 4, 4);
      ctx.fillRect(x + 28, y - 8, 4, 4);
    }
    
    // Bouche selon expression
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this.cartmanExpression === 'evil') {
      ctx.arc(x + 22, y - 2, 10, 0.1, Math.PI - 0.1);
    } else if (this.cartmanExpression === 'disappointed') {
      ctx.arc(x + 22, y + 5, 8, Math.PI + 0.2, Math.PI * 2 - 0.2);
    } else {
      ctx.arc(x + 22, y, 8, 0.2, Math.PI - 0.2);
    }
    ctx.stroke();
    
    // Texte
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('CARTMAN', x - 5, y - 30);
  }

  drawBaby(x, y, rotation) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.translate(x + 15, y + 15);
    ctx.rotate(rotation);
    
    // Corps
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(-15, -15, 30, 30);
    
    // Tete
    ctx.fillStyle = '#FFCC99';
    ctx.beginPath();
    ctx.arc(0, -20, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Bonnet
    ctx.fillStyle = '#FFAA00';
    ctx.fillRect(-10, -30, 20, 12);
    
    // Yeux
    ctx.fillStyle = '#000000';
    ctx.fillRect(-6, -22, 3, 3);
    ctx.fillRect(3, -22, 3, 3);
    
    // Bouche
    ctx.fillRect(-4, -16, 8, 2);
    
    ctx.restore();
    
    // Texte
    if (!this.babyFlying) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px Arial';
      ctx.fillText('IKE', x + 5, y - 5);
    }
  }
  
  // NOUVEAU : Dessiner la cible de nourriture
  drawFoodTarget() {
    if (!this.foodTarget) return;
    
    const ctx = this.ctx;
    const x = this.foodTarget.x;
    const y = this.foodTarget.y + Math.sin(this.foodTarget.bobOffset) * 3; // Animation flottante
    const size = this.foodTarget.size;
    
    // Effet de cible (cercles concentriques)
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(x, y, size + i * 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Dessiner la nourriture selon le type
    ctx.fillStyle = this.foodTarget.color;
    
    if (this.foodTarget.name === 'KFC') {
      // Cuisse de poulet
      ctx.beginPath();
      ctx.ellipse(x, y - 5, size * 0.6, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x, y + 8, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.foodTarget.name === 'DONUT') {
      // Donut
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.foodTarget.name === 'CHEESY POOFS') {
      // Sac de Cheesy Poofs
      ctx.fillRect(x - size * 0.7, y - size, size * 1.4, size * 1.8);
      ctx.fillStyle = '#FF6600';
      ctx.font = 'bold 8px Arial';
      ctx.fillText('CHEESY', x - size * 0.6, y - size * 0.3);
      ctx.fillText('POOFS', x - size * 0.5, y + size * 0.2);
    } else if (this.foodTarget.name === 'BURGER') {
      // Burger
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x - size * 0.8, y - size * 0.3, size * 1.6, size * 0.6);
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(x - size * 0.7, y - size * 0.1, size * 1.4, size * 0.2);
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(x - size * 0.6, y + size * 0.1, size * 1.2, size * 0.1);
    } else if (this.foodTarget.name === 'PIZZA') {
      // Part de pizza
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x - size * 0.8, y + size * 0.6);
      ctx.lineTo(x + size * 0.8, y + size * 0.6);
      ctx.closePath();
      ctx.fill();
      // Pepperoni
      ctx.fillStyle = '#8B0000';
      ctx.beginPath();
      ctx.arc(x - size * 0.3, y, size * 0.15, 0, Math.PI * 2);
      ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Nom de la nourriture
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px "Comic Sans MS"';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    const textWidth = ctx.measureText(this.foodTarget.name).width;
    ctx.strokeText(this.foodTarget.name, x - textWidth / 2, y + size + 20);
    ctx.fillText(this.foodTarget.name, x - textWidth / 2, y + size + 20);
  }

  draw() {
    if (!this.ctx) return;

    // Clear canvas
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw snowflakes
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.snowflakes.forEach(s => {
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(100, 50, 30, 0, Math.PI * 2);
    this.ctx.arc(130, 50, 35, 0, Math.PI * 2);
    this.ctx.arc(160, 50, 30, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(400, 80, 25, 0, Math.PI * 2);
    this.ctx.arc(425, 80, 30, 0, Math.PI * 2);
    this.ctx.arc(450, 80, 25, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw ground
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, this.cartmanY + 60, this.canvas.width, this.canvas.height);
    
    // Draw snow texture
    this.ctx.fillStyle = '#F0F0F0';
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % this.canvas.width;
      const y = this.cartmanY + 60 + (i * 13) % 40;
      this.ctx.fillRect(x, y, 3, 3);
    }

    // Draw food target
    this.drawFoodTarget();

    // Draw particles
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life / 30;
      this.ctx.fillRect(p.x, p.y, 4, 4);
    });
    this.ctx.globalAlpha = 1;

    // Draw Cartman
    this.drawCartman(this.cartmanX, this.cartmanY);

    // Draw Baby
    this.drawBaby(this.babyX, this.babyY, this.babyRotation);

    // Draw sound text
    if (this.soundTextTimer > 0) {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 4;
      this.ctx.font = 'bold 24px "Comic Sans MS"';
      const textWidth = this.ctx.measureText(this.soundText).width;
      this.ctx.strokeText(this.soundText, this.babyX - textWidth / 2, this.babyY - 40);
      this.ctx.fillText(this.soundText, this.babyX - textWidth / 2, this.babyY - 40);
    }

    // Draw power bar
    if (!this.babyFlying && this.isPlaying) {
      // Barre de fond
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(18, 18, 204, 34);
      
      // Barre de power avec gradient
      const powerGradient = this.ctx.createLinearGradient(20, 20, 20 + this.power * 2, 20);
      if (this.power < 30) {
        powerGradient.addColorStop(0, '#FF0000');
        powerGradient.addColorStop(1, '#FF6600');
      } else if (this.power < 70) {
        powerGradient.addColorStop(0, '#FFAA00');
        powerGradient.addColorStop(1, '#FFFF00');
      } else {
        powerGradient.addColorStop(0, '#00FF00');
        powerGradient.addColorStop(1, '#00FFFF');
      }
      this.ctx.fillStyle = powerGradient;
      this.ctx.fillRect(20, 20, this.power * 2, 30);
      
      // Bordure
      this.ctx.strokeStyle = '#FFFF00';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(20, 20, 200, 30);
      
      // Texte POWER
      this.ctx.fillStyle = '#FFFF00';
      this.ctx.font = 'bold 14px "Comic Sans MS"';
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 3;
      this.ctx.strokeText('POWER', 230, 40);
      this.ctx.fillText('POWER', 230, 40);
    }

    // Draw wind indicator (reduit)
    if (this.babyFlying && Math.abs(this.wind) > 0.1) {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '12px Arial';
      const windText = this.wind > 0 ? 'VENT >>> ' + Math.abs(this.wind).toFixed(1) : 'VENT <<< ' + Math.abs(this.wind).toFixed(1);
      this.ctx.fillText(windText, this.canvas.width - 120, 30);
    }

    // Draw score (NOUVEAU : Hits au lieu de distance)
    this.ctx.fillStyle = '#000000';
    this.ctx.font = 'bold 18px "Comic Sans MS"';
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText('Hits: ' + this.score, 20, 80);
    this.ctx.fillText('Hits: ' + this.score, 20, 80);
    
    this.ctx.strokeText('Record: ' + this.highScore, 20, 105);
    this.ctx.fillText('Record: ' + this.highScore, 20, 105);
    
    // Draw difficulté
    if (this.score > 0) {
      this.ctx.fillStyle = '#FF6600';
      this.ctx.font = 'bold 14px "Comic Sans MS"';
      this.ctx.strokeText('Difficulté: ' + Math.min(Math.floor(this.score / 5) + 1, 10), 20, 130);
      this.ctx.fillText('Difficulté: ' + Math.min(Math.floor(this.score / 5) + 1, 10), 20, 130);
    }

    // Draw funny message
    if (this.currentMessage && this.babyFlying) {
      this.ctx.fillStyle = '#FFFF00';
      this.ctx.font = 'bold 16px "Comic Sans MS"';
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 3;
      const textWidth = this.ctx.measureText(this.currentMessage).width;
      this.ctx.strokeText(this.currentMessage, this.canvas.width / 2 - textWidth / 2, 150);
      this.ctx.fillText(this.currentMessage, this.canvas.width / 2 - textWidth / 2, 150);
    }

    // Draw achievement notification
    if (this.achievementNotification) {
      const alpha = this.achievementNotification.timer > 100 ? 1 : this.achievementNotification.timer / 100;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = 'rgba(0, 100, 0, 0.9)';
      this.ctx.fillRect(this.canvas.width / 2 - 150, 180, 300, 60);
      this.ctx.strokeStyle = '#00FF00';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(this.canvas.width / 2 - 150, 180, 300, 60);
      
      this.ctx.fillStyle = '#FFFF00';
      this.ctx.font = 'bold 14px "Comic Sans MS"';
      this.ctx.fillText('*** ACHIEVEMENT UNLOCKED ***', this.canvas.width / 2 - 130, 200);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 12px "Comic Sans MS"';
      this.ctx.fillText(this.achievementNotification.name, this.canvas.width / 2 - 130, 220);
      this.ctx.font = '10px "Comic Sans MS"';
      this.ctx.fillText(this.achievementNotification.desc, this.canvas.width / 2 - 130, 235);
      this.ctx.globalAlpha = 1;
    }

    // Draw instructions
    if (!this.babyFlying && this.isPlaying && !this.gameOver) {
      this.ctx.fillStyle = '#FF0000';
      this.ctx.font = 'bold 16px "Comic Sans MS"';
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 3;
      this.ctx.strokeText('>>> VISE LA NOURRITURE <<<', this.canvas.width / 2 - 140, this.canvas.height - 30);
      this.ctx.fillText('>>> VISE LA NOURRITURE <<<', this.canvas.width / 2 - 140, this.canvas.height - 30);
    }

    // Game over message
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#FFFF00';
      this.ctx.font = 'bold 32px "Comic Sans MS"';
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 4;
      this.ctx.strokeText('GAME OVER!', this.canvas.width / 2 - 100, this.canvas.height / 2 - 80);
      this.ctx.fillText('GAME OVER!', this.canvas.width / 2 - 100, this.canvas.height / 2 - 80);
      
      this.ctx.font = 'bold 24px "Comic Sans MS"';
      this.ctx.strokeText('Hits: ' + this.score, this.canvas.width / 2 - 50, this.canvas.height / 2 - 30);
      this.ctx.fillText('Hits: ' + this.score, this.canvas.width / 2 - 50, this.canvas.height / 2 - 30);
      
      if (this.score === this.highScore && this.score > 0) {
        this.ctx.fillStyle = '#FF00FF';
        this.ctx.font = 'bold 20px "Comic Sans MS"';
        this.ctx.strokeText('*** NOUVEAU RECORD ***', this.canvas.width / 2 - 120, this.canvas.height / 2 + 10);
        this.ctx.fillText('*** NOUVEAU RECORD ***', this.canvas.width / 2 - 120, this.canvas.height / 2 + 10);
      }
      
      // Message d'encouragement
      this.ctx.fillStyle = '#FFAA00';
      this.ctx.font = 'bold 16px "Comic Sans MS"';
      if (this.score === 0) {
        this.ctx.strokeText('Tu n\'as touché aucune cible!', this.canvas.width / 2 - 120, this.canvas.height / 2 + 40);
        this.ctx.fillText('Tu n\'as touché aucune cible!', this.canvas.width / 2 - 120, this.canvas.height / 2 + 40);
      } else if (this.score < 5) {
        this.ctx.strokeText('Pas mal pour un début!', this.canvas.width / 2 - 90, this.canvas.height / 2 + 40);
        this.ctx.fillText('Pas mal pour un début!', this.canvas.width / 2 - 90, this.canvas.height / 2 + 40);
      } else if (this.score < 10) {
        this.ctx.strokeText('Bon tireur!', this.canvas.width / 2 - 50, this.canvas.height / 2 + 40);
        this.ctx.fillText('Bon tireur!', this.canvas.width / 2 - 50, this.canvas.height / 2 + 40);
      } else {
        this.ctx.strokeText('EXPERT SNIPER!', this.canvas.width / 2 - 70, this.canvas.height / 2 + 40);
        this.ctx.fillText('EXPERT SNIPER!', this.canvas.width / 2 - 70, this.canvas.height / 2 + 40);
      }
      
      // Achievements unlocked count
      const unlockedCount = this.achievementsList.filter(a => a.unlocked).length;
      this.ctx.fillStyle = '#00FF00';
      this.ctx.font = 'bold 14px "Comic Sans MS"';
      this.ctx.strokeText('Achievements: ' + unlockedCount + '/' + this.achievementsList.length, this.canvas.width / 2 - 70, this.canvas.height / 2 + 70);
      this.ctx.fillText('Achievements: ' + unlockedCount + '/' + this.achievementsList.length, this.canvas.width / 2 - 70, this.canvas.height / 2 + 70);
      
      this.ctx.fillStyle = '#00FF00';
      this.ctx.font = 'bold 16px "Comic Sans MS"';
      this.ctx.strokeText('Clique pour rejouer', this.canvas.width / 2 - 80, this.canvas.height / 2 + 100);
      this.ctx.fillText('Clique pour rejouer', this.canvas.width / 2 - 80, this.canvas.height / 2 + 100);
    }

    this.update();
    requestAnimationFrame(() => this.draw());
  }

  handleClick() {
    if (this.gameOver) {
      // Recommencer le jeu
      this.score = 0;
      this.reset();
    } else if (this.isPlaying && !this.babyFlying) {
      this.kick();
    }
  }
}

// Global game instance
let kickBabyGame = null;

function openKickBabyGame() {
  const modal = document.getElementById('minigame-modal');
  if (modal) {
    modal.style.display = 'flex';
    if (!kickBabyGame) {
      kickBabyGame = new KickTheBabyGame();
    }
    kickBabyGame.init();
  }
}

function closeMinigame() {
  const modal = document.getElementById('minigame-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  if (kickBabyGame) {
    kickBabyGame.isPlaying = false;
  }
}
