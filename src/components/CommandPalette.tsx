import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { AppId } from "../core/types";

export type PaletteApp = {
  id: AppId;
  name: string;
  icon: LucideIcon;
  description: string;
  keywords?: string[];
};

type Props = {
  open: boolean;
  apps: PaletteApp[];

  onClose: () => void;

  onOpenApp: (
    id: AppId,
  ) => void;
};

export default function CommandPalette({
  open,
  apps,
  onClose,
  onOpenApp,
}: Props) {
  const [query, setQuery] =
    useState("");

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const filteredApps = useMemo(() => {
    const clean =
      query.trim().toLowerCase();

    if (!clean) {
      return apps;
    }

    return apps.filter((app) => {
      const searchTarget = [
        app.name,
        app.description,
        ...(app.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchTarget.includes(
        clean,
      );
    });
  }, [apps, query]);

  useEffect(() => {
    if (!open) return;

    setQuery("");
    setSelectedIndex(0);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function launch(
    id: AppId,
  ) {
    onOpenApp(id);
    onClose();
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      setSelectedIndex(
        (current) =>
          Math.min(
            current + 1,
            filteredApps.length - 1,
          ),
      );
    }

    if (
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      setSelectedIndex(
        (current) =>
          Math.max(
            current - 1,
            0,
          ),
      );
    }

    if (
      event.key === "Enter"
    ) {
      event.preventDefault();

      const selected =
        filteredApps[
          selectedIndex
        ];

      if (selected) {
        launch(selected.id);
      }
    }

    if (
      event.key === "Escape"
    ) {
      onClose();
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="command-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="palette-search">

          <span className="palette-search-icon">
            <Search
              size={15}
              strokeWidth={1.5}
            />
          </span>

          <input
            ref={inputRef}
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="Search apps and commands"
            autoComplete="off"
          />

          <kbd>
            esc
          </kbd>

        </div>

        <div className="palette-section-label">
          {query
            ? "Results"
            : "Applications"}
        </div>

        <div className="palette-results">

          {filteredApps.length === 0 && (
            <div className="palette-empty">

              <span>
                No results
              </span>

              <small>
                Try another search.
              </small>

            </div>
          )}

          {filteredApps.map(
            (app, index) => {
              const Icon = app.icon;

              return (
              <button
                key={app.id}
                className={[
                  "palette-result",

                  index ===
                  selectedIndex
                    ? "palette-result-selected"
                    : "",
                ].join(" ")}
                onMouseEnter={() =>
                  setSelectedIndex(
                    index,
                  )
                }
                onClick={() =>
                  launch(app.id)
                }
              >
                <span className="palette-app-icon">
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                  />
                </span>

                <span className="palette-result-copy">
                  <strong>
                    {app.name}
                  </strong>

                  <small>
                    {
                      app.description
                    }
                  </small>
                </span>

                {index ===
                  selectedIndex && (
                  <span className="palette-enter">
                    ↵
                  </span>
                )}

              </button>
              );
            },
          )}

        </div>

        <footer className="palette-footer">

          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            navigate
          </span>

          <span>
            <kbd>↵</kbd>
            open
          </span>

          <span>
            <kbd>esc</kbd>
            close
          </span>

        </footer>

      </section>
    </div>
  );
}