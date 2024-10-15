import { Card, Flex, Grid, Heading } from "@radix-ui/themes";
import type { FunctionComponent } from "react";

import { DEFAULT_RGB_COLOR } from "../../constants";
import { ColorPicker } from "./ColorPicker";
import { HSLSlider } from "./HSLSlider";
import { RGBSlider } from "./RGBSlider";
import { useColor } from "./useColor";

export const ColorInput: FunctionComponent = () => {
  const colorState = useColor({ defaultRgb: DEFAULT_RGB_COLOR });

  return (
    <Grid columns="200px 1fr" mt="3" gapX="2">
      <Flex direction="column" gap="2">
        <ColorPicker
          colorState={colorState}
          style={{ width: "100%", height: "30px" }}
        />
      </Flex>

      <Flex direction="column" gap="2">
        <Card>
          <Flex gap="3" direction="column">
            <Flex direction="row" justify="between" align="center">
              <Heading as="h2" size="2">
                RGB
              </Heading>
            </Flex>

            <RGBSlider colorState={colorState} />
          </Flex>
        </Card>
        <Card>
          <Flex gap="3" direction="column">
            <Heading as="h2" size="2">
              HSL
            </Heading>

            <HSLSlider colorState={colorState} />
          </Flex>
        </Card>
      </Flex>
    </Grid>
  );
};
