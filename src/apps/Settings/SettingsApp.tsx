import { useRef, type ChangeEvent } from "react";
import { useOS } from "../../core/OSContext";
import type { AccentName, ThemeMode } from "../../core/types";
import { wallpaperPresets } from "../../core/wallpaperPresets";
import { saveCustomWallpaper } from "../../core/customWallpaperStore";

const MAX_WALLPAPER_BYTES = 80 * 1024 * 1024;

export default function SettingsApp() {
  const { state, setTheme, setAccent, setReducedMotion, setWallpaper, setWallpaperDim, setWallpaperBlur, setWidgetsVisible, notify } = useOS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { wallpaper } = state.settings;

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/^image\/|^video\//.test(file.type)) {
      notify({ source: "Settings", title: "Unsupported file", message: "Choose an image or video file.", level: "warning" });
      return;
    }
    if (file.size > MAX_WALLPAPER_BYTES) {
      notify({ source: "Settings", title: "File too large", message: "Keep custom wallpapers under 80 MB.", level: "warning" });
      return;
    }
    await saveCustomWallpaper(file);
    setWallpaper("custom");
    notify({ source: "Settings", title: "Wallpaper updated", message: `${file.name} set as background.`, level: "success" });
  }

  return (
    <div className="app-stack">
      <p>Configure the NEXUS workspace appearance, background, and motion preferences.</p>
      <div className="settings-group"><label>Theme</label><div className="segmented">{(["light", "dark"] as ThemeMode[]).map((theme) => <button key={theme} className={state.settings.theme === theme ? "selected" : ""} onClick={() => setTheme(theme)}>{theme}</button>)}</div></div>
      <div className="settings-group"><label>Accent</label><div className="accent-picker">{(["blue", "amber", "green"] as AccentName[]).map((accent) => <button key={accent} className={`accent-choice accent-${accent} ${state.settings.accent === accent ? "selected" : ""}`} onClick={() => setAccent(accent)} aria-label={accent} />)}</div></div>

      <div className="settings-group">
        <label>Wallpaper</label>
        <div className="wallpaper-grid">
          {wallpaperPresets.map((preset) => (
            <button
              key={preset.id}
              className={`wallpaper-choice ${wallpaper.id === preset.id ? "selected" : ""}`}
              style={{ backgroundImage: preset.kind === "video" ? `url(${preset.poster})` : preset.swatch }}
              onClick={() => setWallpaper(preset.id)}
            >
              <span>{preset.name}</span>
            </button>
          ))}
          <button className={`wallpaper-choice wallpaper-upload ${wallpaper.id === "custom" ? "selected" : ""}`} onClick={() => fileInputRef.current?.click()}>
            <span>{wallpaper.id === "custom" ? "Custom wallpaper" : "Upload your own"}</span>
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" hidden onChange={handleUpload} />
      </div>

      <div className="settings-group">
        <label>Wallpaper dim ({wallpaper.dim}%)</label>
        <input type="range" min={0} max={90} value={wallpaper.dim} onChange={(event) => setWallpaperDim(Number(event.target.value))} />
      </div>

      <div className="settings-group">
        <label>Wallpaper blur ({wallpaper.blur}px)</label>
        <input type="range" min={0} max={20} value={wallpaper.blur} onChange={(event) => setWallpaperBlur(Number(event.target.value))} />
      </div>

      <div className="settings-row"><span><strong>Desktop widgets</strong><small>Show the clock and status readout</small></span><button className={`switch ${state.settings.widgetsVisible ? "on" : ""}`} onClick={() => setWidgetsVisible(!state.settings.widgetsVisible)} aria-label="Toggle desktop widgets"><span /></button></div>
      <div className="settings-row"><span><strong>Reduced motion</strong><small>Minimize interface animation, pause wallpaper video</small></span><button className={`switch ${state.settings.reducedMotion ? "on" : ""}`} onClick={() => setReducedMotion(!state.settings.reducedMotion)} aria-label="Toggle reduced motion"><span /></button></div>
    </div>
  );
}
