import {
  Box,
  Flex,
  Slider as RadixSlider,
  type SliderProps,
} from "@radix-ui/themes";
import type { FunctionComponent } from "react";

type Props = {
  label: string;
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isDisabled?: boolean;
} & Omit<SliderProps, "value">;

export const Slider: FunctionComponent<Props> = ({
  label,
  value,
  setValue,
  min = 0,
  max = 100,
  step = 1,
  isDisabled,
  ...props
}) => {
  return (
    <Flex gap="3" align="center">
      {label}
      <RadixSlider
        value={[value]}
        disabled={isDisabled}
        onValueChange={([value]) => {
          setValue(value);
        }}
        min={min}
        max={max}
        step={step}
        {...props}
      />
      <Box minWidth="30px" style={{ textAlign: "end" }}>
        {value}
      </Box>
    </Flex>
  );
};
