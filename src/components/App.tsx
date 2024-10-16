import { Box, Callout, Container, Flex, Theme } from "@radix-ui/themes";
import { Fragment, type FunctionComponent } from "react";
import { Header } from "./ui/Header";
import "@radix-ui/themes/styles.css";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { MIDIProvider } from "./midi/components/MIDIProvider";
import { useMIDI } from "./midi/hooks/useMIDI";
import { Grid } from "./midi/midi-devices/in-tech/Grid";
import type { MIDIDeviceConfig } from "./midi/types";

const deviceConfig: MIDIDeviceConfig = {
  "Intech Studio: Grid": ({ device }) => {
    return <Grid device={device} />;
  },
};

const AppContent: FunctionComponent = () => {
  const { midiState, deviceComponents } = useMIDI();
  const hasDevices = Boolean(deviceComponents.length);

  return (
    <Box>
      <Header title="MIDI Playground" midiState={midiState} />

      <Container size="3" my="8">
        <Flex gap="3" wrap="wrap" justify="center">
          {!hasDevices && (
            <Callout.Root size="2">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>Connect a MIDI device to get started</Callout.Text>
            </Callout.Root>
          )}
          {hasDevices && (
            <Box
              p="5"
              style={{
                borderRadius: "var(--radius-3)",
                background: "var(--gray-2)",
              }}
            >
              <Flex direction="column" gap="4">
                {deviceComponents.map(({ id, component }) => {
                  return <Fragment key={id}>{component}</Fragment>;
                })}
              </Flex>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export const App: FunctionComponent = () => {
  return (
    <Theme>
      <MIDIProvider deviceConfig={deviceConfig}>
        <AppContent />
      </MIDIProvider>
    </Theme>
  );
};
