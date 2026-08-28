import type {
  OSSettings,
  OSState,
} from "./types";


const STORAGE_KEY =
  "nexus.os.state.v1";


export interface PersistedOSState {
  windows:
    OSState["windows"];

  settings:
    OSSettings;
}


export function saveOSState(
  state: OSState,
) {

  try {

    const payload:
      PersistedOSState = {

      windows:
        state.windows,

      settings:
        state.settings,
    };


    localStorage.setItem(
      STORAGE_KEY,

      JSON.stringify(
        payload,
      ),
    );

  } catch (
    error
  ) {

    console.warn(
      "NEXUS state could not be saved.",
      error,
    );
  }
}


export function loadOSState():
  PersistedOSState | null {

  try {

    const stored =
      localStorage.getItem(
        STORAGE_KEY,
      );


    if (!stored) {
      return null;
    }


    return JSON.parse(
      stored,
    ) as PersistedOSState;

  } catch (
    error
  ) {

    console.warn(
      "NEXUS state could not be restored.",
      error,
    );

    return null;
  }
}