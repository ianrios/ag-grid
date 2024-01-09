import { FromJsonParams, fromJson } from 'design-system/parts/from-json';
import { bordersPart } from 'features/parts/borders/borders-part';
import { colorsPart } from 'features/parts/colors/colors-part';
import { getParamsForValue } from 'features/parts/parts-types';
import { quartzIconsPart } from 'features/parts/quartz-icons/quartz-icons-part';
import { atom } from 'jotai';

export const renderedThemeAtom = atom((get) => {
  const params: Required<FromJsonParams> = {
    colors: getParamsForValue(colorsPart, get(colorsPart.valueAtom)),
    borders: getParamsForValue(bordersPart, get(bordersPart.valueAtom)),
    quartzIcons: getParamsForValue(quartzIconsPart, get(quartzIconsPart.valueAtom)),
  };
  return fromJson(params);
});
