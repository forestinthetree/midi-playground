import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ConnectionState,
  type MIDIManager,
  createMIDIManager,
  supportsMIDI,
} from "../utils/createMIDIManager";

export type MIDIInputs = Record<string, MIDIInput>;

export function useMIDI() {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess>();
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const [error, setError] = useState<string>();
  const midiManager = useRef<MIDIManager>();
  const [doesSupportMIDI, setDoesSupportMIDI] = useState<boolean>();
  const [midiInputs, setMIDIInputs] = useState<MIDIInputs>();

  const connect = useCallback(() => {
    async function connectMIDI() {
      midiManager.current = createMIDIManager({
        onConnectionChange(state) {
          setConnectionState(state);
        },
      });

      const { midiAccess } = await midiManager.current.connect();
      setMidiAccess(midiAccess);

      if (midiAccess) {
        const inputs = {} as MIDIInputs;
        for (const input of midiAccess.inputs.values()) {
          inputs[input.id] = input;
        }

        setMIDIInputs(inputs);
      }
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
    midiAccess,
    midiInputs,
    connectionState,
    error,
  };
}
