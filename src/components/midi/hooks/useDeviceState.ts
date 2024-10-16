import { useEffect, useState } from "react";
import type { MIDIDevice } from "../types";

export const useDeviceState = ({ device }: { device: MIDIDevice }) => {
  const [deviceState, setDeviceState] =
    useState<MIDIPortDeviceState>("disconnected");

  useEffect(() => {
    function onStateChange() {
      setDeviceState(device.input.state);
    }
    device.input.addEventListener("statechange", onStateChange);

    return () => {
      device.input.removeEventListener("statechange", onStateChange);
    };
  }, [device]);

  return deviceState;
};
