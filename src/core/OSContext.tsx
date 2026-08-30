import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import type {
  ReactNode,
} from "react";


import {
  createDefaultState,
  osReducer,
} from "./osReducer";


import {
  loadOSState,
  saveOSState,
} from "./persistence";


import type {
  AccentName,
  AppId,
  AuditEntry,
  AuditLevel,
  NotificationItem,
  OSState,
  PermissionName,
  PermissionRequest,
  ThemeMode,
  WallpaperId,
} from "./types";


function createId() {

  if (
    typeof crypto !==
      "undefined" &&
    crypto.randomUUID
  ) {

    return crypto.randomUUID();
  }


  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}


function initializeState():
  OSState {

  const defaults =
    createDefaultState();

  const saved =
    loadOSState();


  if (!saved) {
    return defaults;
  }


  const windows = {
    ...defaults.windows,
  };


  for (
    const appId
    of Object.keys(
      windows,
    ) as AppId[]
  ) {

    if (
      saved.windows?.[
        appId
      ]
    ) {

      windows[
        appId
      ] = {
        ...windows[
          appId
        ],

        ...saved.windows[
          appId
        ],
      };
    }
  }


  const highestZ =
    Math.max(
      ...Object.values(
        windows,
      ).map(
        (windowState) =>
          windowState.z,
      ),

      defaults.zCounter,
    );


  return {
    ...defaults,

    windows,

    settings: {
      ...defaults.settings,

      ...saved.settings,
    },

    zCounter:
      highestZ,

    bootComplete:
      false,
  };
}


interface PermissionOptions {
  permission:
    PermissionName;

  appId:
    AppId;

  actor:
    string;

  reason:
    string;

  resources:
    string[];
}


interface NotifyOptions {
  title: string;

  message: string;

  source: string;

  level?:
    NotificationItem["level"];
}


interface AuditOptions {
  actor: string;

  action: string;

  detail?: string;

  level?:
    AuditLevel;
}


interface OSContextValue {
  state:
    OSState;


  completeBoot:
    () => void;


  openApp:
    (
      appId: AppId,
    ) => void;


  focusApp:
    (
      appId: AppId,
    ) => void;


  closeApp:
    (
      appId: AppId,
    ) => void;


  minimizeApp:
    (
      appId: AppId,
    ) => void;


  toggleMaximize:
    (
      appId: AppId,
    ) => void;


  moveApp:
    (
      appId: AppId,

      x: number,

      y: number,
    ) => void;


  resizeApp:
    (
      appId: AppId,

      width: number,

      height: number,
    ) => void;


  setMaximized:
    (
      appId: AppId,

      value: boolean,
    ) => void;


  notify:
    (
      options:
        NotifyOptions,
    ) => string;


  markNotificationRead:
    (
      id: string,
    ) => void;


  markAllNotificationsRead:
    () => void;


  clearNotifications:
    () => void;


  audit:
    (
      options:
        AuditOptions,
    ) => string;


  requestPermission:
    (
      options:
        PermissionOptions,
    ) => Promise<boolean>;


  resolvePermission:
    (
      id: string,
      allowed: boolean,
    ) => void;


  setTheme:
    (
      theme:
        ThemeMode,
    ) => void;


  setAccent:
    (
      accent:
        AccentName,
    ) => void;


  setReducedMotion:
    (
      value:
        boolean,
    ) => void;


  setWallpaper:
    (
      id: WallpaperId,
    ) => void;


  setWallpaperDim:
    (
      value: number,
    ) => void;


  setWallpaperBlur:
    (
      value: number,
    ) => void;


  setWidgetsVisible:
    (
      value: boolean,
    ) => void;
}


const OSContext =
  createContext<
    OSContextValue | null
  >(null);


export function OSProvider({
  children,
}: {
  children:
    ReactNode;
}) {

  const [
    state,
    dispatch,
  ] = useReducer(
    osReducer,

    undefined,

    initializeState,
  );


  const permissionResolvers =
    useRef(
      new Map<
        string,
        (
          allowed:
            boolean,
        ) => void
      >(),
    );


  useEffect(() => {

    saveOSState(
      state,
    );

  }, [
    state.windows,
    state.settings,
  ]);


  useEffect(() => {

    document.documentElement.dataset.theme =
      state.settings.theme;

    document.documentElement.dataset.accent =
      state.settings.accent;

    document.documentElement.dataset.motion =
      state.settings.reducedMotion
        ? "reduced"
        : "full";

  }, [
    state.settings,
  ]);


  const audit =
    useCallback(
      (
        options:
          AuditOptions,
      ) => {

        const id =
          createId();


        const entry:
          AuditEntry = {

          id,

          actor:
            options.actor,

          action:
            options.action,

          detail:
            options.detail,

          level:
            options.level ??
            "info",

          createdAt:
            new Date().toISOString(),
        };


        dispatch({
          type:
            "ADD_AUDIT",

          entry,
        });


        return id;
      },
      [],
    );


  const notify =
    useCallback(
      (
        options:
          NotifyOptions,
      ) => {

        const id =
          createId();


        dispatch({
          type:
            "ADD_NOTIFICATION",

          notification: {
            id,

            title:
              options.title,

            message:
              options.message,

            source:
              options.source,

            level:
              options.level ??
              "info",

            read:
              false,

            createdAt:
              new Date().toISOString(),
          },
        });


        return id;
      },
      [],
    );


  const requestPermission =
    useCallback(
      (
        options:
          PermissionOptions,
      ) => {

        const id =
          createId();


        const request:
          PermissionRequest = {

          id,

          permission:
            options.permission,

          appId:
            options.appId,

          actor:
            options.actor,

          reason:
            options.reason,

          resources:
            options.resources,

          createdAt:
            new Date().toISOString(),
        };


        dispatch({
          type:
            "ADD_PERMISSION_REQUEST",

          request,
        });


        audit({
          actor:
            options.actor,

          action:
            `Requested ${options.permission}`,

          detail:
            options.reason,

          level:
            "info",
        });


        return new Promise<boolean>(
          (resolve) => {

            permissionResolvers.current.set(
              id,
              resolve,
            );
          },
        );
      },
      [
        audit,
      ],
    );


  const resolvePermission =
    useCallback(
      (
        id: string,
        allowed: boolean,
      ) => {

        const request =
          state.permissionQueue.find(
            (item) =>
              item.id ===
              id,
          );


        if (request) {

          audit({
            actor:
              "Z++ Policy",

            action:
              allowed
                ? "Permission allowed"
                : "Permission denied",

            detail:
              `${request.actor} · ${request.permission}`,

            level:
              allowed
                ? "success"
                : "warning",
          });


          if (
            !allowed
          ) {

            notify({
              source:
                "Z++ Policy",

              title:
                "Action blocked",

              message:
                `${request.actor} was denied ${request.permission}.`,

              level:
                "warning",
            });
          }
        }


        dispatch({
          type:
            "RESOLVE_PERMISSION_REQUEST",

          id,
        });


        const resolver =
          permissionResolvers.current.get(
            id,
          );


        if (
          resolver
        ) {

          resolver(
            allowed,
          );

          permissionResolvers.current.delete(
            id,
          );
        }
      },
      [
        state.permissionQueue,
        audit,
        notify,
      ],
    );


  const value:
    OSContextValue = {

    state,


    completeBoot() {

      dispatch({
        type:
          "BOOT_COMPLETE",
      });
    },


    openApp(
      appId,
    ) {

      dispatch({
        type:
          "OPEN_APP",

        appId,
      });
    },


    focusApp(
      appId,
    ) {

      dispatch({
        type:
          "FOCUS_APP",

        appId,
      });
    },


    closeApp(
      appId,
    ) {

      dispatch({
        type:
          "CLOSE_APP",

        appId,
      });
    },


    minimizeApp(
      appId,
    ) {

      dispatch({
        type:
          "MINIMIZE_APP",

        appId,
      });
    },


    toggleMaximize(
      appId,
    ) {

      dispatch({
        type:
          "TOGGLE_MAXIMIZE",

        appId,
      });
    },


    moveApp(
      appId,
      x,
      y,
    ) {

      dispatch({
        type:
          "MOVE_APP",

        appId,

        x,
        y,
      });
    },


    resizeApp(
      appId,
      width,
      height,
    ) {

      dispatch({
        type:
          "RESIZE_APP",

        appId,

        width,
        height,
      });
    },


    setMaximized(
      appId,
      value,
    ) {

      dispatch({
        type:
          "SET_MAXIMIZED",

        appId,

        value,
      });
    },


    notify,


    markNotificationRead(
      id,
    ) {

      dispatch({
        type:
          "MARK_NOTIFICATION_READ",

        id,
      });
    },


    markAllNotificationsRead() {

      dispatch({
        type:
          "MARK_ALL_NOTIFICATIONS_READ",
      });
    },


    clearNotifications() {

      dispatch({
        type:
          "CLEAR_NOTIFICATIONS",
      });
    },


    audit,


    requestPermission,


    resolvePermission,


    setTheme(
      theme,
    ) {

      dispatch({
        type:
          "SET_THEME",

        theme,
      });
    },


    setAccent(
      accent,
    ) {

      dispatch({
        type:
          "SET_ACCENT",

        accent,
      });
    },


    setReducedMotion(
      value,
    ) {

      dispatch({
        type:
          "SET_REDUCED_MOTION",

        value,
      });
    },


    setWallpaper(
      id,
    ) {

      dispatch({
        type:
          "SET_WALLPAPER",

        id,
      });
    },


    setWallpaperDim(
      value,
    ) {

      dispatch({
        type:
          "SET_WALLPAPER_DIM",

        value,
      });
    },


    setWallpaperBlur(
      value,
    ) {

      dispatch({
        type:
          "SET_WALLPAPER_BLUR",

        value,
      });
    },


    setWidgetsVisible(
      value,
    ) {

      dispatch({
        type:
          "SET_WIDGETS_VISIBLE",

        value,
      });
    },
  };


  return (
    <OSContext.Provider
      value={value}
    >
      {children}
    </OSContext.Provider>
  );
}


export function useOS() {

  const context =
    useContext(
      OSContext,
    );


  if (!context) {

    throw new Error(
      "useOS must be used inside OSProvider.",
    );
  }


  return context;
}