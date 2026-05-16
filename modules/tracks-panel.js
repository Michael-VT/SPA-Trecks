// tracks-panel.js — track file selector panel with visibility toggles
import { parseTrackFromFile } from "./parser.js";

const PALETTE = ["#4488ff", "#ff4444", "#44bb44", "#ff8800", "#aa44ff", "#ff44aa", "#44dddd", "#dddd44", "#884422", "#448888"];
let nextId = 0;

export function initTrackPanel(container, callbacks) {
    const ver = callbacks.version || "";
    const verDate = callbacks.versionDate || "";
    const titleText = ver ? `Tracks v${ver}` : "Tracks";
    const dateText = verDate ? ` (${verDate})` : "";
    const panel = document.createElement("div");
    panel.id = "trackPanel";
    panel.innerHTML = `
        <div id="trackPanelHeader">
            <span id="trackPanelTitle">${titleText}<small style="font-size:10px;color:#999;font-weight:400">${dateText}</small></span>
            <button id="trackPanelToggle" title="Collapse/Expand">▼</button>
        </div>
        <div id="trackPanelBody">
            <label id="addFilesBtn">
                + Add Files
                <input type="file" id="trackFileInput" multiple accept=".gpx,.tcx,.kml"/>
            </label>
            <div id="trackList">
                <div class="track-empty">No tracks loaded</div>
            </div>
        </div>
    `;
    container.appendChild(panel);

    const fileInput = panel.querySelector("#trackFileInput");
    const trackList = panel.querySelector("#trackList");
    const toggleBtn = panel.querySelector("#trackPanelToggle");
    const body = panel.querySelector("#trackPanelBody");
    let collapsed = false;
    let tracks = []; // {id, name, points, visible, color}
    let primaryId = null;

    toggleBtn.addEventListener("click", () => {
        collapsed = !collapsed;
        body.style.display = collapsed ? "none" : "block";
        toggleBtn.textContent = collapsed ? "▶" : "▼";
    });

    fileInput.addEventListener("change", async () => {
        const files = Array.from(fileInput.files);
        let added = 0;
        for (const file of files) {
            try {
                const points = await parseTrackFromFile(file);
                if (points.length === 0) {
                    console.warn(`No points in ${file.name}`);
                    continue;
                }
                const id = nextId++;
                const color = PALETTE[tracks.length % PALETTE.length];
                tracks.push({ id, name: file.name, points, visible: true, color });
                if (primaryId === null) primaryId = id;
                added++;
            } catch (e) {
                console.warn(`Failed to parse ${file.name}:`, e);
            }
        }
        fileInput.value = "";
        if (added > 0) {
            renderList();
            callbacks.onUpdate?.("files-added");
        }
    });

    function renderList() {
        trackList.innerHTML = "";
        if (tracks.length === 0) {
            trackList.innerHTML = '<div class="track-empty">No tracks loaded</div>';
            return;
        }
        tracks.forEach(t => {
            const row = document.createElement("div");
            row.className = "track-row" + (t.id === primaryId ? " primary" : "");
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = t.visible;
            const dot = document.createElement("span");
            dot.className = "track-color";
            dot.style.background = t.color;
            const name = document.createElement("span");
            name.className = "track-name";
            name.textContent = truncate(t.name, 24);
            name.title = t.name;
            const rm = document.createElement("button");
            rm.className = "track-remove";
            rm.textContent = "×";
            rm.title = "Remove";

            cb.addEventListener("change", () => {
                t.visible = cb.checked;
                callbacks.onUpdate?.("visibility-changed");
            });
            name.addEventListener("click", () => {
                if (primaryId === t.id) return;
                primaryId = t.id;
                renderList();
                callbacks.onUpdate?.("primary-changed");
            });
            rm.addEventListener("click", () => {
                tracks = tracks.filter(x => x.id !== t.id);
                if (primaryId === t.id) {
                    primaryId = tracks.length > 0 ? tracks[0].id : null;
                }
                renderList();
                callbacks.onUpdate?.("track-removed");
            });

            row.appendChild(cb);
            row.appendChild(dot);
            row.appendChild(name);
            row.appendChild(rm);
            trackList.appendChild(row);
        });
    }

    return {
        getAllTracks: () => tracks,
        getVisibleTracks: () => tracks.filter(t => t.visible),
        getPrimaryTrack: () => tracks.find(t => t.id === primaryId) || null,
        getPrimaryId: () => primaryId
    };
}

function truncate(name, max) {
    return name.length > max ? name.substring(0, max - 3) + "..." : name;
}
