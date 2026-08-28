import {
  useEffect,
  useState,
} from "react";


import {
  appList,
} from "../core/appRegistry";


import {
  useOS,
} from "../core/OSContext";


import type {
  AppId,
} from "../core/types";


import OSWindow from "../components/os/OSWindow";

import Dock from "../components/os/Dock";

import CommandPalette from "../components/CommandPalette";

import NotificationCenter from "../components/os/NotificationCenter";

import QuickSettings from "../components/os/QuickSettings";

import PermissionDialog from "../components/os/PermissionDialog";


import MenuBar from "./MenuBar";

import BootScreen from "./BootScreen";


import NexusApp from "../apps/Nexus/NexusApp";

import SentinelApp from "../apps/Sentinel/SentinelApp";

import AuditApp from "../apps/Audit/AuditApp";

import SystemApp from "../apps/System/SystemApp";

import NotesApp from "../apps/Notes/NotesApp";

import SettingsApp from "../apps/Settings/SettingsApp";


function renderApp(
  appId: AppId,
) {

  switch (
    appId
  ) {

    case "nexus":
      return (
        <NexusApp />
      );


    case "sentinel":
      return (
        <SentinelApp />
      );


    case "audit":
      return (
        <AuditApp />
      );


    case "system":
      return (
        <SystemApp />
      );


    case "notes":
      return (
        <NotesApp />
      );


    case "settings":
      return (
        <SettingsApp />
      );


    default:
      return null;
  }
}


export default function DesktopShell() {

  const {
    state,

    openApp,

    notify,
  } = useOS();


  const [
    paletteOpen,
    setPaletteOpen,
  ] =
    useState(
      false,
    );


  const [
    notificationsOpen,
    setNotificationsOpen,
  ] =
    useState(
      false,
    );


  const [
    quickSettingsOpen,
    setQuickSettingsOpen,
  ] =
    useState(
      false,
    );


  useEffect(() => {

    if (
      !state.bootComplete
    ) {
      return;
    }


    const timer =
      setTimeout(
        () => {

          notify({
            source:
              "NEXUS",

            title:
              "Workspace ready",

            message:
              "NEXUS has started successfully.",

            level:
              "success",
          });

        },
        450,
      );


    return () =>
      clearTimeout(
        timer,
      );

  }, [
    state.bootComplete,
    notify,
  ]);


  useEffect(() => {

    function keyboard(
      event:
        KeyboardEvent,
    ) {

      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key
          .toLowerCase() ===
          "k"
      ) {

        event.preventDefault();

        setPaletteOpen(
          true,
        );
      }


      if (
        event.key ===
        "Escape"
      ) {

        setPaletteOpen(
          false,
        );

        setNotificationsOpen(
          false,
        );

        setQuickSettingsOpen(
          false,
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

  }, []);


  if (
    !state.bootComplete
  ) {

    return (
      <BootScreen />
    );
  }


  return (

    <main className="desktop">

      <div className="wallpaper">

        <div className="wallpaper-glow glow-one" />

        <div className="wallpaper-glow glow-two" />

        <div className="wallpaper-noise" />

      </div>


      <MenuBar
        onSearch={() =>
          setPaletteOpen(
            true,
          )
        }

        onNotifications={() => {

          setNotificationsOpen(
            (
              current,
            ) =>
              !current,
          );

          setQuickSettingsOpen(
            false,
          );
        }}

        onQuickSettings={() => {

          setQuickSettingsOpen(
            (
              current,
            ) =>
              !current,
          );

          setNotificationsOpen(
            false,
          );
        }}
      />


      <section className="desktop-space">

        <div className="desktop-icons">

          {appList.map(
            (
              app,
            ) => (

              <button
                key={
                  app.id
                }

                className="desktop-icon"

                onDoubleClick={() =>
                  openApp(
                    app.id,
                  )
                }
              >

                <span>
                  {
                    app.icon
                  }
                </span>

                <small>
                  {
                    app.name
                  }
                </small>

              </button>

            ),
          )}

        </div>


        {appList.map(
          (
            app,
          ) => (

            <OSWindow
              key={
                app.id
              }

              appId={
                app.id
              }
            >

              {renderApp(
                app.id,
              )}

            </OSWindow>

          ),
        )}

      </section>


      <Dock />


      <CommandPalette
        open={
          paletteOpen
        }
        apps={appList}

        onClose={() =>
          setPaletteOpen(
            false,
          )
        }

        onOpenApp={openApp}
      />


      <NotificationCenter
        open={
          notificationsOpen
        }

        onClose={() =>
          setNotificationsOpen(
            false,
          )
        }
      />


      <QuickSettings
        open={
          quickSettingsOpen
        }

        onClose={() =>
          setQuickSettingsOpen(
            false,
          )
        }
      />


      <PermissionDialog />

    </main>
  );
}