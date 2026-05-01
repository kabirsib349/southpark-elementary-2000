# South Park Elementary - Site Officiel (Annee 2000)

![South Park](https://img.shields.io/badge/South%20Park-Elementary-yellow?style=for-the-badge)
![Year 2000](https://img.shields.io/badge/Year-2000-ff00ff?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML-CSS-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=for-the-badge)

> Site internet officiel de South Park Elementary, comme si il avait ete cree en l'an 2000.
> Projet pour le hackathon - Theme : Site Annee 2000

---

## Le Concept

Un portail scolaire officiel ultra kitsch annees 2000, avec tout ce qu'on attendrait d'un vrai site d'ecole... mais version South Park. Tout est "serieux" et institutionnel en apparence, mais le contenu est completement dejante.

### Fonctionnalites

- Page d'accueil avec message de bienvenue du Principal Victoria
- Trombinoscope des eleves (Cartman, Kyle, Stan, Kenny, Butters, Tweek, Token, Wendy)
- Equipe pedagogique (Mr. Garrison, Mr. Mackey, Chef, Principal Victoria, Ms. Crabtree)
- Dossier disciplinaire de Cartman avec toutes ses infractions
- Menu de la cafeteria avec les plats de Chef
- Calendrier scolaire et emploi du temps
- Generateur de citations de Cartman
- Livre d'or interactif (localStorage)
- Toggle Kenny : Mort / Vivant (interactif)
- Widgets : Meteo, horloge, compteur de visiteurs

### Esthetique Annee 2000

- Fond etoile anime avec canvas
- Polices : Comic Sans MS, Impact, Arial
- Couleurs flashy : jaune fluo, rose, vert lime, bleu electrique
- Effets blink, rainbow, glow
- Marquee ticker en haut
- Popup style Internet Explorer au chargement
- Layout avec tableaux HTML (vrai style 2000)
- Bordures 3D avec effets bevel
- Compteur de visiteurs Geocities-style
- Pas d'emojis (n'existaient pas en 2000)
- Caracteres ASCII uniquement (/!\, >>>, [X_X], etc.)

---

## Installation & Lancement

### Prerequis

Aucun ! C'est du HTML/CSS/JS pur. Pas de build, pas de dependances.

### Lancer en local

1. Clone le repo :
```bash
git clone https://github.com/ton-username/south-park-elementary-2000.git
cd south-park-elementary-2000
```

2. Lance un serveur local :
```bash
# Node.js (avec http-server)
npx http-server -p 8000 -o --cors

# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000
```

Puis va sur `http://localhost:8000`

**Note** : Un serveur local est necessaire pour charger les fichiers JSON (politique CORS).

---

## Structure du Projet

```
south-park-elementary-2000/
├── index.html              # Page principale
├── css/
│   └── style.css          # Styles annee 2000
├── js/
│   └── app.js             # Application JavaScript
├── data/
│   ├── students.json      # Donnees des eleves
│   ├── teachers.json      # Donnees des professeurs
│   ├── cartman-infractions.json  # Infractions de Cartman
│   ├── menu.json          # Menu de la cafeteria
│   ├── calendar.json      # Calendrier scolaire
│   └── cartman-quotes.json  # Citations de Cartman
├── images/
│   ├── students/          # Photos des eleves
│   ├── teachers/          # Photos des professeurs
│   └── principal-victoria.png.webp
├── netlify.toml           # Configuration Netlify
└── README.md
```

---

## Deploiement

### Netlify (Recommande)

**Methode 1 : Drag & Drop**
1. Va sur https://app.netlify.com/drop
2. Glisse-depose le dossier complet
3. C'est en ligne !

**Methode 2 : Via GitHub**
1. Push ton code sur GitHub
2. Sur Netlify : "Add new site" > "Import from GitHub"
3. Selectionne ton repo
4. Deploy !

Le fichier `netlify.toml` configure tout automatiquement.

### GitHub Pages

1. Push ton code sur GitHub
2. Va dans Settings > Pages
3. Source : `main` branch, `/root`
4. Ton site sera disponible sur `https://ton-username.github.io/south-park-elementary-2000/`

### Vercel

```bash
npm i -g vercel
vercel
```

Ou connecte ton repo GitHub sur vercel.com

---

## Utilisation

### Navigation

Utilise la barre de navigation en haut pour acceder aux differentes sections :
- Accueil
- Eleves
- Professeurs
- Dossier Cartman
- Cafeteria
- Calendrier
- Citations
- Guestbook

### Fonctionnalites interactives

- **Toggle Kenny** : Clique sur le toggle dans la sidebar pour changer le statut de Kenny (Mort <-> Vivant)
- **Modal eleve** : Clique sur un eleve pour voir sa fiche detaillee
- **Modal professeur** : Clique sur un professeur pour voir ses infos completes
- **Generateur de citations** : Clique sur "Nouvelle citation" pour une citation aleatoire de Cartman
- **Livre d'or** : Laisse un message qui sera sauvegarde dans le localStorage
- **Recherche eleves** : Utilise la barre de recherche pour filtrer les eleves

---

## Criteres du Hackathon

### Creativite
- Concept original : portail scolaire officiel de South Park
- Humour integre dans l'UI (infractions de Cartman, Kenny mort/vivant)
- Details pousses (citations, menu de Chef, calendrier d'evenements delirants)

### Concept
- Coherent : c'est un vrai portail scolaire, pas juste une page
- Complet : 8 sections differentes avec du contenu riche
- Interactif : toggle Kenny, generateur de citations, guestbook, modals

### Originalite
- Melange South Park + esthetique annee 2000
- Pas un simple site vitrine, mais un vrai portail fonctionnel
- Easter eggs et details caches partout

### Fun
- Esthetique kitsch assumee
- References South Park partout
- Interactions amusantes (toggle Kenny, citations de Cartman)
- Popup IE au chargement

---

## Technologies

- **HTML5** : Structure semantique
- **CSS3** : Animations, gradients, effets
- **JavaScript Vanilla** : Pas de framework, que du pur JS
- **Canvas API** : Fond etoile anime
- **LocalStorage** : Sauvegarde du guestbook
- **Fetch API** : Chargement des donnees JSON
- **CountAPI** : Compteur de visiteurs partage

---

## Donnees

Toutes les donnees sont dans des fichiers JSON dans `/data/` :

- **8 eleves** avec photos, descriptions, infractions, citations
- **5 professeurs** avec notes, matieres, fun facts
- **10 infractions** de Cartman avec dates, gravite, reactions
- **5 jours de menu** avec plats, chansons de Chef, notes
- **11 evenements** du calendrier scolaire
- **25 citations** de Cartman

---

## Personnalisation

### Ajouter un eleve

Edite `data/students.json` :
```json
{
  "id": 9,
  "name": "Nouveau Eleve",
  "nickname": "Surnom",
  "age": 10,
  "grade": "4eme annee",
  "photo": "images/students/nouveau.png",
  "status": "vivant",
  "description": "Description...",
  "infractions": 0,
  "quote": "Citation...",
  "hobbies": ["Hobby 1", "Hobby 2"]
}
```

### Ajouter une infraction de Cartman

Edite `data/cartman-infractions.json` :
```json
{
  "id": 11,
  "date": "01/05/2026",
  "rule": "Regle enfreinte",
  "description": "Ce qu'il a fait",
  "punishment": "Punition",
  "cartmanReaction": "Sa reaction",
  "severity": "critique"
}
```

### Modifier les couleurs

Edite `css/style.css` et change les variables de couleurs dans les gradients et backgrounds.

---

## Authenticity Annee 2000

Ce site respecte scrupuleusement l'esthetique debut annee 2000 :

- Pas d'emojis (n'existaient pas en 2000)
- Caracteres ASCII uniquement (/!\, >>>, ***, [X_X], [OK], <3, :-))
- Comic Sans MS partout
- Marquee et blink
- Popup Internet Explorer
- Compteur de visiteurs
- GIFs animes
- Couleurs flashy
- Layout avec tables
- Fond etoile anime

---

## Licence

Ce projet est cree pour un hackathon et est a but educatif/humoristique.
South Park (c) Comedy Central. Tous les droits appartiennent a leurs proprietaires respectifs.

---

## Auteur

Cree avec passion et beaucoup de Comic Sans MS pour le hackathon 2026.

---

## Remerciements

- Matt Stone & Trey Parker pour South Park
- Geocities pour l'inspiration esthetique
- Internet Explorer 6 pour les bugs memorables
- Comic Sans MS pour exister

---

*"Respect my authoritah!" - Eric Cartman*
