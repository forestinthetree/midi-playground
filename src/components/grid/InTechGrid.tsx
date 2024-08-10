import { useEffect, type FunctionComponent } from "react";
import { useMIDI } from "../../utils/useMidi";

export const InTechGrid: FunctionComponent = () => {
  const { connectionState, connect, error, midiInputs } = useMIDI();

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
      {connectionState}
      {midiInputs && (
        <ul>
          {Object.entries(midiInputs).map(([id, input]) => {
            return (
              <li key={id}>
                <code>{id}</code>: {input.name}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
