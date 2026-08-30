import { useEffect, useState } from "react";
import { useOS } from "../../core/OSContext";

export default function DesktopWidgets() {
  const { state } = useOS();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!state.settings.widgetsVisible) return null;

  const openWindows = Object.values(state.windows).filter((w) => w.open && !w.minimized).length;
  const unread = state.notifications.filter((item) => !item.read).length;

  return (
    <div className="desktop-widget" aria-hidden="true">
      <strong className="desktop-widget-time">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </strong>
      <span className="desktop-widget-date">
        {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
      </span>
      <div className="desktop-widget-divider" />
      <span className="desktop-widget-pulse">
        {openWindows} window{openWindows === 1 ? "" : "s"} · {state.audit.length} events · {unread} unread
      </span>
    </div>
  );
}
