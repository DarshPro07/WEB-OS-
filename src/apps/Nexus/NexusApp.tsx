import {
  useState,
} from "react";


import {
  useOS,
} from "../../core/OSContext";


interface Task {
  id: string;

  objective: string;

  status:
    "complete"
    | "blocked";

  createdAt: string;
}


const suggestions = [
  "Review this workspace",
  "Check browser security posture",
  "Show recent system activity",
];


function delay(
  milliseconds:
    number,
) {

  return new Promise<void>(
    (
      resolve,
    ) => {

      setTimeout(
        resolve,
        milliseconds,
      );
    },
  );
}


export default function NexusApp() {

  const {
    requestPermission,

    audit,

    notify,
  } = useOS();


  const [
    objective,
    setObjective,
  ] = useState("");


  const [
    working,
    setWorking,
  ] = useState(false);


  const [
    tasks,
    setTasks,
  ] =
    useState<Task[]>([]);


  async function run(
    value =
      objective,
  ) {

    const clean =
      value.trim();


    if (
      !clean ||
      working
    ) {
      return;
    }


    setWorking(
      true,
    );


    const allowed =
      await requestPermission({

        permission:
          "read:workspace",

        appId:
          "nexus",

        actor:
          "Nexus",

        reason:
          "Nexus needs read-only workspace context to prepare this task.",

        resources: [
          "Current NEXUS workspace",
          "Application metadata",
        ],
      });


    if (
      !allowed
    ) {

      setTasks(
        (
          current,
        ) => [
          {
            id:
              String(
                Date.now(),
              ),

            objective:
              clean,

            status:
              "blocked",

            createdAt:
              new Date().toISOString(),
          },

          ...current,
        ],
      );


      setWorking(
        false,
      );

      return;
    }


    await delay(
      550,
    );


    audit({
      actor:
        "Nexus",

      action:
        "Prepared task plan",

      detail:
        clean,

      level:
        "success",
    });


    notify({
      source:
        "Nexus",

      title:
        "Task plan ready",

      message:
        clean,

      level:
        "success",
    });


    setTasks(
      (
        current,
      ) => [
        {
          id:
            String(
              Date.now(),
            ),

          objective:
            clean,

          status:
            "complete",

          createdAt:
            new Date().toISOString(),
        },

        ...current,
      ],
    );


    setObjective("");

    setWorking(
      false,
    );
  }


  return (

    <div className="app-page nexus-page">

      <header className="app-hero">

        <span className="app-kicker">
          Personal workspace
        </span>


        <h1>
          What do you want to do?
        </h1>


        <p>
          Nexus plans work and requests access before touching protected resources.
        </p>

      </header>


      <div className="suggestion-row">

        {suggestions.map(
          (
            suggestion,
          ) => (

            <button
              key={
                suggestion
              }

              onClick={() =>
                run(
                  suggestion,
                )
              }
            >
              {
                suggestion
              }
            </button>

          ),
        )}

      </div>


      <div className="nexus-composer">

        <textarea
          value={
            objective
          }

          onChange={
            (
              event,
            ) =>
              setObjective(
                event.target
                  .value,
              )
          }

          placeholder="Ask Nexus to do something…"

          onKeyDown={
            (
              event,
            ) => {

              if (
                event.key ===
                  "Enter" &&
                !event.shiftKey
              ) {

                event.preventDefault();

                run();
              }
            }
          }
        />


        <footer>

          <span>
            Z++ permission aware
          </span>


          <button
            onClick={() =>
              run()
            }

            disabled={
              !objective.trim() ||
              working
            }
          >
            {working
              ? "…"
              : "↑"}
          </button>

        </footer>

      </div>


      <section className="app-section">

        <div className="section-heading">

          <h2>
            Recent activity
          </h2>

          <span>
            {
              tasks.length
            }
          </span>

        </div>


        {tasks.length ===
          0 ? (

          <div className="empty-state">

            <span>
              ✦
            </span>

            <strong>
              No tasks yet
            </strong>

            <p>
              Start with one of the suggestions above.
            </p>

          </div>

        ) : (

          <div className="task-list">

            {tasks.map(
              (
                task,
              ) => (

                <article
                  key={
                    task.id
                  }

                  className="task-row"
                >

                  <span
                    className={`task-status ${task.status}`}
                  >
                    {task.status ===
                    "complete"
                      ? "✓"
                      : "×"}
                  </span>


                  <div>

                    <strong>
                      {
                        task.objective
                      }
                    </strong>

                    <small>
                      {task.status ===
                      "complete"
                        ? "Plan prepared"
                        : "Blocked by policy"}
                    </small>

                  </div>

                </article>

              ),
            )}

          </div>

        )}

      </section>

    </div>
  );
}