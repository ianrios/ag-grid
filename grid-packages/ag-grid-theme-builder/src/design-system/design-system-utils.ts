import { ThemePart } from './design-system-types';

export const applyDefaults = <T extends object>(record: T, defaults: Required<T>): Required<T> => {
  const result = { ...defaults };
  for (const [key, value] of recordEntries(record)) {
    if (key in record) {
      result[key] = value;
    }
  }
  return result;
};

export const combineThemeParts = (
  parts: ReadonlyArray<ThemePart | null | undefined>,
): ThemePart => {
  const result: ThemePart = {
    css: '',
    variables: {},
  };
  for (const part of parts) {
    if (part) {
      result.css = result.css ? result.css + '\n' + part.css : part.css;
      Object.assign(result.variables, part.variables);
    }
  }
  return result;
};

/**
 * Version of Object.entries typed to allow easy iteration over objects. Callers
 * must promise that objects passed do not have any additional keys over those
 * included in the type
 */
export const recordEntries = <K extends string | number | symbol, V>(
  record: Record<K, V>,
): [K, V][] => Object.entries(record) as [K, V][];

export const colorParamToCss = (value: string | number) => {
  if (typeof value === 'string') return value;
  const percent = Math.round(value * 1000) / 10;
  return `color-mix(in srgb, transparent, var(--ag-foreground-color) ${percent}%)`;
};

export const kebabCase = (str: string) =>
  str.replace(/(?<![a-z])[A-Z]/g, (m) => `-${m}`).toLowerCase();
