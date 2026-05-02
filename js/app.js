// ============================================
// SOUTH PARK ELEMENTARY - Main Application JS
// VERSION CORRIGEE - Toutes les corrections appliquees
// ============================================

// ---- SNOWFLAKES EFFECT ----
let snowflakes = [];

function initSnowflakes() {
  const container = document.body;
  for (let i = 0; i < 50; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '*';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.top = Math.random() * 100 + '%';
    snowflake.style.opacity = Math.random() * 0.5 + 0.3;
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    snowflake.style.animation = `snowfall ${Math.random() * 10 + 10}s linear infinite`;
    snowflake.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(snowflake);
    snowflakes.push({
      element: snowflake,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
}

// ---- DATA STORE ----
let students = [];
let teachers = [];
let infractions = [];
let menu = {};
let calendar = {};
let quotes = [];
let news = [];
let visitorCount = 0;
let allQuotesVisible = false;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', async () => {
  showIEPopup(); // Afficher le popup IMMÉDIATEMENT (style année 2000 !)
  initSnowflakes(); // Initialiser la neige
  initStars();
  updateClock();
  setInterval(updateClock, 1000);
  
  // Charger les données en arrière-plan
  await loadAllData();
  await initVisitorCounter();
  showPage('home');
  initKennyToggle();
});

// ---- LOAD DATA ----
async function loadAllData() {
  try {
    const [s, t, i, m, c, q, n] = await Promise.all([
      fetch('data/students.json').then(r => r.json()),
      fetch('data/teachers.json').then(r => r.json()),
      fetch('data/cartman-infractions.json').then(r => r.json()),
      fetch('data/menu.json').then(r => r.json()),
      fetch('data/calendar.json').then(r => r.json()),
      fetch('data/cartman-quotes.json').then(r => r.json()),
      fetch('data/news.json').then(r => r.json()),
    ]);
    students = s;
    teachers = t;
    infractions = i;
    menu = m;
    calendar = c;
    quotes = q;
    news = n.news || [];
    renderNews(); // Afficher les actualités
  } catch (e) {
    console.error('Error loading data:', e);
  }
}

// ---- NAVIGATION ----
function showPage(pageId) {
  // Son de changement de page
  if (window.audioSystem) {
    window.audioSystem.playPageChangeSound();
  }
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) {
    page.classList.add('active');
    renderPage(pageId);
  }

  const navLink = document.querySelector(`.main-nav a[data-page="${pageId}"]`);
  if (navLink) navLink.classList.add('active');

  window.scrollTo(0, 0);
}

function renderPage(pageId) {
  switch(pageId) {
    case 'home': renderHome(); break;
    case 'students': renderStudents(); break;
    case 'teachers': renderTeachers(); break;
    case 'cartman': renderCartman(); break;
    case 'menu': renderMenu(); break;
    case 'calendar': renderCalendar(); break;
    case 'quotes': renderQuotes(); break;
    case 'guestbook': renderGuestbook(); break;
  }
}

// ---- HOME PAGE ----
function renderHome() {
  const kennyStatus = document.getElementById('kenny-status-home');
  if (kennyStatus) {
    const kenny = students.find(s => s.name === 'Kenny McCormick');
    if (kenny) {
      kennyStatus.textContent = kenny.status === 'mort' ? '[X_X] MORT' : '[OK] EN VIE';
      kennyStatus.className = kenny.status === 'mort' ? 'blink glow-red' : 'glow-green';
    }
  }
}

// ---- HELPER: Generate Avatar ----
function getAvatar(name, size = 80) {
  const colors = [
    ['#ff6600', '#cc0000'],
    ['#0066ff', '#003399'],
    ['#00cc00', '#006600'],
    ['#ff00ff', '#990099'],
    ['#ffcc00', '#ff6600'],
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const [color1, color2] = colors[colorIndex];
  const initial = name.charAt(0);
  
  return `<div style="width:${size}px;height:${size}px;background:linear-gradient(135deg, ${color1}, ${color2});border:3px solid #ffff00;display:flex;align-items:center;justify-content:center;font-size:${size/2}px;font-weight:bold;color:#fff;margin:0 auto;font-family:Impact;text-shadow:2px 2px 4px #000;">${initial}</div>`;
}

// ---- STUDENTS PAGE ----
function renderStudents() {
  const grid = document.getElementById('students-grid');
  if (!grid || students.length === 0) return;

  grid.innerHTML = students.map(s => `
    <div class="student-card" onclick="showStudentModal(${s.id})">
      ${s.infractions > 5 ? `<span class="infraction-badge">/!\\ ${s.infractions}</span>` : ''}
      <img src="${s.photo}" alt="${s.name}" style="width:80px;height:80px;object-fit:contain;margin:0 auto;display:block;" onerror="this.outerHTML='${getAvatar(s.name, 80)}'">
      <div class="student-name">${s.name}</div>
      <div class="student-grade">${s.grade}</div>
      <div>
        <span class="status-badge status-${s.status}">${s.status === 'mort' ? '[X_X] MORT' : '[OK] VIVANT'}</span>
      </div>
    </div>
  `).join('');
}

function showStudentModal(id) {
  // Son de clic
  if (window.audioSystem) {
    window.audioSystem.playClickSound();
  }
  
  const s = students.find(st => st.id === id);
  if (!s) return;

  const modal = document.getElementById('student-modal');
  const content = document.getElementById('student-modal-content');

  content.innerHTML = `
    <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
      <div style="text-align:center; flex-shrink:0;">
        <img src="${s.photo}" alt="${s.name}" style="width:120px;height:120px;object-fit:contain;border:3px solid #ffff00;background:#000;display:block;" onerror="this.outerHTML='${getAvatar(s.name, 120)}'">
        <div style="margin-top:8px;">
          <span class="status-badge status-${s.status}">${s.status === 'mort' ? '[X_X] MORT' : '[OK] VIVANT'}</span>
        </div>
        ${s.name === 'Kenny McCormick' ? `
          <div style="margin-top:10px;">
            <label class="kenny-toggle" style="cursor:pointer;">
              <span style="font-size:11px;color:#ff9999;">Statut Kenny :</span>
              <label class="toggle-switch">
                <input type="checkbox" id="kenny-toggle-modal" ${s.status === 'vivant' ? 'checked' : ''} onchange="toggleKenny(this)">
                <span class="toggle-slider"></span>
              </label>
            </label>
          </div>
        ` : ''}
      </div>
      <div style="flex:1; min-width:200px;">
        <h2 style="color:#ffff00; font-size:18px; margin-bottom:5px;">${s.name}</h2>
        <div style="color:#aaaaff; font-size:12px; margin-bottom:10px;">${s.grade} • ${s.age} ans • Surnom: "${s.nickname}"</div>
        <div style="font-size:12px; color:#cccccc; margin-bottom:10px;">${s.description}</div>
        <div style="background:rgba(255,0,0,0.1); border:1px solid #ff0000; padding:8px; margin-bottom:10px;">
          <span style="color:#ff9999; font-size:11px;">/!\\ Infractions au reglement : </span>
          <span style="color:#ff3333; font-weight:bold; font-size:16px;">${s.infractions}</span>
        </div>
        <div style="background:rgba(0,0,0,0.5); border-left:3px solid #ffff00; padding:8px; margin-bottom:10px;">
          <span style="color:#ffff99; font-style:italic; font-size:13px;">"${s.quote}"</span>
        </div>
        <div style="font-size:11px; color:#aaaaaa;">
          <strong style="color:#ffff00;">Centres d'interet :</strong><br>
          ${s.hobbies.map(h => `<span style="background:#000044;border:1px solid #0044cc;padding:2px 6px;margin:2px;display:inline-block;">${h}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeStudentModal() {
  document.getElementById('student-modal').style.display = 'none';
}

// ---- TEACHERS PAGE ----
function renderTeachers() {
  const grid = document.getElementById('teachers-grid');
  if (!grid || teachers.length === 0) return;

  grid.innerHTML = teachers.map(t => `
    <div class="teacher-card" onclick="showTeacherModal(${t.id})">
      <img src="${t.photo}" alt="${t.name}" class="teacher-img" onerror="this.outerHTML='${getAvatar(t.name, 90)}'">
      <div class="teacher-name">${t.name}</div>
      <div class="teacher-role">${t.role}</div>
    </div>
  `).join('');
}

function showTeacherModal(id) {
  // Son de clic
  if (window.audioSystem) {
    window.audioSystem.playClickSound();
  }
  
  const t = teachers.find(teacher => teacher.id === id);
  if (!t) return;

  const modal = document.getElementById('teacher-modal');
  const content = document.getElementById('teacher-modal-content');

  content.innerHTML = `
    <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
      <div style="text-align:center; flex-shrink:0;">
        <img src="${t.photo}" alt="${t.name}" style="width:120px;height:120px;object-fit:contain;border:3px solid #00ff00;background:#000;display:block;padding:5px;" onerror="this.outerHTML='${getAvatar(t.name, 120)}'">
        <div class="star-rating" style="margin-top:10px; font-size:20px;">${renderStars(t.rating)}</div>
      </div>
      <div style="flex:1; min-width:200px;">
        <h2 style="color:#00ff00; font-size:18px; margin-bottom:5px;">${t.name}</h2>
        <div style="color:#88ff88; font-size:12px; margin-bottom:10px; font-style:italic;">${t.role}</div>
        <div style="font-size:12px; color:#cccccc; margin-bottom:10px;">${t.description}</div>
        <div style="background:rgba(0,255,0,0.1); border:1px solid #00aa00; padding:8px; margin-bottom:10px;">
          <span style="color:#88ff88; font-size:11px;">*** Matiere : </span>
          <span style="color:#00ff00; font-weight:bold;">${t.subject}</span>
          <br>
          <span style="color:#88ff88; font-size:11px;">*** Anciennete : </span>
          <span style="color:#00ff00; font-weight:bold;">${t.yearsAtSchool} ans a l'ecole</span>
        </div>
        <div style="background:rgba(0,0,0,0.5); border-left:3px solid #00ff00; padding:8px; margin-bottom:10px;">
          <span style="color:#ccffcc; font-style:italic; font-size:13px;">"${t.quote}"</span>
        </div>
        <div style="font-size:11px; color:#66ff66; font-style:italic; background:rgba(0,0,0,0.3); padding:8px; border:1px dashed #00aa00;">
          *** Fun Fact : ${t.funFact}
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeTeacherModal() {
  document.getElementById('teacher-modal').style.display = 'none';
}

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '<span class="empty">★</span>';
  }
  return stars;
}

// ---- CARTMAN PAGE ----
function renderCartman() {
  const tbody = document.getElementById('infractions-tbody');
  if (!tbody || infractions.length === 0) return;

  const counter = document.getElementById('infraction-counter');
  if (counter) counter.textContent = infractions.length;

  tbody.innerHTML = infractions.map(inf => `
    <tr>
      <td style="color:#aaaaff; white-space:nowrap;">${inf.date}</td>
      <td style="color:#ffcc00;">${inf.rule}</td>
      <td style="color:#cccccc;">${inf.description}</td>
      <td class="severity-${inf.severity}">${inf.severity.toUpperCase()}</td>
      <td style="color:#ff9999;">${inf.punishment}</td>
      <td class="cartman-reaction">"${inf.cartmanReaction}"</td>
    </tr>
  `).join('');
}

// ---- MENU PAGE ----
function renderMenu() {
  const container = document.getElementById('menu-container');
  if (!container || !menu.days) return;

  const chefMsg = document.getElementById('chef-message');
  if (chefMsg) chefMsg.textContent = menu.chefMessage;

  const weekLabel = document.getElementById('menu-week');
  if (weekLabel) weekLabel.textContent = menu.week;

  container.innerHTML = menu.days.map(day => `
    <div class="event-card" style="border-color:#996600;">
      <div style="font-size:20px; text-align:center; margin-bottom:8px;">${day.emoji}</div>
      <div style="font-weight:bold; color:#ffcc00; font-size:14px; text-align:center; margin-bottom:8px;">${day.day} ${day.date}</div>
      <div style="font-size:11px; margin-bottom:4px;"><span style="color:#ff9900;">>>> Entree :</span> <span style="color:#ffeecc;">${day.starter}</span></div>
      <div style="font-size:11px; margin-bottom:4px;"><span style="color:#ff6600;">>>> Plat :</span> <span style="color:#ffeecc;">${day.main}</span></div>
      <div style="font-size:11px; margin-bottom:8px;"><span style="color:#ff3300;">>>> Dessert :</span> <span style="color:#ffeecc;">${day.dessert}</span></div>
      <div style="font-size:10px; color:#ffcc66; font-style:italic; border-top:1px dashed #996600; padding-top:6px;">
        ~~~ Chanson de Chef : "${day.chefSong}"
      </div>
      <div class="star-rating" style="text-align:center; margin-top:6px;">${renderStars(day.rating)}</div>
    </div>
  `).join('');
}

// ---- CALENDAR PAGE ----
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid || !calendar.events) return;

  grid.innerHTML = calendar.events.map(ev => `
    <div class="event-card event-type-${ev.type}">
      <div style="font-size:20px; text-align:center; margin-bottom:6px;">${ev.icon}</div>
      <div class="event-date">>> ${ev.date}</div>
      <div class="event-title">${ev.title}</div>
      <div class="event-desc">${ev.description}</div>
      <div style="margin-top:6px;">
        <span style="font-size:9px; padding:2px 6px; border-radius:10px; background:rgba(255,255,255,0.1); color:#aaaaff;">${ev.type.toUpperCase()}</span>
      </div>
    </div>
  `).join('');

  // Schedule
  const scheduleBody = document.getElementById('schedule-tbody');
  if (scheduleBody && calendar.schedule && calendar.schedule.monday) {
    scheduleBody.innerHTML = calendar.schedule.monday.map(item => `
      <tr>
        <td style="color:#00ffff; font-weight:bold; white-space:nowrap;">${item.time}</td>
        <td style="color:#ffff99;">${item.subject}</td>
        <td style="color:#88ff88;">${item.teacher}</td>
      </tr>
    `).join('');
  }
}

// ---- QUOTES PAGE ----
function renderQuotes() {
  showRandomQuote();
}

function showRandomQuote() {
  // Son de clic
  if (window.audioSystem) {
    window.audioSystem.playClickSound();
  }
  
  if (quotes.length === 0) return;
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const el = document.getElementById('random-quote');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = '"' + q + '"';
      el.style.opacity = '1';
    }, 300);
  }
}

function renderAllQuotes() {
  const container = document.getElementById('all-quotes');
  const btn = document.querySelector('button[onclick="renderAllQuotes()"]');
  if (!container) return;
  
  allQuotesVisible = !allQuotesVisible;
  
  if (allQuotesVisible) {
    container.innerHTML = quotes.map((q, i) => `
      <div style="background:rgba(255,0,0,0.05); border:1px solid #330000; padding:10px; margin-bottom:6px; display:flex; gap:10px; align-items:center;">
        <span style="color:#ff6600; font-size:18px; flex-shrink:0;">${i + 1}.</span>
        <span style="color:#ffff99; font-style:italic; font-size:13px;">"${q}"</span>
      </div>
    `).join('');
    if (btn) btn.textContent = '[-] Masquer les citations';
  } else {
    container.innerHTML = '';
    if (btn) btn.textContent = '[+] Afficher toutes les citations';
  }
}

// ---- GUESTBOOK ----
function renderGuestbook() {
  const defaultEntries = [
    { author: "Eric Cartman", date: "12/03/2001", message: "Ce site est nul. Comme Kyle. Respect my authoritah!" },
    { author: "Kyle Broflovski", date: "12/03/2001", message: "Super site ! Mais Cartman devrait etre banni de l'ecole." },
    { author: "Stan Marsh", date: "13/03/2001", message: "Cool site. Wendy dit bonjour." },
    { author: "Butters Stotch", date: "14/03/2001", message: "Oh hamburgers ! C'est vraiment bien ce site !" },
    { author: "Mr. Mackey", date: "15/03/2001", message: "Ce site est educatif, mmkay ? Les drogues c'est mal, mmkay ?" },
    { author: "Chef", date: "16/03/2001", message: "Hello there children! Great website! Now who wants some Chocolate Salty Balls?" },
    { author: "Kenny McCormick", date: "17/03/2001", message: "Mmmph mmph mmmph mmmph!" },
    { author: "Tweek Tweak", date: "18/03/2001", message: "GAH! Too much pressure! But nice site! GAH!" },
  ];

  const saved = JSON.parse(localStorage.getItem('sp-guestbook') || '[]');
  const allEntries = [...defaultEntries, ...saved];

  const container = document.getElementById('guestbook-entries');
  if (!container) return;

  container.innerHTML = allEntries.reverse().map(e => `
    <div class="guestbook-entry">
      <span class="entry-author">>> ${e.author}</span>
      <span class="entry-date">${e.date}</span>
      <div class="entry-message">${e.message}</div>
    </div>
  `).join('');
}

function submitGuestbook(e) {
  e.preventDefault();
  const name = document.getElementById('gb-name').value.trim();
  const message = document.getElementById('gb-message').value.trim();
  if (!name || !message) return;

  const saved = JSON.parse(localStorage.getItem('sp-guestbook') || '[]');
  const today = new Date();
  const date = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
  saved.push({ author: name, date, message });
  localStorage.setItem('sp-guestbook', JSON.stringify(saved));

  document.getElementById('gb-name').value = '';
  document.getElementById('gb-message').value = '';
  renderGuestbook();

  // Show confirmation
  const confirm = document.getElementById('gb-confirm');
  if (confirm) {
    confirm.style.display = 'block';
    setTimeout(() => confirm.style.display = 'none', 3000);
  }
}

// ---- VISITOR COUNTER ----
async function initVisitorCounter() {
  // Compteur local (l'API countapi.xyz est morte depuis 2022)
  let count = parseInt(localStorage.getItem('sp-visitors') || '1337');
  count++;
  localStorage.setItem('sp-visitors', count);
  visitorCount = count;

  const el = document.getElementById('visitor-count');
  if (el) el.textContent = String(visitorCount).padStart(7, '0');
}

// ---- CLOCK ----
function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('fr-FR');
}

// ---- IE POPUP ----
function showIEPopup() {
  const popup = document.getElementById('ie-popup');
  if (popup) popup.style.display = 'block';
}

function closeIEPopup() {
  const popup = document.getElementById('ie-popup');
  if (popup) popup.style.display = 'none';
}

// ---- KENNY TOGGLE ----
function initKennyToggle() {
  const toggle = document.getElementById('kenny-main-toggle');
  if (!toggle) return;
  const kenny = students.find(s => s.name === 'Kenny McCormick');
  if (kenny) toggle.checked = kenny.status === 'vivant';
}

function toggleKenny(checkbox) {
  // Son de toggle Kenny
  if (window.audioSystem) {
    window.audioSystem.playKennyToggleSound();
  }
  
  const kenny = students.find(s => s.name === 'Kenny McCormick');
  if (!kenny) return;
  kenny.status = checkbox.checked ? 'vivant' : 'mort';

  // Update all Kenny status displays
  document.querySelectorAll('.kenny-status-display').forEach(el => {
    el.textContent = kenny.status === 'mort' ? '[X_X] MORT' : '[OK] EN VIE';
    el.className = 'kenny-status-display ' + (kenny.status === 'mort' ? 'blink glow-red' : 'glow-green');
  });
  
  // Update ticker
  const ticker = document.getElementById('kenny-status-ticker');
  if (ticker) ticker.textContent = kenny.status;
  
  // Update home page status
  const homeStatus = document.getElementById('kenny-status-home');
  if (homeStatus) {
    homeStatus.textContent = kenny.status === 'mort' ? '[X_X] MORT' : '[OK] EN VIE';
    homeStatus.className = kenny.status === 'mort' ? 'blink glow-red' : 'glow-green';
  }
  
  // Update all toggles
  document.querySelectorAll('#kenny-main-toggle, #kenny-toggle-modal').forEach(toggle => {
    toggle.checked = kenny.status === 'vivant';
  });
  
  // Update student cards if on students page
  const studentsGrid = document.getElementById('students-grid');
  if (studentsGrid && studentsGrid.innerHTML) {
    renderStudents();
  }
  
  // Update modal if open
  const modal = document.getElementById('student-modal');
  if (modal && modal.style.display !== 'none') {
    const modalStatus = modal.querySelector('.status-badge');
    if (modalStatus) {
      modalStatus.textContent = kenny.status === 'mort' ? '[X_X] MORT' : '[OK] VIVANT';
      modalStatus.className = 'status-badge status-' + kenny.status;
    }
  }

  // Show message
  const msg = kenny.status === 'mort'
    ? '[X_X] Oh my God! They killed Kenny! You bastards!'
    : '[OK] Kenny est mysterieusement revenu a la vie...';
  showToast(msg, kenny.status === 'mort' ? '#ff0000' : '#00ff00');
}

// ---- TOAST NOTIFICATION ----
function showToast(message, color = '#ffff00') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
    background: #000000; border: 2px solid ${color}; color: ${color};
    padding: 12px 20px; font-family: 'Comic Sans MS', cursive; font-size: 13px;
    font-weight: bold; max-width: 300px; box-shadow: 0 0 20px ${color};
    animation: fadeInOut 3s forwards;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---- STARS BACKGROUND ----
function initStars() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({length: 150}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random()
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.opacity += (Math.random() - 0.5) * 0.05;
      s.opacity = Math.max(0.1, Math.min(1, s.opacity));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ---- SEARCH STUDENTS ----
function searchStudents(query) {
  const q = query.toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.nickname.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q)
  );
  const grid = document.getElementById('students-grid');
  if (!grid) return;
  grid.innerHTML = filtered.map(s => `
    <div class="student-card" onclick="showStudentModal(${s.id})">
      ${s.infractions > 5 ? `<span class="infraction-badge">/!\\ ${s.infractions}</span>` : ''}
      <img src="${s.photo}" alt="${s.name}" style="width:80px;height:80px;object-fit:contain;margin:0 auto;display:block;" onerror="this.outerHTML='${getAvatar(s.name, 80)}'">
      <div class="student-name">${s.name}</div>
      <div class="student-grade">${s.grade}</div>
      <div><span class="status-badge status-${s.status}">${s.status === 'mort' ? '[X_X] MORT' : '[OK] VIVANT'}</span></div>
    </div>
  `).join('');
}

// CSS animation for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(20px); }
    15% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);
// ---- NEWS RENDERING ----
function renderNews() {
  const container = document.getElementById('news-container');
  if (!container || !news || news.length === 0) return;

  container.innerHTML = news.map(n => `
    <div class="news-item" style="background:linear-gradient(135deg, #001100, #003300); border:2px solid #00ff00; padding:15px; border-radius:5px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div style="font-size:14px; font-weight:bold; color:#ffff00;">
          ${n.icon} ${n.category}
        </div>
        <div style="font-size:11px; color:#aaaaaa;">
          ${n.date}
        </div>
      </div>
      <div style="font-size:16px; font-weight:bold; color:#00ff00; margin-bottom:8px;">
        ${n.title}
      </div>
      <div style="font-size:13px; color:#cccccc; line-height:1.6;">
        ${n.content}
      </div>
    </div>
  `).join('');
}
