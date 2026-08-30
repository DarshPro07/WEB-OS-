import {
  useState,
} from "react";

import {
  Check,
  TriangleAlert,
} from "lucide-react";


import {
  useOS,
} from "../../core/OSContext";


interface Finding {
  name: string;

  detail: string;

  status:
    "pass"
    | "warning";
}


export default function SentinelApp() {

  const {
    requestPermission,

    audit,

    notify,
  } = useOS();


  const [
    findings,
    setFindings,
  ] =
    useState<Finding[]>(
      [],
    );


  const [
    scanning,
    setScanning,
  ] =
    useState(
      false,
    );


  async function scan() {

    if (
      scanning
    ) {
      return;
    }


    const allowed =
      await requestPermission({

        permission:
          "security:scan",

        appId:
          "sentinel",

        actor:
          "Sentinel",

        reason:
          "Sentinel wants to inspect browser security capabilities.",

        resources: [
          "Browser security context",
          "Current origin",
          "Web platform capabilities",
        ],
      });


    if (
      !allowed
    ) {
      return;
    }


    setScanning(
      true,
    );


    const localhost =
      location.hostname ===
        "localhost" ||
      location.hostname ===
        "127.0.0.1";


    const secureTransport =
      location.protocol ===
        "https:" ||
      localhost;


    const csp =
      Boolean(
        document.querySelector(
          'meta[http-equiv="Content-Security-Policy"]',
        ),
      );


    const results:
      Finding[] = [

      {
        name:
          "Secure transport",

        detail:
          secureTransport
            ? "HTTPS or trusted localhost context."
            : "Page is not using HTTPS.",

        status:
          secureTransport
            ? "pass"
            : "warning",
      },


      {
        name:
          "Secure browser context",

        detail:
          window.isSecureContext
            ? "Secure Context APIs are available."
            : "Browser does not consider this a secure context.",

        status:
          window.isSecureContext
            ? "pass"
            : "warning",
      },


      {
        name:
          "Content Security Policy",

        detail:
          csp
            ? "CSP meta policy detected."
            : "No CSP meta policy detected in this document.",

        status:
          csp
            ? "pass"
            : "warning",
      },


      {
        name:
          "Permissions API",

        detail:
          "permissions" in
          navigator
            ? "Permissions API is supported."
            : "Permissions API is unavailable.",

        status:
          "permissions" in
          navigator
            ? "pass"
            : "warning",
      },


      {
        name:
          "Service Worker support",

        detail:
          "serviceWorker" in
          navigator
            ? "Service Worker API is supported."
            : "Service Workers are unavailable.",

        status:
          "serviceWorker" in
          navigator
            ? "pass"
            : "warning",
      },

    ];


    await new Promise<void>(
      (
        resolve,
      ) =>
        setTimeout(
          resolve,
          650,
        ),
    );


    setFindings(
      results,
    );


    const warnings =
      results.filter(
        (
          result,
        ) =>
          result.status ===
          "warning",
      ).length;


    audit({
      actor:
        "Sentinel",

      action:
        "Completed browser security scan",

      detail:
        `${warnings} warning(s)`,

      level:
        warnings
          ? "warning"
          : "success",
    });


    notify({
      source:
        "Sentinel",

      title:
        "Security scan complete",

      message:
        warnings
          ? `${warnings} item(s) need attention.`
          : "No warnings detected.",

      level:
        warnings
          ? "warning"
          : "success",
    });


    setScanning(
      false,
    );
  }


  const passes =
    findings.filter(
      (
        finding,
      ) =>
        finding.status ===
        "pass",
    ).length;


  return (

    <div className="app-page">

      <header className="app-toolbar">

        <div>

          <h1>
            Sentinel
          </h1>

        </div>


        <button
          className="button-primary"

          onClick={
            scan
          }

          disabled={
            scanning
          }
        >
          {scanning
            ? "Scanning…"
            : "Run scan"}
        </button>

      </header>


      <div className="security-summary">

        <div>

          <strong>
            {findings.length
              ? `${passes}/${findings.length}`
              : "—"}
          </strong>

          <span>
            checks passed
          </span>

        </div>


        <p>
          Sentinel currently performs safe checks against this browser session only.
        </p>

      </div>


      <div className="finding-list">

        {findings.length ===
          0 && (

          <div className="empty-state">

            <strong>
              Ready to inspect
            </strong>

            <p>
              Run a scan to inspect the current browser security environment.
            </p>

          </div>

        )}


        {findings.map(
          (
            finding,
          ) => (

            <article
              key={
                finding.name
              }

              className="finding-row"
            >

              <span
                className={`finding-indicator ${finding.status}`}
              >
                {finding.status ===
                "pass" ? (
                  <Check
                    size={13}
                    strokeWidth={2}
                  />
                ) : (
                  <TriangleAlert
                    size={13}
                    strokeWidth={2}
                  />
                )}
              </span>


              <div>

                <strong>
                  {
                    finding.name
                  }
                </strong>

                <p>
                  {
                    finding.detail
                  }
                </p>

              </div>

            </article>

          ),
        )}

      </div>

    </div>
  );
}