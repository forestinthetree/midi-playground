import { useContext } from "react";
import { MIDIContext } from "../components/MIDIProvider";

export const useMIDI = () => {
  return useContext(MIDIContext);
};
