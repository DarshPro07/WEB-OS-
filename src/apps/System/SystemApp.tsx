import { useEffect, useState } from "react";
import { useOS } from "../../core/OSContext";

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

export default function SystemApp() {
  const { state } = useOS();

  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    function onResize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;

  const openWindows = Object.values(state.windows).filter((w) => w.open && !w.minimized).length;

  const rows: Array<[string, string]> = [
    ["Viewport", `${viewport.width} × ${viewport.height}`],
    ["Pixel ratio", `${window.devicePixelRatio}x`],
    ["Platform", navigator.platform || "unknown"],
    ["Language", navigator.language],
    ["Online", navigator.onLine ? "yes" : "no"],
    ["Open windows", String(openWindows)],
    ["Audit entries", String(state.audit.length)],
  ];

  if (perfMemory) {
    rows.push(["JS heap used", formatBytes(perfMemory.usedJSHeapSize)]);
    rows.push(["JS heap limit", formatBytes(perfMemory.jsHeapSizeLimit)]);
  }

  return (
    <div className="app-page">
      <h1>System</h1>

      <div className="system-rows">
        {rows.map(([label, value]) => (
          <div className="system-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
