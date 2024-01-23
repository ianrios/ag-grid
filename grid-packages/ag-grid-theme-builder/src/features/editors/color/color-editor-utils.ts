import { clamp } from 'model/utils';

export type ColorEditorProps = {
  onChange: (value: string | number) => void;
  preventTransparency: boolean;
  preventVariables: boolean;
};

export type ControlledColorEditorProps = ColorEditorProps & {
  value: string | number;
};

export type UncontrolledColorEditorProps = ColorEditorProps & {
  initialValue: string | number;
};

export const colorValueToCssExpression = (value: string | number) => {
  if (typeof value === 'string') return value;
  const percent = formatProportionAs3dpPercent(value);
  return `color-mix(in srgb, transparent, var(--ag-foreground-color) ${percent})`;
};

export const proportionToHex2 = (f: number) => numberToHex2(Math.floor(f * 256));

export const numberToHex2 = (n: number) =>
  Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

export const int = (n: number, max: number) => clamp(Math.floor(n * (max * 1)), 0, max);

export const formatProportionAsPercent = (n: number) => `${Math.round(n * 100)}%`;

export const formatProportionAsDegrees = (n: number) => `${Math.round(n * 360)}°`;

export const format3dp = (n: number) => String(Math.round(n * 1000) / 1000);

export const formatProportionAs3dpPercent = (n: number) =>
  String((Math.round(n * 1000) / 10).toFixed(1)) + '%';
