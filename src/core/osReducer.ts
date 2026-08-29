import {
  appRegistry,
} from "./appRegistry";

import type {
  AccentName,
  AppId,
  NotificationItem,
  OSState,
  PermissionRequest,
  ThemeMode,
  AuditEntry,
} from "./types";


export type OSAction =
  | {
      type: "BOOT_COMPLETE";
    }

  | {
      type: "OPEN_APP";
      appId: AppId;
    }

  | {
      type: "FOCUS_APP";
      appId: AppId;
    }

  | {
      type: "CLOSE_APP";
      appId: AppId;
    }

  | {
      type: "MINIMIZE_APP";
      appId: AppId;
    }

  | {
      type: "TOGGLE_MAXIMIZE";
      appId: AppId;
    }

  | {
      type: "MOVE_APP";
      appId: AppId;

      x: number;
      y: number;
    }

  | {
      type: "RESIZE_APP";
      appId: AppId;

      width: number;
      height: number;
    }

  | {
      type: "ADD_NOTIFICATION";

      notification:
        NotificationItem;
    }

  | {
      type:
        "MARK_NOTIFICATION_READ";

      id: string;
    }

  | {
      type:
        "MARK_ALL_NOTIFICATIONS_READ";
    }

  | {
      type:
        "CLEAR_NOTIFICATIONS";
    }

  | {
      type:
        "ADD_PERMISSION_REQUEST";

      request:
        PermissionRequest;
    }

  | {
      type:
        "RESOLVE_PERMISSION_REQUEST";

      id: string;
    }

  | {
      type: "ADD_AUDIT";

      entry:
        AuditEntry;
    }

  | {
      type: "SET_THEME";

      theme:
        ThemeMode;
    }

  | {
      type: "SET_ACCENT";

      accent:
        AccentName;
    }

  | {
      type:
        "SET_REDUCED_MOTION";

      value: boolean;
    };


export function createDefaultState():
  OSState {

  const windows =
    Object.values(
      appRegistry,
    ).reduce(
      (
        result,
        app,
      ) => {

        result[
          app.id
        ] = {

          appId:
            app.id,

          ...app.defaultBounds,

          open:
            app.id ===
            "nexus",

          minimized:
            false,

          maximized:
            false,

          z:
            app.id ===
            "nexus"
              ? 20
              : 10,
        };

        return result;
      },
      {} as OSState["windows"],
    );


  return {
    windows,

    activeAppId:
      "nexus",

    zCounter:
      20,

    notifications: [],

    permissionQueue: [],

    audit: [],

    settings: {
      theme:
        "light",

      accent:
        "blue",

      reducedMotion:
        false,
    },

    bootComplete:
      false,
  };
}


function focus(
  state: OSState,
  appId: AppId,
): OSState {

  const nextZ =
    state.zCounter + 1;

  return {
    ...state,

    zCounter:
      nextZ,

    activeAppId:
      appId,

    windows: {
      ...state.windows,

      [appId]: {
        ...state.windows[
          appId
        ],

        open:
          true,

        minimized:
          false,

        z:
          nextZ,
      },
    },
  };
}


export function osReducer(
  state: OSState,
  action: OSAction,
): OSState {

  switch (
    action.type
  ) {

    case "BOOT_COMPLETE":
      return {
        ...state,

        bootComplete:
          true,
      };


    case "OPEN_APP":
    case "FOCUS_APP":
      return focus(
        state,
        action.appId,
      );


    case "CLOSE_APP":
      return {
        ...state,

        activeAppId:
          state.activeAppId ===
          action.appId
            ? null
            : state.activeAppId,

        windows: {
          ...state.windows,

          [action.appId]: {
            ...state.windows[
              action.appId
            ],

            open:
              false,

            minimized:
              false,

            maximized:
              false,
          },
        },
      };


    case "MINIMIZE_APP":
      return {
        ...state,

        activeAppId:
          state.activeAppId ===
          action.appId
            ? null
            : state.activeAppId,

        windows: {
          ...state.windows,

          [action.appId]: {
            ...state.windows[
              action.appId
            ],

            minimized:
              true,
          },
        },
      };


    case "TOGGLE_MAXIMIZE":
      return {
        ...state,

        windows: {
          ...state.windows,

          [action.appId]: {
            ...state.windows[
              action.appId
            ],

            maximized:
              !state.windows[
                action.appId
              ].maximized,

            minimized:
              false,
          },
        },
      };


    case "MOVE_APP":
      return {
        ...state,

        windows: {
          ...state.windows,

          [action.appId]: {
            ...state.windows[
              action.appId
            ],

            x:
              action.x,

            y:
              action.y,
          },
        },
      };


    case "RESIZE_APP":
      return {
        ...state,

        windows: {
          ...state.windows,

          [action.appId]: {
            ...state.windows[
              action.appId
            ],

            width:
              action.width,

            height:
              action.height,
          },
        },
      };


    case "ADD_NOTIFICATION":
      return {
        ...state,

        notifications: [
          action.notification,

          ...state.notifications,
        ].slice(
          0,
          50,
        ),
      };


    case "MARK_NOTIFICATION_READ":
      return {
        ...state,

        notifications:
          state.notifications.map(
            (item) =>
              item.id ===
              action.id
                ? {
                    ...item,
                    read:
                      true,
                  }
                : item,
          ),
      };


    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,

        notifications:
          state.notifications.map(
            (item) => ({
              ...item,

              read:
                true,
            }),
          ),
      };


    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,

        notifications: [],
      };


    case "ADD_PERMISSION_REQUEST":
      return {
        ...state,

        permissionQueue: [
          ...state.permissionQueue,

          action.request,
        ],
      };


    case "RESOLVE_PERMISSION_REQUEST":
      return {
        ...state,

        permissionQueue:
          state.permissionQueue.filter(
            (request) =>
              request.id !==
              action.id,
          ),
      };


    case "ADD_AUDIT":
      return {
        ...state,

        audit: [
          action.entry,

          ...state.audit,
        ].slice(
          0,
          200,
        ),
      };


    case "SET_THEME":
      return {
        ...state,

        settings: {
          ...state.settings,

          theme:
            action.theme,
        },
      };


    case "SET_ACCENT":
      return {
        ...state,

        settings: {
          ...state.settings,

          accent:
            action.accent,
        },
      };


    case "SET_REDUCED_MOTION":
      return {
        ...state,

        settings: {
          ...state.settings,

          reducedMotion:
            action.value,
        },
      };


    default:
      return state;
  }
}