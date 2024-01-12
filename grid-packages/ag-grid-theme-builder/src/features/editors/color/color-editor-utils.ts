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
  onChange: (value: string) => void;
};

export const colorValueToCssExpression = (value: string | number) =>
  typeof value === 'number'
    ? `color-mix(in srgb, transparent, var(--ag-foreground-color) ${clamp(value, 0, 1)})`
    : value;

let colorEl: HTMLElement | undefined;
export const parseCssColor = (
  value: string | number,
  method: 'rgb' | 'hsl',
): FourChannelColor | null => {
  if (!colorEl) {
    document.body.appendChild((colorEl = document.createElement('span')));
  }
  // We get the browser to do the heavy lifting by using the provided expression
  // in a color-mix(srgb) and reading back the evaluated srgb colour. This
  // allows users to specify colours in any colour space
  const css = colorValueToCssExpression(value);
  const space = method == 'rgb' ? 'srgb' : method;
  colorEl.style.backgroundColor = '';
  colorEl.style.backgroundColor = `color-mix(in ${space}, transparent, ${css} 100%)`;
  if (!colorEl.style.backgroundColor) return null;
  const srgbColor = getComputedStyle(colorEl).backgroundColor;
  const match = srgbColor.match(
    /^color\((srgb|hsl) ([\d.]+)[,/ ]*([\d.]+)[,/ ]*([\d.]+)(?:[,/ ]*([\d.]+))?\)$/,
  );
  if (match) {
    const p1 = parseFloat(match[1]);
    const p2 = parseFloat(match[2]);
    const p3 = parseFloat(match[3]);
    const a = parseFloat(match[4] || '1');
    if (!isNaN(p1) && !isNaN(p2) && !isNaN(p3) && !isNaN(a)) {
      return [p1, p2, p3, a];
    }
  }
  debugger;
  logErrorMessageOnce(
    `The color ${JSON.stringify(
      value,
    )} looks like a valid value but converts to "${srgbColor}" which isn't a 3-4 part srgb color as expected`,
  );
  return null;
};

export const parseCssColorAsRGBA = (value: string | number): RGBAColor | null => {
  const channels = parseCssColor(value, 'rgb');
  if (!channels) return null;
  const [r, g, b, a] = channels;
  return { r, g, b, a };
};

export const parseCssColorAsHSLA = (value: string | number): HSLAColor | null => {
  const channels = parseCssColor(value, 'hsl');
  if (!channels) return null;
  const [h, s, l, a] = channels;
  return { h, s, l, a };
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
