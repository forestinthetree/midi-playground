import { useEffect, useState } from "react";
import type { OnConnectionStateChange } from "../midi-devices/in-tech/Grid";
import type { MIDIOutputSend } from "./useMIDI";

interface Params {
  output?: MIDIOutput;
  onConnectionStateChange?: OnConnectionStateChange;
  outputSend?: MIDIOutputSend;
}

export function useOutputState({
  output,
  onConnectionStateChange,
  outputSend,
}: Params) {
  const [state, setState] = useState<MIDIPortDeviceState>();

  useEffect(() => {
    if (!output) {
      return;
    }

    function updateState() {
      if (!output) {
        return;
      }

      const newState = output.state;
      setState(newState);

      if (onConnectionStateChange) {
        onConnectionStateChange({ state: newState, outputSend });
      }
    }

    output.addEventListener("statechange", updateState);
    updateState();

    return () => {
      output.removeEventListener("statechange", updateState);
    };
  }, [output, onConnectionStateChange, outputSend]);

  return state;
}
