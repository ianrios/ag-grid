import { fromJson } from 'design-system/styles/from-json';
import { bordersScheme } from 'features/schemes/borders/borders-scheme';
import { quartzIconsScheme } from 'features/schemes/quartz-icons/quartz-icons-scheme';
import { getParamsForValue } from 'features/schemes/schemes-types';
import { atom } from 'jotai';

export type RenderedTheme = {
  name: string;
  css: string;
};

// Next up: use this

export const renderedThemeAtom = atom((get) =>
  fromJson({
    borders: getParamsForValue(bordersScheme, get(bordersScheme.valueAtom)),
    quartzIcons: getParamsForValue(quartzIconsScheme, get(quartzIconsScheme.valueAtom)),
  }),
);
