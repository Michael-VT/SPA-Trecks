[English](README.md) | [Русский](README.RU.md) | [Українська](README.UA.md) | **Deutsch** | [Français](README.FR.md) | [Português](README.PT.md)

# 🗺️ SPA-Trecks — Offline GPS-Track-Analysator

![Version](https://img.shields.io/badge/Version-1.1.0-blue)
![Lizenz](https://img.shields.io/badge/Lizenz-MIT-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022+-yellow)
![Offline](https://img.shields.io/badge/Modus-Offline-orange)

## Beschreibung

SPA-Trecks ist eine browserbasierte Anwendung zur Visualisierung und Analyse von GPS-Tracks — vollständig ohne Build-Schritt, ohne npm und ohne serverseitige Abhängigkeiten. Laden Sie Ihre GPX-, TCX- oder KML-Dateien direkt in den Browser und erhalten Sie sofort farbcodierte Karten, synchronisierte Diagramme, animierte Wiedergabe und detaillierte Routenstatistiken.

Die gesamte Datenverarbeitung erfolgt lokal auf Ihrem Gerät. Es werden keine Track-Daten an externe Server gesendet.

**Technologie-Stack:** Vanilla JavaScript (ES2022+ Module), Leaflet 1.9.4, Chart.js, Hammer.js.

---

## Funktionen

### Mehrfach-Track-Verwaltung
- **Mehrfaches Laden:** Mehrere GPX-/TCX-/KML-Dateien gleichzeitig über das Panel auf der rechten Seite laden. Klicken Sie auf „+ Dateien hinzufügen", um Dateien auszuwählen.
- **Sichtbarkeit umschalten:** Jeder geladene Track verfügt über eine Checkbox — ein- bzw. ausschalten, um ihn auf der Karte anzuzeigen oder auszublenden. Ausgeblendete Tracks bleiben weiterhin geladen.
- **Primären Track auswählen:** Klicken Sie auf einen Track-Namen in der Liste, um ihn als primären Track festzulegen (goldfarben hervorgehoben). Der primäre Track erhält Heatmap-Färbung, Wiedergabeanimation, Diagramme und Statistiken. Nicht-primäre Tracks werden in ihrer zugewiesenen Volltonfarbe dargestellt.
- **Track entfernen:** Klicken Sie auf die ×-Schaltfläche, um einen Track aus der Sitzung zu entfernen.

### Visualisierung & Analyse
- **Farbcodierte Heatmap:** Routen werden nach Geschwindigkeit (Grün=langsam → Rot=schnell), Höhe oder Herzfrequenz eingefärbt. Verwendet einen HSL-Farbverlauf mit 32 Farbklassen.
- **Synchrone Chart.js-Diagramme:** Geschwindigkeits-, Höhen- und Herzfrequenzdiagramme, die mit der Kartenwiedergabe synchronisiert sind.
- **Animierte Wiedergabe:** Play/Pause-Animation mit einem beweglichen Marker entlang der Route. Echtzeit-Telemetrie-HUD mit Geschwindigkeit, Herzfrequenz, Höhe und Zeit.
- **Routenstatistiken:** Distanz, Dauer, Durchschnitts-/Maximalgeschwindigkeit, Höhengewinn/-verlust, Durchschnitts-/Maximal-HF, Punktzahl, Start- und Endzeiten.
- **Tooltip:** Fahren Sie mit der Maus über die Route, um detaillierte Punktinformationen zu erhalten (Geschwindigkeit, Höhe, HF, Zeit, Distanz, Koordinaten).
- **Höhendrift-Korrektur:** Glättet Höhendaten und korrigiert den Höhenversatz am Start- und Endpunkt.

### Datenexport
Exportieren Sie den primären Track als:
- **CSV** — Tabellarische Daten für Tabellenkalkulationen
- **JSON** — Strukturierte Daten für die programmgesteuerte Weiterverarbeitung
- **GPX** — Standard-GPS-Austauschformat

### Mobile Unterstützung & Bedienung
- Touch-Gesten via Hammer.js (Wischen zum Moduswechsel, Doppeltippen für Play/Pause).
- Vollbildmodus: Taste **F** drücken.
- Einklappbares Track-Panel: Klicken Sie auf ▼/▶, um das Panel ein- bzw. auszuklappen.

---

## Tastatursteuerung

| Taste | Funktion |
|-------|----------|
| **S** | Geschwindigkeitsmodus (Färbung nach Geschwindigkeit) |
| **H** | Höhenmodus (Färbung nach Höhe) |
| **P** | Pulsmodus (Färbung nach Herzfrequenz) |
| **G** | Diagramm-Panel ein-/ausblenden |
| **T** | Statistik-Overlay ein-/ausblenden |
| **Leertaste** | Animation abspielen/pausieren |
| **← / →** | Einen Punkt zurück/vor springen |
| **X** | Als CSV exportieren |
| **Z** | Als JSON exportieren |
| **E** | Als GPX exportieren |
| **F** | Vollbildmodus umschalten |
| **C** | Höhendrift-Korrektur anwenden |

---

## Touch-Steuerung (Mobil)

| Geste | Funktion |
|-------|----------|
| **Nach links/rechts wischen** | Modus wechseln (Geschwindigkeit/Höhe) |
| **Nach oben wischen** | Diagramm-Panel öffnen |
| **Nach unten wischen** | Diagramm-Panel schließen |
| **Doppeltippen** | Animation abspielen/pausieren |
| **Lange tippen** | Debug-Log anzeigen |

---

## Installation und Schnellstart

Es ist kein Build-Schritt, kein `npm install` und keine Installation von Abhängigkeiten erforderlich.

### 1. Repository klonen

```bash
git clone https://github.com/Antigravity/SPA-Trecks.git
cd SPA-Trecks
```

### 2. Statischen Dateiserver starten

Die Anwendung kann **nicht** direkt über das `file://`-Protokoll geöffnet werden — ein statischer Dateiserver ist erforderlich. Wählen Sie eine der folgenden Möglichkeiten:

```bash
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .

# PHP (falls installiert)
php -S localhost:8000
```

Alternativ: **VS Code Live Server**-Erweiterung verwenden.

### 3. Im Browser öffnen

```
http://localhost:8000
```

### 4. GPS-Tracks laden

Klicken Sie auf **„+ Dateien hinzufügen"** im Panel oben rechts, um Ihre GPX-, TCX- oder KML-Dateien auszuwählen.

---

## Projektstruktur

```
SPA-Trecks/
├── index.html              # Hauptseite der Anwendung
├── app.js                  # Anwendungs-Orchestrator
├── style.css               # Alle Stildefinitionen
├── modules/
│   ├── parser.js           # GPX-/TCX-/KML-Parser
│   ├── renderer.js         # Kartendarstellung, Heatmap, Marker, Tooltip
│   ├── charts.js           # Chart.js-Geschwindigkeits-/Höhen-/HF-Diagramme
│   ├── playback.js         # Animations-Engine
│   ├── statistics.js       # Routenstatistik-Berechnung
│   ├── tracks-panel.js     # Track-Auswahlpanel mit Checkboxen
│   ├── export.js           # CSV-/JSON-/GPX-Export
│   ├── ui.js               # Tastatur- und Schaltflächensteuerung
│   ├── drift.js            # Höhenglättung und Drift-Korrektur
│   └── mobile.js           # Hammer.js-Touch-Gesten
├── LICENSE                 # MIT-Lizenz
└── README.md               # Dokumentation (Englisch)
```

---

## Systemanforderungen

- **Browser:** Moderner Browser mit ES-Module-Unterstützung:
  - Chrome 61+
  - Firefox 60+
  - Safari 11+
  - Edge 79+
- **Internetverbindung:** Erforderlich für das erstmalige Laden der CDN-Bibliotheken (Leaflet, Chart.js, Hammer.js) sowie für Kartenkacheln.
- **Server:** Ein beliebiger statischer Dateiserver. Kein `file://`-Protokoll.

---

## Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**. Es ist kostenlos für Nutzung, Kopierung, Verbreitung und Änderung.

Siehe [LICENSE](LICENSE) für den vollständigen Lizenztext.
