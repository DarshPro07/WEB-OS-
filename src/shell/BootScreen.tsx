import { useEffect } from "react";
import { useOS } from "../core/OSContext";
import NexusMark from "../components/NexusMark";

export default function BootScreen() {
  const { completeBoot } = useOS();
  useEffect(() => {
    const timer = window.setTimeout(completeBoot, 850);
    return () => window.clearTimeout(timer);
  }, [completeBoot]);

  return (
    <main className="boot-screen" aria-label="Starting NEXUS">
      <div className="boot-mark"><NexusMark size={30} /></div>
      <strong>NEXUS</strong>
      <span>Loading…</span>
      <div className="boot-progress"><i /></div>
    </main>
  );
}
