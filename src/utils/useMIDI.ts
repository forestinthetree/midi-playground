import { useCallback, useEffect, useRef, useState } from "react";
import {
  createMIDIManager,
  supportsMIDI,
  type ConnectionState,
  type MIDIManager,
} from "./createMIDIManager";

export function useMIDI() {
  const [midiDevice, setMidiDevice] = useState<MIDIAccess>();
  const [deviceName, setDeviceName] = useState<string>();
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const [error, setError] = useState<string>();
  const midiManager = useRef<MIDIManager>();
  const [doesSupportMIDI, setDoesSupportMIDI] = useState<boolean>();

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

  // Run MIDI check on the client side
  useEffect(() => {
    const supports = supportsMIDI();
    setDoesSupportMIDI(supports);

    if (!supports) {
      setError("Environment does not support WebMIDI");
    }
  }, []);

  return {
    supportsMIDI: doesSupportMIDI,
    connect,
    midiDevice,
    deviceName,
    connectionState,
    error,
  };
}
