export type AppId =
  | "nexus"
  | "sentinel"
  | "audit"
  | "system"
  | "notes"
  | "settings";


export type ThemeMode =
  | "dark"
  | "dim";


export type AccentName =
  | "lime"
  | "blue"
  | "violet";


export type PermissionName =
  | "read:workspace"
  | "security:scan"
  | "audit:read"
  | "settings:write";


export type AuditLevel =
  | "info"
  | "success"
  | "warning"
  | "danger";


export interface WindowBounds {
  x: number;
  y: number;

  width: number;
  height: number;
}


export interface AppWindow
  extends WindowBounds {

  appId: AppId;

  open: boolean;

  minimized: boolean;

  maximized: boolean;

  z: number;
}


export interface NotificationItem {
  id: string;

  title: string;

  message: string;

  source: string;

  createdAt: string;

  read: boolean;

  level:
    | "info"
    | "success"
    | "warning"
    | "danger";
}


export interface PermissionRequest {
  id: string;

  permission: PermissionName;

  appId: AppId;

  actor: string;

  reason: string;

  resources: string[];

  createdAt: string;
}


export interface AuditEntry {
  id: string;

  actor: string;

  action: string;

  detail?: string;

  level: AuditLevel;

  createdAt: string;
}


export interface OSSettings {
  theme: ThemeMode;

  accent: AccentName;

  reducedMotion: boolean;
}


export interface OSState {
  windows: Record<
    AppId,
    AppWindow
  >;

  activeAppId:
    | AppId
    | null;

  zCounter: number;

  notifications:
    NotificationItem[];

  permissionQueue:
    PermissionRequest[];

  audit:
    AuditEntry[];

  settings:
    OSSettings;

  bootComplete: boolean;
}