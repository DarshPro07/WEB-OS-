import {
  useOS,
} from "../../core/OSContext";


export default function SettingsApp() {

  const {
    state,

    setTheme,

    setAccent,

    setReducedMotion,
  } = useOS();


  return (

    <div className="app-page">

      <header className="app-hero compact">

        <span className="app-kicker">
          NEXUS
        </span>

        <h1>
          Settings
        </h1>

      </header>


      <section className="settings-card">

        <div className="settings-description">

          <strong>
            Appearance
          </strong>

          <span>
            Choose how the desktop looks.
          </span>

        </div>


        <div className="settings-control">

          <button
            className={
              state.settings.theme ===
              "dark"
                ? "selected"
                : ""
            }

            onClick={() =>
              setTheme(
                "dark",
              )
            }
          >
            Dark
          </button>


          <button
            className={
              state.settings.theme ===
              "dim"
                ? "selected"
                : ""
            }

            onClick={() =>
              setTheme(
                "dim",
              )
            }
          >
            Dim
          </button>

        </div>

      </section>


      <section className="settings-card">

        <div className="settings-description">

          <strong>
            Accent
          </strong>

          <span>
            Used only for important actions.
          </span>

        </div>


        <div className="accent-picker">

          {(
            [
              "lime",
              "blue",
              "violet",
            ] as const
          ).map(
            (
              accent,
            ) => (

              <button
                key={
                  accent
                }

                className={[
                  "accent-choice",

                  `accent-${accent}`,

                  state.settings.accent ===
                  accent
                    ? "selected"
                    : "",
                ].join(" ")}

                onClick={() =>
                  setAccent(
                    accent,
                  )
                }
              />

            ),
          )}

        </div>

      </section>


      <section className="settings-card">

        <div className="settings-description">

          <strong>
            Reduced motion
          </strong>

          <span>
            Minimize interface animation.
          </span>

        </div>


        <button
          className={[
            "switch",

            state.settings.reducedMotion
              ? "on"
              : "",
          ].join(" ")}

          onClick={() =>
            setReducedMotion(
              !state.settings
                .reducedMotion,
            )
          }
        >

          <span />

        </button>

      </section>


      <section className="zpp-card">

        <span>
          ◇
        </span>


        <div>

          <strong>
            Z++ Policy
          </strong>

          <p>
            Protected actions require explicit permission and are written to the audit ledger.
          </p>

        </div>

      </section>

    </div>
  );
}