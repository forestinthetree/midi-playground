import { Box, Container, Flex, Theme } from "@radix-ui/themes";
import { type FunctionComponent, useCallback, useMemo } from "react";
import { Header } from "./ui/Header";
import "@radix-ui/themes/styles.css";
import { MIDIPlayground } from "./midi/components/MIDIPlayground";
import {
  Grid,
  type OnConnectionStateChange,
  type OnGridStateChange,
} from "./midi/midi-devices/in-tech/Grid";
import type { MIDIInputMap } from "./midi/types";

const createMIDIInputMap = (
  onGridStateChange: OnGridStateChange,
  onConnectionStateChange?: OnConnectionStateChange
): MIDIInputMap => {
  return {
    "Intech Studio: Grid": ({ input, output }) => {
      return (
        <Grid
          input={input}
          outputObject={output}
          onGridStateChange={onGridStateChange}
          onConnectionStateChange={onConnectionStateChange}
        />
      );
    },
  };
};

export const App: FunctionComponent = () => {
  const onGridStateChange: OnGridStateChange = useCallback(
    async ({ update, state, outputSend }) => {
      console.log("update", {
        update,
        state,
      });
    },
    []
  );

  const onConnectionStateChange: OnConnectionStateChange = useCallback(
    async ({ state, outputSend }) => {
      console.log("connection change", state);
    },
    []
  );

  const midiInputMap = useMemo<MIDIInputMap>(
    () => createMIDIInputMap(onGridStateChange, onConnectionStateChange),
    [onGridStateChange, onConnectionStateChange]
  );

  return (
    <Theme>
      <Box>
        <Header title="MIDI Playground" />

        <Container size="3" my="8">
          <Flex gap="6" align="start">
            <Flex gap="3" wrap="wrap" justify="center">
              <MIDIPlayground midiInputMap={midiInputMap} />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Theme>
  );
};
