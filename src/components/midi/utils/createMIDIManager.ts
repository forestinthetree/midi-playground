import { throttle } from "../../../utils/throttle";
import { MIDI_OUT_THROTTLE_TIME } from "../constants";
import type { MIDIDevice, MIDIDeviceConfig, MIDIOutputSend } from "../types";

interface Params {
  onMIDIStateChange?: (state: MIDIState) => void;
  onDevicesChange?: (devices: MIDIDevice[]) => void;
}

export type MIDIState = "init" | "available" | "error" | "notSupported";

export type MIDIManager = ReturnType<typeof createMIDIManager>;
export type MIDIInputs = Record<string, MIDIInput>;

type DeviceHandlerCleanUp = () => void;
type DeviceHandlers = Record<string, DeviceHandlerCleanUp>;

export function supportsMIDI() {
  return Boolean(navigator.requestMIDIAccess);
}

export function createMIDIManager({
  onMIDIStateChange,
  onDevicesChange,
}: Params) {
  const inputs: MIDIInputs = {};
  const deviceHandlers: DeviceHandlers = {};
  let midiAccess: MIDIAccess;
  let error: string;

  const handleMIDIAccessChange = (midiAccess: MIDIAccess) => {
    for (const input of midiAccess.inputs.values()) {
      inputs[input.id] = input;
    }

    const outputs: Record<string, MIDIOutput[]> = {};
    for (const output of midiAccess.outputs.values()) {
      const { name } = output;
      if (!name) {
        return;
      }

      if (outputs[name]) {
        outputs[name].push(output);
      } else {
        outputs[name] = [output];
      }
    }

    const indexes: Record<string, number> = {};
    const devices = Object.entries(inputs)
      .map(([, input]) => {
        const deviceName = input.name as string;
        if (!deviceName) {
          return;
        }

        // Simple algorithm to match MIDI input and output based on the
        // order of midiOutputs with the same name as the midi input
        let output: MIDIOutput | undefined = undefined;
        const currentOutputIndex = indexes[deviceName];

        if (outputs[deviceName]) {
          if (currentOutputIndex === undefined) {
            output = outputs[deviceName][0];
            indexes[deviceName] = 0;
          } else {
            output = outputs[deviceName][currentOutputIndex];
            indexes[deviceName] = indexes[deviceName] + 1;
          }
        }

        const throttledSend: MIDIOutputSend | undefined = output
          ? throttle((message) => {
              output.send(message);
            }, MIDI_OUT_THROTTLE_TIME)
          : undefined;

        const device = {
          id: input.id,
          name: deviceName,
          input,
          output,
          throttledSend,
        } as MIDIDevice;

        return device;
      })
      .filter(Boolean) as MIDIDevice[];

    onDevicesChange?.(devices);
  };

  const init = async (): Promise<void> => {
    if (supportsMIDI()) {
      try {
        midiAccess = await navigator.requestMIDIAccess();
        updateMIDIState("available");
        handleMIDIAccessChange?.(midiAccess);

        midiAccess.onstatechange = (event) => {
          const onChangeEvent = event as MIDIConnectionEvent;
          if (onChangeEvent.port === null) {
            return;
          }

          handleMIDIAccessChange?.(event.target as MIDIAccess);
        };
      } catch (e) {
        if (e instanceof DOMException) {
          error =
            "MIDI was not given permission to run. Please enable MIDI permission in the browser.";
        } else {
          error = (e as Error).message;
        }

        updateMIDIState("error");
      }
    } else {
      updateMIDIState("notSupported");
    }
  };

  const cleanUp = () => {
    for (const [, deviceHandlerCleanUp] of Object.entries(deviceHandlers)) {
      deviceHandlerCleanUp();
    }
  };

  const updateMIDIState = (state: MIDIState) => {
    if (onMIDIStateChange) {
      onMIDIStateChange(state);
    }
  };

  updateMIDIState("init");

  return {
    getError() {
      return error;
    },
    init,
    cleanUp,
  };
}
