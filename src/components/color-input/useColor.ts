import { useCallback, useEffect, useRef, useState } from "react";
import type { RGBColor } from "../../types";
import { hslToRgb, rgbToHex, rgbToHsl } from "../../utils/color";

interface Params {
  defaultRgb: RGBColor;
}

export type ColorState = ReturnType<typeof useColor>;

export const useColor = ({ defaultRgb = [0, 0, 0] }: Params = {} as Params) => {
  const defaultHsl = rgbToHsl(...defaultRgb);
  const [red, setRed] = useState(defaultRgb[0]);
  const [green, setGreen] = useState(defaultRgb[1]);
  const [blue, setBlue] = useState(defaultRgb[2]);

  const [hue, setHue] = useState(defaultHsl.h);
  const [saturation, setSaturation] = useState(defaultHsl.s);
  const [lightness, setLightness] = useState(defaultHsl.l);

  const rgbRef = useRef({ red, green, blue });
  const hslRef = useRef({ hue, saturation, lightness });

  const updateHsl = useCallback(() => {
    const { red, green, blue } = rgbRef.current;
    const { h, s, l } = rgbToHsl(red, green, blue);
    hslRef.current = { hue: h, saturation: s, lightness: l };
    setHue(h);
    setSaturation(s);
    setLightness(l);
  }, []);

  const updateRgb = useCallback(() => {
    const { hue, saturation, lightness } = hslRef.current;
    const { r, g, b } = hslToRgb(hue, saturation, lightness);
    rgbRef.current = { red: r, green: g, blue: b };
    setRed(r);
    setGreen(g);
    setBlue(b);
  }, []);

  // Effect to update HSL values when RGB changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: TODO
  useEffect(() => {
    const handler = setTimeout(updateHsl, 100);
    return () => clearTimeout(handler);
  }, [red, green, blue, updateHsl]);

  // Effect to update RGB values when HSL changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: TODO
  useEffect(() => {
    const handler = setTimeout(updateRgb, 100);
    return () => clearTimeout(handler);
  }, [hue, saturation, lightness, updateRgb]);

  return {
    hex: rgbToHex(red, green, blue),
    red,
    setRed: (value: number) => {
      rgbRef.current.red = value;
      setRed(value);
    },
    green,
    setGreen: (value: number) => {
      rgbRef.current.green = value;
      setGreen(value);
    },
    blue,
    setBlue: (value: number) => {
      rgbRef.current.blue = value;
      setBlue(value);
    },
    hue,
    setHue: (value: number | ((prevValue: number) => number)) => {
      if (typeof value === "function") {
        setHue((prevValue: number) => {
          const newVal = value(prevValue);
          hslRef.current.hue = newVal;

          return newVal;
        });
      } else {
        hslRef.current.hue = value;
        setHue(value);
      }
    },
    saturation,
    setSaturation: (value: number | ((prevValue: number) => number)) => {
      if (typeof value === "function") {
        setHue((prevValue: number) => {
          const newVal = value(prevValue);
          hslRef.current.saturation = newVal;

          return newVal;
        });
      } else {
        hslRef.current.saturation = value;
        setSaturation(value);
      }
    },
    lightness,
    setLightness: (value: number | ((prevValue: number) => number)) => {
      if (typeof value === "function") {
        setHue((prevValue: number) => {
          const newVal = value(prevValue);
          hslRef.current.lightness = newVal;

          return newVal;
        });
      } else {
        hslRef.current.lightness = value;
        setLightness(value);
      }
    },
  };
};
