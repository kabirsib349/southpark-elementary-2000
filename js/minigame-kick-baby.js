// ============================================
// KICK THE BABY - Mini-jeu South Park REFONTE
// Visee souris, 3 vies Kenny, cibles mobiles,
// combo multiplier, 2 modes de jeu
// ============================================

class KickTheBabyGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.state = 'TITLE'; // TITLE | PLAYING | GAMEOVER
    this.mode = 'survival'; // survival | chrono

    // Score / lives
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('sp-mg-hs') || '0');
    this.lives = 3;
    this.combo = 0;
    this.comboMult = 1;
    this.timeLeft = 30;
    this._timerInt = null;

    // Power bar
    this.power = 0;
    this.powerDir = 1;
    this.powerSpeed = 2.5;

    // Ike
    this.ikeX = 0; this.ikeY = 0;
    this.ikeVX = 0; this.ikeVY = 0;
    this.ikeRot = 0;
    this.ikeFlying = false;
    this.targetHit = false;

    // Cartman position
    this.cX = 80; this.cY = 310;
    this.cExpr = 'normal'; // normal | happy | evil | sad
    this.speech = ''; this.speechTimer = 0;

    // Mouse
    this.mouseX = 400; this.mouseY = 200;

    // Targets, particles, popups
    this.targets = [];
    this.particles = [];
    this.popups = [];
    this.snowflakes = [];

    // Screen shake
    this.shake = 0;

    // Achievements
    this.achList = [
      { id: 'first',   name: 'Premier Hit !',         desc: 'Toucher une cible',              unlocked: false },
      { id: 'combo3',  name: 'Combo x3',              desc: '3 hits consecutifs',             unlocked: false },
      { id: 'combo5',  name: 'Sniper Elite',          desc: '5 hits consecutifs',             unlocked: false },
      { id: 'kenny',   name: 'Oh my God!',            desc: 'Toucher Kenny',                  unlocked: false },
      { id: 'chef',    name: "Chef's Special",         desc: 'Toucher Chef',                   unlocked: false },
      { id: 'sc20',    name: 'Respect mah authoritah','desc': '20 points en une partie',      unlocked: false },
      { id: 'sc50',    name: 'CARTMAN WINS',          desc: '50 points en une partie',        unlocked: false },
    ];
    const saved = localStorage.getItem('sp-mg-ach');
    if (saved) {
      JSON.parse(saved).forEach(s => {
        const a = this.achList.find(x => x.id === s.id);
        if (a) a.unlocked = s.unlocked;
      });
    }
    this.achNotif = null;

    // Food types
    this.foods = [
      { id: 'kfc',    label: 'KFC',         pts: 1, color: '#8B4513' },
      { id: 'donut',  label: 'DONUT',       pts: 1, color: '#FFB6C1' },
      { id: 'cheesy', label: 'CHEESY POOFS',pts: 1, color: '#FFA500' },
      { id: 'burger', label: 'BURGER',      pts: 1, color: '#A0522D' },
      { id: 'pizza',  label: 'PIZZA',       pts: 1, color: '#FF6347' },
    ];

    // Cartman speech sets
    this.speeches = {
      kick:     ["KICK THE BABY!", "Respect my authoritah!", "Ha-ha!"],
      hit:      ["BULLSEYE!", "Sweeeet!", "YEAH BOY!"],
      combo:    ["COMBO! COMBO!", "I'm so money!", "RESPECT MAH AUTHORITAH!"],
      miss:     ["Screw you guys!", "Son of a b**ch!", "Damn it!"],
      gameover: ["You bastards!", "God dammit!", "I'm not fat, I'm big-boned!"],
    };

    // Build rects for title screen buttons
    this._btnS = null; this._btnC = null;
  }

  // ---- INIT ----
  init() {
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 650;
    this.canvas.height = 420;

    // Mouse tracking
    this.canvas.onmousemove = e => {
      const r = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - r.left) * (this.canvas.width / r.width);
      this.mouseY = (e.clientY - r.top) * (this.canvas.height / r.height);
    };

    // Snowflakes
    this.snowflakes = Array.from({ length: 40 }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      s: Math.random() * 1.5 + 0.5,
      r: Math.random() * 2 + 1,
    }));

    this.state = 'TITLE';
    this._loop();
  }

  // ---- START GAME ----
  startGame(mode) {
    this.mode = mode;
    this.state = 'PLAYING';
    this.score = 0;
    this.lives = 3;
    this.combo = 0;
    this.comboMult = 1;
    this.timeLeft = 30;
    this.power = 0;
    this.powerDir = 1;
    this.powerSpeed = 2.5;
    this.ikeFlying = false;
    this.ikeX = this.cX + 65; this.ikeY = this.cY + 15;
    this.targets = []; this.particles = []; this.popups = [];
    this.cExpr = 'normal'; this.speech = ''; this.speechTimer = 0;
    this.shake = 0; this.targetHit = false;
    this.spawnTarget(); this.spawnTarget();
    if (mode === 'chrono') {
      if (this._timerInt) clearInterval(this._timerInt);
      this._timerInt = setInterval(() => {
        if (this.state !== 'PLAYING') { clearInterval(this._timerInt); return; }
        this.timeLeft--;
        if (this.timeLeft <= 0) { this.timeLeft = 0; clearInterval(this._timerInt); this._gameOver(); }
      }, 1000);
    }
  }

  // ---- SPAWN TARGET ----
  spawnTarget() {
    const diff = Math.min(Math.floor(this.score / 5), 8);
    const rand = Math.random();
    let type, label, pts, color;
    if (rand < 0.05) {
      type = 'chef'; label = 'CHEF'; pts = 5; color = '#4a2200';
    } else if (rand < 0.18) {
      type = 'kenny'; label = 'KENNY'; pts = 3; color = '#FF6600';
    } else {
      const f = this.foods[Math.floor(Math.random() * this.foods.length)];
      type = f.id; label = f.label; pts = f.pts; color = f.color;
    }
    const groundY = this.cY + 60;
    const minY = 70 + diff * 8;
    const maxY = groundY - 90;
    this.targets.push({
      type, label, pts, color,
      x: 260 + Math.random() * (this.canvas.width - 310),
      y: minY + Math.random() * Math.max(10, maxY - minY),
      size: Math.max(20 - diff * 1.5, 13),
      moveX: (Math.random() < 0.5 ? 1 : -1) * (0.8 + diff * 0.25),
      bob: Math.random() * Math.PI * 2,
      bobSpeed: 0.05 + Math.random() * 0.03,
      hit: false, hitTimer: 0,
    });
  }

  // ---- AIMING ----
  getAngle() {
    const kx = this.cX + 70, ky = this.cY + 30;
    let a = Math.atan2(this.mouseY - ky, this.mouseX - kx);
    return Math.max(-1.4, Math.min(-0.08, a));
  }

  // ---- KICK ----
  kick() {
    if (this.ikeFlying || this.state !== 'PLAYING') return;
    this.ikeFlying = true;
    this.targetHit = false;
    const a = this.getAngle();
    const spd = (this.power / 100) * 16 + 4;
    this.ikeVX = Math.cos(a) * spd;
    this.ikeVY = Math.sin(a) * spd;
    this.ikeRot = 0;
    this.cExpr = this.power > 85 ? 'evil' : 'normal';
    this._setSpeech(this.speeches.kick);
    this._particles(this.ikeX, this.ikeY, 10, ['#FF6600','#FFD700','#FF0000']);
    if (window.audioSystem) window.audioSystem.playKickSound();
  }

  // ---- UPDATE ----
  _update() {
    if (this.state !== 'PLAYING') return;

    // Power bar
    if (!this.ikeFlying) {
      this.power += this.powerDir * this.powerSpeed;
      if (this.power >= 100) { this.power = 100; this.powerDir = -1; }
      if (this.power <= 0)   { this.power = 0;   this.powerDir = 1; }
    }

    // Ike physics
    if (this.ikeFlying) {
      this.ikeX += this.ikeVX;
      this.ikeY += this.ikeVY;
      this.ikeVY += 0.45;
      this.ikeRot += 0.18;

      // Collision with targets
      for (const t of this.targets) {
        if (t.hit) continue;
        const d = Math.hypot(this.ikeX - t.x, this.ikeY - (t.y + Math.sin(t.bob) * 4));
        if (d < t.size + 14) {
          t.hit = true; t.hitTimer = 25;
          this.targetHit = true;
          const pts = t.pts * this.comboMult;
          this.score += pts;
          if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('sp-mg-hs', this.highScore);
          }
          this.combo++;
          if (this.combo >= 3) this.comboMult = 2;
          if (this.combo >= 5) this.comboMult = 3;
          if (this.combo >= 8) this.comboMult = 5;
          const pColor = t.type === 'kenny' ? '#FF0000' : t.type === 'chef' ? '#FF9900' : '#FFFF00';
          const pText = (t.type === 'kenny' ? 'OH MY GOD! ' : t.type === 'chef' ? "CHEF! " : '') + '+' + pts + (this.comboMult > 1 ? ' x' + this.comboMult : '');
          this.popups.push({ x: t.x, y: t.y - 20, text: pText, color: pColor, life: 60, vy: -1.8 });
          this._particles(t.x, t.y, 18, ['#FF0000','#FFFF00','#FF6600','#00FF00']);
          if (this.combo >= 3) { this._setSpeech(this.speeches.combo); this.cExpr = 'evil'; }
          else { this._setSpeech(this.speeches.hit); this.cExpr = 'happy'; }
          this._unlock('first');
          if (t.type === 'kenny') this._unlock('kenny');
          if (t.type === 'chef')  this._unlock('chef');
          if (this.combo >= 3) this._unlock('combo3');
          if (this.combo >= 5) this._unlock('combo5');
          if (this.score >= 20) this._unlock('sc20');
          if (this.score >= 50) this._unlock('sc50');
          if (window.audioSystem) window.audioSystem.playPowerUpSound();
          const ti = this.targets.indexOf(t);
          setTimeout(() => {
            if (this.state === 'PLAYING') {
              if (ti > -1) this.targets.splice(ti, 1);
              this.spawnTarget();
              this.ikeFlying = false;
              this.ikeX = this.cX + 65; this.ikeY = this.cY + 15;
            }
          }, 650);
          break;
        }
      }

      // Hit ground
      const gY = this.cY + 60;
      if (this.ikeY >= gY || this.ikeX > this.canvas.width + 60 || this.ikeX < -60 || this.ikeY < -80) {
        this.ikeFlying = false;
        this.ikeX = this.cX + 65; this.ikeY = this.cY + 15;
        if (!this.targetHit) this._miss();
      }
    }

    // Targets
    for (const t of this.targets) {
      t.bob += t.bobSpeed;
      t.x += t.moveX;
      if (t.x < 200 || t.x > this.canvas.width - 30) t.moveX *= -1;
      if (t.hit) t.hitTimer--;
    }

    // Particles, popups, snow
    this.particles = this.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; return p.life > 0; });
    this.popups    = this.popups.filter(p => { p.y += p.vy; p.life--; return p.life > 0; });
    this.snowflakes.forEach(s => { s.y += s.s; s.x += Math.sin(s.y * 0.02) * 0.4; if (s.y > this.canvas.height) { s.y = -5; s.x = Math.random() * this.canvas.width; } });
    if (this.speechTimer > 0) this.speechTimer--;
    if (this.shake > 0) this.shake *= 0.8;
    if (this.achNotif) { this.achNotif.timer--; if (this.achNotif.timer <= 0) this.achNotif = null; }
  }

  _miss() {
    this.combo = 0; this.comboMult = 1;
    this._setSpeech(this.speeches.miss);
    this.cExpr = 'sad'; this.shake = 8;
    if (window.audioSystem) window.audioSystem.playImpactSound();
    if (this.mode === 'survival') {
      this.lives--;
      if (this.lives <= 0) this._gameOver();
    }
  }

  _gameOver() {
    this.state = 'GAMEOVER';
    this.cExpr = 'sad';
    this._setSpeech(this.speeches.gameover);
    this.shake = 14;
    if (this._timerInt) clearInterval(this._timerInt);
  }

  // ---- HELPERS ----
  _particles(x, y, n, colors) {
    for (let i = 0; i < n; i++) {
      this.particles.push({ x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10-2, life: 40+Math.random()*15, color: colors[Math.floor(Math.random()*colors.length)] });
    }
  }
  _setSpeech(arr) { this.speech = arr[Math.floor(Math.random()*arr.length)]; this.speechTimer = 120; }
  _unlock(id) {
    const a = this.achList.find(x => x.id === id);
    if (a && !a.unlocked) {
      a.unlocked = true;
      localStorage.setItem('sp-mg-ach', JSON.stringify(this.achList));
      this.achNotif = { name: a.name, desc: a.desc, timer: 150 };
      if (window.audioSystem) window.audioSystem.playAchievementSound();
    }
  }

  // ---- HANDLE CLICK ----
  handleClick() {
    if (this.state === 'TITLE') {
      if (this._btnS && this._ptInRect(this.mouseX, this.mouseY, this._btnS)) this.startGame('survival');
      if (this._btnC && this._ptInRect(this.mouseX, this.mouseY, this._btnC)) this.startGame('chrono');
    } else if (this.state === 'GAMEOVER') {
      this.state = 'TITLE';
    } else if (this.state === 'PLAYING' && !this.ikeFlying) {
      this.kick();
    }
  }
  _ptInRect(px, py, r) { return px >= r.x && px <= r.x+r.w && py >= r.y && py <= r.y+r.h; }

  // ---- LOOP ----
  _loop() { this._draw(); requestAnimationFrame(() => this._loop()); }

  // ---- DRAW MAIN ----
  _draw() {
    if (!this.ctx) return;
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    const sx = this.shake > 0.5 ? (Math.random()-0.5)*this.shake : 0;
    const sy = this.shake > 0.5 ? (Math.random()-0.5)*this.shake : 0;
    ctx.save();
    ctx.translate(sx, sy);
    if (this.state === 'TITLE')   this._drawTitle();
    else { this._drawGame(); if (this.state === 'GAMEOVER') this._drawGameOver(); }
    ctx.restore();
    if (this.state === 'PLAYING') this._update();
  }

  // ---- TITLE SCREEN ----
  _drawTitle() {
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    // BG
    ctx.fillStyle = '#000033'; ctx.fillRect(0, 0, W, H);
    // Stars
    this.snowflakes.forEach(s => { ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r*0.5, 0, Math.PI*2); ctx.fill(); s.y+=s.s*0.4; if(s.y>H){s.y=0;s.x=Math.random()*W;} });
    // Title
    ctx.font = 'bold 46px "Comic Sans MS"';
    ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 6;
    const t1 = 'KICK THE BABY'; const w1 = ctx.measureText(t1).width;
    ctx.strokeText(t1, W/2-w1/2, 90); ctx.fillStyle = '#FFFF00'; ctx.fillText(t1, W/2-w1/2, 90);
    ctx.font = 'bold 18px "Comic Sans MS"'; ctx.strokeStyle='#000'; ctx.lineWidth=3;
    const t2 = '*** Food Target Edition ***'; const w2 = ctx.measureText(t2).width;
    ctx.strokeText(t2, W/2-w2/2, 120); ctx.fillStyle='#FF9900'; ctx.fillText(t2, W/2-w2/2, 120);
    // Characters
    this.cExpr = 'happy';
    this._drawCartman(W/2-110, 145);
    this._drawIke(W/2+50, 175, 0);
    // HS
    ctx.font='bold 15px "Comic Sans MS"'; ctx.strokeStyle='#000'; ctx.lineWidth=3;
    const hs='Meilleur score : '+this.highScore; const hw=ctx.measureText(hs).width;
    ctx.strokeText(hs,W/2-hw/2,280); ctx.fillStyle='#00FF00'; ctx.fillText(hs,W/2-hw/2,280);
    // Survival button
    const b1={x:W/2-185,y:300,w:165,h:50}; this._btnS=b1;
    ctx.fillStyle='#880000'; ctx.fillRect(b1.x,b1.y,b1.w,b1.h);
    ctx.strokeStyle='#FF4444'; ctx.lineWidth=3; ctx.strokeRect(b1.x,b1.y,b1.w,b1.h);
    ctx.fillStyle='#FFFF00'; ctx.font='bold 15px "Comic Sans MS"';
    ctx.fillText('>>> SURVIE <<<',b1.x+22,b1.y+22);
    ctx.fillStyle='#FFCCCC'; ctx.font='10px "Comic Sans MS"'; ctx.fillText('3 vies, sans limite de temps',b1.x+8,b1.y+40);
    // Chrono button
    const b2={x:W/2+20,y:300,w:165,h:50}; this._btnC=b2;
    ctx.fillStyle='#005500'; ctx.fillRect(b2.x,b2.y,b2.w,b2.h);
    ctx.strokeStyle='#00FF44'; ctx.lineWidth=3; ctx.strokeRect(b2.x,b2.y,b2.w,b2.h);
    ctx.fillStyle='#FFFF00'; ctx.font='bold 15px "Comic Sans MS"';
    ctx.fillText('>>> CHRONO <<<',b2.x+18,b2.y+22);
    ctx.fillStyle='#CCFFCC'; ctx.font='10px "Comic Sans MS"'; ctx.fillText('30 secondes, vies infinies',b2.x+12,b2.y+40);
    // Ach count
    const ua=this.achList.filter(a=>a.unlocked).length;
    ctx.fillStyle='#8888FF'; ctx.font='11px "Comic Sans MS"';
    ctx.fillText('Achievements: '+ua+'/'+this.achList.length+' - Cliquer pour jouer',W/2-100,H-12);
  }

  // ---- GAME SCREEN ----
  _drawGame() {
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    const gY = this.cY + 60;
    // Sky
    const sky = ctx.createLinearGradient(0,0,0,gY);
    sky.addColorStop(0,'#87CEEB'); sky.addColorStop(1,'#B0E0FF');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,gY);
    // Mountains
    ctx.fillStyle='#9370DB';
    [[0,gY,120,gY-90,240,gY],[150,gY,310,gY-120,470,gY],[350,gY,500,gY-80,650,gY]].forEach(pts=>{
      ctx.beginPath(); ctx.moveTo(pts[0],pts[1]); ctx.lineTo(pts[2],pts[3]); ctx.lineTo(pts[4],pts[5]); ctx.closePath(); ctx.fill();
    });
    // Snow caps on mountains
    ctx.fillStyle='#FFFFFF';
    [[120,gY-90,30],[310,gY-120,38],[500,gY-80,25]].forEach(([mx,my,r])=>{
      ctx.beginPath(); ctx.ellipse(mx,my,r,12,0,Math.PI,0); ctx.fill();
    });
    // Buildings (silhouette)
    ctx.fillStyle='#3d2e22';
    [[430,55,gY],[490,45,gY],[550,70,gY],[610,50,gY]].forEach(([x,h,g])=>{ ctx.fillRect(x,g-h,40,h); });
    // Ground
    ctx.fillStyle='#EEEEEE'; ctx.fillRect(0,gY,W,H-gY);
    ctx.fillStyle='#DDDDDD';
    for(let i=0;i<18;i++){ ctx.fillRect(i*38,gY+5,18,4); ctx.fillRect(i*38+9,gY+12,14,3); }
    // Snow
    this.snowflakes.forEach(s=>{
      ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });
    // Trajectory preview
    if (!this.ikeFlying) this._drawTrajectory();
    // Targets
    this.targets.forEach(t=>this._drawTarget(t));
    // Particles
    this.particles.forEach(p=>{ ctx.fillStyle=p.color; ctx.globalAlpha=p.life/55; ctx.fillRect(p.x-2,p.y-2,5,5); });
    ctx.globalAlpha=1;
    // Ike
    this._drawIke(this.ikeX, this.ikeY, this.ikeRot);
    // Cartman
    this._drawCartman(this.cX, this.cY);
    // Score popups
    this.popups.forEach(p=>{
      const a=Math.min(1,p.life/30);
      ctx.globalAlpha=a; ctx.font='bold 14px "Comic Sans MS"';
      ctx.strokeStyle='#000'; ctx.lineWidth=3; ctx.strokeText(p.text,p.x,p.y);
      ctx.fillStyle=p.color; ctx.fillText(p.text,p.x,p.y);
    }); ctx.globalAlpha=1;
    // HUD
    this._drawHUD();
    // Achievement notif
    if (this.achNotif) {
      const a=Math.min(1,this.achNotif.timer/50);
      ctx.globalAlpha=a;
      ctx.fillStyle='rgba(0,80,0,0.95)'; ctx.fillRect(W/2-160,H-80,320,60);
      ctx.strokeStyle='#00FF44'; ctx.lineWidth=2; ctx.strokeRect(W/2-160,H-80,320,60);
      ctx.fillStyle='#FFFF00'; ctx.font='bold 13px "Comic Sans MS"'; ctx.fillText('*** ACHIEVEMENT UNLOCKED ***',W/2-125,H-57);
      ctx.fillStyle='#FFFFFF'; ctx.font='bold 12px "Comic Sans MS"'; ctx.fillText(this.achNotif.name+' - '+this.achNotif.desc,W/2-145,H-35);
      ctx.globalAlpha=1;
    }
    // Instruction
    if (!this.ikeFlying) {
      ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(W/2-145,H-28,290,22);
      ctx.fillStyle='#FFFF00'; ctx.font='bold 13px "Comic Sans MS"';
      ctx.fillText('>>> Vise avec la souris, clique pour lancer ! <<<',W/2-138,H-12);
    }
  }

  // ---- TRAJECTORY PREVIEW ----
  _drawTrajectory() {
    const ctx = this.ctx;
    const kx = this.cX+70, ky = this.cY+30;
    const a = this.getAngle();
    const spd = (this.power/100)*16+4;
    let vx=Math.cos(a)*spd, vy=Math.sin(a)*spd, px=kx, py=ky;
    ctx.setLineDash([6,6]); ctx.strokeStyle='rgba(255,255,255,0.7)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(px,py);
    for(let i=0;i<28;i++){
      px+=vx; py+=vy; vy+=0.45;
      if(py>this.cY+60||px>this.canvas.width+60) break;
      ctx.lineTo(px,py);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  // ---- DRAW HUD ----
  _drawHUD() {
    const ctx = this.ctx, W = this.canvas.width;
    // Power bar bg
    ctx.fillStyle='#000'; ctx.fillRect(18,18,204,28);
    // Power bar fill
    const pg = ctx.createLinearGradient(20,0,220,0);
    if (this.power<30){ pg.addColorStop(0,'#FF0000'); pg.addColorStop(1,'#FF6600'); }
    else if (this.power<70){ pg.addColorStop(0,'#FFAA00'); pg.addColorStop(1,'#FFFF00'); }
    else { pg.addColorStop(0,'#00CC00'); pg.addColorStop(1,'#00FFFF'); }
    if (!this.ikeFlying) { ctx.fillStyle=pg; ctx.fillRect(20,20,this.power*2,24); }
    ctx.strokeStyle='#FFFF00'; ctx.lineWidth=2; ctx.strokeRect(20,20,200,24);
    ctx.fillStyle='#FFFF00'; ctx.font='bold 12px "Comic Sans MS"';
    ctx.strokeStyle='#000'; ctx.lineWidth=2;
    ctx.strokeText('POWER',228,37); ctx.fillText('POWER',228,37);
    // Score
    ctx.font='bold 18px "Comic Sans MS"';
    ctx.strokeText('Score: '+this.score,20,70); ctx.fillStyle='#FFF'; ctx.fillText('Score: '+this.score,20,70);
    ctx.font='bold 13px "Comic Sans MS"'; ctx.fillStyle='#AAFFAA';
    ctx.strokeText('Record: '+this.highScore,20,90); ctx.fillText('Record: '+this.highScore,20,90);
    // Combo
    if (this.comboMult>1){
      ctx.fillStyle='#FF00FF'; ctx.font='bold 20px "Comic Sans MS"';
      ctx.strokeStyle='#000'; ctx.lineWidth=3;
      ctx.strokeText('COMBO x'+this.comboMult+'!',20,120); ctx.fillText('COMBO x'+this.comboMult+'!',20,120);
    }
    // Lives (Kenny heads)
    if (this.mode==='survival') {
      for(let i=0;i<3;i++){
        const alive = i < this.lives;
        ctx.fillStyle = alive ? '#FF6600' : '#444';
        ctx.beginPath(); ctx.arc(W-30-i*32, 30, 12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = alive ? '#FFCC99' : '#666';
        ctx.beginPath(); ctx.arc(W-30-i*32, 22, 9, 0, Math.PI*2); ctx.fill();
        if (!alive) { ctx.fillStyle='#000'; ctx.font='bold 10px Arial'; ctx.fillText('X_X',W-42-i*32,26); }
      }
    }
    // Chrono timer
    if (this.mode==='chrono') {
      const col = this.timeLeft<10 ? '#FF0000' : '#FFFF00';
      ctx.fillStyle=col; ctx.font='bold 22px "Comic Sans MS"';
      ctx.strokeStyle='#000'; ctx.lineWidth=3;
      ctx.strokeText('⏱ '+this.timeLeft+'s',W-90,38); ctx.fillText('⏱ '+this.timeLeft+'s',W-90,38);
    }
    // Speech bubble
    if (this.speechTimer>0 && this.speech) {
      const bx=this.cX+50, by=this.cY-55;
      const tw=this.ctx.measureText(this.speech).width;
      ctx.fillStyle='rgba(255,255,255,0.92)'; ctx.strokeStyle='#000'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(bx,by,Math.max(tw+16,80),28,6); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#000'; ctx.font='11px "Comic Sans MS"'; ctx.fillText(this.speech,bx+8,by+18);
    }
  }

  // ---- DRAW GAME OVER ----
  _drawGameOver() {
    const ctx=this.ctx, W=this.canvas.width, H=this.canvas.height;
    ctx.fillStyle='rgba(0,0,0,0.82)'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#FF0000'; ctx.lineWidth=5;
    ctx.font='bold 44px "Comic Sans MS"'; const g='GAME OVER!'; const gw=ctx.measureText(g).width;
    ctx.strokeText(g,W/2-gw/2,H/2-70); ctx.fillStyle='#FFFF00'; ctx.fillText(g,W/2-gw/2,H/2-70);
    ctx.font='bold 22px "Comic Sans MS"'; ctx.strokeStyle='#000'; ctx.lineWidth=3;
    const s='Score : '+this.score; const sw=ctx.measureText(s).width;
    ctx.strokeText(s,W/2-sw/2,H/2-20); ctx.fillStyle='#FFFFFF'; ctx.fillText(s,W/2-sw/2,H/2-20);
    if (this.score===this.highScore&&this.score>0){
      ctx.fillStyle='#FF00FF'; ctx.font='bold 18px "Comic Sans MS"'; const nr='*** NOUVEAU RECORD ***'; const nw=ctx.measureText(nr).width;
      ctx.strokeText(nr,W/2-nw/2,H/2+15); ctx.fillText(nr,W/2-nw/2,H/2+15);
    }
    const msgs=[['Pfff, meme Ike fait mieux...',0],['Pas mal !',4],['Bon tireur !',9],['EXPERT SNIPER!',19]];
    let msg=msgs[0][0]; for(const[m,min] of msgs) if(this.score>=min) msg=m;
    ctx.fillStyle='#FF9900'; ctx.font='bold 15px "Comic Sans MS"'; const mw=ctx.measureText(msg).width;
    ctx.strokeText(msg,W/2-mw/2,H/2+45); ctx.fillText(msg,W/2-mw/2,H/2+45);
    ctx.fillStyle='#00FF00'; ctx.font='bold 15px "Comic Sans MS"'; const re='>>> Clique pour rejouer <<<'; const rw=ctx.measureText(re).width;
    ctx.strokeText(re,W/2-rw/2,H/2+80); ctx.fillText(re,W/2-rw/2,H/2+80);
  }

  // ---- DRAW CARTMAN ----
  _drawCartman(x, y) {
    const ctx=this.ctx;
    // Body (red jacket)
    ctx.fillStyle='#CC2200'; ctx.fillRect(x,y,50,55);
    // Belt
    ctx.fillStyle='#333'; ctx.fillRect(x,y+40,50,8);
    ctx.fillStyle='#FFD700'; ctx.fillRect(x+20,y+40,10,8);
    // Pants
    ctx.fillStyle='#333'; ctx.fillRect(x+3,y+48,18,12); ctx.fillRect(x+29,y+48,18,12);
    // Head
    ctx.fillStyle='#FFD5A0'; ctx.beginPath(); ctx.ellipse(x+25,y-12,20,18,0,0,Math.PI*2); ctx.fill();
    // Hat blue
    ctx.fillStyle='#0055CC'; ctx.fillRect(x+5,y-28,40,18);
    // Hat stripe yellow
    ctx.fillStyle='#FFD700'; ctx.fillRect(x+5,y-30,40,4);
    // Hat top
    ctx.fillStyle='#0055CC'; ctx.fillRect(x+12,y-38,26,12);
    // Pompom
    ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(x+25,y-40,5,0,Math.PI*2); ctx.fill();
    // Eyes
    ctx.fillStyle='#000';
    if (this.cExpr==='evil'){
      ctx.beginPath(); ctx.moveTo(x+13,y-18); ctx.lineTo(x+18,y-12); ctx.lineTo(x+13,y-12); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x+37,y-18); ctx.lineTo(x+32,y-12); ctx.lineTo(x+37,y-12); ctx.fill();
    } else if(this.cExpr==='sad'){
      ctx.fillRect(x+14,y-12,4,4); ctx.fillRect(x+32,y-12,4,4);
      ctx.beginPath(); ctx.arc(x+25,y-4,7,Math.PI+0.3,Math.PI*2-0.3); ctx.stroke();
    } else {
      ctx.fillRect(x+14,y-14,4,5); ctx.fillRect(x+32,y-14,4,5);
    }
    // Mouth
    ctx.strokeStyle='#000'; ctx.lineWidth=2;
    ctx.beginPath();
    if(this.cExpr==='evil'||this.cExpr==='happy') ctx.arc(x+25,y-3,9,0.2,Math.PI-0.2);
    else ctx.arc(x+25,y,7,Math.PI+0.2,Math.PI*2-0.2);
    ctx.stroke();
    // Cheeks
    ctx.fillStyle='rgba(255,150,120,0.35)'; ctx.beginPath(); ctx.ellipse(x+12,y-6,7,4,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+38,y-6,7,4,0,0,Math.PI*2); ctx.fill();
    // Name label
    ctx.fillStyle='#FFFF00'; ctx.font='bold 9px "Comic Sans MS"'; ctx.fillText('CARTMAN',x-2,y-46);
  }

  // ---- DRAW IKE ----
  _drawIke(x, y, rot) {
    const ctx=this.ctx;
    ctx.save(); ctx.translate(x+12,y+12); ctx.rotate(rot);
    // Body green
    ctx.fillStyle='#228822'; ctx.fillRect(-10,-10,22,22);
    // Head
    ctx.fillStyle='#FFD5A0'; ctx.beginPath(); ctx.arc(0,-16,9,0,Math.PI*2); ctx.fill();
    // Hat orange
    ctx.fillStyle='#FF7700'; ctx.fillRect(-7,-24,14,10);
    // Eyes
    ctx.fillStyle='#000'; ctx.fillRect(-5,-18,3,3); ctx.fillRect(2,-18,3,3);
    // Smile
    ctx.beginPath(); ctx.arc(0,-13,4,0.2,Math.PI-0.2); ctx.stroke();
    ctx.restore();
    if (!this.ikeFlying) { ctx.fillStyle='#FFFF00'; ctx.font='bold 9px "Comic Sans MS"'; ctx.fillText('IKE',x+3,y-4); }
  }

  // ---- DRAW TARGET ----
  _drawTarget(t) {
    const ctx=this.ctx;
    const tx=t.x, ty=t.y+Math.sin(t.bob)*4;
    if (t.hit) {
      ctx.globalAlpha=Math.max(0,t.hitTimer/25);
    }
    // Concentric rings
    ctx.strokeStyle='rgba(255,0,0,0.5)'; ctx.lineWidth=1.5;
    for(let i=1;i<=3;i++){ ctx.beginPath(); ctx.arc(tx,ty,t.size+i*7,0,Math.PI*2); ctx.stroke(); }
    // Food shape
    ctx.fillStyle=t.color;
    if(t.type==='donut'){
      ctx.beginPath(); ctx.arc(tx,ty,t.size,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFF'; ctx.beginPath(); ctx.arc(tx,ty,t.size*0.38,0,Math.PI*2); ctx.fill();
      // Sprinkles
      ctx.fillStyle='#FF00FF'; for(let i=0;i<5;i++){ const a=i*1.26; ctx.fillRect(tx+Math.cos(a)*t.size*0.6,ty+Math.sin(a)*t.size*0.6,3,2); }
    } else if(t.type==='pizza'){
      ctx.beginPath(); ctx.moveTo(tx,ty-t.size); ctx.lineTo(tx-t.size*0.85,ty+t.size*0.6); ctx.lineTo(tx+t.size*0.85,ty+t.size*0.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#8B0000'; ctx.beginPath(); ctx.arc(tx-t.size*0.3,ty+t.size*0.1,t.size*0.16,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(tx+t.size*0.2,ty+t.size*0.3,t.size*0.14,0,Math.PI*2); ctx.fill();
    } else if(t.type==='burger'){
      ctx.fillStyle='#C68642'; ctx.beginPath(); ctx.ellipse(tx,ty-t.size*0.3,t.size,t.size*0.4,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#8B4513'; ctx.fillRect(tx-t.size,ty-t.size*0.1,t.size*2,t.size*0.35);
      ctx.fillStyle='#228B22'; ctx.fillRect(tx-t.size*0.85,ty+t.size*0.15,t.size*1.7,t.size*0.2);
      ctx.fillStyle='#C68642'; ctx.beginPath(); ctx.ellipse(tx,ty+t.size*0.4,t.size,t.size*0.4,0,0,Math.PI*2); ctx.fill();
    } else if(t.type==='kenny'){
      // Kenny face (orange parka)
      ctx.fillStyle='#FF6600'; ctx.beginPath(); ctx.ellipse(tx,ty,t.size*0.9,t.size,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFCC99'; ctx.beginPath(); ctx.arc(tx,ty-t.size*0.1,t.size*0.38,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#000'; ctx.font='bold '+Math.max(8,t.size*0.5)+'px Arial'; ctx.fillText('[X_X]',tx-t.size*0.7,ty+t.size*0.2);
    } else if(t.type==='chef'){
      ctx.fillStyle='#4a2200'; ctx.beginPath(); ctx.ellipse(tx,ty,t.size*0.7,t.size,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFCC99'; ctx.beginPath(); ctx.arc(tx,ty-t.size*0.4,t.size*0.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFF'; ctx.fillRect(tx-t.size*0.3,ty-t.size*1.2,t.size*0.6,t.size*0.7);
      ctx.fillStyle='#FF9900'; ctx.font='bold 8px Arial'; ctx.fillText('CHEF',tx-t.size*0.6,ty+t.size*0.8);
    } else {
      // KFC / cheesy = blob
      ctx.beginPath(); ctx.ellipse(tx,ty,t.size*0.75,t.size*0.9,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,200,0,0.5)'; ctx.beginPath(); ctx.ellipse(tx-t.size*0.2,ty-t.size*0.2,t.size*0.3,t.size*0.2,0,0,Math.PI*2); ctx.fill();
    }
    // Label
    ctx.globalAlpha=t.hit?Math.max(0,t.hitTimer/25):1;
    ctx.fillStyle='#FFF'; ctx.strokeStyle='#000'; ctx.lineWidth=2; ctx.font='bold 10px "Comic Sans MS"';
    const lw=ctx.measureText(t.label).width;
    ctx.strokeText(t.label,tx-lw/2,ty+t.size+16); ctx.fillText(t.label,tx-lw/2,ty+t.size+16);
    ctx.globalAlpha=1;
  }
}

// ---- GLOBAL ----
let kickBabyGame = null;
function openKickBabyGame() {
  const modal = document.getElementById('minigame-modal');
  if (modal) {
    modal.style.display = 'flex';
    if (!kickBabyGame) kickBabyGame = new KickTheBabyGame();
    kickBabyGame.init();
  }
}
function closeMinigame() {
  const modal = document.getElementById('minigame-modal');
  if (modal) modal.style.display = 'none';
  if (kickBabyGame) kickBabyGame.state = 'TITLE';
}
