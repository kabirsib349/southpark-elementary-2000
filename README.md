# South Park Elementary - Site Officiel

![South Park](https://img.shields.io/badge/South%20Park-Elementary-yellow?style=for-the-badge)
![Year 2000](https://img.shields.io/badge/Year-2000-ff00ff?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML-CSS-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=for-the-badge)

> Site internet officiel de South Park Elementary
> Projet hackathon - Theme : Site Annee 2000

**SITE EN LIGNE :** https://southparkelementary.netlify.app

---

## Le Concept

Un portail scolaire officiel de South Park Elementary, comme si il avait ete cree en l'an 2000.
Authentique style Geocities : Comic Sans MS, fond sombre, effets neon, animations pixel-art.

### Fonctionnalites Principales

- Page d'accueil avec message de bienvenue de Principal Victoria
- Trombinoscope des eleves (8 personnages avec modal detaille)
- Equipe pedagogique (5 professeurs avec notes et fun facts)
- Dossier disciplinaire de Cartman (tableau complet des infractions)
- Menu de la cafeteria avec chansons de Chef
- Calendrier scolaire et emploi du temps
- Generateur de citations de Cartman
- Page Actualites de l'ecole
- Livre d'or interactif (sauvegarde LocalStorage)
- Toggle Kenny : Mort / Vivant (avec son et toast)
- Widgets sidebar : Meteo, horloge en direct, compteur de visiteurs

### Features Avancees

#### 1. MINI-JEU : Kick the Baby - Food Target
- **Gameplay** : Vise la nourriture avec Ike !
- **Objectif** : Toucher le maximum de cibles consecutives
- **Mecaniques** :
  - 5 types de nourriture (KFC, Donut, Cheesy Poofs, Burger, Pizza)
  - Difficulte progressive (cible plus petite/haute)
  - Zone de visee avec cercles rouges
  - Game Over seulement si tu rates
  - High Score = nombre de hits consecutifs
- **Achievements** : 6 achievements deblocables
- **Animations** : Particules, sons, expressions de Cartman

#### 2. SYSTEME AUDIO
- **Musique de fond** : Vrai theme South Park (fichier MP3 local, boucle infinie)
- **Sons d'interface** : Navigation, boutons, Kenny toggle (8-bit via Web Audio API)
- **Sons du mini-jeu** : Kick, impact, power-up, achievement
- **Controles** :
  - Toggle Musique ON/OFF
  - Toggle Sons ON/OFF
  - Slider de volume (0-100%)
  - Sauvegarde automatique des preferences (LocalStorage)
- **Note** : La musique demarre au premier clic (politique autoplay navigateurs modernes)

#### 3. ANIMATIONS PIXEL-ART (style GIFs Geocities)
- **Flammes pixel-art** : Dans le header, de chaque cote du titre (blocs CSS animes)
- **Under Construction** : Sidebar avec bandes jaune/noir qui defilent + bonhomme qui creuse
- **Badge NEW!** : Rouge/jaune clignotant sur les actualites
- **Etoile tournante** : `.gif-star` utilisable partout
- **Balle rebondissante** : `.gif-ball` utilisable partout

#### 4. INTERACTIONS STYLE WINDOWS 98
- **[mail] Nous contacter** : Popup Hotmail authentique avec champs De/A/Objet, animation de secousse si formulaire vide
- **[dl] Telecharger Winamp** : Fausse boite de telechargement avec barre de progression 56k (vitesse variable), s'arrete a 73% avec message d'erreur signe Cartman
- **[++] Booster le compteur** : Incremente le compteur de visiteurs avec animation de comptage style Geocities

#### 5. POPUP IE & ELEMENTS RETRO
- Popup Internet Explorer 6 au chargement
- Marquee ticker avec statut Kenny en temps reel
- Curseur personnalise etoile
- Scrollbar stylisee en violet/cyan
- Fond etoile animee (canvas)
- Neige qui tombe

---

## Installation & Lancement

### Prerequis

Aucun ! C'est du HTML/CSS/JS pur. Pas de build, pas de dependances.

### Lancer en local

1. Clone le repo :
```bash
git clone https://github.com/kabirsib349/southpark-elementary-2000.git
cd southpark-elementary-2000
```

2. Ajoute le fichier audio (non inclus pour raisons de droits) :
   - Telecharge le theme South Park en MP3
   - Place-le dans `audio/southpark-theme.mp3`

3. Lance un serveur local :
```bash
# Node.js (avec http-server)
npx http-server -p 8000 -o --cors
```
Puis va sur `http://localhost:8000`

**Note** : Un serveur local est necessaire pour charger les fichiers JSON (politique CORS).
Le fichier `audio/southpark-theme.mp3` n'est pas inclus dans le repo (droits d'auteur).

---

## Structure du Projet

```
southpark-elementary-2000/
├── index.html                 # Page principale
├── audio/
│   └── southpark-theme.mp3    # Theme South Park (a ajouter manuellement)
├── css/
│   └── style.css              # Styles + animations pixel-art
├── js/
│   ├── app.js                 # Application JavaScript principale
│   ├── minigame-kick-baby.js  # Mini-jeu Kick the Baby
│   └── audio-system.js        # Systeme audio (HTML5 Audio + Web Audio API)
├── data/
│   ├── students.json          # Donnees des eleves
│   ├── teachers.json          # Donnees des professeurs
│   ├── cartman-infractions.json
│   ├── menu.json
│   ├── calendar.json
│   ├── news.json
│   └── cartman-quotes.json
├── images/
│   ├── students/              # Photos des eleves
│   └── teachers/              # Photos des professeurs
└── README.md
```

---

## Technologies

- **HTML5** : Structure semantique
- **CSS3** : Animations keyframes, gradients, pixel-art GIF effects
- **JavaScript Vanilla** : Pas de framework, que du pur JS
- **Canvas API** : Mini-jeu et etoiles animees en fond
- **HTML5 Audio API** : Musique de fond (MP3 local en boucle)
- **Web Audio API** : Sons 8-bit generes pour les SFX
- **LocalStorage** : Sauvegarde des preferences audio, guestbook, compteur de visiteurs
- **Fetch API** : Chargement des donnees JSON

---

## Donnees

Toutes les donnees sont dans des fichiers JSON dans `/data/` :

- 8 eleves avec photos, descriptions, infractions, citations
- 5 professeurs avec notes, matieres, fun facts
- 10 infractions de Cartman avec dates, gravite, reactions
- 5 jours de menu avec plats, chansons de Chef, notes
- 11 evenements du calendrier scolaire
- 25 citations de Cartman
- Actualites de l'ecole

---

*"Respect my authoritah!" - Eric Cartman*
