import type { ReactNode } from "react";
import { appRegistry } from "../../core/appRegistry";
import { useOS } from "../../core/OSContext";
import type { AppId } from "../../core/types";

interface Props {
  appId: AppId;
  children: ReactNode;
}

export default function OSWindow({ appId, children }: Props) {
  const { state, focusApp, closeApp, minimizeApp, toggleMaximize, moveApp, resizeApp } = useOS();
  const windowState = state.windows[appId];
  const app = appRegistry[appId];

  if (!windowState.open || windowState.minimized) return null;

  return (
    <section
      className={`os-window ${state.activeAppId === appId ? "os-window-active" : ""} ${windowState.maximized ? "os-window-maximized" : ""}`}
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
          const move = (moveEvent: PointerEvent) =>
            moveApp(appId, originX + moveEvent.clientX - startX, originY + moveEvent.clientY - startY);
          const stop = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", stop);
          };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", stop, { once: true });
        }}
      >
        <div className="window-identity">
          <div className="window-icon">{app.icon}</div>
          <div className="window-title-copy"><strong>{app.name}</strong><small>{app.description}</small></div>
        </div>
        <div className="window-controls">
          <button onClick={() => minimizeApp(appId)} aria-label="Minimize"><span className="minimize-symbol" /></button>
          <button onClick={() => toggleMaximize(appId)} aria-label="Maximize"><span className="maximize-symbol" /></button>
          <button className="window-close" onClick={() => closeApp(appId)} aria-label="Close"><span className="close-symbol" /></button>
        </div>
      </header>
      <div className="window-content">{children}</div>
    </section>
  );
}