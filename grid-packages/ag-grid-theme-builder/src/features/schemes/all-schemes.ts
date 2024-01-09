import { bordersScheme } from './borders/borders-scheme';
import { colorsScheme } from './colors/colors-scheme';
import { quartzIconsScheme } from './quartz-icons/quartz-icons-scheme';
import { Scheme } from './schemes-types';

// compute a mapped type of scheme name to params type
export type SchemeParamsByName = {
  [K in keyof typeof schemesByName]: (typeof schemesByName)[K] extends Scheme<infer P>
    ? P | boolean | null
    : never;
};

const schemesByName = {
  colors: colorsScheme,
  quartzIcons: quartzIconsScheme,
  borders: bordersScheme,
};

export const allSchemes = (): Scheme<any>[] => Object.values(schemesByName);
