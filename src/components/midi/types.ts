import type { ReactNode } from "react";
import type { MIDIOutputObject } from "./hooks/useMIDI";

export type MIDIInputMap = Record<
  string,
  (params: { input: MIDIInput; output?: MIDIOutputObject }) => ReactNode
>;

export type RGBLayer = 1 | 2 | "both";
