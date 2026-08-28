import {
  useRef,
  useState,
} from "react";

import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

type Props = {
  title: string;
  subtitle?: string;
  icon?: string;

  children: ReactNode;

  x: number;
  y: number;

  width?: number;
  height?: number;

  zIndex?: number;
  active?: boolean;

  onFocus?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
};

export default function Window({
  title,
  subtitle,
  icon = "✦",

  children,

  x,
  y,

  width = 600,
  height = 480,

  zIndex = 10,
  active = false,

  onFocus,
  onClose,
  onMinimize,
}: Props) {
  const [position, setPosition] =
    useState({
      x,
      y,
    });

  const [maximized, setMaximized] =
    useState(false);

  const previousPosition = useRef({
    x,
    y,
  });

  const drag = useRef<{
    dx: number;
    dy: number;
  } | null>(null);

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (maximized) return;

    if (
      (event.target as HTMLElement).closest(
        "button",
      )
    ) {
      return;
    }

    onFocus?.();

    const windowElement =
      event.currentTarget.parentElement;

    if (!windowElement) return;

    const rect =
      windowElement.getBoundingClientRect();

    drag.current = {
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!drag.current) return;

    if (maximized) return;

    const nextX =
      event.clientX - drag.current.dx;

    const nextY =
      event.clientY - drag.current.dy;

    const minX = 8;

    const maxX =
      window.innerWidth - 180;

    const minY = 42;

    const maxY =
      window.innerHeight - 80;

    setPosition({
      x: Math.min(
        Math.max(nextX, minX),
        maxX,
      ),

      y: Math.min(
        Math.max(nextY, minY),
        maxY,
      ),
    });
  }

  function stopDragging() {
    drag.current = null;
  }

  function toggleMaximize() {
    if (!maximized) {
      previousPosition.current =
        position;
    } else {
      setPosition(
        previousPosition.current,
      );
    }

    setMaximized(
      (current) => !current,
    );
  }

  return (
    <section
      className={[
        "os-window",

        active
          ? "os-window-active"
          : "",

        maximized
          ? "os-window-maximized"
          : "",
      ].join(" ")}
      style={
        maximized
          ? {
              zIndex,
            }
          : {
              left: position.x,
              top: position.y,
              width,
              height,
              zIndex,
            }
      }
      onPointerDown={onFocus}
    >
      <header
        className="window-titlebar"
        onDoubleClick={toggleMaximize}
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          stopDragging
        }
        onPointerCancel={
          stopDragging
        }
      >
        <div className="window-identity">
          <div className="window-icon">
            {icon}
          </div>

          <div className="window-title-copy">
            <strong>
              {title}
            </strong>

            {subtitle && (
              <small>
                {subtitle}
              </small>
            )}
          </div>
        </div>

        <div className="window-controls">

          <button
            onClick={onMinimize}
            aria-label="Minimize"
          >
            <span className="minimize-symbol" />
          </button>

          <button
            onClick={toggleMaximize}
            aria-label="Maximize"
          >
            <span className="maximize-symbol" />
          </button>

          <button
            className="window-close"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="close-symbol" />
          </button>

        </div>
      </header>

      <div className="window-content">
        {children}
      </div>
    </section>
  );
}