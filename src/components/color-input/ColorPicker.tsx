import type {
  CSSProperties,
  FunctionComponent,
  InputHTMLAttributes,
} from "react";
import type { RGBColor } from "../../types";
import { hexToRgb, rgbToHex } from "../../utils/color";
import type { ColorState } from "./useColor";

export type ColorPickerProps = {
  isDisabled?: boolean;
  colorState: ColorState;
  style?: CSSProperties;
  onColorChange?: (color: RGBColor) => Promise<void>;
} & InputHTMLAttributes<HTMLInputElement>;

export const ColorPicker: FunctionComponent<ColorPickerProps> = ({
  isDisabled,
  colorState,
  style,
  onColorChange,
  ...props
}) => {
  const { red, setRed, green, setGreen, blue, setBlue } = colorState;

  return (
    <input
      type="color"
      value={rgbToHex(red, green, blue)}
      onChange={(e) => {
        const hex = e.target.value;
        const { r, g, b } = hexToRgb(hex);
        setRed(r);
        setGreen(g);
        setBlue(b);

        if (onColorChange) {
          onColorChange([r, g, b]);
        }
      }}
      disabled={isDisabled}
      style={{
        opacity: isDisabled ? 0.2 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        ...style,
      }}
      {...props}
    />
  );
};
