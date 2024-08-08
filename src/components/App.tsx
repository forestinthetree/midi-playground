import { Box, Container, Theme } from "@radix-ui/themes";
import type { FunctionComponent } from "react";
import "@radix-ui/themes/styles.css";
import { InTechGrid } from "../components/grid/InTechGrid";

export const App: FunctionComponent = () => {
  return (
    <Theme>
      <Box>
        <Container size="2" my="4">
          <Box p="3">
            <InTechGrid />
          </Box>
        </Container>
      </Box>
    </Theme>
  );
};
