# SPA-Trecks — Analyseur GPS hors ligne

[English](README.md) | [Русский](README.RU.md) | [Українська](README.UA.md) | [Deutsch](README.DE.md) | **Français** | [Português](README.PT.md)

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Licence](https://img.shields.io/badge/license-MIT-green)
![Statut](https://img.shields.io/badge/status-stable-brightgreen)

**SPA-Trecks** est un analyseur de traces GPS fonctionnant entièrement dans le navigateur, sans serveur backend ni étape de compilation. Chargez vos fichiers GPX, TCX ou KML et visualisez instantanément vos parcours sur une carte interactive avec coloration par vitesse, élévation ou fréquence cardiaque.

---

## Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Raccourcis clavier](#raccourcis-clavier)
- [Commandes tactiles](#commandes-tactiles)
- [Installation et démarrage rapide](#installation-et-démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Configuration requise](#configuration-requise)
- [Licence](#licence)

---

## Description

SPA-Trecks offre une analyse complète de vos traces GPS directement dans le navigateur. Conçu pour les randonneurs, cyclistes et coureurs, il propose une visualisation avancée des données de parcours :

- **Carte interactive** basée sur Leaflet avec coloration thermique des segments.
- **Graphiques synchronisés** (vitesse, élévation, fréquence cardiaque) via Chart.js.
- **Animation de relecture** avec un marqueur mobile et un tableau de bord de télémétrie en temps réel.
- **Chargement multi-traces** pour comparer plusieurs parcours simultanément.
- **Export des données** en CSV, JSON ou GPX.
- **Support mobile** grâce aux gestes tactiles Hammer.js.

Aucune installation ni dépendance n'est requise — il suffit de servir les fichiers statiques et d'ouvrir la page dans un navigateur moderne.

---

## Fonctionnalités

| # | Fonctionnalité | Description |
|---|----------------|-------------|
| 1 | **Chargement multi-traces** | Ajoutez plusieurs fichiers GPX/TCX/KML via le panneau latéral. Cliquez sur « + Ajouter des fichiers » pour sélectionner vos traces. |
| 2 | **Affichage/masquage des traces** | Chaque trace chargée dispose d'une case à cocher. Cochez/décochez pour afficher ou masquer la trace sur la carte. Les traces décochées restent chargées en mémoire. |
| 3 | **Sélection de la trace principale** | Cliquez sur le nom d'une trace dans la liste pour la définir comme trace principale (surlignée en or). La trace principale bénéficie de la coloration thermique, de l'animation de relecture, des graphiques et des statistiques. Les autres traces sont affichées dans leur couleur unie attribuée. |
| 4 | **Suppression de traces** | Cliquez sur le bouton × pour retirer une trace de la session. |
| 5 | **Carte thermique colorée** | Les parcours sont colorés par vitesse (vert = lent → rouge = rapide), élévation ou fréquence cardiaque grâce à un dégradé HSL avec 32 nuances. |
| 6 | **Graphiques synchronisés** | Les courbes de vitesse, d'élévation et de fréquence cardiaque (Chart.js) sont synchronisées avec l'animation de relecture sur la carte. |
| 7 | **Animation de relecture** | Lecture/pause avec un marqueur se déplaçant le long du parcours. Tableau de bord de télémétrie affichant en temps réel la vitesse, la FC, l'élévation et l'heure. |
| 8 | **Statistiques du parcours** | Distance, durée, vitesse moyenne/max, dénivelé positif/négatif, FC moyenne/max, nombre de points, heures de début et de fin. |
| 9 | **Info-bulles** | Survolez le parcours pour afficher les informations détaillées du point : vitesse, élévation, FC, heure, distance, coordonnées. |
| 10 | **Export de données** | Exportez la trace principale en CSV, JSON ou GPX. |
| 11 | **Support mobile** | Gestes tactiles via Hammer.js (balayage pour changer de mode, double tap pour lecture/pause). |
| 12 | **Correction de dérive altimétrique** | Lisse les données d'élévation et corrige la dérive d'altitude entre le début et la fin du parcours. |
| 13 | **Mode plein écran** | Appuyez sur F pour basculer en plein écran. |
| 14 | **Panneau rétractable** | Cliquez sur ▼/▶ pour réduire ou agrandir le panneau de gestion des traces. |

---

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| **S** | Mode vitesse (coloration par vitesse) |
| **H** | Mode hauteur (coloration par élévation) |
| **P** | Mode pouls (coloration par fréquence cardiaque) |
| **G** | Afficher/masquer le panneau des graphiques |
| **T** | Afficher/masquer les statistiques |
| **Espace** | Lecture / Pause de l'animation |
| **←** | Reculer d'un point |
| **→** | Avancer d'un point |
| **X** | Exporter en CSV |
| **Z** | Exporter en JSON |
| **E** | Exporter en GPX |
| **F** | Basculer en plein écran |
| **C** | Appliquer la correction de dérive altimétrique |

---

## Commandes tactiles

| Geste | Action |
|-------|--------|
| **Balayer vers la gauche/droite** | Changer de mode (vitesse / élévation) |
| **Balayer vers le haut** | Ouvrir le panneau des graphiques |
| **Balayer vers le bas** | Fermer le panneau des graphiques |
| **Double appui** | Lecture / Pause |
| **Appui long** | Journal de débogage |

---

## Installation et démarrage rapide

Aucune étape de compilation, aucune dépendance à installer. Il vous suffit d'un serveur de fichiers statiques.

### Étapes

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/Antigravity/SPA-Trecks.git
   ```

2. **Accéder au répertoire du projet :**

   ```bash
   cd SPA-Trecks
   ```

3. **Lancer un serveur de fichiers statiques**, par exemple :

   ```bash
   # Avec Python
   python3 -m http.server 8000

   # Ou avec Node.js
   npx serve .
   ```

   Vous pouvez également utiliser l'extension **Live Server** de VS Code.

4. **Ouvrir dans le navigateur :**

   Accédez à `http://localhost:8000` dans votre navigateur.

5. **Charger vos traces GPS :**

   Cliquez sur « + Ajouter des fichiers » dans le panneau situé en haut à droite pour charger vos fichiers GPX, TCX ou KML.

> **Note :** L'application ne fonctionne pas via le protocole `file://`. Un serveur HTTP est nécessaire en raison des restrictions de chargement des modules ES.

---

## Structure du projet

```
SPA-Trecks/
├── index.html              # Page HTML principale
├── app.js                  # Orchestrateur de l'application
├── style.css               # Feuille de styles
├── modules/
│   ├── parser.js           # Analyseur GPX / TCX / KML
│   ├── renderer.js         # Rendu carte, thermique, marqueurs, info-bulles
│   ├── charts.js           # Graphiques vitesse / élévation / FC (Chart.js)
│   ├── playback.js         # Moteur d'animation
│   ├── statistics.js       # Calcul des statistiques du parcours
│   ├── tracks-panel.js     # Panneau de gestion des traces
│   ├── export.js           # Export CSV / JSON / GPX
│   ├── ui.js               # Commandes clavier et boutons
│   ├── drift.js            # Lissage et correction de dérive altimétrique
│   └── mobile.js           # Gestes tactiles (Hammer.js)
├── LICENSE                 # Licence MIT
└── README.md               # Documentation (anglais)
```

---

## Configuration requise

- **Navigateur moderne** prenant en charge les modules ES : Chrome 61+, Firefox 60+, Safari 11+, Edge 79+.
- **Connexion Internet** nécessaire au premier chargement pour récupérer les bibliothèques CDN (Leaflet, Chart.js, Hammer.js), ainsi que pour le chargement des tuiles cartographiques.

---

## Licence

Ce projet est distribué sous la [licence MIT](LICENSE). Vous êtes libre de l'utiliser, le copier, le distribuer et le modifier.
