import type { AuditEvent } from "../state/types";

export default function Ledger({ events }: { events: AuditEvent[] }) {
  return (
    <div>
      <p className="eyebrow">ZERO SILENT ACTIONS</p>
      <h2>Audit Ledger</h2>
      <div className="ledger">
        {events.length === 0 && <p className="muted">No agent actions yet.</p>}
        {events.map((event) => (
          <article key={event.id} className="ledger-event">
            <div className="ledger-meta">
              <span>{event.time}</span>
              <span>{event.agent}</span>
              <span className={`risk ${event.risk.toLowerCase()}`}>{event.risk}</span>
            </div>
            <strong>{event.action}</strong>
            <p>{event.permission} · {event.result}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
