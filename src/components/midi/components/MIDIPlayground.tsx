import { Box, Flex, Heading } from "@radix-ui/themes";
import { type FunctionComponent, type ReactNode, useEffect } from "react";
import { useMIDI } from "../hooks/useMIDI";
import type { MIDIInputMap } from "../types";
import type { ConnectionState } from "../utils/createMIDIManager";
import { Connection } from "./Connection";
import { MIDIInputs } from "./MIDIInputs";

interface Props {
  midiInputMap: MIDIInputMap;
  children?: ReactNode;
}

function Header({
  connect,
  connectionState,
}: {
  connect: () => void;
  connectionState?: ConnectionState;
}) {
  return (
    <Flex direction="row" gap="3" justify="between">
      <Heading as="h1">Devices</Heading>
      {connectionState && (
        <Connection connectionState={connectionState} connect={connect} />
      )}
    </Flex>
  );
}

export const MIDIPlayground: FunctionComponent<Props> = ({
  midiInputMap,
  children,
}) => {
  const { connectionState, connect, error, midiInputs, midiOutputs } =
    useMIDI();

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
            No MIDI devices connected. Connect one, then click on "Sync MIDI" or
            refresh the page.
          </Box>
        )}
        {midiInputs && (
          <MIDIInputs
            midiInputs={midiInputs}
            midiOutputs={midiOutputs}
            midiInputMap={midiInputMap}
          />
        )}
        {connectionState === "connected" && children}
      </Flex>
    </Box>
  );
};
