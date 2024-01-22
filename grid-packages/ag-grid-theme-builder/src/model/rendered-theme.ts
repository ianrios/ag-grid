import { FromJsonParams, fromJson } from 'design-system/parts/from-json';
import { installTheme } from 'design-system/theme';
import { RGBAColor } from 'features/editors/color/RGBAColor';
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
  const rendered = fromJson(params);

  // TODO is this only called when the theme changes? Do we need to dedupe?
  installTheme('custom', [rendered]);
  document.body.className = 'ag-theme-custom';

  const rgba = RGBAColor.reinterpretCss(rendered.variables['--ag-background-color']);

  return {
    ...rendered,
    isDark: rgba ? rgba.grayscale() < 0.5 : true,
  };
});
