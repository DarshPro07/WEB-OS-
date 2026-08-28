import { useOS } from "../../core/OSContext";

interface Props { open: boolean; onClose: () => void; }

export default function NotificationCenter({ open, onClose }: Props) {
  const { state, markNotificationRead, markAllNotificationsRead, clearNotifications } = useOS();
  if (!open) return null;
  return (
    <aside className="side-panel" role="dialog" aria-label="Notifications">
      <header className="side-panel-header"><div><strong>Notifications</strong><span>{state.notifications.length} events</span></div><button onClick={onClose} aria-label="Close">×</button></header>
      <div className="panel-actions"><button onClick={markAllNotificationsRead}>Mark all read</button><button onClick={clearNotifications}>Clear</button></div>
      <div className="notification-list">
        {state.notifications.length === 0 && <div className="command-empty">No notifications</div>}
        {state.notifications.map((item) => <button className={`notification-item ${item.read ? "" : "unread"}`} key={item.id} onClick={() => markNotificationRead(item.id)}><span className="notification-dot" /><span className="notification-copy"><strong>{item.title}</strong><span>{item.message}</span><small>{item.source}</small></span></button>)}
      </div>
    </aside>
  );
}
