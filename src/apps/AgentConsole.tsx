import { useState } from "react";
import { executeSafeAction } from "../state/agentEngine";
import type { AuditEvent } from "../state/types";

type Props = {
  onAudit: (event: AuditEvent) => void;
};

export default function AgentConsole({ onAudit }: Props) {
  const [goal, setGoal] = useState("");
  const [output, setOutput] = useState("Agent ready.");

  const run = () => {
    const clean = goal.trim();
    if (!clean) return;
    const event = executeSafeAction(
      `User objective: ${clean}`,
      "read:system",
      "NEXUS"
    );
    onAudit(event);
    setOutput(
      `Plan created safely. Current scaffold does not execute arbitrary system commands. Objective recorded: "${clean}"`
    );
    setGoal("");
  };

  return (
    <div>
      <p className="eyebrow">AGENT CORE</p>
      <h2>Give NEXUS an objective</h2>
      <div className="goal-row">
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Check system security posture"
          onKeyDown={(e) => e.key === "Enter" && run()}
        />
        <button onClick={run}>Run</button>
      </div>
      <div className="agent-output">{output}</div>
      <p className="muted small">
        Phase 1 is intentionally sandboxed: no arbitrary shell execution yet.
      </p>
    </div>
  );
}
