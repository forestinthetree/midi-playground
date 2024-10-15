import { Flex } from "@radix-ui/themes";
import type { FunctionComponent } from "react";
import { Slider } from "../ui/Slider";
import type { ColorState } from "./useColor";

import styles from "./HSLSlider.module.scss";

interface HSLSliderProps {
  isDisabled?: boolean;
  colorState: ColorState;
}

export const LegacyHSLSlider: FunctionComponent<HSLSliderProps> = ({
  isDisabled,
  colorState,
}) => {
  const { hue, setHue, saturation, setSaturation, lightness, setLightness } =
    colorState;

  return (
    <Flex direction="column" gap="1">
      <Slider
        className={styles.hueSlider}
        label="H"
        value={hue}
        setValue={setHue}
        isDisabled={isDisabled}
        min={0}
        max={359}
      />
      <Slider
        label="S"
        value={saturation}
        setValue={setSaturation}
        isDisabled={isDisabled}
        min={0}
        max={100}
        style={{ "--accent-track": "var(--gray-12)" }}
      />
      <Slider
        label="L"
        value={lightness}
        setValue={setLightness}
        isDisabled={isDisabled}
        min={0}
        max={100}
        style={{ "--accent-track": "var(--gray-2)" }}
      />
    </Flex>
  );
};
