import { Box, Container, Theme } from "@radix-ui/themes";
import type { FunctionComponent } from "react";
import "@radix-ui/themes/styles.css";
import { MIDIPlayground } from "./midi/components/MIDIPlayground";

export const App: FunctionComponent = () => {
  return (
    <Theme>
      <Box>
        <Container size="2" my="4">
          <MIDIPlayground />
        </Container>
      </Box>
    </Theme>
  );
};
