import { FromJsonParams, fromJson } from 'design-system/parts/from-json';
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

  // TODO this atom should install the theme and set the theme class on the
  // document body, at which point we can remove the reinterpretation element
  // and reinterpretCssWithoutVariables (use reinterpretCss instead)
  const rgba = RGBAColor.reinterpretCssWithoutVariables(
    rendered.variables['--ag-background-color'],
  );
  document.body.className = 'ag-theme-custom';

  return {
    ...rendered,
    isDark: rgba ? rgba.grayscale() < 0.5 : true,
  };
});
