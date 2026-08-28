import { executeSafeAction } from "../state/agentEngine";
import type { AuditEvent } from "../state/types";

type Props = {
  onAudit: (event: AuditEvent) => void;
};

export default function Sentinel({ onAudit }: Props) {
  const checks = [
    ["Permissions", "PASS"],
    ["Audit logging", "PASS"],
    ["Secret exposure", "PASS"],
    ["Arbitrary execution", "BLOCKED"],
  ];

  const scan = () => {
    onAudit(
      executeSafeAction(
        "Run local defensive security posture simulation",
        "read:security",
        "Sentinel"
      )
    );
  };

  return (
    <div>
      <p className="eyebrow">DEFENSIVE SECURITY AGENT</p>
      <div className="score">92</div>
      <div className="score-label">SECURITY SCORE</div>

      <div className="check-list">
        {checks.map(([name, status]) => (
          <div className="check-row" key={name}>
            <span>{name}</span>
            <strong>{status}</strong>
          </div>
        ))}
      </div>

      <button className="wide-button" onClick={scan}>
        Run safe security scan
      </button>
    </div>
  );
}
