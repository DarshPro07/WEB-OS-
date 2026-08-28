import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useOS,
} from "../../core/OSContext";

const STORAGE_KEY =
  "nexus.notes.v1";

function loadNotes() {
  try {
    return (
      localStorage.getItem(
        STORAGE_KEY,
      ) ?? ""
    );
  } catch {
    return "";
  }
}

export default function NotesApp() {
  const {
    audit,
    notify,
  } = useOS();

  const [
    notes,
    setNotes,
  ] = useState(
    loadNotes,
  );

  const [
    status,
    setStatus,
  ] = useState(
    "Saved locally",
  );

  const saveTimer =
    useRef<number | null>(
      null,
    );

  const initialized =
    useRef(false);

  function save(
    value = notes,
    announce = false,
  ) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        value,
      );

      setStatus(
        "Saved locally",
      );

      if (announce) {
        audit({
          actor:
            "Notes",

          action:
            "Saved note",

          detail:
            `${value.length} characters stored locally.`,

          level:
            "success",
        });

        notify({
          source:
            "Notes",

          title:
            "Note saved",

          message:
            "Your note is stored on this device.",

          level:
            "success",
        });
      }
    } catch {
      setStatus(
        "Unable to save",
      );

      if (announce) {
        notify({
          source:
            "Notes",

          title:
            "Save failed",

          message:
            "Browser storage is unavailable.",

          level:
            "danger",
        });
      }
    }
  }

  useEffect(() => {
    if (
      !initialized.current
    ) {
      initialized.current =
        true;

      return;
    }

    setStatus(
      "Saving…",
    );

    if (
      saveTimer.current !==
      null
    ) {
      window.clearTimeout(
        saveTimer.current,
      );
    }

    saveTimer.current =
      window.setTimeout(
        () => {
          save(
            notes,
          );
        },
        500,
      );

    return () => {
      if (
        saveTimer.current !==
        null
      ) {
        window.clearTimeout(
          saveTimer.current,
        );
      }
    };
  }, [
    notes,
  ]);

  useEffect(() => {
    function keyboard(
      event: KeyboardEvent,
    ) {
      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key.toLowerCase() ===
          "s"
      ) {
        event.preventDefault();

        save(
          notes,
          true,
        );
      }
    }

    window.addEventListener(
      "keydown",
      keyboard,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        keyboard,
      );
  }, [
    notes,
  ]);

  function downloadNote() {
    const blob =
      new Blob(
        [
          notes,
        ],
        {
          type:
            "text/plain;charset=utf-8",
        },
      );

    const url =
      URL.createObjectURL(
        blob,
      );

    const anchor =
      document.createElement(
        "a",
      );

    anchor.href =
      url;

    anchor.download =
      `nexus-note-${new Date()
        .toISOString()
        .slice(0, 10)}.txt`;

    document.body.appendChild(
      anchor,
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(
      url,
    );

    audit({
      actor:
        "Notes",

      action:
        "Exported note",

      detail:
        "Note exported as a text file.",

      level:
        "info",
    });

    notify({
      source:
        "Notes",

      title:
        "Note exported",

      message:
        "Text file created successfully.",

      level:
        "success",
    });
  }

  function clearNote() {
    if (
      !notes.trim()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear this note? This cannot be undone.",
      );

    if (
      !confirmed
    ) {
      return;
    }

    setNotes("");

    localStorage.removeItem(
      STORAGE_KEY,
    );

    setStatus(
      "Empty note",
    );

    audit({
      actor:
        "Notes",

      action:
        "Cleared note",

      level:
        "warning",
    });

    notify({
      source:
        "Notes",

      title:
        "Note cleared",

      message:
        "The local note has been removed.",

      level:
        "info",
    });
  }

  const words =
    notes.trim()
      ? notes
          .trim()
          .split(/\s+/)
          .length
      : 0;

  const characters =
    notes.length;

  return (
    <div className="notes-app">

      <header className="notes-header">

        <div>

          <span className="app-kicker">
            Local workspace
          </span>

          <h1>
            Notes
          </h1>

          <span className="notes-status">
            {status}
          </span>

        </div>

        <div className="notes-actions">

          <button
            className="notes-action"
            onClick={() =>
              save(
                notes,
                true,
              )
            }
          >
            Save
          </button>

          <button
            className="notes-action"
            onClick={
              downloadNote
            }
            disabled={
              !notes.trim()
            }
          >
            Export
          </button>

          <button
            className="notes-action danger"
            onClick={
              clearNote
            }
            disabled={
              !notes.trim()
            }
          >
            Clear
          </button>

        </div>

      </header>

      <textarea
        value={
          notes
        }
        onChange={(
          event,
        ) =>
          setNotes(
            event.target.value,
          )
        }
        spellCheck
        placeholder={`Write anything here…

Ideas
• New NEXUS feature
• Stardance devlog
• Things to fix

Notes are saved automatically in your browser.`}
      />

      <footer className="notes-footer">

        <div className="notes-metrics">

          <span>
            <strong>
              {words}
            </strong>
            {" "}
            words
          </span>

          <span>
            <strong>
              {characters}
            </strong>
            {" "}
            characters
          </span>

        </div>

        <div className="notes-storage">

          <span className="storage-dot" />

          Local only

          <kbd>
            Ctrl S
          </kbd>

        </div>

      </footer>

    </div>
  );
}