# SPA-Trecks — Offline GPS Track Analyzer

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)


[Русский](README.RU.md) | [Українська](README.UA.md) | [Deutsch](README.DE.md) | [Français](README.FR.md) | [Português](README.PT.md)
A browser-based GPS track analyzer that runs entirely client-side with no build step, no npm, and no server backend. Load your GPX, TCX, or KML files and instantly visualize routes on an interactive Leaflet map with speed/elevation/heart-rate heatmaps, synchronized Chart.js graphs, animated playback, and detailed statistics — all without uploading anything to the cloud.

---

## What It Looks Like

```
┌─────────────────────────────────────────────────────────────────┐
│  [Leaflet Map — full viewport]                      ┌─────────┐ │
│                                                     │ Track   │ │
│   Route drawn with heatmap coloring:               │ Panel   │ │
│   ━━ green (slow) → yellow → red (fast)            │         │ │
│                                                     │ ▶ Gold  │ │
│          📍 playback marker                        │ ☑ Track1│ │
│                                                     │ ☑ Track2│ │
│   ┌─────────────────────────────┐                   │ ☐ Track3│ │
│   │ Speed: 14.2 km/h  HR: 142  │  ← HUD overlay   │         │ │
│   │ Elev: 342m     Time: 12:34 │                   │+AddFiles│ │
│   └─────────────────────────────┘                   └─────────┘ │
│                                                                 │
│  ┌─ Charts Panel ──────────────────────────────────────────────┐│
│  │  Speed ▲        Elevation ▲        Heart Rate ▲            ││
│  │  chart  │       chart     │        chart      │            ││
│  └──────────────────────────────────────────────────────────────┘│
│  ┌─ Statistics Overlay ─────────────────────────────────────────┐│
│  │ Distance: 23.4 km | Duration: 1:42:15 | Avg Speed: 13.7... ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

1. **Multi-track loading** — Add multiple GPX, TCX, or KML track files from disk via the panel on the right side. Click "+ Add Files" to select files.

2. **Track visibility toggles** — Each loaded track has a checkbox. Check or uncheck to show or hide it on the map. Unchecked tracks remain loaded in memory for instant re-display.

3. **Primary track selection** — Click a track name in the list to promote it to the primary track (highlighted in gold). The primary track receives heatmap coloring, playback animation, synchronized charts, and full statistics. Non-primary tracks render in their assigned solid color.

4. **Track removal** — Click the × button beside any track to remove it from the current session.

5. **Color-coded heatmap** — Routes are colored by speed (green → red), elevation, or heart rate using an HSL gradient with 32 color buckets for smooth visual transitions.

6. **Synchronized Chart.js graphs** — Speed, elevation, and heart rate charts stay in lockstep with map playback, highlighting the current position as the animation progresses.

7. **Animated playback** — Play or pause a smooth animation with a moving marker tracing the route. A real-time telemetry HUD overlays speed, heart rate, elevation, and elapsed time.

8. **Route statistics** — Calculates total distance, duration, average and maximum speed, elevation gain and loss, average and maximum heart rate, point count, and start/end timestamps.

9. **Tooltip on hover** — Hover over any segment of the route to see detailed point information: speed, elevation, heart rate, timestamp, cumulative distance, and geographic coordinates.

10. **Data export** — Export the primary track as CSV, JSON, or GPX for further analysis in other tools.

11. **Mobile support** — Touch gestures powered by Hammer.js: swipe to switch modes, double-tap to toggle playback, and long-press for debug output.

12. **Altitude drift correction** — Smooths noisy elevation data and corrects start/end altitude drift that commonly affects barometric sensors.

13. **Fullscreen mode** — Press **F** to expand the map to fullscreen for an immersive view.

14. **Collapsible track panel** — Click ▼ / ▶ to collapse or expand the track management panel and reclaim map space.

---

## Keyboard Controls

| Key | Action |
|:---:|--------|
| **S** | Speed mode — color route by speed |
| **H** | Height mode — color route by elevation |
| **P** | Pulse mode — color route by heart rate |
| **G** | Toggle chart panel |
| **T** | Toggle statistics overlay |
| **Space** | Play / Pause animation |
| **←** | Step backward one point |
| **→** | Step forward one point |
| **X** | Export primary track as CSV |
| **Z** | Export primary track as JSON |
| **E** | Export primary track as GPX |
| **F** | Toggle fullscreen |
| **C** | Apply altitude drift correction |

---

## Touch Controls (Mobile)

| Gesture | Action |
|---------|--------|
| Swipe Left / Right | Switch mode (speed / height) |
| Swipe Up | Open chart panel |
| Swipe Down | Close chart panel |
| Double Tap | Play / Pause animation |
| Long Press | Output debug log |

---

## Installation & Quick Start

No build step, no package manager, no dependencies to install.

1. **Clone the repository**

   ```bash
   git clone https://github.com/Antigravity/SPA-Trecks.git
   cd SPA-Trecks
   ```

2. **Start a static file server**

   The app uses ES modules, so it cannot run from the `file://` protocol. Use any of the following:

   ```bash
   # Python
   python3 -m http.server 8000

   # Node.js (npx — no install needed)
   npx serve .

   # Or use the VS Code Live Server extension
   ```

3. **Open in your browser**

   Navigate to `http://localhost:8000` (or whichever port your server uses).

4. **Load your tracks**

   Click **"+ Add Files"** in the top-right panel and select one or more GPX, TCX, or KML files from your device.

That's it — your tracks appear on the map immediately.

> **Note:** An internet connection is required on first load to fetch the CDN-hosted libraries (Leaflet, Chart.js, Hammer.js). Map tiles also require internet.

---

## File Structure

```
SPA-Trecks/
├── index.html              # Main HTML page
├── app.js                  # Application orchestrator
├── style.css               # All styles
├── modules/
│   ├── parser.js           # GPX / TCX / KML parser
│   ├── renderer.js         # Map rendering, heatmap, markers, tooltip
│   ├── charts.js           # Chart.js speed / elevation / HR graphs
│   ├── playback.js         # Animation engine
│   ├── statistics.js       # Route statistics calculator
│   ├── tracks-panel.js     # Track file selector panel with checkboxes
│   ├── export.js           # CSV / JSON / GPX export
│   ├── ui.js               # Keyboard + button controls
│   ├── drift.js            # Altitude smoothing & drift correction
│   └── mobile.js           # Hammer.js touch gestures
├── LICENSE
└── README.md
```

---

## Browser Requirements

A modern browser with ES2022 module support:

- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

---

## License

This project is released under the **MIT License**. It is free for use, copying, distribution, and modification. See the [LICENSE](LICENSE) file for the full license text.
