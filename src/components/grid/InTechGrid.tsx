import { useEffect, type FunctionComponent } from "react";
import { useMIDI } from "../../utils/useMidi";

export const InTechGrid: FunctionComponent = () => {
  const { connectionState, deviceName, connect, error } = useMIDI();

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <>
      {deviceName} ({connectionState})
    </>
  );
};
