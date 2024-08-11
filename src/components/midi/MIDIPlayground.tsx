import { Box, Flex, Heading } from "@radix-ui/themes";
import { type FunctionComponent, useEffect } from "react";
import type { ConnectionState } from "../../utils/createMIDIManager";
import { useMIDI } from "../../utils/useMIDI";
import { Connection } from "./Connection";
import { MIDIInputs } from "./MIDIInputs";

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
        <Connection connectionState={connectionState} connect={connect} />
      )}
    </Flex>
  );
}

export const MIDIPlayground: FunctionComponent = () => {
  const { connectionState, connect, error, midiInputs } = useMIDI();

  useEffect(() => {
    connect();
  }, [connect]);

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
        background: "var(--gray-2)",
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
        {midiInputs && <MIDIInputs midiInputs={midiInputs} />}
      </Flex>
    </Box>
  );
};
