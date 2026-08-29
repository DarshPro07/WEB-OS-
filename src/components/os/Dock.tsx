import { appList } from "../../core/appRegistry";
import { useOS } from "../../core/OSContext";

export default function Dock() {
  const { state, openApp } = useOS();
  const running = appList.filter((app) => state.windows[app.id].open);

  return (
    <nav className="dock" aria-label="Open windows">
      <div className="dock-inner">
        {running.length === 0 && (
          <span className="dock-hint">No open windows</span>
        )}
        {running.map((app) => (
          <button
            className={`dock-app ${state.activeAppId === app.id ? "dock-app-active" : ""}`}
            key={app.id}
            onClick={() => openApp(app.id)}
          >
            <span className="dock-icon">{app.icon}</span>
            <span className="dock-label">{app.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
