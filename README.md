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

### Fonctionnalites Principales

- Page d'accueil avec message de bienvenue
- Trombinoscope des eleves
- Equipe pedagogique
- Dossier disciplinaire de Cartman
- Menu de la cafeteria
- Calendrier scolaire
- Generateur de citations
- Livre d'or interactif
- Toggle Kenny : Mort / Vivant
- Widgets : Meteo, horloge, compteur de visiteurs

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

#### 2. SYSTEME AUDIO COMPLET
- **Musique de fond** : Theme South Park genere (8-bit)
- **Sons d'interface** : Navigation, boutons, Kenny toggle
- **Sons du mini-jeu** : Kick, impact, power-up, achievement
- **Controles** :
  - Toggle Musique ON/OFF
  - Toggle Sons ON/OFF
  - Slider de volume (0-100%)
  - Sauvegarde automatique des preferences
- **Style** : Sons 8-bit authentiques (annee 2000)

#### 3. EFFETS VISUELS
- Neige qui tombe en permanence
- Animations fluides et responsives
- Gradients et effets de couleur
- Style Comic Sans MS authentique

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

2. Lance un serveur local :
```bash
# Node.js (avec http-server)
npx http-server -p 8000 -o --cors

Puis va sur `http://localhost:8000`

**Note** : Un serveur local est necessaire pour charger les fichiers JSON (politique CORS).

---

## Structure du Projet

```
southpark-elementary-2000/
├── index.html              # Page principale
├── css/
│   └── style.css          # Styles
├── js/
│   ├── app.js             # Application JavaScript
│   ├── minigame-kick-baby.js  # Mini-jeu
│   └── audio-system.js    # Systeme audio
├── data/
│   ├── students.json      # Donnees des eleves
│   ├── teachers.json      # Donnees des professeurs
│   ├── cartman-infractions.json
│   ├── menu.json
│   ├── calendar.json
│   └── cartman-quotes.json
├── images/
│   ├── students/          # Photos des eleves
│   └── teachers/          # Photos des professeurs
└── README.md
```

---

## Technologies

- **HTML5** : Structure semantique
- **CSS3** : Animations, gradients, effets
- **JavaScript Vanilla** : Pas de framework, que du pur JS
- **Canvas API** : Mini-jeu et animations
- **Web Audio API** : Sons generes (8-bit)
- **LocalStorage** : Sauvegarde des donnees
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

---

*"Respect my authoritah!" - Eric Cartman*
