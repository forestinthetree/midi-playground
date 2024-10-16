import type { ReactElement } from "react";

export type MIDIOutputSend = MIDIOutput["send"];
export interface MIDIDevice {
  id: string;
  name: string;
  input: MIDIInput;
  output?: MIDIOutput;
  throttledSend?: MIDIOutputSend;
}

export type MIDIDeviceConfig = Record<
  string,
  (params: { device: MIDIDevice }) => ReactElement
>;

export type RGBLayer = 1 | 2 | "both";
