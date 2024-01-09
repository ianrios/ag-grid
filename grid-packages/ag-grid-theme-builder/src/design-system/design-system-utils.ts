import { ThemePart } from './design-system-types';

export const applyDefaults = <T extends object>(record: T, defaults: Required<T>): Required<T> => {
  const result = { ...defaults };
  for (const key of Object.keys(record)) {
    if (key in record) {
      result[key as keyof T] = record[key as keyof T];
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
