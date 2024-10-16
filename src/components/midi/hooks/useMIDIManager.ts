import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { MIDIDevice, MIDIDeviceConfig } from "../types";
import {
  type MIDIManager,
  type MIDIState,
  createMIDIManager,
  supportsMIDI,
} from "../utils/createMIDIManager";

interface Params {
  deviceConfig: MIDIDeviceConfig;
}

export type MIDIObject = ReturnType<typeof useMIDIManager>;
export type MIDIDeviceComponent = MIDIDevice & {
  component: ReactElement;
};

export function useMIDIManager({ deviceConfig }: Params) {
  const [midiState, setMIDIState] = useState<MIDIState>("init");
  const [error, setError] = useState<string>();
  const midiManager = useRef<MIDIManager>();
  const [doesSupportMIDI, setDoesSupportMIDI] = useState<boolean>(false);
  const [deviceComponents, setDeviceComponents] = useState<
    MIDIDeviceComponent[]
  >([]);

  const init = useCallback(() => {
    async function connectMIDI() {
      midiManager.current = createMIDIManager({
        onMIDIStateChange(state) {
          setMIDIState(state);
        },
        onDevicesChange(devices) {
          const deviceComponents = devices
            .map((device) => {
              const deviceComponent = deviceConfig[device.name];
              if (!deviceComponent) {
                return;
              }
              const component = deviceComponent({ device });

              return {
                ...device,
                component,
              };
            })
            .filter(Boolean) as MIDIDeviceComponent[];

          setDeviceComponents(deviceComponents);
        },
      });

      midiManager.current.init();
    }

    connectMIDI();

    return () => {
      midiManager.current?.cleanUp();
    };
  }, [deviceConfig]);

  useEffect(() => {
    if (midiState === "error" && midiManager.current) {
      setError(midiManager.current.getError());
    }
  }, [midiState]);

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
    init,
    deviceComponents,
    midiState,
    error,
  };
}
