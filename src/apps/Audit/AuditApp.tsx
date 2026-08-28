import {
  useOS,
} from "../../core/OSContext";


export default function AuditApp() {

  const {
    state,
  } = useOS();


  return (

    <div className="app-page">

      <header className="app-toolbar">

        <div>

          <span className="app-kicker">
            Zero silent actions
          </span>

          <h1>
            Audit
          </h1>

        </div>


        <span className="count-badge">
          {
            state.audit.length
          }
        </span>

      </header>


      <div className="audit-list">

        {state.audit.length ===
          0 && (

          <div className="empty-state">

            <span>
              ≡
            </span>

            <strong>
              No recorded actions
            </strong>

            <p>
              Permission decisions and agent activity will appear here.
            </p>

          </div>

        )}


        {state.audit.map(
          (
            entry,
          ) => (

            <article
              key={
                entry.id
              }

              className="audit-row"
            >

              <span
                className={`audit-level ${entry.level}`}
              />


              <div className="audit-main">

                <div>

                  <strong>
                    {
                      entry.action
                    }
                  </strong>

                  <span>
                    {
                      entry.actor
                    }
                  </span>

                </div>


                {entry.detail && (

                  <p>
                    {
                      entry.detail
                    }
                  </p>

                )}

              </div>


              <time>

                {new Date(
                  entry.createdAt,
                ).toLocaleTimeString(
                  [],
                  {
                    hour:
                      "2-digit",

                    minute:
                      "2-digit",
                  },
                )}

              </time>

            </article>

          ),
        )}

      </div>

    </div>
  );
}