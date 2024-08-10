interface Params {
  onConnectionChange?: (state: ConnectionState) => void;
}

export type ConnectionState =
  | "idle"
  /**
   * Available, but no MIDI devices connected
   */
  | "available"
  | "connected"
  | "error"
  | "notSupported";
export interface MIDIConnection {
  connectionState: ConnectionState;
  midiAccess?: MIDIAccess;
}

export type MIDIManager = ReturnType<typeof createMIDIManager>;

export function supportsMIDI() {
  return Boolean(navigator.requestMIDIAccess);
}

export function createMIDIManager({ onConnectionChange }: Params = {}) {
  let connectionState: ConnectionState = "idle";
  let midiAccess: MIDIAccess;
  let error: string;

  const connect = async (): Promise<MIDIConnection> => {
    if (supportsMIDI()) {
      try {
        midiAccess = await navigator.requestMIDIAccess();

        if (!midiAccess.inputs.size) {
          updateConnectionState("available");
        } else {
          updateConnectionState("connected");
        }
      } catch (e) {
        if (e instanceof DOMException) {
          error =
            "MIDI was not given permission to run. Please enable MIDI permission in the browser.";
        } else {
          error = (e as Error).message;
        }

        updateConnectionState("error");
      }
    } else {
      updateConnectionState("notSupported");
    }

    return {
      connectionState,
      midiAccess,
    };
  };

  const updateConnectionState = (state: ConnectionState) => {
    connectionState = state;
    onConnectionChange && onConnectionChange(state);
  };

  return {
    getError() {
      return error;
    },
    connect,
  };
}
