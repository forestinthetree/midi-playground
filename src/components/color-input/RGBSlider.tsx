import { Flex } from "@radix-ui/themes";
import type { FunctionComponent } from "react";
import { Slider } from "../ui/Slider";
import type { ColorState } from "./useColor";

interface RGBSliderProps {
  isDisabled?: boolean;
  colorState: ColorState;
}

export const RGBSlider: FunctionComponent<RGBSliderProps> = ({
  isDisabled,
  colorState,
}) => {
  const { red, setRed, green, setGreen, blue, setBlue } = colorState;

  return (
    <Flex direction="column" gap="1">
      <Slider
        label="R"
        value={red}
        setValue={setRed}
        isDisabled={isDisabled}
        color="red"
        max={255}
      />
      <Slider
        label="G"
        value={green}
        setValue={setGreen}
        isDisabled={isDisabled}
        color="green"
        max={255}
      />
      <Slider
        label="B"
        value={blue}
        setValue={setBlue}
        isDisabled={isDisabled}
        color="blue"
        max={255}
      />
    </Flex>
  );
};
