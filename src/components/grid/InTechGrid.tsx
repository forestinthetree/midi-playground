import { useEffect, type FunctionComponent } from "react";
import { useMIDI } from "../../utils/useMidi";
import { Connection } from "./Connection";
import { Box, Flex, Heading } from "@radix-ui/themes";
import type { ConnectionState } from "../../utils/createMIDIManager";

function Header({
  connect,
  connectionState,
}: {
  connect: () => void;
  connectionState?: ConnectionState;
}) {
  return (
    <Flex direction="row" gap="3" justify="between">
      <Heading as="h1">MIDI Playground</Heading>
      {connectionState && (
        <Connection connectionState={connectionState!} connect={connect!} />
      )}
    </Flex>
  );
}

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
    <Box
      p="5"
      style={{
        borderRadius: "var(--radius-3)",
        background: "var(--gray-a2)",
      }}
    >
      <Flex direction="column" gap="4">
        <Header connect={connect} connectionState={connectionState} />
        {connectionState === "available" && (
          <Box
            style={{
              fontStyle: "italic",
            }}
          >
            No MIDI input connected. Connect it up, then click on "Sync MIDI" or
            refresh the page.
          </Box>
        )}
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
      </Flex>
    </Box>
  );
};
