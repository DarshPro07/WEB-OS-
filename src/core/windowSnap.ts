// Window x/y are relative to .desktop-space, which starts below the menu bar.
const DESKTOP_TOP = 40;
const DOCK_HEIGHT = 40;

const SIDE_EDGE = 24;
const TOP_EDGE = 12;

export type SnapEdge = "left" | "right" | "top";

export function detectSnapEdge(clientX: number, clientY: number): SnapEdge | null {
  if (clientY <= TOP_EDGE) return "top";
  if (clientX <= SIDE_EDGE) return "left";
  if (clientX >= window.innerWidth - SIDE_EDGE) return "right";
  return null;
}

export interface SnapBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function computeHalfSnapBounds(edge: "left" | "right"): SnapBounds {
  const width = Math.round(window.innerWidth / 2);
  return {
    x: edge === "left" ? 0 : window.innerWidth - width,
    y: 0,
    width,
    height: window.innerHeight - DESKTOP_TOP - DOCK_HEIGHT,
  };
}
