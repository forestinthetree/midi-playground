interface Params {
  onConnectionChange?: (state: ConnectionState) => void;
}

export type ConnectionState = "idle" | "connected" | "error" | "notSupported";
export interface MIDIConnection {
  connectionState: ConnectionState;
  midiDevice?: MIDIAccess;
  deviceName?: string;
}

export type MIDIManager = ReturnType<typeof createMIDIManager>;

export function createMIDIManager({ onConnectionChange }: Params = {}) {
  let connectionState: ConnectionState = "idle";
  let midiDevice: MIDIAccess;
  let deviceName: string;
  let error: Error;

  const connect = async (): Promise<MIDIConnection> => {
    if (navigator.requestMIDIAccess) {
      try {
        midiDevice = await navigator.requestMIDIAccess();
        deviceName = midiDevice.inputs.values().next().value.name;

        updateConnectionState("connected");
      } catch (e) {
        error = e as Error;
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
