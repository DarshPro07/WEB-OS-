import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOS } from "../../core/OSContext";

const HOME_URL = "https://www.youtube.com";

function normalizeUrl(value: string) {
  const clean = value.trim();
  if (!clean) return "";
  if (/^https?:\/\//i.test(clean)) return clean;
  if (/^[\w-]+(\.[\w-]+)+.*$/.test(clean)) return `https://${clean}`;
  return `https://www.google.com/search?q=${encodeURIComponent(clean)}`;
}

export default function BrowserApp() {
  const { audit } = useOS();

  const [input, setInput] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const loadTimer = useRef<number | null>(null);

  function go(target: string, options?: { record?: boolean }) {
    const normalized = normalizeUrl(target);
    if (!normalized) return;

    const record = options?.record ?? true;

    setInput(normalized);
    setUrl(normalized);
    setBlocked(false);
    setLoading(true);

    if (record) {
      setHistory((current) => {
        const trimmed = current.slice(0, historyIndex + 1);
        return [...trimmed, normalized];
      });
      setHistoryIndex((current) => current + 1);
    }

    audit({
      actor: "Browser",
      action: "Opened site",
      detail: normalized,
      level: "info",
    });

    if (loadTimer.current !== null) window.clearTimeout(loadTimer.current);
    loadTimer.current = window.setTimeout(() => {
      setLoading(false);
      setBlocked(true);
    }, 6000);
  }

  function back() {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    go(history[nextIndex], { record: false });
  }

  function forward() {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    go(history[nextIndex], { record: false });
  }

  useEffect(() => {
    return () => {
      if (loadTimer.current !== null) window.clearTimeout(loadTimer.current);
    };
  }, []);

  const canBack = historyIndex > 0;
  const canForward = historyIndex < history.length - 1;

  return (
    <div className="browser-app">
      <div className="browser-bar">
        <div className="browser-nav">
          <button aria-label="Back" disabled={!canBack} onClick={back}><ChevronLeft size={16} strokeWidth={1.5} /></button>
          <button aria-label="Forward" disabled={!canForward} onClick={forward}><ChevronRight size={16} strokeWidth={1.5} /></button>
        </div>

        <form
          className="browser-address"
          onSubmit={(event) => {
            event.preventDefault();
            go(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter a URL or search"
            autoComplete="off"
            spellCheck={false}
          />
        </form>

        <button className="browser-go" onClick={() => go(input)} disabled={!input.trim()}>
          Go
        </button>

        <button className="browser-youtube" onClick={() => go(HOME_URL)}>
          YouTube
        </button>
      </div>

      <div className="browser-viewport">
        {!url && (
          <div className="empty-state">
            <strong>Nothing open yet</strong>
            <p>Enter a URL above, or use the YouTube shortcut to get started.</p>
          </div>
        )}

        {url && (
          <>
            {loading && <div className="browser-loading">Loading…</div>}

            {blocked && !loading && (
              <div className="browser-blocked">
                <strong>This site can't be embedded</strong>
                <p>{url}</p>
                <a href={url} target="_blank" rel="noreferrer">
                  Open in a new tab
                </a>
              </div>
            )}

            <iframe
              key={url}
              src={url}
              title="Site browser"
              className={blocked ? "browser-frame browser-frame-hidden" : "browser-frame"}
              onLoad={() => {
                if (loadTimer.current !== null) window.clearTimeout(loadTimer.current);
                setLoading(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
