import type { AuditEvent, Permission, Risk } from "./types";

const grantedPermissions = new Set<Permission>([
  "read:system",
  "read:security",
  "write:notes",
  "run:simulation",
]);

function riskFor(permission: Permission): Risk {
  if (permission === "run:simulation") return "MEDIUM";
  return "LOW";
}

export function executeSafeAction(
  action: string,
  permission: Permission,
  agent = "NEXUS"
): AuditEvent {
  const allowed = grantedPermissions.has(permission);
  return {
    id: crypto.randomUUID(),
    time: new Date().toLocaleTimeString(),
    agent,
    action,
    permission,
    result: allowed ? "Allowed and recorded" : "Blocked by Z++ policy",
    risk: allowed ? riskFor(permission) : "HIGH",
  };
}
