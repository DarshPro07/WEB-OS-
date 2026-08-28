import { useEffect, useState } from "react";
import { useOS } from "../core/OSContext";

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
  return (
    <header className="menu-bar">
      <div className="menu-left"><button className="system-mark" onClick={onSearch}>✦</button><strong className="menu-brand">NEXUS</strong><button className="menu-item">Workspace</button><button className="menu-item">View</button><button className="menu-item">Window</button></div>
      <button className="command-trigger" onClick={onSearch}><span>⌕</span><span>Search</span><kbd>Ctrl K</kbd></button>
      <div className="menu-right"><button className="menu-status" onClick={onNotifications}><span className="status-dot" />{unread > 0 ? `${unread} new` : "Protected"}</button><button className="menu-icon-button" onClick={onQuickSettings}>◐</button><button className="clock-button"><span>{now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span><strong>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong></button></div>
    </header>
  );
}
