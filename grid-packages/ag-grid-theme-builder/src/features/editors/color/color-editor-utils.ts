import { clamp, logErrorMessageOnce } from 'model/utils';

export type FourChannelColor = [number, number, number, number];

export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type HSLAColor = {
  h: number;
  s: number;
  l: number;
  a: number;
};

export type UncontrolledColorEditorProps = {
  initialValue: string | number;
  onChange: (value: string | number) => void;
};

export const colorValueToCssExpression = (value: string | number) =>
  typeof value === 'number'
    ? `color-mix(in srgb, transparent, var(--ag-foreground-color) ${clamp(value, 0, 1)})`
    : value;

let colorEl: HTMLElement | undefined;
export const reinterpretCssColorExpression = (value: string | number): RGBAColor | null => {
  if (!colorEl) {
    document.body.appendChild((colorEl = document.createElement('span')));
  }
  // We get the browser to do the heavy lifting by using the provided expression
  // in a color-mix(in srgb) and reading back the computed srgb colour. This allows
  // users to specify colours using color functions and variables.
  const css = colorValueToCssExpression(value);
  colorEl.style.backgroundColor = '';
  colorEl.style.backgroundColor = `color-mix(in srgb, transparent, ${css} 100%)`;
  if (!colorEl.style.backgroundColor) return null;
  const srgbColor = getComputedStyle(colorEl).backgroundColor;
  const parsed = parseRgbCssColor(srgbColor);
  if (parsed) return parsed;
  logErrorMessageOnce(
    `The color ${JSON.stringify(
      value,
    )} looks like a valid value but converts to "${srgbColor}" which isn't a 3-4 part srgb color as expected`,
  );
  return null;
};

export const parseRgbCssColor = (css: string): RGBAColor | null => {
  const numbers = Array.from(css.matchAll(/[\d.%-]+/g)).map(([m]) =>
    m.endsWith('%') ? parseFloat(m) / 100 : parseFloat(m),
  );
  if (numbers.find(isNaN)) return null;
  if (/^color\(srgb/i.test(css)) {
    const [r, g, b, a = 1] = numbers;
    return { r, g, b, a };
  }
  if (/^rgba?\(/i.test(css)) {
    const [r, g, b, a = 1] = numbers;
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }
  return null;
};

export const rgbaToHex = ({ r, g, b, a }: RGBAColor) => {
  let hex = '#' + proportionToHex2(r) + proportionToHex2(g) + proportionToHex2(b);
  if (a < 1) {
    hex += proportionToHex2(a);
  }
  return hex;
};

const proportionToHex2 = (f: number) => numberToHex2(Math.floor(f * 256));

export const numberToHex2 = (n: number) =>
  Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

export const rgbaToHsla = ({ r, g, b, a }: RGBAColor): HSLAColor => {
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let chroma = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (chroma !== 0) {
    s = chroma / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        var segment = (g - b) / chroma;
        var shift = 0 / 60;
        if (segment < 0) {
          shift = 360 / 60;
        }
        h = segment + shift;
        break;
      case g:
        var segment = (b - r) / chroma;
        var shift = 120 / 60;
        h = segment + shift;
        break;
      case b:
        var segment = (r - g) / chroma;
        var shift = 240 / 60;
        h = segment + shift;
        break;
    }
  }
  h /= 6;
  return { h, s, l, a };
};
