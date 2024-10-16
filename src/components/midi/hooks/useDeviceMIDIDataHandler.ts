import { useEffect } from "react";
import type { MIDIDevice } from "../types";

export const useDeviceMIDIDataHandler = ({
  device,
  onData,
}: {
  device: MIDIDevice;
  onData: (data: MIDIMessageEvent["data"]) => void;
}) => {
  useEffect(() => {
    function onDataUpdate(event: MIDIMessageEvent) {
      onData(event.data);
    }

    device.input.addEventListener("midimessage", onDataUpdate);

    return () => {
      device.input.removeEventListener("midimessage", onDataUpdate);
    };
  }, [device, onData]);
};
