import { fromJson } from 'design-system/parts/from-json';
import { bordersScheme } from 'features/schemes/borders/borders-scheme';
import { quartzIconsScheme } from 'features/schemes/quartz-icons/quartz-icons-scheme';
import { getParamsForValue } from 'features/schemes/schemes-types';
import { atom } from 'jotai';

export const renderedThemeAtom = atom((get) =>
  fromJson({
    borders: getParamsForValue(bordersScheme, get(bordersScheme.valueAtom)),
    quartzIcons: getParamsForValue(quartzIconsScheme, get(quartzIconsScheme.valueAtom)),
  }),
);
