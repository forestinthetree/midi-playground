import type { RGBColor } from "../types";

function randomValue({ max, min = 0 }: { max: number; min?: number }): number {
  return Math.round(Math.random() * (max - min)) + min;
}

export function randomRGBColor(): RGBColor {
  const r = randomValue({ max: 255 });
  const g = randomValue({ max: 255 });
  const b = randomValue({ max: 255 });

  return [r, g, b];
}

export function randomHSLColor({
  minSaturation = 0,
  minLightness = 0,
}: { minSaturation?: number; minLightness?: number } = {}): RGBColor {
  const h = randomValue({ max: 359 });
  const s = randomValue({ min: minSaturation, max: 100 });
  const l = randomValue({ min: minLightness, max: 100 });

  return [h, s, l];
}

export function rgbToHex(r: number, g: number, b: number) {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error(
      "Invalid color value. Each value should be between 0 and 255.",
    );
  }

  const toHex = (color: number) => {
    const hex = color.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  // Combine the hex strings and prepend with #
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hexSource: string): {
  r: number;
  g: number;
  b: number;
} {
  let hex = hexSource;
  if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
    throw new Error("Invalid hex color code.");
  }

  hex = hex.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

export function rgbToHsl(red: number, green: number, blue: number) {
  let r = red;
  let b = blue;
  let g = green;
  if (r < 0 || r > 255) {
    throw new Error(`Invalid color r value. ${r} should be between 0-255 incl`);
  }
  if (g < 0 || g > 255) {
    throw new Error(`Invalid color g value. ${g} should be between 0-255 incl`);
  }
  if (b < 0 || b > 255) {
    throw new Error(`Invalid color r value. ${b} should be between 0-255 incl`);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, saturation: number, lightness: number) {
  let s = saturation;
  let l = lightness;
  if (h < 0 || h >= 360) {
    throw new Error(`Invalid h value. ${h} should be between 0-359 incl`);
  }
  if (s < 0 || s > 100) {
    throw new Error(`Invalid s value. ${s} should be between 0-100 incl`);
  }
  if (l < 0 || l > 100) {
    throw new Error(`Invalid l value. ${l} should be between 0-100 incl`);
  }

  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

export function darkenColorHSL(color: RGBColor, percentage: number) {
  const { h, s, l } = rgbToHsl(...color);
  const newLightness = Math.max(0, l - l * (percentage / 100));
  const rgb = hslToRgb(h, s, newLightness);

  return {
    rgb,
    hsl: {
      h,
      s,
      l: newLightness,
    },
  };
}

export function getContrastingColor([r, g, b]: RGBColor): RGBColor {
  // Calculate relative luminance using the formula
  // https://en.wikipedia.org/wiki/Relative_luminance
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // If the luminance is high, return black; otherwise, return white
  return luminance > 186 ? [0, 0, 0] : [255, 255, 255];
}

export function rgbToCssString(rgb: RGBColor) {
  return `rgb(${rgb.toString()})`;
}

export function hslToCssString([h, s, l]: [number, number, number]) {
  return `hsl(${h} ${s}% ${l}%)`;
}

export function sortByHSL(colors: RGBColor[]) {
  return colors.sort((color1, color2) => {
    const hsl1 = rgbToHsl(...color1);
    const hsl2 = rgbToHsl(...color2);
    // Compare by Hue
    if (hsl1.h !== hsl2.h) {
      return hsl1.h - hsl2.h;
    }
    // If hues are equal, compare by Saturation
    if (hsl1.s !== hsl2.s) {
      return hsl1.s - hsl2.s;
    }
    // If hues and saturations are equal, compare by Lightness
    return hsl1.l - hsl2.l;
  });
}
