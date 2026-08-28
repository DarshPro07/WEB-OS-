export type Mode = "nexus" | "matrix" | "nitro";

export type Permission =
  | "read:system"
  | "read:security"
  | "write:notes"
  | "run:simulation";

export type Risk = "LOW" | "MEDIUM" | "HIGH";

export type AuditEvent = {
  id: string;
  time: string;
  agent: string;
  action: string;
  permission: Permission;
  result: string;
  risk: Risk;
};

export type WindowId = "agent" | "sentinel" | "ledger" | "system";
