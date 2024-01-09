import { fromJson } from 'design-system/styles/from-json';
import { bordersScheme } from 'features/schemes/borders/borders-scheme';
import { lucideIconsScheme } from 'features/schemes/lucide-icons/lucide-icons-scheme';
import { getParamsForValue } from 'features/schemes/schemes-types';
import { atom } from 'jotai';

export type RenderedTheme = {
  name: string;
  css: string;
};

export const renderedThemeAtom = atom((get) =>
  fromJson({
    borders: getParamsForValue(bordersScheme, get(bordersScheme.valueAtom)),
    lucideIcons: getParamsForValue(lucideIconsScheme, get(lucideIconsScheme.valueAtom)),
  }),
);
