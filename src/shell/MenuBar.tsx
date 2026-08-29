import { useEffect, useState } from "react";
import { useOS } from "../core/OSContext";
import { appRegistry } from "../core/appRegistry";

interface Props {
  onSearch: () => void;
  onNotifications: () => void;
  onQuickSettings: () => void;
}

export default function MenuBar({ onSearch, onNotifications, onQuickSettings }: Props) {
  const { state } = useOS();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const unread = state.notifications.filter((item) => !item.read).length;
  const activeApp = state.activeAppId ? appRegistry[state.activeAppId] : null;
  return (
    <header className="menu-bar">
      <div className="menu-left">
        <span className="menu-brand">NEXUS</span>
        {activeApp && <span className="menu-active-app">{activeApp.name}</span>}
      </div>
      <button className="command-trigger" onClick={onSearch}>
        <span>Search</span>
        <kbd>Ctrl K</kbd>
      </button>
      <div className="menu-right">
        <button className="menu-status" onClick={onNotifications}>
          <span className="status-dot" />
          {unread > 0 ? `${unread} new` : "No alerts"}
        </button>
        <button className="menu-icon-button" onClick={onQuickSettings} aria-label="Quick settings">
          <span className="quick-settings-glyph" />
        </button>
        <button className="clock-button">
          <span>{now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span>
          <strong>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
        </button>
      </div>
    </header>
  );
}
