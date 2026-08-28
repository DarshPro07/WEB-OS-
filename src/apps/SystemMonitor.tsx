export default function SystemMonitor() {
  const rows = [
    ["AGENT LOAD", 44],
    ["MEMORY", 31],
    ["NETWORK", 18],
    ["THREAT LEVEL", 7],
  ];

  return (
    <div>
      <p className="eyebrow">NITRO TELEMETRY</p>
      <h2>System Monitor</h2>
      <div className="meters">
        {rows.map(([name, value]) => (
          <div className="meter" key={String(name)}>
            <div className="meter-label">
              <span>{name}</span><b>{value}%</b>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
