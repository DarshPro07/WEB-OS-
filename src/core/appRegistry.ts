import type {
  AppId,
  WindowBounds,
} from "./types";


export interface AppDefinition {
  id: AppId;

  name: string;

  description: string;

  icon: string;

  keywords: string[];

  defaultBounds:
    WindowBounds;
}


export const appRegistry:
  Record<
    AppId,
    AppDefinition
  > = {

  nexus: {
    id: "nexus",

    name: "Nexus",

    description:
      "Agent workspace",

    icon: "✦",

    keywords: [
      "agent",
      "assistant",
      "tasks",
      "workspace",
      "ai",
    ],

    defaultBounds: {
      x: 120,
      y: 82,

      width: 720,
      height: 560,
    },
  },


  sentinel: {
    id: "sentinel",

    name: "Sentinel",

    description:
      "Security posture",

    icon: "◇",

    keywords: [
      "security",
      "scan",
      "browser",
      "cyber",
      "risk",
    ],

    defaultBounds: {
      x: 420,
      y: 105,

      width: 580,
      height: 540,
    },
  },


  audit: {
    id: "audit",

    name: "Audit",

    description:
      "System activity",

    icon: "≡",

    keywords: [
      "logs",
      "events",
      "activity",
      "history",
      "z++",
    ],

    defaultBounds: {
      x: 360,
      y: 135,

      width: 620,
      height: 500,
    },
  },


  system: {
    id: "system",

    name: "System",

    description:
      "Runtime information",

    icon: "⌁",

    keywords: [
      "performance",
      "hardware",
      "browser",
      "system",
      "runtime",
    ],

    defaultBounds: {
      x: 400,
      y: 115,

      width: 540,
      height: 500,
    },
  },


  notes: {
    id: "notes",

    name: "Notes",

    description:
      "Local notes",

    icon: "□",

    keywords: [
      "notes",
      "write",
      "text",
      "ideas",
    ],

    defaultBounds: {
      x: 300,
      y: 95,

      width: 600,
      height: 520,
    },
  },


  settings: {
    id: "settings",

    name: "Settings",

    description:
      "NEXUS preferences",

    icon: "⚙",

    keywords: [
      "settings",
      "theme",
      "appearance",
      "preferences",
    ],

    defaultBounds: {
      x: 400,
      y: 115,

      width: 560,
      height: 500,
    },
  },
};


export const appList =
  Object.values(
    appRegistry,
  );