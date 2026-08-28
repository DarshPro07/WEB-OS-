import { appList } from "../../core/appRegistry";
import { useOS } from "../../core/OSContext";

export default function Dock() {
  const { state, openApp } = useOS();
  return (
    <nav className="dock" aria-label="Applications">
      <div className="dock-inner">
        {appList.map((app) => {
          const running = state.windows[app.id].open;
          return (
            <button
              className={`dock-app ${state.activeAppId === app.id ? "dock-app-active" : ""}`}
              key={app.id}
              onClick={() => openApp(app.id)}
              aria-label={`Open ${app.name}`}
            >
              <span className="dock-icon">{app.icon}</span>
              {running && <span className="dock-running-dot" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
