import { FromJsonParams, fromJson } from 'design-system/parts/from-json';
import { bordersScheme } from 'features/schemes/borders/borders-scheme';
import { colorsScheme } from 'features/schemes/colors/colors-scheme';
import { quartzIconsScheme } from 'features/schemes/quartz-icons/quartz-icons-scheme';
import { getParamsForValue } from 'features/schemes/schemes-types';
import { atom } from 'jotai';

export const renderedThemeAtom = atom((get) => {
  const params: Required<FromJsonParams> = {
    colors: getParamsForValue(colorsScheme, get(colorsScheme.valueAtom)),
    borders: getParamsForValue(bordersScheme, get(bordersScheme.valueAtom)),
    quartzIcons: getParamsForValue(quartzIconsScheme, get(quartzIconsScheme.valueAtom)),
  };
  return fromJson(params);
});
