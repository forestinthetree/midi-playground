import { useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "../../../utils/throttle";
import { MIDI_OUT_THROTTLE_TIME } from "../constants";
import {
  type ConnectionState,
  type MIDIManager,
  createMIDIManager,
  supportsMIDI,
} from "../utils/createMIDIManager";

export type MIDIInputs = Record<string, MIDIInput>;
export type MIDIOutputSend = MIDIOutput["send"];
export interface MIDIOutputObject {
  throttledSend: MIDIOutputSend;
  output: MIDIOutput;
}
export type MIDIOutputs = Record<string, MIDIOutputObject>;

export function useMIDI() {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess>();
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const [error, setError] = useState<string>();
  const midiManager = useRef<MIDIManager>();
  const [doesSupportMIDI, setDoesSupportMIDI] = useState<boolean>();
  const [midiInputs, setMIDIInputs] = useState<MIDIInputs>();
  const [midiOutputs, setMIDIOutputs] = useState<MIDIOutputs>();

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

        const outputs = {} as MIDIOutputs;
        for (const output of midiAccess.outputs.values()) {
          const throttledSend: MIDIOutputSend = throttle((message) => {
            output.send(message);
          }, MIDI_OUT_THROTTLE_TIME);

          outputs[output.id] = {
            throttledSend,
            output,
          };
        }
        setMIDIOutputs(outputs);
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
    midiOutputs,
    connectionState,
    error,
  };
}
