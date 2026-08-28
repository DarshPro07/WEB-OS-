import { useOS } from "../../core/OSContext";
import type { AccentName, ThemeMode } from "../../core/types";

export default function SettingsApp() {
  const { state, setTheme, setAccent, setReducedMotion } = useOS();
  return (
    <div className="app-stack">
      <p>Configure the NEXUS workspace appearance and motion preferences.</p>
      <div className="settings-group"><label>Theme</label><div className="segmented">{(["dark", "dim"] as ThemeMode[]).map((theme) => <button key={theme} className={state.settings.theme === theme ? "selected" : ""} onClick={() => setTheme(theme)}>{theme}</button>)}</div></div>
      <div className="settings-group"><label>Accent</label><div className="accent-picker">{(["lime", "blue", "violet"] as AccentName[]).map((accent) => <button key={accent} className={`accent-choice accent-${accent} ${state.settings.accent === accent ? "selected" : ""}`} onClick={() => setAccent(accent)} aria-label={accent} />)}</div></div>
      <div className="settings-row"><span><strong>Reduced motion</strong><small>Minimize interface animation</small></span><button className={`switch ${state.settings.reducedMotion ? "on" : ""}`} onClick={() => setReducedMotion(!state.settings.reducedMotion)} aria-label="Toggle reduced motion"><span /></button></div>
    </div>
  );
}
