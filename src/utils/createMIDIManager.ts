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
  midiDevice?: MIDIAccess;
  deviceName?: string;
}

export type MIDIManager = ReturnType<typeof createMIDIManager>;

export function supportsMIDI() {
  return Boolean(navigator.requestMIDIAccess);
}

export function createMIDIManager({ onConnectionChange }: Params = {}) {
  let connectionState: ConnectionState = "idle";
  let midiDevice: MIDIAccess;
  let deviceName: string;
  let error: string;

  const connect = async (): Promise<MIDIConnection> => {
    if (supportsMIDI()) {
      try {
        midiDevice = await navigator.requestMIDIAccess();

        if (!midiDevice.inputs.size) {
          updateConnectionState("available");
        } else {
          deviceName = midiDevice.inputs.values().next().value?.name;
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
      midiDevice,
      deviceName,
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
