import { useCallback, useEffect, useRef, useState } from "react";
import {
  createMIDIManager,
  type ConnectionState,
  type MIDIManager,
} from "./createMIDIManager";

export function useMIDI() {
  const [midiDevice, setMidiDevice] = useState<MIDIAccess>();
  const [deviceName, setDeviceName] = useState<string>();
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const [error, setError] = useState<Error>();
  const midiManager = useRef<MIDIManager>();

  const connect = useCallback(() => {
    async function connectMIDI() {
      midiManager.current = createMIDIManager({
        onConnectionChange(state) {
          setConnectionState(state);
        },
      });

      const { midiDevice, deviceName } = await midiManager.current.connect();

      setDeviceName(deviceName);
      setMidiDevice(midiDevice);
    }

    connectMIDI();
  }, []);

  useEffect(() => {
    if (connectionState === "error" && midiManager.current) {
      setError(midiManager.current.getError());
    }
  }, [connectionState]);

  return {
    connect,
    midiDevice,
    deviceName,
    connectionState,
    error,
  };
}
