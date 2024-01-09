import { bordersPart } from './borders/borders-part';
import { colorsPart } from './colors/colors-part';
import { Part } from './parts-types';
import { quartzIconsPart } from './quartz-icons/quartz-icons-part';

// compute a mapped type of part name to params type
export type PartParamsByName = {
  [K in keyof typeof partsByName]: (typeof partsByName)[K] extends Part<infer P>
    ? P | boolean | null
    : never;
};

const partsByName = {
  colors: colorsPart,
  quartzIcons: quartzIconsPart,
  borders: bordersPart,
};

export const allParts = (): Part<any>[] => Object.values(partsByName);
