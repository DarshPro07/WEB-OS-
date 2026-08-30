import { useState, type ReactNode } from "react";
import { Copy, Minus, Square, X } from "lucide-react";
import { appRegistry } from "../../core/appRegistry";
import { useOS } from "../../core/OSContext";
import type { AppId } from "../../core/types";
import { computeHalfSnapBounds, detectSnapEdge } from "../../core/windowSnap";

interface Props {
  appId: AppId;
  children: ReactNode;
}

const MIN_WIDTH = 360;
const MIN_HEIGHT = 260;

export default function OSWindow({ appId, children }: Props) {
  const { state, focusApp, closeApp, minimizeApp, toggleMaximize, setMaximized, moveApp, resizeApp } = useOS();
  const windowState = state.windows[appId];
  const app = appRegistry[appId];
  const Icon = app.icon;
  const [snapHint, setSnapHint] = useState(false);

  if (!windowState.open || windowState.minimized) return null;

  return (
    <section
      className={`os-window ${state.activeAppId === appId ? "os-window-active" : ""} ${windowState.maximized ? "os-window-maximized" : ""} ${snapHint ? "os-window-snap-hint" : ""}`}
      style={{
        left: windowState.maximized ? undefined : windowState.x,
        top: windowState.maximized ? undefined : windowState.y,
        width: windowState.maximized ? undefined : windowState.width,
        height: windowState.maximized ? undefined : windowState.height,
        zIndex: windowState.z,
      }}
      onPointerDown={() => focusApp(appId)}
    >
      <header
        className="window-titlebar"
        onDoubleClick={() => toggleMaximize(appId)}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          focusApp(appId);
          const startX = event.clientX;
          const startY = event.clientY;
          const originX = windowState.x;
          const originY = windowState.y;
          const move = (moveEvent: PointerEvent) => {
            moveApp(appId, originX + moveEvent.clientX - startX, originY + moveEvent.clientY - startY);
            setSnapHint(detectSnapEdge(moveEvent.clientX, moveEvent.clientY) !== null);
          };
          const stop = (upEvent: PointerEvent) => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", stop);
            setSnapHint(false);
            const edge = detectSnapEdge(upEvent.clientX, upEvent.clientY);
            if (edge === "top") {
              setMaximized(appId, true);
            } else if (edge === "left" || edge === "right") {
              setMaximized(appId, false);
              const bounds = computeHalfSnapBounds(edge);
              moveApp(appId, bounds.x, bounds.y);
              resizeApp(appId, bounds.width, bounds.height);
            }
          };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", stop, { once: true });
        }}
      >
        <div className="window-identity">
          <div className="window-icon"><Icon size={14} strokeWidth={1.5} /></div>
          <div className="window-title-copy"><strong>{app.name}</strong><small>{app.description}</small></div>
        </div>
        <div className="window-controls">
          <button onClick={() => minimizeApp(appId)} aria-label="Minimize"><Minus size={14} strokeWidth={1.5} /></button>
          <button onClick={() => toggleMaximize(appId)} aria-label={windowState.maximized ? "Restore" : "Maximize"}>
            {windowState.maximized ? <Copy size={12} strokeWidth={1.5} /> : <Square size={12} strokeWidth={1.5} />}
          </button>
          <button className="window-close" onClick={() => closeApp(appId)} aria-label="Close"><X size={14} strokeWidth={1.5} /></button>
        </div>
      </header>
      <div className="window-content">{children}</div>
      {!windowState.maximized && (
        <span
          className="window-resize-handle"
          onPointerDown={(event) => {
            event.stopPropagation();
            focusApp(appId);
            const startX = event.clientX;
            const startY = event.clientY;
            const originWidth = windowState.width;
            const originHeight = windowState.height;
            const move = (moveEvent: PointerEvent) => {
              resizeApp(
                appId,
                Math.max(MIN_WIDTH, originWidth + moveEvent.clientX - startX),
                Math.max(MIN_HEIGHT, originHeight + moveEvent.clientY - startY),
              );
            };
            const stop = () => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", stop);
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", stop, { once: true });
          }}
          aria-hidden="true"
        />
      )}
    </section>
  );
}