import { X } from "lucide-react";
import { useOS } from "../../core/OSContext";
import type { AccentName, ThemeMode } from "../../core/types";

interface Props { open: boolean; onClose: () => void; }

export default function QuickSettings({ open, onClose }: Props) {
  const { state, setTheme, setAccent, setReducedMotion, setWidgetsVisible } = useOS();
  if (!open) return null;
  return (
    <aside className="side-panel" role="dialog" aria-label="Quick settings">
      <header className="side-panel-header"><div><strong>Quick settings</strong><span>Workspace appearance</span></div><button onClick={onClose} aria-label="Close"><X size={14} strokeWidth={1.5} /></button></header>
      <div className="settings-group"><label>Theme</label><div className="segmented">{(["light", "dark"] as ThemeMode[]).map((theme) => <button key={theme} className={state.settings.theme === theme ? "selected" : ""} onClick={() => setTheme(theme)}>{theme}</button>)}</div></div>
      <div className="settings-group"><label>Accent</label><div className="accent-picker">{(["blue", "amber", "green"] as AccentName[]).map((accent) => <button key={accent} aria-label={accent} className={`accent-choice accent-${accent} ${state.settings.accent === accent ? "selected" : ""}`} onClick={() => setAccent(accent)} />)}</div></div>
      <div className="settings-group"><div className="settings-row"><span><strong>Desktop widgets</strong><small>Clock and status readout</small></span><button className={`switch ${state.settings.widgetsVisible ? "on" : ""}`} onClick={() => setWidgetsVisible(!state.settings.widgetsVisible)} aria-label="Toggle desktop widgets"><span /></button></div></div>
      <div className="settings-group"><div className="settings-row"><span><strong>Reduced motion</strong><small>Minimize interface animation</small></span><button className={`switch ${state.settings.reducedMotion ? "on" : ""}`} onClick={() => setReducedMotion(!state.settings.reducedMotion)} aria-label="Toggle reduced motion"><span /></button></div></div>
    </aside>
  );
}
