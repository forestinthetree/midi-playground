import { useEffect, useRef, useState } from "react";
import type { RGBColor } from "../../types";
import { hslToCssString, hslToRgb } from "../../utils/color";

export type HSLColorState = ReturnType<typeof useHSLColor>;

export const useHSLColor = (
  defaultHsl: [number, number, number] = [0, 0, 0],
) => {
  const [hue, setHue] = useState<number>(defaultHsl[0]);
  const [saturation, setSaturation] = useState<number>(defaultHsl[1]);
  const [lightness, setLightness] = useState<number>(defaultHsl[2]);
  const [hslCssString, setHslCssString] = useState<string>(
    hslToCssString(defaultHsl),
  );
  const { r, g, b } = hslToRgb(...defaultHsl);
  const rgbRef = useRef<RGBColor>([r, g, b]);

  useEffect(() => {
    setHslCssString(hslToCssString([hue, saturation, lightness]));

    const { r, g, b } = hslToRgb(hue, saturation, lightness);
    rgbRef.current = [r, g, b];
  }, [hue, saturation, lightness]);

  return {
    hue,
    setHue,
    saturation,
    setSaturation,
    lightness,
    setLightness,
    hslCssString,
    rgbRef,
  };
};
