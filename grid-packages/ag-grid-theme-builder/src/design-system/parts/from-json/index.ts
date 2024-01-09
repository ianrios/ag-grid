import { ThemePart } from 'design-system/design-system-types';
import { combineThemeParts } from 'design-system/design-system-utils';
import { PartParamsByName } from 'features/parts/all-parts';
import { borders, colors, quartzIcons } from '..';

export type FromJsonParams = Partial<PartParamsByName>;

/**
 * fromJson is a theme part that accepts a JSON export from the AG Grid theme
 * builder. It takes an object of theme part name to part arguments, so for
 * example `borders({betweenRows: false})` can be expressed as
 * `fromJson({borders: {betweenRows: false}})`.
 *
 * Using fromJson will include the code for every available theme part in
 * your application bundle, so if you are writing the code yourself it is
 * preferable to import and call just the part that you use.
 */
export const fromJson = (params: FromJsonParams = {}): ThemePart =>
  combineThemeParts([
    delegate(params.colors, colors),
    delegate(params.borders, borders),
    delegate(params.quartzIcons, quartzIcons),
  ]);

const delegate = <T>(
  params: boolean | T | undefined | null,
  part: (params?: T) => ThemePart,
): ThemePart | null => {
  if (params == null || params === false) return null;
  if (params === true) return part();
  const result = part(params);
  return { ...result, css: `\n/* START OF PART ${part.name} */\n` + result.css };
};
