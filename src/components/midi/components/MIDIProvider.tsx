import {
  type FunctionComponent,
  type ReactNode,
  createContext,
  useEffect,
} from "react";
import {
  type MIDIDeviceComponent,
  useMIDIManager,
} from "../hooks/useMIDIManager";
import type { MIDIDeviceConfig } from "../types";
import type { MIDIState } from "../utils/createMIDIManager";

interface Props {
  deviceConfig: MIDIDeviceConfig;
  children: ReactNode;
}

export const MIDIContext = createContext<{
  midiState: MIDIState;
  supportsMIDI: boolean;
  deviceComponents: MIDIDeviceComponent[];
  error?: string;
}>({
  midiState: "init",
  supportsMIDI: false,
  deviceComponents: [],
});

export const MIDIProvider: FunctionComponent<Props> = ({
  deviceConfig,
  children,
}) => {
  const { init, error, midiState, supportsMIDI, deviceComponents } =
    useMIDIManager({
      deviceConfig,
    });

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <MIDIContext.Provider
      value={{ midiState, supportsMIDI, deviceComponents, error }}
    >
      {children}
    </MIDIContext.Provider>
  );
};
