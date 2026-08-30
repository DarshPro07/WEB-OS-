export type AppId =
  | "nexus"
  | "sentinel"
  | "audit"
  | "system"
  | "notes"
  | "browser"
  | "settings";


export type ThemeMode =
  | "light"
  | "dark";


export type AccentName =
  | "blue"
  | "amber"
  | "green";


export type WallpaperId =
  | "dark-thorn-knight"
  | "aurora"
  | "ion"
  | "void"
  | "custom";


export interface WallpaperSettings {
  id: WallpaperId;

  dim: number;

  blur: number;
}


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

  wallpaper: WallpaperSettings;

  widgetsVisible: boolean;
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